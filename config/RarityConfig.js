// config/RarityConfig.js
//
// Weight pool ≈ 1002.39  (total / weight = odds)
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
    items: [
      { id: 'neutron_core',     name: 'Neutron Core',     icon: '🌌' },
      { id: 'void_singularity', name: 'Void Singularity', icon: '⚫' },
      { id: 'pulsar_heart',     name: 'Pulsar Heart',     icon: '💠' },
      { id: 'event_horizon',    name: 'Event Horizon',    icon: '🔮' },
    ],
  },

  // weight 0.2 → pool / 0.2 ≈ 5,012
  SUPERNOVA: {
    id: 'SUPERNOVA', label: 'Supernova', weight: 0.2, debugOdds: '1/5,000', badge: '💥',
    color: '#ff6600', glowColor: 'rgba(255,102,0,0.95)', particleColor: '#ffcc00',
    bgColor: 'rgba(12,2,0,0.99)',
    textShadow: '0 0 30px rgba(255,102,0,1), 0 0 70px rgba(255,0,100,0.9), 0 0 140px rgba(140,0,255,0.6)',
    cutscene: 'Supernova',
    items: [
      { id: 'stellar_remnant', name: 'Stellar Remnant', icon: '💥' },
      { id: 'pulsar_shard',    name: 'Pulsar Shard',    icon: '⚡' },
      { id: 'chromatic_core',  name: 'Chromatic Core',  icon: '🌈' },
      { id: 'void_plasma',     name: 'Void Plasma',     icon: '🔴' },
    ],
  },

  // weight 0.1 → pool / 0.1 ≈ 10,024
  SERAPHIM: {
    id: 'SERAPHIM', label: 'Seraphim', weight: 0.1, debugOdds: '1/10,000', badge: '🔥',
    color: '#ffd700', glowColor: 'rgba(255,215,0,0.98)', particleColor: '#fff5a0',
    bgColor: 'rgba(14,8,0,0.99)',
    textShadow: '0 0 30px rgba(255,215,0,1), 0 0 70px rgba(255,140,0,0.95), 0 0 140px rgba(255,80,0,0.7)',
    cutscene: 'Seraphim',
    items: [
      { id: 'divine_feather', name: 'Divine Feather', icon: '🪶' },
      { id: 'throne_ember',   name: 'Throne Ember',   icon: '🔥' },
      { id: 'holy_sigil',     name: 'Holy Sigil',     icon: '✦' },
      { id: 'seraph_eye',     name: "Seraph's Eye",   icon: '👁️' },
    ],
  },

  // weight 0.05 → pool / 0.05 ≈ 20,048
  CONVERGENCE: {
    id: 'CONVERGENCE', label: 'Convergence', weight: 0.05, debugOdds: '1/20,000', badge: '∞',
    color: '#ffffff', glowColor: 'rgba(255,255,255,0.98)', particleColor: '#ffffff',
    bgColor: 'rgba(0,0,0,1)',
    textShadow: '0 0 30px rgba(255,255,255,1), 0 0 70px rgba(255,200,100,0.9), 0 0 140px rgba(200,100,255,0.8), 0 0 240px rgba(0,180,255,0.6)',
    cutscene: 'Convergence',
    items: [
      { id: 'convergence_echo',    name: 'Convergence Echo',    icon: '∞' },
      { id: 'prismatic_shard',     name: 'Prismatic Shard',     icon: '🌈' },
      { id: 'unified_singularity', name: 'Unified Singularity', icon: '⚪' },
      { id: 'all_memory',          name: 'All Memory',          icon: '💭' },
    ],
  },

  // weight 0.04 → pool / 0.04 ≈ 25,060
  MATRIX: {
    id: 'MATRIX', label: 'Matrix', weight: 0.04, debugOdds: '1/25,000', badge: '>_',
    color: '#00ff41', glowColor: 'rgba(0,255,65,0.98)', particleColor: '#00cc33',
    bgColor: 'rgba(0,4,0,1)',
    textShadow: [
      '0 0 10px #00ff41',
      '0 0 25px #00ff41',
      '0 0 60px #00cc33',
      '0 0 130px #008f11',
    ].join(', '),
    cutscene: 'Matrix',
    effects: {
      shakeIntensity: 50, particleCount: 200, rayCount: 36, ringCount: 7,
      glowMaxAlpha: 0.9, rainColumns: 50, cascadeStreams: 90, debrisParticles: 120,
      trailEnabled: true,
      titleText:   'MATRIX',
      subtitleText: '> 1 / 25,000  [SYSTEM BREACH]',
    },
    items: [
      { id: 'source_code',  name: 'Source Code',  icon: '</>' },
      { id: 'red_pill',     name: 'Red Pill',     icon: '💊' },
      { id: 'ghost_signal', name: 'Ghost Signal', icon: '📡' },
      { id: 'null_key',     name: 'Null Key',     icon: '🔑' },
    ],
  },

  // weight 0.02 → pool / 0.02 ≈ 50,120
  ELDRITCH: {
    id: 'ELDRITCH', label: 'Eldritch', weight: 0.02, debugOdds: '1/50,000', badge: '👁',
    color: '#c084fc', glowColor: 'rgba(139,43,226,0.98)', particleColor: '#8b2be2',
    bgColor: 'rgba(2,0,10,1)',
    textShadow: [
      '0 0 12px #c084fc',
      '0 0 30px #8b2be2',
      '0 0 70px #4b0082',
      '0 0 150px rgba(139,43,226,0.6)',
      '0 0 280px rgba(75,0,130,0.3)',
    ].join(', '),
    cutscene: 'Eldritch',
    effects: {
      shakeIntensity: 60, particleCount: 240, rayCount: 44, ringCount: 9,
      glowMaxAlpha: 0.95, crackCount: 7, tentacleCount: 12, madnessCount: 80,
      whisperCount: 12, distortCount: 6, runeCount: 8, auraCount: 6,
      trailEnabled: true,
    },
    items: [
      { id: 'eye_of_void',     name: 'Eye of the Void',  icon: '👁' },
      { id: 'elder_rune',      name: 'Elder Rune',       icon: 'ᚠ' },
      { id: 'sanity_fragment', name: 'Sanity Fragment',  icon: '🔮' },
      { id: 'forbidden_tome',  name: 'Forbidden Tome',   icon: '📕' },
    ],
  },

  // weight 0.01337 → pool / 0.01337 ≈ 75,000
  TIMECOLLAPSE: {
    id: 'TIMECOLLAPSE', label: 'Time Collapse', weight: 0.01337, debugOdds: '1/75,000', badge: '⧗',
    color: '#64c8ff', glowColor: 'rgba(100,200,255,0.98)', particleColor: '#a8d8ff',
    bgColor: 'rgba(0,4,14,1)',
    textShadow: [
      '0 0 12px #64c8ff',
      '0 0 30px #64c8ff',
      '0 0 70px #ffd700',
      '0 0 150px rgba(100,200,255,0.6)',
      '0 0 280px rgba(255,215,0,0.3)',
    ].join(', '),
    cutscene: 'TimeCollapse',
    effects: {
      shakeIntensity: 65, particleCount: 250, rayCount: 48, ringCount: 10,
      glowMaxAlpha: 0.95, echoCount: 40, shardCount: 65, fractureCount: 12,
      streamCount: 32, sandGrains: 40, auraCount: 7, trailEnabled: true,
    },
    items: [
      { id: 'broken_hourglass', name: 'Broken Hourglass',  icon: '⧗' },
      { id: 'paradox_shard',   name: 'Paradox Shard',     icon: '🔷' },
      { id: 'lost_second',     name: 'Lost Second',        icon: '⏱' },
      { id: 'eternal_moment',  name: 'Eternal Moment',     icon: '∞' },
    ],
  },

  // weight 0.01002 → pool / 0.01002 ≈ 100,000
  PIXELGENESIS: {
    id: 'PIXELGENESIS', label: '8-Bit Genesis', weight: 0.01002, debugOdds: '1/100,000', badge: '★',
    color: '#fcbc3c', glowColor: 'rgba(252,188,60,0.98)', particleColor: '#f8f8f8',
    bgColor: 'rgba(8,8,8,1)',
    textShadow: [
      '3px 3px 0 #080808',
      '0 0 14px #fcbc3c',
      '0 0 35px #fcbc3c',
      '0 0 80px rgba(252,188,60,0.7)',
      '0 0 180px rgba(252,188,60,0.3)',
    ].join(', '),
    cutscene: 'PixelGenesis',
    effects: {
      shakeIntensity: 55, particleCount: 220, rayCount: 40,
      glowMaxAlpha: 0.85, auraCount: 7, trailEnabled: true,
    },
    items: [
      { id: '1up_token',      name: '1-UP Token',       icon: '★' },
      { id: 'power_star',     name: 'Power Star',       icon: '⭐' },
      { id: 'golden_coin',    name: 'Golden Coin',      icon: '🪙' },
      { id: 'mystery_block',  name: 'Mystery Block',    icon: '?' },
    ],
  },

};

// Ordered most common → rarest
export const RARITY_ORDER = [
  'COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY',
  'MYTHIC', 'DIVINE', 'SUPERNOVA', 'SERAPHIM', 'CONVERGENCE', 'MATRIX', 'ELDRITCH', 'TIMECOLLAPSE', 'PIXELGENESIS',
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