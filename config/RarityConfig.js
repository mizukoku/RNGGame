// config/RarityConfig.js
export const RARITIES = {
  COMMON: {
    id: 'COMMON',
    label: 'Common',
    weight: 600,
    color: '#a8b5c8',
    glowColor: 'rgba(168, 181, 200, 0.4)',
    particleColor: '#c0ccd8',
    bgColor: 'rgba(30, 35, 45, 0.95)',
    textShadow: '0 0 10px rgba(168,181,200,0.6)',
    cutscene: 'NormalScene',
    items: [
      { id: 'stone_shard', name: 'Stone Shard', icon: '🪨' },
      { id: 'iron_dust', name: 'Iron Dust', icon: '⚙️' },
      { id: 'dim_crystal', name: 'Dim Crystal', icon: '💎' },
      { id: 'worn_coin', name: 'Worn Coin', icon: '🪙' },
    ],
  },
  UNCOMMON: {
    id: 'UNCOMMON',
    label: 'Uncommon',
    weight: 250,
    color: '#4ade80',
    glowColor: 'rgba(74, 222, 128, 0.5)',
    particleColor: '#86efac',
    bgColor: 'rgba(10, 30, 15, 0.95)',
    textShadow: '0 0 15px rgba(74,222,128,0.8)',
    cutscene: 'NormalScene',
    items: [
      { id: 'forest_gem', name: 'Forest Gem', icon: '🌿' },
      { id: 'silver_leaf', name: 'Silver Leaf', icon: '🍃' },
      { id: 'jade_shard', name: 'Jade Shard', icon: '🟢' },
      { id: 'vine_ring', name: 'Vine Ring', icon: '💍' },
    ],
  },
  RARE: {
    id: 'RARE',
    label: 'Rare',
    weight: 100,
    color: '#60a5fa',
    glowColor: 'rgba(96, 165, 250, 0.6)',
    particleColor: '#93c5fd',
    bgColor: 'rgba(5, 15, 40, 0.97)',
    textShadow: '0 0 20px rgba(96,165,250,0.9)',
    cutscene: 'RareScene',
    items: [
      { id: 'azure_orb', name: 'Azure Orb', icon: '🔵' },
      { id: 'storm_essence', name: 'Storm Essence', icon: '⚡' },
      { id: 'tide_pearl', name: 'Tide Pearl', icon: '🫧' },
      { id: 'frost_shard', name: 'Frost Shard', icon: '❄️' },
    ],
  },
  EPIC: {
    id: 'EPIC',
    label: 'Epic',
    weight: 40,
    color: '#c084fc',
    glowColor: 'rgba(192, 132, 252, 0.7)',
    particleColor: '#d8b4fe',
    bgColor: 'rgba(20, 5, 40, 0.98)',
    textShadow: '0 0 25px rgba(192,132,252,1)',
    cutscene: 'EpicScene',
    items: [
      { id: 'void_fragment', name: 'Void Fragment', icon: '🌀' },
      { id: 'soul_crystal', name: 'Soul Crystal', icon: '🔮' },
      { id: 'eclipse_eye', name: 'Eclipse Eye', icon: '👁️' },
      { id: 'phantom_core', name: 'Phantom Core', icon: '💜' },
    ],
  },
  LEGENDARY: {
    id: 'LEGENDARY',
    label: 'Legendary',
    weight: 9,
    color: '#fbbf24',
    glowColor: 'rgba(251, 191, 36, 0.8)',
    particleColor: '#fde68a',
    bgColor: 'rgba(30, 20, 0, 0.99)',
    textShadow: '0 0 40px rgba(251,191,36,1), 0 0 80px rgba(251,100,0,0.5)',
    cutscene: 'LegendaryScene',
    items: [
      { id: 'solar_heart', name: 'Solar Heart', icon: '☀️' },
      { id: 'celestial_crown', name: 'Celestial Crown', icon: '👑' },
      { id: 'eternal_flame', name: 'Eternal Flame', icon: '🔥' },
      { id: 'cosmos_seed', name: 'Cosmos Seed', icon: '🌟' },
    ],
  },
  MYTHIC: {
    id: 'MYTHIC',
    label: 'Mythic',
    weight: 1,
    color: '#ffe066',
    glowColor: 'rgba(255, 224, 102, 0.9)',
    particleColor: '#fff3a0',
    bgColor: 'rgba(20, 15, 0, 0.99)',
    textShadow: '0 0 40px rgba(255,224,102,1), 0 0 100px rgba(255,140,0,0.7), 0 0 180px rgba(255,80,0,0.4)',
    cutscene: 'CometStrike',
    items: [
      { id: 'comet_fragment', name: 'Comet Fragment', icon: '☄️' },
      { id: 'gods_tear',      name: "God's Tear",    icon: '💫' },
      { id: 'omega_core',     name: 'Omega Core',    icon: '⭐' },
    ],
  },
};

export const RARITY_ORDER = ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY', 'MYTHIC'];

export function getRarityByWeight(roll) {
  const total = Object.values(RARITIES).reduce((s, r) => s + r.weight, 0);
  let cursor = 0;
  for (const key of [...RARITY_ORDER].reverse()) {
    cursor += RARITIES[key].weight;
    if (roll <= cursor) return RARITIES[key];
  }
  return RARITIES.COMMON;
}