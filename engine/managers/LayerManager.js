// engine/managers/LayerManager.js

export class LayerManager {
  constructor() {
    this.layers = {
      background: [],
      mid: [],
      foreground: [],
      overlay: [],
    };
  }

  add(effect, layerName = 'mid') {
    if (!this.layers[layerName]) {
      console.warn(`LayerManager: unknown layer "${layerName}"`);
      return;
    }
    this.layers[layerName].push(effect);
  }

  remove(effect) {
    for (const layer of Object.values(this.layers)) {
      const i = layer.indexOf(effect);
      if (i !== -1) { layer.splice(i, 1); return; }
    }
  }

  getAll() {
    return [
      ...this.layers.background,
      ...this.layers.mid,
      ...this.layers.foreground,
      ...this.layers.overlay,
    ];
  }

  clearLayer(layerName) {
    if (this.layers[layerName]) {
      this.layers[layerName].forEach(e => e.dead = true);
      this.layers[layerName] = [];
    }
  }

  clearAll() {
    for (const key of Object.keys(this.layers)) {
      this.clearLayer(key);
    }
  }
}
