import { IconBrandDiscord, IconBrandInstagram, IconBuildingCommunity, IconLock, IconUsersGroup, IconWorld } from "@tabler/icons-react";
import { Piece, Ribbon } from "@/components/art/Art";
import Note from "@/components/art/Note";
import { LINKS, SectionHead, ext } from "./shared";
import { BEYOND, RENDITIONS } from "./renditions";

const ICON = { chapters: IconUsersGroup, inperson: IconBuildingCommunity, global: IconWorld };
const STATUS = { completed: "Completed", live: "Live now", upcoming: "Coming soon" } as const;

export default function ComingSoon() {
  return (
    <section id="coming-soon" className="section coming" aria-labelledby="coming-h">
      <div className="art" aria-hidden="true">
        <svg className="trail" viewBox="0 0 1440 400" preserveAspectRatio="none">
          <path d="M0 340C360 360 640 180 980 200S1340 80 1440 40" vectorEffect="non-scaling-stroke" />
        </svg>
        <Piece src="islands-future" w={640} h={360} className="coming-islands" depth="far" float={10} />
        <Ribbon kind="drift" className="coming-ribbon" />
        <Piece src="district-future" w={460} h={560} className="coming-district hide-sm" depth="mid" float={11} />
        <Piece src="drone-med" w={280} h={190} className="coming-drone" depth="far" float={6} />
      </div>
      <div className="wrap">
        <SectionHead id="coming-h" eyebrow="What's next" align="left" sub="DSH Hacks is a series. Each rendition takes on a new theme where AI can do real good.">
          Coming <em>soon</em>
        </SectionHead>
        <ol className="renditions">
          {RENDITIONS.map((r) => (
            <li key={r.version} className={`card rend ${r.status} rv`}>
              <span className={r.status === "live" ? "pill on" : "pill"}>{STATUS[r.status]}</span>
              <p className="rend-v">{r.version}</p>
              <h3>{r.status === "upcoming" ? "To be announced" : r.theme}</h3>
              {r.stats.length > 0 && <p className="rend-stats">{r.stats.join(" · ")}</p>}
              {r.links.map((l) => <a key={l.href} className="tlink" href={l.href} {...ext}>{l.label}</a>)}
              {r.status === "upcoming" && <Note arrow="down" className="rend-note" tilt={6}>something&apos;s brewing</Note>}
              {r.status === "upcoming" && (
                <span className="rend-lock" aria-hidden="true"><IconLock size={22} stroke={1.5} /><i>▒▒▒▒▒▒</i></span>
              )}
            </li>
          ))}
          <li className="card rend ghost" aria-hidden="true">
            <p className="rend-v">V4</p>
            <h3>?</h3>
          </li>
        </ol>
        <h3 className="sub-h">Beyond the online hackathon</h3>
        <ul className="beyond">
          {BEYOND.map((b) => {
            const Icon = ICON[b.key];
            return (
              <li key={b.key} className={`card beyond-card ${b.key} rv`}>
                <span className="beyond-ic"><Icon size={26} stroke={1.5} /></span>
                <span className="pill">Coming soon</span>
                <h4>{b.title}</h4>
                <p>{b.text}</p>
              </li>
            );
          })}
        </ul>
        <div className="notify">
          <p>Want a chapter or an event near you? Tell us, and get notified when V3 is announced.</p>
          <div className="btn-row">
            <a className="btn solid" href={LINKS.discord} {...ext}><IconBrandDiscord size={18} stroke={1.5} /> Join the Discord</a>
            <a className="btn" href={LINKS.instagram} {...ext}><IconBrandInstagram size={18} stroke={1.5} /> Follow on Instagram</a>
          </div>
        </div>
      </div>
    </section>
  );
}
