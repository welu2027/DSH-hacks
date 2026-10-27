import { SectionHead } from "./shared";

/* The series so far, oldest first. The line draws itself in as the list
   reaches the viewport (Reveal adds .on). */
const STOPS: { date: string; v: "DSH" | "V1" | "V2" | "V3"; text: string }[] = [
  { date: "Dec 31, 2025", v: "DSH", text: "DSH Hacks is founded." },
  { date: "May 20, 2026", v: "V1", text: "The first DSH Hacks opens on AI × STEM education. 1,291 participants join." },
  { date: "Jun 15, 2026", v: "V1", text: "283 projects submitted; 80+ judges from Microsoft, Apple, Amazon, Meta, PayPal and more." },
  { date: "Jun 24, 2026", v: "V2", text: "Registration opens on AI × Healthcare, with $100,000+ in prizes." },
  { date: "Nov 14, 2026", v: "V2", text: "Submissions close at 11:45pm PST." },
  { date: "Nov 23, 2026", v: "V2", text: "Winners announced on Devpost after a week of judging." },
  { date: "To be announced", v: "V3", text: "" },
];

export default function Journey() {
  return (
    <section id="journey" className="section journey" aria-labelledby="journey-h">
      <div className="wrap split-grid">
        <SectionHead id="journey-h" no="02" eyebrow="The journey" meta={["Founded 2025", "2 renditions", "V3 TBA"]}>
          Our <em>journey</em>
        </SectionHead>
        <ol className="stops rv">
          {STOPS.map((s) => (
            <li key={s.date + s.v} className={`stop ${s.v.toLowerCase()}`}>
              <span className="when">{s.date}</span>
              <span className="tag">{s.v}</span>
              {s.text ? <p>{s.text}</p> : <p className="glitch" aria-label="Theme to be announced">▒▒▒▒▒▒▒▒</p>}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
