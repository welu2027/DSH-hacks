import { SectionHead } from "./shared";
import Globe from "./Globe";
import { REACH } from "./reach";

const RECORD: [string, string][] = [
  // V1 + V2 from Devpost, 2026-10-29; V2 is still open
  ["2,094", "participants"],
  ["388", "projects submitted"],
  ["80+", "countries"],
  ["119", "professional judges"],
  ["$35K+", "V1 prizes awarded"],
  ["22", "sponsors"],
];

export default function About() {
  return (
    <section id="about" className="section about" aria-labelledby="about-h">
      <div className="wrap">
        <SectionHead id="about-h" no="01" eyebrow="What is DSH Hacks" meta={["Human-centered", "Free", "Online", "Global"]}>
          Technology that starts with <em>people.</em>
        </SectionHead>
        <div className="about-grid">
          <p className="lead rv">
            DSH Hacks is a free, global, online hackathon series run by three youth-led
            organizations: DeltaForge Hacks, NXT Horizon, and STEMise.
          </p>
          <div className="prose rv">
            {/* TODO: Ryan review */}
            <p>
              We believe technology is only as good as the lives it changes. So every project here
              starts with a person, not a model: find someone with a real problem, understand it,
              and build something they would actually use.
            </p>
            <p>
              Each rendition takes on a theme where that matters most. V1 asked how AI could help
              students learn STEM. V2, live now, asks how it can bring care closer to patients.
            </p>
            <p>
              Any skill level is welcome. Work solo or with a team, and lean on AI to make an
              ambitious idea buildable. Low-code and no-code projects count.
            </p>
          </div>
        </div>
        <h3 className="band-k">V1 + V2, by the numbers</h3>
        <dl className="band">
          {RECORD.map(([n, l]) => (
            <div key={l} className="rv">
              <dt>{l}</dt>
              <dd data-count="">{n}</dd>
            </div>
          ))}
        </dl>

        <div className="reach">
          <Globe />
          <div className="reach-copy rv">
            <h3 className="reach-h">Built by students in <em>80+ countries.</em></h3>
            <p className="strip">V1 · 1,291 participants · V2 · 803+ so far</p>
            {REACH.length > 0 && (
              <ol className="reach-list">
                {[...REACH].sort((a, b) => b.participants - a.participants).slice(0, 8).map((p) => (
                  <li key={p.country}><span>{p.country}</span><span>{p.participants.toLocaleString("en-US")}</span></li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
