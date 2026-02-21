// engine/core/RenderEngine.js
import { ENGINE_CONFIG } from '../../config/EngineConfig.js';

export class RenderEngine {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.width = 0;
    this.height = 0;
    this.effects = [];
    this.running = false;
    this._raf = null;
    this._lastTime = 0;
    this.shakeX = 0;
    this.shakeY = 0;
    this.shakeMagnitude = 0;
  }

  init() {
    this.canvas = document.getElementById(ENGINE_CONFIG.canvas.id);
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.id = ENGINE_CONFIG.canvas.id;
      this.canvas.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        pointer-events: none; z-index: ${ENGINE_CONFIG.canvas.zIndex};
      `;
      document.body.appendChild(this.canvas);
    }
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.start();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  start() {
    this.running = true;
    const loop = (time) => {
      if (!this.running) return;
      const dt = Math.min((time - this._lastTime) / 1000, 0.05);
      this._lastTime = time;
      this.render(dt);
      this._raf = requestAnimationFrame(loop);
    };
    this._raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    if (this._raf) cancelAnimationFrame(this._raf);
  }

  render(dt) {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // Apply screen shake
    if (this.shakeMagnitude > 0.1) {
      this.shakeX = (Math.random() - 0.5) * this.shakeMagnitude;
      this.shakeY = (Math.random() - 0.5) * this.shakeMagnitude;
      this.shakeMagnitude *= ENGINE_CONFIG.shake.decay;
      ctx.save();
      ctx.translate(this.shakeX, this.shakeY);
    } else {
      this.shakeMagnitude = 0;
    }

    // Update & draw all effects
    this.effects = this.effects.filter(effect => {
      if (effect.dead) return false;
      effect.update(dt, this.width, this.height);
      effect.draw(ctx, this.width, this.height);
      return !effect.dead;
    });

    if (this.shakeMagnitude > 0) ctx.restore();
  }

  addEffect(effect) {
    this.effects.push(effect);
    return effect;
  }

  removeEffect(effect) {
    effect.dead = true;
  }

  triggerShake(magnitude) {
    this.shakeMagnitude = Math.max(this.shakeMagnitude, magnitude);
  }

  clearAll() {
    this.effects.forEach(e => e.dead = true);
    this.effects = [];
    this.shakeMagnitude = 0;
  }
}
