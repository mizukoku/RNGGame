// config/RarityConfig.js
//
// Weight pool ≈ 1002.39  (total / weight = odds)
// All debugOdds expressed as 1/N strings.
//
export const RARITIES = {
  COMMON: {
    id: "COMMON",
    label: "Common",
    weight: 600,
    debugOdds: "1/2",
    badge: "",
    color: "#a8b5c8",
    glowColor: "rgba(168,181,200,0.4)",
    particleColor: "#c0ccd8",
    bgColor: "rgba(30,35,45,0.95)",
    textShadow: "0 0 10px rgba(168,181,200,0.6)",
    cutscene: "NormalScene",
    items: [
      { id: "stone_shard", name: "Stone Shard", icon: "🪨" },
      { id: "iron_dust", name: "Iron Dust", icon: "⚙️" },
      { id: "dim_crystal", name: "Dim Crystal", icon: "💎" },
      { id: "worn_coin", name: "Worn Coin", icon: "🪙" },
    ],
  },

  UNCOMMON: {
    id: "UNCOMMON",
    label: "Uncommon",
    weight: 250,
    debugOdds: "1/4",
    badge: "",
    color: "#4ade80",
    glowColor: "rgba(74,222,128,0.5)",
    particleColor: "#86efac",
    bgColor: "rgba(10,30,15,0.95)",
    textShadow: "0 0 15px rgba(74,222,128,0.8)",
    cutscene: "NormalScene",
    items: [
      { id: "forest_gem", name: "Forest Gem", icon: "🌿" },
      { id: "silver_leaf", name: "Silver Leaf", icon: "🍃" },
      { id: "jade_shard", name: "Jade Shard", icon: "🟢" },
      { id: "vine_ring", name: "Vine Ring", icon: "💍" },
    ],
  },

  RARE: {
    id: "RARE",
    label: "Rare",
    weight: 100,
    debugOdds: "1/10",
    badge: "💎",
    color: "#60a5fa",
    glowColor: "rgba(96,165,250,0.6)",
    particleColor: "#93c5fd",
    bgColor: "rgba(5,15,40,0.97)",
    textShadow: "0 0 20px rgba(96,165,250,0.9)",
    cutscene: "RareScene",
    items: [
      { id: "azure_orb", name: "Azure Orb", icon: "🔵" },
      { id: "storm_essence", name: "Storm Essence", icon: "⚡" },
      { id: "tide_pearl", name: "Tide Pearl", icon: "🫧" },
      { id: "frost_shard", name: "Frost Shard", icon: "❄️" },
    ],
  },

  EPIC: {
    id: "EPIC",
    label: "Epic",
    weight: 40,
    debugOdds: "1/25",
    badge: "💜",
    color: "#c084fc",
    glowColor: "rgba(192,132,252,0.7)",
    particleColor: "#d8b4fe",
    bgColor: "rgba(20,5,40,0.98)",
    textShadow: "0 0 25px rgba(192,132,252,1)",
    cutscene: "EpicScene",
    items: [
      { id: "void_fragment", name: "Void Fragment", icon: "🌀" },
      { id: "soul_crystal", name: "Soul Crystal", icon: "🔮" },
      { id: "eclipse_eye", name: "Eclipse Eye", icon: "👁️" },
      { id: "phantom_core", name: "Phantom Core", icon: "💜" },
    ],
  },

  LEGENDARY: {
    id: "LEGENDARY",
    label: "Legendary",
    weight: 9,
    debugOdds: "1/111",
    badge: "👑",
    color: "#fbbf24",
    glowColor: "rgba(251,191,36,0.8)",
    particleColor: "#fde68a",
    bgColor: "rgba(30,20,0,0.99)",
    textShadow: "0 0 40px rgba(251,191,36,1), 0 0 80px rgba(251,100,0,0.5)",
    cutscene: "LegendaryScene",
    items: [
      { id: "solar_heart", name: "Solar Heart", icon: "☀️" },
      { id: "celestial_crown", name: "Celestial Crown", icon: "👑" },
      { id: "eternal_flame", name: "Eternal Flame", icon: "🔥" },
      { id: "cosmos_seed", name: "Cosmos Seed", icon: "🌟" },
    ],
  },

  MYTHIC: {
    id: "MYTHIC",
    label: "Mythic",
    weight: 2,
    debugOdds: "1/500",
    badge: "☄",
    color: "#ffe066",
    glowColor: "rgba(255,224,102,0.9)",
    particleColor: "#fff3a0",
    bgColor: "rgba(20,15,0,0.99)",
    textShadow:
      "0 0 40px rgba(255,224,102,1), 0 0 100px rgba(255,140,0,0.7), 0 0 180px rgba(255,80,0,0.4)",
    cutscene: "CometStrike",
    items: [
      { id: "comet_fragment", name: "Comet Fragment", icon: "☄️" },
      { id: "gods_tear", name: "God's Tear", icon: "💫" },
      { id: "omega_core", name: "Omega Core", icon: "⭐" },
    ],
  },

  DIVINE: {
    id: "DIVINE",
    label: "Divine",
    weight: 1,
    debugOdds: "1/1,000",
    badge: "✦",
    color: "#cc88ff",
    glowColor: "rgba(160,60,255,0.95)",
    particleColor: "#e0aaff",
    bgColor: "rgba(8,0,18,0.99)",
    textShadow:
      "0 0 30px rgba(200,80,255,1), 0 0 70px rgba(140,0,255,0.8), 0 0 140px rgba(80,0,200,0.5)",
    cutscene: "StellarCollapse",
    items: [
      { id: "neutron_core", name: "Neutron Core", icon: "🌌" },
      { id: "void_singularity", name: "Void Singularity", icon: "⚫" },
      { id: "pulsar_heart", name: "Pulsar Heart", icon: "💠" },
      { id: "event_horizon", name: "Event Horizon", icon: "🔮" },
    ],
  },

  // weight 0.2 → pool / 0.2 ≈ 5,012
  SUPERNOVA: {
    id: "SUPERNOVA",
    label: "Supernova",
    weight: 0.2,
    debugOdds: "1/5,000",
    badge: "💥",
    color: "#ff6600",
    glowColor: "rgba(255,102,0,0.95)",
    particleColor: "#ffcc00",
    bgColor: "rgba(12,2,0,0.99)",
    textShadow:
      "0 0 30px rgba(255,102,0,1), 0 0 70px rgba(255,0,100,0.9), 0 0 140px rgba(140,0,255,0.6)",
    cutscene: "Supernova",
    items: [
      { id: "stellar_remnant", name: "Stellar Remnant", icon: "💥" },
      { id: "pulsar_shard", name: "Pulsar Shard", icon: "⚡" },
      { id: "chromatic_core", name: "Chromatic Core", icon: "🌈" },
      { id: "void_plasma", name: "Void Plasma", icon: "🔴" },
    ],
  },

  // weight 0.1 → pool / 0.1 ≈ 10,024
  SERAPHIM: {
    id: "SERAPHIM",
    label: "Seraphim",
    weight: 0.1,
    debugOdds: "1/10,000",
    badge: "🔥",
    color: "#ffd700",
    glowColor: "rgba(255,215,0,0.98)",
    particleColor: "#fff5a0",
    bgColor: "rgba(14,8,0,0.99)",
    textShadow:
      "0 0 30px rgba(255,215,0,1), 0 0 70px rgba(255,140,0,0.95), 0 0 140px rgba(255,80,0,0.7)",
    cutscene: "Seraphim",
    items: [
      { id: "divine_feather", name: "Divine Feather", icon: "🪶" },
      { id: "throne_ember", name: "Throne Ember", icon: "🔥" },
      { id: "holy_sigil", name: "Holy Sigil", icon: "✦" },
      { id: "seraph_eye", name: "Seraph's Eye", icon: "👁️" },
    ],
  },

  // weight 0.05 → pool / 0.05 ≈ 20,048
  CONVERGENCE: {
    id: "CONVERGENCE",
    label: "Convergence",
    weight: 0.05,
    debugOdds: "1/20,000",
    badge: "∞",
    color: "#ffffff",
    glowColor: "rgba(255,255,255,0.98)",
    particleColor: "#ffffff",
    bgColor: "rgba(0,0,0,1)",
    textShadow:
      "0 0 30px rgba(255,255,255,1), 0 0 70px rgba(255,200,100,0.9), 0 0 140px rgba(200,100,255,0.8), 0 0 240px rgba(0,180,255,0.6)",
    cutscene: "Convergence",
    items: [
      { id: "convergence_echo", name: "Convergence Echo", icon: "∞" },
      { id: "prismatic_shard", name: "Prismatic Shard", icon: "🌈" },
      { id: "unified_singularity", name: "Unified Singularity", icon: "⚪" },
      { id: "all_memory", name: "All Memory", icon: "💭" },
    ],
  },

  // weight 0.04 → pool / 0.04 ≈ 25,060
  MATRIX: {
    id: "MATRIX",
    label: "Matrix",
    weight: 0.04,
    debugOdds: "1/25,000",
    badge: ">_",
    color: "#00ff41",
    glowColor: "rgba(0,255,65,0.98)",
    particleColor: "#00cc33",
    bgColor: "rgba(0,4,0,1)",
    textShadow: [
      "0 0 10px #00ff41",
      "0 0 25px #00ff41",
      "0 0 60px #00cc33",
      "0 0 130px #008f11",
    ].join(", "),
    cutscene: "Matrix",
    effects: {
      shakeIntensity: 50,
      particleCount: 200,
      rayCount: 36,
      ringCount: 7,
      glowMaxAlpha: 0.9,
      rainColumns: 50,
      cascadeStreams: 90,
      debrisParticles: 120,
      trailEnabled: true,
      titleText: "MATRIX",
      subtitleText: "> 1 / 25,000  [SYSTEM BREACH]",
    },
    items: [
      { id: "source_code", name: "Source Code", icon: "</>" },
      { id: "red_pill", name: "Red Pill", icon: "💊" },
      { id: "ghost_signal", name: "Ghost Signal", icon: "📡" },
      { id: "null_key", name: "Null Key", icon: "🔑" },
    ],
  },

  // weight 0.02 → pool / 0.02 ≈ 50,120
  ELDRITCH: {
    id: "ELDRITCH",
    label: "Eldritch",
    weight: 0.02,
    debugOdds: "1/50,000",
    badge: "👁",
    color: "#c084fc",
    glowColor: "rgba(139,43,226,0.98)",
    particleColor: "#8b2be2",
    bgColor: "rgba(2,0,10,1)",
    textShadow: [
      "0 0 12px #c084fc",
      "0 0 30px #8b2be2",
      "0 0 70px #4b0082",
      "0 0 150px rgba(139,43,226,0.6)",
      "0 0 280px rgba(75,0,130,0.3)",
    ].join(", "),
    cutscene: "Eldritch",
    effects: {
      shakeIntensity: 60,
      particleCount: 240,
      rayCount: 44,
      ringCount: 9,
      glowMaxAlpha: 0.95,
      crackCount: 7,
      tentacleCount: 12,
      madnessCount: 80,
      whisperCount: 12,
      distortCount: 6,
      runeCount: 8,
      auraCount: 6,
      trailEnabled: true,
    },
    items: [
      { id: "eye_of_void", name: "Eye of the Void", icon: "👁" },
      { id: "elder_rune", name: "Elder Rune", icon: "ᚠ" },
      { id: "sanity_fragment", name: "Sanity Fragment", icon: "🔮" },
      { id: "forbidden_tome", name: "Forbidden Tome", icon: "📕" },
    ],
  },

  // weight 0.01337 → pool / 0.01337 ≈ 75,000
  TIMECOLLAPSE: {
    id: "TIMECOLLAPSE",
    label: "Time Collapse",
    weight: 0.01337,
    debugOdds: "1/75,000",
    badge: "⧗",
    color: "#64c8ff",
    glowColor: "rgba(100,200,255,0.98)",
    particleColor: "#a8d8ff",
    bgColor: "rgba(0,4,14,1)",
    textShadow: [
      "0 0 12px #64c8ff",
      "0 0 30px #64c8ff",
      "0 0 70px #ffd700",
      "0 0 150px rgba(100,200,255,0.6)",
      "0 0 280px rgba(255,215,0,0.3)",
    ].join(", "),
    cutscene: "TimeCollapse",
    effects: {
      shakeIntensity: 65,
      particleCount: 250,
      rayCount: 48,
      ringCount: 10,
      glowMaxAlpha: 0.95,
      echoCount: 40,
      shardCount: 65,
      fractureCount: 12,
      streamCount: 32,
      sandGrains: 40,
      auraCount: 7,
      trailEnabled: true,
    },
    items: [
      { id: "broken_hourglass", name: "Broken Hourglass", icon: "⧗" },
      { id: "paradox_shard", name: "Paradox Shard", icon: "🔷" },
      { id: "lost_second", name: "Lost Second", icon: "⏱" },
      { id: "eternal_moment", name: "Eternal Moment", icon: "∞" },
    ],
  },

  // weight 0.01002 → pool / 0.01002 ≈ 100,000
  PIXELGENESIS: {
    id: "PIXELGENESIS",
    label: "8-Bit Genesis",
    weight: 0.01002,
    debugOdds: "1/100,000",
    badge: "★",
    color: "#fcbc3c",
    glowColor: "rgba(252,188,60,0.98)",
    particleColor: "#f8f8f8",
    bgColor: "rgba(8,8,8,1)",
    textShadow: [
      "3px 3px 0 #080808",
      "0 0 14px #fcbc3c",
      "0 0 35px #fcbc3c",
      "0 0 80px rgba(252,188,60,0.7)",
      "0 0 180px rgba(252,188,60,0.3)",
    ].join(", "),
    cutscene: "PixelGenesis",
    effects: {
      shakeIntensity: 55,
      particleCount: 220,
      rayCount: 40,
      glowMaxAlpha: 0.85,
      auraCount: 7,
      trailEnabled: true,
    },
    items: [
      { id: "1up_token", name: "1-UP Token", icon: "★" },
      { id: "power_star", name: "Power Star", icon: "⭐" },
      { id: "golden_coin", name: "Golden Coin", icon: "🪙" },
      { id: "mystery_block", name: "Mystery Block", icon: "?" },
    ],
  },

  // weight 0.00802 → pool / 0.00802 ≈ 125,000
  VOIDAWAKENS: {
    id: "VOIDAWAKENS",
    label: "Void Awakens",
    weight: 0.00802,
    debugOdds: "1/125,000",
    badge: "◉",
    color: "#c8a8ff",
    glowColor: "rgba(200,168,255,0.98)",
    particleColor: "#f0e8ff",
    bgColor: "rgba(0,0,8,1)",
    textShadow: [
      "0 0 10px #9060ff",
      "0 0 26px #9060ff",
      "0 0 60px rgba(144,96,255,0.8)",
      "0 0 140px rgba(144,96,255,0.5)",
      "0 0 280px rgba(64,200,255,0.25)",
    ].join(", "),
    cutscene: "VoidAwakens",
    effects: {
      shakeIntensity: 72,
      particleCount: 270,
      rayCount: 52,
      glowMaxAlpha: 0.96,
      auraCount: 8,
      trailEnabled: true,
      tendrilCount: 24,
      shardCount: 90,
      starCount: 120,
      symbolCount: 10,
    },
    items: [
      { id: "singularity_shard", name: "Singularity Shard", icon: "◉" },
      { id: "void_essence", name: "Void Essence", icon: "⊗" },
      { id: "newborn_star", name: "Newborn Star", icon: "✦" },
      { id: "reality_crack", name: "Reality Crack", icon: "⊘" },
    ],
  },

  // weight 0.00668 → pool / 0.00668 ≈ 150,000
  SACREDBLADE: {
    id: "SACREDBLADE",
    label: "Sacred Blade",
    weight: 0.00668,
    debugOdds: "1/150,000",
    badge: "⚔",
    color: "#ffd700",
    glowColor: "rgba(255,215,0,0.99)",
    particleColor: "#fffef0",
    bgColor: "rgba(12,8,0,1)",
    textShadow:
      "2px 2px 0 #0c0800, 0 0 10px #ffd700, 0 0 28px #ffd700, 0 0 70px rgba(255,215,0,0.8), 0 0 160px rgba(255,215,0,0.4)",
    cutscene: "SacredBlade",
    effects: {
      shakeIntensity: 70,
      particleCount: 260,
      rayCount: 52,
      glowMaxAlpha: 0.98,
      auraCount: 8,
      trailEnabled: true,
    },
    items: [
      { id: "holy_shard", name: "Holy Shard", icon: "⚔" },
      { id: "divine_sigil", name: "Divine Sigil", icon: "✦" },
      { id: "sacred_crystal", name: "Sacred Crystal", icon: "💎" },
      { id: "worthy_mark", name: "Mark of the Worthy", icon: "👑" },
    ],
  },

  // weight 0.005012 → pool / 0.005012 ≈ 200,000
  THEOBSERVER: {
    id: "THEOBSERVER",
    label: "The Observer",
    weight: 0.005012,
    debugOdds: "1/200,000",
    badge: "👁",
    color: "#9933cc",
    glowColor: "rgba(100,0,180,0.99)",
    particleColor: "#c8a8ff",
    bgColor: "rgba(2,0,6,1)",
    textShadow:
      "0 0 10px rgba(160,80,255,.7), 0 0 28px rgba(120,40,200,.5), 0 0 70px rgba(100,0,180,.35), 0 0 150px rgba(80,0,150,.2)",
    cutscene: "TheObserver",
    effects: {
      glowMaxAlpha: 0.72,
    },
    items: [
      { id: "watchers_eye", name: "Watcher's Eye", icon: "👁" },
      { id: "void_iris", name: "Void Iris", icon: "◉" },
      { id: "silent_mark", name: "Silent Mark", icon: "✦" },
      { id: "witnessed_shard", name: "Witnessed Shard", icon: "💜" },
    ],
  },

  // weight 0.003341 → pool / 0.003341 ≈ 300,000
  THEFRACTAL: {
    id: "THEFRACTAL",
    label: "The Fractal",
    weight: 0.003341,
    debugOdds: "1/300,000",
    badge: "◈",
    color: "#00ffcc",
    glowColor: "rgba(0,255,204,0.99)",
    particleColor: "#ffffff",
    bgColor: "rgba(0,5,10,1)",
    textShadow:
      "0 0 8px #00ffcc, 0 0 22px #00ffcc, 0 0 60px rgba(0,255,204,.6), 0 0 140px rgba(0,255,204,.3)",
    cutscene: "TheFractal",
    effects: {
      shakeIntensity: 80,
      particleCount: 280,
      rayCount: 60,
      glowMaxAlpha: 0.92,
      auraCount: 8,
      trailEnabled: true,
    },
    items: [
      { id: "prime_equation", name: "Prime Equation", icon: "◈" },
      { id: "fractal_shard", name: "Fractal Shard", icon: "💎" },
      { id: "golden_ratio", name: "Golden Ratio", icon: "φ" },
      { id: "void_formula", name: "Void Formula", icon: "∞" },
    ],
  },

  // weight 0.002506 → pool / 0.002506 ≈ 400,000
  THELASTLIGHT: {
    id: "THELASTLIGHT",
    label: "The Last Light",
    weight: 0.002506,
    debugOdds: "1/400,000",
    badge: "🕯",
    color: "#ff9933",
    glowColor: "rgba(255,80,0,0.99)",
    particleColor: "#fff8f0",
    bgColor: "rgba(4,1,0,1)",
    textShadow:
      "0 0 8px #ff9933, 0 0 22px #ff4400, 0 0 60px rgba(255,68,0,.55), 0 0 140px rgba(255,40,0,.25)",
    cutscene: "TheLastLight",
    effects: {
      shakeIntensity: 90,
      particleCount: 320,
      rayCount: 48,
      glowMaxAlpha: 0.95,
      auraCount: 6,
      trailEnabled: true,
    },
    items: [
      { id: "dying_ember", name: "Dying Ember", icon: "🕯" },
      { id: "last_photon", name: "Last Photon", icon: "✦" },
      { id: "heat_remnant", name: "Heat Remnant", icon: "🔥" },
      { id: "final_witness", name: "Final Witness", icon: "◎" },
    ],
  },

  // weight 0.002005 → pool / 0.002005 ≈ 500,000
  THENATION: {
    id: "THENATION",
    label: "The Nation",
    weight: 0.002005,
    debugOdds: "1/500,000",
    badge: "♛",
    color: "#ffd700",
    glowColor: "rgba(255,215,0,0.99)",
    particleColor: "#f5e6c8",
    bgColor: "rgba(5,3,0,1)",
    textShadow:
      "0 0 8px #ffd700, 0 0 24px rgba(255,215,0,.7), 0 0 65px rgba(255,200,0,.4), 0 0 150px rgba(255,180,0,.2)",
    cutscene: "TheNation",
    effects: {
      shakeIntensity: 85,
      particleCount: 300,
      rayCount: 56,
      glowMaxAlpha: 0.95,
      auraCount: 8,
      trailEnabled: true,
    },
    items: [
      { id: "founding_seal", name: "Founding Seal", icon: "♛" },
      { id: "banner_shard", name: "Banner Shard", icon: "⚑" },
      { id: "crown_fragment", name: "Crown Fragment", icon: "♔" },
      { id: "peoples_oath", name: "People's Oath", icon: "✦" },
    ],
  },

  // weight 0.001671 → pool / 0.001671 ≈ 600,000
  THEENDLESSDREAM: {
    id: "THEENDLESSDREAM",
    label: "The Endless Dream",
    weight: 0.001671,
    debugOdds: "1/600,000",
    badge: "∿",
    color: "#c8a0ff",
    glowColor: "rgba(200,160,255,0.99)",
    particleColor: "#fffacc",
    bgColor: "rgba(3,0,12,1)",
    textShadow:
      "0 0 8px #c8a0ff, 0 0 25px rgba(200,160,255,.8), 0 0 70px rgba(153,102,255,.5), 0 0 160px rgba(120,60,220,.25)",
    cutscene: "TheEndlessDream",
    effects: {
      shakeIntensity: 40,
      particleCount: 240,
      rayCount: 44,
      glowMaxAlpha: 0.88,
      auraCount: 6,
      trailEnabled: true,
    },
    items: [
      { id: "falling_shard", name: "Falling Shard", icon: "∿" },
      { id: "dream_petal", name: "Dream Petal", icon: "🌸" },
      { id: "broken_clock", name: "Broken Clock", icon: "⌛" },
      { id: "ghost_memory", name: "Ghost Memory", icon: "◌" },
    ],
  },

  // weight 0.001432 → pool / 0.001432 ≈ 700,000
  REBIRTH: {
    id: "REBIRTH",
    label: "Rebirth",
    weight: 0.001432,
    debugOdds: "1/700,000",
    badge: "✦",
    color: "#ffd080",
    glowColor: "rgba(255,208,128,0.99)",
    particleColor: "#fff8e8",
    bgColor: "rgba(6,2,0,1)",
    textShadow:
      "0 0 10px #ffd080, 0 0 28px rgba(255,208,128,.8), 0 0 80px rgba(255,180,60,.5), 0 0 200px rgba(255,140,40,.25)",
    cutscene: "Rebirth",
    effects: {
      shakeIntensity: 75,
      particleCount: 300,
      rayCount: 52,
      glowMaxAlpha: 0.95,
      auraCount: 8,
      trailEnabled: true,
    },
    items: [
      { id: "soul_ember", name: "Soul Ember", icon: "✦" },
      { id: "first_light", name: "First Light", icon: "◎" },
      { id: "ancient_word", name: "Ancient Word", icon: "𝕿" },
      { id: "bloom_shard", name: "Bloom Shard", icon: "🌟" },
    ],
  },

  // weight 0.001253 → pool / 0.001253 ≈ 800,000
  THEGOLDENHOUR: {
    id: "THEGOLDENHOUR",
    label: "The Golden Hour",
    weight: 0.001253,
    debugOdds: "1/800,000",
    badge: "☀",
    color: "#ffb347",
    glowColor: "rgba(255,179,71,0.99)",
    particleColor: "#fff4b8",
    bgColor: "rgba(6,3,0,1)",
    textShadow:
      "0 0 10px #ffb347, 0 0 30px rgba(255,179,71,.8), 0 0 80px rgba(255,140,40,.5), 0 0 200px rgba(255,100,20,.25)",
    cutscene: "TheGoldenHour",
    effects: {
      shakeIntensity: 70,
      particleCount: 320,
      rayCount: 60,
      glowMaxAlpha: 0.95,
      auraCount: 8,
      trailEnabled: true,
    },
    items: [
      { id: "amber_fragment", name: "Amber Fragment", icon: "☀" },
      { id: "last_ray", name: "Last Ray", icon: "◐" },
      { id: "golden_dust", name: "Golden Dust", icon: "✦" },
      { id: "dusk_memory", name: "Dusk Memory", icon: "◑" },
    ],
  },

  // weight 0.001114 → pool / 0.001114 ≈ 900,000
  NIGHTFALL: {
    id: "NIGHTFALL",
    label: "NightFall",
    weight: 0.001114,
    debugOdds: "1/900,000",
    badge: "✦",
    color: "#8899ff",
    glowColor: "rgba(136,153,255,0.99)",
    particleColor: "#c8d8ff",
    bgColor: "rgba(0,0,8,1)",
    textShadow:
      "0 0 10px #c8d8ff, 0 0 28px rgba(136,153,255,.8), 0 0 70px rgba(100,120,255,.5), 0 0 180px rgba(80,100,255,.25)",
    cutscene: "NightFall",
    effects: {
      shakeIntensity: 95,
      particleCount: 350,
      rayCount: 64,
      glowMaxAlpha: 0.98,
      auraCount: 8,
      trailEnabled: true,
    },
    items: [
      { id: "starfall_shard", name: "Starfall Shard", icon: "✦" },
      { id: "aurora_ribbon", name: "Aurora Ribbon", icon: "◈" },
      { id: "moon_fragment", name: "Moon Fragment", icon: "◑" },
      { id: "night_echo", name: "Night Echo", icon: "◌" },
    ],
  },

  THEJUDGEMENT: {
    id: "THEJUDGEMENT",
    label: "The Judgement",
    weight: 0.001002,
    debugOdds: "1/1,000,000",
    badge: "⚖",
    color: "#ffd700",
    glowColor: "rgba(255,215,0,0.99)",
    particleColor: "#fffef0",
    bgColor: "rgba(4,2,0,1)",
    textShadow: [
      "0 0 10px #ffd700",
      "0 0 30px rgba(255,215,0,.8)",
      "0 0 80px rgba(255,140,0,.5)",
      "0 0 200px rgba(255,100,0,.25)",
    ].join(", "),
    cutscene: "TheJudgement",
    effects: {
      shakeIntensity: 0, // handled entirely inside the cutscene
      particleCount: 0,
      glowMaxAlpha: 0,
      trailEnabled: false,
    },
    items: [
      { id: "verdict_shard", name: "Verdict Shard", icon: "⚖" },
      { id: "final_ruling", name: "Final Ruling", icon: "⚔" },
      { id: "determination", name: "Determination", icon: "❤" },
      { id: "judges_eye", name: "Judge's Eye", icon: "👁" },
    ],
  },
};

// Ordered most common → rarest
export const RARITY_ORDER = [
  "COMMON",
  "UNCOMMON",
  "RARE",
  "EPIC",
  "LEGENDARY",
  "MYTHIC",
  "DIVINE",
  "SUPERNOVA",
  "SERAPHIM",
  "CONVERGENCE",
  "MATRIX",
  "ELDRITCH",
  "TIMECOLLAPSE",
  "PIXELGENESIS",
  "VOIDAWAKENS",
  "SACREDBLADE",
  "THEOBSERVER",
  "THEFRACTAL",
  "THELASTLIGHT",
  "THENATION",
  "THEENDLESSDREAM",
  "REBIRTH",
  "THEGOLDENHOUR",
  "NIGHTFALL",
  "THEJUDGEMENT",
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
