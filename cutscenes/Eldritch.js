// cutscenes/Eldritch.js
// ═══════════════════════════════════════════════════════════════
//  E L D R I T C H  —  1 / 50,000
//  Hybrid: DOM/CSS + canvas particle engine
//
//  "That is not dead which can eternal lie,
//   And with strange aeons even death may die."
//                                  — H.P. Lovecraft
//
//  Phase 0  (0ms)    : Deep void — breathing radial pulse + vignette
//  Phase 1  (400ms)  : 7 reality cracks fracture the screen
//  Phase 2  (1000ms) : The Eye opens — eyelid reveal, pupil watches
//  Phase 3  (1600ms) : 12 tentacles writhe from the cracks
//  Phase 4  (2400ms) : Non-Euclidean geometry manifests
//  Phase 5  (3000ms) : 80 madness symbol particles explode
//  Phase 6  (3600ms) : Void whispers drift across screen
//  Phase 7  (4200ms) : 6 reality distortion waves
//  Phase 8  (5000ms) : Horror silhouette rises from below
//  Phase 9  (5800ms) : Sanity drain — concentric rings contract
//  Phase 10 (6500ms) : 8 runic symbols orbit center
//  Phase 11 (7200ms) : Canvas — purple ray bursts + particle storm
//  Phase 12 (8000ms) : ELDRITCH label + 5 expanding aura rings
//  Phase 13 (9500ms) : "IT HAS AWAKENED" typewriter beneath
//  Phase 14 (13500ms): Void fades
//  Phase 15 (16000ms): Resolve
// ═══════════════════════════════════════════════════════════════

import { ParticleBurst, ContinuousParticles } from '../effects/ParticleBurst.js';
import { GlowOverlay, RayBurst }               from '../effects/GlowOverlay.js';

// ── Palette ───────────────────────────────────────────────────
const V1 = '#8b2be2';              // eldritch violet
const V2 = '#4b0082';              // deep indigo
const V3 = '#c084fc';              // pale violet
const CR = '#ff0066';              // crimson eye
const V_GLOW = 'rgba(139,43,226,0.9)';
const V2_GLOW = 'rgba(75,0,130,0.7)';

// Eldritch symbol pools
const MADNESS_SYMBOLS = '⊗⊕⊖⊘⊙⊚⊛⊜⊝◈◉◊○●◐◑◒◓☉⚙✦✧⊹⋆⌘⌥⌦⎔⏣⏺⎊⎈⎇⎃⌬⌭⌮';
const RUNES = ['ᚠ','ᚢ','ᚦ','ᚨ','ᚱ','ᚲ','ᚷ','ᚹ','ᚺ','ᚾ','ᛁ','ᛃ','ᛇ','ᛈ','ᛉ','ᛊ'];
const WHISPERS = [
  "Ph'nglui mglw'nafh...",
  'The stars are right...',
  'Ia! Ia! Shub-Niggurath!',
  'Beyond the veil...',
  'What mortal eyes cannot see...',
  'In strange aeons even death may die...',
  'The old ones rise...',
  'Forbidden knowledge...',
  'Cosmic truth unveiled...',
  'That which eternal lies...',
  'Your sanity fades...',
  'The void has always been watching...',
];

// ── CSS injected once ─────────────────────────────────────────
const CSS = `
/* ── Phase 0: Deep void ── */
.el-void {
  position:fixed;inset:0;
  background:radial-gradient(circle at 50% 50%,#0a0015 0%,#000 100%);
  z-index:9990;pointer-events:none;
  opacity:1;transition:opacity 1.6s ease;
}
.el-void--fade { opacity:0; }

/* Void breath — subtle radial pulse */
.el-void::after {
  content:'';position:absolute;inset:0;
  background:radial-gradient(circle at 50% 50%,
    rgba(75,0,130,.25) 0%,transparent 60%);
  animation:elBreath 2.2s ease-in-out infinite;
}
@keyframes elBreath {
  0%,100%{transform:scale(1);opacity:.4}
  50%    {transform:scale(1.18);opacity:.9}
}

/* Vignette — crawls in from edges */
.el-vignette {
  position:fixed;inset:0;pointer-events:none;z-index:10020;
  background:radial-gradient(circle at 50% 50%,
    transparent 0%,transparent 35%,
    rgba(10,0,21,.65) 75%,rgba(0,0,0,.92) 100%);
  animation:elVignetteIn 3s ease-out forwards,
            elVignettePulse 2.5s 3s ease-in-out infinite;
}
@keyframes elVignetteIn {
  from{opacity:0} to{opacity:1}
}
@keyframes elVignettePulse {
  0%,100%{opacity:.75} 50%{opacity:1}
}

/* ── Phase 1: Reality cracks ── */
.el-crack {
  position:fixed;height:4px;
  border-radius:2px;pointer-events:none;z-index:9993;
  background:linear-gradient(90deg,
    transparent 0%,
    rgba(139,43,226,.6) 15%,
    rgba(192,132,252,1) 50%,
    rgba(139,43,226,.6) 85%,
    transparent 100%);
  box-shadow:
    0 0 18px 5px rgba(139,43,226,.8),
    0 0 40px 10px rgba(75,0,130,.5),
    0 0 2px 1px rgba(255,255,255,.6);
  transform-origin:center center;
  animation:elCrackSplit ease-out forwards;
}
@keyframes elCrackSplit {
  0%  {opacity:0;transform:rotate(var(--cr)) scaleX(0)}
  20% {opacity:1;transform:rotate(var(--cr)) scaleX(.35)}
  55% {opacity:1;transform:rotate(var(--cr)) scaleX(1)}
  100%{opacity:.55;transform:rotate(var(--cr)) scaleX(1)}
}

/* Light-bleed node at each crack origin */
.el-crack-node {
  position:fixed;width:12px;height:12px;border-radius:50%;
  pointer-events:none;z-index:9994;
  background:radial-gradient(circle,rgba(192,132,252,1) 0%,rgba(139,43,226,.5) 60%,transparent 100%);
  box-shadow:0 0 20px 8px rgba(139,43,226,.7);
  animation:elNodePulse 1.4s ease-in-out infinite;
}
@keyframes elNodePulse {
  0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.9}
  50%    {transform:translate(-50%,-50%) scale(1.8);opacity:.5}
}

/* ── Phase 2: The Eye ── */
.el-eye-container {
  position:fixed;left:50%;top:50%;
  transform:translate(-50%,-50%);
  pointer-events:none;z-index:9997;
  width:280px;height:140px;
  overflow:hidden;
  /* Eyelid clip — opens by growing the clip-path */
  clip-path:ellipse(140px 0px at 50% 50%);
  animation:elEyelidOpen 2.2s cubic-bezier(.2,1,.3,1) 1s forwards;
}
@keyframes elEyelidOpen {
  from{clip-path:ellipse(140px 0px at 50% 50%)}
  to  {clip-path:ellipse(140px 70px at 50% 50%)}
}

.el-eye-outer {
  position:absolute;inset:0;border-radius:50%;
  background:radial-gradient(ellipse at 50% 50%,
    rgba(75,0,130,.9) 0%,rgba(25,0,51,.98) 70%,rgba(0,0,0,1) 100%);
  box-shadow:
    0 0 60px 20px rgba(139,43,226,.7),
    0 0 120px 40px rgba(75,0,130,.5),
    inset 0 0 50px rgba(139,43,226,.4);
}

.el-eye-iris {
  position:absolute;top:50%;left:50%;
  width:100px;height:100px;border-radius:50%;
  transform:translate(-50%,-50%);
  background:conic-gradient(
    rgba(139,43,226,.9) 0%,rgba(75,0,130,.7) 25%,
    rgba(139,43,226,.9) 50%,rgba(25,0,51,.8) 75%,rgba(139,43,226,.9) 100%);
  box-shadow:0 0 30px rgba(139,43,226,.8),inset 0 0 20px rgba(0,0,0,.6);
  animation:elIrisSpin 4s linear infinite;
}
@keyframes elIrisSpin { to{transform:translate(-50%,-50%) rotate(360deg)} }

.el-eye-pupil {
  position:absolute;top:50%;left:50%;
  width:48px;height:56px;border-radius:50%;
  transform:translate(-50%,-50%);
  background:radial-gradient(circle at 35% 35%,
    rgba(255,0,102,.9) 0%,rgba(139,0,226,1) 45%,rgba(0,0,0,1) 100%);
  box-shadow:
    0 0 20px rgba(255,0,102,.8),
    0 0 50px rgba(139,0,226,.6);
  animation:elPupilDart 1.8s ease-in-out infinite;
}
@keyframes elPupilDart {
  0%  {transform:translate(-50%,-50%) translate(0,0)}
  22% {transform:translate(-50%,-50%) translate(-14px,-8px)}
  44% {transform:translate(-50%,-50%) translate(12px,6px)}
  66% {transform:translate(-50%,-50%) translate(-8px,12px)}
  88% {transform:translate(-50%,-50%) translate(10px,-10px)}
  100%{transform:translate(-50%,-50%) translate(0,0)}
}

/* Blood vessels radiating from eye */
.el-eye-vein {
  position:absolute;top:50%;left:50%;
  height:1px;pointer-events:none;
  transform-origin:0 50%;
  background:linear-gradient(90deg,rgba(255,0,102,.5) 0%,transparent 100%);
  animation:elVeinPulse 1.5s ease-in-out infinite alternate;
}
@keyframes elVeinPulse { from{opacity:.3} to{opacity:.9} }

/* ── Phase 3: Tentacles ── */
.el-tentacle {
  position:fixed;pointer-events:none;z-index:9993;
  transform-origin:var(--tx) var(--ty);
  animation:elTentacleEmerge ease-out forwards,
            elTentacleWave 1.2s ease-in-out infinite;
}
@keyframes elTentacleEmerge {
  from{opacity:0;transform:rotate(var(--ta)) scale(0)}
  to  {opacity:.88;transform:rotate(var(--ta)) scale(1)}
}
@keyframes elTentacleWave {
  0%,100%{transform:rotate(var(--ta)) skewX(0deg) scaleY(1)}
  30%    {transform:rotate(calc(var(--ta) + 8deg)) skewX(4deg) scaleY(1.04)}
  65%    {transform:rotate(calc(var(--ta) - 6deg)) skewX(-3deg) scaleY(.97)}
}
.el-tentacle-inner {
  width:var(--tw);height:var(--tl);border-radius:50% 50% 40% 40%;
  background:linear-gradient(180deg,
    rgba(139,43,226,.95) 0%,rgba(75,0,130,.85) 50%,rgba(25,0,51,.6) 100%);
  box-shadow:
    0 0 12px 4px rgba(139,43,226,.6),
    inset 0 0 8px rgba(75,0,130,.4);
  clip-path:polygon(20% 0%,80% 0%,100% 100%,0% 100%); /* tapered */
}

/* ── Phase 4: Non-Euclidean geometry ── */
.el-geo-wrap {
  position:fixed;left:50%;top:50%;
  transform:translate(-50%,-50%);
  pointer-events:none;z-index:9994;
  width:0;height:0;
  animation:elGeoReveal 2.4s ease-in-out forwards;
}
@keyframes elGeoReveal {
  0%  {opacity:0;filter:blur(24px)}
  35% {opacity:1;filter:blur(0)}
  85% {opacity:1;filter:blur(0)}
  100%{opacity:0;filter:blur(12px)}
}
.el-polygon {
  position:absolute;top:0;left:0;border-radius:2px;
  border:2px solid rgba(139,43,226,.8);
  box-shadow:
    0 0 18px rgba(139,43,226,.7),
    0 0 40px rgba(75,0,130,.4),
    inset 0 0 16px rgba(139,43,226,.2);
  animation:elPolygonSpin linear infinite;
}
/* Alt polygon rotates opposite */
.el-polygon--rev { animation-direction:reverse; }

/* ── Phase 5: Madness particles ── */
.el-madness {
  position:fixed;font-family:'Georgia',serif;font-style:italic;
  color:rgba(139,43,226,.95);
  text-shadow:0 0 8px rgba(139,43,226,.9),0 0 20px rgba(75,0,130,.6);
  pointer-events:none;z-index:9992;
  animation:elMadnessFloat ease-out forwards;
}
@keyframes elMadnessFloat {
  0%  {opacity:1;transform:translate(0,0) rotate(0deg) scale(1)}
  100%{opacity:0;transform:translate(var(--mx),var(--my)) rotate(var(--mr)) scale(.4)}
}

/* ── Phase 6: Void whispers ── */
.el-whisper {
  position:fixed;font-family:'Georgia','Times New Roman',serif;
  font-style:italic;font-size:16px;letter-spacing:.12em;
  color:rgba(139,43,226,.75);
  text-shadow:0 0 12px rgba(139,43,226,.7),0 0 30px rgba(75,0,130,.4);
  pointer-events:none;z-index:9995;white-space:nowrap;
  animation:elWhisperDrift ease-out forwards;
}
@keyframes elWhisperDrift {
  0%  {opacity:0;transform:translateX(var(--wx0))}
  18% {opacity:.85}
  78% {opacity:.85}
  100%{opacity:0;transform:translateX(var(--wx1))}
}

/* ── Phase 7: Reality distortions ── */
.el-distortion {
  position:fixed;inset:0;pointer-events:none;z-index:9993;
  mix-blend-mode:screen;
  animation:elDistort ease-out forwards;
}
@keyframes elDistort {
  0%  {opacity:0;transform:scale(.3)}
  35% {opacity:1;transform:scale(1)}
  100%{opacity:0;transform:scale(2.2)}
}

/* ── Phase 8: Horror silhouette ── */
.el-horror {
  position:fixed;left:50%;bottom:-60px;
  transform:translateX(-50%);
  pointer-events:none;z-index:9996;
  animation:elHorrorRise 2.8s cubic-bezier(.2,.8,.3,1) forwards;
}
@keyframes elHorrorRise {
  0%  {opacity:0;transform:translateX(-50%) translateY(80px) scale(.7);filter:blur(20px)}
  30% {opacity:1;filter:blur(3px)}
  75% {transform:translateX(-50%) translateY(-20px) scale(1.05);filter:blur(2px)}
  100%{opacity:0;transform:translateX(-50%) translateY(-60px) scale(.85);filter:blur(14px)}
}

/* ── Phase 9: Sanity drain rings ── */
.el-sanity-ring {
  position:fixed;left:50%;top:50%;border-radius:50%;
  border:1px solid rgba(139,43,226,.6);
  pointer-events:none;z-index:9995;
  transform:translate(-50%,-50%);
  box-shadow:0 0 12px rgba(139,43,226,.4);
  animation:elSanityContract ease-in forwards;
}
@keyframes elSanityContract {
  0%  {opacity:0;transform:translate(-50%,-50%) scale(3)}
  20% {opacity:.8}
  85% {opacity:.6}
  100%{opacity:0;transform:translate(-50%,-50%) scale(0)}
}

/* ── Phase 10: Runic orbit ── */
.el-rune {
  position:fixed;left:50%;top:50%;
  font-size:44px;font-weight:700;
  font-family:'Georgia','Times New Roman',serif;
  color:rgba(139,43,226,.95);
  text-shadow:
    0 0 16px rgba(139,43,226,1),
    0 0 40px rgba(75,0,130,.8),
    0 0 80px rgba(139,43,226,.4);
  pointer-events:none;z-index:9995;
  transform-origin:0 0;
  animation:elRuneOrbit linear forwards, elRuneSpin linear infinite;
}
@keyframes elRuneOrbit {
  0%  {opacity:0}
  12% {opacity:1}
  85% {opacity:1}
  100%{opacity:0}
}
@keyframes elRuneSpin {
  to{transform:rotate(calc(var(--orbit-angle) + 360deg)) translate(var(--orbit-r),0) rotate(-360deg)}
}

/* ── Phase 12: ELDRITCH label ── */
.el-label {
  position:fixed;left:50%;top:50%;
  transform:translate(-50%,-50%);
  pointer-events:none;z-index:10012;
  display:flex;flex-direction:column;align-items:center;gap:14px;
  animation:elLabelReveal 5.5s ease forwards;
}
@keyframes elLabelReveal {
  0%  {opacity:0;transform:translate(-50%,-50%) scale(.4) rotateX(70deg);filter:blur(18px)}
  12% {opacity:1;transform:translate(-50%,-50%) scale(1.04) rotateX(0deg);filter:blur(0)}
  18% {transform:translate(-50%,-50%) scale(1) rotateX(0deg)}
  82% {opacity:1}
  100%{opacity:0;transform:translate(-50%,-50%) scale(1.06)}
}

.el-label-main {
  font-family:'Georgia','Times New Roman',serif;
  font-size:52px;font-weight:700;font-style:italic;
  letter-spacing:14px;color:${V3};
  text-shadow:
    0 0 12px ${V1},0 0 30px ${V1},
    0 0 70px ${V2},0 0 140px ${V2};
  border:2px solid ${V1};
  padding:14px 42px;
  background:rgba(0,0,0,.9);
  box-shadow:
    0 0 30px ${V1},0 0 60px ${V2},
    inset 0 0 30px rgba(139,43,226,.15);
  animation:elLabelPulse 1.4s ease-in-out infinite alternate;
}
@keyframes elLabelPulse {
  from{box-shadow:0 0 30px ${V1},0 0 60px ${V2},inset 0 0 30px rgba(139,43,226,.15)}
  to  {box-shadow:0 0 55px ${V1},0 0 110px ${V2},0 0 200px rgba(75,0,130,.3),inset 0 0 55px rgba(139,43,226,.28)}
}

.el-label-sub {
  font-family:'Georgia',serif;font-style:italic;
  font-size:12px;letter-spacing:6px;
  color:rgba(139,43,226,.65);
  text-shadow:0 0 10px rgba(139,43,226,.5);
}

/* Phase 13: "IT HAS AWAKENED" typewriter */
.el-awakened {
  position:fixed;left:50%;top:calc(50% + 80px);
  transform:translateX(-50%);
  pointer-events:none;z-index:10013;
  font-family:'Georgia',serif;font-style:italic;
  font-size:18px;letter-spacing:8px;color:${CR};
  text-shadow:0 0 10px ${CR},0 0 30px rgba(255,0,102,.5);
  white-space:nowrap;
  animation:elAwakenedReveal 4s ease forwards;
}
@keyframes elAwakenedReveal {
  0%  {opacity:0} 8%{opacity:1} 80%{opacity:1} 100%{opacity:0}
}
.el-awakened-cursor {
  display:inline-block;width:2px;height:1em;
  background:${CR};margin-left:3px;vertical-align:middle;
  animation:elCursorBlink .7s step-end infinite;
}
@keyframes elCursorBlink { 0%,100%{opacity:1} 50%{opacity:0} }

/* Aura rings */
.el-aura {
  position:fixed;left:50%;top:50%;border-radius:50%;
  transform:translate(-50%,-50%);
  pointer-events:none;z-index:9991;
  animation:elAuraExpand ease-out forwards;
}
@keyframes elAuraExpand {
  0%  {opacity:1;transform:translate(-50%,-50%) scale(0)}
  70% {opacity:.7}
  100%{opacity:0;transform:translate(-50%,-50%) scale(1)}
}

/* ── Body shakes ── */
@keyframes elBodyShake {
  0%,100%{transform:translate(0,0)}
  10%{transform:translate(-6px,4px)} 25%{transform:translate(6px,-5px)}
  40%{transform:translate(-5px,6px)} 55%{transform:translate(5px,-4px)}
  70%{transform:translate(-4px,4px)} 85%{transform:translate(3px,-3px)}
}
body.el-shake { animation:elBodyShake .6s ease-out; }

@keyframes elBodyShakeHeavy {
  0%,100%{transform:translate(0,0)}
  6% {transform:translate(-16px,12px)} 18%{transform:translate(16px,-14px)}
  30%{transform:translate(-14px,16px)} 42%{transform:translate(13px,-12px)}
  54%{transform:translate(-12px,13px)} 66%{transform:translate(10px,-10px)}
  78%{transform:translate(-8px,8px)}   90%{transform:translate(6px,-5px)}
}
body.el-shake-heavy { animation:elBodyShakeHeavy .9s ease-out; }

@keyframes elBodyShakeUltimate {
  0%,100%{transform:translate(0,0)}
  5% {transform:translate(-22px,18px)} 15%{transform:translate(22px,-20px)}
  25%{transform:translate(-20px,22px)} 35%{transform:translate(19px,-18px)}
  45%{transform:translate(-18px,20px)} 55%{transform:translate(16px,-16px)}
  65%{transform:translate(-14px,15px)} 75%{transform:translate(12px,-12px)}
  85%{transform:translate(-10px,10px)} 95%{transform:translate(7px,-7px)}
}
body.el-shake-ultimate { animation:elBodyShakeUltimate 1.1s ease-out; }
`;

function injectCSS() {
  if (document.getElementById('el-styles')) return;
  const s = document.createElement('style');
  s.id = 'el-styles';
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
function rndChar(str) { return str[Math.floor(Math.random() * str.length)]; }

// ══════════════════════════════════════════════════════════════
export class Eldritch {
  constructor(engine, rarity) {
    this.engine  = engine;
    this.rarity  = rarity;
    this.stopped = false;
    this._timers = [];
    this._awakenedEl = null;
    this.fx = {
      shakeIntensity: 60,
      particleCount:  240,
      rayCount:       44,
      ringCount:      9,
      glowMaxAlpha:   0.95,
      crackCount:     7,
      tentacleCount:  12,
      madnessCount:   80,
      whisperCount:   12,
      distortCount:   6,
      runeCount:      8,
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

      // ── Phase 0: Deep void + vignette ──────────────────────
      const voidEl = spawn(mk('el-void'));
      spawn(mk('el-vignette'));
      // Void fades near end of cutscene
      this._after(13500, () => voidEl.classList.add('el-void--fade'));
      this._after(15200, () => voidEl.remove());

      // ── Phase 1: Reality cracks ────────────────────────────
      this._after(400, () => {
        this._spawnCracks(this.fx.crackCount);
        document.body.classList.add('el-shake');
        this._after(640, () => document.body.classList.remove('el-shake'));
        this.engine.shake(this.fx.shakeIntensity * 0.3);
      });

      // ── Phase 2: The Eye opens ─────────────────────────────
      this._after(1000, () => this._spawnEye());

      // ── Phase 3: Tentacles writhe ──────────────────────────
      this._after(1600, () => {
        this._spawnTentacles(this.fx.tentacleCount);
        document.body.classList.add('el-shake-heavy');
        this._after(940, () => document.body.classList.remove('el-shake-heavy'));
        this.engine.shake(this.fx.shakeIntensity * 0.5);
      });

      // ── Phase 4: Impossible geometry ───────────────────────
      this._after(2400, () => this._spawnGeometry());

      // ── Phase 5: Madness particles ─────────────────────────
      this._after(3000, () => this._spawnMadness(this.fx.madnessCount));

      // ── Phase 6: Void whispers ─────────────────────────────
      this._after(3600, () => this._spawnWhispers(this.fx.whisperCount));

      // ── Phase 7: Reality distortions ──────────────────────
      this._after(4200, () => {
        this._spawnDistortions(this.fx.distortCount);
        document.body.classList.add('el-shake');
        this._after(430, () => document.body.classList.remove('el-shake'));
      });

      // ── Phase 8: Horror silhouette rises ──────────────────
      this._after(5000, () => {
        this._spawnHorror();
        document.body.classList.add('el-shake-heavy');
        this._after(650, () => document.body.classList.remove('el-shake-heavy'));
        this.engine.shake(this.fx.shakeIntensity * 0.6);
      });

      // ── Phase 9: Sanity drain rings ────────────────────────
      this._after(5800, () => this._spawnSanityRings(8));

      // ── Phase 10: Runic orbit ─────────────────────────────
      this._after(6500, () => this._spawnRunes(this.fx.runeCount));

      // ── Phase 11: Canvas — ray bursts + particle storm ────
      this._after(7200, () => {
        // Primary violet ray burst
        this.engine.addEffect(new RayBurst({
          color:    V1,
          duration: 9000,
          maxAlpha: 0.17,
          rayCount: this.fx.rayCount,
          rotSpeed: 0.5,
        }));
        // Counter-rotating pale layer
        this.engine.addEffect(new RayBurst({
          color:    V3,
          duration: 8500,
          maxAlpha: 0.08,
          rayCount: Math.floor(this.fx.rayCount * 0.55),
          rotSpeed: -0.28,
        }));
        // Crimson accent rays
        this.engine.addEffect(new RayBurst({
          color:    CR,
          duration: 7000,
          maxAlpha: 0.06,
          rayCount: Math.floor(this.fx.rayCount * 0.3),
          rotSpeed: 0.9,
        }));

        // Deep eldritch glow
        this.engine.addEffect(new GlowOverlay({
          color:      V_GLOW,
          duration:   9000,
          maxAlpha:   this.fx.glowMaxAlpha,
          fadeIn:     0.04,
          fadeOut:    0.18,
          radial:     true,
          pulseSpeed: 1.8,
        }));

        // Three staggered particle bursts
        [[V1, 1.0], [V3, 0.8], [CR, 0.5]].forEach(([col, scale], i) => {
          this._after(i * 200, () => {
            this.engine.addEffect(new ParticleBurst(0.5, 0.5, {
              count:    Math.floor(this.fx.particleCount * scale),
              color:    col,
              minSpeed: 120 + i * 70,
              maxSpeed: 420 + i * 60,
              minSize:  2,
              maxSize:  9,
              gravity:  40,
              trail:    this.fx.trailEnabled,
              glow:     true,
              duration: 6500,
              type:     i === 2 ? 'star' : 'spark',
            }));
          });
        });

        // Continuous rising violet nebula from center
        this.engine.addEffect(new ContinuousParticles({
          ox:        0.5,
          oy:        0.5,
          color:     V1,
          minSpeed:  50,
          maxSpeed:  200,
          gravity:   -60,
          upBias:    120,
          spread:    Math.PI * 2,
          minSize:   1.5,
          maxSize:   6,
          trail:     true,
          glow:      true,
          spawnRate: 0.028,
          duration:  8000,
          type:      'star',
        }));

        // Crimson embers drifting down
        this.engine.addEffect(new ContinuousParticles({
          ox:        w => Math.random() * w,
          oy:        0,
          color:     CR,
          minSpeed:  40,
          maxSpeed:  130,
          gravity:   100,
          spread:    0.6,
          angle:     Math.PI / 2,
          minSize:   1,
          maxSize:   3.5,
          glow:      true,
          spawnRate: 0.02,
          duration:  7500,
        }));

        // Ultimate shake — the heaviest in the game
        document.body.classList.add('el-shake-ultimate');
        this._after(1150, () => document.body.classList.remove('el-shake-ultimate'));
        this.engine.shake(this.fx.shakeIntensity);
      });

      // ── Phase 12: ELDRITCH label + aura rings ─────────────
      this._after(8000, () => {
        const label = spawn(mk('el-label'));
        const main  = document.createElement('div');
        main.className = 'el-label-main';
        main.textContent = 'E L D R I T C H';
        const sub = document.createElement('div');
        sub.className = 'el-label-sub';
        sub.textContent = '[ 1 / 50,000 · THE OLD ONES WAKE ]';
        label.appendChild(main);
        label.appendChild(sub);
        this._after(5200, () => label.remove());

        // Staggered expanding aura rings
        for (let i = 0; i < this.fx.auraCount; i++) {
          this._after(i * 180, () => {
            const aura = spawn(mk('el-aura'));
            const sz   = 80 + i * 60;
            const col  = i % 2 === 0 ? V1 : V2;
            aura.style.cssText = `
              width:${sz}px;height:${sz}px;
              background:radial-gradient(circle,${col}55 0%,${col}22 50%,transparent 80%);
              box-shadow:0 0 ${30+i*15}px ${col},0 0 ${60+i*25}px ${V2_GLOW};
              animation-duration:${1.8+i*.3}s;
            `;
            this._after(2500, () => aura.remove());
          });
        }
      });

      // ── Phase 13: "IT HAS AWAKENED" typewriter ─────────────
      this._after(9500, () => this._spawnAwakened());

      // ── Phase 15: Resolve ──────────────────────────────────
      this._after(16000, () => {
        killSpawned();
        resolve();
      });
    });
  }

  stop() {
    this.stopped = true;
    this._timers.forEach(clearTimeout);
    this._timers = [];
    document.body.classList.remove('el-shake', 'el-shake-heavy', 'el-shake-ultimate');
    killSpawned();
  }

  // ── Reality cracks ───────────────────────────────────────────
  _spawnCracks(count) {
    const positions = [
      { x: '30%', y: '18%', angle: -28, len: '36vw' },
      { x: '58%', y: '28%', angle:  18, len: '42vw' },
      { x: '18%', y: '52%', angle: -12, len: '32vw' },
      { x: '72%', y: '62%', angle:  22, len: '38vw' },
      { x: '44%', y: '38%', angle:  -6, len: '30vw' },
      { x: '12%', y: '74%', angle:  34, len: '28vw' },
      { x: '78%', y: '44%', angle: -16, len: '34vw' },
    ];
    positions.slice(0, count).forEach((p, i) => {
      this._after(i * 90, () => {
        // Crack bar
        const crack = spawn(mk('el-crack'));
        crack.style.left            = p.x;
        crack.style.top             = p.y;
        crack.style.width           = p.len;
        crack.style.setProperty('--cr', p.angle + 'deg');
        crack.style.animationDuration = (.55 + i * .05) + 's';
        this._after(4000, () => crack.remove());

        // Glow node at origin
        const node = spawn(mk('el-crack-node'));
        node.style.left = p.x;
        node.style.top  = p.y;
        this._after(4000, () => node.remove());
      });
    });
  }

  // ── The Eye ──────────────────────────────────────────────────
  _spawnEye() {
    const container = spawn(mk('el-eye-container'));
    const outer     = document.createElement('div');
    outer.className = 'el-eye-outer';
    const iris      = document.createElement('div');
    iris.className  = 'el-eye-iris';
    const pupil     = document.createElement('div');
    pupil.className = 'el-eye-pupil';

    // Blood veins radiating outward
    for (let i = 0; i < 12; i++) {
      const vein = document.createElement('div');
      vein.className = 'el-eye-vein';
      const len  = 30 + Math.random() * 60;
      const rot  = i * 30 + Math.random() * 15;
      vein.style.cssText = `
        width:${len}px;
        transform:rotate(${rot}deg) translateX(30px);
        animation-delay:${Math.random() * .5}s;
        animation-duration:${1.2 + Math.random() * .8}s;
      `;
      outer.appendChild(vein);
    }

    outer.appendChild(iris);
    outer.appendChild(pupil);
    container.appendChild(outer);
    this._after(5500, () => container.remove());
  }

  // ── Tentacles ────────────────────────────────────────────────
  _spawnTentacles(count) {
    // Origins around the screen edges
    const origins = [
      { x:  '8%', y: '18%' }, { x: '92%', y: '22%' },
      { x: '12%', y: '68%' }, { x: '88%', y: '72%' },
      { x:  '3%', y: '48%' }, { x: '97%', y: '52%' },
      { x: '28%', y:  '5%' }, { x: '72%', y:  '5%' },
      { x: '22%', y: '95%' }, { x: '78%', y: '95%' },
      { x: '50%', y:  '2%' }, { x: '50%', y: '98%' },
    ];

    origins.slice(0, count).forEach((orig, i) => {
      this._after(i * 75, () => {
        const t = spawn(mk('el-tentacle'));

        // Angle pointing toward center
        const ox  = parseFloat(orig.x);
        const oy  = parseFloat(orig.y);
        const ang = Math.atan2(50 - oy, 50 - ox) * 180 / Math.PI;
        const len = 130 + Math.random() * 110;
        const wid = 22 + Math.random() * 24;

        t.style.left = orig.x;
        t.style.top  = orig.y;
        t.style.setProperty('--ta', ang + 'deg');
        t.style.setProperty('--tx', '0px');
        t.style.setProperty('--ty', '0px');
        t.style.setProperty('--tw', wid + 'px');
        t.style.setProperty('--tl', len + 'px');
        t.style.animationDuration        = (.7 + i * .04) + 's, ' + (1.1 + Math.random() * .5) + 's';
        t.style.animationDelay           = i * 60 + 'ms, ' + i * 60 + 'ms';
        t.style.animationIterationCount  = '1, infinite';

        const inner = document.createElement('div');
        inner.className = 'el-tentacle-inner';
        inner.style.setProperty('--tw', wid + 'px');
        inner.style.setProperty('--tl', len + 'px');
        t.appendChild(inner);

        this._after(3200, () => t.remove());
      });
    });
  }

  // ── Non-Euclidean geometry ───────────────────────────────────
  _spawnGeometry() {
    const wrap = spawn(mk('el-geo-wrap'));
    const configs = [
      { size: 220, sides: 5, rot:   0, rev: false, dur: 4.0 },
      { size: 165, sides: 7, rot:  25, rev: true,  dur: 3.2 },
      { size: 110, sides: 6, rot:  50, rev: false, dur: 2.5 },
      { size:  58, sides: 9, rot:  75, rev: true,  dur: 1.8 },
    ];
    configs.forEach((c, i) => {
      const poly = document.createElement('div');
      poly.className = 'el-polygon' + (c.rev ? ' el-polygon--rev' : '');
      poly.style.cssText = `
        width:${c.size}px;height:${c.size}px;
        margin-left:${-c.size/2}px;margin-top:${-c.size/2}px;
        clip-path:${this._polygonPath(c.sides)};
        transform:rotate(${c.rot}deg);
        animation-duration:${c.dur}s;
        animation-delay:${i * 0.2}s;
      `;
      wrap.appendChild(poly);
    });
    this._after(2500, () => wrap.remove());
  }

  _polygonPath(sides) {
    const pts = Array.from({ length: sides }, (_, i) => {
      const a = (i / sides) * Math.PI * 2;
      return `${50 + 50 * Math.cos(a)}% ${50 + 50 * Math.sin(a)}%`;
    });
    return `polygon(${pts.join(',')})`;
  }

  // ── Madness particles ────────────────────────────────────────
  _spawnMadness(count) {
    for (let i = 0; i < count; i++) {
      const p   = spawn(mk('el-madness'));
      p.textContent = rndChar(MADNESS_SYMBOLS);
      const sz  = 14 + Math.random() * 22;
      const ang = Math.random() * 360;
      const dist = 28 + Math.random() * 55;
      const mx  = Math.cos(ang * Math.PI / 180) * dist;
      const my  = Math.sin(ang * Math.PI / 180) * dist;
      const rot = Math.random() * 720 - 360;
      const dur = 1.1 + Math.random() * 1.2;
      p.style.fontSize = sz + 'px';
      p.style.left     = '50vw';
      p.style.top      = '50vh';
      p.style.setProperty('--mx', mx + 'vmin');
      p.style.setProperty('--my', my + 'vmin');
      p.style.setProperty('--mr', rot + 'deg');
      p.style.animationDuration = dur + 's';
      p.style.animationDelay   = Math.random() * 350 + 'ms';
      this._after((dur + .5) * 1000, () => p.remove());
    }
  }

  // ── Void whispers ────────────────────────────────────────────
  _spawnWhispers(count) {
    for (let i = 0; i < count; i++) {
      this._after(i * 195, () => {
        const w = spawn(mk('el-whisper'));
        w.textContent = WHISPERS[i % WHISPERS.length];
        const fromLeft = Math.random() > .5;
        w.style.top = (8 + Math.random() * 80) + 'vh';
        w.style.setProperty('--wx0', fromLeft ? '-28vw' : '28vw');
        w.style.setProperty('--wx1', fromLeft ?  '60vw' : '-60vw');
        w.style.left = fromLeft ? '-28vw' : 'auto';
        w.style.right = fromLeft ? 'auto' : '-28vw';
        w.style.animationDuration = (2.2 + Math.random() * .8) + 's';
        this._after(3200, () => w.remove());
      });
    }
  }

  // ── Reality distortions ──────────────────────────────────────
  _spawnDistortions(count) {
    for (let i = 0; i < count; i++) {
      this._after(i * 160, () => {
        const d = spawn(mk('el-distortion'));
        const x = 15 + Math.random() * 70;
        const y = 15 + Math.random() * 70;
        d.style.background = `radial-gradient(circle at ${x}% ${y}%,
          transparent 0%,rgba(139,43,226,.35) 28%,rgba(75,0,130,.5) 55%,transparent 100%)`;
        d.style.animationDuration = (.9 + Math.random() * .4) + 's';
        this._after(1400, () => d.remove());
      });
    }
  }

  // ── Horror silhouette ────────────────────────────────────────
  _spawnHorror() {
    const h = spawn(mk('el-horror'));
    h.style.cssText += `
      width:520px;height:440px;
      background:radial-gradient(ellipse at 50% 30%,
        rgba(139,43,226,.85) 0%,rgba(75,0,130,.65) 35%,
        rgba(25,0,51,.4) 65%,transparent 85%);
      border-radius:42% 58% 35% 65% / 55% 45% 55% 45%;
      box-shadow:
        0 0 100px 30px rgba(139,43,226,.7),
        0 0 200px 60px rgba(75,0,130,.4);
      filter:blur(3px);
    `;
    this._after(3000, () => h.remove());
  }

  // ── Sanity drain rings ───────────────────────────────────────
  _spawnSanityRings(count) {
    for (let i = 0; i < count; i++) {
      this._after(i * 140, () => {
        const ring = spawn(mk('el-sanity-ring'));
        const sz   = 60 + i * 70;
        ring.style.width            = sz + 'px';
        ring.style.height           = sz + 'px';
        ring.style.animationDuration = (1.8 + i * .2) + 's';
        ring.style.animationDelay   = i * 100 + 'ms';
        this._after(2600, () => ring.remove());
      });
    }
  }

  // ── Runic orbit ──────────────────────────────────────────────
  _spawnRunes(count) {
    const radius = '28vmin';
    for (let i = 0; i < count; i++) {
      this._after(i * 100, () => {
        const rune = spawn(mk('el-rune'));
        const angle = (i / count) * 360;
        rune.textContent = RUNES[i % RUNES.length];
        rune.style.setProperty('--orbit-angle', angle + 'deg');
        rune.style.setProperty('--orbit-r', radius);
        rune.style.transform = `rotate(${angle}deg) translate(${radius},0) rotate(-${angle}deg)`;
        rune.style.animationDuration      = '3s, ' + (3 + i * .1) + 's';
        rune.style.animationIterationCount = '1, infinite';
        this._after(4000, () => rune.remove());
      });
    }
  }

  // ── "IT HAS AWAKENED" typewriter ────────────────────────────
  _spawnAwakened() {
    const el = spawn(mk('el-awakened'));
    this._awakenedEl = el;
    const text = 'IT HAS AWAKENED';
    const cursor = document.createElement('span');
    cursor.className = 'el-awakened-cursor';
    el.appendChild(cursor);

    let idx = 0;
    const type = () => {
      if (this.stopped || !el.isConnected) return;
      if (idx < text.length) {
        el.insertBefore(document.createTextNode(text[idx]), cursor);
        idx++;
        const delay = 80 + (Math.random() > .85 ? 160 : 0);
        this._timers.push(setTimeout(type, delay));
      } else {
        // Done — remove cursor blink
        this._after(1800, () => cursor.remove());
      }
    };
    // Brief pause before typing starts
    this._timers.push(setTimeout(type, 400));
    this._after(4500, () => { el.remove(); this._awakenedEl = null; });
  }
}