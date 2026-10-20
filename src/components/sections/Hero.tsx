import Countdown from "@/components/Countdown";
import { Piece } from "@/components/art/Art";
import DitherField from "@/components/art/DitherField";
import Vitals from "@/components/art/Vitals";
import Note from "@/components/art/Note";
import { LINKS, ext } from "./shared";

const FACTS: [string, string][] = [
  ["Theme", "AI × Healthcare"],
  ["Format", "Online, global"],
  ["Who", "Students, ages 13+"],
  ["Entry", "Free"],
  ["Prize pool", "$100,000+"],
  ["Deadline", "Nov 14, 11:45pm PST"],
];

const ECG = "M0 60H300l14-18 14 18h24l10-46 14 84 10-38h40l16-14 16 14H760l14-18 14 18h24l10-46 14 84 10-38h40l16-14 16 14H1440";

/* Two columns: the pitch on the left, one composed scene on the right (a
   cell over a live scan, the care robot on its island, two read-outs). */
export default function Hero() {
  return (
    <section id="hero" className="hero" aria-labelledby="hero-h">
      <div className="wrap">
        <div className="hero-grid">
          <div className="hero-in">
            <p className="eyebrow">DeltaForge Hacks × NXT Horizon × STEMise present V2</p>
            <h1 id="hero-h" className="wordmark">
              DSH <em>Hacks</em><sup className="badge">V2</sup>
            </h1>
            <p className="tagline">Build AI that makes healthcare <em>reach further.</em></p>
            <p className="info">AI × Healthcare · Online, global · Students 13+ · Free</p>
            <div className="hero-cta">
              <a className="btn solid lg" href={LINKS.devpost} {...ext}>Register on Devpost</a>
              <Note arrow="left" className="hero-note" tilt={-6}>it&apos;s free</Note>
            </div>
            <div className="hero-links">
              <a className="tlink" href={LINKS.discord} {...ext}>Join the Discord</a>
              <a className="tlink" href={LINKS.flyer} {...ext}>Flyer (PDF)</a>
            </div>
            <Countdown />
          </div>

          <div className="hero-scene" aria-hidden="true">
            <DitherField className="hero-scan" seed={3} />
            <Piece src="cell" w={240} h={240} className="hero-cell" depth="fixed" float={9} />
            <Piece src="hero-city" w={720} h={520} className="hero-city" depth="fixed" float={11} />
            <Piece src="robot-helper" w={260} h={330} className="hero-robot" depth="fixed" float={7} />
            <Vitals />
          </div>
        </div>

        <dl className="facts">
          {FACTS.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <svg className="hero-ecg" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
        <path d={ECG} vectorEffect="non-scaling-stroke" />
        <path className="run" d={ECG} pathLength={1000} vectorEffect="non-scaling-stroke" />
      </svg>
    </section>
  );
}
