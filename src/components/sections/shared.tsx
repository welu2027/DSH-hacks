export const LINKS = {
  devpost: "https://dsh-hacks-v2.devpost.com/",
  rules: "https://dsh-hacks-v2.devpost.com/rules",
  discord: "https://discord.gg/3HgSzbYPx5",
  youtube: "https://www.youtube.com/@DSHHacks",
  instagram: "https://www.instagram.com/dshhacksv1/",
  linkedin:
    "https://www.linkedin.com/posts/stemise_stemise-highschool-hackathon-activity-7444950300852973572-mtY-?utm_source=share&utm_medium=member_desktop&rcm=ACoAAF8a_J8BBFD-8QjBjyPkx4PzxZKaZ80DEi8",
  flyer: "/dsh-hacks-v2-flyer.pdf",
  v1: "https://dsh-hacks-v1.devpost.com/project-gallery",
};

export const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

/* Section heading: numbered mono eyebrow, a serif title with one italic
   phrase, an optional mono fact strip (`·`-separated) and an intro. */
type Align = "left" | "split";
export function SectionHead({ id, no, eyebrow, children, meta, sub, align = "left" }: {
  id: string; no: string; eyebrow: string; children: React.ReactNode; meta?: string[]; sub?: React.ReactNode; align?: Align;
}) {
  return (
    <header className={`sec-head ${align}`}>
      <div>
        <p className="eyebrow"><span>{no}</span> — {eyebrow}<span className="alt"> · ALT {(2400 - Number(no) * 200).toLocaleString("en-US")} M</span></p>
        <h2 id={id} className="sec-title">{children}</h2>
        {meta && <p className="strip">{meta.join(" · ")}</p>}
      </div>
      {sub && <p className="sec-sub">{sub}</p>}
    </header>
  );
}
