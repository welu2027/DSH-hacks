/* eslint-disable @next/next/no-img-element */
import { IconBrandYoutube, IconPlayerPlayFilled } from "@tabler/icons-react";
import { LINKS, SectionHead, ext } from "./shared";

const TALKS = [
  { id: "v_6Beq5OL5o", speaker: "Maulik Bhatt", topic: "Search to Intelligence, RAG Driven Agents" },
  { id: "mtKC_Fvi1X8", speaker: "Karthik Karunanithi", topic: "What Nobody Tells You About Building Real AI" },
  { id: "BqeOkzui3Bs", speaker: "Sarvesh Gupta", topic: "How Distributed Databases Actually Work" },
  { id: "T2BTGFHIp7g", speaker: "Siyuan Feng", topic: "Protecting Test Data with AI" },
  { id: "YjerivsGsyM", speaker: "Jim Markunas", topic: "Product Thinking 101" },
  { id: "hwUY4jseRlc", speaker: "Ratish Kumar Saravanan", topic: "Intro to Predictive Analytics" },
];

export default function Workshops() {
  return (
    <section id="workshops" className="section workshops" aria-labelledby="workshops-h">
      <div className="wrap">
        <SectionHead
          id="workshops-h" no="07" eyebrow="Workshops" align="split" meta={["6 talks", "Free on YouTube"]}
          sub="Recorded talks on AI, product thinking, data, and more."
        >
          Learn from people who <em>ship.</em>
        </SectionHead>
        <ol className="talks">
          {TALKS.map((t, i) => (
            <li key={t.id} className="rv">
              <a className={`talk tint-${i % 6}`} href={`https://www.youtube.com/watch?v=${t.id}`} {...ext}>
                {/* thumbnail from YouTube (public/workshops), washed in this card's colour */}
                <span className="thumb">
                  <img src={`/workshops/${t.id}.jpg`} alt="" loading="lazy" width={480} height={360} />
                  <span className="ws">WS-{String(i + 1).padStart(2, "0")}</span>
                  <span className="play" aria-hidden="true"><IconPlayerPlayFilled size={22} /></span>
                </span>
                <span className="t">{t.topic}</span>
                <span className="s">{t.speaker}</span>
                <span className="w">Watch on YouTube ↗</span>
              </a>
            </li>
          ))}
        </ol>
        <a className="btn" href={LINKS.youtube} {...ext}><IconBrandYoutube size={18} stroke={1.5} /> Subscribe on YouTube</a>
      </div>
    </section>
  );
}
