// ui/UIManager.js
import { RollButton }    from './RollButton.js';
import { ResultDisplay } from './ResultDisplay.js';
import { DebugMenu }     from './DebugMenu.js';
import { CraftingPanel } from './CraftingPanel.js';
import { RARITY_ORDER, RARITIES } from '../config/RarityConfig.js';

// ── Odds formatting — always 1/N ──────────────────────────────
function formatOneIn(weight) {
  const total = Object.values(RARITIES).reduce((s, r) => s + r.weight, 0);
  const oneIn = total / weight;
  if (oneIn < 10) return '1/' + oneIn.toFixed(1);
  return '1/' + Math.round(oneIn).toLocaleString();
}
function getOddsLabel(r) { return r.debugOdds ?? formatOneIn(r.weight); }

const TOAST_WEIGHT_THRESHOLD = 40;
function buildToast(rarity) {
  const odds  = getOddsLabel(rarity);
  const badge = rarity.badge ? rarity.badge + ' ' : '';
  return `${badge}${rarity.label.toUpperCase()}!  ${odds}`;
}

export class UIManager {
  constructor(rollEngine, playerState) {
    this.rollEngine    = rollEngine;
    this.playerState   = playerState;
    this.rollButton    = null;
    this.resultDisplay = null;
    this.statsEl       = null;
    this.craftingPanel = null;
    this.debugMenu     = null;
    this._init();
  }

  _init() {
    // Roll button
    this.rollButton = new RollButton(
      document.getElementById('btn-container'),
      () => this._handleRoll()
    );

    // Result display
    this.resultDisplay = new ResultDisplay(
      document.getElementById('result-container')
    );

    // Stats
    this.statsEl = document.getElementById('stats-panel');

    // Luck indicator (shows active multiplier)
    this._luckEl = document.getElementById('luck-indicator');

    // Odds panel
    this._renderOdds();

    // Initial stats
    this.updateStats();

    // Crafting panel — right panel body
    const craftContainer = document.getElementById('craft-container');
    if (craftContainer) {
      this.craftingPanel = new CraftingPanel(
        craftContainer,
        this.rollEngine,
        this.playerState,
        (buff) => this._onCraft(buff)
      );
    }

    // Auto-roll
    const autoBtn = document.getElementById('auto-roll-btn');
    if (autoBtn) {
      let autoInterval = null;
      autoBtn.addEventListener('click', () => {
        if (autoInterval) {
          clearInterval(autoInterval);
          autoInterval = null;
          autoBtn.textContent = 'AUTO ROLL';
          autoBtn.classList.remove('active');
        } else {
          autoBtn.textContent = 'STOP AUTO';
          autoBtn.classList.add('active');
          autoInterval = setInterval(() => {
            if (!this.rollEngine.rolling) this._handleRoll();
          }, 800);
        }
      });
    }

    // Reset
    document.getElementById('reset-btn')
      ?.addEventListener('click', () => {
        if (confirm('Reset all progress? This clears inventory, buffs, and stats.')) {
          this.playerState.reset();
          this.resultDisplay.reset();
          this.updateStats();
          this.craftingPanel?.refresh();
        }
      });

    // Luck button
    document.getElementById('luck-btn')
      ?.addEventListener('click', () => {
        this.rollEngine.activateLuck('streak');
        this._showToast('🍀 Lucky Streak activated! (30s)', '#4ade80');
        this._updateLuckIndicator();
      });

    // Debug menu — owns onRollComplete as single source of truth
    this.debugMenu = new DebugMenu(this.rollEngine, this.playerState);
    this.rollEngine.onRollComplete = (rarity, item) => {
      this.resultDisplay.showResult(rarity, item);
      this.updateStats();
      this.craftingPanel?.refresh();
      this._updateLuckIndicator();
      if (rarity.weight < TOAST_WEIGHT_THRESHOLD) {
        this._showToast(buildToast(rarity), rarity.color);
      }
    };
  }

  async _handleRoll() {
    if (this.rollEngine.rolling) return;
    this.rollButton.setDisabled(true);
    this.resultDisplay.reset();
    await this.rollEngine.roll();
    this.rollButton.setDisabled(false);
  }

  // ── Craft callback ────────────────────────────────────────────
  _onCraft(buff) {
    this.updateStats();
    this._updateLuckIndicator();
    this._showToast(
      `${buff.icon} ${buff.name} crafted! ×${buff.multiplier} luck · ${buff.rolls} rolls`,
      buff.color
    );
  }

  // ── Odds panel ────────────────────────────────────────────────
  _renderOdds() {
    const el = document.getElementById('odds-panel');
    if (!el) return;
    el.innerHTML = [...RARITY_ORDER].reverse().map(id => {
      const r   = RARITIES[id];
      const odds = getOddsLabel(r);
      const badge = r.badge ? `<span style="opacity:.55;margin-right:3px">${r.badge}</span>` : '';
      return `
        <div class="odds-row">
          <span class="odds-label" style="color:${r.color}">${badge}${r.label}</span>
          <span class="odds-value" style="color:${r.color}">${odds}</span>
        </div>
      `;
    }).join('');
  }

  // ── Stats panel ───────────────────────────────────────────────
  updateStats() {
    if (!this.statsEl) return;
    const ps = this.playerState;

    const rarityRows = [...RARITY_ORDER].reverse()
      .filter(id => ps.getRarityCount(id) > 0)
      .map(id => {
        const r = RARITIES[id];
        return `
          <div class="stat-row">
            <span style="color:${r.color}">${r.badge ? r.badge + ' ' : ''}${r.label}</span>
            <span class="stat-val" style="color:${r.color}">${ps.getRarityCount(id)}</span>
          </div>
        `;
      }).join('');

    const pityRows = Object.entries(ps.rollsSinceLast)
      .filter(([id]) => RARITIES[id])
      .map(([id, count]) => {
        const r = RARITIES[id];
        return `
          <div class="stat-row">
            <span style="color:${r.color};opacity:.65">Pity · ${r.label}</span>
            <span class="stat-val" style="color:${r.color};opacity:.8">${count}</span>
          </div>
        `;
      }).join('');

    this.statsEl.innerHTML = `
      <div class="stat-row">
        <span>Total Rolls</span>
        <span class="stat-val">${ps.totalRolls}</span>
      </div>
      ${rarityRows}
      ${pityRows ? `<div style="height:4px"></div>${pityRows}` : ''}
    `;

    this._updateLuckIndicator();
  }

  // ── Luck indicator — shows current multiplier ─────────────────
  _updateLuckIndicator() {
    const el = this._luckEl;
    if (!el) return;
    const mult = this.rollEngine.getLuckMultiplier();
    const buffs = this.rollEngine.craftingSystem.getActiveBuffs();

    if (mult <= 1.01 && buffs.length === 0) {
      el.textContent = '';
      el.style.display = 'none';
      return;
    }

    el.style.display = 'block';
    el.innerHTML = `
      <span class="li-label">LUCK</span>
      <span class="li-mult">×${mult.toFixed(2)}</span>
      ${buffs.map(b => `
        <span class="li-buff" style="--bc:${b.color}" title="${b.name}">
          ${b.icon} <span>${b.rollsRemaining}</span>
        </span>
      `).join('')}
    `;
  }

  // ── Toast ─────────────────────────────────────────────────────
  _showToast(message, color = '#fff') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.color       = color;
    toast.style.borderColor = color;
    toast.style.boxShadow   = `0 0 20px ${color}44`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('toast--show'), 10);
    setTimeout(() => {
      toast.classList.remove('toast--show');
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }
}