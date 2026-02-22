// cutscenes/Matrix.js
// ═══════════════════════════════════════════════════════════════
//  M A T R I X  —  1 / 25,000
//  Hybrid: DOM/CSS + canvas particle engine
//
//  Reality is code. The system found you.
//  There is no going back.
//
//  Phase 0  (0ms)    : Black void
//  Phase 1  (200ms)  : 40 code rain columns begin falling
//  Phase 2  (900ms)  : Screen glitch — RGB split corruption
//  Phase 3  (1300ms) : Binary flood from all four edges
//  Phase 4  (1800ms) : Typewriter reveal — 4 lines, char by char
//  Phase 5  (3800ms) : System breach scan lines sweep
//  Phase 6  (4200ms) : Heavy Katakana cascade — 80 streams
//  Phase 7  (4800ms) : Digital particle explosion from center
//  Phase 8  (5300ms) : SYSTEM OVERRIDE — green radial nova
//  Phase 9  (5700ms) : Grid overlay + 3 hex rings rotating
//  Phase 10 (6200ms) : Canvas — green ray bursts, particle storm
//  Phase 11 (6800ms) : M A T R I X label + scanlines + text
//  Phase 12 (13s)    : Resolve
// ═══════════════════════════════════════════════════════════════

import { ParticleBurst, ContinuousParticles } from '../effects/ParticleBurst.js';
import { GlowOverlay, RayBurst }               from '../effects/GlowOverlay.js';

// ── Matrix palette ────────────────────────────────────────────
const G1 = '#00ff41';   // bright matrix green
const G2 = '#00cc33';   // mid green
const G3 = '#008f11';   // dark green
const G_GLOW = 'rgba(0,255,65,0.9)';

// Katakana half-width + ASCII mix — the authentic Matrix charset
const KATA = 'ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789ABCDEFZ@#$%&';
const BIN  = '01';

// The typewriter message — 4 lines building dread
const LINES = [
  'REALITY IS AN ILLUSION',
  'THE CODE HAS ALWAYS BEEN THERE',
  "YOU JUST COULDN'T SEE IT",
  'UNTIL NOW',
];

// ── CSS injected once ─────────────────────────────────────────
const CSS = `
/* ── Phase 0: Black void ── */
.mx-void {
  position:fixed;inset:0;background:#000;
  z-index:9990;pointer-events:none;
  opacity:1;
  transition:opacity 1.4s ease;
}
/* JS sets .mx-void--fade to trigger the fade-out at the right moment */
.mx-void--fade { opacity:0; pointer-events:none; }

/* ── Phase 1: Code rain columns ── */
.mx-col {
  position:fixed;top:-100%;
  font-family:'Courier New',monospace;
  font-size:15px;line-height:19px;
  color:${G1};text-shadow:0 0 6px ${G1},0 0 12px ${G2};
  white-space:pre;z-index:9991;pointer-events:none;
  animation:mxColFall linear forwards;
}
/* Head character — bright white-green */
.mx-col::first-line {
  color:#fff;text-shadow:0 0 10px ${G1},0 0 20px #fff;
}
@keyframes mxColFall {
  0%  {opacity:.95}
  85% {opacity:.8}
  100%{top:110%;opacity:0}
}

/* ── Phase 2: Glitch ── */
.mx-glitch {
  position:fixed;inset:0;z-index:9997;pointer-events:none;
  animation:mxGlitch .45s steps(9) forwards;
}
@keyframes mxGlitch {
  0%  {opacity:0;transform:translate(0,0)}
  11% {opacity:1;transform:translate(-6px,2px);background:rgba(0,255,65,.08)}
  22% {opacity:0;transform:translate(5px,-3px)}
  33% {opacity:.9;transform:translate(-4px,4px);background:rgba(255,0,100,.06)}
  44% {opacity:0;transform:translate(3px,-2px)}
  55% {opacity:.7;transform:translate(-2px,3px);background:rgba(0,100,255,.05)}
  66% {opacity:0;transform:translate(2px,-1px)}
  77% {opacity:.5;transform:translate(-1px,2px)}
  100%{opacity:0;transform:translate(0,0)}
}

/* RGB channel split overlay */
.mx-glitch-r {
  position:fixed;inset:0;z-index:9996;pointer-events:none;
  mix-blend-mode:screen;
  animation:mxGlitchR .4s steps(5) forwards;
}
@keyframes mxGlitchR {
  0%  {background:transparent}
  20% {background:rgba(255,0,0,.07);transform:translate(-4px,0)}
  40% {background:transparent}
  60% {background:rgba(0,0,255,.07);transform:translate(4px,0)}
  80% {background:transparent}
  100%{background:transparent}
}

/* ── Phase 3: Binary flood ── */
.mx-binary {
  position:fixed;font-family:'Courier New',monospace;
  font-size:11px;color:${G2};text-shadow:0 0 4px ${G2};
  z-index:9992;pointer-events:none;white-space:nowrap;
  animation:mxBinaryFlood ease-out forwards;
}
@keyframes mxBinaryFlood {
  0%  {opacity:0;transform:scale(.4)}
  40% {opacity:.9;transform:scale(1.15)}
  100%{opacity:0;transform:scale(1.6)}
}

/* ── Phase 4: Typewriter container ── */
.mx-typewriter {
  position:fixed;left:50%;top:50%;
  transform:translate(-50%,-50%);
  z-index:9999;pointer-events:none;
  display:flex;flex-direction:column;align-items:flex-start;gap:10px;
  /* fade in container */
  animation:mxTwIn .3s ease forwards;
}
@keyframes mxTwIn { from{opacity:0} to{opacity:1} }

.mx-tw-line {
  font-family:'Courier New',monospace;
  font-size:20px;font-weight:700;
  color:${G1};letter-spacing:3px;
  text-shadow:0 0 8px ${G1},0 0 20px ${G2};
  white-space:nowrap;
  /* lines fade in as JS types them */
}
/* The final "UNTIL NOW" line is bigger */
.mx-tw-line--final {
  font-size:36px;letter-spacing:6px;color:#fff;
  text-shadow:
    0 0 12px ${G1},0 0 30px ${G1},
    0 0 60px ${G2},0 0 120px ${G3};
  animation:mxFinalPulse .5s ease-in-out infinite alternate;
}
@keyframes mxFinalPulse {
  from{text-shadow:0 0 12px ${G1},0 0 30px ${G1},0 0 60px ${G2};}
  to  {text-shadow:0 0 20px #fff,0 0 50px ${G1},0 0 100px ${G2},0 0 180px ${G3};}
}
/* Blinking cursor */
.mx-cursor {
  display:inline-block;width:2px;height:1.1em;
  background:${G1};margin-left:3px;vertical-align:middle;
  animation:mxCursorBlink .65s step-end infinite;
}
@keyframes mxCursorBlink { 0%,100%{opacity:1} 50%{opacity:0} }

/* "UNTIL NOW" flash burst */
.mx-final-flash {
  position:fixed;inset:0;z-index:10009;pointer-events:none;
  background:radial-gradient(ellipse at 50% 50%,
    rgba(0,255,65,.45) 0%,rgba(0,200,50,.2) 35%,transparent 65%);
  animation:mxFinalFlash .6s ease-out forwards;
}
@keyframes mxFinalFlash {
  0%  {opacity:0}
  12% {opacity:1}
  100%{opacity:0}
}

/* ── Phase 5: Breach scan lines ── */
.mx-breach {
  position:fixed;height:2px;pointer-events:none;z-index:9993;
  background:linear-gradient(90deg,transparent 0%,${G1} 50%,transparent 100%);
  box-shadow:0 0 10px ${G1},0 0 20px ${G2};
  animation:mxBreachScan ease-out forwards;
}
@keyframes mxBreachScan {
  0%  {width:0;opacity:1;left:50%}
  100%{width:100%;opacity:0;left:0}
}

/* ── Phase 6: Heavy cascade ── */
.mx-cascade {
  position:fixed;top:-24px;
  font-family:'Courier New',monospace;
  font-size:13px;line-height:17px;color:${G1};
  text-shadow:0 0 5px ${G1};
  white-space:pre;z-index:9991;pointer-events:none;
  animation:mxCascadeRain linear forwards;
}
@keyframes mxCascadeRain {
  0%  {opacity:.9}
  90% {opacity:.5}
  100%{top:110vh;opacity:0}
}

/* ── Phase 7: Digital char particles ── */
.mx-particle {
  position:fixed;font-family:'Courier New',monospace;
  color:${G1};text-shadow:0 0 6px ${G1};
  z-index:9994;pointer-events:none;
  animation:mxParticleFloat ease-out forwards;
}
@keyframes mxParticleFloat {
  0%  {opacity:1;transform:translate(0,0) scale(1) rotate(0deg)}
  100%{opacity:0;transform:translate(var(--px),var(--py)) scale(.5) rotate(var(--r))}
}

/* ── Phase 8: System override nova ── */
.mx-override {
  position:fixed;inset:0;pointer-events:none;z-index:9996;
  animation:mxOverride .85s ease-out forwards;
}
@keyframes mxOverride {
  0%  {opacity:0}
  14% {opacity:.9}
  100%{opacity:0}
}

/* ── Phase 9: Grid overlay ── */
.mx-grid {
  position:fixed;inset:0;pointer-events:none;z-index:9994;
  background-image:
    repeating-linear-gradient(0deg,transparent,transparent 49px,rgba(0,255,65,.08) 49px,rgba(0,255,65,.08) 50px),
    repeating-linear-gradient(90deg,transparent,transparent 49px,rgba(0,255,65,.08) 49px,rgba(0,255,65,.08) 50px);
  animation:mxGridReveal .7s ease-out forwards;
}
@keyframes mxGridReveal {
  0%  {opacity:0;transform:scale(.8)}
  40% {opacity:1;transform:scale(1.05)}
  100%{opacity:0;transform:scale(1.3)}
}

/* Hex ring */
.mx-hex-ring {
  position:fixed;left:50%;top:50%;
  border-radius:50%;border:1px solid ${G2};
  box-shadow:0 0 10px ${G2},inset 0 0 10px ${G3};
  font-family:'Courier New',monospace;font-size:9px;
  color:${G2};text-shadow:0 0 4px ${G2};
  pointer-events:none;z-index:9995;overflow:hidden;
  display:flex;align-items:center;justify-content:center;
  text-align:center;word-break:break-all;padding:8px;
  animation:mxHexSpin linear forwards;
}
@keyframes mxHexSpin {
  0%  {transform:translate(-50%,-50%) rotate(0deg) scale(.6);opacity:0}
  15% {opacity:1}
  100%{transform:translate(-50%,-50%) rotate(720deg) scale(2.8);opacity:0}
}

/* ── Phase 11: M A T R I X label ── */
.mx-label {
  position:fixed;left:50%;top:50%;
  transform:translate(-50%,-50%);
  pointer-events:none;z-index:10012;
  display:flex;flex-direction:column;align-items:center;gap:12px;
  animation:mxLabelReveal 4.2s ease forwards;
}
.mx-label-main {
  font-family:'Courier New',monospace;
  font-size:48px;font-weight:700;letter-spacing:18px;
  color:#fff;
  text-shadow:
    0 0 10px ${G1},0 0 25px ${G1},
    0 0 55px ${G2},0 0 110px ${G3};
  border:2px solid ${G1};
  padding:14px 36px;
  background:rgba(0,0,0,.88);
  box-shadow:0 0 24px ${G1},inset 0 0 24px rgba(0,255,65,.12);
  animation:mxLabelPulse 1.1s ease-in-out infinite alternate;
}
@keyframes mxLabelPulse {
  from{box-shadow:0 0 24px ${G1},inset 0 0 24px rgba(0,255,65,.12)}
  to  {box-shadow:0 0 44px ${G1},0 0 80px ${G2},inset 0 0 40px rgba(0,255,65,.22)}
}
.mx-label-sub {
  font-family:'Courier New',monospace;
  font-size:11px;letter-spacing:8px;color:${G2};
  text-shadow:0 0 8px ${G2};font-weight:400;
}
@keyframes mxLabelReveal {
  0%  {opacity:0;transform:translate(-50%,-50%) scale(.5);filter:blur(10px)}
  12% {opacity:1;transform:translate(-50%,-50%) scale(1.04);filter:blur(0)}
  20% {transform:translate(-50%,-50%) scale(1)}
  80% {opacity:1}
  100%{opacity:0;transform:translate(-50%,-50%) scale(1.06)}
}

/* Scanline overlay */
.mx-scanlines {
  position:fixed;inset:0;pointer-events:none;z-index:10011;
  background:repeating-linear-gradient(0deg,
    rgba(0,0,0,.13),rgba(0,0,0,.13) 1px,
    transparent 1px,transparent 2px);
  animation:mxScanScroll 6s linear infinite;
}
@keyframes mxScanScroll { 0%{transform:translateY(0)} 100%{transform:translateY(4px)} }

/* ── Body shakes ── */
@keyframes mxBodyShake {
  0%,100%{transform:translate(0,0)}
  12%{transform:translate(-5px,4px)} 28%{transform:translate(5px,-4px)}
  44%{transform:translate(-4px,5px)} 60%{transform:translate(4px,-3px)}
  76%{transform:translate(-3px,3px)} 92%{transform:translate(2px,-2px)}
}
body.mx-shake { animation:mxBodyShake .55s ease-out; }

@keyframes mxBodyShakeHeavy {
  0%,100%{transform:translate(0,0)}
  8% {transform:translate(-14px,10px)} 22%{transform:translate(14px,-12px)}
  36%{transform:translate(-12px,14px)} 50%{transform:translate(11px,-11px)}
  64%{transform:translate(-10px,10px)} 78%{transform:translate(8px,-8px)}
  90%{transform:translate(-5px,5px)}
}
body.mx-shake-heavy { animation:mxBodyShakeHeavy .8s ease-out; }
`;

function injectCSS() {
  if (document.getElementById('mx-styles')) return;
  const s = document.createElement('style');
  s.id = 'mx-styles';
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

function rndChar(chars) { return chars[Math.floor(Math.random() * chars.length)]; }

// ══════════════════════════════════════════════════════════════
export class Matrix {
  constructor(engine, rarity) {
    this.engine  = engine;
    this.rarity  = rarity;
    this.stopped = false;
    this._timers = [];
    this.fx = {
      shakeIntensity: 50,
      particleCount:  200,
      rayCount:       36,
      ringCount:      7,
      glowMaxAlpha:   0.9,
      rainColumns:    50,
      cascadeStreams:  90,
      debrisParticles:120,
      trailEnabled:   true,
      titleText:      'MATRIX',
      subtitleText:   '> 1 / 25,000  [SYSTEM BREACH]',
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

      // ── Phase 0: Void — stays opaque until near end ────────
      const voidEl = spawn(mk('mx-void'));
      // Fade void out at 11s (well after all content is done)
      this._after(11000, () => voidEl.classList.add('mx-void--fade'));
      this._after(12500, () => voidEl.remove());

      // ── Phase 1: Initial code rain ─────────────────────────
      this._after(200, () => this._spawnRain(this.fx.rainColumns, 2200));

      // ── Phase 2: Glitch + RGB split ────────────────────────
      this._after(900, () => {
        spawn(mk('mx-glitch'));
        spawn(mk('mx-glitch-r'));
        this._after(460, () => {
          document.querySelector('.mx-glitch')?.remove();
          document.querySelector('.mx-glitch-r')?.remove();
        });
        document.body.classList.add('mx-shake');
        this._after(580, () => document.body.classList.remove('mx-shake'));
        this.engine.shake(this.fx.shakeIntensity * 0.25);
      });

      // ── Phase 3: Binary flood ──────────────────────────────
      this._after(1300, () => this._spawnBinaryFlood(55));

      // ── Phase 4: Typewriter message ────────────────────────
      this._after(1800, () => this._spawnTypewriter());

      // ── Phase 5: Breach scan lines — also kills typewriter ─
      this._after(3800, () => {
        // Explicitly remove typewriter so it never overlaps label
        if (this._typewriterEl) {
          this._typewriterEl.style.transition = 'opacity 0.3s';
          this._typewriterEl.style.opacity = '0';
          this._after(320, () => { this._typewriterEl?.remove(); this._typewriterEl = null; });
        }
        this._spawnBreachLines(16);
      });

      // ── Phase 6: Heavy cascade ─────────────────────────────
      this._after(4200, () => this._spawnCascade(this.fx.cascadeStreams));

      // ── Phase 7: Digital particle explosion ────────────────
      this._after(4800, () => this._spawnDigitalParticles(this.fx.debrisParticles));

      // ── Phase 8: System override nova ─────────────────────
      this._after(5300, () => {
        const ov = spawn(mk('mx-override'));
        ov.style.background = `radial-gradient(circle at 50% 50%,
          ${G1}55 0%,${G2}22 35%,transparent 65%)`;
        this._after(900, () => ov.remove());

        document.body.classList.add('mx-shake-heavy');
        this._after(850, () => document.body.classList.remove('mx-shake-heavy'));
        this.engine.shake(this.fx.shakeIntensity);
      });

      // ── Phase 9: Grid + hex rings ──────────────────────────
      this._after(5700, () => {
        const grid = spawn(mk('mx-grid'));
        this._after(750, () => grid.remove());
        this._spawnHexRings(3);
      });

      // ── Phase 10: Canvas effects ───────────────────────────
      this._after(6200, () => {
        // Green ray bursts — two layers rotating opposite directions
        this.engine.addEffect(new RayBurst({
          color:    G1,
          duration: 8000,
          maxAlpha: 0.18,
          rayCount: this.fx.rayCount,
          rotSpeed: 0.6,
        }));
        this.engine.addEffect(new RayBurst({
          color:    G2,
          duration: 7500,
          maxAlpha: 0.1,
          rayCount: Math.floor(this.fx.rayCount * 0.6),
          rotSpeed: -0.35,
        }));

        // Deep green radial glow
        this.engine.addEffect(new GlowOverlay({
          color:      G_GLOW,
          duration:   8000,
          maxAlpha:   this.fx.glowMaxAlpha,
          fadeIn:     0.04,
          fadeOut:    0.2,
          radial:     true,
          pulseSpeed: 2.2,
        }));

        // Three staggered green particle bursts
        [G1, G2, '#ffffff'].forEach((col, i) => {
          this._after(i * 160, () => {
            this.engine.addEffect(new ParticleBurst(0.5, 0.5, {
              count:    Math.floor(this.fx.particleCount * (.6 + i * .2)),
              color:    col,
              minSpeed: 150 + i * 80,
              maxSpeed: 480 + i * 60,
              minSize:  2,
              maxSize:  8,
              gravity:  50,
              trail:    this.fx.trailEnabled,
              glow:     true,
              duration: 5500,
              type:     i === 2 ? 'star' : 'spark',
            }));
          });
        });

        // Continuous upward code rain from center — feels like data ascending
        this.engine.addEffect(new ContinuousParticles({
          ox:        0.5,
          oy:        0.55,
          color:     G1,
          minSpeed:  60,
          maxSpeed:  220,
          gravity:   -80,
          upBias:    160,
          spread:    1.0,
          angle:     -Math.PI / 2,
          minSize:   2,
          maxSize:   6,
          trail:     true,
          glow:      true,
          spawnRate: 0.03,
          duration:  7000,
          type:      'spark',
        }));

        // Rain from top — continuous digital downpour
        this.engine.addEffect(new ContinuousParticles({
          ox:        w => Math.random() * w,
          oy:        0,
          color:     G2,
          minSpeed:  80,
          maxSpeed:  200,
          gravity:   120,
          spread:    0.3,
          angle:     Math.PI / 2,
          minSize:   1.5,
          maxSize:   4,
          glow:      true,
          spawnRate: 0.035,
          duration:  6500,
        }));
      });

      // ── Phase 11: Label + scanlines ────────────────────────
      this._after(6800, () => {
        // DOM label — the definitive reveal, no canvas duplicate
        const label = spawn(mk('mx-label'));
        const main  = document.createElement('div');
        main.className = 'mx-label-main';
        main.textContent = 'M A T R I X';
        const sub = document.createElement('div');
        sub.className = 'mx-label-sub';
        sub.textContent = '[ SYSTEM BREACH · 1 / 25,000 ]';
        label.appendChild(main);
        label.appendChild(sub);

        const scanlines = spawn(mk('mx-scanlines'));

        this._after(4400, () => {
          label.remove();
          scanlines.remove();
        });
      });

      // ── Phase 12: Resolve ──────────────────────────────────
      this._after(13000, () => {
        killSpawned();
        resolve();
      });
    });
  }

  stop() {
    this.stopped = true;
    this._timers.forEach(clearTimeout);
    this._timers = [];
    document.body.classList.remove('mx-shake', 'mx-shake-heavy');
    killSpawned();
  }

  // ── Code rain columns ────────────────────────────────────────
  _spawnRain(count, duration) {
    for (let i = 0; i < count; i++) {
      this._after(Math.random() * 400, () => {
        const col = spawn(mk('mx-col'));
        const len = 22 + Math.floor(Math.random() * 32);
        col.textContent = Array.from({ length: len }, () => rndChar(KATA)).join('\n');
        col.style.left              = Math.random() * 100 + 'vw';
        col.style.fontSize          = (13 + Math.random() * 5) + 'px';
        col.style.opacity           = (.5 + Math.random() * .5).toString();
        col.style.animationDuration = (duration + Math.random() * 800) + 'ms';
        col.style.animationDelay    = Math.random() * 300 + 'ms';
        // Randomise brightness per column for depth
        col.style.filter = `brightness(${.6 + Math.random() * .8})`;
        this._after(duration + 1200, () => col.remove());

        // Randomly mutate characters mid-fall for authentic feel
        let mut = setInterval(() => {
          if (this.stopped || !col.isConnected) { clearInterval(mut); return; }
          const lines = col.textContent.split('\n');
          const idx   = Math.floor(Math.random() * lines.length);
          lines[idx]  = rndChar(KATA);
          col.textContent = lines.join('\n');
        }, 80 + Math.random() * 120);
        this._timers.push(mut);
        this._after(duration + 1200, () => clearInterval(mut));
      });
    }
  }

  // ── Binary flood from edges ──────────────────────────────────
  _spawnBinaryFlood(count) {
    for (let i = 0; i < count; i++) {
      const b    = spawn(mk('mx-binary'));
      const len  = 32 + Math.floor(Math.random() * 48);
      b.textContent = Array.from({ length: len }, () => rndChar(BIN)).join('');
      const side = i % 4;
      if (side === 0) { b.style.left = Math.random() * 100 + 'vw'; b.style.top = '0'; }
      if (side === 1) { b.style.right = '0'; b.style.top = Math.random() * 100 + 'vh'; }
      if (side === 2) { b.style.left = Math.random() * 100 + 'vw'; b.style.bottom = '0'; }
      if (side === 3) { b.style.left = '0'; b.style.top = Math.random() * 100 + 'vh'; }
      b.style.animationDelay    = Math.random() * 300 + 'ms';
      b.style.animationDuration = '.85s';
      this._after(1200, () => b.remove());
    }
  }

  // ── Typewriter message — 4 lines, char by char ───────────────
  _spawnTypewriter() {
    const container = spawn(mk('mx-typewriter'));
    this._typewriterEl = container; // store ref for explicit cleanup
    // Cursor element shared across lines
    const cursor = document.createElement('span');
    cursor.className = 'mx-cursor';

    const typeLineFn = (lineIndex, onDone) => {
      if (this.stopped) return;
      const text    = LINES[lineIndex];
      const isFinal = lineIndex === LINES.length - 1;

      const lineEl  = document.createElement('div');
      lineEl.className = isFinal ? 'mx-tw-line mx-tw-line--final' : 'mx-tw-line';
      lineEl.textContent = '';
      lineEl.appendChild(cursor);
      container.appendChild(lineEl);

      let charIdx = 0;
      // Typing speed: normal lines 45ms/char, final line 60ms/char for drama
      const speed = isFinal ? 62 : 45;

      const typeNext = () => {
        if (this.stopped) return;
        if (charIdx < text.length) {
          // Insert before cursor
          lineEl.insertBefore(document.createTextNode(text[charIdx]), cursor);
          charIdx++;
          const delay = speed + (Math.random() > .85 ? 120 : 0); // occasional hesitation
          this._timers.push(setTimeout(typeNext, delay));
        } else {
          // Line complete — remove cursor, wait, move to next
          cursor.remove();
          if (onDone) {
            // Pause between lines
            const pause = isFinal ? 0 : 320;
            this._timers.push(setTimeout(onDone, pause));
          }
        }
      };
      typeNext();
    };

    // Chain all four lines
    const chainLines = (idx) => {
      if (idx >= LINES.length) return;
      typeLineFn(idx, () => {
        if (idx < LINES.length - 1) {
          chainLines(idx + 1);
        } else {
          // Final line typed — flash and shake
          this._after(400, () => {
            spawn(mk('mx-final-flash'));
            this._after(650, () => document.querySelector('.mx-final-flash')?.remove());
            document.body.classList.add('mx-shake');
            this._after(580, () => document.body.classList.remove('mx-shake'));
          });
          // Remove whole typewriter block after it's been read
          this._after(1800, () => {
            container.remove();
            this._typewriterEl = null;
          });
        }
      });
    };
    chainLines(0);
  }

  // ── Breach scan lines ────────────────────────────────────────
  _spawnBreachLines(count) {
    for (let i = 0; i < count; i++) {
      this._after(i * 55, () => {
        const line = spawn(mk('mx-breach'));
        line.style.top              = Math.random() * 100 + 'vh';
        line.style.animationDelay   = i * 30 + 'ms';
        line.style.animationDuration = (.55 + Math.random() * .2) + 's';
        this._after(800, () => line.remove());
      });
    }
  }

  // ── Heavy Katakana cascade ───────────────────────────────────
  _spawnCascade(count) {
    for (let i = 0; i < count; i++) {
      const c   = spawn(mk('mx-cascade'));
      const len = 36 + Math.floor(Math.random() * 22);
      // Each column is 3 chars wide per row
      c.textContent = Array.from({ length: len }, () =>
        Array.from({ length: 3 }, () => rndChar(KATA)).join('') + '\n'
      ).join('');
      c.style.left              = Math.random() * 100 + 'vw';
      c.style.animationDuration = (1.1 + Math.random() * .9) + 's';
      c.style.animationDelay    = Math.random() * 450 + 'ms';
      c.style.filter            = `brightness(${.5 + Math.random() * .7})`;
      this._after(2200, () => c.remove());
    }
  }

  // ── Digital 0/1 particle explosion ───────────────────────────
  _spawnDigitalParticles(count) {
    for (let i = 0; i < count; i++) {
      const p     = spawn(mk('mx-particle'));
      p.textContent = rndChar(BIN);
      const size  = 12 + Math.random() * 14;
      const angle = Math.random() * 360;
      const dist  = 28 + Math.random() * 52;
      const px    = Math.cos(angle * Math.PI / 180) * dist;
      const py    = Math.sin(angle * Math.PI / 180) * dist;
      const rot   = Math.random() * 720 - 360;
      const dur   = .5 + Math.random() * .9;
      p.style.fontSize = size + 'px';
      p.style.left     = '50vw';
      p.style.top      = '50vh';
      p.style.setProperty('--px', px + 'vmin');
      p.style.setProperty('--py', py + 'vmin');
      p.style.setProperty('--r',  rot + 'deg');
      p.style.animationDuration = dur + 's';
      p.style.animationDelay    = Math.random() * 200 + 'ms';
      this._after((dur + .3) * 1000, () => p.remove());
    }
  }

  // ── Hex code rings ───────────────────────────────────────────
  _spawnHexRings(count) {
    const HEX = '0123456789ABCDEF';
    for (let i = 0; i < count; i++) {
      this._after(i * 120, () => {
        const ring   = spawn(mk('mx-hex-ring'));
        const radius = 130 + i * 90;
        const chars  = 60 + i * 25;
        ring.textContent = Array.from({ length: chars }, (_, j) =>
          rndChar(HEX) + (j % 2 === 1 ? ' ' : '')
        ).join('');
        ring.style.width          = radius * 2 + 'px';
        ring.style.height         = radius * 2 + 'px';
        ring.style.animationDuration = (2 + i * .4) + 's';
        ring.style.animationDelay    = i * 100 + 'ms';
        this._after(2400, () => ring.remove());
      });
    }
  }
}