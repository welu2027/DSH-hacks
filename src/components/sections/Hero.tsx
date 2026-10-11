import Countdown from "@/components/Countdown";
import { Dim, FigCaption, TitleBlock } from "@/components/blueprint/parts";
import { LINKS, ext } from "./shared";

const BOARD: [string, string][] = [
  ["Theme", "AI × Healthcare"],
  ["Format", "Online, global"],
  ["Who", "Students, ages 13+"],
  ["Entry", "Free"],
  ["Prize pool", "$100,000+"],
  ["Deadline", "Nov 14, 11:45pm PST"],
];

export default function Hero() {
  return (
    <section id="hero" className="hero sheet">
      <div className="wrap">
        <div className="hero-grid">
          <div>
            <p className="hero-kicker">DeltaForge Hacks × NXT Horizon × STEMise present V2</p>
            <h1 className="h1" data-beat="center">
              Build AI that makes healthcare <em>reach further.</em>
            </h1>
            <Dim label="AI × Healthcare" className="hero-dim" />
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
          <figure className="hero-fig">
            {/* the garden canvas draws the grove's elevation into this slot, then
                swings it into 3D */}
            <div className="world-slot" role="img" aria-label="A grove of lattice supertrees drawn as a blueprint elevation that turns into a 3D garden: roots for data, trunks for models, canopies for care." />
            <FigCaption no={1} title="The grove: data at the roots, models in the trunk, care at the canopy" />
          </figure>
        </div>

        <div className="hero-spec">
          <dl className="spec-strip">
            {BOARD.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <div className="readout">
            <Countdown />
            <p className="label">T-minus to submission close · Nov 14 23:45 PST</p>
          </div>
        </div>
        <TitleBlock no={0} title="Cover" />
      </div>
    </section>
  );
}
