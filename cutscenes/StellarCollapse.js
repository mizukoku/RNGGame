// cutscenes/StellarCollapse.js
// ═══════════════════════════════════════════════════════════════
//  STELLAR COLLAPSE  —  1 / 2,000
//  Hybrid: DOM/CSS animations + canvas particle engine
//
//  Phase 0  (0ms)    : Deep void opens — black pull
//  Phase 1  (200ms)  : Space rift cracks tear across screen
//  Phase 2  (500ms)  : Protostar ignites at centre
//  Phase 3  (700ms)  : Gravity collapse — matter spirals IN
//  Phase 4  (1000ms) : Neutron-star detonation — purple nova
//  Phase 5  (1300ms) : Shockwave cascade (4 rings)
//  Phase 6  (1600ms) : Debris nebula — glowing fragments drift out
//  Phase 7  (2000ms) : Canvas aura + text reveal
//  Phase 8  (7200ms) : Resolve
// ═══════════════════════════════════════════════════════════════

import { ParticleBurst, ContinuousParticles } from '../effects/ParticleBurst.js';
import { GlowOverlay, RayBurst }               from '../effects/GlowOverlay.js';
import { RevealText }                           from '../effects/RevealText.js';

// ── Inline CSS injected once ───────────────────────────────────
const CSS = `
/* ── Phase 0: Void background ── */
.sc-void {
  position:fixed;inset:0;
  background:radial-gradient(ellipse at 50% 50%,#0a0010 0%,#000000 60%,#030006 100%);
  z-index:9990;pointer-events:none;
  animation:scVoidFade 2.5s ease forwards;
}
@keyframes scVoidFade {
  0%{opacity:1} 85%{opacity:1} 100%{opacity:0}
}
.sc-void::after {
  content:"";position:absolute;inset:0;
  background:radial-gradient(ellipse at 50% 50%,rgba(80,0,120,.4) 0%,transparent 60%);
  animation:scVoidBreath .8s ease-in-out infinite alternate;
}
@keyframes scVoidBreath {
  from{transform:scale(1);opacity:.6}
  to  {transform:scale(1.12);opacity:1}
}

/* ── Phase 1: Rift cracks ── */
.sc-rift {
  position:fixed;pointer-events:none;z-index:9992;
  height:2px;border-radius:1px;
  background:linear-gradient(90deg,
    transparent 0%,
    rgba(180,80,255,.6) 20%,
    rgba(255,255,255,.95) 50%,
    rgba(180,80,255,.6) 80%,
    transparent 100%);
  box-shadow:0 0 6px 2px rgba(200,100,255,.7),0 0 16px 4px rgba(140,0,255,.4);
  animation:scRiftAppear .6s ease forwards;
}
@keyframes scRiftAppear {
  0%  {transform:scaleX(0);opacity:0}
  30% {opacity:1}
  70% {opacity:1}
  100%{transform:scaleX(1);opacity:0}
}
.sc-rift::after {
  content:"";position:absolute;left:50%;top:50%;
  width:8px;height:8px;border-radius:50%;background:#fff;
  transform:translate(-50%,-50%);
  box-shadow:0 0 12px 4px rgba(255,160,255,.9);
}

/* ── Phase 2: Protostar ── */
.sc-proto {
  position:fixed;left:50%;top:50%;
  width:12px;height:12px;border-radius:50%;
  transform:translate(-50%,-50%);
  background:radial-gradient(circle,#fff 0%,#cc88ff 50%,transparent 100%);
  box-shadow:0 0 20px 8px rgba(200,80,255,.8),0 0 50px 16px rgba(120,0,220,.5);
  z-index:9995;pointer-events:none;
  animation:scProtoIgnite .6s ease forwards;
}
@keyframes scProtoIgnite {
  0%  {transform:translate(-50%,-50%) scale(0);opacity:0}
  50% {transform:translate(-50%,-50%) scale(4);opacity:1}
  100%{transform:translate(-50%,-50%) scale(2);opacity:1}
}
.sc-proto::before {
  content:"";position:absolute;inset:-6px;border-radius:50%;
  background:radial-gradient(circle,rgba(220,160,255,.8) 0%,transparent 70%);
  animation:scProtoShimmer .09s linear infinite alternate;
}
@keyframes scProtoShimmer {
  from{transform:scale(1);opacity:.8}
  to  {transform:scale(1.18);opacity:1}
}

/* ── Phase 3: Orbital matter spiraling in ── */
.sc-orbiter {
  position:fixed;left:50%;top:50%;
  pointer-events:none;z-index:9994;border-radius:50%;
  animation:scOrbiterSpiral ease-in forwards;
}
@keyframes scOrbiterSpiral {
  0%  {transform:translate(calc(-50% + var(--ox)),calc(-50% + var(--oy))) rotate(0deg) scale(1);opacity:1}
  100%{transform:translate(-50%,-50%) rotate(var(--spin)) scale(0);opacity:0}
}

/* ── Phase 3: Gravity lens ── */
.sc-lens {
  position:fixed;left:50%;top:50%;
  width:300px;height:300px;border-radius:50%;
  transform:translate(-50%,-50%);
  border:1.5px solid rgba(180,80,255,.35);
  box-shadow:0 0 30px rgba(140,0,255,.3),inset 0 0 30px rgba(140,0,255,.15);
  pointer-events:none;z-index:9993;
  animation:scLensExpand ease-in forwards;
}
@keyframes scLensExpand {
  0%  {transform:translate(-50%,-50%) scale(0);opacity:1}
  60% {transform:translate(-50%,-50%) scale(1);opacity:1}
  100%{transform:translate(-50%,-50%) scale(2.5);opacity:0}
}
.sc-lens::before {
  content:"";position:absolute;inset:30px;border-radius:50%;
  border:1px solid rgba(180,80,255,.25);
  animation:scLensInnerSpin 1.2s linear forwards;
}
@keyframes scLensInnerSpin {
  from{transform:rotate(0)} to{transform:rotate(-360deg)}
}
.sc-lens::after {
  content:"✦";position:absolute;left:50%;top:50%;
  transform:translate(-50%,-50%);
  font-size:48px;color:#cc88ff;
  text-shadow:0 0 16px #cc88ff,0 0 40px #8800cc;
  animation:scLensSymbol .5s ease-in-out infinite alternate;
}
@keyframes scLensSymbol {
  from{text-shadow:0 0 16px #cc88ff,0 0 40px #8800cc}
  to  {text-shadow:0 0 30px #fff,0 0 70px #dd00ff,0 0 100px #cc88ff}
}

/* ── Phase 4: Neutron nova ── */
.sc-nova {
  position:fixed;inset:0;pointer-events:none;z-index:10002;
  background:radial-gradient(circle at 50% 50%,
    #fff 0%,#dd88ff 18%,#8800cc 40%,rgba(60,0,100,.6) 65%,transparent 80%);
  animation:scNova .7s cubic-bezier(.2,.8,.1,1) forwards;
}
@keyframes scNova {
  0%  {transform:scale(0);opacity:0}
  15% {transform:scale(.4);opacity:1}
  55% {transform:scale(1);opacity:1}
  100%{transform:scale(1.6);opacity:0}
}

/* ── Phase 5: Shockwave rings ── */
.sc-ring {
  position:fixed;left:50%;top:50%;
  width:10px;height:10px;border-radius:50%;border:3px solid;
  transform:translate(-50%,-50%);
  pointer-events:none;z-index:10003;
  animation:scRingExpand ease-out forwards;
}
@keyframes scRingExpand {
  from{transform:translate(-50%,-50%) scale(.1);opacity:1}
  to  {transform:translate(-50%,-50%) scale(22);opacity:0}
}

/* ── Phase 6: Debris fragments ── */
.sc-fragment {
  position:fixed;left:50%;top:50%;
  pointer-events:none;z-index:10001;border-radius:50%;
  animation:scFragment ease-out forwards;
}
@keyframes scFragment {
  0%  {transform:translate(-50%,-50%) rotate(var(--fa)) translateX(0) scale(1.2);opacity:1}
  60% {opacity:1}
  100%{transform:translate(-50%,-50%) rotate(var(--fa)) translateX(var(--fd)) scale(.1);opacity:0}
}

/* ── Phase 6: Nebula wisps ── */
.sc-wisp {
  position:fixed;border-radius:50%;pointer-events:none;z-index:9998;
  background:radial-gradient(circle,rgba(160,60,255,.5) 0%,transparent 70%);
  animation:scWisp ease-out forwards;
}
@keyframes scWisp {
  0%  {transform:scale(0);opacity:.8}
  50% {transform:scale(1.5);opacity:.5}
  100%{transform:scale(3);opacity:0}
}

/* ── Phase 7: Stellar label ── */
.sc-label {
  position:fixed;left:50%;top:22%;
  transform:translateX(-50%);
  font-size:16px;letter-spacing:18px;font-weight:900;
  color:#cc88ff;
  text-shadow:0 0 16px #cc88ff,0 0 36px #8800cc;
  animation:scLabelReveal 2.2s ease forwards;
  pointer-events:none;z-index:10006;white-space:nowrap;
  font-family:'Cinzel','Georgia',serif;
}
@keyframes scLabelReveal {
  0%  {opacity:0;transform:translateX(-50%) translateY(16px) scale(.85)}
  15% {opacity:1;transform:translateX(-50%) translateY(0) scale(1)}
  80% {opacity:1}
  100%{opacity:0;transform:translateX(-50%) translateY(-8px) scale(1.04)}
}

/* ── Body shake ── */
@keyframes scBodyShake {
  0%,100%{transform:translate(0,0)}
  15%{transform:translate(-6px,4px)}  30%{transform:translate(6px,-5px)}
  45%{transform:translate(-5px,6px)}  60%{transform:translate(4px,-4px)}
  75%{transform:translate(-4px,3px)}  90%{transform:translate(3px,-3px)}
}
body.sc-shake { animation:scBodyShake .7s ease-out; }

@keyframes scBodyShakeHeavy {
  0%,100%{transform:translate(0,0)}
  10%{transform:translate(-10px,8px)}  25%{transform:translate(10px,-9px)}
  40%{transform:translate(-9px,10px)}  55%{transform:translate(8px,-8px)}
  70%{transform:translate(-7px,7px)}   85%{transform:translate(6px,-6px)}
}
body.sc-shake-heavy { animation:scBodyShakeHeavy .6s ease-out; }
`;

function injectCSS() {
  if (document.getElementById('sc-styles')) return;
  const s = document.createElement('style');
  s.id = 'sc-styles';
  s.textContent = CSS;
  document.head.appendChild(s);
}

// ── DOM helpers ───────────────────────────────────────────────
function mk(cls) {
  const el = document.createElement('div');
  el.className = cls;
  return el;
}

let _spawned = [];
function spawn(el) { _spawned.push(el); document.body.appendChild(el); return el; }
function killSpawned() { _spawned.forEach(e => e.remove()); _spawned = []; }

// ══════════════════════════════════════════════════════════════
export class StellarCollapse {
  constructor(engine, rarity) {
    this.engine  = engine;
    this.rarity  = rarity;
    this.stopped = false;
    this._timers = [];
    this._proto  = null;
    // Pull effect hints from rarity.effects with sensible defaults
    this.fx = {
      shakeIntensity: 30,
      particleCount:  120,
      rayCount:       22,
      ringCount:      4,
      glowMaxAlpha:   0.80,
      riftCount:      5,
      orbiterCount:   20,
      debrisCount:    80,
      wispCount:      8,
      trailEnabled:   true,
      titleText:      'S T E L L A R   C O L L A P S E',
      subtitleText:   '✦  1 / 2,000  ✦',
      ...(rarity.effects ?? {}),
    };
    injectCSS();
  }

  _after(ms, fn) {
    const id = setTimeout(() => { if (!this.stopped) fn(); }, ms);
    this._timers.push(id);
    return id;
  }

  play() {
    return new Promise(resolve => {
      _spawned = [];
      const { color, glowColor, particleColor } = this.rarity;
      const fx = this.fx;

      // ── Phase 0: Void ────────────────────────────────────────
      spawn(mk('sc-void'));

      // ── Phase 1: Rift cracks ─────────────────────────────────
      this._after(200, () => this._spawnRifts(fx.riftCount));

      // ── Phase 2: Protostar ignites ───────────────────────────
      this._after(500, () => {
        this._proto = spawn(mk('sc-proto'));
      });

      // ── Phase 3: Gravity collapse ────────────────────────────
      this._after(700, () => {
        this._spawnOrbiters(color, fx.orbiterCount);

        const lens = spawn(mk('sc-lens'));
        this._after(1000, () => lens.remove());

        document.body.classList.add('sc-shake');
        this._after(730, () => document.body.classList.remove('sc-shake'));

        this.engine.shake(fx.shakeIntensity * 0.45);
      });

      // ── Phase 4: Neutron nova detonation ─────────────────────
      this._after(1000, () => {
        if (this._proto) { this._proto.remove(); this._proto = null; }

        const nova = spawn(mk('sc-nova'));
        this._after(750, () => nova.remove());

        document.body.classList.add('sc-shake-heavy');
        this._after(640, () => document.body.classList.remove('sc-shake-heavy'));

        this.engine.shake(fx.shakeIntensity);
      });

      // ── Phase 5: Shockwave cascade ───────────────────────────
      this._after(1300, () => {
        const shockColors = ['#cc88ff', '#ffffff', '#8800cc', '#ffffff'];
        for (let i = 0; i < fx.ringCount; i++) {
          this._after(i * 55, () => {
            const ring = spawn(mk('sc-ring'));
            ring.style.borderColor       = shockColors[i % shockColors.length];
            ring.style.animationDuration = (.65 + i * .12) + 's';
            ring.style.animationDelay    = i * 45 + 'ms';
            this._after(900, () => ring.remove());
          });
        }
      });

      // ── Phase 6: Nebula debris + wisps ──────────────────────
      this._after(1600, () => {
        this._spawnDebris(color, fx.debrisCount);
        this._spawnWisps(fx.wispCount);
      });

      // ── Phase 7: Canvas aura + text reveal ──────────────────
      this._after(2000, () => {
        // God rays
        this.engine.addEffect(new RayBurst({
          color:    particleColor,
          duration: 5000,
          maxAlpha: 0.25,
          rayCount: fx.rayCount,
          rotSpeed: 0.9,
        }));

        // Deep violet radial glow
        this.engine.addEffect(new GlowOverlay({
          color:      glowColor,
          duration:   5500,
          maxAlpha:   fx.glowMaxAlpha,
          fadeIn:     0.06,
          fadeOut:    0.3,
          pulseSpeed: 2.0,
        }));

        // Brief white core flash
        this.engine.addEffect(new GlowOverlay({
          color:    'rgba(255,255,255,0.5)',
          duration: 700,
          maxAlpha: 0.55,
          fadeIn:   0.1,
          fadeOut:  0.6,
          radial:   true,
        }));

        // Three staggered particle rings
        [0, 180, 370].forEach((delay, i) => {
          this._after(delay, () => {
            this.engine.addEffect(new ParticleBurst(0.5, 0.5, {
              count:    Math.floor(fx.particleCount * (0.65 + i * 0.2)),
              color:    i === 1 ? '#ffffff' : particleColor,
              minSpeed: 180 + i * 90,
              maxSpeed: 480 + i * 110,
              minSize:  2,
              maxSize:  7,
              gravity:  55,
              trail:    fx.trailEnabled,
              glow:     true,
              duration: 3500,
              type:     'star',
            }));
          });
        });

        // Purple nebula drifting outward from centre
        this.engine.addEffect(new ContinuousParticles({
          ox:        0.5,
          oy:        0.5,
          color:     particleColor,
          minSpeed:  60,
          maxSpeed:  220,
          gravity:   -30,
          spread:    Math.PI * 2,
          minSize:   2,
          maxSize:   7,
          trail:     true,
          glow:      true,
          spawnRate: 0.03,
          duration:  4500,
          type:      'star',
        }));

        // Cosmic dust raining from top
        this.engine.addEffect(new ContinuousParticles({
          ox:        w => Math.random() * w,
          oy:        0,
          color:     '#cc88ff',
          minSpeed:  35,
          maxSpeed:  110,
          gravity:   90,
          upBias:    -30,
          spread:    0.35,
          angle:     Math.PI / 2,
          minSize:   1.5,
          maxSize:   4,
          glow:      true,
          spawnRate: 0.022,
          duration:  4200,
        }));

        // DOM stellar label
        this._after(380, () => {
          const label = spawn(mk('sc-label'));
          label.textContent = '✦  S T A R  ✦';
          this._after(2600, () => label.remove());
        });

        // Canvas text reveal
        this._after(500, () => {
          this.engine.addEffect(new RevealText({
            text:     fx.titleText,
            subtext:  fx.subtitleText,
            color,
            glowColor,
            shadow:   true,
            duration: 4800,
            font:     'bold 56px Cinzel, serif',
            subFont:  '20px Rajdhani, sans-serif',
            subColor: 'rgba(220,180,255,0.9)',
            y:        0.44,
          }));
        });
      });

      // ── Phase 8: Resolve ─────────────────────────────────────
      this._after(7200, () => {
        killSpawned();
        resolve();
      });
    });
  }

  stop() {
    this.stopped = true;
    this._timers.forEach(clearTimeout);
    this._timers = [];
    document.body.classList.remove('sc-shake', 'sc-shake-heavy');
    killSpawned();
  }

  // ── Rift crack spawner ───────────────────────────────────────
  _spawnRifts(count) {
    const presets = [
      { x: 20, y: 30, w: 25, a: -15 },
      { x: 55, y: 20, w: 30, a:  10 },
      { x: 30, y: 60, w: 20, a:  -8 },
      { x: 60, y: 55, w: 22, a:  18 },
      { x: 45, y: 40, w: 15, a:  -5 },
      { x: 72, y: 33, w: 19, a: -22 },
      { x: 15, y: 53, w: 17, a:   9 },
    ];
    presets.slice(0, count).forEach((r, i) => {
      this._after(i * 50, () => {
        const rift = spawn(mk('sc-rift'));
        rift.style.left           = r.x + 'vw';
        rift.style.top            = r.y + 'vh';
        rift.style.width          = r.w + 'vw';
        rift.style.transform      = `rotate(${r.a}deg)`;
        rift.style.animationDelay = i * 60 + 'ms';
        this._after(700, () => rift.remove());
      });
    });
  }

  // ── Orbiting matter spiraling inward ─────────────────────────
  _spawnOrbiters(color, count) {
    for (let i = 0; i < count; i++) {
      const angle  = (i / count) * 360;
      const radius = 25 + Math.random() * 25;
      const ox     = Math.cos((angle * Math.PI) / 180) * radius;
      const oy     = Math.sin((angle * Math.PI) / 180) * radius;
      const size   = 3 + Math.random() * 6;
      const dur    = .3 + Math.random() * .4;
      const orb    = spawn(mk('sc-orbiter'));
      orb.style.cssText = `
        width:${size}px;height:${size}px;
        --ox:${ox}vmin;--oy:${oy}vmin;
        --spin:${angle + 270 + Math.random() * 90}deg;
        animation-duration:${dur}s;
        animation-delay:${Math.random() * .15}s;
        background:${Math.random() > .5 ? color : 'rgba(200,100,255,.9)'};
        box-shadow:0 0 ${4 + Math.random() * 6}px 2px rgba(200,80,255,.6);
      `;
      this._after((dur + .22) * 1000, () => orb.remove());
    }
  }

  // ── Nebula debris fragments ──────────────────────────────────
  _spawnDebris(color, count) {
    const palette = [color, '#cc88ff', '#ffffff', '#8800cc', '#ff88ff'];
    for (let i = 0; i < count; i++) {
      const frag  = spawn(mk('sc-fragment'));
      const size  = 2 + Math.random() * 7;
      const angle = Math.random() * 360;
      const dist  = 18 + Math.random() * 45;
      const dur   = .7 + Math.random() * .9;
      frag.style.cssText = `
        width:${size}px;height:${size}px;
        --fa:${angle}deg;--fd:${dist}vmin;
        animation-duration:${dur}s;
        animation-delay:${Math.random() * .25}s;
        background:${palette[Math.floor(Math.random() * palette.length)]};
        box-shadow:0 0 ${2 + Math.random() * 4}px rgba(200,80,255,.7);
      `;
      this._after((dur + .3) * 1000, () => frag.remove());
    }
  }

  // ── Nebula wisps ─────────────────────────────────────────────
  _spawnWisps(count) {
    for (let i = 0; i < count; i++) {
      const wisp = spawn(mk('sc-wisp'));
      const size = 60 + Math.random() * 120;
      const dur  = .8 + Math.random() * .6;
      wisp.style.cssText = `
        left:${10 + Math.random() * 80}vw;
        top:${10 + Math.random() * 80}vh;
        width:${size}px;height:${size}px;
        animation-duration:${dur}s;
        animation-delay:${Math.random() * .2}s;
      `;
      this._after((dur + .3) * 1000, () => wisp.remove());
    }
  }
}