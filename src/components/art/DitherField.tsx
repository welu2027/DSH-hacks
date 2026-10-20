"use client";

import { useEffect, useRef } from "react";
import { ditherLum, type RGB } from "@/components/plates/dither";

/* A 1-bit "scan" field: soft blobs Atkinson-dithered into brand-blue dots on
   a transparent ground, drifting slowly like a live imaging read-out. Draws
   at low resolution (pixelated by CSS), only while on screen, ~9 fps.
   Reduced motion: one still frame. */
const INK: RGB = [36, 64, 248];

export default function DitherField({ className, seed = 1, w = 160, h = 110 }: { className: string; seed?: number; w?: number; h?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const img = ctx.createImageData(w, h);
    const L = new Float32Array(w * h);
    // three blobs on slow Lissajous paths, phase set by the seed
    const blobs = [0, 1, 2].map((i) => ({ p: seed * 1.7 + i * 2.1, r: 0.32 - i * 0.06, v: 0.95 - i * 0.2 }));

    const draw = (t: number) => {
      const k = t / 9000;
      const pos = blobs.map((b, i) => ({
        x: 0.5 + 0.22 * Math.sin(k * (1 + i * 0.3) + b.p),
        y: 0.5 + 0.2 * Math.cos(k * (0.8 + i * 0.25) + b.p * 1.3),
        r: b.r, v: b.v,
      }));
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const u = x / w, q = y / h;
          let v = 0;
          for (const b of pos) {
            const d = Math.hypot((u - b.x) * (w / h), q - b.y) / b.r;
            v += b.v * Math.max(0, 1 - d * d);
          }
          // a faint horizontal scan line sweeping down
          const scan = Math.max(0, 1 - Math.abs(q - ((k * 0.9) % 1.2 - 0.1)) * 30) * 0.35;
          L[y * w + x] = Math.min(255, (v + scan) * 255);
        }
      }
      ditherLum(L, w, h, img.data, null, INK);
      ctx.putImageData(img, 0, 0);
    };

    if (still) {
      draw(0);
      return;
    }
    let raf = 0, last = 0, on = false;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (t - last < 110) return;
      last = t;
      draw(t);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !on) { on = true; raf = requestAnimationFrame(loop); }
      if (!e.isIntersecting && on) { on = false; cancelAnimationFrame(raf); }
    });
    io.observe(c);
    draw(0);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [seed, w, h]);

  return <canvas ref={ref} className={`dfield ${className}`} width={w} height={h} aria-hidden="true" />;
}
