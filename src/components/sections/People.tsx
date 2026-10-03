/* eslint-disable @next/next/no-img-element */
import { LINKS, SectionHead, ext } from "./shared";
import JudgesRoll from "./JudgesRoll";

/* From the sponsor tiles on dsh-hacks-v2.devpost.com and
   dsh-hacks-v1.devpost.com; logos in /public/sponsors. */
const SPONSORS: { group: string; list: { name: string; logo: string; href: string }[] }[] = [
  {
    group: "V2",
    list: [
      { name: "Art of Problem Solving", logo: "aops", href: "https://artofproblemsolving.com/" },
      { name: "HowtoHackathon", logo: "howtohackathon", href: "https://www.howtohackathon.org/" },
      { name: "Devswarm", logo: "devswarm", href: "https://devswarm.ai/" },
      { name: "CodeCrafters", logo: "codecrafters", href: "https://codecrafters.io/" },
      { name: "CleanShot X", logo: "cleanshotx", href: "https://cleanshot.com/" },
      { name: "Adaption Lab", logo: "adaptionlab", href: "https://adaptionlabs.ai/" },
      { name: "Momen", logo: "momen", href: "https://momen.app/" },
      { name: "MeDo", logo: "medo", href: "https://medo.dev/home" },
      { name: "Tin Computer", logo: "tincomputer", href: "https://tin.computer/" },
      { name: "YRI", logo: "yri", href: "https://www.yriscience.com/" },
      { name: "Mobbin", logo: "mobbin", href: "https://mobbin.com/" },
      { name: "RISE Research", logo: "riseresearch", href: "https://riseglobaleducation.com/" },
    ],
  },
  {
    group: "V1",
    list: [
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
    ],
  },
];

/* Where judges come from: logos in /public/judges, then V1's in
   /public/professionals. */
/* square marks get more height so they read at the size of the wordmarks */
const SQUARE = new Set(["/judges/goldmansachs.png", "/judges/oxford.png", "/professionals/apple.png", "/pro-paramount.svg"]);
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

const domain = (href: string) => new URL(href).hostname.replace(/^www\./, "");

export default function People() {
  return (
    <section id="people" className="section" data-swing="">
      <div className="wrap">
        <SectionHead no="05" title="People" />
        <div className="two-col">
          <div id="sponsors">
            <h3 className="people-h">Sponsors</h3>
            <p className="sub">
              Want to support DSH Hacks? Reach us on Discord or message the hackathon manager on Devpost.
            </p>
            {SPONSORS.map(({ group, list }) => (
              <div key={group} className="logo-group">
                <p className="label">{group}</p>
                <ul className="logo-list">
                  {list.map((sp) => (
                    <li key={sp.name}>
                      <a href={sp.href} {...ext}>
                        <img className="logo" src={`/sponsors/${sp.logo}.png`} alt={sp.name} loading="lazy" />
                        <span>{domain(sp.href)}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div id="judges">
            <h3 className="people-h">Judges from</h3>
            <p className="sub">
              Interested in judging? Same channels: Discord, or the hackathon manager on Devpost.
            </p>
            <div className="logo-grid">
              {JUDGES_FROM.map(([name, src]) => (
                <div key={src}>
                  <img className={SQUARE.has(src) ? "logo sq" : "logo"} src={src} alt={name} loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div id="judges-roll" style={{ marginTop: "clamp(64px, 8vw, 112px)" }}>
          <h3 className="people-h">Judges</h3>
          <p className="sub">The people scoring your project, and the ones who scored V1.</p>
        </div>
        <JudgesRoll />

        <div id="workshops" style={{ marginTop: "clamp(64px, 8vw, 112px)" }}>
          <h3 className="people-h">Workshops</h3>
          <p className="sub">Recorded talks on AI, product thinking, data, and more.</p>
          <ul className="talks">
            {TALKS.map((t) => (
              <li key={t.id}>
                <a href={`https://www.youtube.com/watch?v=${t.id}`} {...ext}>
                  <span className="t">{t.topic}</span>
                  <span className="s">{t.speaker}</span>
                  <span className="w">Watch</span>
                </a>
              </li>
            ))}
          </ul>
          <a className="btn" href={LINKS.youtube} {...ext}>Subscribe on YouTube</a>
        </div>
      </div>
    </section>
  );
}
