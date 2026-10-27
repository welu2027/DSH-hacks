"use client";

import { useEffect, useState } from "react";
import { SectionHead } from "./shared";

/* Dates from dsh-hacks-v2.devpost.com/details/dates. `from`/`to` mark when a
   stage is "Now"; Workshops run throughout, so they never take the pill. */
const STEPS: { when: string; t: string; d: string; from?: string; to?: string }[] = [
  { when: "Jun 24 · 09:00 PDT", t: "Registration open", d: "Submissions opened June 24. Sign up free on Devpost and join the Discord to find teammates." },
  { when: "Throughout", t: "Workshops", d: "Talks from industry professionals go up on the DSH Hacks YouTube channel throughout the event." },
  { when: "Jun 24 → Nov 14", t: "Hacking period", d: "Build your AI × Healthcare project, solo or with a team. Projects must be original and built during the hackathon.", from: "2026-06-24T09:00:00-07:00", to: "2026-11-14T23:45:00-08:00" },
  { when: "Nov 14 · 23:45 PST", t: "Submission deadline", d: "November 14, 2026 at 11:45pm PST. Submit a prototype, demo video, one-page description, and code on Devpost." },
  { when: "Nov 15–22 · Nov 23", t: "Judging and winners", d: "Judges score projects November 15–22 on idea, implementation, design, and presentation. Winners are announced on Devpost November 23.", from: "2026-11-14T23:45:00-08:00", to: "2026-11-24T00:00:00-08:00" },
];

export default function Schedule() {
  // computed after mount: the site is a static export
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => setNow(Date.now()), []);
  const isNow = (s: (typeof STEPS)[number]) =>
    now !== null && !!s.from && !!s.to && now >= Date.parse(s.from) && now < Date.parse(s.to);

  return (
    <section id="timeline" className="section schedule" aria-labelledby="schedule-h">
      <div className="wrap split-grid">
        <SectionHead id="schedule-h" no="06" eyebrow="V2 timeline" meta={["Jun 24 → Nov 23", "All times Pacific"]}>
          Five stages, <em>one deadline.</em>
        </SectionHead>
        <ol className="timeline">
          {STEPS.map((s) => (
            <li key={s.t} className={isNow(s) ? "rv now" : "rv"}>
              <span className="when">{s.when}</span>
              <div className="step">
                <h3>{s.t}{isNow(s) && <span className="pill on">Now</span>}</h3>
                <p>{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
