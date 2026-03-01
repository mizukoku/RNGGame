// cutscenes/TheLastLight.js
// ═══════════════════════════════════════════════════════════════
//  T H E   L A S T   L I G H T  —  1 / 400,000
//  Hybrid: DOM/CSS stars + canvas ember engine + Web Audio
//
//  It is the year 10¹⁰⁰.
//  Every star has burned out.
//  The universe is cooling toward absolute zero.
//  There is one photon left.
//  You are watching it.
//
//  Phase 0  (0ms)    : Absolute black — no grain, no rings. Nothing.
//  Phase 1  (600ms)  : The last star materialises — 3px warm white
//  Phase 2  (1400ms) : ~80 distant stars appear, each dying at own rate
//  Phase 3  (3000ms) : "In the year 10¹⁰⁰..." — very slow typewriter
//  Phase 4  (7500ms) : All distant stars burned out. Only one remains.
//  Phase 5  (9000ms) : "The last star." — holds
//  Phase 6  (11200ms): Last star collapses — scale 1→0 over 3s, aura GROWS
//  Phase 7  (14000ms): Total absolute darkness — 1.2 seconds of nothing
//  Phase 8  (15200ms): THE FINAL FLARE — warm white detonation
//  Phase 9  (17000ms): 120 cooling ember shards rain down
//  Phase 10 (18500ms): Canvas — 6 warm ray bursts + orange/red glow
//  Phase 11 (19500ms): T H E   L A S T   L I G H T label
//  Phase 12 (21500ms): "EVEN ENDINGS HAVE A WITNESS." typewriter
//  Phase 13 (25000ms): Void dims — darkness returns, but warmer
//  Phase 14 (30000ms): Resolve
// ═══════════════════════════════════════════════════════════════

import { ParticleBurst, ContinuousParticles } from '../effects/ParticleBurst.js';
import { GlowOverlay, RayBurst }               from '../effects/GlowOverlay.js';

// ── Palette ───────────────────────────────────────────────────
const LE  = '#ff4400';          // last ember
const LO  = '#ff9933';          // last orange
const LW  = '#fff8f0';          // final white
const LR  = '#ff2200';          // deep red
const LA  = '#1a0800';          // cooling ash
const LK  = '#000000';          // absolute black

const LE_GLOW = 'rgba(255,68,0,0.92)';
const LO_GLOW = 'rgba(255,153,51,0.88)';

// ── Distant star death timings (ms to die after spawn) ─────────
// Each entry: [xPct, yPct, dieAfterMs, startColor, endColor]
function makeStarMap(count) {
  const entries = [];
  for (let i = 0; i < count; i++) {
    // Avoid center region (reserved for the last star)
    let x, y;
    do {
      x = 5 + Math.random() * 90;
      y = 5 + Math.random() * 90;
    } while (Math.abs(x - 50) < 18 && Math.abs(y - 50) < 18);

    const lifeMs  = 2000 + Math.random() * 5500;  // die between 2s–7.5s after spawn
    const sz      = Math.random() < 0.6 ? 1 : (Math.random() < 0.5 ? 2 : 3);
    const startBright = Math.random() > 0.4;       // some start dim (already old)
    entries.push({ x, y, lifeMs, sz, startBright });
  }
  return entries;
}

// ── CSS ───────────────────────────────────────────────────────
const CSS = `
/* ── Void — truly empty ── */
.ll-void {
  position:fixed;inset:0;background:${LK};
  z-index:9990;pointer-events:none;
  opacity:1;transition:opacity 3s ease;
}
.ll-void--fade { opacity:0; }

/* Warm afterglow behind everything */
.ll-afterglow {
  position:fixed;inset:0;pointer-events:none;z-index:9991;
  background:radial-gradient(ellipse at 50% 50%,
    rgba(255,80,0,.06) 0%,rgba(255,40,0,.03) 45%,transparent 75%);
  opacity:0;transition:opacity 4s ease;
}
.ll-afterglow--on { opacity:1; }

/* ── The last star — center DOM element ── */
.ll-star-last {
  position:fixed;left:50%;top:50%;
  transform:translate(-50%,-50%);
  pointer-events:none;z-index:9993;
  border-radius:50%;
  background:radial-gradient(circle,${LW} 0%,#ffd4a0 40%,rgba(255,100,0,.6) 70%,transparent 100%);
  transition:width 3s ease-in-out,height 3s ease-in-out,
             box-shadow 3s ease-in-out, opacity .6s ease, filter 3s ease;
}
/* Subtle breathing when healthy */
.ll-star-last--alive {
  width:16px;height:16px;
  box-shadow:
    0 0 10px 5px rgba(255,220,160,.7),
    0 0 30px 12px rgba(255,150,60,.4),
    0 0 80px 28px rgba(255,80,0,.2);
  animation:llStarBreath 2.8s ease-in-out infinite alternate;
}
@keyframes llStarBreath {
  from{filter:brightness(1) saturate(1)}
  to  {filter:brightness(1.35) saturate(1.2)}
}
/* Dying — orange/red, large aura concentrating */
.ll-star-last--dying {
  width:8px;height:8px;
  background:radial-gradient(circle,${LW} 0%,${LO} 40%,${LE} 65%,transparent 100%);
  box-shadow:
    0 0 20px 14px rgba(255,80,0,.9),
    0 0 60px 35px rgba(255,40,0,.55),
    0 0 140px 70px rgba(200,0,0,.3);
  animation:none;
  filter:brightness(1.5) saturate(1.8);
}
/* Collapsed — zero size */
.ll-star-last--gone {
  width:0;height:0;
  box-shadow:none;
  opacity:0;
}

/* Collapse aura — inverse: grows as star shrinks */
.ll-collapse-aura {
  position:fixed;left:50%;top:50%;
  transform:translate(-50%,-50%);
  border-radius:50%;pointer-events:none;z-index:9992;
  background:transparent;
  border:0px solid rgba(255,68,0,.0);
  opacity:0;
  transition:
    width 3s ease-in-out,height 3s ease-in-out,
    border-width 3s ease-in-out,border-color 3s ease-in-out,
    box-shadow 3s ease-in-out,opacity .3s ease;
}
.ll-collapse-aura--on {
  width:180px;height:180px;
  border:2px solid rgba(255,68,0,.7);
  box-shadow:
    0 0 35px 10px rgba(255,68,0,.5),
    0 0 90px 30px rgba(255,40,0,.3),
    inset 0 0 40px rgba(255,68,0,.12);
  opacity:1;
}
.ll-collapse-aura--gone {
  width:0;height:0;
  border-color:rgba(255,68,0,0);
  box-shadow:none;
  opacity:0;
}

/* ── Distant stars ── */
.ll-star {
  position:fixed;border-radius:50%;
  pointer-events:none;z-index:9992;
  background:var(--sc);
  box-shadow:0 0 var(--sglow) var(--sc);
  opacity:0;
  animation:llStarLife var(--slife) ease-in-out forwards;
  animation-delay:var(--sdly);
}
@keyframes llStarLife {
  0%  {opacity:0;background:${LW};box-shadow:0 0 3px ${LW}}
  8%  {opacity:var(--sbri,1)}
  65% {opacity:var(--sbri,1);background:var(--sc);box-shadow:0 0 var(--sglow) var(--sc)}
  82% {opacity:.35;background:${LR};box-shadow:0 0 2px ${LR};filter:saturate(2)}
  100%{opacity:0;background:${LA};box-shadow:none}
}

/* ── Phase 3: Intro typewriter ── */
.ll-intro-text {
  position:fixed;left:50%;top:30%;
  transform:translateX(-50%);
  pointer-events:none;z-index:10005;
  font-family:'Georgia','Times New Roman',serif;font-style:italic;
  font-size:clamp(.9rem,2vw,1.2rem);letter-spacing:5px;
  color:rgba(255,153,51,.68);
  text-shadow:0 0 20px rgba(255,100,0,.4);
  white-space:nowrap;
  animation:llIntroReveal 9s ease forwards;
}
@keyframes llIntroReveal {
  0%  {opacity:0} 6%{opacity:1} 78%{opacity:1} 100%{opacity:0}
}

/* ── Phase 5: "The last star." ── */
.ll-last-star-text {
  position:fixed;left:50%;top:38%;
  transform:translateX(-50%);
  pointer-events:none;z-index:10005;
  font-family:'Georgia','Times New Roman',serif;font-style:italic;
  font-size:clamp(1rem,2.2vw,1.35rem);letter-spacing:7px;
  color:rgba(255,180,80,.75);
  text-shadow:0 0 18px rgba(255,100,0,.5),0 0 50px rgba(255,60,0,.25);
  white-space:nowrap;
  opacity:0;animation:llLastStarIn 5.5s ease forwards;
}
@keyframes llLastStarIn {
  0%  {opacity:0;transform:translateX(-50%) translateY(6px);filter:blur(5px)}
  12% {opacity:.85;filter:blur(0)}
  75% {opacity:.85}
  100%{opacity:0;transform:translateX(-50%) translateY(-4px)}
}

/* ── Phase 8: Detonation flash ── */
.ll-flash {
  position:fixed;inset:0;pointer-events:none;z-index:10010;
  background:radial-gradient(circle at 50% 50%,
    ${LW} 0%,${LO} 35%,${LE} 65%,${LR} 85%,rgba(80,0,0,.4) 100%);
  animation:llFlash 1.4s ease-out forwards;
}
@keyframes llFlash {
  0%  {opacity:1;transform:scale(0.1)}
  12% {opacity:1;transform:scale(1.8)}
  35% {opacity:.9}
  100%{opacity:0;transform:scale(2.2)}
}

/* ── Phase 9: Cooling ember shards ── */
.ll-ember {
  position:fixed;left:50vw;top:50vh;
  pointer-events:none;z-index:9995;
  border-radius:50%;
  background:radial-gradient(circle,var(--ec) 0%,transparent 70%);
  box-shadow:0 0 var(--eglow) var(--ec);
  animation:llEmberFall var(--edur) ease-in forwards;
}
@keyframes llEmberFall {
  0%  {opacity:1;transform:translate(-50%,-50%) translate(var(--ex),var(--ey)) scale(1.2)}
  60% {opacity:.7;filter:brightness(.7)}
  100%{opacity:0;transform:translate(-50%,-50%) translate(var(--ex),calc(var(--ey) + 35vh)) scale(.1)}
}

/* ── Phase 11: Label ── */
.ll-label {
  position:fixed;left:50%;top:50%;
  transform:translate(-50%,-50%);
  pointer-events:none;z-index:10012;
  display:flex;flex-direction:column;align-items:center;gap:14px;
  animation:llLabelReveal 9.5s ease forwards;
}
@keyframes llLabelReveal {
  0%  {opacity:0;transform:translate(-50%,-50%) scale(.6);filter:blur(18px)}
  8%  {opacity:1;transform:translate(-50%,-50%) scale(1.02);filter:blur(0)}
  14% {transform:translate(-50%,-50%) scale(1)}
  80% {opacity:1}
  100%{opacity:0}
}

.ll-label-main {
  font-family:'Georgia','Times New Roman',serif;
  font-size:34px;font-weight:400;letter-spacing:16px;
  color:${LO};
  text-shadow:
    0 0 8px ${LO},0 0 22px ${LE},
    0 0 60px rgba(255,68,0,.55),0 0 130px rgba(255,40,0,.25);
  border:1px solid rgba(255,100,0,.4);
  padding:18px 52px;
  background:rgba(4,1,0,.97);
  box-shadow:
    0 0 40px rgba(255,68,0,.3),0 0 90px rgba(255,40,0,.15),
    inset 0 0 35px rgba(255,68,0,.05);
  animation:llLabelEmber 3s ease-in-out infinite alternate;
}
@keyframes llLabelEmber {
  from{
    text-shadow:0 0 8px ${LO},0 0 22px ${LE},0 0 60px rgba(255,68,0,.55),0 0 130px rgba(255,40,0,.25);
    box-shadow:0 0 40px rgba(255,68,0,.3),0 0 90px rgba(255,40,0,.15),inset 0 0 35px rgba(255,68,0,.05);
    border-color:rgba(255,100,0,.4);
  }
  to{
    text-shadow:0 0 14px ${LW},0 0 38px ${LO},0 0 90px rgba(255,80,0,.7),0 0 200px rgba(255,40,0,.35);
    box-shadow:0 0 70px rgba(255,80,0,.5),0 0 160px rgba(255,40,0,.25),inset 0 0 60px rgba(255,68,0,.08);
    border-color:rgba(255,160,60,.65);
  }
}

.ll-label-sub {
  font-family:'Georgia','Times New Roman',serif;font-style:italic;
  font-size:10px;letter-spacing:5px;
  color:rgba(255,120,40,.45);
  text-shadow:0 0 8px rgba(255,80,0,.3);
}

/* ── Phase 12: Typewriter ── */
.ll-typewriter {
  position:fixed;left:50%;top:calc(50% + 82px);
  transform:translateX(-50%);
  pointer-events:none;z-index:10013;
  font-family:'Georgia','Times New Roman',serif;font-style:italic;
  font-size:15px;letter-spacing:6px;
  color:rgba(255,160,60,.78);
  text-shadow:0 0 10px rgba(255,80,0,.45);
  white-space:nowrap;
  animation:llTypeReveal 8.5s ease forwards;
}
@keyframes llTypeReveal {
  0%{opacity:0} 5%{opacity:1} 84%{opacity:1} 100%{opacity:0}
}
.ll-cursor {
  display:inline-block;width:2px;height:1em;
  background:rgba(255,160,60,.7);margin-left:3px;vertical-align:middle;
  box-shadow:0 0 5px rgba(255,100,0,.5);
  animation:llCursorBlink .75s step-end infinite;
}
@keyframes llCursorBlink { 0%,100%{opacity:1} 50%{opacity:0} }

/* ── Shakes ── */
@keyframes llDetonateShake {
  0%,100%{transform:translate(0,0) rotate(0deg)}
  6% {transform:translate(-18px,22px) rotate(-.8deg)}
  15%{transform:translate(18px,-20px) rotate(.7deg)}
  24%{transform:translate(-20px,18px) rotate(-.6deg)}
  33%{transform:translate(18px,-19px) rotate(.6deg)}
  42%{transform:translate(-15px,16px) rotate(-.4deg)}
  51%{transform:translate(13px,-14px) rotate(.35deg)}
  61%{transform:translate(-10px,12px) rotate(-.25deg)}
  71%{transform:translate(8px,-10px) rotate(.15deg)}
  81%{transform:translate(-5px,7px)}
  90%{transform:translate(4px,-5px)}
}
body.ll-detonate-shake { animation:llDetonateShake 1.5s ease-out; }
`;

function injectCSS() {
  if (document.getElementById('ll-styles')) return;
  const s = document.createElement('style');
  s.id = 'll-styles';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function mk(cls) { const el = document.createElement('div'); el.className = cls; return el; }
let _spawned = [];
function spawn(el)    { _spawned.push(el); document.body.appendChild(el); return el; }
function killSpawned(){ _spawned.forEach(e => e.remove()); _spawned = []; }
function rnd(lo, hi)  { return lo + Math.random() * (hi - lo); }

// ══════════════════════════════════════════════════════════════
export class TheLastLight {
  constructor(engine, rarity) {
    this.engine  = engine;
    this.rarity  = rarity;
    this.stopped = false;
    this._timers = [];
    this._actx   = null;
    this._hum    = null;
    this._starEl = null;
    this._auraEl = null;
    this.fx = {
      shakeIntensity: 90,
      particleCount:  320,
      rayCount:       48,
      glowMaxAlpha:   0.95,
      auraCount:      6,
      trailEnabled:   true,
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

      // ── Phase 0: Absolute black ──────────────────────────────
      const voidEl    = spawn(mk('ll-void'));
      const afterglow = spawn(mk('ll-afterglow'));
      this._after(25000, () => voidEl.classList.add('ll-void--fade'));
      this._after(28500, () => voidEl.remove());

      // Fade persistent scene elements before the void lifts
      this._after(23500, () => {
        document.querySelectorAll('.ll-afterglow,.ll-star-last,.ll-collapse-aura')
          .forEach(el => { el.style.transition = 'opacity 1.8s ease'; el.style.opacity = '0'; });
      });

      // Ambient hum starts immediately, barely perceptible
      this._sfxHum();

      // ── Phase 1: Last star materialises ──────────────────────
      this._after(600, () => this._spawnLastStar());

      // ── Phase 2: Distant stars appear and die ─────────────────
      this._after(1400, () => this._spawnDistantStars(80));

      // ── Phase 3: Intro typewriter ─────────────────────────────
      this._after(3000, () => this._spawnIntroText());

      // ── Pulsar pings start (every ~4s, stop before detonation) ─
      this._after(2000, () => this._sfxPulsarLoop(5));

      // ── Phase 5: "The last star." ─────────────────────────────
      this._after(9000, () => {
        const txt = spawn(mk('ll-last-star-text'));
        txt.textContent = 'The last star.';
        this._after(5200, () => txt.remove());
      });

      // ── Phase 6: Last star begins collapsing ─────────────────
      this._after(11200, () => {
        if (this._starEl) {
          this._starEl.classList.remove('ll-star-last--alive');
          this._starEl.classList.add('ll-star-last--dying');
        }
        if (this._auraEl) this._auraEl.classList.add('ll-collapse-aura--on');
      });
      this._after(14000, () => {
        if (this._starEl) {
          this._starEl.classList.remove('ll-star-last--dying');
          this._starEl.classList.add('ll-star-last--gone');
        }
        if (this._auraEl) {
          this._auraEl.classList.remove('ll-collapse-aura--on');
          this._auraEl.classList.add('ll-collapse-aura--gone');
          this._after(600, () => this._auraEl?.remove());
        }
      });

      // ── Phase 7: Total darkness — 1.2s of nothing ────────────
      // (The void is already black, star is gone — just silence)

      // ── Phase 8: THE FINAL FLARE ─────────────────────────────
      this._after(15200, () => {
        spawn(mk('ll-flash'));
        this._after(1600, () => document.querySelector('.ll-flash')?.remove());
        document.body.classList.add('ll-detonate-shake');
        this._after(1550, () => document.body.classList.remove('ll-detonate-shake'));
        this.engine.shake(this.fx.shakeIntensity);
        afterglow.classList.add('ll-afterglow--on');
        this._sfxDetonate();
        this._sfxFinalTone();
      });

      // ── Phase 9: Cooling ember shards ─────────────────────────
      this._after(17000, () => this._spawnEmbers(120));

      // ── Phase 10: Canvas — warm ray bursts + glow ─────────────
      this._after(18500, () => {
        const warmCols = [LE, LO, LW, '#ffcc00', '#ff6600', LR];
        warmCols.forEach((col, i) => {
          this._after(i * 110, () => {
            this.engine.addEffect(new RayBurst({
              color:    col,
              duration: 13000,
              maxAlpha: 0.22 - i * 0.03,
              rayCount: Math.floor(this.fx.rayCount * (1.2 - i * 0.12)),
              rotSpeed: i % 2 === 0 ? 0.6 + i * 0.18 : -(0.5 + i * 0.14),
            }));
          });
        });

        this.engine.addEffect(new GlowOverlay({
          color: LE_GLOW, duration: 12000, maxAlpha: this.fx.glowMaxAlpha,
          fadeIn: 0.05, fadeOut: 0.22, radial: true, pulseSpeed: 1.4,
        }));
        this.engine.addEffect(new GlowOverlay({
          color: LO_GLOW, duration: 11000, maxAlpha: 0.6,
          fadeIn: 0.07, fadeOut: 0.28, radial: true, pulseSpeed: 2.1,
        }));

        // Main particle eruption — ember colours
        [[LE, 1.0], [LO, 0.85], [LW, 0.65], ['#ffcc00', 0.5]].forEach(([col, scale], i) => {
          this._after(i * 130, () => {
            this.engine.addEffect(new ParticleBurst(0.5, 0.5, {
              count:    Math.floor(this.fx.particleCount * scale),
              color:    col,
              minSpeed: 80  + i * 70,
              maxSpeed: 500 + i * 40,
              minSize:  2,
              maxSize:  11,
              gravity:  60,
              trail:    true,
              glow:     true,
              duration: 11000,
              type:     'star',
            }));
          });
        });

        // Continuous rising ember smoke
        this.engine.addEffect(new ContinuousParticles({
          ox: 0.5, oy: 0.5,
          color:     LO,
          minSpeed:  40,  maxSpeed: 180,
          gravity:   -50, upBias:   120,
          spread:    Math.PI * 2,
          angle:     -Math.PI / 2,
          minSize:   1,   maxSize:  6,
          trail:     true, glow:    true,
          spawnRate: 0.04,
          duration:  11500,
          type:      'star',
        }));
      });

      // ── Phase 11: Label ───────────────────────────────────────
      this._after(19500, () => this._spawnLabel());

      // ── Phase 12: Typewriter ──────────────────────────────────
      this._after(21500, () => this._spawnTypewriter());

      // ── Phase 14: Resolve ─────────────────────────────────────
      this._after(29500, () => {
        killSpawned();
        this._stopHum();
        if (this._actx) { try { this._actx.close(); } catch(e){} }
        resolve();
      });
    });
  }

  stop() {
    this.stopped = true;
    this._timers.forEach(clearTimeout);
    this._timers = [];
    document.body.classList.remove('ll-detonate-shake');
    this._stopHum();
    if (this._actx) { try { this._actx.close(); } catch(e){} }
    killSpawned();
  }

  // ── The last star ─────────────────────────────────────────────
  _spawnLastStar() {
    // Collapse aura — starts invisible, grows as star shrinks
    const aura = spawn(mk('ll-collapse-aura'));
    this._auraEl = aura;

    // The star itself
    const star = spawn(mk('ll-star-last ll-star-last--alive'));
    this._starEl = star;
  }

  // ── ~80 distant dying stars ───────────────────────────────────
  _spawnDistantStars(count) {
    const starMap = makeStarMap(count);
    starMap.forEach((s, i) => {
      this._after(i * 40, () => {
        const el  = spawn(mk('ll-star'));
        const sz  = s.sz;
        const col = s.startBright ? '#ffddaa' : '#ff8855';
        el.style.cssText = `
          left:${s.x}%;top:${s.y}%;
          width:${sz}px;height:${sz}px;
          --sc:${col};--sglow:${sz + 2}px;
          --slife:${s.lifeMs}ms;
          --sdly:${i * 40}ms;
          --sbri:${s.startBright ? 0.9 : 0.55};
        `;
        // Remove after life + delay + buffer
        this._after(s.lifeMs + i * 40 + 400, () => el.remove());
      });
    });
  }

  // ── "In the year 10¹⁰⁰..." intro typewriter ──────────────────
  _spawnIntroText() {
    const el  = spawn(mk('ll-intro-text'));
    const cur = document.createElement('span');
    cur.style.cssText = `
      display:inline-block;width:2px;height:1em;
      background:rgba(255,153,51,.6);margin-left:3px;vertical-align:middle;
      animation:llCursorBlink .9s step-end infinite;
    `;
    el.appendChild(cur);

    const TEXT  = 'In the year 10\u00B9\u2070\u2070...';  // superscript 100
    let   idx   = 0;
    const type  = () => {
      if (this.stopped || !el.isConnected) return;
      if (idx < TEXT.length) {
        el.insertBefore(document.createTextNode(TEXT[idx]), cur);
        idx++;
        const delay = 120 + (TEXT[idx-1] === ' ' ? 200 : 0) + (Math.random() > .9 ? 250 : 0);
        this._timers.push(setTimeout(type, delay));
      } else {
        this._after(3000, () => cur.remove());
      }
    };
    this._timers.push(setTimeout(type, 200));
    this._after(8200, () => el.remove());
  }

  // ── 120 cooling ember shards rain down ───────────────────────
  _spawnEmbers(count) {
    const cols    = [LE, LO, '#ffcc44', '#ff7700', LR];
    for (let i = 0; i < count; i++) {
      this._after(i * 22, () => {
        const em  = spawn(mk('ll-ember'));
        const sz  = rnd(3, 14);
        const col = cols[i % cols.length];
        // Burst from center, scatter horizontally, fall with gravity in CSS
        const ex  = rnd(-48, 48);     // vw offset
        const ey  = rnd(-30, 10);     // initial vertical offset
        const dur = rnd(0.9, 2.1);
        const glow = Math.floor(sz * 1.6);
        em.style.cssText = `
          width:${sz}px;height:${sz}px;
          --ec:${col};--eglow:${glow}px;
          --ex:${ex}vw;--ey:${ey}vh;
          animation-duration:${dur}s;
          animation-delay:${i * 22}ms;
        `;
        this._after((dur + 0.4) * 1000 + i * 22, () => em.remove());
      });
    }
  }

  // ── T H E   L A S T   L I G H T label ────────────────────────
  _spawnLabel() {
    const label = spawn(mk('ll-label'));
    const main  = document.createElement('div');
    main.className   = 'll-label-main';
    main.textContent = 'T H E   L A S T   L I G H T';
    const sub   = document.createElement('div');
    sub.className    = 'll-label-sub';
    sub.textContent  = '1 / 400,000  ·  THE UNIVERSE\'S FINAL PHOTON';
    label.appendChild(main);
    label.appendChild(sub);
    this._after(9200, () => label.remove());
  }

  // ── "EVEN ENDINGS HAVE A WITNESS." typewriter ─────────────────
  _spawnTypewriter() {
    const el   = spawn(mk('ll-typewriter'));
    const TEXT = 'EVEN ENDINGS HAVE A WITNESS.';
    const cur  = document.createElement('span');
    cur.className = 'll-cursor';
    el.appendChild(cur);
    let idx = 0;
    const type = () => {
      if (this.stopped || !el.isConnected) return;
      if (idx < TEXT.length) {
        el.insertBefore(document.createTextNode(TEXT[idx]), cur);
        idx++;
        const delay = 95 + (TEXT[idx-1] === ' ' ? 160 : 0) + (Math.random() > .9 ? 200 : 0);
        this._timers.push(setTimeout(type, delay));
      } else {
        this._after(2800, () => cur.remove());
      }
    };
    this._timers.push(setTimeout(type, 400));
    this._after(8000, () => el.remove());
  }

  // ═════════════════════════════════════════════════════════════
  //  W E B   A U D I O   —   E N D   O F   T H E   U N I V E R S E
  // ═════════════════════════════════════════════════════════════

  _audio() {
    if (!this._actx) {
      try { this._actx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch(e) { return null; }
    }
    if (this._actx.state === 'suspended') this._actx.resume();
    return this._actx;
  }

  _beep(ctx, t, freq, dur, vol = 0.1, type = 'sine') {
    try {
      const osc = ctx.createOscillator();
      const g   = ctx.createGain();
      osc.connect(g); g.connect(ctx.destination);
      osc.type = type; osc.frequency.value = freq;
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.start(t); osc.stop(t + dur + 0.01);
    } catch(e) {}
  }

  // The universe's dying hum — 60 Hz, slow decay to silence
  _sfxHum() {
    const ctx = this._audio();
    if (!ctx) return;
    try {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      // Gentle low-pass warmth
      const filt = ctx.createBiquadFilter();
      filt.type  = 'lowpass';
      filt.frequency.value = 200;
      osc.connect(filt); filt.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine'; osc.frequency.value = 60;
      // Slowly fades over entire cutscene — the energy draining away
      const t = ctx.currentTime;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.09, t + 3);
      // Hold through middle section
      gain.gain.setValueAtTime(0.09, t + 10);
      // Drops significantly at collapse
      gain.gain.linearRampToValueAtTime(0.03, t + 14);
      // Briefly near silence during darkness
      gain.gain.linearRampToValueAtTime(0.005, t + 15.2);
      // Final fade out
      gain.gain.linearRampToValueAtTime(0, t + 29);
      osc.start(t); osc.stop(t + 30);
      this._hum = osc;

      // Sub harmonic — 30 Hz, barely felt
      const sub  = ctx.createOscillator();
      const subG = ctx.createGain();
      sub.connect(subG); subG.connect(ctx.destination);
      sub.type = 'sine'; sub.frequency.value = 30;
      subG.gain.setValueAtTime(0, t);
      subG.gain.linearRampToValueAtTime(0.05, t + 4);
      subG.gain.setValueAtTime(0.05, t + 13);
      subG.gain.linearRampToValueAtTime(0, t + 15);
      sub.start(t); sub.stop(t + 15.5);
    } catch(e) {}
  }

  _stopHum() {
    try { if (this._hum) { this._hum.stop(); this._hum = null; } } catch(e) {}
  }

  // Distant pulsar pings — faint, rare, like a sonar in the dark
  _sfxPulsarLoop(remaining) {
    if (remaining <= 0 || this.stopped) return;
    const ctx = this._audio();
    if (!ctx) return;
    const t = ctx.currentTime;
    // Two staggered pings — a dying pulsar's double pulse
    this._beep(ctx, t,       440, 0.35, 0.04, 'sine');
    this._beep(ctx, t,       220, 0.40, 0.025, 'sine');
    this._beep(ctx, t + .22, 330, 0.25, 0.025, 'sine');
    const nextMs = 3800 + Math.random() * 1200;
    this._timers.push(setTimeout(() => this._sfxPulsarLoop(remaining - 1), nextMs));
  }

  // Detonation — warm C major bass chord (not harsh — almost beautiful)
  _sfxDetonate() {
    const ctx = this._audio();
    if (!ctx) return;
    const t = ctx.currentTime;
    // C2=65.4, E2=82.4, G2=98, C3=130.8 — warm major chord
    [[65.4, 0.00, 3.5, 0.18], [82.4, 0.04, 3.2, 0.14],
     [98,   0.08, 2.8, 0.12], [130.8,0.12, 2.4, 0.10]].forEach(([f, off, dur, vol]) => {
      this._beep(ctx, t + off, f, dur, vol, 'sine');
    });
    // Overtone shimmer — like light dispersing
    [[261.6, 0.1, 2.0, 0.06], [329.6, 0.15, 1.6, 0.04],
     [392.0, 0.2, 1.2, 0.03], [523.3, 0.25, 0.9, 0.02]].forEach(([f, off, dur, vol]) => {
      this._beep(ctx, t + off, f, dur, vol, 'sine');
    });
    // Brief percussive noise burst — the physical detonation
    try {
      const bufLen = ctx.sampleRate * 0.18;
      const buf    = ctx.createBuffer(1, bufLen, ctx.sampleRate);
      const data   = buf.getChannelData(0);
      for (let i = 0; i < bufLen; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufLen);
      const src   = ctx.createBufferSource();
      src.buffer  = buf;
      const filt  = ctx.createBiquadFilter();
      filt.type   = 'lowpass'; filt.frequency.value = 280;
      const gN    = ctx.createGain();
      src.connect(filt); filt.connect(gN); gN.connect(ctx.destination);
      gN.gain.setValueAtTime(0.22, t);
      gN.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
      src.start(t); src.stop(t + 0.25);
    } catch(e) {}
  }

  // The last photon — a single pure tone that slowly fades over 8 seconds
  // 880 Hz = A5 — the note of finality
  _sfxFinalTone() {
    const ctx = this._audio();
    if (!ctx) return;
    const t = ctx.currentTime;
    try {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine'; osc.frequency.value = 880;
      // Rises briefly with the flash, then fades away over 8 seconds
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.14, t + 0.4);
      gain.gain.setValueAtTime(0.14, t + 1.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 9.5);
      osc.start(t); osc.stop(t + 9.6);

      // Octave below — the resonance
      const osc2  = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2); gain2.connect(ctx.destination);
      osc2.type = 'sine'; osc2.frequency.value = 440;
      gain2.gain.setValueAtTime(0, t);
      gain2.gain.linearRampToValueAtTime(0.08, t + 0.6);
      gain2.gain.exponentialRampToValueAtTime(0.0001, t + 8.0);
      osc2.start(t); osc2.stop(t + 8.1);
    } catch(e) {}
  }
}