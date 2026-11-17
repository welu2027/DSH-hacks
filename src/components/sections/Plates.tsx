import Gallery from "@/components/plates/Gallery";
import { LINKS, SectionHead, ext } from "./shared";

const V2_COUNT = 285; // final Devpost count; the gallery may hold fewer

export default function Plates() {
  return (
    <section id="projects" className="section projects" aria-labelledby="projects-h">
      <div className="wrap">
        <SectionHead
          id="projects-h" no="04" eyebrow="Projects · V1 + V2" align="split"
          meta={[`${283 + V2_COUNT} projects`, `V2 · ${V2_COUNT}`, "V1 · 283"]}
        >
          What students <em>built.</em>
        </SectionHead>
        <Gallery />
        <div className="gal-foot">
          <a className="btn" href={LINKS.gallery} {...ext}>V2 on Devpost</a>
          <a className="btn" href={LINKS.v1} {...ext}>V1 on Devpost</a>
        </div>
      </div>
    </section>
  );
}
