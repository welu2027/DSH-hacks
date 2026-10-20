/* eslint-disable @next/next/no-img-element */
import { Piece } from "@/components/art/Art";
import { SectionHead, ext } from "./shared";
import { STAFF } from "./team";

const initials = (name: string) => name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();

/* The organizing team, from team.ts. Empty list → placeholder slots. */
export default function Staff() {
  return (
    <section id="staff" className="section staff" aria-labelledby="staff-h">
      <div className="art" aria-hidden="true">
        <Piece src="robot-helper" w={260} h={330} className="staff-robot" depth="mid" float={7} />
      </div>
      <div className="wrap">
        <SectionHead id="staff-h" eyebrow="Staff" align="left" sub="The students behind DSH Hacks, from DeltaForge Hacks, NXT Horizon, and STEMise.">
          Meet the <em>team</em>
        </SectionHead>
        {STAFF.length ? (
          <ul className="staff-grid">
            {STAFF.map((s) => {
              const body = (
                <>
                  {s.img
                    ? <img className="staff-av" src={s.img} alt="" loading="lazy" />
                    : <span className="staff-av" aria-hidden="true">{initials(s.name)}</span>}
                  <span className="staff-n">{s.name}</span>
                  <span className="staff-r">{s.role}</span>
                  {s.org && <span className="pill">{s.org}</span>}
                </>
              );
              return (
                <li key={s.name} className="rv">
                  {s.href ? <a className="card staff-card" href={s.href} {...ext}>{body}</a> : <div className="card staff-card">{body}</div>}
                </li>
              );
            })}
          </ul>
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
    </section>
  );
}
