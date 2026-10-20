/* eslint-disable @next/next/no-img-element */


/* The "floating city of care" vocabulary. Static pieces live in
   /public/illustrations; the ones that move are inline here. Everything is
   decorative and hidden from assistive tech. `depth` feeds Parallax. */

type Depth = "far" | "mid" | "near" | "fixed";
const DEPTH: Record<Depth, number> = { far: 0.18, mid: 0.1, near: 0.04, fixed: 0 };

/* A placed illustration. The outer span takes the parallax transform, the
   image takes the idle float, so the two never fight over `transform`. */
export function Piece({ src, w, h, className, depth = "near", float = 0 }: {
  src: string; w: number; h: number; className: string; depth?: Depth; float?: number;
}) {
  return (
    <span className={`piece ${className}`} data-depth={DEPTH[depth]} aria-hidden="true">
      <img
        src={`/illustrations/${src}.svg`} width={w} height={h} alt="" loading="lazy" decoding="async"
        className={float ? "float" : undefined}
        style={float ? ({ "--fd": `${float}s` } as React.CSSProperties) : undefined}
      />
    </span>
  );
}

/* Ribbons: flat bands (a bloodstream / data stream) that bleed across
   section edges. Each is a closed band; `edge` is its upper edge, where an
   ECG pulse runs. Stretched to their box, so strokes are non-scaling. */
const RIBBONS = {
  sweep: {
    vb: "0 0 1440 900",
    band: "M1440 80C1100 120 900 380 600 470S120 640 0 820L0 900C140 760 420 650 680 570S1160 270 1440 220Z",
    edge: "M1440 80C1100 120 900 380 600 470S120 640 0 820",
  },
  arc: {
    vb: "0 0 1440 400",
    band: "M0 210C400 40 1000 60 1440 300L1440 390C1000 170 420 150 0 300Z",
    edge: "M0 210C400 40 1000 60 1440 300",
  },
  orbit: {
    vb: "0 0 1440 520",
    band: "M-40 430C220 80 1220 80 1480 430L1480 500C1220 170 220 170 -40 500Z",
    edge: "M-40 430C220 80 1220 80 1480 430",
  },
  cascade: {
    vb: "0 0 400 1000",
    band: "M240 0C420 220 40 420 240 620S380 860 260 1000L170 1000C280 860 120 760 150 620C190 420 330 220 150 0Z",
    edge: "M240 0C420 220 40 420 240 620S380 860 260 1000",
  },
  veil: {
    vb: "0 0 1440 480",
    band: "M0 300C360 160 720 420 1080 290S1440 180 1440 180L1440 330C1080 450 720 250 360 390S0 430 0 430Z",
    edge: "M0 300C360 160 720 420 1080 290S1440 180 1440 180",
  },
  drift: {
    vb: "0 0 1440 520",
    band: "M0 80C420 220 860 0 1440 300L1440 420C860 140 420 340 0 200Z",
    edge: "M0 80C420 220 860 0 1440 300",
  },
} as const;

export function Ribbon({ kind, className, depth = "mid" }: { kind: keyof typeof RIBBONS; className: string; depth?: Depth }) {
  const r = RIBBONS[kind];
  return (
    <span className={`ribbon ${className}`} data-depth={DEPTH[depth]} aria-hidden="true">
      <svg viewBox={r.vb} preserveAspectRatio="none">
        <path d={r.band} fill="#F3F3FE" stroke="#CED0FA" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <path d={r.edge} fill="none" stroke="#A9ADF6" strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
        <path d={r.edge} className="ribbon-pulse" pathLength={1000} vectorEffect="non-scaling-stroke" />
      </svg>
    </span>
  );
}

/* Data-constellation field: dots, short dashes and a few faint links,
   seeded so server and client draw the same field. */
function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function Dust({ seed, count = 90, className }: { seed: number; count?: number; className: string }) {
  const r = rng(seed);
  const pts = Array.from({ length: count }, () => ({
    x: Math.round(r() * 1000), y: Math.round(r() * 600), s: r(), o: 0.25 + r() * 0.5, dash: r() < 0.22,
  }));
  const links = pts.slice(0, 18).map((p, i) => [p, pts[(i * 7 + 3) % 18]] as const)
    .filter(([a, b]) => Math.hypot(a.x - b.x, a.y - b.y) < 220);
  return (
    <span className={`dust ${className}`} data-depth={DEPTH.far} aria-hidden="true">
      <svg viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
        {links.map(([a, b], i) => (
          <line key={`l${i}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#6C72EF" strokeOpacity=".16" />
        ))}
        {pts.map((p, i) =>
          p.dash ? (
            <line key={i} x1={p.x} y1={p.y} x2={p.x + 4 + p.s * 6} y2={p.y} stroke="#6C72EF" strokeOpacity={p.o} strokeWidth="1.5" strokeLinecap="round" />
          ) : (
            <circle key={i} cx={p.x} cy={p.y} r={0.8 + p.s * 1.8} fill="#6C72EF" fillOpacity={p.o} />
          ),
        )}
      </svg>
    </span>
  );
}

/* Rays behind the sponsor garden. */
export function Burst({ className }: { className: string }) {
  const r = rng(7);
  return (
    <span className={`burst ${className}`} data-depth={DEPTH.far} aria-hidden="true">
      <svg viewBox="-300 -300 600 600">
        {Array.from({ length: 64 }, (_, i) => {
          const a = (i / 64) * Math.PI * 2, r0 = 60 + r() * 30, r1 = 170 + r() * 120;
          const c = Math.cos(a), s = Math.sin(a);
          return <line key={i} x1={c * r0} y1={s * r0} x2={c * r1} y2={s * r1} stroke="#6C72EF" strokeOpacity={0.15 + r() * 0.25} />;
        })}
      </svg>
    </span>
  );
}
