// cutscenes/TheGoldenHour.js
// ═══════════════════════════════════════════════════════════════
//  T H E   G O L D E N   H O U R  —  1 / 800,000
//  Hybrid: DOM/CSS sky + canvas warm engine + Web Audio glimmer
//
//  That specific hour. The world turns gold.
//  Two silhouettes going nowhere in particular.
//  Glitter in the light.
//  Time forgets to move.
//
//  Palette: road night #0d0810 / horizon ember #ff5a00
//           sky coral  #ff6060 / sky pink  #ff88bb
//           pure gold  #ffd700 / glitter   #fff4b8
//           sky lavender #c8a0ff / deep sky #0a0520
//
//  Phase 0  (0ms)    : Deep blue-black void. Stars. Road hum.
//  Phase 1  (600ms)  : Single ember line at horizon ignites.
//  Phase 2  (1600ms) : Sky gradient floods upward — golden hour begins.
//  Phase 3  (2800ms) : Car dashboard silhouette — two heads, road ahead.
//  Phase 4  (4200ms) : Glitter drifts. Warm gold. Hundreds. Slow.
//  Phase 5  (5800ms) : "Some moments stretch beyond their measure."
//  Phase 6  (9500ms) : "The sky bled every colour it knew."
//  Phase 7  (13000ms): Glitter peaks — 400 particles, lit from within.
//  Phase 8  (14500ms): "And time, for once, forgot to move."
//  Phase 9  (17500ms): Sky PULSES — warm flash, golden hour peak.
//  Phase 10 (19000ms): Canvas — slow warm rays + coral/gold glow.
//  Phase 11 (20500ms): T H E   G O L D E N   H O U R label.
//  Phase 12 (23500ms): "YOU WERE SOMEONE'S WHOLE SKY." typewriter.
//  Phase 13 (29000ms): Scene fades — the hour passes.
//  Phase 14 (32000ms): Void fades.
//  Phase 15 (35000ms): Resolve.
// ═══════════════════════════════════════════════════════════════

import { ParticleBurst, ContinuousParticles } from '../effects/ParticleBurst.js';
import { GlowOverlay, RayBurst }               from '../effects/GlowOverlay.js';

// ── Palette ───────────────────────────────────────────────────
const GH_NIGHT   = '#0d0810';
const GH_EMBER   = '#ff5a00';
const GH_CORAL   = '#ff6060';
const GH_PINK    = '#ff88bb';
const GH_GOLD    = '#ffd700';
const GH_GLITTER = '#fff4b8';
const GH_LAVEN   = '#c8a0ff';
const GH_SKY     = '#0a0520';
const GH_WARM    = '#ffb347';
const GH_WHITE   = '#ffffff';

const GH_GOLD_GLOW   = 'rgba(255,215,0,0.92)';
const GH_CORAL_GLOW  = 'rgba(255,96,96,0.88)';
const GH_PINK_GLOW   = 'rgba(255,136,187,0.85)';

// ── CSS ───────────────────────────────────────────────────────
const CSS = `
/* ── Void ── */
.gh-void {
  position:fixed;inset:0;
  background:${GH_NIGHT};
  z-index:9990;pointer-events:none;
  opacity:1;transition:opacity 3s ease;
}
.gh-void--fade { opacity:0; }

/* ── Stars — visible before sky brightens ── */
.gh-star {
  position:fixed;border-radius:50%;
  pointer-events:none;z-index:9991;
  background:var(--sc);
  animation:ghStarFade var(--sd) ease-in-out infinite alternate;
  animation-delay:var(--sly);
}
@keyframes ghStarFade {
  0%  {opacity:var(--so)}
  100%{opacity:calc(var(--so) * .2)}
}

/* ── Phase 1: Horizon ember line ── */
.gh-horizon-line {
  position:fixed;left:0;right:0;
  pointer-events:none;z-index:9992;
  /* sits at 62% from top — lower third of screen */
  top:62%;
  height:1px;
  background:linear-gradient(to right,
    transparent 0%,
    rgba(255,90,0,.3) 15%,
    rgba(255,90,0,.85) 35%,
    ${GH_EMBER} 50%,
    rgba(255,90,0,.85) 65%,
    rgba(255,90,0,.3) 85%,
    transparent 100%);
  opacity:0;
  animation:ghHorizonReveal 1.8s ease forwards;
  box-shadow:0 0 8px 2px rgba(255,90,0,.4), 0 0 20px 6px rgba(255,60,0,.2);
}
@keyframes ghHorizonReveal {
  0%  {opacity:0;transform:scaleX(.3)}
  60% {opacity:1;transform:scaleX(1.02)}
  100%{opacity:1;transform:scaleX(1)}
}
/* Ember glow breathes */
.gh-horizon-line--alive {
  animation:ghHorizonReveal 1.8s ease forwards,
            ghHorizonBreath 3.5s ease-in-out 2s infinite alternate;
}
@keyframes ghHorizonBreath {
  from{box-shadow:0 0 8px 2px rgba(255,90,0,.4),0 0 20px 6px rgba(255,60,0,.2)}
  to  {box-shadow:0 0 16px 5px rgba(255,140,0,.65),0 0 45px 14px rgba(255,90,0,.35)}
}

/* ── Phase 2: Sky gradient ── */
.gh-sky {
  position:fixed;left:0;right:0;top:0;
  pointer-events:none;z-index:9991;
  /* starts at horizon height, grows upward */
  height:62%;
  background:linear-gradient(to top,
    ${GH_EMBER}   0%,
    #ff7020      10%,
    ${GH_CORAL}  22%,
    ${GH_PINK}   40%,
    #d060c0      58%,
    ${GH_LAVEN}  75%,
    #6030a0      90%,
    ${GH_SKY}   100%);
  opacity:0;
  transition:opacity 3.5s ease;
}
.gh-sky--on { opacity:1; }
/* Sky brightens at peak */
.gh-sky--peak {
  filter:brightness(1.25) saturate(1.15);
  transition:opacity 3.5s ease, filter 1.5s ease;
}

/* Horizon glow — diffuse upward bloom from horizon line */
.gh-horizon-glow {
  position:fixed;left:-10%;right:-10%;
  pointer-events:none;z-index:9992;
  top:38%;height:30%;
  background:radial-gradient(ellipse 80% 100% at 50% 100%,
    rgba(255,140,0,.5)  0%,
    rgba(255,100,0,.25) 30%,
    rgba(255,80,0,.12)  55%,
    transparent         80%);
  opacity:0;transition:opacity 2s ease;
}
.gh-horizon-glow--on { opacity:1; }

/* ── Phase 3: Car silhouette ── */
.gh-scene {
  position:fixed;left:0;right:0;bottom:0;
  height:40%;
  pointer-events:none;z-index:9993;
  opacity:0;transition:opacity 1.8s ease;
}
.gh-scene--on { opacity:1; }
.gh-scene svg { position:absolute;inset:0;width:100%;height:100%; }

/* ── Phase 4: Glitter particles ── */
.gh-glitter {
  position:fixed;border-radius:50%;
  pointer-events:none;z-index:9994;
  background:radial-gradient(circle,${GH_WHITE} 0%,var(--gc) 60%,transparent 100%);
  box-shadow:0 0 var(--gg) var(--gc);
  animation:ghGlitterDrift var(--gd) ease-in-out forwards;
  animation-delay:var(--gly);
  opacity:0;
}
@keyframes ghGlitterDrift {
  0%  {opacity:0;transform:translate(var(--gx),var(--gy)) scale(.5)}
  15% {opacity:var(--gop)}
  75% {opacity:var(--gop)}
  100%{opacity:0;transform:translate(
    calc(var(--gx) + var(--gdx)),
    calc(var(--gy) - var(--gdy))) scale(.15)}
}
/* Occasional glitter spike — catches the light */
.gh-glitter--bright {
  animation:ghGlitterDrift var(--gd) ease-in-out forwards,
            ghGlitterSpike var(--gsd) ease-in-out infinite alternate;
  animation-delay:var(--gly), calc(var(--gly) + .3s);
}
@keyframes ghGlitterSpike {
  0%  {filter:brightness(1);box-shadow:0 0 var(--gg) var(--gc)}
  100%{filter:brightness(3.5) saturate(1.3);
       box-shadow:0 0 calc(var(--gg) * 2.5) ${GH_WHITE},
                  0 0 calc(var(--gg) * 5) var(--gc)}
}

/* ── Sentence text ── */
.gh-sentence {
  position:fixed;left:50%;top:26%;
  transform:translateX(-50%);
  pointer-events:none;z-index:10005;
  text-align:center;
  display:flex;flex-wrap:wrap;justify-content:center;
  gap:0;max-width:72vw;
  font-family:'Georgia','Times New Roman',serif;font-style:italic;
  font-size:clamp(1rem,2.3vw,1.45rem);
  letter-spacing:.09em;
  color:rgba(255,235,170,.9);
  text-shadow:
    0 0 14px rgba(255,190,80,.7),
    0 0 40px rgba(255,140,40,.35);
}
.gh-word {
  display:inline-block;opacity:0;
  animation:ghWordIn var(--dur,160ms) cubic-bezier(0,.1,.4,1) forwards;
  animation-delay:var(--dly,0ms);
}
@keyframes ghWordIn {
  0%  {opacity:0;transform:translateY(8px);filter:blur(8px);letter-spacing:.4em;color:rgba(255,220,120,.2)}
  30% {opacity:.55;filter:blur(2px);letter-spacing:.2em}
  100%{opacity:1;transform:translateY(0);filter:blur(0);letter-spacing:.09em;color:rgba(255,235,170,.9)}
}

/* ── Sky pulse flash ── */
.gh-sky-pulse {
  position:fixed;inset:0;pointer-events:none;z-index:9995;
  background:radial-gradient(ellipse at 50% 65%,
    rgba(255,200,100,.7) 0%,rgba(255,140,50,.35) 40%,transparent 70%);
  opacity:0;
  animation:ghSkyPulse 1.6s ease-out forwards;
}
@keyframes ghSkyPulse {
  0%  {opacity:0}
  20% {opacity:1}
  100%{opacity:0}
}

/* ── R E B I R T H — wait, THE GOLDEN HOUR label ── */
.gh-label {
  position:fixed;left:50%;top:50%;
  transform:translate(-50%,-50%);
  pointer-events:none;z-index:10012;
  display:flex;flex-direction:column;align-items:center;gap:14px;
  animation:ghLabelReveal 11.5s ease forwards;
}
@keyframes ghLabelReveal {
  0%  {opacity:0;transform:translate(-50%,-50%) scale(.45);filter:blur(28px)}
  6%  {opacity:1;transform:translate(-50%,-50%) scale(1.03);filter:blur(0)}
  11% {transform:translate(-50%,-50%) scale(1)}
  80% {opacity:1}
  100%{opacity:0}
}

.gh-label-main {
  position:relative;
  font-family:'Georgia','Times New Roman',serif;
  font-size:33px;font-weight:400;letter-spacing:16px;
  color:${GH_GOLD};
  text-shadow:
    0 0 10px ${GH_GOLD},
    0 0 28px rgba(255,215,0,.75),
    0 0 80px rgba(255,180,60,.5),
    0 0 200px rgba(255,140,40,.25);
  padding:20px 50px;
  background:rgba(6,3,0,.97);
  border:1px solid rgba(255,215,0,.35);
  box-shadow:
    0 0 60px rgba(255,180,60,.38),
    0 0 150px rgba(255,140,40,.2),
    inset 0 0 45px rgba(255,180,60,.05);
  animation:ghLabelGlow 4.5s ease-in-out infinite alternate;
}
@keyframes ghLabelGlow {
  from{
    text-shadow:0 0 10px ${GH_GOLD},0 0 28px rgba(255,215,0,.75),0 0 80px rgba(255,180,60,.5),0 0 200px rgba(255,140,40,.25);
    border-color:rgba(255,215,0,.35);
    box-shadow:0 0 60px rgba(255,180,60,.38),0 0 150px rgba(255,140,40,.2),inset 0 0 45px rgba(255,180,60,.05);
  }
  to{
    text-shadow:0 0 18px ${GH_WHITE},0 0 50px ${GH_GOLD},0 0 130px rgba(255,180,60,.7),0 0 320px rgba(255,140,40,.35);
    border-color:rgba(255,230,130,.65);
    box-shadow:0 0 100px rgba(255,200,60,.55),0 0 250px rgba(255,160,40,.28),inset 0 0 90px rgba(255,180,60,.08);
  }
}

/* Warm corner dots */
.gh-label-main::before,
.gh-label-main::after {
  content:'✦';
  position:absolute;top:7px;
  font-size:10px;color:rgba(255,215,0,.5);
  animation:ghCornerGlow 3s ease-in-out infinite alternate;
}
.gh-label-main::before { left:12px; }
.gh-label-main::after  { right:12px; }
@keyframes ghCornerGlow {
  from{opacity:.4;color:rgba(255,190,80,.5)}
  to  {opacity:1;color:rgba(255,240,160,.9)}
}

.gh-label-sub {
  font-family:'Georgia','Times New Roman',serif;font-style:italic;
  font-size:10px;letter-spacing:5px;
  color:rgba(255,200,100,.45);
  text-shadow:0 0 8px rgba(255,160,40,.35);
}

/* ── Typewriter ── */
.gh-typewriter {
  position:fixed;left:50%;top:calc(50% + 80px);
  transform:translateX(-50%);
  pointer-events:none;z-index:10013;
  font-family:'Georgia','Times New Roman',serif;font-style:italic;
  font-size:15px;letter-spacing:8px;
  color:rgba(255,230,140,.82);
  text-shadow:0 0 12px rgba(255,180,60,.5);
  white-space:nowrap;
  animation:ghTypeReveal 11s ease forwards;
}
@keyframes ghTypeReveal {
  0%{opacity:0} 4%{opacity:1} 86%{opacity:1} 100%{opacity:0}
}
.gh-cursor {
  display:inline-block;width:2px;height:1em;
  background:rgba(255,215,0,.7);margin-left:2px;vertical-align:middle;
  box-shadow:0 0 5px rgba(255,180,60,.5);
  animation:ghCursorBlink 1s step-end infinite;
}
@keyframes ghCursorBlink { 0%,100%{opacity:1} 50%{opacity:0} }

/* Road glow — warm light from the horizon catching the road surface */
.gh-road-glow {
  position:fixed;left:0;right:0;bottom:0;
  height:40%;
  pointer-events:none;z-index:9992;
  background:linear-gradient(to top,
    rgba(255,90,0,.08) 0%,
    rgba(255,80,0,.04) 30%,
    transparent 70%);
  opacity:0;transition:opacity 3s ease;
}
.gh-road-glow--on { opacity:1; }
`;

function injectCSS() {
  if (document.getElementById('gh-styles')) return;
  const s = document.createElement('style');
  s.id = 'gh-styles';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function mk(cls)  { const el = document.createElement('div'); el.className = cls; return el; }
let _spawned = [];
function spawn(el)    { _spawned.push(el); document.body.appendChild(el); return el; }
function killSpawned(){ _spawned.forEach(e => e.remove()); _spawned = []; }
function rnd(lo, hi)  { return lo + Math.random() * (hi - lo); }

const SPEECHES = [
  { text: 'Some moments stretch beyond their measure.',  msPerWord: 430, hold: 1400 },
  { text: 'The sky bled every colour it knew.',          msPerWord: 490, hold: 1600 },
  { text: 'And time, for once, forgot to move.',        msPerWord: 540, hold: 2000 },
];
const WORD_FADE_MS     = 160;
const SENTENCE_FADE_MS = 300;

// Glitter colour pool — warm gold, coral, white, pink
const GLITTER_COLS = [
  GH_GOLD,
  GH_GLITTER,
  GH_CORAL,
  GH_PINK,
  GH_WARM,
  '#ffe8a0',
  '#ffccaa',
  GH_WHITE,
];

// ══════════════════════════════════════════════════════════════
export class TheGoldenHour {
  constructor(engine, rarity) {
    this.engine     = engine;
    this.rarity     = rarity;
    this.stopped    = false;
    this._timers    = [];
    this._actx      = null;
    this._droneNode = null;
    this._chimeId   = null;
    this._skyEl     = null;
    this._horizGlow = null;
    this._sceneEl   = null;
    this._roadGlow  = null;
    this.fx = {
      shakeIntensity: 45,
      particleCount:  280,
      rayCount:       48,
      glowMaxAlpha:   0.9,
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

      // ── Phase 0: Deep sky void + stars ──────────────────────
      const voidEl = spawn(mk('gh-void'));

      // Fade scene elements before void lifts
      this._after(29000, () => {
        document.querySelectorAll(
          '.gh-scene,.gh-horizon-line,.gh-sky,.gh-horizon-glow,.gh-road-glow'
        ).forEach(el => {
          el.style.transition = 'opacity 2.2s ease';
          el.style.opacity    = '0';
        });
      });
      this._after(32000, () => voidEl.classList.add('gh-void--fade'));
      this._after(35000, () => voidEl.remove());

      this._spawnStars(55);
      this._sfxRoadHum();

      // ── Phase 1: Horizon ember line ─────────────────────────
      this._after(600, () => {
        const line = spawn(mk('gh-horizon-line'));
        this._after(1800, () => line.classList.add('gh-horizon-line--alive'));
      });

      // ── Phase 2: Sky floods upward ──────────────────────────
      this._after(1600, () => {
        const sky = spawn(mk('gh-sky'));
        this._skyEl = sky;
        this._after(80, () => sky.classList.add('gh-sky--on'));

        const hGlow = spawn(mk('gh-horizon-glow'));
        this._horizGlow = hGlow;
        this._after(300, () => hGlow.classList.add('gh-horizon-glow--on'));

        const roadGlow = spawn(mk('gh-road-glow'));
        this._roadGlow = roadGlow;
        this._after(500, () => roadGlow.classList.add('gh-road-glow--on'));
      });

      // ── Phase 3: Car dashboard silhouette ──────────────────
      this._after(2800, () => this._spawnCarScene());

      // ── Phase 4: Glitter begins — gentle, sparse ────────────
      this._after(4200, () => this._spawnGlitter(180));

      // ── Phases 5–8: Three sentences ─────────────────────────
      let cursor = 5800;
      SPEECHES.forEach(s => {
        const words       = s.text.split(' ');
        const typeDur     = words.length * s.msPerWord;
        const totalVis    = typeDur + WORD_FADE_MS + s.hold;
        const sentenceEnd = totalVis + SENTENCE_FADE_MS;
        this._after(cursor, () => this._showSentence(s.text, s.msPerWord, s.hold));
        cursor += sentenceEnd + 500;
      });

      // ── Phase 7: Glitter peaks ──────────────────────────────
      this._after(13000, () => this._spawnGlitter(220, true));

      // Glimmer chimes start around glitter peak
      this._after(13500, () => this._startGlimmerChimes());

      // ── Phase 9: Sky pulse — golden hour peak ───────────────
      this._after(17500, () => {
        spawn(mk('gh-sky-pulse'));
        if (this._skyEl) this._skyEl.classList.add('gh-sky--peak');
        this._after(1200, () => document.querySelector('.gh-sky-pulse')?.remove());
        this._sfxBloom();
      });

      // ── Phase 10: Canvas — slow warm rays + glow ────────────
      this._after(19000, () => {
        const warmCols = [GH_GOLD, GH_CORAL, GH_PINK, GH_WARM, GH_GLITTER, '#ffaa55'];
        warmCols.forEach((col, i) => {
          this._after(i * 130, () => {
            this.engine.addEffect(new RayBurst({
              color:    col,
              duration: 14000,
              maxAlpha: 0.18 - i * 0.022,
              rayCount: Math.floor(this.fx.rayCount * (1.15 - i * 0.1)),
              // Golden hour sun moves slowly
              rotSpeed: i % 2 === 0 ? 0.12 + i * 0.02 : -(0.10 + i * 0.018),
            }));
          });
        });

        this.engine.addEffect(new GlowOverlay({
          color: GH_GOLD_GLOW, duration: 14000, maxAlpha: this.fx.glowMaxAlpha,
          fadeIn: 0.05, fadeOut: 0.22, radial: true, pulseSpeed: 0.7,
        }));
        this.engine.addEffect(new GlowOverlay({
          color: GH_CORAL_GLOW, duration: 13000, maxAlpha: 0.55,
          fadeIn: 0.07, fadeOut: 0.28, radial: true, pulseSpeed: 0.5,
        }));
        this.engine.addEffect(new GlowOverlay({
          color: GH_PINK_GLOW, duration: 12000, maxAlpha: 0.4,
          fadeIn: 0.09, fadeOut: 0.3, radial: true, pulseSpeed: 0.35,
        }));

        // Warm particle eruptions — gentle, drifting
        [[GH_GOLD, 1.0], [GH_GLITTER, 0.8], [GH_CORAL, 0.6], [GH_PINK, 0.45]].forEach(([col, scale], i) => {
          this._after(i * 150, () => {
            this.engine.addEffect(new ParticleBurst(0.5, 0.62, {
              count:    Math.floor(this.fx.particleCount * scale),
              color:    col,
              minSpeed: 40  + i * 50,
              maxSpeed: 280 + i * 40,
              minSize:  2,  maxSize: 10,
              gravity:  25,         // gentle — golden hour isn't violent
              trail:    true, glow: true,
              duration: 13000,
              type:     'star',
            }));
          });
        });

        // Continuous drifting glitter sparks
        this.engine.addEffect(new ContinuousParticles({
          ox: 0.5, oy: 0.5,
          color:     GH_GLITTER,
          minSpeed:  15, maxSpeed:  80,
          gravity:   -15, upBias:  40,
          spread:    Math.PI * 2, angle: 0,
          minSize:   1, maxSize:   5,
          trail:     true, glow:   true,
          spawnRate: 0.038,
          duration:  13000,
          type:      'star',
        }));
      });

      // ── Phase 11: Label ──────────────────────────────────────
      this._after(20500, () => this._spawnLabel());

      // ── Phase 12: Typewriter ─────────────────────────────────
      this._after(23500, () => this._spawnTypewriter());

      // ── Stop chimes before void fade ────────────────────────
      this._after(29000, () => this._stopChimes());

      // ── Phase 15: Resolve ────────────────────────────────────
      this._after(35000, () => {
        killSpawned();
        this._stopDrone();
        if (this._actx) { try { this._actx.close(); } catch(e){} }
        resolve();
      });
    });
  }

  stop() {
    this.stopped = true;
    this._timers.forEach(clearTimeout);
    this._timers = [];
    this._stopChimes();
    this._stopDrone();
    if (this._actx) { try { this._actx.close(); } catch(e){} }
    killSpawned();
  }

  // ── Stars — visible in the early deep-sky phase ─────────────
  _spawnStars(count) {
    for (let i = 0; i < count; i++) {
      const star = spawn(mk('gh-star'));
      const sz   = rnd(0.8, 2.5);
      const col  = i % 4 === 0 ? GH_LAVEN : GH_WHITE;
      star.style.cssText = `
        width:${sz}px;height:${sz}px;
        left:${rnd(0,100)}%;
        top:${rnd(2, 55)}%;
        --sc:${col};--sd:${rnd(1.5,3.5)}s;
        --sly:${rnd(0,3)}s;--so:${rnd(.25,.7)};
      `;
    }
  }

  // ── Phase 3: Car dashboard silhouette ───────────────────────
  _spawnCarScene() {
    const scene = spawn(mk('gh-scene'));
    this._sceneEl = scene;
    this._after(80, () => scene.classList.add('gh-scene--on'));

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 100 40');
    svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';

    // Dashboard — horizontal dark band across bottom
    const dash = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    dash.setAttribute('x','0'); dash.setAttribute('y','22');
    dash.setAttribute('width','100'); dash.setAttribute('height','18');
    dash.style.fill = 'rgba(8,4,0,.92)';
    svg.appendChild(dash);

    // Steering wheel silhouette — left of center
    const wheel = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    wheel.setAttribute('cx','36'); wheel.setAttribute('cy','24');
    wheel.setAttribute('r','6.5');
    wheel.style.fill = 'none';
    wheel.style.stroke = 'rgba(30,15,5,.95)';
    wheel.style.strokeWidth = '1.8';
    svg.appendChild(wheel);
    // Wheel spokes
    ['M36,17.5 L36,22', 'M29.5,24 L34,24', 'M38,24 L42.5,24'].forEach(d => {
      const spoke = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      spoke.setAttribute('d', d);
      spoke.style.stroke = 'rgba(30,15,5,.95)';
      spoke.style.strokeWidth = '1.2';
      spoke.style.fill = 'none';
      svg.appendChild(spoke);
    });

    // Driver silhouette — head + shoulders, left
    const driverHead = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    driverHead.setAttribute('cx','34'); driverHead.setAttribute('cy','16');
    driverHead.setAttribute('rx','5.5'); driverHead.setAttribute('ry','6.5');
    driverHead.style.fill = 'rgba(12,6,0,.9)';
    svg.appendChild(driverHead);
    const driverShoulders = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    driverShoulders.setAttribute('d','M24,25 Q34,20 44,25');
    driverShoulders.style.fill = 'none';
    driverShoulders.style.stroke = 'rgba(12,6,0,.9)';
    driverShoulders.style.strokeWidth = '5';
    driverShoulders.style.strokeLinecap = 'round';
    svg.appendChild(driverShoulders);

    // Passenger silhouette — head + shoulders, right — leaning slightly toward driver
    const passHead = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
    passHead.setAttribute('cx','65'); passHead.setAttribute('cy','15');
    passHead.setAttribute('rx','5'); passHead.setAttribute('ry','6');
    passHead.style.fill = 'rgba(12,6,0,.9)';
    svg.appendChild(passHead);
    const passShoulders = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    passShoulders.setAttribute('d','M55,25 Q65,20 75,25');
    passShoulders.style.fill = 'none';
    passShoulders.style.stroke = 'rgba(12,6,0,.9)';
    passShoulders.style.strokeWidth = '5';
    passShoulders.style.strokeLinecap = 'round';
    svg.appendChild(passShoulders);

    // Windshield frame — top of car visible
    const windshield = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    windshield.setAttribute('d','M8,22 L16,4 L84,4 L92,22');
    windshield.style.fill = 'none';
    windshield.style.stroke = 'rgba(15,8,0,.85)';
    windshield.style.strokeWidth = '.8';
    svg.appendChild(windshield);

    // Dash details — instrument cluster glow
    const dash1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dash1.setAttribute('cx','40'); dash1.setAttribute('cy','26');
    dash1.setAttribute('r','2.5');
    dash1.style.fill = 'rgba(255,140,30,.08)';
    svg.appendChild(dash1);
    const dash2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dash2.setAttribute('cx','60'); dash2.setAttribute('cy','26');
    dash2.setAttribute('r','1.8');
    dash2.style.fill = 'rgba(255,100,30,.06)';
    svg.appendChild(dash2);

    // Golden hour sky reflection on dash — subtle warm wash
    const dashWarm = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    dashWarm.setAttribute('x','0'); dashWarm.setAttribute('y','22');
    dashWarm.setAttribute('width','100'); dashWarm.setAttribute('height','2');
    dashWarm.style.fill = 'rgba(255,100,30,.18)';
    svg.appendChild(dashWarm);

    scene.appendChild(svg);
  }

  // ── Phase 4: Glitter particles ──────────────────────────────
  _spawnGlitter(count, bright = false) {
    for (let i = 0; i < count; i++) {
      this._after(i * 18, () => {
        const g   = spawn(mk(`gh-glitter${bright && i % 5 === 0 ? ' gh-glitter--bright' : ''}`));
        const sz  = rnd(1.5, 4.5);
        const col = GLITTER_COLS[Math.floor(rnd(0, GLITTER_COLS.length))];
        const dur = rnd(4, 11);
        // Spread across the whole screen, concentrated in upper 65%
        const startX = rnd(0, 100);
        const startY = rnd(5, 85);
        g.style.cssText = `
          width:${sz}px;height:${sz}px;
          left:${startX}%;top:${startY}%;
          --gc:${col};
          --gg:${sz + 1}px;
          --gd:${dur}s;
          --gly:${i * 18}ms;
          --gx:${rnd(-5,5)}vw;
          --gy:${rnd(-3,3)}vh;
          --gdx:${rnd(-12,12)}vw;
          --gdy:${rnd(5,20)}vh;
          --gop:${rnd(0.35, bright ? 0.85 : 0.65)};
          --gsd:${rnd(0.8,2)}s;
        `;
        this._after((dur + 0.4) * 1000 + i * 18, () => g.remove());
      });
    }
  }

  // ── Sentences ────────────────────────────────────────────────
  _showSentence(text, msPerWord, hold) {
    const container = spawn(mk('gh-sentence'));
    const words     = text.split(' ');

    words.forEach((word, i) => {
      const span = document.createElement('span');
      span.className = 'gh-word';
      span.textContent = word + (i < words.length - 1 ? '\u00A0' : '');
      span.style.setProperty('--dly', `${i * msPerWord}ms`);
      span.style.setProperty('--dur', `${WORD_FADE_MS}ms`);
      container.appendChild(span);
    });

    const lastIn = (words.length - 1) * msPerWord + WORD_FADE_MS;
    this._after(lastIn + hold, () => {
      container.style.transition = `opacity ${SENTENCE_FADE_MS}ms ease, transform ${SENTENCE_FADE_MS}ms ease`;
      container.style.opacity    = '0';
      container.style.transform  = 'translateX(-50%) translateY(-8px)';
      this._after(SENTENCE_FADE_MS + 60, () => container.remove());
    });
  }

  // ── Label ────────────────────────────────────────────────────
  _spawnLabel() {
    const label = spawn(mk('gh-label'));
    const main  = document.createElement('div');
    main.className   = 'gh-label-main';
    main.textContent = 'T H E   G O L D E N   H O U R';
    const sub   = document.createElement('div');
    sub.className    = 'gh-label-sub';
    sub.textContent  = '1 / 800,000  ·  THE HOUR THAT NEVER QUITE ENDS';
    label.appendChild(main);
    label.appendChild(sub);
    this._after(11200, () => label.remove());
  }

  // ── "YOU WERE SOMEONE'S WHOLE SKY." typewriter ──────────────
  // Slowest typewriter in the game — each word placed with care.
  // Silent — no chime. The golden hour doesn't need to announce itself.
  _spawnTypewriter() {
    const el   = spawn(mk('gh-typewriter'));
    const TEXT = "YOU WERE SOMEONE'S WHOLE SKY.";
    const cur  = document.createElement('span');
    cur.className = 'gh-cursor';
    el.appendChild(cur);

    let idx = 0;
    const type = () => {
      if (this.stopped || !el.isConnected) return;
      if (idx < TEXT.length) {
        el.insertBefore(document.createTextNode(TEXT[idx]), cur);
        idx++;
        const ch = TEXT[idx - 1];
        const delay = ch === '.' ? 1100           // final period — a held breath
                    : ch === '\'' ? 80             // apostrophe — quick
                    : ch === ' ' ? 280             // spaces are slow — savouring
                    : Math.random() > .85 ? 240 + Math.random() * 200
                    : 160 + Math.random() * 60;
        this._timers.push(setTimeout(type, delay));
      } else {
        this._after(3500, () => cur.remove());
      }
    };
    // Long opening pause — the sky has just peaked
    this._timers.push(setTimeout(type, 1400));
    this._after(10400, () => el.remove());
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

  // Road ambience — low-pass filtered noise, barely audible
  _sfxRoadHum() {
    const ctx = this._audio();
    if (!ctx) return;
    try {
      // F2 + C3 perfect fifth drone — warm, open, sustained
      const drone1 = ctx.createOscillator();
      const drone2 = ctx.createOscillator();
      const g1 = ctx.createGain();
      const g2 = ctx.createGain();
      drone1.connect(g1); g1.connect(ctx.destination);
      drone2.connect(g2); g2.connect(ctx.destination);
      drone1.type = 'sine'; drone1.frequency.value = 87.3;   // F2
      drone2.type = 'sine'; drone2.frequency.value = 130.8;  // C3
      const t = ctx.currentTime;
      g1.gain.setValueAtTime(0, t);
      g1.gain.linearRampToValueAtTime(0.065, t + 4);
      g1.gain.setValueAtTime(0.065, t + 26);
      g1.gain.linearRampToValueAtTime(0, t + 34);
      g2.gain.setValueAtTime(0, t);
      g2.gain.linearRampToValueAtTime(0.04, t + 5);
      g2.gain.setValueAtTime(0.04, t + 26);
      g2.gain.linearRampToValueAtTime(0, t + 34);
      drone1.start(t); drone1.stop(t + 35);
      drone2.start(t); drone2.stop(t + 35);
      this._droneNode = drone1;

      // Road noise — bandpass 80–300 Hz, quiet rumble
      const bufLen = ctx.sampleRate * 35;
      const buf    = ctx.createBuffer(1, bufLen, ctx.sampleRate);
      const data   = buf.getChannelData(0);
      for (let k = 0; k < bufLen; k++) data[k] = Math.random() * 2 - 1;
      const src  = ctx.createBufferSource(); src.buffer = buf;
      const bp   = ctx.createBiquadFilter();
      bp.type    = 'bandpass'; bp.frequency.value = 180; bp.Q.value = 0.4;
      const ng   = ctx.createGain();
      src.connect(bp); bp.connect(ng); ng.connect(ctx.destination);
      ng.gain.setValueAtTime(0, t);
      ng.gain.linearRampToValueAtTime(0.018, t + 3);
      ng.gain.setValueAtTime(0.018, t + 28);
      ng.gain.linearRampToValueAtTime(0, t + 34);
      src.start(t); src.stop(t + 35);
    } catch(e) {}
  }

  _stopDrone() {
    try { if (this._droneNode) { this._droneNode.stop(); this._droneNode = null; } } catch(e) {}
  }

  // Pentatonic glimmer chimes — catching the light
  // C5, E5, G5, A5, C6 — randomly every 1.5–3s
  _startGlimmerChimes() {
    if (this.stopped) return;
    const PENTA = [523.3, 659.3, 784.0, 880.0, 1046.5]; // C5 E5 G5 A5 C6

    const chime = () => {
      if (this.stopped) return;
      const ctx = this._audio();
      if (ctx) {
        const t    = ctx.currentTime;
        const freq = PENTA[Math.floor(rnd(0, PENTA.length))];
        // Soft bell — sine with fast attack, slow decay
        this._beep(ctx, t, freq, rnd(0.8, 1.8), rnd(0.025, 0.05), 'sine');
        // Subtle octave shimmer
        if (Math.random() > 0.5) {
          this._beep(ctx, t + rnd(0.03, 0.12), freq * 2, rnd(0.4, 1.0), 0.012, 'sine');
        }
      }
      const nextIn = rnd(1200, 3000);
      this._chimeId = setTimeout(chime, nextIn);
      this._timers.push(this._chimeId);
    };
    chime();
  }

  _stopChimes() {
    if (this._chimeId) { clearTimeout(this._chimeId); this._chimeId = null; }
  }

  // Fmaj7 sky bloom — F3+A3+C4+E4 — golden and warm
  _sfxBloom() {
    const ctx = this._audio();
    if (!ctx) return;
    const t = ctx.currentTime;
    // Fmaj7: F3=174.6, A3=220, C4=261.6, E4=329.6
    [
      [174.6, 0.00, 3.5, 0.10],
      [220.0, 0.06, 3.2, 0.09],
      [261.6, 0.12, 2.9, 0.08],
      [329.6, 0.18, 2.6, 0.07],
      [523.3, 0.30, 2.0, 0.04],  // F5 shimmer
    ].forEach(([f, off, dur, vol]) => {
      this._beep(ctx, t + off, f, dur, vol, 'sine');
    });

    // Bass: F2
    this._beep(ctx, t, 87.3, 4.5, 0.09, 'sine');

    // Warm noise shimmer — very brief, bandpass centred at 4000 Hz
    try {
      const bufLen = Math.floor(ctx.sampleRate * 0.2);
      const buf    = ctx.createBuffer(1, bufLen, ctx.sampleRate);
      const d      = buf.getChannelData(0);
      for (let k = 0; k < bufLen; k++) d[k] = (Math.random()*2-1) * Math.pow(1-k/bufLen, 2.2);
      const src  = ctx.createBufferSource(); src.buffer = buf;
      const bp   = ctx.createBiquadFilter();
      bp.type    = 'bandpass'; bp.frequency.value = 3800; bp.Q.value = 0.8;
      const gN   = ctx.createGain();
      src.connect(bp); bp.connect(gN); gN.connect(ctx.destination);
      gN.gain.setValueAtTime(0.09, t); gN.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
      src.start(t); src.stop(t + 0.3);
    } catch(e) {}
  }
}