// effects/GlowOverlay.js
import { EffectBase } from '../engine/core/EffectBase.js';
import { Easing } from '../engine/utils/Easing.js';

export class GlowOverlay extends EffectBase {
  constructor(config = {}) {
    super({ duration: config.duration ?? 2000 });
    this.color = config.color ?? 'rgba(255,255,255,0.3)';
    this.maxAlpha = config.maxAlpha ?? 0.5;
    this.fadeIn = config.fadeIn ?? 0.3;   // 0-1 ratio
    this.fadeOut = config.fadeOut ?? 0.4; // 0-1 ratio
    this.radial = config.radial ?? true;
    this.pulseSpeed = config.pulseSpeed ?? 0;
  }

  onDraw(ctx, w, h) {
    const t = this.progress;
    let alpha;
    if (t < this.fadeIn) {
      alpha = Easing.easeOut(t / this.fadeIn) * this.maxAlpha;
    } else if (t > 1 - this.fadeOut) {
      alpha = Easing.easeIn((1 - t) / this.fadeOut) * this.maxAlpha;
    } else {
      alpha = this.maxAlpha;
    }

    if (this.pulseSpeed > 0) {
      alpha *= 0.7 + 0.3 * Math.sin(this.elapsed * this.pulseSpeed * 0.01);
    }

    ctx.save();
    ctx.globalAlpha = alpha;

    if (this.radial) {
      const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.7);
      grad.addColorStop(0, this.color);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
    } else {
      ctx.fillStyle = this.color;
    }

    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }
}

export class RayBurst extends EffectBase {
  constructor(config = {}) {
    super({ duration: config.duration ?? 1500 });
    this.color = config.color ?? '#ffffff';
    this.rayCount = config.rayCount ?? 12;
    this.maxAlpha = config.maxAlpha ?? 0.25;
    this.rotation = 0;
    this.rotSpeed = config.rotSpeed ?? 0.3;
  }

  onUpdate(dt) {
    this.rotation += this.rotSpeed * dt;
  }

  onDraw(ctx, w, h) {
    const t = this.progress;
    let alpha;
    if (t < 0.2) alpha = (t / 0.2) * this.maxAlpha;
    else if (t > 0.7) alpha = ((1 - t) / 0.3) * this.maxAlpha;
    else alpha = this.maxAlpha;

    const cx = w / 2, cy = h / 2;
    const maxR = Math.max(w, h);

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.globalCompositeOperation = 'screen';

    for (let i = 0; i < this.rayCount; i++) {
      const a = (i / this.rayCount) * Math.PI * 2 + this.rotation;
      const spread = Math.PI / this.rayCount * 0.5;

      const grad = ctx.createConicalGradient
        ? null // not widely supported
        : null;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, maxR, a - spread, a + spread);
      ctx.closePath();

      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
      g.addColorStop(0, this.color);
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.fill();
    }

    ctx.restore();
  }
}
