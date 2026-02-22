// config/RarityConfig.js
//
// Weight pool ≈ 1002.35
// All debugOdds expressed as 1/N strings.
//
export const RARITIES = {

  COMMON: {
    id: 'COMMON', label: 'Common', weight: 600, debugOdds: '1/2', badge: '',
    color: '#a8b5c8', glowColor: 'rgba(168,181,200,0.4)', particleColor: '#c0ccd8',
    bgColor: 'rgba(30,35,45,0.95)', textShadow: '0 0 10px rgba(168,181,200,0.6)',
    cutscene: 'NormalScene',
    items: [
      { id: 'stone_shard', name: 'Stone Shard', icon: '🪨' },
      { id: 'iron_dust',   name: 'Iron Dust',   icon: '⚙️' },
      { id: 'dim_crystal', name: 'Dim Crystal', icon: '💎' },
      { id: 'worn_coin',   name: 'Worn Coin',   icon: '🪙' },
    ],
  },

  UNCOMMON: {
    id: 'UNCOMMON', label: 'Uncommon', weight: 250, debugOdds: '1/4', badge: '',
    color: '#4ade80', glowColor: 'rgba(74,222,128,0.5)', particleColor: '#86efac',
    bgColor: 'rgba(10,30,15,0.95)', textShadow: '0 0 15px rgba(74,222,128,0.8)',
    cutscene: 'NormalScene',
    items: [
      { id: 'forest_gem',  name: 'Forest Gem',  icon: '🌿' },
      { id: 'silver_leaf', name: 'Silver Leaf', icon: '🍃' },
      { id: 'jade_shard',  name: 'Jade Shard',  icon: '🟢' },
      { id: 'vine_ring',   name: 'Vine Ring',   icon: '💍' },
    ],
  },

  RARE: {
    id: 'RARE', label: 'Rare', weight: 100, debugOdds: '1/10', badge: '💎',
    color: '#60a5fa', glowColor: 'rgba(96,165,250,0.6)', particleColor: '#93c5fd',
    bgColor: 'rgba(5,15,40,0.97)', textShadow: '0 0 20px rgba(96,165,250,0.9)',
    cutscene: 'RareScene',
    items: [
      { id: 'azure_orb',     name: 'Azure Orb',     icon: '🔵' },
      { id: 'storm_essence', name: 'Storm Essence', icon: '⚡' },
      { id: 'tide_pearl',    name: 'Tide Pearl',    icon: '🫧' },
      { id: 'frost_shard',   name: 'Frost Shard',   icon: '❄️' },
    ],
  },

  EPIC: {
    id: 'EPIC', label: 'Epic', weight: 40, debugOdds: '1/25', badge: '💜',
    color: '#c084fc', glowColor: 'rgba(192,132,252,0.7)', particleColor: '#d8b4fe',
    bgColor: 'rgba(20,5,40,0.98)', textShadow: '0 0 25px rgba(192,132,252,1)',
    cutscene: 'EpicScene',
    items: [
      { id: 'void_fragment', name: 'Void Fragment', icon: '🌀' },
      { id: 'soul_crystal',  name: 'Soul Crystal',  icon: '🔮' },
      { id: 'eclipse_eye',   name: 'Eclipse Eye',   icon: '👁️' },
      { id: 'phantom_core',  name: 'Phantom Core',  icon: '💜' },
    ],
  },

  LEGENDARY: {
    id: 'LEGENDARY', label: 'Legendary', weight: 9, debugOdds: '1/111', badge: '👑',
    color: '#fbbf24', glowColor: 'rgba(251,191,36,0.8)', particleColor: '#fde68a',
    bgColor: 'rgba(30,20,0,0.99)',
    textShadow: '0 0 40px rgba(251,191,36,1), 0 0 80px rgba(251,100,0,0.5)',
    cutscene: 'LegendaryScene',
    items: [
      { id: 'solar_heart',     name: 'Solar Heart',     icon: '☀️' },
      { id: 'celestial_crown', name: 'Celestial Crown', icon: '👑' },
      { id: 'eternal_flame',   name: 'Eternal Flame',   icon: '🔥' },
      { id: 'cosmos_seed',     name: 'Cosmos Seed',     icon: '🌟' },
    ],
  },

  MYTHIC: {
    id: 'MYTHIC', label: 'Mythic', weight: 2, debugOdds: '1/500', badge: '☄',
    color: '#ffe066', glowColor: 'rgba(255,224,102,0.9)', particleColor: '#fff3a0',
    bgColor: 'rgba(20,15,0,0.99)',
    textShadow: '0 0 40px rgba(255,224,102,1), 0 0 100px rgba(255,140,0,0.7), 0 0 180px rgba(255,80,0,0.4)',
    cutscene: 'CometStrike',
    items: [
      { id: 'comet_fragment', name: 'Comet Fragment', icon: '☄️' },
      { id: 'gods_tear',      name: "God's Tear",     icon: '💫' },
      { id: 'omega_core',     name: 'Omega Core',     icon: '⭐' },
    ],
  },

  DIVINE: {
    id: 'DIVINE', label: 'Divine', weight: 1, debugOdds: '1/1,000', badge: '✦',
    color: '#cc88ff', glowColor: 'rgba(160,60,255,0.95)', particleColor: '#e0aaff',
    bgColor: 'rgba(8,0,18,0.99)',
    textShadow: '0 0 30px rgba(200,80,255,1), 0 0 70px rgba(140,0,255,0.8), 0 0 140px rgba(80,0,200,0.5)',
    cutscene: 'StellarCollapse',
    effects: {
      shakeIntensity: 35, particleCount: 130, rayCount: 24, ringCount: 4,
      glowMaxAlpha: 0.85, riftCount: 6, orbiterCount: 22, debrisCount: 90,
      wispCount: 10, trailEnabled: true,
      titleText: 'S T E L L A R   C O L L A P S E', subtitleText: '✦  1 / 2,000  ✦',
    },
    items: [
      { id: 'neutron_core',     name: 'Neutron Core',     icon: '🌌' },
      { id: 'void_singularity', name: 'Void Singularity', icon: '⚫' },
      { id: 'pulsar_heart',     name: 'Pulsar Heart',     icon: '💠' },
      { id: 'event_horizon',    name: 'Event Horizon',    icon: '🔮' },
    ],
  },

  // weight 0.2 → 1002.35 / 0.2 ≈ 5,012
  SUPERNOVA: {
    id: 'SUPERNOVA', label: 'Supernova', weight: 0.2, debugOdds: '1/5,000', badge: '💥',
    color: '#ff6600', glowColor: 'rgba(255,102,0,0.95)', particleColor: '#ffcc00',
    bgColor: 'rgba(12,2,0,0.99)',
    textShadow: '0 0 30px rgba(255,102,0,1), 0 0 70px rgba(255,0,100,0.9), 0 0 140px rgba(140,0,255,0.6), 0 0 220px rgba(0,150,255,0.3)',
    cutscene: 'Supernova',
    effects: {
      shakeIntensity: 40, particleCount: 160, rayCount: 28, ringCount: 6,
      glowMaxAlpha: 0.92, debrisCount: 140, wispCount: 12, trailEnabled: true,
      titleText: 'S U P E R N O V A', subtitleText: '💥  1 / 5,000  💥',
    },
    items: [
      { id: 'stellar_remnant', name: 'Stellar Remnant', icon: '💥' },
      { id: 'pulsar_shard',    name: 'Pulsar Shard',    icon: '⚡' },
      { id: 'chromatic_core',  name: 'Chromatic Core',  icon: '🌈' },
      { id: 'void_plasma',     name: 'Void Plasma',     icon: '🔴' },
    ],
  },

  // weight 0.1 → 1002.35 / 0.1 ≈ 10,024
  SERAPHIM: {
    id: 'SERAPHIM', label: 'Seraphim', weight: 0.1, debugOdds: '1/10,000', badge: '🔥',
    color: '#ffd700', glowColor: 'rgba(255,215,0,0.98)', particleColor: '#fff5a0',
    bgColor: 'rgba(14,8,0,0.99)',
    textShadow: '0 0 30px rgba(255,215,0,1), 0 0 70px rgba(255,140,0,0.95), 0 0 140px rgba(255,80,0,0.7), 0 0 240px rgba(255,200,0,0.4)',
    cutscene: 'Seraphim',
    effects: {
      shakeIntensity: 45, particleCount: 180, rayCount: 32, ringCount: 6,
      glowMaxAlpha: 0.95, crackCount: 7, pillarCount: 5, emberCount: 90,
      presenceCount: 130, wispCount: 11, windCount: 16, trailEnabled: true,
      titleText: 'S E R A P H I M', subtitleText: '🔥  1 / 10,000  🔥',
    },
    items: [
      { id: 'divine_feather', name: 'Divine Feather', icon: '🪶' },
      { id: 'throne_ember',   name: 'Throne Ember',   icon: '🔥' },
      { id: 'holy_sigil',     name: 'Holy Sigil',     icon: '✦' },
      { id: 'seraph_eye',     name: "Seraph's Eye",   icon: '👁️' },
    ],
  },

  // weight 0.05 → 1002.35 / 0.05 ≈ 20,047
  CONVERGENCE: {
    id: 'CONVERGENCE', label: 'Convergence', weight: 0.05, debugOdds: '1/20,000', badge: '∞',
    color: '#ffffff',
    glowColor: 'rgba(255,255,255,0.98)',
    particleColor: '#ffffff',
    bgColor: 'rgba(0,0,0,1)',
    textShadow: [
      '0 0 30px rgba(255,255,255,1)',
      '0 0 70px rgba(255,200,100,0.9)',
      '0 0 140px rgba(200,100,255,0.8)',
      '0 0 240px rgba(0,180,255,0.6)',
      '0 0 360px rgba(255,80,0,0.4)',
    ].join(', '),
    cutscene: 'Convergence',
    effects: {
      shakeIntensity: 55, particleCount: 220, rayCount: 40, ringCount: 8,
      glowMaxAlpha: 1.0, trailEnabled: true,
      titleText: 'THE CONVERGENCE', subtitleText: '∞  1 / 20,000  ∞',
    },
    items: [
      { id: 'convergence_echo',   name: 'Convergence Echo',   icon: '∞' },
      { id: 'prismatic_shard',    name: 'Prismatic Shard',    icon: '🌈' },
      { id: 'unified_singularity',name: 'Unified Singularity',icon: '⚪' },
      { id: 'all_memory',         name: 'All Memory',         icon: '💭' },
    ],
  },

};

// Ordered most common → rarest
export const RARITY_ORDER = [
  'COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY',
  'MYTHIC', 'DIVINE', 'SUPERNOVA', 'SERAPHIM', 'CONVERGENCE',
];

export function getRarityByWeight(roll) {
  const total = Object.values(RARITIES).reduce((s, r) => s + r.weight, 0);
  let cursor = 0;
  for (const key of [...RARITY_ORDER].reverse()) {
    cursor += RARITIES[key].weight;
    if (roll <= cursor) return RARITIES[key];
  }
  return RARITIES.COMMON;
}