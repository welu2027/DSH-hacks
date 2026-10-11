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

/* Sheet label row (No. 0X ── NAME ──── meta) over the big serif title. The
   title is a beat on the trace. */
export function SectionHead({ no, title, name = title, meta }: { no: string; title: string; name?: string; meta?: string }) {
  return (
    <div className="sec-head">
      <div className="sheet-label">
        <span>No. {no}</span>
        <i className="draw-x" />
        <span>{name}</span>
        {meta && <><i className="draw-x" /><span>{meta}</span></>}
      </div>
      <h2 className="sec-title" data-beat="">{title}</h2>
    </div>
  );
}
