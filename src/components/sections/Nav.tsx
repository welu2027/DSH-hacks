"use client";

import { useEffect, useRef } from "react";
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
      ctx.putImageData(ditherImage(ctx.getImageData(0, 0, c.width, c.height), [7, 11, 22], true), 0, 0);
    };
    im.src = "/dsh-logo-circle.png";
  }, []);
  return <canvas ref={ref} width={60} height={60} aria-hidden="true" />;
}

export default function Nav() {
  return (
    <header className="nav">
      <div className="wrap nav-in">
        <a href="#hero" className="brand" aria-label="DSH Hacks, back to top">
          <BrandMark />
          DSH Hacks
        </a>
        <nav className="nav-links" aria-label="Sections">
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#schedule">Schedule</a>
          <a href="#prizes">Prizes</a>
          <a href="#faq">FAQ</a>
        </nav>
        <a className="btn solid sm" href={LINKS.devpost} {...ext}>Register</a>
      </div>
    </header>
  );
}
