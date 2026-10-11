/* The drawing-set vocabulary every sheet shares: title block, dimension line,
   figure caption. All decoration is CSS or inline SVG. */

export const SHEETS = 7;
/* Latest revision already issued in the ledger (C: V2 registration opens). */
export const REV = "REV C · 2026.06";

/* Engineering title block, bottom-right of each sheet. Decorative: everything
   in it is already on the page. */
export function TitleBlock({ no, title }: { no: number; title: string }) {
  return (
    <div className="tblock" aria-hidden="true">
      <span>DSH Hacks V2</span>
      <span>Sheet {String(no).padStart(2, "0")} / {String(SHEETS).padStart(2, "0")}</span>
      <span>{title}</span>
      <span>{REV}</span>
      <span className="w">Scale 1:1 · AI × Healthcare · Online</span>
    </div>
  );
}

/* ◂──── LABEL ────▸ ; measures the width of whatever box it sits in. */
export function Dim({ label, className }: { label: string; className?: string }) {
  return (
    <div className={className ? `dim ${className}` : "dim"} aria-hidden="true">
      <span>{label}</span>
    </div>
  );
}

export function FigCaption({ no, title, note = "illustrative" }: { no: number; title: string; note?: string | null }) {
  return (
    <figcaption className="figcap">
      <span className="k">Fig. {no} —</span> <em>{title}</em>
      {note && <span className="n"> ({note})</span>}
    </figcaption>
  );
}
