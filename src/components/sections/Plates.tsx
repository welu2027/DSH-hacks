import Gallery from "@/components/plates/Gallery";
import Motif from "@/components/art/Motif";
import { Plaques, V1_SPONSORS } from "./Sponsors";
import { LINKS, SectionHead, ext } from "./shared";

export default function Plates() {
  return (
    <section id="projects" className="section theme v1" aria-labelledby="projects-h">
      <div className="art" aria-hidden="true">
        <Motif name="atom" className="theme-big" />
      </div>
      <div className="wrap">
        <SectionHead
          id="projects-h" no="04" eyebrow="V1 recap · AI × STEM Education" align="split"
          meta={["Completed", "Four weeks", "1,291 students", "283 projects"]}
          sub="Every V1 project, with the image from its Devpost submission. Click one to open it. V1's theme was AI × STEM education; these are what students built in four weeks."
        >
          What V1 <em>built.</em>
        </SectionHead>
        <div className="motif-row" aria-hidden="true">
          <Motif name="book" /><Motif name="beaker" /><Motif name="bulb" /><Motif name="atom" />
        </div>
        <Gallery />
        <div className="gal-foot">
          <p>V1 had 283 submissions.</p>
          <a className="btn" href={LINKS.v1} {...ext}>Browse on Devpost</a>
        </div>
        <h3 className="band-k">V1 was backed by</h3>
        <Plaques list={V1_SPONSORS} small />
      </div>
    </section>
  );
}
