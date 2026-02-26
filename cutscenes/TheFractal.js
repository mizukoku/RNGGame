// cutscenes/TheFractal.js
// ═══════════════════════════════════════════════════════════════
//  T H E   F R A C T A L  —  1 / 300,000
//  Hybrid: DOM/CSS geometry + SVG spiral + canvas rainbow engine
//  No audio — the equation speaks without sound.
//
//  Before physics, there was geometry.
//  Before geometry, there was the equation.
//  The equation has always been running.
//  You are one of its solutions.
//
//  Phase 0  (0ms)    : Void. A single point pulses at center.
//  Phase 1  (400ms)  : Perspective grid materialises
//  Phase 2  (1200ms) : 7 recursive squares — each 15° more, counter-spinning
//  Phase 3  (2200ms) : Golden ratio spiral — 8 SVG arcs (φ = 1.618)
//  Phase 4  (3400ms) : 64 fractal triangles erupt from center
//  Phase 5  (4600ms) : Concentric hexagons ripple outward
//  Phase 6  (5600ms) : Geometric COLLAPSE — everything scales to 0
//  Phase 7  (6200ms) : DETONATION — max shake, all fires back
//  Phase 8  (7000ms) : 160 prismatic diamond shards rain outward
//  Phase 9  (8000ms) : Möbius ring — CSS 3D perspective spin
//  Phase 10 (9000ms) : Canvas — full-spectrum rainbow rays + glow
//  Phase 11 (10000ms): T H E   F R A C T A L label, rainbow border
//  Phase 12 (11800ms): "ALL OF EXISTENCE IS AN EQUATION." typewriter
//  Phase 13 (17000ms): Void fades
//  Phase 14 (25000ms): Resolve
// ═══════════════════════════════════════════════════════════════

import { ParticleBurst, ContinuousParticles } from '../effects/ParticleBurst.js';
import { GlowOverlay, RayBurst }               from '../effects/GlowOverlay.js';

// ── Palette ───────────────────────────────────────────────────
const FT  = '#00ffcc';              // fractal teal
const FM  = '#ff00cc';              // fractal magenta
const FB  = '#003fff';              // fractal blue
const FW  = '#ffffff';              // pure white
const FK  = '#00050a';              // void black
const FY  = '#ffee00';              // golden yellow

const FT_GLOW = 'rgba(0,255,204,0.9)';
const FM_GLOW = 'rgba(255,0,204,0.85)';

// ── CSS ───────────────────────────────────────────────────────
const CSS = `
/* ── Void ── */
.tf-void {
  position:fixed;inset:0;
  background:radial-gradient(ellipse at 50% 50%,#000d14 0%,${FK} 60%,#000 100%);
  z-index:9990;pointer-events:none;
  opacity:1;transition:opacity 2.8s ease;
}
.tf-void--fade { opacity:0; }

/* Void center pulse — single mathematical point */
.tf-void::after {
  content:'';position:absolute;left:50%;top:50%;
  width:4px;height:4px;border-radius:50%;
  transform:translate(-50%,-50%);
  background:${FW};
  box-shadow:0 0 0 0 ${FW};
  animation:tfPointPulse 1.1s ease-in-out infinite;
}
@keyframes tfPointPulse {
  0%,100%{box-shadow:0 0 0 0 rgba(255,255,255,.9);transform:translate(-50%,-50%) scale(1)}
  50%    {box-shadow:0 0 0 14px rgba(255,255,255,0);transform:translate(-50%,-50%) scale(1.5)}
}

/* ── Phase 1: Perspective grid ── */
.tf-grid {
  position:fixed;inset:0;pointer-events:none;z-index:9991;
  animation:tfGridReveal 1.8s ease forwards;
}
@keyframes tfGridReveal {
  0%  {opacity:0}
  20% {opacity:1}
  80% {opacity:.7}
  100%{opacity:0}
}

.tf-grid svg { position:absolute;inset:0;width:100%;height:100%; }
.tf-grid line {
  stroke:rgba(0,255,204,.28);stroke-width:.8px;
  stroke-dasharray:1000;stroke-dashoffset:1000;
  animation:tfLineDraw var(--dur,.8s) ease-out forwards;
  animation-delay:var(--dly,0s);
}
@keyframes tfLineDraw { to{stroke-dashoffset:0} }

/* ── Phase 2: Recursive squares ── */
.tf-square {
  position:fixed;left:50%;top:50%;
  transform:translate(-50%,-50%) rotate(var(--rot));
  pointer-events:none;z-index:9992;
  border:1px solid var(--sc);
  box-shadow:0 0 var(--sglow) var(--sc);
  animation:tfSquareReveal .6s ease forwards,
            tfSquareSpin var(--spd) linear infinite;
}
@keyframes tfSquareReveal {
  0%  {opacity:0;transform:translate(-50%,-50%) rotate(var(--rot)) scale(.1)}
  100%{opacity:1;transform:translate(-50%,-50%) rotate(var(--rot)) scale(1)}
}
@keyframes tfSquareSpin {
  from{transform:translate(-50%,-50%) rotate(var(--rot))}
  to  {transform:translate(-50%,-50%) rotate(calc(var(--rot) + var(--dir,360deg)))}
}

/* ── Phase 3: Golden spiral (SVG paths) ── */
.tf-spiral-layer {
  position:fixed;inset:0;pointer-events:none;z-index:9993;
  animation:tfSpiralReveal 4s ease forwards;
}
@keyframes tfSpiralReveal {
  0%  {opacity:0} 8%{opacity:1} 78%{opacity:.9} 100%{opacity:0}
}
.tf-spiral-layer svg { position:absolute;inset:0;width:100%;height:100%; }
.tf-spiral-arc {
  fill:none;
  stroke-width:1.5px;
  stroke-dasharray:2000;stroke-dashoffset:2000;
  animation:tfArcDraw var(--dur,1.2s) ease-out forwards;
  animation-delay:var(--dly,0s);
}
@keyframes tfArcDraw { to{stroke-dashoffset:0} }

/* ── Phase 4: Fractal triangles ── */
.tf-tri {
  position:fixed;left:50vw;top:50vh;
  width:0;height:0;
  border-left:var(--ts) solid transparent;
  border-right:var(--ts) solid transparent;
  border-bottom:var(--th) solid var(--tc);
  pointer-events:none;z-index:9994;
  filter:drop-shadow(0 0 4px var(--tc));
  animation:tfTriErupt var(--tdur) ease-out forwards;
}
@keyframes tfTriErupt {
  0%  {opacity:1;transform:translate(-50%,-50%) rotate(var(--ta)) translateX(0) scale(1)}
  70% {opacity:.8}
  100%{opacity:0;transform:translate(-50%,-50%) rotate(var(--ta)) translateX(var(--tr)) scale(.2)}
}

/* ── Phase 5: Hexagon rings ── */
.tf-hex {
  position:fixed;left:50%;top:50%;
  transform:translate(-50%,-50%);
  pointer-events:none;z-index:9992;
  animation:tfHexPulse var(--hdur) ease-out forwards;
}
@keyframes tfHexPulse {
  0%  {opacity:1;transform:translate(-50%,-50%) scale(0)}
  60% {opacity:.8}
  100%{opacity:0;transform:translate(-50%,-50%) scale(1)}
}
.tf-hex svg { display:block; }
.tf-hex polygon {
  fill:none;stroke:var(--hc);stroke-width:1.5px;
  filter:drop-shadow(0 0 5px var(--hc));
}

/* ── Phase 6: Collapse overlay ── */
.tf-collapse {
  position:fixed;inset:0;pointer-events:none;z-index:9999;
  background:radial-gradient(circle,rgba(0,255,204,.18) 0%,rgba(255,0,204,.12) 40%,transparent 70%);
  animation:tfCollapseFlash .5s ease forwards;
}
@keyframes tfCollapseFlash {
  0%  {opacity:0;transform:scale(2)}
  30% {opacity:1;transform:scale(1)}
  100%{opacity:0;transform:scale(.5)}
}

/* ── Phase 7: Detonation flash ── */
.tf-detonate {
  position:fixed;inset:0;pointer-events:none;z-index:10003;
  background:${FW};
  animation:tfDetonateFlash .45s ease-out forwards;
}
@keyframes tfDetonateFlash {
  0%  {opacity:1}
  100%{opacity:0}
}

/* Chromatic fringe at detonation */
.tf-chroma {
  position:fixed;inset:0;pointer-events:none;z-index:10004;
  mix-blend-mode:screen;
  background:
    radial-gradient(circle at 48.5% 50%,rgba(255,0,0,.14) 0%,transparent 55%),
    radial-gradient(circle at 51.5% 50%,rgba(0,0,255,.14) 0%,transparent 55%),
    radial-gradient(circle at 50% 48.5%,rgba(0,255,0,.08) 0%,transparent 50%);
  animation:tfChroma .7s ease-out forwards;
}
@keyframes tfChroma {
  0%  {opacity:0;transform:scale(.9)}
  25% {opacity:1}
  100%{opacity:0;transform:scale(1.25)}
}

/* ── Phase 8: Prismatic diamond shards ── */
.tf-shard {
  position:fixed;left:50vw;top:50vh;
  pointer-events:none;z-index:9995;
  clip-path:polygon(50% 0%,100% 50%,50% 100%,0% 50%);
  animation:tfShardFly var(--fdur) ease-out forwards;
}
@keyframes tfShardFly {
  0%  {opacity:1;transform:translate(-50%,-50%) rotate(var(--fa)) translateX(0) scale(1.2)}
  70% {opacity:.85}
  100%{opacity:0;transform:translate(-50%,-50%) rotate(var(--fa)) translateX(var(--fr)) scale(.1)}
}

/* ── Phase 9: Möbius ring ── */
.tf-mobius-wrap {
  position:fixed;left:50%;top:50%;
  transform:translate(-50%,-50%);
  pointer-events:none;z-index:9996;
  perspective:600px;
  width:280px;height:280px;
  animation:tfMobiusReveal 5s ease forwards;
}
@keyframes tfMobiusReveal {
  0%  {opacity:0} 12%{opacity:1} 82%{opacity:1} 100%{opacity:0}
}

.tf-mobius-ring {
  position:absolute;inset:0;border-radius:50%;
  border:6px solid transparent;
  background:
    linear-gradient(${FK},${FK}) padding-box,
    conic-gradient(
      ${FT} 0deg,${FM} 90deg,${FB} 180deg,${FY} 270deg,${FT} 360deg
    ) border-box;
  box-shadow:
    0 0 22px ${FT_GLOW},
    0 0 55px ${FM_GLOW},
    inset 0 0 22px rgba(0,255,204,.15);
  animation:tfMobiusSpin 2.8s linear infinite;
  transform-style:preserve-3d;
}
@keyframes tfMobiusSpin {
  from{transform:rotateX(72deg) rotateY(0deg)}
  to  {transform:rotateX(72deg) rotateY(360deg)}
}

/* Second ring, offset */
.tf-mobius-ring-2 {
  position:absolute;inset:24px;border-radius:50%;
  border:4px solid transparent;
  background:
    linear-gradient(${FK},${FK}) padding-box,
    conic-gradient(
      ${FM} 0deg,${FY} 90deg,${FT} 180deg,${FB} 270deg,${FM} 360deg
    ) border-box;
  box-shadow:0 0 14px ${FM_GLOW},0 0 35px rgba(255,0,204,.3);
  animation:tfMobiusSpin2 4.2s linear infinite reverse;
  transform-style:preserve-3d;
}
@keyframes tfMobiusSpin2 {
  from{transform:rotateX(55deg) rotateY(0deg)}
  to  {transform:rotateX(55deg) rotateY(360deg)}
}

/* ── Phase 11: Label ── */
.tf-label {
  position:fixed;left:50%;top:50%;
  transform:translate(-50%,-50%);
  pointer-events:none;z-index:10012;
  display:flex;flex-direction:column;align-items:center;gap:14px;
  animation:tfLabelReveal 9s ease forwards;
}
@keyframes tfLabelReveal {
  0%  {opacity:0;transform:translate(-50%,-50%) scale(.5);filter:blur(20px)}
  8%  {opacity:1;transform:translate(-50%,-50%) scale(1.03);filter:blur(0)}
  13% {transform:translate(-50%,-50%) scale(1)}
  82% {opacity:1}
  100%{opacity:0;transform:translate(-50%,-50%) scale(1.03)}
}

.tf-label-main {
  font-family:'Courier New',monospace;
  font-size:38px;font-weight:700;letter-spacing:14px;
  color:${FT};
  text-shadow:
    0 0 8px ${FT},0 0 22px ${FT},
    0 0 60px rgba(0,255,204,.6),0 0 140px rgba(0,255,204,.3);
  border:2px solid ${FT};
  padding:18px 50px;
  background:rgba(0,5,10,.97);
  box-shadow:
    0 0 0 1px ${FK},
    0 0 40px rgba(0,255,204,.4),
    0 0 90px rgba(0,255,204,.2),
    inset 0 0 35px rgba(0,255,204,.06);
  /* Hue-rotate cycles the entire color through the spectrum */
  animation:tfLabelHue 2.2s linear infinite;
}
@keyframes tfLabelHue {
  from{filter:hue-rotate(0deg)}
  to  {filter:hue-rotate(360deg)}
}

.tf-label-sub {
  font-family:'Courier New',monospace;
  font-size:9px;letter-spacing:5px;
  color:rgba(0,255,204,.45);
  text-shadow:0 0 8px rgba(0,255,204,.3);
  animation:tfLabelHue 2.2s linear infinite;
}

/* ── Phase 12: Typewriter ── */
.tf-typewriter {
  position:fixed;left:50%;top:calc(50% + 86px);
  transform:translateX(-50%);
  pointer-events:none;z-index:10013;
  font-family:'Courier New',monospace;
  font-size:14px;letter-spacing:6px;
  color:rgba(0,255,204,.8);
  text-shadow:0 0 10px rgba(0,255,204,.5);
  white-space:nowrap;
  animation:tfTypeReveal 8s ease forwards;
}
@keyframes tfTypeReveal {
  0%{opacity:0} 5%{opacity:1} 83%{opacity:1} 100%{opacity:0}
}
.tf-cursor {
  display:inline-block;width:8px;height:1em;
  background:${FT};margin-left:2px;vertical-align:middle;
  box-shadow:0 0 6px ${FT};
  animation:tfCursorBlink .5s step-end infinite;
}
@keyframes tfCursorBlink { 0%,100%{opacity:1} 50%{opacity:0} }

/* ── Body shakes ── */
@keyframes tfBodyShake {
  0%,100%{transform:translate(0,0)}
  10%{transform:translate(-8px,9px)} 22%{transform:translate(8px,-8px)}
  34%{transform:translate(-10px,7px)} 46%{transform:translate(9px,-9px)}
  58%{transform:translate(-7px,8px)} 70%{transform:translate(7px,-7px)}
  82%{transform:translate(-5px,5px)} 92%{transform:translate(4px,-4px)}
}
body.tf-shake { animation:tfBodyShake .65s ease-out; }

@keyframes tfBodyDetonate {
  0%,100%{transform:translate(0,0) rotate(0deg)}
  5%{transform:translate(-20px,24px) rotate(-.9deg)}
  14%{transform:translate(20px,-23px) rotate(.8deg)}
  23%{transform:translate(-22px,20px) rotate(-.7deg)}
  32%{transform:translate(20px,-22px) rotate(.7deg)}
  41%{transform:translate(-17px,19px) rotate(-.5deg)}
  50%{transform:translate(15px,-17px) rotate(.4deg)}
  60%{transform:translate(-12px,15px) rotate(-.3deg)}
  70%{transform:translate(10px,-12px) rotate(.2deg)}
  80%{transform:translate(-8px,9px)   rotate(-.1deg)}
  90%{transform:translate(6px,-7px)}
}
body.tf-detonate-shake { animation:tfBodyDetonate 1.4s ease-out; }
`;

function injectCSS() {
  if (document.getElementById('tf-styles')) return;
  const s = document.createElement('style');
  s.id = 'tf-styles';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function mk(cls) { const el = document.createElement('div'); el.className = cls; return el; }

let _spawned = [];
function spawn(el)    { _spawned.push(el); document.body.appendChild(el); return el; }
function killSpawned(){ _spawned.forEach(e => e.remove()); _spawned = []; }
function rnd(lo, hi) { return lo + Math.random() * (hi - lo); }

// ══════════════════════════════════════════════════════════════
export class TheFractal {
  constructor(engine, rarity) {
    this.engine   = engine;
    this.rarity   = rarity;
    this.stopped  = false;
    this._timers  = [];
    this.fx = {
      shakeIntensity: 80,
      particleCount:  280,
      rayCount:       60,
      glowMaxAlpha:   0.92,
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

      // ── Phase 0: Void ────────────────────────────────────────
      const voidEl = spawn(mk('tf-void'));
      this._after(17000, () => voidEl.classList.add('tf-void--fade'));
      this._after(19800, () => voidEl.remove());

      // ── Phase 1: Perspective grid ────────────────────────────
      this._after(400, () => this._spawnGrid());

      // ── Phase 2: Recursive squares ───────────────────────────
      this._after(1200, () => this._spawnSquares(7));

      // ── Phase 3: Golden ratio spiral ─────────────────────────
      this._after(2200, () => this._spawnSpiral(8));

      // ── Phase 4: Fractal triangles ───────────────────────────
      this._after(3400, () => this._spawnTriangles(64));

      // ── Phase 5: Hexagon ripples ─────────────────────────────
      this._after(4600, () => this._spawnHexRipples(10));

      // ── Phase 6: Geometric collapse ──────────────────────────
      this._after(5600, () => {
        const col = spawn(mk('tf-collapse'));
        this._after(600, () => col.remove());
        document.body.classList.add('tf-shake');
        this._after(700, () => document.body.classList.remove('tf-shake'));
        this.engine.shake(this.fx.shakeIntensity * 0.4);
      });

      // ── Phase 7: Detonation ───────────────────────────────────
      this._after(6200, () => {
        const det = spawn(mk('tf-detonate'));
        const chr = spawn(mk('tf-chroma'));
        this._after(500,  () => det.remove());
        this._after(800,  () => chr.remove());
        document.body.classList.add('tf-detonate-shake');
        this._after(1450, () => document.body.classList.remove('tf-detonate-shake'));
        this.engine.shake(this.fx.shakeIntensity);
      });

      // ── Phase 8: Prismatic shard rain ─────────────────────────
      this._after(7000, () => this._spawnShards(160));

      // ── Phase 9: Möbius ring ──────────────────────────────────
      this._after(8000, () => this._spawnMobius());

      // ── Phase 10: Canvas — rainbow spectrum ───────────────────
      this._after(9000, () => {
        // Full-spectrum ray burst — cycle through hues via hue-rotate
        const spectrumColors = [FT, FM, FB, FY, '#ff6600', '#00ff66'];
        spectrumColors.forEach((col, i) => {
          this._after(i * 100, () => {
            this.engine.addEffect(new RayBurst({
              color:    col,
              duration: 14000,
              maxAlpha: 0.18 - i * 0.02,
              rayCount: Math.floor(this.fx.rayCount * (1 - i * 0.1)),
              rotSpeed: i % 2 === 0 ? 0.5 + i * 0.15 : -(0.4 + i * 0.12),
            }));
          });
        });

        // Two glow layers — teal and magenta
        this.engine.addEffect(new GlowOverlay({
          color: FT_GLOW, duration: 14000, maxAlpha: this.fx.glowMaxAlpha,
          fadeIn: 0.05, fadeOut: 0.2, radial: true, pulseSpeed: 1.8,
        }));
        this.engine.addEffect(new GlowOverlay({
          color: FM_GLOW, duration: 12000, maxAlpha: 0.5,
          fadeIn: 0.07, fadeOut: 0.3, radial: true, pulseSpeed: 2.4,
        }));

        // Three particle bursts — teal, magenta, white
        [[FT, 1.0], [FM, 0.8], [FW, 0.6]].forEach(([col, scale], i) => {
          this._after(i * 140, () => {
            this.engine.addEffect(new ParticleBurst(0.5, 0.5, {
              count:    Math.floor(this.fx.particleCount * scale),
              color:    col,
              minSpeed: 100 + i * 80,
              maxSpeed: 480 + i * 60,
              minSize:  2,
              maxSize:  9,
              gravity:  30,
              trail:    true,
              glow:     true,
              duration: 12000,
              type:     'star',
            }));
          });
        });

        // Continuous fractal dust rising
        this.engine.addEffect(new ContinuousParticles({
          ox: 0.5, oy: 0.5,
          color:     FT,
          minSpeed:  60,  maxSpeed: 220,
          gravity:   -80, upBias:   160,
          spread:    Math.PI * 2,
          angle:     -Math.PI / 2,
          minSize:   1,   maxSize:  5,
          trail:     true, glow:    true,
          spawnRate: 0.035,
          duration:  13000,
          type:      'star',
        }));

        // Magenta counter-stream outward horizontal
        this.engine.addEffect(new ContinuousParticles({
          ox: w => rnd(0.1, 0.9) * w,
          oy: h => rnd(0.1, 0.9) * h,
          color:     FM,
          minSpeed:  40,  maxSpeed: 160,
          gravity:   0,
          spread:    Math.PI * 2,
          angle:     0,
          minSize:   1,   maxSize:  4,
          trail:     false, glow:   true,
          spawnRate: 0.02,
          duration:  10000,
          type:      'spark',
        }));
      });

      // ── Phase 11: Label ───────────────────────────────────────
      this._after(10000, () => {
        this._spawnLabel();
        // Aura rings — rainbow cycling
        const auraColors = [FT, FM, FB, FY, FW, FT, FM, FT];
        for (let i = 0; i < this.fx.auraCount; i++) {
          this._after(i * 200, () => {
            const aura = spawn(mk('tf-hex'));
            const sz   = 80 + i * 70;
            const col  = auraColors[i % auraColors.length];
            // Use a div ring for aura (simpler than SVG hex here)
            aura.style.cssText = `
              position:fixed;left:50%;top:50%;
              width:${sz}px;height:${sz}px;
              border-radius:50%;
              border:2px solid ${col};
              transform:translate(-50%,-50%);
              box-shadow:0 0 ${18+i*10}px ${col},0 0 ${45+i*20}px rgba(0,255,204,${.4-i*.04});
              z-index:9996;pointer-events:none;
              animation:tfHexPulse ${1.6+i*.24}s ease-out forwards;
              --hdur:${1.6+i*.24}s;--hc:${col};
            `;
            this._after(3200, () => aura.remove());
          });
        }
      });

      // ── Phase 12: Typewriter ──────────────────────────────────
      this._after(11800, () => this._spawnTypewriter());

      // ── Phase 14: Resolve ─────────────────────────────────────
      this._after(25000, () => {
        killSpawned();
        resolve();
      });
    });
  }

  stop() {
    this.stopped = true;
    this._timers.forEach(clearTimeout);
    this._timers = [];
    document.body.classList.remove('tf-shake', 'tf-detonate-shake');
    killSpawned();
  }

  // ── Perspective grid (SVG lines converging to vanishing point) ─
  _spawnGrid() {
    const layer = spawn(mk('tf-grid'));
    const svg   = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';

    const cx = 50, cy = 50;
    let lineIdx = 0;

    // Horizontal lines converging
    for (let i = 0; i <= 12; i++) {
      const t = i / 12;
      // Perspective: lines bunch near horizon, spread near bottom
      const y0 = 50 - (50 * (1 - t) * 0.9);
      const y1 = 50 + (50 * t * 0.9);
      const xLeft  = cx - (50 * t);
      const xRight = cx + (50 * t);

      // Top half line
      const l1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      l1.setAttribute('x1', cx); l1.setAttribute('y1', cy);
      l1.setAttribute('x2', xLeft); l1.setAttribute('y2', y0);
      l1.style.setProperty('--dur', `${0.4 + lineIdx * 0.05}s`);
      l1.style.setProperty('--dly', `${lineIdx * 0.04}s`);
      svg.appendChild(l1); lineIdx++;

      // Bottom half line
      const l2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      l2.setAttribute('x1', cx); l2.setAttribute('y1', cy);
      l2.setAttribute('x2', xRight); l2.setAttribute('y2', y1);
      l2.style.setProperty('--dur', `${0.4 + lineIdx * 0.05}s`);
      l2.style.setProperty('--dly', `${lineIdx * 0.04}s`);
      svg.appendChild(l2); lineIdx++;
    }

    // Vertical lines converging to center
    for (let i = 0; i <= 10; i++) {
      const t = i / 10;
      const x = t * 100;
      const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      l.setAttribute('x1', x); l.setAttribute('y1', 0);
      l.setAttribute('x2', cx); l.setAttribute('y2', cy);
      l.style.setProperty('--dur', `${0.5 + i * 0.06}s`);
      l.style.setProperty('--dly', `${0.3 + i * 0.03}s`);
      svg.appendChild(l);

      // Bottom half
      const l2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      l2.setAttribute('x1', x); l2.setAttribute('y1', 100);
      l2.setAttribute('x2', cx); l2.setAttribute('y2', cy);
      l2.style.setProperty('--dur', `${0.5 + i * 0.06}s`);
      l2.style.setProperty('--dly', `${0.45 + i * 0.03}s`);
      svg.appendChild(l2);
    }

    layer.appendChild(svg);
    this._after(2200, () => layer.remove());
  }

  // ── 7 recursive squares, each 15° more, counter-spinning ─────
  _spawnSquares(count) {
    const colors = [FT, FM, FB, FY, FT, FM, FW];
    const baseSz = 38; // vmin
    for (let i = 0; i < count; i++) {
      const sq    = spawn(mk('tf-square'));
      const sz    = baseSz - i * 3.5;
      const rot   = i * 15;
      const col   = colors[i % colors.length];
      const spd   = 8 + i * 1.5;
      const dir   = i % 2 === 0 ? '360deg' : '-360deg';
      const glow  = Math.max(2, 10 - i);
      sq.style.cssText = `
        width:${sz}vmin;height:${sz}vmin;
        --rot:${rot}deg;--sc:${col};
        --sglow:${glow}px;
        --spd:${spd}s;--dir:${dir};
        animation-delay:${i * 80}ms,${i * 80}ms;
      `;
      this._after(5200, () => sq.style.transition = 'transform 0.5s ease, opacity 0.5s ease');
      this._after(5600, () => { sq.style.transform = 'translate(-50%,-50%) scale(0)'; sq.style.opacity = '0'; });
      this._after(6400, () => sq.remove());
    }
  }

  // ── Golden ratio spiral — 8 SVG quarter-circle arcs ──────────
  _spawnSpiral(count) {
    const layer = spawn(mk('tf-spiral-layer'));
    const svg   = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';

    const PHI = 1.6180339887;
    const colors = [FT, FM, FB, FY, FT, FM, FW, FT];
    // Start from center, each arc sweeps a quarter circle
    let r   = 2;
    let cx  = 50, cy = 50;
    const offsets = [
      [0,  0, 0,   90 ],  // right → down
      [0,  1, 90,  180],  // down → left
      [-1, 1, 180, 270],  // left → up
      [-1, 0, 270, 360],  // up → right
    ];

    for (let i = 0; i < count; i++) {
      const [ox, oy, startDeg, endDeg] = offsets[i % 4];
      const start = startDeg * Math.PI / 180;
      const end   = endDeg   * Math.PI / 180;
      const x1    = cx + r * Math.cos(start);
      const y1    = cy + r * Math.sin(start);
      const x2    = cx + r * Math.cos(end);
      const y2    = cy + r * Math.sin(end);
      const sweep = endDeg > startDeg ? 1 : 0;

      const arc = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      arc.className.baseVal = 'tf-spiral-arc';
      arc.setAttribute('d', `M ${x1} ${y1} A ${r} ${r} 0 0 ${sweep} ${x2} ${y2}`);
      arc.style.stroke = colors[i % colors.length];
      arc.style.filter = `drop-shadow(0 0 3px ${colors[i % colors.length]})`;
      arc.style.setProperty('--dur', `${0.6 + i * 0.18}s`);
      arc.style.setProperty('--dly', `${i * 0.12}s`);
      svg.appendChild(arc);

      // Advance pivot for next arc
      cx += ox * r;
      cy += oy * r;
      r  *= PHI;
    }

    layer.appendChild(svg);
    this._after(5500, () => layer.remove());
  }

  // ── 64 fractal triangles erupting from center ─────────────────
  _spawnTriangles(count) {
    const colors = [FT, FM, FB, FY, FW];
    for (let i = 0; i < count; i++) {
      this._after(i * 18, () => {
        const tri  = spawn(mk('tf-tri'));
        const ang  = (360 / count) * i + rnd(-4, 4);
        const sz   = rnd(3, 14);
        const dist = rnd(15, 55);
        const dur  = rnd(0.7, 1.5);
        const col  = colors[i % colors.length];
        tri.style.setProperty('--ta',   ang + 'deg');
        tri.style.setProperty('--tr',   dist + 'vmin');
        tri.style.setProperty('--tc',   col);
        tri.style.setProperty('--ts',   sz + 'px');
        tri.style.setProperty('--th',   sz * 1.73 + 'px');
        tri.style.setProperty('--tdur', dur + 's');
        this._after((dur + 0.4) * 1000 + i * 18, () => tri.remove());
      });
    }
  }

  // ── Concentric hexagon rings rippling outward ─────────────────
  _spawnHexRipples(count) {
    const colors = [FT, FM, FB, FY, FW, FT, FM, FB, FY, FW];
    for (let i = 0; i < count; i++) {
      this._after(i * 120, () => {
        const hex = spawn(mk('tf-hex'));
        const sz  = 40 + i * 55;   // px
        const col = colors[i % colors.length];
        const dur = 0.9 + i * 0.12;

        // Build hexagon SVG
        const svgEl = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgEl.setAttribute('width', sz + 'px');
        svgEl.setAttribute('height', sz + 'px');
        svgEl.setAttribute('viewBox', `0 0 ${sz} ${sz}`);

        // Hexagon points
        const cx2 = sz / 2, cy2 = sz / 2, r2 = sz / 2 - 2;
        const pts = Array.from({length: 6}, (_, k) => {
          const a = (Math.PI / 3) * k - Math.PI / 6;
          return `${(cx2 + r2 * Math.cos(a)).toFixed(1)},${(cy2 + r2 * Math.sin(a)).toFixed(1)}`;
        }).join(' ');
        const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        poly.setAttribute('points', pts);
        poly.style.stroke = col;
        svgEl.appendChild(poly);

        hex.appendChild(svgEl);
        hex.style.setProperty('--hdur', dur + 's');
        hex.style.setProperty('--hc',   col);
        hex.style.animationDuration = dur + 's';
        hex.style.animationDelay    = i * 0.12 + 's';
        this._after((dur + 0.3) * 1000 + i * 120, () => hex.remove());
      });
    }
  }

  // ── 160 prismatic diamond shards ─────────────────────────────
  _spawnShards(count) {
    const colors = [FT, FM, FB, FY, FW];
    for (let i = 0; i < count; i++) {
      this._after(i * 8, () => {
        const shard = spawn(mk('tf-shard'));
        const sz    = rnd(4, 14);
        const ang   = rnd(0, 360);
        const dist  = rnd(20, 60);
        const dur   = rnd(0.65, 1.4);
        const col   = colors[i % colors.length];
        shard.style.cssText = `
          width:${sz}px;height:${sz}px;
          background:${col};
          box-shadow:0 0 ${sz}px ${col};
          animation-duration:${dur}s;
          animation-delay:${i*8}ms;
        `;
        shard.style.setProperty('--fa', ang + 'deg');
        shard.style.setProperty('--fr', dist + 'vmin');
        this._after((dur + 0.3) * 1000 + i * 8, () => shard.remove());
      });
    }
  }

  // ── Möbius ring — CSS 3D perspective ─────────────────────────
  _spawnMobius() {
    const wrap  = spawn(mk('tf-mobius-wrap'));
    const ring1 = document.createElement('div');
    ring1.className = 'tf-mobius-ring';
    const ring2 = document.createElement('div');
    ring2.className = 'tf-mobius-ring-2';
    wrap.appendChild(ring1);
    wrap.appendChild(ring2);
    this._after(5500, () => wrap.remove());
  }

  // ── T H E   F R A C T A L label ─────────────────────────────
  _spawnLabel() {
    const label = spawn(mk('tf-label'));
    const main  = document.createElement('div');
    main.className   = 'tf-label-main';
    main.textContent = 'T H E   F R A C T A L';
    const sub   = document.createElement('div');
    sub.className    = 'tf-label-sub';
    sub.textContent  = '1 / 300,000  ·  YOU ARE ONE OF ITS SOLUTIONS';
    label.appendChild(main);
    label.appendChild(sub);
    this._after(8800, () => label.remove());
  }

  // ── "ALL OF EXISTENCE IS AN EQUATION." typewriter ────────────
  _spawnTypewriter() {
    const el   = spawn(mk('tf-typewriter'));
    const TEXT = 'ALL OF EXISTENCE IS AN EQUATION.';
    const cur  = document.createElement('span');
    cur.className = 'tf-cursor';
    el.appendChild(cur);
    let idx = 0;
    const type = () => {
      if (this.stopped || !el.isConnected) return;
      if (idx < TEXT.length) {
        el.insertBefore(document.createTextNode(TEXT[idx]), cur);
        idx++;
        // No sound — silence is part of the concept
        const delay = 75 + (TEXT[idx-1] === ' ' ? 120 : 0) + (Math.random() > .92 ? 180 : 0);
        this._timers.push(setTimeout(type, delay));
      } else {
        this._after(2600, () => cur.remove());
      }
    };
    this._timers.push(setTimeout(type, 300));
    this._after(7500, () => el.remove());
  }
}