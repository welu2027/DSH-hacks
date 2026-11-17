import { LINKS, ext } from "./shared";

/* The final CTA on the navy contour map. One light switches on as you
   arrive — yours. */
export default function Register() {
  return (
    <section id="register" className="section register" aria-labelledby="reg-h">
      <div className="wrap reg-in">
        <h2 id="reg-h" className="reg-h rv">Your project goes here <em>next.</em><i className="yours rv" aria-hidden="true" /></h2>
        <p className="reg-body rv">
          V2 is in judging, and winners are announced on Devpost November 23. Join the Discord to
          hear first when V3 opens, and start thinking about the person you&apos;ll build for.
        </p>
        <div className="btn-row center rv">
          <a className="btn solid lg" href={LINKS.discord} {...ext}>Join the Discord</a>
          <a className="btn lg" href={LINKS.gallery} {...ext}>See V2 projects</a>
        </div>
      </div>
    </section>
  );
}
