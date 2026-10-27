"use client";

import { useState } from "react";
import { IconPlus } from "@tabler/icons-react";
import { SectionHead } from "./shared";

const A: Record<string, string> = {
  "Who can participate?": "Any student aged 13 or older, from anywhere in the world (Devpost's standard country exceptions apply). Companies and professional organizations can't enter.",
  "Is it free to enter?": "Yes, completely free.",
  "When does it take place?": "Online. Submissions opened June 24 and are due November 14, 2026 at 11:45pm PST. Judging runs November 15–22, and winners are announced November 23.",
  "Can I work solo, or do I need a team?": "Either. Use the Discord to find teammates if you want one.",
  "What is the theme?": "AI × Healthcare: transforming healthcare access through AI.",
  "What do I need to submit?": "A working prototype (website, app, or other interactive build; hardware is fine alongside code), a demo video, a one-page project description as a PDF, and your GitHub repository or a code PDF, all on Devpost.",
  "Can I use AI tools to build my project?": "Yes. Low-code and no-code builds are welcome. The project must be original and built during the hackathon.",
  "What are the prizes?": "$100,000+ in sponsor credits, licenses, and memberships: 1st, 2nd, and 3rd place packages, Tin Computer Growth Plan credits for up to 100 teams, and a YRI research fellowship scholarship. Prizes are non-cash.",
  "How are projects judged?": "Idea, implementation, design, and presentation.",
  "Who is hosting DSH Hacks?": "DeltaForge Hacks, NXT Horizon, and STEMise.",
  "Where do I get updates and find teammates?": "The Discord and the Devpost page.",
  "I have another question.": "Ask in the Discord or message the hackathon manager on Devpost.",
};

const GROUPS: [string, string[]][] = [
  ["General", ["Who can participate?", "Is it free to enter?", "Who is hosting DSH Hacks?", "Where do I get updates and find teammates?"]],
  ["Format & theme", ["When does it take place?", "What is the theme?", "Can I work solo, or do I need a team?", "Can I use AI tools to build my project?"]],
  ["Submission & judging", ["What do I need to submit?", "How are projects judged?", "What are the prizes?"]],
  ["Other", ["I have another question."]],
];

function Item({ q, id }: { q: string; id: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={open ? "acc open" : "acc"}>
      <h4>
        <button type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
          <span>{q}</span>
          <IconPlus className="acc-i" size={20} stroke={1.5} aria-hidden="true" />
        </button>
      </h4>
      <div id={id} role="region" className="acc-body" hidden={!open}>
        <p>{A[q]}</p>
      </div>
    </div>
  );
}

export default function Faq() {
  return (
    <section id="faq" className="section faq" aria-labelledby="faq-h">
      <div className="wrap">
        <SectionHead id="faq-h" no="10" eyebrow="FAQ" meta={["12 questions", "4 groups"]}>Questions, <em>answered.</em></SectionHead>
        <div className="faq-groups">
          {GROUPS.map(([g, qs], gi) => (
            <div key={g} className="faq-group rv">
              <h3>{g}</h3>
              {qs.map((q, qi) => <Item key={q} q={q} id={`faq-${gi}-${qi}`} />)}
            </div>
          ))}
        </div>
        <p className="sec-note">Have more questions? Ask in the Discord or message the hackathon manager on Devpost.</p>
      </div>
    </section>
  );
}
