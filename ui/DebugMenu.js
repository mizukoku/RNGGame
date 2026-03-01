// ui/DebugMenu.js
import { RARITIES, RARITY_ORDER } from '../config/RarityConfig.js';

// Display order: rarest first
const DISPLAY_ORDER = [...RARITY_ORDER].reverse();

function formatOneIn(weight) {
  const total = Object.values(RARITIES).reduce((s, r) => s + r.weight, 0);
  const oneIn = total / weight;
  if (oneIn < 10) return '1/' + oneIn.toFixed(1);
  return '1/' + Math.round(oneIn).toLocaleString();
}
function getOddsLabel(r) { return r.debugOdds ?? formatOneIn(r.weight); }

const DEBUG_CSS = `
#debug-menu {
  position:fixed;bottom:20px;right:20px;
  z-index:99999;font-family:'Rajdhani',monospace,sans-serif;
}
#debug-toggle {
  display:block;width:42px;height:42px;border-radius:50%;
  background:rgba(10,10,18,.92);border:1px solid rgba(255,255,255,.15);
  color:rgba(255,255,255,.5);font-size:18px;cursor:pointer;
  transition:all .2s;line-height:42px;text-align:center;
  box-shadow:0 4px 20px rgba(0,0,0,.5);user-select:none;
}
#debug-toggle:hover{color:#fff;border-color:rgba(255,255,255,.35);background:rgba(20,20,32,.98)}
#debug-panel {
  display:none;flex-direction:column;
  background:rgba(8,8,14,.97);border:1px solid rgba(255,255,255,.1);
  border-radius:10px;overflow:hidden;margin-bottom:10px;min-width:260px;
  max-height:92vh;overflow-y:auto;
  box-shadow:0 8px 40px rgba(0,0,0,.7),0 0 0 1px rgba(255,255,255,.04);
  backdrop-filter:blur(12px);
  scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.08) transparent;
}
#debug-panel.open{display:flex}
.dbg-header{
  padding:10px 14px 8px;border-bottom:1px solid rgba(255,255,255,.07);
  display:flex;align-items:center;justify-content:space-between;
  position:sticky;top:0;z-index:2;background:rgba(8,8,14,.97);
}
.dbg-title{font-size:.65rem;font-weight:700;letter-spacing:.3em;color:rgba(255,255,255,.35);text-transform:uppercase}
.dbg-hint {font-size:.58rem;color:rgba(255,255,255,.18);letter-spacing:.1em}
.dbg-section{padding:8px 0;border-bottom:1px solid rgba(255,255,255,.05)}
.dbg-section:last-child{border-bottom:none}
.dbg-section-title{font-size:.58rem;font-weight:700;letter-spacing:.25em;color:rgba(255,255,255,.2);padding:0 14px 6px;text-transform:uppercase}

/* ── Scrollable cutscene button list ── */
.dbg-scene-scroll {
  max-height:310px;
  overflow-y:auto;
  overflow-x:hidden;
  scrollbar-width:thin;
  scrollbar-color:rgba(255,255,255,.12) transparent;
  position:relative;
}
.dbg-scene-scroll::-webkit-scrollbar { width:4px; }
.dbg-scene-scroll::-webkit-scrollbar-track { background:transparent; }
.dbg-scene-scroll::-webkit-scrollbar-thumb {
  background:rgba(255,255,255,.12);border-radius:2px;
}
.dbg-scene-scroll::-webkit-scrollbar-thumb:hover {
  background:rgba(255,255,255,.22);
}
/* Bottom fade mask — hints there is more content below */
.dbg-scene-fade {
  position:sticky;bottom:0;left:0;right:0;height:28px;
  background:linear-gradient(to bottom,transparent,rgba(8,8,14,.97));
  pointer-events:none;margin-top:-28px;
}
.dbg-btn{
  display:flex;align-items:center;gap:9px;width:100%;padding:7px 14px;
  background:none;border:none;cursor:pointer;
  font-family:'Rajdhani',monospace,sans-serif;font-size:.83rem;font-weight:600;
  color:var(--dbg-color,#fff);text-align:left;letter-spacing:.05em;transition:background .15s;
}
.dbg-btn:hover{background:rgba(255,255,255,.06)}
.dbg-btn:active{background:rgba(255,255,255,.1)}
.dbg-btn-dot{
  width:8px;height:8px;border-radius:50%;
  background:var(--dbg-color,#fff);box-shadow:0 0 8px var(--dbg-color,#fff);flex-shrink:0;
}
.dbg-btn-badge{font-size:.75rem;flex-shrink:0}
.dbg-btn-key{
  font-size:.58rem;color:rgba(255,255,255,.18);
  background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);
  border-radius:3px;padding:1px 5px;flex-shrink:0;font-family:monospace;
}
.dbg-btn-odds{
  margin-left:auto;font-size:.63rem;font-weight:500;
  color:var(--dbg-color,rgba(255,255,255,.25));opacity:.55;letter-spacing:.03em;flex-shrink:0;
}
/* Matrix row gets green terminal treatment */
.dbg-btn[data-rarity="MATRIX"] {
  font-family:'Courier New',monospace;letter-spacing:.1em;
  background:linear-gradient(90deg,rgba(0,255,65,.06) 0%,transparent 100%);
}
.dbg-btn[data-rarity="MATRIX"]:hover {
  background:linear-gradient(90deg,rgba(0,255,65,.14) 0%,rgba(0,180,50,.04) 100%);
}
/* Convergence row — subtle rainbow shimmer */
.dbg-btn[data-rarity="CONVERGENCE"] {
  background:linear-gradient(90deg,rgba(255,255,255,.04) 0%,transparent 100%);
}
.dbg-btn[data-rarity="CONVERGENCE"]:hover {
  background:linear-gradient(90deg,rgba(255,255,255,.09) 0%,rgba(255,200,100,.05) 100%);
}

/* Eldritch row — violet cosmic dread styling */
.dbg-btn[data-rarity="ELDRITCH"] {
  font-family:'Georgia',serif;font-style:italic;
  background:linear-gradient(90deg,rgba(139,43,226,.08) 0%,transparent 100%);
}
.dbg-btn[data-rarity="ELDRITCH"]:hover {
  background:linear-gradient(90deg,rgba(139,43,226,.16) 0%,rgba(75,0,130,.06) 100%);
}
.dbg-btn[data-rarity="ELDRITCH"] .dbg-btn-dot {
  animation:elDotPulse 1.4s ease-in-out infinite;
}
@keyframes elDotPulse {
  0%,100%{transform:scale(1);box-shadow:0 0 8px #c084fc}
  50%    {transform:scale(1.5);box-shadow:0 0 16px #8b2be2,0 0 30px rgba(139,43,226,.5)}
}

/* TimeCollapse row — temporal cyan + clock feel */
.dbg-btn[data-rarity="TIMECOLLAPSE"] {
  font-family:'Times New Roman',serif;font-style:italic;
  background:linear-gradient(90deg,rgba(100,200,255,.07) 0%,transparent 100%);
}
.dbg-btn[data-rarity="TIMECOLLAPSE"]:hover {
  background:linear-gradient(90deg,rgba(100,200,255,.15) 0%,rgba(255,215,0,.05) 100%);
}
.dbg-btn[data-rarity="TIMECOLLAPSE"] .dbg-btn-dot {
  animation:tcDotSpin 2s linear infinite;
}
@keyframes tcDotSpin {
  0%  {box-shadow:0 0 8px #64c8ff;transform:scale(1)}
  50% {box-shadow:0 0 16px #ffd700,0 0 30px rgba(100,200,255,.5);transform:scale(1.4)}
  100%{box-shadow:0 0 8px #64c8ff;transform:scale(1)}
}

/* 8-Bit Genesis row — retro pixel terminal feel */
.dbg-btn[data-rarity="PIXELGENESIS"] {
  font-family:'Courier New',monospace;font-weight:700;text-transform:uppercase;
  image-rendering:pixelated;
  background:linear-gradient(90deg,rgba(252,188,60,.1) 0%,transparent 100%);
}
.dbg-btn[data-rarity="PIXELGENESIS"]:hover {
  background:linear-gradient(90deg,rgba(252,188,60,.22) 0%,rgba(228,0,88,.05) 100%);
}
.dbg-btn[data-rarity="PIXELGENESIS"] .dbg-btn-dot {
  animation:pgDotBlink .5s step-end infinite;
}
@keyframes pgDotBlink {
  0%  {box-shadow:0 0 10px #fcbc3c;background:#fcbc3c}
  33% {box-shadow:0 0 10px #e40058;background:#e40058}
  66% {box-shadow:0 0 10px #3c78f0;background:#3c78f0}
  100%{box-shadow:0 0 10px #fcbc3c;background:#fcbc3c}
}

/* Void Awakens row — deep violet singularity pulse */
.dbg-btn[data-rarity="VOIDAWAKENS"] {
  font-family:'Georgia',serif;font-style:italic;
  background:linear-gradient(90deg,rgba(144,96,255,.08) 0%,transparent 100%);
}
.dbg-btn[data-rarity="VOIDAWAKENS"]:hover {
  background:linear-gradient(90deg,rgba(144,96,255,.18) 0%,rgba(64,200,255,.05) 100%);
}
.dbg-btn[data-rarity="VOIDAWAKENS"] .dbg-btn-dot {
  animation:vaDotPulse 1.4s ease-in-out infinite;
}
@keyframes vaDotPulse {
  0%,100%{
    box-shadow:0 0 6px #9060ff;
    background:#9060ff;
    transform:scale(1);
  }
  35%{
    box-shadow:0 0 16px #c8a8ff, 0 0 32px rgba(144,96,255,.5);
    background:#c8a8ff;
    transform:scale(1.5);
  }
  65%{
    box-shadow:0 0 12px #40c8ff, 0 0 24px rgba(64,200,255,.4);
    background:#40c8ff;
    transform:scale(1.25);
  }
}

  30%    {box-shadow:0 0 22px #fffbe8,0 0 44px rgba(255,216,110,.7);background:#fffbe8;transform:scale(1.5)}
  60%    {box-shadow:0 0 14px #80c8ff;background:#b8e4ff;transform:scale(1.2)}
}

/* Sacred Blade row — golden medieval */
.dbg-btn[data-rarity="SACREDBLADE"] {
  font-family:'Times New Roman',serif;font-style:italic;font-weight:700;
  background:linear-gradient(90deg,rgba(255,215,0,.1) 0%,transparent 100%);
}
.dbg-btn[data-rarity="SACREDBLADE"]:hover {
  background:linear-gradient(90deg,rgba(255,215,0,.22) 0%,rgba(255,244,176,.06) 100%);
}
.dbg-btn[data-rarity="SACREDBLADE"] .dbg-btn-dot {
  animation:sbDotPulse 1.2s ease-in-out infinite alternate;
}
@keyframes sbDotPulse {
  from{box-shadow:0 0 8px #ffd700;background:#ffd700;transform:scale(1)}
  to  {box-shadow:0 0 20px #ffd700,0 0 45px rgba(255,215,0,.4);background:#fffef0;transform:scale(1.5)}
}

/* The Observer row — deep purple, unsettling */
.dbg-btn[data-rarity="THEOBSERVER"] {
  font-family:'Georgia','Times New Roman',serif;font-style:italic;
  background:linear-gradient(90deg,rgba(100,0,180,.12) 0%,transparent 100%);
}
.dbg-btn[data-rarity="THEOBSERVER"]:hover {
  background:linear-gradient(90deg,rgba(120,0,200,.2) 0%,rgba(80,0,140,.06) 100%);
}
.dbg-btn[data-rarity="THEOBSERVER"] .dbg-btn-dot {
  animation:toDebugDot 2.8s ease-in-out infinite alternate;
}
@keyframes toDebugDot {
  from{box-shadow:0 0 5px #6600aa;background:#6600aa;transform:scale(1)}
  to  {box-shadow:0 0 18px #9933cc,0 0 40px rgba(100,0,180,.4);background:#c8a8ff;transform:scale(1.4)}
}

/* The Fractal row — electric teal, monospace */
.dbg-btn[data-rarity="THEFRACTAL"] {
  font-family:'Courier New',monospace;font-weight:700;
  background:linear-gradient(90deg,rgba(0,255,204,.1) 0%,transparent 100%);
}
.dbg-btn[data-rarity="THEFRACTAL"]:hover {
  background:linear-gradient(90deg,rgba(0,255,204,.2) 0%,rgba(0,63,255,.06) 100%);
}
.dbg-btn[data-rarity="THEFRACTAL"] .dbg-btn-dot {
  animation:tfDebugDot 1.6s linear infinite;
}
@keyframes tfDebugDot {
  0%  {box-shadow:0 0 6px #00ffcc;background:#00ffcc;transform:scale(1)}
  33% {box-shadow:0 0 14px #ff00cc,0 0 30px rgba(255,0,204,.4);background:#ff00cc;transform:scale(1.4)}
  66% {box-shadow:0 0 14px #003fff,0 0 30px rgba(0,63,255,.4);background:#003fff;transform:scale(1.2)}
  100%{box-shadow:0 0 6px #00ffcc;background:#00ffcc;transform:scale(1)}
}

/* The Last Light row — ember orange, serif */
.dbg-btn[data-rarity="THELASTLIGHT"] {
  font-family:'Georgia','Times New Roman',serif;
  background:linear-gradient(90deg,rgba(255,80,0,.1) 0%,transparent 100%);
}
.dbg-btn[data-rarity="THELASTLIGHT"]:hover {
  background:linear-gradient(90deg,rgba(255,100,0,.2) 0%,rgba(255,40,0,.05) 100%);
}
.dbg-btn[data-rarity="THELASTLIGHT"] .dbg-btn-dot {
  animation:llDebugDot 3.4s ease-in-out infinite alternate;
}
@keyframes llDebugDot {
  0%  {box-shadow:0 0 8px #fff8f0;background:#fff8f0;transform:scale(1.3)}
  40% {box-shadow:0 0 10px #ff9933,0 0 22px rgba(255,153,51,.5);background:#ff9933;transform:scale(1.1)}
  75% {box-shadow:0 0 8px #ff4400,0 0 18px rgba(255,68,0,.4);background:#ff4400;transform:scale(0.9)}
  100%{box-shadow:0 0 4px #1a0800;background:#331000;transform:scale(0.7)}
}

/* The Nation row — gold/crimson, serif, stately */
.dbg-btn[data-rarity="THENATION"] {
  font-family:'Georgia','Times New Roman',serif;font-weight:600;
  background:linear-gradient(90deg,rgba(255,215,0,.1) 0%,rgba(204,0,32,.05) 60%,transparent 100%);
}
.dbg-btn[data-rarity="THENATION"]:hover {
  background:linear-gradient(90deg,rgba(255,215,0,.2) 0%,rgba(204,0,32,.1) 60%,transparent 100%);
}
.dbg-btn[data-rarity="THENATION"] .dbg-btn-dot {
  animation:tnDebugDot 2s ease-in-out infinite alternate;
}
@keyframes tnDebugDot {
  0%  {background:#cc0020;box-shadow:0 0 6px #cc0020;transform:scale(0.9)}
  50% {background:#ffd700;box-shadow:0 0 12px #ffd700,0 0 28px rgba(255,215,0,.5);transform:scale(1.3)}
  100%{background:#ffffff;box-shadow:0 0 18px #fff,0 0 40px rgba(255,215,0,.6);transform:scale(1.1)}
}

/* The Endless Dream row — soft lavender, dreamy drift */
.dbg-btn[data-rarity="THEENDLESSDREAM"] {
  font-family:'Georgia','Times New Roman',serif;font-style:italic;
  background:linear-gradient(90deg,rgba(153,102,255,.1) 0%,rgba(255,136,204,.05) 60%,transparent 100%);
}
.dbg-btn[data-rarity="THEENDLESSDREAM"]:hover {
  background:linear-gradient(90deg,rgba(200,160,255,.2) 0%,rgba(255,136,204,.08) 60%,transparent 100%);
}
.dbg-btn[data-rarity="THEENDLESSDREAM"] .dbg-btn-dot {
  animation:edDebugDot 4.5s ease-in-out infinite;
}
@keyframes edDebugDot {
  0%  {background:#c8a0ff;box-shadow:0 0 5px #c8a0ff;transform:scale(1) translateY(0)}
  25% {background:#ff88cc;box-shadow:0 0 12px #ff88cc,0 0 26px rgba(255,136,204,.4);transform:scale(1.2) translateY(-2px)}
  50% {background:#fffacc;box-shadow:0 0 16px #fffacc,0 0 35px rgba(255,250,204,.5);transform:scale(1.4) translateY(-4px)}
  75% {background:#9966ff;box-shadow:0 0 12px #9966ff,0 0 28px rgba(153,102,255,.4);transform:scale(1.1) translateY(-2px)}
  100%{background:#c8a0ff;box-shadow:0 0 5px #c8a0ff;transform:scale(1) translateY(0)}
}

/* Rebirth row — warm gold, serif, the light breathing */
@keyframes kfDebugDot {
  0%  {background:#1a0028;box-shadow:0 0 2px rgba(255,26,136,.2);transform:scale(0.7)}
  45% {background:#ff1a88;box-shadow:0 0 10px #ff1a88,0 0 26px rgba(255,26,136,.6);transform:scale(1.2)}
  75% {background:#ff66bb;box-shadow:0 0 16px #ff66bb,0 0 40px rgba(255,102,187,.6);transform:scale(1.4)}
  100%{background:#00ffee;box-shadow:0 0 14px #00ffee,0 0 35px rgba(0,255,238,.5);transform:scale(1.1)}
}



/* The Golden Hour row — warm amber, the dusk light breathing */
.dbg-btn[data-rarity="THEGOLDENHOUR"] {
  font-family:'Georgia','Times New Roman',serif;
  background:linear-gradient(90deg,rgba(255,179,71,.12) 0%,rgba(255,120,30,.05) 55%,transparent 100%);
}
.dbg-btn[data-rarity="THEGOLDENHOUR"]:hover {
  background:linear-gradient(90deg,rgba(255,200,100,.22) 0%,rgba(255,140,40,.08) 55%,transparent 100%);
}
.dbg-btn[data-rarity="THEGOLDENHOUR"] .dbg-btn-dot {
  animation:tgohDebugDot 3.6s ease-in-out infinite alternate;
}
@keyframes tgohDebugDot {
  0%  {background:#1a0800;box-shadow:0 0 2px rgba(255,179,71,.2);transform:scale(0.65)}
  30% {background:#ffb347;box-shadow:0 0 10px #ffb347,0 0 25px rgba(255,179,71,.5);transform:scale(1.1)}
  65% {background:#fff4b8;box-shadow:0 0 18px #fff4b8,0 0 45px rgba(255,240,180,.65),0 0 90px rgba(255,200,80,.35);transform:scale(1.45)}
  100%{background:#ff7a00;box-shadow:0 0 14px #ff7a00,0 0 35px rgba(255,120,0,.55);transform:scale(1.2)}
}
.dbg-util-btn{
  width:calc(100% - 28px);margin:4px 14px;padding:6px 10px;
  background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);
  border-radius:5px;color:rgba(255,255,255,.45);
  font-family:'Rajdhani',monospace,sans-serif;font-size:.72rem;font-weight:600;
  letter-spacing:.1em;cursor:pointer;transition:all .15s;text-align:center;display:block;
}
.dbg-util-btn:hover{background:rgba(255,255,255,.08);color:rgba(255,255,255,.7)}
.dbg-playing{
  display:flex;align-items:center;gap:8px;padding:8px 14px;
  font-size:.72rem;color:rgba(255,255,255,.4);
  animation:dbgBlink 1s ease-in-out infinite;
  border-top:1px solid rgba(255,255,255,.05);
}
@keyframes dbgBlink{0%,100%{opacity:.4}50%{opacity:1}}
.dbg-dot-pulse{
  width:6px;height:6px;border-radius:50%;background:#4ade80;
  animation:dbgPulse .8s ease-in-out infinite;flex-shrink:0;
}
@keyframes dbgPulse{
  0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(74,222,128,.6)}
  50%    {transform:scale(1.3);box-shadow:0 0 0 4px rgba(74,222,128,0)}
}
`;

export class DebugMenu {
  constructor(rollEngine, playerState) {
    this.rollEngine  = rollEngine;
    this.playerState = playerState;
    this._panel      = null;
    this._open       = false;
    this._inject();
    this._render();
    this._bindKeys();
  }

  _inject() {
    if (document.getElementById('dbg-css')) return;
    const s = document.createElement('style');
    s.id = 'dbg-css';
    s.textContent = DEBUG_CSS;
    document.head.appendChild(s);
  }

  _render() {
    const root = document.createElement('div');
    root.id = 'debug-menu';

    this._panel = document.createElement('div');
    this._panel.id = 'debug-panel';
    this._panel.innerHTML = `
      <div class="dbg-header">
        <span class="dbg-title">🔧 Debug</span>
        <span class="dbg-hint">\` to toggle</span>
      </div>

      <div class="dbg-section">
        <div class="dbg-section-title">Fire Cutscene</div>
        <div class="dbg-scene-scroll">
          ${DISPLAY_ORDER.map((id, i) => {
            const r     = RARITIES[id];
            const odds  = getOddsLabel(r);
            const badge = r.badge ? `<span class="dbg-btn-badge">${r.badge}</span>` : '';
            const key   = i < 9 ? `<span class="dbg-btn-key">${i + 1}</span>` : '';
            return `
              <button class="dbg-btn" data-rarity="${id}" style="--dbg-color:${r.color}">
                <span class="dbg-btn-dot"></span>
                ${r.label}${badge}
                ${key}
                <span class="dbg-btn-odds">${odds}</span>
              </button>
            `;
          }).join('')}
          <div class="dbg-scene-fade"></div>
        </div>
      </div>

      <div class="dbg-section">
        <div class="dbg-section-title">Luck Buffs</div>
        <button class="dbg-util-btn" id="dbg-luck-streak">🍀 Lucky Streak  ×1.5 · 30s</button>
        <button class="dbg-util-btn" id="dbg-luck-holy">✨ Holy Light  ×2.0 · 15s</button>
        <button class="dbg-util-btn" id="dbg-luck-glimpse">⚡ Glimpse  ×3.0 · 5s</button>
      </div>

      <div class="dbg-section">
        <div class="dbg-section-title">Tools</div>
        <button class="dbg-util-btn" id="dbg-skip">⏭ Skip Cutscene</button>
        <button class="dbg-util-btn" id="dbg-clear-fx">💨 Clear Effects</button>
        <button class="dbg-util-btn" id="dbg-reset">⚠ Reset Save</button>
      </div>
    `;

    const toggle = document.createElement('button');
    toggle.id          = 'debug-toggle';
    toggle.title       = 'Debug Menu (`)';
    toggle.textContent = '🔧';

    root.appendChild(this._panel);
    root.appendChild(toggle);
    document.body.appendChild(root);

    toggle.addEventListener('click', () => this._togglePanel());
    this._panel.querySelectorAll('.dbg-btn[data-rarity]').forEach(btn => {
      btn.addEventListener('click', () => this._fireScene(btn.dataset.rarity));
    });

    document.getElementById('dbg-luck-streak')
      ?.addEventListener('click', () => { this.rollEngine.activateLuck('streak');  this._toast('🍀 Lucky Streak active'); });
    document.getElementById('dbg-luck-holy')
      ?.addEventListener('click', () => { this.rollEngine.activateLuck('holy');    this._toast('✨ Holy Light active'); });
    document.getElementById('dbg-luck-glimpse')
      ?.addEventListener('click', () => { this.rollEngine.activateLuck('glimpse'); this._toast('⚡ Glimpse active'); });
    document.getElementById('dbg-skip')
      ?.addEventListener('click', () => { this.rollEngine.engine?.cutsceneManager?.stop(); this._toast('Cutscene skipped'); });
    document.getElementById('dbg-clear-fx')
      ?.addEventListener('click', () => { this.rollEngine.engine?.clearEffects?.(); this._toast('Effects cleared'); });
    document.getElementById('dbg-reset')
      ?.addEventListener('click', () => {
        if (confirm('Reset all save data?')) { this.playerState.reset(); this._toast('Save reset'); }
      });
  }

  _togglePanel() {
    this._open = !this._open;
    this._panel.classList.toggle('open', this._open);
  }

  _bindKeys() {
    document.addEventListener('keydown', e => {
      if (e.key === '`' || e.key === '~') { this._togglePanel(); return; }
      if (this._open && e.key >= '1' && e.key <= '9') {
        const id = DISPLAY_ORDER[parseInt(e.key) - 1];
        if (id) this._fireScene(id);
      }
    });
  }

  async _fireScene(rarityId) {
    if (this.rollEngine.rolling) return;
    const rarity = RARITIES[rarityId];
    if (!rarity) return;
    const item = this.rollEngine.rarityTable.rollItem(rarity);
    this._showPlaying(rarity);
    this.rollEngine.rolling = true;
    await this.rollEngine.engine.playCutscene(rarity.cutscene, rarity);
    this.rollEngine.rolling = false;
    this._hidePlaying();
    if (this.rollEngine.onRollComplete) this.rollEngine.onRollComplete(rarity, item);
  }

  _showPlaying(rarity) {
    this._hidePlaying();
    const el = document.createElement('div');
    el.className = 'dbg-playing';
    el.innerHTML = `
      <span class="dbg-dot-pulse"></span>
      Playing: <strong style="color:${rarity.color}">${rarity.label}</strong>
      <span style="opacity:.4;font-size:.62rem;margin-left:auto">${getOddsLabel(rarity)}</span>
    `;
    this._panel.appendChild(el);
  }

  _hidePlaying() { this._panel.querySelector('.dbg-playing')?.remove(); }

  _toast(msg) {
    const t = document.createElement('div');
    t.style.cssText = `
      position:fixed;bottom:80px;right:20px;
      background:rgba(10,10,18,.95);border:1px solid rgba(255,255,255,.12);
      color:rgba(255,255,255,.7);font-family:'Rajdhani',sans-serif;
      font-size:.75rem;font-weight:600;letter-spacing:.1em;
      padding:6px 14px;border-radius:100px;z-index:100000;
      opacity:0;transition:opacity .2s;pointer-events:none;
    `;
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(() => t.style.opacity = '1');
    setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 250); }, 1800);
  }
}