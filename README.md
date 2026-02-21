# SolRngOnline

A browser-based RNG aura rolling game with rarity-based cutscenes, visual effects, luck modifiers, and persistent player progress.

## Features

- Roll for random auras/items with weighted rarity chances.
- Rarer rolls trigger bigger, longer cutscenes and effects.
- Luck system changes rarity chances (temporary and permanent modifiers).
- Player progress is stored locally (inventory, stats, pity, roll history).
- Debug tools are available for testing cutscenes and luck quickly.

## Quick Start

### Requirements

- A modern browser (Chrome, Edge, Firefox).
- A local server extension/tool (for example VS Code Live Server).

### Run

1. Clone or download this repository.
2. Open the project folder in VS Code.
3. Start Live Server on `index.html`.
4. Click **Roll** to start rolling.

## Gameplay Overview

- Each roll selects a rarity using weighted RNG.
- Luck modifies weights so high rarities become more likely.
- A random item from the rolled rarity pool is selected.
- Result is shown in UI and recorded in local player state.
- The matching cutscene/effects sequence plays for that rarity.

## Project Structure (what does what)

```text
.
├─ index.html
├─ main.js
├─ styles.css
├─ README.md
├─ config/
│  ├─ EngineConfig.js
│  └─ RarityConfig.js
├─ cutscenes/
│  ├─ ...Scene.js
│  
├─ effects/
│  ├─ ...Effect.js
|
├─ engine/
│  ├─ Engine.js
│  ├─ core/
│  │  ├─ EffectBase.js
│  │  ├─ RenderEngine.js
│  │  ├─ Scheduler.js
│  │  └─ Timeline.js
│  ├─ managers/
│  │  ├─ CutsceneManager.js
│  │  └─ LayerManager.js
│  └─ utils/
│     ├─ Easing.js
│     └─ MathUtil.js
├─ game/
│  ├─ LuckSystem.js
│  ├─ PlayerState.js
│  ├─ RarityTable.js
│  └─ RollEngine.js
└─ ui/
	├─ DebugMenu.js
	├─ ResultDisplay.js
	├─ RollButton.js
	└─ UIManager.js
```

### Root

- `index.html`: App layout, main UI sections, and script entry mount.
- `main.js`: App bootstrap; initializes systems and background starfield.
- `styles.css`: Full game styling, layout, effects UI states, and responsiveness.

### `config/`

- `EngineConfig.js`: Global engine constants (canvas/render/timing/shake settings).
- `RarityConfig.js`: Rarity definitions, item pools, cutscene mapping, roll helpers.

### `engine/`

- `Engine.js`: High-level API for playing cutscenes and managing active effects.

#### `engine/core/`

- `EffectBase.js`: Base lifecycle class for all timed effects.
- `RenderEngine.js`: Canvas rendering loop, resize handling, and shake transforms.
- `Scheduler.js`: Utility for timed tasks, delays, intervals, and cleanup.
- `Timeline.js`: Event timeline orchestration used by cutscene sequences.

#### `engine/managers/`

- `CutsceneManager.js`: Registers/plays/stops cutscenes and enforces single active scene.
- `LayerManager.js`: Keeps effects organized by render layers.

#### `engine/utils/`

- `Easing.js`: Shared easing/animation curves.
- `MathUtil.js`: Shared math/random/geometry/color helper functions.

### `game/`

- `LuckSystem.js`: Luck modifiers (timed/permanent) and multiplier calculation.
- `PlayerState.js`: Local save/load for stats, pity, inventory, and progression.
- `RarityTable.js`: Weighted rarity rolling and item selection logic.
- `RollEngine.js`: Main roll pipeline (luck -> rarity -> item -> save -> cutscene).

### `ui/`

- `DebugMenu.js`: In-game debug controls (force rarity, luck buffs, reset/clear actions).
- `ResultDisplay.js`: Result card rendering and rarity-specific display states.
- `RollButton.js`: Interactive roll button behavior and state handling.
- `UIManager.js`: Connects UI with game/engine, updates stats, inventory, odds, and actions.

## Notes

- Progress is stored in browser local storage.
- Reset/debug options can clear saved data.

## License

MIT License

Copyright (c) 2026 mizukoku