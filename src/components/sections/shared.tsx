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

/* "No. 0X" in the left column, serif title with a ghost outline after it.
   The title is a beat on the trace. */
export function SectionHead({ no, title }: { no: string; title: string }) {
  return (
    <div className="sec-head">
      <span className="sec-no">No. {no}</span>
      <h2 className="sec-title" data-beat="">
        {title}
        <span className="ghost-dup" aria-hidden="true">{title}</span>
      </h2>
    </div>
  );
}
