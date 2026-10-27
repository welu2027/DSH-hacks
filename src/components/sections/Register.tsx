import { RIDGES, VB_H, VB_W } from "@/components/hero/ridges";
import { LINKS, ext } from "./shared";

/* The valley floor: the town ridge again, now close, with the lights that
   came down from the sky. One more switches on as you arrive — yours. */
const LIGHTS = Array.from({ length: 34 }, (_, i) => {
  const x = (i * 37 + 11) % 100, y = 24 + ((i * 53) % 60);
  return { left: `${x}%`, top: `${y}%`, s: 2 + (i % 3) };
});

function Valley() {
  const town = RIDGES[RIDGES.length - 1];
  return (
    <div className="valley" aria-hidden="true">
      <svg viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="none"><path d={town.d} /></svg>
      <div className="lights">
        {LIGHTS.map((l, i) => <i key={i} style={{ left: l.left, top: l.top, width: l.s, height: l.s }} />)}
        <i className="yours rv" />
      </div>
    </div>
  );
}

export default function Register() {
  return (
    <section id="register" className="section register" aria-labelledby="reg-h">
      <Valley />
      <div className="wrap reg-in">
        <h2 id="reg-h" className="reg-h rv">Your project goes here <em>next.</em></h2>
        <p className="reg-body rv">
          Pick a person to build for. Register on Devpost, find a team in the Discord, and submit
          by November 14. Compete for prizes or just come for the workshops; either way you&apos;re in.
        </p>
        <div className="btn-row center rv">
          <a className="btn solid lg" href={LINKS.devpost} {...ext}>Register now</a>
          <a className="btn lg" href={LINKS.discord} {...ext}>Join the Discord</a>
        </div>
      </div>
    </section>
  );
}
