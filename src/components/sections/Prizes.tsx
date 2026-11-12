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

const PODIUM = [PLACES[1], PLACES[0], PLACES[2]]; // 2nd, 1st, 3rd
const total = (items: Item[]) => items.reduce((a, b) => a + b.v, 0);

export default function Prizes() {
  return (
    <section id="prizes" className="section prizes" aria-labelledby="prizes-h">
      <div className="wrap">
        <SectionHead id="prizes-h" no="05" eyebrow="Prizes · V2" meta={["Non-cash", "Sponsor credits, licenses, memberships"]}>
          Prizes &amp; <em>judging</em>
        </SectionHead>

        <div className="pool-panel rv">
          <div>
            <p className="pool">$100,000<em>+</em></p>
            <p className="pool-sub">in prizes, with more on the way. Watch Devpost and the Discord for announcements.</p>
          </div>
          <dl className="pool-facts">
            <div><dt>Podium</dt><dd>3 packages</dd></div>
            <div><dt>Special awards</dt><dd>{SPECIALS.length}</dd></div>
            <div><dt>Format</dt><dd>Credits, licenses &amp; memberships</dd></div>
          </dl>
        </div>

        <h3 className="band-k">The podium</h3>
        <ol className="podium" aria-label="Podium prizes">
          {PODIUM.map((p) => (
            <li key={p.place} className={`step ${p.medal} rv`}>
              <div className="step-top">
                <span className="medal" aria-hidden="true">{p.n}</span>
                <h4>{p.place}</h4>
                <p className="step-v">{usd(total(p.items))}</p>
                <p className="step-k">package value · 1 team</p>
              </div>
              <div className="step-block" aria-hidden="true"><span>{p.n}</span></div>
            </li>
          ))}
        </ol>

        <div className="pkg-wrap rv">
          <table className="pkg">
            <caption className="sr-only">What each podium package includes</caption>
            <thead>
              <tr><th scope="col">In each package</th>{PLACES.map((p) => <th key={p.place} scope="col">{p.place.replace(" place", "")}</th>)}</tr>
            </thead>
            <tbody>
              {PLACES[0].items.map((it, i) => (
                <tr key={it.name}><th scope="row">{it.name}</th>{PLACES.map((p) => <td key={p.place}>{usd(p.items[i].v)}</td>)}</tr>
              ))}
            </tbody>
            <tfoot>
              <tr><th scope="row">Total</th>{PLACES.map((p) => <td key={p.place}>{usd(total(p.items))}</td>)}</tr>
            </tfoot>
          </table>
        </div>

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
        <ol className="criteria">
          {CRITERIA.map((c, i) => (
            <li key={c.name} className="rv">
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
