import Pipeline from "@/components/blueprint/Pipeline";
import WorldDots from "@/components/blueprint/WorldDots";
import { FigCaption, TitleBlock } from "@/components/blueprint/parts";
import { SectionHead } from "./shared";

const RECORD: [string, string][] = [
  ["1,294", "hackers registered"],
  ["283", "projects submitted"],
  ["80+", "countries"],
  ["80+", "professional judges"],
  ["$35K+", "prizes distributed"],
  ["10+", "sponsors"],
];

export default function About() {
  return (
    <section id="about" className="section sheet" data-swing="">
      <div className="wrap">
        <SectionHead no="01" title="About" meta="AI × Healthcare" />
        <div className="two-col">
          <div>
            <p className="lead">
              DSH Hacks is a free, global, online hackathon run by three youth-led organizations. V1
              drew 1,294 students from 80+ countries. V2 turns the same energy toward medicine.
            </p>
            <div className="prose" style={{ marginTop: 28 }}>
              <p>
                Find a real healthcare problem and build an AI-powered app, website, or system that
                tackles it: a diagnostic tool for a disease with a global burden, a platform that gets
                patients care sooner, a system that rethinks how illness is detected or managed.
              </p>
              <p>
                Any skill level is welcome. Work solo or with a team, and lean on AI to make an
                ambitious idea buildable. Low-code and no-code projects count.
              </p>
            </div>
            <blockquote className="quote" style={{ marginTop: 32 }}>
              <p>Transforming healthcare access through AI.</p>
              <footer>— The V2 theme</footer>
            </blockquote>
          </div>
          <figure className="about-fig">
            <Pipeline />
            <FigCaption no={2} title="What you could build: signal to care" />
          </figure>
        </div>
        <div className="record-row">
          <div className="record" aria-label="The V1 record">
            {RECORD.map(([n, l]) => (
              <div key={l}>
                <span className="big" data-count="">{n}</span>
                <span className="label">{l}</span>
              </div>
            ))}
          </div>
          <figure className="about-fig">
            <WorldDots />
            <FigCaption no={3} title="V1 reach: 1,294 hackers, 80+ countries" />
          </figure>
        </div>
        <TitleBlock no={1} title="About" />
      </div>
    </section>
  );
}
