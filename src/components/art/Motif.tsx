/* Line-art theme motifs, one stroke weight for both sets so they read as a
   family. Ink is currentColor (DSH blue); `.acc` strokes take the section's
   --accent. V2 (healthcare) motifs belong only in the V2 section. */
const MOTIFS = {
  // V2 · AI × Healthcare
  pulse: (
    <>
      <path className="acc" d="M4 70h20l6-14 6 26 8-50 8 64 6-26h12" />
      <path d="M72 70 90 40M72 70l24 6M72 70l18 30M90 40l22-10M90 40l6 36M96 76l18-6M90 100l6-24" />
      {[[90, 40], [96, 76], [90, 100], [112, 30], [114, 70]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="4" />)}
    </>
  ),
  cells: (
    <>
      <circle className="acc" cx="60" cy="60" r="16" />
      <circle className="acc" cx="64" cy="56" r="4" />
      <path d="M47 51 30 36M74 51l18-16M73 70l20 16M46 69 30 84" />
      <circle cx="24" cy="30" r="8" /><circle cx="98" cy="28" r="9" /><circle cx="100" cy="92" r="8" /><circle cx="25" cy="90" r="10" />
    </>
  ),
  molecule: (
    <>
      <path className="acc" d="M54 38 74 50v24L54 86 34 74V50Z" />
      <path d="M74 50 94 38M94 38l14 8M94 38V20M34 74 18 84M54 86v18" />
      {[[94, 38], [108, 46], [94, 20], [18, 84], [54, 104]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="4" />)}
    </>
  ),
  // V1 · AI × STEM Education
  atom: (
    <>
      <ellipse cx="60" cy="60" rx="46" ry="16" />
      <ellipse cx="60" cy="60" rx="46" ry="16" transform="rotate(60 60 60)" />
      <ellipse cx="60" cy="60" rx="46" ry="16" transform="rotate(120 60 60)" />
      <circle className="acc" cx="60" cy="60" r="6" />
    </>
  ),
  book: (
    <>
      <path d="M60 34C46 26 26 26 12 30v62c14-4 34-4 48 4 14-8 34-8 48-4V30c-14-4-34-4-48 4Zm0 0v62M22 44c10-2 20-1 28 2M22 56c10-2 20-1 28 2" />
      <path className="acc" d="M70 46h16l6 6h8M70 60h10l6-6M70 74h22" />
      <circle className="acc" cx="100" cy="52" r="3" /><circle className="acc" cx="92" cy="74" r="3" />
    </>
  ),
  beaker: (
    <>
      <path d="M44 16h32M50 16v30L26 98a6 6 0 0 0 5 8h58a6 6 0 0 0 5-8L70 46V16" />
      <path className="acc" d="M36 78c8-4 16 4 24 0s16-4 24 0" />
      <circle className="acc" cx="54" cy="66" r="3" /><circle className="acc" cx="64" cy="56" r="2.5" /><circle className="acc" cx="58" cy="92" r="3" />
    </>
  ),
  bulb: (
    <>
      <path d="M60 14a32 32 0 0 0-19 57c4 4 6 9 6 15h26c0-6 2-11 6-15a32 32 0 0 0-19-57ZM48 96h24M52 106h16" />
      <path className="acc" d="m48 50 14-8 10 14-14 10Zm14-8 10 14" />
      {[[48, 50], [62, 42], [72, 56], [58, 66]].map(([x, y]) => <circle key={`${x}${y}`} className="acc" cx={x} cy={y} r="3" />)}
    </>
  ),
} as const;

export type MotifName = keyof typeof MOTIFS;

export default function Motif({ name, className = "" }: { name: MotifName; className?: string }) {
  return (
    <svg className={`motif ${className}`} viewBox="0 0 120 120" aria-hidden="true">
      {MOTIFS[name]}
    </svg>
  );
}
