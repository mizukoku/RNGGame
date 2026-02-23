// config/CraftingConfig.js
//
// Recipes consume items and grant luck multipliers for N rolls.
// ingredients: [{ rarityId, count }]
// buff: { name, icon, multiplier, rolls, color }
//
export const RECIPES = [

  // ── TIER 1 — Common ──────────────────────────────────────────
  {
    id: 'lucky_stone', name: 'Lucky Stone', icon: '🪨',
    desc: 'A pebble worn smooth by cosmic chance.',
    ingredients: [{ rarityId: 'COMMON', count: 5 }],
    buff: { name: 'Lucky Stone', icon: '🪨', multiplier: 1.15, rolls: 60, color: '#a8b5c8' },
    category: 'common',
  },
  {
    id: 'iron_ward', name: 'Iron Ward', icon: '⚙️',
    desc: 'Forged scraps infused with intent.',
    ingredients: [{ rarityId: 'COMMON', count: 8 }],
    buff: { name: 'Iron Ward', icon: '⚙️', multiplier: 1.25, rolls: 80, color: '#a8b5c8' },
    category: 'common',
  },

  // ── TIER 2 — Uncommon ────────────────────────────────────────
  {
    id: 'forest_charm', name: 'Forest Charm', icon: '🌿',
    desc: 'Woven from green light and ancient bark.',
    ingredients: [{ rarityId: 'UNCOMMON', count: 3 }],
    buff: { name: 'Forest Charm', icon: '🌿', multiplier: 1.3, rolls: 50, color: '#4ade80' },
    category: 'uncommon',
  },
  {
    id: 'jade_focus', name: 'Jade Focus', icon: '🟢',
    desc: 'Clarity carved from living stone.',
    ingredients: [{ rarityId: 'UNCOMMON', count: 5 }],
    buff: { name: 'Jade Focus', icon: '🟢', multiplier: 1.45, rolls: 70, color: '#4ade80' },
    category: 'uncommon',
  },

  // ── TIER 3 — Rare ────────────────────────────────────────────
  {
    id: 'azure_talisman', name: 'Azure Talisman', icon: '🔵',
    desc: 'A storm-kissed charm that bends probability.',
    ingredients: [{ rarityId: 'RARE', count: 2 }],
    buff: { name: 'Azure Talisman', icon: '🔵', multiplier: 1.55, rolls: 45, color: '#60a5fa' },
    category: 'rare',
  },
  {
    id: 'pearl_ward', name: 'Pearl Ward', icon: '🫧',
    desc: 'Tideborn luck sealed in shell and light.',
    ingredients: [{ rarityId: 'RARE', count: 3 }],
    buff: { name: 'Pearl Ward', icon: '🫧', multiplier: 1.7, rolls: 60, color: '#60a5fa' },
    category: 'rare',
  },

  // ── TIER 4 — Epic ────────────────────────────────────────────
  {
    id: 'void_catalyst', name: 'Void Catalyst', icon: '🌀',
    desc: 'Compressed possibility from the space between worlds.',
    ingredients: [{ rarityId: 'EPIC', count: 1 }],
    buff: { name: 'Void Catalyst', icon: '🌀', multiplier: 1.9, rolls: 35, color: '#c084fc' },
    category: 'epic',
  },
  {
    id: 'phantom_lens', name: 'Phantom Lens', icon: '👁️',
    desc: 'See through the veil. Fate bends toward you.',
    ingredients: [{ rarityId: 'EPIC', count: 2 }],
    buff: { name: 'Phantom Lens', icon: '👁️', multiplier: 2.2, rolls: 50, color: '#c084fc' },
    category: 'epic',
  },

  // ── TIER 5 — Legendary ───────────────────────────────────────
  {
    id: 'solar_blessing', name: 'Solar Blessing', icon: '☀️',
    desc: "The sun's own favour, crystallized.",
    ingredients: [{ rarityId: 'LEGENDARY', count: 1 }],
    buff: { name: 'Solar Blessing', icon: '☀️', multiplier: 2.5, rolls: 30, color: '#fbbf24' },
    category: 'legendary',
  },

  // ── TIER 6 — Mythic ──────────────────────────────────────────
  {
    id: 'comet_relic', name: 'Comet Relic', icon: '☄️',
    desc: 'A fragment from a dying star. Extraordinary fortune.',
    ingredients: [{ rarityId: 'MYTHIC', count: 1 }],
    buff: { name: 'Comet Relic', icon: '☄️', multiplier: 3.5, rolls: 25, color: '#ffe066' },
    category: 'mythic',
  },

  // ── TIER 7 — Divine ──────────────────────────────────────────
  {
    id: 'singularity_core', name: 'Singularity Core', icon: '⚫',
    desc: 'Destiny folded into a single point.',
    ingredients: [{ rarityId: 'DIVINE', count: 1 }],
    buff: { name: 'Singularity Core', icon: '⚫', multiplier: 5.0, rolls: 20, color: '#cc88ff' },
    category: 'divine',
  },

  // ── TIER 8 — Supernova ───────────────────────────────────────
  {
    id: 'nova_ember', name: 'Nova Ember', icon: '💥',
    desc: 'Born from a star that refused to die quietly.',
    ingredients: [{ rarityId: 'SUPERNOVA', count: 1 }],
    buff: { name: 'Nova Ember', icon: '💥', multiplier: 7.0, rolls: 18, color: '#ff6600' },
    category: 'supernova',
  },

  // ── TIER 9 — Seraphim ────────────────────────────────────────
  {
    id: 'holy_brand', name: 'Holy Brand', icon: '🔥',
    desc: 'Scorched by divine fire. Fate trembles before you.',
    ingredients: [{ rarityId: 'SERAPHIM', count: 1 }],
    buff: { name: 'Holy Brand', icon: '🔥', multiplier: 10.0, rolls: 15, color: '#ffd700' },
    category: 'seraphim',
  },

  // ── TIER 10 — Convergence ─────────────────────────────────────
  {
    id: 'all_echoes', name: 'All Echoes', icon: '∞',
    desc: 'Every rarity distilled into one impossible object.',
    ingredients: [{ rarityId: 'CONVERGENCE', count: 1 }],
    buff: { name: 'All Echoes', icon: '∞', multiplier: 15.0, rolls: 12, color: '#ffffff' },
    category: 'convergence',
  },

  // ── TIER 11 — Matrix ─────────────────────────────────────────
  {
    id: 'red_pill_craft', name: 'Red Pill', icon: '💊',
    desc: 'You chose to see. Reality bends. Luck becomes code.',
    ingredients: [{ rarityId: 'MATRIX', count: 1 }],
    buff: { name: 'Red Pill', icon: '💊', multiplier: 20.0, rolls: 10, color: '#00ff41' },
    category: 'matrix',
  },


  // ── TIER 12 — Eldritch ───────────────────────────────────────
  {
    id: 'void_eye_craft', name: 'Eye of Aeons', icon: '👁',
    desc: 'Forged from what should not exist. Reality obeys you.',
    ingredients: [{ rarityId: 'ELDRITCH', count: 1 }],
    buff: { name: 'Eye of Aeons', icon: '👁', multiplier: 30.0, rolls: 8, color: '#c084fc' },
    category: 'eldritch',
  },


  // ── TIER 13 — Time Collapse ──────────────────────────────────
  {
    id: 'paradox_engine', name: 'Paradox Engine', icon: '⧗',
    desc: 'A device that runs forward by going backwards. Fate accelerates.',
    ingredients: [{ rarityId: 'TIMECOLLAPSE', count: 1 }],
    buff: { name: 'Paradox Engine', icon: '⧗', multiplier: 45.0, rolls: 7, color: '#64c8ff' },
    category: 'timecollapse',
  },


  // ── TIER 14 — 8-Bit Genesis ──────────────────────────────────
  {
    id: 'golden_run', name: 'Golden Run', icon: '★',
    desc: 'Three lives. Infinite stars. Luck beyond the final world.',
    ingredients: [{ rarityId: 'PIXELGENESIS', count: 1 }],
    buff: { name: 'Golden Run', icon: '★', multiplier: 60.0, rolls: 6, color: '#fcbc3c' },
    category: 'pixelgenesis',
  },

  // ── SYNERGY recipes ────────────────────────────────────────────
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
  { id: 'pixelgenesis', label: '★ 8-Bit Genesis', color: '#fcbc3c' },
  { id: 'timecollapse', label: '⧗ Time Collapse', color: '#64c8ff' },
  { id: 'eldritch', label: '👁 Eldritch', color: '#c084fc' },
  { id: 'synergy',     label: '✦ Synergy',   color: '#a78bfa' },
];