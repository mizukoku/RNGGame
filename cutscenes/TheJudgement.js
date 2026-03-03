// cutscenes/TheJudgement.js
// ══════════════════════════════════════════════════════════════════
//  THE JUDGEMENT  ·  1 / 1,000,000
//  Undertale-inspired interactive boss fight, two outcomes.
//
//  WIN  → laser wall insta-kill → heartbreak → REFUSED → Determination
//  LOSE → GAME OVER → boss monologue → somber reveal
//
//  Controls: Arrow / WASD to dodge.  Click the weak point to attack.
// ══════════════════════════════════════════════════════════════════

// ─── Font ─────────────────────────────────────────────────────────
function _ensureFont() {
  if (document.getElementById("_jdg_font")) return;
  const l = document.createElement("link");
  l.id = "_jdg_font";
  l.rel = "stylesheet";
  l.href =
    "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap";
  document.head.appendChild(l);
}
const FONT = '"Press Start 2P","8 Bit Wonder","Courier New",monospace';

// ─── Chiptune Engine ──────────────────────────────────────────────
class ChipAudio {
  constructor() {
    this.ac = null;
    this._g = null;
    this._nodes = [];
    this._timers = [];
    this._loopAt = 0;
    this._loopLen = 0;
  }

  init() {
    try {
      this.ac = new (window.AudioContext || window.webkitAudioContext)();
      this._g = this.ac.createGain();
      this._g.gain.value = 0.33;
      this._g.connect(this.ac.destination);
      return true;
    } catch (e) {
      return false;
    }
  }

  start() {
    if (!this.ac) return;
    if (this.ac.state === "suspended") this.ac.resume();
    this._loopAt = this.ac.currentTime + 0.1;
    this._sched(this._loopAt);
  }

  stop() {
    this._timers.forEach((t) => clearTimeout(t));
    this._timers = [];
    this._nodes.forEach((n) => {
      try {
        n.stop(0);
      } catch (e) {}
    });
    this._nodes = [];
  }

  sfx(type) {
    if (!this.ac) return;
    const t = this.ac.currentTime + 0.01;
    if (type === "hit") {
      this._sw(t, 0.09, 250, 110, "square", 0.22);
    }
    if (type === "bossHit") {
      this._sw(t, 0.14, 660, 300, "square", 0.28);
    }
    if (type === "miss") {
      this._sw(t, 0.11, 900, 450, "square", 0.13);
    }
    if (type === "laserCharge") {
      this._sw(t, 1.8, 80, 600, "sawtooth", 0.3);
      this._sw(t, 1.8, 40, 200, "triangle", 0.18);
    }
    if (type === "laserFire") {
      this._sw(t, 0.06, 120, 60, "sawtooth", 0.4);
      this._sw(t, 0.8, 1800, 200, "square", 0.14);
      this._nz(t, 0.35, 0.24);
    }
    if (type === "heartCrack") {
      this._sw(t, 0.4, 180, 55, "square", 0.3);
      this._nz(t, 0.3, 0.18);
    }
    if (type === "heartBreak") {
      this._sw(t, 0.7, 90, 30, "square", 0.35);
      this._nz(t, 0.6, 0.22);
    }
    if (type === "determination") {
      this._sw(t, 0.12, 660, 880, "square", 0.24);
      this._sw(t + 0.12, 0.12, 880, 1100, "square", 0.2);
      this._sw(t + 0.24, 0.3, 1320, 1320, "square", 0.22);
    }
  }

  _sw(when, dur, f0, f1, type, vol) {
    const o = this.ac.createOscillator(),
      g = this.ac.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f0, when);
    o.frequency.exponentialRampToValueAtTime(Math.max(f1, 0.01), when + dur);
    g.gain.setValueAtTime(0, when);
    g.gain.linearRampToValueAtTime(vol, when + 0.005);
    g.gain.exponentialRampToValueAtTime(0.001, when + dur);
    o.connect(g);
    g.connect(this._g);
    o.start(when);
    o.stop(when + dur + 0.05);
    this._nodes.push(o);
  }

  _nz(when, dur, vol) {
    const N = Math.ceil(this.ac.sampleRate * dur);
    const buf = this.ac.createBuffer(1, N, this.ac.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < N; i++) d[i] = Math.random() * 2 - 1;
    const src = this.ac.createBufferSource();
    const hpf = this.ac.createBiquadFilter();
    const g = this.ac.createGain();
    hpf.type = "highpass";
    hpf.frequency.value = 5500;
    src.buffer = buf;
    g.gain.setValueAtTime(vol, when);
    g.gain.exponentialRampToValueAtTime(0.001, when + dur);
    src.connect(hpf);
    hpf.connect(g);
    g.connect(this._g);
    src.start(when);
    this._nodes.push(src);
  }

  _note(freq, when, dur, type, vol) {
    const o = this.ac.createOscillator(),
      g = this.ac.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.setValueAtTime(0, when);
    g.gain.linearRampToValueAtTime(vol, when + 0.005);
    g.gain.setTargetAtTime(0, when + dur * 0.58, dur * 0.11);
    o.connect(g);
    g.connect(this._g);
    o.start(when);
    o.stop(when + dur + 0.06);
    this._nodes.push(o);
  }

  _kick(when) {
    const o = this.ac.createOscillator(),
      g = this.ac.createGain();
    o.frequency.setValueAtTime(185, when);
    o.frequency.exponentialRampToValueAtTime(0.01, when + 0.13);
    g.gain.setValueAtTime(0.24, when);
    g.gain.exponentialRampToValueAtTime(0.001, when + 0.15);
    o.connect(g);
    g.connect(this._g);
    o.start(when);
    o.stop(when + 0.2);
    this._nodes.push(o);
  }

  _hat(when) {
    this._nz(when, 0.035, 0.055);
  }

  _sched(t0) {
    const BPM = 182,
      B = 60 / BPM,
      S = B / 4;
    // Frequencies
    const A3 = 220,
      D3 = 146.83,
      E3 = 164.81,
      F3 = 174.61,
      G3 = 196,
      C4 = 261.63;
    const G4 = 392,
      A4 = 440,
      B4 = 493.88,
      C5 = 523.25,
      D5 = 587.33;
    const E5 = 659.25,
      F5 = 698.46,
      G5 = 783.99,
      A5 = 880;

    // Melody: [freq|null, 16th-count]  (64 sixteenths = 4 bars)
    const LEAD = [
      [A4, 2],
      [A4, 2],
      [E5, 2],
      [D5, 2],
      [C5, 2],
      [A4, 2],
      [null, 2],
      [E5, 2], // bar 1
      [D5, 2],
      [D5, 2],
      [A4, 2],
      [G4, 2],
      [A4, 2],
      [null, 2],
      [C5, 2],
      [D5, 2], // bar 2
      [E5, 2],
      [E5, 2],
      [F5, 2],
      [E5, 2],
      [D5, 2],
      [C5, 2],
      [A4, 2],
      [null, 2], // bar 3
      [A4, 1],
      [B4, 1],
      [C5, 1],
      [D5, 1],
      [E5, 1],
      [F5, 1],
      [G5, 1],
      [A5, 1],
      [A5, 4],
      [null, 4], // bar 4
    ];

    // Bass: 4 bars matching
    const BASS = [
      [A3, 4],
      [null, 2],
      [A3, 2],
      [null, 4],
      [A3, 4],
      [D3, 4],
      [null, 2],
      [D3, 2],
      [null, 4],
      [A3, 4],
      [F3, 4],
      [null, 2],
      [F3, 2],
      [null, 4],
      [C4, 4],
      [E3, 4],
      [null, 2],
      [E3, 2],
      [null, 4],
      [A3, 4],
    ];

    // Schedule melody
    let t = t0;
    for (const [freq, n] of LEAD) {
      const d = n * S;
      if (freq) this._note(freq, t, d, "square", 0.155);
      t += d;
    }
    const loopLen = t - t0;

    // Schedule bass
    t = t0;
    for (const [freq, n] of BASS) {
      const d = n * S;
      if (freq) this._note(freq, t, d, "triangle", 0.12);
      t += d;
    }

    // Drums: kick on beats 1 & 3 of each bar, hat every 8th note
    const BARS = 4,
      BEATS = BARS * 4;
    for (let b = 0; b < BEATS; b++) {
      const bt = t0 + b * B;
      if (b % 4 === 0 || b % 4 === 2) this._kick(bt);
      this._hat(bt);
      this._hat(bt + S * 2);
    }

    if (!this._loopLen) this._loopLen = loopLen;
    const msUntilNext =
      (this._loopAt + this._loopLen - this.ac.currentTime - 0.14) * 1000;
    this._loopAt += this._loopLen;
    const id = setTimeout(
      () => {
        if (this.ac) this._sched(this._loopAt);
      },
      Math.max(0, msUntilNext),
    );
    this._timers.push(id);
  }
}

// ─── Dialogue scripts ─────────────────────────────────────────────
const INTRO_LINES = [
  "* ...",
  "* so you actually made it.",
  "* 1 in a million.",
  "* ...",
  "* heh.",
  "---",
  "* i'm not just gonna hand this over.",
  "* not to someone who hasn't bled for it.",
  "---",
  "* get ready.",
  "* because this? this is gonna hurt.",
];

const ROUND_TAUNTS = [
  "* warming up?",
  "* not bad. keep going.",
  "* you're tougher than you look.",
  "* i'm not even trying yet.",
  "* now it gets real.",
  "* do you have any idea what i am?",
  "* you can't win. but here you are.",
  "* FINE. i'll stop holding back.",
];

const MISS_TAUNTS = [
  "* too slow.",
  "* heh.",
  "* is that all?",
  "* you're gonna have a bad time.",
  "* ...",
  "* nice try.",
  "* swing and a miss.",
  "* thought so.",
];

const WIN_LINES = [
  "* ...",
  "* ...",
  "* you actually did it.",
  "* ...",
  "* heh.",
  "* i knew this day would come.",
  "---",
  "* but a deal's a deal.",
  "---",
  "* ...",
  "* go ahead. take it.",
];

const LOSE_LINES = [
  "* i knew it.",
  "* you gave everything you had.",
  "* ...",
  "* ...",
  "* but you got here.",
  "* 1 in a million. that's not nothing.",
  "---",
  "* ...",
  "* fine. take it.",
  "* you've earned the right to exist here.",
];

// ─── Constants ────────────────────────────────────────────────────
const C = {
  BG: "#000000",
  WHITE: "#ffffff",
  HEART: "#ff2020",
  BONE: "#e4e4e4",
  WARN: "#ffee00",
};
const BOX = { W: 380, H: 220 };
const HS = 13; // heart half-size
const ROUNDS = 8;
const PLAYER_MAX_HP = 4;
const BOSS_MAX_HP = 7;

// ══════════════════════════════════════════════════════════════════
//  MAIN CLASS
// ══════════════════════════════════════════════════════════════════
export class TheJudgement {
  constructor(engine, rarity) {
    this.engine = engine;
    this.rarity = rarity;
    this._overlay = null;
    this._running = false;
    this._animId = null;
    this._timers = [];
    this._evts = [];
    this._audio = new ChipAudio();
  }

  // ── Public ─────────────────────────────────────────────────────
  async play() {
    _ensureFont();
    this._audio.init();
    this._running = true;
    this._overlay = this._mkOverlay();
    document.body.appendChild(this._overlay);

    try {
      await this._wait(350);
      this._audio.start();
      await this._dialogue(INTRO_LINES, true);
      if (!this._running) return;

      const result = await this._fight();
      if (!this._running) return;

      if (result === "win") {
        this._audio.stop();
        await this._winEndingSequence();
      } else {
        this._audio.stop();
        await this._gameOverScreen();
        if (!this._running) return;
        await this._dialogue(LOSE_LINES, false);
        if (!this._running) return;
        await this._loseCutscene();
      }
    } finally {
      this._teardown();
    }
  }

  stop() {
    this._running = false;
    this._audio.stop();
    this._teardown();
  }

  // ── Infrastructure ─────────────────────────────────────────────
  _mkOverlay() {
    const el = document.createElement("div");
    Object.assign(el.style, {
      position: "fixed",
      inset: "0",
      background: C.BG,
      zIndex: "99999",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: FONT,
      overflow: "hidden",
      userSelect: "none",
    });
    return el;
  }

  _teardown() {
    this._evts.forEach(([t, e, fn]) => t.removeEventListener(e, fn));
    this._evts = [];
    this._timers.forEach((id) => clearTimeout(id));
    this._timers = [];
    if (this._animId) {
      cancelAnimationFrame(this._animId);
      this._animId = null;
    }
    this._overlay?.remove();
    this._overlay = null;
  }

  _on(t, e, fn) {
    t.addEventListener(e, fn);
    this._evts.push([t, e, fn]);
  }

  _wait(ms) {
    return new Promise((res) => {
      if (!this._running) {
        res();
        return;
      }
      const id = setTimeout(res, ms);
      this._timers.push(id);
    });
  }

  _clear() {
    while (this._overlay?.firstChild)
      this._overlay.removeChild(this._overlay.firstChild);
  }

  // ── Dialogue ───────────────────────────────────────────────────
  async _dialogue(lines, showBoss = true) {
    this._clear();
    const wrap = document.createElement("div");
    Object.assign(wrap.style, {
      display: "flex",
      gap: "26px",
      alignItems: "flex-start",
      maxWidth: "620px",
      width: "90%",
    });

    let iconCanvas;
    if (showBoss) {
      iconCanvas = document.createElement("canvas");
      iconCanvas.width = 88;
      iconCanvas.height = 88;
      Object.assign(iconCanvas.style, {
        flexShrink: "0",
        marginTop: "10px",
        imageRendering: "pixelated",
      });
      wrap.appendChild(iconCanvas);
    }

    const box = document.createElement("div");
    Object.assign(box.style, {
      border: `3px solid ${C.WHITE}`,
      padding: "18px 20px",
      background: C.BG,
      flex: "1",
      minHeight: "80px",
      maxHeight: "260px",
      overflowY: "auto",
    });
    wrap.appendChild(box);
    this._overlay.appendChild(wrap);

    // Bob animation for boss icon
    let bobRaf,
      bobT = 0;
    if (iconCanvas) {
      const bobCtx = iconCanvas.getContext("2d");
      const bobLoop = () => {
        if (!this._running) return;
        bobT += 0.035;
        bobCtx.clearRect(0, 0, 88, 88);
        this._drawBossIcon(bobCtx, 44, 44 + Math.sin(bobT) * 2.5, false);
        bobRaf = requestAnimationFrame(bobLoop);
      };
      bobRaf = requestAnimationFrame(bobLoop);
    }

    for (const line of lines) {
      if (!this._running) break;
      if (line === "---") {
        await this._wait(640);
        continue;
      }
      const p = document.createElement("p");
      Object.assign(p.style, {
        margin: "0 0 4px",
        fontSize: "12px",
        color: C.WHITE,
        letterSpacing: ".04em",
        lineHeight: "1.7",
        minHeight: "20px",
      });
      box.appendChild(p);
      box.scrollTop = box.scrollHeight;
      await this._type(p, line, 34);
      await this._wait(line.length < 6 ? 480 : 240);
    }

    if (bobRaf) cancelAnimationFrame(bobRaf);
    await this._wait(520);
  }

  _type(el, text, speed) {
    return new Promise((res) => {
      let i = 0;
      const tick = () => {
        if (!this._running) {
          el.textContent = text;
          res();
          return;
        }
        el.textContent = text.slice(0, ++i);
        if (i < text.length) {
          const id = setTimeout(tick, speed);
          this._timers.push(id);
        } else res();
      };
      tick();
    });
  }

  // ── Boss icon (dialogue panel) ────────────────────────────────
  _drawBossIcon(ctx, cx, cy, angry) {
    ctx.save();
    ctx.translate(cx, cy);
    const bc = angry ? "#f0d0d0" : "#d0d0d0";
    const ec = angry ? "#ffff55" : "#55aaff";

    // ── Cranium ──────────────────────────────────────────────
    ctx.fillStyle = bc;
    ctx.beginPath();
    ctx.moveTo(-22, 14);
    ctx.bezierCurveTo(-26, 14, -28, 8, -28, 0);
    ctx.bezierCurveTo(-28, -18, -18, -28, 0, -28);
    ctx.bezierCurveTo(18, -28, 28, -18, 28, 0);
    ctx.bezierCurveTo(28, 8, 26, 14, 22, 14);
    ctx.lineTo(-22, 14);
    ctx.fill();

    // ── Cheekbone shading ────────────────────────────────────
    ctx.fillStyle = angry ? "rgba(0,0,0,.08)" : "rgba(0,0,0,.06)";
    ctx.beginPath();
    ctx.ellipse(-19, 6, 7, 5, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(19, 6, 7, 5, 0.3, 0, Math.PI * 2);
    ctx.fill();

    // ── Highlight on cranium top ─────────────────────────────
    ctx.fillStyle = "rgba(255,255,255,.18)";
    ctx.beginPath();
    ctx.ellipse(0, -18, 12, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // ── Jaw / Mouth area ─────────────────────────────────────
    // Dark mouth cavity
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.moveTo(-20, 14);
    ctx.lineTo(-20, 26);
    ctx.bezierCurveTo(-18, 30, 18, 30, 20, 26);
    ctx.lineTo(20, 14);
    ctx.fill();

    // Lower gum ridge
    ctx.fillStyle = bc;
    ctx.fillRect(-21, 14, 42, 6);

    // Teeth — 6 teeth with slight variation
    const teethY = 20;
    const teethH = [11, 12, 11, 11, 12, 11];
    const teethX = [-21, -13, -5, 3, 11, 19];
    const teethW = 7;
    ctx.fillStyle = angry ? "#ffe8e8" : "#f0f0f0";
    for (let i = 0; i < 6; i++) {
      ctx.fillRect(teethX[i], teethY, teethW - 1, teethH[i]);
    }

    // Tooth gaps (dark)
    ctx.fillStyle = "#000";
    for (let i = 0; i < 5; i++) {
      ctx.fillRect(teethX[i] + teethW - 1, teethY, 1, 8);
    }

    // ── Eye sockets ──────────────────────────────────────────
    ctx.fillStyle = "#000";
    const ea = angry ? 0.32 : 0;
    // Left socket — slightly tilted inward when angry
    ctx.beginPath();
    ctx.ellipse(-13, -4, 9, 7, -ea, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(13, -4, 9, 7, ea, 0, Math.PI * 2);
    ctx.fill();

    // ── Eye pupils / glow ────────────────────────────────────
    ctx.fillStyle = ec;
    ctx.shadowColor = ec;
    ctx.shadowBlur = angry ? 14 : 10;
    const pupR = angry ? 4.5 : 4;
    ctx.beginPath();
    ctx.arc(-13, -4, pupR, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(13, -4, pupR, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Pupil specular
    ctx.fillStyle = "rgba(255,255,255,.55)";
    ctx.beginPath();
    ctx.arc(-14.5, -5.5, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(11.5, -5.5, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // ── Nose cavity (two small holes) ───────────────────────
    ctx.fillStyle = "rgba(0,0,0,.4)";
    ctx.beginPath();
    ctx.ellipse(-4, 5, 3, 3.5, -0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(4, 5, 3, 3.5, 0.1, 0, Math.PI * 2);
    ctx.fill();

    // ── Crack on skull (appears when boss is at low HP — handled by caller) ─
    ctx.restore();
  }

  // ══════════════════════════════════════════════════════════════
  //  FIGHT
  // ══════════════════════════════════════════════════════════════
  async _fight() {
    this._clear();

    const W = Math.min(window.innerWidth, 760);
    const H = Math.min(window.innerHeight, 560);
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    Object.assign(canvas.style, { display: "block", cursor: "crosshair" });
    this._overlay.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    const CX = W / 2,
      CY = H / 2 + 20;
    const BX = CX - BOX.W / 2,
      BY = CY - BOX.H / 2;

    const gs = {
      phase: "dodge",
      cycle: 0,
      timer: this._dodgeTime(0),
      playerHP: PLAYER_MAX_HP,
      bossHP: BOSS_MAX_HP,
      iframes: 0,
      heart: { x: CX, y: CY },
      vx: 0,
      vy: 0, // heart velocity for smooth movement
      bones: [],
      warnings: [], // telegraphed bone paths shown before spawning
      blasts: [],
      target: null,
      floaters: [],
      msg: "",
      msgT: 0,
      bossT: 0,
      bossFlash: 0,
      shakeX: 0,
      shakeY: 0,
      done: false,
      result: null,
    };

    const keys = {};
    this._on(window, "keydown", (e) => {
      keys[e.key] = true;
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key))
        e.preventDefault();
    });
    this._on(window, "keyup", (e) => {
      keys[e.key] = false;
    });

    this._on(canvas, "click", (e) => {
      if (gs.phase !== "attack" || !gs.target || gs.done) return;
      const r = canvas.getBoundingClientRect();
      const mx = (e.clientX - r.left) * (W / r.width);
      const my = (e.clientY - r.top) * (H / r.height);
      if (Math.hypot(mx - gs.target.x, my - gs.target.y) <= gs.target.r + 16) {
        gs.bossHP--;
        gs.bossFlash = 0.45;
        this._audio.sfx("bossHit");
        gs.floaters.push({
          x: gs.target.x,
          y: gs.target.y - 12,
          text: "-1",
          vy: -45,
          life: 1.1,
          col: "#ff4444",
        });
        gs.target = null;
        gs.msg = ROUND_TAUNTS[gs.cycle] ?? "* ...";
        gs.msgT = 2;
        this._nextPhase(gs, BX, BY, CX, CY);
      }
    });

    this._spawnBones(gs, BX, BY, CX, CY, 0);

    let last = performance.now();
    return new Promise((resolve) => {
      const loop = (now) => {
        if (!this._running) {
          resolve("lose");
          return;
        }
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        this._updateFight(gs, dt, keys, BX, BY, CX, CY);
        this._drawFight(ctx, W, H, gs, BX, BY, CX, CY);
        if (gs.done) {
          resolve(gs.result);
          return;
        }
        this._animId = requestAnimationFrame(loop);
      };
      this._animId = requestAnimationFrame(loop);
    });
  }

  _dodgeTime(cycle) {
    return Math.max(4.5, 8.5 - cycle * 0.55);
  }
  _attackTime(cycle) {
    return Math.max(1.7, 3.0 - cycle * 0.165);
  }
  _boneSpeed(cycle) {
    return 80 + cycle * 22;
  }

  _nextPhase(gs, BX, BY, CX, CY) {
    gs.cycle++;
    if (gs.cycle >= ROUNDS) {
      gs.result = gs.bossHP <= 0 ? "win" : "lose";
      gs.done = true;
      return;
    }
    gs.phase = "dodge";
    gs.timer = this._dodgeTime(gs.cycle);
    gs.bones = [];
    gs.warnings = [];
    gs.blasts = [];
    gs.target = null;
    gs.heart = { x: CX, y: CY };
    gs.vx = 0;
    gs.vy = 0;
    this._spawnBones(gs, BX, BY, CX, CY, gs.cycle);
  }

  _spawnBones(gs, BX, BY, CX, CY, round) {
    const spd = this._boneSpeed(round);
    const WARN = 680; // ms of warning before bone appears

    // Queue a telegraphed bone: show warning for WARN ms, then spawn
    const queue = (delayMs, boneData, warnType) => {
      const id = setTimeout(() => {
        if (gs.done || gs.phase !== "dodge") return;
        // Add warning to gs
        const w = {
          ...warnData(boneData, warnType, BX, BY),
          timer: WARN / 1000,
          bone: boneData,
        };
        gs.warnings.push(w);
        // Spawn actual bone after warning
        const id2 = setTimeout(() => {
          if (gs.done || gs.phase !== "dodge") {
            gs.warnings = gs.warnings.filter((x) => x !== w);
            return;
          }
          gs.warnings = gs.warnings.filter((x) => x !== w);
          gs.bones.push(boneData);
        }, WARN);
        this._timers.push(id2);
      }, delayMs);
      this._timers.push(id);
    };

    const warnData = (b, type, BX, BY) => {
      if (type === "h")
        return { type: "h", y: b.y, h: b.h, fromLeft: b.vx > 0 };
      if (type === "v") return { type: "v", x: b.x, w: b.w, fromTop: b.vy > 0 };
      return { type: "d", bx: b.x, by: b.y, vx: b.vx, vy: b.vy, sz: b.w };
    };

    const h = (delay, fromLeft, yFrac, thick) => {
      const by = BY + BOX.H * yFrac;
      const bw = 42 + Math.random() * 55;
      queue(
        delay,
        {
          x: fromLeft ? BX - 12 : BX + BOX.W + 12,
          y: by,
          w: bw,
          h: thick ?? 10 + round * 1.6,
          vx: (fromLeft ? 1 : -1) * (spd + Math.random() * spd * 0.4),
          vy: 0,
        },
        "h",
      );
    };

    const v = (delay, xFrac) => {
      const bx = BX + BOX.W * xFrac;
      queue(
        delay,
        {
          x: bx,
          y: BY - 12,
          w: 11 + round * 0.5,
          h: 28 + Math.random() * 18,
          vx: 0,
          vy: spd * 0.88,
        },
        "v",
      );
    };

    const d = (delay, corner) => {
      const s = spd * 0.82;
      const fromL = corner === 0 || corner === 2;
      const fromT = corner === 0 || corner === 1;
      queue(
        delay,
        {
          x: fromL ? BX - 10 : BX + BOX.W + 10,
          y: fromT ? BY - 10 : BY + BOX.H + 10,
          w: 34,
          h: 34,
          vx: (fromL ? 1 : -1) * s,
          vy: (fromT ? 1 : -1) * s,
        },
        "d",
      );
    };

    // At boss HP=1, cap total blasts spawned this round to 1 so it stays fair
    let _blastCount = -2;
    const _blastCap = gs.bossHP <= 0 ? 1 : 99;

    const blast = (delayMs) => {
      if (_blastCount++ >= _blastCap) return;
      // Pick a Y that avoids the center-reset zone (heart always resets to CY)
      // Split into top-third or bottom-third to keep center safe
      const safeZone = BOX.H * 0.28; // avoid ±28% around center
      const topY = BY + 18 + Math.random() * (BOX.H / 2 - safeZone - 18);
      const botY =
        BY + BOX.H / 2 + safeZone + Math.random() * (BOX.H / 2 - safeZone - 18);
      const bl = {
        y: Math.random() < 0.5 ? topY : botY,
        firing: false,
        timer: 0,
        h: 22 + round,
        skullSide: "L", // single skull on left edge
      };
      gs.blasts.push(bl);
      // Guarantee at least 1100ms of telegraph time before firing,
      // regardless of the caller's delayMs, so the player always sees the warning
      const minWarn = 1100;
      const fireDelay = Math.max(delayMs + minWarn, minWarn);
      const id = setTimeout(() => {
        bl.firing = true;
        bl.timer = 1.0;
      }, fireDelay);
      this._timers.push(id);
    };

    // Vertical laser — fires from top of box to bottom at a safe X column
    const blast_v = (delayMs) => {
      if (_blastCount++ >= _blastCap) return;
      const safeZone = BOX.W * 0.28;
      const leftX = BX + 18 + Math.random() * (BOX.W / 2 - safeZone - 18);
      const rightX =
        BX + BOX.W / 2 + safeZone + Math.random() * (BOX.W / 2 - safeZone - 18);
      const bw = 20 + round * 0.8;
      const bl = {
        dir: "v",
        x: Math.random() < 0.5 ? leftX : rightX,
        w: bw,
        firing: false,
        timer: 0,
      };
      gs.blasts.push(bl);
      const fireDelay = Math.max(delayMs + 1100, 1100);
      const id = setTimeout(() => {
        bl.firing = true;
        bl.timer = 1.0;
      }, fireDelay);
      this._timers.push(id);
    };

    // Diagonal laser — slashes from one corner to the opposite
    const blast_d = (delayMs) => {
      if (_blastCount++ >= _blastCap) return;
      const slash = Math.random() < 0.5; // true = \ , false = /
      const thick = 28 + round;
      const bl = {
        dir: "d",
        x1: slash ? BX : BX + BOX.W,
        y1: BY,
        x2: slash ? BX + BOX.W : BX,
        y2: BY + BOX.H,
        thick,
        firing: false,
        timer: 0,
      };
      gs.blasts.push(bl);
      const fireDelay = Math.max(delayMs + 1100, 1100);
      const id = setTimeout(() => {
        bl.firing = true;
        bl.timer = 1.0;
      }, fireDelay);
      this._timers.push(id);
    };

    // ── Patterns: one thing at a time, clearly spaced ─────────────
    // Round 0: 2 slow sweeps, clearly telegraphed
    if (round === 0) {
      h(0, true, 0.28);
      h(1700, false, 0.58);
      h(3200, true, 0.42);
    }
    // Round 1: add vertical drop
    else if (round === 1) {
      h(0, false, 0.22);
      v(1400, 0.55);
      h(2500, true, 0.62);
      v(3600, 0.28);
    }
    // Round 2: diagonals introduced
    else if (round === 2) {
      h(0, true, 0.35);
      h(1200, false, 0.65);
      d(2200, 0);
      v(3000, 0.45);
      h(4000, true, 0.18);
    }
    // Round 3: blast + sweep combos, vertical laser introduced
    else if (round === 3) {
      blast(600);
      h(0, true, 0.25);
      h(1500, false, 0.5);
      d(2400, 2);
      blast_v(2800);
      v(3200, 0.35);
      h(4000, false, 0.72);
    }
    // Round 4: faster, 2 blasts, diagonal laser introduced
    else if (round === 4) {
      blast(500);
      h(0, false, 0.3);
      d(1000, 1);
      h(1800, true, 0.55);
      blast_d(2000);
      blast(2400);
      v(2800, 0.6);
      d(3400, 3);
      h(4200, true, 0.2);
    }
    // Round 5: vertical + diagonal blasts mixed in
    else if (round === 5) {
      blast(400);
      h(0, true, 0.2);
      blast_v(800);
      h(1100, false, 0.55);
      d(1800, 0);
      blast_d(2000);
      blast(2200);
      v(2600, 0.3);
      v(3200, 0.65);
      h(3800, true, 0.38);
      d(4400, 3);
    }
    // Round 6: 3 blasts of mixed types
    else if (round === 6) {
      blast(200);
      h(0, false, 0.18);
      h(900, true, 0.45);
      blast_v(1400);
      blast_d(1600);
      d(1800, 2);
      v(2400, 0.4);
      h(3000, false, 0.68);
      blast(3400);
      d(3800, 1);
      v(4300, 0.22);
    }
    // Round 7+: full barrage with all types
    else {
      blast(200);
      blast_v(600);
      blast_d(800);
      blast(1200);
      blast_d(1600);
      blast(2400);
      blast_v(2800);
      h(0, true, 0.15);
      h(700, false, 0.42);
      d(1000, 0);
      v(1600, 0.35);
      h(2000, true, 0.65);
      d(2400, 3);
      v(2900, 0.58);
      h(3300, false, 0.28);
      d(3700, 2);
      h(4100, true, 0.5, 8);
    }
  }

  _updateFight(gs, dt, keys, BX, BY, CX, CY) {
    gs.bossT += dt;
    gs.msgT -= dt;
    gs.iframes -= dt;
    gs.bossFlash -= dt;
    gs.shakeX *= 0.78;
    gs.shakeY *= 0.78;
    if (Math.abs(gs.shakeX) < 0.05) gs.shakeX = 0;
    if (Math.abs(gs.shakeY) < 0.05) gs.shakeY = 0;

    // Floaters
    for (const f of gs.floaters) {
      f.y += f.vy * dt;
      f.vy += 60 * dt;
      f.life -= dt;
    }
    gs.floaters = gs.floaters.filter((f) => f.life > 0);

    if (gs.phase === "dodge") {
      gs.timer -= dt;

      // Tick warnings down
      for (const w of gs.warnings) w.timer -= dt;

      // Smooth velocity-based heart movement
      const MAX_SPD = 152;
      let tdx = 0,
        tdy = 0;
      if (keys["ArrowLeft"] || keys["a"] || keys["A"]) tdx -= 1;
      if (keys["ArrowRight"] || keys["d"] || keys["D"]) tdx += 1;
      if (keys["ArrowUp"] || keys["w"] || keys["W"]) tdy -= 1;
      if (keys["ArrowDown"] || keys["s"] || keys["S"]) tdy += 1;
      if (tdx && tdy) {
        tdx *= 0.7071;
        tdy *= 0.7071;
      } // normalize diagonal
      const lerp = Math.min(1, 14 * dt);
      gs.vx += (tdx * MAX_SPD - gs.vx) * lerp;
      gs.vy += (tdy * MAX_SPD - gs.vy) * lerp;
      gs.heart.x = Math.max(
        BX + HS + 2,
        Math.min(BX + BOX.W - HS - 2, gs.heart.x + gs.vx * dt),
      );
      gs.heart.y = Math.max(
        BY + HS + 2,
        Math.min(BY + BOX.H - HS - 2, gs.heart.y + gs.vy * dt),
      );

      // Move bones
      for (const b of gs.bones) {
        b.x += b.vx * dt;
        b.y += b.vy * dt;
      }
      gs.bones = gs.bones.filter(
        (b) =>
          b.x > BX - 120 &&
          b.x < BX + BOX.W + 120 &&
          b.y > BY - 120 &&
          b.y < BY + BOX.H + 120,
      );

      // Blast timers
      for (const bl of gs.blasts) {
        if (bl.firing) bl.timer -= dt;
      }
      gs.blasts = gs.blasts.filter((bl) => !bl.firing || bl.timer > 0);

      // Collision
      if (gs.iframes <= 0) {
        for (const b of gs.bones) {
          if (this._hitBone(b, gs.heart)) {
            this._hitPlayer(gs);
            if (gs.done) return;
            break;
          }
        }
        for (const bl of gs.blasts) {
          if (!bl.firing) continue;
          let blHit = false;
          if (!bl.dir || bl.dir === "h") {
            blHit = gs.heart.y >= bl.y && gs.heart.y <= bl.y + bl.h;
          } else if (bl.dir === "v") {
            blHit = gs.heart.x >= bl.x && gs.heart.x <= bl.x + bl.w;
          } else if (bl.dir === "d") {
            const ddx = bl.x2 - bl.x1,
              ddy = bl.y2 - bl.y1;
            const len2 = ddx * ddx + ddy * ddy;
            const tt = Math.max(
              0,
              Math.min(
                1,
                ((gs.heart.x - bl.x1) * ddx + (gs.heart.y - bl.y1) * ddy) /
                  len2,
              ),
            );
            blHit =
              Math.hypot(
                gs.heart.x - (bl.x1 + tt * ddx),
                gs.heart.y - (bl.y1 + tt * ddy),
              ) <
              bl.thick / 2 + HS;
          }
          if (blHit) {
            this._hitPlayer(gs);
            if (gs.done) return;
            break;
          }
        }
      }

      if (gs.timer <= 0) {
        gs.phase = "attack";
        gs.timer = this._attackTime(gs.cycle);
        gs.bones = [];
        gs.blasts = [];
        gs.target = {
          x: CX + (Math.random() - 0.5) * 90,
          y: 62 + Math.random() * 28,
          r: 26 - gs.cycle,
          pulse: 0,
        };
      }
    } else if (gs.phase === "attack") {
      gs.timer -= dt;
      if (gs.target) gs.target.pulse += dt * 5.5;
      if (gs.timer <= 0) {
        this._audio.sfx("miss");
        gs.floaters.push({
          x: gs.target?.x ?? CX,
          y: (gs.target?.y ?? 70) + 14,
          text: "MISS",
          vy: -28,
          life: 1.0,
          col: "rgba(255,255,255,.35)",
        });
        gs.msg = MISS_TAUNTS[gs.cycle % MISS_TAUNTS.length];
        gs.msgT = 1.8;
        this._nextPhase(gs, BX, BY, CX, CY);
      }
    }
  }

  _hitBone(b, h) {
    return (
      h.x + HS > b.x &&
      h.x - HS < b.x + b.w &&
      h.y + HS > b.y &&
      h.y - HS < b.y + b.h
    );
  }

  _hitPlayer(gs) {
    gs.playerHP--;
    gs.iframes = 1.1;
    this._audio.sfx("hit");
    gs.shakeX = (Math.random() - 0.5) * 20;
    gs.shakeY = (Math.random() - 0.5) * 20;
    gs.floaters.push({
      x: gs.heart.x,
      y: gs.heart.y - 18,
      text: "-1",
      vy: -52,
      life: 1.0,
      col: "#ff4444",
    });
    if (gs.playerHP <= 0) {
      gs.done = true;
      gs.result = "lose";
    }
  }

  _drawFight(ctx, W, H, gs, BX, BY, CX, CY) {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = C.BG;
    ctx.fillRect(0, 0, W, H);
    ctx.save();
    ctx.translate(gs.shakeX, gs.shakeY);

    const BOSS_Y = 58;

    // ── Boss ──────────────────────────────────────────────────
    const bob = Math.sin(gs.bossT * 1.9) * 3;
    const angry = gs.phase === "attack" || gs.bossHP <= 2;
    ctx.save();
    ctx.translate(CX, BOSS_Y + bob);
    if (gs.bossFlash > 0) {
      ctx.shadowColor = "#ffffff";
      ctx.shadowBlur = 38;
    } else if (angry) {
      ctx.shadowColor = "#4499ff";
      ctx.shadowBlur = 18;
    }
    const bsc = gs.bossFlash > 0 ? 1.12 : 1;
    ctx.scale(bsc * 1.32, bsc * 1.32); // scale up fight version vs dialogue icon
    this._drawBossIcon(ctx, 0, 0, angry);
    ctx.shadowBlur = 0;
    // Low HP cracks
    if (gs.bossHP <= 2) {
      ctx.strokeStyle = `rgba(0,0,0,${gs.bossHP === 1 ? 0.65 : 0.35})`;
      ctx.lineWidth = gs.bossHP === 1 ? 2 : 1.5;
      ctx.beginPath();
      ctx.moveTo(-5, -18);
      ctx.lineTo(2, -6);
      ctx.lineTo(-8, 4);
      ctx.stroke();
      if (gs.bossHP === 1) {
        ctx.beginPath();
        ctx.moveTo(8, -14);
        ctx.lineTo(3, -2);
        ctx.stroke();
      }
    }
    ctx.restore();

    // Boss HP — hearts sit below the skull, clearly separated
    const SH = 16,
      SG = 7;
    const bpW = BOSS_MAX_HP * (SH + SG) - SG;
    let bpX = CX - bpW / 2;
    const bpY = BOSS_Y + 50; // below the skull
    for (let i = 0; i < BOSS_MAX_HP; i++) {
      ctx.fillStyle = i < gs.bossHP ? "#ff3333" : "#220000";
      ctx.shadowColor = i < gs.bossHP ? "#ff3333" : "transparent";
      ctx.shadowBlur = i < gs.bossHP ? 7 : 0;
      ctx.beginPath();
      this._heartPath(ctx, bpX + SH * 0.5, bpY + SH * 0.45, SH * 0.42);
      ctx.fill();
      bpX += SH + SG;
    }
    ctx.shadowBlur = 0;

    // ── Battle box ────────────────────────────────────────────
    ctx.strokeStyle = C.WHITE;
    ctx.lineWidth = 3;
    ctx.strokeRect(BX, BY, BOX.W, BOX.H);

    if (gs.phase === "dodge") {
      // ── Warnings (bone telegraphs) ─────────────────────────
      const WARN_DUR = 0.68;
      ctx.save();
      ctx.beginPath();
      ctx.rect(BX, BY, BOX.W, BOX.H);
      ctx.clip();
      for (const w of gs.warnings) {
        const progress = 1 - Math.max(0, w.timer / WARN_DUR);
        // Pulse: flashes faster as the bone is about to arrive
        const pulseHz = 3 + progress * 9;
        const pulse =
          0.5 +
          0.5 *
            Math.abs(Math.sin((performance.now() / 1000) * Math.PI * pulseHz));
        const alpha =
          (0.14 + 0.16 * pulse) * (progress < 0.15 ? progress / 0.15 : 1);

        if (w.type === "h") {
          // Full horizontal lane warning
          const lineH = Math.max(w.h, 12);
          const gy = ctx.createLinearGradient(BX, w.y, BX, w.y + lineH);
          gy.addColorStop(0, `rgba(255,50,30,0)`);
          gy.addColorStop(0.3, `rgba(255,60,30,${alpha})`);
          gy.addColorStop(0.5, `rgba(255,80,50,${alpha * 1.6})`);
          gy.addColorStop(0.7, `rgba(255,60,30,${alpha})`);
          gy.addColorStop(1, `rgba(255,50,30,0)`);
          ctx.fillStyle = gy;
          ctx.fillRect(BX, w.y - 2, BOX.W, lineH + 4);
          // Entry arrow indicator
          const arrowX = w.fromLeft ? BX + 6 : BX + BOX.W - 6;
          ctx.fillStyle = `rgba(255,80,50,${alpha * 3.5})`;
          ctx.beginPath();
          if (w.fromLeft) {
            ctx.moveTo(arrowX, w.y + lineH / 2);
            ctx.lineTo(arrowX + 8, w.y + lineH / 2 - 6);
            ctx.lineTo(arrowX + 8, w.y + lineH / 2 + 6);
          } else {
            ctx.moveTo(arrowX, w.y + lineH / 2);
            ctx.lineTo(arrowX - 8, w.y + lineH / 2 - 6);
            ctx.lineTo(arrowX - 8, w.y + lineH / 2 + 6);
          }
          ctx.closePath();
          ctx.fill();
        } else if (w.type === "v") {
          // Full vertical lane warning
          const lineW = Math.max(w.w, 12);
          const gx = ctx.createLinearGradient(w.x, BY, w.x + lineW, BY);
          gx.addColorStop(0, `rgba(255,50,30,0)`);
          gx.addColorStop(0.3, `rgba(255,60,30,${alpha})`);
          gx.addColorStop(0.5, `rgba(255,80,50,${alpha * 1.6})`);
          gx.addColorStop(0.7, `rgba(255,60,30,${alpha})`);
          gx.addColorStop(1, `rgba(255,50,30,0)`);
          ctx.fillStyle = gx;
          ctx.fillRect(w.x - 2, BY, lineW + 4, BOX.H);
          // Entry arrow at top
          ctx.fillStyle = `rgba(255,80,50,${alpha * 3.5})`;
          ctx.beginPath();
          ctx.moveTo(w.x + lineW / 2, BY + 6);
          ctx.lineTo(w.x + lineW / 2 - 6, BY + 14);
          ctx.lineTo(w.x + lineW / 2 + 6, BY + 14);
          ctx.closePath();
          ctx.fill();
        } else if (w.type === "d") {
          // Diagonal: a red dot + faint diagonal line from corner
          const ex = w.bx < BX ? BX : BX + BOX.W;
          const ey = w.by < BY ? BY : BY + BOX.H;
          const len = Math.max(BOX.W, BOX.H);
          const angle = Math.atan2(w.vy, w.vx);
          ctx.strokeStyle = `rgba(255,60,30,${alpha * 1.2})`;
          ctx.lineWidth = 3;
          ctx.setLineDash([8, 8]);
          ctx.beginPath();
          ctx.moveTo(ex, ey);
          ctx.lineTo(ex + Math.cos(angle) * len, ey + Math.sin(angle) * len);
          ctx.stroke();
          ctx.setLineDash([]);
          // Corner diamond
          ctx.fillStyle = `rgba(255,80,50,${alpha * 3})`;
          ctx.save();
          ctx.translate(ex, ey);
          ctx.rotate(Math.PI / 4);
          ctx.fillRect(-6, -6, 12, 12);
          ctx.restore();
        }
      }
      ctx.restore();

      // Blasts + mini Gaster skull telegraphs
      // Outer clip: slightly larger than box to let skulls peek at edges
      const SK_W = 38,
        SK_H = 28;
      ctx.save();
      ctx.beginPath();
      ctx.rect(BX - SK_W, BY - SK_H, BOX.W + SK_W * 2, BOX.H + SK_H * 2);
      ctx.clip();
      for (const bl of gs.blasts) {
        const a = 0.08 + 0.07 * Math.sin(performance.now() / 75);
        const chargeP = bl.firing
          ? 1
          : 0.35 + 0.35 * Math.sin(performance.now() / 120);
        const skullA = bl.firing
          ? 1
          : 0.7 + 0.3 * Math.sin(performance.now() / 120);

        if (!bl.dir || bl.dir === "h") {
          // beam (clipped to box)
          ctx.save();
          ctx.beginPath();
          ctx.rect(BX, BY, BOX.W, BOX.H);
          ctx.clip();
          if (bl.firing) {
            ctx.fillStyle = "rgba(255,255,200,.9)";
            ctx.fillRect(BX, bl.y, BOX.W, bl.h);
          } else {
            ctx.fillStyle = `rgba(255,238,0,${a})`;
            ctx.fillRect(BX, bl.y, BOX.W, bl.h);
            ctx.fillStyle = `rgba(255,238,0,${a * 4})`;
            ctx.fillRect(BX, bl.y, 5, bl.h);
            ctx.fillRect(BX + BOX.W - 5, bl.y, 5, bl.h);
          }
          ctx.restore();
          // skull left edge
          ctx.save();
          ctx.globalAlpha = skullA;
          ctx.translate(BX - SK_W * 0.5, bl.y + bl.h / 2);
          this._drawGasterBlaster(ctx, SK_W, SK_H, chargeP, bl.firing, false);
          ctx.restore();
        } else if (bl.dir === "v") {
          // beam (clipped to box)
          ctx.save();
          ctx.beginPath();
          ctx.rect(BX, BY, BOX.W, BOX.H);
          ctx.clip();
          if (bl.firing) {
            ctx.fillStyle = "rgba(255,255,200,.9)";
            ctx.fillRect(bl.x, BY, bl.w, BOX.H);
          } else {
            ctx.fillStyle = `rgba(255,238,0,${a})`;
            ctx.fillRect(bl.x, BY, bl.w, BOX.H);
            ctx.fillStyle = `rgba(255,238,0,${a * 4})`;
            ctx.fillRect(bl.x, BY, bl.w, 5);
            ctx.fillRect(bl.x, BY + BOX.H - 5, bl.w, 5);
          }
          ctx.restore();
          // skull above column, rotated to face downward
          ctx.save();
          ctx.globalAlpha = skullA;
          ctx.translate(bl.x + bl.w / 2, BY - SK_H * 0.5);
          ctx.rotate(Math.PI / 2);
          this._drawGasterBlaster(ctx, SK_W, SK_H, chargeP, bl.firing, false);
          ctx.restore();
        } else if (bl.dir === "d") {
          // beam (clipped to box)
          ctx.save();
          ctx.beginPath();
          ctx.rect(BX, BY, BOX.W, BOX.H);
          ctx.clip();
          if (bl.firing) {
            ctx.strokeStyle = "rgba(255,255,200,.9)";
            ctx.shadowColor = "#ffffcc";
            ctx.shadowBlur = 20;
          } else {
            ctx.strokeStyle = `rgba(255,238,0,${a * 2.5})`;
            ctx.shadowColor = `rgba(255,238,0,${a * 4})`;
            ctx.shadowBlur = 8;
          }
          ctx.lineWidth = bl.thick;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(bl.x1, bl.y1);
          ctx.lineTo(bl.x2, bl.y2);
          ctx.stroke();
          ctx.shadowBlur = 0;
          ctx.restore();
          // skull at the starting corner, rotated along diagonal direction
          const angle = Math.atan2(bl.y2 - bl.y1, bl.x2 - bl.x1);
          ctx.save();
          ctx.globalAlpha = skullA;
          ctx.translate(bl.x1, bl.y1);
          ctx.rotate(angle);
          this._drawGasterBlaster(ctx, SK_W, SK_H, chargeP, bl.firing, false);
          ctx.restore();
        }
      }
      ctx.restore();

      // Bones
      for (const b of gs.bones) this._drawBone(ctx, b.x, b.y, b.w, b.h);

      // Heart (flicker when invincible)
      if (!(gs.iframes > 0 && Math.floor(performance.now() / 70) % 2 === 0)) {
        this._drawHeart(ctx, gs.heart.x, gs.heart.y);
      }

      // Countdown
      const tsec = Math.ceil(gs.timer);
      ctx.fillStyle = tsec <= 3 ? "#ff5555" : "rgba(255,255,255,.22)";
      ctx.font = `9px ${FONT}`;
      ctx.textAlign = "right";
      ctx.fillText(`${tsec}s`, BX + BOX.W - 5, BY - 7);
      ctx.textAlign = "left";
    } else if (gs.phase === "attack") {
      ctx.fillStyle = "rgba(0,0,0,.3)";
      ctx.fillRect(BX, BY, BOX.W, BOX.H);

      // Target
      if (gs.target) {
        const p = 0.72 + 0.28 * Math.sin(gs.target.pulse);
        const r = gs.target.r * p;
        ctx.beginPath();
        ctx.arc(gs.target.x, gs.target.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,0,${0.22 + 0.18 * p})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(255,255,0,${0.6 + 0.4 * p})`;
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.strokeStyle = `rgba(255,255,0,${0.4 + 0.3 * p})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(gs.target.x - r * 1.8, gs.target.y);
        ctx.lineTo(gs.target.x + r * 1.8, gs.target.y);
        ctx.moveTo(gs.target.x, gs.target.y - r * 1.8);
        ctx.lineTo(gs.target.x, gs.target.y + r * 1.8);
        ctx.stroke();
      }

      // Attack timer bar
      const p = gs.timer / this._attackTime(gs.cycle);
      ctx.fillStyle = "rgba(255,255,0,.08)";
      ctx.fillRect(BX, BY - 14, BOX.W, 6);
      ctx.globalAlpha = 0.55 + 0.2 * Math.sin(performance.now() / 160);
      ctx.fillStyle = p < 0.3 ? "#ff4444" : "#ffee00";
      ctx.fillRect(BX, BY - 14, BOX.W * p, 6);
      ctx.globalAlpha = 1;

      ctx.fillStyle = "rgba(255,255,0,.5)";
      ctx.font = `10px ${FONT}`;
      ctx.textAlign = "center";
      ctx.fillText("CLICK THE WEAK POINT", CX, CY + 6);
      ctx.textAlign = "left";
    }

    // ── Player HP ──────────────────────────────────────────────
    const PH = 20,
      PG = 6;
    const phW = PLAYER_MAX_HP * (PH + PG) - PG;
    let phX = CX - phW / 2;
    const phY = BY + BOX.H + 26;
    for (let i = 0; i < PLAYER_MAX_HP; i++) {
      ctx.fillStyle = i < gs.playerHP ? C.HEART : "#1c0000";
      ctx.shadowColor = i < gs.playerHP ? C.HEART : "transparent";
      ctx.shadowBlur = i < gs.playerHP ? 9 : 0;
      ctx.beginPath();
      this._heartPath(ctx, phX + PH * 0.5, phY + PH * 0.45, PH * 0.43);
      ctx.fill();
      phX += PH + PG;
    }
    ctx.shadowBlur = 0;

    // Round counter
    ctx.fillStyle = "rgba(255,255,255,.18)";
    ctx.font = `9px ${FONT}`;
    ctx.textAlign = "center";
    ctx.fillText(
      `ROUND ${gs.cycle + 1} / ${ROUNDS}  ·  ${gs.bossHP} HP`,
      CX,
      phY + 28,
    );

    // Boss message
    if (gs.msgT > 0 && gs.msg) {
      const a = Math.min(1, gs.msgT * 2);
      ctx.fillStyle = `rgba(255,255,255,${a * 0.7})`;
      ctx.font = `10px ${FONT}`;
      ctx.textAlign = "center";
      ctx.fillText(gs.msg, CX, BY - 26);
    }
    ctx.textAlign = "left";

    // Floaters
    for (const f of gs.floaters) {
      ctx.globalAlpha = Math.min(1, f.life * 1.6);
      ctx.fillStyle = f.col;
      ctx.font = `bold 14px ${FONT}`;
      ctx.textAlign = "center";
      ctx.fillText(f.text, f.x, f.y);
      ctx.globalAlpha = 1;
    }
    ctx.textAlign = "left";

    // Controls hint
    if (gs.bossT < 4 && gs.phase === "dodge") {
      const a = Math.max(0, 1 - gs.bossT / 3) * 0.28;
      ctx.fillStyle = `rgba(255,255,255,${a})`;
      ctx.font = `8px ${FONT}`;
      ctx.textAlign = "center";
      ctx.fillText("ARROW KEYS / WASD  ·  DODGE THE BONES", CX, H - 12);
      ctx.textAlign = "left";
    }

    ctx.restore();
  }

  // ── Draw helpers ───────────────────────────────────────────────
  _drawHeart(ctx, x, y) {
    ctx.fillStyle = C.HEART;
    ctx.shadowColor = C.HEART;
    ctx.shadowBlur = 16;
    ctx.beginPath();
    this._heartPath(ctx, x, y, HS);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  _heartPath(ctx, x, y, r) {
    const top = y - r * 0.35;
    ctx.moveTo(x, y + r);
    ctx.bezierCurveTo(
      x - r * 0.1,
      y + r * 0.55,
      x - r * 1.3,
      y + r * 0.1,
      x - r,
      top,
    );
    ctx.bezierCurveTo(
      x - r * 1.3,
      y - r * 0.8,
      x,
      y - r * 0.45,
      x,
      top - r * 0.12,
    );
    ctx.bezierCurveTo(x, y - r * 0.45, x + r * 1.3, y - r * 0.8, x + r, top);
    ctx.bezierCurveTo(
      x + r * 1.3,
      y + r * 0.1,
      x + r * 0.1,
      y + r * 0.55,
      x,
      y + r,
    );
  }

  _drawBone(ctx, x, y, w, h) {
    const r = Math.min(w, h) * 0.45;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, w, h, r);
    else {
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }
    ctx.fillStyle = C.BONE;
    ctx.shadowColor = "rgba(255,255,255,.28)";
    ctx.shadowBlur = 5;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // ══════════════════════════════════════════════════════════════
  //  WIN ENDING SEQUENCE — laser → heartbreak → refused → win
  //  One persistent canvas; heart never disappears once visible.
  // ══════════════════════════════════════════════════════════════
  async _winEndingSequence() {
    this._clear();

    // One persistent canvas: laser wall -> heart appears -> cracks (stays visible)
    // -> text types in (heart cracked) -> heart reforms -> gold cutscene
    const W = Math.min(window.innerWidth, 760);
    const H = Math.min(window.innerHeight, 560);
    const WF = window.innerWidth,
      HF = window.innerHeight;
    const CX = W / 2,
      CY = H / 2 + 20;
    const BX = CX - BOX.W / 2,
      BY = CY - BOX.H / 2;
    const HX = CX,
      HY = CY; // heart center = battle box center

    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    Object.assign(canvas.style, {
      display: "block",
      imageRendering: "pixelated",
    });
    const ui = document.createElement("div");
    Object.assign(ui.style, {
      position: "absolute",
      inset: "0",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "none",
    });
    this._overlay.appendChild(canvas);
    this._overlay.appendChild(ui);
    const ctx = canvas.getContext("2d");

    const drawScene = () => {
      ctx.fillStyle = C.BG;
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = C.WHITE;
      ctx.lineWidth = 3;
      ctx.strokeRect(BX, BY, BOX.W, BOX.H);
      ctx.save();
      ctx.globalAlpha = 0.25;
      ctx.translate(CX, BY - 52);
      ctx.scale(1.32, 1.32);
      this._drawBossIcon(ctx, 0, 0, true);
      ctx.restore();
    };

    // PHASE 1: LASER WALL
    const N = 4,
      BS_W = 70,
      BS_H = 48;
    const laserY = Array.from(
      { length: N },
      (_, i) => BY + (BOX.H * (i + 0.5)) / N,
    );
    let t = 0,
      last = performance.now(),
      chargeStarted = false;
    let lPhase = "appear";
    const APPEAR = 0.55,
      CHARGE = 1.8,
      FIRE = 0.08,
      FLASH = 0.5;

    await this._wait(320);
    if (!this._running) return;

    await new Promise((resolve) => {
      const loop = (now) => {
        if (!this._running) {
          resolve();
          return;
        }
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        t += dt;
        drawScene();
        if (lPhase === "appear") {
          const p = Math.min(t / APPEAR, 1);
          this._drawBoxLasers(ctx, laserY, p, 0, BX, BY, BS_W, BS_H, false);
          this._drawPixelHeart(ctx, HX, HY, 14, 1);
          if (p >= 1) {
            lPhase = "charge";
            t = 0;
          }
        } else if (lPhase === "charge") {
          if (!chargeStarted) {
            this._audio.sfx("laserCharge");
            chargeStarted = true;
          }
          const p = Math.min(t / CHARGE, 1);
          this._drawBoxLasers(ctx, laserY, 1, p, BX, BY, BS_W, BS_H, false);
          for (const y of laserY) {
            ctx.fillStyle = `rgba(255,255,160,${p * 0.3})`;
            ctx.fillRect(BX + 1, y - 4, BOX.W - 2, 8);
          }
          this._drawPixelHeart(ctx, HX, HY, 14, 1 - p * 0.35);
          if (p >= 1) {
            lPhase = "fire";
            t = 0;
            this._audio.sfx("laserFire");
          }
        } else if (lPhase === "fire") {
          const p = Math.min(t / FIRE, 1);
          this._drawBoxLasers(ctx, laserY, 1, 1, BX, BY, BS_W, BS_H, true);
          for (const y of laserY) {
            const bh = 18;
            const g = ctx.createLinearGradient(BX, y - bh / 2, BX, y + bh / 2);
            g.addColorStop(0, "rgba(255,255,220,0)");
            g.addColorStop(0.4, "rgba(255,255,200,.96)");
            g.addColorStop(0.5, "rgba(255,255,255,1)");
            g.addColorStop(0.6, "rgba(255,255,200,.96)");
            g.addColorStop(1, "rgba(255,255,220,0)");
            ctx.fillStyle = g;
            ctx.fillRect(BX, y - bh / 2, BOX.W, bh);
          }
          this._drawPixelHeart(ctx, HX, HY, 14, Math.max(0, 1 - p * 4));
          if (p >= 1) {
            lPhase = "flash";
            t = 0;
          }
        } else if (lPhase === "flash") {
          const p = Math.min(t / FLASH, 1);
          ctx.fillStyle = `rgba(255,255,255,${1 - p})`;
          ctx.fillRect(0, 0, W, H);
          if (p >= 1) {
            resolve();
            return;
          }
        }
        this._animId = requestAnimationFrame(loop);
      };
      this._animId = requestAnimationFrame(loop);
    });
    if (!this._running) return;

    // PHASE 2: HEART APPEARS
    const PS = 10;
    t = 0;
    last = performance.now();
    await new Promise((resolve) => {
      const loop = (now) => {
        if (!this._running) {
          resolve();
          return;
        }
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        t += dt;
        const p = Math.min(t / 0.55, 1);
        drawScene();
        ctx.shadowColor = C.HEART;
        ctx.shadowBlur = 18 * p;
        this._drawPixelHeart(ctx, HX, HY, PS, p);
        ctx.shadowBlur = 0;
        if (p >= 1) {
          resolve();
          return;
        }
        this._animId = requestAnimationFrame(loop);
      };
      this._animId = requestAnimationFrame(loop);
    });
    if (!this._running) return;

    t = 0;
    last = performance.now();
    await new Promise((resolve) => {
      const loop = (now) => {
        if (!this._running) {
          resolve();
          return;
        }
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        t += dt;
        drawScene();
        ctx.shadowColor = C.HEART;
        ctx.shadowBlur = 20 + Math.sin(t * 6) * 6;
        this._drawPixelHeart(ctx, HX, HY, PS, 1);
        ctx.shadowBlur = 0;
        if (t >= 0.5) {
          resolve();
          return;
        }
        this._animId = requestAnimationFrame(loop);
      };
      this._animId = requestAnimationFrame(loop);
    });
    if (!this._running) return;

    // PHASE 3: CRACK -> SPLIT (halves stay fully visible, no fading)
    const FINAL_GAP = PS * 3.5;
    const P_CRACK = 0.7,
      P_SHAKE = 0.45,
      P_SPLIT = 0.65;
    t = 0;
    last = performance.now();
    let crackSfxDone = false,
      breakSfxDone = false;

    const drawHalves = (lx, rx, yOff, alpha) => {
      ctx.shadowColor = C.HEART;
      ctx.shadowBlur = 12;
      this._drawPixelHalfHeart(ctx, "L", lx, HY + yOff, PS, alpha);
      this._drawPixelHalfHeart(ctx, "R", rx, HY + yOff, PS, alpha);
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(0,0,0,0.85)";
      ctx.fillRect(HX - 1, HY - 4.5 * PS + yOff, 2, 9 * PS);
    };

    await new Promise((resolve) => {
      const loop = (now) => {
        if (!this._running) {
          resolve();
          return;
        }
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        t += dt;
        drawScene();
        if (t < P_CRACK) {
          const p = t / P_CRACK;
          if (!crackSfxDone && p > 0.25) {
            this._audio.sfx("heartCrack");
            crackSfxDone = true;
          }
          const gap = p * PS * 0.6;
          ctx.shadowColor = C.HEART;
          ctx.shadowBlur = 16;
          this._drawPixelHalfHeart(ctx, "L", HX - gap / 2, HY, PS, 1);
          this._drawPixelHalfHeart(ctx, "R", HX + gap / 2, HY, PS, 1);
          ctx.shadowBlur = 0;
          if (p > 0.2) {
            ctx.fillStyle = `rgba(0,0,0,${Math.min(1, (p - 0.2) / 0.4) * 0.85})`;
            ctx.fillRect(HX - 1, HY - 4.5 * PS, 2, 9 * PS);
          }
        } else if (t < P_CRACK + P_SHAKE) {
          const p = (t - P_CRACK) / P_SHAKE;
          const shk = (1 - p) * PS * 0.85;
          const sx = (Math.random() - 0.5) * shk * 2,
            sy = (Math.random() - 0.5) * shk;
          drawHalves(HX - PS * 0.3 + sx, HX + PS * 0.3 + sx, sy, 1);
        } else {
          const p = Math.min((t - P_CRACK - P_SHAKE) / P_SPLIT, 1);
          if (!breakSfxDone) {
            this._audio.sfx("heartBreak");
            breakSfxDone = true;
          }
          const ease = 1 - Math.pow(1 - p, 2);
          const gap = PS * 0.6 + (FINAL_GAP - PS * 0.6) * ease;
          drawHalves(HX - gap / 2, HX + gap / 2, 0, 1);
          if (p >= 1) {
            resolve();
            return;
          }
        }
        this._animId = requestAnimationFrame(loop);
      };
      this._animId = requestAnimationFrame(loop);
    });
    if (!this._running) return;

    // PHASE 4: TEXT TYPES IN — heart stays cracked the whole time
    let keepHolding = true;
    const holdCracked = () => {
      if (!this._running || !keepHolding) return;
      drawScene();
      drawHalves(HX - FINAL_GAP / 2, HX + FINAL_GAP / 2, 0, 1);
      this._animId = requestAnimationFrame(holdCracked);
    };
    this._animId = requestAnimationFrame(holdCracked);

    const textEl = document.createElement("div");
    Object.assign(textEl.style, {
      fontFamily: FONT,
      fontSize: "clamp(12px,2vw,20px)",
      color: C.WHITE,
      letterSpacing: ".04em",
      opacity: "0",
      marginBottom: "120px",
    });
    textEl.textContent = "";
    ui.appendChild(textEl);

    await this._wait(400);
    if (!this._running) return;
    textEl.style.opacity = "1";
    await this._type(textEl, "* But it refused.", 52);
    await this._wait(900);
    if (!this._running) return;
    keepHolding = false;

    // PHASE 5: REFORM — halves converge, snap together
    t = 0;
    last = performance.now();
    let snapSfx = false;
    const REFORM_DUR = 0.65,
      SNAP_AT = 0.75;

    await new Promise((resolve) => {
      const loop = (now) => {
        if (!this._running) {
          resolve();
          return;
        }
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        t += dt;
        const p = Math.min(t / REFORM_DUR, 1);
        drawScene();
        if (p < SNAP_AT) {
          const ease = 1 - Math.pow(1 - p / SNAP_AT, 2);
          const gap = FINAL_GAP * (1 - ease);
          ctx.shadowColor = C.HEART;
          ctx.shadowBlur = 10 + ease * 16;
          this._drawPixelHalfHeart(ctx, "L", HX - gap / 2, HY, PS, 1);
          this._drawPixelHalfHeart(ctx, "R", HX + gap / 2, HY, PS, 1);
          ctx.shadowBlur = 0;
          if (gap > 1) {
            ctx.fillStyle = `rgba(0,0,0,${0.85 * (1 - ease)})`;
            ctx.fillRect(HX - 1, HY - 4.5 * PS, 2, 9 * PS);
          }
        } else {
          const sp = (p - SNAP_AT) / (1 - SNAP_AT);
          const flashA = Math.max(0, 1 - sp * 2.2);
          if (!snapSfx) {
            this._audio.sfx("determination");
            snapSfx = true;
          }
          ctx.shadowColor = C.HEART;
          ctx.shadowBlur = 14 + flashA * 28;
          this._drawPixelHeart(ctx, HX, HY, PS, 1);
          ctx.shadowBlur = 0;
          if (flashA > 0) {
            ctx.beginPath();
            ctx.arc(HX, HY, sp * PS * 20, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255,255,255,${flashA})`;
            ctx.lineWidth = 4;
            ctx.stroke();
          }
        }
        if (p >= 1) {
          resolve();
          return;
        }
        this._animId = requestAnimationFrame(loop);
      };
      this._animId = requestAnimationFrame(loop);
    });
    if (!this._running) return;

    // PHASE 6: WIN CUTSCENE — full screen, heart beats in the gold burst
    this._clear();
    const canvas2 = document.createElement("canvas");
    canvas2.width = WF;
    canvas2.height = HF;
    Object.assign(canvas2.style, {
      position: "absolute",
      inset: "0",
      display: "block",
    });
    const ui2 = document.createElement("div");
    Object.assign(ui2.style, {
      position: "absolute",
      inset: "0",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "none",
      gap: "12px",
    });
    this._overlay.appendChild(canvas2);
    this._overlay.appendChild(ui2);
    const ctx2 = canvas2.getContext("2d");
    const GCX = WF / 2,
      GCY = HF / 2;

    const mkLbl = (text, size, color, shadow) => {
      const el = document.createElement("div");
      el.textContent = text;
      Object.assign(el.style, {
        fontSize: size,
        fontFamily: FONT,
        color,
        letterSpacing: ".22em",
        textShadow: shadow,
        opacity: "0",
        transition: "opacity 1.3s ease",
      });
      return el;
    };
    const badge = mkLbl(
      "\u2696",
      "clamp(40px,7vw,60px)",
      "#ffd700",
      "0 0 28px #ffd700, 0 0 65px rgba(255,215,0,.5)",
    );
    const titleEl = mkLbl(
      "DETERMINATION",
      "clamp(16px,3vw,34px)",
      "#ffd700",
      "0 0 22px #ffd700, 0 0 55px rgba(255,215,0,.4)",
    );
    const labelEl = mkLbl(
      "The Judgement",
      "clamp(10px,1.5vw,18px)",
      "rgba(255,215,0,.65)",
      "",
    );
    const oddsEl = mkLbl(
      "1 / 1,000,000",
      "clamp(8px,1.2vw,13px)",
      "rgba(255,215,0,.38)",
      "",
    );
    [badge, titleEl, labelEl, oddsEl].forEach((el) => ui2.appendChild(el));

    const pts = Array.from({ length: 320 }, () => this._winPt(GCX, GCY));
    t = 0;
    last = performance.now();
    const tid = setTimeout(
      () =>
        [badge, titleEl, labelEl, oddsEl].forEach((el, i) =>
          setTimeout(() => {
            el.style.opacity = "1";
          }, i * 310),
        ),
      380,
    );
    this._timers.push(tid);

    await new Promise((resolve) => {
      const loop = (now) => {
        if (!this._running) {
          resolve();
          return;
        }
        const dt = (now - last) / 1000;
        last = now;
        t += dt;
        const p = Math.min(t / 7.0, 1);
        ctx2.fillStyle = "#030200";
        ctx2.fillRect(0, 0, WF, HF);
        const gr = ctx2.createRadialGradient(
          GCX,
          GCY,
          0,
          GCX,
          GCY,
          550 + p * 180,
        );
        gr.addColorStop(
          0,
          `rgba(255,215,0,${0.14 + 0.07 * Math.sin(t * 1.3)})`,
        );
        gr.addColorStop(
          0.55,
          `rgba(255,100,0,${0.04 * Math.abs(Math.sin(t + 0.8))})`,
        );
        gr.addColorStop(1, "transparent");
        ctx2.fillStyle = gr;
        ctx2.fillRect(0, 0, WF, HF);
        for (let i = 0; i < 14; i++) {
          const ang = (i / 14) * Math.PI * 2 + t * 0.07;
          const len = 380 + Math.sin(t * 0.8 + i) * 110;
          ctx2.beginPath();
          ctx2.moveTo(GCX, GCY);
          ctx2.lineTo(GCX + Math.cos(ang) * len, GCY + Math.sin(ang) * len);
          ctx2.strokeStyle = `rgba(255,215,0,${0.055 + 0.025 * Math.sin(t + i)})`;
          ctx2.lineWidth = 20;
          ctx2.stroke();
        }
        for (const pt of pts) {
          pt.x += pt.vx * dt;
          pt.y += pt.vy * dt;
          pt.vx *= 0.982;
          pt.vy *= 0.982;
          pt.life -= dt;
          if (pt.life <= 0)
            Object.assign(
              pt,
              this._winPt(
                GCX + (Math.random() - 0.5) * 55,
                GCY + (Math.random() - 0.5) * 55,
              ),
            );
          ctx2.globalAlpha =
            Math.max(0, pt.life / pt.maxLife) * (0.5 + p * 0.5);
          ctx2.fillStyle = pt.col;
          ctx2.beginPath();
          ctx2.arc(pt.x, pt.y, pt.sz, 0, Math.PI * 2);
          ctx2.fill();
        }
        ctx2.globalAlpha = 1;
        const cr = 75 + Math.sin(t * 2.6) * 24;
        const cg = ctx2.createRadialGradient(GCX, GCY, 0, GCX, GCY, cr);
        cg.addColorStop(
          0,
          `rgba(255,245,190,${0.38 + 0.14 * Math.sin(t * 4)})`,
        );
        cg.addColorStop(0.45, "rgba(255,215,0,.15)");
        cg.addColorStop(1, "transparent");
        ctx2.fillStyle = cg;
        ctx2.beginPath();
        ctx2.arc(GCX, GCY, cr, 0, Math.PI * 2);
        ctx2.fill();
        ctx2.shadowColor = C.HEART;
        ctx2.shadowBlur = 20 + Math.sin(t * 3) * 8;
        this._drawPixelHeart(ctx2, GCX, GCY, PS, 0.8 + 0.2 * Math.sin(t * 3));
        ctx2.shadowBlur = 0;
        if (p >= 1) {
          resolve();
          return;
        }
        this._animId = requestAnimationFrame(loop);
      };
      this._animId = requestAnimationFrame(loop);
    });
  }

  // ══════════════════════════════════════════════════════════════
  //  LASER WALL — fires inside the battle box at the heart
  // ══════════════════════════════════════════════════════════════
  async _laserWallDeath() {
    this._clear();

    // Match the fight layout exactly
    const W = Math.min(window.innerWidth, 760);
    const H = Math.min(window.innerHeight, 560);
    const CX = W / 2,
      CY = H / 2 + 20;
    const BX = CX - BOX.W / 2,
      BY = CY - BOX.H / 2;

    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    Object.assign(canvas.style, {
      display: "block",
      imageRendering: "pixelated",
    });
    this._overlay.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    // Blasters scaled to fit BOX height — 4 pairs, evenly spaced inside the box
    const N = 4;
    const BS_W = 70,
      BS_H = 48;
    const positions = Array.from(
      { length: N },
      (_, i) => BY + (BOX.H * (i + 0.5)) / N,
    );

    // Heart sitting in center of box
    const heartX = CX,
      heartY = CY;

    let phase = "idle"; // idle → appear → charge → fire → flash → black
    let t = 0,
      last = performance.now();
    let chargeStarted = false;

    // Short "freeze" before blasters slide in
    await this._wait(320);
    phase = "appear";

    const APPEAR_DUR = 0.55;
    const CHARGE_DUR = 1.8;
    const FIRE_DUR = 0.08;
    const FLASH_DUR = 0.5;
    const BLACK_DUR = 0.5;

    await new Promise((resolve) => {
      const loop = (now) => {
        if (!this._running) {
          resolve();
          return;
        }
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        t += dt;

        // Draw background + box at all times
        ctx.fillStyle = C.BG;
        ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = C.WHITE;
        ctx.lineWidth = 3;
        ctx.strokeRect(BX, BY, BOX.W, BOX.H);

        // Boss skull (dim, frozen above box)
        ctx.save();
        ctx.globalAlpha = 0.35;
        ctx.translate(CX, BY - 52);
        ctx.scale(1.32, 1.32);
        this._drawBossIcon(ctx, 0, 0, true);
        ctx.restore();

        if (phase === "appear") {
          const p = Math.min(t / APPEAR_DUR, 1);
          this._drawBoxLasers(ctx, positions, p, 0, BX, BY, BS_W, BS_H, false);
          // Heart still visible
          this._drawPixelHeart(ctx, heartX, heartY, 14, 1);
          if (p >= 1) {
            phase = "charge";
            t = 0;
          }
        } else if (phase === "charge") {
          if (!chargeStarted) {
            this._audio.sfx("laserCharge");
            chargeStarted = true;
          }
          const p = Math.min(t / CHARGE_DUR, 1);
          this._drawBoxLasers(ctx, positions, 1, p, BX, BY, BS_W, BS_H, false);
          // Warning lanes inside box
          for (const y of positions) {
            const a = p * 0.3;
            ctx.fillStyle = `rgba(255,255,160,${a})`;
            ctx.fillRect(BX + 1, y - 4, BOX.W - 2, 8);
          }
          this._drawPixelHeart(ctx, heartX, heartY, 14, 1 - p * 0.3);
          if (p >= 1) {
            phase = "fire";
            t = 0;
            this._audio.sfx("laserFire");
          }
        } else if (phase === "fire") {
          const p = Math.min(t / FIRE_DUR, 1);
          this._drawBoxLasers(ctx, positions, 1, 1, BX, BY, BS_W, BS_H, true);
          // Bright beams across the full box width
          for (const y of positions) {
            const bh = 18;
            const g = ctx.createLinearGradient(BX, y - bh / 2, BX, y + bh / 2);
            g.addColorStop(0, "rgba(255,255,220,0)");
            g.addColorStop(0.4, "rgba(255,255,200,.96)");
            g.addColorStop(0.5, "rgba(255,255,255,1)");
            g.addColorStop(0.6, "rgba(255,255,200,.96)");
            g.addColorStop(1, "rgba(255,255,220,0)");
            ctx.fillStyle = g;
            ctx.fillRect(BX, y - bh / 2, BOX.W, bh);
          }
          // Heart fading under fire
          const ha = Math.max(0, 1 - p * 3);
          this._drawPixelHeart(ctx, heartX, heartY, 14, ha);
          if (p >= 1) {
            phase = "flash";
            t = 0;
          }
        } else if (phase === "flash") {
          const p = Math.min(t / FLASH_DUR, 1);
          // White flash that fills entire screen then fades
          ctx.fillStyle = `rgba(255,255,255,${1 - p})`;
          ctx.fillRect(0, 0, W, H);
          if (p >= 1) {
            phase = "black";
            t = 0;
          }
        } else if (phase === "black") {
          const p = Math.min(t / BLACK_DUR, 1);
          ctx.fillStyle = `rgba(0,0,0,${p})`;
          ctx.fillRect(0, 0, W, H);
          if (p >= 1) {
            resolve();
            return;
          }
        }

        this._animId = requestAnimationFrame(loop);
      };
      this._animId = requestAnimationFrame(loop);
    });
  }

  // Blasters docked at left/right edges of the battle box
  _drawBoxLasers(ctx, positions, slideP, chargeP, BX, BY, BS_W, BS_H, firing) {
    const ease = slideP < 1 ? slideP * slideP * (3 - 2 * slideP) : 1; // smoothstep

    for (const y of positions) {
      // Single blaster slides in from left edge of box
      const lx = BX - BS_W + (BS_W + 4) * ease;
      ctx.save();
      ctx.translate(lx, y);
      this._drawGasterBlaster(ctx, BS_W, BS_H, chargeP, firing, false);
      ctx.restore();
    }
  }

  _drawGasterBlaster(ctx, w, h, chargeP, firing, _flipped) {
    const hw = w / 2,
      hh = h / 2;
    // Body (elongated skull)
    ctx.fillStyle = firing
      ? "#ffffff"
      : `rgb(${Math.floor(chargeP * 40)},${Math.floor(chargeP * 40)},${Math.floor(chargeP * 40)})`;
    // or just white-ish
    ctx.fillStyle = firing ? "#ffffff" : `hsl(0,0%,${15 + chargeP * 30}%)`;
    ctx.shadowColor = firing ? "#ffffff" : `rgba(255,255,180,${chargeP * 0.9})`;
    ctx.shadowBlur = firing ? 40 : chargeP * 30;
    ctx.beginPath();
    ctx.ellipse(-hw * 0.15, 0, hw * 0.9, hh * 0.82, 0, 0, Math.PI * 2);
    ctx.fill();
    // Jaw
    ctx.fillStyle = "#000000";
    ctx.fillRect(-hw * 0.6, hh * 0.2, hw * 1.4, hh * 0.5);
    ctx.fillStyle = firing ? "#ffffff" : `hsl(0,0%,${15 + chargeP * 30}%)`;
    ctx.fillRect(-hw * 0.6, hh * 0.12, hw * 1.4, hh * 0.2);
    // Teeth
    for (let i = -2; i <= 2; i++) {
      ctx.fillRect(-hw * 0.55 + i * hw * 0.25, hh * 0.32, hw * 0.18, hh * 0.3);
    }
    // Eyes: glow more as charging
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.ellipse(-hw * 0.42, -hh * 0.08, hw * 0.22, hh * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(hw * 0.08, -hh * 0.08, hw * 0.22, hh * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();
    const eyeColor = firing
      ? "#ffffff"
      : `rgba(255,255,${Math.floor(200 - chargeP * 200)},${0.3 + chargeP * 0.7})`;
    ctx.fillStyle = eyeColor;
    ctx.shadowColor = eyeColor;
    ctx.shadowBlur = 6 + chargeP * 20;
    ctx.beginPath();
    ctx.arc(-hw * 0.42, -hh * 0.08, hw * 0.11, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(hw * 0.08, -hh * 0.08, hw * 0.11, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // ══════════════════════════════════════════════════════════════
  //  PIXEL HEART HELPER  (Undertale-style 8-bit heart)
  // ══════════════════════════════════════════════════════════════
  // grid is 10 cols × 8 rows; each cell = size px
  _drawPixelHeart(ctx, cx, cy, size, alpha, color) {
    const G = [
      [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
    ];
    const cols = G[0].length,
      rows = G.length;
    const ox = cx - (cols * size) / 2,
      oy = cy - (rows * size) / 2;
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.fillStyle = color ?? C.HEART;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (G[r][c]) ctx.fillRect(ox + c * size, oy + r * size, size, size);
      }
    }
    ctx.restore();
  }

  // Draw only left half (cols 0-4) or right half (cols 5-9) of pixel heart
  _drawPixelHalfHeart(ctx, side, cx, cy, size, alpha, color) {
    const G = [
      [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
    ];
    const cols = G[0].length,
      rows = G.length;
    const ox = cx - (cols * size) / 2,
      oy = cy - (rows * size) / 2;
    const cStart = side === "L" ? 0 : 5;
    const cEnd = side === "L" ? 5 : 10;
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.fillStyle = color ?? C.HEART;
    for (let r = 0; r < rows; r++) {
      for (let c = cStart; c < cEnd; c++) {
        if (G[r][c]) ctx.fillRect(ox + c * size, oy + r * size, size, size);
      }
    }
    ctx.restore();
  }

  // ══════════════════════════════════════════════════════════════
  //  HEARTBREAK  (pixel art, matching Undertale reference)
  // ══════════════════════════════════════════════════════════════
  async _heartBreak() {
    this._clear();
    const W = window.innerWidth,
      H = window.innerHeight;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    Object.assign(canvas.style, {
      display: "block",
      imageRendering: "pixelated",
    });
    this._overlay.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const CX = W / 2,
      CY = H / 2;
    const PS = 10; // pixel size — large so it reads as 8-bit

    // Phase timestamps (seconds)
    const P_APPEAR = 0.5;
    const P_HOLD = 0.4;
    const P_CRACK = 0.7;
    const P_SHAKE = 0.45;
    const P_SPLIT = 0.9;
    const TOTAL = P_APPEAR + P_HOLD + P_CRACK + P_SHAKE + P_SPLIT;

    let t = 0,
      last = performance.now();
    let crackSfxDone = false,
      breakSfxDone = false;

    // Half positions (animated during split)
    const L = { ox: 0, oy: 0, vy: 0 };
    const R = { ox: 0, oy: 0, vy: 0 };

    await new Promise((resolve) => {
      const loop = (now) => {
        if (!this._running) {
          resolve();
          return;
        }
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        t += dt;

        ctx.fillStyle = C.BG;
        ctx.fillRect(0, 0, W, H);

        if (t < P_APPEAR) {
          // Appear with fade
          const p = t / P_APPEAR;
          ctx.shadowColor = C.HEART;
          ctx.shadowBlur = 18 * p;
          this._drawPixelHeart(ctx, CX, CY, PS, p);
          ctx.shadowBlur = 0;
        } else if (t < P_APPEAR + P_HOLD) {
          // Full heart, brief glow
          const p = (t - P_APPEAR) / P_HOLD;
          ctx.shadowColor = C.HEART;
          ctx.shadowBlur = 18 + p * 8;
          this._drawPixelHeart(ctx, CX, CY, PS, 1);
          ctx.shadowBlur = 0;
        } else if (t < P_APPEAR + P_HOLD + P_CRACK) {
          // Crack grows — gap between halves widens slightly
          const p = (t - P_APPEAR - P_HOLD) / P_CRACK;
          if (!crackSfxDone && p > 0.2) {
            this._audio.sfx("heartCrack");
            crackSfxDone = true;
          }
          const gap = p * PS * 0.8; // gap in pixels between left and right half
          ctx.shadowColor = C.HEART;
          ctx.shadowBlur = 16;
          this._drawPixelHalfHeart(ctx, "L", CX - gap / 2, CY, PS, 1);
          this._drawPixelHalfHeart(ctx, "R", CX + gap / 2, CY, PS, 1);
          ctx.shadowBlur = 0;
          // Dark crack line
          if (p > 0.15) {
            const a = Math.min(1, (p - 0.15) / 0.4);
            ctx.fillStyle = `rgba(0,0,0,${a * 0.8})`;
            ctx.fillRect(CX - 1, CY - 4.5 * PS, 2, 9 * PS);
          }
        } else if (t < P_APPEAR + P_HOLD + P_CRACK + P_SHAKE) {
          // Violent shake, crack fully visible
          const p = (t - P_APPEAR - P_HOLD - P_CRACK) / P_SHAKE;
          const shk = (1 - p) * PS * 0.9;
          const sx = (Math.random() - 0.5) * shk * 2;
          const sy = (Math.random() - 0.5) * shk;
          const gap = PS * 0.8;
          ctx.shadowColor = C.HEART;
          ctx.shadowBlur = 22;
          this._drawPixelHalfHeart(ctx, "L", CX - gap / 2 + sx, CY + sy, PS, 1);
          this._drawPixelHalfHeart(ctx, "R", CX + gap / 2 + sx, CY + sy, PS, 1);
          ctx.shadowBlur = 0;
          ctx.fillStyle = "rgba(0,0,0,.75)";
          ctx.fillRect(CX - 1 + sx, CY - 4.5 * PS + sy, 2, 9 * PS);
        } else {
          // Split — halves fly apart and fall
          const p = Math.min(
            (t - P_APPEAR - P_HOLD - P_CRACK - P_SHAKE) / P_SPLIT,
            1,
          );
          if (!breakSfxDone) {
            this._audio.sfx("heartBreak");
            breakSfxDone = true;
          }

          const ease = p * p; // accelerate
          L.ox = -ease * PS * 14;
          R.ox = ease * PS * 14;
          const fallY = ease * PS * 6;

          const alpha = Math.max(0, 1 - p * 1.1);
          ctx.shadowColor = C.HEART;
          ctx.shadowBlur = 14 * (1 - p);
          this._drawPixelHalfHeart(ctx, "L", CX + L.ox, CY + fallY, PS, alpha);
          this._drawPixelHalfHeart(ctx, "R", CX + R.ox, CY + fallY, PS, alpha);
          ctx.shadowBlur = 0;

          if (p >= 1) {
            resolve();
            return;
          }
        }

        this._animId = requestAnimationFrame(loop);
      };
      this._animId = requestAnimationFrame(loop);
    });

    await this._wait(200);
  }

  // ══════════════════════════════════════════════════════════════
  //  "* BUT IT REFUSED."  →  HEART REFORMS  →  AURA
  // ══════════════════════════════════════════════════════════════
  async _refusedScreen() {
    this._clear();
    const W = window.innerWidth,
      H = window.innerHeight;
    const PS = 6; // smaller pixel size for the "refused" heart icon
    const PS_REFORM = 10; // larger for reform animation

    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    Object.assign(canvas.style, {
      position: "absolute",
      inset: "0",
      display: "block",
      imageRendering: "pixelated",
    });
    const ui = document.createElement("div");
    Object.assign(ui.style, {
      position: "absolute",
      inset: "0",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "none",
    });
    this._overlay.appendChild(canvas);
    this._overlay.appendChild(ui);
    const ctx = canvas.getContext("2d");
    const CX = W / 2,
      CY = H / 2;

    // ── "* But it refused." text  ─────────────────────────────
    const textEl = document.createElement("div");
    Object.assign(textEl.style, {
      fontFamily: FONT,
      fontSize: "clamp(12px,2vw,20px)",
      color: C.WHITE,
      letterSpacing: ".04em",
      opacity: "0",
      marginBottom: "64px",
      transition: "opacity .01s", // we'll typewrite it manually
    });
    textEl.textContent = "";
    ui.appendChild(textEl);

    // Small heart placeholder (canvas-drawn, below text)
    const heartCanvas = document.createElement("canvas");
    heartCanvas.width = PS * 10 + 20;
    heartCanvas.height = PS * 8 + 20;
    Object.assign(heartCanvas.style, {
      imageRendering: "pixelated",
      display: "block",
      opacity: "0",
      transition: "opacity .4s",
      marginTop: "-48px",
    });
    ui.appendChild(heartCanvas);
    const hctx = heartCanvas.getContext("2d");

    // Draw small heart onto heartCanvas
    const drawSmallHeart = (alpha, color) => {
      hctx.clearRect(0, 0, heartCanvas.width, heartCanvas.height);
      this._drawPixelHeart(
        hctx,
        heartCanvas.width / 2,
        heartCanvas.height / 2,
        PS,
        alpha,
        color ?? C.HEART,
      );
    };
    drawSmallHeart(1);

    // ── Phase 1: black screen fades in ──────────────────────
    ctx.fillStyle = C.BG;
    ctx.fillRect(0, 0, W, H);
    await this._wait(350);

    // ── Phase 2: typewrite "* But it refused." ───────────────
    const MSG = "* But it refused.";
    textEl.style.opacity = "1";
    await this._type(textEl, MSG, 48);
    await this._wait(500);

    // ── Phase 3: small heart appears + beats ─────────────────
    heartCanvas.style.opacity = "1";
    // 3 gentle pulses
    for (let pulse = 0; pulse < 3; pulse++) {
      await this._wait(360);
      await this._animPulse(hctx, heartCanvas.width, heartCanvas.height, PS);
    }
    await this._wait(600);

    // ── Phase 4: halves fly back in from sides and snap ───────
    await new Promise((resolve) => {
      heartCanvas.style.opacity = "0"; // hide the small static heart
      ctx.fillStyle = C.BG;
      ctx.fillRect(0, 0, W, H);

      let t = 0,
        last = performance.now();
      const DUR = 0.7;
      const SNAP = 0.8; // snap happens at this fraction

      const loop = (now) => {
        if (!this._running) {
          resolve();
          return;
        }
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        t += dt;
        const p = Math.min(t / DUR, 1);

        ctx.fillStyle = C.BG;
        ctx.fillRect(0, 0, W, H);

        // Keep the text visible during reform
        // (it's an HTML element, stays visible)

        if (p < SNAP) {
          // Halves converge from left/right
          const ease = 1 - Math.pow(1 - p / SNAP, 2); // ease-in
          const sep = PS_REFORM * 14 * (1 - ease);
          this._drawPixelHalfHeart(
            ctx,
            "L",
            CX - sep,
            CY + 40,
            PS_REFORM,
            0.85 + ease * 0.15,
          );
          this._drawPixelHalfHeart(
            ctx,
            "R",
            CX + sep,
            CY + 40,
            PS_REFORM,
            0.85 + ease * 0.15,
          );
        } else {
          // Snapped! Full heart with impact flash
          const sp = (p - SNAP) / (1 - SNAP);
          const flashA = Math.max(0, 1 - sp * 2.5);
          ctx.shadowColor = C.HEART;
          ctx.shadowBlur = 12 + flashA * 30;
          this._drawPixelHeart(ctx, CX, CY + 40, PS_REFORM, 1);
          ctx.shadowBlur = 0;
          // White flash ring
          if (flashA > 0) {
            const r = sp * PS_REFORM * 18;
            ctx.beginPath();
            ctx.arc(CX, CY + 40, r, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255,255,255,${flashA})`;
            ctx.lineWidth = 4;
            ctx.stroke();
          }
          if (sp === 0) this._audio.sfx("determination");
        }

        if (p >= 1) {
          resolve();
          return;
        }
        this._animId = requestAnimationFrame(loop);
      };
      this._animId = requestAnimationFrame(loop);
    });

    // ── Phase 5: Heart glows, aura expands ────────────────────
    await new Promise((resolve) => {
      let t = 0,
        last = performance.now();
      const DUR = 1.6;
      const loop = (now) => {
        if (!this._running) {
          resolve();
          return;
        }
        const dt = (now - last) / 1000;
        last = now;
        t += dt;
        const p = Math.min(t / DUR, 1);

        ctx.fillStyle = C.BG;
        ctx.fillRect(0, 0, W, H);

        // Expanding aura rings
        for (let i = 0; i < 3; i++) {
          const rp = (p + i / 3) % 1;
          const r = rp * PS_REFORM * 22;
          ctx.beginPath();
          ctx.arc(CX, CY + 40, r, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255,32,32,${(1 - rp) * 0.5})`;
          ctx.lineWidth = 3 - rp * 2;
          ctx.stroke();
        }

        // Heart, glowing
        ctx.shadowColor = C.HEART;
        ctx.shadowBlur = 18 + Math.sin(t * 8) * 8;
        this._drawPixelHeart(ctx, CX, CY + 40, PS_REFORM, 1);
        ctx.shadowBlur = 0;

        if (p >= 1) {
          resolve();
          return;
        }
        this._animId = requestAnimationFrame(loop);
      };
      this._animId = requestAnimationFrame(loop);
    });

    await this._wait(300);
  }

  // Mini pulse animation on the small heart canvas
  _animPulse(hctx, cw, ch, PS) {
    return new Promise((resolve) => {
      let t = 0,
        last = performance.now();
      const DUR = 0.28;
      const loop = (now) => {
        if (!this._running) {
          resolve();
          return;
        }
        const dt = (now - last) / 1000;
        last = now;
        t += dt;
        const p = Math.min(t / DUR, 1);
        const scale = 1 + Math.sin(p * Math.PI) * 0.18;
        hctx.clearRect(0, 0, cw, ch);
        hctx.save();
        hctx.translate(cw / 2, ch / 2);
        hctx.scale(scale, scale);
        hctx.translate(-cw / 2, -ch / 2);
        this._drawPixelHeart(hctx, cw / 2, ch / 2, PS, 1);
        hctx.restore();
        if (p >= 1) {
          resolve();
          return;
        }
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    });
  }

  // ══════════════════════════════════════════════════════════════
  //  WIN CUTSCENE — DETERMINATION
  // ══════════════════════════════════════════════════════════════
  async _winCutscene() {
    this._clear();
    const W = window.innerWidth,
      H = window.innerHeight;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    Object.assign(canvas.style, {
      position: "absolute",
      inset: "0",
      display: "block",
    });
    const ui = document.createElement("div");
    Object.assign(ui.style, {
      position: "absolute",
      inset: "0",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "none",
      gap: "12px",
    });
    this._overlay.appendChild(canvas);
    this._overlay.appendChild(ui);
    const ctx = canvas.getContext("2d");
    const CX = W / 2,
      CY = H / 2;

    const mkLbl = (text, size, color, shadow) => {
      const el = document.createElement("div");
      el.textContent = text;
      Object.assign(el.style, {
        fontSize: size,
        fontFamily: FONT,
        color,
        letterSpacing: ".22em",
        textShadow: shadow,
        opacity: "0",
        transition: "opacity 1.3s ease",
      });
      return el;
    };
    const badge = mkLbl(
      "⚖",
      "clamp(40px,7vw,60px)",
      "#ffd700",
      "0 0 28px #ffd700, 0 0 65px rgba(255,215,0,.5)",
    );
    const title = mkLbl(
      "DETERMINATION",
      "clamp(16px,3vw,34px)",
      "#ffd700",
      "0 0 22px #ffd700, 0 0 55px rgba(255,215,0,.4)",
    );
    const label = mkLbl(
      "The Judgement",
      "clamp(10px,1.5vw,18px)",
      "rgba(255,215,0,.65)",
      "",
    );
    const odds = mkLbl(
      "1 / 1,000,000",
      "clamp(8px,1.2vw,13px)",
      "rgba(255,215,0,.38)",
      "",
    );

    [badge, title, label, odds].forEach((el) => ui.appendChild(el));

    const pts = Array.from({ length: 320 }, () => this._winPt(CX, CY));
    let t = 0,
      last = performance.now();
    const DUR = 7.0;

    const showText = () =>
      [badge, title, label, odds].forEach((el, i) =>
        setTimeout(() => {
          el.style.opacity = "1";
        }, i * 310),
      );
    const tid = setTimeout(showText, 380);
    this._timers.push(tid);

    await new Promise((resolve) => {
      const loop = (now) => {
        if (!this._running) {
          resolve();
          return;
        }
        const dt = (now - last) / 1000;
        last = now;
        t += dt;
        const p = Math.min(t / DUR, 1);

        // Background
        ctx.fillStyle = "#030200";
        ctx.fillRect(0, 0, W, H);

        // Radial gold glow
        const gr = ctx.createRadialGradient(CX, CY, 0, CX, CY, 550 + p * 180);
        gr.addColorStop(
          0,
          `rgba(255,215,0,${0.14 + 0.07 * Math.sin(t * 1.3)})`,
        );
        gr.addColorStop(
          0.55,
          `rgba(255,100,0,${0.04 * Math.abs(Math.sin(t + 0.8))})`,
        );
        gr.addColorStop(1, "transparent");
        ctx.fillStyle = gr;
        ctx.fillRect(0, 0, W, H);

        // Light rays
        for (let i = 0; i < 14; i++) {
          const ang = (i / 14) * Math.PI * 2 + t * 0.07;
          const len = 380 + Math.sin(t * 0.8 + i) * 110;
          ctx.beginPath();
          ctx.moveTo(CX, CY);
          ctx.lineTo(CX + Math.cos(ang) * len, CY + Math.sin(ang) * len);
          ctx.strokeStyle = `rgba(255,215,0,${0.055 + 0.025 * Math.sin(t + i)})`;
          ctx.lineWidth = 20;
          ctx.stroke();
        }

        // Particles
        for (const pt of pts) {
          pt.x += pt.vx * dt;
          pt.y += pt.vy * dt;
          pt.vx *= 0.982;
          pt.vy *= 0.982;
          pt.life -= dt;
          if (pt.life <= 0)
            Object.assign(
              pt,
              this._winPt(
                CX + (Math.random() - 0.5) * 55,
                CY + (Math.random() - 0.5) * 55,
              ),
            );
          ctx.globalAlpha = Math.max(0, pt.life / pt.maxLife) * (0.5 + p * 0.5);
          ctx.fillStyle = pt.col;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.sz, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;

        // Central glow burst
        const cr = 75 + Math.sin(t * 2.6) * 24;
        const cg = ctx.createRadialGradient(CX, CY, 0, CX, CY, cr);
        cg.addColorStop(
          0,
          `rgba(255,245,190,${0.38 + 0.14 * Math.sin(t * 4)})`,
        );
        cg.addColorStop(0.45, `rgba(255,215,0,.15)`);
        cg.addColorStop(1, "transparent");
        ctx.fillStyle = cg;
        ctx.beginPath();
        ctx.arc(CX, CY, cr, 0, Math.PI * 2);
        ctx.fill();

        if (p >= 1) {
          resolve();
          return;
        }
        this._animId = requestAnimationFrame(loop);
      };
      this._animId = requestAnimationFrame(loop);
    });
  }

  _winPt(cx, cy) {
    const a = Math.random() * Math.PI * 2,
      s = 90 + Math.random() * 260;
    const life = 0.9 + Math.random() * 3.8;
    return {
      x: cx,
      y: cy,
      vx: Math.cos(a) * s,
      vy: Math.sin(a) * s,
      life,
      maxLife: life,
      sz: 1.5 + Math.random() * 3.5,
      col: Math.random() > 0.4 ? "#ffd700" : "#ffffff",
    };
  }

  // ══════════════════════════════════════════════════════════════
  //  GAME OVER SCREEN
  // ══════════════════════════════════════════════════════════════
  async _gameOverScreen() {
    this._clear();
    const wrap = document.createElement("div");
    Object.assign(wrap.style, {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "20px",
      height: "100%",
    });

    const title = document.createElement("div");
    title.textContent = "GAME OVER";
    Object.assign(title.style, {
      fontSize: "clamp(28px,5vw,50px)",
      fontFamily: FONT,
      color: "#ff3333",
      letterSpacing: ".2em",
      textShadow: "0 0 22px #ff0000, 0 0 55px rgba(255,0,0,.35)",
      opacity: "0",
      transition: "opacity .7s",
    });

    const sub = document.createElement("div");
    sub.textContent = "* but it refused to stop here.";
    Object.assign(sub.style, {
      fontSize: "clamp(8px,1.2vw,13px)",
      fontFamily: FONT,
      color: "rgba(255,255,255,.38)",
      letterSpacing: ".1em",
      opacity: "0",
      transition: "opacity .8s .9s",
    });

    wrap.appendChild(title);
    wrap.appendChild(sub);
    this._overlay.appendChild(wrap);

    await this._wait(220);
    title.style.opacity = "1";
    await this._wait(1200);
    sub.style.opacity = "1";
    await this._wait(2200);
  }

  // ══════════════════════════════════════════════════════════════
  //  LOSE CUTSCENE — THE JUDGED
  // ══════════════════════════════════════════════════════════════
  async _loseCutscene() {
    this._clear();
    const W = window.innerWidth,
      H = window.innerHeight;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    Object.assign(canvas.style, {
      position: "absolute",
      inset: "0",
      display: "block",
    });
    const ui = document.createElement("div");
    Object.assign(ui.style, {
      position: "absolute",
      inset: "0",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "none",
      gap: "12px",
    });
    this._overlay.appendChild(canvas);
    this._overlay.appendChild(ui);
    const ctx = canvas.getContext("2d");
    const CX = W / 2,
      CY = H / 2;

    const mkLbl2 = (txt, sz, col, sh) => {
      const el = document.createElement("div");
      el.textContent = txt;
      Object.assign(el.style, {
        fontSize: sz,
        fontFamily: FONT,
        color: col,
        letterSpacing: ".2em",
        textShadow: sh,
        opacity: "0",
        transition: "opacity 1.4s ease",
      });
      return el;
    };
    const badge = mkLbl2(
      "⚖",
      "clamp(38px,6vw,56px)",
      "#9933cc",
      "0 0 24px #9933cc, 0 0 60px rgba(153,51,204,.5)",
    );
    const title = mkLbl2(
      "THE JUDGED",
      "clamp(14px,2.5vw,30px)",
      "#9933cc",
      "0 0 20px #9933cc, 0 0 50px rgba(153,51,204,.4)",
    );
    const label = mkLbl2(
      "The Judgement",
      "clamp(9px,1.4vw,17px)",
      "rgba(153,51,204,.65)",
      "",
    );
    const odds = mkLbl2(
      "1 / 1,000,000",
      "clamp(7px,1.1vw,12px)",
      "rgba(153,51,204,.38)",
      "",
    );
    [badge, title, label, odds].forEach((el) => ui.appendChild(el));

    const mist = Array.from({ length: 130 }, () => ({
      x: CX + (Math.random() - 0.5) * 400,
      y: CY + 80 + Math.random() * 120,
      vx: (Math.random() - 0.5) * 16,
      vy: -10 - Math.random() * 22,
      life: 0,
      maxLife: 2.5 + Math.random() * 3,
      sz: 1.5 + Math.random() * 2.5,
    }));

    let t = 0,
      last = performance.now();
    const DUR = 7.0;

    const showT = () =>
      [badge, title, label, odds].forEach((el, i) =>
        setTimeout(
          () => {
            el.style.opacity = "1";
          },
          450 + i * 330,
        ),
      );
    const sid = setTimeout(showT, 650);
    this._timers.push(sid);

    await new Promise((resolve) => {
      const loop = (now) => {
        if (!this._running) {
          resolve();
          return;
        }
        const dt = (now - last) / 1000;
        last = now;
        t += dt;
        const p = Math.min(t / DUR, 1);

        ctx.fillStyle = "#020008";
        ctx.fillRect(0, 0, W, H);

        const g = ctx.createRadialGradient(CX, CY, 0, CX, CY, 420);
        g.addColorStop(0, `rgba(70,0,130,${0.1 + 0.05 * Math.sin(t * 0.65)})`);
        g.addColorStop(0.7, "rgba(30,0,60,.05)");
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);

        for (const m of mist) {
          m.x += m.vx * dt;
          m.y += m.vy * dt;
          m.vy -= 2 * dt;
          m.life += dt;
          if (m.life > m.maxLife) {
            m.x = CX + (Math.random() - 0.5) * 400;
            m.y = CY + 130;
            m.vx = (Math.random() - 0.5) * 14;
            m.vy = -10 - Math.random() * 20;
            m.life = 0;
          }
          const lp = (m.life % m.maxLife) / m.maxLife;
          ctx.globalAlpha = Math.sin(lp * Math.PI) * 0.5;
          ctx.fillStyle = "#9933cc";
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.sz, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;

        const cr = 58 + Math.sin(t * 1.5) * 16;
        const cg = ctx.createRadialGradient(CX, CY, 0, CX, CY, cr);
        cg.addColorStop(0, `rgba(170,70,255,${0.22 + 0.1 * Math.sin(t * 2)})`);
        cg.addColorStop(0.6, "rgba(100,0,180,.08)");
        cg.addColorStop(1, "transparent");
        ctx.fillStyle = cg;
        ctx.beginPath();
        ctx.arc(CX, CY, cr, 0, Math.PI * 2);
        ctx.fill();

        if (p >= 1) {
          resolve();
          return;
        }
        this._animId = requestAnimationFrame(loop);
      };
      this._animId = requestAnimationFrame(loop);
    });
  }
}
