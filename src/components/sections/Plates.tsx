import Gallery from "@/components/plates/Gallery";
import { FigCaption, TitleBlock } from "@/components/blueprint/parts";
import { LINKS, SectionHead, ext } from "./shared";

export default function Plates() {
  return (
    <section id="projects" className="section sheet" data-swing="">
      <div className="wrap">
        <SectionHead no="02" title="Projects" name="Plates" meta="283 submissions" />
        <p className="plates-intro">
          Every V1 project, printed in dither. Hover to see the original, click to open one.
          V1&apos;s theme was AI × STEM education; these are what students built in four weeks.
        </p>
        <figure className="plates-fig">
          <Gallery />
          <FigCaption no={4} title="Every V1 submission, printed in dither" note="hover for the original" />
        </figure>
        <div className="gal-foot">
          <p>V1 had 283 submissions.</p>
          <a className="btn" href={LINKS.v1} {...ext}>Browse on Devpost</a>
        </div>
        <TitleBlock no={2} title="Plates" />
      </div>
    </section>
  );
}
