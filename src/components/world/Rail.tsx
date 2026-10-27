"use client";

import { useEffect, useRef, useState } from "react";

/* The descent rail: a fixed line down the right edge with a waypoint per
   section and a marker for where you are, reading your altitude (2,400 m at
   the summit, 0 m on the valley floor).
   Decorative: the nav and headings already carry this for assistive tech. */
export const TOP_ALT = 2400;
export const altAt = (g: number) => Math.round((TOP_ALT * (1 - g)) / 10) * 10;

type Stop = { id: string; label: string; at: number };

export default function Rail() {
  const [stops, setStops] = useState<Stop[]>([]);
  const here = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const measure = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      setStops(Array.from(document.querySelectorAll<HTMLElement>("main section[id]")).map((s) => ({
        id: s.id,
        label: s.dataset.stop ?? s.querySelector(".eyebrow")?.textContent?.split("·")[0].trim() ?? s.id,
        at: Math.min(1, Math.max(0, (s.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.4) / max)),
      })));
    };
    let frame = 0;
    const read = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const g = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (here.current) here.current.textContent = `ALT ${altAt(g).toLocaleString("en-US")} M`;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(read); };
    measure();
    read();
    const ro = new ResizeObserver(() => { measure(); read(); });
    ro.observe(document.body);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="rail" aria-hidden="true">
      <div className="rail-line">
        {stops.map((s) => <i key={s.id} className="rail-stop" style={{ top: `${s.at * 100}%` }} title={s.label} />)}
        <span className="rail-you"><p ref={here} className="rail-here" /></span>
      </div>
    </div>
  );
}
