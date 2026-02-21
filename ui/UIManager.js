// ui/UIManager.js
import { RollButton }    from './RollButton.js';
import { ResultDisplay } from './ResultDisplay.js';
import { DebugMenu }     from './DebugMenu.js';
import { RARITY_ORDER, RARITIES } from '../config/RarityConfig.js';

// ── Odds formatting — always 1/N, never % ────────────────────
function formatOneIn(weight) {
  const total = Object.values(RARITIES).reduce((s, r) => s + r.weight, 0);
  const oneIn = total / weight;
  if (oneIn < 10) return '1/' + oneIn.toFixed(1);
  return '1/' + Math.round(oneIn).toLocaleString();
}

function getOddsLabel(rarity) {
  return rarity.debugOdds ?? formatOneIn(rarity.weight);
}

// ── Toast trigger threshold ───────────────────────────────────
// Any rarity rarer than 1/25 gets a toast (weight < 40)
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
    this.inventoryEl   = null;
    this.debugMenu     = null;
    this._init();
  }

  _init() {
    // Roll button
    const btnContainer = document.getElementById('btn-container');
    this.rollButton = new RollButton(btnContainer, () => this._handleRoll());

    // Result display
    const resultContainer = document.getElementById('result-container');
    this.resultDisplay = new ResultDisplay(resultContainer);

    // Panel refs
    this.statsEl     = document.getElementById('stats-panel');
    this.inventoryEl = document.getElementById('inventory-panel');

    // Initial renders
    this._renderOdds();
    this.updateStats();

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
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Reset all progress?')) {
          this.playerState.reset();
          this.resultDisplay.reset();
          this.updateStats();
        }
      });
    }

    // Luck button
    const luckBtn = document.getElementById('luck-btn');
    if (luckBtn) {
      luckBtn.addEventListener('click', () => {
        this.rollEngine.activateLuck('streak');
        this._showToast('🍀 Lucky Streak activated! (30s)', '#4ade80');
      });
    }

    // Debug menu — single source of truth for onRollComplete
    this.debugMenu = new DebugMenu(this.rollEngine, this.playerState);
    this.rollEngine.onRollComplete = (rarity, item) => {
      this.resultDisplay.showResult(rarity, item);
      this.updateStats();
      if (item) this._updateInventory(item, rarity);
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
    // onRollComplete handles display, stats, inventory, toast
    this.rollButton.setDisabled(false);
  }

  // ── Odds panel — rarest first, all 1/N format ────────────────
  _renderOdds() {
    const el = document.getElementById('odds-panel');
    if (!el) return;

    el.innerHTML = [...RARITY_ORDER].reverse().map(id => {
      const r    = RARITIES[id];
      const odds = getOddsLabel(r);
      const badge = r.badge ? `<span style="opacity:0.55;margin-right:3px">${r.badge}</span>` : '';
      return `
        <div class="odds-row">
          <span class="odds-label" style="color:${r.color}">${badge}${r.label}</span>
          <span class="odds-value" style="color:${r.color}">${odds}</span>
        </div>
      `;
    }).join('');
  }

  // ── Stats panel ──────────────────────────────────────────────
  updateStats() {
    if (!this.statsEl) return;
    const ps = this.playerState;

    // Rarity breakdown — rarest first, only show tiers the player has rolled
    const rarityRows = [...RARITY_ORDER].reverse()
      .filter(id => ps.getRarityCount(id) > 0)
      .map(id => {
        const r     = RARITIES[id];
        const badge = r.badge ? r.badge + ' ' : '';
        return `
          <div class="stat-row">
            <span style="color:${r.color}">${badge}${r.label}</span>
            <span class="stat-val" style="color:${r.color}">${ps.getRarityCount(id)}</span>
          </div>
        `;
      }).join('');

    // Pity counters — only show tracked tiers
    const pityRows = Object.entries(ps.rollsSinceLast)
      .filter(([id]) => RARITIES[id])
      .map(([id, count]) => {
        const r = RARITIES[id];
        return `
          <div class="stat-row">
            <span style="color:${r.color};opacity:0.65">Pity · ${r.label}</span>
            <span class="stat-val" style="color:${r.color};opacity:0.8">${count}</span>
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
  }

  // ── Inventory panel ──────────────────────────────────────────
  _updateInventory(item, rarity) {
    if (!this.inventoryEl || !item) return;
    const count = this.playerState.getInventoryCount(item.id);

    let card = this.inventoryEl.querySelector(`[data-item="${item.id}"]`);
    if (!card) {
      card = document.createElement('div');
      card.className = 'inv-card';
      card.setAttribute('data-item', item.id);
      card.style.setProperty('--card-color', rarity.color);
      card.style.setProperty('--card-glow',  rarity.glowColor);
      this.inventoryEl.prepend(card);
    }

    card.innerHTML = `
      <span class="inv-card__icon">${item.icon}</span>
      <span class="inv-card__name">${item.name}</span>
      <span class="inv-card__count">x${count}</span>
    `;

    card.classList.remove('inv-card--new');
    void card.offsetWidth;
    card.classList.add('inv-card--new');
  }

  // ── Toast ────────────────────────────────────────────────────
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