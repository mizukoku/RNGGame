// game/RollEngine.js
import { RarityTable } from "./RarityTable.js";
import { LuckSystem } from "./LuckSystem.js";
import { CraftingSystem } from "./CraftingSystem.js";

export class RollEngine {
  constructor(engine, cutsceneManager, playerState) {
    this.engine = engine;
    this.cutsceneManager = cutsceneManager;
    this.playerState = playerState;

    // LuckSystem must be created first — both RarityTable and CraftingSystem depend on it
    this.luckSystem = new LuckSystem();
    this.rarityTable = new RarityTable(this.luckSystem);
    this.craftingSystem = new CraftingSystem(playerState, this.luckSystem);

    this.rolling = false;
    this.onRollComplete = null; // callback(rarity, item)
  }

  async roll() {
    if (this.rolling) return null;
    this.rolling = true;

    // ── Luck snapshot before the roll ────────────────────────────────────────
    const luck = this.luckSystem.getCurrentLuck();
    const modifiers = this.luckSystem.getActiveModifiers();
    const tier = this.luckSystem.getLuckTier();

    if (modifiers.length === 0) {
    } else {
      const buffSummary = modifiers
        .map((m) => {
          const strength = m.currentStrength.toFixed(2);
          const status =
            m.rollsLeft !== null
              ? `${m.rollsLeft} rolls left`
              : m.remaining !== null
                ? `${(m.remaining / 1000).toFixed(1)}s left`
                : "permanent";
          return `  • ${m.name}: ×${strength} (${status})`;
        })
        .join("\n");
    }
    // ─────────────────────────────────────────────────────────────────────────

    const rarity = this.rarityTable.roll();
    const item = this.rarityTable.rollItem(rarity);

    // Log the result alongside the luck that produced it
    const totalWeight = this.rarityTable.totalWeight;
    const baseOneIn = Math.round(totalWeight / rarity.weight);
    const luckyOneIn = Math.round(baseOneIn / luck);
    const oddsStr =
      luck <= 1.01
        ? `1/${baseOneIn.toLocaleString()}`
        : `${luck.toFixed(luck % 1 === 0 ? 0 : 2)}/${baseOneIn.toLocaleString()} (≈1/${luckyOneIn.toLocaleString()})`;

    this.playerState.recordRoll(rarity, item);
    this.playerState.save();

    await this.engine.playCutscene(rarity.cutscene, rarity);

    this.rolling = false;
    if (this.onRollComplete) this.onRollComplete(rarity, item);

    return { rarity, item };
  }

  // Returns the current effective luck for display in the UI
  getLuckMultiplier() {
    return this.luckSystem.getCurrentLuck() * this.playerState.getLuckBonus();
  }

  getOdds() {
    return this.rarityTable.getAllOdds();
  }

  activateLuck(type) {
    switch (type) {
      case "streak":
        this.luckSystem.activateLuckyStreak();
        break;
      case "holy":
        this.luckSystem.activateHolyLight();
        break;
      case "glimpse":
        this.luckSystem.activateGlimpse();
        break;
    }
  }
}
