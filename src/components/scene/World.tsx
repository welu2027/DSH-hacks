"use client";

import { useEffect, useRef } from "react";
import { BEAT } from "@/components/world/events";
import { arch, Builder, cable, dish, dome, grove, guideway, helixBridge, holo, island, K, megastack, pavilions, rails, sky, spire, tower, tree, turbines, wheel, type Model, type Spin, type V3 } from "./geometry";

/* The garden: one fixed canvas behind the whole page. Scrolling walks the
   camera forward through a supertree garden; a skyway runs the full length.
   On load the hero grove is a flat elevation drawn into the hero figure's
   slot, then swings into perspective. Structures ahead draw themselves
   bottom-up as you approach. Each section has its own landmark: a DNA helix
   bridge (About), a twisting archive tower (Projects), arches you pass under
   (Schedule), a conservatory you walk into (Prizes), saddle-roof pavilions
   (People), an observation wheel (Ledger) and a wind row (FAQ). Between
   them the world is a tech city: supertrees, antenna spires, server-stack
   megatowers, floating islands, holo-panels showing ECG traces, data cables
   with packets, radar dishes, a maglev with a train on it, drones, and a
   ringed planet over the horizon. Over
   .cyan sheets the canvas paints the blueprint ground itself and redraws the
   lines in paper, so the world runs through them unbroken. */

const SPEED = 0.07; // metres per scrolled pixel
const FAR = 200;
const NEAR = 1.5;
const CAM_Y = 12;
const PITCH = 0.12;
const GROVE: V3 = [40, 0, 120];
const GROVE_FIT = 38, GROVE_CY = 21;
const STAGES = 5;
const MAGLEV_X = 15, MAGLEV_Y = 9;
/* Text blocks the world dims itself behind. */
const QUIET = [
  ".hero-kicker", ".h1", ".hero .lead", ".sheet-label", ".sec-title", ".lead", ".prose p", ".quote",
  ".record > div", ".plates-intro", ".gal-foot", ".axis", ".steps > li", ".pool", ".pool-sub", ".prize-note",
  ".criteria > div", ".people-h", ".sub", ".logo-group > .label", ".talks a", ".ledger-head", ".ledger > li",
  ".faq summary", ".faq details[open] p", ".reg-h", ".reg-body", ".tblock", ".figcap", ".index ol",
  ".foot-grid > div", ".foot-bar", ".roll-filters",
].join(", ");
const SKY = sky();

const INK = { rgb: ["242,244,248", "141,176,255", "141,176,255", "141,176,255"], a: [0.42, 0.85, 0.5, 0.13] };
const CYAN = { rgb: ["242,244,248", "242,244,248", "242,244,248", "242,244,248"], a: [0.5, 0.95, 0.5, 0.16] };
const WIDTH = [1, 1.25, 1, 1];
const DEPTH_A = [1, 0.6, 0.3];

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const skyX = (z: number) => 12 * Math.sin(z * 0.011) - 4;
const skyY = (z: number) => 22 + 4 * Math.sin(z * 0.006 + 1);

function rng(seed: number) {
  return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
}

/* Lay the garden out against the live page: landmarks sit where their
   sections scroll past. */
function layout(d: number, vh: number): Model[] {
  const top = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { top: r.top + window.scrollY, h: r.height };
  };
  const camZ = (scroll: number) => Math.max(0, scroll) * SPEED;
  const end = document.documentElement.scrollHeight * SPEED + FAR;
  const out: Model[] = [grove(GROVE[0], GROVE[2], d)];

  const avoid: [number, number][] = [[GROVE[2] - 40, GROVE[2] + 40]];
  // z where a section's landmark sits: `ahead` metres in front of the camera
  // when the section is centred on screen
  const at = (id: string, ahead: number) => {
    const t = top(id);
    return t ? camZ(t.top + t.h / 2 - vh / 2) + ahead : null;
  };
  const place = (z: number | null, half: number, make: (z: number) => Model | Model[]) => {
    if (z === null) return;
    const m = make(z);
    out.push(...(Array.isArray(m) ? m : [m]));
    avoid.push([z - half, z + half]);
  };
  place(at("about", 34), 10, (z) => helixBridge(z, 27, 100, d));
  place(at("projects", 70), 18, (z) => tower(44, z, 34, d));
  place(at("people", 55), 28, (z) => pavilions(-42, z, d));
  place(at("ledger", 70), 32, (z) => wheel(50, z, 26, 0.9, d));
  place(at("faq", 50), 40, (z) => turbines(-46, z - 26, 3));
  place(at("projects", 20), 8, (z) => dish(-40, z, 9, d));
  place(at("register", 10), 8, (z) => dish(42, z, 11, d));
  const prizes = top("prizes");
  if (prizes) {
    const zc = camZ(prizes.top + prizes.h / 2 - vh / 2) + 24;
    out.push(dome(0, zc, 36, d));
    avoid.push([zc - 44, zc + 44]);
  }
  const sched = top("schedule");
  if (sched) {
    // unlabelled: the schedule copy already names each stage
    for (let i = 0; i < STAGES; i++) out.push(arch(0, camZ(sched.top - vh * 0.4 + (sched.h * i) / 4) + 46, 17));
  }

  // the city flanking the walk: a mix of structures, tops on each side
  // strung together with data cables
  const r = rng(11);
  let side = 1;
  const lastTop: Record<number, V3 | null> = { [-1]: null, [1]: null };
  for (let z = GROVE[2] + 30; z < end; z += 18 + r() * 14) {
    if (avoid.some(([a, b]) => z > a && z < b)) continue;
    side = -side;
    const g = new Builder();
    const x = side * (24 + r() * 26), pick = r();
    let top: V3 | null = null;
    if (pick < 0.3) {
      const h = 18 + r() * 30, kind = r();
      tree(g, x, z, h, h * 0.27, d, kind < 0.3 ? 1 : kind < 0.55 ? 2 : 0);
      top = [x, h * 0.8, z];
    } else if (pick < 0.47) {
      const h = 40 + r() * 40;
      spire(g, x, z, h);
      top = [x, h * 0.62, z];
    } else if (pick < 0.68) {
      const h = 30 + r() * 50;
      megastack(g, x, z, h, r);
      top = [x, h, z];
    } else if (pick < 0.85) {
      const y = 22 + r() * 18;
      top = [x, island(g, x * 1.1, z, y, 6 + r() * 4, d, r), z];
    } else {
      // holo-panels hang nearer the walk, turned toward it
      holo(g, side * (13 + r() * 6), 9 + r() * 8, z, 10 + r() * 4, 6, -side * 0.5, r);
    }
    if (top) {
      const prev = lastTop[side];
      if (prev && z - prev[2] < 70) cable(g, prev, top, 4 + r() * 4);
      lastTop[side] = top;
    }
    out.push(g.done());
  }

  // maglev guideway beside the walk
  for (let z = GROVE[2] + 20; z < end; z += 40) {
    const g = new Builder();
    guideway(g, MAGLEV_X, z, MAGLEV_Y);
    out.push(g.done());
  }

  // the skyway, in 40 m spans on pylons
  for (let z = GROVE[2] + 45; z < end; z += 40) {
    const g = new Builder();
    rails(g, (t) => {
      const zz = z + 40 * t;
      return [skyX(zz), skyY(zz), zz];
    }, 12, 1.1);
    for (const s of [-1, 1]) g.line([skyX(z) + s * 1.1, 0, z], [skyX(z) + s * 1.1, skyY(z), z], K.line);
    g.line([skyX(z) - 1.1, skyY(z) * 0.5, z], [skyX(z) + 1.1, skyY(z), z], K.line);
    out.push(g.done());
  }
  return out;
}

export default function World() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    const ctx = cv?.getContext("2d");
    if (!cv || !ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const html = document.documentElement;
    html.classList.add("has-world");
    const font = `11px ${getComputedStyle(html).getPropertyValue("--font-departure") || "monospace"}`;
    const cyanEls = Array.from(document.querySelectorAll<HTMLElement>(".cyan"));
    // text the linework fades behind (re-read when the page re-lays)
    const findText = () => Array.from(document.querySelectorAll<HTMLElement>(QUIET));
    let quiet = findText();
    const slot = document.querySelector<HTMLElement>(".world-slot");

    let w = 0, h = 0, dpr = 1, d = 1;
    let objs: Model[] = [];
    let t0 = -1, raf = 0, mouse = 0, mouseT = 0, burst = 0;
    let camS = -1, last = 0; // eased camera z, last frame time
    let intro = !reduced;

    // 12 growable buckets: 4 line kinds × 3 depth bands
    const buf: Float32Array[] = Array.from({ length: 12 }, () => new Float32Array(4096));
    const cnt = new Int32Array(12);
    const push = (bi: number, a: number, b: number, c: number, e: number) => {
      let B = buf[bi];
      const n = cnt[bi];
      if (n + 4 > B.length) {
        const nb = new Float32Array(B.length * 2);
        nb.set(B);
        buf[bi] = B = nb;
      }
      B[n] = a; B[n + 1] = b; B[n + 2] = c; B[n + 3] = e;
      cnt[bi] = n + 4;
    };

    const rebuild = () => {
      quiet = findText();
      d = w < 720 ? 0.45 : 0.7;
      objs = layout(d, h);
    };
    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = window.innerWidth;
      h = window.innerHeight;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      rebuild();
    };

    function frame(now: number) {
      if (!ctx) return;
      if (t0 < 0) {
        t0 = now;
        // start in 3D when the hero slot isn't on screen (phones, deep links)
        const r = slot?.getBoundingClientRect();
        if (!r || r.top > h * 0.85 || r.bottom < 0) intro = false;
      }
      const el = (now - t0) / 1000;
      const p = reduced ? 1 : easeOut(clamp(el / 2.6));
      const m = intro ? easeInOut(clamp((el - 2.2) / 1.8)) : 1;
      if (intro && m >= 1) intro = false;
      burst *= 0.97;

      const sY = window.scrollY;
      // the camera glides after the scroll position instead of snapping to it
      const dt = Math.min(0.1, last ? (now - last) / 1000 : 0);
      last = now;
      const target = sY * SPEED;
      camS = camS < 0 ? target : camS + (target - camS) * (1 - Math.exp(-dt * 5));
      const camZ = reduced ? 0 : camS;
      const camX = w < 720 ? 30 : 0;
      mouse += (mouseT - mouse) * 0.04;
      const yaw = reduced ? 0 : 0.05 * Math.sin(camZ * 0.008) + mouse;
      const cyw = Math.cos(yaw), syw = Math.sin(yaw), cp = Math.cos(PITCH), sp = Math.sin(PITCH);
      const F = Math.min(h * 0.95, w * 1.4);
      const ox = w / 2, oy = h * 0.75;
      // full strength in the hero, dimmer behind content; on phones the hero
      // copy sits over the grove, so it starts dim
      const vis = (w < 720 ? 0.55 : 1) - (w < 720 ? 0.1 : 0.45) * clamp(sY / (h * 0.9));

      // camera space
      const c = [0, 0, 0];
      const cam = (x: number, y: number, z: number) => {
        const dx = x - camX, dy = y - CAM_Y, dz = z - camZ;
        const x1 = dx * cyw - dz * syw, z1 = dx * syw + dz * cyw;
        c[0] = x1;
        c[1] = dy * cp + z1 * sp;
        c[2] = -dy * sp + z1 * cp;
      };
      // ortho elevation inside the hero slot
      const sr = slot?.getBoundingClientRect();
      const So = sr ? Math.min(sr.width, sr.height) / (2 * GROVE_FIT) : 1;
      const scx = sr ? sr.left + sr.width / 2 : ox, scy = sr ? sr.top + sr.height / 2 : oy;

      cnt.fill(0);
      const win = 0.18;
      const seg = (ax: number, ay: number, az: number, bx: number, by: number, bz: number, k: number, ortho: boolean, fixedBand = -1) => {
        cam(ax, ay, az);
        let x1 = c[0], y1 = c[1], z1 = c[2];
        cam(bx, by, bz);
        let x2 = c[0], y2 = c[1], z2 = c[2];
        let ok = true;
        if (z1 < NEAR && z2 < NEAR) ok = false;
        else if (z1 < NEAR) { const t = (NEAR - z1) / (z2 - z1); x1 += (x2 - x1) * t; y1 += (y2 - y1) * t; z1 = NEAR; }
        else if (z2 < NEAR) { const t = (NEAR - z2) / (z1 - z2); x2 += (x1 - x2) * t; y2 += (y1 - y2) * t; z2 = NEAR; }
        let sx1 = 0, sy1 = 0, sx2 = 0, sy2 = 0;
        if (ok) { sx1 = ox + (x1 / z1) * F; sy1 = oy - (y1 / z1) * F; sx2 = ox + (x2 / z2) * F; sy2 = oy - (y2 / z2) * F; }
        // depth bands; anything about to pass the camera fades out too, so
        // near linework never sprawls across the copy
        const zm = (z1 + z2) / 2;
        let band = zm < 14 ? 2 : zm < 26 ? 1 : zm < FAR * 0.3 ? 0 : zm < FAR * 0.6 ? 1 : 2;
        if (ortho) {
          const ex1 = scx + (ax - GROVE[0]) * So, ey1 = scy - (ay - GROVE_CY) * So;
          const ex2 = scx + (bx - GROVE[0]) * So, ey2 = scy - (by - GROVE_CY) * So;
          if (!ok) { sx1 = ex1; sy1 = ey1; sx2 = ex2; sy2 = ey2; }
          else { sx1 = ex1 + (sx1 - ex1) * m; sy1 = ey1 + (sy1 - ey1) * m; sx2 = ex2 + (sx2 - ex2) * m; sy2 = ey2 + (sy2 - ey2) * m; }
          if (m < 0.5) band = 0;
          ok = true;
        }
        if (fixedBand >= 0) band = fixedBand;
        if (ok) push(k * 3 + band, sx1, sy1, sx2, sy2);
      };

      // ground grid, generated around the camera
      if (m > 0.05) {
        const zs = camZ + 3, ze = camZ + FAR * 0.8;
        for (let x = -72; x <= 72; x += 6) {
          for (let q = 0; q < 4; q++) seg(x + camX, 0, zs + ((ze - zs) * q) / 4, x + camX, 0, zs + ((ze - zs) * (q + 1)) / 4, K.faint, false);
        }
        for (let z = Math.ceil(zs / 6) * 6; z < ze; z += 6) seg(camX - 72, 0, z, camX + 72, 0, z, K.faint, false);
      }

      // spinning models: rotate points about their axle (Rodrigues)
      const R3 = [0, 0, 0];
      let spn: Spin | undefined, cs = 1, sn = 0;
      const spinTo = (M: Model) => {
        spn = M.spin;
        if (spn) {
          const th = reduced ? 0.4 : el * spn.speed;
          cs = Math.cos(th);
          sn = Math.sin(th);
        }
      };
      const turn = (x: number, y: number, z: number) => {
        if (!spn) { R3[0] = x; R3[1] = y; R3[2] = z; return R3; }
        const [px, py, pz] = [x - spn.o[0], y - spn.o[1], z - spn.o[2]], [ux, uy, uz] = spn.u;
        const dot = (ux * px + uy * py + uz * pz) * (1 - cs);
        R3[0] = spn.o[0] + px * cs + (uy * pz - uz * py) * sn + ux * dot;
        R3[1] = spn.o[1] + py * cs + (uz * px - ux * pz) * sn + uy * dot;
        R3[2] = spn.o[2] + pz * cs + (ux * py - uy * px) * sn + uz * dot;
        return R3;
      };

      if (m > 0.3) {
        // sky at infinity: moves with the camera, so only turning shows
        const Sk = SKY.segs;
        for (let i = 0; i < Sk.length; i += 8) {
          seg(Sk[i] + camX, Sk[i + 1], Sk[i + 2] + camZ, Sk[i + 3] + camX, Sk[i + 4], Sk[i + 5] + camZ, Sk[i + 6], false, 1);
        }
        // the maglev train, gliding ahead of you
        if (!reduced) {
          const tz = camZ + 25 + ((el * 16) % 230);
          for (let car = 0; car < 4; car++) {
            const z0 = tz + car * 12, z1 = z0 + 11, x0 = MAGLEV_X - 1.3, x1 = MAGLEV_X + 1.3, y0 = MAGLEV_Y + 0.4, y1 = MAGLEV_Y + 3.4;
            const nose = car === 3 ? 2.5 : 0;
            for (const yy of [y0, y1]) {
              seg(x0, yy, z0, x1, yy, z0, K.accent, false);
              seg(x0, yy, z0, x0, yy, z1, K.accent, false);
              seg(x1, yy, z0, x1, yy, z1, K.accent, false);
              seg(x0, yy, z1, MAGLEV_X, yy, z1 + nose, K.accent, false);
              seg(x1, yy, z1, MAGLEV_X, yy, z1 + nose, K.accent, false);
            }
            for (const [xx, zz] of [[x0, z0], [x1, z0], [x0, z1], [x1, z1]]) seg(xx, y0, zz, xx, y1, zz, K.line, false);
            for (let wz = z0 + 1.5; wz < z1 - 1; wz += 2) seg(x0, y0 + 1.6, wz, x0, y0 + 2.6, wz, K.line, false);
          }
        }
      }

      const near: Model[] = [];
      for (let o = 0; o < objs.length; o++) {
        const M = objs[o];
        spinTo(M);
        const isGrove = o === 0;
        if (!(isGrove && m < 1) && (M.z1 < camZ - 5 || M.z0 > camZ + FAR)) continue;
        const b = isGrove ? p : reduced ? 1 : clamp((FAR - (M.z0 - camZ)) / (FAR * 0.45));
        if (b <= 0 || (!isGrove && m <= 0)) continue;
        if (M.z0 - camZ < 130) near.push(M);
        const S = M.segs;
        for (let i = 0; i < S.length; i += 8) {
          const f = clamp((b * (1 + win) - S[i + 7]) / win);
          if (f <= 0) continue;
          const ax = S[i], ay = S[i + 1], az = S[i + 2];
          const bx = ax + (S[i + 3] - ax) * f, by = ay + (S[i + 4] - ay) * f, bz = az + (S[i + 5] - az) * f;
          if (spn) {
            const [qx, qy, qz] = turn(ax, ay, az);
            turn(bx, by, bz);
            seg(qx, qy, qz, R3[0], R3[1], R3[2], S[i + 6], false);
          } else seg(ax, ay, az, bx, by, bz, S[i + 6], isGrove && m < 1);
        }
      }

      const project = (v: V3) => {
        cam(v[0], v[1], v[2]);
        if (c[2] < NEAR * 4) return null;
        return [ox + (c[0] / c[2]) * F, oy - (c[1] / c[2]) * F, c[2]] as const;
      };

      const paint = (tone: typeof INK, ground: string | null) => {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        if (ground) {
          ctx.fillStyle = ground;
          ctx.fillRect(0, 0, w, h);
        }
        ctx.lineCap = "round";
        for (let k = 3; k >= 0; k--) {
          ctx.setLineDash(k === K.hidden ? [3, 4] : []);
          ctx.lineWidth = WIDTH[k];
          for (let band = 2; band >= 0; band--) {
            const bi = k * 3 + band, n = cnt[bi];
            if (!n) continue;
            ctx.strokeStyle = `rgba(${tone.rgb[k]},${tone.a[k] * DEPTH_A[band] * vis})`;
            ctx.beginPath();
            const B = buf[bi];
            for (let j = 0; j < n; j += 4) {
              ctx.moveTo(B[j], B[j + 1]);
              ctx.lineTo(B[j + 2], B[j + 3]);
            }
            ctx.stroke();
          }
        }
        ctx.setLineDash([]);

        // canopy lights and pulses climbing the vines
        const lit = clamp((p - 0.85) / 0.15);
        const hot = ground ? "220,230,255" : "47,107,255";
        for (const M of near) {
          spinTo(M);
          for (let i = 0; i < M.nodes.length; i++) {
            const nv = M.nodes[i];
            const s = project(spn ? (turn(nv[0], nv[1], nv[2]).slice() as V3) : nv);
            if (!s) continue;
            const tw = reduced ? 0.8 : 0.55 + 0.45 * Math.sin(el * 2.2 + i * 1.7);
            ctx.fillStyle = `rgba(${tone.rgb[1]},${lit * tw * vis})`;
            ctx.fillRect(s[0] - 1, s[1] - 1, 2, 2);
          }
          if (reduced) continue;
          for (let v = 0; v < M.vines.length; v++) {
            const path = M.vines[v];
            for (let q = 0; q < 2; q++) {
              const u = (el * (0.16 + burst * 0.6) + v * 0.37 + q * 0.5) % 1;
              const fi = u * (path.length - 1), i0 = Math.floor(fi), fr = fi - i0;
              const A = path[i0], Bp = path[Math.min(path.length - 1, i0 + 1)];
              const s = project([A[0] + (Bp[0] - A[0]) * fr, A[1] + (Bp[1] - A[1]) * fr, A[2] + (Bp[2] - A[2]) * fr]);
              if (!s) continue;
              const fade = lit * Math.sin(u * Math.PI) * Math.min(1, vis + burst);
              ctx.fillStyle = `rgba(${hot},${0.4 * fade})`;
              ctx.fillRect(s[0] - 3.5, s[1] - 3.5, 7, 7);
              ctx.fillStyle = `rgba(242,244,248,${fade})`;
              ctx.fillRect(s[0] - 1.5, s[1] - 1.5, 3, 3);
            }
          }
        }

        // drones drifting over the garden, blinking
        if (!reduced) {
          for (let i = 0; i < 7; i++) {
            const s = project([camX + 36 * Math.sin(el * 0.21 + i * 1.9), 30 + 8 * Math.sin(el * 0.37 + i * 2.3), camZ + 24 + ((i * 53 + el * 5) % 150)]);
            if (!s) continue;
            const a = clamp((160 - s[2]) / 60) * Math.max(vis, 0.6) * m;
            const k = clamp(50 / s[2], 0.5, 2.2) * 3;
            ctx.strokeStyle = `rgba(${tone.rgb[0]},${0.8 * a})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(s[0] - k, s[1] - k * 0.5); ctx.lineTo(s[0] + k, s[1] + k * 0.5);
            ctx.moveTo(s[0] - k, s[1] + k * 0.5); ctx.lineTo(s[0] + k, s[1] - k * 0.5);
            ctx.stroke();
            ctx.strokeRect(s[0] - k - 1.5, s[1] - 1.5, 3, 3);
            ctx.strokeRect(s[0] + k - 1.5, s[1] - 1.5, 3, 3);
            if (Math.sin(el * 5 + i * 2.1) > 0.55) {
              ctx.fillStyle = `rgba(${hot},${a})`;
              ctx.fillRect(s[0] - 1.5, s[1] - 1.5, 3, 3);
            }
          }
        }

        // annotations: the hero grove's while in the hero, landmarks' as they near
        if (w < 420) return;
        ctx.font = font;
        ctx.textBaseline = "middle";
        ctx.lineWidth = 0.75;
        const heroA = lit * clamp(1 - sY / (h * 0.6));
        for (let o = 0; o < near.length; o++) {
          const M = near[o];
          const isGrove = M === objs[0];
          const toScreen = (v: V3) => {
            const s = project(v);
            if (isGrove && m < 1) {
              const ex = scx + (v[0] - GROVE[0]) * So, ey = scy - (v[1] - GROVE_CY) * So;
              return s ? [ex + (s[0] - ex) * m, ey + (s[1] - ey) * m, s[2]] : [ex, ey, 50];
            }
            return s ? [s[0], s[1], s[2]] : null;
          };
          for (const L of M.labels) {
            const s = toScreen(L.at);
            if (!s) continue;
            const a = isGrove ? heroA : clamp((75 - s[2]) / 25) * clamp((s[2] - 14) / 10) * Math.max(vis, 0.8);
            if (a <= 0.01) continue;
            const txt = L.text.toUpperCase();
            const tw = ctx.measureText(txt).width;
            let side = L.side;
            if (side > 0 && s[0] + 52 + tw > w) side = -1;
            if (side < 0 && s[0] - 52 - tw < 0) side = 1;
            const ink = `rgba(${tone.rgb[1]},${a})`;
            ctx.fillStyle = `rgba(${hot},${a})`;
            ctx.fillRect(s[0] - 2, s[1] - 2, 4, 4);
            ctx.strokeStyle = ink;
            ctx.beginPath();
            ctx.moveTo(s[0], s[1]); ctx.lineTo(s[0] + side * 16, s[1] - 16); ctx.lineTo(s[0] + side * 44, s[1] - 16);
            ctx.stroke();
            // knock the label out of the linework behind it
            const lx = side > 0 ? s[0] + 47 : s[0] - 49 - tw;
            ctx.fillStyle = ground ? "rgba(18,58,140,.85)" : "rgba(5,7,11,.8)";
            ctx.fillRect(lx - 3, s[1] - 24, tw + 8, 15);
            ctx.fillStyle = ink;
            ctx.textAlign = "left";
            ctx.fillText(txt, lx + 1, s[1] - 16);
          }
          for (const D of M.dims) {
            const A = toScreen(D.a), B = toScreen(D.b);
            if (!A || !B) continue;
            const a = isGrove ? heroA : clamp((130 - Math.min(A[2], B[2])) / 50) * Math.max(vis, 0.8);
            if (a <= 0.01) continue;
            ctx.strokeStyle = ctx.fillStyle = `rgba(${tone.rgb[1]},${a})`;
            const dx = B[0] - A[0], dy = B[1] - A[1], len = Math.hypot(dx, dy) || 1;
            const ux = dx / len, uy = dy / len, tw = ctx.measureText(D.text).width + 12;
            const mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2;
            ctx.beginPath();
            ctx.moveTo(A[0], A[1]); ctx.lineTo(mx - (ux * tw) / 2, my - (uy * tw) / 2);
            ctx.moveTo(mx + (ux * tw) / 2, my + (uy * tw) / 2); ctx.lineTo(B[0], B[1]);
            for (const E of [A, B]) { ctx.moveTo(E[0] - uy * 5, E[1] + ux * 5); ctx.lineTo(E[0] + uy * 5, E[1] - ux * 5); }
            ctx.stroke();
            ctx.save();
            ctx.translate(mx, my);
            let ang = Math.atan2(dy, dx);
            if (ang > Math.PI / 2) ang -= Math.PI;
            if (ang < -Math.PI / 2) ang += Math.PI;
            ctx.rotate(ang);
            ctx.textAlign = "center";
            ctx.fillText(D.text, 0, 0);
            ctx.restore();
          }
        }
      };

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      paint(INK, null);
      // cyanotype sheets: blueprint ground + the same world in paper
      for (const el of cyanEls) {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > h) continue;
        ctx.save();
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.beginPath();
        ctx.rect(r.left, r.top, r.width, r.height);
        ctx.clip();
        paint(CYAN, "#123A8C");
        ctx.restore();
      }
      // quiet zones: a soft patch of the ground colour behind every text block
      // on screen, so lines fade where you read. One blurred fill per ground.
      const dark = new Path2D(), blue = new Path2D();
      let nd = 0, nb = 0;
      const cy = cyanEls.map((el) => el.getBoundingClientRect());
      for (const el of quiet) {
        const q = el.getBoundingClientRect();
        if (q.bottom < 0 || q.top > h || !q.width) continue;
        const mid = (q.top + q.bottom) / 2;
        const onBlue = cy.some((c) => mid > c.top && mid < c.bottom);
        (onBlue ? blue : dark).rect(q.left - 14, q.top - 8, q.width + 28, q.height + 16);
        if (onBlue) nb++; else nd++;
      }
      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.shadowBlur = 26;
      for (const [path, n, rgb] of [[dark, nd, "5,7,11"], [blue, nb, "18,58,140"]] as const) {
        if (!n) continue;
        ctx.shadowColor = `rgba(${rgb},.9)`;
        ctx.fillStyle = `rgba(${rgb},.8)`;
        ctx.fill(path);
      }
      ctx.restore();
      hud(camZ, yaw);
    }

    /* Explorer readout, bottom left: how far in, heading, which sector. */
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main section[id]"));
    // shows while you scroll, fades a moment after you stop
    let movedAt = -1e9;
    const onScrollHud = () => (movedAt = performance.now());
    window.addEventListener("scroll", onScrollHud, { passive: true });
    function hud(camZ: number, yaw: number) {
      const a = clamp(1 - (performance.now() - movedAt - 900) / 500);
      if (!ctx || w < 720 || a <= 0) return;
      ctx.globalAlpha = a;
      const mid = h / 2;
      const cur = sections.find((s) => {
        const r = s.getBoundingClientRect();
        return r.top <= mid && r.bottom > mid;
      });
      // past the last section (the footer) you've reached the end of the walk
      const end = !cur && window.scrollY > h;
      const idx = cur ? sections.indexOf(cur) : end ? sections.length : 0;
      const hdg = ((((yaw * 180) / Math.PI) % 360) + 360) % 360;
      const txt = `Z ${camZ.toFixed(1).padStart(6, "0")} M · HDG ${hdg.toFixed(0).padStart(3, "0")}° · SECTOR ${String(idx).padStart(2, "0")} ${(cur?.id ?? (end ? "end" : "hero")).toUpperCase()}`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = font;
      ctx.textBaseline = "alphabetic";
      ctx.textAlign = "left";
      const tw = ctx.measureText(txt).width;
      ctx.fillStyle = "rgba(5,7,11,.72)";
      ctx.fillRect(14, h - 34, tw + 20, 20);
      ctx.strokeStyle = "rgba(141,176,255,.28)";
      ctx.lineWidth = 1;
      ctx.strokeRect(14.5, h - 33.5, tw + 19, 19);
      ctx.fillStyle = "rgba(141,176,255,.85)";
      ctx.fillText(txt, 24, h - 20);
      ctx.globalAlpha = 1;
    }

    const loop = (now: number) => {
      frame(now);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!raf && !document.hidden) raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    resize();
    // reduced motion: no loop, just redraw when the page moves
    const redraw = () => requestAnimationFrame(frame);
    if (reduced) {
      redraw();
      window.addEventListener("scroll", redraw, { passive: true });
    } else start();

    let rt = 0;
    const onResize = () => {
      clearTimeout(rt);
      rt = window.setTimeout(() => {
        resize();
        if (reduced) redraw();
      }, 150);
    };
    window.addEventListener("resize", onResize);
    // sections change height as images and the gallery load; re-lay the garden
    let lastH = document.documentElement.scrollHeight;
    const ro = new ResizeObserver(() => {
      const nh = document.documentElement.scrollHeight;
      if (Math.abs(nh - lastH) > 40) {
        lastH = nh;
        rebuild();
      }
    });
    ro.observe(document.body);
    const onVis = () => (document.hidden ? stop() : reduced ? redraw() : start());
    document.addEventListener("visibilitychange", onVis);
    const onMove = (e: PointerEvent) => (mouseT = (e.clientX / window.innerWidth - 0.5) * 0.12);
    window.addEventListener("pointermove", onMove, { passive: true });
    const onBeat = () => (burst = 1);
    window.addEventListener(BEAT, onBeat);
    document.fonts?.ready.then(() => reduced && redraw());

    return () => {
      stop();
      clearTimeout(rt);
      ro.disconnect();
      html.classList.remove("has-world");
      window.removeEventListener("scroll", redraw);
      window.removeEventListener("scroll", onScrollHud);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener(BEAT, onBeat);
    };
  }, []);

  return <canvas ref={ref} className="world" aria-hidden="true" />;
}
