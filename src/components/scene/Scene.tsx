"use client";

import { useEffect, useRef } from "react";
import { podium, sapling, type Model, type V3 } from "./geometry";

/* A small standalone blueprint drawing: the Prizes podium and the empty
   plate's sapling. Draws itself bottom-up as a flat elevation when it scrolls
   into view; with morph set it then swings into perspective and turns. Plain canvas
   2D, stroked in 12 batches (4 line kinds × 3 depth bands). Runs only while
   on screen. The page-wide garden is World.tsx. */
type Kind = "sapling" | "podium";
type Cfg = {
  make: (detail: number) => Model;
  fit: number; // world radius that fills the shorter side
  cy: number; // world y at the centre of the canvas
  morph: boolean; // swing into 3D after drawing
  yaw0: number;
  pitch: number;
  spin: number; // rad/s once in 3D
  build: number; // seconds to draw
  interactive?: boolean; // pointer + scroll steer it (hero)
};

const CFG: Record<Kind, Cfg> = {
  sapling: { make: () => sapling(), fit: 8.5, cy: 5.2, morph: false, yaw0: 0, pitch: 0, spin: 0, build: 2 },
  podium: { make: () => podium(), fit: 12.5, cy: 7, morph: true, yaw0: -0.45, pitch: 0.3, spin: 0.22, build: 2.4 },
};

/* rgb per tone: [line, accent, hidden, faint, hot] */
const TONES = {
  ink: { rgb: ["242,244,248", "141,176,255", "141,176,255", "141,176,255", "47,107,255"], a: [0.5, 0.9, 0.55, 0.16] },
  cyan: { rgb: ["242,244,248", "242,244,248", "242,244,248", "242,244,248", "220,230,255"], a: [0.62, 1, 0.55, 0.2] },
};
const WIDTH = [1, 1.25, 1, 1];
const DEPTH_A = [1, 0.66, 0.36];

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export default function Scene({ kind, tone = "ink", label, labels = true }: { kind: Kind; tone?: "ink" | "cyan"; label: string; labels?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const cfg = CFG[kind];
    const T = TONES[tone];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const model = cfg.make(cv.clientWidth < 480 ? 0.6 : 1);
    const segs = model.segs;
    const n = segs.length / 8;
    // one coordinate buffer per (kind, depth band)
    const buf = Array.from({ length: 12 }, () => new Float32Array(n * 4));
    const cnt = new Int32Array(12);
    const font = `11px ${getComputedStyle(document.documentElement).getPropertyValue("--font-departure") || "monospace"}`;

    let w = 0, h = 0, dpr = 1;
    let t0 = -1, raf = 0, visible = false;
    let mouse = 0, mouseT = 0;

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = cv.clientWidth;
      h = cv.clientHeight;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      if (reduced) draw(performance.now());
    };

    function draw(now: number) {
      if (!w || !h || !ctx) return;
      if (t0 < 0) t0 = now;
      const el = reduced ? 99 : (now - t0) / 1000;
      const p = easeOut(clamp(el / cfg.build));
      const m = cfg.morph ? easeInOut(clamp((el - cfg.build * 0.85) / 1.8)) : 0;

      let tilt = 0, zoom = 1;
      if (cfg.interactive && !reduced) {
        mouse += (mouseT - mouse) * 0.05;
        const s = clamp(window.scrollY / Math.max(1, h * 1.4));
        tilt = s * 0.3;
        zoom = 1 + s * 0.12;
      }
      const yaw = m * (cfg.yaw0 + (reduced ? 0 : (el - cfg.build) * cfg.spin) + mouse);
      const pitch = m * (cfg.pitch + tilt);
      const cy_ = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      const D = cfg.fit * 3.2;
      const S = (Math.min(w, h) / (2 * cfg.fit)) * zoom * (1 - 0.08 * m);
      const ox = w / 2, oy = h / 2;
      const third = cfg.fit / 3;

      // world → screen; returns depth too
      const out = [0, 0, 0];
      const proj = (x: number, y: number, z: number) => {
        const x1 = x * cy_ - z * sy;
        const z1 = x * sy + z * cy_;
        const yy = y - cfg.cy;
        const y2 = yy * cp + z1 * sp;
        const z2 = -yy * sp + z1 * cp;
        const f = 1 + m * (D / (D + z2) - 1);
        out[0] = ox + x1 * f * S;
        out[1] = oy - y2 * f * S;
        out[2] = z2;
        return out;
      };

      cnt.fill(0);
      const win = 0.18;
      for (let i = 0; i < n; i++) {
        const o = i * 8;
        const f = clamp((p * (1 + win) - segs[o + 7]) / win);
        if (f <= 0) continue;
        const k = segs[o + 6];
        const ax = segs[o], ay = segs[o + 1], az = segs[o + 2];
        const bx = ax + (segs[o + 3] - ax) * f, by = ay + (segs[o + 4] - ay) * f, bz = az + (segs[o + 5] - az) * f;
        proj(ax, ay, az);
        const x1 = out[0], y1 = out[1], z1 = out[2];
        proj(bx, by, bz);
        const z = (z1 + out[2]) / 2;
        const band = z < -third ? 0 : z < third ? 1 : 2;
        const bi = k * 3 + band;
        const B = buf[bi], c = cnt[bi];
        B[c] = x1; B[c + 1] = y1; B[c + 2] = out[0]; B[c + 3] = out[1];
        cnt[bi] = c + 4;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "round";
      for (let k = 3; k >= 0; k--) {
        ctx.setLineDash(k === 2 ? [3, 4] : []);
        ctx.lineWidth = WIDTH[k];
        for (let band = 2; band >= 0; band--) {
          const bi = k * 3 + band, c = cnt[bi];
          if (!c) continue;
          const a = T.a[k] * (1 + (DEPTH_A[band] - 1) * m);
          ctx.strokeStyle = `rgba(${T.rgb[k]},${a})`;
          ctx.beginPath();
          const B = buf[bi];
          for (let j = 0; j < c; j += 4) {
            ctx.moveTo(B[j], B[j + 1]);
            ctx.lineTo(B[j + 2], B[j + 3]);
          }
          ctx.stroke();
        }
      }
      ctx.setLineDash([]);

      const lit = clamp((p - 0.85) / 0.15);
      if (lit > 0) {
        const hot = T.rgb[4];
        // canopy lights, twinkling
        for (let i = 0; i < model.nodes.length; i++) {
          const [x, y, z] = model.nodes[i];
          proj(x, y, z);
          const tw = reduced ? 0.8 : 0.55 + 0.45 * Math.sin(el * 2.2 + i * 1.7);
          ctx.fillStyle = `rgba(${T.rgb[1]},${lit * tw * (out[2] > third ? 0.5 : 1)})`;
          ctx.fillRect(out[0] - 1, out[1] - 1, 2, 2);
        }
        // pulses climbing the vines: data rising to the canopy
        if (!reduced) {
          for (let v = 0; v < model.vines.length; v++) {
            const path = model.vines[v];
            for (let q = 0; q < 2; q++) {
              const u = (el * 0.16 + v * 0.37 + q * 0.5) % 1;
              const fi = u * (path.length - 1), i0 = Math.floor(fi), fr = fi - i0;
              const A = path[i0], Bp = path[Math.min(path.length - 1, i0 + 1)];
              proj(A[0] + (Bp[0] - A[0]) * fr, A[1] + (Bp[1] - A[1]) * fr, A[2] + (Bp[2] - A[2]) * fr);
              const fade = lit * Math.sin(u * Math.PI);
              ctx.fillStyle = `rgba(${hot},${0.35 * fade})`;
              ctx.fillRect(out[0] - 3.5, out[1] - 3.5, 7, 7);
              ctx.fillStyle = `rgba(242,244,248,${fade})`;
              ctx.fillRect(out[0] - 1.5, out[1] - 1.5, 3, 3);
            }
          }
        }

        ctx.font = font;
        ctx.textBaseline = "middle";
        const ink = `rgba(${T.rgb[1]},${lit})`;
        ctx.strokeStyle = ink;
        ctx.fillStyle = ink;
        ctx.lineWidth = 0.75;
        // dimension lines with tick ends, label in a gap
        for (const d of model.dims) {
          const a = proj(...d.a).slice(), b = proj(...d.b).slice();
          const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1;
          const ux = dx / len, uy = dy / len, tw = ctx.measureText(d.text).width + 12;
          const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
          ctx.beginPath();
          ctx.moveTo(a[0], a[1]); ctx.lineTo(mx - (ux * tw) / 2, my - (uy * tw) / 2);
          ctx.moveTo(mx + (ux * tw) / 2, my + (uy * tw) / 2); ctx.lineTo(b[0], b[1]);
          for (const e of [a, b]) { ctx.moveTo(e[0] - uy * 5, e[1] + ux * 5); ctx.lineTo(e[0] + uy * 5, e[1] - ux * 5); }
          ctx.stroke();
          ctx.save();
          ctx.translate(mx, my);
          let ang = Math.atan2(dy, dx);
          if (ang > Math.PI / 2) ang -= Math.PI;
          if (ang < -Math.PI / 2) ang += Math.PI;
          ctx.rotate(ang);
          ctx.textAlign = "center";
          ctx.fillText(d.text, 0, 0);
          ctx.restore();
        }
        // callouts: dot, 45° leader, shelf, label
        if (labels && w >= 420) {
          for (const L of model.labels) {
            proj(...(L.at as V3));
            const x = out[0], y = out[1];
            const tw = ctx.measureText(L.text.toUpperCase()).width;
            let s = L.side;
            if (s > 0 && x + 52 + tw > w) s = -1;
            if (s < 0 && x - 52 - tw < 0) s = 1;
            ctx.fillStyle = `rgba(${T.rgb[4]},${lit})`;
            ctx.fillRect(x - 2, y - 2, 4, 4);
            ctx.beginPath();
            ctx.moveTo(x, y); ctx.lineTo(x + s * 16, y - 16); ctx.lineTo(x + s * 44, y - 16);
            ctx.stroke();
            ctx.fillStyle = ink;
            ctx.textAlign = s > 0 ? "left" : "right";
            ctx.fillText(L.text.toUpperCase(), x + s * 48, y - 16);
          }
        }
      }
    }

    const loop = (now: number) => {
      draw(now);
      raf = visible ? requestAnimationFrame(loop) : 0;
    };
    const start = () => {
      if (reduced || raf || !visible || document.hidden) return;
      raf = requestAnimationFrame(loop);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(cv);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) {
        if (reduced) draw(performance.now());
        start();
      }
    }, { rootMargin: "100px" });
    io.observe(cv);
    const onVis = () => (document.hidden ? (cancelAnimationFrame(raf), (raf = 0)) : start());
    document.addEventListener("visibilitychange", onVis);
    const onMove = (e: PointerEvent) => (mouseT = (e.clientX / window.innerWidth - 0.5) * 0.6);
    if (cfg.interactive) window.addEventListener("pointermove", onMove, { passive: true });
    // labels need the pixel font before they're drawn
    document.fonts?.ready.then(() => reduced && draw(performance.now()));

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onMove);
    };
  }, [kind, tone, labels]);

  return <canvas ref={ref} className={`scene scene-${kind}`} role="img" aria-label={label} />;
}
