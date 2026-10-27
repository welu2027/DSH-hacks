import Gallery from "@/components/plates/Gallery";
import Motif from "@/components/art/Motif";
import { projects } from "@/components/plates/projects";
import { LINKS, SectionHead, ext } from "./shared";

const V2_COUNT = projects.filter((p) => p.v === "V2").length;

export default function Plates() {
  return (
    <section id="projects" className="section projects" aria-labelledby="projects-h">
      <div className="wrap">
        <SectionHead
          id="projects-h" no="04" eyebrow="Projects · V1 + V2" align="split"
          meta={[`${283 + V2_COUNT} projects`, `V2 · ${V2_COUNT} so far`, "V1 · 283"]}
          sub="Every project from both editions, with the image from its Devpost submission. Click one to open it. V2 is AI × Healthcare and still taking submissions; V1 was AI × STEM education."
        >
          What students <em>built.</em>
        </SectionHead>
        <div className="motif-row" aria-hidden="true">
          <Motif name="pulse" /><Motif name="cells" /><Motif name="book" /><Motif name="bulb" />
        </div>
        <Gallery />
        <div className="gal-foot">
          <p>{283 + V2_COUNT} submissions and counting.</p>
          <a className="btn" href={`${LINKS.devpost}project-gallery`} {...ext}>V2 on Devpost</a>
          <a className="btn" href={LINKS.v1} {...ext}>V1 on Devpost</a>
        </div>
      </div>
    </section>
  );
}
