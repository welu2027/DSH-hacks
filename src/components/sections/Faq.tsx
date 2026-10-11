import { TitleBlock } from "@/components/blueprint/parts";
import { SectionHead } from "./shared";

const FAQ: [string, string][] = [
  ["Who can participate?", "Any student aged 13 or older, from anywhere in the world."],
  ["Is it free to enter?", "Yes, completely free."],
  ["When does it take place?", "Online. Submissions opened June 24 and are due November 14, 2026 at 11:45pm PST. Judging runs November 15–22, and winners are announced November 23."],
  ["Can I work solo, or do I need a team?", "Either. Use the Discord to find teammates if you want one."],
  ["What is the theme?", "AI × Healthcare: transforming healthcare access through AI."],
  ["What do I need to submit?", "A working prototype (website, app, or other interactive build; hardware is fine alongside code), a demo video, a one-page project description as a PDF, and your GitHub repository or a code PDF, all on Devpost."],
  ["Can I use AI tools to build my project?", "Yes. Low-code and no-code builds are welcome. The project must be original and built during the hackathon."],
  ["What are the prizes?", "$100,000+ in sponsor credits, licenses, and memberships: 1st, 2nd, and 3rd place packages, Tin Computer Growth Plan credits for up to 100 teams, and a YRI research fellowship scholarship. Prizes are non-cash."],
  ["How are projects judged?", "Idea, implementation, design, and presentation."],
  ["Who is hosting DSH Hacks?", "DeltaForge Hacks, NXT Horizon, and STEMise."],
  ["Where do I get updates and find teammates?", "The Discord and the Devpost page."],
  ["I have another question.", "Ask in the Discord or message the hackathon manager on Devpost."],
];

export default function Faq() {
  return (
    <section id="faq" className="section sheet" data-swing="">
      <div className="wrap">
        <SectionHead no="06" title="FAQ" name="General notes" meta={`${FAQ.length} notes`} />
        <div className="faq">
          {FAQ.map(([q, a], i) => (
            <details key={q}>
              <summary>
                <span className="q">Q.{String(i + 1).padStart(2, "0")}</span>
                <span className="qt">{q}</span>
                <span className="pm" aria-hidden="true" />
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
        <TitleBlock no={6} title="General notes" />
      </div>
    </section>
  );
}
