/* eslint-disable @next/next/no-img-element */
import { IconSparkles } from "@tabler/icons-react";
import { SectionHead } from "./shared";

/* Prizes and criteria from dsh-hacks-v2.devpost.com. All prizes are non-cash
   sponsor credits, licenses and memberships. */
type Item = { name: string; v: number };
const pkg = (codecrafters: number, devswarm: number, aops: number): Item[] => [
  { name: "Momen credits", v: 2000 },
  { name: "Adaption Labs credits", v: 1000 },
  { name: "CodeCrafters VIP", v: codecrafters },
  { name: "CleanShot X licenses", v: 140 },
  { name: "Devswarm Pro", v: devswarm },
  { name: "AoPS gift cards", v: aops },
];
const PLACES: { place: string; medal: "gold" | "silver" | "bronze"; n: number; items: Item[] }[] = [
  { place: "1st place", medal: "gold", n: 1, items: pkg(720, 72, 50) },
  { place: "2nd place", medal: "silver", n: 2, items: pkg(360, 18, 25) },
  { place: "3rd place", medal: "bronze", n: 3, items: pkg(180, 18, 25) },
];
const SPECIALS = [
  { by: "Tin Computer", logo: "tincomputer", place: "Tin Computer Growth Plan", n: "Up to 100 teams", detail: "$299 in Growth Plan credits per eligible team." },
  { by: "YRI", logo: "yri", dark: true, place: "Best research-oriented project", n: "1 team", detail: "A 50% scholarship for the YRI 1:1 Research Fellowship Program." },
];
const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

const CRITERIA = [
  { name: "Idea", detail: "Did the proposal address the problem statement and theme? Was the idea innovative? How much impact could it have if deployed to the public?" },
  { name: "Implementation", detail: "Does the solution work? Did the team achieve everything they wanted? How technically challenging or impressive was it?" },
  { name: "Design", detail: "Did the team put thought into UX? How well designed is the interface?" },
  { name: "Presentation", detail: "Does the presentation clearly define and address the problem statement?" },
];

export default function Prizes() {
  return (
    <section id="prizes" className="section prizes" aria-labelledby="prizes-h">
      <div className="wrap">
        <SectionHead id="prizes-h" no="05" eyebrow="Prizes · V2" meta={["Non-cash", "Sponsor credits, licenses, memberships"]}>
          Prizes &amp; <em>tracks</em>
        </SectionHead>
        <div className="pool-row rv">
          <p className="pool">$100,000+</p>
          <p className="pool-sub">in prizes, with more on the way. Watch Devpost and the Discord for announcements.</p>
        </div>

        <div className="places">
          {PLACES.map((p) => (
            <article key={p.place} className={`card prize-card place ${p.medal} rv`}>
              <span className="medal" aria-hidden="true">{p.n}</span>
              <p className="card-k">{p.medal} · 1 team</p>
              <h3>{p.place}</h3>
              <p className="pv"><span>{usd(p.items.reduce((a, b) => a + b.v, 0))}</span> package value</p>
              <dl className="tiers">
                {p.items.map((it) => (
                  <div key={it.name}><dt>{it.name}</dt><dd>{usd(it.v)}</dd></div>
                ))}
              </dl>
            </article>
          ))}
        </div>

        <h3 className="band-k">Special prizes</h3>
        <div className="specials">
          {SPECIALS.map((s) => (
            <article key={s.place} className="card prize-card special rv">
              <span className="special-tag"><IconSparkles size={14} stroke={1.75} aria-hidden="true" /> Special award</span>
              <span className="sparkles" aria-hidden="true"><i /><i /><i /></span>
              <div className="presented">
                <span className={s.dark ? "plaque dark" : "plaque"}><img src={`/sponsors/${s.logo}.png`} alt={s.by} loading="lazy" /></span>
                <span>Presented by {s.by}</span>
              </div>
              <h3>{s.place}</h3>
              <p>{s.detail}</p>
              <dl className="tiers">
                <div><dt>Winners</dt><dd>{s.n}</dd></div>
              </dl>
            </article>
          ))}
        </div>

        <h3 className="band-k">Judging criteria</h3>
        <div className="criteria">
          {CRITERIA.map((c, i) => (
            <div key={c.name} className="rv">
              <span className="crit-k">C{i + 1}</span>
              <h4>{c.name}</h4>
              <p>{c.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
