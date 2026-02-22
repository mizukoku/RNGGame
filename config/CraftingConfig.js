// config/CraftingConfig.js
//
// Recipes consume items from the player's inventory and grant
// a named luck multiplier for a fixed number of rolls.
//
// ingredients: [{ rarityId, count }]  — items from that rarity pool
// buff:        { name, icon, multiplier, rolls, color }
//
// Design principle:
//   • Common items are abundant → need many, short buff
//   • Higher-tier items are rare → fewer needed, longer/stronger buff
//   • Multi-ingredient recipes give synergy bonuses
//

export const RECIPES = [

  // ── TIER 1 — Common crafts ────────────────────────────────────
  {
    id:    'lucky_stone',
    name:  'Lucky Stone',
    icon:  '🪨',
    desc:  'A pebble worn smooth by cosmic chance.',
    ingredients: [{ rarityId: 'COMMON', count: 5 }],
    buff: { name: 'Lucky Stone', icon: '🪨', multiplier: 1.15, rolls: 60, color: '#a8b5c8' },
    category: 'common',
  },

  {
    id:    'iron_ward',
    name:  'Iron Ward',
    icon:  '⚙️',
    desc:  'Forged scraps infused with intent.',
    ingredients: [{ rarityId: 'COMMON', count: 8 }],
    buff: { name: 'Iron Ward', icon: '⚙️', multiplier: 1.25, rolls: 80, color: '#a8b5c8' },
    category: 'common',
  },

  // ── TIER 2 — Uncommon crafts ──────────────────────────────────
  {
    id:    'forest_charm',
    name:  'Forest Charm',
    icon:  '🌿',
    desc:  'Woven from green light and ancient bark.',
    ingredients: [{ rarityId: 'UNCOMMON', count: 3 }],
    buff: { name: 'Forest Charm', icon: '🌿', multiplier: 1.3, rolls: 50, color: '#4ade80' },
    category: 'uncommon',
  },

  {
    id:    'jade_focus',
    name:  'Jade Focus',
    icon:  '🟢',
    desc:  'Clarity carved from living stone.',
    ingredients: [{ rarityId: 'UNCOMMON', count: 5 }],
    buff: { name: 'Jade Focus', icon: '🟢', multiplier: 1.45, rolls: 70, color: '#4ade80' },
    category: 'uncommon',
  },

  // ── TIER 3 — Rare crafts ──────────────────────────────────────
  {
    id:    'azure_talisman',
    name:  'Azure Talisman',
    icon:  '🔵',
    desc:  'A storm-kissed charm that bends probability.',
    ingredients: [{ rarityId: 'RARE', count: 2 }],
    buff: { name: 'Azure Talisman', icon: '🔵', multiplier: 1.55, rolls: 45, color: '#60a5fa' },
    category: 'rare',
  },

  {
    id:    'pearl_ward',
    name:  'Pearl Ward',
    icon:  '🫧',
    desc:  'Tideborn luck sealed in shell and light.',
    ingredients: [{ rarityId: 'RARE', count: 3 }],
    buff: { name: 'Pearl Ward', icon: '🫧', multiplier: 1.7, rolls: 60, color: '#60a5fa' },
    category: 'rare',
  },

  // ── TIER 4 — Epic crafts ──────────────────────────────────────
  {
    id:    'void_catalyst',
    name:  'Void Catalyst',
    icon:  '🌀',
    desc:  'Compressed possibility from the space between worlds.',
    ingredients: [{ rarityId: 'EPIC', count: 1 }],
    buff: { name: 'Void Catalyst', icon: '🌀', multiplier: 1.9, rolls: 35, color: '#c084fc' },
    category: 'epic',
  },

  {
    id:    'phantom_lens',
    name:  'Phantom Lens',
    icon:  '👁️',
    desc:  'See through the veil. Fate bends toward you.',
    ingredients: [{ rarityId: 'EPIC', count: 2 }],
    buff: { name: 'Phantom Lens', icon: '👁️', multiplier: 2.2, rolls: 50, color: '#c084fc' },
    category: 'epic',
  },

  // ── TIER 5 — Legendary crafts ─────────────────────────────────
  {
    id:    'solar_blessing',
    name:  'Solar Blessing',
    icon:  '☀️',
    desc:  'The sun\'s own favour, crystallized.',
    ingredients: [{ rarityId: 'LEGENDARY', count: 1 }],
    buff: { name: 'Solar Blessing', icon: '☀️', multiplier: 2.5, rolls: 30, color: '#fbbf24' },
    category: 'legendary',
  },

  // ── TIER 6 — Mythic crafts ────────────────────────────────────
  {
    id:    'comet_relic',
    name:  'Comet Relic',
    icon:  '☄️',
    desc:  'A fragment from a dying star. Extraordinary fortune.',
    ingredients: [{ rarityId: 'MYTHIC', count: 1 }],
    buff: { name: 'Comet Relic', icon: '☄️', multiplier: 3.5, rolls: 25, color: '#ffe066' },
    category: 'mythic',
  },

  // ── TIER 7 — Divine crafts ────────────────────────────────────
  {
    id:    'singularity_core',
    name:  'Singularity Core',
    icon:  '⚫',
    desc:  'Destiny folded into a single point.',
    ingredients: [{ rarityId: 'DIVINE', count: 1 }],
    buff: { name: 'Singularity Core', icon: '⚫', multiplier: 5.0, rolls: 20, color: '#cc88ff' },
    category: 'divine',
  },

  // ── MULTI-INGREDIENT — Synergy recipes ───────────────────────
  {
    id:    'cosmic_brew',
    name:  'Cosmic Brew',
    icon:  '🌌',
    desc:  'Earth and storm fused. The cosmos conspires in your favour.',
    ingredients: [
      { rarityId: 'COMMON',   count: 4 },
      { rarityId: 'UNCOMMON', count: 2 },
    ],
    buff: { name: 'Cosmic Brew', icon: '🌌', multiplier: 1.6, rolls: 70, color: '#a78bfa' },
    category: 'synergy',
  },

  {
    id:    'star_forge',
    name:  'Star Forge',
    icon:  '⭐',
    desc:  'Rarity transmuted through fire and focus.',
    ingredients: [
      { rarityId: 'UNCOMMON', count: 2 },
      { rarityId: 'RARE',     count: 1 },
    ],
    buff: { name: 'Star Forge', icon: '⭐', multiplier: 2.0, rolls: 55, color: '#93c5fd' },
    category: 'synergy',
  },

  {
    id:    'celestial_pact',
    name:  'Celestial Pact',
    icon:  '🔮',
    desc:  'A promise sealed between the mortal and the divine.',
    ingredients: [
      { rarityId: 'RARE',      count: 1 },
      { rarityId: 'EPIC',      count: 1 },
    ],
    buff: { name: 'Celestial Pact', icon: '🔮', multiplier: 2.8, rolls: 45, color: '#818cf8' },
    category: 'synergy',
  },

  {
    id:    'nexus_crown',
    name:  'Nexus Crown',
    icon:  '👑',
    desc:  'All paths converge. Roll as if you are already chosen.',
    ingredients: [
      { rarityId: 'EPIC',      count: 1 },
      { rarityId: 'LEGENDARY', count: 1 },
    ],
    buff: { name: 'Nexus Crown', icon: '👑', multiplier: 4.0, rolls: 35, color: '#fde68a' },
    category: 'synergy',
  },

];

// Category display order and labels
export const CATEGORIES = [
  { id: 'common',    label: 'Common',    color: '#a8b5c8' },
  { id: 'uncommon',  label: 'Uncommon',  color: '#4ade80' },
  { id: 'rare',      label: 'Rare',      color: '#60a5fa' },
  { id: 'epic',      label: 'Epic',      color: '#c084fc' },
  { id: 'legendary', label: 'Legendary', color: '#fbbf24' },
  { id: 'mythic',    label: 'Mythic',    color: '#ffe066' },
  { id: 'divine',    label: 'Divine',    color: '#cc88ff' },
  { id: 'synergy',   label: '✦ Synergy', color: '#a78bfa' },
];