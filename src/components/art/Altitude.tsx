"use client";

import { useEffect, useRef } from "react";

/* A mono altitude reading in the corner that falls from 2,400 m at the
   summit (top of the page) to 0 m on the valley floor (the footer). */
const TOP = 2400;

export default function Altitude() {
  const ref = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    let frame = 0;
    const set = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const k = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (ref.current) ref.current.textContent = `ALT ${(Math.round((TOP * (1 - k)) / 10) * 10).toLocaleString("en-US")} M`;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(set); };
    set();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return <p ref={ref} className="altitude" aria-hidden="true">ALT 2,400 M</p>;
}
