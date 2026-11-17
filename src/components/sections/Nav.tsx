"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { PiListDuotone, PiXDuotone } from "react-icons/pi";
import { LINKS, ext } from "./shared";

const LINKS_NAV: [string, string][] = [
  ["about", "About"], ["journey", "Journey"], ["v2", "V2"], ["projects", "Projects"], ["prizes", "Prizes"],
  ["timeline", "Timeline"], ["workshops", "Workshops"], ["sponsors", "Sponsors"], ["people", "People"], ["faq", "FAQ"],
];

export default function Nav() {
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // the section in the middle band of the viewport gets the underline
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    document.querySelectorAll("main section[id]").forEach((s) => io.observe(s));
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`nav${scrolled || open ? " scrolled" : ""}`}>
      <div className="wrap nav-in">
        <a href="#hero" className="brand" aria-label="DSH Hacks, back to top">
          <img src="/dsh-logo-96.png" width={34} height={34} alt="" />
          <span>DSH Hacks</span>
        </a>
        <nav className="nav-links" aria-label="Sections">
          {LINKS_NAV.map(([id, t]) => (
            <a key={id} href={`#${id}`} aria-current={active === id ? "true" : undefined}>{t}</a>
          ))}
        </nav>
        <a className="btn solid sm nav-cta" href={LINKS.gallery} {...ext}>View V2 projects</a>
        <button
          type="button" className="nav-burger" aria-expanded={open} aria-controls="nav-sheet"
          aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((o) => !o)}
        >
          {open ? <PiXDuotone size={22} /> : <PiListDuotone size={22} />}
        </button>
      </div>
      {open && (
        <nav id="nav-sheet" className="nav-sheet" aria-label="Sections">
          {LINKS_NAV.map(([id, t]) => (
            <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{t}</a>
          ))}
          <a className="btn solid" href={LINKS.gallery} {...ext}>View V2 projects</a>
        </nav>
      )}
    </header>
  );
}
