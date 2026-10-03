"use client";

import { useEffect, useMemo, useState } from "react";
import { projects, TRACKS, type Project } from "./projects";
import Plate, { PlateFrame, plateLabel, plateNo } from "./Plate";
import { useOpenPlate } from "./PlatesProvider";

type Filter = "all" | "winners" | "featured" | (typeof TRACKS)[number];
const FILTERS: { id: Filter; label: string; test: (p: Project) => boolean }[] = [
  { id: "all", label: "All", test: () => true },
  { id: "winners", label: "Winners", test: (p) => p.winner },
  { id: "featured", label: "Featured", test: (p) => p.featured },
  ...TRACKS.map((t) => ({ id: t as Filter, label: t, test: (p: Project) => p.track === t })),
];

export default function Gallery() {
  const open = useOpenPlate();
  const [filter, setFilter] = useState<Filter>("winners");
  const [q, setQ] = useState("");
  const [view, setView] = useState<"wall" | "list">("wall");
  // render in batches: 8 on phones, 36 on larger screens
  const [batch, setBatch] = useState(36);
  const [limit, setLimit] = useState(36);
  useEffect(() => {
    const b = window.matchMedia("(max-width: 720px)").matches ? 8 : 36;
    setBatch(b);
    setLimit(b);
  }, []);
  useEffect(() => setLimit(batch), [filter, q, batch]);

  const shown = useMemo(() => {
    const f = FILTERS.find((x) => x.id === filter)!;
    const needle = q.trim().toLowerCase();
    return projects.filter(
      (p) => f.test(p) && (!needle || `${p.t} ${p.d} ${p.by} ${p.track}`.toLowerCase().includes(needle)),
    );
  }, [filter, q]);

  return (
    <div>
      <div className="gal-bar">
        <div className="btn-row" role="group" aria-label="Filter projects">
          {FILTERS.map((f) => (
            <button key={f.id} type="button" className="chip" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
              {f.label}<span className="k">{projects.filter(f.test).length}</span>
            </button>
          ))}
        </div>
        <div className="gal-tools">
          <label className="sr-only" htmlFor="plate-search">Search projects</label>
          <input
            id="plate-search"
            className="search"
            type="search"
            placeholder="Search title, team, track"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <div className="btn-row" role="group" aria-label="Layout">
            <button type="button" className="chip" aria-pressed={view === "wall"} onClick={() => setView("wall")}>Wall</button>
            <button type="button" className="chip" aria-pressed={view === "list"} onClick={() => setView("list")}>List</button>
          </div>
        </div>
      </div>

      <p className="status" aria-live="polite">Showing {shown.length} of {projects.length}</p>

      {shown.length === 0 ? (
        <p className="empty">No projects match &ldquo;{q}&rdquo;. Try a different word or clear the filter.</p>
      ) : view === "wall" ? (
        <ul className="wall" style={{ margin: 0, padding: 0 }}>
          {shown.slice(0, limit).map((p, i) => (
            <li key={p.no}>
              <Plate project={p} onOpen={() => open(shown, i)} />
            </li>
          ))}
        </ul>
      ) : (
        <ul className="list">
          {shown.slice(0, limit).map((p, i) => (
            <li key={p.no}>
              <button type="button" className="plate-btn" onClick={() => open(shown, i)} aria-label={plateLabel(p)}>
                <span className="no">{plateNo(p.no)}</span>
                <PlateFrame project={p} />
                <span className="t">{p.t}</span>
                <span className="d">{p.d}</span>
                <span className="tr">{p.track}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {shown.length > limit && (
        <button type="button" className="btn more" onClick={() => setLimit((l) => l + batch)}>
          Show more ({shown.length - limit} left)
        </button>
      )}
    </div>
  );
}
