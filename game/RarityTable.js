// game/RarityTable.js
import { RARITIES, RARITY_ORDER } from "../config/RarityConfig.js";

// ─── Two-pass roll approach ────────────────────────────────────────────────────
//
//  The old system applied Math.pow(normalizedRoll, luck) across the weight table.
//  That is NOT linear — with luck=2 a 1/1,000,000 aura became 1/1,000 (1000×).
//
//  The fix: split every roll into two independent passes.
//
//  Pass 1 — Standard weight-table roll. Completely unaffected by luck.
//           This preserves all the normal distribution properties.
//
//  Pass 2 — For each rarity RARER than the base result, run an independent
//           bonus check. First success (rarest-first) wins.
//
//             bonusChance(X) = (luck − 1) × (weight_X / totalWeight)
//
//  Why this gives strictly linear odds:
//    P(X via pass1) = weight_X / total
//    P(X via pass2) ≈ (luck − 1) × weight_X / total
//    Total P(X)     ≈ luck × weight_X / total   ✓
//
//  With luck = 21x and THEJUDGEMENT (1/1,000,000):
//    P = 21 / 1,000,000   ← exactly what the UI shows
//
// ─── Adding new auras ─────────────────────────────────────────────────────────
//
//  Add to RARITIES and RARITY_ORDER in RarityConfig.js. Done.
//  totalWeight and the iteration order are both recomputed from config here.

/** Rarities with weight above this threshold are NOT eligible for luck upgrades.
 *  COMMON (600) and UNCOMMON (250) are excluded — they're already near-certain
 *  and luck shouldn't push them past ~100%. Everything from RARE (100) down is eligible. */
const LUCK_BONUS_MAX_WEIGHT = 150;

export class RarityTable {
  constructor(luckSystem) {
    this.luckSystem = luckSystem;
    this.rarities = RARITIES;

    // Recomputed from config — add a rarity to RarityConfig and it just works.
    this.totalWeight = Object.values(RARITIES).reduce(
      (s, r) => s + r.weight,
      0,
    );

    // Pre-sorted rarest → most-common for efficient bonus-check iteration.
    this._rarityOrderDesc = [...RARITY_ORDER].reverse();
  }

  // ── Main roll ──────────────────────────────────────────────────────────────

  roll() {
    const luck = this.luckSystem.getCurrentLuck();

    // ── Pass 1: standard weight-table roll ────────────────────────────────────
    const raw = Math.random() * this.totalWeight;
    const baseRarity = this._resolve(raw);

    // ── Pass 2: bonus upgrade checks ─────────────────────────────────────────
    //
    //  Only runs when luck > 1. Iterates rarest → common, checks each rarity
    //  that is rarer than the base result and within the eligible weight tier.
    //  First success returns immediately (rarest possible upgrade wins).
    if (luck > 1.01) {
      for (const key of this._rarityOrderDesc) {
        const rarity = RARITIES[key];

        // Only check rarities that are genuinely rarer than what we rolled.
        if (rarity.weight >= baseRarity.weight) continue;

        // Skip COMMON/UNCOMMON — not eligible for luck boosts.
        if (rarity.weight > LUCK_BONUS_MAX_WEIGHT) continue;

        const baseChance = rarity.weight / this.totalWeight;
        const bonusChance = (luck - 1) * baseChance;

        if (Math.random() < bonusChance) {
          this.luckSystem.consumeRoll();
          return rarity;
        }
      }
    }

    this.luckSystem.consumeRoll();
    return baseRarity;
  }

  // ── Internals ──────────────────────────────────────────────────────────────

  /** Standard weight-table resolver — no luck. */
  _resolve(roll) {
    let cursor = 0;
    for (const key of this._rarityOrderDesc) {
      cursor += RARITIES[key].weight;
      if (roll <= cursor) return RARITIES[key];
    }
    return RARITIES.COMMON;
  }

  rollItem(rarity) {
    return rarity.items[Math.floor(Math.random() * rarity.items.length)];
  }

  // ── Odds helpers ───────────────────────────────────────────────────────────

  /** Base odds (no luck) for a rarity, as a percentage string. */
  getOdds(rarityId) {
    const r = RARITIES[rarityId];
    if (!r) return 0;
    return ((r.weight / this.totalWeight) * 100).toFixed(2);
  }

  /** Base odds for all rarities. Used by the UI odds panel. */
  getAllOdds() {
    return RARITY_ORDER.map((id) => ({
      id,
      label: RARITIES[id].label,
      color: RARITIES[id].color,
      odds: this.getOdds(id),
    }));
  }

  /**
   * Luck-adjusted effective odds for a specific rarity.
   * Reflects what the two-pass system actually delivers.
   *
   * @param {string} rarityId
   */
  getEffectiveOdds(rarityId) {
    const r = RARITIES[rarityId];
    if (!r) return null;

    const baseChance = r.weight / this.totalWeight;
    const luck = this.luckSystem.getCurrentLuck();
    const eligible = r.weight <= LUCK_BONUS_MAX_WEIGHT;
    const effective = eligible ? Math.min(baseChance * luck, 1) : baseChance;

    const fmt = (p) =>
      p >= 0.01
        ? (p * 100).toFixed(2) + "%"
        : "1 / " + Math.round(1 / p).toLocaleString();

    return {
      base: fmt(baseChance),
      effective: fmt(effective),
      multiplier: +(effective / baseChance).toFixed(2),
    };
  }
}
