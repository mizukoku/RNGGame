// effects/ScreenShake.js
import { EffectBase } from '../engine/core/EffectBase.js';

export class ScreenShake extends EffectBase {
  constructor(engine, config = {}) {
    super({ duration: config.duration ?? 600 });
    this.engine = engine;
    this.magnitude = config.magnitude ?? 15;
    this.triggered = false;
  }

  onUpdate(dt) {
    if (!this.triggered) {
      this.triggered = true;
      this.engine.shake(this.magnitude);
    }
    // Continuous shake during duration
    const remaining = 1 - this.progress;
    if (remaining > 0) {
      this.engine.renderEngine.shakeMagnitude = Math.max(
        this.engine.renderEngine.shakeMagnitude,
        this.magnitude * remaining * 0.3
      );
    }
  }

  onDraw() {} // no visual — handled by RenderEngine
}
