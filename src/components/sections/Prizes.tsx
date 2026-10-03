import { SectionHead } from "./shared";

const CRITERIA = [
  { name: "Idea", detail: "Did the proposal address the theme? Was it innovative? Could it be deployed for real-world impact?" },
  { name: "Implementation", detail: "Does the solution work? How technically challenging was the build?" },
  { name: "Design", detail: "Did the team put thought into UX? How well designed is the interface?" },
  { name: "Presentation", detail: "Does the presentation clearly define and address the problem statement?" },
];

/* Transparent on purpose: the field floods this section cobalt. */
export default function Prizes() {
  return (
    <section id="prizes" className="section prizes" data-swing="">
      <div className="wrap">
        <SectionHead no="04" title="Prizes" />
        <p className="pool">$100,000+</p>
        <p className="pool-sub">
          in prizes, with more on the way. Watch Devpost and the Discord for announcements.
        </p>
        <div className="criteria">
          {CRITERIA.map((c) => (
            <div key={c.name}>
              <h3>{c.name}</h3>
              <p>{c.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
