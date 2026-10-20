import DitherField from "@/components/art/DitherField";
import { LINKS, ext } from "./shared";

export default function Register() {
  return (
    <section id="register" className="section register" aria-labelledby="reg-h">
      <div className="art" aria-hidden="true"><DitherField className="reg-scan" seed={9} w={200} h={90} /></div>
      <div className="wrap reg-in">
        <h2 id="reg-h" className="reg-h rv">Your project goes here <em>next.</em></h2>
        <p className="reg-body rv">
          Register on Devpost, find a team in the Discord, and submit by November 14. Compete for
          prizes or just come for the workshops; either way you&apos;re in.
        </p>
        <div className="btn-row center rv">
          <a className="btn solid lg" href={LINKS.devpost} {...ext}>Register now</a>
          <a className="btn lg" href={LINKS.discord} {...ext}>Join the Discord</a>
        </div>
      </div>
    </section>
  );
}
