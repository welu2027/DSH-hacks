"use client";

import { useMemo, useState } from "react";
import { JUDGES, type Judge } from "./judges";

/* Judges as rows of pills drifting in alternating directions (after the
   Hackathons @ Berkeley team band on calhacks.io). Hovering pauses a row. */
type Filter = "All" | "V2" | "V1";
const ROWS = 3;
const SECONDS_PER_PILL = 6;

/* eslint-disable-next-line @next/next/no-img-element */
const Avatar = ({ src }: { src: string | null }) =>
  src ? <img className="av" src={src} alt="" loading="lazy" /> : <span className="av" aria-hidden="true" />;

function Pill({ j }: { j: Judge }) {
  return (
    <li className="jpill">
      <Avatar src={j.img} />
      <span className="pt">
        <span className="pn">{j.name}</span>
        {j.title && <span className="pr">{j.title}</span>}
      </span>
    </li>
  );
}

export default function JudgesRoll() {
  const [filter, setFilter] = useState<Filter>("V2");
  const counts = useMemo(() => {
    const unique = new Set(JUDGES.map((j) => j.name)).size;
    return { All: unique, V2: JUDGES.filter((j) => j.v === "V2").length, V1: JUDGES.filter((j) => j.v === "V1").length };
  }, []);

  const rows = useMemo(() => {
    const seen = new Set<string>();
    const list = JUDGES.filter((j) => {
      if (filter !== "All") return j.v === filter;
      if (seen.has(j.name)) return false; // judged both years: list once
      seen.add(j.name);
      return true;
    });
    const out: Judge[][] = Array.from({ length: ROWS }, () => []);
    list.forEach((j, i) => out[i % ROWS].push(j));
    return out;
  }, [filter]);

  return (
    <div className="roll">
      <div className="roll-rows">
        {rows.map((row, r) => (
          <div
            key={`${filter}-${r}`}
            className={r % 2 ? "roll-row rev" : "roll-row"}
            style={{ "--dur": `${Math.max(30, row.length * SECONDS_PER_PILL)}s` } as React.CSSProperties}
          >
            <div className="roll-track">
              <ul>{row.map((j) => <Pill key={j.name} j={j} />)}</ul>
              {/* second copy closes the loop; hidden from assistive tech */}
              <ul aria-hidden="true">{row.map((j) => <Pill key={j.name} j={j} />)}</ul>
            </div>
          </div>
        ))}
      </div>
      <div className="btn-row roll-filters" role="group" aria-label="Filter judges">
        {(["V2", "V1", "All"] as Filter[]).map((f) => (
          <button key={f} type="button" className="chip" aria-pressed={filter === f} onClick={() => setFilter(f)}>
            {f === "All" ? "All judges" : `${f} judges`}<span className="k">{counts[f]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
