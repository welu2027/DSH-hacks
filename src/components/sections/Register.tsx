import { TitleBlock } from "@/components/blueprint/parts";
import Scene from "@/components/scene/Scene";
import { LINKS, ext } from "./shared";

export default function Register() {
  return (
    <section id="register" className="section sheet cyan" data-swing="">
      <div className="wrap">
        <div className="reg-grid">
          <div>
            <h2 className="reg-h" data-beat="">Your project goes here <em>next.</em></h2>
            <p className="reg-body">
              Register on Devpost, find a team in the Discord, and submit by November 14. Compete for
              prizes or just come for the workshops; either way you&apos;re in.
            </p>
            <div className="btn-row">
              <a className="btn solid" href={LINKS.devpost} {...ext}>Register now</a>
              <a className="btn" href={LINKS.discord} {...ext}>Join the Discord</a>
            </div>
          </div>
          {/* the next plate on the wall, still blank */}
          <div className="empty-plate" aria-hidden="true">
            <div className="ep-frame"><Scene kind="sapling" tone="cyan" labels={false} label="" /></div>
            <div className="dim"><span>4 : 5</span></div>
            <p className="ep-call">Your project · Pl. 284</p>
          </div>
        </div>
        <TitleBlock no={7} title="Register" />
      </div>
    </section>
  );
}
