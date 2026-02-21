// game/RarityTable.js
import { RARITIES, RARITY_ORDER } from '../config/RarityConfig.js';

export class RarityTable {
  constructor() {
    this.rarities = RARITIES;
    this.totalWeight = Object.values(RARITIES).reduce((s, r) => s + r.weight, 0);
  }

  roll(luckMultiplier = 1.0) {
    // With luck, shift probability toward rarer items
    const raw = Math.random() * this.totalWeight;

    // Apply luck: higher luck = better chance at rarer items
    // We map the raw roll toward the rarer end
    const biased = this._applyLuck(raw, luckMultiplier);

    return this._resolve(biased);
  }

  _applyLuck(raw, luck) {
    if (luck <= 1) return raw;
    // Shift roll toward 0 (rarer end) based on luck
    const normalized = raw / this.totalWeight;
    const shifted = Math.pow(normalized, luck);
    return shifted * this.totalWeight;
  }

  _resolve(roll) {
    // Rarest items are at the low end
    let cursor = 0;
    const sorted = [...RARITY_ORDER].reverse(); // MYTHIC first
    for (const key of sorted) {
      cursor += RARITIES[key].weight;
      if (roll <= cursor) return RARITIES[key];
    }
    return RARITIES.COMMON;
  }

  rollItem(rarity) {
    const items = rarity.items;
    return items[Math.floor(Math.random() * items.length)];
  }

  getOdds(rarityId) {
    const r = RARITIES[rarityId];
    if (!r) return 0;
    return (r.weight / this.totalWeight * 100).toFixed(2);
  }

  getAllOdds() {
    return RARITY_ORDER.map(id => ({
      id,
      label: RARITIES[id].label,
      color: RARITIES[id].color,
      odds: this.getOdds(id),
    }));
  }
}
