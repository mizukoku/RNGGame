// game/RarityTable.js
import { RARITIES, RARITY_ORDER } from "../config/RarityConfig.js";

export class RarityTable {
  constructor(luckSystem) {
    this.luckSystem = luckSystem;
    this.rarities = RARITIES;
    this.totalWeight = Object.values(RARITIES).reduce(
      (s, r) => s + r.weight,
      0,
    );
  }

  roll() {
    const luck = this.luckSystem.getCurrentLuck(); // capped 1.0–6.0, safe as exponent
    const raw = Math.random() * this.totalWeight;
    const biased = this._applyLuck(raw, luck);
    const rarity = this._resolve(biased);
    this.luckSystem.consumeRoll();
    return rarity;
  }

  _applyLuck(raw, luck) {
    if (luck <= 1) return raw;
    const normalized = raw / this.totalWeight;
    const shifted = Math.pow(normalized, luck);
    return shifted * this.totalWeight;
  }

  _resolve(roll) {
    let cursor = 0;
    for (const key of [...RARITY_ORDER].reverse()) {
      cursor += RARITIES[key].weight;
      if (roll <= cursor) return RARITIES[key];
    }
    return RARITIES.COMMON;
  }

  rollItem(rarity) {
    return rarity.items[Math.floor(Math.random() * rarity.items.length)];
  }

  getOdds(rarityId) {
    const r = RARITIES[rarityId];
    if (!r) return 0;
    return ((r.weight / this.totalWeight) * 100).toFixed(2);
  }

  getAllOdds() {
    return RARITY_ORDER.map((id) => ({
      id,
      label: RARITIES[id].label,
      color: RARITIES[id].color,
      odds: this.getOdds(id),
    }));
  }
}
