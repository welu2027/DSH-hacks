/* eslint-disable @next/next/no-img-element */
import { ext } from "./shared";
import { FOUNDERS, STAFF, type Staff } from "./team";

const initials = (name: string) => name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();

/* an ID badge: lanyard slot and pass header, photo (or initials), name and role */
function card(s: Staff) {
  const body = (
    <>
      <span className="badge-k">DSH Hacks · {s.founder ? "Founder" : "Staff"}</span>
      <span className="person-photo">
        {s.img ? <img src={s.img} alt="" loading="lazy" /> : <span aria-hidden="true">{initials(s.name)}</span>}
      </span>
      <span className="person-meta">
        <span className="staff-n">{s.name}{s.href && <span className="person-go" aria-hidden="true"> ↗</span>}</span>
        <span className="staff-r">{s.role}</span>
        {s.org && <span className="pill">{s.org}</span>}
      </span>
    </>
  );
  return (
    <li key={s.name} className="rv">
      {s.href ? <a className={s.founder ? "person founder" : "person"} href={s.href} {...ext}>{body}</a> : <div className={s.founder ? "person founder" : "person"}>{body}</div>}
    </li>
  );
}

/* The organizing team, from team.ts: founders get their own row up top.
   Empty list → placeholder slots. */
/* The three youth-led orgs that co-host DSH Hacks. Logos in /public/orgs:
   DeltaForge from stemise.org/about/partners, the others from their sites.
   `mark` is the fallback monogram when there's no `logo`. */
type Org = { name: string; mark: string; blurb: string; href?: string; logo?: string };
const ORGS: Org[] = [
  { name: "DeltaForge Hacks", mark: "DF", blurb: "Youth-led hackathon organizers.", logo: "/orgs/deltaforge.webp" },
  { name: "NXT Horizon", mark: "NH", blurb: "Youth-led student organization.", href: "https://nxthorizon.org/", logo: "/orgs/nxthorizon.png" },
  { name: "STEMise", mark: "S", blurb: "Youth-led STEM education through hands-on kits and workshops.", href: "https://www.stemise.org/", logo: "/orgs/stemise.png" },
];

function org(o: Org) {
  const body = (
    <>
      <span className="org-mark" aria-hidden="true">{o.logo ? <img src={o.logo} alt="" loading="lazy" /> : o.mark}</span>
      <span className="org-meta">
        <span className="org-n">{o.name}{o.href && <span className="person-go" aria-hidden="true"> ↗</span>}</span>
        <span className="org-b">{o.blurb}</span>
      </span>
    </>
  );
  return (
    <li key={o.name} className="rv">
      {o.href ? <a className="card org" href={o.href} {...ext}>{body}</a> : <div className="card org">{body}</div>}
    </li>
  );
}

export default function Team() {
  return (
    <div id="team" className="team">
      <h3 className="band-k">Organizers</h3>
      <p className="team-h">Three student orgs, <em>one hackathon.</em></p>
      <ul className="orgs" aria-label="Organizing organizations">{ORGS.map(org)}</ul>
      <h3 className="band-k">Meet the team</h3>
      <p className="team-h">Run by students, <em>for students.</em></p>
        {STAFF.length ? (
          <>
            <p className="team-k">Founders</p>
            <ul className="founders" aria-label="Founders">{FOUNDERS.map(card)}</ul>
            <p className="team-k">Competition directors</p>
            <ul className="staff-grid">{STAFF.filter((s) => !s.founder && s.role !== "Hackathon Staff").map(card)}</ul>
            <p className="team-k">Hackathon staff</p>
            <ul className="staff-grid">{STAFF.filter((s) => s.role === "Hackathon Staff").map(card)}</ul>
          </>
        ) : (
          <ul className="staff-grid" aria-label="Staff profiles coming soon">
            {Array.from({ length: 4 }, (_, i) => (
              <li key={i} className="card staff-card empty" aria-hidden="true">
                <span className="staff-av" />
                <span className="staff-n">Coming soon</span>
                <span className="staff-r">Team profile</span>
              </li>
            ))}
          </ul>
        )}
    </div>
  );
}
