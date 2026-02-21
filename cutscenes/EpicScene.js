// cutscenes/EpicScene.js
import { Timeline } from '../engine/core/Timeline.js';
import { ParticleBurst, ContinuousParticles } from '../effects/ParticleBurst.js';
import { ScreenFlash, ColorWash } from '../effects/ScreenFlash.js';
import { ScreenShake } from '../effects/ScreenShake.js';
import { GlowOverlay, RayBurst } from '../effects/GlowOverlay.js';
import { RevealText } from '../effects/RevealText.js';

export class EpicScene {
  constructor(engine, rarity) {
    this.engine = engine;
    this.rarity = rarity;
    this.tl = new Timeline();
    this.stopped = false;
  }

  play() {
    return new Promise((resolve) => {
      if (this.stopped) return resolve();
      const { color, glowColor, particleColor, label, bgColor } = this.rarity;

      this.tl
        // Build-up pulses
        .at(0, () => {
          this.engine.addEffect(new ScreenFlash({ color, duration: 150, maxAlpha: 0.25 }));
        })
        .at(200, () => {
          this.engine.addEffect(new ScreenFlash({ color, duration: 150, maxAlpha: 0.35 }));
          this.engine.addEffect(new ScreenShake(this.engine, { magnitude: 5, duration: 150 }));
        })
        .at(420, () => {
          this.engine.addEffect(new ScreenFlash({ color, duration: 150, maxAlpha: 0.5 }));
          this.engine.addEffect(new ScreenShake(this.engine, { magnitude: 8, duration: 150 }));
        })
        // Main detonation
        .at(650, () => {
          this.engine.addEffect(new ScreenFlash({ color: '#ffffff', duration: 600, maxAlpha: 0.95, blendMode: 'screen' }));
          this.engine.addEffect(new ScreenShake(this.engine, { magnitude: 20, duration: 800 }));
        })
        .at(680, () => {
          // Rays
          this.engine.addEffect(new RayBurst({
            color: particleColor, duration: 2500, maxAlpha: 0.2, rayCount: 16, rotSpeed: 0.5,
          }));
          // Glow
          this.engine.addEffect(new GlowOverlay({
            color: glowColor, duration: 3500, maxAlpha: 0.6, fadeIn: 0.1, fadeOut: 0.35, pulseSpeed: 2,
          }));
          // Main burst
          this.engine.addEffect(new ParticleBurst(0.5, 0.5, {
            count: 100, color: particleColor, minSpeed: 200, maxSpeed: 500,
            minSize: 2, maxSize: 8, gravity: 80, trail: true, glow: true,
            duration: 2500, type: 'star',
          }));
        })
        .at(800, () => {
          // Secondary burst at slight delay
          this.engine.addEffect(new ParticleBurst(0.5, 0.5, {
            count: 60, color: color, minSpeed: 100, maxSpeed: 300,
            minSize: 3, maxSize: 9, gravity: 60, trail: true, glow: true,
            duration: 2800, type: 'circle',
          }));
          // Continuous emitter
          this.engine.addEffect(new ContinuousParticles({
            ox: 0.5, oy: 0.9, color: particleColor,
            minSpeed: 80, maxSpeed: 200, gravity: -60, upBias: 100,
            spread: 1.2, angle: -Math.PI / 2, minSize: 2, maxSize: 5,
            trail: true, glow: true, spawnRate: 0.04, duration: 3000,
          }));
        })
        // Text reveal
        .at(1100, () => {
          this.engine.addEffect(new RevealText({
            text: 'E P I C',
            subtext: label,
            color,
            glowColor,
            shadow: true,
            duration: 3200,
            font: 'bold 80px Cinzel, serif',
            subFont: '30px Rajdhani, sans-serif',
            y: 0.45,
          }));
        })
        .at(4200, resolve)
        .play();
    });
  }

  stop() {
    this.stopped = true;
    this.tl.stop();
  }
}
