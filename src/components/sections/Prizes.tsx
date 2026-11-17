/* eslint-disable @next/next/no-img-element */
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

const total = (items: Item[]) => items.reduce((a, b) => a + b.v, 0);

export default function Prizes() {
  return (
    <section id="prizes" className="section prizes" aria-labelledby="prizes-h">
      <div className="wrap">
        <SectionHead id="prizes-h" no="05" eyebrow="Prizes · V2" meta={["Credits, licenses & memberships"]}>
          Prizes &amp; <em>judging</em>
        </SectionHead>

        <div className="pool-panel rv">
          <div>
            <p className="pool">$100,000<em>+</em></p>
            <p className="pool-sub">in prizes</p>
          </div>
          <dl className="pool-facts">
            <div><dt>Podium</dt><dd>3 teams</dd></div>
            <div><dt>Special awards</dt><dd>{SPECIALS.length}</dd></div>
          </dl>
        </div>

        {/* one ticket per place: the stub carries the rank, the body itemizes the package */}
        <ol className="tickets" aria-label="Podium prizes">
          {PLACES.map((p) => (
            <li key={p.place} className={`ticket ${p.medal} rv`}>
              <div className="tk-stub">
                <span className="tk-rank">{p.place.replace(" place", "")}</span>
                <span className="tk-v">{usd(total(p.items))}</span>
              </div>
              <ul className="tk-items">
                {p.items.map((it) => <li key={it.name}><span>{it.name}</span><span>{usd(it.v)}</span></li>)}
              </ul>
            </li>
          ))}
        </ol>

        <h3 className="band-k">Special awards</h3>
        <div className="specials">
          {SPECIALS.map((s) => (
            <article key={s.place} className="special rv">
              <span className={s.dark ? "plaque dark" : "plaque"}><img src={`/sponsors/${s.logo}.png`} alt={s.by} loading="lazy" /></span>
              <div>
                <p className="special-k">Presented by {s.by}</p>
                <h4>{s.place}</h4>
                <p>{s.detail}</p>
                <span className="special-n">{s.n}</span>
              </div>
            </article>
          ))}
        </div>

        <h3 className="band-k">Judging criteria</h3>
        <ol className="sheet rv">
          {CRITERIA.map((c, i) => (
            <li key={c.name}>
              <span className="crit-n" aria-hidden="true">0{i + 1}</span>
              <h4>{c.name}</h4>
              <p>{c.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
