import { Dim, FigCaption, TitleBlock } from "@/components/blueprint/parts";
import Scene from "@/components/scene/Scene";
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
const SPECIALS: { icon: "chip" | "flask"; place: string; n: string; detail: string }[] = [
  { icon: "chip", place: "Tin Computer Growth Plan", n: "Up to 100 teams", detail: "$299 in Growth Plan credits per eligible team." },
  { icon: "flask", place: "Best research-oriented project", n: "1 team", detail: "A 50% scholarship for the YRI 1:1 Research Fellowship Program." },
];
const MAX = 2000; // the largest single item; bars are drawn to this scale
const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

const CRITERIA = [
  { name: "Idea", detail: "Did the proposal address the problem statement and theme? Was the idea innovative? How much impact could it have if deployed to the public?" },
  { name: "Implementation", detail: "Does the solution work? Did the team achieve everything they wanted? How technically challenging or impressive was it?" },
  { name: "Design", detail: "Did the team put thought into UX? How well designed is the interface?" },
  { name: "Presentation", detail: "Does the presentation clearly define and address the problem statement?" },
];

/* Blueprint glyphs: a ribboned medal with its place, a chip, a flask. */
function PrizeIcon({ kind, n }: { kind: "medal" | "chip" | "flask"; n?: number }) {
  return (
    <svg className="picon" viewBox="0 0 48 48" aria-hidden="true">
      {kind === "medal" && (
        <>
          <path d="M16 4l6 14M32 4l-6 14M12 4h8M28 4h8" />
          <circle cx="24" cy="30" r="13" />
          <circle cx="24" cy="30" r="9.5" className="thin" />
          <text x="24" y="34.5" textAnchor="middle">{n}</text>
        </>
      )}
      {kind === "chip" && (
        <>
          <rect x="12" y="12" width="24" height="24" />
          <rect x="18" y="18" width="12" height="12" className="thin" />
          <path d="M18 12V5M24 12V5M30 12V5M18 36v7M24 36v7M30 36v7M12 18H5M12 24H5M12 30H5M36 18h7M36 24h7M36 30h7" />
        </>
      )}
      {kind === "flask" && (
        <>
          <path d="M19 5h10M21 5v12L10 39a3 3 0 0 0 3 4h22a3 3 0 0 0 3-4L27 17V5" />
          <path d="M14 31h20" className="thin" />
          <circle cx="21" cy="36" r="1.6" className="dot" />
          <circle cx="28" cy="34" r="1.2" className="dot" />
        </>
      )}
    </svg>
  );
}

/* Cyanotype sheet: the garden canvas paints its blueprint ground and walks
   you into the conservatory here. */
export default function Prizes() {
  return (
    <section id="prizes" className="section prizes sheet cyan" data-swing="">
      <div className="wrap">
        <SectionHead no="04" title="Prizes" meta="$100,000+" />
        <div className="prize-grid">
          <div>
            <div className="pool-wrap">
              <p className="pool">$100,000+</p>
              <Dim label="Prize pool · more on the way" />
            </div>
            <p className="pool-sub">
              in prizes, with more on the way. Watch Devpost and the Discord for announcements.
            </p>
          </div>
          <figure className="prize-fig">
            <Scene kind="podium" tone="cyan" label="A three-tier podium with a trophy on each tier, drawn as a blueprint that turns into a 3D model." />
            <FigCaption no={5} title="The podium" />
          </figure>
        </div>

        <p className="label prize-note">Prize schedule · non-cash: sponsor credits, licenses, memberships</p>
        <div className="prize-cards">
          {PLACES.map((p, i) => {
            const total = p.items.reduce((a, b) => a + b.v, 0);
            return (
              <article key={p.place} className={i === 0 ? "pcard first" : "pcard"}>
                <header>
                  <PrizeIcon kind="medal" n={i + 1} />
                  <div>
                    <span className="label">P{i + 1} · 1 team</span>
                    <h3>{p.place}</h3>
                  </div>
                </header>
                <p className="pv">
                  <span className="big" data-count="">{usd(total)}</span>
                  <span className="label">package value</span>
                </p>
                <ul className="bars">
                  {p.items.map((it) => (
                    <li key={it.name}>
                      <span className="bn">{it.name}</span>
                      <span className="bv">{usd(it.v)}</span>
                      <i style={{ "--w": it.v / MAX } as React.CSSProperties} aria-hidden="true" />
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
        <div className="prize-specials">
          {SPECIALS.map((s, i) => (
            <article key={s.place} className="scard">
              <PrizeIcon kind={s.icon} />
              <div>
                <span className="label">P{i + 4} · {s.n}</span>
                <h3>{s.place}</h3>
                <p>{s.detail}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="criteria">
          {CRITERIA.map((c, i) => (
            <div key={c.name}>
              <span className="label">C{i + 1}</span>
              <h3>{c.name}</h3>
              <p>{c.detail}</p>
            </div>
          ))}
        </div>
        <TitleBlock no={4} title="Prizes" />
      </div>
    </section>
  );
}
