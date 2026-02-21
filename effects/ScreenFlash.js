// effects/ScreenFlash.js
import { EffectBase } from '../engine/core/EffectBase.js';
import { Easing } from '../engine/utils/Easing.js';

export class ScreenFlash extends EffectBase {
  constructor(config = {}) {
    super({ duration: config.duration ?? 400 });
    this.color = config.color ?? '#ffffff';
    this.maxAlpha = config.maxAlpha ?? 0.85;
    this.easing = config.easing ?? Easing.flash;
    this.blendMode = config.blendMode ?? 'screen';
  }

  onDraw(ctx, w, h) {
    const t = this.progress;
    const alpha = this.easing(t) * this.maxAlpha;
    ctx.save();
    ctx.globalCompositeOperation = this.blendMode;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }
}

export class ColorWash extends EffectBase {
  constructor(config = {}) {
    super({ duration: config.duration ?? 1200 });
    this.color = config.color ?? '#ffffff';
    this.maxAlpha = config.maxAlpha ?? 0.4;
  }

  onDraw(ctx, w, h) {
    const t = this.progress;
    // Fade in quickly, hold, fade out
    let alpha;
    if (t < 0.2) alpha = (t / 0.2) * this.maxAlpha;
    else if (t < 0.7) alpha = this.maxAlpha;
    else alpha = ((1 - t) / 0.3) * this.maxAlpha;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }
}
