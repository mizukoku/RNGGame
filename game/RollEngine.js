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

    // RarityTable.roll() reads luckSystem.getCurrentLuck() internally,
    // and calls luckSystem.consumeRoll() after resolving to tick down
    // roll-based crafted buffs. No manual multiplier wiring needed.
    const rarity = this.rarityTable.roll();
    const item = this.rarityTable.rollItem(rarity);

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
