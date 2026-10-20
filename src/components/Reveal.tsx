"use client";

import { useEffect } from "react";

/* .rv blocks (and every section heading) fade and rise in as they reach the
   viewport, staggered among siblings that arrive together. Sections off
   screen get .is-off, which pauses their looping animations. [data-count]
   numbers count up from 0 once. [data-in] elements get .in (the footer
   plane uses it). Reduced motion:
   everything is shown as-is, final numbers, no counting. */
function countUp(el: HTMLElement) {
  const final = el.textContent ?? "";
  const m = final.match(/^(\D*)([\d,]+)(.*)$/);
  if (!m) return;
  const target = Number(m[2].replace(/,/g, ""));
  const t0 = performance.now();
  const step = (t: number) => {
    const k = Math.min(1, (t - t0) / 1500);
    const v = Math.round(target * (1 - Math.pow(1 - k, 3)));
    el.textContent = k < 1 ? `${m[1]}${v.toLocaleString("en-US")}${m[3]}` : final;
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export default function Reveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const vh = window.innerHeight;
    const onScreen = (el: Element) => {
      const r = el.getBoundingClientRect();
      return r.top < vh && r.bottom > 0;
    };

    const seen = new Map<Element, number>();
    // pause every looping animation in a section while it is off screen
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main > section, .site-footer"));
    const vis = new IntersectionObserver(
      (es) => es.forEach((e) => e.target.classList.toggle("is-off", !e.isIntersecting)),
      { rootMargin: "200px 0px" },
    );
    sections.forEach((s) => vis.observe(s));

    document.querySelectorAll<HTMLElement>("main > section:not(.hero) .sec-head, .sub-h").forEach((el) => el.classList.add("rv"));
    const rise = Array.from(document.querySelectorAll<HTMLElement>(".rv")).filter((el) => {
      const p = el.parentElement!;
      const i = seen.get(p) ?? 0;
      seen.set(p, i + 1);
      el.style.setProperty("--d", String(Math.min(i, 5) * 70));
      if (!onScreen(el)) return true;
      el.classList.add("on");
      return false;
    });
    document.documentElement.classList.add("reveal");

    const io = new IntersectionObserver(
      (es) => {
        for (const e of es) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          if (el.matches(".rv")) el.classList.add("on");
          if (el.matches("[data-count]")) countUp(el);
          if (el.matches("[data-in]")) el.classList.add("in");
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    rise.forEach((el) => io.observe(el));
    document.querySelectorAll("[data-count], [data-in]").forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      vis.disconnect();
    };
  }, []);
  return null;
}
