/* eslint-disable @next/next/no-img-element */
import type { Project } from "./projects";

export const plateLabel = (p: Project) => `${p.t}. Open project.`;

/* The project's own image from Devpost (gallery shot, or its demo video's
   thumbnail), tagged with its edition. A few submissions
   have no media at all; they get the contour map and their title. */
export function PlateFrame({ project, eager = false }: { project: Project; eager?: boolean }) {
  return (
    <div className="plate-frame">
      <span className={`plate-v ${project.v.toLowerCase()}`}>{project.featured ? `${project.v} · Featured` : project.v}</span>
      {project.img ? (
        <img src={project.img} alt="" loading={eager ? "eager" : "lazy"} decoding="async" />
      ) : (
        <span className="plate-none">{project.t}</span>
      )}
    </div>
  );
}

export default function Plate({ project, onOpen }: { project: Project; onOpen: () => void }) {
  return (
    <button type="button" className="plate-btn" onClick={onOpen} aria-label={plateLabel(project)}>
      <PlateFrame project={project} />
      <div className="plate-cap" aria-hidden="true">
        <div className="t">{project.t}</div>
        <div className="m">{project.by}</div>
      </div>
    </button>
  );
}
