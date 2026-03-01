// cutscenes/Rebirth.js
// ═══════════════════════════════════════════════════════════════
//  R E B I R T H  —  1 / 700,000
//  A conscious light speaks to the player in old English.
//  It has been waiting. It knows you. It will not wait again.
//
//  Palette: void black / soul warmth #fff8e8 / birth gold #ffd080
//           soul amber #ff9a00 / bloom white #ffffff
//
//  Phase 0  (0ms)    : Absolute black. Nothing. Not even dust.
//  Phase 1  (400ms)  : A single 2px point of light. Pulses.
//  Phase 2  (1800ms) : "Thou hast wandered long in the dark,"
//  Phase 3  (6000ms) : Light grows → 8px. "yet thy light was never extinguished."
//  Phase 4  (10500ms): Light grows → 16px. "Dost thou not know what thou art?"
//  Phase 5  (15000ms): Silence. Three slow pulses. The light considers.
//  Phase 6  (17500ms): "Thou art the beginning."
//  Phase 7  (22000ms): THE BLOOM — 2px expands to 300vmax warm white
//  Phase 8  (23500ms): Canvas — ember rays + warm glow + particle eruption
//  Phase 9  (24500ms): R E B I R T H label
//  Phase 10 (27000ms): "AND NOW, THOU ART BORN AGAIN." typewriter
//  Phase 11 (30500ms): Scene elements fade
//  Phase 12 (32500ms): Void fades
//  Phase 13 (35000ms): Resolve
// ═══════════════════════════════════════════════════════════════

import { ParticleBurst, ContinuousParticles } from '../effects/ParticleBurst.js';
import { GlowOverlay, RayBurst }               from '../effects/GlowOverlay.js';

// ── Palette ───────────────────────────────────────────────────
const RV  = '#000000';              // void
const RS  = '#fff8e8';              // soul warmth
const RG  = '#ffd080';              // birth gold
const RA  = '#ff9a00';              // soul amber
const RW  = '#ffffff';              // bloom white
const RD  = '#0a0015';              // deep space
const RO  = '#ffcc66';              // warm orange-gold

const RG_GLOW = 'rgba(255,208,128,0.95)';
const RA_GLOW = 'rgba(255,154,0,0.9)';

// ── The four speeches — Shakespearean English ─────────────────
// Each word is revealed one at a time, drifting outward from
// the light source. The light "inhales" before each sentence.
const SPEECHES = [
  {
    text:      'Thou hast wandered long in the dark,',
    msPerWord: 420,
    hold:      1200,
    lightSize: 8,        // px — how large the light grows after this line
    lightCol:  '#fff0cc',
  },
  {
    text:      'yet thy light was never extinguished.',
    msPerWord: 460,
    hold:      1500,
    lightSize: 14,
    lightCol:  '#ffd080',
  },
  {
    text:      'Dost thou not know what thou art?',
    msPerWord: 500,
    hold:      2600,     // long hold — the question hangs
    lightSize: 18,
    lightCol:  '#ff9a00',
  },
  {
    text:      'Thou art the beginning.',
    msPerWord: 620,      // slowest — most weighted
    hold:      2200,
    lightSize: 22,
    lightCol:  '#ff7700',
  },
];

const WORD_FADE_MS     = 160;
const SENTENCE_FADE_MS = 280;

// ── CSS ───────────────────────────────────────────────────────
const CSS = `
/* ── Void — pure empty ── */
.rb-void {
  position:fixed;inset:0;background:${RV};
  z-index:9990;pointer-events:none;
  opacity:1;transition:opacity 2.5s ease;
}
.rb-void--fade { opacity:0; }

/* ── The Light — the protagonist of this scene ── */
.rb-light {
  position:fixed;left:50%;top:44%;
  transform:translate(-50%,-50%);
  border-radius:50%;pointer-events:none;z-index:9998;
  background:radial-gradient(circle,${RW} 0%,${RS} 45%,rgba(255,200,100,.6) 75%,transparent 100%);
  /* Start as 2px barely-visible dot */
  width:2px;height:2px;
  box-shadow:
    0 0 3px 1px rgba(255,248,232,.8),
    0 0 8px 2px rgba(255,220,150,.4);
  transition:
    width  1.8s cubic-bezier(.2,.8,.3,1),
    height 1.8s cubic-bezier(.2,.8,.3,1),
    box-shadow 1.8s ease,
    background 1.8s ease;
  animation:rbLightPulse 2.2s ease-in-out infinite alternate;
}
@keyframes rbLightPulse {
  from{filter:brightness(1) saturate(1)}
  to  {filter:brightness(1.6) saturate(1.2)}
}

/* The light radiates gentle rings */
.rb-light-ring {
  position:fixed;left:50%;top:44%;
  transform:translate(-50%,-50%);
  border-radius:50%;pointer-events:none;z-index:9997;
  background:transparent;
  border:1px solid var(--rc);
  animation:rbRingExpand var(--rd) ease-out infinite;
  animation-delay:var(--rly);
}
@keyframes rbRingExpand {
  0%  {width:var(--rs);height:var(--rs);opacity:.6;transform:translate(-50%,-50%)}
  100%{width:calc(var(--rs) * 8);height:calc(var(--rs) * 8);opacity:0;transform:translate(-50%,-50%)}
}

/* ── THE BLOOM — the light expands to fill everything ── */
.rb-bloom {
  position:fixed;left:50%;top:44%;
  transform:translate(-50%,-50%);
  border-radius:50%;pointer-events:none;z-index:10008;
  background:radial-gradient(circle,${RW} 0%,${RS} 25%,${RG} 55%,${RA} 78%,rgba(20,0,0,.2) 100%);
  width:20px;height:20px;
  animation:rbBloom 2s cubic-bezier(.1,.9,.2,1) forwards;
}
@keyframes rbBloom {
  0%  {width:20px;height:20px;opacity:1}
  35% {opacity:1}
  70% {width:320vmax;height:320vmax;opacity:.92}
  100%{width:320vmax;height:320vmax;opacity:0}
}

/* ── Speech sentences ── */
.rb-sentence {
  position:fixed;left:50%;top:58%;
  transform:translateX(-50%);
  pointer-events:none;z-index:10005;
  text-align:center;
  display:flex;flex-wrap:wrap;justify-content:center;align-items:baseline;gap:0;
  max-width:72vw;
  /* Shakespearean serif — must feel old, sacred */
  font-family:'Georgia','Times New Roman',serif;
  font-style:italic;
  font-size:clamp(1rem,2.3vw,1.45rem);
  letter-spacing:.09em;
  color:rgba(255,240,200,.88);
  text-shadow:
    0 0 14px rgba(255,200,100,.7),
    0 0 40px rgba(255,160,60,.35);
}

/* Each word breathes in from the light */
.rb-word {
  display:inline-block;opacity:0;
  animation:rbWordLight var(--dur,160ms) cubic-bezier(0,.1,.4,1) forwards;
  animation-delay:var(--dly,0ms);
}
@keyframes rbWordLight {
  0%  {opacity:0;transform:translateY(6px) scale(.85);
       filter:blur(7px);letter-spacing:.5em;color:rgba(255,255,220,.2)}
  30% {opacity:.5;filter:blur(2.5px);letter-spacing:.24em;color:rgba(255,230,160,.65)}
  70% {opacity:.9;filter:blur(.4px);letter-spacing:.12em;color:rgba(255,240,190,.9)}
  100%{opacity:1;transform:translateY(0) scale(1);filter:blur(0);
       letter-spacing:.09em;color:rgba(255,240,200,.88)}
}
.rb-word--settled {
  animation:rbWordLight var(--dur,160ms) cubic-bezier(0,.1,.4,1) forwards,
            rbWordGlow 3s ease-in-out infinite alternate;
  animation-delay:var(--dly,0ms),calc(var(--dly,0ms) + var(--dur,160ms));
}
@keyframes rbWordGlow {
  from{text-shadow:0 0 10px rgba(255,200,100,.4)}
  to  {text-shadow:0 0 22px rgba(255,220,140,.75),0 0 50px rgba(255,180,60,.35)}
}

/* The comma/period at end of line — extra beat before fadeout */
.rb-sentence--pause::after {
  content:'';display:block;height:0;
}

/* ── "Silence pulse" indicator — three slow light blinks ── */
.rb-silence-pulse {
  position:fixed;left:50%;top:44%;
  transform:translate(-50%,-50%);
  border-radius:50%;pointer-events:none;z-index:9999;
  width:0;height:0;
  border:2px solid rgba(255,210,120,.6);
  animation:rbSilencePing 1.8s ease-out forwards;
}
@keyframes rbSilencePing {
  0%  {width:4px;height:4px;opacity:.8;transform:translate(-50%,-50%)}
  100%{width:120px;height:120px;opacity:0;transform:translate(-50%,-50%)}
}

/* ── Post-bloom warm wash ── */
.rb-warmwash {
  position:fixed;inset:0;pointer-events:none;z-index:9991;
  background:radial-gradient(ellipse at 50% 44%,
    rgba(255,200,100,.22) 0%,rgba(255,150,50,.1) 40%,transparent 70%);
  opacity:0;transition:opacity 1.5s ease;
}
.rb-warmwash--on { opacity:1; }

/* ── R E B I R T H label ── */
.rb-label {
  position:fixed;left:50%;top:50%;
  transform:translate(-50%,-50%);
  pointer-events:none;z-index:10012;
  display:flex;flex-direction:column;align-items:center;gap:12px;
  animation:rbLabelReveal 10s ease forwards;
}
@keyframes rbLabelReveal {
  0%  {opacity:0;transform:translate(-50%,-50%) scale(.4);filter:blur(28px)}
  6%  {opacity:1;transform:translate(-50%,-50%) scale(1.04);filter:blur(0)}
  11% {transform:translate(-50%,-50%) scale(1)}
  80% {opacity:1}
  100%{opacity:0}
}

.rb-label-main {
  font-family:'Georgia','Times New Roman',serif;
  font-size:44px;font-weight:400;letter-spacing:22px;
  color:${RG};
  text-shadow:
    0 0 10px ${RG},0 0 28px rgba(255,208,128,.8),
    0 0 80px rgba(255,180,60,.5),0 0 200px rgba(255,140,40,.25);
  /* No border — this label stands alone, unframed.
     The rebirth needs no container. */
  padding:18px 48px;
  background:rgba(6,2,0,.96);
  border:1px solid rgba(255,208,128,.3);
  box-shadow:
    0 0 55px rgba(255,180,60,.35),
    0 0 140px rgba(255,140,40,.18),
    inset 0 0 45px rgba(255,180,60,.04);
  animation:rbLabelPulse 3.2s ease-in-out infinite alternate;
}
@keyframes rbLabelPulse {
  from{
    text-shadow:0 0 10px ${RG},0 0 28px rgba(255,208,128,.8),0 0 80px rgba(255,180,60,.5),0 0 200px rgba(255,140,40,.25);
    border-color:rgba(255,208,128,.3);
    box-shadow:0 0 55px rgba(255,180,60,.35),0 0 140px rgba(255,140,40,.18),inset 0 0 45px rgba(255,180,60,.04);
  }
  to{
    text-shadow:0 0 18px ${RW},0 0 50px ${RG},0 0 130px rgba(255,180,60,.7),0 0 320px rgba(255,140,40,.35);
    border-color:rgba(255,230,150,.6);
    box-shadow:0 0 90px rgba(255,200,80,.55),0 0 240px rgba(255,160,40,.28),inset 0 0 80px rgba(255,180,60,.07);
  }
}

.rb-label-sub {
  font-family:'Georgia','Times New Roman',serif;font-style:italic;
  font-size:10px;letter-spacing:5px;
  color:rgba(255,200,100,.45);
  text-shadow:0 0 8px rgba(255,160,40,.35);
}

/* ── Typewriter ── */
.rb-typewriter {
  position:fixed;left:50%;top:calc(50% + 82px);
  transform:translateX(-50%);
  pointer-events:none;z-index:10013;
  font-family:'Georgia','Times New Roman',serif;font-style:italic;
  font-size:15px;letter-spacing:7px;
  color:rgba(255,220,140,.82);
  text-shadow:0 0 12px rgba(255,180,60,.5);
  white-space:nowrap;
  animation:rbTypeReveal 8s ease forwards;
}
@keyframes rbTypeReveal {
  0%{opacity:0} 5%{opacity:1} 84%{opacity:1} 100%{opacity:0}
}
.rb-cursor {
  display:inline-block;width:2px;height:1em;
  background:rgba(255,208,128,.7);margin-left:2px;vertical-align:middle;
  box-shadow:0 0 5px rgba(255,180,60,.5);
  animation:rbCursorBlink .8s step-end infinite;
}
@keyframes rbCursorBlink { 0%,100%{opacity:1} 50%{opacity:0} }

/* ── Body shake on bloom ── */
@keyframes rbBloomShake {
  0%,100%{transform:translate(0,0) rotate(0deg)}
  5% {transform:translate(-16px,20px) rotate(-.7deg)}
  14%{transform:translate(16px,-18px) rotate(.6deg)}
  23%{transform:translate(-18px,16px) rotate(-.5deg)}
  32%{transform:translate(15px,-17px) rotate(.5deg)}
  41%{transform:translate(-12px,14px) rotate(-.3deg)}
  52%{transform:translate(11px,-12px) rotate(.25deg)}
  63%{transform:translate(-8px,10px) rotate(-.15deg)}
  74%{transform:translate(7px,-8px)}
  84%{transform:translate(-4px,5px)}
  92%{transform:translate(3px,-3px)}
}
body.rb-bloom-shake { animation:rbBloomShake 1.4s ease-out; }
`;

function injectCSS() {
  if (document.getElementById('rb-styles')) return;
  const s = document.createElement('style');
  s.id = 'rb-styles';
  s.textContent = CSS;
  document.head.appendChild(s);
}
function mk(cls)  { const el = document.createElement('div'); el.className = cls; return el; }
let _spawned = [];
function spawn(el)    { _spawned.push(el); document.body.appendChild(el); return el; }
function killSpawned(){ _spawned.forEach(e => e.remove()); _spawned = []; }
function rnd(lo, hi)  { return lo + Math.random() * (hi - lo); }

// ══════════════════════════════════════════════════════════════
export class Rebirth {
  constructor(engine, rarity) {
    this.engine   = engine;
    this.rarity   = rarity;
    this.stopped  = false;
    this._timers  = [];
    this._actx    = null;
    this._humNode = null;
    this._lightEl = null;
    this._warmEl  = null;
    this.fx = {
      shakeIntensity: 75,
      particleCount:  300,
      rayCount:       52,
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

      // ── Phase 0: Absolute void ───────────────────────────────
      const voidEl = spawn(mk('rb-void'));
      this._warmEl = spawn(mk('rb-warmwash'));

      // Fade scene elements before void lifts
      this._after(30500, () => {
        document.querySelectorAll('.rb-light,.rb-light-ring')
          .forEach(el => {
            el.style.transition = 'opacity 1.8s ease';
            el.style.opacity    = '0';
          });
      });
      this._after(32500, () => voidEl.classList.add('rb-void--fade'));
      this._after(35000, () => voidEl.remove());

      // Ambient cosmic hum
      this._sfxHum();

      // ── Phase 1: The light appears ───────────────────────────
      this._after(400,  () => this._spawnLight());

      // Radiate gentle rings from the light throughout
      this._after(1000, () => this._spawnLightRings(4));

      // ── Phases 2–6: The four speeches ────────────────────────
      // Each speech is preceded by an inhale tone.
      // After each speech the light grows.
      let cursor = 1800;
      SPEECHES.forEach((speech, idx) => {
        const words       = speech.text.split(' ');
        const typeDur     = words.length * speech.msPerWord;
        const totalVis    = typeDur + WORD_FADE_MS + speech.hold;
        const sentenceEnd = totalVis + SENTENCE_FADE_MS;

        // Inhale tone before speaking
        this._after(cursor - 350, () => this._sfxInhale());

        // Show speech
        this._after(cursor, () =>
          this._showSpeech(speech.text, speech.msPerWord, speech.hold)
        );

        // Grow the light after sentence starts
        this._after(cursor + 300, () =>
          this._growLight(speech.lightSize, speech.lightCol)
        );

        // Silence pause before sentence 4 (idx 3): three slow pulse pings
        if (idx === 2) {
          const silenceStart = cursor + sentenceEnd + 400;
          [0, 800, 1600].forEach(t =>
            this._after(silenceStart + t, () => this._spawnSilencePulse())
          );
          cursor = silenceStart + 2500;
        } else {
          cursor += sentenceEnd;
        }
      });

      // ── Phase 7: THE BLOOM ────────────────────────────────────
      this._after(22000, () => {
        const bloom = spawn(mk('rb-bloom'));
        this._after(2200, () => bloom.remove());

        // Shake
        document.body.classList.add('rb-bloom-shake');
        this._after(1500, () => document.body.classList.remove('rb-bloom-shake'));
        this.engine.shake(this.fx.shakeIntensity);

        // Hide the light itself — the bloom IS the light now
        if (this._lightEl) {
          this._lightEl.style.transition = 'opacity .4s ease';
          this._lightEl.style.opacity    = '0';
        }

        // Warm wash comes up with the bloom
        this._warmEl.classList.add('rb-warmwash--on');

        // Bloom audio
        this._sfxBloom();
        this._sfxFinalTone();
      });

      // ── Phase 8: Canvas — warm rays + glow + particles ────────
      this._after(23500, () => {
        const warmCols = [RG, RS, RW, RA, RO, '#ffee88'];
        warmCols.forEach((col, i) => {
          this._after(i * 110, () => {
            this.engine.addEffect(new RayBurst({
              color:    col,
              duration: 13000,
              maxAlpha: 0.21 - i * 0.028,
              rayCount: Math.floor(this.fx.rayCount * (1.2 - i * 0.11)),
              rotSpeed: i % 2 === 0 ? 0.5 + i * 0.14 : -(0.4 + i * 0.11),
            }));
          });
        });

        this.engine.addEffect(new GlowOverlay({
          color: RG_GLOW, duration: 12000, maxAlpha: this.fx.glowMaxAlpha,
          fadeIn: 0.04, fadeOut: 0.22, radial: true, pulseSpeed: 1.1,
        }));
        this.engine.addEffect(new GlowOverlay({
          color: RA_GLOW, duration: 11000, maxAlpha: 0.6,
          fadeIn: 0.06, fadeOut: 0.28, radial: true, pulseSpeed: 1.7,
        }));

        // Particle eruptions — warm, generous
        [[RG, 1.0], [RS, 0.8], [RW, 0.65], [RA, 0.5]].forEach(([col, scale], i) => {
          this._after(i * 130, () => {
            this.engine.addEffect(new ParticleBurst(0.5, 0.44, {
              count:    Math.floor(this.fx.particleCount * scale),
              color:    col,
              minSpeed: 80  + i * 70,
              maxSpeed: 480 + i * 50,
              minSize:  2,  maxSize: 11,
              gravity:  40,
              trail:    true, glow: true,
              duration: 11000,
              type:     'star',
            }));
          });
        });

        // Continuous rising ember sparks
        this.engine.addEffect(new ContinuousParticles({
          ox: 0.5, oy: 0.44,
          color:     RG,
          minSpeed:  35,  maxSpeed: 160,
          gravity:   -50, upBias:   110,
          spread:    Math.PI * 2, angle: -Math.PI / 2,
          minSize:   1,   maxSize: 5,
          trail:     true, glow:   true,
          spawnRate: 0.04,
          duration:  11000,
          type:      'star',
        }));
      });

      // ── Phase 9: Label ────────────────────────────────────────
      this._after(24500, () => this._spawnLabel());

      // ── Phase 10: Typewriter ──────────────────────────────────
      this._after(27000, () => this._spawnTypewriter());

      // ── Phase 13: Resolve ─────────────────────────────────────
      this._after(35000, () => {
        killSpawned();
        this._stopHum();
        if (this._actx) { try { this._actx.close(); } catch(e){} }
        resolve();
      });
    });
  }

  stop() {
    this.stopped = true;
    this._timers.forEach(clearTimeout);
    this._timers = [];
    document.body.classList.remove('rb-bloom-shake');
    this._stopHum();
    if (this._actx) { try { this._actx.close(); } catch(e){} }
    killSpawned();
  }

  // ── Phase 1: The light ────────────────────────────────────────
  _spawnLight() {
    const light = spawn(mk('rb-light'));
    this._lightEl = light;
  }

  // Radiate expanding rings from the light's position
  _spawnLightRings(count) {
    const cols = [
      'rgba(255,240,200,.5)',
      'rgba(255,210,140,.4)',
      'rgba(255,180,80,.3)',
      'rgba(255,150,50,.25)',
    ];
    for (let i = 0; i < count; i++) {
      const ring = spawn(mk('rb-light-ring'));
      const baseSize = 6 + i * 4;
      ring.style.setProperty('--rc',  cols[i % cols.length]);
      ring.style.setProperty('--rs',  baseSize + 'px');
      ring.style.setProperty('--rd',  `${3.5 + i * 0.8}s`);
      ring.style.setProperty('--rly', `${i * 0.9}s`);
    }
  }

  // Grow the light to a new size + colour
  _growLight(sizePx, col) {
    if (!this._lightEl || this.stopped) return;
    const half = sizePx / 2;
    this._lightEl.style.width    = sizePx + 'px';
    this._lightEl.style.height   = sizePx + 'px';
    this._lightEl.style.background = `radial-gradient(circle,#fff 0%,${col} 50%,rgba(255,180,60,.4) 80%,transparent 100%)`;
    this._lightEl.style.boxShadow = `
      0 0 ${half * 2}px ${half}px rgba(255,240,200,.8),
      0 0 ${half * 5}px ${half * 2}px rgba(255,200,100,.55),
      0 0 ${half * 12}px ${half * 4}px rgba(255,160,60,.3),
      0 0 ${half * 25}px ${half * 8}px rgba(255,120,40,.15)
    `;
  }

  // Silence pulse ping — rings that expand from the light
  _spawnSilencePulse() {
    const ping = spawn(mk('rb-silence-pulse'));
    this._sfxHeartPulse();
    this._after(2000, () => ping.remove());
  }

  // ── Word-by-word speech renderer ────────────────────────────
  // Sentences appear just below the light — intimate, directed
  _showSpeech(text, msPerWord, hold) {
    const container = spawn(mk('rb-sentence'));
    const words     = text.split(' ');

    words.forEach((word, i) => {
      const span = document.createElement('span');
      span.className = 'rb-word';
      span.textContent = word + (i < words.length - 1 ? '\u00A0' : '');
      span.style.setProperty('--dly',  `${i * msPerWord}ms`);
      span.style.setProperty('--dur',  `${WORD_FADE_MS}ms`);
      this._after(i * msPerWord + WORD_FADE_MS, () =>
        span.classList.add('rb-word--settled')
      );
      container.appendChild(span);
    });

    const lastIn = (words.length - 1) * msPerWord + WORD_FADE_MS;

    // After hold: fade out and drift upward slightly toward the light
    this._after(lastIn + hold, () => {
      container.style.transition = `opacity ${SENTENCE_FADE_MS}ms ease, transform ${SENTENCE_FADE_MS}ms ease`;
      container.style.opacity    = '0';
      container.style.transform  = 'translateX(-50%) translateY(-10px)';
      this._after(SENTENCE_FADE_MS + 60, () => container.remove());
    });
  }

  // ── R E B I R T H label ──────────────────────────────────────
  _spawnLabel() {
    const label = spawn(mk('rb-label'));
    const main  = document.createElement('div');
    main.className   = 'rb-label-main';
    main.textContent = 'R E B I R T H';
    const sub   = document.createElement('div');
    sub.className    = 'rb-label-sub';
    sub.textContent  = '1 / 700,000  ·  THE LIGHT HATH SPOKEN';
    label.appendChild(main);
    label.appendChild(sub);
    this._after(9800, () => label.remove());
  }

  // ── "AND NOW, THOU ART BORN AGAIN." typewriter ───────────────
  // No chime — the light has already said everything that needed saying.
  // The typewriter is its last whisper.
  _spawnTypewriter() {
    const el   = spawn(mk('rb-typewriter'));
    const TEXT = 'AND NOW, THOU ART BORN AGAIN.';
    const cur  = document.createElement('span');
    cur.className = 'rb-cursor';
    el.appendChild(cur);

    let idx = 0;
    const type = () => {
      if (this.stopped || !el.isConnected) return;
      if (idx < TEXT.length) {
        el.insertBefore(document.createTextNode(TEXT[idx]), cur);
        idx++;
        const ch = TEXT[idx - 1];
        const delay = ch === ',' ? 600    // long comma pause
                    : ch === '.' ? 900    // full stop — weight of finality
                    : ch === ' ' ? 200
                    : Math.random() > .9  ? 280 + Math.random() * 180
                    : 120 + Math.random() * 50;
        this._timers.push(setTimeout(type, delay));
      } else {
        this._after(3200, () => cur.remove());
      }
    };
    // First word arrives after a long breath — the light is done speaking, now it confirms.
    this._timers.push(setTimeout(type, 1100));
    this._after(7700, () => el.remove());
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

  // Low cosmic hum — 40 Hz, barely felt beneath the music
  _sfxHum() {
    const ctx = this._audio();
    if (!ctx) return;
    try {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine'; osc.frequency.value = 40;
      const t = ctx.currentTime;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.07, t + 3);
      gain.gain.setValueAtTime(0.07, t + 20);
      // Fades before bloom
      gain.gain.linearRampToValueAtTime(0.02, t + 22);
      gain.gain.linearRampToValueAtTime(0, t + 34);
      osc.start(t); osc.stop(t + 35);
      this._humNode = osc;
    } catch(e) {}
  }

  _stopHum() {
    try { if (this._humNode) { this._humNode.stop(); this._humNode = null; } } catch(e) {}
  }

  // Light heartbeat pulse — very faint 880 Hz blink
  _sfxHeartPulse() {
    const ctx = this._audio();
    if (!ctx) return;
    const t = ctx.currentTime;
    // Soft double-pulse — like the light's heartbeat
    this._beep(ctx, t,       880, 0.10, 0.025, 'sine');
    this._beep(ctx, t + .12, 880, 0.07, 0.015, 'sine');
  }

  // Inhale tone — soft 440 → 660 Hz sweep before each sentence
  // The light breathes in before it speaks
  _sfxInhale() {
    const ctx = this._audio();
    if (!ctx) return;
    try {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine';
      const t = ctx.currentTime;
      // Glide: 440 → 660 Hz over 0.28s
      osc.frequency.setValueAtTime(440, t);
      osc.frequency.linearRampToValueAtTime(660, t + 0.28);
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.055, t + 0.08);
      gain.gain.linearRampToValueAtTime(0, t + 0.32);
      osc.start(t); osc.stop(t + 0.35);
    } catch(e) {}
  }

  // THE BLOOM — Cmaj7 chord: C3+E3+G3+B3+C4 + high filtered noise
  // Warm and resolved — major 7th = the most "coming home" chord
  _sfxBloom() {
    const ctx = this._audio();
    if (!ctx) return;
    const t = ctx.currentTime;

    // Cmaj7 voicing — C3=130.8, E3=164.8, G3=196, B3=246.9, C4=261.6
    [
      [130.8, 0.00, 4.5, 0.14],
      [164.8, 0.05, 4.2, 0.12],
      [196.0, 0.10, 3.9, 0.11],
      [246.9, 0.15, 3.5, 0.10],
      [261.6, 0.20, 3.2, 0.09],
      // High shimmer octave
      [523.3, 0.30, 2.5, 0.05],
      [784.0, 0.45, 1.8, 0.03],
    ].forEach(([f, off, dur, vol]) => {
      this._beep(ctx, t + off, f, dur, vol, 'sine');
    });

    // Bass pedal — C2 + G2
    this._beep(ctx, t, 65.4,  5.0, 0.12, 'sine');
    this._beep(ctx, t, 98.0,  4.5, 0.08, 'sine');

    // Bright noise burst — the physical detonation of the bloom
    try {
      const bufLen = ctx.sampleRate * 0.25;
      const buf    = ctx.createBuffer(1, bufLen, ctx.sampleRate);
      const d      = buf.getChannelData(0);
      for (let k = 0; k < bufLen; k++) d[k] = (Math.random()*2-1) * Math.pow(1-k/bufLen, 1.8);
      const src  = ctx.createBufferSource(); src.buffer = buf;
      const hp   = ctx.createBiquadFilter();
      hp.type    = 'bandpass'; hp.frequency.value = 3500; hp.Q.value = 0.6;
      const gN   = ctx.createGain();
      src.connect(hp); hp.connect(gN); gN.connect(ctx.destination);
      gN.gain.setValueAtTime(0.16, t);
      gN.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
      src.start(t); src.stop(t + 0.35);
    } catch(e) {}
  }

  // The final tone — 528 Hz (the "solfeggio" tone, associated with healing/transformation)
  // Holds through the entire typewriter phase, fading gently over 8 seconds
  _sfxFinalTone() {
    const ctx = this._audio();
    if (!ctx) return;
    try {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine'; osc.frequency.value = 528;
      const t = ctx.currentTime;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.12, t + 1.2);
      gain.gain.setValueAtTime(0.12, t + 3.0);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 9.5);
      osc.start(t); osc.stop(t + 9.6);

      // Perfect fifth above — 792 Hz (528 × 1.5) — pure harmony
      const osc2  = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.connect(gain2); gain2.connect(ctx.destination);
      osc2.type = 'sine'; osc2.frequency.value = 792;
      gain2.gain.setValueAtTime(0, t);
      gain2.gain.linearRampToValueAtTime(0.06, t + 1.8);
      gain2.gain.exponentialRampToValueAtTime(0.0001, t + 8.0);
      osc2.start(t); osc2.stop(t + 8.1);
    } catch(e) {}
  }
}