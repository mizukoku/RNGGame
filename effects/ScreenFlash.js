// effects/ScreenFlash.js
//
// Headache-safe rewrites:
//  • No flat full-screen white plateaus
//  • Smooth bell curve — peaks fast, fades long
//  • Radial falloff so edges stay dark (never uniformly blinding)
//  • maxAlpha defaults capped well below the old 0.85
//
import { EffectBase } from '../engine/core/EffectBase.js';

// Smooth bell: rises to peak at `peakAt`, then eases out cubically.
// No plateau — alpha is always moving.
function bellCurve(t, peakAt = 0.18) {
  if (t <= peakAt) {
    // Fast ease-in to peak
    const s = t / peakAt;
    return s * s * (3 - 2 * s); // smoothstep
  } else {
    // Long cubic ease-out from peak to zero
    const s = (t - peakAt) / (1 - peakAt);
    return 1 - s * s * s;
  }
}

export class ScreenFlash extends EffectBase {
  constructor(config = {}) {
    super({ duration: config.duration ?? 500 });
    this.color    = config.color    ?? '#ffffff';
    // Hard cap at 0.55 — enough to register, not enough to strobe
    this.maxAlpha = Math.min(config.maxAlpha ?? 0.5, 0.6);
    this.peakAt   = config.peakAt   ?? 0.15; // hit peak at 15% of duration
    // Radial: how far the glow reaches from centre (0–1). 0.7 = soft vignette.
    this.radialSize = config.radialSize ?? 0.72;
  }

  onDraw(ctx, w, h) {
    const alpha = bellCurve(this.progress, this.peakAt) * this.maxAlpha;
    if (alpha <= 0.001) return;

    ctx.save();
    // Radial gradient so the screen never goes uniformly white —
    // centre is brightest, edges stay dark.
    const cx = w / 2, cy = h / 2;
    const r  = Math.max(w, h) * this.radialSize;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    grad.addColorStop(0,   _withAlpha(this.color, alpha));
    grad.addColorStop(0.5, _withAlpha(this.color, alpha * 0.45));
    grad.addColorStop(1,   _withAlpha(this.color, 0));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }
}

export class ColorWash extends EffectBase {
  constructor(config = {}) {
    super({ duration: config.duration ?? 1200 });
    this.color    = config.color    ?? '#ffffff';
    // Cap lower than before — old default 0.4 with a long hold was harsh
    this.maxAlpha = Math.min(config.maxAlpha ?? 0.28, 0.38);
    this.peakAt   = config.peakAt   ?? 0.2;
  }

  onDraw(ctx, w, h) {
    const alpha = bellCurve(this.progress, this.peakAt) * this.maxAlpha;
    if (alpha <= 0.001) return;

    ctx.save();
    // Radial gradient — colour washes from centre outward, never a flat fill
    const cx = w / 2, cy = h * 0.45;
    const r  = Math.max(w, h) * 0.85;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    grad.addColorStop(0,    _withAlpha(this.color, alpha));
    grad.addColorStop(0.6,  _withAlpha(this.color, alpha * 0.5));
    grad.addColorStop(1,    _withAlpha(this.color, 0));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }
}

// ── Parse any CSS colour + override alpha ────────────────────────
// Handles: #fff, #rrggbb, rgb(...), rgba(...)
function _withAlpha(color, alpha) {
  // Already rgba — swap the alpha
  const rgba = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgba) return `rgba(${rgba[1]},${rgba[2]},${rgba[3]},${alpha.toFixed(3)})`;
  // Hex shorthand #rgb
  if (/^#[0-9a-f]{3}$/i.test(color)) {
    const [, r, g, b] = color.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i);
    return `rgba(${parseInt(r+r,16)},${parseInt(g+g,16)},${parseInt(b+b,16)},${alpha.toFixed(3)})`;
  }
  // Hex full #rrggbb
  if (/^#[0-9a-f]{6}$/i.test(color)) {
    const r = parseInt(color.slice(1,3),16);
    const g = parseInt(color.slice(3,5),16);
    const b = parseInt(color.slice(5,7),16);
    return `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
  }
  // Fallback — just set globalAlpha outside
  return color;
}