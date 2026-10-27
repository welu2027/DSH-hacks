/* eslint-disable @next/next/no-img-element */
import { IconBrandDiscord, IconBrandInstagram, IconBrandLinkedin, IconBrandYoutube } from "@tabler/icons-react";
import Terminal from "@/components/Terminal";
import { LINKS, ext } from "./shared";

const SOCIAL = [
  ["Discord", LINKS.discord, IconBrandDiscord],
  ["YouTube", LINKS.youtube, IconBrandYoutube],
  ["Instagram", LINKS.instagram, IconBrandInstagram],
  ["LinkedIn", LINKS.linkedin, IconBrandLinkedin],
] as const;

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <div className="brand">
              <img src="/dsh-logo-circle.png" width={34} height={34} alt="" />
              <span>DSH Hacks</span>
            </div>
            <p className="mute">DeltaForge Hacks × NXT Horizon × STEMise</p>
            <ul className="social">
              {SOCIAL.map(([name, href, Icon]) => (
                <li key={name}><a href={href} aria-label={name} {...ext}><Icon size={20} stroke={1.5} /></a></li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Hackathon</h3>
            <ul>
              <li><a href={LINKS.devpost} {...ext}>Register</a></li>
              <li><a href={LINKS.rules} {...ext}>Rules</a></li>
              <li><a href={LINKS.flyer} {...ext}>Flyer</a></li>
              <li><a href="#prizes">Prizes</a></li>
              <li><a href="#sponsors">Sponsors and judges</a></li>
            </ul>
          </div>
          <div>
            <h3>Community</h3>
            <ul>
              <li><a href={LINKS.discord} {...ext}>Discord</a></li>
              <li><a href={LINKS.youtube} {...ext}>YouTube</a></li>
              <li><a href={LINKS.instagram} {...ext}>Instagram</a></li>
              <li><a href={LINKS.linkedin} {...ext}>LinkedIn</a></li>
              <li><a href={LINKS.v1} {...ext}>V1 projects</a></li>
            </ul>
          </div>
        </div>
        <div className="foot-bar">
          <span>© 2026 DSH Hacks · Online, global</span>
          <span className="made">Made with <span aria-label="love">♥</span> by students, for everyone, everywhere.</span>
          <Terminal />
        </div>
      </div>
    </footer>
  );
}
