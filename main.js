// main.js
import { engine } from './engine/Engine.js';
import { RollEngine } from './game/RollEngine.js';
import { PlayerState } from './game/PlayerState.js';
import { UIManager } from './ui/UIManager.js';

window.addEventListener('DOMContentLoaded', () => {
  // Boot engine
  engine.init();

  // Game state
  const playerState = new PlayerState();

  // Roll engine (needs engine + cutscene manager)
  const rollEngine = new RollEngine(engine, engine.cutsceneManager, playerState);

  // UI
  const uiManager = new UIManager(rollEngine, playerState);

  // Animate background stars
  _initStarfield();

  console.log('[SolRNG] Ready. Good luck, adventurer.');
});

function _initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  const stars = Array.from({ length: 200 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5 + 0.2,
    speed: Math.random() * 0.3 + 0.05,
    alpha: Math.random() * 0.7 + 0.1,
    twinkle: Math.random() * Math.PI * 2,
    twinkleSpeed: Math.random() * 0.02 + 0.005,
  }));

  const nebula = Array.from({ length: 5 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 200 + 80,
    color: ['#1a0a2e', '#0a1a2e', '#1a1a0e', '#0e0a1e'][Math.floor(Math.random() * 4)],
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Nebula clouds
    nebula.forEach(n => {
      const g = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
      g.addColorStop(0, n.color + 'aa');
      g.addColorStop(1, 'transparent');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Stars
    stars.forEach(s => {
      s.twinkle += s.twinkleSpeed;
      const alpha = s.alpha * (0.6 + 0.4 * Math.sin(s.twinkle));
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  draw();
}