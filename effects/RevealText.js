// effects/RevealText.js
import { EffectBase } from '../engine/core/EffectBase.js';
import { Easing } from '../engine/utils/Easing.js';

export class RevealText extends EffectBase {
  constructor(config = {}) {
    super({ duration: config.duration ?? 2500 });
    this.text = config.text ?? '';
    this.subtext = config.subtext ?? '';
    this.color = config.color ?? '#ffffff';
    this.subColor = config.subColor ?? 'rgba(255,255,255,0.7)';
    this.font = config.font ?? 'bold 64px Cinzel, serif';
    this.subFont = config.subFont ?? '28px Rajdhani, sans-serif';
    this.glowColor = config.glowColor ?? config.color ?? '#ffffff';
    this.shadow = config.shadow ?? '';
    this.x = config.x ?? 0.5;
    this.y = config.y ?? 0.5;
    this.persistent = config.persistent ?? false;
  }

  onDraw(ctx, w, h) {
    const t = this.progress;
    let alpha, scale, blur;

    if (t < 0.15) {
      // Slam in
      const p = t / 0.15;
      alpha = p;
      scale = 1.4 - 0.4 * Easing.easeOutBack(p);
      blur = (1 - p) * 20;
    } else if (t < 0.75) {
      alpha = 1;
      scale = 1;
      blur = 0;
    } else if (!this.persistent) {
      // Fade out
      const p = (t - 0.75) / 0.25;
      alpha = 1 - p;
      scale = 1;
      blur = 0;
    } else {
      alpha = 1;
      scale = 1;
      blur = 0;
    }

    const px = this.x <= 1 ? this.x * w : this.x;
    const py = this.y <= 1 ? this.y * h : this.y;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(px, py);
    ctx.scale(scale, scale);

    if (blur > 0) ctx.filter = `blur(${blur}px)`;

    // Main text
    ctx.font = this.font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (this.shadow) {
      ctx.shadowColor = this.glowColor;
      ctx.shadowBlur = 30 + 20 * Math.sin(this.elapsed * 0.003);
    }

    // Stroke outline
    ctx.strokeStyle = 'rgba(0,0,0,0.8)';
    ctx.lineWidth = 6;
    ctx.strokeText(this.text, 0, 0);

    ctx.fillStyle = this.color;
    ctx.fillText(this.text, 0, 0);

    // Subtext
    if (this.subtext) {
      ctx.shadowBlur = 10;
      ctx.font = this.subFont;
      ctx.fillStyle = this.subColor;
      ctx.strokeStyle = 'rgba(0,0,0,0.6)';
      ctx.lineWidth = 3;
      ctx.strokeText(this.subtext, 0, 55);
      ctx.fillText(this.subtext, 0, 55);
    }

    ctx.restore();
  }
}
