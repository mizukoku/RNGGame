// config/EngineConfig.js
export const ENGINE_CONFIG = {
  canvas: {
    id: 'fx-canvas',
    zIndex: 100,
  },
  render: {
    fps: 60,
    particleLimit: 600,
  },
  shake: {
    decay: 0.88,
    maxOffset: 30,
  },
  timeline: {
    defaultTickRate: 16, // ~60fps
  },
};
