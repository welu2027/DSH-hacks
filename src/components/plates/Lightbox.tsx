"use client";

import { useEffect, useRef } from "react";
import type { Project } from "./projects";
import { PlateFrame, plateNo } from "./Plate";

type Props = {
  view: { list: Project[]; index: number } | null;
  onIndex: (i: number) => void;
  onClose: () => void;
};

export default function Lightbox({ view, onIndex, onClose }: Props) {
  const dlg = useRef<HTMLDialogElement>(null);
  const p = view ? view.list[view.index] : null;

  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    if (view && !d.open) d.showModal();
    if (!view && d.open) d.close();
  }, [view]);

  const step = (dir: number) => {
    if (!view) return;
    const n = view.list.length;
    onIndex((view.index + dir + n) % n);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
    else if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
  };

  return (
    <dialog
      ref={dlg}
      className="lightbox"
      aria-label={p ? `Project ${plateNo(p.no)}, ${p.t}` : "Project"}
      onClose={onClose}
      onKeyDown={onKey}
      onClick={(e) => { if (e.target === dlg.current) dlg.current?.close(); }}
    >
      {p && view && (
        <div className="lb-grid">
          <figure style={{ margin: 0 }}>
            <div className="lb-plate"><PlateFrame key={p.no} project={p} eager /></div>
          </figure>
          <div>
            <div className="lb-top">
              <span>Project {plateNo(p.no)}</span>
              <span>{view.index + 1} / {view.list.length}</span>
            </div>
            <h2 className="lb-title">{p.t}</h2>
            {p.d && <p className="lb-tag">{p.d}</p>}
            <dl className="spec">
              <div><dt>Track</dt><dd>{p.track}</dd></div>
              <div><dt>Built by</dt><dd>{p.by || "Unlisted"}</dd></div>
              <div><dt>Event</dt><dd>DSH Hacks V1, AI × STEM education</dd></div>
              <div><dt>Result</dt><dd>{p.winner ? "Winner" : "Submitted"}</dd></div>
            </dl>
            <div className="btn-row">
              <button type="button" className="btn sm" onClick={() => step(-1)}>Prev</button>
              <button type="button" className="btn sm" onClick={() => step(1)}>Next</button>
              <a className="btn sm solid" href={p.url} target="_blank" rel="noopener noreferrer">View on Devpost</a>
              <button type="button" className="btn sm" onClick={() => dlg.current?.close()}>Close</button>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
