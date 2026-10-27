"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef } from "react";
import terrain from "./terrain.json";

/* The world behind the whole page: one descent from the summit to the
   valley floor. A fixed sky and four rendered terrain layers (scripts/
   terrain.py) sit behind every section. Scroll progress g (0 at the top,
   1 at the bottom) drives all of it:
   - the ground rises toward you, near layers faster than far ones;
   - day fades to dusk (--dusk);
   - drifting "ideas" in the sky settle on the town foothills as lights,
     a few at a time, and the ones left over turn to stars.
   One rAF loop, paused in background tabs. Reduced motion: no drift and no
   parallax; lights are already landed. */

const LAYERS = [0, 1, 2, 3];
const SPAN = 1.5;                       // landscape width ≥ SPAN × vh …
const WIDEN = 1.3;                      // … and ≥ WIDEN × vw, so it can slide sideways
const OFFSET = 0.06;                    // layers start this far (× vh) below their rest
const RISE = [0.08, 0.16, 0.26, 0.36];   // how far (× vh) each layer climbs by g = 1
const LINK = 110;
const PUSH = 130;
const clamp = (v: number) => Math.min(1, Math.max(0, v));
const ease = (t: number) => t * t * (3 - 2 * t);

type Dot = { x: number; y: number; vx: number; vy: number; bx: number; by: number; r: number; a: number; lamp: boolean; d: number; u: number; off: number; px: number; py: number; k: number };

export default function World() {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = root.current!, cv = canvas.current!;
    const layers = Array.from(el.querySelectorAll<HTMLElement>(".layer"));
    const ctx = cv.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const css = getComputedStyle(document.documentElement);
    const rgb = (v: string) => {
      let h = css.getPropertyValue(v).trim().slice(1);
      if (h.length === 3) h = h.replace(/./g, "$&$&"); // minified CSS shortens #ffffff
      return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
    };
    const SKY = [rgb("--blue-300"), rgb("--blue-600")];
    const STAR = rgb("--on-dark");
    const LAMP = rgb("--lamp");
    const mix = (a: number[], b: number[], k: number) => a.map((v, i) => Math.round(v + (b[i] - v) * k));

    let W = 0, H = 0, dots: Dot[] = [], frame = 0, g = 0, push = 0, heroH = 1;
    const mouse = { x: -1e4, y: -1e4 };

    // layer images are max(100vw, SPAN × vh) wide, bottom-aligned, centred
    // (see .layer img in globals.css)
    // the landscape is a little wider than the screen, so it can slide
    // sideways; shiftX is chosen in setup
    let shiftX = 0;
    const size = () => {
      const iw = Math.max(W * WIDEN, SPAN * H);
      return { iw, ih: (iw * terrain.h) / terrain.w, x0: shiftX };
    };
    const imgs = layers.map((l) => l.querySelector("img")!);
    // where the town crest sits on screen, for a fraction u across the image
    const crest = (u: number, lift: number) => {
      const { iw, ih, x0 } = size();
      const c = terrain.crest[Math.round(clamp(u) * (terrain.crest.length - 1))];
      return { x: x0 + u * iw, y: H - ih + c * ih + lift };
    };
    // the visible slice of the image, as fractions across it
    const span = () => {
      const { iw, x0 } = size();
      return [-x0 / iw, (W - x0) / iw];
    };

    const setup = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = window.innerWidth;
      H = window.innerHeight;
      // keep the hero copy clear: lower the range until its highest peak
      // sits just under the copy, then let it rise as the hero scrolls away
      const copy = document.querySelector(".hero-copy")?.getBoundingClientRect();
      const hero = document.querySelector<HTMLElement>(".hero");
      heroH = hero?.offsetHeight || H;
      // slide the range so the lowest ground sits under the copy (the big
      // peaks then rise beside it), and find the highest point under the copy
      const { iw, ih } = size();
      const last = terrain.skyline.length - 1;
      const under = (x0: number) => {
        const v0 = copy ? (copy.left - x0) / iw : -x0 / iw;
        const v1 = copy ? (copy.right - x0) / iw : (W - x0) / iw;
        return Math.min(...terrain.skyline.slice(Math.max(0, Math.floor(v0 * last)), Math.min(last, Math.ceil(v1 * last)) + 1));
      };
      let top = -1;
      for (let x0 = W - iw; x0 <= 0; x0 += 8) {
        const t = under(x0);
        if (t > top + 0.002) { top = t; shiftX = x0; }
      }
      imgs.forEach((im) => { im.style.width = `${iw}px`; im.style.left = `${shiftX}px`; });
      const peak = H - ih + top * ih + OFFSET * H;
      push = copy ? Math.min(H * 0.5, Math.max(0, copy.bottom + window.scrollY + 14 - peak)) : 0;
      cv.width = W * dpr;
      cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const [u0, u1] = span();
      const n = Math.round(Math.min(180, Math.max(60, (W * H) / 7500)));
      dots = Array.from({ length: n }, (_, i) => {
        const vx = (Math.random() - 0.5) * 0.3, vy = (Math.random() - 0.5) * 0.2;
        return {
          x: Math.random() * W, y: Math.random() * H * 0.6, vx, vy, bx: vx, by: vy,
          r: 0.8 + Math.random() * 1.4, a: 0.25 + Math.random() * 0.5,
          // lights land a few at a time across the first two thirds of the descent
          lamp: i < n * 0.3, d: Math.random() * 0.6,
          u: u0 + Math.random() * (u1 - u0), off: 6 + Math.random() * H * 0.22,
          px: 0, py: 0, k: 0,
        };
      });
    };

    const draw = () => {
      const max = document.documentElement.scrollHeight - H;
      g = max > 0 ? clamp(window.scrollY / max) : 0;
      const dusk = ease(clamp((g - 0.55) / 0.4));
      el.style.setProperty("--dusk", dusk.toFixed(3));
      document.documentElement.style.setProperty("--g", g.toFixed(4));
      const away = reduce ? 0 : ease(clamp(window.scrollY / heroH));
      const lift = (i: number) => (reduce ? OFFSET : OFFSET - g * RISE[i]) * H + push * (1 - away);
      layers.forEach((l, i) => { l.style.transform = `translate3d(0, ${lift(i).toFixed(1)}px, 0)`; });
      const townLift = lift(3);

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
          if (o.y < -10) o.y = H * 0.6; else if (o.y > H * 0.6) o.y = -10;
        }
        o.k = o.lamp ? (reduce ? 1 : ease(clamp((g - o.d) / 0.25))) : 0;
        const t = crest(o.u, townLift);
        o.px = o.x + (t.x - o.x) * o.k;
        o.py = o.y + (t.y + o.off - o.y) * o.k;
      }
      // links between sky dots fade out as dusk falls
      const linkA = 0.35 * (1 - dusk);
      if (linkA > 0.01) {
        ctx.lineWidth = 1;
        for (let i = 0; i < dots.length; i++) {
          const a = dots[i];
          if (a.k > 0.2) continue;
          for (let j = i + 1; j < dots.length; j++) {
            const b = dots[j];
            if (b.k > 0.2) continue;
            const dx = a.px - b.px, dy = a.py - b.py, d2 = dx * dx + dy * dy;
            if (d2 > LINK * LINK) continue;
            ctx.strokeStyle = `rgba(${SKY[0].join(",")},${(1 - Math.sqrt(d2) / LINK) * linkA})`;
            ctx.beginPath();
            ctx.moveTo(a.px, a.py);
            ctx.lineTo(b.px, b.py);
            ctx.stroke();
          }
        }
      }
      dots.forEach((o, i) => {
        const c = mix(mix(SKY[i % 2], STAR, dusk), LAMP, o.k).join(",");
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
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(() => { frame = 0; draw(); }); };
    const sync = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (!reduce && !document.hidden) frame = requestAnimationFrame(loop);
    };

    setup();
    draw();
    sync();
    let t = 0;
    const onResize = () => {
      clearTimeout(t);
      t = window.setTimeout(() => { setup(); draw(); }, 150);
    };
    const onMove = (e: PointerEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onLeave = () => { mouse.x = mouse.y = -1e4; };
    window.addEventListener("resize", onResize);
    if (reduce) window.addEventListener("scroll", onScroll, { passive: true });
    if (fine && !reduce) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", onLeave);
    }
    document.addEventListener("visibilitychange", sync);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return (
    <div ref={root} className="world" aria-hidden="true">
      <div className="sky day" />
      <div className="sky dusk" />
      {LAYERS.map((i) => (
        <div key={i} className={`layer l${i}`}>
          <img src={`/terrain/layer-${i}.webp`} alt="" decoding="async" fetchPriority={i === 3 ? "high" : "auto"} />
        </div>
      ))}
      <div className="shade" />
      <canvas ref={canvas} className="particles" />
    </div>
  );
}
