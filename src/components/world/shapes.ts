/* The skyline: one science structure per section, standing on a shared
   horizon at the bottom of the viewport, drawn as a night city — dark
   dithered facades, lit windows, a bright rim.

   Each structure is a signed-distance function (negative inside) in units of
   its own scale, ground at y = 0, y pointing down. While evaluating, helpers
   also record what the point is made of: `fac` (facade brightness, 0-1) and
   `lit` (distance to the nearest lit feature: windows, signs, beacons). */
export type ShapeKind = "citadel" | "observatory" | "datacenter" | "launch" | "arcology" | "helix" | "array" | "kingdom";
/* kind, center x as a viewport fraction, ground line as a viewport fraction
   (1 = bottom edge), scale as a fraction of the viewport's short side, ink 0-1 */
export type Shape = [kind: ShapeKind, cx: number, ground: number, s: number, v: number];

/* Tallest point of any structure, in shape units (sink/rise distance). */
export const HEIGHT = 1.62;
const LINE = 0.018; // half-width of masts, braces, and the horizon

let fac = 0.4;
let lit = Infinity;

/* ---------- primitives ---------- */
const len = Math.hypot;
const union = Math.min;
const cut = (a: number, b: number) => Math.max(a, -b);

function box(x: number, y: number, bx: number, by: number) {
  const qx = Math.abs(x) - bx, qy = Math.abs(y) - by;
  return len(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0);
}
const rect = (x: number, y: number, x0: number, x1: number, y0: number, y1: number) =>
  box(x - (x0 + x1) / 2, y - (y0 + y1) / 2, (x1 - x0) / 2, (y1 - y0) / 2);

function segment(x: number, y: number, ax: number, ay: number, bx: number, by: number) {
  const px = x - ax, py = y - ay, dx = bx - ax, dy = by - ay;
  const h = Math.max(0, Math.min(1, (px * dx + py * dy) / (dx * dx + dy * dy)));
  return len(px - dx * h, py - dy * h);
}
const mast = (x: number, y: number, ax: number, ay: number, bx: number, by: number, w = LINE) =>
  segment(x, y, ax, ay, bx, by) - w;
const circle = (x: number, y: number, cx: number, cy: number, r: number) => len(x - cx, y - cy) - r;

function poly(x: number, y: number, pts: [number, number][]) {
  let cx = 0, cy = 0;
  for (const [px, py] of pts) { cx += px; cy += py; }
  cx /= pts.length; cy /= pts.length;
  let d = -Infinity;
  for (let i = 0; i < pts.length; i++) {
    const [ax, ay] = pts[i], [bx, by] = pts[(i + 1) % pts.length];
    let nx = by - ay, ny = ax - bx;
    const l = len(nx, ny);
    nx /= l; ny /= l;
    if ((cx - ax) * nx + (cy - ay) * ny > 0) { nx = -nx; ny = -ny; }
    d = Math.max(d, (x - ax) * nx + (y - ay) * ny);
  }
  return d;
}

function hash(i: number, j: number, seed: number) {
  const s = Math.sin(i * 127.1 + j * 311.7 + seed * 74.7) * 43758.5453;
  return s - Math.floor(s);
}

/* ---------- material helpers ---------- */

/* A building block: rect silhouette whose facade is lit from the left, with
   faint floor lines. */
function bldg(x: number, y: number, x0: number, x1: number, top: number, bottom = 0, floor = 0.09) {
  const d = rect(x, y, x0, x1, top, bottom);
  if (d < 0) {
    const u = (x - x0) / (x1 - x0);
    const f = ((y - top) / floor) % 1;
    fac = (0.42 - 0.18 * u) * (f < 0.12 ? 0.5 : 1);
  }
  return d;
}

/* A grid of windows; a hashed share of them are lit. */
function lights(x: number, y: number, x0: number, x1: number, y0: number, y1: number, cols: number, rows: number, ww: number, wh: number, seed: number, on = 0.6) {
  const cw = (x1 - x0) / cols, ch = (y1 - y0) / rows;
  if (x < x0 - cw || x > x1 + cw || y < y0 - ch || y > y1 + ch) return;
  const i = Math.max(0, Math.min(cols - 1, Math.floor((x - x0) / cw)));
  const j = Math.max(0, Math.min(rows - 1, Math.floor((y - y0) / ch)));
  if (hash(i, j, seed) > on) return;
  lit = Math.min(lit, box(x - (x0 + (i + 0.5) * cw), y - (y0 + (j + 0.5) * ch), ww / 2, wh / 2));
}
/* Any shape that glows (signs, beacons, slits). Returns its distance too. */
function glow(d: number) {
  lit = Math.min(lit, d);
  return d;
}

function crenels(x: number, y: number, x0: number, x1: number, top: number, n: number, h = 0.06) {
  const w = (x1 - x0) / (2 * n - 1);
  let d = Infinity;
  for (let i = 0; i < n; i++) d = Math.min(d, rect(x, y, x0 + i * 2 * w, x0 + (i * 2 + 1) * w, top - h, top + 0.01));
  return d;
}

/* Lattice tower: two legs with X braces. */
function lattice(x: number, y: number, x0: number, x1: number, top: number, bays: number) {
  if (x < x0 - 0.05 || x > x1 + 0.05 || y < top - 0.05) return Infinity;
  let d = union(mast(x, y, x0, 0, x0, top), mast(x, y, x1, 0, x1, top));
  const bh = -top / bays, j = Math.max(0, Math.min(bays - 1, Math.floor(-y / bh)));
  const ya = -j * bh, yb = ya - bh;
  d = union(d, mast(x, y, x0, ya, x1, yb, LINE * 0.6), mast(x, y, x1, ya, x0, yb, LINE * 0.6));
  d = union(d, mast(x, y, x0, yb, x1, yb, LINE * 0.7));
  return d;
}

/* Dish on a truss: a crescent bowl tilted by `a`, with feed and receiver. */
function dish(x: number, y: number, cx: number, cy: number, r: number, a: number) {
  const c = Math.cos(a), s = Math.sin(a);
  const rx = (x - cx) * c - (y - cy) * s, ry = (x - cx) * s + (y - cy) * c;
  let d = cut(circle(rx, ry, 0, 0, r), circle(rx, ry, 0, -r * 0.42, r * 1.02));
  if (d < 0) fac = 0.55 + 0.25 * (rx / r);
  d = union(d, mast(rx, ry, -r * 0.62, r * 0.35, 0, -r * 0.72, LINE * 0.6));
  d = union(d, mast(rx, ry, r * 0.62, r * 0.35, 0, -r * 0.72, LINE * 0.6));
  d = union(d, glow(circle(rx, ry, 0, -r * 0.76, LINE * 2)));
  // truss mount down to the ground
  d = union(d, mast(x, y, cx, cy + r * 0.55, cx - r * 0.45, 0), mast(x, y, cx, cy + r * 0.55, cx + r * 0.45, 0));
  d = union(d, mast(x, y, cx - r * 0.22, (cy + r * 0.55) / 2, cx + r * 0.22, (cy + r * 0.55) / 2, LINE * 0.6));
  return d;
}

/* ---------- structures ---------- */

/* Hero: a hospital citadel. Stepped central tower with a lit medical cross
   and helipad, battlemented flanking towers, glass skybridges, low wings. */
function citadel(x: number, y: number) {
  const ax = Math.abs(x);
  let d = bldg(x, y, -0.2, 0.2, -1.0);
  d = union(d, bldg(x, y, -0.14, 0.14, -1.14, -0.99));
  d = union(d, rect(x, y, -0.19, 0.19, -1.17, -1.14));
  d = union(d, mast(x, y, 0.1, -1.17, 0.1, -1.5));
  glow(circle(x, y, 0.1, -1.52, 0.025));
  d = union(d, mast(x, y, -0.09, -1.17, -0.09, -1.32, LINE * 0.7));
  glow(union(rect(x, y, -0.075, 0.075, -1.08, -1.04), rect(x, y, -0.022, 0.022, -1.13, -0.99)));
  lights(x, y, -0.17, 0.17, -0.95, -0.06, 6, 16, 0.035, 0.026, 1);
  d = union(d, bldg(ax, y, 0.4, 0.64, -0.72), crenels(ax, y, 0.4, 0.64, -0.72, 4));
  lights(ax, y, 0.43, 0.61, -0.66, -0.06, 3, 10, 0.035, 0.026, 2);
  d = union(d, mast(ax, y, 0.52, -0.78, 0.52, -1.02));
  glow(circle(ax, y, 0.52, -1.03, 0.022));
  d = union(d, rect(ax, y, 0.2, 0.4, -0.54, -0.47));
  glow(rect(ax, y, 0.21, 0.39, -0.525, -0.485));
  d = union(d, rect(ax, y, 0.2, 0.4, -0.3, -0.25));
  d = union(d, bldg(ax, y, 0.64, 1.02, -0.3));
  lights(ax, y, 0.67, 0.99, -0.25, -0.05, 7, 3, 0.03, 0.03, 3);
  d = union(d, rect(ax, y, 0.75, 0.86, -0.36, -0.29));
  return d;
}

/* About: an observatory — ribbed dome with its slit glowing, a lab block,
   and a big radio dish. */
function observatory(x: number, y: number) {
  let d = bldg(x, y, -0.85, 0.08, -0.32);
  lights(x, y, -0.8, 0.03, -0.27, -0.06, 9, 2, 0.04, 0.05, 4);
  const dc = circle(x, y, -0.38, -0.32, 0.4), dome = Math.max(dc, y + 0.32);
  if (dome < 0) {
    const ang = Math.atan2(y + 0.32, x + 0.38);
    fac = 0.55 + 0.2 * Math.cos(ang + 2.2);
    if (Math.abs(((ang * 6 / Math.PI) % 1 + 1) % 1 - 0.5) < 0.06) fac *= 0.55;
  }
  d = union(d, dome);
  glow(Math.max(rect(x, y, -0.42, -0.34, -0.74, -0.4), dc));
  d = union(d, rect(x, y, -0.8, 0.03, -0.34, -0.31));
  d = union(d, mast(x, y, -0.72, -0.34, -0.72, -0.62));
  glow(circle(x, y, -0.72, -0.64, 0.02));
  d = union(d, dish(x, y, 0.62, -0.8, 0.38, -0.55));
  d = union(d, bldg(x, y, 0.85, 1.05, -0.18));
  lights(x, y, 0.88, 1.02, -0.14, -0.04, 3, 1, 0.03, 0.04, 5, 0.9);
  return d;
}

/* Projects: the archive — server halls with blinking rack LEDs, rooftop
   chillers, and a lattice transmission tower. */
const RACKS: [number, number, number][] = [[-0.95, -0.5, 0.3], [-0.6, -0.82, 0.34], [-0.2, -0.98, 0.36], [0.2, -0.7, 0.32], [0.56, -0.88, 0.3]];
function datacenter(x: number, y: number) {
  let d = Infinity;
  RACKS.forEach(([x0, top, w], k) => {
    d = union(d, bldg(x, y, x0, x0 + w, top, 0, 0.06));
    lights(x, y, x0 + 0.04, x0 + w - 0.04, top + 0.05, -0.05, 4, Math.round(-top / 0.06), 0.035, 0.012, 10 + k, 0.45);
    for (let i = 0; i < 2; i++) {
      const cx = x0 + w * (0.3 + i * 0.4);
      d = union(d, rect(x, y, cx - 0.05, cx + 0.05, top - 0.07, top));
      d = cut(d, circle(x, y, cx, top - 0.035, 0.022));
    }
  });
  d = union(d, mast(x, y, -0.44, -0.86, -0.0, -1.03, LINE * 0.6));
  d = union(d, mast(x, y, 0.36, -0.74, 0.7, -0.92, LINE * 0.6));
  d = union(d, lattice(x, y, 0.94, 1.06, -1.3, 7));
  d = union(d, mast(x, y, 1.0, -1.3, 1.0, -1.48));
  glow(circle(x, y, 1.0, -1.5, 0.022));
  return d;
}

/* Schedule: a rocket on the pad, its lattice gantry with service arms,
   lightning masts, and floodlit pad. */
function launch(x: number, y: number) {
  let d = Math.min(rect(x, y, -0.075, 0.075, -1.12, -0.18), poly(x, y, [[-0.075, -1.12], [0.075, -1.12], [0, -1.4]]));
  if (d < 0) {
    fac = 0.78 - 0.4 * ((x + 0.075) / 0.15);
    if (Math.abs(y + 0.62) < 0.012 || Math.abs(y + 0.95) < 0.012) fac *= 0.5;
  }
  d = union(d, rect(x, y, -0.13, -0.075, -0.6, -0.18), rect(x, y, 0.075, 0.13, -0.6, -0.18));
  d = union(d, poly(x, y, [[-0.13, -0.6], [-0.075, -0.6], [-0.075, -0.7]]), poly(x, y, [[0.13, -0.6], [0.075, -0.6], [0.075, -0.7]]));
  d = union(d, poly(x, y, [[-0.075, -0.32], [-0.075, -0.18], [-0.2, -0.14]]), poly(x, y, [[0.075, -0.32], [0.075, -0.18], [0.2, -0.14]]));
  glow(circle(x, y, 0, -0.85, 0.025));
  d = union(d, lattice(x, y, 0.24, 0.4, -1.28, 12));
  d = union(d, rect(x, y, 0.075, 0.24, -0.95, -0.92), rect(x, y, 0.075, 0.24, -0.62, -0.59), rect(x, y, 0.1, 0.24, -0.3, -0.27));
  d = union(d, mast(x, y, 0.32, -1.28, 0.32, -1.5));
  glow(circle(x, y, 0.32, -1.52, 0.02));
  d = union(d, bldg(x, y, -0.55, 0.6, -0.14, 0, 1));
  lights(x, y, -0.52, 0.57, -0.1, -0.04, 12, 1, 0.04, 0.025, 6, 0.8);
  d = union(d, mast(x, y, -0.8, 0, -0.8, -0.95), mast(x, y, 0.85, 0, 0.85, -0.8));
  glow(union(circle(x, y, -0.8, -0.97, 0.022), circle(x, y, 0.85, -0.82, 0.022)));
  return d;
}

/* People: an arcology — towers with setbacks, a ribbed dome, a spire, and a
   city's worth of lit windows. */
const CITY: [number, number, number, number][] = [
  // x0, x1, top, setback top (0 = none)
  [-1.08, -0.86, -0.42, 0], [-0.84, -0.62, -0.62, -0.74], [-0.6, -0.44, -0.5, 0], [-0.42, -0.2, -0.86, -1.02],
  [-0.18, 0.05, -0.42, 0], [0.07, 0.27, -1.0, -1.18], [0.29, 0.47, -0.68, 0], [0.49, 0.72, -0.46, -0.56],
  [0.74, 0.9, -0.78, 0], [0.92, 1.08, -0.38, 0],
];
function arcology(x: number, y: number) {
  let d = Infinity;
  CITY.forEach(([x0, x1, top, set], k) => {
    d = union(d, bldg(x, y, x0, x1, top));
    const iw = (x1 - x0) * 0.22;
    if (set) d = union(d, bldg(x, y, x0 + iw, x1 - iw, set, top + 0.001));
    lights(x, y, x0 + 0.025, x1 - 0.025, top + 0.04, -0.04, Math.max(2, Math.round((x1 - x0) / 0.045)), Math.round(-top / 0.055), 0.022, 0.024, 20 + k, 0.55);
  });
  const dome = Math.max(circle(x, y, -0.065, -0.42, 0.13), y + 0.42);
  if (dome < 0) fac = 0.6 + 0.25 * Math.cos(Math.atan2(y + 0.42, x + 0.065) + 2.2);
  d = union(d, dome);
  d = union(d, mast(x, y, 0.17, -1.18, 0.17, -1.52));
  glow(circle(x, y, 0.17, -1.54, 0.02));
  d = union(d, mast(x, y, -0.31, -1.02, -0.31, -1.16));
  return d;
}

/* Ledger: a DNA helix tower — glowing strands and base pairs rising from a
   plinth between two research annexes. */
function helix(x: number, y: number) {
  const top = -1.38, A = 0.2, k = 7.2;
  let d = Infinity;
  if (y > top - 0.05 && y < -0.1 && Math.abs(x) < A + 0.08) {
    for (const ph of [0, Math.PI]) {
      const sx = A * Math.sin(k * y + ph), slope = A * k * Math.cos(k * y + ph);
      const sd = Math.abs(x - sx) / Math.sqrt(1 + slope * slope) - LINE * 1.4;
      // the strand in front glows; the one behind is facade
      if (Math.cos(k * y + ph) > 0) glow(sd);
      d = union(d, sd);
    }
    const step = 0.085, yi = Math.round(y / step) * step;
    if (yi > top && yi < -0.12) {
      const sx = A * Math.sin(k * yi);
      d = union(d, segment(x, y, -sx, yi, sx, yi) - LINE * 0.55);
    }
  }
  d = union(d, mast(x, y, 0, -0.12, 0, top, LINE * 0.5));
  d = union(d, bldg(x, y, -0.34, 0.34, -0.12, 0, 1));
  glow(rect(x, y, -0.3, 0.3, -0.07, -0.05));
  glow(circle(x, y, 0, top - 0.04, 0.035));
  const ax = Math.abs(x);
  d = union(d, bldg(ax, y, 0.42, 0.8, -0.34));
  lights(ax, y, 0.45, 0.77, -0.3, -0.05, 6, 4, 0.03, 0.03, 30, 0.7);
  d = union(d, mast(ax, y, 0.72, -0.34, 0.72, -0.6));
  glow(circle(ax, y, 0.72, -0.62, 0.02));
  return d;
}

/* FAQ: a radio array listening for questions, with its control building. */
function array(x: number, y: number) {
  let d = Infinity;
  for (const [cx, r] of [[-0.7, 0.26], [0.0, 0.38], [0.66, 0.24]] as const) {
    d = union(d, dish(x, y, cx, -r - 0.42, r, -0.5));
  }
  d = union(d, bldg(x, y, -0.32, -0.08, -0.2));
  lights(x, y, -0.3, -0.1, -0.16, -0.04, 4, 2, 0.025, 0.03, 40, 0.8);
  d = union(d, mast(x, y, -0.2, -0.2, -0.2, -0.38));
  glow(circle(x, y, -0.2, -0.4, 0.018));
  d = union(d, rect(x, y, -1.0, 1.0, -0.035, 0));
  return d;
}

/* Register: the kingdom — a keep with a lit gate, spired towers, curtain
   walls, and a transmitter crown. Your project goes here next. */
function kingdom(x: number, y: number) {
  const ax = Math.abs(x);
  let d = union(bldg(x, y, -0.26, 0.26, -0.92, 0, 0.12), crenels(x, y, -0.26, 0.26, -0.92, 5));
  lights(x, y, -0.2, 0.2, -0.82, -0.36, 4, 4, 0.035, 0.06, 50, 0.65);
  const gate = union(rect(x, y, -0.085, 0.085, -0.2, 0.01), circle(x, y, 0, -0.2, 0.085));
  glow(gate);
  d = union(d, bldg(ax, y, 0.36, 0.56, -1.04, 0, 0.12));
  lights(ax, y, 0.41, 0.51, -0.96, -0.2, 1, 5, 0.035, 0.07, 51, 0.7);
  d = union(d, poly(ax, y, [[0.33, -1.04], [0.59, -1.04], [0.46, -1.36]]));
  d = union(d, mast(ax, y, 0.46, -1.36, 0.46, -1.52));
  glow(circle(ax, y, 0.46, -1.54, 0.022));
  d = union(d, bldg(ax, y, 0.26, 0.36, -0.58), crenels(ax, y, 0.26, 0.36, -0.58, 2, 0.05));
  d = union(d, bldg(ax, y, 0.56, 1.0, -0.4), crenels(ax, y, 0.56, 1.0, -0.4, 6, 0.05));
  lights(ax, y, 0.6, 0.96, -0.34, -0.08, 7, 3, 0.025, 0.035, 52, 0.5);
  d = union(d, mast(x, y, 0, -0.98, 0, -1.44));
  d = union(d, glow(Math.abs(circle(x, y, 0, -1.2, 0.1)) - LINE * 0.7));
  glow(circle(x, y, 0, -1.47, 0.03));
  return d;
}

const FNS: Record<ShapeKind, (x: number, y: number) => number> = {
  citadel, observatory, datacenter, launch, arcology, helix, array, kingdom,
};

/* Result of the last evaluation. */
export const hit = { d: 1, fac: 0.4, lit: Infinity };

/* Evaluate a structure at canvas pixel (px, py), sunk `sink` shape units
   into the ground (0 = standing, HEIGHT = fully buried). Writes to `hit`;
   distances are in short-side units. */
export function evalShape(shape: Shape, px: number, py: number, w: number, h: number, m: number, sink: number) {
  const [kind, cx0, ground, s] = shape;
  const cx = w < h ? 0.5 + (cx0 - 0.5) * 0.35 : cx0;
  const x = (px - cx * w) / m / s, y = (py - ground * h) / m / s;
  fac = 0.4;
  lit = Infinity;
  let d = y > 0 || y < -HEIGHT - 0.1 + sink || Math.abs(x) > 1.2 ? 1 : FNS[kind](x, y - sink);
  d = Math.max(d, y); // nothing below the horizon
  hit.d = d * s;
  hit.fac = fac;
  hit.lit = y > 0 ? Infinity : lit * s; // buried lights stay dark
}

/* The horizon line under every structure, full width. */
export function horizonDist(shape: Shape, py: number, h: number, m: number) {
  return Math.abs(py - shape[2] * h) / m - LINE * 0.8 * shape[3];
}
