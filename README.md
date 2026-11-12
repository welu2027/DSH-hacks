<div align="center">

<img src="public/dsh-logo-circle.png" alt="DSH Hacks logo" width="96" />

# DSH Hacks

The website for DSH Hacks, a free, global, online hackathon series for students building human-centered technology.

[Register for V2](https://dsh-hacks-v2.devpost.com/) · [Discord](https://discord.gg/3HgSzbYPx5) · [V1 projects](https://dsh-hacks-v1.devpost.com/project-gallery) · [YouTube](https://www.youtube.com/@DSHHacks)

</div>

Every DSH Hacks project starts with a person, not a model. Participants find someone with a real problem, understand it, and build the AI that solves it. Each edition takes on one theme. V1 was AI × STEM education. V2, AI × Healthcare, is live now and closes November 14, 2026.

DSH Hacks is run by three youth-led organizations: DeltaForge Hacks, NXT Horizon, and STEMise. It is free, online, and open to students 13 and older anywhere in the world.

> **V1 + V2 so far:** 2,450+ participants, 474 projects, 100 countries, 129 professional judges, and $35K+ in V1 prizes. V2 has $100,000+ in prizes. Numbers are from Devpost as of November 12, 2026.

## What's on the site

- **Hero.** A live countdown to the V2 submission deadline, with register and Discord links.
- **About.** The mission, the founders, the numbers across both editions, and a globe of where participants come from.
- **Journey.** A timeline from founding through V1 to V2.
- **Projects.** Every V1 and V2 submission with its Devpost image. You can search, filter by track, switch between grid and list, and open any project in a lightbox.
- **Prizes, timeline, and workshops.** The V2 prize pool, the judging criteria, key dates, and recorded workshop talks.
- **Sponsors, judges, and team.** Sponsor logos, a scrolling roll of judges, and the organizing team, with the co-founders shown first.
- **FAQ and what's next.** Common questions, past and upcoming editions, and a final call to register.

The whole page is one scroll down a mountain. You start at the summit in daylight, pass through the clouds, and come out at dusk in a valley where the lights are. The landscape is drawn in code; see [CREDITS.md](CREDITS.md).

## Run it locally

```bash
git clone https://github.com/ryanjmahn/DSH-hacks.git
cd DSH-hacks
npm install
npm run dev               # http://localhost:3000
```

Run `npm run build` to export a static site to `out/`. Don't run it while `npm run dev` is running, because both write to `.next` and the dev server will start returning errors.

## Updating content

Most content is plain data, so updates rarely touch layout code.

| What | Where |
|---|---|
| Headline numbers | `src/components/sections/About.tsx`, `V2.tsx`, `renditions.ts` |
| Projects gallery | `src/components/plates/projects.ts`, images in `public/plates/projects/` |
| Team and founders | `src/components/sections/team.ts` (`founder: true` puts someone in the founders row) |
| Judges | `src/components/sections/judges.ts` |
| Links (Devpost, Discord, socials) | `src/components/sections/shared.tsx` |
| Colors and type | `src/app/globals.css`, fonts in `src/app/layout.tsx` |

## Deploy

The site is a static export served by Cloudflare Workers. `wrangler.jsonc` points at `out/`.

```bash
npm run build
npx wrangler deploy
```

## Tech stack

- Next.js 15 and React 19, exported as a static site
- Tailwind CSS 4 with hand-written CSS in `globals.css`
- Figtree and JetBrains Mono through `next/font`
- A landscape pre-rendered by `scripts/terrain.py`, particles on a 2D canvas, and [cobe](https://github.com/shuding/cobe) for the globe
- Cloudflare Workers for hosting

## Credits

Built by the DSH Hacks team.

- **Ryan Ahn**, Co-Founder and Lead Competition Director
- **Wenhao Lu**, Co-Founder and Lead Competition Director ([wenhao-lu.com](https://www.wenhao-lu.com/))
- **Abhiram Jetty**, Co-Founder and Lead Competition Director ([LinkedIn](https://www.linkedin.com/in/abhiramjetty/))
- **Karam Gill**, Lead Competition Director
- **Adithya Balakumar**, Lead Competition Director

Project thumbnails come from each team's Devpost submission. Fonts, illustrations, and third-party assets are listed in [CREDITS.md](CREDITS.md).
