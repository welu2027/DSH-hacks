const ITEMS: [no: string, title: string, href: string, count?: string][] = [
  ["01", "About", "#about"],
  ["02", "Projects", "#projects", "283 submissions"],
  ["03", "Schedule", "#schedule", "5 stages"],
  ["04", "Prizes", "#prizes"],
  ["05", "People", "#people", "sponsors, judges"],
  ["06", "FAQ", "#faq"],
];

/* The drawing index: SHEET 01 ······ About    meta */
export default function Index() {
  return (
    <nav className="index" aria-label="Contents">
      <div className="wrap">
        <p className="label index-h">Drawing index</p>
        <ol>
          {ITEMS.map(([no, t, href, c]) => (
            <li key={no}>
              <a href={href}>
                <span className="num">Sheet {no}</span>
                <span className="t">{t}</span>
                <span className="leader" aria-hidden="true" />
                {c && <span className="c">{c}</span>}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
