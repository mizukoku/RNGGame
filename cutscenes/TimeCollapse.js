// cutscenes/TimeCollapse.js
// ═══════════════════════════════════════════════════════════════
//  T I M E   C O L L A P S E  —  1 / 75,000
//  Hybrid: DOM/CSS + canvas particle engine
//
//  "Time is a flat circle. Everything we have done or will do,
//   we will do over and over and over again — forever."
//
//  Phase 0  (0ms)    : Temporal void — breathing midnight blue + scanlines
//  Phase 1  (300ms)  : Analog clock materializes — 60 ticks, roman numerals
//  Phase 2  (700ms)  : Clock hands spin backwards, accelerating
//  Phase 3  (1400ms) : Time freeze — ice-blue flash + chromatic aberration
//  Phase 4  (1800ms) : 40 timestamp echoes drift outward
//  Phase 5  (2300ms) : 60 time shards explode from center
//  Phase 6  (2800ms) : 12 horizontal timeline fractures sweep the screen
//  Phase 7  (3400ms) : Temporal vortex — conic-gradient disc erupts
//  Phase 8  (4100ms) : PARADOX BURST — white supernova + heaviest shake
//  Phase 9  (4800ms) : 10 timeline rings cascade outward
//  Phase 10 (5400ms) : 30 timestamp streams scroll on edges
//  Phase 11 (6200ms) : Hourglass rises — sand particle stream flows
//  Phase 12 (7200ms) : Canvas — cyan+gold ray bursts, particle storm
//  Phase 13 (8200ms) : C H R O N O S label + chronal aura rings
//  Phase 14 (10000ms): "TIME IS NOT LINEAR" typewriter in gold
//  Phase 15 (14500ms): Void fades
//  Phase 16 (18000ms): Resolve
// ═══════════════════════════════════════════════════════════════

import { ParticleBurst, ContinuousParticles } from '../effects/ParticleBurst.js';
import { GlowOverlay, RayBurst }               from '../effects/GlowOverlay.js';

// ── Palette ───────────────────────────────────────────────────
const C1 = '#64c8ff';              // temporal cyan-blue
const C2 = '#ffd700';              // clock gold
const C3 = '#a8d8ff';              // pale blue
const C4 = '#ffffff';              // paradox white
const CR = '#ff3366';              // second-hand red
const C1_GLOW = 'rgba(100,200,255,0.9)';
const C2_GLOW = 'rgba(255,215,0,0.8)';

// Timestamps scattered as echoes
const ECHO_TIMES = [
  '12:00:00','03:15:22','06:30:45','09:45:01',
  '11:11:11','23:59:59','00:00:00','13:37:00',
  '04:20:00','16:20:16','21:00:00','18:30:30',
  '∞:∞:∞','--:--:--','??:??:??','88:88:88',
];

// ── CSS injected once ─────────────────────────────────────────
const CSS = `
/* ── Phase 0: Temporal void ── */
.tc-void {
  position:fixed;inset:0;
  background:radial-gradient(ellipse at 50% 42%,#000c1a 0%,#000510 40%,#000 100%);
  z-index:9990;pointer-events:none;
  opacity:1;transition:opacity 1.8s ease;
}
.tc-void--fade { opacity:0; }

/* Void breath */
.tc-void::after {
  content:'';position:absolute;inset:0;
  background:radial-gradient(ellipse at 50% 50%,rgba(100,200,255,.12) 0%,transparent 55%);
  animation:tcBreath 2.8s ease-in-out infinite;
}
@keyframes tcBreath {
  0%,100%{transform:scale(1);opacity:.4}
  50%    {transform:scale(1.2);opacity:1}
}

/* Chronal scanlines */
.tc-scanlines {
  position:fixed;inset:0;pointer-events:none;z-index:10019;
  background:repeating-linear-gradient(0deg,
    rgba(0,0,0,.12),rgba(0,0,0,.12) 1px,
    transparent 1px,transparent 2px);
  animation:tcScanScroll 8s linear infinite;
}
@keyframes tcScanScroll { 0%{transform:translateY(0)} 100%{transform:translateY(4px)} }

/* ── Phase 1: Clock face ── */
.tc-clock {
  position:fixed;left:50%;top:50%;
  width:380px;height:380px;border-radius:50%;
  transform:translate(-50%,-50%);
  pointer-events:none;z-index:9995;
  border:5px solid rgba(255,215,0,.85);
  background:radial-gradient(circle,
    rgba(0,18,38,.92) 0%,rgba(0,6,18,.97) 70%,rgba(0,0,0,1) 100%);
  box-shadow:
    0 0 40px 8px rgba(255,215,0,.55),
    0 0 90px 20px rgba(255,215,0,.3),
    0 0 180px 40px rgba(100,200,255,.15),
    inset 0 0 60px rgba(255,215,0,.12);
  animation:tcClockAppear .9s cubic-bezier(.2,1.2,.3,1) forwards;
  opacity:0;
}
@keyframes tcClockAppear {
  from{opacity:0;transform:translate(-50%,-50%) scale(.2);filter:blur(22px)}
  to  {opacity:1;transform:translate(-50%,-50%) scale(1);filter:blur(0)}
}

/* Tick marks — 60 of them, placed via JS */
.tc-tick {
  position:absolute;left:50%;top:50%;
  transform-origin:0 0;
  background:rgba(255,215,0,.55);
  border-radius:1px;
}
.tc-tick--major {
  background:rgba(255,215,0,.95);
  box-shadow:0 0 6px rgba(255,215,0,.7);
}

/* Roman numeral stations */
.tc-numeral {
  position:absolute;
  font-family:'Times New Roman',serif;
  font-size:22px;font-weight:700;
  color:rgba(255,215,0,.9);
  text-shadow:0 0 10px rgba(255,215,0,.8);
  transform:translate(-50%,-50%);
  pointer-events:none;
}

/* Center jewel */
.tc-center {
  position:absolute;left:50%;top:50%;
  width:18px;height:18px;border-radius:50%;
  transform:translate(-50%,-50%);
  background:radial-gradient(circle,#fff 0%,${C2} 50%,rgba(255,180,0,.5) 100%);
  box-shadow:0 0 18px ${C2},0 0 40px rgba(255,215,0,.5);
  z-index:3;
}

/* ── Phase 2: Clock hands ── */
.tc-hand {
  position:absolute;left:50%;bottom:50%;
  border-radius:3px 3px 0 0;
  transform-origin:bottom center;
  z-index:2;
}
.tc-hand--hour {
  width:8px;height:110px;margin-left:-4px;
  background:linear-gradient(180deg,${C2} 0%,rgba(255,180,0,.7) 100%);
  box-shadow:0 0 10px rgba(255,215,0,.7);
  animation:tcHourReverse 3s cubic-bezier(.4,0,.6,1) forwards;
}
@keyframes tcHourReverse {
  from{transform:rotate(90deg)}
  to  {transform:rotate(-630deg)}
}
.tc-hand--minute {
  width:5px;height:155px;margin-left:-2.5px;
  background:linear-gradient(180deg,${C1} 0%,rgba(100,180,255,.7) 100%);
  box-shadow:0 0 10px rgba(100,200,255,.7);
  animation:tcMinReverse 2.2s cubic-bezier(.3,0,.7,1) forwards;
}
@keyframes tcMinReverse {
  from{transform:rotate(180deg)}
  to  {transform:rotate(-1440deg)}
}
.tc-hand--second {
  width:2px;height:175px;margin-left:-1px;
  background:${CR};
  box-shadow:0 0 8px ${CR};
  animation:tcSecReverse 1.6s linear forwards;
}
@keyframes tcSecReverse {
  from{transform:rotate(270deg)}
  to  {transform:rotate(-2520deg)}
}

/* ── Phase 3: Time freeze ── */
.tc-freeze {
  position:fixed;inset:0;pointer-events:none;z-index:9998;
  animation:tcFreeze .65s ease-out forwards;
}
@keyframes tcFreeze {
  0%  {opacity:0;transform:scaleX(0)}
  30% {opacity:1;transform:scaleX(1)}
  100%{opacity:0;transform:scaleX(1)}
}
/* RGB chromatic aberration channels */
.tc-aberr-r {
  position:fixed;inset:0;pointer-events:none;z-index:9997;
  mix-blend-mode:screen;
  animation:tcAberrR .55s steps(6) forwards;
}
@keyframes tcAberrR {
  0%  {background:transparent}
  25% {background:rgba(255,0,0,.06);transform:translate(-6px,2px)}
  50% {background:transparent}
  75% {background:rgba(0,0,255,.06);transform:translate(6px,-2px)}
  100%{background:transparent}
}
.tc-aberr-g {
  position:fixed;inset:0;pointer-events:none;z-index:9996;
  mix-blend-mode:screen;
  animation:tcAberrG .55s steps(6) forwards;
}
@keyframes tcAberrG {
  0%  {background:transparent}
  33% {background:rgba(0,255,0,.04);transform:translate(3px,4px)}
  66% {background:transparent;transform:translate(-3px,-4px)}
  100%{background:transparent}
}

/* ── Phase 4: Timestamp echoes ── */
.tc-echo {
  position:fixed;font-family:'Courier New',monospace;
  font-size:36px;font-weight:700;
  color:rgba(100,200,255,.65);
  text-shadow:0 0 16px rgba(100,200,255,.8),0 0 40px rgba(100,200,255,.3);
  pointer-events:none;z-index:9992;
  animation:tcEchoFade ease-out forwards;
}
@keyframes tcEchoFade {
  0%  {opacity:.8;transform:translate(0,0) scale(1)}
  100%{opacity:0;transform:translate(var(--ex),var(--ey)) scale(1.35)}
}

/* ── Phase 5: Time shards ── */
.tc-shard {
  position:fixed;pointer-events:none;z-index:9993;
  clip-path:polygon(50% 0%,100% 100%,0% 100%);
  animation:tcShardFly ease-out forwards;
}
@keyframes tcShardFly {
  0%  {opacity:1;transform:translate(0,0) rotate(0deg) scale(1)}
  100%{opacity:0;transform:translate(var(--sx),var(--sy)) rotate(var(--sr)) scale(.4)}
}

/* ── Phase 6: Timeline fractures ── */
.tc-fracture {
  position:fixed;height:2px;pointer-events:none;z-index:9994;
  left:0;
  background:linear-gradient(90deg,
    transparent 0%,${C1} 25%,${C4} 50%,${C1} 75%,transparent 100%);
  box-shadow:0 0 12px ${C1},0 0 24px rgba(100,200,255,.4);
  animation:tcFractureSweep ease-out forwards;
}
@keyframes tcFractureSweep {
  0%  {width:0;opacity:1;transform:translateX(50vw) scaleX(0)}
  25% {opacity:1}
  100%{width:100vw;opacity:0;transform:translateX(0) scaleX(1)}
}

/* ── Phase 7: Temporal vortex ── */
.tc-vortex {
  position:fixed;left:50%;top:50%;border-radius:50%;
  transform:translate(-50%,-50%);
  pointer-events:none;z-index:9994;
  animation:tcVortexExpand 2.2s cubic-bezier(.1,.9,.2,1) forwards;
}
@keyframes tcVortexExpand {
  from{width:0;height:0;opacity:1;transform:translate(-50%,-50%) rotate(0deg)}
  50% {opacity:.9}
  to  {width:160vmax;height:160vmax;opacity:0;transform:translate(-50%,-50%) rotate(1080deg)}
}

/* ── Phase 8: Paradox burst ── */
.tc-paradox {
  position:fixed;left:50%;top:50%;border-radius:50%;
  transform:translate(-50%,-50%);
  pointer-events:none;z-index:9999;
  animation:tcParadox 1.1s cubic-bezier(.05,.9,.1,1) forwards;
}
@keyframes tcParadox {
  from{width:20px;height:20px;opacity:1;transform:translate(-50%,-50%)}
  60% {opacity:.85}
  to  {width:200vmax;height:200vmax;opacity:0;transform:translate(-50%,-50%)}
}

/* ── Phase 9: Timeline rings ── */
.tc-ring {
  position:fixed;left:50%;top:50%;border-radius:50%;
  transform:translate(-50%,-50%);
  pointer-events:none;z-index:9993;
  animation:tcRingExpand ease-out forwards;
}
@keyframes tcRingExpand {
  from{transform:translate(-50%,-50%) scale(.01);opacity:1}
  60% {opacity:.8}
  to  {transform:translate(-50%,-50%) scale(1);opacity:0}
}

/* ── Phase 10: Timestamp streams ── */
.tc-timestamp {
  position:fixed;font-family:'Courier New',monospace;
  font-size:16px;font-weight:700;letter-spacing:.1em;
  color:rgba(100,200,255,.85);
  text-shadow:0 0 8px rgba(100,200,255,.7);
  pointer-events:none;z-index:9992;white-space:nowrap;
  animation:tcTimestampScroll linear forwards;
}
@keyframes tcTimestampScroll {
  from{opacity:0;transform:translateY(var(--ts0))}
  10% {opacity:.9}
  85% {opacity:.9}
  to  {opacity:0;transform:translateY(var(--ts1))}
}

/* ── Phase 11: Hourglass ── */
.tc-hourglass {
  position:fixed;left:50%;top:50%;
  transform:translate(-50%,-50%);
  pointer-events:none;z-index:9995;
  width:180px;height:280px;
  animation:tcHourglassReveal 1.2s cubic-bezier(.2,1.2,.3,1) forwards,
            tcHourglassFade 1s 2s ease-out forwards;
  opacity:0;
}
@keyframes tcHourglassReveal {
  from{opacity:0;transform:translate(-50%,-50%) scale(.5) translateY(30px);filter:blur(12px)}
  to  {opacity:1;transform:translate(-50%,-50%) scale(1) translateY(0);filter:blur(0)}
}
@keyframes tcHourglassFade {
  from{opacity:1} to{opacity:0}
}

.tc-hourglass-half {
  position:absolute;left:0;width:180px;height:134px;
  border:4px solid rgba(255,215,0,.85);
  box-shadow:0 0 18px rgba(255,215,0,.55);
}
.tc-hourglass-half--top {
  top:0;clip-path:polygon(15% 0%,85% 0%,50% 100%);
}
.tc-hourglass-half--bot {
  bottom:0;clip-path:polygon(50% 0%,15% 100%,85% 100%);
}
.tc-hourglass-neck {
  position:absolute;left:50%;top:50%;
  width:6px;height:14px;margin-left:-3px;margin-top:-7px;
  background:rgba(255,215,0,.7);
  box-shadow:0 0 8px rgba(255,215,0,.5);
}

/* Sand grain particles — JS-animated */
.tc-sand-grain {
  position:fixed;border-radius:50%;
  pointer-events:none;z-index:9994;
  background:${C2};
  box-shadow:0 0 4px ${C2};
  animation:tcSandFall linear forwards;
}
@keyframes tcSandFall {
  from{opacity:1;transform:translateY(0)}
  to  {opacity:0;transform:translateY(var(--sf))}
}

/* ── Phase 13: C H R O N O S label ── */
.tc-label {
  position:fixed;left:50%;top:50%;
  transform:translate(-50%,-50%);
  pointer-events:none;z-index:10012;
  display:flex;flex-direction:column;align-items:center;gap:14px;
  animation:tcLabelReveal 8s ease forwards;
}
@keyframes tcLabelReveal {
  0%  {opacity:0;transform:translate(-50%,-50%) scale(.45);filter:blur(16px)}
  8%  {opacity:1;transform:translate(-50%,-50%) scale(1.03);filter:blur(0)}
  14% {transform:translate(-50%,-50%) scale(1)}
  82% {opacity:1}
  100%{opacity:0;transform:translate(-50%,-50%) scale(1.05)}
}

.tc-label-main {
  font-family:'Times New Roman',serif;
  font-size:54px;font-weight:700;letter-spacing:16px;
  color:${C1};
  text-shadow:
    0 0 12px ${C1},0 0 30px ${C1},
    0 0 70px ${C2},0 0 140px rgba(100,200,255,.4);
  border:2px solid rgba(100,200,255,.7);
  padding:14px 42px;
  background:rgba(0,6,18,.92);
  box-shadow:
    0 0 28px ${C1_GLOW},0 0 60px rgba(100,200,255,.3),
    inset 0 0 28px rgba(100,200,255,.08);
  animation:tcLabelBorderPulse 1.2s ease-in-out infinite alternate;
}
@keyframes tcLabelBorderPulse {
  from{box-shadow:0 0 28px ${C1_GLOW},0 0 60px rgba(100,200,255,.3),inset 0 0 28px rgba(100,200,255,.08)}
  to  {box-shadow:0 0 55px ${C1_GLOW},0 0 110px ${C2_GLOW},0 0 200px rgba(100,200,255,.2),inset 0 0 55px rgba(100,200,255,.18)}
}

.tc-label-sub {
  font-family:'Courier New',monospace;
  font-size:11px;letter-spacing:6px;
  color:rgba(100,200,255,.55);
  text-shadow:0 0 8px rgba(100,200,255,.4);
}

/* Phase 14: Gold typewriter line */
.tc-typewriter {
  position:fixed;left:50%;top:calc(50% + 88px);
  transform:translateX(-50%);
  pointer-events:none;z-index:10013;
  font-family:'Times New Roman',serif;font-style:italic;
  font-size:19px;letter-spacing:5px;color:${C2};
  text-shadow:0 0 12px ${C2},0 0 30px rgba(255,215,0,.5);
  white-space:nowrap;
  animation:tcTypeReveal 7s ease forwards;
}
@keyframes tcTypeReveal {
  0%  {opacity:0} 6%{opacity:1} 82%{opacity:1} 100%{opacity:0}
}
.tc-cursor {
  display:inline-block;width:2px;height:1em;
  background:${C2};margin-left:3px;vertical-align:middle;
  animation:tcCursorBlink .7s step-end infinite;
}
@keyframes tcCursorBlink { 0%,100%{opacity:1} 50%{opacity:0} }

/* Aura rings */
.tc-aura {
  position:fixed;left:50%;top:50%;border-radius:50%;
  transform:translate(-50%,-50%);
  pointer-events:none;z-index:9991;
  animation:tcAuraExpand ease-out forwards;
}
@keyframes tcAuraExpand {
  0%  {opacity:1;transform:translate(-50%,-50%) scale(0)}
  65% {opacity:.65}
  100%{opacity:0;transform:translate(-50%,-50%) scale(1)}
}

/* ── Body shakes ── */
@keyframes tcBodyShake {
  0%,100%{transform:translate(0,0)}
  10%{transform:translate(-5px,4px)} 28%{transform:translate(5px,-4px)}
  46%{transform:translate(-4px,5px)} 64%{transform:translate(4px,-3px)}
  82%{transform:translate(-3px,3px)}
}
body.tc-shake { animation:tcBodyShake .55s ease-out; }

@keyframes tcBodyShakeHeavy {
  0%,100%{transform:translate(0,0)}
  8% {transform:translate(-14px,10px)} 22%{transform:translate(14px,-12px)}
  36%{transform:translate(-12px,14px)} 50%{transform:translate(11px,-11px)}
  64%{transform:translate(-10px,10px)} 78%{transform:translate(8px,-8px)}
  92%{transform:translate(-5px,5px)}
}
body.tc-shake-heavy { animation:tcBodyShakeHeavy .85s ease-out; }

@keyframes tcBodyShakeParadox {
  0%,100%{transform:translate(0,0)}
  5% {transform:translate(-20px,16px)} 14%{transform:translate(20px,-18px)}
  23%{transform:translate(-18px,20px)} 32%{transform:translate(17px,-16px)}
  41%{transform:translate(-16px,18px)} 50%{transform:translate(14px,-14px)}
  59%{transform:translate(-12px,12px)} 68%{transform:translate(10px,-10px)}
  77%{transform:translate(-8px,8px)}   86%{transform:translate(6px,-6px)}
  95%{transform:translate(-4px,4px)}
}
body.tc-shake-paradox { animation:tcBodyShakeParadox 1.1s ease-out; }
`;

function injectCSS() {
  if (document.getElementById('tc-styles')) return;
  const s = document.createElement('style');
  s.id = 'tc-styles';
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

function rndInt(lo, hi) { return Math.floor(Math.random() * (hi - lo + 1)) + lo; }
function pad2(n) { return String(n).padStart(2, '0'); }
function pad3(n) { return String(n).padStart(3, '0'); }
function randTime() {
  return `${pad2(rndInt(0,23))}:${pad2(rndInt(0,59))}:${pad2(rndInt(0,59))}.${pad3(rndInt(0,999))}`;
}

// ══════════════════════════════════════════════════════════════
export class TimeCollapse {
  constructor(engine, rarity) {
    this.engine  = engine;
    this.rarity  = rarity;
    this.stopped = false;
    this._timers = [];
    this._typewriterEl = null;
    this._clockEl      = null;
    this.fx = {
      shakeIntensity: 65,
      particleCount:  250,
      rayCount:       48,
      ringCount:      10,
      glowMaxAlpha:   0.95,
      echoCount:      40,
      shardCount:     65,
      fractureCount:  12,
      streamCount:    32,
      sandGrains:     40,
      auraCount:      7,
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

      // ── Phase 0: Temporal void + scanlines ─────────────────
      const voidEl = spawn(mk('tc-void'));
      spawn(mk('tc-scanlines'));
      this._after(14500, () => voidEl.classList.add('tc-void--fade'));
      this._after(16500, () => voidEl.remove());

      // ── Phase 1: Clock face materializes ───────────────────
      this._after(300, () => this._spawnClock());

      // ── Phase 2: Hands spin backwards ──────────────────────
      this._after(700, () => {
        if (!this._clockEl) return;
        ['hour','minute','second'].forEach(type => {
          const hand = document.createElement('div');
          hand.className = `tc-hand tc-hand--${type}`;
          this._clockEl.appendChild(hand);
        });
        document.body.classList.add('tc-shake');
        this._after(580, () => document.body.classList.remove('tc-shake'));
        this.engine.shake(this.fx.shakeIntensity * 0.25);
      });

      // ── Phase 3: Time freeze + chromatic aberration ─────────
      this._after(1400, () => {
        const freeze = spawn(mk('tc-freeze'));
        freeze.style.background = `linear-gradient(90deg,
          transparent 0%,rgba(100,200,255,.3) 50%,transparent 100%)`;
        spawn(mk('tc-aberr-r'));
        spawn(mk('tc-aberr-g'));
        this._after(700, () => {
          freeze.remove();
          document.querySelector('.tc-aberr-r')?.remove();
          document.querySelector('.tc-aberr-g')?.remove();
        });
        document.body.classList.add('tc-shake');
        this._after(580, () => document.body.classList.remove('tc-shake'));
      });

      // ── Phase 4: Timestamp echoes ───────────────────────────
      this._after(1800, () => this._spawnEchoes(this.fx.echoCount));

      // ── Phase 5: Time shards ────────────────────────────────
      this._after(2300, () => {
        this._spawnShards(this.fx.shardCount);
        document.body.classList.add('tc-shake');
        this._after(520, () => document.body.classList.remove('tc-shake'));
        this.engine.shake(this.fx.shakeIntensity * 0.35);
      });

      // ── Phase 6: Timeline fractures ─────────────────────────
      this._after(2800, () => this._spawnFractures(this.fx.fractureCount));

      // ── Phase 7: Temporal vortex ────────────────────────────
      this._after(3400, () => {
        const vortex = spawn(mk('tc-vortex'));
        // Alternate cyan/gold sectors using conic gradient
        vortex.style.background = `conic-gradient(
          ${C1}cc 0deg,${C2}99 60deg,${C1}cc 120deg,
          ${C2}99 180deg,${C1}cc 240deg,${C2}99 300deg,${C1}cc 360deg)`;
        vortex.style.boxShadow  = `0 0 80px ${C1_GLOW},0 0 160px ${C2_GLOW}`;
        this._after(2400, () => vortex.remove());

        document.body.classList.add('tc-shake-heavy');
        this._after(900, () => document.body.classList.remove('tc-shake-heavy'));
        this.engine.shake(this.fx.shakeIntensity * 0.5);
      });

      // ── Phase 8: PARADOX BURST ──────────────────────────────
      this._after(4100, () => {
        const paradox = spawn(mk('tc-paradox'));
        paradox.style.background = `radial-gradient(circle,
          ${C4} 0%,${C1}dd 30%,${C2}88 55%,transparent 75%)`;
        paradox.style.boxShadow  = `0 0 60px ${C4},0 0 120px ${C1_GLOW},0 0 240px ${C2_GLOW}`;
        this._after(1200, () => paradox.remove());

        document.body.classList.add('tc-shake-paradox');
        this._after(1150, () => document.body.classList.remove('tc-shake-paradox'));
        this.engine.shake(this.fx.shakeIntensity);
      });

      // ── Phase 9: Timeline rings ──────────────────────────────
      this._after(4800, () => this._spawnRings(this.fx.ringCount));

      // ── Phase 10: Timestamp streams ─────────────────────────
      this._after(5400, () => this._spawnTimestampStreams(this.fx.streamCount));

      // ── Phase 11: Hourglass + sand ──────────────────────────
      this._after(6200, () => this._spawnHourglass());

      // ── Phase 12: Canvas effects ─────────────────────────────
      this._after(7200, () => {
        // Dual-color ray bursts
        [[C1, 0.18, 1.0], [C2, 0.1, -0.55], [C4, 0.06, 1.8]].forEach(([col, alpha, rot], i) => {
          this._after(i * 120, () => {
            this.engine.addEffect(new RayBurst({
              color:    col,
              duration: 9500,
              maxAlpha: alpha,
              rayCount: Math.floor(this.fx.rayCount / (1 + i * 0.4)),
              rotSpeed: rot,
            }));
          });
        });

        // Deep temporal glow — blue core
        this.engine.addEffect(new GlowOverlay({
          color:      C1_GLOW,
          duration:   9000,
          maxAlpha:   this.fx.glowMaxAlpha,
          fadeIn:     0.04,
          fadeOut:    0.18,
          radial:     true,
          pulseSpeed: 2.0,
        }));

        // Particle bursts — cyan, gold, white staggered
        [[C1, 1.0], [C2, 0.75], [C4, 0.45]].forEach(([col, scale], i) => {
          this._after(i * 180, () => {
            this.engine.addEffect(new ParticleBurst(0.5, 0.5, {
              count:    Math.floor(this.fx.particleCount * scale),
              color:    col,
              minSpeed: 130 + i * 70,
              maxSpeed: 450 + i * 60,
              minSize:  2,
              maxSize:  9,
              gravity:  38,
              trail:    this.fx.trailEnabled,
              glow:     true,
              duration: 7000,
              type:     i === 2 ? 'star' : 'spark',
            }));
          });
        });

        // Continuous temporal dust rising from center
        this.engine.addEffect(new ContinuousParticles({
          ox:        0.5,
          oy:        0.55,
          color:     C1,
          minSpeed:  55,
          maxSpeed:  210,
          gravity:   -65,
          upBias:    130,
          spread:    Math.PI * 2,
          minSize:   1.5,
          maxSize:   6,
          trail:     true,
          glow:      true,
          spawnRate: 0.03,
          duration:  8500,
          type:      'star',
        }));

        // Gold sparks raining from top
        this.engine.addEffect(new ContinuousParticles({
          ox:        w => Math.random() * w,
          oy:        0,
          color:     C2,
          minSpeed:  45,
          maxSpeed:  140,
          gravity:   110,
          spread:    0.5,
          angle:     Math.PI / 2,
          minSize:   1,
          maxSize:   3.5,
          glow:      true,
          spawnRate: 0.022,
          duration:  8000,
        }));
      });

      // ── Phase 13: C H R O N O S label + aura rings ──────────
      this._after(8200, () => {
        const label = spawn(mk('tc-label'));
        const main  = document.createElement('div');
        main.className   = 'tc-label-main';
        main.textContent = 'C H R O N O S';
        const sub        = document.createElement('div');
        sub.className    = 'tc-label-sub';
        sub.textContent  = '[ 1 / 75,000 · TIME COLLAPSE ]';
        label.appendChild(main);
        label.appendChild(sub);
        this._after(7200, () => label.remove());

        // Staggered aura rings — alternating cyan / gold
        for (let i = 0; i < this.fx.auraCount; i++) {
          this._after(i * 200, () => {
            const aura = spawn(mk('tc-aura'));
            const sz   = 100 + i * 65;
            const col  = i % 2 === 0 ? C1 : C2;
            const colB = i % 2 === 0 ? C2 : C1;
            aura.style.cssText = `
              width:${sz}px;height:${sz}px;
              background:radial-gradient(circle,${col}44 0%,${col}18 55%,transparent 80%);
              box-shadow:0 0 ${28+i*12}px ${col},0 0 ${60+i*22}px ${colB}55;
              animation-duration:${1.9+i*.28}s;
            `;
            this._after(3000, () => aura.remove());
          });
        }
      });

      // ── Phase 14: "TIME IS NOT LINEAR" typewriter ────────────
      this._after(10000, () => this._spawnTypewriter());

      // ── Phase 16: Resolve ────────────────────────────────────
      this._after(18000, () => {
        killSpawned();
        resolve();
      });
    });
  }

  stop() {
    this.stopped = true;
    this._timers.forEach(clearTimeout);
    this._timers = [];
    document.body.classList.remove('tc-shake', 'tc-shake-heavy', 'tc-shake-paradox');
    killSpawned();
  }

  // ── Clock face — full analog with 60 tick marks ─────────────
  _spawnClock() {
    const clock = spawn(mk('tc-clock'));
    this._clockEl = clock;

    const R = 190; // radius from center to outer rim (clock is 380px wide)

    // 60 tick marks
    for (let i = 0; i < 60; i++) {
      const tick     = document.createElement('div');
      const isMajor  = i % 5 === 0;
      tick.className = 'tc-tick' + (isMajor ? ' tc-tick--major' : '');
      const len  = isMajor ? 16 : 8;
      const wid  = isMajor ? 2.5 : 1.5;
      const ang  = i * 6; // degrees
      const rad  = ang * Math.PI / 180;
      // position: start at rim, go inward
      const x = Math.round(R * Math.sin(rad));
      const y = Math.round(-R * Math.cos(rad));
      tick.style.cssText = `
        position:absolute;
        left:calc(50% + ${x}px);
        top:calc(50% + ${y}px);
        width:${wid}px;height:${len}px;
        margin-left:${-wid/2}px;margin-top:${-len}px;
        transform-origin:50% 100%;
        transform:rotate(${ang}deg);
        border-radius:1px;
      `;
      clock.appendChild(tick);
    }

    // Roman numeral stations: XII, III, VI, IX
    const numerals = [
      { label:'XII', angle:0   },
      { label:'III', angle:90  },
      { label:'VI',  angle:180 },
      { label:'IX',  angle:270 },
    ];
    const numR = 155;
    numerals.forEach(n => {
      const el  = document.createElement('div');
      el.className   = 'tc-numeral';
      el.textContent = n.label;
      const rad  = n.angle * Math.PI / 180;
      el.style.left = `calc(50% + ${Math.round(numR * Math.sin(rad))}px)`;
      el.style.top  = `calc(50% + ${Math.round(-numR * Math.cos(rad))}px)`;
      clock.appendChild(el);
    });

    // Center jewel
    const jewel = document.createElement('div');
    jewel.className = 'tc-center';
    clock.appendChild(jewel);

    this._after(7000, () => { clock.remove(); this._clockEl = null; });
  }

  // ── Timestamp echoes ─────────────────────────────────────────
  _spawnEchoes(count) {
    for (let i = 0; i < count; i++) {
      const echo = spawn(mk('tc-echo'));
      echo.textContent = ECHO_TIMES[i % ECHO_TIMES.length];
      echo.style.left = (8 + Math.random() * 80) + 'vw';
      echo.style.top  = (8 + Math.random() * 80) + 'vh';
      const dur = 1.2 + Math.random() * 0.8;
      const ex  = (Math.random() - .5) * 18;
      const ey  = (Math.random() - .5) * 18;
      echo.style.setProperty('--ex', ex + 'vmin');
      echo.style.setProperty('--ey', ey + 'vmin');
      echo.style.animationDuration = dur + 's';
      echo.style.animationDelay   = Math.random() * 400 + 'ms';
      this._after((dur + .5) * 1000, () => echo.remove());
    }
  }

  // ── Time shards ──────────────────────────────────────────────
  _spawnShards(count) {
    for (let i = 0; i < count; i++) {
      const shard = spawn(mk('tc-shard'));
      const sz    = 16 + Math.random() * 36;
      const angle = Math.random() * 360;
      const dist  = 28 + Math.random() * 55;
      const sx    = Math.cos(angle * Math.PI / 180) * dist;
      const sy    = Math.sin(angle * Math.PI / 180) * dist;
      const rot   = Math.random() * 720 - 360;
      const dur   = .65 + Math.random() * .7;
      // Alternate cyan / gold shards
      const col   = i % 3 === 0 ? C2 : (i % 3 === 1 ? C1 : C4);
      shard.style.cssText = `
        width:${sz}px;height:${sz}px;left:50vw;top:50vh;
        background:linear-gradient(135deg,${col}cc 0%,${col}88 50%,${col}cc 100%);
        box-shadow:0 0 8px ${col}88;
        animation-duration:${dur}s;
        animation-delay:${Math.random()*200}ms;
      `;
      shard.style.setProperty('--sx', sx + 'vmin');
      shard.style.setProperty('--sy', sy + 'vmin');
      shard.style.setProperty('--sr', rot + 'deg');
      this._after((dur + .35) * 1000, () => shard.remove());
    }
  }

  // ── Timeline fractures ───────────────────────────────────────
  _spawnFractures(count) {
    for (let i = 0; i < count; i++) {
      this._after(i * 70, () => {
        const f = spawn(mk('tc-fracture'));
        f.style.top              = (6 + (i / count) * 88) + 'vh';
        f.style.animationDuration = (.5 + Math.random() * .25) + 's';
        this._after(900, () => f.remove());
      });
    }
  }

  // ── Timeline rings ───────────────────────────────────────────
  _spawnRings(count) {
    const colors = [C1, C2, C4, C1, C2];
    for (let i = 0; i < count; i++) {
      this._after(i * 110, () => {
        const ring = spawn(mk('tc-ring'));
        const col  = colors[i % colors.length];
        const maxSz = 60 + i * 70;
        ring.style.cssText = `
          width:${maxSz}px;height:${maxSz}px;
          border:${3 - i * 0.15}px solid ${col};
          box-shadow:0 0 ${16+i*4}px ${col}aa;
          animation-duration:${1.3+i*.12}s;
        `;
        this._after(1800, () => ring.remove());
      });
    }
  }

  // ── Timestamp streams ────────────────────────────────────────
  _spawnTimestampStreams(count) {
    for (let i = 0; i < count; i++) {
      const ts = spawn(mk('tc-timestamp'));
      ts.textContent = randTime();
      // Alternate left / right columns
      const leftSide = i % 2 === 0;
      if (leftSide) {
        ts.style.left  = (2 + Math.random() * 18) + 'vw';
      } else {
        ts.style.right = (2 + Math.random() * 18) + 'vw';
        ts.style.left  = 'auto';
      }
      const startV = -20 + Math.random() * 60;
      const endV   = startV + 60 + Math.random() * 60;
      const dur    = 1.6 + Math.random() * 1.2;
      ts.style.setProperty('--ts0', startV + 'vh');
      ts.style.setProperty('--ts1', endV   + 'vh');
      ts.style.animationDuration = dur + 's';
      ts.style.animationDelay   = i * 45 + 'ms';
      // Some streams are gold, most are cyan
      if (i % 5 === 0) {
        ts.style.color      = C2;
        ts.style.textShadow = `0 0 8px ${C2}`;
      }
      this._after((dur + .4) * 1000, () => ts.remove());
    }
  }

  // ── Hourglass + sand grain particles ─────────────────────────
  _spawnHourglass() {
    const hg = spawn(mk('tc-hourglass'));

    const top = document.createElement('div');
    top.className = 'tc-hourglass-half tc-hourglass-half--top';
    const bot = document.createElement('div');
    bot.className = 'tc-hourglass-half tc-hourglass-half--bot';
    const neck = document.createElement('div');
    neck.className = 'tc-hourglass-neck';

    hg.appendChild(top);
    hg.appendChild(bot);
    hg.appendChild(neck);
    this._after(3500, () => hg.remove());

    // Sand grains — tiny gold particles streaming down from center
    for (let i = 0; i < this.fx.sandGrains; i++) {
      this._after(i * 50, () => {
        const grain = spawn(mk('tc-sand-grain'));
        const sz    = 2 + Math.random() * 3;
        const fall  = 60 + Math.random() * 80;
        const offsetX = (Math.random() - .5) * 14;
        grain.style.cssText = `
          width:${sz}px;height:${sz}px;
          left:calc(50vw + ${offsetX}px);
          top:50vh;
          animation-duration:${.5+Math.random()*.5}s;
        `;
        grain.style.setProperty('--sf', fall + 'px');
        grain.style.animationDelay = i * 45 + 'ms';
        this._after(2800, () => grain.remove());
      });
    }
  }

  // ── "TIME IS NOT LINEAR" typewriter ──────────────────────────
  _spawnTypewriter() {
    const el   = spawn(mk('tc-typewriter'));
    this._typewriterEl = el;
    const TEXT = 'TIME IS NOT LINEAR';
    const cur  = document.createElement('span');
    cur.className = 'tc-cursor';
    el.appendChild(cur);

    let idx = 0;
    const type = () => {
      if (this.stopped || !el.isConnected) return;
      if (idx < TEXT.length) {
        el.insertBefore(document.createTextNode(TEXT[idx]), cur);
        idx++;
        const delay = 70 + (Math.random() > .88 ? 180 : 0);
        this._timers.push(setTimeout(type, delay));
      } else {
        this._after(2200, () => cur.remove());
      }
    };
    this._timers.push(setTimeout(type, 350));
    this._after(6500, () => { el.remove(); this._typewriterEl = null; });
  }
}