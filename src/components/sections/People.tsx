/* eslint-disable @next/next/no-img-element */
import { IconBrandYoutube, IconPlayerPlay } from "@tabler/icons-react";
import { Dust, Piece, Ribbon } from "@/components/art/Art";
import { LINKS, SectionHead, ext } from "./shared";
import JudgesRoll from "./JudgesRoll";

/* Where judges come from: logos in /public/judges, then V1's in
   /public/professionals. White artwork gets a navy plaque. */
const DARK = new Set(["/judges/oxford.png"]);
const JUDGES_FROM: [string, string][] = [
  ["Y Combinator", "/judges/ycombinator.png"], ["Goldman Sachs", "/judges/goldmansachs.png"],
  ["University of Oxford", "/judges/oxford.png"], ["Columbia Business School", "/judges/columbia.png"],
  ["D. E. Shaw", "/judges/deshaw.png"],
  ["Microsoft", "/professionals/microsoft.png"], ["Apple", "/professionals/apple.png"], ["Amazon", "/professionals/amazon.png"], ["Meta", "/professionals/meta.png"],
  ["PayPal", "/professionals/paypal.png"], ["AWS", "/professionals/aws.png"], ["Visa", "/professionals/visa.png"], ["JPMorgan Chase", "/professionals/jpmorgan.png"],
  ["Cisco", "/professionals/ciscosystems.png"], ["HCLTech", "/professionals/hcltech.png"], ["U.S. Bank", "/professionals/usbank.png"], ["Citizens", "/professionals/citizensbank.png"],
  ["State Street", "/professionals/statestreet.png"], ["Highspot", "/professionals/highspot.png"], ["Develop Health", "/professionals/develophealth.png"],
  ["Octery", "/professionals/octery.png"], ["ERP Smart Labs", "/professionals/erpsmartlabs.png"], ["Achieve", "/professionals/achieve.png"],
  // confirmed V2 affiliations from upstream's judges marquee
  ["Google", "/pro-google.svg"], ["IBM", "/pro-ibm.svg"], ["T-Mobile", "/pro-t-mobile.svg"], ["Accenture", "/Accenture.svg"],
  ["Oracle", "/pro-oracle.svg"], ["Capital One", "/pro-capital-one.svg"], ["Paramount", "/pro-paramount.svg"],
];

const TALKS = [
  { id: "v_6Beq5OL5o", speaker: "Maulik Bhatt", topic: "Search to Intelligence, RAG Driven Agents" },
  { id: "mtKC_Fvi1X8", speaker: "Karthik Karunanithi", topic: "What Nobody Tells You About Building Real AI" },
  { id: "BqeOkzui3Bs", speaker: "Sarvesh Gupta", topic: "How Distributed Databases Actually Work" },
  { id: "T2BTGFHIp7g", speaker: "Siyuan Feng", topic: "Protecting Test Data with AI" },
  { id: "YjerivsGsyM", speaker: "Jim Markunas", topic: "Product Thinking 101" },
  { id: "hwUY4jseRlc", speaker: "Ratish Kumar Saravanan", topic: "Intro to Predictive Analytics" },
];

export default function People() {
  return (
    <section id="people" className="section people" aria-labelledby="people-h">
      <div className="art" aria-hidden="true">
        <Dust seed={57} count={50} className="people-dust" />
        <Ribbon kind="veil" className="people-ribbon" />
        <Piece src="island-antenna" w={300} h={320} className="people-island" float={9} />
        <Piece src="device-mri" w={400} h={300} className="people-mri hide-sm" depth="mid" float={10} />
      </div>
      <div className="wrap">
        <SectionHead id="people-h" eyebrow="People" align="right">Judges &amp; <em>speakers</em></SectionHead>

        <h3 className="sub-h">Judges from</h3>
        <ul className="logo-wall">
          {JUDGES_FROM.map(([name, src]) => (
            <li key={src} className={DARK.has(src) ? "plaque dark rv" : "plaque rv"}>
              <img src={src} alt={name} loading="lazy" />
            </li>
          ))}
        </ul>

        <h3 className="sub-h" id="judges-roll">Judges</h3>
        <p className="sec-note left">The people scoring your project, and the ones who scored V1.</p>
        <JudgesRoll />
        <p className="sec-note">Interested in judging? Same channels: Discord, or the hackathon manager on Devpost.</p>

        <h3 className="sub-h" id="workshops">Workshops</h3>
        <p className="sec-note left">Recorded talks on AI, product thinking, data, and more.</p>
        <ul className="talks">
          {TALKS.map((t, i) => (
            <li key={t.id} className="rv">
              <a className="card talk" href={`https://www.youtube.com/watch?v=${t.id}`} {...ext}>
                <span className="ws">WS-{String(i + 1).padStart(2, "0")}</span>
                <span className="t">{t.topic}</span>
                <span className="s">{t.speaker}</span>
                <span className="w"><IconPlayerPlay size={16} stroke={1.5} /> Watch ↗</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="center">
          <a className="btn" href={LINKS.youtube} {...ext}><IconBrandYoutube size={18} stroke={1.5} /> Subscribe on YouTube</a>
        </div>
      </div>
    </section>
  );
}
