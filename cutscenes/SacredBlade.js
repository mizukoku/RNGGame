// cutscenes/SacredBlade.js
// ═══════════════════════════════════════════════════════════════
//  S A C R E D   B L A D E  —  1 / 150,000
//  Hybrid: DOM/CSS + canvas particle engine + Web Audio API
//
//  Before the light, there was the worthy.
//  Before the worthy, there was the sword.
//  The sword does not choose — it reveals.
//
//  Phase 0  (0ms)    : Warm void — 30 sacred wind streaks compress
//  Phase 1  (500ms)  : Holy sword descends from above — clip-path blade
//  Phase 2  (1200ms) : 80 golden particles spiral inward to blade tip
//  Phase 3  (2200ms) : 5 holy crosses materialize with radiant halos
//  Phase 4  (3000ms) : Charge aura erupts — conic golden pulse + shake
//  Phase 5  (4000ms) : 12 golden rings cascade from sword tip outward
//  Phase 6  (4800ms) : Wind IMPLOSION — all force compresses center
//  Phase 7  (5600ms) : THE BEAM — vertical golden pillar erupts full height
//  Phase 8  (6200ms) : Blinding white flash — 0.8s total annihilation
//  Phase 9  (7000ms) : 200 crystalline gold shards rain from beam path
//  Phase 10 (7800ms) : Sacred hexagram — two DOM triangles overlap, rotating
//  Phase 11 (8800ms) : Canvas — gold+white ray bursts, glow, storm
//  Phase 12 (9800ms) : S A C R E D   B L A D E label + medieval border
//  Phase 13 (11500ms): "ONLY THE WORTHY MAY HOLD THE LIGHT" typewriter
//  Phase 14 (16000ms): Void fades
//  Phase 15 (22000ms): Resolve
// ═══════════════════════════════════════════════════════════════

import { ParticleBurst, ContinuousParticles } from '../effects/ParticleBurst.js';
import { GlowOverlay, RayBurst }               from '../effects/GlowOverlay.js';

// ── Palette ───────────────────────────────────────────────────
const SG  = '#ffd700';              // sacred gold
const SW  = '#fffef0';              // sacred white-cream
const SL  = '#fff4b0';              // sacred pale gold
const SK  = '#0c0800';              // warm near-black
const SB  = '#ffe566';              // bright luminous gold
const SR  = '#c89a00';              // rich deep gold

const SG_GLOW = 'rgba(255,215,0,0.95)';
const SW_GLOW = 'rgba(255,254,240,0.9)';
const SL_GLOW = 'rgba(255,244,176,0.85)';

// ── CSS ───────────────────────────────────────────────────────
const CSS = `
/* ── Phase 0: Warm void ── */
.sb-void {
  position:fixed;inset:0;
  background:radial-gradient(ellipse at 50% 55%,#120c00 0%,#080600 50%,#000 100%);
  z-index:9990;pointer-events:none;
  opacity:1;transition:opacity 2.2s ease;
}
.sb-void--fade { opacity:0; }

/* ── Void warm breath pulse ── */
.sb-void::after {
  content:'';position:absolute;inset:0;
  background:radial-gradient(ellipse at 50% 60%,rgba(255,215,0,.09) 0%,transparent 55%);
  animation:sbVoidBreath 3.2s ease-in-out infinite;
}
@keyframes sbVoidBreath {
  0%,100%{transform:scale(1);opacity:.3}
  50%    {transform:scale(1.15);opacity:1}
}

/* ── Sacred wind streaks ── */
.sb-wind {
  position:fixed;top:var(--wy);
  height:var(--wh);
  pointer-events:none;z-index:9993;
  border-radius:var(--wh);
  background:linear-gradient(90deg,
    transparent 0%,var(--wc) 35%,${SW} 50%,var(--wc) 65%,transparent 100%);
  box-shadow:0 0 var(--wglow) var(--wc);
  animation:sbWindCompress var(--wdur) var(--wease) forwards;
}
@keyframes sbWindCompress {
  0%  {left:var(--wx0);width:var(--ww);opacity:var(--wop)}
  85% {opacity:var(--wop)}
  100%{left:var(--wx1);width:var(--ww2);opacity:0}
}

/* ── Phase 1: Holy Sword ── */
.sb-sword {
  position:fixed;left:50%;top:-40vh;
  transform:translateX(-50%);
  pointer-events:none;z-index:10005;
  animation:sbSwordDescend .9s cubic-bezier(.15,1.3,.3,1) forwards;
  filter:drop-shadow(0 0 18px ${SG}) drop-shadow(0 0 50px rgba(255,215,0,.6));
}
@keyframes sbSwordDescend {
  from{top:-40vh;opacity:0}
  to  {top:8vh;opacity:1}
}

.sb-sword-inner {
  position:relative;width:22px;
  display:flex;flex-direction:column;align-items:center;
}

/* Blade */
.sb-blade {
  width:0;height:0;
  border-left:11px solid transparent;
  border-right:11px solid transparent;
  border-bottom:48vh solid ${SG};
  filter:drop-shadow(0 0 6px ${SG});
  position:relative;
}
.sb-blade::after {
  content:'';position:absolute;top:6px;left:-5px;
  width:0;height:0;
  border-left:5px solid transparent;
  border-right:5px solid transparent;
  border-bottom:calc(48vh - 12px) solid ${SL};
  opacity:.5;
}

/* Fuller (center ridge) */
.sb-fuller {
  position:absolute;left:50%;top:8px;
  width:3px;height:calc(48vh - 20px);
  transform:translateX(-50%);
  background:linear-gradient(180deg,${SW} 0%,rgba(255,244,176,.3) 100%);
  border-radius:1px;
}

/* Crossguard */
.sb-guard {
  width:88px;height:14px;
  background:linear-gradient(90deg,
    rgba(200,154,0,.6) 0%,${SG} 20%,${SW} 50%,${SG} 80%,rgba(200,154,0,.6) 100%);
  border-radius:3px;
  box-shadow:0 0 16px ${SG},0 0 40px rgba(255,215,0,.4),
             inset 0 2px 0 rgba(255,255,255,.5),inset 0 -2px 0 rgba(0,0,0,.3);
}
/* Guard jewel */
.sb-guard::before {
  content:'';position:absolute;left:50%;top:50%;
  width:12px;height:12px;border-radius:50%;
  transform:translate(-50%,-50%);
  background:radial-gradient(circle,${SW} 0%,${SL} 40%,${SR} 100%);
  box-shadow:0 0 12px ${SW},0 0 30px ${SG};
}

/* Grip */
.sb-grip {
  width:12px;height:52px;
  background:linear-gradient(180deg,
    ${SR} 0%,rgba(140,80,0,.9) 30%,${SR} 60%,rgba(140,80,0,.9) 100%);
  border-radius:2px;
  box-shadow:inset 2px 0 0 rgba(255,255,255,.2),inset -2px 0 0 rgba(0,0,0,.3);
}

/* Pommel */
.sb-pommel {
  width:22px;height:22px;border-radius:50%;
  background:radial-gradient(circle,${SW} 0%,${SG} 40%,${SR} 100%);
  box-shadow:0 0 14px ${SG},0 0 35px rgba(255,215,0,.5);
}

/* Sword shimmer — animated glow up and down blade */
.sb-shimmer {
  position:absolute;left:50%;
  width:6px;height:28vh;
  transform:translateX(-50%);
  background:linear-gradient(180deg,${SW} 0%,rgba(255,244,176,.8) 40%,transparent 100%);
  border-radius:3px;
  opacity:.7;
  animation:sbShimmerRide 1.4s ease-in-out infinite alternate;
}
@keyframes sbShimmerRide {
  0%  {top:4px;height:12vh;opacity:.3}
  100%{top:4px;height:44vh;opacity:.8}
}

/* ── Phase 2: Orbiting gold particles ── */
.sb-orb {
  position:fixed;border-radius:50%;
  pointer-events:none;z-index:9994;
  animation:sbOrbSpiral ease-in forwards;
}
@keyframes sbOrbSpiral {
  0%  {opacity:0;transform:translate(var(--ox0),var(--oy0)) scale(1.4)}
  20% {opacity:1}
  100%{opacity:0;transform:translate(var(--ox1),var(--oy1)) scale(.2)}
}

/* ── Phase 3: Holy crosses ── */
.sb-cross {
  position:fixed;pointer-events:none;z-index:9995;
  animation:sbCrossReveal 2.2s ease forwards;
  transform:translate(-50%,-50%);
}
@keyframes sbCrossReveal {
  0%  {opacity:0;transform:translate(-50%,-50%) scale(.3)}
  18% {opacity:1;transform:translate(-50%,-50%) scale(1.06)}
  25% {transform:translate(-50%,-50%) scale(1)}
  82% {opacity:1}
  100%{opacity:0;transform:translate(-50%,-50%) scale(1.08)}
}

.sb-cross-v {
  position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
  background:linear-gradient(180deg,transparent 0%,${SG} 20%,${SW} 50%,${SG} 80%,transparent 100%);
  border-radius:2px;
}
.sb-cross-h {
  position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);
  background:linear-gradient(90deg,transparent 0%,${SG} 20%,${SW} 50%,${SG} 80%,transparent 100%);
  border-radius:2px;
}

/* Cross halo */
.sb-cross-halo {
  position:absolute;left:50%;top:50%;border-radius:50%;
  transform:translate(-50%,-50%);
  border:2px solid rgba(255,215,0,.5);
  animation:sbHaloPulse 1.2s ease-in-out infinite alternate;
}
@keyframes sbHaloPulse {
  from{box-shadow:0 0 12px ${SG},0 0 30px rgba(255,215,0,.3)}
  to  {box-shadow:0 0 30px ${SG},0 0 80px rgba(255,215,0,.5),0 0 150px rgba(255,215,0,.2)}
}

/* ── Phase 4: Charge aura rings ── */
.sb-charge-ring {
  position:fixed;left:50%;top:50%;border-radius:50%;
  transform:translate(-50%,-50%);
  pointer-events:none;z-index:9996;
  animation:sbChargeExpand ease-out forwards;
}
@keyframes sbChargeExpand {
  0%  {opacity:1;transform:translate(-50%,-50%) scale(0)}
  65% {opacity:.7}
  100%{opacity:0;transform:translate(-50%,-50%) scale(1)}
}

/* ── Phase 6: Wind implosion streaks ── */
.sb-implode {
  position:fixed;top:var(--iy);height:var(--ih);
  pointer-events:none;z-index:9997;
  border-radius:var(--ih);
  background:linear-gradient(90deg,
    transparent 0%,${SW}cc 30%,${SW} 50%,${SW}cc 70%,transparent 100%);
  box-shadow:0 0 6px rgba(255,254,240,.8);
  animation:sbImplodeRush var(--idur) ease-in forwards;
}
@keyframes sbImplodeRush {
  0%  {left:var(--ix0);width:var(--iw);opacity:0}
  12% {opacity:1}
  100%{left:calc(50% - 1px);width:2px;opacity:0}
}

/* ── Phase 7: The Beam ── */
.sb-beam {
  position:fixed;left:50%;top:0;bottom:0;
  transform:translateX(-50%);
  pointer-events:none;z-index:10006;
  animation:sbBeamErupt .5s cubic-bezier(.05,1.1,.2,1) forwards,
            sbBeamFade 2s 1.2s ease-in forwards;
}
@keyframes sbBeamErupt {
  0%  {width:0;opacity:1}
  40% {width:140px;opacity:1}
  100%{width:100px;opacity:1}
}
@keyframes sbBeamFade {
  0%  {opacity:1;filter:brightness(1.8)}
  100%{opacity:0;filter:brightness(1)}
}

.sb-beam-inner {
  position:absolute;inset:0;
  background:linear-gradient(90deg,
    transparent 0%,
    rgba(255,215,0,.15) 8%,
    rgba(255,244,176,.6) 25%,
    ${SW} 50%,
    rgba(255,244,176,.6) 75%,
    rgba(255,215,0,.15) 92%,
    transparent 100%);
  box-shadow:
    0 0 40px 10px rgba(255,254,240,.8),
    0 0 100px 30px rgba(255,215,0,.6),
    0 0 220px 80px rgba(255,215,0,.3);
}

/* Beam inner core white pillar */
.sb-beam-core {
  position:absolute;left:50%;top:0;bottom:0;
  transform:translateX(-50%);
  width:12px;
  background:${SW};
  box-shadow:0 0 20px 4px ${SW},0 0 50px 12px rgba(255,254,240,.8);
  animation:sbCoreFlicker .06s linear infinite alternate;
}
@keyframes sbCoreFlicker {
  from{opacity:.9;width:10px}
  to  {opacity:1;width:14px}
}

/* Beam edge particles — streaks of light along beam */
.sb-beam-streak {
  position:fixed;left:50%;width:3px;
  transform:translateX(-50%);
  pointer-events:none;z-index:10007;
  border-radius:2px;
  background:linear-gradient(180deg,transparent,${SL},transparent);
  animation:sbStreakFly ease-in forwards;
}
@keyframes sbStreakFly {
  from{top:50%;height:0;opacity:1}
  to  {top:var(--st);height:var(--sh);opacity:0}
}

/* ── Phase 8: Blinding flash ── */
.sb-flash {
  position:fixed;inset:0;background:${SW};
  pointer-events:none;z-index:10010;
  animation:sbFlashBurst .8s ease-out forwards;
}
@keyframes sbFlashBurst {
  0%  {opacity:1}
  30% {opacity:.9}
  100%{opacity:0}
}

/* ── Phase 9: Crystal gold shards rain ── */
.sb-shard {
  position:fixed;
  pointer-events:none;z-index:9994;
  clip-path:polygon(50% 0%,100% 50%,50% 100%,0% 50%);
  animation:sbShardFall ease-in forwards;
}
@keyframes sbShardFall {
  0%  {opacity:1;transform:translate(0,0) rotate(var(--sr)) scale(1)}
  85% {opacity:.8}
  100%{opacity:0;transform:translate(var(--sdx),var(--sdy)) rotate(var(--sr2)) scale(.3)}
}

/* ── Phase 10: Sacred hexagram ── */
.sb-hexagram {
  position:fixed;left:50%;top:50%;
  transform:translate(-50%,-50%);
  pointer-events:none;z-index:9995;
  animation:sbHexReveal 5.5s ease forwards;
}
@keyframes sbHexReveal {
  0%  {opacity:0;transform:translate(-50%,-50%) scale(.2) rotate(0deg)}
  10% {opacity:1;transform:translate(-50%,-50%) scale(1.04) rotate(3deg)}
  15% {transform:translate(-50%,-50%) scale(1) rotate(0deg)}
  82% {opacity:1}
  100%{opacity:0;transform:translate(-50%,-50%) scale(1.05) rotate(60deg)}
}

.sb-tri {
  position:absolute;left:50%;top:50%;
  width:0;height:0;
  transform-origin:center center;
  border-left:var(--ts) solid transparent;
  border-right:var(--ts) solid transparent;
  animation:sbTriSpin var(--tspd) linear infinite;
}
@keyframes sbTriSpin {
  from{transform:translate(-50%,-50%) rotate(var(--ta))}
  to  {transform:translate(-50%,-50%) rotate(calc(var(--ta) + 360deg))}
}

.sb-hex-ring {
  position:absolute;left:50%;top:50%;border-radius:50%;
  transform:translate(-50%,-50%);
  border:2px solid rgba(255,215,0,.55);
  animation:sbHexRingPulse 1.4s ease-in-out infinite alternate;
}
@keyframes sbHexRingPulse {
  from{box-shadow:0 0 10px ${SG},0 0 25px rgba(255,215,0,.25)}
  to  {box-shadow:0 0 28px ${SG},0 0 70px rgba(255,215,0,.5),0 0 140px rgba(255,215,0,.2)}
}

/* ── Phase 12: S A C R E D   B L A D E label ── */
.sb-label {
  position:fixed;left:50%;top:50%;
  transform:translate(-50%,-50%);
  pointer-events:none;z-index:10012;
  display:flex;flex-direction:column;align-items:center;gap:16px;
  animation:sbLabelReveal 9.5s ease forwards;
}
@keyframes sbLabelReveal {
  0%  {opacity:0;transform:translate(-50%,-50%) scale(.4) translateY(20px);filter:blur(18px)}
  6%  {opacity:1;transform:translate(-50%,-50%) scale(1.04) translateY(0);filter:blur(0)}
  11% {transform:translate(-50%,-50%) scale(1) translateY(0)}
  83% {opacity:1}
  100%{opacity:0;transform:translate(-50%,-50%) scale(1.04)}
}

.sb-label-main {
  font-family:'Times New Roman',serif;
  font-size:44px;font-weight:900;
  letter-spacing:14px;text-transform:uppercase;
  color:${SG};
  text-shadow:
    0 0 8px ${SG},0 0 20px ${SG},
    0 0 55px ${SL},0 0 120px rgba(255,215,0,.5),
    2px 2px 0 rgba(100,60,0,.6);
  /* Medieval layered border */
  border:3px solid ${SG};
  outline:2px solid rgba(255,215,0,.25);
  outline-offset:5px;
  padding:18px 48px;
  background:radial-gradient(ellipse at 50% 50%,rgba(20,14,0,.95) 0%,rgba(8,6,0,.98) 100%);
  box-shadow:
    0 0 0 1px ${SK},
    0 0 40px rgba(255,215,0,.55),
    0 0 90px rgba(255,215,0,.3),
    inset 0 0 36px rgba(255,215,0,.07);
  animation:sbLabelGoldPulse 1.4s ease-in-out infinite alternate;
}
@keyframes sbLabelGoldPulse {
  from{
    text-shadow:0 0 8px ${SG},0 0 20px ${SG},0 0 55px ${SL},0 0 120px rgba(255,215,0,.5),2px 2px 0 rgba(100,60,0,.6);
    box-shadow:0 0 0 1px ${SK},0 0 40px rgba(255,215,0,.55),0 0 90px rgba(255,215,0,.3),inset 0 0 36px rgba(255,215,0,.07);
  }
  to{
    text-shadow:0 0 14px ${SW},0 0 35px ${SG},0 0 80px ${SL},0 0 200px rgba(255,215,0,.6),2px 2px 0 rgba(100,60,0,.6);
    box-shadow:0 0 0 1px ${SK},0 0 70px rgba(255,215,0,.8),0 0 160px rgba(255,215,0,.4),0 0 280px rgba(255,215,0,.15),inset 0 0 60px rgba(255,215,0,.12);
  }
}

/* Corner ornaments — medieval flourish */
.sb-label-main::before,
.sb-label-main::after {
  content:'✦';
  position:absolute;
  font-size:14px;color:rgba(255,215,0,.7);
  text-shadow:0 0 8px ${SG};
}
.sb-label-main::before {top:-2px;left:8px}
.sb-label-main::after {bottom:-2px;right:8px}

.sb-label-sub {
  font-family:'Times New Roman',serif;
  font-size:10px;font-style:italic;letter-spacing:5px;
  color:rgba(255,215,0,.55);
  text-shadow:0 0 10px rgba(255,215,0,.4);
}

/* ── Phase 13: Typewriter ── */
.sb-typewriter {
  position:fixed;left:50%;top:calc(50% + 88px);
  transform:translateX(-50%);
  pointer-events:none;z-index:10013;
  font-family:'Times New Roman',serif;font-style:italic;
  font-size:17px;letter-spacing:5px;
  color:${SL};
  text-shadow:0 0 10px ${SG},0 0 25px rgba(255,215,0,.5);
  white-space:nowrap;
  animation:sbTypeReveal 8.5s ease forwards;
}
@keyframes sbTypeReveal {
  0%{opacity:0} 5%{opacity:1} 83%{opacity:1} 100%{opacity:0}
}
.sb-cursor {
  display:inline-block;width:2px;height:1em;
  background:${SG};margin-left:3px;vertical-align:middle;
  box-shadow:0 0 6px ${SG};
  animation:sbCursorBlink .6s step-end infinite;
}
@keyframes sbCursorBlink { 0%,100%{opacity:1} 50%{opacity:0} }

/* ── Body shakes ── */
@keyframes sbBodyShake {
  0%,100%{transform:translate(0,0)}
  12%{transform:translate(-6px,5px)} 28%{transform:translate(6px,-5px)}
  44%{transform:translate(-5px,6px)} 60%{transform:translate(5px,-4px)}
  76%{transform:translate(-3px,4px)} 92%{transform:translate(3px,-3px)}
}
body.sb-shake { animation:sbBodyShake .55s ease-out; }

@keyframes sbBodyCharge {
  0%,100%{transform:translate(0,0)}
  8% {transform:translate(-10px,12px)} 20%{transform:translate(10px,-12px)}
  32%{transform:translate(-12px,10px)} 44%{transform:translate(11px,-11px)}
  56%{transform:translate(-9px,11px)}  68%{transform:translate(9px,-9px)}
  80%{transform:translate(-6px,7px)}   92%{transform:translate(5px,-5px)}
}
body.sb-charge-shake { animation:sbBodyCharge .8s ease-out; }

@keyframes sbBodyBeam {
  0%,100%{transform:translate(0,0) rotate(0deg)}
  5% {transform:translate(-18px,22px) rotate(-.8deg)}
  14%{transform:translate(18px,-22px) rotate(.7deg)}
  23%{transform:translate(-20px,18px) rotate(-.6deg)}
  32%{transform:translate(18px,-20px) rotate(.6deg)}
  41%{transform:translate(-16px,18px) rotate(-.5deg)}
  50%{transform:translate(14px,-16px) rotate(.4deg)}
  59%{transform:translate(-12px,14px) rotate(-.3deg)}
  68%{transform:translate(10px,-12px) rotate(.2deg)}
  77%{transform:translate(-8px,9px)   rotate(-.1deg)}
  88%{transform:translate(6px,-7px)}
}
body.sb-beam-shake { animation:sbBodyBeam 1.3s ease-out; }
`;

function injectCSS() {
  if (document.getElementById('sb-styles')) return;
  const s = document.createElement('style');
  s.id = 'sb-styles';
  s.textContent = CSS;
  document.head.appendChild(s);
}

function mk(cls) {
  const el = document.createElement('div');
  el.className = cls;
  return el;
}

let _spawned = [];
function spawn(el)    { _spawned.push(el); document.body.appendChild(el); return el; }
function killSpawned(){ _spawned.forEach(e => e.remove()); _spawned = []; }

function rnd(lo, hi) { return lo + Math.random() * (hi - lo); }
function rndInt(lo, hi) { return Math.floor(rnd(lo, hi + 1)); }

// ══════════════════════════════════════════════════════════════
export class SacredBlade {
  constructor(engine, rarity) {
    this.engine   = engine;
    this.rarity   = rarity;
    this.stopped  = false;
    this._timers  = [];
    this._actx    = null;
    this._swordEl = null;
    this.fx = {
      shakeIntensity: 70,
      particleCount:  260,
      rayCount:       52,
      glowMaxAlpha:   0.98,
      auraCount:      8,
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

      // ── Phase 0: Warm void + wind build ───────────────────────
      const voidEl = spawn(mk('sb-void'));
      this._after(14000, () => voidEl.classList.add('sb-void--fade'));
      this._after(16300, () => voidEl.remove());

      // Wind streaks — 30 horizontal lines compressing inward
      this._spawnWindStreaks(30, false);
      this._sfxWindBuild();

      // ── Phase 1: Sword descends ────────────────────────────────
      this._after(500, () => this._spawnSword());

      // ── Phase 2: Golden particles spiral into blade tip ────────
      this._after(1200, () => this._spawnOrbParticles(80));

      // ── Phase 3: Holy crosses materialize ─────────────────────
      this._after(2200, () => this._spawnCrosses(5));

      // ── Phase 4: Charge aura erupts ────────────────────────────
      this._after(3000, () => {
        this._spawnChargeRings(12);
        this._sfxCharge();
        document.body.classList.add('sb-charge-shake');
        this._after(820, () => document.body.classList.remove('sb-charge-shake'));
        this.engine.shake(this.fx.shakeIntensity * 0.45);
      });

      // ── Phase 5: Ring cascade from sword tip ──────────────────
      this._after(4000, () => this._spawnTipRings(12));

      // ── Phase 6: Wind IMPLOSION ────────────────────────────────
      this._after(4800, () => {
        this._spawnImplodeStreaks(28);
        document.body.classList.add('sb-charge-shake');
        this._after(820, () => document.body.classList.remove('sb-charge-shake'));
        this.engine.shake(this.fx.shakeIntensity * 0.65);
      });

      // ── Phase 7: THE BEAM ──────────────────────────────────────
      this._after(5600, () => {
        this._spawnBeam();
        this._sfxBeam();
        document.body.classList.add('sb-beam-shake');
        this._after(1350, () => document.body.classList.remove('sb-beam-shake'));
        this.engine.shake(this.fx.shakeIntensity);
        // Remove sword during beam overwhelm
        if (this._swordEl) {
          this._swordEl.style.transition = 'opacity .3s';
          this._swordEl.style.opacity = '0';
          this._after(400, () => { this._swordEl?.remove(); this._swordEl = null; });
        }
      });

      // ── Phase 8: Blinding flash ────────────────────────────────
      this._after(6200, () => {
        const flash = spawn(mk('sb-flash'));
        this._after(900, () => flash.remove());
      });

      // ── Phase 9: Crystal shard rain ───────────────────────────
      this._after(7000, () => this._spawnShardRain(200));

      // ── Phase 10: Sacred hexagram ─────────────────────────────
      this._after(7800, () => this._spawnHexagram());

      // ── Phase 11: Canvas effects ───────────────────────────────
      this._after(8800, () => {
        // Gold-dominant ray bursts — wide spread, majestic
        [[SW, 0.22, 0.6], [SG, 0.16, -0.4], [SL, 0.12, 1.1], [SG, 0.08, -1.4]].forEach(([col, alpha, rot], i) => {
          this._after(i * 120, () => {
            this.engine.addEffect(new RayBurst({
              color:    col,
              duration: 11000,
              maxAlpha: alpha,
              rayCount: Math.floor(this.fx.rayCount * (1 - i * 0.12)),
              rotSpeed: rot,
            }));
          });
        });

        // Sacred gold glow — deepest in the game
        this.engine.addEffect(new GlowOverlay({
          color:      SG_GLOW,
          duration:   11000,
          maxAlpha:   this.fx.glowMaxAlpha,
          fadeIn:     0.04,
          fadeOut:    0.18,
          radial:     true,
          pulseSpeed: 1.6,
        }));

        // Second white overlay layer — divine brightness
        this.engine.addEffect(new GlowOverlay({
          color:      SW_GLOW,
          duration:   8000,
          maxAlpha:   0.5,
          fadeIn:     0.05,
          fadeOut:    0.35,
          radial:     true,
          pulseSpeed: 2.2,
        }));

        // Crystal particle storm — gold + white + pale
        [[SW, 1.0], [SG, 0.85], [SL, 0.6]].forEach(([col, scale], i) => {
          this._after(i * 160, () => {
            this.engine.addEffect(new ParticleBurst(0.5, 0.35, {
              count:    Math.floor(this.fx.particleCount * scale),
              color:    col,
              minSpeed: 120 + i * 80,
              maxSpeed: 500 + i * 60,
              minSize:  2,
              maxSize:  10,
              gravity:  45,
              trail:    this.fx.trailEnabled,
              glow:     true,
              duration: 9000,
              type:     i === 0 ? 'star' : 'spark',
            }));
          });
        });

        // Continuous golden radiance upward — divine wind
        this.engine.addEffect(new ContinuousParticles({
          ox:        0.5,
          oy:        0.5,
          color:     SG,
          minSpeed:  80,
          maxSpeed:  280,
          gravity:   -100,
          upBias:    180,
          spread:    Math.PI * 0.7,
          angle:     -Math.PI / 2,
          minSize:   2,
          maxSize:   7,
          trail:     true,
          glow:      true,
          spawnRate: 0.04,
          duration:  10000,
          type:      'star',
        }));

        // Gold petals drifting down — aftermath of the beam
        this.engine.addEffect(new ContinuousParticles({
          ox:        w => rnd(0.2, 0.8) * w,
          oy:        0,
          color:     SL,
          minSpeed:  30,
          maxSpeed:  110,
          gravity:   80,
          spread:    Math.PI * 0.5,
          angle:     Math.PI / 2,
          minSize:   2,
          maxSize:   5,
          trail:     true,
          glow:      true,
          spawnRate: 0.025,
          duration:  9000,
          type:      'spark',
        }));
      });

      // ── Phase 12: S A C R E D   B L A D E label ──────────────
      this._after(9800, () => {
        this._spawnLabel();
        this._sfxFanfare();

        // Gold aura rings — round, majestic stagger
        const auraColors = [SG, SW, SL, SG, SW, SG, SL, SG];
        for (let i = 0; i < this.fx.auraCount; i++) {
          this._after(i * 220, () => {
            const aura = spawn(mk('sb-charge-ring'));
            const sz   = 90 + i * 75;
            const col  = auraColors[i % auraColors.length];
            aura.style.cssText = `
              width:${sz}px;height:${sz}px;
              border:${3 - i * 0.2}px solid ${col};
              background:${col}14;
              box-shadow:0 0 ${28+i*14}px ${col},0 0 ${65+i*28}px rgba(255,215,0,${.5-i*.04});
              animation-duration:${1.8+i*.28}s;
            `;
            this._after(3800, () => aura.remove());
          });
        }
      });

      // ── Phase 13: Typewriter ──────────────────────────────────
      this._after(11500, () => this._spawnTypewriter());

      // ── Phase 15: Resolve ─────────────────────────────────────
      this._after(22000, () => {
        killSpawned();
        if (this._actx) { try { this._actx.close(); } catch(e){} }
        resolve();
      });
    });
  }

  stop() {
    this.stopped = true;
    this._timers.forEach(clearTimeout);
    this._timers = [];
    document.body.classList.remove('sb-shake', 'sb-charge-shake', 'sb-beam-shake');
    if (this._actx) { try { this._actx.close(); } catch(e){} }
    killSpawned();
  }

  // ── 30 horizontal sacred wind streaks ────────────────────────
  _spawnWindStreaks(count, implode = false) {
    for (let i = 0; i < count; i++) {
      const streak = spawn(mk('sb-wind'));
      const yPos   = rnd(2, 98);
      const h      = rnd(1, implode ? 2.5 : 3);
      const ww     = rnd(20, 55);
      const fromLeft = Math.random() > .5;
      // Opacity varies — brightest near center vertically
      const distFromMid = Math.abs(yPos - 50) / 50;
      const op     = (.3 + (1 - distFromMid) * .55).toFixed(2);
      // Glow intensity
      const glow   = `${rnd(2, 8).toFixed(1)}px`;
      // Color: mostly white-gold, some pure white, some gold
      const colIdx = Math.floor(Math.random() * 3);
      const col    = colIdx === 0 ? `rgba(255,244,176,.8)` : colIdx === 1 ? `rgba(255,254,240,.9)` : `rgba(255,215,0,.7)`;

      streak.style.setProperty('--wy', yPos + 'vh');
      streak.style.setProperty('--wh', h + 'px');
      streak.style.setProperty('--wc', col);
      streak.style.setProperty('--wglow', glow);
      streak.style.setProperty('--wop', op);
      streak.style.setProperty('--wdur', (rnd(.6, 2.2)) + 's');
      streak.style.setProperty('--wease', 'ease-in');

      if (fromLeft) {
        streak.style.setProperty('--wx0', `-${ww}vw`);
        streak.style.setProperty('--wx1', `calc(50% - 2px)`);
        streak.style.setProperty('--ww', ww + 'vw');
        streak.style.setProperty('--ww2', '2px');
      } else {
        streak.style.setProperty('--wx0', `${100}vw`);
        streak.style.setProperty('--wx1', `calc(50% - 2px)`);
        streak.style.setProperty('--ww', ww + 'vw');
        streak.style.setProperty('--ww2', '2px');
      }
      streak.style.animationDelay = rnd(0, 1.2) + 's';
      this._after(3500, () => streak.remove());
    }
  }

  // ── Holy sword DOM structure ──────────────────────────────────
  _spawnSword() {
    const sword  = spawn(mk('sb-sword'));
    this._swordEl = sword;

    const inner = document.createElement('div');
    inner.className = 'sb-sword-inner';

    const blade   = document.createElement('div');
    blade.className = 'sb-blade';

    const fuller  = document.createElement('div');
    fuller.className = 'sb-fuller';
    blade.appendChild(fuller);

    const shimmer = document.createElement('div');
    shimmer.className = 'sb-shimmer';
    blade.appendChild(shimmer);

    const guard   = document.createElement('div');
    guard.className = 'sb-guard';

    const grip    = document.createElement('div');
    grip.className = 'sb-grip';

    const pommel  = document.createElement('div');
    pommel.className = 'sb-pommel';

    inner.appendChild(blade);
    inner.appendChild(guard);
    inner.appendChild(grip);
    inner.appendChild(pommel);
    sword.appendChild(inner);
  }

  // ── 80 golden orb particles spiraling inward to blade tip ────
  _spawnOrbParticles(count) {
    for (let i = 0; i < count; i++) {
      this._after(i * 18, () => {
        const orb  = spawn(mk('sb-orb'));
        const sz   = rnd(2, 7);
        const ang  = rnd(0, Math.PI * 2);
        const dist = rnd(30, 85);
        // Start: somewhere on screen away from center
        const ox0  = Math.cos(ang) * dist;
        const oy0  = Math.sin(ang) * dist;
        // End: near sword tip — center top third
        const ox1  = rnd(-8, 8);
        const oy1  = rnd(-42, -30);
        const dur  = rnd(.8, 1.6);
        const col  = Math.random() > .3 ? SG : Math.random() > .5 ? SW : SL;
        orb.style.cssText = `
          width:${sz}px;height:${sz}px;
          background:${col};
          box-shadow:0 0 ${sz*2}px ${sz}px ${col}88;
          left:50vw;top:50vh;
          animation-duration:${dur}s;
          animation-delay:${i*18}ms;
        `;
        orb.style.setProperty('--ox0', ox0 + 'vmin');
        orb.style.setProperty('--oy0', oy0 + 'vmin');
        orb.style.setProperty('--ox1', ox1 + 'vmin');
        orb.style.setProperty('--oy1', oy1 + 'vh');
        this._after((dur + .3) * 1000 + i * 18, () => orb.remove());
      });
    }
  }

  // ── 5 holy crosses at fixed positions around screen ──────────
  _spawnCrosses(count) {
    const positions = [
      ['18vw', '22vh'], ['82vw', '20vh'],
      ['50vw', '12vh'],
      ['15vw', '72vh'], ['85vw', '70vh'],
    ];
    const sizes = [
      [4, 60, 28], [4, 60, 28], [6, 80, 36],
      [3, 50, 22], [3, 50, 22],
    ];

    positions.slice(0, count).forEach(([lft, top], i) => {
      this._after(i * 140, () => {
        const cross = spawn(mk('sb-cross'));
        cross.style.left = lft;
        cross.style.top  = top;
        cross.style.animationDelay = '0ms';

        const [bw, bh, hw] = sizes[i];

        // Vertical bar
        const v = document.createElement('div');
        v.className = 'sb-cross-v';
        v.style.cssText = `width:${bw}px;height:${bh}px`;

        // Horizontal bar
        const h = document.createElement('div');
        h.className = 'sb-cross-h';
        h.style.cssText = `width:${hw}px;height:${bw}px`;

        // Halo ring behind cross
        const halo = document.createElement('div');
        halo.className = 'sb-cross-halo';
        const hr = Math.round(hw * 0.75);
        halo.style.cssText = `width:${hr*2}px;height:${hr*2}px`;

        cross.appendChild(halo);
        cross.appendChild(v);
        cross.appendChild(h);
        this._after(2800, () => cross.remove());
      });
    });
  }

  // ── Charge rings expanding from center ───────────────────────
  _spawnChargeRings(count) {
    for (let i = 0; i < count; i++) {
      this._after(i * 90, () => {
        const ring = spawn(mk('sb-charge-ring'));
        const col  = i % 3 === 0 ? SW : i % 3 === 1 ? SG : SL;
        const maxSz = 50 + i * 55;
        ring.style.cssText = `
          width:${maxSz}px;height:${maxSz}px;
          border:${2.5 - i*0.1}px solid ${col};
          box-shadow:0 0 ${14+i*5}px ${col},0 0 ${35+i*12}px rgba(255,215,0,${.5-i*.03});
          animation-duration:${1.1+i*.15}s;
        `;
        this._after(1600, () => ring.remove());
      });
    }
  }

  // ── 12 rings expanding from sword tip position ───────────────
  _spawnTipRings(count) {
    for (let i = 0; i < count; i++) {
      this._after(i * 110, () => {
        // Sword tip is at roughly 50%w, 56vh from top (8vh start + ~48vh blade)
        const ring = document.createElement('div');
        ring.className = 'sb-charge-ring';
        ring.style.cssText = `
          position:fixed;left:50%;top:56vh;
          width:${30+i*40}px;height:${30+i*40}px;
          border:2px solid ${i%2===0 ? SG : SW};
          box-shadow:0 0 ${10+i*5}px ${SG};
          animation-duration:${.9+i*.12}s;
          transform:translate(-50%,-50%);
        `;
        spawn(ring);
        this._after(1400, () => ring.remove());
      });
    }
  }

  // ── 28 wind streaks imploding hard toward center ─────────────
  _spawnImplodeStreaks(count) {
    for (let i = 0; i < count; i++) {
      const streak = spawn(mk('sb-implode'));
      const yPos   = rnd(1, 99);
      const h      = rnd(1.5, 3.5);
      const fromLeft = Math.random() > .5;
      const startX = fromLeft ? rnd(-60, -5) + 'vw' : rnd(105, 160) + 'vw';
      const iw     = rnd(25, 70) + 'vw';
      const dur    = rnd(.18, .45) + 's';

      streak.style.setProperty('--iy', yPos + 'vh');
      streak.style.setProperty('--ih', h + 'px');
      streak.style.setProperty('--ix0', startX);
      streak.style.setProperty('--iw', iw);
      streak.style.setProperty('--idur', dur);
      streak.style.animationDelay = rnd(0, 200) + 'ms';
      this._after(900, () => streak.remove());
    }
  }

  // ── Vertical beam pillar ─────────────────────────────────────
  _spawnBeam() {
    const beam = spawn(mk('sb-beam'));
    const inner = document.createElement('div');
    inner.className = 'sb-beam-inner';
    const core  = document.createElement('div');
    core.className = 'sb-beam-core';
    beam.appendChild(inner);
    beam.appendChild(core);
    this._after(3500, () => beam.remove());

    // 14 light streaks erupting upward along beam path
    for (let i = 0; i < 14; i++) {
      this._after(i * 60, () => {
        const streak = spawn(mk('sb-beam-streak'));
        const offset = rnd(-35, 35);
        streak.style.left = `calc(50% + ${offset}px)`;
        const goUp   = Math.random() > .35;
        const len    = rnd(10, 45);
        streak.style.setProperty('--st', goUp ? '0vh' : '90vh');
        streak.style.setProperty('--sh', len + 'vh');
        streak.style.animationDuration = rnd(.4, .9) + 's';
        streak.style.opacity = rnd(.4, .9).toString();
        this._after(1200, () => streak.remove());
      });
    }
  }

  // ── 200 crystal gold shards raining from beam column ─────────
  _spawnShardRain(count) {
    for (let i = 0; i < count; i++) {
      this._after(i * 12, () => {
        const shard = spawn(mk('sb-shard'));
        const sz    = rnd(4, 16);
        // Start near beam column (center, varying height)
        const sx    = rnd(-30, 30);
        const sy    = rnd(-50, 30);
        // Fall: downward + sideways drift
        const dx    = rnd(-45, 45);
        const dy    = rnd(40, 120);
        const rot1  = rnd(0, 360);
        const rot2  = rnd(rot1 + 90, rot1 + 540);
        const dur   = rnd(.8, 1.8);
        const col   = Math.random() > .4 ? SG : Math.random() > .5 ? SW : SL;
        shard.style.cssText = `
          width:${sz}px;height:${sz}px;
          left:calc(50vw + ${sx}px);
          top:calc(35vh + ${sy}px);
          background:${col};
          box-shadow:0 0 ${sz}px ${col};
          animation-duration:${dur}s;
          animation-delay:${i*10}ms;
        `;
        shard.style.setProperty('--sr',  rot1 + 'deg');
        shard.style.setProperty('--sr2', rot2 + 'deg');
        shard.style.setProperty('--sdx', dx + 'vw');
        shard.style.setProperty('--sdy', dy + 'vh');
        this._after((dur + .3) * 1000 + i * 12, () => shard.remove());
      });
    }
  }

  // ── Sacred hexagram (two overlapping triangles) ───────────────
  _spawnHexagram() {
    const hex = spawn(mk('sb-hexagram'));
    const SIZE = 110;   // triangle half-base size

    // Up-pointing triangle
    const tri1 = document.createElement('div');
    tri1.className = 'sb-tri';
    tri1.style.setProperty('--ta',   '0deg');
    tri1.style.setProperty('--ts',   SIZE + 'px');
    tri1.style.setProperty('--tspd', '9s');
    tri1.style.borderTop = `${SIZE * 1.73}px solid transparent`;
    // Down-pointing triangle
    const tri2 = document.createElement('div');
    tri2.className = 'sb-tri';
    tri2.style.setProperty('--ta',   '180deg');
    tri2.style.setProperty('--ts',   SIZE + 'px');
    tri2.style.setProperty('--tspd', '12s');
    tri2.style.borderBottom = `${SIZE * 1.73}px solid transparent`;

    // Style both triangles as CSS borders (gold gradient via box-shadow)
    [tri1, tri2].forEach(t => {
      t.style.filter = `drop-shadow(0 0 8px ${SG}) drop-shadow(0 0 22px rgba(255,215,0,.5))`;
      t.style.opacity = '.75';
    });

    // Override the CSS border-color after setting defaults
    tri1.style.borderLeftColor   = 'transparent';
    tri1.style.borderRightColor  = 'transparent';
    tri1.style.borderBottomColor = SG;
    tri1.style.borderBottomWidth = `${SIZE * 1.73}px`;
    tri1.style.borderTopWidth    = '0';

    tri2.style.borderLeftColor   = 'transparent';
    tri2.style.borderRightColor  = 'transparent';
    tri2.style.borderTopColor    = SL;
    tri2.style.borderTopWidth    = `${SIZE * 1.73}px`;
    tri2.style.borderBottomWidth = '0';

    // Center rings
    [140, 200, 260].forEach((ringsz, idx) => {
      const ring = document.createElement('div');
      ring.className = 'sb-hex-ring';
      ring.style.cssText = `width:${ringsz}px;height:${ringsz}px;`;
      ring.style.animationDelay = idx * 0.3 + 's';
      hex.appendChild(ring);
    });

    hex.appendChild(tri1);
    hex.appendChild(tri2);
    this._after(5800, () => hex.remove());
  }

  // ── S A C R E D   B L A D E label ────────────────────────────
  _spawnLabel() {
    const label = spawn(mk('sb-label'));
    const main  = document.createElement('div');
    main.className   = 'sb-label-main';
    main.textContent = 'S A C R E D   B L A D E';
    const sub   = document.createElement('div');
    sub.className    = 'sb-label-sub';
    sub.textContent  = '✦   1 / 150,000  ·  THE WORTHY ALONE MAY HOLD THE LIGHT   ✦';
    label.appendChild(main);
    label.appendChild(sub);
    this._after(9000, () => label.remove());
  }

  // ── "ONLY THE WORTHY MAY HOLD THE LIGHT" typewriter ──────────
  _spawnTypewriter() {
    const el   = spawn(mk('sb-typewriter'));
    const TEXT = 'ONLY THE WORTHY MAY HOLD THE LIGHT';
    const cur  = document.createElement('span');
    cur.className = 'sb-cursor';
    el.appendChild(cur);

    let idx = 0;
    const type = () => {
      if (this.stopped || !el.isConnected) return;
      if (idx < TEXT.length) {
        el.insertBefore(document.createTextNode(TEXT[idx]), cur);
        idx++;
        // Subtle sacred chime every few characters
        if (idx % 5 === 0) this._sfxChime();
        const delay = 65 + (TEXT[idx - 1] === ' ' ? 100 : 0) + (Math.random() > .9 ? 160 : 0);
        this._timers.push(setTimeout(type, delay));
      } else {
        this._after(2800, () => cur.remove());
      }
    };
    this._timers.push(setTimeout(type, 300));
    this._after(8000, () => el.remove());
  }

  // ═══════════════════════════════════════════════════════════
  //  W E B   A U D I O   —   S A C R E D   S O U N D S
  //  All sounds synthesized — no external files
  // ═══════════════════════════════════════════════════════════

  _audio() {
    if (!this._actx) {
      try {
        this._actx = new (window.AudioContext || window.webkitAudioContext)();
      } catch(e) { return null; }
    }
    if (this._actx.state === 'suspended') this._actx.resume();
    return this._actx;
  }

  // Square wave tone helper
  _beep(ctx, t, freq, dur, vol = 0.15, type = 'sine') {
    try {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.start(t);
      osc.stop(t + dur + 0.01);
    } catch(e) {}
  }

  // Filtered noise helper
  _noise(ctx, t, dur, vol = 0.12, filterFreq = 800) {
    try {
      const bufSz  = ctx.sampleRate * dur;
      const buf    = ctx.createBuffer(1, bufSz, ctx.sampleRate);
      const data   = buf.getChannelData(0);
      for (let i = 0; i < bufSz; i++) data[i] = Math.random() * 2 - 1;
      const src    = ctx.createBufferSource();
      src.buffer   = buf;
      const filt   = ctx.createBiquadFilter();
      filt.type    = 'bandpass';
      filt.frequency.value = filterFreq;
      filt.Q.value = 0.7;
      const gain   = ctx.createGain();
      src.connect(filt);
      filt.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(vol, t + dur * .3);
      gain.gain.linearRampToValueAtTime(0, t + dur);
      src.start(t);
    } catch(e) {}
  }

  // Wind build — filtered noise sweep rising in pitch
  _sfxWindBuild() {
    const ctx = this._audio();
    if (!ctx) return;
    const t = ctx.currentTime;
    // Two noise bands — low rumble + high whistle
    this._noise(ctx, t,       4.5, 0.10, 140);
    this._noise(ctx, t + 1.0, 3.0, 0.08, 1200);
    this._noise(ctx, t + 2.5, 2.0, 0.12, 600);
  }

  // Charge — rising sine sweep + harmonic layers
  _sfxCharge() {
    const ctx = this._audio();
    if (!ctx) return;
    try {
      const t = ctx.currentTime;
      // Rising sweep: 200 → 900 Hz over 1.8s
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(200, t);
      osc.frequency.exponentialRampToValueAtTime(900, t + 1.8);
      gain.gain.setValueAtTime(0.14, t);
      gain.gain.linearRampToValueAtTime(0.22, t + 1.4);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 2.0);
      osc.start(t);
      osc.stop(t + 2.1);

      // Harmonic fifth above
      const osc2  = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(300, t + .4);
      osc2.frequency.exponentialRampToValueAtTime(1350, t + 1.8);
      gain2.gain.setValueAtTime(0, t);
      gain2.gain.linearRampToValueAtTime(0.10, t + .6);
      gain2.gain.exponentialRampToValueAtTime(0.0001, t + 2.0);
      osc2.start(t + .4);
      osc2.stop(t + 2.1);

      // Wind noise during charge
      this._noise(ctx, t, 2.0, 0.08, 500);
    } catch(e) {}
  }

  // Beam — bright impact burst + held holy chord
  _sfxBeam() {
    const ctx = this._audio();
    if (!ctx) return;
    const t = ctx.currentTime;
    // Impact burst: very loud, very short
    this._beep(ctx, t,      1480, 0.06, 0.28, 'square');
    this._beep(ctx, t,      880,  0.10, 0.25, 'sine');
    this._beep(ctx, t,      440,  0.12, 0.22, 'sine');
    this._beep(ctx, t,      220,  0.15, 0.20, 'sine');
    // Held sacred drone after impact — C major chord
    // C4, E4, G4, C5
    [[262, .22],[330, .18],[392, .16],[524, .14]].forEach(([f, vol]) => {
      this._beep(ctx, t + 0.05, f, 2.8, vol, 'sine');
    });
    // High shimmer — pure high sine floating above
    this._beep(ctx, t + 0.12, 2093, 1.5, 0.07, 'sine');

    // Wind release — noise burst
    this._noise(ctx, t, 1.5, 0.18, 350);
  }

  // Victory fanfare — full sacred organ voicing, 10 notes
  _sfxFanfare() {
    const ctx = this._audio();
    if (!ctx) return;
    const t = ctx.currentTime;
    // Melody: G4 → C5 → E5 → G5 → C6 (majestic, original ascending)
    // With a held final chord
    const melody = [
      [392, 0.00, 0.14, 0.22],
      [523, 0.14, 0.14, 0.22],
      [659, 0.28, 0.14, 0.22],
      [784, 0.42, 0.20, 0.24],
      [784, 0.62, 0.09, 0.20],
      [880, 0.71, 0.14, 0.22],
      [988, 0.85, 0.14, 0.22],
      [1047,0.99, 0.55, 0.26],  // C6 — held final note
    ];
    melody.forEach(([f, off, dur, vol]) => {
      this._beep(ctx, t + off, f, dur, vol, 'sine');
    });
    // Low bass pedal — C3 and G3 sustained under melody
    this._beep(ctx, t, 131, 1.7, 0.10, 'sine');   // C3
    this._beep(ctx, t, 196, 1.7, 0.08, 'sine');   // G3
    // Middle harmony — E4, G4, C5 held chords (organ layer)
    [[330, 0.08],[392, 0.08],[523, 0.08]].forEach(([f, off]) => {
      this._beep(ctx, t + off, f, 1.6, 0.07, 'sine');
    });
    // High shimmer trail at end
    this._beep(ctx, t + 1.2, 2093, .8, 0.06, 'sine');
    this._beep(ctx, t + 1.4, 2637, .6, 0.05, 'sine');
  }

  // Subtle sacred chime for typewriter
  _sfxChime() {
    const ctx = this._audio();
    if (!ctx) return;
    const t = ctx.currentTime;
    // Gentle bell-like two-note chime
    this._beep(ctx, t,       1319, 0.18, 0.06, 'sine');
    this._beep(ctx, t + 0.06, 1568, 0.14, 0.04, 'sine');
  }
}