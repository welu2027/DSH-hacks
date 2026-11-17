import Countdown from "@/components/Countdown";
import { LINKS, ext } from "./shared";

/* The hero: copy on the left; on the right a map table, the V2 status card
   pinned to a topographic sheet with a stamp and field notes beside it
   (the extras are decoration, wide screens only). A navy tape measure along
   the bottom carries the series numbers. */
const TAPE: [string, string][] = [
  ["2,560+", "participants"], ["568", "projects"], ["100", "countries"], ["129", "judges"], ["Free", "students 13+, online"],
];

export default function Hero() {
  return (
    <section id="hero" className="hero" aria-labelledby="hero-h">
      <div className="wrap hero-in">
        <div className="hero-copy">
          <p className="eyebrow">DeltaForge Hacks × NXT Horizon × STEMise</p>
          <h1 id="hero-h" className="hero-h">Technology, brought <em>down to earth.</em></h1>
          <p className="hero-sub">
            A free, global hackathon series for human-centered technology. Start with a real
            person&apos;s problem, then build the AI that solves it.
          </p>
        </div>

        <div className="board">
          <div className="sheet-map" aria-hidden="true">
            <span className="sm-k">Sheet V2 · AI × Healthcare</span>
            <span className="sm-c">87 countries surveyed</span>
          </div>
          <aside className="live" aria-label="DSH Hacks V2, judging now">
            <p className="live-k"><i aria-hidden="true" /> Judging now</p>
            <p className="live-t">V2 · AI × Healthcare</p>
            <Countdown />
            <div className="btn-row">
              <a className="btn solid" href={LINKS.gallery} {...ext}>View projects</a>
              <a className="btn" href={LINKS.discord} {...ext}>Join Discord</a>
            </div>
          </aside>
          <div className="d-stamp" aria-hidden="true"><span>DSH · V2</span><b>285</b><span>projects filed</span></div>
          <div className="d-note" aria-hidden="true">
            <b>field notes</b>
            <ol><li>find a person</li><li>hear the problem</li><li>build the AI</li><li><s>sleep</s> ship</li></ol>
          </div>
        </div>
      </div>

      <dl className="tape-m">
        {TAPE.map(([n, l]) => (
          <div key={l}><dt>{l}</dt><dd>{n}</dd></div>
        ))}
      </dl>
    </section>
  );
}
