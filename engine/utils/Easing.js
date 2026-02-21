// engine/utils/Easing.js
export const Easing = {
  linear: t => t,
  easeIn: t => t * t,
  easeOut: t => t * (2 - t),
  easeInOut: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeOutCubic: t => 1 - Math.pow(1 - t, 3),
  easeInCubic: t => t * t * t,
  easeOutQuart: t => 1 - Math.pow(1 - t, 4),
  easeOutElastic: t => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1
      : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
  easeOutBounce: t => {
    const n1 = 7.5625, d1 = 2.75;
    if (t < 1 / d1) return n1 * t * t;
    if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
    if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  },
  easeInBack: t => {
    const c1 = 1.70158;
    return (c1 + 1) * t * t * t - c1 * t * t;
  },
  easeOutBack: t => {
    const c1 = 1.70158;
    return 1 + (c1 + 1) * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  pulse: t => Math.sin(t * Math.PI),
  flash: t => t < 0.1 ? t / 0.1 : t > 0.9 ? (1 - t) / 0.1 : 1,
};
