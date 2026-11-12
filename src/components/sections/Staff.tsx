/* eslint-disable @next/next/no-img-element */
import { ext } from "./shared";
import { FOUNDERS, STAFF, type Staff } from "./team";

const initials = (name: string) => name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();

/* a portrait card: photo (or initials) on top, name and role below */
function card(s: Staff) {
  const body = (
    <>
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
      {s.href ? <a className="person" href={s.href} {...ext}>{body}</a> : <div className="person">{body}</div>}
    </li>
  );
}

/* The organizing team, from team.ts: founders get their own row up top.
   Empty list → placeholder slots. */
export default function Team() {
  return (
    <div id="team" className="team">
      <h3 className="band-k">Meet the team</h3>
      <p className="team-h">Run by students, <em>for students.</em></p>
      <p className="sec-note left">The students behind DSH Hacks, from DeltaForge Hacks, NXT Horizon, and STEMise.</p>
        {STAFF.length ? (
          <>
            <p className="team-k">Founders</p>
            <ul className="founders" aria-label="Founders">{FOUNDERS.map(card)}</ul>
            <p className="team-k">Competition directors</p>
            <ul className="staff-grid">{STAFF.filter((s) => !s.founder).map(card)}</ul>
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
