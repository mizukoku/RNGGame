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