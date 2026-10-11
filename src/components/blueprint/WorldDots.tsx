import DottedMap from "dotted-map";

/* Fig. 2: the world as a dot grid, rendered at build time. The lit dots are a
   fixed pseudo-random scatter, not real participant locations; the caption
   says (illustrative). */
const pts = new DottedMap({ height: 44, grid: "diagonal" }).getPoints();
const W = Math.max(...pts.map((p) => p.x)) + 1;
const H = Math.max(...pts.map((p) => p.y)) + 1;
const lit = (i: number) => ((i * 2654435761) >>> 0) % 17 === 0;

export default function WorldDots() {
  return (
    <svg className="fig fig-world" viewBox={`-1 -1 ${W + 1} ${H + 1}`} aria-hidden="true">
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={lit(i) ? 0.42 : 0.26} className={lit(i) ? "on" : undefined} />
      ))}
    </svg>
  );
}
