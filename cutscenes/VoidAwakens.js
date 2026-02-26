// cutscenes/VoidAwakens.js
// ═══════════════════════════════════════════════════════════════
//  V O I D   A W A K E N S  —  1 / 125,000
//  Hybrid: DOM/CSS + SVG cracks + canvas particle engine + Web Audio
//
//  Before the universe, there was the Void.
//  Before the Void, there was the question.
//  The question answered itself — and existence began.
//
//  Phase 0  (0ms)    : Total blackout — absolute silence
//  Phase 1  (300ms)  : The Singularity — impossible pinpoint of light
//  Phase 2  (700ms)  : 24 void tendrils crawl outward
//  Phase 3  (1100ms) : Reality fractures — SVG fractal crack lattice
//  Phase 4  (1650ms) : Gravitational collapse — darkness swallows all
//  Phase 5  (2300ms) : DETONATION — white flash + Eye of Void + 9 rings
//  Phase 6  (3000ms) : 90 void shards erupt from center
//  Phase 7  (3800ms) : Nebula flood + 120 newborn stars scatter
//  Phase 8  (5200ms) : 10 void-consciousness symbols orbit center
//  Phase 9  (6400ms) : Canvas — violet/white ray bursts + storm
//  Phase 10 (7600ms) : VOID AWAKENS label + aura rings
//  Phase 11 (9200ms) : "ALL THAT EXISTS WAS ONCE NOTHING." typewriter
//  Phase 12 (14500ms): Void fades
//  Phase 13 (20000ms): Resolve
// ═══════════════════════════════════════════════════════════════

import { ParticleBurst, ContinuousParticles } from '../effects/ParticleBurst.js';
import { GlowOverlay, RayBurst }               from '../effects/GlowOverlay.js';

// ── Palette ───────────────────────────────────────────────────
const VP  = '#9060ff';              // void purple
const VL  = '#c8a8ff';              // void lavender
const VW  = '#f0e8ff';              // void white-violet
const VD  = '#1a0040';              // void deep
const VB  = '#6040e0';              // void blue-purple
const VT  = '#40c8ff';              // void teal accent
const VA  = '#ffffff';              // absolute white

const VP_GLOW  = 'rgba(144,96,255,0.95)';
const VL_GLOW  = 'rgba(200,168,255,0.85)';
const VT_GLOW  = 'rgba(64,200,255,0.8)';

// Shard / nebula / star colors
const VOID_PALETTE = [VA, VL, VP, VB, VT, '#ff80ff', '#80a0ff', '#ffd0ff'];

// Void-consciousness symbols — esoteric Unicode, no specific religion
const VOID_SYMBOLS = ['⊗', '◉', '⊕', '○', '◈', '⊖', '◎', '⊙', '⊘', '◊'];

// ── CSS ───────────────────────────────────────────────────────
const CSS = `
/* ── Phase 0: Blackout void ── */
.va-void {
  position:fixed;inset:0;background:#000;
  z-index:9990;pointer-events:none;
  opacity:1;transition:opacity 2s ease;
}
.va-void--fade { opacity:0; }

/* ── Phase 1: Singularity ── */
.va-singularity {
  position:fixed;left:50%;top:50%;
  width:3px;height:3px;border-radius:50%;
  transform:translate(-50%,-50%);
  pointer-events:none;z-index:10000;
  background:#fff;
  animation:vaSingularityBirth 1.2s cubic-bezier(.0,.0,.2,1) forwards;
  opacity:0;
}
@keyframes vaSingularityBirth {
  0%  {transform:translate(-50%,-50%) scale(0);opacity:0;
       box-shadow:none}
  15% {opacity:1;transform:translate(-50%,-50%) scale(1)}
  55% {transform:translate(-50%,-50%) scale(2.8);
       box-shadow:0 0 30px 10px ${VL},0 0 80px 30px ${VP}cc,0 0 180px 70px rgba(100,60,220,.45)}
  100%{transform:translate(-50%,-50%) scale(5);
       box-shadow:0 0 60px 20px ${VW},0 0 140px 55px ${VL},0 0 320px 110px rgba(100,60,220,.6)}
}
/* Shimmer ring on singularity */
.va-singularity::before {
  content:'';position:absolute;inset:-10px;border-radius:50%;
  background:radial-gradient(circle,rgba(255,255,255,.9) 0%,${VL}bb 40%,transparent 72%);
  animation:vaSingFlicker .06s linear infinite alternate;
}
@keyframes vaSingFlicker {
  from{transform:scale(1);opacity:.85}
  to  {transform:scale(1.3);opacity:1}
}

/* ── Phase 2: Void tendrils ── */
.va-tendril {
  position:fixed;left:50%;top:50%;
  width:2px;
  transform-origin:bottom center;
  pointer-events:none;z-index:9993;border-radius:1px;
  animation:vaTendrilGrow ease-out forwards;
}
@keyframes vaTendrilGrow {
  0%  {height:0;opacity:0;transform:translate(-50%,0) rotate(var(--ta)) scaleX(1)}
  18% {opacity:1}
  65% {height:var(--tl);opacity:.85;transform:translate(-50%,0) rotate(var(--ta)) scaleX(var(--tw))}
  100%{height:var(--tl);opacity:0;transform:translate(-50%,0) rotate(var(--ta)) scaleX(.1)}
}

/* ── Phase 3: Reality crack layer ── */
.va-crack-layer {
  position:fixed;inset:0;z-index:9994;pointer-events:none;
  animation:vaCrackReveal .9s ease forwards;
}
@keyframes vaCrackReveal {
  0%  {opacity:0}
  12% {opacity:1}
  75% {opacity:1}
  100%{opacity:0}
}
.va-crack-layer svg {
  width:100%;height:100%;position:absolute;inset:0;
}
.va-crack-layer svg path {
  stroke:${VL};stroke-width:1.5px;fill:none;
  filter:drop-shadow(0 0 4px ${VP}) drop-shadow(0 0 14px rgba(120,80,255,.7));
  stroke-dasharray:1000;stroke-dashoffset:1000;
  animation:vaCrackDraw .8s ease-out forwards;
  animation-delay:var(--cd,0s);
}
@keyframes vaCrackDraw { to{stroke-dashoffset:0} }

/* Crack glow nodes */
.va-crack-node {
  position:fixed;width:7px;height:7px;border-radius:50%;
  background:#fff;transform:translate(-50%,-50%);
  pointer-events:none;z-index:9995;
  box-shadow:0 0 8px 3px ${VL},0 0 22px 8px ${VP}bb;
  animation:vaCrackNode .55s ease forwards;
  animation-delay:var(--cn,0s);
}
@keyframes vaCrackNode {
  0%  {transform:translate(-50%,-50%) scale(0);opacity:1}
  50% {transform:translate(-50%,-50%) scale(2);opacity:1}
  100%{transform:translate(-50%,-50%) scale(.5);opacity:0}
}

/* ── Phase 4: Gravity collapse ── */
.va-gravity {
  position:fixed;left:50%;top:50%;
  width:24px;height:24px;border-radius:50%;
  transform:translate(-50%,-50%);
  pointer-events:none;z-index:9999;
  background:radial-gradient(circle,#000 0%,${VD} 55%,transparent 100%);
  animation:vaGravityCollapse .55s cubic-bezier(.4,0,1,.6) forwards;
}
@keyframes vaGravityCollapse {
  0%  {transform:translate(-50%,-50%) scale(0);opacity:0}
  28% {opacity:1}
  100%{transform:translate(-50%,-50%) scale(32);opacity:.97}
}

/* ── Phase 5: White detonation flash ── */
.va-detonation {
  position:fixed;inset:0;pointer-events:none;z-index:10003;
  background:radial-gradient(circle at 50% 50%,
    ${VA} 0%,rgba(220,200,255,.9) 30%,rgba(140,80,255,.5) 65%,transparent 85%);
  animation:vaDetonate .55s ease-out forwards;
}
@keyframes vaDetonate {
  0%  {opacity:0;transform:scale(0)}
  15% {opacity:1;transform:scale(.4)}
  40% {opacity:1;transform:scale(1)}
  100%{opacity:0;transform:scale(2.8)}
}

/* Chromatic aberration fringe */
.va-chroma {
  position:fixed;inset:0;pointer-events:none;z-index:10004;
  mix-blend-mode:screen;
  background:
    radial-gradient(circle at 48.5% 50%,rgba(255,0,0,.1) 0%,transparent 55%),
    radial-gradient(circle at 51.5% 50%,rgba(0,0,255,.1) 0%,transparent 55%);
  animation:vaChroma .65s ease forwards;
}
@keyframes vaChroma {
  0%  {opacity:0;transform:scale(.8)}
  28% {opacity:1;transform:scale(1.06)}
  100%{opacity:0;transform:scale(1.35)}
}

/* ── Phase 5: Eye of the Void ── */
.va-eye {
  position:fixed;left:50%;top:50%;
  width:88px;height:88px;border-radius:50%;
  transform:translate(-50%,-50%);
  pointer-events:none;z-index:10002;
  background:radial-gradient(circle,
    #fff 0%,${VW} 14%,${VP} 36%,${VD} 62%,#000 100%);
  box-shadow:
    0 0 40px 20px rgba(180,140,255,.8),
    0 0 110px 55px rgba(120,80,255,.5),
    0 0 210px 110px rgba(80,40,200,.3);
  animation:vaEyeAwaken .75s cubic-bezier(.0,.5,.2,1) forwards,
            vaEyePulse   1.8s 1s ease-in-out infinite;
  opacity:0;
}
@keyframes vaEyeAwaken {
  0%  {transform:translate(-50%,-50%) scale(0);opacity:0}
  38% {opacity:1}
  100%{transform:translate(-50%,-50%) scale(1);opacity:1}
}
@keyframes vaEyePulse {
  0%,100%{box-shadow:0 0 40px 20px rgba(180,140,255,.8),0 0 110px 55px rgba(120,80,255,.5),0 0 210px 110px rgba(80,40,200,.3)}
  50%    {box-shadow:0 0 70px 35px rgba(200,170,255,.95),0 0 180px 90px rgba(144,96,255,.7),0 0 350px 160px rgba(100,60,220,.45)}
}

/* ── Phase 5: Awakening rings ── */
.va-ring {
  position:fixed;left:50%;top:50%;border-radius:50%;
  transform:translate(-50%,-50%);
  pointer-events:none;z-index:10001;
  animation:vaRingExpand ease-out forwards;
}
@keyframes vaRingExpand {
  from{transform:translate(-50%,-50%) scale(.05);opacity:1}
  60% {opacity:.85}
  to  {transform:translate(-50%,-50%) scale(38);opacity:0}
}

/* ── Phase 6: Void shards ── */
.va-shard {
  position:fixed;border-radius:50%;
  pointer-events:none;z-index:9997;
  animation:vaShardFly ease-out forwards;
}
@keyframes vaShardFly {
  0%  {opacity:1;transform:translate(-50%,-50%) rotate(var(--sa)) translateX(0) scale(1.2)}
  68% {opacity:.8}
  100%{opacity:0;transform:translate(-50%,-50%) rotate(var(--sa)) translateX(var(--sr)) scale(0)}
}

/* ── Phase 7: Newborn stars ── */
.va-star {
  position:fixed;border-radius:50%;
  pointer-events:none;z-index:9992;
  background:#fff;
  animation:vaStarErupt ease-out forwards;
}
@keyframes vaStarErupt {
  0%  {transform:scale(0);opacity:0}
  18% {opacity:1}
  60% {opacity:.9}
  100%{opacity:0;transform:scale(var(--ss))}
}

/* Nebula wash */
.va-nebula {
  position:fixed;inset:0;pointer-events:none;z-index:9991;
  animation:vaNebulaFlood 1.4s ease forwards;
}
@keyframes vaNebulaFlood {
  0%  {opacity:0}
  28% {opacity:1}
  100%{opacity:0}
}

/* ── Phase 8: Void consciousness symbols ── */
.va-symbol {
  position:fixed;left:50%;top:50%;
  pointer-events:none;z-index:9996;
  font-family:'Georgia',serif;font-weight:700;
  color:${VL};
  text-shadow:0 0 10px ${VP},0 0 24px rgba(144,96,255,.5);
  animation:vaSymbolOrbit linear infinite, vaSymbolFade ease forwards;
  transform-origin:0 0;
}
@keyframes vaSymbolOrbit {
  0%  {transform:rotate(var(--so0)) translateX(var(--sr2)) rotate(calc(-1 * var(--so0)))}
  100%{transform:rotate(var(--so1)) translateX(var(--sr2)) rotate(calc(-1 * var(--so1)))}
}
@keyframes vaSymbolFade {
  0%  {opacity:0} 15%{opacity:1} 80%{opacity:.8} 100%{opacity:0}
}

/* ── Phase 10: VOID AWAKENS label ── */
.va-label {
  position:fixed;left:50%;top:50%;
  transform:translate(-50%,-50%);
  pointer-events:none;z-index:10012;
  display:flex;flex-direction:column;align-items:center;gap:14px;
  animation:vaLabelReveal 8.5s ease forwards;
}
@keyframes vaLabelReveal {
  0%  {opacity:0;transform:translate(-50%,-50%) scale(.38);filter:blur(20px)}
  7%  {opacity:1;transform:translate(-50%,-50%) scale(1.04);filter:blur(0)}
  13% {transform:translate(-50%,-50%) scale(1)}
  83% {opacity:1}
  100%{opacity:0;transform:translate(-50%,-50%) scale(1.06)}
}

.va-label-main {
  font-family:'Georgia','Times New Roman',serif;
  font-size:50px;font-weight:700;
  letter-spacing:14px;
  color:${VW};
  text-shadow:
    0 0 10px ${VL},0 0 28px ${VP},
    0 0 65px ${VP_GLOW},0 0 140px rgba(100,60,220,.5);
  border:2px solid rgba(200,170,255,.65);
  padding:16px 46px;
  background:rgba(2,0,10,.96);
  box-shadow:
    0 0 28px ${VP_GLOW},0 0 70px rgba(144,96,255,.35),
    inset 0 0 28px rgba(120,80,255,.1);
  animation:vaLabelGlow 1.3s ease-in-out infinite alternate;
}
@keyframes vaLabelGlow {
  from{
    box-shadow:0 0 28px ${VP_GLOW},0 0 70px rgba(144,96,255,.35),inset 0 0 28px rgba(120,80,255,.1);
    border-color:rgba(200,170,255,.65);
  }
  to  {
    box-shadow:0 0 55px ${VP_GLOW},0 0 130px ${VL_GLOW},0 0 240px ${VT_GLOW},inset 0 0 55px rgba(120,80,255,.2);
    border-color:${VT};
  }
}

.va-label-sub {
  font-family:'Georgia',serif;font-style:italic;
  font-size:11px;letter-spacing:7px;
  color:rgba(200,170,255,.55);
  text-shadow:0 0 10px rgba(144,96,255,.5);
}

/* Phase 11: Typewriter */
.va-typewriter {
  position:fixed;left:50%;top:calc(50% + 90px);
  transform:translateX(-50%);
  pointer-events:none;z-index:10013;
  font-family:'Georgia',serif;font-style:italic;
  font-size:14px;letter-spacing:4px;
  color:rgba(200,170,255,.85);
  text-shadow:0 0 10px ${VP},0 0 28px rgba(100,60,220,.5);
  white-space:nowrap;
  animation:vaTypeReveal 7.5s ease forwards;
}
@keyframes vaTypeReveal {
  0%{opacity:0} 5%{opacity:1} 83%{opacity:1} 100%{opacity:0}
}
.va-cursor {
  display:inline-block;width:2px;height:1em;
  background:${VL};margin-left:3px;vertical-align:middle;
  animation:vaCursorBlink .7s step-end infinite;
}
@keyframes vaCursorBlink { 0%,100%{opacity:1} 50%{opacity:0} }

/* Aura rings */
.va-aura {
  position:fixed;left:50%;top:50%;border-radius:50%;
  transform:translate(-50%,-50%);
  pointer-events:none;z-index:9991;
  animation:vaAuraExpand ease-out forwards;
}
@keyframes vaAuraExpand {
  0%  {opacity:1;transform:translate(-50%,-50%) scale(0)}
  65% {opacity:.65}
  100%{opacity:0;transform:translate(-50%,-50%) scale(1)}
}

/* ── Body shakes ── */
@keyframes vaBodyShake {
  0%,100%{transform:translate(0,0)}
  12%{transform:translate(-6px,5px)} 30%{transform:translate(7px,-6px)}
  48%{transform:translate(-5px,7px)} 66%{transform:translate(5px,-5px)}
  84%{transform:translate(-3px,3px)}
}
body.va-shake { animation:vaBodyShake .58s ease-out; }

@keyframes vaBodyHeavy {
  0%,100%{transform:translate(0,0)}
  8% {transform:translate(-16px,13px)} 20%{transform:translate(16px,-14px)}
  32%{transform:translate(-14px,16px)} 44%{transform:translate(13px,-13px)}
  56%{transform:translate(-11px,13px)} 68%{transform:translate(10px,-11px)}
  80%{transform:translate(-7px,8px)}   92%{transform:translate(6px,-6px)}
}
body.va-heavy { animation:vaBodyHeavy .9s ease-out; }

@keyframes vaBodyDetonation {
  0%,100%{transform:translate(0,0)}
  5% {transform:translate(-24px,20px)} 13%{transform:translate(24px,-22px)}
  21%{transform:translate(-22px,24px)} 29%{transform:translate(20px,-20px)}
  37%{transform:translate(-18px,20px)} 45%{transform:translate(16px,-17px)}
  53%{transform:translate(-13px,14px)} 61%{transform:translate(11px,-12px)}
  69%{transform:translate(-9px,10px)}  77%{transform:translate(7px,-8px)}
  85%{transform:translate(-5px,6px)}   93%{transform:translate(3px,-3px)}
}
body.va-detonation { animation:vaBodyDetonation 1.2s ease-out; }
`;

function injectCSS() {
  if (document.getElementById('va-styles')) return;
  const s = document.createElement('style');
  s.id = 'va-styles';
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
function rnd(a, b)    { return a + Math.random() * (b - a); }
function rndInt(a, b) { return Math.floor(rnd(a, b + 1)); }

// ══════════════════════════════════════════════════════════════
export class VoidAwakens {
  constructor(engine, rarity) {
    this.engine   = engine;
    this.rarity   = rarity;
    this.stopped  = false;
    this._timers  = [];
    this._actx    = null;
    this._singEl  = null;
    this._eyeEl   = null;
    this.fx = {
      shakeIntensity: 72,
      particleCount:  270,
      rayCount:       52,
      glowMaxAlpha:   0.96,
      auraCount:      8,
      trailEnabled:   true,
      tendrilCount:   24,
      shardCount:     90,
      starCount:      120,
      symbolCount:    10,
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

      // ── Phase 0: Blackout ───────────────────────────────────
      const voidEl = spawn(mk('va-void'));
      this._after(14500, () => voidEl.classList.add('va-void--fade'));
      this._after(16800, () => voidEl.remove());

      // ── Phase 1: Singularity ────────────────────────────────
      this._after(300, () => {
        const sing = spawn(mk('va-singularity'));
        this._singEl = sing;
        this._sfxSingularity();
        this._after(5600, () => { sing.remove(); this._singEl = null; });
      });

      // ── Phase 2: Void tendrils ──────────────────────────────
      this._after(700, () => {
        this._spawnTendrils(this.fx.tendrilCount);
        this._sfxDrone();
      });

      // ── Phase 3: Reality cracks ─────────────────────────────
      this._after(1100, () => {
        this._spawnCracks();
        this._sfxCrack();
        document.body.classList.add('va-shake');
        this._after(600, () => document.body.classList.remove('va-shake'));
      });

      // ── Phase 4: Gravitational collapse ─────────────────────
      this._after(1650, () => {
        // Singularity disappears as gravity swallows it
        if (this._singEl) {
          this._singEl.style.transition = 'transform .35s ease-in, opacity .3s ease-in';
          this._singEl.style.opacity = '0';
        }

        const grav = spawn(mk('va-gravity'));
        this._after(620, () => grav.remove());

        document.body.classList.add('va-heavy');
        this._after(940, () => document.body.classList.remove('va-heavy'));
        this.engine.shake(this.fx.shakeIntensity * 0.6);
        this._sfxCollapse();
      });

      // ── Phase 5: DETONATION ─────────────────────────────────
      this._after(2300, () => {
        // White flash
        const det = spawn(mk('va-detonation'));
        this._after(650, () => det.remove());

        // Chromatic fringe
        const chroma = spawn(mk('va-chroma'));
        this._after(750, () => chroma.remove());

        // Eye of the Void
        const eye = spawn(mk('va-eye'));
        this._eyeEl = eye;
        this._after(5800, () => { eye.remove(); this._eyeEl = null; });

        // 9 awakening rings — staggered, cycling colors
        const ringCols = [VA, VW, VL, VP, VB, VT, VW, VL, VA];
        ringCols.forEach((col, i) => {
          this._after(i * 65, () => {
            const ring = spawn(mk('va-ring'));
            ring.style.cssText += `
              border:3px solid ${col};
              box-shadow:0 0 12px ${col};
              animation-duration:${.9 + i * .14}s;
            `;
            this._after(1400, () => ring.remove());
          });
        });

        document.body.classList.add('va-detonation');
        this._after(1250, () => document.body.classList.remove('va-detonation'));
        this.engine.shake(this.fx.shakeIntensity);
        this._sfxDetonation();
      });

      // ── Phase 6: Void shards ────────────────────────────────
      this._after(3000, () => this._spawnShards(this.fx.shardCount));

      // ── Phase 7: Nebula + newborn stars ─────────────────────
      this._after(3800, () => {
        this._spawnNebula();
        this._spawnStars(this.fx.starCount);
        this._sfxAwakening();
      });

      // ── Phase 8: Void consciousness symbols ─────────────────
      this._after(5200, () => this._spawnSymbols(this.fx.symbolCount));

      // ── Phase 9: Canvas effects ─────────────────────────────
      this._after(6400, () => {
        // Multi-layer ray bursts: violet primary, white accent, teal cool
        [[VP, 0.17, 0.7], [VW, 0.11, -1.0], [VB, 0.09, 1.5], [VT, 0.07, -0.6], [VA, 0.04, 2.1]].forEach(([col, alpha, rot], i) => {
          this._after(i * 120, () => {
            this.engine.addEffect(new RayBurst({
              color:    col,
              duration: 11000,
              maxAlpha: alpha,
              rayCount: Math.floor(this.fx.rayCount * (1 - i * 0.15)),
              rotSpeed: rot,
            }));
          });
        });

        // Deep violet glow overlay
        this.engine.addEffect(new GlowOverlay({
          color:      VP_GLOW,
          duration:   10000,
          maxAlpha:   this.fx.glowMaxAlpha,
          fadeIn:     0.04,
          fadeOut:    0.18,
          radial:     true,
          pulseSpeed: 1.9,
        }));

        // Particle storm — all void palette colors
        VOID_PALETTE.forEach((col, i) => {
          this._after(i * 130, () => {
            this.engine.addEffect(new ParticleBurst(0.5, 0.5, {
              count:    Math.floor(this.fx.particleCount * (.5 + i * .07)),
              color:    col,
              minSpeed: 105 + i * 60,
              maxSpeed: 390 + i * 55,
              minSize:  2,
              maxSize:  9,
              gravity:  32,
              trail:    this.fx.trailEnabled,
              glow:     true,
              duration: 7000,
              type:     i % 3 === 0 ? 'star' : 'spark',
            }));
          });
        });

        // Void essence rising from center
        this.engine.addEffect(new ContinuousParticles({
          ox:        0.5,
          oy:        0.5,
          color:     VL,
          minSpeed:  55,
          maxSpeed:  225,
          gravity:   -60,
          upBias:    130,
          spread:    Math.PI * 2,
          minSize:   1.5,
          maxSize:   6,
          trail:     true,
          glow:      true,
          spawnRate: 0.03,
          duration:  9500,
          type:      'star',
        }));

        // Void tendrils of teal from edges
        this.engine.addEffect(new ContinuousParticles({
          ox:        w => Math.random() < 0.5 ? 0 : w,
          oy:        h => Math.random() * h,
          color:     VT,
          minSpeed:  35,
          maxSpeed:  110,
          gravity:   -10,
          spread:    Math.PI * 0.4,
          angle:     Math.PI,
          minSize:   1.5,
          maxSize:   4,
          trail:     true,
          glow:      true,
          spawnRate: 0.016,
          duration:  9000,
        }));

        // White starfall from above
        this.engine.addEffect(new ContinuousParticles({
          ox:        w => Math.random() * w,
          oy:        0,
          color:     VA,
          minSpeed:  45,
          maxSpeed:  140,
          gravity:   85,
          spread:    0.4,
          angle:     Math.PI / 2,
          minSize:   1,
          maxSize:   3,
          trail:     false,
          glow:      true,
          spawnRate: 0.024,
          duration:  8500,
        }));
      });

      // ── Phase 10: VOID AWAKENS label + aura rings ───────────
      this._after(7600, () => {
        const label = spawn(mk('va-label'));
        const main  = document.createElement('div');
        main.className   = 'va-label-main';
        main.textContent = 'VOID AWAKENS';
        const sub   = document.createElement('div');
        sub.className    = 'va-label-sub';
        sub.textContent  = '◉  1 / 125,000  ·  THE SINGULARITY  ◉';
        label.appendChild(main);
        label.appendChild(sub);
        this._after(8000, () => label.remove());

        // Staggered aura rings — cycling void palette
        const auraCols = [VP, VT, VL, VB, VA, VP, VT, VW];
        for (let i = 0; i < this.fx.auraCount; i++) {
          this._after(i * 195, () => {
            const aura = spawn(mk('va-aura'));
            const sz   = 95 + i * 68;
            const col  = auraCols[i % auraCols.length];
            const col2 = auraCols[(i + 3) % auraCols.length];
            aura.style.cssText = `
              width:${sz}px;height:${sz}px;
              background:radial-gradient(circle,${col}44 0%,${col}18 55%,transparent 80%);
              box-shadow:0 0 ${28+i*13}px ${col},0 0 ${60+i*24}px ${col2}55;
              animation-duration:${2+i*.32}s;
            `;
            this._after(3400, () => aura.remove());
          });
        }
      });

      // ── Phase 11: Typewriter ─────────────────────────────────
      this._after(9200, () => this._spawnTypewriter());

      // ── Phase 13: Resolve ────────────────────────────────────
      this._after(20000, () => {
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
    document.body.classList.remove('va-shake', 'va-heavy', 'va-detonation');
    if (this._actx) { try { this._actx.close(); } catch(e){} }
    killSpawned();
  }

  // ── 24 void tendrils crawl outward from center ─────────────
  _spawnTendrils(count) {
    for (let i = 0; i < count; i++) {
      const t   = spawn(mk('va-tendril'));
      const ang = (360 / count) * i + rnd(-5, 5);
      const len = rnd(14, 34);   // vh
      const dur = rnd(0.55, 0.95);
      const wv  = rnd(0.4, 1.6);
      const wid = rnd(1.2, 2.8);
      const col = i % 4 === 0 ? VT : VP;
      t.style.cssText = `
        left:50%;top:50%;
        --ta:${ang}deg;--tl:${len}vh;--tw:${wv};
        height:${len}vh;width:${wid}px;
        animation-duration:${dur}s;
        animation-delay:${Math.random()*0.15}s;
        background:linear-gradient(to top,
          ${col}ee 0%,rgba(160,100,255,.55) 55%,transparent 100%);
        filter:blur(.5px);
        transform-origin:bottom center;
      `;
      this._after((dur + 0.6) * 1000, () => t.remove());
    }
  }

  // ── SVG fractal crack lattice ────────────────────────────────
  _spawnCracks() {
    const layer = spawn(mk('va-crack-layer'));
    const svg   = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;overflow:visible';

    const origin = { x: 50, y: 50 };
    const crackCount = 10;

    const addPath = (pts, delayS) => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M ' + pts.map(p => `${p.x} ${p.y}`).join(' L '));
      path.style.setProperty('--cd', delayS + 's');
      svg.appendChild(path);
    };

    const addNode = (vx, vy, delayS) => {
      const node = spawn(mk('va-crack-node'));
      node.style.left = vx + 'vw';
      node.style.top  = vy + 'vh';
      node.style.setProperty('--cn', delayS + 's');
      this._after(700, () => node.remove());
    };

    for (let c = 0; c < crackCount; c++) {
      const baseAngle = (360 / crackCount) * c + rnd(-18, 18);
      const baseRad   = baseAngle * Math.PI / 180;
      const steps     = rndInt(5, 9);
      let pts         = [{ ...origin }];
      let cx = origin.x, cy = origin.y;

      for (let s = 0; s < steps; s++) {
        const jitter = rnd(-22, 22) * Math.PI / 180;
        const dist   = rnd(3.5, 8);
        cx += Math.cos(baseRad + jitter) * dist;
        cy += Math.sin(baseRad + jitter) * dist;
        pts.push({ x: cx, y: cy });

        // Branching at mid-crack
        if (s === 2 && Math.random() > 0.35) {
          const branchRad = baseRad + (Math.random() > 0.5 ? 1 : -1) * (Math.PI / 4.5);
          let bx = cx, by = cy;
          const bPts = [{ x: bx, y: by }];
          for (let b = 0; b < rndInt(2, 3); b++) {
            bx += Math.cos(branchRad) * rnd(3, 6);
            by += Math.sin(branchRad) * rnd(3, 6);
            bPts.push({ x: bx, y: by });
          }
          addPath(bPts, rnd(0.04, 0.18));
          addNode(bx, by, rnd(0.05, 0.2));
        }
      }

      addPath(pts, rnd(0, 0.12));
      addNode(cx, cy, rnd(0, 0.12));
    }

    layer.appendChild(svg);
    this._after(1100, () => layer.remove());
  }

  // ── 90 void shards erupt ─────────────────────────────────────
  _spawnShards(count) {
    for (let i = 0; i < count; i++) {
      const sh  = spawn(mk('va-shard'));
      const sz  = rnd(2, 8);
      const ang = Math.random() * 360;
      const rad = rnd(18, 52);
      const dur = rnd(0.55, 1.4);
      const col = VOID_PALETTE[i % VOID_PALETTE.length];
      sh.style.cssText = `
        left:50vw;top:50vh;
        width:${sz}px;height:${sz}px;
        background:${col};
        box-shadow:0 0 ${sz*2}px ${sz}px ${col}cc;
        --sa:${ang}deg;--sr:${rad}vmin;
        animation-duration:${dur}s;
        animation-delay:${Math.random()*0.18}s;
      `;
      this._after((dur + 0.35) * 1000, () => sh.remove());
    }
  }

  // ── Nebula flood ─────────────────────────────────────────────
  _spawnNebula() {
    const neb = spawn(mk('va-nebula'));
    neb.style.background = `
      radial-gradient(ellipse at 38% 44%,${VT}55 0%,rgba(40,100,255,.2) 38%,transparent 68%),
      radial-gradient(ellipse at 72% 36%,${VP}44 0%,rgba(80,20,180,.18) 52%,transparent 80%),
      radial-gradient(ellipse at 50% 72%,${VL}33 0%,rgba(160,100,255,.12) 55%,transparent 85%),
      radial-gradient(ellipse at 20% 68%,${VB}33 0%,transparent 58%)
    `;
    neb.style.animationDuration = '4.5s';
    this._after(5000, () => neb.remove());
  }

  // ── 120 newborn stars scatter ─────────────────────────────────
  _spawnStars(count) {
    for (let i = 0; i < count; i++) {
      this._after(Math.random() * 700, () => {
        const star = spawn(mk('va-star'));
        const sz   = rnd(1, 5);
        const dur  = rnd(0.6, 1.2);
        const col  = Math.random() > 0.55 ? VL : VA;
        star.style.cssText = `
          left:${Math.random()*100}vw;
          top:${Math.random()*100}vh;
          width:${sz}px;height:${sz}px;
          background:${col};
          box-shadow:0 0 ${sz*3}px ${sz}px ${col}dd;
          --ss:${1 + Math.random()};
          animation-duration:${dur}s;
        `;
        this._after((dur + 0.5) * 1000, () => star.remove());
      });
    }
  }

  // ── 10 void-consciousness symbols orbit center ───────────────
  _spawnSymbols(count) {
    for (let i = 0; i < count; i++) {
      const sym = spawn(mk('va-symbol'));
      sym.textContent = VOID_SYMBOLS[i % VOID_SYMBOLS.length];
      const orbitR  = rnd(120, 200);   // px
      const startAng = (360 / count) * i;
      const endAng   = startAng + (Math.random() > 0.5 ? 360 : -360);
      const orbitDur = rnd(5, 9);
      const fadeDur  = rnd(3.5, 5.5);
      const fontSize = rnd(18, 32);
      sym.style.cssText += `
        font-size:${fontSize}px;
        --so0:${startAng}deg;--so1:${endAng}deg;--sr2:${orbitR}px;
        animation-duration:${orbitDur}s, ${fadeDur}s;
      `;
      this._after(fadeDur * 1000, () => sym.remove());
    }
  }

  // ── "ALL THAT EXISTS WAS ONCE NOTHING." typewriter ───────────
  _spawnTypewriter() {
    const el   = spawn(mk('va-typewriter'));
    const TEXT = 'ALL THAT EXISTS WAS ONCE NOTHING.';
    const cur  = document.createElement('span');
    cur.className = 'va-cursor';
    el.appendChild(cur);

    let idx = 0;
    const type = () => {
      if (this.stopped || !el.isConnected) return;
      if (idx < TEXT.length) {
        el.insertBefore(document.createTextNode(TEXT[idx]), cur);
        idx++;
        if (idx % 4 === 0) this._sfxType();
        const delay = 72 + (TEXT[idx - 1] === '.' ? 360 : TEXT[idx - 1] === ' ' ? 90 : 0)
                        + (Math.random() > .9 ? 140 : 0);
        this._timers.push(setTimeout(type, delay));
      } else {
        this._sfxStarBurst();
        this._after(2600, () => cur.remove());
      }
    };
    this._timers.push(setTimeout(type, 380));
    this._after(7500, () => el.remove());
  }

  // ═══════════════════════════════════════════════════════════
  //  W E B   A U D I O   —   V O I D   S O U N D S
  //  6 distinct sfx, all oscillator-generated, no files
  // ═══════════════════════════════════════════════════════════

  _audio() {
    if (!this._actx) {
      try { this._actx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch(e) { return null; }
    }
    if (this._actx.state === 'suspended') this._actx.resume();
    return this._actx;
  }

  _tone(ctx, startOffset, freq, dur, vol = 0.16, type = 'sine') {
    try {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = type; osc.frequency.value = freq;
      const t = ctx.currentTime + startOffset;
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.start(t); osc.stop(t + dur + 0.01);
    } catch(e) {}
  }

  _glide(ctx, startOffset, f0, f1, dur, vol = 0.14, type = 'sine') {
    try {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = type;
      const t = ctx.currentTime + startOffset;
      osc.frequency.setValueAtTime(f0, t);
      osc.frequency.exponentialRampToValueAtTime(f1, t + dur);
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.04);
      osc.start(t); osc.stop(t + dur + 0.06);
    } catch(e) {}
  }

  _noise(ctx, startOffset, dur, vol = 0.25, cutoff = 350) {
    try {
      const bufSize = Math.ceil(ctx.sampleRate * dur);
      const buffer  = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data    = buffer.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
      const src    = ctx.createBufferSource(); src.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type  = 'lowpass'; filter.frequency.value = cutoff;
      const gain   = ctx.createGain();
      src.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
      const t = ctx.currentTime + startOffset;
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.start(t); src.stop(t + dur + 0.01);
    } catch(e) {}
  }

  // 1. Singularity birth — high shimmer, trembling overtones
  _sfxSingularity() {
    const ctx = this._audio(); if (!ctx) return;
    // High-frequency shimmer building up
    this._glide(ctx, 0,   1800, 2400, 0.8,  0.08, 'sine');
    this._glide(ctx, 0,   900,  1200, 0.8,  0.05, 'sine');
    this._tone(ctx,  ctx.currentTime, 4186, 1.2,  0.04, 'sine'); // C8 shimmer
    // Very soft sub-bass pulse
    this._tone(ctx,  ctx.currentTime + 0.3, 40, 0.5, 0.1, 'sine');
  }

  // 2. Tendrils drone — descending menacing low swell
  _sfxDrone() {
    const ctx = this._audio(); if (!ctx) return;
    this._glide(ctx, 0,   100, 28,  2.0,  0.18, 'sawtooth');
    this._glide(ctx, 0,   200, 55,  1.8,  0.09, 'sine');
    this._glide(ctx, 0.4, 350, 45,  1.4,  0.05, 'triangle');
  }

  // 3. Reality crack — sharp noise burst + metallic zing
  _sfxCrack() {
    const ctx = this._audio(); if (!ctx) return;
    this._noise(ctx, 0,    0.18, 0.28, 700);
    this._noise(ctx, 0,    0.08, 0.18, 4000);
    this._glide(ctx, 0,   3200, 200,  0.3, 0.12, 'sawtooth');
  }

  // 4. Gravitational collapse — deep descending implosion
  _sfxCollapse() {
    const ctx = this._audio(); if (!ctx) return;
    this._noise(ctx, 0,    0.25, 0.35, 500);
    this._glide(ctx, 0,    500,  35,   0.55, 0.22, 'sawtooth');
    this._tone(ctx,  ctx.currentTime, 65, 0.7, 0.18, 'sine');
    this._tone(ctx,  ctx.currentTime, 33, 0.6, 0.12, 'sine');
  }

  // 5. Detonation — the biggest sound in the game
  _sfxDetonation() {
    const ctx = this._audio(); if (!ctx) return;
    this._noise(ctx, 0,    0.7,  0.55, 180);   // low boom body
    this._noise(ctx, 0,    0.28, 0.4,  2200);  // high transient crack
    this._noise(ctx, 0.35, 0.5,  0.22, 9000);  // hiss tail
    this._tone(ctx,  ctx.currentTime,      45,   1.0, 0.32, 'sine');   // sub thud
    this._tone(ctx,  ctx.currentTime,      90,   0.8, 0.18, 'sine');   // octave
    this._glide(ctx, 0.08, 1200, 80,   0.85, 0.16, 'sawtooth');       // sweep down
    // Short mid-range crack zing
    this._glide(ctx, 0,    4000, 220,  0.3,  0.1,  'square');
  }

  // 6. Universe awakening — ascending harmonic choir swell
  _sfxAwakening() {
    const ctx = this._audio(); if (!ctx) return;
    const t = ctx.currentTime;
    // C minor → E♭ → G → B♭ → C — ascending resolution
    const choir = [
      [131, 0.00, 1.4, 0.10],
      [155, 0.10, 1.3, 0.09],
      [196, 0.20, 1.2, 0.09],
      [233, 0.30, 1.1, 0.08],
      [262, 0.42, 1.0, 0.10],
      [311, 0.52, 0.9, 0.09],
      [392, 0.62, 0.8, 0.09],
      [466, 0.72, 0.7, 0.08],
      [523, 0.82, 0.8, 0.12],
    ];
    choir.forEach(([f, off, dur, vol]) => this._tone(ctx, t + off, f, dur, vol, 'sine'));
    // Shimmer overtones
    [1047, 1319, 1568].forEach((f, i) => {
      this._tone(ctx, t + 0.5 + i * 0.08, f, 0.8, 0.04, 'sine');
    });
  }

  // 7. Typewriter — soft void tone
  _sfxType() {
    const ctx = this._audio(); if (!ctx) return;
    const freqs = [392, 440, 494, 392, 330];
    this._tone(ctx, ctx.currentTime, freqs[Math.floor(Math.random() * freqs.length)], 0.06, 0.06, 'sine');
  }

  // 8. Completion star burst — shimmering ascent
  _sfxStarBurst() {
    const ctx = this._audio(); if (!ctx) return;
    const t = ctx.currentTime;
    [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => {
      this._tone(ctx, t + i * 0.05, f, 0.1, 0.10, 'sine');
    });
  }
}