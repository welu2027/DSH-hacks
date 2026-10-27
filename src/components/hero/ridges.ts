/* Mountain ridgelines as static SVG paths (viewBox 1440 × 400, filled down
   to the bottom edge). Each is a broad massif shape (a few low-frequency
   ridged sines, so summits come to a point) roughened by seeded midpoint displacement, which gives the jagged
   peaks, shoulders and saddles of a real range. Deterministic, so server and
   client draw the same range. `townY` is exported so the particle canvas can
   set its valley lights on the nearest ridge. */
type Spec = { seed: number; base: number; amp: number; rough: number; detail: number; waves: [number, number, number][] }; // [frequency, phase, weight]

export const VB_W = 1440;
export const VB_H = 400;
const N = 256;

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* midpoint displacement, normalised to -1..1 */
function fractal(seed: number, rough: number) {
  const r = rng(seed);
  const h = new Array<number>(N + 1).fill(0);
  h[0] = r() * 2 - 1;
  h[N] = r() * 2 - 1;
  for (let step = N, amp = 1; step > 1; step /= 2, amp *= rough) {
    for (let i = step / 2; i < N; i += step) h[i] = (h[i - step / 2] + h[i + step / 2]) / 2 + (r() * 2 - 1) * amp;
  }
  const max = Math.max(...h.map(Math.abs));
  return h.map((v) => v / max);
}

function heights(s: Spec) {
  const f = fractal(s.seed, s.rough);
  return f.map((v, i) => {
    const t = i / N;
    // ridged: 1 - |sin| gives pointed summits and rounded valleys
    const massif = s.waves.reduce((sum, [fr, ph, w]) => sum + w * (1 - 2 * Math.abs(Math.sin(Math.PI * (t * fr + ph)))), 0);
    return s.base - s.amp * (massif + s.detail * v);
  });
}

const path = (ys: number[]) =>
  `M0 ${VB_H}` + ys.map((v, i) => `L${((i * VB_W) / N).toFixed(1)} ${v.toFixed(1)}`).join("") + `L${VB_W} ${VB_H}Z`;

const TOWN = heights({ seed: 41, base: 175, amp: 55, rough: 0.5, detail: 0.3, waves: [[1.1, 0.15, 0.5], [2.6, 0.6, 0.25]] });

/* far → near; the last one is the town ridge the lights settle on. `h` is
   a multiple of the hero's --rh (the town ridge's height). Far ranges are
   tallest and most jagged; near ones are lower, rounder foothills. */
export const RIDGES = [
  { cls: "r1", depth: 0.34, h: 1.45, d: path(heights({ seed: 7, base: 210, amp: 150, rough: 0.6, detail: 0.35, waves: [[1.3, 0.75, 0.6], [3.1, 0.1, 0.3]] })) },
  { cls: "r2", depth: 0.22, h: 1.27, d: path(heights({ seed: 19, base: 215, amp: 120, rough: 0.58, detail: 0.3, waves: [[1.9, 0.35, 0.55], [4.2, 0.8, 0.25]] })) },
  { cls: "r3", depth: 0.1, h: 1.14, d: path(heights({ seed: 29, base: 210, amp: 85, rough: 0.55, detail: 0.3, waves: [[1.5, 0.9, 0.55], [3.7, 0.3, 0.2]] })) },
  { cls: "town", depth: 0, h: 1, d: path(TOWN) },
];

export const townY = (t: number) => {
  const x = Math.min(1, Math.max(0, t)) * N, i = Math.min(N - 1, Math.floor(x));
  return TOWN[i] + (TOWN[i + 1] - TOWN[i]) * (x - i);
};
