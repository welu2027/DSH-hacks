import Countdown from "@/components/Countdown";
import { LINKS, ext } from "./shared";

/* The summit: the first view of the world (components/world/World) that
   sits behind the whole page. V2 shows up only as the live-now card. */
export default function Hero() {
  return (
    <section id="hero" className="hero" data-stop="Summit" aria-labelledby="hero-h">
      <div className="wrap hero-in">
        <div className="hero-copy">
          <p className="eyebrow">DeltaForge Hacks × NXT Horizon × STEMise</p>
          <h1 id="hero-h" className="hero-h">Technology, brought <em>down to earth.</em></h1>
          <p className="hero-sub">
            DSH Hacks is a free, global hackathon series for human-centered technology. Students
            start with a real person&apos;s problem, then build the AI that solves it.
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
    </section>
  );
}
