// game/CraftingSystem.js
import { RECIPES } from '../config/CraftingConfig.js';
import { RARITIES } from '../config/RarityConfig.js';

export class CraftingSystem {
  constructor(playerState) {
    this.playerState = playerState;
  }

  // ── Check if a recipe can be crafted ──────────────────────────
  canCraft(recipeId) {
    const recipe = RECIPES.find(r => r.id === recipeId);
    if (!recipe) return false;
    return recipe.ingredients.every(ing => {
      const have = this._getIngredientCount(ing.rarityId);
      return have >= ing.count;
    });
  }

  // Count items owned across a rarity's item pool
  _getIngredientCount(rarityId) {
    const rarity = RARITIES[rarityId];
    if (!rarity) return 0;
    return rarity.items.reduce((sum, item) => {
      return sum + (this.playerState.inventory[item.id] ?? 0);
    }, 0);
  }

  // ── Craft — deduct ingredients, apply buff ────────────────────
  craft(recipeId) {
    const recipe = RECIPES.find(r => r.id === recipeId);
    if (!recipe || !this.canCraft(recipeId)) return null;

    // Deduct items from inventory (consume lowest-count first to be fair)
    for (const ing of recipe.ingredients) {
      this._consumeItems(ing.rarityId, ing.count);
    }

    // Apply the buff
    const buff = {
      ...recipe.buff,
      recipeId,
      appliedAt: Date.now(),
      rollsRemaining: recipe.buff.rolls,
    };
    this.playerState.addCraftedBuff(buff);
    this.playerState.save();

    return buff;
  }

  // Consume `count` items from a rarity pool — prioritise items with lowest stock
  _consumeItems(rarityId, count) {
    const rarity = RARITIES[rarityId];
    if (!rarity) return;

    // Sort by ascending count so we drain the smallest stacks first
    const available = rarity.items
      .map(item => ({ id: item.id, count: this.playerState.inventory[item.id] ?? 0 }))
      .filter(e => e.count > 0)
      .sort((a, b) => a.count - b.count);

    let remaining = count;
    for (const entry of available) {
      if (remaining <= 0) break;
      const take = Math.min(entry.count, remaining);
      this.playerState.inventory[entry.id] = (this.playerState.inventory[entry.id] ?? 0) - take;
      if (this.playerState.inventory[entry.id] <= 0) delete this.playerState.inventory[entry.id];
      remaining -= take;
    }
  }

  // ── Get ingredient info enriched with current counts ──────────
  getRecipeStatus(recipeId) {
    const recipe = RECIPES.find(r => r.id === recipeId);
    if (!recipe) return null;

    const ingredients = recipe.ingredients.map(ing => ({
      rarityId: ing.rarityId,
      label:    RARITIES[ing.rarityId]?.label ?? ing.rarityId,
      color:    RARITIES[ing.rarityId]?.color ?? '#fff',
      required: ing.count,
      have:     this._getIngredientCount(ing.rarityId),
    }));

    return {
      recipe,
      ingredients,
      canCraft: ingredients.every(i => i.have >= i.required),
    };
  }

  // ── Tick buffs — called by RollEngine after each roll ─────────
  // Returns the combined luck multiplier from all active crafted buffs
  tickAndGetMultiplier() {
    const buffs = this.playerState.craftedBuffs;
    let mult = 1.0;

    for (const buff of buffs) {
      if (buff.rollsRemaining > 0) {
        mult *= buff.multiplier;
        buff.rollsRemaining--;
      }
    }

    // Prune expired buffs
    this.playerState.craftedBuffs = buffs.filter(b => b.rollsRemaining > 0);
    return mult;
  }

  // ── Active buff summary for UI ────────────────────────────────
  getActiveBuffs() {
    return this.playerState.craftedBuffs
      .filter(b => b.rollsRemaining > 0)
      .map(b => ({ ...b }));
  }
}