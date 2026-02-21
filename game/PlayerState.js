// game/PlayerState.js

const STORAGE_KEY = 'solrng_player';

export class PlayerState {
  constructor() {
    this.totalRolls = 0;
    this.rollsSinceLast = { LEGENDARY: 0, MYTHIC: 0 };
    this.inventory = {}; // itemId -> count
    this.rarityStats = {}; // rarityId -> count
    this.lastRarity = null;
    this.load();
  }

  load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        Object.assign(this, data);
      }
    } catch (e) {
      console.warn('[PlayerState] Failed to load:', e);
    }
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        totalRolls: this.totalRolls,
        rollsSinceLast: this.rollsSinceLast,
        inventory: this.inventory,
        rarityStats: this.rarityStats,
        lastRarity: this.lastRarity,
      }));
    } catch (e) {
      console.warn('[PlayerState] Failed to save:', e);
    }
  }

  recordRoll(rarity, item) {
    this.totalRolls++;
    this.lastRarity = rarity.id;

    // Update rarity stats
    this.rarityStats[rarity.id] = (this.rarityStats[rarity.id] ?? 0) + 1;

    // Update inventory
    if (item) {
      this.inventory[item.id] = (this.inventory[item.id] ?? 0) + 1;
    }

    // Track pity counters
    for (const key of Object.keys(this.rollsSinceLast)) {
      if (rarity.id === key) this.rollsSinceLast[key] = 0;
      else this.rollsSinceLast[key]++;
    }

    this.save();
  }

  getInventoryCount(itemId) {
    return this.inventory[itemId] ?? 0;
  }

  getRarityCount(rarityId) {
    return this.rarityStats[rarityId] ?? 0;
  }

  reset() {
    this.totalRolls = 0;
    this.rollsSinceLast = { LEGENDARY: 0, MYTHIC: 0 };
    this.inventory = {};
    this.rarityStats = {};
    this.lastRarity = null;
    this.save();
  }

  getLuckBonus() {
    // Slight luck bonus based on pity
    const pity = this.rollsSinceLast.LEGENDARY ?? 0;
    if (pity < 50) return 1.0;
    if (pity < 100) return 1.05;
    if (pity < 200) return 1.1;
    return 1.15;
  }
}
