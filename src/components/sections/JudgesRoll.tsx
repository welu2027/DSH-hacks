"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { getPortrait } from "@/components/plates/source";
import { blit } from "@/components/plates/Plate";
import { JUDGES, type Judge } from "./judges";

/* Judges as rows of pills drifting in alternating directions (after the
   Hackathons @ Berkeley team band on calhacks.io). Portraits are dithered;
   hovering a pill pauses its row and develops the photo. */
type Filter = "All" | "V2" | "V1";
const ROWS = 3;
const SECONDS_PER_PILL = 6;

function Avatar({ src, live }: { src: string | null; live: boolean }) {
  const dith = useRef<HTMLCanvasElement>(null);
  const dev = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!src || !live) return;
    let on = true;
    getPortrait(src, 48).then((p) => {
      if (!on) return;
      blit(dith.current, p.dith, false);
      blit(dev.current, p.dev, true);
    });
    return () => {
      on = false;
    };
  }, [src, live]);
  return (
    <span className="av" aria-hidden="true">
      <canvas ref={dith} width={48} height={48} />
      <canvas ref={dev} className="dev" width={48} height={48} />
    </span>
  );
}

function Pill({ j, live }: { j: Judge; live: boolean }) {
  return (
    <li className="pill">
      <Avatar src={j.img} live={live} />
      <span className="pt">
        <span className="pn">{j.name}</span>
        {j.title && <span className="pr">{j.title}</span>}
      </span>
    </li>
  );
}

export default function JudgesRoll() {
  const [filter, setFilter] = useState<Filter>("V2");
  const [live, setLive] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  // draw portraits only once the band is near the viewport
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting)) {
        setLive(true);
        io.disconnect();
      }
    }, { rootMargin: "400px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

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
    <div className="roll" ref={root}>
      <div className="roll-rows">
        {rows.map((row, r) => (
          <div
            key={`${filter}-${r}`}
            className={r % 2 ? "roll-row rev" : "roll-row"}
            style={{ "--dur": `${Math.max(30, row.length * SECONDS_PER_PILL)}s` } as React.CSSProperties}
          >
            <div className="roll-track">
              <ul>{row.map((j) => <Pill key={j.name} j={j} live={live} />)}</ul>
              {/* second copy closes the loop; hidden from assistive tech */}
              <ul aria-hidden="true">{row.map((j) => <Pill key={j.name} j={j} live={live} />)}</ul>
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
