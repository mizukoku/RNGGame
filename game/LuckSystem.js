// game/LuckSystem.js

export class LuckSystem {
  constructor() {
    this.baseLuck = 1.0;
    this.modifiers = [];
    this.activeAuras = [];
  }

  addModifier(name, multiplier, duration = null) {
    const mod = { name, multiplier, duration, startTime: Date.now() };
    this.modifiers.push(mod);
    return mod;
  }

  removeModifier(name) {
    this.modifiers = this.modifiers.filter(m => m.name !== name);
  }

  getCurrentLuck() {
    // Prune expired modifiers
    const now = Date.now();
    this.modifiers = this.modifiers.filter(m => {
      if (m.duration === null) return true;
      return (now - m.startTime) < m.duration;
    });

    return this.modifiers.reduce((acc, m) => acc * m.multiplier, this.baseLuck);
  }

  getActiveModifiers() {
    return this.modifiers.map(m => ({
      name: m.name,
      multiplier: m.multiplier,
      remaining: m.duration === null ? null : Math.max(0, m.duration - (Date.now() - m.startTime)),
    }));
  }

  // Built-in luck events
  activateLuckyStreak() {
    this.addModifier('Lucky Streak', 1.5, 30000); // 30 seconds
  }

  activateHolyLight() {
    this.addModifier('Holy Light', 2.0, 15000); // 15 seconds
  }

  activateGlimpse() {
    this.addModifier('Glimpse', 3.0, 5000); // 5 seconds, very short
  }
}
