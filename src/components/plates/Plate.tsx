"use client";

import { useEffect, useRef } from "react";
import type { Project } from "./projects";
import { getPlate } from "./source";

export const plateNo = (no: number) => String(no).padStart(2, "0");
export const plateLabel = (p: Project) => `Project ${plateNo(p.no)}, ${p.t}. Open.`;

/* Copy a cached source canvas into a mounted one. */
export function blit(dst: HTMLCanvasElement | null, src: HTMLCanvasElement, smooth: boolean) {
  if (!dst) return;
  dst.width = src.width;
  dst.height = src.height;
  dst.style.imageRendering = smooth ? "auto" : "pixelated";
  dst.getContext("2d")!.drawImage(src, 0, 0);
}

/* 4:5 frame with the dithered plate and its developed copy stacked; renders
   only once it comes within 300px of the viewport. */
export function PlateFrame({ project, w = 128, h = 160 }: { project: Project; w?: number; h?: number }) {
  const frame = useRef<HTMLDivElement>(null);
  const dith = useRef<HTMLCanvasElement>(null);
  const dev = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    let live = true;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        getPlate(project, w, h).then((src) => {
          if (!live) return;
          blit(dith.current, src.dith, false);
          blit(dev.current, src.dev, src.real);
        });
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => {
      live = false;
      io.disconnect();
    };
  }, [project, w, h]);

  return (
    <div ref={frame} className="plate-frame">
      {project.featured && <span className="plate-tag">Featured</span>}
      <canvas ref={dith} width={w} height={h} />
      <canvas ref={dev} className="dev" width={w} height={h} />
    </div>
  );
}

export default function Plate({ project, onOpen, caption = true }: { project: Project; onOpen: () => void; caption?: boolean }) {
  return (
    <button type="button" className="plate-btn" onClick={onOpen} aria-label={plateLabel(project)}>
      <PlateFrame project={project} />
      {caption && (
        <div className="plate-cap" aria-hidden="true">
          <div className="t">{project.t}</div>
          <div className="m">No. {plateNo(project.no)} / {project.track}</div>
        </div>
      )}
    </button>
  );
}
