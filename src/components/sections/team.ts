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
};

export const STAFF: Staff[] = [
  // { name: "Jane Doe", role: "Lead organizer", org: "STEMise", img: "/staff/jane-doe.jpg", href: "https://www.linkedin.com/in/..." },
];
