import Gallery from "@/components/plates/Gallery";
import { LINKS, SectionHead, ext } from "./shared";

export default function Plates() {
  return (
    <section id="projects" className="section" data-swing="">
      <div className="wrap">
        <SectionHead no="02" title="Projects" />
        <p className="plates-intro">
          Every V1 project, printed in dither. Hover to see the original, click to open one.
          V1&apos;s theme was AI × STEM education; these are what students built in four weeks.
        </p>
        <Gallery />
        <div className="gal-foot">
          <p>V1 had 283 submissions.</p>
          <a className="btn" href={LINKS.v1} {...ext}>Browse on Devpost</a>
        </div>
      </div>
    </section>
  );
}
