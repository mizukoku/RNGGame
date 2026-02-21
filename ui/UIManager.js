// ui/UIManager.js
import { RollButton }    from './RollButton.js';
import { ResultDisplay } from './ResultDisplay.js';
import { DebugMenu }     from './DebugMenu.js';
import { RARITY_ORDER, RARITIES } from '../config/RarityConfig.js';

export class UIManager {
  constructor(rollEngine, playerState) {
    this.rollEngine = rollEngine;
    this.playerState = playerState;
    this.rollButton = null;
    this.resultDisplay = null;
    this.statsEl = null;
    this.inventoryEl = null;
    this.toastQueue = [];
    this.debugMenu = null;
    this._init();
  }

  _init() {
    // Roll button
    const btnContainer = document.getElementById('btn-container');
    this.rollButton = new RollButton(btnContainer, () => this._handleRoll());

    // Result display
    const resultContainer = document.getElementById('result-container');
    this.resultDisplay = new ResultDisplay(resultContainer);

    // Stats
    this.statsEl = document.getElementById('stats-panel');
    this.inventoryEl = document.getElementById('inventory-panel');

    // Odds panel
    this._renderOdds();

    // Initial stats
    this.updateStats();

    // Auto-roll button
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

    // Reset button
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

    // Luck boost button
    const luckBtn = document.getElementById('luck-btn');
    if (luckBtn) {
      luckBtn.addEventListener('click', () => {
        this.rollEngine.activateLuck('streak');
        this._showToast('🍀 Lucky Streak activated! (30s)', '#4ade80');
      });
    }

    // Debug menu — wire result display so fired scenes update the card
    this.debugMenu = new DebugMenu(this.rollEngine, this.playerState);
    this.rollEngine.onRollComplete = (rarity, item) => {
      this.resultDisplay.showResult(rarity, item);
      this.updateStats();
      if (item) this._updateInventory(item, rarity);
      if (['RARE','EPIC','LEGENDARY','MYTHIC'].includes(rarity.id)) {
        const msg = rarity.id === 'MYTHIC'    ? '☄ MYTHIC!! 1/1000 — Comet Strike!' :
                    rarity.id === 'LEGENDARY'  ? '👑 LEGENDARY! Incredible!'          :
                    rarity.id === 'EPIC'        ? '💜 EPIC roll!'                      : '💎 Rare find!';
        this._showToast(msg, rarity.color);
      }
    };
  }

  async _handleRoll() {
    if (this.rollEngine.rolling) return;
    this.rollButton.setDisabled(true);
    this.resultDisplay.reset();

    const result = await this.rollEngine.roll();

    // onRollComplete handles display, stats, toast
    this.rollButton.setDisabled(false);
  }

  _renderOdds() {
    const el = document.getElementById('odds-panel');
    if (!el) return;
    const odds = this.rollEngine.getOdds();
    el.innerHTML = odds.map(o => `
      <div class="odds-row">
        <span class="odds-label" style="color:${o.color}">${o.label}</span>
        <span class="odds-value" style="color:${o.color}">${o.odds}%</span>
      </div>
    `).join('');
  }

  updateStats() {
    if (!this.statsEl) return;
    const ps = this.playerState;
    this.statsEl.innerHTML = `
      <div class="stat-row"><span>Total Rolls</span><span class="stat-val">${ps.totalRolls}</span></div>
      ${RARITY_ORDER.filter(id => ps.getRarityCount(id) > 0).map(id => `
        <div class="stat-row">
          <span style="color:${RARITIES[id].color}">${RARITIES[id].label}</span>
          <span class="stat-val" style="color:${RARITIES[id].color}">${ps.getRarityCount(id)}</span>
        </div>
      `).join('')}
      <div class="stat-row"><span>Pity (Legendary)</span><span class="stat-val">${ps.rollsSinceLast.LEGENDARY}</span></div>
    `;
  }

  _updateInventory(item, rarity) {
    if (!this.inventoryEl || !item) return;
    const count = this.playerState.getInventoryCount(item.id);
    // Find existing card or create new one
    let card = this.inventoryEl.querySelector(`[data-item="${item.id}"]`);
    if (!card) {
      card = document.createElement('div');
      card.className = 'inv-card';
      card.setAttribute('data-item', item.id);
      card.style.setProperty('--card-color', rarity.color);
      card.style.setProperty('--card-glow', rarity.glowColor);
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

  _showToast(message, color = '#fff') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.color = color;
    toast.style.borderColor = color;
    toast.style.boxShadow = `0 0 20px ${color}44`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('toast--show'), 10);
    setTimeout(() => {
      toast.classList.remove('toast--show');
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  }
}