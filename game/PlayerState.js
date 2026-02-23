// game/PlayerState.js

const STORAGE_KEY = 'solrng_player';

export class PlayerState {
  constructor() {
    this.totalRolls     = 0;
    this.rollsSinceLast = {
      LEGENDARY: 0, MYTHIC: 0, DIVINE: 0,
      SUPERNOVA: 0, SERAPHIM: 0, CONVERGENCE: 0, MATRIX: 0, ELDRITCH: 0, TIMECOLLAPSE: 0, PIXELGENESIS: 0,
    };
    this.inventory    = {};
    this.rarityStats  = {};
    this.lastRarity   = null;
    this.craftedBuffs = [];
    this.load();
  }

  load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        this.totalRolls     = data.totalRolls     ?? 0;
        this.rollsSinceLast = { ...this.rollsSinceLast, ...(data.rollsSinceLast ?? {}) };
        this.inventory      = data.inventory      ?? {};
        this.rarityStats    = data.rarityStats    ?? {};
        this.lastRarity     = data.lastRarity     ?? null;
        this.craftedBuffs   = data.craftedBuffs   ?? [];
      }
    } catch (e) { console.warn('[PlayerState] Failed to load:', e); }
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        totalRolls:     this.totalRolls,
        rollsSinceLast: this.rollsSinceLast,
        inventory:      this.inventory,
        rarityStats:    this.rarityStats,
        lastRarity:     this.lastRarity,
        craftedBuffs:   this.craftedBuffs,
      }));
    } catch (e) { console.warn('[PlayerState] Failed to save:', e); }
  }

  recordRoll(rarity, item) {
    this.totalRolls++;
    this.lastRarity = rarity.id;
    this.rarityStats[rarity.id] = (this.rarityStats[rarity.id] ?? 0) + 1;
    if (item) this.inventory[item.id] = (this.inventory[item.id] ?? 0) + 1;
    for (const key of Object.keys(this.rollsSinceLast)) {
      if (rarity.id === key) this.rollsSinceLast[key] = 0;
      else                   this.rollsSinceLast[key]++;
    }
    this.save();
  }

  addCraftedBuff(buff) {
    const existing = this.craftedBuffs.find(b => b.recipeId === buff.recipeId);
    if (existing) {
      existing.rollsRemaining = Math.min(
        existing.rollsRemaining + buff.rollsRemaining,
        buff.rolls * 3
      );
    } else {
      this.craftedBuffs.push({ ...buff });
    }
  }

  getInventoryCount(itemId) { return this.inventory[itemId] ?? 0; }
  getRarityCount(rarityId)  { return this.rarityStats[rarityId] ?? 0; }

  reset() {
    this.totalRolls     = 0;
    this.rollsSinceLast = {
      LEGENDARY: 0, MYTHIC: 0, DIVINE: 0,
      SUPERNOVA: 0, SERAPHIM: 0, CONVERGENCE: 0, MATRIX: 0, ELDRITCH: 0, TIMECOLLAPSE: 0, PIXELGENESIS: 0,
    };
    this.inventory    = {};
    this.rarityStats  = {};
    this.lastRarity   = null;
    this.craftedBuffs = [];
    this.save();
  }

  getLuckBonus() {
    const pity = this.rollsSinceLast.LEGENDARY ?? 0;
    if (pity < 50)  return 1.0;
    if (pity < 100) return 1.05;
    if (pity < 200) return 1.1;
    return 1.15;
  }
}