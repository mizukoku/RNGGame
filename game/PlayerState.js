// game/PlayerState.js

const STORAGE_KEY = 'solrng_player';

export class PlayerState {
  constructor() {
    this.totalRolls      = 0;
    // Pity counters — rolls since last hit for each ultra-rare tier
    this.rollsSinceLast  = {
      LEGENDARY: 0,
      MYTHIC:    0,
      DIVINE:    0,
      SUPERNOVA: 0,
      SERAPHIM:  0,
    };
    this.inventory   = {}; // itemId → count
    this.rarityStats = {}; // rarityId → count
    this.lastRarity  = null;
    this.load();
  }

  load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        // Merge so new pity keys aren't lost on old saves
        this.totalRolls     = data.totalRolls     ?? 0;
        this.rollsSinceLast = { ...this.rollsSinceLast, ...(data.rollsSinceLast ?? {}) };
        this.inventory      = data.inventory      ?? {};
        this.rarityStats    = data.rarityStats    ?? {};
        this.lastRarity     = data.lastRarity     ?? null;
      }
    } catch (e) {
      console.warn('[PlayerState] Failed to load:', e);
    }
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        totalRolls:     this.totalRolls,
        rollsSinceLast: this.rollsSinceLast,
        inventory:      this.inventory,
        rarityStats:    this.rarityStats,
        lastRarity:     this.lastRarity,
      }));
    } catch (e) {
      console.warn('[PlayerState] Failed to save:', e);
    }
  }

  recordRoll(rarity, item) {
    this.totalRolls++;
    this.lastRarity = rarity.id;

    this.rarityStats[rarity.id] = (this.rarityStats[rarity.id] ?? 0) + 1;

    if (item) {
      this.inventory[item.id] = (this.inventory[item.id] ?? 0) + 1;
    }

    // Reset the hit tier, increment all others
    for (const key of Object.keys(this.rollsSinceLast)) {
      if (rarity.id === key) this.rollsSinceLast[key] = 0;
      else                   this.rollsSinceLast[key]++;
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
    this.totalRolls     = 0;
    this.rollsSinceLast = {
      LEGENDARY: 0,
      MYTHIC:    0,
      DIVINE:    0,
      SUPERNOVA: 0,
      SERAPHIM:  0,
    };
    this.inventory      = {};
    this.rarityStats    = {};
    this.lastRarity     = null;
    this.save();
  }

  // Passive luck bonus based on legendary pity
  getLuckBonus() {
    const pity = this.rollsSinceLast.LEGENDARY ?? 0;
    if (pity < 50)  return 1.0;
    if (pity < 100) return 1.05;
    if (pity < 200) return 1.1;
    return 1.15;
  }
}