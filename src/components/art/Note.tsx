/* A handwritten margin note with a hand-drawn arrow, like someone marked up
   the page. Decorative; the sentence it points at is already on the page. */
const ARROWS = {
  right: "M4 22c14-12 30-16 50-10M44 4l11 8-12 6",
  left: "M56 22C42 10 26 6 6 12M16 4 5 12l12 6",
  down: "M30 4c-10 14-12 30-2 48M20 44l8 10 9-9",
  up: "M30 56c10-14 12-30 2-48M22 16l9-10 8 10",
} as const;

export default function Note({ children, arrow, className, tilt = -4 }: {
  children: React.ReactNode; arrow: keyof typeof ARROWS; className: string; tilt?: number;
}) {
  return (
    <span className={`note note-${arrow} ${className}`} style={{ "--tilt": `${tilt}deg` } as React.CSSProperties} aria-hidden="true">
      <span className="note-t">{children}</span>
      <svg viewBox="0 0 60 60" className="note-a"><path d={ARROWS[arrow]} /></svg>
    </span>
  );
}
