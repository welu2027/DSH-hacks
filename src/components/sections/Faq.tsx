import { SectionHead } from "./shared";

const FAQ: [string, string][] = [
  ["Who can participate?", "Any student aged 13 or older, from anywhere in the world."],
  ["Is it free to enter?", "Yes, completely free."],
  ["When does it take place?", "Online, with submissions due November 7, 2026 at 11:45pm PST."],
  ["Can I work solo, or do I need a team?", "Either. Use the Discord to find teammates if you want one."],
  ["What is the theme?", "AI × Healthcare: transforming healthcare access through AI."],
  ["What do I need to submit?", "A working prototype, a demo video, a one-page description, and your code, all on Devpost."],
  ["Can I use AI tools to build my project?", "Yes. Low-code and no-code builds are welcome. The project must be original and built during the hackathon."],
  ["What are the prizes?", "$100,000+ so far, with more announced on Devpost and Discord."],
  ["How are projects judged?", "Idea, implementation, design, and presentation."],
  ["Who is hosting DSH Hacks?", "DeltaForge Hacks, NXT Horizon, and STEMise."],
  ["Where do I get updates and find teammates?", "The Discord and the Devpost page."],
  ["I have another question.", "Ask in the Discord or message the hackathon manager on Devpost."],
];

export default function Faq() {
  return (
    <section id="faq" className="section" data-swing="">
      <div className="wrap">
        <SectionHead no="06" title="FAQ" />
        <div className="faq">
          {FAQ.map(([q, a]) => (
            <details key={q}>
              <summary>
                {q}
                <span className="pm" aria-hidden="true" />
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
