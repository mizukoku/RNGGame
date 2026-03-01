// engine/managers/CutsceneManager.js
import { NormalScene }    from '../../cutscenes/NormalScene.js';
import { RareScene }      from '../../cutscenes/RareScene.js';
import { EpicScene }      from '../../cutscenes/EpicScene.js';
import { LegendaryScene } from '../../cutscenes/LegendaryScene.js';
import { CometStrike }    from '../../cutscenes/CometStrike.js';
import { StellarCollapse }from '../../cutscenes/StellarCollapse.js';
import { Supernova }      from '../../cutscenes/Supernova.js';
import { Seraphim }       from '../../cutscenes/Seraphim.js';
import { Convergence }    from '../../cutscenes/Convergence.js';
import { Matrix }         from '../../cutscenes/Matrix.js';
import { Eldritch }       from '../../cutscenes/Eldritch.js';
import { TimeCollapse }   from '../../cutscenes/TimeCollapse.js';
import { PixelGenesis }   from '../../cutscenes/PixelGenesis.js';
import { VoidAwakens }    from '../../cutscenes/VoidAwakens.js';
import { SacredBlade }    from '../../cutscenes/SacredBlade.js';
import { TheObserver }    from '../../cutscenes/TheObserver.js';
import { TheFractal }     from '../../cutscenes/TheFractal.js';
import { TheLastLight }   from '../../cutscenes/TheLastLight.js';
import { TheNation }        from '../../cutscenes/TheNation.js';
import { TheEndlessDream }  from '../../cutscenes/TheEndlessDream.js';
import { Rebirth }           from '../../cutscenes/Rebirth.js';
import { TheGoldenHour }    from '../../cutscenes/TheGoldenHour.js';

const SCENE_MAP = {
  NormalScene,
  RareScene,
  EpicScene,
  LegendaryScene,
  CometStrike,
  StellarCollapse,
  Supernova,
  Seraphim,
  Convergence,
  Matrix,
  Eldritch,
  TimeCollapse,
  PixelGenesis,
  VoidAwakens,
  SacredBlade,
  TheObserver,
  TheFractal,
  TheLastLight,
  TheNation,
  TheEndlessDream,
  Rebirth,
  TheGoldenHour,
};

export class CutsceneManager {
  constructor(engine) {
    this.engine = engine;
    this.currentScene = null;
    this.isPlaying = false;
  }

  async play(sceneKey, rarity, onComplete) {
    if (this.isPlaying) this.stop();
    this.isPlaying = true;
    const SceneClass = SCENE_MAP[sceneKey] || NormalScene;
    this.currentScene = new SceneClass(this.engine, rarity);
    try {
      await this.currentScene.play();
    } finally {
      this.isPlaying = false;
      if (onComplete) onComplete();
    }
  }

  stop() {
    if (this.currentScene) {
      this.currentScene.stop();
      this.currentScene = null;
    }
    this.isPlaying = false;
    this.engine.renderEngine.clearAll();
  }
}