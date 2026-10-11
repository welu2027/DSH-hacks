# Blueprint redesign: notes

Working notes for the V2 "Blueprint" reskin. The brief is in `DSH_REDESIGN_BRIEF.md`.

## Audit

- Next.js 15 (App Router, static export), Tailwind v4 import plus hand-written CSS in `src/app/globals.css`. Fonts load through `next/font` in `src/app/layout.tsx`.
- Sections: `src/components/sections/*`. Data stays where it was: projects in `plates/projects.ts`, judges in `sections/judges.ts`, sponsors, talks, FAQ and ledger inline in their sections.
- Features kept: countdown, project wall (filters, search, Wall/List, dither on hover, lightbox), winners marquee, judges band, workshops, ledger, FAQ, terminal footer, Konami.

## Fonts

- arlanrakh.com uses **Departure Mono** (it's in `@font-face` in their CSS). It's free under the SIL OFL. The file in `src/app/fonts/` comes from the official release (github.com/rektdeckard/departure-mono v1.500), not from their site.
- Departure Mono is a pixel font drawn on an 11px grid. It's used for every label, number, button and nav item, at 11/22/44px.
- Body text stays **Geist Mono** at 14px. Departure is hard to read at paragraph length.
- Instrument Serif for display, unchanged. Doto was dropped.

## The garden (`src/components/scene/`)

- `World.tsx` is one fixed canvas behind the page. Scrolling moves the camera through a Supertree garden at 0.07 m per px, and a raised walkway runs the full length.
- On load, the hero grove draws itself as a flat elevation in `.world-slot`, then swings into perspective. Structures ahead draw themselves bottom-up as you approach.
- Landmarks are laid out from the live section positions, and the layout is rebuilt when the page height changes:
  - About: a DNA helix bridge over the path
  - Projects: a twisting archive tower and a radar dish
  - Schedule: five arches
  - Prizes: a conservatory dome you walk into
  - People: saddle-roof pavilions
  - Ledger: a turning observation wheel
  - FAQ: a row of wind turbines
- Between landmarks the world is a tech city: supertrees with three canopy shapes, antenna spires, server-stack megatowers, floating islands, holo-panels with ECG traces, data cables with packets, a maglev with a moving train, drones, and a ringed planet, moon and mountain ridge fixed at infinity.
- An explorer readout (distance, heading, sector) shows in the bottom left while you scroll, desktop only.
- Over `.cyan` sheets the canvas paints the blue ground and redraws the lines in paper. `.has-world .cyan` drops the CSS fill.
- Plain canvas 2D with no dependencies: about 60fps in headless Chromium at 1440px. Lines very close to the camera fade out so they don't sprawl over the copy.
- Reduced motion: no intro, no loop, the camera stays at the start, and the frame is redrawn on scroll.
- `Scene.tsx` draws the small sapling in the CTA's empty plate.
- This replaced the heartbeat trace (`world/Trace.tsx`). The `beat` terminal command now speeds up the vine pulses instead.

## Decisions and deviations

- **Removed the dithered skyline field** (`world/Field.tsx`, `world/shapes.ts`) and the heartbeat trace. The garden replaces both.
- **Judges stay as the drifting pill band** (recolored, square, between hairlines) instead of the brief's bill-of-materials table. The band is recent work, and it already covers the "ticker" idea. "Judges from" is still the logo grid.
- **Sponsor logos stay monochrome on hover**, not full color, so a dark logo can't vanish on the dark ground.
- Fig. 1 is now the garden's grove. The pipeline is Fig. 2 in About; its dimension reads "SIGNAL → CARE", not "4 WEEKS", because V2's hacking period length isn't stated on the site.
- **Fig. 3 lit dots are a fixed pseudo-random scatter**, captioned "(illustrative)". The repo has no per-country data.
- Title-block revision is **REV C · 2026**: the latest ledger entry already issued. D (submissions close) is still in the future.
- Ledger isn't numbered as a sheet. The sheets are 00 cover, 01–06, and 07 register.
- The ghost-outline duplicate headings were removed, not just hidden.
- Copy additions are labels only: "Drawing index", "T-minus to submission close · Nov 07 23:45 PST", "Time →", "General notes", C1–C4, WS-01…, Q.01…, Pl. 001…, and figure captions. *next.* on the final CTA is now italic; the words didn't change.
- Not done: the `/_kit` route, the cursor crosshair (optional), parallax, the schedule "now" cursor (optional), the section-cut `A — A` markers, and a Lighthouse run.

## Content synced from Devpost (2026-10-12)

- Deadline moved to Nov 14, 2026, 11:45pm PST. Submissions opened Jun 24, judging runs Nov 15–22, and winners are announced Nov 23. Updated in the countdown, hero, schedule, ledger, FAQ and CTA.
- Added the prize schedule (P1–P5, non-cash), the Devpost wording for judging criteria and submission requirements, and three new V2 judges with their Devpost photos.

## Content flags (not changed)

- Projects say "283 submissions", but `projects.ts` has 281 entries, so the filter shows "All 281".

## Assets

None deleted. `public/plates/*` (old watercolor/background images) and `public/artwork/traced` are no longer referenced by the page, but they're still in the repo.
