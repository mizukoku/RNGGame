// game/RollEngine.js
import { RarityTable } from './RarityTable.js';
import { LuckSystem } from './LuckSystem.js';

export class RollEngine {
  constructor(engine, cutsceneManager, playerState) {
    this.engine = engine;
    this.cutsceneManager = cutsceneManager;
    this.playerState = playerState;
    this.rarityTable = new RarityTable();
    this.luckSystem = new LuckSystem();
    this.rolling = false;
    this.onRollComplete = null; // callback(rarity, item)
  }

  async roll() {
    if (this.rolling) return null;
    this.rolling = true;

    const luck = this.luckSystem.getCurrentLuck() * this.playerState.getLuckBonus();
    const rarity = this.rarityTable.roll(luck);
    const item = this.rarityTable.rollItem(rarity);

    this.playerState.recordRoll(rarity, item);

    // Play cutscene
    await this.engine.playCutscene(rarity.cutscene, rarity);

    this.rolling = false;
    if (this.onRollComplete) this.onRollComplete(rarity, item);

    return { rarity, item };
  }

  getLuckMultiplier() {
    return this.luckSystem.getCurrentLuck() * this.playerState.getLuckBonus();
  }

  getOdds() {
    return this.rarityTable.getAllOdds();
  }

  activateLuck(type) {
    switch (type) {
      case 'streak': this.luckSystem.activateLuckyStreak(); break;
      case 'holy': this.luckSystem.activateHolyLight(); break;
      case 'glimpse': this.luckSystem.activateGlimpse(); break;
    }
  }
}
