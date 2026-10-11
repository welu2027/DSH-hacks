/* Fig. 2: patient signal → model → confidence gate → care, drawn as a
   schematic. Draws itself when its sheet scrolls in (CSS); the ECG pulse loops unless reduced
   motion. Callouts (.co) drop out on narrow screens. */
const ECG = "30,118 60,118 68,108 74,118 84,118 90,80 96,150 102,118 116,118 124,110 132,118 170,118";

export default function Pipeline() {
  return (
    <svg className="fig fig-pipe" viewBox="0 0 560 380" role="img" aria-label="Schematic: patient signal, to a model, to a confidence gate; high confidence goes to care, low goes to human review.">
      {/* dimension: measures signal box left edge to care box right edge */}
      <g className="ln thin">
        <line x1="20" y1="16" x2="20" y2="62" className="dash" />
        <line x1="540" y1="16" x2="540" y2="206" className="dash" />
        <line x1="20" y1="28" x2="216" y2="28" />
        <line x1="344" y1="28" x2="540" y2="28" />
        <path d="M20 28l8-3v6zM540 28l-8-3v6z" className="tip" />
      </g>
      <text x="280" y="31" className="tx" textAnchor="middle">SIGNAL → CARE</text>

      {/* 01 signal */}
      <text x="20" y="62" className="tx">01 PATIENT SIGNAL</text>
      <rect x="20" y="70" width="160" height="96" className="ln" />
      <polyline points={ECG} className="bl" />
      <polyline points={ECG} className="pulse" />

      <line x1="180" y1="118" x2="216" y2="118" className="ln" />
      <path d="M220 118l-8-3v6z" className="tip" />

      {/* 02 model */}
      <text x="220" y="62" className="tx">02 MODEL</text>
      <rect x="220" y="70" width="140" height="96" className="ln" />
      <g className="bl thin">
        {[92, 118, 144].flatMap((a) => [100, 136].map((b) => <line key={`a${a}${b}`} x1="250" y1={a} x2="290" y2={b} />))}
        {[100, 136].map((b) => <line key={`b${b}`} x1="290" y1={b} x2="330" y2="118" />)}
      </g>
      {[[250, 92], [250, 118], [250, 144], [290, 100], [290, 136], [330, 118]].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="3" className="dot" />
      ))}

      <line x1="290" y1="166" x2="290" y2="204" className="ln" />
      <path d="M290 208l-3-8h6z" className="tip" />

      {/* 03 gate */}
      <text x="300" y="200" className="tx">03 CONFIDENCE</text>
      <polygon points="290,210 346,250 290,290 234,250" className="ln" />
      <text x="290" y="254" className="tx tb" textAnchor="middle">CONF. ≥ τ ?</text>
      <line x1="20" y1="250" x2="228" y2="250" className="ln thin center" />

      {/* high → 04 care */}
      <line x1="346" y1="250" x2="396" y2="250" className="bl" />
      <path d="M400 250l-8-3v6z" className="tip b" />
      <text x="352" y="243" className="tx tb">HIGH</text>
      <text x="400" y="206" className="tx">04 CARE</text>
      <rect x="400" y="214" width="140" height="72" className="ln" />
      <path d="M470 270s-16-10-16-21a8.5 8.5 0 0 1 16-4 8.5 8.5 0 0 1 16 4c0 11-16 21-16 21z" className="bl" />

      {/* low → review */}
      <polyline points="290,290 290,340 184,340" className="ln dash" />
      <path d="M180 340l8-3v6z" className="tip" />
      <text x="296" y="318" className="tx">LOW</text>
      <rect x="20" y="316" width="160" height="48" className="ln dash" />
      <text x="100" y="344" className="tx" textAnchor="middle">HUMAN REVIEW</text>

      {/* callouts */}
      <g className="co">
        <circle cx="330" cy="118" r="2.5" className="dot b" />
        <polyline points="330,118 368,80 384,80" className="ln thin" />
        <text x="388" y="83" className="tx tb">A — DIAGNOSTIC TOOL</text>
        <circle cx="486" cy="286" r="2.5" className="dot b" />
        <polyline points="486,286 506,306 540,306" className="ln thin" />
        <text x="540" y="322" className="tx tb" textAnchor="end">B — FASTER CARE</text>
        <circle cx="96" cy="150" r="2.5" className="dot b" />
        <polyline points="96,150 116,176 124,176" className="ln thin" />
        <text x="128" y="179" className="tx tb">C — EARLY DETECTION</text>
      </g>
    </svg>
  );
}
