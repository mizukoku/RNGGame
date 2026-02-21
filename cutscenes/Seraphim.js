// cutscenes/Seraphim.js
// ═══════════════════════════════════════════════════════════════
//  S E R A P H I M  —  1 / 10,000
//  Hybrid: DOM/CSS animations + canvas particle engine
//  Isaiah 6: six-winged beings of pure fire above the throne.
//  "Holy, holy, holy is the Lord Almighty"
//
//  Phase 0  (0ms)    : Heaven void — deep gold-black
//  Phase 1  (300ms)  : The Veil tears — divine gold cracks
//  Phase 2  (700ms)  : Throne fire pillars descend
//  Phase 3  (1100ms) : Six wings of light unfurl from centre
//  Phase 4  (1400ms) : Sacred ember rain
//  Phase 5  (2000ms) : Seraphim sigil assembles
//  Phase 6  (2500ms) : Triple holy pulse → HOLY FLASH
//  Phase 7  (2800ms) : Shockwave halos + divine wind
//  Phase 8  (3200ms) : Golden presence nebula
//  Phase 9  (3800ms) : Canvas aura + text blazes
//  Phase 10 (10s)    : Resolve
// ═══════════════════════════════════════════════════════════════

import { ParticleBurst, ContinuousParticles } from '../effects/ParticleBurst.js';
import { GlowOverlay, RayBurst }               from '../effects/GlowOverlay.js';
import { RevealText }                           from '../effects/RevealText.js';

// ── Inline CSS (injected once) ────────────────────────────────
const CSS = `
/* ── Phase 0: Heaven void ── */
.sera-void {
  position:fixed;inset:0;
  background:radial-gradient(ellipse at 50% 35%,#1a0e00 0%,#0d0800 40%,#000 100%);
  z-index:9990;pointer-events:none;
  animation:seraVoidFade 4.5s ease forwards;
}
@keyframes seraVoidFade {
  0%{opacity:1} 88%{opacity:1} 100%{opacity:0}
}
.sera-void::after {
  content:"";position:absolute;inset:0;
  background:radial-gradient(ellipse at 50% 30%,rgba(255,200,60,.12) 0%,transparent 55%);
  animation:seraBreath 1.2s ease-in-out infinite alternate;
}
@keyframes seraBreath {
  from{transform:scale(1);opacity:.5}
  to  {transform:scale(1.15);opacity:1}
}

/* ── Star field (faint, holy atmosphere) ── */
.sera-starfield {
  position:fixed;inset:0;z-index:9991;pointer-events:none;overflow:hidden;
}
.sera-bg-star {
  position:absolute;border-radius:50%;
  animation:seraStarGlow linear infinite alternate;
}
@keyframes seraStarGlow {
  from{opacity:var(--base-op,.3);transform:scale(1)}
  to  {opacity:1;transform:scale(1.5)}
}

/* ── Phase 1: Veil cracks ── */
.sera-crack {
  position:fixed;pointer-events:none;z-index:9993;
  height:3px;border-radius:1px;
  animation:seraCrackSplit ease-out forwards;
  transform-origin:center center;
}
@keyframes seraCrackSplit {
  0%  {opacity:0;transform:rotate(var(--cr)) scaleX(0)}
  15% {opacity:1;transform:rotate(var(--cr)) scaleX(.4)}
  55% {opacity:1;transform:rotate(var(--cr)) scaleX(1)}
  100%{opacity:0;transform:rotate(var(--cr)) scaleX(1)}
}
.sera-crack-inner {
  position:absolute;inset:0;
  background:linear-gradient(90deg,
    transparent 0%,rgba(255,220,80,.5) 15%,
    rgba(255,255,200,.98) 50%,
    rgba(255,220,80,.5) 85%,transparent 100%);
  box-shadow:
    0 0 8px 4px rgba(255,220,60,.8),
    0 0 22px 8px rgba(255,160,0,.5),
    0 0 45px 14px rgba(255,100,0,.25);
}
.sera-crack-light {
  position:fixed;pointer-events:none;z-index:9992;border-radius:50%;
  background:radial-gradient(circle,rgba(255,240,160,.65) 0%,transparent 70%);
  animation:seraLightBleed ease-out forwards;
}
@keyframes seraLightBleed {
  from{transform:translate(-50%,-50%) scale(0);opacity:.85}
  to  {transform:translate(-50%,-50%) scale(1);opacity:0}
}

/* ── Phase 2: Throne fire pillars ── */
.sera-pillar {
  position:fixed;top:0;width:8px;border-radius:4px;
  pointer-events:none;z-index:9994;
  animation:seraPillarDrop ease-out forwards;
}
@keyframes seraPillarDrop {
  0%  {height:0;opacity:0;transform:translateX(-50%) scaleX(1)}
  18% {height:45vh;opacity:1;transform:translateX(-50%) scaleX(2.5)}
  55% {height:100vh;opacity:1;transform:translateX(-50%) scaleX(1.5)}
  100%{height:100vh;opacity:0;transform:translateX(-50%) scaleX(1)}
}

/* ── Phase 3: Six wings ── */
.sera-wing-container {
  position:fixed;left:50%;top:50%;width:0;height:0;
  pointer-events:none;z-index:9998;
}
.sera-wing {
  position:absolute;left:0;top:0;pointer-events:none;
  transform-origin:0 0;
  animation:seraWingUnfurl cubic-bezier(.2,1,.3,1) forwards;
}
@keyframes seraWingUnfurl {
  0%  {width:0;height:4px;opacity:0;transform:rotate(var(--wa)) scaleX(0)}
  20% {opacity:1;transform:rotate(var(--wa)) scaleX(.3)}
  60% {width:var(--wl);height:var(--wh);opacity:1;transform:rotate(var(--wa)) scaleX(1)}
  100%{width:var(--wl);height:var(--wh);opacity:0;transform:rotate(var(--wa)) scaleX(1.08)}
}
.sera-wing-feather {
  position:absolute;inset:0;border-radius:0 50% 50% 0;
  animation:seraFeatherShimmer .28s ease-in-out infinite alternate;
}
@keyframes seraFeatherShimmer {
  from{filter:brightness(1)   drop-shadow(0 0 6px  rgba(255,220,80,.8))}
  to  {filter:brightness(1.35) drop-shadow(0 0 22px rgba(255,255,180,1))}
}

/* ── Phase 3: Halo rings ── */
.sera-halo {
  position:fixed;left:50%;top:50%;border-radius:50%;
  transform:translate(-50%,-50%);pointer-events:none;z-index:9997;
  animation:seraHaloExpand ease-out forwards;
}
@keyframes seraHaloExpand {
  from{transform:translate(-50%,-50%) scale(0);opacity:1}
  60% {opacity:1}
  to  {transform:translate(-50%,-50%) scale(var(--hs,8));opacity:0}
}

/* ── Phase 4: Sacred embers ── */
.sera-ember {
  position:fixed;top:-14px;border-radius:50%;
  pointer-events:none;z-index:9996;
  animation:seraEmberFall linear forwards;
}
@keyframes seraEmberFall {
  0%  {transform:translateY(0) translateX(0) rotate(0deg);opacity:1}
  70% {opacity:1}
  100%{transform:translateY(115vh) translateX(var(--ex,0px)) rotate(720deg);opacity:0}
}
.sera-ember::after {
  content:"";position:absolute;inset:-2px;border-radius:50%;
  background:radial-gradient(circle,rgba(255,255,200,.65) 0%,transparent 70%);
}

/* ── Phase 5: Seraphim sigil ── */
.sera-sigil {
  position:fixed;left:50%;top:50%;
  width:360px;height:360px;border-radius:50%;
  transform:translate(-50%,-50%);
  pointer-events:none;z-index:9999;
  border:2px solid rgba(255,215,100,.75);
  box-shadow:
    0 0 30px rgba(255,215,0,.65),
    inset 0 0 30px rgba(255,215,0,.3),
    0 0 80px rgba(255,160,0,.35);
  animation:seraSigilRotate 1.6s ease forwards;
}
@keyframes seraSigilRotate {
  from{transform:translate(-50%,-50%) rotate(0deg) scale(.35);opacity:0}
  20% {opacity:1}
  to  {transform:translate(-50%,-50%) rotate(360deg) scale(1.15);opacity:0}
}
.sera-sigil::before {
  content:"";position:absolute;inset:24px;border-radius:50%;
  border:1px solid rgba(255,215,0,.4);
  animation:seraSigilInner .85s ease reverse forwards;
}
@keyframes seraSigilInner {
  from{transform:rotate(0)} to{transform:rotate(-360deg)}
}
.sera-sigil::after {
  content:"✦";position:absolute;left:50%;top:50%;
  transform:translate(-50%,-50%);
  font-size:88px;color:#ffd700;
  text-shadow:0 0 22px #ffd700,0 0 55px #ff9900,0 0 110px rgba(255,160,0,.65);
  animation:seraSigilGlyph .45s ease-in-out infinite alternate;
}
@keyframes seraSigilGlyph {
  from{text-shadow:0 0 22px #ffd700,0 0 55px #ff9900,0 0 110px rgba(255,160,0,.6);transform:translate(-50%,-50%) scale(1)}
  to  {text-shadow:0 0 45px #fff,0 0 90px #ffd700,0 0 180px rgba(255,200,0,.9);transform:translate(-50%,-50%) scale(1.12)}
}

/* ── Phase 6: Triple holy pulse ── */
.sera-holy-pulse {
  position:fixed;inset:0;pointer-events:none;z-index:10008;
  animation:seraHolyPulse ease-out forwards;
}
@keyframes seraHolyPulse {
  0%  {opacity:.7}
  100%{opacity:0}
}

/* ── Phase 6: HOLY FLASH ── */
.sera-holy-flash {
  position:fixed;inset:0;pointer-events:none;z-index:10010;
  animation:seraHolyBlind .52s ease-out forwards;
}
@keyframes seraHolyBlind {
  0%  {background:#fff;opacity:1}
  40% {background:#fffbe0;opacity:1}
  100%{opacity:0}
}

/* Gold wash */
.sera-goldwash {
  position:fixed;inset:0;pointer-events:none;z-index:10009;
  background:radial-gradient(ellipse at 50% 40%,
    rgba(255,220,80,.92) 0%,rgba(255,140,0,.65) 30%,
    rgba(200,60,0,.35) 60%,transparent 85%);
  animation:seraGoldWash .65s ease-out forwards;
}
@keyframes seraGoldWash {
  0%  {opacity:1;transform:scale(.75)}
  100%{opacity:0;transform:scale(1.35)}
}

/* ── Phase 7: Shockwave halos ── */
.sera-shockwave {
  position:fixed;left:50%;top:50%;
  width:10px;height:10px;border-radius:50%;
  border-width:4px;border-style:solid;
  transform:translate(-50%,-50%);
  pointer-events:none;z-index:10008;
  animation:seraShockExpand ease-out forwards;
}
@keyframes seraShockExpand {
  from{transform:translate(-50%,-50%) scale(.05);opacity:1}
  65% {opacity:.9}
  to  {transform:translate(-50%,-50%) scale(32);opacity:0}
}

/* Divine wind streaks */
.sera-wind {
  position:fixed;height:2px;border-radius:1px;
  pointer-events:none;z-index:10003;
  animation:seraWindBlast ease-out forwards;
  transform-origin:left center;
}
@keyframes seraWindBlast {
  0%  {transform:rotate(var(--wr)) scaleX(0);opacity:0}
  15% {opacity:1;transform:rotate(var(--wr)) scaleX(1)}
  70% {opacity:.6}
  100%{opacity:0;transform:rotate(var(--wr)) scaleX(1.2)}
}

/* ── Phase 8: Presence particles ── */
.sera-presence {
  position:fixed;left:50%;top:50%;
  border-radius:50%;pointer-events:none;z-index:10001;
  animation:seraPresenceDrift ease-out forwards;
}
@keyframes seraPresenceDrift {
  0%  {transform:translate(-50%,-50%) rotate(var(--spa)) translateX(0) scale(1);opacity:1}
  60% {opacity:.85}
  100%{transform:translate(-50%,-50%) rotate(var(--spa)) translateX(var(--spd)) scale(0);opacity:0}
}

/* Golden wisps */
.sera-wisp {
  position:fixed;border-radius:50%;pointer-events:none;z-index:10000;
  animation:seraWispGlow ease-out forwards;
}
@keyframes seraWispGlow {
  0%  {transform:scale(0);opacity:1}
  50% {opacity:.6}
  100%{transform:scale(var(--sw,5));opacity:0}
}

/* ── Phase 9: Title label ── */
.sera-label {
  position:fixed;left:50%;top:20%;
  transform:translateX(-50%);pointer-events:none;z-index:10012;
  white-space:nowrap;font-family:'Cinzel','Georgia',serif;
  display:flex;flex-direction:column;align-items:center;gap:10px;
  animation:seraLabelReveal 3.8s ease forwards;
}
.sera-label-main {
  font-size:14px;letter-spacing:16px;font-weight:900;color:#ffd700;
  text-shadow:0 0 10px #ffd700,0 0 28px #ff9900,0 0 65px rgba(255,160,0,.85);
}
.sera-label-sub {
  font-size:9px;letter-spacing:7px;
  color:rgba(255,220,120,.7);
  text-shadow:0 0 14px rgba(255,200,60,.7);
  font-style:italic;
}
@keyframes seraLabelReveal {
  0%  {opacity:0;transform:translateX(-50%) scale(.8) translateY(16px)}
  10% {opacity:1;transform:translateX(-50%) scale(1) translateY(0)}
  80% {opacity:1}
  100%{opacity:0;transform:translateX(-50%) scale(1.05) translateY(-6px)}
}

/* ── Corona rings (post-reveal) ── */
.sera-corona {
  position:fixed;left:50%;top:50%;border-radius:50%;
  transform:translate(-50%,-50%);pointer-events:none;z-index:9989;
  border:1px solid rgba(255,215,0,.28);
  animation:seraCoronaPulse ease-out infinite;
}
@keyframes seraCoronaPulse {
  0%  {transform:translate(-50%,-50%) scale(1);opacity:.55}
  100%{transform:translate(-50%,-50%) scale(5);opacity:0}
}

/* ── Body shake ── */
@keyframes seraBodyShake {
  0%,100%{transform:translate(0,0)}
  12%{transform:translate(-6px,4px)}  28%{transform:translate(6px,-5px)}
  44%{transform:translate(-5px,6px)}  60%{transform:translate(4px,-4px)}
  76%{transform:translate(-4px,3px)}  92%{transform:translate(3px,-3px)}
}
body.sera-shake { animation:seraBodyShake .65s ease-out; }

@keyframes seraBodyShakeHeavy {
  0%,100%{transform:translate(0,0)}
  8% {transform:translate(-12px,9px)}  22%{transform:translate(12px,-11px)}
  36%{transform:translate(-10px,12px)} 50%{transform:translate(10px,-10px)}
  64%{transform:translate(-9px,9px)}   78%{transform:translate(8px,-8px)}
}
body.sera-shake-heavy { animation:seraBodyShakeHeavy .68s ease-out; }
`;

function injectCSS() {
  if (document.getElementById('sera-styles')) return;
  const s = document.createElement('style');
  s.id = 'sera-styles';
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

// ══════════════════════════════════════════════════════════════
export class Seraphim {
  constructor(engine, rarity) {
    this.engine  = engine;
    this.rarity  = rarity;
    this.stopped = false;
    this._timers = [];
    this.fx = {
      shakeIntensity: 45,
      particleCount:  180,
      rayCount:       32,
      ringCount:      6,
      glowMaxAlpha:   0.95,
      crackCount:     7,
      pillarCount:    5,
      emberCount:     90,
      presenceCount:  130,
      wispCount:      11,
      windCount:      16,
      trailEnabled:   true,
      titleText:      'S E R A P H I M',
      subtitleText:   '✦  1 / 10,000  ✦',
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
      const { color, glowColor, particleColor } = this.rarity;
      const fx = this.fx;

      // ── Phase 0: Heaven void + faint stars ───────────────
      spawn(mk('sera-void'));
      this._spawnStarfield(80);

      // ── Phase 1: Veil tears ───────────────────────────────
      this._after(300, () => this._spawnVeilCracks(fx.crackCount));

      // ── Phase 2: Throne fire pillars ─────────────────────
      this._after(700, () => {
        const pillarPositions = [18, 31, 50, 69, 82];
        const pillarGrads = [
          'linear-gradient(180deg,rgba(255,255,200,1) 0%,rgba(255,200,60,.7) 40%,rgba(255,120,0,.4) 80%,transparent 100%)',
          'linear-gradient(180deg,rgba(255,230,100,1) 0%,rgba(255,170,20,.8) 40%,rgba(255,80,0,.4) 80%,transparent 100%)',
          'linear-gradient(180deg,rgba(255,255,255,1) 0%,rgba(255,220,80,.9) 30%,rgba(255,160,0,.5) 70%,transparent 100%)',
        ];
        pillarPositions.slice(0, fx.pillarCount).forEach((pos, i) => {
          this._after(i * 80, () => {
            const p = spawn(mk('sera-pillar'));
            p.style.left            = pos + '%';
            p.style.background      = pillarGrads[i % pillarGrads.length];
            p.style.boxShadow       = `0 0 ${12 + i*4}px rgba(255,200,60,.8),0 0 ${30+i*8}px rgba(255,140,0,.4)`;
            p.style.animationDuration = (1.25 + i * .15) + 's';
            p.style.animationDelay    = i * 80 + 'ms';
            this._after(1650, () => p.remove());
          });
        });
        document.body.classList.add('sera-shake');
        this._after(680, () => document.body.classList.remove('sera-shake'));
        this.engine.shake(fx.shakeIntensity * 0.35);
      });

      // ── Phase 3: Six wings + halo rings ──────────────────
      this._after(1100, () => {
        this._spawnWings();
        this._spawnHalos();
      });

      // ── Phase 4: Sacred ember rain ────────────────────────
      this._after(1400, () => this._spawnEmbers(fx.emberCount));

      // ── Phase 5: Seraphim sigil ───────────────────────────
      this._after(2000, () => {
        const sigil = spawn(mk('sera-sigil'));
        this._after(1650, () => sigil.remove());
        document.body.classList.add('sera-shake');
        this._after(540, () => document.body.classList.remove('sera-shake'));
        this.engine.shake(fx.shakeIntensity * 0.5);
      });

      // ── Phase 6: Triple holy pulse → HOLY FLASH ──────────
      this._after(2500, () => {
        // Three quick golden pulses building to the flash
        [0, 120, 240].forEach((delay, i) => {
          this._after(delay, () => {
            const pulse = spawn(mk('sera-holy-pulse'));
            pulse.style.background = `radial-gradient(ellipse at 50% 45%,
              rgba(255,${220 - i*20},${80 - i*30},${.35 + i*.15}) 0%,transparent 70%)`;
            pulse.style.animationDuration = '.18s';
            this._after(200, () => pulse.remove());
          });
        });

        // The flash itself
        this._after(360, () => {
          const flash = spawn(mk('sera-holy-flash'));
          this._after(560, () => flash.remove());

          const goldwash = spawn(mk('sera-goldwash'));
          this._after(720, () => goldwash.remove());

          document.body.classList.add('sera-shake-heavy');
          this._after(720, () => document.body.classList.remove('sera-shake-heavy'));
          this.engine.shake(fx.shakeIntensity);
        });
      });

      // ── Phase 7: Shockwave halos + divine wind ────────────
      this._after(2800, () => {
        const haloColors = ['#ffd700','#ffffff','#ffaa00','#fff5cc','#ff9900','#ffffff'];
        for (let i = 0; i < fx.ringCount; i++) {
          this._after(i * 55, () => {
            const wave = spawn(mk('sera-shockwave'));
            wave.style.borderColor       = haloColors[i % haloColors.length];
            wave.style.animationDuration = (.8 + i * .14) + 's';
            wave.style.animationDelay    = i * 55 + 'ms';
            this._after(1250, () => wave.remove());
          });
        }
        this._spawnWind(fx.windCount);
      });

      // ── Phase 8: Golden presence nebula ──────────────────
      this._after(3200, () => {
        this._spawnPresence(color, fx.presenceCount);
        this._spawnWisps(fx.wispCount);
      });

      // ── Phase 9: Canvas aura + text reveal ───────────────
      this._after(3800, () => {
        // Primary warm golden god rays
        this.engine.addEffect(new RayBurst({
          color:    particleColor,
          duration: 7000,
          maxAlpha: 0.22,
          rayCount: fx.rayCount,
          rotSpeed: 0.7,
        }));
        // Secondary slower amber rays
        this.engine.addEffect(new RayBurst({
          color:    '#ff9900',
          duration: 6500,
          maxAlpha: 0.12,
          rayCount: Math.floor(fx.rayCount * 0.6),
          rotSpeed: -0.4,
        }));

        // Deep golden radial glow
        this.engine.addEffect(new GlowOverlay({
          color:      glowColor,
          duration:   7000,
          maxAlpha:   fx.glowMaxAlpha,
          fadeIn:     0.05,
          fadeOut:    0.22,
          pulseSpeed: 1.6,
        }));

        // Brief blinding white core
        this.engine.addEffect(new GlowOverlay({
          color:    'rgba(255,255,255,0.65)',
          duration: 800,
          maxAlpha: 0.7,
          fadeIn:   0.08,
          fadeOut:  0.5,
          radial:   true,
        }));

        // Four staggered particle bursts — gold spectrum
        const burstColors = [particleColor, '#ffffff', '#ffaa00', '#ff9900'];
        burstColors.forEach((bc, i) => {
          this._after(i * 180, () => {
            this.engine.addEffect(new ParticleBurst(0.5, 0.5, {
              count:    Math.floor(fx.particleCount * (.6 + i * .15)),
              color:    bc,
              minSpeed: 180 + i * 70,
              maxSpeed: 520 + i * 90,
              minSize:  2,
              maxSize:  8,
              gravity:  40,
              trail:    fx.trailEnabled,
              glow:     true,
              duration: 5000,
              type:     i % 2 === 0 ? 'star' : 'circle',
            }));
          });
        });

        // Rising divine light from centre
        this.engine.addEffect(new ContinuousParticles({
          ox:        0.5,
          oy:        0.55,
          color:     particleColor,
          minSpeed:  70,
          maxSpeed:  240,
          gravity:   -60,
          upBias:    140,
          spread:    1.2,
          angle:     -Math.PI / 2,
          minSize:   2,
          maxSize:   7,
          trail:     true,
          glow:      true,
          spawnRate: 0.028,
          duration:  6000,
          type:      'star',
        }));

        // Golden ember drift from sides
        this.engine.addEffect(new ContinuousParticles({
          ox:        w => Math.random() * w,
          oy:        0,
          color:     '#ffd700',
          minSpeed:  30,
          maxSpeed:  100,
          gravity:   80,
          upBias:    -20,
          spread:    0.6,
          angle:     Math.PI / 2,
          minSize:   1.5,
          maxSize:   4.5,
          glow:      true,
          spawnRate: 0.02,
          duration:  5500,
        }));

        // DOM label
        this._after(380, () => {
          const label = spawn(mk('sera-label'));
          const main  = document.createElement('div');
          main.className   = 'sera-label-main';
          main.textContent = 'S E R A P H I M';
          const sub   = document.createElement('div');
          sub.className    = 'sera-label-sub';
          sub.textContent  = 'Holy, holy, holy';
          label.appendChild(main);
          label.appendChild(sub);
          this._after(3900, () => label.remove());
        });

        // Persistent corona rings
        this._after(500, () => {
          for (let i = 0; i < 3; i++) {
            this._after(i * 300, () => {
              const corona = spawn(mk('sera-corona'));
              const size   = 60 + i * 45;
              corona.style.width                  = size + 'px';
              corona.style.height                 = size + 'px';
              corona.style.animationDuration      = (1.5 + i * .5) + 's';
              corona.style.animationIterationCount = '5';
              corona.style.animationDelay         = i * .3 + 's';
              this._after(5000, () => corona.remove());
            });
          }
        });

        // Canvas text reveal
        this._after(550, () => {
          this.engine.addEffect(new RevealText({
            text:     fx.titleText,
            subtext:  fx.subtitleText,
            color,
            glowColor,
            shadow:   true,
            duration: 6000,
            font:     'bold 62px Cinzel, serif',
            subFont:  '20px Rajdhani, sans-serif',
            subColor: 'rgba(255,235,150,0.95)',
            y:        0.44,
          }));
        });
      });

      // ── Phase 10: Resolve ─────────────────────────────────
      this._after(10200, () => {
        killSpawned();
        resolve();
      });
    });
  }

  stop() {
    this.stopped = true;
    this._timers.forEach(clearTimeout);
    this._timers = [];
    document.body.classList.remove('sera-shake', 'sera-shake-heavy');
    killSpawned();
  }

  // ── Faint golden-tinted star field ──────────────────────────
  _spawnStarfield(count) {
    const sf = spawn(mk('sera-starfield'));
    for (let i = 0; i < count; i++) {
      const s  = mk('sera-bg-star');
      const sz = 0.8 + Math.random() * 2;
      // Warm golden tint on some stars
      const col = Math.random() > .6 ? `rgba(255,${210+Math.random()*45|0},${80+Math.random()*80|0},1)` : '#fff';
      s.style.cssText = `
        left:${Math.random()*100}vw;top:${Math.random()*100}vh;
        width:${sz}px;height:${sz}px;
        background:${col};border-radius:50%;
        --base-op:${.15+Math.random()*.5};
        animation-duration:${.8+Math.random()*2.5}s;
        animation-delay:${Math.random()*1.5}s;
      `;
      sf.appendChild(s);
    }
  }

  // ── Veil cracks ─────────────────────────────────────────────
  _spawnVeilCracks(count) {
    const presets = [
      { x: 50, y: 20, w: 22, a: -8  },
      { x: 30, y: 35, w: 18, a: -20 },
      { x: 68, y: 30, w: 20, a:  14 },
      { x: 42, y: 55, w: 25, a:   5 },
      { x: 58, y: 48, w: 16, a: -12 },
      { x: 22, y: 25, w: 14, a:  25 },
      { x: 74, y: 60, w: 18, a: -18 },
      { x: 38, y: 72, w: 20, a:   9 },
    ];
    presets.slice(0, count).forEach((c, i) => {
      this._after(i * 55, () => {
        const crack = spawn(mk('sera-crack'));
        crack.style.left             = c.x + 'vw';
        crack.style.top              = c.y + 'vh';
        crack.style.width            = c.w + 'vw';
        crack.style.setProperty('--cr', c.a + 'deg');
        crack.style.animationDuration = (.9 + Math.random() * .3) + 's';
        crack.style.animationDelay    = i * 50 + 'ms';
        crack.appendChild(mk('sera-crack-inner'));
        this._after(1250, () => crack.remove());

        const light = spawn(mk('sera-crack-light'));
        const lsize = 85 + Math.random() * 110;
        light.style.cssText = `
          left:${c.x + c.w/2}vw;top:${c.y}vh;
          width:${lsize}px;height:${lsize}px;
          animation-duration:${.6+Math.random()*.3}s;
          animation-delay:${i*50+100}ms;
        `;
        this._after(1100, () => light.remove());
      });
    });
  }

  // ── Six wings of light ───────────────────────────────────────
  _spawnWings() {
    const wings = [
      { angle: -55,  len: '40vw', h: '20px' },
      { angle:  55,  len: '40vw', h: '20px' },
      { angle: -100, len: '34vw', h: '15px' },
      { angle:  100, len: '34vw', h: '15px' },
      { angle: -145, len: '28vw', h: '12px' },
      { angle:  145, len: '28vw', h: '12px' },
    ];
    const container = spawn(mk('sera-wing-container'));
    wings.forEach((w, i) => {
      this._after(i * 60, () => {
        const wing    = mk('sera-wing');
        const feather = mk('sera-wing-feather');
        const b = 1 - i * 0.07;
        feather.style.background = `linear-gradient(90deg,
          rgba(255,255,220,${b}) 0%,
          rgba(255,210,80,${b*.8}) 35%,
          rgba(255,160,20,${b*.5}) 70%,
          transparent 100%)`;
        feather.style.boxShadow = `0 0 ${10+i*2}px rgba(255,200,60,.7),0 0 ${26+i*5}px rgba(255,140,0,.4)`;
        wing.appendChild(feather);
        wing.style.setProperty('--wa', w.angle + 'deg');
        wing.style.setProperty('--wl', w.len);
        wing.style.setProperty('--wh', w.h);
        wing.style.animationDuration = (1.25 + i * .1) + 's';
        wing.style.animationDelay    = i * 60 + 'ms';
        container.appendChild(wing);
      });
    });
    this._after(1700, () => container.remove());
  }

  // ── Centre halo rings ────────────────────────────────────────
  _spawnHalos() {
    const haloColors = ['#ffd700','#fff5cc','#ffaa00'];
    for (let i = 0; i < 3; i++) {
      this._after(i * 120, () => {
        const halo = spawn(mk('sera-halo'));
        const size = 12 + i * 8;
        halo.style.cssText = `
          width:${size}px;height:${size}px;
          border:${3-i}px solid ${haloColors[i]};
          box-shadow:0 0 ${8+i*7}px ${haloColors[i]};
          --hs:${6+i*2};
          animation-duration:${.75+i*.2}s;
          animation-delay:${i*120}ms;
        `;
        this._after(1050, () => halo.remove());
      });
    }
  }

  // ── Sacred ember rain ────────────────────────────────────────
  _spawnEmbers(count) {
    const cols = ['#fff','#fffbe0','#ffd700','#ffaa00','#ff8800'];
    for (let i = 0; i < count; i++) {
      const ember = spawn(mk('sera-ember'));
      const size  = 3 + Math.random() * 7;
      const col   = cols[Math.floor(Math.random() * cols.length)];
      const dur   = 1.4 + Math.random() * 2.0;
      const drift = (Math.random() - .5) * 80;
      ember.style.cssText = `
        left:${Math.random()*100}vw;
        width:${size}px;height:${size}px;
        background:${col};
        box-shadow:0 0 ${3+Math.random()*5}px ${col};
        --ex:${drift}px;
        animation-duration:${dur}s;
        animation-delay:${Math.random()*.8}s;
      `;
      this._after((dur + .8) * 1000, () => ember.remove());
    }
  }

  // ── Divine wind streaks ──────────────────────────────────────
  _spawnWind(count) {
    for (let i = 0; i < count; i++) {
      const wind  = spawn(mk('sera-wind'));
      const angle = -18 + Math.random() * 36;
      const w     = 8 + Math.random() * 28;
      const dur   = .32 + Math.random() * .45;
      wind.style.cssText = `
        left:${Math.random()*90}vw;top:${Math.random()*100}vh;
        width:${w}vw;
        --wr:${angle}deg;
        background:linear-gradient(90deg,transparent 0%,rgba(255,230,120,.75) 50%,transparent 100%);
        animation-duration:${dur}s;
        animation-delay:${Math.random()*.35}s;
      `;
      this._after((dur + .45) * 1000, () => wind.remove());
    }
  }

  // ── Golden presence particles ────────────────────────────────
  _spawnPresence(color, count) {
    const palette = ['#ffd700','#fff','#ffaa00','#fff5cc','#ffcc44','#ff9900'];
    for (let i = 0; i < count; i++) {
      const p     = spawn(mk('sera-presence'));
      const size  = 2 + Math.random() * 9;
      const angle = Math.random() * 360;
      const dist  = 18 + Math.random() * 55;
      const dur   = .7 + Math.random() * 1.3;
      const col   = palette[Math.floor(Math.random() * palette.length)];
      p.style.cssText = `
        width:${size}px;height:${size}px;
        background:${col};
        box-shadow:0 0 ${2+Math.random()*6}px ${col};
        --spa:${angle}deg;--spd:${dist}vmin;
        animation-duration:${dur}s;
        animation-delay:${Math.random()*.45}s;
      `;
      this._after((dur + .55) * 1000, () => p.remove());
    }
  }

  // ── Golden wisps ─────────────────────────────────────────────
  _spawnWisps(count) {
    const wispCols = [
      'rgba(255,200,50,.55)','rgba(255,255,180,.45)',
      'rgba(255,140,0,.42)','rgba(255,240,120,.5)',
    ];
    for (let i = 0; i < count; i++) {
      const wisp = spawn(mk('sera-wisp'));
      const size = 90 + Math.random() * 190;
      const dur  = 1.0 + Math.random() * 1.0;
      const wc   = wispCols[Math.floor(Math.random() * wispCols.length)];
      wisp.style.cssText = `
        left:${5+Math.random()*90}vw;top:${5+Math.random()*90}vh;
        width:${size}px;height:${size}px;
        --sw:${3+Math.random()*3};
        animation-duration:${dur}s;
        animation-delay:${Math.random()*.35}s;
        background:radial-gradient(circle,${wc} 0%,transparent 70%);
      `;
      this._after((dur + .55) * 1000, () => wisp.remove());
    }
  }
}