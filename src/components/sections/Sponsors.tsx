/* eslint-disable @next/next/no-img-element */
import { Burst, Piece, Ribbon } from "@/components/art/Art";
import { SectionHead, ext } from "./shared";

/* From the sponsor tiles on dsh-hacks-v2.devpost.com and
   dsh-hacks-v1.devpost.com; logos in /public/sponsors. `dark` logos are
   white artwork, so they get a navy plaque to stay legible. */
type Sponsor = { name: string; logo: string; href: string; dark?: boolean };
const V2: Sponsor[] = [
  { name: "Art of Problem Solving", logo: "aops", href: "https://artofproblemsolving.com/" },
  { name: "HowtoHackathon", logo: "howtohackathon", href: "https://www.howtohackathon.org/" },
  { name: "Devswarm", logo: "devswarm", href: "https://devswarm.ai/" },
  { name: "CodeCrafters", logo: "codecrafters", href: "https://codecrafters.io/" },
  { name: "CleanShot X", logo: "cleanshotx", href: "https://cleanshot.com/" },
  { name: "Adaption Lab", logo: "adaptionlab", href: "https://adaptionlabs.ai/" },
  { name: "Momen", logo: "momen", href: "https://momen.app/" },
  { name: "MeDo", logo: "medo", href: "https://medo.dev/home" },
  { name: "Tin Computer", logo: "tincomputer", href: "https://tin.computer/" },
  { name: "YRI", logo: "yri", href: "https://www.yriscience.com/", dark: true },
  { name: "Mobbin", logo: "mobbin", href: "https://mobbin.com/", dark: true },
  { name: "RISE Research", logo: "riseresearch", href: "https://riseglobaleducation.com/" },
];
const V1: Sponsor[] = [
  { name: "Hudson River Trading", logo: "hrt", href: "https://www.hudsonrivertrading.com/" },
  { name: "Ideavo", logo: "ideavo", href: "https://ideavo.ai/" },
  { name: "LLM.API", logo: "llmapi", href: "https://llmapi.ai/" },
  { name: "Aniko", logo: "aniko", href: "https://www.aniko.ai/" },
  { name: "InterviewBuddy", logo: "interviewbuddy", href: "https://interviewbuddy.net/" },
  { name: "relay.app", logo: "relayapp", href: "https://www.relay.app/" },
  { name: "Interview Cake", logo: "interviewcake", href: "https://www.interviewcake.com/" },
  { name: "Featherless", logo: "featherless", href: "https://featherless.ai/" },
  { name: "Crackd", logo: "crackd", href: "https://crackd.it/" },
  { name: "Iteration Machine", logo: "iterationmachine", href: "https://www.iterationmachine.com/" },
];

function Plaques({ list, small }: { list: Sponsor[]; small?: boolean }) {
  return (
    <ul className={small ? "plaques small" : "plaques"}>
      {list.map((s) => (
        <li key={s.name} className="rv">
          <a className={s.dark ? "plaque dark" : "plaque"} href={s.href} {...ext}>
            <img src={`/sponsors/${s.logo}.png`} alt={s.name} loading="lazy" />
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function Sponsors() {
  return (
    <section id="sponsors" className="section sponsors" aria-labelledby="sponsors-h">
      <div className="art" aria-hidden="true">
        <Ribbon kind="orbit" className="sponsors-ribbon" />
        <Piece src="capsules" w={280} h={200} className="sponsors-pills hide-sm" depth="far" float={9} />
      </div>
      <div className="wrap">
        <SectionHead id="sponsors-h" eyebrow="Sponsors">Our <em>sponsors</em></SectionHead>
        <div className="garden">
          <Burst className="garden-burst" />
          <Piece src="garden-sponsors" w={1200} h={460} className="garden-art" depth="near" />
          <div className="garden-in">
            <p className="garden-k">V2</p>
            <Plaques list={V2} />
            <p className="garden-k muted">V1 sponsors</p>
            <Plaques list={V1} small />
          </div>
        </div>
        <p className="sec-note">
          Interested in sponsoring? Reach us on Discord or message the hackathon manager on Devpost.
        </p>
      </div>
    </section>
  );
}
