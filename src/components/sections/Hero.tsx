import Countdown from "@/components/Countdown";
import { LINKS, ext } from "./shared";

const BOARD: [string, string][] = [
  ["Theme", "AI × Healthcare"],
  ["Format", "Online, global"],
  ["Who", "Students, ages 13+"],
  ["Entry", "Free"],
  ["Prize pool", "$100,000+"],
  ["Deadline", "Nov 7, 11:45pm PST"],
];

export default function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="wrap hero-grid">
        <div>
          <p className="hero-kicker">DeltaForge Hacks × NXT Horizon × STEMise present V2</p>
          <h1 className="h1" data-beat="center">
            Build AI that makes healthcare <em>reach further.</em>
          </h1>
          <p className="lead">
            A free, online hackathon for students 13 and up, anywhere in the world. Pick a real
            healthcare problem and ship something that helps.
          </p>
          <div className="btn-row">
            <a className="btn solid" href={LINKS.devpost} {...ext}>Register on Devpost</a>
            <a className="btn" href={LINKS.discord} {...ext}>Join the Discord</a>
            <a className="btn" href={LINKS.flyer} {...ext}>Flyer (PDF)</a>
          </div>
        </div>
        <div className="board">
          <dl>
            {BOARD.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <div className="board-clock">
            <div className="label">Until submissions close</div>
            <Countdown />
          </div>
        </div>
      </div>
    </section>
  );
}
