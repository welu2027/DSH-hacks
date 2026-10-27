/* Mountain ridgelines, baked from a few summed sine waves into static SVG
   paths (viewBox 1440 × 400, filled down to the bottom edge). Deterministic,
   so server and client draw the same range. `townY` is exported so the
   particle canvas can set its valley lights on the nearest ridge. */
type Spec = { base: number; amp: number; waves: [number, number, number][] }; // [frequency, phase, weight]

export const VB_W = 1440;
export const VB_H = 400;

const y = (s: Spec, t: number) =>
  s.base - s.amp * s.waves.reduce((sum, [f, ph, w]) => sum + w * Math.sin(2 * Math.PI * (t * f + ph)), 0);

const path = (s: Spec) => {
  let d = `M0 ${VB_H}`;
  for (let i = 0; i <= 96; i++) d += `L${(i * VB_W / 96).toFixed(1)} ${y(s, i / 96).toFixed(1)}`;
  return `${d}L${VB_W} ${VB_H}Z`;
};

const TOWN: Spec = { base: 150, amp: 58, waves: [[0.8, 0.15, 0.55], [2.3, 0.6, 0.3], [5.1, 0.2, 0.15]] };

/* far → near; the last one is the town ridge the lights settle on. `h` is
   a multiple of the hero's --rh (the town ridge's height). */
export const RIDGES = [
  { cls: "r1", depth: 0.34, h: 1.45, d: path({ base: 130, amp: 80, waves: [[0.6, 0.7, 0.6], [1.7, 0.1, 0.28], [4.3, 0.4, 0.12]] }) },
  { cls: "r2", depth: 0.22, h: 1.27, d: path({ base: 165, amp: 70, waves: [[1.1, 0.35, 0.5], [2.9, 0.8, 0.32], [6.2, 0.1, 0.18]] }) },
  { cls: "r3", depth: 0.1, h: 1.14, d: path({ base: 175, amp: 60, waves: [[0.9, 0.9, 0.55], [3.4, 0.3, 0.3], [7.7, 0.5, 0.15]] }) },
  { cls: "town", depth: 0, h: 1, d: path(TOWN) },
];

export const townY = (t: number) => y(TOWN, t);
