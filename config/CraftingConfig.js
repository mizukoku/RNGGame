// config/CraftingConfig.js
//
// ─── Crafting philosophy (v4) ─────────────────────────────────────────────────
//
//  Luck multipliers are NO LONGER compressed or capped.
//  The multiplier you see here IS the luck value added to your stack.
//
//  If you have dreaming_rebirth (750x) active: your luck = 750x
//  If you also activate holy_light (2.5x):     your luck = 752.5x
//  P(THEJUDGEMENT) with 750x luck = 750 / 1,000,000 = 1/1,333
//
//  Synergy recipes (Tier S) require sacrificing actual rare drops as ingredients.
//  The cost of crafting them IS getting those drops in the first place.
//
//  Cost sanity check — "Final Verdict" (1000x, 5 rolls):
//    Requires: 1× THEJUDGEMENT drop  (1/1,000,000) + 1× THEENDLESSDREAM drop (1/600,000)
//    Getting THEJUDGEMENT alone takes ~1,000,000 rolls on average.
//    Once crafted: P(THEJUDGEMENT) = 1000/1M = 1/1000 per roll × 5 rolls ≈ 0.5% total
//    You are spending the miracle to have a chance at another miracle. ✓
//
// ─── Adding new recipes ───────────────────────────────────────────────────────
//
//  Add an entry below. CraftingSystem and CraftingPanel pick it up automatically.
//  Category must match one of the CATEGORIES ids below (or add a new one there).

export const RECIPES = [
  // ══════════════════════════════════════════════════════════════════════════
  // TIER I — Common/Uncommon ingredients
  //          Cheap, plentiful, good starting luck.
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "cosmic_brew",
    name: "Cosmic Brew",
    icon: "🌌",
    desc: "Earth and storm fused. The cosmos conspires for you.",
    ingredients: [
      { rarityId: "COMMON", count: 4 },
      { rarityId: "UNCOMMON", count: 2 },
    ],
    buff: {
      name: "Cosmic Brew",
      icon: "🌌",
      multiplier: 1.6,
      rolls: 70,
      color: "#a78bfa",
    },
    category: "tier1",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // TIER II — Uncommon + Rare ingredients
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "star_forge",
    name: "Star Forge",
    icon: "⭐",
    desc: "Rarity transmuted through fire and focus.",
    ingredients: [
      { rarityId: "UNCOMMON", count: 2 },
      { rarityId: "RARE", count: 1 },
    ],
    buff: {
      name: "Star Forge",
      icon: "⭐",
      multiplier: 2.0,
      rolls: 55,
      color: "#93c5fd",
    },
    category: "tier2",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // TIER III — Rare + Epic ingredients
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "celestial_pact",
    name: "Celestial Pact",
    icon: "🔮",
    desc: "A promise sealed between the mortal and the divine.",
    ingredients: [
      { rarityId: "RARE", count: 1 },
      { rarityId: "EPIC", count: 1 },
    ],
    buff: {
      name: "Celestial Pact",
      icon: "🔮",
      multiplier: 2.8,
      rolls: 45,
      color: "#818cf8",
    },
    category: "tier3",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // TIER IV — Epic + Legendary ingredients
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "nexus_crown",
    name: "Nexus Crown",
    icon: "👑",
    desc: "All paths converge. Roll as if you are already chosen.",
    ingredients: [
      { rarityId: "EPIC", count: 1 },
      { rarityId: "LEGENDARY", count: 1 },
    ],
    buff: {
      name: "Nexus Crown",
      icon: "👑",
      multiplier: 4.0,
      rolls: 35,
      color: "#fde68a",
    },
    category: "tier4",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // TIER V — Legendary + Matrix ingredients
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "binary_heart",
    name: "Binary Heart",
    icon: "💻",
    desc: "Logic and chaos fused. The system favours you.",
    ingredients: [
      { rarityId: "LEGENDARY", count: 1 },
      { rarityId: "MATRIX", count: 1 },
    ],
    buff: {
      name: "Binary Heart",
      icon: "💻",
      multiplier: 25.0,
      rolls: 8,
      color: "#00ff41",
    },
    category: "tier5",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // TIER VI — Mythic + Divine  (1/500 + 1/1,000)
  //           ~1,500 rolls to gather. Effective luck: ×8–12
  //           THEJUDGEMENT: 1/1M → 1/83,000–125,000
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "myth_of_the_gods",
    name: "Myth of the Gods",
    icon: "⚡",
    desc: "Divinity met myth and neither survived unchanged.",
    ingredients: [
      { rarityId: "MYTHIC", count: 1 },
      { rarityId: "DIVINE", count: 1 },
    ],
    buff: {
      name: "Myth of the Gods",
      icon: "⚡",
      multiplier: 8.0,
      rolls: 20,
      color: "#cc88ff",
    },
    category: "tier6",
  },

  {
    id: "divine_comet",
    name: "Divine Comet",
    icon: "☄",
    desc: "A comet blessed by gods. It falls with purpose.",
    ingredients: [
      { rarityId: "MYTHIC", count: 2 },
      { rarityId: "DIVINE", count: 1 },
    ],
    buff: {
      name: "Divine Comet",
      icon: "☄",
      multiplier: 12.0,
      rolls: 15,
      color: "#ffe066",
    },
    category: "tier6",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // TIER VII — Divine + Supernova  (1/1,000 + 1/5,000)
  //            ~6,000 rolls to gather. Effective luck: ×15–22
  //            THEJUDGEMENT: 1/1M → 1/45,000–67,000
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "solar_deity",
    name: "Solar Deity",
    icon: "🌞",
    desc: "The star didn't just collapse. It ascended.",
    ingredients: [
      { rarityId: "DIVINE", count: 1 },
      { rarityId: "SUPERNOVA", count: 1 },
    ],
    buff: {
      name: "Solar Deity",
      icon: "🌞",
      multiplier: 15.0,
      rolls: 15,
      color: "#ff9933",
    },
    category: "tier7",
  },

  {
    id: "celestial_collapse",
    name: "Celestial Collapse",
    icon: "💥",
    desc: "Heaven folded in on itself. What emerged defies classification.",
    ingredients: [
      { rarityId: "DIVINE", count: 2 },
      { rarityId: "SUPERNOVA", count: 1 },
    ],
    buff: {
      name: "Celestial Collapse",
      icon: "💥",
      multiplier: 22.0,
      rolls: 12,
      color: "#ff6600",
    },
    category: "tier7",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // TIER VIII — Supernova + Seraphim  (1/5,000 + 1/10,000)
  //             ~15,000 rolls to gather. Effective luck: ×28–35
  //             THEJUDGEMENT: 1/1M → 1/28,000–36,000
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "heavens_last_star",
    name: "Heaven's Last Star",
    icon: "🔥",
    desc: "The seraph witnessed the supernova. Only one of them came back.",
    ingredients: [
      { rarityId: "SUPERNOVA", count: 1 },
      { rarityId: "SERAPHIM", count: 1 },
    ],
    buff: {
      name: "Heaven's Last Star",
      icon: "🔥",
      multiplier: 28.0,
      rolls: 10,
      color: "#ffd700",
    },
    category: "tier8",
  },

  {
    id: "throne_supernova",
    name: "Throne Supernova",
    icon: "👑",
    desc: "The throne room incinerated. The crown survived.",
    ingredients: [
      { rarityId: "SUPERNOVA", count: 2 },
      { rarityId: "SERAPHIM", count: 1 },
    ],
    buff: {
      name: "Throne Supernova",
      icon: "👑",
      multiplier: 35.0,
      rolls: 8,
      color: "#ffcc00",
    },
    category: "tier8",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // TIER IX — Seraphim + Convergence  (1/10,000 + 1/20,000)
  //           ~30,000 rolls to gather. Effective luck: ×55–75
  //           THEJUDGEMENT: 1/1M → 1/13,000–18,000
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "infinite_seraph",
    name: "Infinite Seraph",
    icon: "∞",
    desc: "When all things converge, even angels lose count.",
    ingredients: [
      { rarityId: "SERAPHIM", count: 1 },
      { rarityId: "CONVERGENCE", count: 1 },
    ],
    buff: {
      name: "Infinite Seraph",
      icon: "∞",
      multiplier: 55.0,
      rolls: 8,
      color: "#ffffff",
    },
    category: "tier9",
  },

  {
    id: "prismatic_throne",
    name: "Prismatic Throne",
    icon: "🌈",
    desc: "A seat of power built from the intersection of every possible reality.",
    ingredients: [
      { rarityId: "SERAPHIM", count: 2 },
      { rarityId: "CONVERGENCE", count: 1 },
    ],
    buff: {
      name: "Prismatic Throne",
      icon: "🌈",
      multiplier: 75.0,
      rolls: 6,
      color: "#e0aaff",
    },
    category: "tier9",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // CROSS-CHAIN — skip-step combos mixing non-adjacent unused auras
  //               High cost, high reward.
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "mythic_sunrise",
    name: "Mythic Sunrise",
    icon: "☀",
    desc: "Myths are born in the first light. This one never ended.",
    ingredients: [
      { rarityId: "MYTHIC", count: 1 },
      { rarityId: "THEGOLDENHOUR", count: 1 },
    ],
    buff: {
      name: "Mythic Sunrise",
      icon: "☀",
      multiplier: 150.0,
      rolls: 6,
      color: "#ffb347",
    },
    category: "cross",
  },

  {
    id: "divine_nightfall",
    name: "Divine Nightfall",
    icon: "✦",
    desc: "Even gods sleep. What they dream of falls as stars.",
    ingredients: [
      { rarityId: "DIVINE", count: 1 },
      { rarityId: "NIGHTFALL", count: 1 },
    ],
    buff: {
      name: "Divine Nightfall",
      icon: "✦",
      multiplier: 180.0,
      rolls: 6,
      color: "#8899ff",
    },
    category: "cross",
  },

  {
    id: "supernova_nightfall",
    name: "Supernova Nightfall",
    icon: "◈",
    desc: "The explosion that created the night sky. Everything came from this.",
    ingredients: [
      { rarityId: "SUPERNOVA", count: 1 },
      { rarityId: "NIGHTFALL", count: 1 },
    ],
    buff: {
      name: "Supernova Nightfall",
      icon: "◈",
      multiplier: 220.0,
      rolls: 6,
      color: "#c8d8ff",
    },
    category: "cross",
  },

  {
    id: "dark_convergence",
    name: "The Dark Convergence",
    icon: "⊗",
    desc: "All things converge. Even darkness has a centre.",
    ingredients: [
      { rarityId: "CONVERGENCE", count: 1 },
      { rarityId: "NIGHTFALL", count: 1 },
    ],
    buff: {
      name: "The Dark Convergence",
      icon: "⊗",
      multiplier: 280.0,
      rolls: 6,
      color: "#6699ff",
    },
    category: "cross",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // GOLDEN HOUR CHAIN — The Golden Hour (1/800,000) based recipes
  //                     ~800k–1.7M rolls per pair of ingredients.
  //                     Effective luck: ×150–500
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "golden_convergence",
    name: "The Golden Convergence",
    icon: "◎",
    desc: "The hour where all paths meet. It lasts exactly as long as it needs to.",
    ingredients: [
      { rarityId: "CONVERGENCE", count: 1 },
      { rarityId: "THEGOLDENHOUR", count: 1 },
    ],
    buff: {
      name: "The Golden Convergence",
      icon: "◎",
      multiplier: 220.0,
      rolls: 6,
      color: "#ffb347",
    },
    category: "goldenhour",
  },

  {
    id: "seraph_golden_hour",
    name: "The Seraph's Hour",
    icon: "🪶",
    desc: "The angel descended exactly at dusk. No one knows why. No one forgot it.",
    ingredients: [
      { rarityId: "SERAPHIM", count: 1 },
      { rarityId: "THEGOLDENHOUR", count: 1 },
    ],
    buff: {
      name: "The Seraph's Hour",
      icon: "🪶",
      multiplier: 300.0,
      rolls: 6,
      color: "#ffd700",
    },
    category: "goldenhour",
  },

  {
    id: "golden_nightmare",
    name: "Golden Nightmare",
    icon: "◐",
    desc: "The golden hour bled into night and never stopped.",
    ingredients: [
      { rarityId: "THEGOLDENHOUR", count: 1 },
      { rarityId: "NIGHTFALL", count: 1 },
    ],
    buff: {
      name: "Golden Nightmare",
      icon: "◐",
      multiplier: 500.0,
      rolls: 6,
      color: "#ffb347",
    },
    category: "goldenhour",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // NIGHTFALL CHAIN — NightFall (1/900,000) based recipes
  //                   The highest-multiplier non-synergy crafts in the game.
  //                   ~900k–1.8M rolls per pair of ingredients.
  //                   Effective luck: ×500–650
  //                   THEJUDGEMENT: 1/1M → 1/1,500–2,000
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "reborn_under_stars",
    name: "Reborn Under Stars",
    icon: "✦",
    desc: "The night witnessed a rebirth. The stars realigned to mark it.",
    ingredients: [
      { rarityId: "NIGHTFALL", count: 1 },
      { rarityId: "REBIRTH", count: 1 },
    ],
    buff: {
      name: "Reborn Under Stars",
      icon: "✦",
      multiplier: 600.0,
      rolls: 6,
      color: "#ffd080",
    },
    category: "nightfall",
  },

  {
    id: "endless_night",
    name: "The Endless Night",
    icon: "∿",
    desc: "The dream that never ended — because the night never ended first.",
    ingredients: [
      { rarityId: "NIGHTFALL", count: 1 },
      { rarityId: "THEENDLESSDREAM", count: 1 },
    ],
    buff: {
      name: "The Endless Night",
      icon: "∿",
      multiplier: 650.0,
      rolls: 6,
      color: "#c8a0ff",
    },
    category: "nightfall",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // TIER S — SYNERGY (rare aura drop ingredients)
  //          These require actual aura drops as ingredients.
  //          The cost is earning the drops — the reward is enormous luck.
  // ══════════════════════════════════════════════════════════════════════════

  {
    id: "madness_pact",
    name: "Madness Pact",
    icon: "🔮",
    desc: "Sanity traded for impossible fortune. The void delivers.",
    ingredients: [
      { rarityId: "MATRIX", count: 1 },
      { rarityId: "ELDRITCH", count: 1 },
    ],
    buff: {
      name: "Madness Pact",
      icon: "🔮",
      multiplier: 40.0,
      rolls: 6,
      color: "#c084fc",
    },
    category: "synergy",
  },

  {
    id: "temporal_eye",
    name: "Temporal Eye",
    icon: "⏱",
    desc: "Eldritch sight through collapsing time. Nothing is hidden.",
    ingredients: [
      { rarityId: "ELDRITCH", count: 1 },
      { rarityId: "TIMECOLLAPSE", count: 1 },
    ],
    buff: {
      name: "Temporal Eye",
      icon: "⏱",
      multiplier: 55.0,
      rolls: 5,
      color: "#64c8ff",
    },
    category: "synergy",
  },

  {
    id: "timeless_pixel",
    name: "Timeless Pixel",
    icon: "⭐",
    desc: "Time collapsed into a single 8-bit frame. Reality has no power here.",
    ingredients: [
      { rarityId: "TIMECOLLAPSE", count: 1 },
      { rarityId: "PIXELGENESIS", count: 1 },
    ],
    buff: {
      name: "Timeless Pixel",
      icon: "⭐",
      multiplier: 75.0,
      rolls: 5,
      color: "#fcbc3c",
    },
    category: "synergy",
  },

  {
    id: "pixel_singularity",
    name: "Pixel Singularity",
    icon: "⊗",
    desc: "An 8-bit universe born from nothing. The first game. The only game.",
    ingredients: [
      { rarityId: "PIXELGENESIS", count: 1 },
      { rarityId: "VOIDAWAKENS", count: 1 },
    ],
    buff: {
      name: "Pixel Singularity",
      icon: "⊗",
      multiplier: 100.0,
      rolls: 5,
      color: "#c8a8ff",
    },
    category: "synergy",
  },

  {
    id: "void_oath",
    name: "Void Oath",
    icon: "◉",
    desc: "The blade that cut the void. All odds collapse before it.",
    ingredients: [
      { rarityId: "VOIDAWAKENS", count: 1 },
      { rarityId: "SACREDBLADE", count: 1 },
    ],
    buff: {
      name: "Void Oath",
      icon: "◉",
      multiplier: 120.0,
      rolls: 4,
      color: "#ffd700",
    },
    category: "synergy",
  },

  {
    id: "void_and_blade",
    name: "Void and Blade",
    icon: "✦",
    desc: "Before existence, there was the worthy. After the void, only the blade remains.",
    ingredients: [
      { rarityId: "VOIDAWAKENS", count: 1 },
      { rarityId: "SACREDBLADE", count: 1 },
    ],
    buff: {
      name: "Void and Blade",
      icon: "✦",
      multiplier: 125.0,
      rolls: 5,
      color: "#ffd700",
    },
    category: "synergy",
  },

  {
    id: "blade_and_eye",
    name: "Blade and Eye",
    icon: "◉",
    desc: "The worthy, witnessed. The blade, seen. Both exist only because it watches.",
    ingredients: [
      { rarityId: "SACREDBLADE", count: 1 },
      { rarityId: "THEOBSERVER", count: 1 },
    ],
    buff: {
      name: "Blade and Eye",
      icon: "◉",
      multiplier: 175.0,
      rolls: 5,
      color: "#9933cc",
    },
    category: "synergy",
  },

  {
    id: "eye_of_the_equation",
    name: "Eye of the Equation",
    icon: "◉",
    desc: "The Observer watches the Fractal. The Fractal solves the Observer.",
    ingredients: [
      { rarityId: "THEOBSERVER", count: 1 },
      { rarityId: "THEFRACTAL", count: 1 },
    ],
    buff: {
      name: "Eye of the Equation",
      icon: "◉",
      multiplier: 250.0,
      rolls: 5,
      color: "#00ffcc",
    },
    category: "synergy",
  },

  {
    id: "fractal_in_darkness",
    name: "Fractal in Darkness",
    icon: "◎",
    desc: "The equation persists after the last light fades. Mathematics outlives entropy.",
    ingredients: [
      { rarityId: "THEFRACTAL", count: 1 },
      { rarityId: "THELASTLIGHT", count: 1 },
    ],
    buff: {
      name: "Fractal in Darkness",
      icon: "◎",
      multiplier: 350.0,
      rolls: 5,
      color: "#ff9933",
    },
    category: "synergy",
  },

  {
    id: "light_of_the_nation",
    name: "Light of the Nation",
    icon: "♔",
    desc: "The last light of the universe — and it shines for the people.",
    ingredients: [
      { rarityId: "THELASTLIGHT", count: 1 },
      { rarityId: "THENATION", count: 1 },
    ],
    buff: {
      name: "Light of the Nation",
      icon: "♔",
      multiplier: 450.0,
      rolls: 6,
      color: "#ffd700",
    },
    category: "synergy",
  },

  {
    id: "dreaming_nation",
    name: "Dreaming Nation",
    icon: "◌",
    desc: "A people united — even in the dream. Especially in the dream.",
    ingredients: [
      { rarityId: "THENATION", count: 1 },
      { rarityId: "THEENDLESSDREAM", count: 1 },
    ],
    buff: {
      name: "Dreaming Nation",
      icon: "◌",
      multiplier: 580.0,
      rolls: 6,
      color: "#c8a0ff",
    },
    category: "synergy",
  },

  {
    id: "dreaming_rebirth",
    name: "Dreaming Rebirth",
    icon: "◎",
    desc: "To dream is one thing. To be reborn within the dream — that is another.",
    ingredients: [
      { rarityId: "THEENDLESSDREAM", count: 1 },
      { rarityId: "REBIRTH", count: 1 },
    ],
    buff: {
      name: "Dreaming Rebirth",
      icon: "◎",
      multiplier: 750.0,
      rolls: 7,
      color: "#ffd080",
    },
    category: "synergy",
  },

  {
    id: "final_verdict",
    name: "Final Verdict",
    icon: "⚖",
    desc: "The dream met the judge. Only one could remain standing.",
    ingredients: [
      { rarityId: "THEJUDGEMENT", count: 1 },
      { rarityId: "THEENDLESSDREAM", count: 1 },
    ],
    buff: {
      name: "Final Verdict",
      icon: "⚖",
      multiplier: 1000.0,
      rolls: 5,
      color: "#ffd700",
    },
    category: "synergy",
  },
];

// ─── Display categories ────────────────────────────────────────────────────────
// Order here controls the render order in CraftingPanel.
// Add new categories as you add new recipe tiers.
export const CATEGORIES = [
  { id: "tier1", label: "🌱 Tier I    — Common drops", color: "#a8b5c8" },
  { id: "tier2", label: "💫 Tier II   — Uncommon drops", color: "#4ade80" },
  { id: "tier3", label: "💎 Tier III  — Rare drops", color: "#60a5fa" },
  { id: "tier4", label: "💜 Tier IV   — Epic drops", color: "#c084fc" },
  { id: "tier5", label: "👑 Tier V    — Legendary drops", color: "#fbbf24" },
  { id: "tier6", label: "☄  Tier VI   — Mythic + Divine", color: "#ffe066" },
  { id: "tier7", label: "💥 Tier VII  — Divine + Supernova", color: "#ff6600" },
  {
    id: "tier8",
    label: "🔥 Tier VIII — Supernova + Seraphim",
    color: "#ffd700",
  },
  {
    id: "tier9",
    label: "∞  Tier IX   — Seraphim + Convergence",
    color: "#ffffff",
  },
  { id: "cross", label: "◈  Cross-Chain — Mixed rare auras", color: "#c8d8ff" },
  {
    id: "goldenhour",
    label: "☀  Golden Hour — 1/800,000 chain",
    color: "#ffb347",
  },
  {
    id: "nightfall",
    label: "✦  NightFall  — 1/900,000 chain",
    color: "#8899ff",
  },
  {
    id: "synergy",
    label: "✦  Synergy    — Rarest aura drops",
    color: "#ffd700",
  },
];
