import { SectionHead } from "./shared";

const RECORD: [string, string][] = [
  ["1,294", "participants"],
  ["283", "projects submitted"],
  ["80+", "countries"],
  ["80+", "professional judges"],
  ["$35K+", "prizes distributed"],
  ["10+", "sponsors"],
];

export default function About() {
  return (
    <section id="about" className="section about" aria-labelledby="about-h">
      <div className="wrap">
        <SectionHead id="about-h" no="01" eyebrow="What is DSH Hacks" meta={["Free", "Online", "Global", "Any skill level"]}>
          The hackathon series built for <em>what&apos;s next.</em>
        </SectionHead>
        <div className="about-grid">
          <p className="lead rv">
            DSH Hacks is a free, global, online hackathon series run by three youth-led
            organizations: DeltaForge Hacks, NXT Horizon, and STEMise.
          </p>
          <div className="prose rv">
            {/* TODO: Ryan review */}
            <p>
              Each rendition takes on a new theme where AI can do real good. V1 took on AI × STEM
              Education. V2, live now, takes on AI × Healthcare.
            </p>
            <p>
              Any skill level is welcome. Work solo or with a team, and lean on AI to make an
              ambitious idea buildable. Low-code and no-code projects count.
            </p>
          </div>
        </div>
        <h3 className="band-k">V1 by the numbers</h3>
        <dl className="band">
          {RECORD.map(([n, l]) => (
            <div key={l} className="rv">
              <dt>{l}</dt>
              <dd data-count="">{n}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
