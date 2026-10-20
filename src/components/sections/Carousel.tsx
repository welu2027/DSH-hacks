"use client";

import { Children, useRef, useState } from "react";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";

/* One slide at a time on a scroll-snap track, so touch swipe is native;
   the arrows just scroll it by one slide. */
export default function Carousel({ label, children }: { label: string; children: React.ReactNode }) {
  const track = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const n = Children.count(children);

  const go = (k: number) => {
    const t = track.current;
    if (!t) return;
    const next = (k + n) % n;
    t.scrollTo({ left: next * t.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="carousel" role="region" aria-roledescription="carousel" aria-label={label}>
      <div
        ref={track}
        className="carousel-track"
        onScroll={(e) => setI(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
      >
        {Children.map(children, (c, k) => (
          <div className="carousel-slide" role="group" aria-roledescription="slide" aria-label={`${k + 1} of ${n}`} inert={k !== i || undefined}>
            {c}
          </div>
        ))}
      </div>
      <div className="carousel-nav">
        <button type="button" className="icon-btn" onClick={() => go(i - 1)} aria-label="Previous"><IconArrowLeft size={20} stroke={1.5} /></button>
        <span className="carousel-dots" aria-hidden="true">
          {Array.from({ length: n }, (_, k) => <i key={k} className={k === i ? "on" : undefined} />)}
        </span>
        <button type="button" className="icon-btn" onClick={() => go(i + 1)} aria-label="Next"><IconArrowRight size={20} stroke={1.5} /></button>
      </div>
    </div>
  );
}
