// cutscenes/NormalScene.js
import { Timeline } from '../engine/core/Timeline.js';
import { ParticleBurst } from '../effects/ParticleBurst.js';
import { ScreenFlash } from '../effects/ScreenFlash.js';
import { GlowOverlay } from '../effects/GlowOverlay.js';
import { RevealText } from '../effects/RevealText.js';

export class NormalScene {
  constructor(engine, rarity) {
    this.engine = engine;
    this.rarity = rarity;
    this.tl = new Timeline();
    this.stopped = false;
  }

  play() {
    return new Promise((resolve) => {
      if (this.stopped) return resolve();

      const { color, glowColor, particleColor, label } = this.rarity;

      this.tl
        .at(0, () => {
          this.engine.addEffect(new ScreenFlash({
            color, duration: 300, maxAlpha: 0.5,
          }));
        })
        .at(100, () => {
          this.engine.addEffect(new GlowOverlay({
            color: glowColor, duration: 1800, maxAlpha: 0.3, fadeIn: 0.2, fadeOut: 0.5,
          }));
          this.engine.addEffect(new ParticleBurst(0.5, 0.5, {
            count: 35, color: particleColor, minSpeed: 80, maxSpeed: 200,
            minSize: 2, maxSize: 5, gravity: 150, trail: true,
            duration: 1500,
          }));
        })
        .at(300, () => {
          this.engine.addEffect(new RevealText({
            text: label.toUpperCase(),
            color,
            glowColor,
            shadow: true,
            duration: 1600,
            font: 'bold 56px Cinzel, serif',
            y: 0.45,
          }));
        })
        .at(2000, resolve)
        .play();
    });
  }

  stop() {
    this.stopped = true;
    this.tl.stop();
  }
}
