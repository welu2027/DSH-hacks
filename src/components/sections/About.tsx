import { SectionHead } from "./shared";
import Globe from "./Globe";
import Logo3D from "@/components/Logo3D";
import { REACH } from "./reach";

// from Devpost, newest edition first; V2 final 2026-11-17, V1 final 2026-06. Overall countries is the
// union in reach.ts, so it is less than V1 + V2.
const RECORD: [string, [string, string][]][] = [
  ["V2 · AI × Healthcare", [["1,278", "participants"], ["285", "projects"], ["87", "countries"], ["$100K+", "prize pool"]]],
  ["V1 · AI × STEM education", [["1,291", "participants"], ["283", "projects"], ["80+", "countries"], ["$35K+", "prizes awarded"]]],
  ["Overall", [["2,560+", "participants"], ["568", "projects"], ["100", "countries"], ["129", "judges"], ["22", "sponsors"]]],
];

export default function About() {
  return (
    <section id="about" className="section about" aria-labelledby="about-h">
      <div className="wrap">
        <Logo3D className="about-coin" />
        <SectionHead id="about-h" no="01" eyebrow="What is DSH Hacks">
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
              students learn STEM. V2 asked how it can bring care closer to patients.
            </p>
            <p>
              Any skill level is welcome. Work solo or with a team, and lean on AI to make an
              ambitious idea buildable. Low-code and no-code projects count.
            </p>
          </div>
        </div>
        {RECORD.map(([k, stats]) => (
          <div key={k}>
            <h3 className="band-k">{k}</h3>
            <dl className="band" style={{ "--n": stats.length } as React.CSSProperties}>
              {stats.map(([n, l]) => (
                <div key={l} className="rv">
                  <dt>{l}</dt>
                  <dd data-count="">{n}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}

        <div className="reach">
          <Globe />
          <div className="reach-copy rv">
            <h3 className="reach-h">Built by students in <em>100 countries.</em></h3>
            {REACH.some((p) => p.participants) && (
              <ol className="reach-list">
                {REACH.filter((p) => p.participants).sort((a, b) => b.participants! - a.participants!).slice(0, 8).map((p) => (
                  <li key={p.country}><span>{p.country}</span><span>{p.participants!.toLocaleString("en-US")}</span></li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
