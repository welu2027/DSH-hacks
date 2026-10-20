/* eslint-disable @next/next/no-img-element */
import type { Project } from "./projects";

export const plateNo = (no: number) => String(no).padStart(3, "0");
export const plateLabel = (p: Project) => `Project ${plateNo(p.no)}, ${p.t}. Open.`;

/* The project's own image from Devpost (gallery shot, or its demo video's
   thumbnail). A few submissions have no media at all; they get a quiet
   "no image" frame. */
export function PlateFrame({ project, eager = false }: { project: Project; eager?: boolean }) {
  return (
    <div className="plate-frame">
      {project.featured && <span className="plate-tag">Featured</span>}
      {project.img ? (
        <img src={project.img} alt="" loading={eager ? "eager" : "lazy"} decoding="async" />
      ) : (
        <span className="plate-none">
          <img src="/illustrations/cell.svg" alt="" width={64} height={64} />
          <span>No image on Devpost</span>
        </span>
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
        <div className="m">{project.track}</div>
      </div>
    </button>
  );
}
