// game/LuckSystem.js
// v4 — Pure additive stacking. No compression. No cap.
//
// ─── How luck stacks ──────────────────────────────────────────────────────────
//
//  luck = sum of all active modifier multipliers (minimum 1.0)
//
//  Examples:
//    No buffs                     →  1x
//    cosmic_brew (1.6x) active    →  1.6x
//    nexus_crown (4x) active      →  4x
//    apex 18x + timed 3x         →  21x   ← what you see IS what you get
//    dreaming_rebirth (750x) only →  750x
//    final_verdict (1000x) only   →  1000x
//
//  The displayed luck IS the exact multiplier applied to every rarity's base
//  chance. 21x luck on a 1/1,000,000 aura = 21/1,000,000. Nothing hidden.
//
// ─── How luck affects rolls (see RarityTable.js) ─────────────────────────────
//
//  Two-pass roll:
//    Pass 1 — standard weight-table roll (completely unaffected by luck)
//    Pass 2 — independent bonus upgrade checks for rarities rarer than
//             the base result:  bonusChance = (luck − 1) × baseChance
//
//  Total effective P(rarity X) ≈ baseChance × luck  (strictly linear ✓)
//
// ─── Modifier types ───────────────────────────────────────────────────────────
//
//   duration-based  — expires after N milliseconds  (duration: ms)
//   roll-based      — expires after N rolls          (maxRolls: N)
//   permanent       — never expires                  (both null)
//
//   Duration modifiers decay with ease-out cubic (strong start, gentle tail).
//   Roll modifiers do NOT decay — they're full strength until the last roll.
//
// ─── Adding new crafts ────────────────────────────────────────────────────────
//
//   Add to CraftingConfig.js. This file needs zero changes.

export class LuckSystem {
  constructor() {
    this.baseLuck = 1.0;
    this.modifiers = [];
  }

  // ── Modifier management ────────────────────────────────────────────────────

  /**
   * @param {string}      name
   * @param {number}      multiplier   The displayed luck value (e.g. 18.0 shows as ×18)
   * @param {number|null} duration     Ms until expiry, or null
   * @param {number|null} maxRolls     Roll count until expiry, or null
   */
  addModifier(name, multiplier, duration = null, maxRolls = null) {
    const existing = this.modifiers.find((m) => m.name === name);

    // Roll-based modifier already active → stack rolls instead of resetting
    if (existing && maxRolls !== null && existing.maxRolls !== null) {
      existing.maxRolls += maxRolls;
      return existing;
    }

    this.removeModifier(name);
    this.modifiers.push({
      name,
      multiplier,
      duration,
      maxRolls,
      rollsUsed: 0,
      startTime: Date.now(),
    });
  }

  removeModifier(name) {
    this.modifiers = this.modifiers.filter((m) => m.name !== name);
  }

  /**
   * Call once per roll attempt. Ticks roll-based modifiers and prunes expired ones.
   */
  consumeRoll() {
    for (const m of this.modifiers) {
      if (m.maxRolls !== null) m.rollsUsed++;
    }
    this._pruneExpired();
  }

  // ── Core calculation ───────────────────────────────────────────────────────

  /**
   * Returns the current luck multiplier — the same number shown in the UI.
   *
   * luck = sum of all active modifier values (with decay on duration mods)
   *
   * With no active buffs returns baseLuck (1.0).
   * Clamped to minimum baseLuck so decaying mods can never pull below 1×.
   */
  getCurrentLuck() {
    this._pruneExpired();

    if (this.modifiers.length === 0) return this.baseLuck;

    const sum = this.modifiers.reduce(
      (acc, m) => acc + m.multiplier * this._decayFactor(m),
      0,
    );

    return Math.max(this.baseLuck, sum);
  }

  /** Ease-out cubic decay for duration-based modifiers (1.0 → 0.0, strong start). */
  _decayFactor(mod) {
    if (mod.duration === null) return 1.0; // roll-based and permanent = no decay
    const t = Math.min((Date.now() - mod.startTime) / mod.duration, 1);
    return 1 - t * t * t;
  }

  _pruneExpired() {
    const now = Date.now();
    this.modifiers = this.modifiers.filter((m) => {
      if (m.duration !== null && now - m.startTime >= m.duration) return false;
      if (m.maxRolls !== null && m.rollsUsed >= m.maxRolls) return false;
      return true;
    });
  }

  // ── Inspection ─────────────────────────────────────────────────────────────

  getActiveModifiers() {
    this._pruneExpired();
    return this.modifiers.map((m) => ({
      name: m.name,
      baseMultiplier: m.multiplier,
      currentStrength: +(m.multiplier * this._decayFactor(m)).toFixed(3),
      remaining:
        m.duration !== null
          ? Math.max(0, m.duration - (Date.now() - m.startTime))
          : null,
      rollsLeft:
        m.maxRolls !== null ? Math.max(0, m.maxRolls - m.rollsUsed) : null,
    }));
  }

  /**
   * Debug breakdown for a specific aura rarity.
   * @param {number} baseChance  e.g. 0.000001 for 1/1,000,000
   */
  getLuckBreakdown(baseChance) {
    const luck = this.getCurrentLuck();
    const effective = Math.min(baseChance * luck, 1);
    return {
      luck: +luck.toFixed(2),
      baseChance: `1 / ${Math.round(1 / baseChance).toLocaleString()}`,
      effectiveChance: `1 / ${Math.round(1 / effective).toLocaleString()}`,
    };
  }

  /** Tier label for UI / audio cues */
  getLuckTier() {
    const luck = this.getCurrentLuck();
    if (luck < 2) return "normal";
    if (luck < 5) return "blessed";
    if (luck < 15) return "favored";
    if (luck < 50) return "divine";
    if (luck < 200) return "transcendent";
    return "apex";
  }

  // ── Built-in timed events ──────────────────────────────────────────────────

  activateLuckyStreak() {
    this.addModifier("Lucky Streak", 1.5, 30_000);
  }
  activateHolyLight() {
    this.addModifier("Holy Light", 2.5, 15_000);
  }
  activateGlimpse() {
    this.addModifier("Glimpse", 4.0, 5_000);
  }
}
