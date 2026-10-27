import { LINKS, ext } from "./shared";

/* The valley floor: below the cloud layer at dusk, among the lights that
   came down from the sky. One more switches on as you arrive — yours. */
export default function Register() {
  return (
    <section id="register" className="section register" data-stop="Valley floor" aria-labelledby="reg-h">
      <div className="wrap reg-in">
        <h2 id="reg-h" className="reg-h rv">Your project goes here <em>next.</em><i className="yours rv" aria-hidden="true" /></h2>
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
