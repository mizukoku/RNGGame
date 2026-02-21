// ui/DebugMenu.js
import { RARITIES, RARITY_ORDER } from '../config/RarityConfig.js';

// Display order: rarest first
const DISPLAY_ORDER = [...RARITY_ORDER].reverse();

// Always format as 1/N — reads debugOdds from config if set,
// otherwise computes from weight
function formatOneIn(weight) {
  const total = Object.values(RARITIES).reduce((s, r) => s + r.weight, 0);
  const oneIn = total / weight;
  if (oneIn < 10) return '1/' + oneIn.toFixed(1);
  return '1/' + Math.round(oneIn).toLocaleString();
}

function getOddsLabel(rarity) {
  return rarity.debugOdds ?? formatOneIn(rarity.weight);
}

const DEBUG_CSS = `
#debug-menu {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 99999;
  font-family: 'Rajdhani', monospace, sans-serif;
}

#debug-toggle {
  display: block;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: rgba(10,10,18,0.92);
  border: 1px solid rgba(255,255,255,0.15);
  color: rgba(255,255,255,0.5);
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s;
  line-height: 42px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.5);
  user-select: none;
}
#debug-toggle:hover {
  color: #fff;
  border-color: rgba(255,255,255,0.35);
  background: rgba(20,20,32,0.98);
}

#debug-panel {
  display: none;
  flex-direction: column;
  background: rgba(8,8,14,0.97);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 10px;
  min-width: 240px;
  max-height: 92vh;
  overflow-y: auto;
  box-shadow: 0 8px 40px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04);
  backdrop-filter: blur(12px);
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.08) transparent;
}
#debug-panel.open { display: flex; }

.dbg-header {
  padding: 10px 14px 8px;
  border-bottom: 1px solid rgba(255,255,255,0.07);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 2;
  background: rgba(8,8,14,0.97);
}
.dbg-title {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.3em;
  color: rgba(255,255,255,0.35);
  text-transform: uppercase;
}
.dbg-hint {
  font-size: 0.58rem;
  color: rgba(255,255,255,0.18);
  letter-spacing: 0.1em;
}

.dbg-section {
  padding: 8px 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}
.dbg-section:last-child { border-bottom: none; }
.dbg-section-title {
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.25em;
  color: rgba(255,255,255,0.2);
  padding: 0 14px 6px;
  text-transform: uppercase;
}

.dbg-btn {
  display: flex;
  align-items: center;
  gap: 9px;
  width: 100%;
  padding: 7px 14px;
  background: none;
  border: none;
  cursor: pointer;
  font-family: 'Rajdhani', monospace, sans-serif;
  font-size: 0.83rem;
  font-weight: 600;
  color: var(--dbg-color, #fff);
  text-align: left;
  letter-spacing: 0.05em;
  transition: background 0.15s;
}
.dbg-btn:hover  { background: rgba(255,255,255,0.06); }
.dbg-btn:active { background: rgba(255,255,255,0.1); }

.dbg-btn-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--dbg-color, #fff);
  box-shadow: 0 0 8px var(--dbg-color, #fff);
  flex-shrink: 0;
}
.dbg-btn-badge {
  font-size: 0.75rem;
  flex-shrink: 0;
}
.dbg-btn-key {
  font-size: 0.58rem;
  color: rgba(255,255,255,0.18);
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 3px;
  padding: 1px 5px;
  flex-shrink: 0;
  font-family: monospace;
}
.dbg-btn-odds {
  margin-left: auto;
  font-size: 0.63rem;
  font-weight: 500;
  color: var(--dbg-color, rgba(255,255,255,0.25));
  opacity: 0.55;
  letter-spacing: 0.03em;
  flex-shrink: 0;
}

.dbg-util-btn {
  width: calc(100% - 28px);
  margin: 4px 14px;
  padding: 6px 10px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 5px;
  color: rgba(255,255,255,0.45);
  font-family: 'Rajdhani', monospace, sans-serif;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.15s;
  text-align: center;
  display: block;
}
.dbg-util-btn:hover {
  background: rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.7);
}

/* Playing indicator */
.dbg-playing {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  font-size: 0.72rem;
  color: rgba(255,255,255,0.4);
  animation: dbgBlink 1s ease-in-out infinite;
  border-top: 1px solid rgba(255,255,255,0.05);
}
@keyframes dbgBlink {
  0%,100%{opacity:.4} 50%{opacity:1}
}
.dbg-dot-pulse {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #4ade80;
  animation: dbgPulse .8s ease-in-out infinite;
  flex-shrink: 0;
}
@keyframes dbgPulse {
  0%,100%{ transform:scale(1);   box-shadow:0 0 0 0 rgba(74,222,128,.6) }
  50%    { transform:scale(1.3); box-shadow:0 0 0 4px rgba(74,222,128,0) }
}
`;

export class DebugMenu {
  constructor(rollEngine, playerState) {
    this.rollEngine  = rollEngine;
    this.playerState = playerState;
    this._el         = null;
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
    this._el = document.createElement('div');
    this._el.id = 'debug-menu';

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
          return `
            <button class="dbg-btn" data-rarity="${id}" style="--dbg-color:${r.color}">
              <span class="dbg-btn-dot"></span>
              ${r.label}
              ${badge}
              <span class="dbg-btn-key">${i + 1}</span>
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
    toggle.id        = 'debug-toggle';
    toggle.title     = 'Debug Menu (`)';
    toggle.textContent = '🔧';

    this._el.appendChild(this._panel);
    this._el.appendChild(toggle);
    document.body.appendChild(this._el);

    // Scene buttons
    toggle.addEventListener('click', () => this._togglePanel());
    this._panel.querySelectorAll('.dbg-btn[data-rarity]').forEach(btn => {
      btn.addEventListener('click', () => this._fireScene(btn.dataset.rarity));
    });

    // Luck
    document.getElementById('dbg-luck-streak')
      ?.addEventListener('click', () => { this.rollEngine.activateLuck('streak');  this._toast('🍀 Lucky Streak active'); });
    document.getElementById('dbg-luck-holy')
      ?.addEventListener('click', () => { this.rollEngine.activateLuck('holy');    this._toast('✨ Holy Light active'); });
    document.getElementById('dbg-luck-glimpse')
      ?.addEventListener('click', () => { this.rollEngine.activateLuck('glimpse'); this._toast('⚡ Glimpse active'); });

    // Tools
    document.getElementById('dbg-skip')
      ?.addEventListener('click', () => {
        this.rollEngine.engine?.cutsceneManager?.stop();
        this._toast('Cutscene skipped');
      });
    document.getElementById('dbg-clear-fx')
      ?.addEventListener('click', () => {
        this.rollEngine.engine?.clearEffects();
        this._toast('Effects cleared');
      });
    document.getElementById('dbg-reset')
      ?.addEventListener('click', () => {
        if (confirm('Reset all save data?')) {
          this.playerState.reset();
          this._toast('Save reset');
        }
      });
  }

  _togglePanel() {
    this._open = !this._open;
    this._panel.classList.toggle('open', this._open);
  }

  _bindKeys() {
    document.addEventListener('keydown', e => {
      if (e.key === '`' || e.key === '~') { this._togglePanel(); return; }
      // 1–9 fire rarities rarest→common when panel is open
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

    if (this.rollEngine.onRollComplete) {
      this.rollEngine.onRollComplete(rarity, item);
    }
  }

  _showPlaying(rarity) {
    this._hidePlaying();
    const el = document.createElement('div');
    el.className = 'dbg-playing';
    el.innerHTML = `
      <span class="dbg-dot-pulse"></span>
      Playing: <strong style="color:${rarity.color}">${rarity.label}</strong>
      <span style="opacity:.4;font-size:.65rem;margin-left:auto">${getOddsLabel(rarity)}</span>
    `;
    this._panel.appendChild(el);
  }

  _hidePlaying() {
    this._panel.querySelector('.dbg-playing')?.remove();
  }

  _toast(msg) {
    const t = document.createElement('div');
    t.style.cssText = `
      position:fixed; bottom:80px; right:20px;
      background:rgba(10,10,18,.95); border:1px solid rgba(255,255,255,.12);
      color:rgba(255,255,255,.7); font-family:'Rajdhani',sans-serif;
      font-size:.75rem; font-weight:600; letter-spacing:.1em;
      padding:6px 14px; border-radius:100px; z-index:100000;
      opacity:0; transition:opacity .2s; pointer-events:none;
    `;
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(() => t.style.opacity = '1');
    setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 250); }, 1800);
  }
}