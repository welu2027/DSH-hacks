/* eslint-disable @next/next/no-img-element */
import { SectionHead } from "./shared";
import Team from "./Staff";
import JudgesRoll from "./JudgesRoll";

/* Where judges come from: logos in /public/judges, then V1's in
   /public/professionals. White artwork gets a navy plaque. */
const DARK = new Set(["/judges/oxford.png"]);
const JUDGES_FROM: [string, string][] = [
  ["Y Combinator", "/judges/ycombinator.png"], ["Goldman Sachs", "/judges/goldmansachs.png"],
  ["University of Oxford", "/judges/oxford.png"], ["MIT", "/judges/mit.svg"], ["Columbia Business School", "/judges/columbia.png"],
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

const Logo = ({ name, src }: { name: string; src: string }) => (
  <li className={DARK.has(src) ? "plaque dark" : "plaque"}><img src={src} alt={name} loading="lazy" /></li>
);

export default function People() {
  return (
    <section id="people" className="section people" aria-labelledby="people-h">
      <div className="wrap">
        <SectionHead id="people-h" no="09" eyebrow="People" meta={["Judges", "Organizers"]}>Judges &amp; <em>team</em></SectionHead>
        <h3 className="band-k">Judges from</h3>
      </div>
      <div className="logo-marquee">
        <div className="marquee-track">
          <ul>{JUDGES_FROM.map(([n, s]) => <Logo key={s} name={n} src={s} />)}</ul>
          {/* second copy closes the loop; hidden from assistive tech */}
          <ul aria-hidden="true">{JUDGES_FROM.map(([n, s]) => <Logo key={s} name={n} src={s} />)}</ul>
        </div>
      </div>
      <div className="wrap">
        <h3 className="band-k" id="judges-roll">Judges</h3>
        <p className="sec-note left">The people scoring your project, and the ones who scored V1.</p>
      </div>
      <JudgesRoll />
      <div className="wrap">
        <p className="sec-note">Interested in judging? Same channels: Discord, or the hackathon manager on Devpost.</p>
        <Team />
      </div>
    </section>
  );
}
