"use client";

import { useEffect } from "react";

/* Slow parallax for every [data-depth] layer: each drifts by `depth` × its
   distance from the viewport centre, so far layers (larger depth) lag more,
   and eases toward that offset so motion stays smooth. One rAF loop that
   stops when settled; positions are measured on resize only, so the scroll
   path reads nothing but scrollY. Off under reduced motion. */
export default function Parallax() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let items: { el: HTMLElement; k: number; mid: number; y: number }[] = [];
    let frame = 0;

    const measure = () => {
      items = Array.from(document.querySelectorAll<HTMLElement>("[data-depth]")).map((el) => {
        el.style.transform = "";
        const r = el.getBoundingClientRect();
        const k = Number(el.dataset.depth);
        return { el, k, mid: r.top + window.scrollY + r.height / 2, y: NaN };
      }).filter((it) => it.k > 0);
      frame = 0;
      apply();
    };
    // each layer eases 14% of the way to its target per frame, so scrolling
    // feels like a soft follow; the loop stops once everything has settled
    const apply = () => {
      const c = window.scrollY + window.innerHeight / 2;
      const vh = window.innerHeight;
      let moving = false;
      for (const it of items) {
        if (Math.abs(it.mid - c) > vh * 1.5) continue; // far off screen: skip
        const target = (c - it.mid) * it.k;
        it.y = Number.isNaN(it.y) ? target : it.y + (target - it.y) * 0.14;
        if (Math.abs(target - it.y) > 0.3) moving = true;
        else it.y = target;
        it.el.style.transform = `translate3d(0, ${it.y.toFixed(2)}px, 0)`;
      }
      frame = moving ? requestAnimationFrame(apply) : 0;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    let t = 0;
    const remeasure = () => {
      clearTimeout(t);
      t = window.setTimeout(measure, 150);
    };
    measure();
    const ro = new ResizeObserver(remeasure);
    ro.observe(document.body);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
      clearTimeout(t);
    };
  }, []);
  return null;
}
