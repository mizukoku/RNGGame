// config/CraftingConfig.js
//
// Recipes consume items and grant luck multipliers for N rolls.
// ingredients: [{ rarityId, count }]
// buff: { name, icon, multiplier, rolls, color }
//
export const RECIPES = [


  // ── TIER 15 — Sacred Blade ───────────────────────────────────
  {
    id: 'blades_blessing', name: "Blade's Blessing", icon: '⚔',
    desc: 'The worthy receive fivefold fortune. Even fate bends to the holy edge.',
    ingredients: [{ rarityId: 'SACREDBLADE', count: 1 }],
    buff: { name: "Blade's Blessing", icon: '⚔', multiplier: 100.0, rolls: 6, color: '#ffd700' },
    category: 'sacredblade',
  },


  // ── TIER 16 — The Observer ───────────────────────────────────
  {
    id: 'watchers_blessing', name: "Watcher's Blessing", icon: '👁',
    desc: 'To be seen by the Observer is to be known completely. Fortune cannot hide.',
    ingredients: [{ rarityId: 'THEOBSERVER', count: 1 }],
    buff: { name: "Watcher's Blessing", icon: '👁', multiplier: 140.0, rolls: 6, color: '#9933cc' },
    category: 'theobserver',
  },


  // ── TIER 17 — The Fractal ───────────────────────────────────
  {
    id: 'prime_solution', name: 'Prime Solution', icon: '◈',
    desc: 'The equation solved. Reality bends to the formula.',
    ingredients: [{ rarityId: 'THEFRACTAL', count: 1 }],
    buff: { name: 'Prime Solution', icon: '◈', multiplier: 200.0, rolls: 6, color: '#00ffcc' },
    category: 'thefractal',
  },

  // ── SYNERGY recipes ────────────────────────────────────────────


  {
    id: 'eye_of_the_equation', name: 'Eye of the Equation', icon: '◉',
    desc: 'The Observer watches the Fractal. The Fractal solves the Observer.',
    ingredients: [{ rarityId: 'THEOBSERVER', count: 1 }, { rarityId: 'THEFRACTAL', count: 1 }],
    buff: { name: 'Eye of the Equation', icon: '◉', multiplier: 250.0, rolls: 5, color: '#00ffcc' },
    category: 'synergy',
  },

  {
    id: 'blade_and_eye', name: 'Blade and Eye', icon: '◉',
    desc: 'The worthy, witnessed. The blade, seen. Both exist only because it watches.',
    ingredients: [{ rarityId: 'SACREDBLADE', count: 1 }, { rarityId: 'THEOBSERVER', count: 1 }],
    buff: { name: 'Blade and Eye', icon: '◉', multiplier: 175.0, rolls: 5, color: '#9933cc' },
    category: 'synergy',
  },

  {
    id: 'cosmic_brew', name: 'Cosmic Brew', icon: '🌌',
    desc: 'Earth and storm fused. The cosmos conspires for you.',
    ingredients: [{ rarityId: 'COMMON', count: 4 }, { rarityId: 'UNCOMMON', count: 2 }],
    buff: { name: 'Cosmic Brew', icon: '🌌', multiplier: 1.6, rolls: 70, color: '#a78bfa' },
    category: 'synergy',
  },
  {
    id: 'star_forge', name: 'Star Forge', icon: '⭐',
    desc: 'Rarity transmuted through fire and focus.',
    ingredients: [{ rarityId: 'UNCOMMON', count: 2 }, { rarityId: 'RARE', count: 1 }],
    buff: { name: 'Star Forge', icon: '⭐', multiplier: 2.0, rolls: 55, color: '#93c5fd' },
    category: 'synergy',
  },
  {
    id: 'celestial_pact', name: 'Celestial Pact', icon: '🔮',
    desc: 'A promise sealed between the mortal and the divine.',
    ingredients: [{ rarityId: 'RARE', count: 1 }, { rarityId: 'EPIC', count: 1 }],
    buff: { name: 'Celestial Pact', icon: '🔮', multiplier: 2.8, rolls: 45, color: '#818cf8' },
    category: 'synergy',
  },
  {
    id: 'nexus_crown', name: 'Nexus Crown', icon: '👑',
    desc: 'All paths converge. Roll as if you are already chosen.',
    ingredients: [{ rarityId: 'EPIC', count: 1 }, { rarityId: 'LEGENDARY', count: 1 }],
    buff: { name: 'Nexus Crown', icon: '👑', multiplier: 4.0, rolls: 35, color: '#fde68a' },
    category: 'synergy',
  },




  {
    id: 'pixel_singularity', name: 'Pixel Singularity', icon: '⊗',
    desc: 'An 8-bit universe born from nothing. The first game. The only game.',
    ingredients: [{ rarityId: 'PIXELGENESIS', count: 1 }, { rarityId: 'VOIDAWAKENS', count: 1 }],
    buff: { name: 'Pixel Singularity', icon: '⊗', multiplier: 100.0, rolls: 5, color: '#c8a8ff' },
    category: 'synergy',
  },


  {
    id: 'void_and_blade', name: 'Void and Blade', icon: '✦',
    desc: 'Before existence, there was the worthy. After the void, only the blade remains.',
    ingredients: [{ rarityId: 'VOIDAWAKENS', count: 1 }, { rarityId: 'SACREDBLADE', count: 1 }],
    buff: { name: 'Void and Blade', icon: '✦', multiplier: 125.0, rolls: 5, color: '#ffd700' },
    category: 'synergy',
  },

  {
    id: 'timeless_pixel', name: 'Timeless Pixel', icon: '⭐',
    desc: 'Time collapsed into a single 8-bit frame. Reality has no power here.',
    ingredients: [{ rarityId: 'TIMECOLLAPSE', count: 1 }, { rarityId: 'PIXELGENESIS', count: 1 }],
    buff: { name: 'Timeless Pixel', icon: '⭐', multiplier: 75.0, rolls: 5, color: '#fcbc3c' },
    category: 'synergy',
  },

  {
    id: 'temporal_eye', name: 'Temporal Eye', icon: '⏱',
    desc: 'Eldritch sight through collapsing time. Nothing is hidden.',
    ingredients: [{ rarityId: 'ELDRITCH', count: 1 }, { rarityId: 'TIMECOLLAPSE', count: 1 }],
    buff: { name: 'Temporal Eye', icon: '⏱', multiplier: 55.0, rolls: 5, color: '#64c8ff' },
    category: 'synergy',
  },

  {
    id: 'madness_pact', name: 'Madness Pact', icon: '🔮',
    desc: 'Sanity traded for impossible fortune. The void delivers.',
    ingredients: [{ rarityId: 'MATRIX', count: 1 }, { rarityId: 'ELDRITCH', count: 1 }],
    buff: { name: 'Madness Pact', icon: '🔮', multiplier: 40.0, rolls: 6, color: '#c084fc' },
    category: 'synergy',
  },


  {
    id: 'void_oath', name: 'Void Oath', icon: '◉',
    desc: 'The blade that cut the void. All odds collapse before it.',
    ingredients: [{ rarityId: 'VOIDAWAKENS', count: 1 }, { rarityId: 'SACREDBLADE', count: 1 }],
    buff: { name: 'Void Oath', icon: '◉', multiplier: 120.0, rolls: 4, color: '#ffd700' },
    category: 'synergy',
  },

  {
    id: 'binary_heart', name: 'Binary Heart', icon: '💻',
    desc: 'Logic and chaos fused. The system favours you.',
    ingredients: [{ rarityId: 'LEGENDARY', count: 1 }, { rarityId: 'MATRIX', count: 1 }],
    buff: { name: 'Binary Heart', icon: '💻', multiplier: 25.0, rolls: 8, color: '#00ff41' },
    category: 'synergy',
  },
];

export const CATEGORIES = [
  { id: 'common',      label: 'Common',      color: '#a8b5c8' },
  { id: 'uncommon',    label: 'Uncommon',    color: '#4ade80' },
  { id: 'rare',        label: 'Rare',        color: '#60a5fa' },
  { id: 'epic',        label: 'Epic',        color: '#c084fc' },
  { id: 'legendary',   label: 'Legendary',   color: '#fbbf24' },
  { id: 'mythic',      label: 'Mythic',      color: '#ffe066' },
  { id: 'divine',      label: 'Divine',      color: '#cc88ff' },
  { id: 'supernova',   label: 'Supernova',   color: '#ff6600' },
  { id: 'seraphim',    label: 'Seraphim',    color: '#ffd700' },
  { id: 'convergence', label: 'Convergence', color: '#ffffff' },
  { id: 'matrix',      label: '>_ Matrix',   color: '#00ff41' },
  { id: 'thefractal', label: '◈ The Fractal', color: '#00ffcc' },
  { id: 'theobserver', label: '👁 The Observer', color: '#9933cc' },
  { id: 'sacredblade', label: '⚔ Sacred Blade', color: '#ffd700' },
  { id: 'voidawakens', label: '◉ Void Awakens', color: '#c8a8ff' },
  { id: 'pixelgenesis', label: '★ 8-Bit Genesis', color: '#fcbc3c' },
  { id: 'timecollapse', label: '⧗ Time Collapse', color: '#64c8ff' },
  { id: 'eldritch', label: '👁 Eldritch', color: '#c084fc' },
  { id: 'synergy',     label: '✦ Synergy',   color: '#a78bfa' },
];