const ENTRIES: { date: string; v: string; text: string; next?: boolean }[] = [
  { date: "2026.11.23", v: "V2", text: "Winners announced on Devpost after a week of judging." },
  { date: "2026.11.14", v: "V2", text: "Submissions close at 11:45pm PST.", next: true },
  { date: "2026.06.24", v: "V2", text: "Registration opens on AI × Healthcare, with $100,000+ in prizes." },
  { date: "2026.06.15", v: "V1", text: "283 projects submitted; 80+ judges from Microsoft, Apple, Amazon, Meta, PayPal and more." },
  { date: "2026.05.20", v: "V1", text: "The first DSH Hacks opens on AI × STEM education. 1,294 students sign up." },
];

export default function Ledger() {
  return (
    <section id="ledger" className="section sheet" data-swing="" aria-labelledby="ledger-h">
      <div className="wrap">
        <div className="sec-head">
          <div className="sheet-label">
            <span>Ledger</span>
            <i className="draw-x" />
            <span>Revisions</span>
          </div>
          <h2 id="ledger-h" className="sec-title" data-beat="">So far</h2>
        </div>
        <div className="ledger-head label" aria-hidden="true"><span>Rev</span><span>Date</span><span>Ver</span><span>Description</span></div>
        <ol className="ledger" reversed>
          {ENTRIES.map((e, i) => (
            <li key={e.text} className={e.next ? "next" : undefined} data-node={e.next ? "big" : ""}>
              <span className="rev">{String.fromCharCode(64 + ENTRIES.length - i)}</span>
              <span className="date">{e.date}</span>
              <span className="v">{e.v}</span>
              <p>{e.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
