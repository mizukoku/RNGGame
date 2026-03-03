// cutscenes/NightFall.js
// ═══════════════════════════════════════════════════════════════
//  N I G H T F A L L  —  1 / 900,000
//
//  The last rarity before the impossible.
//  You step outside. You look up.
//  Two hundred stars decide to exist at once.
//  The aurora has been waiting for an audience.
//  The moon has been holding its breath.
//
//  And then — quietly — the night reminds you
//  that it was always yours.
//
//  Palette: void #000005 / star #e8f0ff / deep blue #0a0a2e
//           aurora green #00ff88 / aurora violet #7700ff
//           aurora teal #00ccff / moon silver #c8d8ff
//
//  Phase 0  (0ms)    : Deep void. Space hum begins.
//  Phase 1  (800ms)  : 200 stars fade in, staggered twinkle
//  Phase 2  (3200ms) : 6 constellation groups connect with slow lines
//  Phase 3  (5200ms) : Moon rises from horizon — silver, large
//  Phase 4  (6800ms) : "Look up."
//  Phase 5  (9200ms) : Shooting star #1 — left to right
//  Phase 6  (10500ms): Aurora ribbon begins left — slow vertical waves
//  Phase 7  (12500ms): Shooting star #2 — steeper angle
//  Phase 8  (13800ms): "The sky has been waiting."
//  Phase 9  (16500ms): AURORA BLOOM — full curtain, all colours pulse
//  Phase 10 (18000ms): Shooting star #3 — crosses center, brightest
//  Phase 11 (19500ms): "For all of us."
//  Phase 12 (21500ms): Moon intensifies — glow radius doubles
//  Phase 13 (22800ms): MOON BURST — expands to full screen silver
//  Phase 14 (23800ms): Canvas — silver/blue/violet/teal rays + glow
//  Phase 15 (25200ms): N I G H T F A L L label
//  Phase 16 (27800ms): "We own the night." typewriter
//  Phase 17 (31000ms): Elements fade
//  Phase 18 (33000ms): Void fades
//  Phase 19 (35000ms): Resolve
// ═══════════════════════════════════════════════════════════════

import {
  ParticleBurst,
  ContinuousParticles,
} from "../effects/ParticleBurst.js";
import { GlowOverlay, RayBurst } from "../effects/GlowOverlay.js";

// ── Palette ───────────────────────────────────────────────────
const NS = "#e8f0ff"; // star white
const NM = "#c8d8ff"; // moon silver
const NB = "#8899ff"; // midnight blue
const NAG = "#00ff88"; // aurora green
const NAV = "#7700ff"; // aurora violet
const NAT = "#00ccff"; // aurora teal
const NAP = "#bb44ff"; // aurora pink
const NW = "#ffffff"; // full white

const NM_GLOW = "rgba(200,216,255,0.95)";
const NB_GLOW = "rgba(100,120,255,0.85)";
const NAG_GLOW = "rgba(0,255,136,0.80)";
const NAV_GLOW = "rgba(119,0,255,0.78)";

// ── CSS ───────────────────────────────────────────────────────
const CSS = `
/* ── Void ── */
.nf-void {
  position:fixed;inset:0;
  background:radial-gradient(ellipse at 50% 30%,#03030f 0%,#000005 55%,#000002 100%);
  z-index:9990;pointer-events:none;
  opacity:1;transition:opacity 2.6s ease;
}
.nf-void--fade { opacity:0; }

/* ── Sky scene layer ── */
.nf-scene {
  position:fixed;inset:0;pointer-events:none;z-index:9991;
}
.nf-scene svg { position:absolute;inset:0;width:100%;height:100%; }

/* ── Stars ── */
.nf-star {
  position:fixed;border-radius:50%;pointer-events:none;z-index:9992;
  background:var(--sc,#e8f0ff);
  box-shadow:0 0 var(--sg,2px) var(--sc,#e8f0ff);
  opacity:0;
  animation:
    nfStarIn var(--sd,.6s) ease forwards,
    nfTwinkle var(--st,3s) ease-in-out infinite alternate;
  animation-delay:var(--sdly,0ms),calc(var(--sdly,0ms) + var(--sd,.6s));
}
@keyframes nfStarIn  { to{opacity:var(--sop,.75)} }
@keyframes nfTwinkle {
  from{opacity:var(--sop,.75);transform:scale(1)}
  to  {opacity:calc(var(--sop,.75)*.35);transform:scale(.55)}
}

/* ── Constellation lines ── */
.nf-const-line {
  position:fixed;pointer-events:none;z-index:9992;
  background:rgba(180,200,255,var(--clo,.28));
  height:1px;transform-origin:0 50%;
  opacity:0;
  animation:nfConstIn .8s ease forwards;
  animation-delay:var(--cldly,0ms);
}
@keyframes nfConstIn {
  0%  {opacity:0;transform:rotate(var(--clr)) scaleX(0)}
  100%{opacity:1;transform:rotate(var(--clr)) scaleX(1)}
}

/* ── Moon ── */
.nf-moon {
  position:fixed;left:50%;
  transform:translateX(-50%);
  border-radius:50%;pointer-events:none;z-index:9993;
  background:radial-gradient(circle,
    #ffffff 0%,${NM} 30%,rgba(180,200,255,.9) 58%,
    rgba(120,150,255,.35) 78%,transparent 100%);
  box-shadow:
    0 0 30px 12px rgba(200,216,255,.55),
    0 0 80px 30px rgba(170,190,255,.30),
    0 0 180px 60px rgba(140,160,255,.15);
  opacity:0;
  width:min(14vmin,100px);height:min(14vmin,100px);
  animation:nfMoonRise 2.5s cubic-bezier(.15,.7,.25,1) forwards,
            nfMoonBreath 5s ease-in-out infinite alternate;
  animation-delay:0ms,3s;
}
@keyframes nfMoonRise {
  0%  {opacity:0;top:72%;filter:blur(10px)}
  30% {opacity:.7;filter:blur(3px)}
  100%{opacity:1;top:28%;filter:blur(0)}
}
@keyframes nfMoonBreath {
  from{box-shadow:0 0 30px 12px rgba(200,216,255,.55),0 0 80px 30px rgba(170,190,255,.30),0 0 180px 60px rgba(140,160,255,.15)}
  to  {box-shadow:0 0 50px 22px rgba(210,224,255,.70),0 0 120px 50px rgba(180,200,255,.42),0 0 280px 100px rgba(150,170,255,.22)}
}
.nf-moon--intense {
  transition:box-shadow 2s ease,width 2s ease,height 2s ease;
  width:min(20vmin,148px)!important;height:min(20vmin,148px)!important;
  box-shadow:
    0 0 60px 30px rgba(220,232,255,.80),
    0 0 160px 70px rgba(190,210,255,.55),
    0 0 350px 130px rgba(160,180,255,.30) !important;
}

/* ── Moon burst ── */
.nf-moon-burst {
  position:fixed;left:50%;top:28%;
  transform:translate(-50%,-50%);
  border-radius:50%;pointer-events:none;z-index:10009;
  background:radial-gradient(circle,
    ${NW} 0%,${NM} 20%,rgba(180,200,255,.5) 50%,transparent 80%);
  width:min(20vmin,148px);height:min(20vmin,148px);
  animation:nfMoonBurst 2.4s cubic-bezier(.06,.88,.18,1) forwards;
}
@keyframes nfMoonBurst {
  0%  {opacity:1}
  35% {opacity:.95;width:min(20vmin,148px);height:min(20vmin,148px)}
  75% {width:340vmax;height:340vmax;opacity:.85}
  100%{width:340vmax;height:340vmax;opacity:0}
}

/* ── Aurora ribbons ── */
.nf-aurora {
  position:fixed;pointer-events:none;z-index:9992;
  left:0;right:0;
  height:var(--auh,45vh);
  top:var(--aut,8%);
  opacity:0;
  animation:nfAuroraIn var(--auind,2.5s) ease forwards,
            nfAuroraWave var(--auwv,6s) ease-in-out infinite;
  animation-delay:var(--audly,0ms),calc(var(--audly,0ms) + var(--auind,2.5s));
}
@keyframes nfAuroraIn  { to{opacity:var(--auop,.35)} }
@keyframes nfAuroraWave {
  0%  {clip-path:polygon(0 40%,5% 30%,12% 45%,20% 28%,30% 42%,40% 22%,52% 40%,62% 18%,72% 38%,82% 20%,90% 35%,100% 15%,100% 100%,0 100%)}
  33% {clip-path:polygon(0 25%,7% 45%,15% 20%,25% 48%,35% 18%,47% 44%,58% 15%,68% 45%,78% 12%,88% 42%,95% 18%,100% 38%,100% 100%,0 100%)}
  66% {clip-path:polygon(0 38%,8% 12%,18% 42%,28% 10%,38% 38%,50% 8%,60% 40%,70% 10%,80% 36%,90% 8%,97% 32%,100% 5%,100% 100%,0 100%)}
  100%{clip-path:polygon(0 22%,6% 48%,14% 18%,22% 44%,32% 15%,44% 45%,55% 12%,65% 40%,76% 8%,86% 38%,94% 12%,100% 32%,100% 100%,0 100%)}
}
/* Aurora colour band via linear-gradient mask */
.nf-aurora--green {
  background:linear-gradient(to bottom,
    transparent 0%,rgba(0,255,136,.5) 15%,rgba(0,255,136,.8) 35%,
    rgba(0,200,100,.4) 60%,transparent 100%);
}
.nf-aurora--teal {
  background:linear-gradient(to bottom,
    transparent 0%,rgba(0,204,255,.45) 10%,rgba(0,220,255,.72) 30%,
    rgba(0,180,220,.38) 65%,transparent 100%);
}
.nf-aurora--violet {
  background:linear-gradient(to bottom,
    transparent 0%,rgba(119,0,255,.38) 12%,rgba(140,0,255,.65) 38%,
    rgba(100,0,200,.3) 70%,transparent 100%);
}
.nf-aurora--pink {
  background:linear-gradient(to bottom,
    transparent 0%,rgba(187,68,255,.32) 8%,rgba(200,80,255,.58) 40%,
    rgba(160,40,200,.25) 72%,transparent 100%);
}
/* After bloom — more opaque */
.nf-aurora--bloom {
  transition:opacity 1.4s ease;
  opacity:var(--aubloom,.72) !important;
}

/* ── Shooting stars ── */
.nf-shoot {
  position:fixed;pointer-events:none;z-index:9995;
  height:1.5px;
  background:linear-gradient(to right,transparent 0%,${NW} 50%,transparent 100%);
  border-radius:2px;
  box-shadow:0 0 4px ${NW},0 0 12px rgba(230,240,255,.7);
  transform-origin:100% 50%;
  animation:nfShoot var(--shd,.7s) cubic-bezier(.35,0,.65,1) forwards;
  animation-delay:var(--shdly,0ms);
  opacity:0;
}
@keyframes nfShoot {
  0%  {opacity:0;transform:rotate(var(--shr,-18deg)) translateX(0)}
  8%  {opacity:1}
  85% {opacity:1}
  100%{opacity:0;transform:rotate(var(--shr,-18deg)) translateX(var(--shx,-55vw))}
}
/* Trailing glow for brightest shooting star */
.nf-shoot--bright {
  height:2.5px;
  box-shadow:0 0 6px ${NW},0 0 20px rgba(220,235,255,.85),0 0 50px rgba(200,220,255,.4);
}

/* ── Ambient text ── */
.nf-text {
  position:fixed;left:50%;transform:translateX(-50%);
  text-align:center;white-space:nowrap;
  pointer-events:none;z-index:10005;
  font-family:'Georgia','Times New Roman',serif;font-style:italic;
  font-size:clamp(.9rem,2vw,1.28rem);
  letter-spacing:.12em;
}
.nf-text-word {
  display:inline-block;opacity:0;
  animation:nfWordIn 200ms ease forwards;
  animation-delay:var(--wdly,0ms);
}
@keyframes nfWordIn {
  0%  {opacity:0;transform:translateY(6px);filter:blur(5px)}
  100%{opacity:1;transform:none;filter:blur(0)}
}
.nf-text-word--drift {
  animation:nfWordIn 200ms ease forwards,nfWordDrift 8s ease-in-out infinite alternate;
  animation-delay:var(--wdly,0ms),calc(var(--wdly,0ms) + 400ms);
}
@keyframes nfWordDrift {
  from{transform:translateY(0)}
  to  {transform:translateY(-3px)}
}

/* ── N I G H T F A L L label ── */
.nf-label {
  position:fixed;left:50%;top:50%;
  transform:translate(-50%,-50%);
  pointer-events:none;z-index:10012;
  display:flex;flex-direction:column;align-items:center;gap:16px;
  animation:nfLabelReveal 10s ease forwards;
}
@keyframes nfLabelReveal {
  0%  {opacity:0;transform:translate(-50%,-50%) scale(.4);filter:blur(32px)}
  7%  {opacity:1;transform:translate(-50%,-50%) scale(1.04);filter:blur(0)}
  13% {transform:translate(-50%,-50%) scale(1)}
  78% {opacity:1}
  100%{opacity:0}
}
.nf-label-main {
  font-family:'Georgia','Times New Roman',serif;
  font-size:clamp(26px,4vw,46px);font-weight:400;
  letter-spacing:18px;text-transform:uppercase;
  color:${NM};
  text-shadow:
    0 0 12px ${NM},0 0 32px rgba(200,216,255,.8),
    0 0 90px rgba(170,190,255,.55),0 0 220px rgba(140,160,255,.30);
  padding:20px 52px;
  background:rgba(1,1,8,.97);
  border:1px solid rgba(200,216,255,.28);
  box-shadow:
    0 0 0 1px rgba(119,0,255,.12),
    0 0 55px rgba(200,216,255,.22),
    0 0 140px rgba(136,153,255,.14),
    0 0 320px rgba(119,0,255,.08),
    inset 0 0 50px rgba(200,216,255,.03);
  animation:nfLabelGlow 4.5s ease-in-out infinite alternate;
}
@keyframes nfLabelGlow {
  from{
    text-shadow:0 0 12px ${NM},0 0 32px rgba(200,216,255,.8),0 0 90px rgba(170,190,255,.55),0 0 220px rgba(140,160,255,.30);
    border-color:rgba(200,216,255,.28);
    box-shadow:0 0 0 1px rgba(119,0,255,.12),0 0 55px rgba(200,216,255,.22),0 0 140px rgba(136,153,255,.14),0 0 320px rgba(119,0,255,.08),inset 0 0 50px rgba(200,216,255,.03);
  }
  to{
    text-shadow:0 0 20px ${NW},0 0 55px ${NM},0 0 150px rgba(180,200,255,.7),0 0 380px rgba(150,170,255,.40);
    border-color:rgba(220,230,255,.50);
    box-shadow:0 0 0 1px rgba(170,190,255,.22),0 0 100px rgba(210,224,255,.38),0 0 260px rgba(150,170,255,.22),0 0 550px rgba(100,0,255,.12),inset 0 0 90px rgba(200,216,255,.05);
  }
}
.nf-label-sub {
  font-family:'Georgia','Times New Roman',serif;font-style:italic;
  font-size:10px;letter-spacing:5px;
  color:rgba(160,180,255,.45);
  text-shadow:0 0 8px rgba(140,160,255,.3);
}

/* ── Typewriter ── */
.nf-typewriter {
  position:fixed;left:50%;top:calc(50% + 80px);
  transform:translateX(-50%);
  pointer-events:none;z-index:10013;
  font-family:'Georgia','Times New Roman',serif;font-style:italic;
  font-size:15px;letter-spacing:6px;
  color:rgba(220,232,255,.88);
  text-shadow:0 0 10px rgba(180,200,255,.55),0 0 30px rgba(140,160,255,.35);
  white-space:nowrap;
  animation:nfTypeReveal 10s ease forwards;
}
@keyframes nfTypeReveal {
  0%{opacity:0} 7%{opacity:1} 84%{opacity:1} 100%{opacity:0}
}
.nf-cursor {
  display:inline-block;width:1.5px;height:1em;
  background:${NM};margin-left:2px;vertical-align:middle;
  box-shadow:0 0 4px ${NM},0 0 10px rgba(200,216,255,.5);
  animation:nfCursorBlink .9s ease-in-out infinite;
}
@keyframes nfCursorBlink {
  0%,100%{opacity:1} 50%{opacity:0}
}

/* ── Moon burst shake ── */
@keyframes nfBurstShake {
  0%,100%{transform:translate(0,0)}
  8% {transform:translate(-8px,10px)}
  20%{transform:translate(8px,-8px)}
  32%{transform:translate(-9px,8px)}
  45%{transform:translate(7px,-7px)}
  58%{transform:translate(-5px,5px)}
  72%{transform:translate(4px,-4px)}
  85%{transform:translate(-3px,3px)}
}
body.nf-shake { animation:nfBurstShake 1s ease-out; }
`;

function injectCSS() {
  if (document.getElementById("nf-styles")) return;
  const s = document.createElement("style");
  s.id = "nf-styles";
  s.textContent = CSS;
  document.head.appendChild(s);
}
function mk(cls) {
  const el = document.createElement("div");
  el.className = cls;
  return el;
}
let _spawned = [];
function spawn(el) {
  _spawned.push(el);
  document.body.appendChild(el);
  return el;
}
function killSpawned() {
  _spawned.forEach((e) => e.remove());
  _spawned = [];
}
function rnd(lo, hi) {
  return lo + Math.random() * (hi - lo);
}
function rndInt(lo, hi) {
  return Math.floor(rnd(lo, hi + 1));
}
function svgEl(tag) {
  return document.createElementNS("http://www.w3.org/2000/svg", tag);
}

// ── Constellation data — 6 groups as [x%,y%] star pairs ──────
// each group is an array of [x,y] points; lines connect sequential pairs
const CONSTELLATIONS = [
  // Orion-like — top left
  [
    [12, 18],
    [15, 25],
    [11, 30],
    [14, 35],
    [18, 28],
    [22, 22],
    [20, 15],
  ],
  // Cassiopeia-like — top right, W shape
  [
    [72, 12],
    [76, 20],
    [80, 13],
    [84, 21],
    [88, 14],
  ],
  // Big Dipper bowl — center right
  [
    [60, 30],
    [65, 28],
    [70, 30],
    [68, 36],
    [62, 36],
  ],
  // Small cluster — bottom left
  [
    [18, 52],
    [22, 48],
    [26, 54],
    [20, 58],
  ],
  // Cross shape — top center
  [
    [44, 8],
    [48, 14],
    [52, 8],
    [48, 20],
  ],
  // Triangle — right mid
  [
    [80, 42],
    [86, 36],
    [88, 48],
  ],
];

// Shooting star configs [startX%, startY%, angle-deg, width-px, delay-ms, bright]
const SHOOTS = [
  { x: "85%", y: "15%", angle: -14, w: 160, delay: 0, bright: false },
  { x: "70%", y: "8%", angle: -25, w: 200, delay: 0, bright: false },
  { x: "78%", y: "22%", angle: -10, w: 280, delay: 0, bright: true },
];

// ══════════════════════════════════════════════════════════════
export class NightFall {
  constructor(engine, rarity) {
    this.engine = engine;
    this.rarity = rarity;
    this.stopped = false;
    this._timers = [];
    this._actx = null;
    this._auroraEls = [];
    this._moonEl = null;
    this.fx = {
      shakeIntensity: 55,
      particleCount: 300,
      rayCount: 58,
      glowMaxAlpha: 0.96,
      auraCount: 8,
      trailEnabled: true,
      ...(rarity.effects ?? {}),
    };
    injectCSS();
  }

  _after(ms, fn) {
    const id = setTimeout(() => {
      if (!this.stopped) fn();
    }, ms);
    this._timers.push(id);
    return id;
  }

  play() {
    return new Promise((resolve) => {
      _spawned = [];

      // ── Phase 0: Void ────────────────────────────────────────
      const voidEl = spawn(mk("nf-void"));
      this._after(31000, () => {
        document
          .querySelectorAll(
            ".nf-scene,.nf-star,.nf-const-line,.nf-aurora,.nf-moon",
          )
          .forEach((el) => {
            el.style.transition = "opacity 1.8s ease";
            el.style.opacity = "0";
          });
      });
      this._after(33000, () => voidEl.classList.add("nf-void--fade"));
      this._after(35500, () => voidEl.remove());

      // Ambient audio
      this._sfxSpaceHum();
      this._sfxWind();

      // ── Phase 1: Stars ───────────────────────────────────────
      this._after(800, () => this._spawnStars(200));

      // ── Phase 2: Constellations ──────────────────────────────
      this._after(3200, () => this._spawnConstellations());

      // ── Phase 3: Moon rises ──────────────────────────────────
      this._after(5200, () => this._spawnMoon());

      // ── Phase 4: "Look up." ──────────────────────────────────
      this._after(6800, () =>
        this._showText(
          "Look up.",
          "70%",
          `rgba(210,225,255,.72)`,
          `0 0 10px rgba(180,200,255,.45)`,
          300,
          2800,
        ),
      );

      // ── Phase 5: Shooting star #1 ────────────────────────────
      this._after(9200, () => this._shootingStar(SHOOTS[0]));
      this._sfxShootStar(9200);

      // ── Phase 6: Aurora begins ───────────────────────────────
      this._after(10500, () => this._spawnAurora(false));

      // ── Phase 7: Shooting star #2 ────────────────────────────
      this._after(12500, () => this._shootingStar(SHOOTS[1]));
      this._sfxShootStar(12500);

      // ── Phase 8: "The sky has been waiting." ─────────────────
      this._after(13800, () =>
        this._showText(
          "The sky has been waiting.",
          "68%",
          `rgba(190,215,255,.78)`,
          `0 0 12px rgba(160,190,255,.5),0 0 35px rgba(140,170,255,.25)`,
          290,
          2600,
        ),
      );

      // ── Phase 9: Aurora bloom ────────────────────────────────
      this._after(16500, () => {
        this._auroraEls.forEach((el) => el.classList.add("nf-aurora--bloom"));
        this._sfxAuroraCrackle();
      });

      // ── Phase 10: Shooting star #3 ───────────────────────────
      this._after(18000, () => this._shootingStar(SHOOTS[2]));
      this._sfxShootStar(18000);

      // ── Phase 11: "For all of us." ───────────────────────────
      this._after(19500, () =>
        this._showText(
          "For all of us.",
          "66%",
          NAG,
          `0 0 10px ${NAG},0 0 28px rgba(0,255,136,.6),0 0 70px rgba(0,255,136,.3)`,
          260,
          2000,
        ),
      );

      // ── Phase 12: Moon intensifies ───────────────────────────
      this._after(21500, () => {
        if (this._moonEl) this._moonEl.classList.add("nf-moon--intense");
        this._sfxMoonSwell();
      });

      // ── Phase 13: Moon burst ─────────────────────────────────
      this._after(22800, () => {
        const burst = spawn(mk("nf-moon-burst"));
        this._after(2500, () => burst.remove());
        document.body.classList.add("nf-shake");
        this._after(1100, () => document.body.classList.remove("nf-shake"));
        this.engine.shake(this.fx.shakeIntensity);
        if (this._moonEl) {
          this._moonEl.style.transition = "opacity .4s ease";
          this._moonEl.style.opacity = "0";
        }
        this._sfxMoonBurst();
      });

      // ── Phase 14: Canvas layers ──────────────────────────────
      this._after(23800, () => {
        // Rays — slower and more majestic than other scenes
        const cols = [NM, NB, NAG, NAV, NAT, NAP, NW];
        cols.forEach((col, i) => {
          this._after(i * 90, () => {
            this.engine.addEffect(
              new RayBurst({
                color: col,
                duration: 13500,
                maxAlpha: 0.26 - i * 0.022,
                rayCount: Math.floor(this.fx.rayCount * (1.2 - i * 0.08)),
                rotSpeed:
                  i % 2 === 0
                    ? 0.38 + i * 0.12 // slow clockwise
                    : -(0.28 + i * 0.1), // slow counter
              }),
            );
          });
        });

        // Glows — layered, moon silver dominant
        [
          [NM_GLOW, 0.96, 1.4],
          [NB_GLOW, 0.72, 1.1],
          [NAG_GLOW, 0.55, 0.9],
          [NAV_GLOW, 0.48, 1.6],
        ].forEach(([col, alpha, pulse], i) => {
          this._after(i * 140, () => {
            this.engine.addEffect(
              new GlowOverlay({
                color: col,
                duration: 13000,
                maxAlpha: alpha,
                fadeIn: 0.04,
                fadeOut: 0.24,
                radial: true,
                pulseSpeed: pulse,
              }),
            );
          });
        });

        // Particles — star-like, drifting upward slowly
        [
          [NM, 1.0],
          [NB, 0.85],
          [NAG, 0.65],
          [NAV, 0.55],
          [NAT, 0.45],
          [NW, 0.38],
        ].forEach(([col, sc], i) => {
          this._after(i * 100, () => {
            this.engine.addEffect(
              new ParticleBurst(0.5, 0.28, {
                count: Math.floor(this.fx.particleCount * sc),
                color: col,
                minSpeed: 60 + i * 40,
                maxSpeed: 350 + i * 35,
                minSize: 1,
                maxSize: 10,
                gravity: -20, // slight upward drift — stars float
                trail: true,
                glow: true,
                duration: 12500,
                type: "star",
              }),
            );
          });
        });

        // Continuous rising star-sparks — like the Milky Way moving
        this.engine.addEffect(
          new ContinuousParticles({
            ox: 0.5,
            oy: 0.3,
            color: NS,
            minSpeed: 18,
            maxSpeed: 95,
            gravity: -35,
            upBias: 70,
            spread: Math.PI * 2,
            angle: -Math.PI / 2,
            minSize: 0.5,
            maxSize: 4,
            trail: true,
            glow: true,
            spawnRate: 0.06,
            duration: 12000,
            type: "star",
          }),
        );
        // Aurora particle curtain — green wisps
        this.engine.addEffect(
          new ContinuousParticles({
            ox: 0.3,
            oy: 0.15,
            color: NAG,
            minSpeed: 12,
            maxSpeed: 55,
            gravity: -15,
            upBias: 30,
            spread: Math.PI * 0.8,
            angle: -Math.PI / 2,
            minSize: 1,
            maxSize: 7,
            trail: true,
            glow: true,
            spawnRate: 0.045,
            duration: 11000,
            type: "star",
          }),
        );
        this.engine.addEffect(
          new ContinuousParticles({
            ox: 0.72,
            oy: 0.18,
            color: NAV,
            minSpeed: 12,
            maxSpeed: 55,
            gravity: -15,
            upBias: 30,
            spread: Math.PI * 0.8,
            angle: -Math.PI / 2,
            minSize: 1,
            maxSize: 7,
            trail: true,
            glow: true,
            spawnRate: 0.04,
            duration: 11000,
            type: "star",
          }),
        );
      });

      // ── Phase 15: Label ──────────────────────────────────────
      this._after(25200, () => this._spawnLabel());

      // ── Phase 16: Typewriter ─────────────────────────────────
      this._after(27800, () => this._spawnTypewriter());

      // ── Phase 19: Resolve ─────────────────────────────────────
      this._after(35000, () => {
        killSpawned();
        this._stopAmbient();
        if (this._actx) {
          try {
            this._actx.close();
          } catch (e) {}
        }
        resolve();
      });
    });
  }

  stop() {
    this.stopped = true;
    this._timers.forEach(clearTimeout);
    this._timers = [];
    document.body.classList.remove("nf-shake");
    this._stopAmbient();
    if (this._actx) {
      try {
        this._actx.close();
      } catch (e) {}
    }
    killSpawned();
  }

  // ──────────────────────────────────────────────────────────────
  //  S P A W N   M E T H O D S
  // ──────────────────────────────────────────────────────────────

  // 200 stars — each unique size, position, twinkle speed, colour
  _spawnStars(count) {
    const starCols = [
      "#e8f0ff",
      "#ffffff",
      "#d0e0ff", // blue-white
      "#fff8e8",
      "#fff4cc", // warm yellow
      "#ffe8d0", // orange tinge
      "#e8fff8", // faint green
    ];
    for (let i = 0; i < count; i++) {
      const star = spawn(mk("nf-star"));
      const sz = rnd(1, 3.5);
      const op = rnd(0.4, 0.95);
      const col = starCols[rndInt(0, starCols.length - 1)];
      const glow = sz + rnd(0.5, 2);
      star.style.cssText = `
        left:${rnd(0, 100)}%;
        top:${rnd(1, 62)}%;
        width:${sz}px;height:${sz}px;
        --sc:${col};--sg:${glow}px;--sop:${op};
        --sd:${rnd(0.3, 1.2).toFixed(2)}s;
        --sdly:${rnd(0, 3000).toFixed(0)}ms;
        --st:${rnd(2, 6).toFixed(1)}s;
      `;
      this._after(32000, () => star.remove());
    }
  }

  // Constellation lines connecting star positions
  _spawnConstellations() {
    let globalDelay = 0;
    CONSTELLATIONS.forEach((group, gi) => {
      // Draw connecting lines
      for (let p = 0; p < group.length - 1; p++) {
        const [x1, y1] = group[p];
        const [x2, y2] = group[p + 1];
        // Place a div from (x1,y1) to (x2,y2)
        const dx = x2 - x1,
          dy = y2 - y1;
        const len = Math.sqrt(dx * dx + dy * dy);
        const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
        const line = spawn(mk("nf-const-line"));
        line.style.cssText = `
          left:${x1}%;top:${y1}%;
          width:${len}vw;
          --clr:${ang}deg;
          --clo:${rnd(0.18, 0.35)};
          --cldly:${globalDelay}ms;
        `;
        this._after(32000, () => line.remove());
        globalDelay += 280;
        // Chime for each line
        this._sfxConstellationChime(globalDelay);
      }
      globalDelay += 600; // pause between groups
    });
  }

  // Moon
  _spawnMoon() {
    const moon = spawn(mk("nf-moon"));
    // Start below horizon, animation brings it to top:28%
    this._moonEl = moon;
    this._after(31000, () => moon.remove());
  }

  // Aurora curtain — multi-layer coloured ribbons
  _spawnAurora(bloomed) {
    this._auroraEls = [];
    const bands = [
      {
        cls: "nf-aurora--green",
        top: "3%",
        h: "52vh",
        delay: 0,
        op: 0.38,
        bloom: 0.72,
        wv: "6.5s",
      },
      {
        cls: "nf-aurora--teal",
        top: "8%",
        h: "44vh",
        delay: 600,
        op: 0.3,
        bloom: 0.6,
        wv: "8.2s",
      },
      {
        cls: "nf-aurora--violet",
        top: "2%",
        h: "48vh",
        delay: 1200,
        op: 0.25,
        bloom: 0.55,
        wv: "7.0s",
      },
      {
        cls: "nf-aurora--pink",
        top: "12%",
        h: "36vh",
        delay: 1800,
        op: 0.2,
        bloom: 0.45,
        wv: "9.5s",
      },
    ];
    bands.forEach((b) => {
      const el = spawn(mk(`nf-aurora ${b.cls}`));
      el.style.setProperty("--aut", b.top);
      el.style.setProperty("--auh", b.h);
      el.style.setProperty("--audly", b.delay + "ms");
      el.style.setProperty("--auop", b.op + "");
      el.style.setProperty("--aubloom", b.bloom + "");
      el.style.setProperty("--auind", "2.5s");
      el.style.setProperty("--auwv", b.wv);
      this._auroraEls.push(el);
      this._after(31000, () => el.remove());
    });
  }

  // Single shooting star
  _shootingStar(cfg) {
    const el = spawn(mk("nf-shoot" + (cfg.bright ? " nf-shoot--bright" : "")));
    el.style.cssText = `
      right:${100 - parseFloat(cfg.x)}%;
      top:${cfg.y};
      width:${cfg.w}px;
      --shr:${cfg.angle}deg;
      --shx:-${cfg.w + rnd(30, 80)}px;
      --shd:${rnd(0.65, 0.9).toFixed(2)}s;
      --shdly:0ms;
    `;
    this._after(1200, () => el.remove());
  }

  // Ambient text
  _showText(text, topPct, color, shadow, msPerWord, holdMs) {
    const el = spawn(mk("nf-text"));
    el.style.top = topPct;
    el.style.color = color;
    el.style.textShadow = shadow;
    text.split(" ").forEach((word, i) => {
      const span = document.createElement("span");
      span.className = "nf-text-word nf-text-word--drift";
      span.textContent =
        word + (i < text.split(" ").length - 1 ? "\u00A0" : "");
      span.style.setProperty("--wdly", `${i * msPerWord}ms`);
      el.appendChild(span);
    });
    const lastIn = (text.split(" ").length - 1) * msPerWord + 250;
    this._after(lastIn + holdMs, () => {
      el.style.transition = "opacity 700ms ease";
      el.style.opacity = "0";
      this._after(750, () => el.remove());
    });
  }

  // Label
  _spawnLabel() {
    const label = spawn(mk("nf-label"));
    const main = document.createElement("div");
    main.className = "nf-label-main";
    main.textContent = "N I G H T F A L L";
    const sub = document.createElement("div");
    sub.className = "nf-label-sub";
    sub.textContent = "1 / 900,000  ·  THE NIGHT HAS ALWAYS BEEN OURS";
    label.appendChild(main);
    label.appendChild(sub);
    this._after(9700, () => label.remove());
  }

  // "We own the night." typewriter — deliberate, reverent
  _spawnTypewriter() {
    const el = spawn(mk("nf-typewriter"));
    const TEXT = "We own the night.";
    const cur = document.createElement("span");
    cur.className = "nf-cursor";
    el.appendChild(cur);
    let idx = 0;
    const type = () => {
      if (this.stopped || !el.isConnected) return;
      if (idx < TEXT.length) {
        el.insertBefore(document.createTextNode(TEXT[idx]), cur);
        idx++;
        this._sfxTypeClick();
        const ch = TEXT[idx - 1];
        const delay =
          ch === "."
            ? 1200 // long pause at the end
            : ch === " "
              ? 280 // breath between words
              : Math.random() > 0.85
                ? 220 + Math.random() * 130
                : 130 + Math.random() * 60;
        this._timers.push(setTimeout(type, delay));
      } else {
        // Hold cursor after last character
        this._after(2500, () => {
          cur.style.transition = "opacity 1s ease";
          cur.style.opacity = "0";
        });
      }
    };
    this._timers.push(setTimeout(type, 800));
    this._after(9600, () => el.remove());
  }

  // ──────────────────────────────────────────────────────────────
  //  W E B   A U D I O   —   N I G H T   A T M O S P H E R E
  // ──────────────────────────────────────────────────────────────

  _audio() {
    if (!this._actx) {
      try {
        this._actx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        return null;
      }
    }
    if (this._actx.state === "suspended") this._actx.resume();
    return this._actx;
  }
  _beep(ctx, t, freq, dur, vol = 0.1, type = "sine") {
    try {
      const o = ctx.createOscillator(),
        g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);
      o.type = type;
      o.frequency.value = freq;
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.start(t);
      o.stop(t + dur + 0.01);
    } catch (e) {}
  }

  // 40Hz cosmic hum — barely audible, felt more than heard
  _sfxSpaceHum() {
    const ctx = this._audio();
    if (!ctx) return;
    try {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);
      o.type = "sine";
      o.frequency.value = 40;
      const t = ctx.currentTime;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.04, t + 4);
      g.gain.setValueAtTime(0.04, t + 22);
      g.gain.linearRampToValueAtTime(0, t + 34);
      o.start(t);
      o.stop(t + 35);
      this._humNode = o;
    } catch (e) {}
  }

  // Atmospheric wind — midrange noise
  _sfxWind() {
    const ctx = this._audio();
    if (!ctx) return;
    try {
      const len = ctx.sampleRate * 35;
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 400;
      bp.Q.value = 0.5;
      const g = ctx.createGain();
      src.connect(bp);
      bp.connect(g);
      g.connect(ctx.destination);
      const t = ctx.currentTime;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.025, t + 5);
      g.gain.setValueAtTime(0.025, t + 20);
      g.gain.linearRampToValueAtTime(0, t + 34);
      src.start(t);
      src.stop(t + 35);
      this._windNode = src;
    } catch (e) {}
  }

  // Soft high chime when constellation lines connect
  _sfxConstellationChime(delayMs) {
    const ctx = this._audio();
    if (!ctx) return;
    const t = ctx.currentTime + delayMs / 1000;
    // Bell-like: two harmonics, short, high
    const freqs = [880, 1320, 1760];
    freqs.forEach((f, i) => {
      this._beep(ctx, t + i * 0.02, f, 1.4, 0.022 - i * 0.006, "sine");
    });
  }

  // Shooting star — descending pitch sweep
  _sfxShootStar(delayMs) {
    const ctx = this._audio();
    if (!ctx) return;
    this._after(delayMs, () => {
      const t = ctx.currentTime;
      try {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.type = "sine";
        o.frequency.setValueAtTime(2200, t);
        o.frequency.exponentialRampToValueAtTime(320, t + 0.65);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.055, t + 0.08);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.65);
        o.start(t);
        o.stop(t + 0.7);
      } catch (e) {}
    });
  }

  // Aurora crackle — bandpass noise, faint electrical texture
  _sfxAuroraCrackle() {
    const ctx = this._audio();
    if (!ctx) return;
    try {
      const len = ctx.sampleRate * 6;
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 1800;
      bp.Q.value = 2.5;
      const g = ctx.createGain();
      src.connect(bp);
      bp.connect(g);
      g.connect(ctx.destination);
      const t = ctx.currentTime;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.028, t + 1.0);
      g.gain.setValueAtTime(0.028, t + 4);
      g.gain.linearRampToValueAtTime(0, t + 6);
      src.start(t);
      src.stop(t + 6.1);
    } catch (e) {}
  }

  // Moon swell — Amaj7 chord: A3+C#4+E4+G#4 — celestial, open
  _sfxMoonSwell() {
    const ctx = this._audio();
    if (!ctx) return;
    const t = ctx.currentTime;
    [
      [220.0, 0.0, 6.0, 0.1], // A3
      [277.2, 0.06, 5.8, 0.09], // C#4
      [329.6, 0.12, 5.5, 0.08], // E4
      [415.3, 0.2, 5.0, 0.07], // G#4
      [440.0, 0.3, 4.2, 0.05], // A4
      [659.3, 0.45, 3.2, 0.03], // E5 shimmer
    ].forEach(([f, off, dur, vol]) =>
      this._beep(ctx, t + off, f, dur, vol, "sine"),
    );
    // Bass A2
    this._beep(ctx, t, 110.0, 6.5, 0.09, "sine");
  }

  // Moon burst — same Amaj7 but full, with noise bloom
  _sfxMoonBurst() {
    const ctx = this._audio();
    if (!ctx) return;
    const t = ctx.currentTime;
    [
      [110.0, 0.0, 6.0, 0.14],
      [220.0, 0.04, 5.8, 0.12],
      [277.2, 0.08, 5.5, 0.1],
      [329.6, 0.13, 5.0, 0.09],
      [415.3, 0.19, 4.5, 0.08],
      [440.0, 0.26, 3.8, 0.06],
      [659.3, 0.36, 3.0, 0.04],
      [880.0, 0.5, 2.2, 0.025],
    ].forEach(([f, off, dur, vol]) =>
      this._beep(ctx, t + off, f, dur, vol, "sine"),
    );
    // Soft white noise bloom — not sharp, filtered through lowpass
    try {
      const bLen = ctx.sampleRate * 0.35;
      const buf = ctx.createBuffer(1, bLen, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let k = 0; k < bLen; k++)
        d[k] = (Math.random() * 2 - 1) * Math.pow(1 - k / bLen, 1.5);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 1800;
      const g = ctx.createGain();
      src.connect(lp);
      lp.connect(g);
      g.connect(ctx.destination);
      g.gain.setValueAtTime(0.1, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
      src.start(t);
      src.stop(t + 0.45);
    } catch (e) {}
  }

  // Typewriter click — very soft, low, like a fountain pen
  _sfxTypeClick() {
    const ctx = this._audio();
    if (!ctx) return;
    const t = ctx.currentTime;
    try {
      const bLen = Math.floor(ctx.sampleRate * 0.022);
      const buf = ctx.createBuffer(1, bLen, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let k = 0; k < bLen; k++)
        d[k] = (Math.random() * 2 - 1) * Math.pow(1 - k / bLen, 5);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const hp = ctx.createBiquadFilter();
      hp.type = "bandpass";
      hp.frequency.value = 900;
      hp.Q.value = 1.2;
      const g = ctx.createGain();
      src.connect(hp);
      hp.connect(g);
      g.connect(ctx.destination);
      g.gain.value = 0.03;
      src.start(t);
      src.stop(t + 0.025);
    } catch (e) {}
  }

  _stopAmbient() {
    ["_humNode", "_windNode"].forEach((key) => {
      try {
        if (this[key]) {
          this[key].stop();
          this[key] = null;
        }
      } catch (e) {}
    });
  }
}
