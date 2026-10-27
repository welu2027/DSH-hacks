"use client";

import { useEffect, useRef } from "react";
import { townY, VB_H } from "./ridges";

/* Ideas in the sky, people in the valley. A drifting field of dots with
   faint links between neighbours; the pointer pushes them aside. As you
   scroll down, a quarter of them sink onto the town ridge and warm into
   lamp light. Writes scroll progress to the hero as --p (the sky fades with
   it). One rAF loop, paused off screen and in background tabs. Reduced
   motion: a single frame with the lights already landed. */
type Dot = { x: number; y: number; vx: number; vy: number; bx: number; by: number; r: number; a: number; lamp: boolean; d: number; tx: number; ty: number; px: number; py: number; k: number };

const LINK = 110;
const PUSH = 130;
const clamp = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => t * t * (3 - 2 * t);

export default function ParticleField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const hero = canvas.parentElement!;
    const town = hero.querySelector<SVGElement>(".ridge.town");
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const css = getComputedStyle(document.documentElement);
    const rgb = (v: string) => {
      const h = css.getPropertyValue(v).trim().slice(1);
      return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
    };
    const SKY = [rgb("--blue-300"), rgb("--blue-600")];
    const LAMP = rgb("--lamp");
    const mix = (a: number[], b: number[], k: number) => a.map((v, i) => Math.round(v + (b[i] - v) * k)).join(",");

    let W = 0, H = 0, dots: Dot[] = [], frame = 0, visible = true;
    const mouse = { x: -1e4, y: -1e4 };

    const setup = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = hero.clientWidth;
      H = hero.clientHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const hr = hero.getBoundingClientRect();
      const tr = town?.getBoundingClientRect();
      const top = tr ? tr.top - hr.top : H * 0.56;
      const th = tr ? tr.height : H * 0.44;
      const n = Math.round(Math.min(180, Math.max(60, (W * H) / 7500)));
      dots = Array.from({ length: n }, (_, i) => {
        const t = Math.random();
        const vx = (Math.random() - 0.5) * 0.3, vy = (Math.random() - 0.5) * 0.2;
        return {
          x: Math.random() * W, y: Math.random() * H * 0.7, vx, vy, bx: vx, by: vy,
          r: 0.8 + Math.random() * 1.4, a: 0.25 + Math.random() * 0.5,
          lamp: i < n * 0.25, d: Math.random() * 0.4,
          // lights sit just under the crest, above the valley mist
          tx: t * W, ty: top + (townY(t) / VB_H) * th + (0.03 + Math.random() * 0.14) * th,
          px: 0, py: 0, k: 0,
        };
      });
      draw();
    };

    const draw = () => {
      const p = reduce ? 1 : clamp(window.scrollY / (H * 0.6));
      hero.style.setProperty("--p", p.toFixed(3));
      ctx.clearRect(0, 0, W, H);
      for (const o of dots) {
        if (!reduce) {
          const dx = o.x - mouse.x, dy = o.y - mouse.y, dist = Math.hypot(dx, dy);
          if (dist < PUSH && dist > 0.1) {
            const f = (1 - dist / PUSH) * 0.5;
            o.vx += (dx / dist) * f;
            o.vy += (dy / dist) * f;
          }
          o.vx += (o.bx - o.vx) * 0.04;
          o.vy += (o.by - o.vy) * 0.04;
          o.x += o.vx;
          o.y += o.vy;
          if (o.x < -10) o.x = W + 10; else if (o.x > W + 10) o.x = -10;
          if (o.y < -10) o.y = H * 0.7; else if (o.y > H * 0.7) o.y = -10;
        }
        o.k = o.lamp ? ease(clamp((p - o.d) / 0.6)) : 0;
        o.px = o.x + (o.tx - o.x) * o.k;
        o.py = o.y + (o.ty - o.y) * o.k;
      }
      ctx.lineWidth = 1;
      for (let i = 0; i < dots.length; i++) {
        const a = dots[i];
        if (a.k > 0.2) continue;
        for (let j = i + 1; j < dots.length; j++) {
          const b = dots[j];
          if (b.k > 0.2) continue;
          const dx = a.px - b.px, dy = a.py - b.py, d2 = dx * dx + dy * dy;
          if (d2 > LINK * LINK) continue;
          ctx.strokeStyle = `rgba(${SKY[0].join(",")},${(1 - Math.sqrt(d2) / LINK) * 0.35})`;
          ctx.beginPath();
          ctx.moveTo(a.px, a.py);
          ctx.lineTo(b.px, b.py);
          ctx.stroke();
        }
      }
      dots.forEach((o, i) => {
        const c = mix(SKY[i % 2], LAMP, o.k);
        if (o.k > 0.4) {
          ctx.fillStyle = `rgba(${c},${0.22 * o.k})`;
          ctx.beginPath();
          ctx.arc(o.px, o.py, o.r * 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = `rgba(${c},${o.a + (1 - o.a) * o.k})`;
        ctx.beginPath();
        ctx.arc(o.px, o.py, o.r + o.k * 0.6, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const loop = () => {
      draw();
      frame = requestAnimationFrame(loop);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (!reduce && visible && !document.hidden) frame = requestAnimationFrame(loop);
    };

    setup();
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      sync();
    });
    io.observe(canvas);
    let t = 0;
    const ro = new ResizeObserver(() => {
      clearTimeout(t);
      t = window.setTimeout(setup, 150);
    });
    ro.observe(hero);
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => { mouse.x = mouse.y = -1e4; };
    if (fine && !reduce) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", onLeave);
    }
    document.addEventListener("visibilitychange", sync);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(t);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return <canvas ref={ref} className="particles" aria-hidden="true" />;
}
