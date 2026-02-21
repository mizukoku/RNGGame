// engine/utils/MathUtil.js
export const MathUtil = {
  lerp: (a, b, t) => a + (b - a) * t,
  clamp: (v, min, max) => Math.max(min, Math.min(max, v)),
  rand: (min, max) => Math.random() * (max - min) + min,
  randInt: (min, max) => Math.floor(MathUtil.rand(min, max + 1)),
  randSign: () => Math.random() < 0.5 ? -1 : 1,
  degToRad: d => d * (Math.PI / 180),
  radToDeg: r => r * (180 / Math.PI),
  map: (v, inMin, inMax, outMin, outMax) =>
    outMin + ((v - inMin) / (inMax - inMin)) * (outMax - outMin),
  dist: (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2),
  angle: (x1, y1, x2, y2) => Math.atan2(y2 - y1, x2 - x1),
  polarToCart: (angle, radius) => ({
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  }),
  normalize: (v, min, max) => (v - min) / (max - min),
  randomInCircle: (radius) => {
    const angle = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * radius;
    return { x: Math.cos(angle) * r, y: Math.sin(angle) * r };
  },
  randomOnCircle: (radius) => {
    const angle = Math.random() * Math.PI * 2;
    return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
  },
  hexToRgb: (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  },
};
