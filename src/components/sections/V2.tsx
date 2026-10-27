import Motif, { type MotifName } from "@/components/art/Motif";
import { LINKS, SectionHead, ext } from "./shared";

const FACTS: [string, string][] = [
  ["Theme", "AI × Healthcare"],
  ["Format", "Online, global"],
  ["Who", "Students, ages 13+"],
  ["Entry", "Free"],
  ["Prize pool", "$100,000+"],
  ["Deadline", "Nov 14, 11:45pm PST"],
];

const DIRECTIONS: { m: MotifName; k: string; t: string; d: string }[] = [
  { m: "pulse", k: "A", t: "Diagnostic tool", d: "A diagnostic tool for a disease with a global burden." },
  { m: "cells", k: "B", t: "Faster care", d: "A platform that gets patients care sooner." },
  { m: "molecule", k: "C", t: "Early detection", d: "A system that rethinks how illness is detected or managed." },
];

/* The live rendition, with its own accent and the healthcare motifs. */
export default function V2() {
  return (
    <section id="v2" className="section theme v2" aria-labelledby="v2-h">
      <div className="art" aria-hidden="true">
        <Motif name="pulse" className="theme-big" />
      </div>
      <div className="wrap">
        <SectionHead
          id="v2-h" no="03" eyebrow="DSH Hacks V2 · AI × Healthcare" align="split"
          meta={["Live now", "$100,000+ in prizes", "Closes Nov 14"]}
          sub="Find a real healthcare problem and build an AI-powered app, website, or system that tackles it."
        >
          Build AI that makes healthcare <em>reach further.</em>
        </SectionHead>

        <ul className="dirs">
          {DIRECTIONS.map((x) => (
            <li key={x.k} className="dir rv">
              <Motif name={x.m} />
              <span className="dir-k">{x.k}</span>
              <h3>{x.t}</h3>
              <p>{x.d}</p>
            </li>
          ))}
        </ul>

        <div className="v2-grid">
          <blockquote className="quote rv">
            <p>Transforming healthcare access through AI.</p>
            <footer>— The V2 theme</footer>
          </blockquote>
          <dl className="facts rv">
            {FACTS.map(([k, v]) => (
              <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
            ))}
          </dl>
        </div>

        <div className="btn-row rv">
          <a className="btn solid lg" href={LINKS.devpost} {...ext}>Register on Devpost</a>
          <a className="btn lg" href={LINKS.discord} {...ext}>Join Discord</a>
          <a className="tlink" href={LINKS.flyer} {...ext}>Flyer (PDF)</a>
          <a className="tlink" href={LINKS.rules} {...ext}>Rules</a>
        </div>
      </div>
    </section>
  );
}
