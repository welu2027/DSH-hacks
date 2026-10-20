"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { LINKS, ext } from "./shared";

const LINKS_NAV: [string, string][] = [
  ["about", "About"], ["projects", "Projects"], ["sponsors", "Sponsors"], ["prizes", "Prizes"],
  ["schedule", "Schedule"], ["people", "People"], ["faq", "FAQ"], ["coming-soon", "Coming Soon"],
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
        <a href="#hero" className="brand" aria-label="DSH Hacks V2, back to top">
          <img src="/dsh-logo-circle.png" width={34} height={34} alt="" />
          <span>DSH Hacks</span><span className="v2" aria-hidden="true">V2</span>
        </a>
        <nav className="nav-links" aria-label="Sections">
          {LINKS_NAV.map(([id, t]) => (
            <a key={id} href={`#${id}`} aria-current={active === id ? "true" : undefined}>{t}</a>
          ))}
        </nav>
        <a className="btn solid sm nav-cta" href={LINKS.devpost} {...ext}>Register</a>
        <button
          type="button" className="nav-burger" aria-expanded={open} aria-controls="nav-sheet"
          aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((o) => !o)}
        >
          {open ? <IconX size={22} stroke={1.5} /> : <IconMenu2 size={22} stroke={1.5} />}
        </button>
      </div>
      {open && (
        <nav id="nav-sheet" className="nav-sheet" aria-label="Sections">
          {LINKS_NAV.map(([id, t]) => (
            <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{t}</a>
          ))}
          <a className="btn solid" href={LINKS.devpost} {...ext}>Register on Devpost</a>
        </nav>
      )}
    </header>
  );
}
