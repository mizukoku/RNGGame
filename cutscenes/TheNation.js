// cutscenes/TheNation.js
// ═══════════════════════════════════════════════════════════════
//  T H E   N A T I O N  —  1 / 500,000
//  Hybrid: DOM/CSS flag + SVG horizon/stars + canvas marching engine
//  + Web Audio anthem (original melody, no real anthems sampled)
//
//  In the beginning there were only people.
//  Scattered. Without name. Without purpose.
//  Then someone planted a flag.
//  And everything changed.
//
//  Phase 0  (0ms)    : Deep navy void. Wind begins.
//  Phase 1  (500ms)  : Horizon line drawn — earth and sky
//  Phase 2  (1400ms) : 12 stars rise and lock into crown constellation
//  Phase 3  (2800ms) : Flagpole ascends from earth
//  Phase 4  (3800ms) : Flag unfurls — CSS cloth wave
//  Phase 5  (5200ms) : "Fragments. Scattered. Alone." — dark, pre-civilization
//  Phase 6  (7000ms) : 80 silhouette march particles from both sides
//  Phase 7  (8500ms) : 3 cannon booms — sequential shakes
//  Phase 8  (9500ms) : "Until one day, they remembered their name."
//  Phase 9  (12000ms): 8 sequential firework bursts
//  Phase 10 (13500ms): Crown descends and settles
//  Phase 11 (15000ms): Canvas — gold rays + crimson/white glow + march stream
//  Phase 12 (16500ms): T H E   N A T I O N label
//  Phase 13 (19000ms): "A PEOPLE MADE OF PURPOSE." typewriter
//  Phase 14 (26000ms): Void fades
//  Phase 15 (35000ms): Resolve
// ═══════════════════════════════════════════════════════════════

import { ParticleBurst, ContinuousParticles } from '../effects/ParticleBurst.js';
import { GlowOverlay, RayBurst }               from '../effects/GlowOverlay.js';

// ── Palette ───────────────────────────────────────────────────
const NN  = '#001a3d';              // nation navy
const NG  = '#ffd700';              // nation gold
const NC  = '#cc0020';              // nation crimson
const NW  = '#ffffff';              // nation white
const NP  = '#f5e6c8';              // nation parchment
const NE  = '#2a1400';              // nation earth
const NB  = '#001050';              // nation deep blue sky

const NG_GLOW = 'rgba(255,215,0,0.95)';
const NC_GLOW = 'rgba(204,0,32,0.9)';

// ── CSS ───────────────────────────────────────────────────────
const CSS = `
/* ── Void ── */
.tn-void {
  position:fixed;inset:0;
  background:linear-gradient(to bottom, ${NN} 0%, ${NB} 45%, ${NE} 100%);
  z-index:9990;pointer-events:none;
  opacity:1;transition:opacity 3s ease;
}
.tn-void--fade { opacity:0; }

/* ── Phase 1: Horizon scene layer (SVG) ── */
.tn-horizon-layer {
  position:fixed;inset:0;pointer-events:none;z-index:9991;
}
.tn-horizon-layer svg { position:absolute;inset:0;width:100%;height:100%; }

/* Horizon ground line */
.tn-ground-line {
  stroke:rgba(255,215,0,.55);stroke-width:.4px;
  stroke-dasharray:200;stroke-dashoffset:200;
  animation:tnLineDraw 1.2s ease-out forwards;
  animation-delay:.1s;
}
@keyframes tnLineDraw { to{stroke-dashoffset:0} }

/* Earth fill below horizon */
.tn-earth-fill {
  fill:${NE};opacity:0;
  animation:tnFillReveal 1s ease forwards;
  animation-delay:.3s;
}
@keyframes tnFillReveal { to{opacity:1} }

/* ── Phase 2: Constellation stars ── */
.tn-star {
  position:fixed;pointer-events:none;z-index:9992;
  border-radius:50%;
  background:${NW};
  box-shadow:0 0 var(--ssz) ${NW}, 0 0 calc(var(--ssz) * 3) rgba(255,215,0,.4);
  opacity:0;
  animation:tnStarRise var(--sdur) cubic-bezier(.2,.8,.3,1) forwards;
  animation-delay:var(--sdly);
  transition:left 1.2s cubic-bezier(.4,0,.2,1),top 1.2s cubic-bezier(.4,0,.2,1),
             box-shadow 1.2s ease;
}
@keyframes tnStarRise {
  0%  {opacity:0;transform:translateY(30px) scale(.1)}
  60% {opacity:1;transform:translateY(-4px) scale(1.2)}
  100%{opacity:1;transform:translateY(0) scale(1)}
}
/* Locked into constellation — golden glow upgrade */
.tn-star--locked {
  box-shadow:0 0 var(--ssz) ${NG}, 0 0 calc(var(--ssz) * 4) rgba(255,215,0,.7),
             0 0 calc(var(--ssz) * 10) rgba(255,215,0,.25);
  background:${NG};
  animation:tnStarPulse 2.5s ease-in-out infinite alternate;
}
@keyframes tnStarPulse {
  from{filter:brightness(1) saturate(1)}
  to  {filter:brightness(1.5) saturate(1.3)}
}

/* Constellation lines connecting stars */
.tn-const-line {
  position:fixed;pointer-events:none;z-index:9991;
  height:1px;background:rgba(255,215,0,.3);
  transform-origin:left center;
  opacity:0;animation:tnConstLineIn .5s ease forwards;
}
@keyframes tnConstLineIn { to{opacity:1} }

/* ── Phase 3: Flagpole ── */
.tn-pole-wrap {
  position:fixed;left:50%;bottom:40%;
  transform:translateX(-50%);
  pointer-events:none;z-index:9995;
  display:flex;flex-direction:column;align-items:center;
}
.tn-pole {
  width:3px;background:linear-gradient(to bottom,${NG} 0%,rgba(255,215,0,.6) 60%,rgba(80,50,0,.8) 100%);
  height:0;
  box-shadow:0 0 6px rgba(255,215,0,.4);
  transition:height 1.4s cubic-bezier(.2,.8,.3,1);
  border-radius:1px 1px 0 0;
}
.tn-pole--raised { height:42vh; }
.tn-pole-tip {
  width:10px;height:10px;border-radius:50%;
  background:${NG};box-shadow:0 0 10px ${NG},0 0 25px rgba(255,215,0,.6);
  opacity:0;transition:opacity .4s ease;
  margin-bottom:-5px;
  order:-1;
}
.tn-pole-tip--on { opacity:1; }

/* ── Phase 4: Flag ── */
.tn-flag-wrap {
  position:fixed;pointer-events:none;z-index:9994;
  opacity:0;transform-origin:left center;
  transition:opacity .3s ease;
}
.tn-flag-wrap--on { opacity:1; }

/* Three bars — top:crimson, mid:gold, bot:navy */
.tn-flag {
  display:flex;flex-direction:column;
  width:0;overflow:hidden;
  transition:width 1.1s cubic-bezier(.2,.8,.3,1);
  border:1px solid rgba(255,215,0,.3);
  box-shadow:2px 2px 18px rgba(0,0,0,.6),0 0 30px rgba(255,215,0,.15);
}
.tn-flag--unfurled { width:180px; }
.tn-flag-bar {
  height:40px;
  animation:tnFlagWave 3.2s ease-in-out infinite alternate;
}
.tn-flag-bar:nth-child(1){background:${NC};animation-delay:0s}
.tn-flag-bar:nth-child(2){background:${NG};animation-delay:.15s}
.tn-flag-bar:nth-child(3){background:${NN};animation-delay:.3s}
@keyframes tnFlagWave {
  0%  {transform:skewY(0deg) scaleX(1)}
  25% {transform:skewY(-1.5deg) scaleX(.97)}
  50% {transform:skewY(.8deg) scaleX(1.01)}
  75% {transform:skewY(-1deg) scaleX(.98)}
  100%{transform:skewY(1.2deg) scaleX(1.02)}
}

/* ── Phase 5: Pre-civilization text ── */
.tn-dark-text {
  position:fixed;left:50%;top:28%;
  transform:translateX(-50%);
  pointer-events:none;z-index:10005;
  font-family:'Georgia','Times New Roman',serif;font-style:italic;
  font-size:clamp(1rem,2.2vw,1.4rem);letter-spacing:7px;
  color:rgba(200,180,140,.6);
  text-shadow:0 0 15px rgba(140,100,40,.3);
  white-space:nowrap;text-align:center;
  opacity:0;
  display:flex;flex-wrap:wrap;justify-content:center;
}

/* ── Phase 6: March particles ── */
.tn-march {
  position:fixed;top:calc(60% - 12px);
  pointer-events:none;z-index:9993;
  width:8px;height:12px;
  background:${NE};
  border-radius:4px 4px 0 0;
  box-shadow:0 0 4px rgba(255,215,0,.2);
  animation:tnMarchStep var(--mdur) linear forwards;
}
/* From left side */
.tn-march--left {
  animation-name:tnMarchLeft;
}
/* From right side */
.tn-march--right {
  animation-name:tnMarchRight;
}
@keyframes tnMarchLeft {
  0%  {left:var(--mstart);opacity:1;transform:translateY(0)}
  80% {opacity:.9}
  100%{left:48%;opacity:0;transform:translateY(-2px)}
}
@keyframes tnMarchRight {
  0%  {right:var(--mstart);opacity:1;transform:translateY(0)}
  80% {opacity:.9}
  100%{right:48%;opacity:0;transform:translateY(-2px)}
}

/* ── Phase 8: "They remembered their name." golden text ── */
.tn-golden-text {
  position:fixed;left:50%;top:32%;
  transform:translate(-50%,-50%);
  pointer-events:none;z-index:10006;
  font-family:'Georgia','Times New Roman',serif;
  font-size:clamp(1.1rem,2.4vw,1.55rem);letter-spacing:5px;
  color:${NG};
  text-shadow:0 0 12px ${NG},0 0 35px rgba(255,215,0,.6),0 0 80px rgba(255,200,0,.3);
  white-space:nowrap;text-align:center;max-width:80vw;
  opacity:0;animation:tnGoldTextIn 6.5s ease forwards;
}
@keyframes tnGoldTextIn {
  0%  {opacity:0;transform:translate(-50%,-50%) scale(.9);filter:blur(6px)}
  12% {opacity:1;transform:translate(-50%,-50%) scale(1.02);filter:blur(0)}
  16% {transform:translate(-50%,-50%) scale(1)}
  78% {opacity:1}
  100%{opacity:0;transform:translate(-50%,-50%) translateY(-8px)}
}

/* ── Phase 9: Firework shell + burst ── */
.tn-fw-shell {
  position:fixed;pointer-events:none;z-index:9995;
  width:4px;height:4px;border-radius:50%;
  animation:tnFwRise var(--fwdur) ease-out forwards;
}
@keyframes tnFwRise {
  0%  {opacity:1;transform:translate(var(--fwx),0)}
  100%{opacity:.4;transform:translate(var(--fwx),var(--fwy))}
}
.tn-fw-spark {
  position:fixed;pointer-events:none;z-index:9995;
  width:3px;height:3px;border-radius:50%;
  background:var(--fsc);
  box-shadow:0 0 5px var(--fsc),0 0 12px var(--fsc);
  animation:tnFwSpark var(--fsdur) ease-out forwards;
}
@keyframes tnFwSpark {
  0%  {opacity:1;transform:translate(var(--fsx),var(--fsy)) scale(1.2)}
  60% {opacity:.7}
  100%{opacity:0;transform:translate(calc(var(--fsx) * 2.2),calc(var(--fsy) * 2.2 + 8vh)) scale(.1)}
}

/* ── Phase 10: Crown ── */
.tn-crown {
  position:fixed;left:50%;
  transform:translateX(-50%);
  pointer-events:none;z-index:9996;
  font-size:52px;line-height:1;
  filter:drop-shadow(0 0 18px ${NG}) drop-shadow(0 0 50px rgba(255,215,0,.6));
  opacity:0;
  animation:tnCrownDescend var(--cdur) cubic-bezier(.2,.8,.3,1) forwards;
}
@keyframes tnCrownDescend {
  0%  {opacity:0;filter:drop-shadow(0 0 0px ${NG});transform:translateX(-50%) translateY(-12vh) scale(.5) rotate(-8deg)}
  25% {opacity:1;transform:translateX(-50%) translateY(0vh) scale(1.08) rotate(2deg)}
  40% {transform:translateX(-50%) translateY(0) scale(1.02) rotate(-1deg)}
  55% {transform:translateX(-50%) translateY(0) scale(1) rotate(0deg)}
  80% {opacity:1}
  100%{opacity:0}
}

/* ── Phase 12: Label ── */
.tn-label {
  position:fixed;left:50%;top:50%;
  transform:translate(-50%,-50%);
  pointer-events:none;z-index:10012;
  display:flex;flex-direction:column;align-items:center;gap:16px;
  animation:tnLabelReveal 12s ease forwards;
}
@keyframes tnLabelReveal {
  0%  {opacity:0;transform:translate(-50%,-50%) scale(.55);filter:blur(22px)}
  7%  {opacity:1;transform:translate(-50%,-50%) scale(1.03);filter:blur(0)}
  12% {transform:translate(-50%,-50%) scale(1)}
  80% {opacity:1}
  100%{opacity:0}
}

.tn-label-main {
  position:relative;
  font-family:'Georgia','Times New Roman',serif;
  font-size:38px;font-weight:400;letter-spacing:18px;
  color:${NG};
  text-shadow:
    0 0 8px ${NG},0 0 24px rgba(255,215,0,.7),
    0 0 65px rgba(255,200,0,.4),0 0 150px rgba(255,180,0,.2);
  border:1px solid rgba(255,215,0,.5);
  padding:22px 56px;
  background:rgba(5,3,0,.97);
  box-shadow:
    0 0 0 3px rgba(204,0,32,.15),
    0 0 45px rgba(255,215,0,.35),
    0 0 100px rgba(255,180,0,.15),
    inset 0 0 40px rgba(255,215,0,.04);
  animation:tnLabelGold 4s ease-in-out infinite alternate;
}
@keyframes tnLabelGold {
  from{
    text-shadow:0 0 8px ${NG},0 0 24px rgba(255,215,0,.7),0 0 65px rgba(255,200,0,.4),0 0 150px rgba(255,180,0,.2);
    box-shadow:0 0 0 3px rgba(204,0,32,.15),0 0 45px rgba(255,215,0,.35),0 0 100px rgba(255,180,0,.15),inset 0 0 40px rgba(255,215,0,.04);
    border-color:rgba(255,215,0,.5);
  }
  to{
    text-shadow:0 0 14px ${NW},0 0 40px ${NG},0 0 100px rgba(255,200,0,.65),0 0 240px rgba(255,180,0,.3);
    box-shadow:0 0 0 3px rgba(204,0,32,.3),0 0 80px rgba(255,215,0,.6),0 0 200px rgba(255,180,0,.3),inset 0 0 80px rgba(255,215,0,.07);
    border-color:rgba(255,220,80,.75);
  }
}

/* Corner flourishes — CSS generated ornaments */
.tn-label-main::before,
.tn-label-main::after {
  content:'✦';
  position:absolute;top:7px;
  font-size:11px;color:rgba(255,215,0,.6);
  animation:tnFlourish 2s ease-in-out infinite alternate;
}
.tn-label-main::before { left:12px; }
.tn-label-main::after  { right:12px; }
@keyframes tnFlourish {
  from{opacity:.5;transform:scale(.9) rotate(-5deg)}
  to  {opacity:1;transform:scale(1.1) rotate(5deg);color:rgba(255,220,120,.9)}
}

.tn-label-sub {
  font-family:'Georgia','Times New Roman',serif;font-style:italic;
  font-size:10px;letter-spacing:6px;
  color:rgba(255,200,80,.45);
  text-shadow:0 0 8px rgba(255,180,0,.3);
}

/* ── Phase 13: Typewriter ── */
.tn-typewriter {
  position:fixed;left:50%;top:calc(50% + 88px);
  transform:translateX(-50%);
  pointer-events:none;z-index:10013;
  font-family:'Georgia','Times New Roman',serif;font-style:italic;
  font-size:15px;letter-spacing:6px;
  color:rgba(255,220,120,.82);
  text-shadow:0 0 12px rgba(255,180,0,.5);
  white-space:nowrap;
  animation:tnTypeReveal 9s ease forwards;
}
@keyframes tnTypeReveal {
  0%{opacity:0} 5%{opacity:1} 84%{opacity:1} 100%{opacity:0}
}
.tn-cursor {
  display:inline-block;width:2px;height:1em;
  background:rgba(255,215,0,.75);margin-left:3px;vertical-align:middle;
  box-shadow:0 0 5px rgba(255,180,0,.5);
  animation:tnCursorBlink .7s step-end infinite;
}
@keyframes tnCursorBlink { 0%,100%{opacity:1} 50%{opacity:0} }

/* ── Shakes ── */
@keyframes tnCannonShake {
  0%,100%{transform:translate(0,0)}
  8% {transform:translate(-14px,16px)}
  18%{transform:translate(13px,-15px)}
  28%{transform:translate(-11px,12px)}
  38%{transform:translate(10px,-11px)}
  50%{transform:translate(-7px,8px)}
  62%{transform:translate(6px,-7px)}
  74%{transform:translate(-4px,5px)}
  86%{transform:translate(3px,-3px)}
}
body.tn-cannon { animation:tnCannonShake .55s ease-out; }
`;

function injectCSS() {
  if (document.getElementById('tn-styles')) return;
  const s = document.createElement('style');
  s.id = 'tn-styles';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function mk(cls) { const el = document.createElement('div'); el.className = cls; return el; }
let _spawned = [];
function spawn(el)    { _spawned.push(el); document.body.appendChild(el); return el; }
function killSpawned(){ _spawned.forEach(e => e.remove()); _spawned = []; }
function rnd(lo, hi)  { return lo + Math.random() * (hi - lo); }

// ── Crown constellation layout (12 stars forming a crown arc) ──
// Percentage positions relative to viewport, arcing across top half
const CROWN_STARS = [
  // bottom-left row
  { x: 34, y: 28 }, { x: 38, y: 24 }, { x: 41, y: 27 },
  // left peak
  { x: 43, y: 21 },
  // center valley
  { x: 46, y: 26 }, { x: 50, y: 23 }, { x: 54, y: 26 },
  // right peak
  { x: 57, y: 21 },
  // bottom-right row
  { x: 59, y: 27 }, { x: 62, y: 24 }, { x: 66, y: 28 },
  // cap star — brightest, center-top
  { x: 50, y: 16 },
];

// ══════════════════════════════════════════════════════════════
export class TheNation {
  constructor(engine, rarity) {
    this.engine   = engine;
    this.rarity   = rarity;
    this.stopped  = false;
    this._timers  = [];
    this._actx    = null;
    this._windNode = null;
    this._poleEl  = null;
    this._tipEl   = null;
    this._flagEl  = null;
    this._starEls = [];
    this.fx = {
      shakeIntensity: 85,
      particleCount:  300,
      rayCount:       56,
      glowMaxAlpha:   0.95,
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

      // ── Phase 0: Navy void ────────────────────────────────────
      const voidEl = spawn(mk('tn-void'));
      this._after(26000, () => voidEl.classList.add('tn-void--fade'));
      this._after(28500, () => voidEl.remove());

      // Fade all persistent scene elements BEFORE the void reveals the game UI.
      // Starts 1.5s before void fade so they're invisible when the void lifts.
      this._after(24500, () => {
        document.querySelectorAll(
          '.tn-horizon-layer,.tn-pole-wrap,.tn-flag-wrap,.tn-star,.tn-const-line,.tn-crown'
        ).forEach(el => {
          el.style.transition = 'opacity 1.8s ease';
          el.style.opacity    = '0';
        });
      });

      // Wind starts immediately
      this._sfxWind();

      // ── Phase 1: Horizon SVG ─────────────────────────────────
      this._after(500, () => this._spawnHorizon());

      // ── Phase 2: Crown constellation ─────────────────────────
      this._after(1400, () => this._spawnConstellation());

      // ── Phase 3: Flagpole rises ───────────────────────────────
      this._after(2800, () => this._spawnFlagpole());

      // ── Phase 4: Flag unfurls ─────────────────────────────────
      this._after(3800, () => this._unfurlFlag());

      // ── Phase 5: Dark pre-civilization text ───────────────────
      this._after(5200, () => this._spawnDarkText());

      // ── Phase 6: March silhouettes ────────────────────────────
      this._after(7000, () => this._spawnMarch(80));

      // ── Phase 7: Three cannon booms ──────────────────────────
      [8500, 9200, 9900].forEach((t, i) => {
        this._after(t, () => {
          document.body.classList.add('tn-cannon');
          this._after(600, () => document.body.classList.remove('tn-cannon'));
          this.engine.shake(this.fx.shakeIntensity * (0.7 + i * 0.15));
          this._sfxCannon(i);
        });
      });

      // ── Phase 8: Golden founding text ────────────────────────
      this._after(10500, () => {
        const txt = spawn(mk('tn-golden-text'));
        txt.textContent = 'Until one day, they remembered their name.';
        this._after(6200, () => txt.remove());
      });

      // ── Phase 9: 8 firework bursts ───────────────────────────
      this._after(12000, () => this._spawnFireworks(8));

      // ── Phase 10: Crown descends ─────────────────────────────
      this._after(13500, () => this._spawnCrown());

      // Trumpet fanfare at crown descent
      this._after(13600, () => this._sfxTrumpet());

      // ── Phase 11: Canvas rays + glow + march stream ──────────
      this._after(15000, () => {
        const warmCols = [NG, NC, NW, '#ffaa00', '#ff6633', NG];
        warmCols.forEach((col, i) => {
          this._after(i * 120, () => {
            this.engine.addEffect(new RayBurst({
              color: col, duration: 15000,
              maxAlpha: 0.2 - i * 0.025,
              rayCount: Math.floor(this.fx.rayCount * (1.2 - i * 0.12)),
              rotSpeed: i % 2 === 0 ? 0.55 + i * 0.15 : -(0.45 + i * 0.12),
            }));
          });
        });

        this.engine.addEffect(new GlowOverlay({
          color: NG_GLOW, duration: 15000, maxAlpha: this.fx.glowMaxAlpha,
          fadeIn: 0.04, fadeOut: 0.2, radial: true, pulseSpeed: 1.2,
        }));
        this.engine.addEffect(new GlowOverlay({
          color: NC_GLOW, duration: 13000, maxAlpha: 0.55,
          fadeIn: 0.06, fadeOut: 0.25, radial: true, pulseSpeed: 1.8,
        }));

        // Three particle eruptions — gold, crimson, white
        [[NG, 1.0], [NC, 0.85], [NW, 0.65]].forEach(([col, scale], i) => {
          this._after(i * 140, () => {
            this.engine.addEffect(new ParticleBurst(0.5, 0.5, {
              count:    Math.floor(this.fx.particleCount * scale),
              color:    col,
              minSpeed: 90  + i * 80,
              maxSpeed: 520 + i * 40,
              minSize:  2, maxSize: 12,
              gravity:  55,
              trail:    true, glow: true,
              duration: 13000,
              type:     'star',
            }));
          });
        });

        // Anthem starts here — the full synthesized melody
        this._sfxAnthem();

        // Crowd cheer noise
        this._sfxCrowd();

        // Continuous gold sparks rising like firework embers
        this.engine.addEffect(new ContinuousParticles({
          ox: 0.5, oy: 0.6,
          color: NG,
          minSpeed: 50, maxSpeed: 200,
          gravity: -60, upBias: 140,
          spread: Math.PI * 2, angle: -Math.PI / 2,
          minSize: 1, maxSize: 5,
          trail: true, glow: true,
          spawnRate: 0.045, duration: 13000, type: 'star',
        }));
      });

      // ── Phase 12: Label ───────────────────────────────────────
      this._after(16500, () => this._spawnLabel());

      // ── Phase 13: Typewriter ──────────────────────────────────
      this._after(19000, () => this._spawnTypewriter());

      // ── Phase 15: Resolve ─────────────────────────────────────
      this._after(29500, () => {
        killSpawned();
        this._stopWind();
        if (this._actx) { try { this._actx.close(); } catch(e){} }
        resolve();
      });
    });
  }

  stop() {
    this.stopped = true;
    this._timers.forEach(clearTimeout);
    this._timers = [];
    document.body.classList.remove('tn-cannon');
    this._stopWind();
    if (this._actx) { try { this._actx.close(); } catch(e){} }
    killSpawned();
  }

  // ── Phase 1: Horizon SVG ─────────────────────────────────────
  _spawnHorizon() {
    const layer = spawn(mk('tn-horizon-layer'));
    const svg   = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';

    // Earth fill rectangle below horizon (62%)
    const earth = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    earth.setAttribute('x', '0'); earth.setAttribute('y', '62');
    earth.setAttribute('width', '100'); earth.setAttribute('height', '38');
    earth.className.baseVal = 'tn-earth-fill';
    svg.appendChild(earth);

    // Horizon line
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', '0');  line.setAttribute('y1', '62');
    line.setAttribute('x2', '100'); line.setAttribute('y2', '62');
    line.className.baseVal = 'tn-ground-line';
    svg.appendChild(line);

    // Distant mountain silhouettes — three triangles
    const mountains = [
      'M 15 62 L 28 48 L 41 62 Z',
      'M 35 62 L 50 40 L 65 62 Z',
      'M 58 62 L 72 50 L 86 62 Z',
    ];
    mountains.forEach((d, i) => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', d);
      path.style.fill   = `rgba(20,10,0,${0.8 - i * 0.12})`;
      path.style.opacity = '0';
      path.style.animation = `tnFillReveal ${0.8 + i * 0.2}s ease forwards`;
      path.style.animationDelay = `${0.4 + i * 0.15}s`;
      svg.appendChild(path);
    });

    layer.appendChild(svg);
  }

  // ── Phase 2: Crown constellation ─────────────────────────────
  _spawnConstellation() {
    this._starEls = [];

    // Spawn stars one by one, rising from below horizon
    CROWN_STARS.forEach((pos, i) => {
      this._after(i * 120, () => {
        const star = spawn(mk('tn-star'));
        const sz   = i === 11 ? 6 : (i % 3 === 0 ? 4 : 3); // cap star is largest
        star.style.cssText = `
          left:${pos.x}%;top:${pos.y + 30}%;
          width:${sz}px;height:${sz}px;
          --ssz:${sz + 2}px;
          --sdur:${0.6 + i * 0.04}s;
          --sdly:0ms;
        `;
        // Rise to final position
        this._after(50, () => {
          star.style.left = pos.x + '%';
          star.style.top  = pos.y + '%';
        });
        // Lock into constellation (gold glow upgrade)
        this._after(800 + i * 120, () => star.classList.add('tn-star--locked'));
        this._starEls.push(star);
      });
    });

    // Draw constellation lines between adjacent stars after all appear
    this._after(CROWN_STARS.length * 120 + 900, () => this._drawConstellationLines());
  }

  _drawConstellationLines() {
    // Connect consecutive pairs along the crown arc
    const pairs = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[2,11],[5,11],[8,11]];
    pairs.forEach(([a, b], i) => {
      this._after(i * 80, () => {
        if (this._starEls.length < 12) return;
        const sa = this._starEls[a], sb = this._starEls[b];
        if (!sa || !sb) return;
        const ax = parseFloat(sa.style.left) / 100 * window.innerWidth;
        const ay = parseFloat(sa.style.top)  / 100 * window.innerHeight;
        const bx = parseFloat(sb.style.left) / 100 * window.innerWidth;
        const by = parseFloat(sb.style.top)  / 100 * window.innerHeight;
        const dx = bx - ax, dy = by - ay;
        const len = Math.sqrt(dx*dx + dy*dy);
        const ang = Math.atan2(dy, dx) * 180 / Math.PI;
        const line = spawn(mk('tn-const-line'));
        line.style.cssText = `
          left:${ax}px;top:${ay}px;
          width:${len}px;
          transform:rotate(${ang}deg);
          animation-delay:${i * 80}ms;
        `;
        this._after(8000, () => line.remove());
      });
    });
  }

  // ── Phase 3: Flagpole rises ───────────────────────────────────
  _spawnFlagpole() {
    const wrap = spawn(mk('tn-pole-wrap'));
    const tip  = document.createElement('div');
    tip.className = 'tn-pole-tip';
    this._tipEl  = tip;
    const pole = document.createElement('div');
    pole.className = 'tn-pole';
    this._poleEl = pole;
    wrap.appendChild(tip);
    wrap.appendChild(pole);

    // Trigger height transition
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        pole.classList.add('tn-pole--raised');
        this._after(800, () => tip.classList.add('tn-pole-tip--on'));
      });
    });
  }

  // ── Phase 4: Flag unfurls ─────────────────────────────────────
  _unfurlFlag() {
    // Position flag at pole tip height
    const flagWrap = spawn(mk('tn-flag-wrap'));

    // Flag anchors to left side of pole at ~top of pole
    // pole-wrap is at bottom:40%, left:50%, height grows to 42vh
    // So flag tip is at: top = 100% - 40% - 42vh ≈ depends on vh
    // Use a fixed approximate position
    flagWrap.style.cssText = `
      position:fixed;left:calc(50% + 1px);top:calc(58% - 42vh);
      transform-origin:left top;
    `;

    const flag = document.createElement('div');
    flag.className = 'tn-flag';
    ['','',''].forEach(() => {
      const bar = document.createElement('div');
      bar.className = 'tn-flag-bar';
      flag.appendChild(bar);
    });
    flagWrap.appendChild(flag);
    this._flagEl = flag;

    flagWrap.classList.add('tn-flag-wrap--on');
    requestAnimationFrame(() => requestAnimationFrame(() => {
      flag.classList.add('tn-flag--unfurled');
    }));
  }

  // ── Phase 5: Pre-civilization dark text ──────────────────────
  _spawnDarkText() {
    const words = ['Fragments.', '\u00A0', 'Scattered.', '\u00A0', 'Alone.'];
    const el    = spawn(mk('tn-dark-text'));
    el.style.opacity = '1';
    words.forEach((word, i) => {
      const span = document.createElement('span');
      span.style.cssText = `
        display:inline-block;opacity:0;
        animation:tnGoldTextIn ${3 + i * 0.3}s ease forwards;
        animation-delay:${i * 340}ms;
        font-style:italic;letter-spacing:6px;
        color:rgba(180,140,80,.55);
        margin:0 4px;
      `;
      span.textContent = word;
      el.appendChild(span);
    });
    this._after(4800, () => el.remove());
  }

  // ── Phase 6: March silhouettes ────────────────────────────────
  _spawnMarch(count) {
    for (let i = 0; i < count; i++) {
      this._after(i * 28, () => {
        const m    = spawn(mk(`tn-march tn-march--${i % 2 === 0 ? 'left' : 'right'}`));
        const dur  = rnd(1.1, 2.0);
        const yOff = rnd(-8, 8);
        const start = rnd(0, 12);
        m.style.cssText = `
          top:calc(60% - 12px + ${yOff}px);
          --mstart:${start}%;
          --mdur:${dur}s;
          animation-delay:${i * 28}ms;
          height:${rnd(8, 14)}px;
          width:${rnd(5, 9)}px;
          opacity:${rnd(0.5, 0.9)};
          background:rgba(${i % 3 === 0 ? '255,215,0' : i % 3 === 1 ? '204,0,32' : '220,200,160'},.7);
        `;
        m.style.setProperty('--mstart', start + '%');
        this._after((dur + 0.2) * 1000 + i * 28, () => m.remove());
      });
    }
  }

  // ── Phase 9: Fireworks ───────────────────────────────────────
  _spawnFireworks(count) {
    const fireworkColors = [NG, NC, NW, '#ffaa00', NG, NC, NW, NG];
    for (let i = 0; i < count; i++) {
      this._after(i * 280, () => {
        const cx  = rnd(20, 80);   // percent
        const cy  = rnd(10, 45);
        const col = fireworkColors[i % fireworkColors.length];
        // 20 sparks per burst
        for (let j = 0; j < 22; j++) {
          const spark = spawn(mk('tn-fw-spark'));
          const ang   = (Math.PI * 2 / 22) * j + rnd(-0.2, 0.2);
          const dist  = rnd(6, 16);
          const dur   = rnd(0.6, 1.1);
          spark.style.cssText = `
            left:${cx}%;top:${cy}%;
            width:${rnd(2,4)}px;height:${rnd(2,4)}px;
            --fsc:${col};
            --fsx:${Math.cos(ang) * dist}vmin;
            --fsy:${Math.sin(ang) * dist}vmin;
            --fsdur:${dur}s;
            animation-delay:${i * 280}ms;
          `;
          this._after((dur + 0.3) * 1000 + i * 280, () => spark.remove());
        }
      });
    }
  }

  // ── Phase 10: Crown descends ─────────────────────────────────
  _spawnCrown() {
    const crown = spawn(mk('tn-crown'));
    crown.textContent = '♛';  // Unicode crown — pure CSS rendered
    // Position above flagpole tip area
    crown.style.cssText = `
      position:fixed;left:50%;
      top:calc(58% - 42vh - 62px);
      transform:translateX(-50%);
      pointer-events:none;z-index:9996;
      font-size:52px;line-height:1;
      filter:drop-shadow(0 0 18px ${NG}) drop-shadow(0 0 50px rgba(255,215,0,.6));
      opacity:0;
      --cdur:3.8s;
      animation:tnCrownDescend var(--cdur) cubic-bezier(.2,.8,.3,1) forwards;
    `;
    this._after(12000, () => crown.remove());
  }

  // ── Label ─────────────────────────────────────────────────────
  _spawnLabel() {
    const label = spawn(mk('tn-label'));
    const main  = document.createElement('div');
    main.className   = 'tn-label-main';
    main.textContent = 'T H E   N A T I O N';
    const sub   = document.createElement('div');
    sub.className    = 'tn-label-sub';
    sub.textContent  = '1 / 500,000  ·  IN THE FOUNDING, ALL THINGS BECOME ONE';
    label.appendChild(main);
    label.appendChild(sub);
    this._after(11800, () => label.remove());
  }

  // ── "A PEOPLE MADE OF PURPOSE." typewriter ────────────────────
  _spawnTypewriter() {
    const el   = spawn(mk('tn-typewriter'));
    const TEXT = 'A PEOPLE MADE OF PURPOSE.';
    const cur  = document.createElement('span');
    cur.className = 'tn-cursor';
    el.appendChild(cur);
    let idx = 0;
    const type = () => {
      if (this.stopped || !el.isConnected) return;
      if (idx < TEXT.length) {
        el.insertBefore(document.createTextNode(TEXT[idx]), cur);
        idx++;
        this._sfxDrumTick();
        const delay = 105 + (TEXT[idx-1] === ' ' ? 180 : 0) + (Math.random() > .88 ? 200 : 0);
        this._timers.push(setTimeout(type, delay));
      } else {
        this._after(3000, () => cur.remove());
      }
    };
    this._timers.push(setTimeout(type, 400));
    this._after(8600, () => el.remove());
  }

  // ═════════════════════════════════════════════════════════════
  //  W E B   A U D I O
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

  // Wind — bandpass filtered noise, 200–800 Hz
  _sfxWind() {
    const ctx = this._audio();
    if (!ctx) return;
    try {
      const bufLen = ctx.sampleRate * 35;
      const buf    = ctx.createBuffer(1, bufLen, ctx.sampleRate);
      const data   = buf.getChannelData(0);
      for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;
      const src  = ctx.createBufferSource();
      src.buffer = buf;
      const bp   = ctx.createBiquadFilter();
      bp.type    = 'bandpass'; bp.frequency.value = 400; bp.Q.value = 0.6;
      const g    = ctx.createGain();
      src.connect(bp); bp.connect(g); g.connect(ctx.destination);
      const t = ctx.currentTime;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.055, t + 3);
      // Swells when flag unfurls
      g.gain.linearRampToValueAtTime(0.10, t + 5);
      g.gain.setValueAtTime(0.10, t + 12);
      g.gain.linearRampToValueAtTime(0.05, t + 18);
      g.gain.linearRampToValueAtTime(0, t + 34);
      src.start(t); src.stop(t + 35);
      this._windNode = src;
    } catch(e) {}
  }

  _stopWind() {
    try { if (this._windNode) { this._windNode.stop(); this._windNode = null; } } catch(e) {}
  }

  // Cannon boom — deep sine + noise burst (3 sequential calls)
  _sfxCannon(idx) {
    const ctx = this._audio();
    if (!ctx) return;
    const t   = ctx.currentTime;
    const vol = 0.18 + idx * 0.04;
    // Deep boom — 50 Hz sine
    this._beep(ctx, t,      50,  0.65, vol,        'sine');
    this._beep(ctx, t,      75,  0.45, vol * 0.7,  'sine');
    this._beep(ctx, t+.02, 100,  0.30, vol * 0.5,  'sine');
    // Noise burst — the percussive crack
    try {
      const bufLen = ctx.sampleRate * 0.22;
      const buf    = ctx.createBuffer(1, bufLen, ctx.sampleRate);
      const d      = buf.getChannelData(0);
      for (let i = 0; i < bufLen; i++) d[i] = (Math.random()*2-1)*(1-i/bufLen)**1.4;
      const src  = ctx.createBufferSource(); src.buffer = buf;
      const lp   = ctx.createBiquadFilter();
      lp.type    = 'lowpass'; lp.frequency.value = 320;
      const gN   = ctx.createGain();
      src.connect(lp); lp.connect(gN); gN.connect(ctx.destination);
      gN.gain.setValueAtTime(0.28 + idx * 0.05, t);
      gN.gain.exponentialRampToValueAtTime(0.0001, t + 0.28);
      src.start(t); src.stop(t + 0.3);
    } catch(e) {}
  }

  // Trumpet fanfare — 4 quick ascending notes (G4→B4→D5→G5)
  // Original melody — not from any real anthem
  _sfxTrumpet() {
    const ctx = this._audio();
    if (!ctx) return;
    const t    = ctx.currentTime;
    // G4=392, B4=493.9, D5=587.3, G5=784
    const notes = [[392, 0,    0.18, 0.14], [493.9, 0.2,  0.18, 0.14],
                   [587.3, 0.4, 0.22, 0.16], [784, 0.65, 0.6,  0.18]];
    notes.forEach(([f, off, dur, vol]) => {
      // Sawtooth for brass timbre
      this._beep(ctx, t + off, f,     dur, vol,        'sawtooth');
      // Octave below softly for warmth
      this._beep(ctx, t + off, f / 2, dur, vol * 0.3,  'sine');
    });
    // Final chord — held G major: G4 + B4 + D5
    this._beep(ctx, t + 1.3, 392,   1.2, 0.10, 'sawtooth');
    this._beep(ctx, t + 1.3, 493.9, 1.2, 0.10, 'sawtooth');
    this._beep(ctx, t + 1.3, 587.3, 1.2, 0.10, 'sawtooth');
  }

  // Synthesized anthem — original 8-note ascending melody
  // G4→A4→B4→D5→E5→F#5→G5→A5, then held chord
  // This melody is entirely original — not based on any real national anthem
  _sfxAnthem() {
    const ctx = this._audio();
    if (!ctx) return;
    const t = ctx.currentTime;

    // Melody line — slow and stately
    const melody = [
      [392.0, 0.0,  0.55, 0.08],  // G4
      [440.0, 0.6,  0.50, 0.09],  // A4
      [493.9, 1.1,  0.55, 0.10],  // B4
      [587.3, 1.7,  0.70, 0.11],  // D5
      [659.3, 2.45, 0.55, 0.12],  // E5
      [740.0, 3.05, 0.55, 0.12],  // F#5 (approx)
      [784.0, 3.65, 0.70, 0.13],  // G5
      [880.0, 4.4,  1.80, 0.14],  // A5 held
    ];
    melody.forEach(([f, off, dur, vol]) => {
      this._beep(ctx, t + off, f, dur, vol, 'sine');
      // Subtle vibrato via tiny square wave overtone
      this._beep(ctx, t + off, f * 2, dur * 0.8, vol * 0.12, 'sine');
    });

    // Bass pedal — G2 + D3 throughout
    this._beep(ctx, t,     196.0, 7.5, 0.10, 'sine');
    this._beep(ctx, t,     146.8, 7.5, 0.07, 'sine');

    // Harmony line — starts at measure 2, thirds above melody
    const harmony = [
      [493.9, 0.6,  0.5,  0.06],  // B4
      [587.3, 1.1,  0.55, 0.07],  // D5
      [659.3, 1.7,  0.70, 0.08],  // E5
      [784.0, 2.45, 0.55, 0.08],  // G5
      [880.0, 3.05, 0.55, 0.08],  // A5
      [987.8, 3.65, 0.70, 0.09],  // B5
      [1046.5,4.4,  1.80, 0.10],  // C6 held
    ];
    harmony.forEach(([f, off, dur, vol]) => {
      this._beep(ctx, t + off, f, dur, vol, 'sine');
    });

    // Final resolution chord — G major voiced: G3+B3+D4+G4
    [196.0, 246.9, 293.7, 392.0].forEach((f, i) => {
      this._beep(ctx, t + 6.3 + i * 0.06, f, 2.5, 0.09, 'sine');
    });
  }

  // Crowd cheer — formant-shaped bandpass noise
  _sfxCrowd() {
    const ctx = this._audio();
    if (!ctx) return;
    try {
      const bufLen = ctx.sampleRate * 3;
      const buf    = ctx.createBuffer(1, bufLen, ctx.sampleRate);
      const d      = buf.getChannelData(0);
      for (let i = 0; i < bufLen; i++) d[i] = Math.random() * 2 - 1;
      const src  = ctx.createBufferSource(); src.buffer = buf;
      // Formant filter around 800 Hz — voices
      const bp   = ctx.createBiquadFilter();
      bp.type    = 'bandpass'; bp.frequency.value = 800; bp.Q.value = 1.2;
      const hp   = ctx.createBiquadFilter();
      hp.type    = 'highpass'; hp.frequency.value = 300;
      const g    = ctx.createGain();
      src.connect(bp); bp.connect(hp); hp.connect(g); g.connect(ctx.destination);
      const t = ctx.currentTime;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.12, t + 0.3);
      g.gain.setValueAtTime(0.12, t + 1.8);
      g.gain.linearRampToValueAtTime(0, t + 3.2);
      src.start(t); src.stop(t + 3.5);
    } catch(e) {}
  }

  // Drum tick — one very faint drum tap per typewriter character
  _sfxDrumTick() {
    const ctx = this._audio();
    if (!ctx) return;
    const t = ctx.currentTime;
    // Short sine thud + noise click
    this._beep(ctx, t,       120, 0.06, 0.028, 'sine');
    try {
      const bufLen = Math.floor(ctx.sampleRate * 0.04);
      const buf    = ctx.createBuffer(1, bufLen, ctx.sampleRate);
      const d      = buf.getChannelData(0);
      for (let i = 0; i < bufLen; i++) d[i] = (Math.random()*2-1)*(1-i/bufLen)**2;
      const src  = ctx.createBufferSource(); src.buffer = buf;
      const gN   = ctx.createGain();
      src.connect(gN); gN.connect(ctx.destination);
      gN.gain.value = 0.035;
      src.start(t); src.stop(t + 0.05);
    } catch(e) {}
  }
}