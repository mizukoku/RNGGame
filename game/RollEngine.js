// game/RollEngine.js
import { RarityTable }    from './RarityTable.js';
import { LuckSystem }     from './LuckSystem.js';
import { CraftingSystem } from './CraftingSystem.js';

export class RollEngine {
  constructor(engine, cutsceneManager, playerState) {
    this.engine           = engine;
    this.cutsceneManager  = cutsceneManager;
    this.playerState      = playerState;
    this.rarityTable      = new RarityTable();
    this.luckSystem       = new LuckSystem();
    this.craftingSystem   = new CraftingSystem(playerState);
    this.rolling          = false;
    this.onRollComplete   = null; // callback(rarity, item)
  }

  async roll() {
    if (this.rolling) return null;
    this.rolling = true;

    // Tick crafted buffs and get their combined multiplier
    const craftedMult = this.craftingSystem.tickAndGetMultiplier();

    const luck = this.luckSystem.getCurrentLuck()
               * this.playerState.getLuckBonus()
               * craftedMult;

    const rarity = this.rarityTable.roll(luck);
    const item   = this.rarityTable.rollItem(rarity);

    this.playerState.recordRoll(rarity, item);
    // Persist updated buff rolls
    this.playerState.save();

    await this.engine.playCutscene(rarity.cutscene, rarity);

    this.rolling = false;
    if (this.onRollComplete) this.onRollComplete(rarity, item);

    return { rarity, item };
  }

  getLuckMultiplier() {
    const craftedMult = this.playerState.craftedBuffs
      .filter(b => b.rollsRemaining > 0)
      .reduce((acc, b) => acc * b.multiplier, 1.0);
    return this.luckSystem.getCurrentLuck()
         * this.playerState.getLuckBonus()
         * craftedMult;
  }

  getOdds() { return this.rarityTable.getAllOdds(); }

  activateLuck(type) {
    switch (type) {
      case 'streak':  this.luckSystem.activateLuckyStreak(); break;
      case 'holy':    this.luckSystem.activateHolyLight();   break;
      case 'glimpse': this.luckSystem.activateGlimpse();     break;
    }
  }
}