"use client";

import { useEffect, useRef } from "react";
import { useScrollLoop, requestTick } from "./useScrollLoop";
import { ditherLum } from "@/components/plates/dither";
import { BEAT } from "./events";
import { evalShape, horizonDist, hit, HEIGHT, type Shape } from "./shapes";

/* The field: one fixed, low-res canvas of Atkinson-dithered cobalt ink with
   transparent darks. Its brightness is keyed to scroll position so ink rises
   into Prizes until the screen is solid cobalt, then drains before People.
   Along the way the ink draws a skyline of science structures, one per
   section, morphing as you scroll (see shapes.ts). */
type Blob = [x: number, y: number, r: number, v: number];
/* How a section's structure arrives from the previous one. */
type Tr = "rise" | "wipe" | "blinds" | "liftoff" | "build" | "glitch" | "dissolve" | "iris";
type State = { o: number; b: number; blobs: Blob[]; shape: Shape | null; tr?: Tr };
type Key = [section: string, anchor: number, state: State];

/* Each section also carries a structure that the ink draws while you're
   there, and `tr`, the transition it arrives with — every change is a
   different effect. Long sections repeat their key at .9 so their structure
   stays standing. */
const KEYS: Key[] = [
  ["hero", .2, { o: .5, b: .04, blobs: [[.85, .25, .45, .75], [.10, .95, .35, .35]], shape: ["citadel", .72, .97, .5, .95] }],
  ["about", .5, { o: .46, b: .02, blobs: [[.95, .55, .35, .55], [.05, .15, .25, .25]], shape: ["observatory", .72, .97, .5, .95], tr: "rise" }],
  ["projects", .5, { o: .36, b: 0, blobs: [[0, .5, .25, .45], [1, .1, .2, .2]], shape: ["datacenter", .7, .97, .45, 1], tr: "wipe" }],
  ["projects", .9, { o: .36, b: 0, blobs: [[0, .5, .25, .45], [1, .1, .2, .2]], shape: ["datacenter", .7, .97, .45, 1] }],
  ["schedule", .85, { o: .46, b: .10, blobs: [[.8, 1, .6, .8], [.2, 1.1, .5, .6]], shape: ["launch", .74, .97, .5, 1], tr: "blinds" }],
  ["prizes", .15, { o: 1, b: 1, blobs: [[.5, .5, .1, 1], [.5, .5, .1, 1]], shape: null, tr: "liftoff" }],
  ["prizes", .7, { o: 1, b: 1, blobs: [[.5, .5, .1, 1], [.5, .5, .1, 1]], shape: null }],
  ["people", .06, { o: .46, b: .10, blobs: [[.2, 0, .6, .8], [.8, -.1, .5, .6]], shape: ["arcology", .68, .97, .45, .95], tr: "build" }],
  ["people", .9, { o: .46, b: .10, blobs: [[.2, 0, .6, .8], [.8, -.1, .5, .6]], shape: ["arcology", .68, .97, .45, .95] }],
  ["ledger", .5, { o: .46, b: .02, blobs: [[.95, .45, .3, .5], [0, .9, .25, .3]], shape: ["helix", .78, .97, .5, .95], tr: "glitch" }],
  ["faq", .5, { o: .42, b: 0, blobs: [[0, .7, .3, .4], [.9, .1, .2, .25]], shape: ["array", .72, .97, .45, 1], tr: "dissolve" }],
  ["register", .6, { o: .56, b: .06, blobs: [[.8, .55, .5, .85], [.2, .2, .3, .4]], shape: ["kingdom", .72, .97, .5, .95], tr: "iris" }],
];

/* Up to 320 wide so the skyline's windows and trusses hold their shape, but
   capped at a fixed pixel budget so tall phone screens cost no more than a
   laptop. */
const MAX_W = 320;
const MAX_PX = 64_000;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => t * t * (3 - 2 * t);

/* Mixed state: both endpoint keyframes, how far between them, and the
   incoming transition. */
type Mixed = { a: State; b: State; o: number; bright: number; sa: Shape | null; sb: Shape | null; t: number; tr: Tr };

function mix(a: State, b: State, t: number): Mixed {
  return { a, b, o: lerp(a.o, b.o, t), bright: lerp(a.b, b.b, t), sa: a.shape, sb: b.shape, t, tr: b.tr ?? "dissolve" };
}

const FLASH: State = { o: 1, b: 1, blobs: KEYS[0][2].blobs, shape: null };

export default function Field() {
  const ref = useRef<HTMLCanvasElement>(null);
  const geo = useRef({ ys: [] as number[], vh: 1, h: 1, ok: false });
  const last = useRef("");
  const flash = useRef(false);

  const fail = () => {
    document.documentElement.classList.add("no-field");
    geo.current.ok = false;
  };

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let t = 0;
    const measure = () => {
      try {
        const vw = window.innerWidth, vh = window.innerHeight;
        const W = Math.round(Math.min(MAX_W, Math.sqrt((MAX_PX * vw) / vh)));
        const h = Math.max(1, Math.round((W * vh) / vw));
        if (canvas.width !== W || canvas.height !== h) {
          canvas.width = W;
          canvas.height = h;
          last.current = "";
        }
        const ys = KEYS.map(([id, a]) => {
          const el = document.getElementById(id);
          if (!el) return NaN;
          const r = el.getBoundingClientRect();
          return r.top + window.scrollY + r.height * a;
        });
        geo.current = { ys, vh, h, ok: ys.every((y) => !Number.isNaN(y)) };
        requestTick();
        prewarm(W, h);
      } catch {
        fail();
      }
    };
    const schedule = () => {
      clearTimeout(t);
      t = window.setTimeout(measure, 120);
    };
    measure();
    window.addEventListener("resize", schedule);
    const ro = new ResizeObserver(schedule);
    const main = document.querySelector("main");
    if (main) ro.observe(main);
    const onBeat = () => {
      flash.current = true;
      last.current = "";
      requestTick();
      window.setTimeout(() => { last.current = ""; requestTick(); }, 90);
    };
    window.addEventListener(BEAT, onBeat);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", schedule);
      window.removeEventListener(BEAT, onBeat);
      ro.disconnect();
    };
  }, []);

  useScrollLoop((scrollY) => {
    const canvas = ref.current;
    const g = geo.current;
    if (!canvas || !g.ok) return;
    try {
      const p = scrollY + g.vh / 2;
      let s: Mixed;
      if (flash.current) {
        flash.current = false;
        s = mix(FLASH, FLASH, 0);
      } else if (p <= g.ys[0]) s = mix(KEYS[0][2], KEYS[0][2], 0);
      else if (p >= g.ys[g.ys.length - 1]) s = mix(KEYS[KEYS.length - 1][2], KEYS[KEYS.length - 1][2], 0);
      else {
        let i = 0;
        while (g.ys[i + 1] < p) i++;
        const span = g.ys[i + 1] - g.ys[i];
        s = mix(KEYS[i][2], KEYS[i + 1][2], span > 0 ? smooth((p - g.ys[i]) / span) : 1);
      }
      const key = `${KEYS.findIndex((k) => k[2] === s.a)}>${KEYS.findIndex((k) => k[2] === s.b)}@${s.t.toFixed(3)}`;
      if (key === last.current) return;
      last.current = key;
      render(canvas, s);
    } catch {
      fail();
    }
  });

  return <canvas ref={ref} className="field" aria-hidden="true" />;
}

const RIM = 0.006; // bright outline width, in short-side units
const clamp01 = (t: number) => Math.max(0, Math.min(1, t));

/* One structure's ink at a pixel (0-1), or -1 for sky. */
function ink(shape: Shape, x: number, y: number, w: number, h: number, mn: number) {
  evalShape(shape, x, y, w, h, mn, 0);
  if (hit.lit < 0) return 1; // windows, signs, beacons
  if (hit.d < 0) return hit.d > -RIM ? 0.9 : hit.fac;
  return -1;
}

/* Structures don't change while you scroll, only drift vertically, so each
   is rasterized once per canvas size, straight to luminance (-1 = sky), and
   then sampled with a row offset. */
const maps = new Map<string, Float32Array>();
let mapSize = "";

/* The atmosphere (base brightness + blobs, after the darkening curve) for
   one keyframe. Between keyframes the two maps crossfade. */
const atmos = new Map<State, Float32Array>();
let atmSize = "";
function atmMap(st: State, w: number, h: number) {
  if (atmSize !== `${w}x${h}`) {
    atmos.clear();
    atmSize = `${w}x${h}`;
  }
  let m = atmos.get(st);
  if (!m) {
    m = new Float32Array(w * h);
    const mx = Math.max(w, h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let v = st.b * 255;
        for (const [bx, by, br, bv] of st.blobs) {
          const dx = (x / w - bx) * (w / mx), dy = (y / h - by) * (h / mx);
          const f = Math.max(0, 1 - Math.hypot(dx, dy) / br);
          // blobs are kept soft so the skyline reads over them
          v += bv * 0.4 * 255 * smooth(f);
        }
        // same darkening curve as the plates
        m[y * w + x] = 255 * Math.pow(Math.min(255, v) / 255, 1.9);
      }
    }
    atmos.set(st, m);
  }
  return m;
}
function inkMap(shape: Shape, w: number, h: number, mn: number) {
  if (mapSize !== `${w}x${h}`) {
    maps.clear();
    mapSize = `${w}x${h}`;
  }
  const key = shape.join(",");
  let m = maps.get(key);
  if (!m) {
    m = new Float32Array(w * h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = ink(shape, x, y, w, h, mn);
        m[y * w + x] = i < 0 ? -1 : inkL(i * shape[4]);
      }
    }
    maps.set(key, m);
  }
  return m;
}
/* Ink of a structure sunk `sink` shape units, clipped at its horizon. */
function sample(map: Float32Array, shape: Shape, sink: number, x: number, y: number, w: number, h: number, mn: number) {
  if (y > shape[2] * h) return -1;
  const sy = y - Math.round(sink * shape[3] * mn);
  return sy < 0 || sy >= h || x < 0 || x >= w ? -1 : map[sy * w + x];
}

const inkL = (v: number) => 255 * Math.pow(v, 1.35);
const DRIFT = 0.22 * HEIGHT;
const hash2 = (a: number, b: number) => {
  const v = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return v - Math.floor(v);
};

/* Per-frame inputs for the transition at the current pixel. */
const T = {
  tt: 0, w: 1, h: 1, mn: 1, base: 0,
  sa: null as Shape | null, sb: null as Shape | null,
  ma: null as Float32Array | null, mb: null as Float32Array | null,
  // geometry of the structure being revealed, in pixels
  cx: 0, ground: 0, top: 0,
};
const A = (sink: number, x: number, y: number) => (T.sa ? sample(T.ma!, T.sa, sink, x, y, T.w, T.h, T.mn) : -1);
const B = (sink: number, x: number, y: number) => (T.sb ? sample(T.mb!, T.sb, sink, x, y, T.w, T.h, T.mn) : -1);
const LA = (i: number) => (i >= 0 ? i : T.base);
const LB = LA;
const inBand = (y: number) => y > T.top && y < T.ground;

function transition(tr: Tr, x: number, y: number) {
  const tt = T.tt;
  switch (tr) {
    case "rise": {
      // old one sinks into the ground, then the new one rises out of it
      const tA = smooth(clamp01(tt * 2)), tB = smooth(clamp01(tt * 2 - 1));
      const b = B((1 - tB) * HEIGHT, x, y);
      return b >= 0 ? LB(b) : LA(A(tA * HEIGHT, x, y));
    }
    case "wipe": {
      // a scanner line sweeps left to right, printing the new structure
      const e = tt * (T.w + 16) - 8;
      if (Math.abs(x - e) < 1.2 && inBand(y)) return 255;
      return x < e ? LB(B(0, x, y)) : LA(A(0, x, y));
    }
    case "blinds": {
      // slats rotate open
      return (x % 10) / 10 < tt ? LB(B(0, x, y)) : LA(A(0, x, y));
    }
    case "liftoff": {
      // the whole complex lifts off, accelerating, and burns out
      const la = LA(A(-tt * tt * HEIGHT * 1.8, x, y));
      return la + (LB(B(0, x, y)) - la) * tt;
    }
    case "build": {
      // the new skyline is built column by column
      const c = Math.floor(x / 5), local = smooth(clamp01((tt - hash2(c, 7) * 0.55) / 0.45));
      const b = B((1 - local) * HEIGHT, x, y);
      return b >= 0 ? LB(b) : LA(A(local * HEIGHT, x, y));
    }
    case "glitch": {
      // signal tears: row bands jump sideways and flip between the two
      const band = Math.floor(y / 3), step = Math.floor(tt * 14), amp = Math.sin(Math.PI * tt);
      const sx = x + Math.round((hash2(band, step + 50) - 0.5) * 28 * amp);
      if (amp > 0.3 && hash2(band, step + 99) > 0.96 && inBand(y)) return 200;
      return hash2(band, step) < tt ? LB(B(0, sx, y)) : LA(A(0, sx, y));
    }
    case "iris": {
      // a ring opens from the structure's heart
      const R = tt * (T.ground - T.top) * 1.5, d = Math.hypot(x - T.cx, y - (T.ground + T.top) / 2);
      if (tt > 0 && tt < 1 && Math.abs(d - R) < 1.3 && y < T.ground) return 255;
      return d < R ? LB(B(0, x, y)) : LA(A(0, x, y));
    }
    default: {
      // dither double exposure, each drifting a little
      const la = LA(A(tt * DRIFT, x, y)), lb = LB(B((1 - tt) * DRIFT, x, y));
      return la + (lb - la) * tt;
    }
  }
}

/* Rasterize every keyframe's atmosphere and structure in idle time, one per
   callback, so the first scroll into a section doesn't stall a frame. */
let warmToken = 0;
function prewarm(w: number, h: number) {
  const token = ++warmToken;
  const mn = Math.min(w, h), portrait = w < h;
  const jobs: (() => void)[] = [];
  for (const [, , st] of KEYS) {
    jobs.push(() => atmMap(st, w, h));
    const sh = fit(st.shape, portrait);
    if (sh) jobs.push(() => inkMap(sh, w, h, mn));
  }
  const idle = (cb: () => void) =>
    typeof window.requestIdleCallback === "function" ? window.requestIdleCallback(cb, { timeout: 2000 }) : setTimeout(cb, 50);
  const next = () => {
    if (token !== warmToken) return; // a resize started a newer pass
    const job = jobs.shift();
    if (!job) return;
    job();
    idle(next);
  };
  idle(next);
}

/* On portrait screens the skyline would sit right behind the text, so
   structures shrink and dim there. */
const portraitShapes = new Map<Shape, Shape>();
function fit(shape: Shape | null, portrait: boolean): Shape | null {
  if (!shape || !portrait) return shape;
  let p = portraitShapes.get(shape);
  if (!p) {
    p = [shape[0], shape[1], shape[2], shape[3] * 0.7, shape[4] * 0.75];
    portraitShapes.set(shape, p);
  }
  return p;
}

function render(canvas: HTMLCanvasElement, m: Mixed) {
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no 2d context");
  const w = canvas.width, h = canvas.height, mn = Math.min(w, h);
  const portrait = w < h;
  const s = { ...m, sa: fit(m.sa, portrait), sb: fit(m.sb, portrait) };
  const sv = lerp(s.sa?.[4] ?? 0, s.sb?.[4] ?? 0, s.t);
  const tt = smooth(clamp01((s.t - 0.08) / 0.84));
  const ga = atmMap(s.a, w, h), gb = s.b === s.a ? ga : atmMap(s.b, w, h), gt = s.t;
  const sky = (s.sa || s.sb) && s.bright < 0.95;
  const ma = s.sa && sky ? inkMap(s.sa, w, h, mn) : null;
  const mb = s.sb && sky ? inkMap(s.sb, w, h, mn) : null;
  const same = !!s.sa && !!s.sb && s.sa.join() === s.sb.join();
  const s0 = (s.sb ?? s.sa)!;
  let hz0 = -1, hz1 = -1, skyTop = 0;
  if (sky && s0) {
    Object.assign(T, { tt, w, h, mn, sa: s.sa, sb: s.sb, ma, mb });
    T.cx = (w < h ? 0.5 + (s0[1] - 0.5) * 0.35 : s0[1]) * w;
    T.ground = s0[2] * h;
    T.top = T.ground - HEIGHT * s0[3] * mn;
    // rows above the taller structure are pure atmosphere — except during
    // liftoff, when the rocket climbs out of that band
    const tallest = Math.max(s.sa?.[3] ?? 0, s.sb?.[3] ?? 0);
    skyTop = !same && s.tr === "liftoff" ? 0 : T.ground - HEIGHT * tallest * mn - 2;
    // horizon rows, found once per frame instead of per pixel
    for (let y = 0; y < h; y++) {
      if (horizonDist(s0, y, h, mn) < 0) {
        if (hz0 < 0) hz0 = y;
        hz1 = y;
      }
    }
  }
  const horizonL = inkL(sv);
  const L = new Float32Array(w * h);
  for (let y = 0; y < h; y++) {
    const onHorizon = y >= hz0 && y <= hz1 && hz0 >= 0;
    const top = !sky || y < skyTop;
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      let l = ga[i] + (gb[i] - ga[i]) * gt;
      if (!top) {
        if (onHorizon) l = horizonL;
        else if (same) {
          const v = ma![i];
          if (v >= 0) l = v;
        } else {
          T.base = l;
          l = transition(s.tr, x, y);
        }
      }
      L[i] = l;
    }
  }
  const img = ctx.createImageData(w, h);
  ditherLum(L, w, h, img.data, null);
  ctx.putImageData(img, 0, 0);
  canvas.style.opacity = String(portrait && s.bright < 0.95 ? s.o * 0.8 : s.o);
}
