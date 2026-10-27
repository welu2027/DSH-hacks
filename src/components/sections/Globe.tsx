"use client";

import { useEffect, useRef } from "react";
import createGlobe from "cobe";
import { REACH } from "./reach";

/* A slowly turning dotted globe with a marker per country in reach.ts,
   sized by participants. Drag to spin it. Paused off screen; reduced
   motion: still, but still draggable. */
const hex = (v: string) => {
  let h = getComputedStyle(document.documentElement).getPropertyValue(v).trim().slice(1);
  if (h.length === 3) h = h.replace(/./g, "$&$&"); // minified CSS shortens #ffffff
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as [number, number, number];
};

export default function Globe() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const max = Math.max(1, ...REACH.map((p) => p.participants));
    let phi = 0.6, drag: number | null = null, spin = 0, width = canvas.offsetWidth;
    const globe = createGlobe(canvas, {
      // cobe draws at 2× its CSS size; width/height are buffer pixels
      devicePixelRatio: 2,
      width: width * 2, height: width * 2,
      phi, theta: 0.25, dark: 0, diffuse: 1.2,
      mapSamples: 16000, mapBrightness: 6,
      baseColor: hex("--b20"), markerColor: hex("--lamp"), glowColor: hex("--b10"),
      markers: REACH.map((p) => ({ location: [p.lat, p.lng], size: 0.03 + 0.09 * Math.sqrt(p.participants / max) })),
      onRender: (state) => {
        if (drag === null && !reduce) phi += 0.003;
        state.phi = phi + spin;
        state.width = width * 2;
        state.height = width * 2;
      },
    });
    const io = new IntersectionObserver(([e]) => globe.toggle(e.isIntersecting));
    io.observe(canvas);
    const ro = new ResizeObserver(() => { width = canvas.offsetWidth; });
    ro.observe(canvas);
    const down = (e: PointerEvent) => { drag = e.clientX - spin * 200; canvas.setPointerCapture(e.pointerId); };
    const move = (e: PointerEvent) => { if (drag !== null) spin = (e.clientX - drag) / 200; };
    const up = () => { drag = null; };
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    return () => {
      globe.destroy();
      io.disconnect();
      ro.disconnect();
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
    };
  }, []);

  return <canvas ref={ref} className="globe" aria-hidden="true" />;
}
