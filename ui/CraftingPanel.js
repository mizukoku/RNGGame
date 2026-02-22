// ui/CraftingPanel.js
import { RECIPES, CATEGORIES } from '../config/CraftingConfig.js';
import { RARITIES, RARITY_ORDER } from '../config/RarityConfig.js';

export class CraftingPanel {
  constructor(container, rollEngine, playerState, onCraft) {
    this.container   = container;
    this.rollEngine  = rollEngine;
    this.playerState = playerState;
    this.onCraft     = onCraft; // callback(buff) for toast/notification
    this._activeTab  = 'inventory';
    this._el         = null;
    this._render();
  }

  // ── Build the whole panel structure ──────────────────────────
  _render() {
    this._el = document.createElement('div');
    this._el.className = 'cp-root';
    this._el.innerHTML = `
      <div class="cp-tabs">
        <button class="cp-tab cp-tab--active" data-tab="inventory">📦 Collection</button>
        <button class="cp-tab" data-tab="craft">⚗️ Craft</button>
      </div>
      <div class="cp-body">
        <div class="cp-pane" id="cp-pane-inventory"></div>
        <div class="cp-pane cp-pane--hidden" id="cp-pane-craft"></div>
      </div>
    `;
    this.container.appendChild(this._el);

    // Tab switching
    this._el.querySelectorAll('.cp-tab').forEach(btn => {
      btn.addEventListener('click', () => this._switchTab(btn.dataset.tab));
    });

    this._buildInventoryPane();
    this._buildCraftPane();
  }

  _switchTab(tab) {
    this._activeTab = tab;
    this._el.querySelectorAll('.cp-tab').forEach(b => {
      b.classList.toggle('cp-tab--active', b.dataset.tab === tab);
    });
    this._el.querySelectorAll('.cp-pane').forEach(p => {
      p.classList.toggle('cp-pane--hidden', !p.id.endsWith(tab));
    });
    if (tab === 'craft') this._refreshCraft();
  }

  // ── INVENTORY PANE ───────────────────────────────────────────
  _buildInventoryPane() {
    this._invPane = this._el.querySelector('#cp-pane-inventory');
    this._invPane.innerHTML = `<div class="cp-inv-grid" id="cp-inv-grid"></div>`;
    this._invGrid = this._invPane.querySelector('#cp-inv-grid');
    this.refreshInventory();
  }

  refreshInventory() {
    if (!this._invGrid) return;
    const inv = this.playerState.inventory;

    // Group items by rarity
    const groups = [...RARITY_ORDER].reverse()
      .map(id => ({
        rarity: RARITIES[id],
        items: (RARITIES[id]?.items ?? [])
          .map(item => ({ ...item, count: inv[item.id] ?? 0 }))
          .filter(i => i.count > 0),
      }))
      .filter(g => g.items.length > 0);

    if (groups.length === 0) {
      this._invGrid.innerHTML = `
        <div class="cp-empty">Roll to collect items.<br>They appear here.</div>
      `;
      return;
    }

    this._invGrid.innerHTML = groups.map(g => `
      <div class="cp-inv-section">
        <div class="cp-inv-section-label" style="color:${g.rarity.color}">
          ${g.rarity.badge ? g.rarity.badge + ' ' : ''}${g.rarity.label}
        </div>
        ${g.items.map(item => `
          <div class="cp-inv-card" style="--cc:${g.rarity.color}">
            <span class="cp-inv-icon">${item.icon}</span>
            <span class="cp-inv-name">${item.name}</span>
            <span class="cp-inv-count">×${item.count}</span>
          </div>
        `).join('')}
      </div>
    `).join('');
  }

  // Flash a card when a new item is received
  flashItem(itemId) {
    const cards = this._invGrid?.querySelectorAll('.cp-inv-card');
    cards?.forEach(card => {
      if (card.querySelector('.cp-inv-name')?.textContent === this._getItemName(itemId)) {
        card.classList.remove('cp-inv-card--flash');
        void card.offsetWidth;
        card.classList.add('cp-inv-card--flash');
      }
    });
  }

  _getItemName(itemId) {
    for (const r of Object.values(RARITIES)) {
      const item = r.items?.find(i => i.id === itemId);
      if (item) return item.name;
    }
    return '';
  }

  // ── CRAFT PANE ───────────────────────────────────────────────
  _buildCraftPane() {
    this._craftPane = this._el.querySelector('#cp-pane-craft');
    this._craftPane.innerHTML = `
      <div class="cp-active-buffs" id="cp-active-buffs"></div>
      <div class="cp-recipes" id="cp-recipes"></div>
    `;
    this._refreshCraft();
  }

  _refreshCraft() {
    this._renderActiveBuffs();
    this._renderRecipes();
  }

  _renderActiveBuffs() {
    const el = this._el.querySelector('#cp-active-buffs');
    if (!el) return;
    const buffs = this.rollEngine.craftingSystem.getActiveBuffs();

    if (buffs.length === 0) {
      el.innerHTML = '';
      return;
    }

    el.innerHTML = `
      <div class="cp-buffs-title">ACTIVE BUFFS</div>
      ${buffs.map(b => `
        <div class="cp-buff-row" style="--bc:${b.color}">
          <span class="cp-buff-icon">${b.icon}</span>
          <span class="cp-buff-name">${b.name}</span>
          <span class="cp-buff-mult">×${b.multiplier}</span>
          <span class="cp-buff-rolls">${b.rollsRemaining} rolls</span>
        </div>
      `).join('')}
    `;
  }

  _renderRecipes() {
    const el = this._el.querySelector('#cp-recipes');
    if (!el) return;

    // Group by category
    const byCategory = {};
    for (const recipe of RECIPES) {
      if (!byCategory[recipe.category]) byCategory[recipe.category] = [];
      byCategory[recipe.category].push(recipe);
    }

    el.innerHTML = CATEGORIES.map(cat => {
      const recipes = byCategory[cat.id];
      if (!recipes?.length) return '';

      return `
        <div class="cp-cat-label" style="color:${cat.color}">${cat.label}</div>
        ${recipes.map(r => this._recipeCard(r)).join('')}
      `;
    }).join('');

    // Bind craft buttons
    el.querySelectorAll('.cp-craft-btn').forEach(btn => {
      btn.addEventListener('click', () => this._doCraft(btn.dataset.recipe));
    });
  }

  _recipeCard(recipe) {
    const status = this.rollEngine.craftingSystem.getRecipeStatus(recipe.id);
    const canCraft = status?.canCraft ?? false;

    const ingHtml = status.ingredients.map(ing => {
      const ok = ing.have >= ing.required;
      return `
        <span class="cp-ing ${ok ? 'cp-ing--ok' : 'cp-ing--short'}"
              style="--ic:${ing.color}">
          ${ing.have}/${ing.required}
          <span class="cp-ing-label">${ing.label}</span>
        </span>
      `;
    }).join('<span class="cp-ing-plus">+</span>');

    return `
      <div class="cp-recipe ${canCraft ? 'cp-recipe--ready' : ''}"
           style="--rc:${recipe.buff.color}">
        <div class="cp-recipe-head">
          <span class="cp-recipe-icon">${recipe.icon}</span>
          <div class="cp-recipe-info">
            <div class="cp-recipe-name">${recipe.name}</div>
            <div class="cp-recipe-desc">${recipe.desc}</div>
          </div>
          <div class="cp-recipe-buff">
            <span class="cp-recipe-mult">×${recipe.buff.multiplier}</span>
            <span class="cp-recipe-rolls">${recipe.buff.rolls} rolls</span>
          </div>
        </div>
        <div class="cp-recipe-foot">
          <div class="cp-ing-row">${ingHtml}</div>
          <button class="cp-craft-btn ${canCraft ? 'cp-craft-btn--ready' : 'cp-craft-btn--locked'}"
                  data-recipe="${recipe.id}"
                  ${canCraft ? '' : 'disabled'}>
            ${canCraft ? 'CRAFT' : 'NEED MORE'}
          </button>
        </div>
      </div>
    `;
  }

  _doCraft(recipeId) {
    const buff = this.rollEngine.craftingSystem.craft(recipeId);
    if (!buff) return;

    // Refresh both panes
    this.refreshInventory();
    this._refreshCraft();

    if (this.onCraft) this.onCraft(buff);
  }

  // Full refresh (called after any roll)
  refresh() {
    this.refreshInventory();
    if (this._activeTab === 'craft') this._refreshCraft();
    else this._renderActiveBuffs(); // keep buff bar live even on inventory tab
  }
}