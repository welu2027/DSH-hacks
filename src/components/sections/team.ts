/* The DSH Hacks organizing team. Add one entry per person; `img` is a path
   under /public (e.g. "/staff/jane-doe.jpg") or null for initials. `org` is
   which host they're with. While STAFF is empty the section shows
   placeholder slots. */
export type Staff = {
  name: string;
  role: string;
  org?: "DeltaForge Hacks" | "NXT Horizon" | "STEMise";
  img: string | null;
  href?: string; // LinkedIn or personal site
  founder?: boolean; // gets the founder badge and a gold ring
};

export const STAFF: Staff[] = [
  // { name: "Jane Doe", role: "Lead organizer", org: "STEMise", img: "/staff/jane-doe.jpg", href: "https://www.linkedin.com/in/..." },
  // headshots: stemise.org/about (Ryan, Karam, Adithya), wenhao-lu.com (Wenhao), LinkedIn (Abhiram)
  { name: "Ryan Ahn", role: "Co-Founder · Lead Competition Director", img: "/staff/ryan-ahn.webp", founder: true },
  { name: "Wenhao Lu", role: "Co-Founder · Lead Competition Director", img: "/staff/wenhao-lu.jpg", href: "https://www.wenhao-lu.com/", founder: true },
  { name: "Abhiram Jetty", role: "Co-Founder · Lead Competition Director", img: "/staff/abhiram-jetty.jpg", href: "https://www.linkedin.com/in/abhiramjetty/", founder: true },
  { name: "Karam Gill", role: "Lead Competition Director", img: "/staff/karam-gill.webp" },
  { name: "Adithya Balakumar", role: "Lead Competition Director", img: "/staff/adithya-balakumar.webp" },
];
