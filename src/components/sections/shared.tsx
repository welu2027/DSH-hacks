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

/* Section heading. `align` varies the composition per section so the page
   doesn't repeat one template: centered, left, right, or split (title left,
   intro right). */
type Align = "center" | "left" | "right" | "split";
export function SectionHead({ id, eyebrow, children, sub, align = "center" }: {
  id: string; eyebrow: string; children: React.ReactNode; sub?: React.ReactNode; align?: Align;
}) {
  return (
    <header className={`sec-head ${align}`}>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={id} className="sec-title">{children}</h2>
      </div>
      {sub && <p className="sec-sub">{sub}</p>}
    </header>
  );
}
