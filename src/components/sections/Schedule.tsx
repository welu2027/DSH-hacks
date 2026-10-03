import { SectionHead } from "./shared";

const STEPS: { t: string; d: string; hot?: boolean }[] = [
  { t: "Registration open", d: "Sign up free on Devpost and join the Discord to find teammates." },
  { t: "Workshops", d: "Talks from industry professionals go up on the DSH Hacks YouTube channel throughout the event." },
  { t: "Hacking period", d: "Build your AI × Healthcare project, solo or with a team. Projects must be original and built during the hackathon." },
  {
    t: "Submission deadline",
    d: "November 7, 2026 at 11:45pm PST. Submit a prototype, demo video, one-page description, and code on Devpost.",
    hot: true,
  },
  { t: "Judging and winners", d: "Projects are judged on idea, implementation, design, and presentation. Winners are announced on Devpost." },
];

export default function Schedule() {
  return (
    <section id="schedule" className="section" data-swing="">
      <div className="wrap">
        <SectionHead no="03" title="Schedule" />
        <ol className="steps">
          {STEPS.map((s, i) => (
            <li key={s.t} className={s.hot ? "hot" : undefined} data-node={s.hot ? "big" : ""}>
              <span className="k" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
