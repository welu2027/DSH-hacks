# Redesign log: mountain + particles

## Open questions
- Body copy is in the system sans, not mono: long paragraphs in JetBrains Mono read heavy. Mono stays for every label, number, button and nav link. Flip `--sans` in `globals.css` if you'd rather have mono everywhere.
- New series-level copy is marked `{/* TODO: Ryan review */}` (About second paragraph, sponsorship contact line). Section headlines for Sponsors ("Backed by people who build."), Workshops ("Learn from people who ship.") and Timeline ("Five stages, one deadline.") are new too.
- `next lint` has never been configured in this repo (it stops at its setup prompt), so there is no lint pass. `tsc --noEmit` and `next build` are clean.
- The V1 wall shows 281 projects in its data while copy says 283 submissions (unchanged from before).

## Decisions
- 2026-10-27: Mono font is JetBrains Mono. Numbers are always mono; big-stat labels are serif.
- 2026-10-27: Atmospheric order. Far ridges are pale, the town ridge is `--blue-900`, and a valley-mist bank in front of it fades into the page. The lights rest on the town ridge, so they glow on dark rather than on haze.
- 2026-10-27: The descent is one gradient down `main` (white, then the mist tones), ending at the valley floor: the final CTA reuses the town ridge with lamp lights and one "yours" light that flickers on, and the footer sits on `--blue-900`.
- 2026-10-27: Particles do not morph per section, and the field doesn't reappear behind later sections. That keeps it to one canvas and one loop; revisit if you want more.
- 2026-10-27: V1 sponsors live in the V1 recap ("V1 was backed by"), V2 sponsors in 08 Sponsors. No duplication.
- 2026-10-27: The existing healthcare SVGs (`public/illustrations`) are filled, isometric pieces that don't match a single line style, so they were removed along with their generator scripts. V2 uses the new line motifs instead.
- 2026-10-27: Removed the ticker (its facts all live in the hero strip and the V2 facts grid), the prize carousel (three cards side by side now), the handwritten notes, dither fields, vitals and ribbons.

## Loops
### [Phase 1–3] Full build — loop 1
- Built: tokens, fonts, SectionHead (numbered eyebrow, serif title with italic phrase, mono strip), nav, MountainHero + ParticleField + Altitude, then sections 01–11, the valley-floor CTA and the footer.
- Checked with headless Chrome over DevTools at 1440 and 390 (full page): no horizontal scroll at 390; lights land on the ridge on scroll; the sponsor duotone works, including the white-artwork logos.
- Fixed: a 1px seam at the bottom of the hero; the altitude pill overlapped content below 1360px (now hidden there); the lamp glow read as grey discs (smaller and stronger now); the fog under the ridge looked muddy (now runs through `--mist`).

## Handoff
- Done: everything in sections 1–4 of the brief, apart from the decisions above.
- 768px hero checked: the nav collapses to the menu and the layout holds.
- Not done: Lighthouse runs and real-device frame-rate checks for the particle loop. The loop is O(n²) for links at up to 180 dots.
- Preview: `npm run dev`, or `npm run build && npx serve out`.
