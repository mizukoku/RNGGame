// cutscenes/LegendaryScene.js
import { Timeline } from '../engine/core/Timeline.js';
import { ParticleBurst, ContinuousParticles } from '../effects/ParticleBurst.js';
import { ScreenFlash, ColorWash } from '../effects/ScreenFlash.js';
import { ScreenShake } from '../effects/ScreenShake.js';
import { GlowOverlay, RayBurst } from '../effects/GlowOverlay.js';
import { RevealText } from '../effects/RevealText.js';

export class LegendaryScene {
  constructor(engine, rarity) {
    this.engine = engine;
    this.rarity = rarity;
    this.tl = new Timeline();
    this.stopped = false;
  }

  play() {
    return new Promise((resolve) => {
      if (this.stopped) return resolve();
      const { color, glowColor, particleColor, label, id } = this.rarity;
      const isMythic = id === 'MYTHIC';

      // Build-up: 4 escalating pulses
      const pulses = [0, 180, 380, 600, 860];
      pulses.forEach((t, i) => {
        this.tl.at(t, () => {
          const intensity = 0.15 + i * 0.18;
          this.engine.addEffect(new ScreenFlash({ color, duration: 120 + i * 30, maxAlpha: intensity }));
          if (i > 1) this.engine.addEffect(new ScreenShake(this.engine, { magnitude: 4 + i * 3, duration: 120 }));
        });
      });

      this.tl
        // Silence moment — brief pause for drama
        .at(980, () => {
          this.engine.addEffect(new ColorWash({ color: '#000000', duration: 400, maxAlpha: 0.8 }));
        })
        // DETONATION
        .at(1350, () => {
          this.engine.addEffect(new ScreenFlash({ color: '#ffffff', duration: 700, maxAlpha: 1.0, blendMode: 'screen' }));
          this.engine.addEffect(new ScreenShake(this.engine, { magnitude: 30, duration: 1000 }));
        })
        .at(1380, () => {
          // Massive ring burst
          for (let i = 0; i < 3; i++) {
            setTimeout(() => {
              this.engine.addEffect(new ParticleBurst(0.5, 0.5, {
                count: 80, color: particleColor, minSpeed: 300 + i * 100, maxSpeed: 600 + i * 150,
                minSize: 2, maxSize: 6, gravity: 50, trail: true, glow: true,
                duration: 3000, type: 'star', spread: Math.PI * 2,
              }));
            }, i * 120);
          }

          // God rays
          this.engine.addEffect(new RayBurst({
            color: particleColor, duration: 4000, maxAlpha: isMythic ? 0.4 : 0.25,
            rayCount: isMythic ? 24 : 18, rotSpeed: isMythic ? 1.2 : 0.7,
          }));

          // Intense glow
          this.engine.addEffect(new GlowOverlay({
            color: glowColor, duration: 5000, maxAlpha: isMythic ? 0.8 : 0.65,
            fadeIn: 0.08, fadeOut: 0.3, pulseSpeed: isMythic ? 3 : 1.5,
          }));
        })
        .at(1500, () => {
          // Continuous golden rain from top
          this.engine.addEffect(new ContinuousParticles({
            ox: (w) => Math.random() * w,
            oy: 0,
            color: particleColor,
            minSpeed: 50, maxSpeed: 150, gravity: 120, upBias: -50,
            spread: 0.5, angle: Math.PI / 2,
            minSize: 2, maxSize: 5, trail: false, glow: true,
            spawnRate: 0.02, duration: 4500,
          }));
          // Rising emitter from bottom
          this.engine.addEffect(new ContinuousParticles({
            ox: 0.5, oy: 1.0, color: color,
            minSpeed: 100, maxSpeed: 300, gravity: -80, upBias: 150,
            spread: 1.4, angle: -Math.PI / 2, minSize: 3, maxSize: 8,
            trail: true, glow: true, spawnRate: 0.03, duration: 4000, type: 'star',
          }));
        })
        // Text reveal
        .at(1900, () => {
          const titleText = isMythic ? 'M Y T H I C' : 'LEGENDARY';
          this.engine.addEffect(new RevealText({
            text: titleText,
            subtext: label,
            color,
            glowColor,
            shadow: true,
            duration: 4500,
            font: `bold ${isMythic ? 88 : 80}px Cinzel, serif`,
            subFont: '32px Rajdhani, sans-serif',
            y: 0.42,
          }));
        })
        .at(6200, resolve)
        .play();
    });
  }

  stop() {
    this.stopped = true;
    this.tl.stop();
  }
}
