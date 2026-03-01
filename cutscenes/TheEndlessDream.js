// cutscenes/TheEndlessDream.js
// ═══════════════════════════════════════════════════════════════
//  T H E   E N D L E S S   D R E A M  —  1 / 600,000
//  Hybrid: DOM/CSS dream geometry + canvas soft engine + Web Audio pad
//  Inspired by the phrase "The dream where I never die"
//
//  You are in the dream.
//  You have always been in the dream.
//  The ground is above you.
//  The sky is below.
//  You are falling.
//  You have always been falling.
//  You will never reach the ground.
//
//  Phase 0  (0ms)    : Deep indigo void — stardust drifts upward
//  Phase 1  (800ms)  : Dream horizon forms — inverted (ground on top)
//  Phase 2  (1800ms) : Backwards clock materialises — hands counter-spin
//  Phase 3  (3200ms) : "You are falling." — words drift upward after appearing
//  Phase 4  (5500ms) : "You have always been falling." — slower
//  Phase 5  (7500ms) : "You will never reach the ground." — slowest
//  Phase 6  (10000ms): Clock STOPS — 0.8s of held silence
//  Phase 7  (10800ms): Clock SHATTERS — 80 fragment shards
//  Phase 8  (11800ms): DREAM BLOOM — color inversion flash, lavender flood
//  Phase 9  (12500ms): 200 dream petals drift upward on sine-wave paths
//  Phase 10 (14000ms): 6 ghost silhouettes rise and dissolve
//  Phase 11 (16000ms): Canvas — slow dreamlike ray bursts + glow
//  Phase 12 (17500ms): T H E   E N D L E S S   D R E A M label
//  Phase 13 (20500ms): "THE DREAM WHERE I NEVER DIE." — letter by letter
//  Phase 14 (27000ms): Everything dissolves
//  Phase 15 (30000ms): Scene elements removed
//  Phase 16 (35000ms): Resolve
// ═══════════════════════════════════════════════════════════════

import { ParticleBurst, ContinuousParticles } from '../effects/ParticleBurst.js';
import { GlowOverlay, RayBurst }               from '../effects/GlowOverlay.js';

// ── Palette ───────────────────────────────────────────────────
const DV  = '#050010';              // dream void
const DL  = '#c8a0ff';              // dreamlight lavender
const DS  = '#9966ff';              // dream soft purple
const DR  = '#ff88cc';              // dream rose
const DG  = '#fffacc';              // dream pale gold
const DI  = '#1a0050';              // dream deep indigo
const DW  = '#ffffff';              // dream white

const DL_GLOW = 'rgba(200,160,255,0.9)';
const DR_GLOW = 'rgba(255,136,204,0.85)';

// ── CSS ───────────────────────────────────────────────────────
const CSS = `
/* ── Void ── */
.ed-void {
  position:fixed;inset:0;
  background:radial-gradient(ellipse at 50% 60%,${DI} 0%,${DV} 55%,#000008 100%);
  z-index:9990;pointer-events:none;
  opacity:1;transition:opacity 3s ease;
}
.ed-void--fade { opacity:0; }

/* Upward drifting stardust — dreams invert gravity */
.ed-dust {
  position:fixed;border-radius:50%;pointer-events:none;z-index:9991;
  background:var(--dc);
  box-shadow:0 0 var(--dg) var(--dc);
  animation:edDustRise var(--dd) linear infinite;
  animation-delay:var(--dly);
  opacity:0;
}
@keyframes edDustRise {
  0%  {opacity:0;transform:translate(var(--dx),0) scale(.8)}
  10% {opacity:var(--dop)}
  85% {opacity:var(--dop)}
  100%{opacity:0;transform:translate(calc(var(--dx) + var(--dsx)),calc(-105vh)) scale(.5)}
}

/* ── Phase 1: Inverted horizon ── */
.ed-horizon {
  position:fixed;inset:0;pointer-events:none;z-index:9992;
  opacity:0;animation:edHorizonReveal 2s ease forwards;
  animation-delay:.2s;
}
@keyframes edHorizonReveal {
  0%{opacity:0} 100%{opacity:1}
}
.ed-horizon svg { position:absolute;inset:0;width:100%;height:100%; }

/* Ground silhouette — at TOP of screen (inverted) */
.ed-ground-fill {
  fill:rgba(10,0,30,.85);
  opacity:0;animation:edFillIn 1.2s ease forwards;animation-delay:.5s;
}
@keyframes edFillIn { to{opacity:1} }
.ed-horizon-line {
  stroke:rgba(200,160,255,.5);stroke-width:.3px;
  stroke-dasharray:200;stroke-dashoffset:200;
  animation:edLineDraw 1.4s ease-out forwards;animation-delay:.3s;
}
@keyframes edLineDraw { to{stroke-dashoffset:0} }

/* Inverted mountain silhouettes — hanging from top */
.ed-mountain { fill:rgba(15,0,40,.75); }

/* ── Phase 2: Backwards clock ── */
.ed-clock-wrap {
  position:fixed;left:50%;top:50%;
  transform:translate(-50%,-55%);
  pointer-events:none;z-index:9993;
  width:min(22vmin,180px);height:min(22vmin,180px);
  opacity:0;
  animation:edClockReveal 1.8s cubic-bezier(.2,.8,.3,1) forwards;
  animation-delay:.1s;
}
@keyframes edClockReveal {
  0%  {opacity:0;filter:blur(14px);transform:translate(-50%,-55%) scale(.4)}
  60% {opacity:.85;filter:blur(2px);transform:translate(-50%,-55%) scale(1.05)}
  100%{opacity:.85;filter:blur(0);transform:translate(-50%,-55%) scale(1)}
}
.ed-clock-face {
  position:absolute;inset:0;border-radius:50%;
  border:2px solid rgba(200,160,255,.6);
  background:radial-gradient(circle,rgba(10,0,40,.95) 0%,rgba(5,0,20,.98) 70%,rgba(2,0,10,1) 100%);
  box-shadow:
    0 0 20px rgba(153,102,255,.35),
    0 0 55px rgba(153,102,255,.15),
    inset 0 0 25px rgba(153,102,255,.08);
  animation:edClockBreath 4s ease-in-out infinite alternate;
}
@keyframes edClockBreath {
  from{box-shadow:0 0 20px rgba(153,102,255,.35),0 0 55px rgba(153,102,255,.15),inset 0 0 25px rgba(153,102,255,.08)}
  to  {box-shadow:0 0 35px rgba(200,160,255,.55),0 0 90px rgba(153,102,255,.25),inset 0 0 45px rgba(153,102,255,.12)}
}

/* Tick marks */
.ed-tick {
  position:absolute;left:50%;top:4%;
  width:1.5px;height:8%;
  background:rgba(200,160,255,.5);
  transform-origin:50% calc(50vh / 1);
  transform:translateX(-50%) rotate(var(--ta));
}

/* Clock hands */
.ed-hand-minute {
  position:absolute;left:50%;bottom:50%;
  width:2px;height:40%;
  background:linear-gradient(to bottom,transparent,rgba(200,160,255,.9));
  transform-origin:50% 100%;
  border-radius:1px 1px 0 0;
  animation:edHandSpin 8s linear infinite reverse;
  box-shadow:0 0 4px rgba(200,160,255,.5);
}
.ed-hand-hour {
  position:absolute;left:50%;bottom:50%;
  width:2.5px;height:28%;
  background:linear-gradient(to bottom,transparent,rgba(255,136,204,.9));
  transform-origin:50% 100%;
  border-radius:1px 1px 0 0;
  animation:edHandSpin 48s linear infinite reverse;
  box-shadow:0 0 4px rgba(255,136,204,.5);
}
@keyframes edHandSpin {
  from{transform:translateX(-50%) rotate(0deg)}
  to  {transform:translateX(-50%) rotate(360deg)}
}
/* Stopped state — animation paused */
.ed-hand-minute--stop,
.ed-hand-hour--stop {
  animation-play-state:paused !important;
}

/* Center pin */
.ed-clock-center {
  position:absolute;left:50%;top:50%;
  width:7px;height:7px;border-radius:50%;
  transform:translate(-50%,-50%);
  background:${DL};
  box-shadow:0 0 8px ${DL};
}

/* ── Phase 3-5: Dream sentence words ── */
.ed-sentence {
  position:fixed;left:50%;top:62%;
  transform:translateX(-50%);
  pointer-events:none;z-index:10005;
  text-align:center;
  display:flex;flex-wrap:wrap;justify-content:center;align-items:baseline;gap:0;
  max-width:80vw;
  font-family:'Georgia','Times New Roman',serif;font-style:italic;
  font-size:clamp(1rem,2.4vw,1.5rem);
  letter-spacing:.1em;
  color:rgba(220,190,255,.88);
  text-shadow:0 0 18px rgba(160,100,255,.7),0 0 50px rgba(120,60,220,.35);
}

.ed-word {
  display:inline-block;opacity:0;
  animation:edWordDrift var(--dur,150ms) cubic-bezier(0,.1,.3,1) forwards;
  animation-delay:var(--dly,0ms);
}
@keyframes edWordDrift {
  0%  {opacity:0;transform:translateY(12px);filter:blur(8px);letter-spacing:.5em}
  35% {opacity:.6;filter:blur(3px);letter-spacing:.22em}
  100%{opacity:1;transform:translateY(0);filter:blur(0);letter-spacing:.12em}
}

/* After appearing, words continue drifting upward and away */
.ed-word--rise {
  transition:transform 3.5s cubic-bezier(.1,.8,.2,1),
             opacity 3.5s ease;
  transform:translateY(-40px) !important;
  opacity:0 !important;
}

/* ── Phase 7: Shattered clock fragments ── */
.ed-shard {
  position:fixed;left:50vw;top:50vh;
  pointer-events:none;z-index:9994;
  clip-path:polygon(50% 0%,100% 50%,50% 100%,0% 50%);
  animation:edShardFly var(--sdr) ease-out forwards;
}
@keyframes edShardFly {
  0%  {opacity:1;transform:translate(-50%,-55%) rotate(var(--sa)) scale(1.1) translateX(0)}
  65% {opacity:.7;filter:blur(.5px)}
  100%{opacity:0;transform:translate(-50%,-55%) rotate(var(--sa)) scale(.05) translateX(var(--sr))}
}

/* ── Phase 8: Dream bloom inversion flash ── */
.ed-bloom-flash {
  position:fixed;inset:0;pointer-events:none;z-index:10009;
  background:${DL};
  animation:edBloomFlash .9s ease-out forwards;
}
@keyframes edBloomFlash {
  0%  {opacity:0}
  15% {opacity:.82}
  100%{opacity:0}
}
body.ed-inverted { filter:invert(1) hue-rotate(180deg); }

/* ── Phase 9: Dream petals ── */
.ed-petal {
  position:fixed;pointer-events:none;z-index:9993;
  border-radius:50% 50% 50% 50% / 60% 60% 40% 40%;
  animation:edPetalFloat var(--pdr) ease-in-out forwards;
  animation-delay:var(--ply);
}
@keyframes edPetalFloat {
  0%  {opacity:0;transform:translate(var(--px),0) rotate(var(--pro)) scale(.6)}
  12% {opacity:var(--pop)}
  80% {opacity:var(--pop)}
  100%{opacity:0;transform:translate(calc(var(--px) + var(--psx)),calc(-110vh)) rotate(calc(var(--pro) + var(--prr))) scale(.2)}
}

/* ── Phase 10: Ghost silhouettes ── */
.ed-ghost {
  position:fixed;top:55%;pointer-events:none;z-index:9993;
  animation:edGhostRise var(--gdr) ease-in-out forwards;
  animation-delay:var(--gdy);
}
@keyframes edGhostRise {
  0%  {opacity:0;transform:translateY(20px)}
  20% {opacity:var(--gop);transform:translateY(0)}
  75% {opacity:var(--gop)}
  100%{opacity:0;transform:translateY(-60px)}
}
.ed-ghost-body {
  width:18px;height:40px;
  background:linear-gradient(to bottom,var(--gc),transparent);
  border-radius:50% 50% 0 0;
  filter:blur(3px);
}

/* ── Phase 12: Label ── */
.ed-label {
  position:fixed;left:50%;top:50%;
  transform:translate(-50%,-50%);
  pointer-events:none;z-index:10012;
  display:flex;flex-direction:column;align-items:center;gap:16px;
  animation:edLabelReveal 12.5s ease forwards;
}
@keyframes edLabelReveal {
  0%  {opacity:0;transform:translate(-50%,-50%) scale(.5);filter:blur(24px)}
  7%  {opacity:1;transform:translate(-50%,-50%) scale(1.02);filter:blur(0)}
  12% {transform:translate(-50%,-50%) scale(1)}
  80% {opacity:1}
  100%{opacity:0}
}

.ed-label-main {
  font-family:'Georgia','Times New Roman',serif;
  font-size:34px;font-weight:400;letter-spacing:16px;
  color:${DL};
  text-shadow:
    0 0 8px ${DL},0 0 25px rgba(200,160,255,.8),
    0 0 70px rgba(153,102,255,.5),0 0 160px rgba(120,60,220,.25);
  border:1px solid rgba(200,160,255,.35);
  padding:20px 52px;
  background:rgba(3,0,12,.97);
  box-shadow:
    0 0 50px rgba(153,102,255,.3),
    0 0 120px rgba(120,60,220,.15),
    inset 0 0 40px rgba(153,102,255,.05);
  /* Soft pulse — like breathing in a dream */
  animation:edLabelDream 5s ease-in-out infinite alternate;
  /* Slightly blurred border — dreaming edges */
  filter:drop-shadow(0 0 14px rgba(153,102,255,.4));
}
@keyframes edLabelDream {
  from{
    text-shadow:0 0 8px ${DL},0 0 25px rgba(200,160,255,.8),0 0 70px rgba(153,102,255,.5),0 0 160px rgba(120,60,220,.25);
    filter:drop-shadow(0 0 14px rgba(153,102,255,.4));
    border-color:rgba(200,160,255,.35);
  }
  to{
    text-shadow:0 0 16px ${DW},0 0 45px ${DL},0 0 120px rgba(153,102,255,.7),0 0 280px rgba(120,60,220,.35);
    filter:drop-shadow(0 0 28px rgba(200,160,255,.65));
    border-color:rgba(220,185,255,.6);
  }
}

.ed-label-sub {
  font-family:'Georgia','Times New Roman',serif;font-style:italic;
  font-size:10px;letter-spacing:5px;
  color:rgba(180,140,240,.45);
  text-shadow:0 0 8px rgba(120,60,220,.35);
}

/* ── Phase 13: Typewriter ── */
.ed-typewriter {
  position:fixed;left:50%;top:calc(50% + 84px);
  transform:translateX(-50%);
  pointer-events:none;z-index:10013;
  font-family:'Georgia','Times New Roman',serif;font-style:italic;
  font-size:15px;letter-spacing:7px;
  color:rgba(220,185,255,.8);
  text-shadow:0 0 12px rgba(153,102,255,.5);
  white-space:nowrap;
  animation:edTypeReveal 13.5s ease forwards;
}
@keyframes edTypeReveal {
  0%{opacity:0} 4%{opacity:1} 85%{opacity:1} 100%{opacity:0}
}

/* Each typed character fades in with a blur */
.ed-char {
  display:inline;
  animation:edCharIn .4s ease forwards;
}
@keyframes edCharIn {
  0%  {opacity:0;filter:blur(6px);letter-spacing:.3em}
  100%{opacity:1;filter:blur(0);letter-spacing:inherit}
}

.ed-cursor {
  display:inline-block;width:2px;height:1em;
  background:rgba(200,160,255,.6);margin-left:2px;vertical-align:middle;
  box-shadow:0 0 5px rgba(153,102,255,.5);
  animation:edCursorBlink 1.1s step-end infinite;
}
@keyframes edCursorBlink { 0%,100%{opacity:1} 50%{opacity:0} }

/* ── Soft shake on clock shatter ── */
@keyframes edShatterShake {
  0%,100%{transform:translate(0,0)}
  10%{transform:translate(-6px,7px)}  22%{transform:translate(6px,-6px)}
  34%{transform:translate(-7px,5px)}  46%{transform:translate(6px,-6px)}
  58%{transform:translate(-4px,5px)}  70%{transform:translate(4px,-4px)}
  82%{transform:translate(-3px,3px)}  92%{transform:translate(2px,-2px)}
}
body.ed-shatter { animation:edShatterShake .5s ease-out; }
`;

function injectCSS() {
  if (document.getElementById('ed-styles')) return;
  const s = document.createElement('style');
  s.id = 'ed-styles';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function mk(cls) { const el = document.createElement('div'); el.className = cls; return el; }
let _spawned = [];
function spawn(el)    { _spawned.push(el); document.body.appendChild(el); return el; }
function killSpawned(){ _spawned.forEach(e => e.remove()); _spawned = []; }
function rnd(lo, hi)  { return lo + Math.random() * (hi - lo); }

const WORD_FADE_MS     = 150;
const SENTENCE_FADE_MS = 220;

const SENTENCES = [
  { text: 'You are falling.',                   msPerWord: 320,  hold: 900,  gap: 500 },
  { text: 'You have always been falling.',      msPerWord: 360,  hold: 1000, gap: 600 },
  { text: 'You will never reach the ground.',   msPerWord: 420,  hold: 1400, gap: 0   },
];

// ══════════════════════════════════════════════════════════════
export class TheEndlessDream {
  constructor(engine, rarity) {
    this.engine      = engine;
    this.rarity      = rarity;
    this.stopped     = false;
    this._timers     = [];
    this._actx       = null;
    this._padNode    = null;
    this._tickTimer  = null;
    this._minuteHand = null;
    this._hourHand   = null;
    this._clockWrap  = null;
    this.fx = {
      shakeIntensity: 40,
      particleCount:  240,
      rayCount:       44,
      glowMaxAlpha:   0.88,
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

      // ── Phase 0: Deep indigo void + upward stardust ──────────
      const voidEl = spawn(mk('ed-void'));
      this._after(27000, () => voidEl.classList.add('ed-void--fade'));
      this._after(30000, () => voidEl.remove());

      // Fade all persistent scene elements before void lifts
      this._after(25500, () => {
        document.querySelectorAll('.ed-clock-wrap,.ed-horizon,.ed-ghost')
          .forEach(el => { el.style.transition = 'opacity 1.8s ease'; el.style.opacity = '0'; });
      });

      this._spawnDust(70);
      this._sfxPad();

      // ── Phase 1: Inverted horizon ────────────────────────────
      this._after(800, () => this._spawnHorizon());

      // ── Phase 2: Backwards clock ─────────────────────────────
      this._after(1800, () => this._spawnClock());

      // Clock ticking starts after clock appears
      this._after(2800, () => this._startTicking());

      // ── Phases 3–5: Three dream sentences ────────────────────
      let cursor = 3200;
      SENTENCES.forEach((s, idx) => {
        const words       = s.text.split(' ');
        const typeDur     = words.length * s.msPerWord;
        const totalVis    = typeDur + WORD_FADE_MS + s.hold;
        const sentenceEnd = totalVis + SENTENCE_FADE_MS;
        this._after(cursor, () => this._showSentence(s.text, s.msPerWord, s.hold));
        cursor += sentenceEnd + (s.gap || 0);
      });

      // ── Phase 6: Clock stops ──────────────────────────────────
      this._after(10000, () => {
        this._stopTicking();
        if (this._minuteHand) this._minuteHand.classList.add('ed-hand-minute--stop');
        if (this._hourHand)   this._hourHand.classList.add('ed-hand-hour--stop');
        this._sfxStopChime();
      });

      // ── Phase 7: Clock shatters ───────────────────────────────
      this._after(10800, () => {
        this._spawnClockShards(80);
        if (this._clockWrap) {
          this._clockWrap.style.transition = 'opacity .3s ease, transform .3s ease';
          this._clockWrap.style.opacity    = '0';
          this._clockWrap.style.transform  = 'translate(-50%,-55%) scale(1.2)';
        }
        document.body.classList.add('ed-shatter');
        this._after(550, () => document.body.classList.remove('ed-shatter'));
        this.engine.shake(this.fx.shakeIntensity);
        this._sfxShatter();
      });

      // ── Phase 8: Dream bloom ─────────────────────────────────
      this._after(11800, () => {
        spawn(mk('ed-bloom-flash'));
        // Brief body inversion
        document.body.classList.add('ed-inverted');
        this._after(300, () => document.body.classList.remove('ed-inverted'));
        this._after(1000, () => document.querySelector('.ed-bloom-flash')?.remove());
        this._sfxBloom();
      });

      // ── Phase 9: Dream petals ─────────────────────────────────
      this._after(12500, () => this._spawnPetals(200));

      // ── Phase 10: Ghost silhouettes ───────────────────────────
      this._after(14000, () => this._spawnGhosts(6));

      // ── Phase 11: Canvas — slow dreamlike rays + glow ─────────
      this._after(16000, () => {
        const dreamCols = [DS, DR, DL, '#aa77ff', '#ff99dd', DG];
        dreamCols.forEach((col, i) => {
          this._after(i * 160, () => {
            this.engine.addEffect(new RayBurst({
              color:    col,
              duration: 16000,
              maxAlpha: 0.16 - i * 0.02,
              rayCount: Math.floor(this.fx.rayCount * (1.1 - i * 0.1)),
              // Dreamy slow rotation — much slower than any other cutscene
              rotSpeed: i % 2 === 0 ? 0.08 + i * 0.015 : -(0.06 + i * 0.012),
            }));
          });
        });

        this.engine.addEffect(new GlowOverlay({
          color: DL_GLOW, duration: 16000, maxAlpha: this.fx.glowMaxAlpha,
          fadeIn: 0.06, fadeOut: 0.25, radial: true, pulseSpeed: 0.6,
        }));
        this.engine.addEffect(new GlowOverlay({
          color: DR_GLOW, duration: 14000, maxAlpha: 0.5,
          fadeIn: 0.08, fadeOut: 0.3, radial: true, pulseSpeed: 0.4,
        }));

        // Soft particle bursts — gentle, not explosive
        [[DL, 1.0], [DR, 0.75], [DG, 0.55]].forEach(([col, scale], i) => {
          this._after(i * 200, () => {
            this.engine.addEffect(new ParticleBurst(0.5, 0.5, {
              count:    Math.floor(this.fx.particleCount * scale),
              color:    col,
              minSpeed: 30 + i * 40,    // much slower than other cutscenes
              maxSpeed: 200 + i * 30,
              minSize:  2,  maxSize: 10,
              gravity:  -20,            // slight upward bias — dream gravity
              trail:    true, glow: true,
              duration: 14000,
              type:     'star',
            }));
          });
        });

        // Continuous upward dream dust from all directions
        this.engine.addEffect(new ContinuousParticles({
          ox: 0.5, oy: 0.9,
          color:     DL,
          minSpeed:  25,  maxSpeed: 100,
          gravity:   -40, upBias:   80,
          spread:    Math.PI * 2, angle: -Math.PI / 2,
          minSize:   1,   maxSize:  5,
          trail:     true, glow:    true,
          spawnRate: 0.04,
          duration:  14000,
          type:      'star',
        }));
      });

      // ── Phase 12: Label ───────────────────────────────────────
      this._after(17500, () => this._spawnLabel());

      // ── Phase 13: Typewriter ──────────────────────────────────
      this._after(20500, () => this._spawnTypewriter());

      // ── Phase 16: Resolve ─────────────────────────────────────
      this._after(35000, () => {
        killSpawned();
        this._stopPad();
        if (this._actx) { try { this._actx.close(); } catch(e){} }
        resolve();
      });
    });
  }

  stop() {
    this.stopped = true;
    this._timers.forEach(clearTimeout);
    this._timers = [];
    document.body.classList.remove('ed-inverted', 'ed-shatter');
    clearInterval(this._tickTimer);
    this._stopPad();
    if (this._actx) { try { this._actx.close(); } catch(e){} }
    killSpawned();
  }

  // ── Phase 0: Upward stardust — gravity is inverted here ──────
  _spawnDust(count) {
    const dustCols = [DL, DS, DR, DG, DW];
    for (let i = 0; i < count; i++) {
      const dust = spawn(mk('ed-dust'));
      const sz   = rnd(1, 3);
      const col  = dustCols[i % dustCols.length];
      const dur  = rnd(4, 10);
      dust.style.cssText = `
        width:${sz}px;height:${sz}px;
        left:${rnd(0, 100)}%;
        bottom:${rnd(-10, 20)}%;
        --dc:${col};--dg:${sz + 1}px;
        --dd:${dur}s;
        --dly:${rnd(0, dur)}s;
        --dx:${rnd(-12, 12)}vw;
        --dsx:${rnd(-6, 6)}vw;
        --dop:${rnd(0.3, 0.8)};
      `;
    }
  }

  // ── Phase 1: Inverted horizon ─────────────────────────────────
  _spawnHorizon() {
    const layer = spawn(mk('ed-horizon'));
    const svg   = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';

    // Ground fill at TOP — inverted world
    const ground = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    ground.setAttribute('x','0'); ground.setAttribute('y','0');
    ground.setAttribute('width','100'); ground.setAttribute('height','18');
    ground.className.baseVal = 'ed-ground-fill';
    svg.appendChild(ground);

    // Horizon line near top
    const hline = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    hline.setAttribute('x1','0'); hline.setAttribute('y1','18');
    hline.setAttribute('x2','100'); hline.setAttribute('y2','18');
    hline.className.baseVal = 'ed-horizon-line';
    svg.appendChild(hline);

    // Inverted mountain silhouettes — hanging downward from top
    const mtnPaths = [
      'M 12 0 L 24 16 L 36 0 Z',
      'M 32 0 L 47 18 L 62 0 Z',
      'M 58 0 L 72 15 L 86 0 Z',
    ];
    mtnPaths.forEach((d, i) => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', d);
      path.className.baseVal = 'ed-mountain';
      path.style.opacity = '0';
      path.style.animation = `edFillIn ${0.9 + i * 0.2}s ease forwards`;
      path.style.animationDelay = `${0.5 + i * 0.15}s`;
      svg.appendChild(path);
    });

    // Subtle stars in the "sky" (bottom portion) — still drifting upward
    for (let i = 0; i < 28; i++) {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', rnd(2, 98) + '');
      circle.setAttribute('cy', rnd(22, 98) + '');
      circle.setAttribute('r', rnd(0.15, 0.45) + '');
      circle.style.fill = `rgba(200,160,255,${rnd(0.2, 0.7)})`;
      circle.style.opacity = '0';
      circle.style.animation = `edFillIn ${rnd(0.5, 1.5)}s ease forwards`;
      circle.style.animationDelay = `${rnd(0.3, 1.5)}s`;
      svg.appendChild(circle);
    }

    layer.appendChild(svg);
    this._after(18000, () => layer.remove());
  }

  // ── Phase 2: Backwards clock ──────────────────────────────────
  _spawnClock() {
    const wrap = spawn(mk('ed-clock-wrap'));
    this._clockWrap = wrap;

    const face   = document.createElement('div'); face.className = 'ed-clock-face';
    const center = document.createElement('div'); center.className = 'ed-clock-center';
    const minH   = document.createElement('div'); minH.className = 'ed-hand-minute';
    const hourH  = document.createElement('div'); hourH.className = 'ed-hand-hour';
    this._minuteHand = minH;
    this._hourHand   = hourH;

    // 12 tick marks
    for (let i = 0; i < 12; i++) {
      const tick = document.createElement('div');
      tick.className = 'ed-tick';
      tick.style.setProperty('--ta', (i * 30) + 'deg');
      // Longer ticks at 12, 3, 6, 9
      if (i % 3 === 0) tick.style.height = '12%';
      face.appendChild(tick);
    }

    face.appendChild(minH);
    face.appendChild(hourH);
    face.appendChild(center);
    wrap.appendChild(face);

    this._after(13000, () => wrap.remove());
  }

  // ── Clock tick — sharp click every 1.4s ──────────────────────
  _startTicking() {
    if (this.stopped) return;
    this._sfxTick();
    this._tickTimer = setInterval(() => {
      if (this.stopped) { clearInterval(this._tickTimer); return; }
      this._sfxTick();
    }, 1400);
  }

  _stopTicking() {
    clearInterval(this._tickTimer);
    this._tickTimer = null;
  }

  // ── Phases 3–5: Dream sentence word-by-word ───────────────────
  _showSentence(text, msPerWord, hold) {
    const container = spawn(mk('ed-sentence'));
    const words     = text.split(' ');

    words.forEach((word, i) => {
      const span = document.createElement('span');
      span.className = 'ed-word';
      span.textContent = word + (i < words.length - 1 ? '\u00A0' : '');
      span.style.setProperty('--dly',  `${i * msPerWord}ms`);
      span.style.setProperty('--dur',  `${WORD_FADE_MS}ms`);
      container.appendChild(span);
    });

    const lastIn = (words.length - 1) * msPerWord + WORD_FADE_MS;

    // After hold: words drift upward and fade (dream-like dissolution)
    this._after(lastIn + hold, () => {
      container.querySelectorAll('.ed-word').forEach(w => w.classList.add('ed-word--rise'));
      this._after(SENTENCE_FADE_MS + 60, () => container.remove());
    });
  }

  // ── Phase 7: 80 clock fragment shards ────────────────────────
  _spawnClockShards(count) {
    const cols = [DL, DS, DR, DG, DW, 'rgba(200,160,255,.5)'];
    for (let i = 0; i < count; i++) {
      this._after(i * 10, () => {
        const shard = spawn(mk('ed-shard'));
        const sz    = rnd(3, 12);
        const ang   = rnd(0, 360);
        const dist  = rnd(15, 45);
        const dur   = rnd(0.55, 1.2);
        shard.style.cssText = `
          width:${sz}px;height:${sz}px;
          background:${cols[i % cols.length]};
          box-shadow:0 0 ${sz}px ${cols[i % cols.length]};
          --sa:${ang}deg;--sr:${dist}vmin;
          animation-duration:${dur}s;
          animation-delay:${i * 10}ms;
        `;
        this._after((dur + 0.3) * 1000 + i * 10, () => shard.remove());
      });
    }
  }

  // ── Phase 9: 200 dream petals drifting upward ────────────────
  _spawnPetals(count) {
    const petalCols = [
      `rgba(200,160,255,var(--pop))`,
      `rgba(255,136,204,var(--pop))`,
      `rgba(255,250,204,var(--pop))`,
      `rgba(153,102,255,var(--pop))`,
      `rgba(255,200,230,var(--pop))`,
    ];
    for (let i = 0; i < count; i++) {
      this._after(i * 35, () => {
        const petal = spawn(mk('ed-petal'));
        const w     = rnd(4, 16);
        const h     = w * rnd(0.4, 0.8);
        const col   = [`rgba(200,160,255`, `rgba(255,136,204`, `rgba(255,250,204`, `rgba(153,102,255`, `rgba(255,200,230`][i % 5];
        const opacity = rnd(0.25, 0.65);
        const dur   = rnd(3.5, 8);
        petal.style.cssText = `
          width:${w}px;height:${h}px;
          left:${rnd(0,100)}%;
          bottom:${rnd(-5,15)}%;
          background:${col},${opacity});
          box-shadow:0 0 ${w}px ${col},.35);
          --pdr:${dur}s;
          --ply:${i * 35}ms;
          --px:${rnd(-8,8)}vw;
          --psx:${rnd(-15,15)}vw;
          --pro:${rnd(0,360)}deg;
          --prr:${rnd(120,360)}deg;
          --pop:${opacity};
        `;
        this._after((dur + 0.4) * 1000 + i * 35, () => petal.remove());
      });
    }
  }

  // ── Phase 10: 6 ghost silhouettes rising and dissolving ───────
  _spawnGhosts(count) {
    // Symmetric positions — 3 left, 3 right of center
    const positions = [18, 30, 42, 58, 70, 82];
    const ghostCols = [DL, DS, DR, DL, DS, DR];
    for (let i = 0; i < count; i++) {
      const ghost = spawn(mk('ed-ghost'));
      const dur   = rnd(4, 7);
      const body  = document.createElement('div');
      body.className = 'ed-ghost-body';
      const opacity = rnd(0.2, 0.45);
      ghost.style.cssText = `
        left:${positions[i]}%;
        --gdr:${dur}s;
        --gdy:${i * 200}ms;
        --gop:${opacity};
        --gc:${ghostCols[i % ghostCols.length]};
      `;
      body.style.setProperty('--gc', ghostCols[i % ghostCols.length]);
      ghost.appendChild(body);
      this._after((dur + 0.5) * 1000 + i * 200, () => ghost.remove());
    }
  }

  // ── Label ─────────────────────────────────────────────────────
  _spawnLabel() {
    const label = spawn(mk('ed-label'));
    const main  = document.createElement('div');
    main.className   = 'ed-label-main';
    main.textContent = 'T H E   E N D L E S S   D R E A M';
    const sub   = document.createElement('div');
    sub.className    = 'ed-label-sub';
    sub.textContent  = '1 / 600,000  ·  FALLING  ·  FOREVER';
    label.appendChild(main);
    label.appendChild(sub);
    this._after(12200, () => label.remove());
  }

  // ── "THE DREAM WHERE I NEVER DIE." typewriter ─────────────────
  // No chime sound — silence feels more like a dream
  _spawnTypewriter() {
    const el   = spawn(mk('ed-typewriter'));
    const TEXT = 'THE DREAM WHERE I NEVER DIE.';
    const cur  = document.createElement('span');
    cur.className = 'ed-cursor';
    el.appendChild(cur);

    let idx = 0;
    const type = () => {
      if (this.stopped || !el.isConnected) return;
      if (idx < TEXT.length) {
        // Each character gets its own span for the blur-in animation
        const span = document.createElement('span');
        span.className = 'ed-char';
        span.textContent = TEXT[idx];
        el.insertBefore(span, cur);
        idx++;
        // Variable delay — some characters hesitate, like a dream thought forming
        const isSpace  = TEXT[idx - 1] === ' ';
        const isPause  = TEXT[idx - 1] === '.';
        const hesitate = Math.random() > 0.88;
        const delay = isPause ? 700
                    : isSpace ? 260
                    : hesitate ? 140 + Math.random() * 220
                    : 140 + Math.random() * 40;
        this._timers.push(setTimeout(type, delay));
      } else {
        this._after(3500, () => cur.remove());
      }
    };
    // First character has a long pause — dream thought assembling
    this._timers.push(setTimeout(type, 900));
    this._after(13000, () => el.remove());
  }

  // ═════════════════════════════════════════════════════════════
  //  W E B   A U D I O   —   D R E A M   A T M O S P H E R E
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

  // Cm7 dream pad — C3+Eb3+G3+Bb3, 28s sustained, very soft
  _sfxPad() {
    const ctx = this._audio();
    if (!ctx) return;
    // Cm7 voicing: C3=130.8, Eb3=155.6, G3=196, Bb3=233.1
    const chord = [
      [130.8, 0.0],
      [155.6, 0.1],
      [196.0, 0.2],
      [233.1, 0.3],
      // Octave softer doublings
      [65.4,  0.0],   // C2
      [392.0, 0.5],   // G4 — high shimmer
    ];
    const vols = [0.065, 0.055, 0.05, 0.05, 0.04, 0.025];
    const t = ctx.currentTime;
    chord.forEach(([freq, off], i) => {
      try {
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'sine'; osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, t + off);
        gain.gain.linearRampToValueAtTime(vols[i], t + off + 3.5);
        gain.gain.setValueAtTime(vols[i], t + 24);
        gain.gain.linearRampToValueAtTime(0, t + 34);
        osc.start(t + off); osc.stop(t + 35);
        if (i === 0) this._padNode = osc;
      } catch(e) {}
    });

    // Soft breath noise — filtered white noise like wind through dreamspace
    try {
      const bufLen = ctx.sampleRate * 35;
      const buf    = ctx.createBuffer(1, bufLen, ctx.sampleRate);
      const data   = buf.getChannelData(0);
      for (let k = 0; k < bufLen; k++) data[k] = Math.random() * 2 - 1;
      const src  = ctx.createBufferSource(); src.buffer = buf;
      const bp   = ctx.createBiquadFilter();
      bp.type    = 'bandpass'; bp.frequency.value = 800; bp.Q.value = 0.8;
      const gain = ctx.createGain();
      src.connect(bp); bp.connect(gain); gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.03, t + 4);
      // Slow breath swell — amplitude oscillates every ~6s
      gain.gain.setValueAtTime(0.03, t + 10);
      gain.gain.linearRampToValueAtTime(0.055, t + 16);
      gain.gain.linearRampToValueAtTime(0.02,  t + 22);
      gain.gain.linearRampToValueAtTime(0.04,  t + 28);
      gain.gain.linearRampToValueAtTime(0,     t + 34);
      src.start(t); src.stop(t + 35);
    } catch(e) {}
  }

  _stopPad() {
    try { if (this._padNode) { this._padNode.stop(); this._padNode = null; } } catch(e) {}
  }

  // Clock tick — very short sharp click at 2000 Hz
  _sfxTick() {
    const ctx = this._audio();
    if (!ctx) return;
    const t = ctx.currentTime;
    // 2-part click: sharp sine transient + sub thump
    this._beep(ctx, t, 2000, 0.035, 0.04, 'sine');
    this._beep(ctx, t, 200,  0.08,  0.025, 'sine');
  }

  // Clock stop — one soft descending tone
  _sfxStopChime() {
    const ctx = this._audio();
    if (!ctx) return;
    const t = ctx.currentTime;
    // E4 → B3 descending minor third — unresolved, unsettling
    this._beep(ctx, t,      329.6, 0.6, 0.08, 'sine');
    this._beep(ctx, t + .5, 246.9, 1.2, 0.07, 'sine');
    // Echo
    this._beep(ctx, t + 1.1, 329.6, 0.3, 0.03, 'sine');
    this._beep(ctx, t + 1.5, 246.9, 0.5, 0.025, 'sine');
  }

  // Clock shatter — noise burst, glass-like
  _sfxShatter() {
    const ctx = this._audio();
    if (!ctx) return;
    const t   = ctx.currentTime;
    // High-frequency crackle
    try {
      const bufLen = Math.floor(ctx.sampleRate * 0.3);
      const buf    = ctx.createBuffer(1, bufLen, ctx.sampleRate);
      const d      = buf.getChannelData(0);
      for (let k = 0; k < bufLen; k++) d[k] = (Math.random()*2-1) * Math.pow(1 - k/bufLen, 2.5);
      const src  = ctx.createBufferSource(); src.buffer = buf;
      const hp   = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 2500;
      const g    = ctx.createGain();
      src.connect(hp); hp.connect(g); g.connect(ctx.destination);
      g.gain.setValueAtTime(0.18, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
      src.start(t); src.stop(t + 0.4);
    } catch(e) {}
    // Sub thud for impact weight
    this._beep(ctx, t, 80,  0.25, 0.12, 'sine');
    this._beep(ctx, t, 120, 0.18, 0.08, 'sine');
  }

  // Dream bloom chord — F major rising: F3+A3+C4, warm and brief
  // The one moment of warmth before the dream fully takes hold
  _sfxBloom() {
    const ctx = this._audio();
    if (!ctx) return;
    const t = ctx.currentTime;
    // F3=174.6, A3=220, C4=261.6
    [[174.6, 0.0, 2.2, 0.09],
     [220.0, 0.1, 2.0, 0.08],
     [261.6, 0.2, 1.8, 0.07],
     [349.2, 0.35, 1.5, 0.05], // F4 shimmer
    ].forEach(([f, off, dur, vol]) => {
      this._beep(ctx, t + off, f, dur, vol, 'sine');
    });
  }
}