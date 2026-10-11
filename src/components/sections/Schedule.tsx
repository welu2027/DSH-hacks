import { TitleBlock } from "@/components/blueprint/parts";
import { SectionHead } from "./shared";

/* Dates from dsh-hacks-v2.devpost.com/details/dates */
const STEPS: { t: string; d: string; tag?: string; hot?: boolean }[] = [
  { t: "Registration open", d: "Submissions opened June 24. Sign up free on Devpost and join the Discord to find teammates.", tag: "Jun 24 · 09:00 PDT" },
  { t: "Workshops", d: "Talks from industry professionals go up on the DSH Hacks YouTube channel throughout the event." },
  { t: "Hacking period", d: "Build your AI × Healthcare project, solo or with a team. Projects must be original and built during the hackathon." },
  {
    t: "Submission deadline",
    d: "November 14, 2026 at 11:45pm PST. Submit a prototype, demo video, one-page description, and code on Devpost.",
    tag: "Nov 14 · 23:45 PST",
    hot: true,
  },
  { t: "Judging and winners", d: "Judges score projects November 15–22 on idea, implementation, design, and presentation. Winners are announced on Devpost November 23.", tag: "Nov 15–22 · Nov 23" },
];

export default function Schedule() {
  return (
    <section id="schedule" className="section sheet" data-swing="">
      <div className="wrap">
        <SectionHead no="03" title="Schedule" meta="5 stages" />
        <div className="axis label" aria-hidden="true"><span>t = 0</span><span>Time →</span></div>
        <ol className="steps">
          {STEPS.map((s, i) => (
            <li key={s.t} className={s.hot ? "hot" : undefined} data-node={s.hot ? "big" : ""}>
              <span className="k" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
              {s.tag && <span className="readout-tag" aria-hidden="true">{s.tag}</span>}
            </li>
          ))}
        </ol>
        <TitleBlock no={3} title="Schedule" />
      </div>
    </section>
  );
}
