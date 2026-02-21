// effects/ParticleBurst.js
import { EffectBase } from '../engine/core/EffectBase.js';
import { MathUtil } from '../engine/utils/MathUtil.js';
import { Easing } from '../engine/utils/Easing.js';

class Particle {
  constructor(x, y, color, config = {}) {
    this.x = x;
    this.y = y;
    this.color = color;
    const speed = MathUtil.rand(config.minSpeed ?? 60, config.maxSpeed ?? 250);
    const angle = config.angle ?? Math.random() * Math.PI * 2;
    const spread = config.spread ?? Math.PI * 2;
    const finalAngle = angle + MathUtil.rand(-spread / 2, spread / 2);
    this.vx = Math.cos(finalAngle) * speed;
    this.vy = Math.sin(finalAngle) * speed;
    this.vy -= config.upBias ?? 0;
    this.gravity = config.gravity ?? 120;
    this.life = 1;
    this.decay = MathUtil.rand(0.6, 1.4);
    this.size = MathUtil.rand(config.minSize ?? 2, config.maxSize ?? 6);
    this.trail = config.trail ?? false;
    this.trailPoints = [];
    this.type = config.type ?? 'circle'; // circle | star | spark
    this.rotation = Math.random() * Math.PI * 2;
    this.rotSpeed = MathUtil.rand(-5, 5);
    this.glow = config.glow ?? false;
  }

  update(dt) {
    if (this.trail) {
      this.trailPoints.push({ x: this.x, y: this.y });
      if (this.trailPoints.length > 8) this.trailPoints.shift();
    }
    this.vx *= 0.98;
    this.vy += this.gravity * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.life -= this.decay * dt;
    this.rotation += this.rotSpeed * dt;
  }

  get dead() { return this.life <= 0; }

  draw(ctx) {
    if (this.life <= 0) return;
    const alpha = Easing.easeOut(this.life);
    ctx.save();

    if (this.trail && this.trailPoints.length > 1) {
      ctx.beginPath();
      ctx.moveTo(this.trailPoints[0].x, this.trailPoints[0].y);
      for (let i = 1; i < this.trailPoints.length; i++) {
        ctx.lineTo(this.trailPoints[i].x, this.trailPoints[i].y);
      }
      ctx.strokeStyle = this.color.replace(')', `, ${alpha * 0.3})`).replace('rgb', 'rgba');
      ctx.lineWidth = this.size * 0.5;
      ctx.stroke();
    }

    if (this.glow) {
      ctx.shadowBlur = 12;
      ctx.shadowColor = this.color;
    }

    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    if (this.type === 'star') {
      this._drawStar(ctx, this.size);
    } else if (this.type === 'spark') {
      ctx.fillRect(-this.size * 2, -this.size * 0.3, this.size * 4, this.size * 0.6);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, this.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  _drawStar(ctx, r) {
    const spikes = 4, inner = r * 0.4;
    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const a = (i * Math.PI) / spikes;
      const rad = i % 2 === 0 ? r : inner;
      i === 0 ? ctx.moveTo(Math.cos(a) * rad, Math.sin(a) * rad)
               : ctx.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
    }
    ctx.closePath();
    ctx.fill();
  }
}

export class ParticleBurst extends EffectBase {
  constructor(x, y, config = {}) {
    super({ duration: (config.duration ?? 2500) });
    this.ox = x; // origin x (0-1 normalized or px)
    this.oy = y;
    this.config = config;
    this.particles = [];
    this.spawned = false;
  }

  onUpdate(dt, w, h) {
    const px = this.ox <= 1 ? this.ox * w : this.ox;
    const py = this.oy <= 1 ? this.oy * h : this.oy;

    if (!this.spawned) {
      this.spawned = true;
      const count = this.config.count ?? 40;
      const color = this.config.color ?? '#ffffff';
      for (let i = 0; i < count; i++) {
        this.particles.push(new Particle(px, py, color, this.config));
      }
    }

    this.particles = this.particles.filter(p => {
      p.update(dt);
      return !p.dead;
    });
  }

  onDraw(ctx) {
    this.particles.forEach(p => p.draw(ctx));
  }
}

export class ContinuousParticles extends EffectBase {
  constructor(config = {}) {
    super({ duration: config.duration ?? 3000 });
    this.config = config;
    this.particles = [];
    this.spawnTimer = 0;
    this.spawnRate = config.spawnRate ?? 0.03; // seconds between spawns
  }

  onUpdate(dt, w, h) {
    this.spawnTimer += dt;
    while (this.spawnTimer >= this.spawnRate) {
      this.spawnTimer -= this.spawnRate;
      const ox = this.config.ox ?? 0.5;
      const oy = this.config.oy ?? 0.5;
      const px = typeof ox === 'function' ? ox(w) : (ox <= 1 ? ox * w : ox);
      const py = typeof oy === 'function' ? oy(h) : (oy <= 1 ? oy * h : oy);
      this.particles.push(new Particle(px, py, this.config.color ?? '#fff', this.config));
    }
    this.particles = this.particles.filter(p => { p.update(dt); return !p.dead; });
  }

  onDraw(ctx) {
    this.particles.forEach(p => p.draw(ctx));
  }
}
