// cutscenes/RareScene.js
import { Timeline } from '../engine/core/Timeline.js';
import { ParticleBurst, ContinuousParticles } from '../effects/ParticleBurst.js';
import { ScreenFlash } from '../effects/ScreenFlash.js';
import { ScreenShake } from '../effects/ScreenShake.js';
import { GlowOverlay } from '../effects/GlowOverlay.js';
import { RevealText } from '../effects/RevealText.js';

export class RareScene {
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
          // First flash — anticipation
          this.engine.addEffect(new ScreenFlash({ color, duration: 200, maxAlpha: 0.3 }));
        })
        .at(250, () => {
          this.engine.addEffect(new ScreenFlash({ color, duration: 200, maxAlpha: 0.4 }));
        })
        .at(550, () => {
          // Big flash + shake
          this.engine.addEffect(new ScreenFlash({ color, duration: 500, maxAlpha: 0.8, blendMode: 'screen' }));
          this.engine.addEffect(new ScreenShake(this.engine, { magnitude: 12, duration: 500 }));
        })
        .at(600, () => {
          // Particles
          this.engine.addEffect(new ParticleBurst(0.5, 0.5, {
            count: 60, color: particleColor, minSpeed: 150, maxSpeed: 350,
            minSize: 2, maxSize: 7, gravity: 100, trail: true, glow: true,
            duration: 2000, type: 'star',
          }));
          // Ambient glow
          this.engine.addEffect(new GlowOverlay({
            color: glowColor, duration: 2800, maxAlpha: 0.45, fadeIn: 0.15, fadeOut: 0.4,
          }));
        })
        .at(700, () => {
          // Rising particles
          this.engine.addEffect(new ContinuousParticles({
            ox: 0.5, oy: 0.8, color: particleColor,
            count: 1, minSpeed: 60, maxSpeed: 120, gravity: -40, upBias: 80,
            spread: 0.8, angle: -Math.PI / 2, minSize: 2, maxSize: 4,
            trail: true, glow: true, spawnRate: 0.05, duration: 2000,
          }));
        })
        .at(900, () => {
          this.engine.addEffect(new RevealText({
            text: 'R A R E',
            subtext: label,
            color,
            glowColor,
            shadow: true,
            duration: 2500,
            font: 'bold 72px Cinzel, serif',
            subFont: '26px Rajdhani, sans-serif',
            y: 0.45,
          }));
        })
        .at(3200, resolve)
        .play();
    });
  }

  stop() {
    this.stopped = true;
    this.tl.stop();
  }
}
