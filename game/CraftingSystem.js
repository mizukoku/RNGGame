// game/CraftingSystem.js
import { RECIPES } from "../config/CraftingConfig.js";
import { RARITIES } from "../config/RarityConfig.js";

export class CraftingSystem {
  constructor(playerState, luckSystem) {
    this.playerState = playerState;
    this.luckSystem = luckSystem;
  }

  canCraft(recipeId) {
    const recipe = RECIPES.find((r) => r.id === recipeId);
    if (!recipe) return false;
    return recipe.ingredients.every(
      (ing) => this._getIngredientCount(ing.rarityId) >= ing.count,
    );
  }

  _getIngredientCount(rarityId) {
    const rarity = RARITIES[rarityId];
    if (!rarity) return 0;
    return rarity.items.reduce(
      (sum, item) => sum + (this.playerState.inventory[item.id] ?? 0),
      0,
    );
  }

  craft(recipeId) {
    const recipe = RECIPES.find((r) => r.id === recipeId);
    if (!recipe || !this.canCraft(recipeId)) return null;

    for (const ing of recipe.ingredients) {
      this._consumeItems(ing.rarityId, ing.count);
    }

    this.luckSystem.addModifier(
      recipe.buff.name,
      recipe.buff.multiplier,
      null,
      recipe.buff.rolls,
    );

    this.playerState.save();
    return { ...recipe.buff, recipeId, appliedAt: Date.now() };
  }

  _consumeItems(rarityId, count) {
    const rarity = RARITIES[rarityId];
    if (!rarity) return;
    const available = rarity.items
      .map((item) => ({
        id: item.id,
        count: this.playerState.inventory[item.id] ?? 0,
      }))
      .filter((e) => e.count > 0)
      .sort((a, b) => a.count - b.count);
    let remaining = count;
    for (const entry of available) {
      if (remaining <= 0) break;
      const take = Math.min(entry.count, remaining);
      this.playerState.inventory[entry.id] =
        (this.playerState.inventory[entry.id] ?? 0) - take;
      if (this.playerState.inventory[entry.id] <= 0)
        delete this.playerState.inventory[entry.id];
      remaining -= take;
    }
  }

  getRecipeStatus(recipeId) {
    const recipe = RECIPES.find((r) => r.id === recipeId);
    if (!recipe) return null;
    const ingredients = recipe.ingredients.map((ing) => ({
      rarityId: ing.rarityId,
      label: RARITIES[ing.rarityId]?.label ?? ing.rarityId,
      color: RARITIES[ing.rarityId]?.color ?? "#fff",
      required: ing.count,
      have: this._getIngredientCount(ing.rarityId),
    }));
    return {
      recipe,
      ingredients,
      canCraft: ingredients.every((i) => i.have >= i.required),
    };
  }

  // In CraftingSystem.getActiveBuffs()
  getActiveBuffs() {
    return this.luckSystem
      .getActiveModifiers()
      .filter((m) => m.rollsLeft !== null)
      .map((m) => {
        const recipe = RECIPES.find((r) => r.buff.name === m.name);
        return {
          ...m,
          icon: recipe?.buff.icon ?? "✦",
          color: recipe?.buff.color ?? "#fff",
          // Aliases for CraftingPanel which uses the old field names
          multiplier: m.baseMultiplier,
          rollsRemaining: m.rollsLeft,
        };
      });
  }
}
