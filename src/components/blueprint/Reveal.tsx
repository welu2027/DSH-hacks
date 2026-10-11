"use client";

import { useEffect } from "react";

/* Marks each .sheet with .in as it enters the viewport; CSS draws its lines
   and lifts its title. Sheets already on screen at mount are marked at once so
   nothing flickers. [data-count] numbers count up the first time their sheet
   comes in. Reduced motion: everything is shown drawn, no counting. */
function countUp(el: HTMLElement) {
  const final = el.textContent ?? "";
  const m = final.match(/^(\D*)([\d,]+)(.*)$/);
  if (!m) return;
  const target = Number(m[2].replace(/,/g, ""));
  const t0 = performance.now();
  const step = (t: number) => {
    const k = Math.min(1, (t - t0) / 900);
    const v = Math.round(target * (1 - Math.pow(1 - k, 3)));
    el.textContent = k < 1 ? `${m[1]}${v.toLocaleString("en-US")}${m[3]}` : final;
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const RISE = [
  ".lead", ".prose > p", ".quote", ".record > div", ".about-fig", ".steps > li", ".criteria > div",
  ".prize-fig", ".pcard", ".scard", ".ledger > li", ".faq details", ".talks li", ".logo-list li", ".logo-grid > div",
  ".tblock", ".pool-sub", ".reg-body", ".empty-plate", ".people-h", ".sub", ".axis", ".gal-bar",
].join(", ");

export default function Reveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const sheets = Array.from(document.querySelectorAll<HTMLElement>(".sheet"));
    const vh = window.innerHeight;
    for (const s of sheets) {
      const r = s.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) s.classList.add("in");
    }
    // blocks rise in as each one reaches the viewport, staggered among
    // siblings that arrive together; ones already on screen show at once
    const blocks: HTMLElement[] = [];
    for (const s of sheets) {
      const seen = new Map<Element, number>();
      s.querySelectorAll<HTMLElement>(RISE).forEach((el) => {
        const p = el.parentElement!;
        const i = seen.get(p) ?? 0;
        seen.set(p, i + 1);
        el.classList.add("rv");
        el.style.setProperty("--d", String(Math.min(i % 6, 5) * 70));
        const r = el.getBoundingClientRect();
        if (r.top < vh && r.bottom > 0) el.classList.add("on");
        else blocks.push(el);
      });
    }
    const bio = new IntersectionObserver(
      (es) => {
        for (const e of es) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("on");
          bio.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    blocks.forEach((el) => bio.observe(el));
    document.documentElement.classList.add("reveal");
    const io = new IntersectionObserver(
      (es) => {
        for (const e of es) {
          if (!e.isIntersecting) continue;
          const s = e.target as HTMLElement;
          s.classList.add("in");
          s.querySelectorAll<HTMLElement>("[data-count]").forEach(countUp);
          io.unobserve(s);
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    sheets.filter((s) => !s.classList.contains("in")).forEach((s) => io.observe(s));
    return () => {
      io.disconnect();
      bio.disconnect();
    };
  }, []);
  return null;
}
