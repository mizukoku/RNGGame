// game/LuckSystem.js
// Revamped: log compression, roll-count modifiers, hard cap 6.0

/**
 * Central luck pipeline. All luck — time-based buffs AND crafted buffs —
 * flows through here so logarithmic compression and the hard cap always apply.
 *
 * Modifier types:
 *   duration-based  — expires after N milliseconds  (duration: ms, maxRolls: null)
 *   roll-based      — expires after N rolls          (duration: null, maxRolls: N)
 *   permanent       — never expires                  (duration: null, maxRolls: null)
 *
 * Call consumeRoll() once per roll attempt so roll-based modifiers tick down.
 */

const LUCK_CAP = 6.0; // Absolute ceiling — even stacked apex crafts won't break this
const LOG_SCALE = 1.5; // Controls how aggressively diminishing returns compress bonuses

export class LuckSystem {
  constructor() {
    this.baseLuck = 1.0;
    this.modifiers = [];
  }

  // --- Modifier management --------------------------------------------------

  /**
   * @param {string}      name
   * @param {number}      multiplier   Raw multiplier value (e.g. 20.0)
   * @param {number|null} duration     Ms until expiry, or null
   * @param {number|null} maxRolls     Roll count until expiry, or null
   */
  // In LuckSystem.js
  addModifier(name, multiplier, duration = null, maxRolls = null) {
    const existing = this.modifiers.find((m) => m.name === name);

    // If it's a roll-based modifier that already exists, just add the rolls
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
   * Call once per roll attempt. Ticks down roll-based modifiers and prunes
   * any that have expired (by roll count or duration).
   */
  consumeRoll() {
    for (const m of this.modifiers) {
      if (m.maxRolls !== null) m.rollsUsed++;
    }
    this._pruneExpired();
  }

  // --- Core calculation -----------------------------------------------------

  /**
   * Returns effective luck after:
   *   1. Pruning expired modifiers
   *   2. Applying ease-out decay to duration-based modifiers
   *   3. Stacking bonuses with logarithmic diminishing returns
   *   4. Clamping to LUCK_CAP
   */
  getCurrentLuck() {
    this._pruneExpired();

    const rawStack = this.modifiers.reduce((acc, m) => {
      const decayed = m.multiplier * this._decayFactor(m);
      return acc + (decayed - 1); // Accumulate bonus above 1x
    }, 0);

    if (rawStack <= 0) return this.baseLuck;

    // f(x) = 1 + LOG_SCALE * ln(1 + x / LOG_SCALE)
    // At rawStack=19 (raw 20x recipe): effective ~4.92 — strong but not trivial
    // At rawStack=99 (raw 100x recipe): effective ~6.43, clamped to cap
    const compressed =
      this.baseLuck + LOG_SCALE * Math.log(1 + rawStack / LOG_SCALE);

    return Math.min(compressed, LUCK_CAP);
  }

  /** Ease-out cubic decay for duration-based modifiers. Roll-based = no decay. */
  _decayFactor(mod) {
    if (mod.duration === null) return 1.0;
    const t = Math.min((Date.now() - mod.startTime) / mod.duration, 1);
    return 1 - t * t * t; // 1.0 -> 0.0, strong start, gentle tail
  }

  _pruneExpired() {
    const now = Date.now();
    this.modifiers = this.modifiers.filter((m) => {
      if (m.duration !== null && now - m.startTime >= m.duration) return false;
      if (m.maxRolls !== null && m.rollsUsed >= m.maxRolls) return false;
      return true;
    });
  }

  // --- Roll resolution -------------------------------------------------------

  /**
   * Nudges the RNG roll using: nudgedRoll = roll ^ (1 / luck)
   * Luck biases toward success without guaranteeing it.
   *
   * luck=1.0 -> no change
   * luck=3.0 -> 0.5 roll becomes 0.794
   * luck=6.0 -> 0.5 roll becomes 0.891
   *
   * @param {number} threshold  Base drop chance 0-1 (e.g. 0.01 for 1%)
   */
  rollWithLuck(threshold) {
    const luck = this.getCurrentLuck();
    const nudgedRoll = Math.pow(Math.random(), 1 / luck);
    return nudgedRoll >= 1 - threshold;
  }

  /** Effective drop chance for UI: 1 - (1 - threshold)^luck */
  effectiveChance(threshold) {
    return 1 - Math.pow(1 - threshold, this.getCurrentLuck());
  }

  // --- Inspection ------------------------------------------------------------

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

  /** Tier label for UI / audio cues */
  getLuckTier() {
    const luck = this.getCurrentLuck();
    if (luck < 1.3) return "normal";
    if (luck < 1.8) return "blessed";
    if (luck < 2.5) return "favored";
    if (luck < 3.5) return "divine";
    if (luck < 5.0) return "transcendent";
    return "apex";
  }

  // --- Built-in timed events -------------------------------------------------

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
