// cutscenes/TheObserver.js
// ═══════════════════════════════════════════════════════════════
//  T H E   O B S E R V E R  —  1 / 200,000
//  Hybrid: DOM/CSS eye + canvas glow + Web Audio atmospheric
//
//  It has always been here.
//  Before the first roll. After the last.
//  It does not judge. It simply watches.
//  And now — for the first time — you see it back.
//
//  Phase 0  (0ms)    : Absolute blackout — heartbeat rings, grain, vignette
//  Phase 1  (300ms)  : Eye socket materializes — lids closed
//  Phase 2  (900ms)  : Eyelids open slowly over 2.2s
//  Phase 3  (1800ms) : "I have always been here." — word by word
//  Phase 4  (3900ms) : "Every choice you made."
//  Phase 5  (5800ms) : "I saw it."
//  Phase 6  (7600ms) : "That weight."
//  Phase 7  (9400ms) : "That was me."
//  Phase 8  (11200ms): Mid-sequence blink — full close + reopen
//  Phase 9  (12800ms): "Now you see me too."
//  Phase 10 (15500ms): Long silence — only the breathing eye
//  Phase 11 (16200ms): Pupil dilates — iris expands fully
//  Phase 12 (17000ms): Canvas — deep purple glow only
//  Phase 13 (18000ms): T H E   O B S E R V E R label
//  Phase 14 (20000ms): "IT ALWAYS KNEW." typewriter
//  Phase 15 (23500ms): Blinding white flash
//  Phase 16 (25000ms): Void fades
//  Phase 17 (28000ms): Resolve
// ═══════════════════════════════════════════════════════════════

import { GlowOverlay } from '../effects/GlowOverlay.js';

// ── Palette ───────────────────────────────────────────────────
const OP  = '#6600aa';
const OD  = '#1a0030';
const OW  = '#0d0010';
const OT  = 'rgba(220,200,255,.92)';
const OG  = 'rgba(100,0,180,.85)';

// ── Sentences ─────────────────────────────────────────────────
const SENTENCES = [
  { text: 'I have always been here.',  msPerWord: 110, hold: 420,  gap: 360 },
  { text: 'Every choice you made.',    msPerWord: 130, hold: 460,  gap: 380 },
  { text: 'I saw it.',                 msPerWord: 220, hold: 820,  gap: 440 },
  { text: 'That weight.',              msPerWord: 340, hold: 980,  gap: 480 },
  { text: 'That was me.',              msPerWord: 380, hold: 1150, gap: 500 },
  { text: 'Now you see me too.',       msPerWord: 300, hold: 1400, gap: 0   },
];
const WORD_FADE_MS     = 140;
const SENTENCE_FADE_MS = 180;

// ── CSS ───────────────────────────────────────────────────────
const CSS = `
.to-void {
  position:fixed;inset:0;background:#000;
  z-index:9990;pointer-events:none;
  opacity:1;transition:opacity 2.5s ease;
}
.to-void--fade { opacity:0; }

.to-vignette {
  position:fixed;inset:0;pointer-events:none;z-index:9993;
  background:radial-gradient(ellipse at 50% 50%,
    transparent 28%,rgba(0,0,0,.55) 68%,rgba(0,0,0,.88) 100%);
}

.to-grain {
  position:fixed;inset:0;pointer-events:none;z-index:9994;opacity:.045;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size:200px 200px;
  animation:toGrainShift .12s steps(1) infinite;
}
@keyframes toGrainShift {
  0%{background-position:0 0} 25%{background-position:-50px -25px}
  50%{background-position:25px 50px} 75%{background-position:-75px 25px}
  100%{background-position:50px -50px}
}

.to-pulse {
  position:fixed;left:50%;top:50%;width:10px;height:10px;
  border-radius:50%;border:1px solid rgba(100,0,160,.25);
  transform:translate(-50%,-50%);
  z-index:9992;pointer-events:none;
  animation:toPulseRing var(--spd) ease-out infinite;
  animation-delay:var(--dly);
}
@keyframes toPulseRing {
  0%{transform:translate(-50%,-50%) scale(1);opacity:.35}
  100%{transform:translate(-50%,-50%) scale(28);opacity:0}
}
.to-pulse--open { border-color:rgba(140,0,220,.5)!important;border-width:2px!important; }

.to-eye-wrap {
  position:fixed;left:50%;top:50%;
  transform:translate(-50%,-50%);
  width:min(68vw,68vh);height:min(34vw,34vh);
  z-index:9995;pointer-events:none;
  opacity:0;animation:toEyeIn 2.8s ease forwards;animation-delay:.3s;
}
@keyframes toEyeIn { 0%{opacity:0} 100%{opacity:1} }

.to-eye-socket {
  position:absolute;inset:-12%;border-radius:50%;
  background:radial-gradient(ellipse at 50% 50%,
    rgba(60,0,80,0) 0%,rgba(40,0,60,.18) 42%,transparent 72%);
  animation:toSocketBreath 4.5s ease-in-out infinite alternate;
}
@keyframes toSocketBreath {
  from{opacity:.5;transform:scale(1)} to{opacity:1;transform:scale(1.06)}
}

.to-sclera {
  position:absolute;inset:0;
  border-radius:50% 50% 50% 50% / 38% 38% 62% 62%;
  background:radial-gradient(ellipse at 50% 50%,
    ${OW} 0%,#060008 62%,#000 100%);
  box-shadow:inset 0 0 44px 12px rgba(80,0,100,.35),0 0 70px 22px rgba(60,0,80,.22);
  overflow:hidden;
}

.to-veins {
  position:absolute;inset:0;
  border-radius:50% 50% 50% 50% / 38% 38% 62% 62%;
  background:
    radial-gradient(ellipse at 28% 38%,rgba(80,0,40,.18) 0%,transparent 42%),
    radial-gradient(ellipse at 72% 62%,rgba(60,0,30,.12) 0%,transparent 38%);
  opacity:0;animation:toVeinsReveal 3.5s ease forwards;animation-delay:3.5s;
}
@keyframes toVeinsReveal { to{opacity:1} }

.to-iris {
  position:absolute;left:50%;top:50%;
  width:44%;aspect-ratio:1;
  transform:translate(-50%,-50%);
  border-radius:50%;
  background:radial-gradient(circle at 50% 50%,
    #000 0%,${OD} 22%,#3d0060 42%,
    ${OP} 58%,#4400cc 73%,#220044 88%,#000 100%);
  box-shadow:0 0 22px 6px rgba(100,0,180,.45),inset 0 0 18px 6px rgba(0,0,0,.8);
  animation:toIrisBreath 3.8s ease-in-out infinite alternate;
  transition:width 1.8s cubic-bezier(.4,0,.2,1),
             box-shadow 1.8s ease,
             clip-path 2.2s cubic-bezier(.4,0,.2,1);
  clip-path:ellipse(50% 0% at 50% 50%);
}
@keyframes toIrisBreath {
  from{filter:brightness(.65) saturate(.75)}
  to  {filter:brightness(1.25) saturate(1.4)}
}
.to-iris--open    { clip-path:ellipse(50% 50% at 50% 50%)!important; }
.to-iris--dilated {
  width:90%!important;
  box-shadow:0 0 65px 22px rgba(120,0,200,.85),0 0 130px 45px rgba(80,0,160,.55),inset 0 0 32px 10px rgba(0,0,0,.9)!important;
}

.to-iris-lines {
  position:absolute;inset:0;border-radius:50%;
  background:repeating-conic-gradient(rgba(120,0,180,.14) 0deg,transparent 2.5deg,transparent 9deg,rgba(80,0,120,.09) 11.5deg);
  animation:toIrisSpin 24s linear infinite;
}
@keyframes toIrisSpin { to{transform:rotate(360deg)} }

.to-iris-lines-2 {
  position:absolute;inset:0;border-radius:50%;
  background:repeating-conic-gradient(rgba(160,40,220,.07) 0deg,transparent 4deg,transparent 14deg,rgba(100,0,160,.06) 18deg);
  animation:toIrisSpin2 38s linear infinite reverse;
}
@keyframes toIrisSpin2 { to{transform:rotate(-360deg)} }

.to-pupil {
  position:absolute;left:50%;top:50%;
  width:38%;aspect-ratio:1;
  transform:translate(-50%,-50%);
  border-radius:50%;
  background:radial-gradient(circle,#000 0%,#030003 72%,transparent 100%);
  transition:width 1.8s cubic-bezier(.4,0,.2,1);
}
.to-pupil--dilated { width:68%!important; }

.to-specular {
  position:absolute;left:38%;top:28%;
  width:18%;aspect-ratio:1;border-radius:50%;
  background:radial-gradient(circle,rgba(255,255,255,.22) 0%,transparent 70%);
  filter:blur(2px);
  animation:toSpecularShift 8s ease-in-out infinite alternate;
}
@keyframes toSpecularShift {
  from{left:35%;top:25%;opacity:.3} to{left:42%;top:32%;opacity:.6}
}

.to-lid {
  position:absolute;left:0;right:0;background:#000;z-index:2;
  transition:height .45s ease-in-out;
}
.to-lid--top {
  top:0;height:50%;border-radius:0 0 50% 50%;
  transition:height 2.2s cubic-bezier(.25,.1,.25,1);
}
.to-lid--bot {
  bottom:0;height:50%;border-radius:50% 50% 0 0;
  transition:height 2.2s cubic-bezier(.25,.1,.25,1);
}
.to-lid--open  { height:0%!important;transition:height 2.2s cubic-bezier(.25,.1,.25,1)!important; }
.to-lid--blink { height:52%!important;transition:height .38s ease-in-out!important; }

.to-sentence {
  position:fixed;left:50%;top:50%;
  transform:translate(-50%,-50%);
  z-index:10005;pointer-events:none;
  text-align:center;
  display:flex;flex-wrap:wrap;justify-content:center;align-items:baseline;gap:0;
  max-width:76vw;
  font-family:'Georgia','Times New Roman',serif;
  font-size:clamp(1.1rem,2.6vw,1.65rem);
  letter-spacing:.09em;
  color:${OT};
  text-shadow:0 0 22px rgba(160,80,255,.8),0 0 65px rgba(100,40,200,.4);
}

.to-word {
  display:inline-block;opacity:0;transform:translateY(9px);
  animation:toWordIn var(--dur,140ms) cubic-bezier(0,.1,.3,1) forwards;
  animation-delay:var(--dly,0ms);
}
@keyframes toWordIn {
  0%  {opacity:0;transform:translateY(9px);filter:blur(9px);letter-spacing:.55em;color:rgba(255,220,255,.25)}
  30% {opacity:.55;filter:blur(3px);letter-spacing:.28em;color:rgba(240,200,255,.7)}
  70% {opacity:1;filter:blur(.5px);letter-spacing:.19em;color:rgba(228,208,255,.95)}
  100%{opacity:1;transform:translateY(0);filter:blur(0);letter-spacing:.18em;color:${OT}}
}
.to-word--settled {
  animation:toWordIn var(--dur,140ms) cubic-bezier(0,.1,.3,1) forwards,
            toWordBreath 3.2s ease-in-out infinite alternate;
  animation-delay:var(--dly,0ms),calc(var(--dly,0ms) + var(--dur,140ms));
}
@keyframes toWordBreath {
  from{text-shadow:0 0 12px rgba(160,80,255,.38)}
  to  {text-shadow:0 0 30px rgba(195,115,255,.78),0 0 60px rgba(130,60,220,.38)}
}

.to-flash {
  position:fixed;inset:0;background:#fff;
  pointer-events:none;z-index:10010;
  animation:toFlash .85s ease-out forwards;
}
@keyframes toFlash { 0%{opacity:1} 100%{opacity:0} }

.to-label {
  position:fixed;left:50%;top:50%;
  transform:translate(-50%,-50%);
  pointer-events:none;z-index:10012;
  display:flex;flex-direction:column;align-items:center;gap:14px;
  animation:toLabelReveal 7.5s ease forwards;
}
@keyframes toLabelReveal {
  0%  {opacity:0;transform:translate(-50%,-50%) scale(.7);filter:blur(14px)}
  12% {opacity:1;transform:translate(-50%,-50%) scale(1.02);filter:blur(0)}
  18% {transform:translate(-50%,-50%) scale(1)}
  82% {opacity:1}
  100%{opacity:0;transform:translate(-50%,-50%) scale(1.02)}
}
.to-label-main {
  font-family:'Georgia','Times New Roman',serif;
  font-size:36px;font-weight:400;letter-spacing:18px;
  color:rgba(220,200,255,.96);
  text-shadow:0 0 10px rgba(160,80,255,.7),0 0 28px rgba(120,40,200,.5),0 0 70px rgba(100,0,180,.35);
  border:1px solid rgba(140,60,200,.5);
  padding:20px 52px;
  background:rgba(4,0,10,.95);
  box-shadow:0 0 35px rgba(100,0,180,.35),0 0 80px rgba(80,0,150,.18),inset 0 0 30px rgba(100,0,180,.06);
  animation:toLabelPulse 3.5s ease-in-out infinite alternate;
}
@keyframes toLabelPulse {
  from{box-shadow:0 0 35px rgba(100,0,180,.35),0 0 80px rgba(80,0,150,.18),inset 0 0 30px rgba(100,0,180,.06);border-color:rgba(140,60,200,.5)}
  to  {box-shadow:0 0 60px rgba(120,0,200,.55),0 0 140px rgba(90,0,170,.3),inset 0 0 55px rgba(100,0,180,.1);border-color:rgba(180,100,255,.75)}
}
.to-label-sub {
  font-family:'Georgia','Times New Roman',serif;font-style:italic;
  font-size:10px;letter-spacing:5px;
  color:rgba(160,100,220,.5);text-shadow:0 0 8px rgba(100,40,180,.4);
}

.to-typewriter {
  position:fixed;left:50%;top:calc(50% + 80px);
  transform:translateX(-50%);
  pointer-events:none;z-index:10013;
  font-family:'Georgia','Times New Roman',serif;font-style:italic;
  font-size:16px;letter-spacing:6px;
  color:rgba(180,140,240,.75);
  text-shadow:0 0 10px rgba(120,40,200,.5);
  white-space:nowrap;
  animation:toTypeReveal 6s ease forwards;
}
@keyframes toTypeReveal { 0%{opacity:0} 8%{opacity:1} 82%{opacity:1} 100%{opacity:0} }
.to-cursor {
  display:inline-block;width:2px;height:1em;
  background:rgba(180,140,240,.7);margin-left:3px;vertical-align:middle;
  animation:toCursorBlink .9s step-end infinite;
}
@keyframes toCursorBlink { 0%,100%{opacity:1} 50%{opacity:0} }
`;

function injectCSS() {
  if (document.getElementById('to-styles')) return;
  const s = document.createElement('style');
  s.id = 'to-styles';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function mk(cls) { const el = document.createElement('div'); el.className = cls; return el; }

let _spawned = [];
function spawn(el)    { _spawned.push(el); document.body.appendChild(el); return el; }
function killSpawned(){ _spawned.forEach(e => e.remove()); _spawned = []; }

// ══════════════════════════════════════════════════════════════
export class TheObserver {
  constructor(engine, rarity) {
    this.engine   = engine;
    this.rarity   = rarity;
    this.stopped  = false;
    this._timers  = [];
    this._actx    = null;
    this._droneNode = null;
    this._irisEl  = null;
    this._pupilEl = null;
    this._lidTop  = null;
    this._lidBot  = null;
    this.fx = { glowMaxAlpha: 0.72, ...(rarity.effects ?? {}) };
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

      // ── Phase 0: Atmosphere ──────────────────────────────────
      const voidEl = spawn(mk('to-void'));
      spawn(mk('to-vignette'));
      spawn(mk('to-grain'));
      this._after(25000, () => voidEl.classList.add('to-void--fade'));
      this._after(27500, () => voidEl.remove());

      for (let i = 0; i < 3; i++) {
        const p = spawn(mk('to-pulse'));
        p.style.setProperty('--spd', `${4.2 + i * 1.6}s`);
        p.style.setProperty('--dly', `${i * 1.5}s`);
      }

      this._sfxDrone();
      this._sfxHeartbeat();

      // ── Phase 1: Eye socket ──────────────────────────────────
      this._after(300, () => this._spawnEye());

      // ── Phase 2: Lids open ───────────────────────────────────
      this._after(900, () => {
        if (this._lidTop) this._lidTop.classList.add('to-lid--open');
        if (this._lidBot) this._lidBot.classList.add('to-lid--open');
      });

      // ── Phases 3–9: Six sentences ───────────────────────────
      let cursor = 1800;
      SENTENCES.forEach((s, idx) => {
        const words        = s.text.split(' ');
        const typeDuration = words.length * s.msPerWord;
        const totalVisible = typeDuration + WORD_FADE_MS + s.hold;
        const sentenceEnd  = totalVisible + SENTENCE_FADE_MS;

        this._after(cursor, () => this._showSentence(s.text, s.msPerWord, s.hold));

        // Blink between sentence 5 and 6
        if (idx === 4) {
          const blinkAt = cursor + sentenceEnd + 200;
          this._after(blinkAt, () => this._blink());
          cursor = blinkAt + 1600 + (s.gap || 0);
        } else {
          cursor += sentenceEnd + (s.gap || 0);
        }
      });

      // ── Phase 11: Pupil dilates ─────────────────────────────
      this._after(16200, () => {
        if (this._irisEl)  this._irisEl.classList.add('to-iris--dilated');
        if (this._pupilEl) this._pupilEl.classList.add('to-pupil--dilated');
        document.querySelectorAll('.to-pulse').forEach(p => p.classList.add('to-pulse--open'));
        this._sfxEyeOpen();
      });

      // ── Phase 12: Canvas glow only — no particles ───────────
      this._after(17000, () => {
        this.engine.addEffect(new GlowOverlay({
          color: OG, duration: 10000, maxAlpha: this.fx.glowMaxAlpha,
          fadeIn: 0.06, fadeOut: 0.22, radial: true, pulseSpeed: 1.2,
        }));
        this.engine.addEffect(new GlowOverlay({
          color: 'rgba(80,0,120,.5)', duration: 9000, maxAlpha: 0.45,
          fadeIn: 0.08, fadeOut: 0.3, radial: true, pulseSpeed: 0.7,
        }));
      });

      // ── Phase 13: Label ──────────────────────────────────────
      this._after(18000, () => this._spawnLabel());

      // ── Phase 14: Typewriter ─────────────────────────────────
      this._after(20000, () => this._spawnTypewriter());

      // ── Phase 15: Flash ──────────────────────────────────────
      this._after(23500, () => {
        const flash = spawn(mk('to-flash'));
        this._after(950, () => flash.remove());
      });

      // ── Phase 17: Resolve ────────────────────────────────────
      this._after(28000, () => {
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
    this._stopDrone();
    if (this._actx) { try { this._actx.close(); } catch(e){} }
    killSpawned();
  }

  // ── Eye anatomy ───────────────────────────────────────────────
  _spawnEye() {
    const wrap   = spawn(mk('to-eye-wrap'));
    const socket = document.createElement('div'); socket.className = 'to-eye-socket';
    const sclera = document.createElement('div'); sclera.className = 'to-sclera';
    const veins  = document.createElement('div'); veins.className  = 'to-veins';
    const iris   = document.createElement('div'); iris.className   = 'to-iris';
    this._irisEl = iris;
    const lines1 = document.createElement('div'); lines1.className = 'to-iris-lines';
    const lines2 = document.createElement('div'); lines2.className = 'to-iris-lines-2';
    const pupil  = document.createElement('div'); pupil.className  = 'to-pupil';
    this._pupilEl = pupil;
    const spec   = document.createElement('div'); spec.className   = 'to-specular';
    const lidTop = document.createElement('div'); lidTop.className = 'to-lid to-lid--top';
    this._lidTop = lidTop;
    const lidBot = document.createElement('div'); lidBot.className = 'to-lid to-lid--bot';
    this._lidBot = lidBot;

    iris.appendChild(lines1);
    iris.appendChild(lines2);
    iris.appendChild(pupil);
    iris.appendChild(spec);
    sclera.appendChild(veins);
    sclera.appendChild(iris);
    sclera.appendChild(lidTop);
    sclera.appendChild(lidBot);
    wrap.appendChild(socket);
    wrap.appendChild(sclera);
  }

  // ── Single slow blink ─────────────────────────────────────────
  _blink() {
    if (!this._lidTop || !this._lidBot) return;
    this._lidTop.classList.add('to-lid--blink');
    this._lidBot.classList.add('to-lid--blink');
    this._after(600, () => {
      if (!this._lidTop) return;
      this._lidTop.classList.remove('to-lid--blink');
      this._lidBot.classList.remove('to-lid--blink');
    });
  }

  // ── Word-by-word sentence ─────────────────────────────────────
  _showSentence(text, msPerWord, hold) {
    const container = spawn(mk('to-sentence'));
    const words = text.split(' ');
    words.forEach((word, i) => {
      const span = document.createElement('span');
      span.className = 'to-word';
      span.textContent = word + (i < words.length - 1 ? '\u00A0' : '');
      span.style.setProperty('--dly', `${i * msPerWord}ms`);
      span.style.setProperty('--dur', `${WORD_FADE_MS}ms`);
      this._after(i * msPerWord + WORD_FADE_MS, () => span.classList.add('to-word--settled'));
      container.appendChild(span);
    });
    const lastIn = (words.length - 1) * msPerWord + WORD_FADE_MS;
    this._after(lastIn + hold, () => {
      container.style.transition = `opacity ${SENTENCE_FADE_MS}ms ease,transform ${SENTENCE_FADE_MS}ms ease`;
      container.style.opacity    = '0';
      container.style.transform  = 'translate(-50%,calc(-50% - 16px))';
      this._after(SENTENCE_FADE_MS + 60, () => container.remove());
    });
  }

  // ── Label ─────────────────────────────────────────────────────
  _spawnLabel() {
    const label = spawn(mk('to-label'));
    const main  = document.createElement('div');
    main.className   = 'to-label-main';
    main.textContent = 'T H E   O B S E R V E R';
    const sub   = document.createElement('div');
    sub.className    = 'to-label-sub';
    sub.textContent  = '1 / 200,000  ·  it was always here';
    label.appendChild(main);
    label.appendChild(sub);
    this._after(7200, () => label.remove());
  }

  // ── "IT ALWAYS KNEW." typewriter ─────────────────────────────
  _spawnTypewriter() {
    const el   = spawn(mk('to-typewriter'));
    const TEXT = 'IT ALWAYS KNEW.';
    const cur  = document.createElement('span');
    cur.className = 'to-cursor';
    el.appendChild(cur);
    let idx = 0;
    const type = () => {
      if (this.stopped || !el.isConnected) return;
      if (idx < TEXT.length) {
        el.insertBefore(document.createTextNode(TEXT[idx]), cur);
        idx++;
        this._sfxChime();
        const delay = 130 + (TEXT[idx-1] === ' ' ? 250 : 0) + (Math.random() > .88 ? 220 : 0);
        this._timers.push(setTimeout(type, delay));
      } else {
        this._after(2400, () => cur.remove());
      }
    };
    this._timers.push(setTimeout(type, 500));
    this._after(5500, () => el.remove());
  }

  // ═════════════════════════════════════════════════════════════
  //  W E B   A U D I O   —   A T M O S P H E R I C
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

  // Constant 55 Hz drone with slow wobble, sub-bass layer
  _sfxDrone() {
    const ctx = this._audio();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const g   = ctx.createGain();
      osc.connect(g); g.connect(ctx.destination);
      osc.type = 'sine';
      const t = ctx.currentTime;
      osc.frequency.setValueAtTime(55, t);
      osc.frequency.linearRampToValueAtTime(58, t + 6);
      osc.frequency.linearRampToValueAtTime(54, t + 14);
      osc.frequency.linearRampToValueAtTime(57, t + 22);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.11, t + 2.5);
      g.gain.setValueAtTime(0.11, t + 21);
      g.gain.linearRampToValueAtTime(0, t + 27);
      osc.start(t); osc.stop(t + 28);
      this._droneNode = osc;

      const sub  = ctx.createOscillator();
      const subG = ctx.createGain();
      sub.connect(subG); subG.connect(ctx.destination);
      sub.type = 'sine'; sub.frequency.value = 27.5;
      subG.gain.setValueAtTime(0, t);
      subG.gain.linearRampToValueAtTime(0.06, t + 3.5);
      subG.gain.setValueAtTime(0.06, t + 22);
      subG.gain.linearRampToValueAtTime(0, t + 27);
      sub.start(t); sub.stop(t + 28);
    } catch(e) {}
  }

  _stopDrone() {
    try { if (this._droneNode) { this._droneNode.stop(); this._droneNode = null; } } catch(e) {}
  }

  // Periodic heartbeat — lub-dub pattern at ~43bpm (slow, ominous)
  _sfxHeartbeat() {
    const ctx = this._audio();
    if (!ctx) return;
    let beat = 0;
    const thump = () => {
      if (this.stopped || beat > 18) return;
      const t = ctx.currentTime;
      this._beep(ctx, t,       80, 0.12, 0.10, 'sine');
      this._beep(ctx, t,       55, 0.18, 0.07, 'sine');
      this._beep(ctx, t + .18, 80, 0.09, 0.07, 'sine');
      this._beep(ctx, t + .18, 55, 0.14, 0.05, 'sine');
      beat++;
      this._timers.push(setTimeout(thump, 1400));
    };
    this._timers.push(setTimeout(thump, 800));
  }

  // Eye-open: D minor triad held 5s — unsettling tonal resolution
  _sfxEyeOpen() {
    const ctx = this._audio();
    if (!ctx) return;
    const t = ctx.currentTime;
    [[73.4, 0.00, 5.0, 0.09], [87.3, 0.04, 4.8, 0.07],
     [110,  0.08, 4.5, 0.07], [146.8,0.12, 4.0, 0.06]].forEach(([f,off,dur,vol]) => {
      this._beep(ctx, t + off, f, dur, vol, 'sine');
    });
    this._beep(ctx, t + .5,  587.3, 3.0, 0.04, 'sine');
    this._beep(ctx, t + 1.2, 880,   2.0, 0.03, 'sine');
  }

  // Near-silent typewriter chime — like a thought being heard
  _sfxChime() {
    const ctx = this._audio();
    if (!ctx) return;
    const t = ctx.currentTime;
    this._beep(ctx, t,       1480, 0.06, 0.022, 'sine');
    this._beep(ctx, t + .04, 1760, 0.04, 0.016, 'sine');
  }
}