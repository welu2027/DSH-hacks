/* eslint-disable @next/next/no-img-element */
import { Dust, Piece, Ribbon } from "@/components/art/Art";
import DitherField from "@/components/art/DitherField";
import { SectionHead } from "./shared";

const RECORD: [string, string][] = [
  ["1,294", "participants"],
  ["283", "projects submitted"],
  ["80+", "countries"],
  ["80+", "professional judges"],
  ["$35K+", "prizes distributed"],
  ["10+", "sponsors"],
];

/* Signal → care: lit cells as nodes on a ribbon, with pill labels. */
function Node({ label, tag }: { label: string; tag?: string }) {
  return (
    <div className="flow-node">
      {tag && <span className="flow-tag">{tag}</span>}
      <img className="flow-cell" src="/illustrations/cell.svg" width={64} height={64} alt="" />
      <span className="flow-pill">{label}</span>
    </div>
  );
}

function CareFlow() {
  return (
    <figure
      className="flow rv"
      role="img"
      aria-label="What you could build: a patient signal goes to a model, then a confidence check. High confidence goes to care; low confidence goes to human review. A: diagnostic tool. B: faster care. C: early detection."
    >
      <div className="flow-row" aria-hidden="true">
        <Node label="Patient signal" tag="C · Early detection" />
        <Node label="Model" tag="A · Diagnostic tool" />
        <Node label="Confidence" />
        <div className="flow-split">
          <div className="flow-branch"><span className="flow-k">High</span><Node label="Care" tag="B · Faster care" /></div>
          <div className="flow-branch"><span className="flow-k">Low</span><Node label="Human review" /></div>
        </div>
      </div>
    </figure>
  );
}

export default function About() {
  return (
    <section id="about" className="section about" aria-labelledby="about-h">
      <div className="art" aria-hidden="true">
        <Dust seed={23} count={50} className="about-dust" />
        <Ribbon kind="arc" className="about-ribbon" />
        <Piece src="wear-watch" w={210} h={280} className="about-watch hide-sm" depth="mid" float={8} />
        <DitherField className="about-scan" seed={8} />
      </div>
      <div className="wrap">
        <SectionHead id="about-h" eyebrow="About" align="left">Healthcare, <em>reimagined</em></SectionHead>
        <div className="about-grid">
          <div className="about-text">
            <p className="lead rv">
              DSH Hacks is a free, global, online hackathon run by three youth-led organizations. V1
              drew 1,294 students from 80+ countries. V2 turns the same energy toward medicine.
            </p>
            <p className="rv">
              Find a real healthcare problem and build an AI-powered app, website, or system that
              tackles it: a diagnostic tool for a disease with a global burden, a platform that gets
              patients care sooner, a system that rethinks how illness is detected or managed.
            </p>
            <p className="rv">
              Any skill level is welcome. Work solo or with a team, and lean on AI to make an
              ambitious idea buildable. Low-code and no-code projects count.
            </p>
            <blockquote className="quote rv">
              <p>Transforming healthcare access through AI.</p>
              <footer>— The V2 theme</footer>
            </blockquote>
            <CareFlow />
          </div>
          <Piece src="tower-care" w={260} h={720} className="about-tower" float={10} />
        </div>
        <h3 className="stats-h">V1 by the numbers</h3>
        <dl className="stats bento">
          {RECORD.map(([n, l]) => (
            <div key={l} className="card rv">
              <dt>{l}</dt>
              <dd data-count="">{n}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
