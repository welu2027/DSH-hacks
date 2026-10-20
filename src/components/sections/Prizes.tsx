/* eslint-disable @next/next/no-img-element */
import { Dust, Piece } from "@/components/art/Art";
import DitherField from "@/components/art/DitherField";
import Carousel from "./Carousel";
import Note from "@/components/art/Note";
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
const PLACES: { place: string; items: Item[] }[] = [
  { place: "1st place", items: pkg(720, 72, 50) },
  { place: "2nd place", items: pkg(360, 18, 25) },
  { place: "3rd place", items: pkg(180, 18, 25) },
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
      <div className="art" aria-hidden="true">
        <Dust seed={41} count={60} className="prizes-dust" />
        <DitherField className="prizes-scan" seed={5} w={200} h={100} />
        <Piece src="bionic-hand" w={250} h={340} className="prizes-hand hide-sm" depth="mid" float={10} />
      </div>
      <div className="wrap">
        <SectionHead id="prizes-h" eyebrow="Prizes" align="left">Prizes &amp; <em>tracks</em></SectionHead>
        <div className="pool-row">
          <div className="pool-mid">
            <p className="pool rv">$100,000+</p>
            <p className="pool-k">Prize pool · more on the way</p>
            <p className="pool-sub">in prizes, with more on the way. Watch Devpost and the Discord for announcements.</p>
            <p className="pill-note">Non-cash: sponsor credits, licenses, memberships</p>
          </div>
          <Piece src="cell" w={240} h={240} className="pool-cell r" depth="mid" float={10} />
        </div>

        <div className="podium-row">
          <div className="podium-wrap">
            <Piece src="island-steps" w={520} h={380} className="podium" float={9} />
            <Note arrow="down" className="podium-note" tilt={-5}>could be you</Note>
          </div>
          <Carousel label="Placement prizes">
            {PLACES.map((p) => (
              <article key={p.place} className="card prize-card">
                <p className="eyebrow">Placement · 1 team</p>
                <h3>{p.place}</h3>
                <p className="pv"><span>{usd(p.items.reduce((a, b) => a + b.v, 0))}</span> package value</p>
                <dl className="tiers">
                  {p.items.map((it) => (
                    <div key={it.name}><dt>{it.name}</dt><dd>{usd(it.v)}</dd></div>
                  ))}
                </dl>
              </article>
            ))}
          </Carousel>
        </div>

        <h3 className="sub-h">Special prizes</h3>
        <div className="specials">
          {SPECIALS.map((s) => (
            <article key={s.place} className="card prize-card challenge rv">
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

        <h3 className="sub-h">Judging criteria</h3>
        <div className="criteria">
          {CRITERIA.map((c, i) => (
            <div key={c.name} className="card rv">
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
