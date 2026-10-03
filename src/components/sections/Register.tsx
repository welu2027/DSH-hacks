import { LINKS, ext } from "./shared";

export default function Register() {
  return (
    <section id="register" className="section" data-swing="">
      <div className="wrap">
        <h2 className="reg-h" data-beat="">Your project goes here next.</h2>
        <p className="reg-body">
          Register on Devpost, find a team in the Discord, and submit by November 7. Compete for
          prizes or just come for the workshops; either way you&apos;re in.
        </p>
        <div className="btn-row">
          <a className="btn solid" href={LINKS.devpost} {...ext}>Register now</a>
          <a className="btn" href={LINKS.discord} {...ext}>Join the Discord</a>
        </div>
      </div>
    </section>
  );
}
