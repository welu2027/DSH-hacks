/* eslint-disable @next/next/no-img-element */
import { PiDiscordLogoDuotone, PiInstagramLogoDuotone, PiLinkedinLogoDuotone, PiYoutubeLogoDuotone } from "react-icons/pi";
import Terminal from "@/components/Terminal";
import { LINKS, ext } from "./shared";

const SOCIAL = [
  ["Discord", LINKS.discord, PiDiscordLogoDuotone],
  ["YouTube", LINKS.youtube, PiYoutubeLogoDuotone],
  ["Instagram", LINKS.instagram, PiInstagramLogoDuotone],
  ["LinkedIn", LINKS.linkedin, PiLinkedinLogoDuotone],
] as const;

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <div className="brand">
              <img src="/dsh-logo-96.png" width={34} height={34} alt="" />
              <span>DSH Hacks</span>
            </div>
            <p className="foot-tag">Technology, brought down to earth.</p>
            <p className="mute">DeltaForge Hacks × NXT Horizon × STEMise</p>
            <ul className="social">
              {SOCIAL.map(([name, href, Icon]) => (
                <li key={name}><a href={href} aria-label={name} {...ext}><Icon size={20} /></a></li>
              ))}
            </ul>
          </div>
          <div>
            <h3>V2 · Healthcare</h3>
            <ul>
              <li><a href={LINKS.gallery} {...ext}>Projects ↗</a></li>
              <li><a href="#prizes">Prizes</a></li>
              <li><a href={LINKS.rules} {...ext}>Rules ↗</a></li>
              <li><a href={LINKS.flyer} {...ext}>Flyer ↗</a></li>
            </ul>
          </div>
          <div>
            <h3>The series</h3>
            <ul>
              <li><a href="#journey">Journey</a></li>
              <li><a href={LINKS.v1} {...ext}>V1 projects ↗</a></li>
              <li><a href="#people">Team</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>
        </div>
        <div className="foot-bar">
          <span>© 2026 DSH Hacks · Online, global</span>
          <span className="made">Made by students, for students.</span>
          <Terminal />
        </div>
      </div>
      {/* the wordmark, cropped by the bottom edge */}
      <p className="foot-mark" aria-hidden="true">DSH Hacks</p>
    </footer>
  );
}
