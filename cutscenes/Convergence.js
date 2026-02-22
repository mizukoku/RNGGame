// cutscenes/Convergence.js
// ═══════════════════════════════════════════════════════════════
//  T H E   C O N V E R G E N C E  —  1 / 20,000
//  Hybrid: DOM/CSS + canvas particle engine
//
//  Every previous cutscene leaves an echo.
//  At 1/20,000, all echoes are pulled into a single point —
//  and what emerges transcends all of them.
//
//  Phase 0  (0ms)    : Absolute void — heartbeat pulse
//  Phase 1  (600ms)  : Four echoes materialize (ghost memories)
//  Phase 2  (2000ms) : The Pull — echoes converge toward center
//  Phase 3  (3200ms) : Impact cascade — each echo hits center
//  Phase 4  (3800ms) : The Singularity — chromatic orb at rest
//  Phase 5  (5000ms) : TRANSCENDENCE — prismatic shockwave
//  Phase 6  (5600ms) : Chromatic aftermath — all colors at once
//  Phase 7  (6500ms) : Text reveal — THE CONVERGENCE
//  Phase 8  (13s)    : Resolve
// ═══════════════════════════════════════════════════════════════

import { ParticleBurst, ContinuousParticles } from '../effects/ParticleBurst.js';
import { GlowOverlay, RayBurst }               from '../effects/GlowOverlay.js';
import { RevealText }                           from '../effects/RevealText.js';

// ── Echo color palette (one per past cutscene) ────────────────
const ECHO_COLORS = {
  comet:    '#ffe066',  // Mythic / CometStrike gold
  collapse: '#cc88ff',  // Divine / StellarCollapse violet
  nova:     '#ff6600',  // Supernova orange
  seraph:   '#fff5a0',  // Seraphim ivory-white
};

// ── CSS — injected once ───────────────────────────────────────
const CSS = `
/* ── Phase 0: Absolute void ── */
.cv-void {
  position:fixed;inset:0;
  background:#000;
  z-index:9990;pointer-events:none;
  animation:cvVoidFade 5s ease forwards;
}
@keyframes cvVoidFade {
  0%{opacity:1} 90%{opacity:1} 100%{opacity:0}
}

/* Heartbeat glow from centre */
.cv-heartbeat {
  position:fixed;left:50%;top:50%;
  width:4px;height:4px;border-radius:50%;
  transform:translate(-50%,-50%);
  pointer-events:none;z-index:9991;
  background:#fff;
  animation:cvHeartbeat 1.1s ease-in-out infinite;
}
@keyframes cvHeartbeat {
  0%,100%{transform:translate(-50%,-50%) scale(1);box-shadow:0 0 0 0 rgba(255,255,255,.5)}
  40%    {transform:translate(-50%,-50%) scale(1.6);box-shadow:0 0 0 18px rgba(255,255,255,0)}
  60%    {transform:translate(-50%,-50%) scale(1);box-shadow:0 0 0 0 rgba(255,255,255,0)}
}

/* ── Phase 1: Echo elements ── */

/* Comet echo — a golden trail streak */
.cv-echo-comet {
  position:fixed;
  top:22%;left:-5%;
  width:55vw;height:3px;
  border-radius:2px;
  background:linear-gradient(90deg,
    transparent 0%,
    rgba(255,224,102,.15) 20%,
    rgba(255,224,102,.5) 60%,
    rgba(255,255,220,.8) 85%,
    rgba(255,255,255,.9) 100%);
  box-shadow:0 0 18px 4px rgba(255,200,60,.3);
  pointer-events:none;z-index:9993;
  transform:rotate(-18deg);
  animation:cvEchoAppear .8s ease forwards,
            cvEchoComet linear 1.4s forwards;
  opacity:0;
}
@keyframes cvEchoAppear {
  from{opacity:0} to{opacity:1}
}
@keyframes cvEchoComet {
  0%  {transform:rotate(-18deg) translateX(0)}
  100%{transform:rotate(-18deg) translateX(8vw)}
}

/* Collapse echo — a violet gravity ring */
.cv-echo-collapse {
  position:fixed;left:70%;top:55%;
  width:160px;height:160px;border-radius:50%;
  transform:translate(-50%,-50%);
  pointer-events:none;z-index:9993;
  border:2px solid rgba(204,136,255,.55);
  box-shadow:
    0 0 20px 4px rgba(204,136,255,.3),
    inset 0 0 30px rgba(136,0,204,.2);
  animation:cvEchoAppear .8s .2s ease forwards,
            cvEchoCollapse 2s ease-in-out infinite;
  opacity:0;
}
@keyframes cvEchoCollapse {
  0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.7}
  50%    {transform:translate(-50%,-50%) scale(1.12);opacity:.4}
}

/* Supernova echo — scattered debris fragments */
.cv-echo-debris {
  position:fixed;border-radius:50%;
  pointer-events:none;z-index:9993;
  animation:cvEchoAppear .6s ease forwards,
            cvEchoDebrisDrift linear infinite;
  opacity:0;
}
@keyframes cvEchoDebrisDrift {
  0%  {transform:translate(var(--dx0),var(--dy0)) rotate(0deg)}
  100%{transform:translate(var(--dx1),var(--dy1)) rotate(360deg)}
}

/* Seraphim echo — pair of golden wing beams */
.cv-echo-wing {
  position:fixed;left:50%;top:50%;
  height:12px;border-radius:0 50% 50% 0;
  pointer-events:none;z-index:9993;
  transform-origin:0 50%;
  animation:cvEchoAppear .9s .1s ease forwards,
            cvEchoWingPulse 1.8s ease-in-out infinite;
  opacity:0;
}
@keyframes cvEchoWingPulse {
  0%,100%{filter:brightness(1)}
  50%    {filter:brightness(1.4)}
}

/* ── Phase 2: The Pull — echoes converge ── */
.cv-echo-comet.cv-pulling {
  animation:cvPullComet 1.4s cubic-bezier(.4,0,1,.6) forwards;
}
@keyframes cvPullComet {
  to{transform:rotate(-18deg) translateX(0) translate(calc(50vw - 50%),calc(50vh - 22%)) scale(0);opacity:0}
}
.cv-echo-collapse.cv-pulling {
  animation:cvPullCollapse 1.2s cubic-bezier(.4,0,1,.6) forwards;
}
@keyframes cvPullCollapse {
  to{transform:translate(-50%,-50%) translate(calc(-20vw + 50%),calc(-5vh)) scale(0);opacity:0}
}
.cv-echo-debris.cv-pulling {
  animation:cvPullDebris 1s cubic-bezier(.5,0,1,.8) forwards !important;
}
@keyframes cvPullDebris {
  to{transform:translate(calc(50vw - var(--ox)),calc(50vh - var(--oy))) scale(0);opacity:0}
}
.cv-echo-wing.cv-pulling {
  animation:cvPullWing 1.1s cubic-bezier(.4,0,1,.6) forwards !important;
}
@keyframes cvPullWing {
  to{width:0;opacity:0}
}

/* Gravity lens ring around the pull point */
.cv-gravity-lens {
  position:fixed;left:50%;top:50%;
  width:8px;height:8px;border-radius:50%;
  transform:translate(-50%,-50%);
  pointer-events:none;z-index:9995;
  border:1px solid rgba(255,255,255,.35);
  animation:cvLensGrow 1.8s cubic-bezier(.2,1,.3,1) forwards;
}
@keyframes cvLensGrow {
  0%  {transform:translate(-50%,-50%) scale(1);opacity:0}
  15% {opacity:1}
  70% {transform:translate(-50%,-50%) scale(30);opacity:.6}
  100%{transform:translate(-50%,-50%) scale(60);opacity:0}
}

/* ── Phase 3: Impact flashes — one per echo ── */
.cv-impact-flash {
  position:fixed;inset:0;pointer-events:none;z-index:10005;
  animation:cvImpactFlash .3s ease-out forwards;
}
@keyframes cvImpactFlash {
  0%  {opacity:0}
  18% {opacity:1}
  100%{opacity:0}
}

/* ── Phase 4: Singularity orb ── */
.cv-singularity {
  position:fixed;left:50%;top:50%;
  width:16px;height:16px;border-radius:50%;
  transform:translate(-50%,-50%);
  pointer-events:none;z-index:10006;
  animation:cvSingularityBirth 1s cubic-bezier(.2,1.4,.3,1) forwards;
}
@keyframes cvSingularityBirth {
  0%  {transform:translate(-50%,-50%) scale(0) rotate(0deg);opacity:0}
  35% {opacity:1}
  100%{transform:translate(-50%,-50%) scale(1) rotate(720deg);opacity:1}
}

/* Rotating inner ring */
.cv-singularity::before {
  content:"";position:absolute;inset:-10px;border-radius:50%;
  border:1px solid rgba(255,255,255,.4);
  animation:cvSingInnerSpin 2s linear infinite;
}
@keyframes cvSingInnerSpin { to{transform:rotate(360deg)} }

/* Chromatic halo — color shift */
.cv-singularity-halo {
  position:fixed;left:50%;top:50%;
  border-radius:50%;transform:translate(-50%,-50%);
  pointer-events:none;z-index:10004;
  animation:cvHaloPulse ease-out infinite;
}
@keyframes cvHaloPulse {
  0%  {transform:translate(-50%,-50%) scale(1);opacity:.8}
  100%{transform:translate(-50%,-50%) scale(3.5);opacity:0}
}

/* ── Phase 5: Prismatic shockwaves ── */
.cv-prism-ring {
  position:fixed;left:50%;top:50%;
  width:10px;height:10px;border-radius:50%;
  border-width:5px;border-style:solid;
  transform:translate(-50%,-50%);
  pointer-events:none;z-index:10008;
  animation:cvPrismExpand ease-out forwards;
}
@keyframes cvPrismExpand {
  from{transform:translate(-50%,-50%) scale(.05);opacity:1}
  70% {opacity:.9}
  to  {transform:translate(-50%,-50%) scale(38);opacity:0}
}

/* White core supernova */
.cv-white-core {
  position:fixed;left:50%;top:50%;
  width:60px;height:60px;border-radius:50%;
  transform:translate(-50%,-50%);
  pointer-events:none;z-index:10007;
  background:radial-gradient(circle,#fff 0%,rgba(255,255,240,.6) 25%,transparent 70%);
  animation:cvWhiteCore 1.1s cubic-bezier(.05,.9,.1,1) forwards;
}
@keyframes cvWhiteCore {
  from{transform:translate(-50%,-50%) scale(0);opacity:1}
  60% {opacity:.9}
  to  {transform:translate(-50%,-50%) scale(32);opacity:0}
}

/* ── Phase 5: Screen chromatic wash ── */
.cv-chromawash {
  position:fixed;inset:0;pointer-events:none;z-index:10009;
  animation:cvChromaWash .7s ease-out forwards;
}
@keyframes cvChromaWash {
  0%  {opacity:0}
  12% {opacity:.75}
  100%{opacity:0}
}

/* ── Phase 7: Label ── */
.cv-label {
  position:fixed;left:50%;top:19%;
  transform:translateX(-50%);
  pointer-events:none;z-index:10012;white-space:nowrap;
  font-family:'Cinzel','Georgia',serif;
  display:flex;flex-direction:column;align-items:center;gap:10px;
  animation:cvLabelReveal 4s ease forwards;
}
.cv-label-the {
  font-size:9px;letter-spacing:14px;font-weight:700;
  color:rgba(255,255,255,.7);
  text-transform:uppercase;
  animation:cvLabelShift 3s linear infinite;
}
.cv-label-main {
  font-size:15px;letter-spacing:12px;font-weight:900;
  animation:cvLabelShift 2s linear infinite;
}
.cv-label-sub {
  font-size:9px;letter-spacing:5px;
  color:rgba(255,255,255,.55);font-style:italic;
  animation:cvLabelShift 4s linear infinite reverse;
}
@keyframes cvLabelShift {
  0%  {filter:hue-rotate(0deg)}
  100%{filter:hue-rotate(360deg)}
}
@keyframes cvLabelReveal {
  0%  {opacity:0;transform:translateX(-50%) scale(.8) translateY(14px)}
  8%  {opacity:1;transform:translateX(-50%) scale(1) translateY(0)}
  80% {opacity:1}
  100%{opacity:0;transform:translateX(-50%) scale(1.04) translateY(-6px)}
}

/* ── Body shakes ── */
@keyframes cvBodyShake {
  0%,100%{transform:translate(0,0)}
  10%{transform:translate(-5px,4px)}   25%{transform:translate(5px,-4px)}
  40%{transform:translate(-4px,5px)}   55%{transform:translate(4px,-4px)}
  70%{transform:translate(-3px,3px)}   85%{transform:translate(3px,-3px)}
}
body.cv-shake { animation:cvBodyShake .6s ease-out; }

@keyframes cvBodyShakeHeavy {
  0%,100%{transform:translate(0,0)}
  8% {transform:translate(-16px,12px)} 20%{transform:translate(16px,-14px)}
  32%{transform:translate(-14px,16px)} 44%{transform:translate(13px,-13px)}
  56%{transform:translate(-12px,12px)} 68%{transform:translate(10px,-10px)}
  80%{transform:translate(-8px,8px)}   92%{transform:translate(6px,-6px)}
}
body.cv-shake-heavy { animation:cvBodyShakeHeavy .85s ease-out; }
`;

function injectCSS() {
  if (document.getElementById('cv-styles')) return;
  const s = document.createElement('style');
  s.id = 'cv-styles';
  s.textContent = CSS;
  document.head.appendChild(s);
}

function mk(cls) {
  const el = document.createElement('div');
  el.className = cls;
  return el;
}

let _spawned = [];
function spawn(el) { _spawned.push(el); document.body.appendChild(el); return el; }
function killSpawned() { _spawned.forEach(e => e.remove()); _spawned = []; }

// All five rarity spectra for the chromatic aftermath
const SPECTRUM = [
  ECHO_COLORS.comet,    // gold
  '#ff4400',            // orange-red
  ECHO_COLORS.nova,     // supernova orange
  '#ff00aa',            // magenta
  ECHO_COLORS.collapse, // violet
  '#00ccff',            // cyan
  '#4ade80',            // green (uncommon echo)
  '#ffffff',            // white core
];

// ══════════════════════════════════════════════════════════════
export class Convergence {
  constructor(engine, rarity) {
    this.engine  = engine;
    this.rarity  = rarity;
    this.stopped = false;
    this._timers = [];
    // DOM references for the pulling phase
    this._echoComet    = null;
    this._echoCollapse = null;
    this._echoDebris   = [];
    this._echoWings    = [];
    this.fx = {
      shakeIntensity: 55,
      particleCount:  220,
      rayCount:       40,
      ringCount:      8,
      glowMaxAlpha:   1.0,
      trailEnabled:   true,
      titleText:      'THE CONVERGENCE',
      subtitleText:   '✦  1 / 20,000  ✦',
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

      // ── Phase 0: Absolute void + heartbeat ─────────────────
      spawn(mk('cv-void'));
      const hb = spawn(mk('cv-heartbeat'));

      // ── Phase 1: Four echoes materialize ───────────────────
      this._after(600, () => {
        this._spawnEchoes();
      });

      // ── Phase 2: The Pull — gravity lens + echoes converge ─
      this._after(2000, () => {
        hb.remove();

        // Gravity distortion lens
        const lens = spawn(mk('cv-gravity-lens'));
        this._after(1800, () => lens.remove());

        // Light shake as pull begins
        document.body.classList.add('cv-shake');
        this._after(650, () => document.body.classList.remove('cv-shake'));
        this.engine.shake(this.fx.shakeIntensity * 0.3);

        // Trigger pull animations on all echo elements
        this._after(200, () => {
          this._echoComet?.classList.add('cv-pulling');
          this._after(150, () => this._echoCollapse?.classList.add('cv-pulling'));
          this._echoDebris.forEach((d, i) => {
            this._after(i * 60, () => d.classList.add('cv-pulling'));
          });
          this._echoWings.forEach((w, i) => {
            this._after(i * 80, () => w.classList.add('cv-pulling'));
          });
        });
      });

      // ── Phase 3: Impact cascade — each echo hits center ────
      this._after(3200, () => {
        const impactColors = [
          ECHO_COLORS.comet,
          ECHO_COLORS.collapse,
          ECHO_COLORS.nova,
          ECHO_COLORS.seraph,
        ];
        impactColors.forEach((col, i) => {
          this._after(i * 160, () => {
            const flash = spawn(mk('cv-impact-flash'));
            flash.style.background = `radial-gradient(ellipse at 50% 50%,
              ${col}55 0%,${col}22 35%,transparent 65%)`;
            this._after(320, () => flash.remove());

            // Small shake per impact
            document.body.classList.remove('cv-shake');
            void document.body.offsetWidth;
            document.body.classList.add('cv-shake');
          });
        });
        this._after(650, () => document.body.classList.remove('cv-shake'));
      });

      // ── Phase 4: The Singularity ────────────────────────────
      this._after(3800, () => {
        const orb = spawn(mk('cv-singularity'));
        // Chromatic cycling background
        this._animateSingularityColor(orb);

        // Three staggered halo rings
        for (let i = 0; i < 3; i++) {
          this._after(i * 220, () => {
            const halo = spawn(mk('cv-singularity-halo'));
            const sz   = 16 + i * 12;
            const col  = SPECTRUM[i * 2 % SPECTRUM.length];
            halo.style.cssText = `
              width:${sz}px;height:${sz}px;
              border:1px solid ${col};
              box-shadow:0 0 ${6+i*4}px ${col};
              animation-duration:${.9+i*.3}s;
              animation-iteration-count:5;
              animation-delay:${i*.22}s;
            `;
            this._after(3000, () => halo.remove());
          });
        }

        // Remove orb when transcendence begins
        this._after(1200, () => orb.remove());
      });

      // ── Phase 5: TRANSCENDENCE ──────────────────────────────
      this._after(5000, () => {
        // White core fireball
        spawn(mk('cv-white-core'));
        this._after(1200, () => {
          document.body.querySelector('.cv-white-core')?.remove();
        });

        // Chromatic wash
        const wash = spawn(mk('cv-chromawash'));
        wash.style.background = `radial-gradient(ellipse at 50% 50%,
          rgba(255,255,255,.55) 0%,rgba(255,180,0,.3) 25%,rgba(200,0,255,.2) 50%,transparent 70%)`;
        this._after(780, () => wash.remove());

        // 8 prismatic shockwave rings — each a different color
        const ringColors = [
          '#ffffff', ECHO_COLORS.comet, ECHO_COLORS.nova,
          '#ff00aa', ECHO_COLORS.collapse, '#00ccff',
          '#4ade80', '#ffffff',
        ];
        for (let i = 0; i < this.fx.ringCount; i++) {
          this._after(i * 80, () => {
            const ring = spawn(mk('cv-prism-ring'));
            ring.style.borderColor       = ringColors[i % ringColors.length];
            ring.style.animationDuration = (.65 + i * .11) + 's';
            ring.style.animationDelay    = i * 75 + 'ms';
            this._after(1400, () => ring.remove());
          });
        }

        // Heavy shake — the most violent moment in the game
        document.body.classList.add('cv-shake-heavy');
        this._after(900, () => document.body.classList.remove('cv-shake-heavy'));
        this.engine.shake(this.fx.shakeIntensity);
      });

      // ── Phase 6: Chromatic aftermath ────────────────────────
      this._after(5600, () => {
        // Layered god rays — all five echo colors simultaneously
        SPECTRUM.slice(0, 5).forEach((col, i) => {
          this._after(i * 100, () => {
            this.engine.addEffect(new RayBurst({
              color:    col,
              duration: 8000,
              maxAlpha: 0.16 - i * 0.02,
              rayCount: Math.floor(this.fx.rayCount / (1 + i * 0.4)),
              rotSpeed: (i % 2 === 0 ? 1 : -1) * (0.4 + i * 0.2),
            }));
          });
        });

        // Outer glow — chromatic white
        this.engine.addEffect(new GlowOverlay({
          color:      'rgba(255,255,255,0.6)',
          duration:   8500,
          maxAlpha:   this.fx.glowMaxAlpha,
          fadeIn:     0.04,
          fadeOut:    0.2,
          pulseSpeed: 1.2,
        }));

        // Five staggered particle bursts — one per echo color
        SPECTRUM.forEach((col, i) => {
          this._after(i * 140, () => {
            this.engine.addEffect(new ParticleBurst(0.5, 0.5, {
              count:    Math.floor(this.fx.particleCount * (.5 + i * .08)),
              color:    col,
              minSpeed: 160 + i * 60,
              maxSpeed: 500 + i * 80,
              minSize:  2,
              maxSize:  9,
              gravity:  35,
              trail:    this.fx.trailEnabled,
              glow:     true,
              duration: 6000,
              type:     i % 3 === 0 ? 'star' : i % 3 === 1 ? 'circle' : 'spark',
            }));
          });
        });

        // Continuous chromatic nebula from center
        SPECTRUM.slice(0, 4).forEach((col, i) => {
          this._after(i * 200, () => {
            this.engine.addEffect(new ContinuousParticles({
              ox:        0.5,
              oy:        0.5,
              color:     col,
              minSpeed:  80,
              maxSpeed:  280,
              gravity:   (i % 2 === 0) ? -30 : 20,
              spread:    Math.PI * 2,
              minSize:   1.5,
              maxSize:   7,
              trail:     true,
              glow:      true,
              spawnRate: 0.022,
              duration:  7000,
              type:      'star',
            }));
          });
        });

        // Chromatic cosmic dust raining from top
        this.engine.addEffect(new ContinuousParticles({
          ox:        w => Math.random() * w,
          oy:        0,
          color:     '#ffffff',
          minSpeed:  30,
          maxSpeed:  120,
          gravity:   100,
          spread:    0.5,
          angle:     Math.PI / 2,
          minSize:   1,
          maxSize:   4,
          glow:      true,
          spawnRate: 0.025,
          duration:  7000,
        }));
      });

      // ── Phase 7: Text reveal ────────────────────────────────
      this._after(6500, () => {
        // DOM label with hue-rotating filter (all colors cycle)
        const label = spawn(mk('cv-label'));
        const the   = document.createElement('div');
        the.className = 'cv-label-the';
        the.textContent = 'T H E';
        const main  = document.createElement('div');
        main.className = 'cv-label-main';
        main.textContent = 'C O N V E R G E N C E';
        main.style.color = '#fff';
        main.style.textShadow = [
          '0 0 20px rgba(255,255,255,0.9)',
          '0 0 50px rgba(255,200,100,0.7)',
          '0 0 100px rgba(200,100,255,0.5)',
        ].join(',');
        const sub   = document.createElement('div');
        sub.className = 'cv-label-sub';
        sub.textContent = 'All things return to one';
        label.appendChild(the);
        label.appendChild(main);
        label.appendChild(sub);
        this._after(4200, () => label.remove());

        // Canvas text — chromatic gradient that shifts
        this._after(400, () => {
          // Draw the text twice: once in each of the two anchor colors,
          // creating a layered spectral look through RevealText
          this.engine.addEffect(new RevealText({
            text:     this.fx.titleText,
            subtext:  this.fx.subtitleText,
            color:    '#ffffff',
            glowColor: 'rgba(255,255,255,0.9)',
            shadow:   true,
            duration: 6500,
            font:     'bold 64px Cinzel, serif',
            subFont:  '20px Rajdhani, sans-serif',
            subColor: 'rgba(255,235,180,0.9)',
            y:        0.44,
          }));
        });
      });

      // ── Phase 8: Resolve ────────────────────────────────────
      this._after(13200, () => {
        killSpawned();
        resolve();
      });
    });
  }

  stop() {
    this.stopped = true;
    this._timers.forEach(clearTimeout);
    this._timers = [];
    document.body.classList.remove('cv-shake', 'cv-shake-heavy');
    killSpawned();
  }

  // ── Spawn all four echo elements ────────────────────────────
  _spawnEchoes() {
    // 1. Comet echo — golden diagonal trail
    this._echoComet = spawn(mk('cv-echo-comet'));

    // 2. Collapse echo — violet gravity ring at right side
    this._echoCollapse = spawn(mk('cv-echo-collapse'));

    // 3. Supernova debris — 12 small orange fragments scattered in left quadrant
    this._echoDebris = [];
    for (let i = 0; i < 12; i++) {
      const d = spawn(mk('cv-echo-debris'));
      const ox = 15 + Math.random() * 30; // vw
      const oy = 55 + Math.random() * 30; // vh
      const size = 2 + Math.random() * 5;
      const col  = i % 2 === 0 ? ECHO_COLORS.nova : '#ffcc00';
      const dx0  = ox + 'vw';
      const dy0  = oy + 'vh';
      const dx1  = (ox + (Math.random() - .5) * 4) + 'vw';
      const dy1  = (oy + (Math.random() - .5) * 4) + 'vh';
      d.style.cssText = `
        width:${size}px;height:${size}px;
        left:0;top:0;
        background:${col};
        box-shadow:0 0 ${3+size}px ${col};
        --dx0:${dx0};--dy0:${dy0};
        --dx1:${dx1};--dy1:${dy1};
        --ox:${ox}vw;--oy:${oy}vh;
        animation-delay:${Math.random()*.4}s;
        animation-duration:.7s,${2+Math.random()}s;
        transform:translate(${dx0},${dy0});
      `;
      this._echoDebris.push(d);
    }

    // 4. Seraphim wings — two beams, mirrored, upper right quadrant
    this._echoWings = [];
    [[-45, '40vw'], [45, '40vw']].forEach(([angle, width], i) => {
      const w = spawn(mk('cv-echo-wing'));
      w.style.cssText = `
        width:${width};
        background:linear-gradient(90deg,
          rgba(255,245,160,.7) 0%,rgba(255,220,80,.4) 50%,transparent 100%);
        box-shadow:0 0 14px 3px rgba(255,220,60,.2);
        transform:translate(-50%,-50%) rotate(${angle}deg);
        top:35%;
        animation-delay:${i * .15}s;
        animation-duration:.9s,1.8s;
      `;
      this._echoWings.push(w);
    });
  }

  // ── Animate singularity orb through all rarity colors ────────
  _animateSingularityColor(orb) {
    const colors = [
      [ECHO_COLORS.comet,    'rgba(255,180,0,0.9)'],
      [ECHO_COLORS.collapse, 'rgba(160,60,255,0.9)'],
      [ECHO_COLORS.nova,     'rgba(255,100,0,0.9)'],
      [ECHO_COLORS.seraph,   'rgba(255,255,220,0.9)'],
      ['#00ccff',            'rgba(0,180,255,0.9)'],
      ['#ffffff',            'rgba(255,255,255,0.95)'],
    ];
    let idx = 0;
    const tick = () => {
      if (this.stopped || !orb.isConnected) return;
      const [col, glow] = colors[idx % colors.length];
      orb.style.background = `radial-gradient(circle,#fff 0%,${col} 40%,transparent 80%)`;
      orb.style.boxShadow = `
        0 0 12px 5px ${glow},
        0 0 35px 12px ${col}88,
        0 0 80px 25px ${col}44
      `;
      idx++;
      this._timers.push(setTimeout(tick, 200));
    };
    tick();
  }
}