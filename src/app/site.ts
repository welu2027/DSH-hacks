/* The site's public address, for canonical links, social previews, robots
   and the sitemap. NEXT_PUBLIC_SITE_URL overrides it (e.g. for a preview
   deploy). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://dshhacks.org").replace(/\/$/, "");
