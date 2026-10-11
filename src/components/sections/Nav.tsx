"use client";

import { useEffect, useRef, useState } from "react";
import { ditherImage } from "@/components/plates/dither";
import { LINKS, ext } from "./shared";

/* The brand mark is the logo printed as a plate: inverted so its blue strokes
   become cobalt ink on film. */
function BrandMark() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const im = new Image();
    im.onload = () => {
      const ctx = c.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(im, 0, 0, c.width, c.height);
      ctx.putImageData(ditherImage(ctx.getImageData(0, 0, c.width, c.height), [5, 7, 11], true), 0, 0);
    };
    im.src = "/dsh-logo-circle.png";
  }, []);
  return <canvas ref={ref} width={60} height={60} aria-hidden="true" />;
}

const LINKS_NAV: [string, string][] = [["about", "About"], ["projects", "Projects"], ["schedule", "Schedule"], ["prizes", "Prizes"], ["faq", "FAQ"]];

export default function Nav() {
  // the section in the middle band of the viewport gets the tick
  const [active, setActive] = useState("");
  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    document.querySelectorAll("main section[id]").forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <header className="nav">
      <div className="wrap nav-in">
        <a href="#hero" className="brand" aria-label="DSH Hacks V2, back to top">
          <BrandMark />
          DSH Hacks<span className="v2" aria-hidden="true">V2</span>
        </a>
        <nav className="nav-links" aria-label="Sections">
          {LINKS_NAV.map(([id, t]) => (
            <a key={id} href={`#${id}`} aria-current={active === id ? "true" : undefined}>{t}</a>
          ))}
        </nav>
        <a className="btn solid sm" href={LINKS.devpost} {...ext}>Register</a>
      </div>
    </header>
  );
}
