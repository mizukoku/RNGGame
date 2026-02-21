// engine/core/EffectBase.js

export class EffectBase {
  constructor(config = {}) {
    this.dead = false;
    this.elapsed = 0;
    this.duration = config.duration ?? Infinity;
    this.alpha = 1;
  }

  get progress() {
    return this.duration === Infinity ? 0 : Math.min(this.elapsed / this.duration, 1);
  }

  update(dt, w, h) {
    this.elapsed += dt * 1000;
    if (this.duration !== Infinity && this.elapsed >= this.duration) {
      this.dead = true;
    }
    this.onUpdate(dt, w, h);
  }

  onUpdate(dt, w, h) {}

  draw(ctx, w, h) {
    if (this.dead) return;
    this.onDraw(ctx, w, h);
  }

  onDraw(ctx, w, h) {}

  kill() {
    this.dead = true;
  }
}
