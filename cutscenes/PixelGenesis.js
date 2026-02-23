// cutscenes/PixelGenesis.js
// ═══════════════════════════════════════════════════════════════
//  8 - B I T   G E N E S I S  —  1 / 100,000
//  Hybrid: DOM/CSS + canvas particle engine + Web Audio API
//
//  The rarest outcome is celebrated in the language of the
//  first generation of games. Chiptune sounds generated
//  entirely via Web Audio oscillators — no external files.
//
//  Phase 0  (0ms)    : Dark void — CRT power-on line expands
//  Phase 1  (400ms)  : 8px pixel grid materializes
//  Phase 2  (800ms)  : NES HUD bar — SCORE ticks up + coin sfx
//  Phase 3  (1600ms) : 6 pixel blocks float across screen
//  Phase 4  (2600ms) : LEVEL / UP text slides in, meets, blasts
//  Phase 5  (3400ms) : 5 pixel fireworks (16 DOM squares each)
//  Phase 6  (4400ms) : 20 coins cascade from top
//  Phase 7  (5600ms) : ? block bounces, coin pops out
//  Phase 8  (6600ms) : NES color flash cycle ×3
//  Phase 9  (7400ms) : Canvas — NES ray bursts + pixel storm
//  Phase 10 (8400ms) : 8-BIT GENESIS label + victory fanfare
//  Phase 11 (10000ms): "A NEW HIGH SCORE" typewriter
//  Phase 12 (14500ms): Void fades
//  Phase 13 (20000ms): Resolve
// ═══════════════════════════════════════════════════════════════

import { ParticleBurst, ContinuousParticles } from '../effects/ParticleBurst.js';
import { GlowOverlay, RayBurst }               from '../effects/GlowOverlay.js';

// ── NES-inspired palette (original, no Nintendo IP) ──────────
const NR  = '#e40058';   // NES red
const NB  = '#3c78f0';   // NES blue
const NG  = '#00b800';   // NES green
const NY  = '#fcbc3c';   // NES coin gold
const NW  = '#f8f8f8';   // NES near-white
const NK  = '#080808';   // near-black
const NS  = '#6888fc';   // NES sky blue

const NES_PALETTE = [NR, NB, NG, NY, NW, NS, '#fc3000', '#00c8d8'];

// ── CSS ───────────────────────────────────────────────────────
const CSS = `
/* ── Phase 0: Void ── */
.pg-void {
  position:fixed;inset:0;background:${NK};
  z-index:9990;pointer-events:none;
  opacity:1;transition:opacity 2s ease;
}
.pg-void--fade { opacity:0; }

/* CRT power-on: horizontal line expands to fill */
.pg-crt-on {
  position:fixed;left:0;top:50%;width:100%;
  transform:translateY(-50%);
  background:#fff;
  pointer-events:none;z-index:9991;
  animation:pgCrtOn .55s cubic-bezier(.2,1,.3,1) forwards;
}
@keyframes pgCrtOn {
  0%  {height:2px;opacity:1;filter:brightness(4)}
  55% {height:100vh;opacity:.9;filter:brightness(1.3)}
  100%{height:100vh;opacity:0;filter:brightness(1)}
}

/* CRT scanlines */
.pg-scanlines {
  position:fixed;inset:0;pointer-events:none;z-index:10019;
  background:repeating-linear-gradient(0deg,
    rgba(0,0,0,.18),rgba(0,0,0,.18) 1px,
    transparent 1px,transparent 3px);
  animation:pgScanScroll 6s linear infinite;
}
@keyframes pgScanScroll { to{transform:translateY(3px)} }

/* Phase 1: Pixel grid overlay */
.pg-grid {
  position:fixed;inset:0;pointer-events:none;z-index:9992;
  background-image:
    linear-gradient(rgba(100,136,252,.07) 1px,transparent 1px),
    linear-gradient(90deg,rgba(100,136,252,.07) 1px,transparent 1px);
  background-size:8px 8px;
  animation:pgGridIn .7s ease forwards;
}
@keyframes pgGridIn { from{opacity:0} to{opacity:1} }

/* ── Phase 2: HUD bar ── */
.pg-hud {
  position:fixed;left:0;top:0;width:100%;height:44px;
  background:${NK};
  border-bottom:3px solid ${NY};
  box-shadow:0 2px 0 rgba(252,188,60,.3);
  pointer-events:none;z-index:10015;
  display:flex;align-items:center;justify-content:space-between;
  padding:0 24px;box-sizing:border-box;
  animation:pgHudIn .3s ease forwards;
  opacity:0;
}
@keyframes pgHudIn { to{opacity:1} }

.pg-hud-cell {
  display:flex;flex-direction:column;align-items:center;
  font-family:'Courier New',monospace;text-transform:uppercase;
  line-height:1;
}
.pg-hud-label {
  font-size:9px;letter-spacing:.18em;color:rgba(252,188,60,.7);
}
.pg-hud-value {
  font-size:14px;font-weight:700;letter-spacing:.12em;color:${NW};
  text-shadow:0 0 8px rgba(252,188,60,.4);
}

/* ── Phase 3: Pixel blocks ── */
.pg-block {
  position:fixed;width:56px;height:56px;
  border:3px solid ${NK};
  pointer-events:none;z-index:9995;
  display:flex;align-items:center;justify-content:center;
  font-family:'Courier New',monospace;font-size:22px;font-weight:900;
  image-rendering:pixelated;
  animation:pgBlockFloat ease-in-out infinite;
}
.pg-block--q {
  background:${NY};color:${NK};
  box-shadow:inset 3px 3px 0 rgba(255,255,255,.45),inset -3px -3px 0 rgba(0,0,0,.35),
             0 0 16px rgba(252,188,60,.6);
}
.pg-block--brick {
  background:#c84000;color:rgba(255,180,100,.5);
  background-image:
    linear-gradient(${NK} 0,${NK} 3px,transparent 3px,transparent 50%,${NK} 50%,${NK} 53px,transparent 53px),
    repeating-linear-gradient(90deg,transparent,transparent 25px,${NK} 25px,${NK} 28px);
  background-size:100% 50%,56px 100%;
  box-shadow:inset 2px 2px 0 rgba(255,160,80,.3),inset -2px -2px 0 rgba(0,0,0,.4);
}
@keyframes pgBlockFloat {
  0%,100%{transform:translateY(0)}
  50%    {transform:translateY(-10px)}
}

.pg-block--slide {
  animation:pgBlockSlide linear forwards;
}
@keyframes pgBlockSlide {
  from{transform:translateX(var(--bs0)) translateY(0)}
  to  {transform:translateX(var(--bs1)) translateY(0)}
}

/* Hit animation for ? block */
.pg-block--hit {
  animation:pgBlockHit .35s cubic-bezier(.2,2,.3,1) forwards !important;
}
@keyframes pgBlockHit {
  0%  {transform:translateY(0)}
  35% {transform:translateY(-28px)}
  65% {transform:translateY(-22px)}
  100%{transform:translateY(0)}
}

/* Coin pop from block */
.pg-coin-pop {
  position:fixed;width:24px;height:24px;border-radius:50%;
  background:radial-gradient(circle,${NW} 0%,${NY} 40%,#c88000 100%);
  border:2px solid ${NK};
  box-shadow:0 0 12px ${NY},0 0 30px rgba(252,188,60,.5);
  pointer-events:none;z-index:9996;
  animation:pgCoinPop .7s cubic-bezier(.2,2,.3,1) forwards;
}
@keyframes pgCoinPop {
  0%  {opacity:1;transform:translateY(0) scale(0)}
  20% {opacity:1;transform:translateY(0) scale(1.2)}
  80% {opacity:1;transform:translateY(-90px) scale(1)}
  100%{opacity:0;transform:translateY(-110px) scale(.6)}
}

/* ── Phase 4: LEVEL UP ── */
.pg-levelup {
  position:fixed;left:50%;transform:translateX(-50%);
  pointer-events:none;z-index:10010;
  font-family:'Courier New',monospace;font-weight:900;
  text-transform:uppercase;letter-spacing:.22em;
  white-space:nowrap;
  -webkit-font-smoothing:none;font-smooth:never;
}
.pg-levelup--top {
  top:50%;
  color:${NY};
  text-shadow:3px 3px 0 ${NK},0 0 20px ${NY},0 0 50px rgba(252,188,60,.5);
  font-size:40px;
  animation:pgLevelTop .5s cubic-bezier(.2,2,.3,1) forwards,
            pgLevelTopOut .3s 1.8s ease-in forwards;
}
@keyframes pgLevelTop {
  from{transform:translateX(-50%) translateY(-80vh);opacity:0}
  to  {transform:translateX(-50%) translateY(-50%);opacity:1}
}
@keyframes pgLevelTopOut {
  to{transform:translateX(-50%) translateY(-80vh);opacity:0}
}
.pg-levelup--bot {
  top:50%;
  color:${NW};
  text-shadow:3px 3px 0 ${NK},0 0 20px ${NW},0 0 50px rgba(252,188,60,.5);
  font-size:40px;
  animation:pgLevelBot .5s cubic-bezier(.2,2,.3,1) forwards,
            pgLevelBotOut .3s 1.8s ease-in forwards;
}
@keyframes pgLevelBot {
  from{transform:translateX(-50%) translateY(80vh);opacity:0}
  to  {transform:translateX(-50%) translateY(-8%);opacity:1}
}
@keyframes pgLevelBotOut {
  to{transform:translateX(-50%) translateY(80vh);opacity:0}
}

/* ── Phase 5: Pixel firework squares ── */
.pg-pixel {
  position:fixed;width:5px;height:5px;
  pointer-events:none;z-index:9993;
  image-rendering:pixelated;
  animation:pgPixelFly ease-out forwards;
}
@keyframes pgPixelFly {
  0%  {opacity:1;transform:translate(0,0) scale(1)}
  100%{opacity:0;transform:translate(var(--pfx),var(--pfy)) scale(.3)}
}

/* ── Phase 6: Coin cascade ── */
.pg-coin-drop {
  position:fixed;width:20px;height:20px;border-radius:50%;
  background:radial-gradient(circle,${NW} 0%,${NY} 45%,#b07000 100%);
  border:2px solid ${NK};
  box-shadow:0 0 8px ${NY};
  pointer-events:none;z-index:9993;
  top:-24px;
  animation:pgCoinDrop linear forwards;
}
@keyframes pgCoinDrop {
  0%  {opacity:1;transform:translateY(0)}
  85% {opacity:1}
  100%{opacity:0;transform:translateY(var(--cd))}
}

/* ── Phase 8: Color flash ── */
.pg-color-flash {
  position:fixed;inset:0;pointer-events:none;z-index:9998;
  animation:pgFlash .18s ease-out forwards;
}
@keyframes pgFlash {
  0%  {opacity:.65}
  100%{opacity:0}
}

/* ── Phase 10: 8-BIT GENESIS label ── */
.pg-label {
  position:fixed;left:50%;top:50%;
  transform:translate(-50%,-50%);
  pointer-events:none;z-index:10012;
  display:flex;flex-direction:column;align-items:center;gap:16px;
  animation:pgLabelReveal 8.5s ease forwards;
}
@keyframes pgLabelReveal {
  0%  {opacity:0;transform:translate(-50%,-50%) scale(.35);filter:blur(12px)}
  7%  {opacity:1;transform:translate(-50%,-50%) scale(1.04);filter:blur(0)}
  12% {transform:translate(-50%,-50%) scale(1)}
  83% {opacity:1}
  100%{opacity:0;transform:translate(-50%,-50%) scale(1.05)}
}

.pg-label-main {
  font-family:'Courier New',monospace;
  font-size:38px;font-weight:900;
  letter-spacing:10px;text-transform:uppercase;
  -webkit-font-smoothing:none;font-smooth:never;
  color:${NY};
  text-shadow:
    3px 3px 0 ${NK},
    0 0 16px ${NY},0 0 40px rgba(252,188,60,.7),
    0 0 90px rgba(252,188,60,.4);
  border:4px solid ${NY};
  padding:18px 40px;
  background:${NK};
  image-rendering:pixelated;
  box-shadow:
    0 0 0 2px ${NK},
    0 0 30px rgba(252,188,60,.6),
    inset 0 0 24px rgba(252,188,60,.08);
  animation:pgBorderCycle 1.1s linear infinite;
}
@keyframes pgBorderCycle {
  0%   {border-color:${NY};box-shadow:0 0 0 2px ${NK},0 0 30px rgba(252,188,60,.6),inset 0 0 24px rgba(252,188,60,.08)}
  20%  {border-color:${NR};box-shadow:0 0 0 2px ${NK},0 0 30px rgba(228,0,88,.6),inset 0 0 24px rgba(228,0,88,.08)}
  40%  {border-color:${NB};box-shadow:0 0 0 2px ${NK},0 0 30px rgba(60,120,240,.6),inset 0 0 24px rgba(60,120,240,.08)}
  60%  {border-color:${NG};box-shadow:0 0 0 2px ${NK},0 0 30px rgba(0,184,0,.6),inset 0 0 24px rgba(0,184,0,.08)}
  80%  {border-color:${NW};box-shadow:0 0 0 2px ${NK},0 0 30px rgba(248,248,248,.6),inset 0 0 24px rgba(248,248,248,.08)}
  100% {border-color:${NY};box-shadow:0 0 0 2px ${NK},0 0 30px rgba(252,188,60,.6),inset 0 0 24px rgba(252,188,60,.08)}
}

.pg-label-sub {
  font-family:'Courier New',monospace;
  font-size:10px;font-weight:700;letter-spacing:5px;text-transform:uppercase;
  color:rgba(252,188,60,.6);
  text-shadow:0 0 8px rgba(252,188,60,.4);
}

/* Phase 11: "A NEW HIGH SCORE" typewriter */
.pg-typewriter {
  position:fixed;left:50%;top:calc(50% + 84px);
  transform:translateX(-50%);
  pointer-events:none;z-index:10013;
  font-family:'Courier New',monospace;font-weight:700;font-size:16px;
  letter-spacing:6px;text-transform:uppercase;
  color:${NR};
  text-shadow:2px 2px 0 ${NK},0 0 12px ${NR},0 0 30px rgba(228,0,88,.4);
  white-space:nowrap;
  animation:pgTypeReveal 7.5s ease forwards;
}
@keyframes pgTypeReveal {
  0%  {opacity:0} 5%{opacity:1} 83%{opacity:1} 100%{opacity:0}
}
.pg-cursor {
  display:inline-block;width:10px;height:2px;
  background:${NR};margin-left:2px;vertical-align:middle;
  animation:pgCursorBlink .5s step-end infinite;
}
@keyframes pgCursorBlink { 0%,100%{opacity:1} 50%{opacity:0} }

/* ── Aura rings ── */
.pg-aura {
  position:fixed;left:50%;top:50%;border-radius:0;
  transform:translate(-50%,-50%);
  pointer-events:none;z-index:9991;
  animation:pgAuraExpand ease-out forwards;
}
@keyframes pgAuraExpand {
  0%  {opacity:1;transform:translate(-50%,-50%) scale(0)}
  65% {opacity:.7}
  100%{opacity:0;transform:translate(-50%,-50%) scale(1)}
}

/* ── Body shakes ── */
@keyframes pgBodyBounce {
  0%,100%{transform:translate(0,0)}
  15%{transform:translate(-4px,-6px)} 30%{transform:translate(4px,5px)}
  45%{transform:translate(-3px,-4px)} 60%{transform:translate(3px,4px)}
  75%{transform:translate(-2px,-2px)} 90%{transform:translate(2px,2px)}
}
body.pg-bounce { animation:pgBodyBounce .5s ease-out; }

@keyframes pgBodyHeavy {
  0%,100%{transform:translate(0,0)}
  8% {transform:translate(-12px,-14px)} 20%{transform:translate(12px,13px)}
  32%{transform:translate(-11px,12px)} 44%{transform:translate(10px,-11px)}
  56%{transform:translate(-9px,10px)}  68%{transform:translate(8px,-9px)}
  80%{transform:translate(-6px,7px)}   92%{transform:translate(5px,-5px)}
}
body.pg-heavy { animation:pgBodyHeavy .75s ease-out; }
`;

function injectCSS() {
  if (document.getElementById('pg-styles')) return;
  const s = document.createElement('style');
  s.id = 'pg-styles';
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

// ══════════════════════════════════════════════════════════════
export class PixelGenesis {
  constructor(engine, rarity) {
    this.engine   = engine;
    this.rarity   = rarity;
    this.stopped  = false;
    this._timers  = [];
    this._actx    = null;   // Web Audio context (lazy init)
    this._hudScore = 0;
    this._hudEl    = null;
    this._scoreEl  = null;
    this.fx = {
      shakeIntensity: 55,
      particleCount:  220,
      rayCount:       40,
      glowMaxAlpha:   0.85,
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

      // ── Phase 0: Void + CRT power-on ───────────────────────
      const voidEl = spawn(mk('pg-void'));
      spawn(mk('pg-scanlines'));
      const crtOn = spawn(mk('pg-crt-on'));
      this._after(600, () => crtOn.remove());
      this._after(14500, () => voidEl.classList.add('pg-void--fade'));
      this._after(16500, () => voidEl.remove());

      // ── Phase 1: Pixel grid ─────────────────────────────────
      this._after(400, () => spawn(mk('pg-grid')));

      // ── Phase 2: HUD + score counter ───────────────────────
      this._after(800, () => {
        this._spawnHUD();
        this._sfxCoin();
      });

      // ── Phase 3: Pixel blocks ───────────────────────────────
      this._after(1600, () => {
        this._spawnBlocks();
        this._sfxPowerUp();
      });

      // ── Phase 4: LEVEL UP ───────────────────────────────────
      this._after(2600, () => {
        this._spawnLevelUp();
        this._sfxLevelUp();
        document.body.classList.add('pg-bounce');
        this._after(520, () => document.body.classList.remove('pg-bounce'));
        this.engine.shake(this.fx.shakeIntensity * 0.3);
      });

      // ── Phase 5: Pixel fireworks ────────────────────────────
      this._after(3400, () => {
        this._spawnFireworks(5);
        this._sfxStar();
        document.body.classList.add('pg-bounce');
        this._after(520, () => document.body.classList.remove('pg-bounce'));
      });

      // ── Phase 6: Coin cascade ───────────────────────────────
      this._after(4400, () => this._spawnCoinCascade(20));

      // ── Phase 7: ? block hit ────────────────────────────────
      this._after(5600, () => this._spawnQBlockHit());

      // ── Phase 8: NES color flash cycle ─────────────────────
      this._after(6600, () => this._spawnColorCycle());

      // ── Phase 9: Canvas effects ─────────────────────────────
      this._after(7400, () => {
        // NES-colored ray bursts
        [[NY, 0.14, 0.7], [NR, 0.09, -1.1], [NB, 0.07, 1.5], [NG, 0.05, -0.8]].forEach(([col, alpha, rot], i) => {
          this._after(i * 100, () => {
            this.engine.addEffect(new RayBurst({
              color:    col,
              duration: 10000,
              maxAlpha: alpha,
              rayCount: Math.floor(this.fx.rayCount * (1 - i * 0.18)),
              rotSpeed: rot,
            }));
          });
        });

        // Warm golden glow
        this.engine.addEffect(new GlowOverlay({
          color:      `rgba(252,188,60,0.7)`,
          duration:   10000,
          maxAlpha:   this.fx.glowMaxAlpha,
          fadeIn:     0.05,
          fadeOut:    0.2,
          pulseSpeed: 2.2,
        }));

        // NES-palette particle bursts — square-ish with no trail for pixel feel
        NES_PALETTE.forEach((col, i) => {
          this._after(i * 130, () => {
            this.engine.addEffect(new ParticleBurst(0.5, 0.5, {
              count:    Math.floor(this.fx.particleCount * (.5 + i * .06)),
              color:    col,
              minSpeed: 100 + i * 55,
              maxSpeed: 380 + i * 50,
              minSize:  3,
              maxSize:  8,
              gravity:  50,
              trail:    false,    // no trail — more pixel-accurate
              glow:     false,    // no glow — crisp pixels
              duration: 5500,
              type:     'circle',
            }));
          });
        });

        // Continuous golden coin sparkle from center
        this.engine.addEffect(new ContinuousParticles({
          ox:        0.5,
          oy:        0.5,
          color:     NY,
          minSpeed:  60,
          maxSpeed:  220,
          gravity:   -55,
          upBias:    110,
          spread:    Math.PI * 2,
          minSize:   2,
          maxSize:   5,
          trail:     false,
          glow:      false,
          spawnRate: 0.03,
          duration:  9000,
          type:      'circle',
        }));

        // Pixel "rain" from top — multi-color NES pixels
        NES_PALETTE.slice(0, 4).forEach((col, i) => {
          this._after(i * 150, () => {
            this.engine.addEffect(new ContinuousParticles({
              ox:        w => Math.random() * w,
              oy:        0,
              color:     col,
              minSpeed:  50,
              maxSpeed:  160,
              gravity:   120,
              spread:    0.3,
              angle:     Math.PI / 2,
              minSize:   3,
              maxSize:   5,
              trail:     false,
              glow:      false,
              spawnRate: 0.015,
              duration:  8000,
            }));
          });
        });

        document.body.classList.add('pg-heavy');
        this._after(800, () => document.body.classList.remove('pg-heavy'));
        this.engine.shake(this.fx.shakeIntensity);
      });

      // ── Phase 10: 8-BIT GENESIS label + fanfare ─────────────
      this._after(8400, () => {
        this._spawnLabel();
        this._sfxFanfare();

        // Aura rings — square, NES colors
        const auraColors = [NY, NR, NB, NG, NW, NY, NR];
        for (let i = 0; i < this.fx.auraCount; i++) {
          this._after(i * 180, () => {
            const aura = spawn(mk('pg-aura'));
            const sz   = 80 + i * 65;
            const col  = auraColors[i % auraColors.length];
            aura.style.cssText = `
              width:${sz}px;height:${sz}px;
              border:3px solid ${col};
              background:${col}18;
              box-shadow:0 0 ${20+i*10}px ${col},inset 0 0 ${10+i*5}px ${col}44;
              animation-duration:${1.6+i*.25}s;
            `;
            this._after(3200, () => aura.remove());
          });
        }
      });

      // ── Phase 11: Typewriter ─────────────────────────────────
      this._after(10000, () => this._spawnTypewriter());

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
    document.body.classList.remove('pg-bounce', 'pg-heavy');
    if (this._actx) { try { this._actx.close(); } catch(e){} }
    killSpawned();
  }

  // ── HUD bar with live score counter ────────────────────────
  _spawnHUD() {
    const hud = spawn(mk('pg-hud'));
    this._hudEl = hud;

    const scoreCell  = document.createElement('div');
    scoreCell.className = 'pg-hud-cell';
    const scoreLbl   = document.createElement('div');
    scoreLbl.className = 'pg-hud-label';
    scoreLbl.textContent = 'SCORE';
    const scoreVal   = document.createElement('div');
    scoreVal.className = 'pg-hud-value';
    scoreVal.textContent = '0000000';
    this._scoreEl = scoreVal;
    scoreCell.appendChild(scoreLbl);
    scoreCell.appendChild(scoreVal);

    const coinsCell  = document.createElement('div');
    coinsCell.className = 'pg-hud-cell';
    const coinsLbl   = document.createElement('div');
    coinsLbl.className = 'pg-hud-label';
    coinsLbl.textContent = 'COINS';
    const coinsVal   = document.createElement('div');
    coinsVal.className = 'pg-hud-value';
    coinsVal.textContent = '×00';
    coinsCell.appendChild(coinsLbl);
    coinsCell.appendChild(coinsVal);

    const worldCell  = document.createElement('div');
    worldCell.className = 'pg-hud-cell';
    const worldLbl   = document.createElement('div');
    worldLbl.className = 'pg-hud-label';
    worldLbl.textContent = 'WORLD';
    const worldVal   = document.createElement('div');
    worldVal.className = 'pg-hud-value';
    worldVal.textContent = '∞-∞';
    worldCell.appendChild(worldLbl);
    worldCell.appendChild(worldVal);

    hud.appendChild(scoreCell);
    hud.appendChild(coinsCell);
    hud.appendChild(worldCell);

    // Score counts up to 9,999,990
    let score = 0;
    let coins = 0;
    const target = 9999990;
    const tick = () => {
      if (this.stopped || score >= target) return;
      score = Math.min(score + 133370, target);
      coins = Math.min(coins + 1, 99);
      scoreVal.textContent = String(score).padStart(7, '0');
      coinsVal.textContent = '×' + String(coins).padStart(2, '0');
      this._timers.push(setTimeout(tick, 55));
    };
    this._timers.push(setTimeout(tick, 300));

    this._after(12000, () => hud.remove());
  }

  // ── 6 pixel blocks floating across screen ──────────────────
  _spawnBlocks() {
    const rows = [0.22, 0.38, 0.55, 0.38, 0.22, 0.55];
    const types = ['q','brick','q','brick','q','brick'];

    rows.forEach((yFrac, i) => {
      this._after(i * 120, () => {
        const b = spawn(mk(`pg-block pg-block--${types[i]} pg-block--slide`));
        b.textContent = types[i] === 'q' ? '?' : '';

        // Alternate: some slide left→right, some right→left
        const ltr   = i % 2 === 0;
        const start = ltr ? '-80px' : '110vw';
        const end   = ltr ? '110vw' : '-80px';
        const dur   = 3.5 + Math.random() * 1.5;

        b.style.top  = (yFrac * 100) + 'vh';
        b.style.left = '0px';
        b.style.setProperty('--bs0', start);
        b.style.setProperty('--bs1', end);
        b.style.animationDuration  = dur + 's';
        b.style.animationDelay     = '0ms';

        this._after((dur + .3) * 1000, () => b.remove());
      });
    });
  }

  // ── LEVEL UP text split ─────────────────────────────────────
  _spawnLevelUp() {
    const top = spawn(mk('pg-levelup pg-levelup--top'));
    top.textContent = 'L E V E L';
    const bot = spawn(mk('pg-levelup pg-levelup--bot'));
    bot.textContent = 'U P';
    this._after(2400, () => { top.remove(); bot.remove(); });
  }

  // ── Pixel fireworks ─────────────────────────────────────────
  _spawnFireworks(count) {
    const positions = [
      ['25vw','30vh'], ['75vw','28vh'], ['50vw','18vh'],
      ['20vw','60vh'], ['80vw','62vh'],
    ];
    for (let f = 0; f < count; f++) {
      this._after(f * 180, () => {
        const [cx, cy] = positions[f % positions.length];
        const col  = NES_PALETTE[f % NES_PALETTE.length];
        const col2 = NES_PALETTE[(f + 2) % NES_PALETTE.length];

        for (let i = 0; i < 18; i++) {
          const px  = spawn(mk('pg-pixel'));
          const ang = (i / 18) * Math.PI * 2;
          const dist = 55 + Math.random() * 70;
          const jitter = (Math.random() - .5) * 20;
          px.style.background    = i % 3 === 0 ? col2 : col;
          px.style.boxShadow     = `0 0 3px ${col}`;
          px.style.left          = cx;
          px.style.top           = cy;
          px.style.animationDuration = (.55 + Math.random() * .35) + 's';
          px.style.animationDelay    = Math.random() * 80 + 'ms';
          px.style.setProperty('--pfx', (Math.cos(ang) * dist + jitter) + 'px');
          px.style.setProperty('--pfy', (Math.sin(ang) * dist + jitter) + 'px');
          this._after(1100, () => px.remove());
        }
        this._sfxCoin();
      });
    }
  }

  // ── Coin cascade from top ───────────────────────────────────
  _spawnCoinCascade(count) {
    for (let i = 0; i < count; i++) {
      this._after(i * 75, () => {
        const coin = spawn(mk('pg-coin-drop'));
        coin.style.left = (5 + Math.random() * 90) + 'vw';
        const drop = 60 + Math.random() * 90;
        const dur  = .9 + Math.random() * .5;
        coin.style.setProperty('--cd', drop + 'vh');
        coin.style.animationDuration = dur + 's';
        this._after(dur * 1000 + 200, () => coin.remove());

        // Coin sfx on every 4th for sound variety, not total cacophony
        if (i % 4 === 0) this._sfxCoin();
      });
    }
  }

  // ── ? block bounce + coin pop ───────────────────────────────
  _spawnQBlockHit() {
    const b = spawn(mk('pg-block pg-block--q'));
    b.textContent = '?';
    b.style.left  = 'calc(50vw - 28px)';
    b.style.top   = 'calc(50vh + 20px)';

    // Brief pause then hit
    this._after(300, () => {
      b.classList.add('pg-block--hit');
      this._sfxCoin();

      // Coin pops from block top
      const coin = spawn(mk('pg-coin-pop'));
      coin.style.left = 'calc(50vw - 12px)';
      coin.style.top  = 'calc(50vh + 20px)';
      this._after(800, () => coin.remove());

      // Sparkle pixels around coin
      for (let i = 0; i < 8; i++) {
        const px  = spawn(mk('pg-pixel'));
        const ang = (i / 8) * Math.PI * 2;
        px.style.background = i % 2 === 0 ? NY : NW;
        px.style.left = 'calc(50vw - 2px)';
        px.style.top  = 'calc(50vh - 40px)';
        px.style.setProperty('--pfx', (Math.cos(ang) * 30) + 'px');
        px.style.setProperty('--pfy', (Math.sin(ang) * 30) + 'px');
        px.style.animationDuration = '.5s';
        this._after(600, () => px.remove());
      }
    });

    this._after(1200, () => b.remove());
  }

  // ── NES color flash cycle ────────────────────────────────────
  _spawnColorCycle() {
    const colors = [NR, NB, NG, NY, NW];
    let cycle = 0;
    const flash = () => {
      if (this.stopped) return;
      const f = spawn(mk('pg-color-flash'));
      f.style.background = colors[cycle % colors.length];
      cycle++;
      this._after(220, () => f.remove());
      if (cycle < colors.length * 3) {
        this._timers.push(setTimeout(flash, 210));
      }
    };
    flash();
  }

  // ── 8-BIT GENESIS label ──────────────────────────────────────
  _spawnLabel() {
    const label = spawn(mk('pg-label'));
    const main  = document.createElement('div');
    main.className   = 'pg-label-main';
    main.textContent = '8-BIT GENESIS';
    const sub   = document.createElement('div');
    sub.className    = 'pg-label-sub';
    sub.textContent  = '★  1 / 100,000  ·  INSERT COIN  ★';
    label.appendChild(main);
    label.appendChild(sub);
    this._after(8000, () => label.remove());
  }

  // ── "A NEW HIGH SCORE" typewriter ───────────────────────────
  _spawnTypewriter() {
    const el   = spawn(mk('pg-typewriter'));
    const TEXT = 'A NEW HIGH SCORE';
    const cur  = document.createElement('span');
    cur.className = 'pg-cursor';
    el.appendChild(cur);

    let idx = 0;
    const type = () => {
      if (this.stopped || !el.isConnected) return;
      if (idx < TEXT.length) {
        el.insertBefore(document.createTextNode(TEXT[idx]), cur);
        idx++;
        if (idx % 2 === 0) this._sfxCoin();  // coin blip every other char
        const delay = 90 + (TEXT[idx - 1] === ' ' ? 120 : 0);
        this._timers.push(setTimeout(type, delay));
      } else {
        this._sfxStar();
        this._after(2400, () => cur.remove());
      }
    };
    this._timers.push(setTimeout(type, 350));
    this._after(7200, () => el.remove());
  }

  // ═══════════════════════════════════════════════════════════
  //  W E B   A U D I O   C H I P T U N E   S O U N D S
  //  All sounds generated via oscillators — no external files
  // ═══════════════════════════════════════════════════════════

  _audio() {
    if (!this._actx) {
      try {
        this._actx = new (window.AudioContext || window.webkitAudioContext)();
      } catch(e) { return null; }
    }
    // Resume if suspended (browser autoplay policy)
    if (this._actx.state === 'suspended') {
      this._actx.resume();
    }
    return this._actx;
  }

  // Core tone generator — square wave oscillator
  _beep(ctx, startTime, freq, duration, vol = 0.18) {
    try {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'square';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(vol, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
      osc.start(startTime);
      osc.stop(startTime + duration + 0.005);
    } catch(e) {}
  }

  // Coin blip — two ascending tones
  _sfxCoin() {
    const ctx = this._audio();
    if (!ctx) return;
    const t = ctx.currentTime;
    this._beep(ctx, t,        880,  0.055, 0.2);
    this._beep(ctx, t + 0.055, 1320, 0.09,  0.2);
  }

  // Level up — ascending 4-note arpeggio (original pattern)
  _sfxLevelUp() {
    const ctx = this._audio();
    if (!ctx) return;
    const t = ctx.currentTime;
    // A4 → C#5 → E5 → A5
    [440, 554, 659, 880].forEach((f, i) => {
      this._beep(ctx, t + i * 0.1, f, 0.13, 0.18);
    });
  }

  // Star sparkle — rapid ascending burst
  _sfxStar() {
    const ctx = this._audio();
    if (!ctx) return;
    const t = ctx.currentTime;
    // C6 → E6 → G6 → C7
    [1047, 1319, 1568, 2093].forEach((f, i) => {
      this._beep(ctx, t + i * 0.038, f, 0.055, 0.14);
    });
  }

  // Power-up — sweeping frequency glide
  _sfxPowerUp() {
    const ctx = this._audio();
    if (!ctx) return;
    try {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'square';
      const t = ctx.currentTime;
      osc.frequency.setValueAtTime(280, t);
      osc.frequency.exponentialRampToValueAtTime(1120, t + 0.48);
      gain.gain.setValueAtTime(0.16, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.52);
      osc.start(t);
      osc.stop(t + 0.53);
    } catch(e) {}
  }

  // Victory fanfare — 8-note original ascending celebration
  _sfxFanfare() {
    const ctx = this._audio();
    if (!ctx) return;
    const t = ctx.currentTime;
    // Original sequence: G4 → C5 → E5 → G5 → G5 → A5 → B5 → C6 (held)
    const seq = [
      [392,  0.00, 0.10, 0.20],
      [523,  0.10, 0.10, 0.20],
      [659,  0.20, 0.10, 0.20],
      [784,  0.30, 0.16, 0.20],
      [784,  0.46, 0.07, 0.20],
      [880,  0.53, 0.10, 0.20],
      [988,  0.63, 0.10, 0.20],
      [1047, 0.73, 0.42, 0.22],  // C6 held — the climax
    ];
    seq.forEach(([f, off, dur, vol]) => {
      this._beep(ctx, t + off, f, dur, vol);
    });
    // Harmony layer — lower octave underneath
    const harmony = [
      [196, 0.00, 0.10, 0.06],
      [262, 0.10, 0.10, 0.06],
      [330, 0.20, 0.10, 0.06],
      [392, 0.30, 0.55, 0.07],
      [440, 0.53, 0.10, 0.06],
      [494, 0.63, 0.10, 0.06],
      [524, 0.73, 0.42, 0.08],
    ];
    harmony.forEach(([f, off, dur, vol]) => {
      this._beep(ctx, t + off, f, dur, vol);
    });
  }
}