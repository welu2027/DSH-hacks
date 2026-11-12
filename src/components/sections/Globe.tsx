"use client";

import { useEffect, useRef, useState } from "react";
import { REACH } from "./reach";

/* A turning sphere of round flag badges, one per country in reach.ts, laid
   out evenly (Fibonacci sphere) over a dotted wireframe. Every few seconds the
   front-most flag is spotlit with its name. Drag to spin. Paused off screen;
   reduced motion: still (no spin, no spotlight cycle), but still draggable. */
const N = REACH.length;
const GOLDEN = Math.PI * (3 - Math.sqrt(5));
const POINTS = REACH.map((_, i) => {
  const y = 1 - (2 * (i + 0.5)) / N;
  const r = Math.sqrt(1 - y * y);
  return [Math.cos(GOLDEN * i) * r, y, Math.sin(GOLDEN * i) * r] as const;
});
const TILT = -0.32;

/* rotate a unit vector by yaw (around y) then the fixed tilt (around x) */
const rotate = ([x, y, z]: readonly [number, number, number], yaw: number) => {
  const cy = Math.cos(yaw), sy = Math.sin(yaw), ct = Math.cos(TILT), st = Math.sin(TILT);
  const x1 = x * cy + z * sy, z1 = -x * sy + z * cy;
  return [x1, y * ct - z1 * st, y * st + z1 * ct] as const;
};

export default function Globe() {
  const box = useRef<HTMLDivElement>(null);
  const wire = useRef<HTMLCanvasElement>(null);
  const flags = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState(0);

  useEffect(() => {
    const el = box.current!, canvas = wire.current!, ctx = canvas.getContext("2d")!;
    const items = [...flags.current!.children] as HTMLElement[];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ink = getComputedStyle(el).getPropertyValue("--blue-600").trim() || "#2F5FD0";
    let yaw = 0.4, vel = reduce ? 0 : 0.0022, drag: number | null = null, lastX = 0, size = 0, raf = 0, on = true;
    let since = 0;

    const resize = () => {
      size = el.offsetWidth;
      canvas.width = canvas.height = size * 2;
    };

    const spotlight = () => {
      // the flag nearest the front centre
      let best = 0, bz = -2;
      POINTS.forEach((p, i) => { const [x, y, z] = rotate(p, yaw); const s = z - 0.6 * Math.hypot(x, y); if (s > bz) { bz = s; best = i; } });
      setLit(best);
    };

    const frame = (t: number) => {
      if (drag === null) yaw += vel;
      const R = size * 0.4, c = size / 2;

      // wireframe: dotted latitude and longitude rings, back half faint
      ctx.setTransform(2, 0, 0, 2, 0, 0);
      ctx.clearRect(0, 0, size, size);
      ctx.fillStyle = ink;
      const dot = (p: readonly [number, number, number]) => {
        const [x, y, z] = rotate(p, yaw);
        ctx.globalAlpha = z > 0 ? 0.5 : 0.12;
        ctx.fillRect(c + x * R - 0.75, c - y * R - 0.75, 1.5, 1.5);
      };
      for (const lat of [-0.66, -0.33, 0, 0.33, 0.66]) {
        const r = Math.sqrt(1 - lat * lat);
        for (let a = 0; a < 6.283; a += 0.07) dot([Math.cos(a) * r, lat, Math.sin(a) * r]);
      }
      for (let m = 0; m < 6; m++) {
        const lo = (m * Math.PI) / 6;
        for (let a = 0; a < 6.283; a += 0.07) dot([Math.cos(a) * Math.cos(lo), Math.sin(a), Math.cos(a) * Math.sin(lo)]);
      }
      ctx.globalAlpha = 1;

      // flags: front ones big and solid, back ones small and faint
      POINTS.forEach((p, i) => {
        const [x, y, z] = rotate(p, yaw);
        const s = items[i].style;
        const k = (z + 1) / 2;
        s.transform = `translate(-50%, -50%) translate(${(c + x * R).toFixed(1)}px, ${(c - y * R).toFixed(1)}px) scale(${(0.45 + 0.55 * k).toFixed(3)})`;
        const o = z > 0 ? "1" : (0.15 + 0.6 * k).toFixed(2), zi = String(Math.round(k * 20));
        if (s.opacity !== o) s.opacity = o;
        if (s.zIndex !== zi) s.zIndex = zi;
      });

      if (!reduce && t - since > 2600) { since = t; spotlight(); }
      raf = on ? requestAnimationFrame(frame) : 0;
    };

    resize();
    spotlight();
    const ro = new ResizeObserver(resize);
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => {
      on = e.isIntersecting;
      if (on && !raf) raf = requestAnimationFrame(frame);
    });
    io.observe(el);

    const down = (e: PointerEvent) => { drag = e.clientX; lastX = e.clientX; el.setPointerCapture(e.pointerId); };
    const move = (e: PointerEvent) => {
      if (drag === null) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      yaw += dx / (size * 0.4);
      if (!reduce) vel = Math.max(-0.03, Math.min(0.03, dx / (size * 0.4)));
    };
    const up = () => { drag = null; if (!reduce) setTimeout(() => { vel = Math.sign(vel || 1) * 0.0022; }, 900); };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => {
      cancelAnimationFrame(raf);
      on = false;
      ro.disconnect();
      io.disconnect();
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, []);

  return (
    <div ref={box} className="globe" aria-hidden="true">
      <canvas ref={wire} />
      <div ref={flags} className="globe-flags">
        {REACH.map((p, i) => (
          <span key={p.code} className={i === lit ? "flag lit" : "flag"}>
            <img src={`/flags/${p.code}.png`} alt="" draggable={false} loading="lazy" decoding="async" width={44} height={44} />
            {i === lit && <b>{p.country}</b>}
          </span>
        ))}
      </div>
    </div>
  );
}
