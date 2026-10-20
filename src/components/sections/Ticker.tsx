const ITEMS = [
  "AI × Healthcare", "Online & global", "Students 13+", "Free to enter",
  "$100,000+ in prizes", "80+ countries", "Submissions close Nov 14",
];

/* Seamless loop: two identical runs, the second hidden from assistive tech. */
export default function Ticker() {
  const run = (dup: boolean) => (
    <ul className="ticker-run" aria-hidden={dup || undefined}>
      {ITEMS.map((t) => (
        <li key={t}>{t}<span className="star" aria-hidden="true">✦</span></li>
      ))}
    </ul>
  );
  return (
    <div className="ticker" role="region" aria-label="Key facts">
      <div className="ticker-track">
        {run(false)}
        {run(true)}
      </div>
    </div>
  );
}
