import Countdown from "@/components/Countdown";
import ParticleField from "@/components/hero/ParticleField";
import { RIDGES, VB_H, VB_W } from "@/components/hero/ridges";
import { LINKS, ext } from "./shared";

/* The summit. A hazy sky full of drifting ideas over layered ridges; the
   ridges parallax at different speeds as you scroll down, and some of the
   ideas settle on the nearest ridge as lights. V2 shows up only as the
   live-now card. */
export default function Hero() {
  return (
    <section id="hero" className="hero" aria-labelledby="hero-h">
      <div className="sky" aria-hidden="true" />
      {RIDGES.map((r) => (
        <svg
          key={r.cls} className={`ridge ${r.cls}`} style={{ height: `calc(var(--rh) * ${r.h})` }} data-depth={r.depth || undefined}
          viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="none" aria-hidden="true"
        >
          <path d={r.d} />
        </svg>
      ))}
      <ParticleField />
      <div className="mist" aria-hidden="true" />

      <div className="wrap hero-in">
        <div className="hero-copy">
          <p className="eyebrow">DeltaForge Hacks × NXT Horizon × STEMise</p>
          <h1 id="hero-h" className="hero-h">Technology, brought <em>down to earth.</em></h1>
          <p className="hero-sub">
            DSH Hacks is a free, global hackathon series where students build AI around real
            people&apos;s problems, one theme at a time.
          </p>
          <p className="strip">Free · Online · Global · Students 13+ · 80+ countries</p>
        </div>

        <aside className="live" aria-label="DSH Hacks V2, live now">
          <p className="live-k"><i aria-hidden="true" /> Live now</p>
          <p className="live-t">V2 · AI × Healthcare · Submissions close Nov 14</p>
          <Countdown />
          <div className="btn-row">
            <a className="btn solid" href={LINKS.devpost} {...ext}>Register</a>
            <a className="btn" href={LINKS.discord} {...ext}>Join Discord</a>
          </div>
        </aside>
      </div>
      <a className="cue" href="#about">Scroll to descend ↓</a>
    </section>
  );
}
