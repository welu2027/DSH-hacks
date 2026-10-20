/* The DSH Hacks series. Edit this file to announce V3's theme or dates;
   never fill in anything that hasn't been announced (use "TBA"). */
export type Rendition = {
  version: string;
  theme: string;
  status: "completed" | "live" | "upcoming";
  stats: string[];
  links: { label: string; href: string }[];
};

export const RENDITIONS: Rendition[] = [
  {
    version: "V1", theme: "AI × STEM Education", status: "completed",
    stats: ["1,294 participants", "283 projects"],
    links: [{ label: "View projects ↗", href: "https://dsh-hacks-v1.devpost.com/project-gallery" }],
  },
  {
    version: "V2", theme: "AI × Healthcare", status: "live",
    stats: ["$100,000+ in prizes", "Closes Nov 14"],
    links: [{ label: "Register ↗", href: "https://dsh-hacks-v2.devpost.com/" }],
  },
  { version: "V3", theme: "TBA", status: "upcoming", stats: [], links: [] },
];

/* Where the series is heading beyond the online hackathon. Keep these
   "coming soon" until there's something real to announce (dates, cities). */
export type Initiative = { key: "chapters" | "inperson" | "global"; title: string; text: string };

export const BEYOND: Initiative[] = [
  { key: "chapters", title: "DSH Chapters", text: "Student-run DSH Hacks chapters at schools and in cities, bringing the series to local communities." },
  { key: "inperson", title: "In-person hackathons", text: "Hackathons in the same room: the same free entry and real problems, with teammates across the table." },
  { key: "global", title: "Global events", text: "Workshops, speaker sessions and project showcases with partners around the world." },
];
