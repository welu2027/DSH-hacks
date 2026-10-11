/* Wireframe geometry for the blueprint garden, in metres (illustrative).
   A Model is one object: flat segments [ax, ay, az, bx, by, bz, kind, buildT]
   where buildT (0..1) is when the segment draws during construction, bottom
   first. x right, y up, z forward (into the page). */
export type V3 = [number, number, number];
export const K = { line: 0, accent: 1, hidden: 2, faint: 3 } as const;

export type Label = { at: V3; text: string; side: 1 | -1 };
export type Dim = { a: V3; b: V3; text: string };
export type Model = {
  segs: Float32Array;
  nodes: V3[]; // canopy lights
  vines: V3[][]; // paths the pulses climb
  labels: Label[];
  dims: Dim[];
  z0: number; // z extent, for culling
  z1: number;
  spin?: Spin; // turns about an axis (wheel, rotors)
};
export type Spin = { o: V3; u: V3; speed: number }; // pivot, unit axis, rad/s

const TAU = Math.PI * 2;

export class Builder {
  s: number[] = [];
  nodes: V3[] = [];
  vines: V3[][] = [];
  labels: Label[] = [];
  dims: Dim[] = [];
  line(a: V3, b: V3, k: number) {
    this.s.push(a[0], a[1], a[2], b[0], b[1], b[2], k, 0);
  }
  poly(pts: V3[], k: number) {
    for (let i = 1; i < pts.length; i++) this.line(pts[i - 1], pts[i], k);
  }
  ring(c: V3, r: number, n: number, k: number) {
    for (let i = 0; i < n; i++) {
      const a = (TAU * i) / n, b = (TAU * (i + 1)) / n;
      this.line([c[0] + Math.cos(a) * r, c[1], c[2] + Math.sin(a) * r], [c[0] + Math.cos(b) * r, c[1], c[2] + Math.sin(b) * r], k);
    }
  }
  /* axis: which coordinate construction sweeps along (1 = bottom-up,
     0 = left to right for a bridge). A spinning model's z extent is padded
     by its radius so culling never clips it mid-turn. */
  done(axis = 1, spin?: Spin, pad = 0): Model {
    const s = this.s;
    let lo = Infinity, hi = -Infinity, z0 = Infinity, z1 = -Infinity;
    for (let i = 0; i < s.length; i += 8) {
      lo = Math.min(lo, s[i + axis], s[i + 3 + axis]);
      hi = Math.max(hi, s[i + axis], s[i + 3 + axis]);
      z0 = Math.min(z0, s[i + 2], s[i + 5]);
      z1 = Math.max(z1, s[i + 2], s[i + 5]);
    }
    for (let i = 0; i < s.length; i += 8) s[i + 7] = ((s[i + axis] + s[i + 3 + axis]) / 2 - lo) / (hi - lo || 1);
    return { segs: new Float32Array(s), nodes: this.nodes, vines: this.vines, labels: this.labels, dims: this.dims, z0: z0 - pad, z1: z1 + pad, spin };
  }
}

/* A supertree: hyperboloid lattice trunk of crossing helices, a canopy,
   vines, and roots below grade (hidden lines). Canopies: 0 funnel, 1 shallow
   umbrella with drooping ribs, 2 tiered (a smaller funnel beneath). */
export function tree(g: Builder, cx: number, cz: number, h: number, rTop: number, d: number, type = 0) {
  const N = Math.max(5, Math.round(10 * d));
  const S = Math.max(7, Math.round(14 * d));
  const yT = h * 0.78;
  const rw = rTop * 0.16;
  const r = (t: number) => rw * (1 + 1.3 * (2 * t - 1) ** 2);
  const P = (a: number, t: number, k = 1): V3 => [cx + Math.cos(a) * r(t) * k, t * yT, cz + Math.sin(a) * r(t) * k];

  for (const dir of [1, -1]) {
    for (let i = 0; i < N; i++) {
      const pts: V3[] = [];
      for (let s = 0; s <= S; s++) pts.push(P((TAU * i) / N + dir * 1.1 * Math.PI * (s / S), s / S));
      g.poly(pts, K.line);
    }
  }
  for (let s = 0; s <= S; s += 2) {
    for (let i = 0; i < N * 2; i++) g.line(P((TAU * i) / (N * 2), s / S), P((TAU * (i + 1)) / (N * 2), s / S), K.line);
  }

  const M = Math.max(10, Math.round(20 * d));
  const canopy = (y0: number, y1: number, r0: number, r1: number, umbrella: boolean, lights: boolean) => {
    const R = (s: number) => r0 + (r1 - r0) * (umbrella ? s : Math.pow(s, 0.6));
    // the umbrella rises then droops at the rim
    const Y = (s: number) => (umbrella ? y0 + (y1 - y0) * Math.sin(s * Math.PI * 0.75) / Math.sin(Math.PI * 0.75) : y0 + (y1 - y0) * s);
    const Q = (a: number, s: number): V3 => [cx + Math.cos(a) * R(s), Y(s), cz + Math.sin(a) * R(s)];
    for (let j = 0; j < M; j++) {
      const a = (TAU * j) / M;
      const rib: V3[] = [];
      for (let s = 0; s <= 5; s++) rib.push(Q(a, s / 5));
      g.poly(rib, K.line);
      if (lights) g.nodes.push(Q(a, 1));
    }
    for (const s of [0.4, 0.75, 1]) {
      for (let j = 0; j < M; j++) g.line(Q((TAU * j) / M, s), Q((TAU * (j + 1)) / M, s), s === 1 ? K.accent : K.line);
    }
  };
  if (type === 1) canopy(yT, h * 0.9, r(1), rTop * 1.15, true, true);
  else canopy(yT, h, r(1), rTop, false, true);
  if (type === 2) canopy(yT * 0.62, yT * 0.74, r(0.8), rTop * 0.55, false, false);

  for (let v = 0; v < (h > 30 ? 2 : 1); v++) {
    const pts: V3[] = [];
    for (let s = 0; s <= 40; s++) pts.push(P(v * Math.PI + 3.4 * Math.PI * (s / 40), s / 40, 1.1));
    g.poly(pts, K.accent);
    g.vines.push(pts);
  }

  for (let i = 0; i < 6; i++) {
    const a = (TAU * i) / 6 + 0.3;
    const pts: V3[] = [];
    for (let u = 0; u <= 1.001; u += 0.25) {
      const rad = rw * 2.2 + u * rTop * 0.9;
      pts.push([cx + Math.cos(a) * rad, -h * 0.14 * Math.sin((u * Math.PI) / 2), cz + Math.sin(a) * rad]);
    }
    g.poly(pts, K.hidden);
  }
}

/* The hero's grove: five trees on a ground ring, a skyway between the two
   tallest, a height dimension and the four callouts. Centred on (x, z). */
export function grove(x: number, z: number, d: number): Model {
  const g = new Builder();
  g.ring([x, 0, z], 34, 72, K.line);
  const T: [number, number, number, number][] = [[0, 0, 50, 13], [-23, 8, 34, 9], [21, -6, 40, 10.5], [-9, -21, 26, 7], [14, 19, 22, 6]];
  for (const [dx, dz, h, r] of T) tree(g, x + dx, z + dz, h, r, d);
  const a: V3 = [x + 2.5, 24, z - 0.8], c: V3 = [x + 11, 25, z - 18], b: V3 = [x + 18.5, 24, z - 5.5];
  const L = rails(g, (t) => {
    const u = 1 - t;
    return [u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1], u * u * a[2] + 2 * u * t * c[2] + t * t * b[2]];
  }, 20);
  g.line([x + 14, 0, z], [x + 38, 0, z], K.hidden);
  g.line([x + 14, 50, z], [x + 38, 50, z], K.hidden);
  g.dims.push({ a: [x + 36, 0, z], b: [x + 36, 50, z], text: "H 50.0 M" });
  g.labels.push(
    { at: [x - 13, 50, z], text: "A — Canopy · care", side: -1 },
    { at: [x + 2.6, 30, z], text: "B — Trunk · model", side: 1 },
    { at: [x - 7, -6, z], text: "C — Roots · data", side: -1 },
    { at: L[13], text: "D — Skyway · teams", side: 1 },
  );
  return g.done();
}

/* Walkway rails along a path p(t), t in 0..1, with cross ties. Returns the
   left rail's points. */
export function rails(g: Builder, p: (t: number) => V3, n: number, half = 0.9): V3[] {
  const L: V3[] = [], R: V3[] = [];
  for (let i = 0; i <= n; i++) {
    const q = p(i / n), q2 = p(Math.min(1, (i + 1) / n)), q0 = p(Math.max(0, (i - 1) / n));
    const dx = q2[0] - q0[0], dz = q2[2] - q0[2], m = Math.hypot(dx, dz) || 1;
    const l: V3 = [q[0] - (dz / m) * half, q[1], q[2] + (dx / m) * half];
    const r: V3 = [q[0] + (dz / m) * half, q[1], q[2] - (dx / m) * half];
    L.push(l);
    R.push(r);
    g.line(l, r, K.line);
    if (i % 3 === 0) g.nodes.push([l[0], l[1] + 1.2, l[2]], [r[0], r[1] + 1.2, r[2]]); // deck lamps
  }
  g.poly(L, K.accent);
  g.poly(R, K.accent);
  return L;
}

/* A gridshell conservatory dome, lat/long ribs braced into triangles, with
   young trees inside. */
export function dome(x: number, z: number, R: number, d: number): Model {
  const g = new Builder();
  const H = R * 0.7, L = 8, M = Math.max(18, Math.round(28 * d));
  const P = (i: number, j: number): V3 => {
    const e = (i / L) * (Math.PI / 2), a = (TAU * j) / M;
    return [x + R * Math.cos(e) * Math.cos(a), H * Math.sin(e), z + R * Math.cos(e) * Math.sin(a)];
  };
  for (let j = 0; j < M; j++) {
    for (let i = 0; i < L; i++) {
      g.line(P(i, j), P(i + 1, j), K.line);
      g.line(P(i, j), P(i, j + 1), i === 0 ? K.accent : K.line);
      if (i < L - 1) g.line(P(i, j), P(i + 1, j + 1), K.line);
    }
  }
  // young trees kept off the centre line the camera walks
  tree(g, x + R * 0.5, z + 4, R * 0.5, R * 0.2, d * 0.8);
  tree(g, x - R * 0.5, z + 2, R * 0.34, R * 0.13, d * 0.6);
  tree(g, x + R * 0.12, z + R * 0.6, R * 0.4, R * 0.15, d * 0.6);
  g.line([x - R, 0, z - R - 2], [x - R, 0, z - R - 8], K.hidden);
  g.line([x + R, 0, z - R - 2], [x + R, 0, z - R - 8], K.hidden);
  g.dims.push({ a: [x - R, 0, z - R - 6], b: [x + R, 0, z - R - 6], text: `Ø ${(2 * R).toFixed(1)} M` });
  // unlabelled: it stands behind the prize pool, where a label would cover the copy
  return g.done();
}

/* A lattice arch spanning the walkway: one per schedule stage. */
export function arch(x: number, z: number, r: number): Model {
  const g = new Builder();
  const n = 18;
  const P = (i: number, dz: number, k = 1): V3 => {
    const a = Math.PI * (i / n);
    return [x + Math.cos(a) * r * k, Math.sin(a) * r * k, z + dz];
  };
  for (let i = 0; i < n; i++) {
    g.line(P(i, 0), P(i + 1, 0), K.accent);
    g.line(P(i, 1.6, 0.9), P(i + 1, 1.6, 0.9), K.line);
    g.line(P(i, 0), P(i + 1, 1.6, 0.9), K.line);
  }
  g.line(P(0, 0), P(0, 1.6, 0.9), K.line);
  g.line(P(n, 0), P(n, 1.6, 0.9), K.line);
  return g.done();
}

/* One young supertree on a ground line: the empty plate's sapling. */
export function sapling(): Model {
  const g = new Builder();
  g.line([-8, 0, 0], [8, 0, 0], K.line);
  tree(g, 0, 0, 10, 3.8, 0.8);
  return g.done();
}

/* About: a DNA double helix spanning the walk overhead, a deck running
   through it, base pairs as lit rungs. Builds left to right. */
export function helixBridge(z: number, y: number, span: number, d: number): Model {
  const g = new Builder();
  const rad = 4.6, k = (TAU / 22) * 1, n = Math.round(span * (d > 0.5 ? 2 : 1.2));
  const P = (x: number, ph: number): V3 => [x, y + rad * Math.cos(k * x + ph), z + rad * Math.sin(k * x + ph)];
  const x0 = -span / 2;
  for (const ph of [0, Math.PI]) {
    const pts: V3[] = [];
    for (let i = 0; i <= n; i++) pts.push(P(x0 + (span * i) / n, ph));
    g.poly(pts, K.accent);
    // a fainter outer strand gives the tube its depth
    const outer: V3[] = pts.map(([px, py, pz]) => [px, y + (py - y) * 1.25, z + (pz - z) * 1.25]);
    g.poly(outer, K.line);
  }
  let pairs = 0;
  for (let x = x0 + 1; x < span / 2; x += 2) {
    const a = P(x, 0), b = P(x, Math.PI);
    g.line(a, b, pairs % 4 === 0 ? K.accent : K.line);
    g.nodes.push([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]);
    pairs++;
  }
  for (const dz of [-1.4, 1.4]) g.line([x0, y - 2.6, z + dz], [-x0, y - 2.6, z + dz], K.line);
  for (const px of [x0, -x0]) {
    for (const dz of [-1.4, 1.4]) g.line([px, 0, z + dz], [px, y - 2.6, z + dz], K.line);
    g.line([px, 0, z - 1.4], [px, y - 2.6, z + 1.4], K.line);
  }
  g.labels.push({ at: P(span * 0.18, 0), text: `Helix walk · ${pairs} base pairs`, side: 1 });
  return g.done(0);
}

/* Projects: a twisting archive tower. Each floor plate turns a little more
   than the one below; corner columns follow the twist. */
export function tower(x: number, z: number, floors: number, d: number): Model {
  const g = new Builder();
  const fh = 2.6, half = 6.5, turn = (Math.PI / 2) / floors * 1.6;
  const C = (f: number, c: number): V3 => {
    const a = f * turn + (c * Math.PI) / 2 + Math.PI / 4;
    const w = half * (1 - 0.18 * Math.sin((f / floors) * Math.PI)) * Math.SQRT2;
    return [x + Math.cos(a) * w, f * fh, z + Math.sin(a) * w];
  };
  const step = d > 0.5 ? 1 : 2;
  for (let f = 0; f <= floors; f += step) {
    for (let c = 0; c < 4; c++) g.line(C(f, c), C(f, c + 1), f % 5 === 0 ? K.accent : K.line);
    if (f % 3 === 1) g.nodes.push(C(f, f % 4));
  }
  for (let c = 0; c < 4; c++) {
    const pts: V3[] = [];
    for (let f = 0; f <= floors; f++) pts.push(C(f, c));
    g.poly(pts, K.line);
  }
  // crown and mast
  const top = floors * fh;
  g.ring([x, top + 3, z], half * 0.9, 24, K.accent);
  for (let c = 0; c < 4; c++) g.line(C(floors, c), [x, top + 3, z], K.line);
  g.line([x, top + 3, z], [x, top + 16, z], K.line);
  g.nodes.push([x, top + 16, z]);
  g.labels.push({ at: [x, top + 9, z], text: "Plate archive · 283 plates", side: -1 });
  return g.done();
}

/* People: twin hyperbolic-paraboloid pavilions, roofs made of straight
   ruled lines, on four columns each. */
export function pavilions(x: number, z: number, d: number): Model {
  const g = new Builder();
  const n = d > 0.5 ? 12 : 7;
  for (const [ox, oz, a0] of [[0, 0, 0], [16, 14, Math.PI / 4]] as const) {
    const a = 9, hi = 14, lo = 8;
    const corner = (i: number): V3 => {
      const ang = a0 + (i * Math.PI) / 2 + Math.PI / 4;
      return [x + ox + Math.cos(ang) * a * Math.SQRT2, i % 2 ? lo : hi, z + oz + Math.sin(ang) * a * Math.SQRT2];
    };
    const c = [0, 1, 2, 3].map(corner);
    const lerp = (p: V3, q: V3, t: number): V3 => [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, p[2] + (q[2] - p[2]) * t];
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      g.line(lerp(c[0], c[1], t), lerp(c[3], c[2], t), i === 0 || i === n ? K.accent : K.line);
      g.line(lerp(c[1], c[2], t), lerp(c[0], c[3], t), i === 0 || i === n ? K.accent : K.line);
    }
    for (const p of c) {
      g.line([p[0], 0, p[2]], p, K.line);
      g.nodes.push(p);
    }
  }
  g.labels.push({ at: [x, 14, z], text: "Pavilion · 80+ judges", side: 1 });
  return g.done();
}

/* Ledger: an observation wheel. Returns the turning wheel and its static
   A-frame legs. The wheel faces along `yaw`. */
export function wheel(x: number, z: number, R: number, yaw: number, d: number): Model[] {
  const hub: V3 = [x, R + 5, z];
  const u: V3 = [Math.cos(yaw), 0, Math.sin(yaw)]; // axle
  const v: V3 = [-Math.sin(yaw), 0, Math.cos(yaw)]; // in the wheel's plane
  const P = (ang: number, r: number, off: number): V3 => [
    hub[0] + v[0] * Math.cos(ang) * r + u[0] * off,
    hub[1] + Math.sin(ang) * r,
    hub[2] + v[2] * Math.cos(ang) * r + u[2] * off,
  ];
  const caps = 28, seg = d > 0.5 ? 56 : 36;
  const g = new Builder();
  for (const off of [-1.4, 1.4]) {
    for (let i = 0; i < seg; i++) g.line(P((TAU * i) / seg, R, off), P((TAU * (i + 1)) / seg, R, off), K.accent);
    for (let i = 0; i < caps; i += d > 0.5 ? 1 : 2) g.line(P((TAU * i) / caps, 1.5, off), P((TAU * i) / caps, R, off), K.line);
  }
  for (let i = 0; i < caps; i++) {
    const a = (TAU * i) / caps;
    g.line(P(a, R, -1.4), P(a, R, 1.4), K.line);
    // capsule: a small diamond outboard of the rim
    const c0 = P(a, R + 0.6, 0), c1 = P(a + 0.05, R + 1.6, 0), c2 = P(a, R + 2.6, 0), c3 = P(a - 0.05, R + 1.6, 0);
    g.poly([c0, c1, c2, c3, c0], K.line);
    g.nodes.push(P(a, R + 1.6, 0));
  }
  const spinning = g.done(1, { o: hub, u, speed: 0.06 }, R + 3);
  const legs = new Builder();
  for (const off of [-5, 5]) {
    for (const s of [-1, 1]) legs.line([hub[0] + v[0] * s * R * 0.55 + u[0] * off, 0, hub[2] + v[2] * s * R * 0.55 + u[2] * off], [hub[0] + u[0] * off * 0.3, hub[1], hub[2] + u[2] * off * 0.3], K.line);
  }
  legs.line([hub[0] - u[0] * 1.5, hub[1], hub[2] - u[2] * 1.5], [hub[0] + u[0] * 1.5, hub[1], hub[2] + u[2] * 1.5], K.accent);
  legs.labels.push({ at: hub, text: `Observation wheel · ${caps} capsules`, side: -1 });
  return [spinning, legs.done()];
}

/* FAQ: a row of wind turbines; each returns a mast and a spinning rotor
   facing the walk. */
export function turbines(x: number, z: number, n: number): Model[] {
  const out: Model[] = [];
  for (let i = 0; i < n; i++) {
    const tx = x - i * 6, tz = z + i * 26, h = 34 + i * 4;
    const m = new Builder();
    for (const [a, b] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) m.line([tx + a * 1.4, 0, tz + b * 1.4], [tx + a * 0.4, h, tz + b * 0.4], K.line);
    for (let y = 6; y < h; y += 6) m.ring([tx, y, tz], 1.4 - (y / h), 4, K.line);
    m.poly([[tx - 0.8, h, tz - 2], [tx + 0.8, h, tz - 2], [tx + 0.8, h + 1.4, tz - 2], [tx - 0.8, h + 1.4, tz - 2], [tx - 0.8, h, tz - 2]], K.line);
    m.line([tx, h + 0.7, tz - 2], [tx, h + 0.7, tz + 2.5], K.line);
    m.nodes.push([tx, h + 1.6, tz]);
    if (i === 0) m.labels.push({ at: [tx, h, tz], text: `Wind row · ${n} turbines`, side: 1 });
    out.push(m.done());
    const r = new Builder();
    const hub: V3 = [tx, h + 0.7, tz - 2.4];
    for (let b = 0; b < 3; b++) {
      const a = (TAU * b) / 3;
      const tip: V3 = [hub[0] + Math.cos(a) * 17, hub[1] + Math.sin(a) * 17, hub[2]];
      const w1: V3 = [hub[0] + Math.cos(a + 0.12) * 4, hub[1] + Math.sin(a + 0.12) * 4, hub[2]];
      const w2: V3 = [hub[0] + Math.cos(a - 0.05) * 4, hub[1] + Math.sin(a - 0.05) * 4, hub[2]];
      r.poly([hub, w1, tip, w2, hub], K.accent);
    }
    out.push(r.done(1, { o: hub, u: [0, 0, 1], speed: 0.5 + i * 0.12 }, 18));
  }
  return out;
}

/* ---- the wider world: tech structures between the landmarks ---- */

/* Antenna spire: a tapered triangular lattice mast with service rings and a
   lit tip. */
export function spire(g: Builder, x: number, z: number, h: number) {
  const base = h * 0.07;
  const P = (i: number, t: number): V3 => {
    const a = (TAU * i) / 3 + 0.4, r = base * (1 - t) + 0.3;
    return [x + Math.cos(a) * r, t * h, z + Math.sin(a) * r];
  };
  const n = 14;
  for (let i = 0; i < 3; i++) {
    const pts: V3[] = [];
    for (let s = 0; s <= n; s++) pts.push(P(i, s / n));
    g.poly(pts, K.line);
    for (let s = 0; s < n; s++) g.line(P(i, s / n), P(i + 1, (s + 1) / n), K.line);
  }
  for (const t of [0.35, 0.62, 0.84]) g.ring([x, t * h, z], base * (1 - t) + 2.2, 16, K.accent);
  g.line([x, h, z], [x, h + h * 0.12, z], K.line);
  g.nodes.push([x, h + h * 0.12, z], [x, h * 0.62, z + base * 0.38 + 2]);
}

/* Server-stack megatower: offset boxes stacked up, window rows lit like
   racks, an antenna array on the roof. */
export function megastack(g: Builder, x: number, z: number, h: number, r: () => number) {
  let y = 0, w = 10 + r() * 6, dpt = 8 + r() * 5, ox = 0, oz = 0;
  const box = (x0: number, y0: number, z0: number, bw: number, bh: number, bd: number) => {
    const X = [x0 - bw / 2, x0 + bw / 2], Y = [y0, y0 + bh], Z = [z0 - bd / 2, z0 + bd / 2];
    for (const yy of Y) g.poly([[X[0], yy, Z[0]], [X[1], yy, Z[0]], [X[1], yy, Z[1]], [X[0], yy, Z[1]], [X[0], yy, Z[0]]], yy === Y[1] ? K.accent : K.line);
    for (const xx of X) for (const zz of Z) g.line([xx, Y[0], zz], [xx, Y[1], zz], K.line);
    // floor lines on the two faces you see, with rack lights
    for (let fy = y0 + 3; fy < y0 + bh - 1; fy += 3) {
      g.line([X[0], fy, Z[0]], [X[1], fy, Z[0]], K.faint);
      g.line([X[0], fy, Z[0]], [X[0], fy, Z[1]], K.faint);
      if (r() < 0.35) g.nodes.push([X[0] + r() * bw, fy + 1.5, Z[0]]);
    }
  };
  while (y < h) {
    const bh = Math.min(h - y, 10 + r() * 14);
    box(x + ox, y, z + oz, w, bh, dpt);
    y += bh;
    w *= 0.8; dpt *= 0.85;
    ox += (r() - 0.5) * 3; oz += (r() - 0.5) * 3;
  }
  for (let i = 0; i < 3; i++) {
    const ax = x + ox + (i - 1) * w * 0.3;
    g.line([ax, y, z + oz], [ax, y + 6 + i * 3, z + oz], K.line);
    g.nodes.push([ax, y + 6 + i * 3, z + oz]);
  }
}

/* Floating island: an inverted rock cone of rings under a deck, hovering on
   faint tethers, with a small structure on top. */
export function island(g: Builder, x: number, z: number, y: number, rad: number, d: number, r: () => number) {
  const n = 18;
  g.ring([x, y, z], rad, n, K.accent);
  for (const [t, k] of [[0.35, 0.72], [0.7, 0.4]] as const) g.ring([x, y - rad * t, z], rad * k, n, K.line);
  for (let i = 0; i < n; i += 2) {
    const a = (TAU * i) / n;
    g.poly([[x + Math.cos(a) * rad, y, z + Math.sin(a) * rad], [x + Math.cos(a) * rad * 0.72, y - rad * 0.35, z + Math.sin(a) * rad * 0.72], [x + Math.cos(a) * rad * 0.4, y - rad * 0.7, z + Math.sin(a) * rad * 0.4], [x, y - rad * 1.05, z]], K.line);
  }
  for (const a of [0.6, 2.7, 4.6]) g.line([x + Math.cos(a) * rad * 0.6, y - rad * 0.5, z + Math.sin(a) * rad * 0.6], [x + Math.cos(a) * rad * 1.6, 0, z + Math.sin(a) * rad * 1.6], K.hidden);
  // build the structure at grade, then lift it onto the deck
  const t = new Builder();
  if (r() < 0.5) tree(t, x, z, rad * 1.6, rad * 0.55, d * 0.6, 1);
  else spire(t, x, z, rad * 2);
  for (let i = 0; i < t.s.length; i += 8) {
    if (t.s[i + 6] === K.hidden) continue; // roots stay below grade, unseen
    g.s.push(t.s[i], t.s[i + 1] + y, t.s[i + 2], t.s[i + 3], t.s[i + 4] + y, t.s[i + 5], t.s[i + 6], 0);
  }
  for (const n of t.nodes) g.nodes.push([n[0], n[1] + y, n[2]]);
  for (const v of t.vines) g.vines.push(v.map(([vx, vy, vz]) => [vx, vy + y, vz] as V3));
  return y + rad * 2.2;
}

/* Holo-panel: a floating display frame with scanlines, a live-looking ECG
   trace and a bar chart. */
export function holo(g: Builder, x: number, y: number, z: number, wd: number, ht: number, yaw: number, r: () => number) {
  const ux = Math.cos(yaw), uz = Math.sin(yaw);
  const P = (s: number, t: number): V3 => [x + ux * (s - 0.5) * wd, y + t * ht, z + uz * (s - 0.5) * wd];
  g.poly([P(0, 0), P(1, 0), P(1, 1), P(0, 1), P(0, 0)], K.accent);
  for (const [s, t] of [[0, 0], [1, 0], [1, 1], [0, 1]]) {
    const c = P(s, t), dx = s ? -1 : 1, dy = t ? -1 : 1;
    g.line(c, P(s + dx * 0.06, t), K.accent);
    g.line(c, P(s, t + dy * 0.1), K.accent);
  }
  for (let t = 0.1; t < 1; t += 0.12) g.line(P(0.02, t), P(0.98, t), K.faint);
  const ecg = [0, 0, 0.05, -0.1, 0.4, -0.35, 0.08, 0, 0, 0.12, 0, 0];
  const pts: V3[] = [];
  for (let i = 0; i <= 24; i++) pts.push(P(0.06 + 0.5 * (i / 24), 0.68 + 0.28 * ecg[i % ecg.length]));
  g.poly(pts, K.accent);
  for (let i = 0; i < 6; i++) {
    const s = 0.62 + i * 0.055, hgt = 0.15 + r() * 0.6;
    g.poly([P(s, 0.12), P(s, 0.12 + hgt), P(s + 0.035, 0.12 + hgt), P(s + 0.035, 0.12)], K.line);
  }
  g.line(P(0.5, 0), [x, 0, z], K.hidden);
}

/* Radar dish on a pedestal; the dish turns. */
export function dish(x: number, z: number, rad: number, d: number): Model[] {
  const ped = new Builder();
  const top: V3 = [x, rad * 1.1, z];
  for (const a of [0, 2.1, 4.2]) ped.line([x + Math.cos(a) * rad * 0.5, 0, z + Math.sin(a) * rad * 0.5], top, K.line);
  ped.labels.push({ at: top, text: "Array · listening", side: 1 });
  const g = new Builder();
  const tilt = 0.7, n = d > 0.5 ? 20 : 12;
  // paraboloid opening up and toward -z, tilted
  const P = (a: number, s: number): V3 => {
    const rr = rad * s, dep = rad * 0.35 * s * s;
    const lx = Math.cos(a) * rr, ly = dep, lz = Math.sin(a) * rr;
    return [top[0] + lx, top[1] + ly * Math.cos(tilt) - lz * Math.sin(tilt), top[2] + ly * Math.sin(tilt) + lz * Math.cos(tilt)];
  };
  for (let i = 0; i < n; i++) {
    const a = (TAU * i) / n;
    g.poly([0, 0.25, 0.5, 0.75, 1].map((s) => P(a, s)), K.line);
  }
  for (const s of [0.5, 1]) for (let i = 0; i < n; i++) g.line(P((TAU * i) / n, s), P((TAU * (i + 1)) / n, s), s === 1 ? K.accent : K.line);
  const focus: V3 = [top[0], top[1] + rad * 0.55 * Math.cos(tilt), top[2] + rad * 0.55 * Math.sin(tilt)];
  for (const a of [0, 2.1, 4.2]) g.line(P(a, 1), focus, K.line);
  g.nodes.push(focus);
  return [ped.done(), g.done(1, { o: top, u: [0, 1, 0], speed: 0.25 }, rad)];
}

/* A data cable slung between two points; packets ride it (it is a vine). */
export function cable(g: Builder, a: V3, b: V3, sag: number) {
  const pts: V3[] = [];
  for (let i = 0; i <= 16; i++) {
    const t = i / 16;
    pts.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t - sag * 4 * t * (1 - t), a[2] + (b[2] - a[2]) * t]);
  }
  g.poly(pts, K.faint);
  g.vines.push(pts);
}

/* Maglev guideway: a single beam on T pylons, one 40 m span. */
export function guideway(g: Builder, x: number, z: number, y: number) {
  for (const dx of [-0.8, 0.8]) g.line([x + dx, y, z], [x + dx, y, z + 40], K.accent);
  for (let zz = z; zz < z + 40; zz += 4) g.line([x - 0.8, y, zz], [x + 0.8, y, zz], K.faint);
  g.line([x, 0, z], [x, y - 1, z], K.line);
  g.line([x - 2, y - 1, z], [x + 2, y - 1, z], K.line);
  g.line([x - 2, y - 1, z], [x, y - 4, z], K.line);
  g.line([x + 2, y - 1, z], [x, y - 4, z], K.line);
}

/* The sky, in camera-relative metres far out: a ringed planet, a crescent
   moon and a mountain ridge on the horizon. Drawn at infinity. */
export function sky(): Model {
  const g = new Builder();
  const c: V3 = [-1400, 900, 4200], R = 700;
  for (let i = 1; i < 8; i++) {
    const lat = -Math.PI / 2 + (Math.PI * i) / 8, yy = c[1] + Math.sin(lat) * R, rr = Math.cos(lat) * R;
    const pts: V3[] = [];
    for (let j = 0; j <= 48; j++) pts.push([c[0] + Math.cos((TAU * j) / 48) * rr, yy, c[2] + Math.sin((TAU * j) / 48) * rr * 0.2]);
    g.poly(pts, i === 4 ? K.line : K.faint);
  }
  for (let j = 0; j < 12; j++) {
    const lon = (Math.PI * j) / 12, pts: V3[] = [];
    for (let i = 0; i <= 32; i++) {
      const lat = -Math.PI / 2 + (Math.PI * i) / 32;
      pts.push([c[0] + Math.cos(lat) * Math.cos(lon) * R, c[1] + Math.sin(lat) * R, c[2] + Math.cos(lat) * Math.sin(lon) * R * 0.2]);
    }
    g.poly(pts, K.faint);
  }
  const outline: V3[] = [];
  for (let j = 0; j <= 72; j++) outline.push([c[0] + Math.cos((TAU * j) / 72) * R, c[1] + Math.sin((TAU * j) / 72) * R, c[2]]);
  g.poly(outline, K.line);
  // tilted rings
  for (const k of [1.45, 1.6, 1.9]) {
    const pts: V3[] = [];
    for (let j = 0; j <= 96; j++) {
      const a = (TAU * j) / 96, rx = Math.cos(a) * R * k, ry = Math.sin(a) * R * k * 0.22;
      pts.push([c[0] + rx * Math.cos(0.32) - ry * Math.sin(0.32), c[1] + rx * Math.sin(0.32) + ry * Math.cos(0.32), c[2]]);
    }
    g.poly(pts, k === 1.6 ? K.accent : K.line);
  }
  // crescent moon
  const m: V3 = [1700, 1250, 4200];
  const arc = (rr: number, dx: number, from: number, to: number) => {
    const pts: V3[] = [];
    for (let j = 0; j <= 24; j++) {
      const a = from + ((to - from) * j) / 24;
      pts.push([m[0] + dx + Math.cos(a) * rr, m[1] + Math.sin(a) * rr, m[2]]);
    }
    g.poly(pts, K.line);
  };
  arc(140, 0, Math.PI / 2, Math.PI * 1.5);
  arc(118, -36, Math.PI / 2 + 0.2, Math.PI * 1.5 - 0.2);
  // mountain ridge
  const r = (i: number) => Math.sin(i * 1.7) * 0.5 + Math.sin(i * 0.43 + 1) * 0.8 + Math.sin(i * 3.1) * 0.25;
  const ridge: V3[] = [];
  for (let i = 0; i <= 120; i++) ridge.push([-6000 + i * 100, 140 + 160 * Math.max(0, r(i)) + 60 * r(i * 2.3), 3600]);
  g.poly(ridge, K.line);
  return g.done();
}

/* Prizes: a three-tier podium, a lathe-turned trophy on each tier (sized by
   place), place numerals stroked on the front faces. */
export function podium(): Model {
  const g = new Builder();
  const box = (x: number, h: number, w: number) => {
    const X = [x - w / 2, x + w / 2], Z = [-w / 2, w / 2];
    for (const y of [0, h]) g.poly([[X[0], y, Z[0]], [X[1], y, Z[0]], [X[1], y, Z[1]], [X[0], y, Z[1]], [X[0], y, Z[0]]], y ? K.accent : K.line);
    for (const xx of X) for (const zz of Z) g.line([xx, 0, zz], [xx, h, zz], K.line);
  };
  const DIGITS: Record<number, [number, number][][]> = {
    1: [[[0.5, 0], [0.5, 1]], [[0.2, 0.8], [0.5, 1]]],
    2: [[[0, 1], [1, 1], [1, 0.5], [0, 0.5], [0, 0], [1, 0]]],
    3: [[[0, 1], [1, 1], [1, 0], [0, 0]], [[0.15, 0.5], [1, 0.5]]],
  };
  const digit = (n: number, cx: number, cy: number, s: number) => {
    for (const path of DIGITS[n]) g.poly(path.map(([u, v]) => [cx + (u - 0.5) * s * 0.6, cy + (v - 0.5) * s, -4.01] as V3), K.accent);
  };
  // lathe profile (radius, height) of a cup
  const PROFILE: [number, number][] = [[2, 0], [2, 0.4], [0.7, 0.8], [0.45, 2.2], [1.5, 2.7], [2.3, 4], [2.6, 5.4]];
  const trophy = (x: number, y: number, k: number) => {
    const P = (a: number, [r, h]: [number, number]): V3 => [x + Math.cos(a) * r * k, y + h * k, Math.sin(a) * r * k];
    const n = 16;
    for (let j = 0; j < n; j++) g.poly(PROFILE.map((p) => P((TAU * j) / n, p)), K.line);
    PROFILE.forEach((p, i) => {
      for (let j = 0; j < n; j++) g.line(P((TAU * j) / n, p), P((TAU * (j + 1)) / n, p), i === PROFILE.length - 1 ? K.accent : K.line);
    });
    // handles
    for (const s of [-1, 1]) {
      const pts: V3[] = [];
      for (let i = 0; i <= 10; i++) {
        const t = (i / 10) * Math.PI;
        pts.push([x + s * (2.3 + Math.sin(t) * 1.3) * k, y + (3.1 + 1.9 * (1 - Math.cos(t)) / 2 + 0.4) * k, 0]);
      }
      g.poly(pts, K.line);
    }
    for (let j = 0; j < 8; j++) g.nodes.push(P((TAU * j) / 8, PROFILE[PROFILE.length - 1]));
  };
  const tiers: [place: number, x: number, h: number, k: number][] = [[2, -8.4, 5, 0.8], [1, 0, 8, 1], [3, 8.4, 3.5, 0.7]];
  for (const [place, x, h, k] of tiers) {
    box(x, h, 8);
    digit(place, x, h / 2, Math.min(3.2, h * 0.55));
    trophy(x, h, k);
  }
  g.ring([0, 0, 0], 17, 64, K.faint);
  g.line([4.6, 0, -4], [9.5, 0, -4], K.hidden);
  g.dims.push({ a: [-14.5, 0, -4], b: [-14.5, 8, -4], text: "P1" });
  g.labels.push(
    { at: [0, 13.5, 0], text: "P1 · 1st place", side: 1 },
    { at: [-8.4, 9.3, 0], text: "P2", side: -1 },
    { at: [8.4, 7.3, 0], text: "P3", side: 1 },
  );
  return g.done();
}
