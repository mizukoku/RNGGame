// cutscenes/CometStrike.js
// ═══════════════════════════════════════════════════════════════
//  COMET STRIKE  —  1 / 1,000
//  Hybrid: DOM/CSS animations + canvas particle engine
//
//  Phase 0  (0ms)    : Deep-space blackout
//  Phase 1  (100ms)  : Stars flicker in
//  Phase 2  (400ms)  : Comet blazes across
//  Phase 3  (700ms)  : Stardust trail lingers
//  Phase 4  (900ms)  : Constellation lines ignite
//  Phase 5  (1100ms) : Impact shockwaves + core burst + shards
//  Phase 6  (1600ms) : Canvas aura + text reveal
//  Phase 7  (4800ms) : Clean up → resolve
// ═══════════════════════════════════════════════════════════════

import { ParticleBurst, ContinuousParticles } from '../effects/ParticleBurst.js';
import { ScreenFlash }                        from '../effects/ScreenFlash.js';
import { GlowOverlay, RayBurst }              from '../effects/GlowOverlay.js';
import { RevealText }                          from '../effects/RevealText.js';
import { ScreenShake }                         from '../effects/ScreenShake.js';

// ── CSS injected once ─────────────────────────────────────────
const CSS = `
/* ── Phase 0: Void ── */
.cs-blackout {
  position:fixed;inset:0;
  background:radial-gradient(ellipse at 50% 50%,#06010f 0%,#000 100%);
  z-index:9990;pointer-events:none;
  animation:csBOFade 2s ease forwards;
}
@keyframes csBOFade {
  0%{opacity:1} 78%{opacity:1} 100%{opacity:0}
}

/* ── Phase 1: Star field ── */
.cs-starfield {
  position:fixed;inset:0;z-index:9991;pointer-events:none;overflow:hidden;
  animation:csStarReveal .5s ease forwards;
}
@keyframes csStarReveal { from{opacity:0} to{opacity:1} }

.cs-bg-star {
  position:absolute;border-radius:50%;background:#fff;
  animation:csStarTwinkle linear infinite alternate;
}
@keyframes csStarTwinkle {
  from{opacity:.2} to{opacity:1}
}

/* ── Phase 2: Comet head ── */
.cs-head {
  position:fixed;width:32px;height:32px;border-radius:50%;
  background:radial-gradient(circle,#fff 0%,#ffe066 35%,#ff6600 65%,transparent 100%);
  box-shadow:0 0 20px 8px #ffe066,0 0 45px 12px #ff6600,0 0 90px 24px rgba(255,80,0,.5);
  z-index:9998;pointer-events:none;
  animation:csHeadFly .95s cubic-bezier(.15,.6,.3,1) forwards;
}
@keyframes csHeadFly {
  0%   { transform:translate(-12vw,-12vh) scale(1.5); opacity:1 }
  70%  { opacity:1 }
  100% { transform:translate(115vw,95vh)  scale(.35);  opacity:0 }
}
.cs-head::before {
  content:"";position:absolute;inset:-8px;border-radius:50%;
  background:radial-gradient(circle,rgba(255,255,210,.9) 0%,transparent 70%);
  animation:csShimmer .07s linear infinite alternate;
}
@keyframes csShimmer {
  from{transform:scale(1);opacity:.9}
  to  {transform:scale(1.18);opacity:1}
}

/* ── Phase 2: Comet tail ── */
.cs-tail {
  position:fixed;height:5px;border-radius:3px;
  transform-origin:left center;transform:rotate(45deg);
  background:linear-gradient(90deg,
    rgba(255,255,255,0) 0%,
    rgba(255,200,80,.2) 20%,
    rgba(255,140,20,.5) 60%,
    rgba(255,255,200,.9) 100%);
  z-index:9997;pointer-events:none;
  animation:csTailGrow .95s cubic-bezier(.15,.6,.3,1) forwards;
}
@keyframes csTailGrow {
  0%   { width:0;    opacity:1 }
  40%  { width:28vw; opacity:1 }
  75%  { width:58vw; opacity:.7}
  100% { width:85vw; opacity:0 }
}

/* ── Phase 3: Stardust ── */
.cs-dust {
  position:fixed;border-radius:50%;pointer-events:none;z-index:9996;
  animation:csDust linear forwards;
}
@keyframes csDust {
  0%  {opacity:.9;transform:translate(0,0) scale(1)}
  100%{opacity:0; transform:translate(var(--dx),var(--dy)) scale(.1)}
}

/* ── Phase 4: Constellation ── */
.cs-constellation {
  position:fixed;inset:0;z-index:9993;pointer-events:none;
  animation:csConstFlash .65s ease forwards;
}
@keyframes csConstFlash {
  0%{opacity:0} 20%{opacity:1} 70%{opacity:1} 100%{opacity:0}
}
.cs-constellation svg line {
  stroke:rgba(180,210,255,.85);stroke-width:1.5px;
  filter:drop-shadow(0 0 4px #99bbff) drop-shadow(0 0 10px #6688ff);
}
.cs-constellation svg circle {
  fill:#fff;filter:drop-shadow(0 0 6px #fff);
}

/* ── Phase 4: Star nodes ── */
.cs-star-node {
  position:fixed;width:9px;height:9px;border-radius:50%;background:#fff;
  transform:translate(-50%,-50%);pointer-events:none;z-index:9994;
  box-shadow:0 0 10px 3px #fff,0 0 26px 7px rgba(160,180,255,.8);
  animation:csNodePop .65s ease forwards;
}
@keyframes csNodePop {
  0%  {transform:translate(-50%,-50%) scale(0);   opacity:1}
  30% {transform:translate(-50%,-50%) scale(2);   opacity:1}
  70% {transform:translate(-50%,-50%) scale(1);   opacity:1}
  100%{transform:translate(-50%,-50%) scale(.35); opacity:0}
}

/* ── Phase 5: Impact rings ── */
.cs-ring {
  position:fixed;left:50%;top:50%;
  width:12px;height:12px;border-radius:50%;border:5px solid;
  transform:translate(-50%,-50%);pointer-events:none;z-index:9999;
  animation:csRingExpand ease-out forwards;
}
@keyframes csRingExpand {
  from{transform:translate(-50%,-50%) scale(.08);opacity:1}
  to  {transform:translate(-50%,-50%) scale(24); opacity:0}
}

/* ── Phase 5: Core burst ── */
.cs-core {
  position:fixed;left:50%;top:50%;
  width:90px;height:90px;border-radius:50%;
  transform:translate(-50%,-50%);pointer-events:none;z-index:10000;
  background:radial-gradient(circle,#fff 0%,#ffe066 30%,#ff6600 60%,transparent 80%);
  animation:csCoreBurst .55s ease-out forwards;
}
@keyframes csCoreBurst {
  from{transform:translate(-50%,-50%) scale(0);opacity:1}
  to  {transform:translate(-50%,-50%) scale(16);opacity:0}
}

/* ── Phase 5: Shards ── */
.cs-shard {
  position:fixed;pointer-events:none;z-index:9999;
  border-radius:50%;animation:csShard ease-out forwards;
}
@keyframes csShard {
  0%  {transform:translate(-50%,-50%) rotate(var(--a)) translateX(0)          scale(1);opacity:1}
  80% {opacity:.8}
  100%{transform:translate(-50%,-50%) rotate(var(--a)) translateX(var(--r))   scale(0);opacity:0}
}

/* ── Phase 5: Screen flash ── */
.cs-flash {
  position:fixed;inset:0;pointer-events:none;z-index:10001;
  background:radial-gradient(circle at 50% 50%,#fff 0%,#ffe8a0 40%,transparent 70%);
  animation:csFlash .45s ease-out forwards;
}
@keyframes csFlash {
  0%  {opacity:1;transform:scale(.8)}
  100%{opacity:0;transform:scale(1.25)}
}

/* ── Body shake ── */
@keyframes csBodyShake {
  0%,100%{transform:translate(0,0)}
  15%{transform:translate(-6px, 4px)}
  30%{transform:translate( 6px,-5px)}
  45%{transform:translate(-5px, 6px)}
  60%{transform:translate( 4px,-4px)}
  75%{transform:translate(-4px, 3px)}
  90%{transform:translate( 3px,-3px)}
}
body.cs-shake { animation:csBodyShake .7s ease-out; }
`;

function injectCSS() {
  if (document.getElementById('cs-styles')) return;
  const el = document.createElement('style');
  el.id = 'cs-styles';
  el.textContent = CSS;
  document.head.appendChild(el);
}

// ── Helper: create DOM node with class ────────────────────────
function mk(cls) {
  const el = document.createElement('div');
  el.className = cls;
  return el;
}

// ── Helper: collect DOM nodes spawned by this cutscene ────────
let _spawned = [];
function spawn(el) {
  _spawned.push(el);
  document.body.appendChild(el);
  return el;
}
function killSpawned() {
  _spawned.forEach(el => el.remove());
  _spawned = [];
}

// ══════════════════════════════════════════════════════════════
export class CometStrike {
  constructor(engine, rarity) {
    this.engine  = engine;
    this.rarity  = rarity;
    this.stopped = false;
    this._timers = [];
    injectCSS();
  }

  // Convenience: setTimeout tracked so stop() can cancel all
  _after(ms, fn) {
    const id = setTimeout(() => { if (!this.stopped) fn(); }, ms);
    this._timers.push(id);
  }

  play() {
    return new Promise(resolve => {
      _spawned = [];
      const { color, glowColor, particleColor, label } = this.rarity;

      // ── Phase 0: Blackout ─────────────────────────────────
      spawn(mk('cs-blackout'));

      // ── Phase 1: Star field ───────────────────────────────
      this._after(100, () => {
        const sf = mk('cs-starfield');
        for (let i = 0; i < 90; i++) {
          const s  = mk('cs-bg-star');
          const sz = 0.8 + Math.random() * 2.5;
          s.style.cssText = `
            left:${Math.random()*100}vw; top:${Math.random()*100}vh;
            width:${sz}px; height:${sz}px;
            opacity:${.25+Math.random()*.75};
            animation-duration:${.7+Math.random()*2.2}s;
            animation-delay:${Math.random()*.6}s;
          `;
          sf.appendChild(s);
        }
        spawn(sf);

        // ── Phase 2: Comet ─────────────────────────────────
        this._after(300, () => {
          const head = mk('cs-head');
          head.style.left = '-6vw';
          head.style.top  = '14vh';
          spawn(head);

          const tail = mk('cs-tail');
          tail.style.left = '-6vw';
          tail.style.top  = '14vh';
          spawn(tail);

          // ── Phase 3: Stardust while comet flies ──────────
          const dustIv = setInterval(() => {
            if (!this.stopped) this._spawnDust(color);
          }, 38);
          this._after(980, () => {
            clearInterval(dustIv);
            head.remove();
            tail.remove();
          });
        });

        // ── Phase 4: Constellation ─────────────────────────
        this._after(900, () => this._spawnConstellation());

        // ── Phase 5: Impact ────────────────────────────────
        this._after(1100, () => {
          // Flash
          const flash = spawn(mk('cs-flash'));
          this._after(460, () => flash.remove());

          // Core burst
          const core = spawn(mk('cs-core'));
          this._after(620, () => core.remove());

          // Impact rings (staggered, alternating colors)
          for (let i = 0; i < 5; i++) {
            this._after(i * 50, () => {
              const ring = mk('cs-ring');
              ring.style.borderColor = i % 2 === 0 ? color : '#ffe8a0';
              ring.style.animationDuration = (.5 + i * .1) + 's';
              spawn(ring);
              this._after(950, () => ring.remove());
            });
          }

          // Star shards
          for (let i = 0; i < 70; i++) {
            const shard = mk('cs-shard');
            const size  = 2 + Math.random() * 5;
            const angle = Math.random() * 360;
            const dur   = .45 + Math.random() * .75;
            shard.style.cssText = `
              left:50vw; top:50vh;
              width:${size}px; height:${size}px;
              --a:${angle}deg; --r:${15+Math.random()*48}vmin;
              animation-duration:${dur}s;
              animation-delay:${Math.random()*.2}s;
              background:${Math.random()>.4 ? '#fff' : color};
            `;
            spawn(shard);
            this._after((dur + .3) * 1000, () => shard.remove());
          }

          // CSS body shake
          document.body.classList.add('cs-shake');
          this._after(750, () => document.body.classList.remove('cs-shake'));

          // Canvas engine shake
          this.engine.shake(28);
        });

        // ── Phase 6: Canvas reveal ─────────────────────────
        this._after(1600, () => {
          // God rays
          this.engine.addEffect(new RayBurst({
            color: particleColor,
            duration: 4000,
            maxAlpha: 0.3,
            rayCount: 20,
            rotSpeed: 1.0,
          }));

          // Radial glow
          this.engine.addEffect(new GlowOverlay({
            color: glowColor,
            duration: 4500,
            maxAlpha: 0.7,
            fadeIn: 0.08,
            fadeOut: 0.3,
            pulseSpeed: 2.5,
          }));

          // Three staggered particle rings
          [0, 150, 320].forEach((delay, i) => {
            this._after(delay, () => {
              this.engine.addEffect(new ParticleBurst(0.5, 0.5, {
                count: 80,
                color: i === 1 ? color : particleColor,
                minSpeed: 200 + i * 80,
                maxSpeed: 500 + i * 100,
                minSize: 2,
                maxSize: 7,
                gravity: 60,
                trail: true,
                glow: true,
                duration: 3000,
                type: 'star',
              }));
            });
          });

          // Golden rain from top
          this.engine.addEffect(new ContinuousParticles({
            ox: w => Math.random() * w,
            oy: 0,
            color: '#ffe066',
            minSpeed: 40, maxSpeed: 130,
            gravity: 100, upBias: -40,
            spread: 0.4, angle: Math.PI / 2,
            minSize: 1.5, maxSize: 4,
            glow: true, spawnRate: 0.025,
            duration: 3800,
          }));

          // Rising emitter from center
          this.engine.addEffect(new ContinuousParticles({
            ox: 0.5, oy: 0.55,
            color,
            minSpeed: 80, maxSpeed: 250,
            gravity: -70, upBias: 120,
            spread: 1.6, angle: -Math.PI / 2,
            minSize: 2, maxSize: 6,
            trail: true, glow: true,
            spawnRate: 0.035, duration: 3500,
            type: 'star',
          }));

          // Title reveal
          this._after(400, () => {
            this.engine.addEffect(new RevealText({
              text: 'C O M E T  S T R I K E',
              subtext: '☄ 1 / 1,000 ☄',
              color,
              glowColor,
              shadow: true,
              duration: 4000,
              font: 'bold 62px Cinzel, serif',
              subFont: '22px Rajdhani, sans-serif',
              subColor: 'rgba(255,224,102,0.9)',
              y: 0.42,
            }));
          });

          // Clean up DOM elements
          sf.remove();
        });

        // ── Phase 7: Resolve ───────────────────────────────
        this._after(6200, () => {
          killSpawned();
          resolve();
        });
      });
    });
  }

  stop() {
    this.stopped = true;
    this._timers.forEach(clearTimeout);
    this._timers = [];
    document.body.classList.remove('cs-shake');
    killSpawned();
  }

  // ── Stardust trail particle ──────────────────────────────────
  _spawnDust(color) {
    const d    = mk('cs-dust');
    const size = 2 + Math.random() * 5;
    const dur  = .35 + Math.random() * .5;
    d.style.cssText = `
      left:${-5+Math.random()*80}vw;
      top:${10+Math.random()*28}vh;
      width:${size}px; height:${size}px;
      --dx:${(Math.random()-.5)*35}px;
      --dy:${Math.random()*45+8}px;
      animation-duration:${dur}s;
      background:${Math.random()>.5 ? '#ffe066' : color};
    `;
    spawn(d);
    setTimeout(() => d.remove(), dur * 1000 + 100);
  }

  // ── Constellation lines + nodes ──────────────────────────────
  _spawnConstellation() {
    const layer = mk('cs-constellation');
    const svg   = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;';

    // Random nodes
    const nodes = Array.from({ length: 11 }, () => ({
      x: 8 + Math.random() * 84,
      y: 8 + Math.random() * 84,
    }));

    // Connect nodes within distance threshold
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        if (Math.sqrt(dx*dx + dy*dy) < 28) {
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', nodes[i].x);
          line.setAttribute('y1', nodes[i].y);
          line.setAttribute('x2', nodes[j].x);
          line.setAttribute('y2', nodes[j].y);
          svg.appendChild(line);
        }
      }
    }

    // Node dots
    nodes.forEach(n => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', n.x);
      circle.setAttribute('cy', n.y);
      circle.setAttribute('r',  '.9');
      svg.appendChild(circle);

      // DOM flash node
      const node = mk('cs-star-node');
      node.style.left             = n.x + 'vw';
      node.style.top              = n.y + 'vh';
      node.style.animationDelay   = Math.random() * .18 + 's';
      spawn(node);
      setTimeout(() => node.remove(), 950);
    });

    layer.appendChild(svg);
    spawn(layer);
    setTimeout(() => layer.remove(), 720);
  }
}