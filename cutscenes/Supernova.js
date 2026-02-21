// cutscenes/Supernova.js
// ═══════════════════════════════════════════════════════════════
//  S U P E R N O V A  —  1 / 5,000
//  Hybrid: DOM/CSS animations + canvas particle engine
//
//  Phase 0  (0ms)    : Void + starfield
//  Phase 1  (400ms)  : Progenitor star ignites
//  Phase 2  (900ms)  : Star swells and redshifts
//  Phase 3  (1100ms) : Core collapse — gravity infall rings
//  Phase 4  (1400ms) : DETONATION — flash + fireball + colorwash
//  Phase 5  (1550ms) : Ejecta rings tear outward
//  Phase 6  (1750ms) : Gamma-ray burst pillars
//  Phase 7  (2050ms) : Debris nebula + wisps
//  Phase 8  (2650ms) : Remnant pulsar spins with beam jets
//  Phase 9  (3100ms) : Canvas aura + text reveal
//  Phase 10 (8500ms) : Resolve
// ═══════════════════════════════════════════════════════════════

import { ParticleBurst, ContinuousParticles } from '../effects/ParticleBurst.js';
import { GlowOverlay, RayBurst }               from '../effects/GlowOverlay.js';
import { RevealText }                           from '../effects/RevealText.js';

// ── Inline CSS injected once ───────────────────────────────────
const CSS = `
/* ── Phase 0: Deep void ── */
.sn-void {
  position:fixed;inset:0;
  background:radial-gradient(ellipse at 50% 50%,#050008 0%,#000 100%);
  z-index:9990;pointer-events:none;
  animation:snVoidFade 3.8s ease forwards;
}
@keyframes snVoidFade {
  0%{opacity:1} 88%{opacity:1} 100%{opacity:0}
}

/* ── Star field ── */
.sn-starfield {
  position:fixed;inset:0;z-index:9991;pointer-events:none;overflow:hidden;
}
.sn-bg-star {
  position:absolute;border-radius:50%;background:#fff;
  animation:snStarTwinkle linear infinite alternate;
}
@keyframes snStarTwinkle {
  from{opacity:var(--base-op,.4);transform:scale(1)}
  to  {opacity:1;transform:scale(1.4)}
}

/* ── Phase 1: Progenitor star ── */
.sn-star {
  position:fixed;left:50%;top:50%;
  width:40px;height:40px;border-radius:50%;
  transform:translate(-50%,-50%);
  pointer-events:none;z-index:9995;
  background:radial-gradient(circle,#fff 0%,#fffde0 30%,#ffdd66 60%,#ff8800 85%,transparent 100%);
  box-shadow:
    0 0 20px 8px rgba(255,220,80,.9),
    0 0 60px 20px rgba(255,140,0,.6),
    0 0 120px 40px rgba(255,80,0,.3);
  animation:snStarBirth .8s ease forwards;
}
@keyframes snStarBirth {
  from{transform:translate(-50%,-50%) scale(0);opacity:0}
  to  {transform:translate(-50%,-50%) scale(1);opacity:1}
}

/* ── Phase 2: Swell & redshift ── */
.sn-star.sn-swelling {
  animation:snStarSwell .6s ease-in forwards;
}
@keyframes snStarSwell {
  0%{
    transform:translate(-50%,-50%) scale(1);
    background:radial-gradient(circle,#fff 0%,#fffde0 30%,#ffdd66 60%,#ff8800 85%,transparent 100%);
    box-shadow:0 0 20px 8px rgba(255,220,80,.9),0 0 60px 20px rgba(255,140,0,.6);
  }
  60%{
    transform:translate(-50%,-50%) scale(4.5);
    background:radial-gradient(circle,#fff 0%,#ffcc88 25%,#ff4400 55%,#aa0000 80%,transparent 100%);
    box-shadow:0 0 50px 25px rgba(255,80,0,.95),0 0 120px 60px rgba(200,0,0,.7),0 0 220px 90px rgba(120,0,0,.4);
  }
  100%{
    transform:translate(-50%,-50%) scale(3.2);
    background:radial-gradient(circle,#fff 0%,#ffcc88 25%,#ff4400 55%,#aa0000 80%,transparent 100%);
    box-shadow:0 0 40px 20px rgba(255,80,0,.9),0 0 100px 50px rgba(200,0,0,.65);
  }
}

/* ── Phase 3: Core collapse ── */
.sn-collapse {
  position:fixed;left:50%;top:50%;
  width:220px;height:220px;border-radius:50%;
  transform:translate(-50%,-50%);
  pointer-events:none;z-index:9996;
  background:radial-gradient(circle,rgba(0,0,0,1) 0%,rgba(20,0,40,.95) 40%,transparent 70%);
  animation:snCollapse .38s cubic-bezier(.8,0,1,.4) forwards;
}
@keyframes snCollapse {
  from{transform:translate(-50%,-50%) scale(0);opacity:0}
  25% {opacity:1}
  to  {transform:translate(-50%,-50%) scale(1);opacity:1}
}

/* Infall rings drawn inward */
.sn-infall {
  position:fixed;left:50%;top:50%;
  width:10px;height:10px;border-radius:50%;
  border-width:2px;border-style:solid;
  transform:translate(-50%,-50%);
  pointer-events:none;z-index:9994;
  animation:snInfall ease-in forwards;
}
@keyframes snInfall {
  from{transform:translate(-50%,-50%) scale(var(--is,8));opacity:.7}
  to  {transform:translate(-50%,-50%) scale(0);opacity:0}
}

/* ── Phase 4: DETONATION ── */
.sn-flash {
  position:fixed;inset:0;pointer-events:none;z-index:10010;
  background:#fff;
  animation:snFlash .42s ease-out forwards;
}
@keyframes snFlash {
  0%{opacity:1} 100%{opacity:0}
}

.sn-colorwash {
  position:fixed;inset:0;pointer-events:none;z-index:10009;
  animation:snColorWash .55s ease-out forwards;
}
@keyframes snColorWash {
  0%{opacity:.9} 100%{opacity:0}
}

.sn-fireball {
  position:fixed;left:50%;top:50%;
  width:60px;height:60px;border-radius:50%;
  transform:translate(-50%,-50%);
  pointer-events:none;z-index:10007;
  background:radial-gradient(circle,
    #fff 0%,#fff5a0 15%,#ffaa00 35%,#ff4400 55%,#cc0044 75%,transparent 100%);
  animation:snFireball .88s cubic-bezier(.05,.9,.1,1) forwards;
}
@keyframes snFireball {
  from{transform:translate(-50%,-50%) scale(0);opacity:1}
  65% {opacity:1}
  to  {transform:translate(-50%,-50%) scale(26);opacity:0}
}

/* ── Phase 5: Ejecta rings ── */
.sn-ejecta-ring {
  position:fixed;left:50%;top:50%;
  width:10px;height:10px;border-radius:50%;
  border-width:5px;border-style:solid;
  transform:translate(-50%,-50%);
  pointer-events:none;z-index:10008;
  animation:snEjectaExpand ease-out forwards;
}
@keyframes snEjectaExpand {
  from{transform:translate(-50%,-50%) scale(.05);opacity:1}
  65% {opacity:.8}
  to  {transform:translate(-50%,-50%) scale(30);opacity:0}
}

/* ── Phase 6: Gamma-ray pillars ── */
.sn-gamma-pillar {
  position:fixed;left:50%;top:0;
  width:5px;height:100vh;
  transform-origin:50% 50vh;
  pointer-events:none;z-index:10005;
  animation:snGammaPillar ease-out forwards;
}
@keyframes snGammaPillar {
  0%  {opacity:0;transform:rotate(var(--pa)) scaleX(1)}
  8%  {opacity:1;transform:rotate(var(--pa)) scaleX(4)}
  45% {opacity:.8;transform:rotate(var(--pa)) scaleX(1.5)}
  100%{opacity:0;transform:rotate(var(--pa)) scaleX(1)}
}

/* ── Phase 7: Stellar debris ── */
.sn-debris {
  position:fixed;left:50%;top:50%;
  border-radius:50%;pointer-events:none;z-index:10002;
  animation:snDebrisShoot ease-out forwards;
}
@keyframes snDebrisShoot {
  0%  {transform:translate(-50%,-50%) rotate(var(--da)) translateX(0) scale(1.5);opacity:1}
  65% {opacity:.9}
  100%{transform:translate(-50%,-50%) rotate(var(--da)) translateX(var(--dd)) scale(0);opacity:0}
}

.sn-nebula-wisp {
  position:fixed;border-radius:50%;pointer-events:none;z-index:10000;
  animation:snWispExpand ease-out forwards;
}
@keyframes snWispExpand {
  0%  {transform:scale(0);opacity:.9}
  50% {opacity:.4}
  100%{transform:scale(var(--ws,5));opacity:0}
}

/* ── Phase 8: Remnant pulsar ── */
.sn-pulsar {
  position:fixed;left:50%;top:50%;
  width:14px;height:14px;border-radius:50%;
  transform:translate(-50%,-50%);
  pointer-events:none;z-index:10006;
  background:radial-gradient(circle,#fff 0%,#aaeeff 50%,transparent 100%);
  box-shadow:
    0 0 10px 4px rgba(100,220,255,.95),
    0 0 28px 10px rgba(50,160,255,.7),
    0 0 60px 20px rgba(0,120,255,.4);
  animation:snPulsarSpin 3.6s ease forwards;
}
@keyframes snPulsarSpin {
  0%  {transform:translate(-50%,-50%) scale(0) rotate(0deg);opacity:0}
  8%  {transform:translate(-50%,-50%) scale(1) rotate(0deg);opacity:1}
  92% {transform:translate(-50%,-50%) scale(1) rotate(1800deg);opacity:1}
  100%{transform:translate(-50%,-50%) scale(0) rotate(1800deg);opacity:0}
}
.sn-pulsar::before,.sn-pulsar::after {
  content:"";position:absolute;left:50%;
  width:3px;border-radius:2px;pointer-events:none;
}
.sn-pulsar::before {
  top:50%;height:38vh;
  transform:translateX(-50%) translateY(-100%);
  background:linear-gradient(180deg,rgba(120,220,255,1) 0%,rgba(60,160,255,.3) 70%,transparent 100%);
  animation:snBeamPulse .25s ease-in-out infinite alternate;
}
.sn-pulsar::after {
  bottom:50%;height:38vh;
  transform:translateX(-50%) translateY(100%) rotate(180deg);
  background:linear-gradient(180deg,rgba(120,220,255,1) 0%,rgba(60,160,255,.3) 70%,transparent 100%);
  animation:snBeamPulse .25s .12s ease-in-out infinite alternate;
}
@keyframes snBeamPulse {
  from{opacity:.25;filter:blur(1.5px)}
  to  {opacity:1;filter:blur(0px)}
}

.sn-pulsar-halo {
  position:fixed;left:50%;top:50%;
  border-radius:50%;
  border:1px solid rgba(100,200,255,.5);
  transform:translate(-50%,-50%);
  pointer-events:none;z-index:10001;
  animation:snHaloPulse ease-out infinite;
}
@keyframes snHaloPulse {
  0%  {transform:translate(-50%,-50%) scale(1);opacity:.6}
  100%{transform:translate(-50%,-50%) scale(4);opacity:0}
}

/* ── Phase 9: Title label ── */
.sn-label {
  position:fixed;left:50%;top:22%;
  transform:translateX(-50%);
  font-size:13px;letter-spacing:18px;font-weight:900;
  color:#fff;
  text-shadow:0 0 8px #ffbb00,0 0 22px #ff4400,0 0 50px #ff0066;
  animation:snLabelReveal 3.2s ease forwards;
  pointer-events:none;z-index:10011;white-space:nowrap;
  font-family:'Cinzel','Georgia',serif;
}
@keyframes snLabelReveal {
  0%  {opacity:0;transform:translateX(-50%) scale(.75) translateY(10px)}
  10% {opacity:1;transform:translateX(-50%) scale(1) translateY(0)}
  82% {opacity:1}
  100%{opacity:0;transform:translateX(-50%) scale(1.05) translateY(-5px)}
}

/* ── Body shake ── */
@keyframes snBodyShake {
  0%,100%{transform:translate(0,0)}
  12%{transform:translate(-6px,4px)}   28%{transform:translate(6px,-5px)}
  44%{transform:translate(-5px,6px)}   60%{transform:translate(4px,-4px)}
  76%{transform:translate(-4px,3px)}   92%{transform:translate(3px,-3px)}
}
body.sn-shake { animation:snBodyShake .55s ease-out; }

@keyframes snBodyShakeHeavy {
  0%,100%{transform:translate(0,0)}
  8% {transform:translate(-14px,10px)} 22%{transform:translate(14px,-12px)}
  36%{transform:translate(-12px,14px)} 50%{transform:translate(11px,-11px)}
  64%{transform:translate(-10px,10px)} 78%{transform:translate(9px,-9px)}
  92%{transform:translate(-7px,7px)}
}
body.sn-shake-heavy { animation:snBodyShakeHeavy .72s ease-out; }
`;

function injectCSS() {
  if (document.getElementById('sn-styles')) return;
  const s = document.createElement('style');
  s.id = 'sn-styles';
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
export class Supernova {
  constructor(engine, rarity) {
    this.engine  = engine;
    this.rarity  = rarity;
    this.stopped = false;
    this._timers = [];
    this._star   = null;
    this.fx = {
      shakeIntensity: 40,
      particleCount:  160,
      rayCount:       28,
      ringCount:      6,
      glowMaxAlpha:   0.92,
      debrisCount:    140,
      wispCount:      12,
      trailEnabled:   true,
      titleText:      'S U P E R N O V A',
      subtitleText:   '✦  1 / 5,000  ✦',
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

      // ── Phase 0: Void + starfield ─────────────────────────
      spawn(mk('sn-void'));
      this._spawnStarfield(120);

      // ── Phase 1: Progenitor star ignites ─────────────────
      this._after(400, () => {
        this._star = spawn(mk('sn-star'));
      });

      // ── Phase 2: Swell and redshift ──────────────────────
      this._after(900, () => {
        if (this._star) this._star.classList.add('sn-swelling');
      });

      // ── Phase 3: Core collapse ────────────────────────────
      this._after(1100, () => {
        const collapse = spawn(mk('sn-collapse'));
        this._after(420, () => collapse.remove());

        const infallColors = ['#ff6600','#ff2200','#ffaa00','#ffffff','#aa0000'];
        for (let i = 0; i < 5; i++) {
          this._after(i * 30, () => {
            const ring = spawn(mk('sn-infall'));
            ring.style.borderColor       = infallColors[i % infallColors.length];
            ring.style.setProperty('--is', 4 + i * 1.5);
            ring.style.animationDuration = (.28 + i * .04) + 's';
            ring.style.animationDelay    = i * 30 + 'ms';
            this._after(420, () => ring.remove());
          });
        }

        document.body.classList.add('sn-shake');
        this._after(580, () => document.body.classList.remove('sn-shake'));
        this.engine.shake(fx.shakeIntensity * 0.4);
      });

      // ── Phase 4: DETONATION ───────────────────────────────
      this._after(1400, () => {
        if (this._star) { this._star.remove(); this._star = null; }

        const flash = spawn(mk('sn-flash'));
        this._after(460, () => flash.remove());

        const colorwash = spawn(mk('sn-colorwash'));
        colorwash.style.background = `radial-gradient(circle,#fff 0%,${color} 40%,transparent 80%)`;
        this._after(620, () => colorwash.remove());

        const fireball = spawn(mk('sn-fireball'));
        this._after(960, () => fireball.remove());

        document.body.classList.add('sn-shake-heavy');
        this._after(750, () => document.body.classList.remove('sn-shake-heavy'));
        this.engine.shake(fx.shakeIntensity);
      });

      // ── Phase 5: Ejecta rings ─────────────────────────────
      this._after(1550, () => {
        const ringColors = ['#ffffff','#ffaa00','#ff4400','#ff00aa','#ffffff','#ffcc00'];
        for (let i = 0; i < fx.ringCount; i++) {
          this._after(i * 45, () => {
            const ring = spawn(mk('sn-ejecta-ring'));
            ring.style.borderColor       = ringColors[i % ringColors.length];
            ring.style.animationDuration = (.7 + i * .12) + 's';
            ring.style.animationDelay    = i * 40 + 'ms';
            this._after(1120, () => ring.remove());
          });
        }
      });

      // ── Phase 6: Gamma-ray burst pillars ─────────────────
      this._after(1750, () => {
        const angles  = [0, 90, 45, 135, 22, 112, 67, 157];
        const pillarBgs = [
          'linear-gradient(180deg,rgba(255,255,150,.9) 0%,rgba(255,180,0,.5) 50%,transparent 100%)',
          'linear-gradient(180deg,rgba(255,150,255,.9) 0%,rgba(255,0,180,.5) 50%,transparent 100%)',
          'linear-gradient(180deg,rgba(150,220,255,.9) 0%,rgba(0,150,255,.5) 50%,transparent 100%)',
        ];
        angles.forEach((angle, i) => {
          this._after(i * 35, () => {
            const pillar = spawn(mk('sn-gamma-pillar'));
            pillar.style.setProperty('--pa', angle + 'deg');
            pillar.style.background       = pillarBgs[i % pillarBgs.length];
            pillar.style.animationDuration = (.7 + Math.random() * .3) + 's';
            pillar.style.animationDelay    = i * 35 + 'ms';
            this._after(1050, () => pillar.remove());
          });
        });
      });

      // ── Phase 7: Debris nebula ────────────────────────────
      this._after(2050, () => {
        this._spawnDebris(color, fx.debrisCount);
        this._spawnWisps(color, fx.wispCount);
      });

      // ── Phase 8: Remnant pulsar ───────────────────────────
      this._after(2650, () => {
        const pulsar = spawn(mk('sn-pulsar'));
        this._after(3650, () => pulsar.remove());

        for (let i = 0; i < 3; i++) {
          this._after(i * 200, () => {
            const halo = spawn(mk('sn-pulsar-halo'));
            const size = 20 + i * 16;
            halo.style.width               = size + 'px';
            halo.style.height              = size + 'px';
            halo.style.animationDuration   = (1.0 + i * .4) + 's';
            halo.style.animationDelay      = i * .2 + 's';
            halo.style.animationIterationCount = '4';
            this._after(3600, () => halo.remove());
          });
        }
      });

      // ── Phase 9: Canvas aura + text reveal ───────────────
      this._after(3100, () => {
        // Chromatic god rays — multi-colour
        const rayColors = [particleColor, '#ff4400', '#00ccff'];
        rayColors.forEach((rc, i) => {
          this._after(i * 120, () => {
            this.engine.addEffect(new RayBurst({
              color:    rc,
              duration: 6000,
              maxAlpha: 0.18 - i * 0.03,
              rayCount: Math.floor(fx.rayCount / (i + 1)),
              rotSpeed: 0.6 + i * 0.4,
            }));
          });
        });

        // Massive outer glow
        this.engine.addEffect(new GlowOverlay({
          color:      glowColor,
          duration:   6500,
          maxAlpha:   fx.glowMaxAlpha,
          fadeIn:     0.05,
          fadeOut:    0.25,
          pulseSpeed: 2.8,
        }));

        // Inner white core flash
        this.engine.addEffect(new GlowOverlay({
          color:    'rgba(255,255,255,0.6)',
          duration: 900,
          maxAlpha: 0.65,
          fadeIn:   0.08,
          fadeOut:  0.5,
          radial:   true,
        }));

        // Four staggered particle rings — full spectrum
        const burstColors = [particleColor, '#ff4400', '#ff00aa', '#ffffff'];
        burstColors.forEach((bc, i) => {
          this._after(i * 200, () => {
            this.engine.addEffect(new ParticleBurst(0.5, 0.5, {
              count:    Math.floor(fx.particleCount * (0.6 + i * 0.15)),
              color:    bc,
              minSpeed: 200 + i * 80,
              maxSpeed: 550 + i * 100,
              minSize:  2,
              maxSize:  8,
              gravity:  45,
              trail:    fx.trailEnabled,
              glow:     true,
              duration: 4000,
              type:     i % 2 === 0 ? 'star' : 'circle',
            }));
          });
        });

        // Continuous spectrum nebula from centre
        this.engine.addEffect(new ContinuousParticles({
          ox:        0.5,
          oy:        0.5,
          color:     particleColor,
          minSpeed:  80,
          maxSpeed:  280,
          gravity:   -20,
          spread:    Math.PI * 2,
          minSize:   2,
          maxSize:   8,
          trail:     true,
          glow:      true,
          spawnRate: 0.025,
          duration:  5500,
          type:      'star',
        }));

        // Cosmic debris raining from top
        this.engine.addEffect(new ContinuousParticles({
          ox:        w => Math.random() * w,
          oy:        0,
          color:     '#ffcc00',
          minSpeed:  40,
          maxSpeed:  140,
          gravity:   110,
          upBias:    -35,
          spread:    0.4,
          angle:     Math.PI / 2,
          minSize:   1.5,
          maxSize:   5,
          glow:      true,
          spawnRate: 0.018,
          duration:  5000,
        }));

        // DOM stellar label
        this._after(350, () => {
          const label = spawn(mk('sn-label'));
          label.textContent = '✦  S U P E R N O V A  ✦';
          this._after(3300, () => label.remove());
        });

        // Canvas text reveal
        this._after(500, () => {
          this.engine.addEffect(new RevealText({
            text:     fx.titleText,
            subtext:  fx.subtitleText,
            color,
            glowColor,
            shadow:   true,
            duration: 5500,
            font:     'bold 60px Cinzel, serif',
            subFont:  '20px Rajdhani, sans-serif',
            subColor: 'rgba(255,220,150,0.95)',
            y:        0.44,
          }));
        });
      });

      // ── Phase 10: Resolve ─────────────────────────────────
      this._after(8800, () => {
        killSpawned();
        resolve();
      });
    });
  }

  stop() {
    this.stopped = true;
    this._timers.forEach(clearTimeout);
    this._timers = [];
    document.body.classList.remove('sn-shake', 'sn-shake-heavy');
    killSpawned();
  }

  // ── 120 twinkling background stars ──────────────────────────
  _spawnStarfield(count) {
    const sf = spawn(mk('sn-starfield'));
    for (let i = 0; i < count; i++) {
      const s  = mk('sn-bg-star');
      const sz = 0.8 + Math.random() * 2.5;
      s.style.cssText = `
        left:${Math.random()*100}vw;top:${Math.random()*100}vh;
        width:${sz}px;height:${sz}px;
        --base-op:${.2+Math.random()*.65};
        animation-duration:${.6+Math.random()*2.5}s;
        animation-delay:${Math.random()*1.2}s;
      `;
      sf.appendChild(s);
    }
  }

  // ── Stellar debris ───────────────────────────────────────────
  _spawnDebris(color, count) {
    const palette = [color,'#fff','#ffcc00','#ff4400','#ff00aa','#8800ff','#00ccff'];
    for (let i = 0; i < count; i++) {
      const frag  = spawn(mk('sn-debris'));
      const size  = 2 + Math.random() * 8;
      const angle = Math.random() * 360;
      const dist  = 20 + Math.random() * 55;
      const dur   = .6 + Math.random() * 1.1;
      const col   = palette[Math.floor(Math.random() * palette.length)];
      frag.style.cssText = `
        width:${size}px;height:${size}px;
        --da:${angle}deg;--dd:${dist}vmin;
        animation-duration:${dur}s;
        animation-delay:${Math.random()*.35}s;
        background:${col};
        box-shadow:0 0 ${2+Math.random()*5}px ${col};
      `;
      this._after((dur + .4) * 1000, () => frag.remove());
    }
  }

  // ── Nebula wisps ─────────────────────────────────────────────
  _spawnWisps(color, count) {
    const wispColors = [
      `rgba(255,80,0,.5)`,`rgba(255,0,120,.4)`,`rgba(140,0,255,.4)`,
      `rgba(0,180,255,.4)`,`rgba(255,200,0,.4)`,
    ];
    for (let i = 0; i < count; i++) {
      const wisp = spawn(mk('sn-nebula-wisp'));
      const size = 80 + Math.random() * 160;
      const dur  = .9 + Math.random() * .8;
      const wc   = wispColors[Math.floor(Math.random() * wispColors.length)];
      wisp.style.cssText = `
        left:${5+Math.random()*90}vw;top:${5+Math.random()*90}vh;
        width:${size}px;height:${size}px;
        --ws:${3+Math.random()*3};
        animation-duration:${dur}s;
        animation-delay:${Math.random()*.3}s;
        background:radial-gradient(circle,${wc} 0%,transparent 70%);
      `;
      this._after((dur + .4) * 1000, () => wisp.remove());
    }
  }
}