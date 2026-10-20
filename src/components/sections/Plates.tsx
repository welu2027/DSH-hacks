import Gallery from "@/components/plates/Gallery";
import { Piece } from "@/components/art/Art";
import Note from "@/components/art/Note";
import { LINKS, SectionHead, ext } from "./shared";

export default function Plates() {
  return (
    <section id="projects" className="section projects" aria-labelledby="projects-h">
      <div className="art" aria-hidden="true">
        <Piece src="cell" w={240} h={240} className="projects-cell hide-sm" depth="mid" float={8} />
        <Piece src="device-microscope" w={230} h={290} className="projects-scope hide-sm" depth="near" float={9} />
        <Piece src="dna" w={150} h={440} className="projects-dna hide-sm" depth="far" float={11} />
      </div>
      <div className="wrap">
        <SectionHead
          id="projects-h"
          eyebrow="Projects"
          align="split"
          sub="Every V1 project, with the image from its Devpost submission. Click one to open it. V1's theme was AI × STEM education; these are what students built in four weeks."
        >
          What V1 <em>built</em>
        </SectionHead>
        <div className="gal-wrap">
          <Note arrow="down" className="projects-note" tilt={5}>click one</Note>
          <Gallery />
        </div>
        <div className="gal-foot">
          <p>V1 had 283 submissions.</p>
          <a className="btn" href={LINKS.v1} {...ext}>Browse on Devpost</a>
        </div>
      </div>
    </section>
  );
}
