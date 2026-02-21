// engine/Engine.js
import { RenderEngine } from './core/RenderEngine.js';
import { Scheduler } from './core/Scheduler.js';
import { LayerManager } from './managers/LayerManager.js';
import { CutsceneManager } from './managers/CutsceneManager.js';

export class Engine {
  constructor() {
    this.renderEngine = new RenderEngine();
    this.scheduler = new Scheduler();
    this.layerManager = new LayerManager();
    this.cutsceneManager = null; // initialized after
    this.ready = false;
  }

  init() {
    this.renderEngine.init();
    this.cutsceneManager = new CutsceneManager(this);
    this.ready = true;
    console.log('[Engine] Initialized');
  }

  addEffect(effect, layer = 'mid') {
    this.layerManager.add(effect, layer);
    this.renderEngine.addEffect(effect);
    return effect;
  }

  shake(magnitude) {
    this.renderEngine.triggerShake(magnitude);
  }

  async playCutscene(sceneKey, rarity) {
    return new Promise(resolve => {
      this.cutsceneManager.play(sceneKey, rarity, resolve);
    });
  }

  clearEffects() {
    this.layerManager.clearAll();
    this.renderEngine.clearAll();
  }
}

// Singleton
export const engine = new Engine();
