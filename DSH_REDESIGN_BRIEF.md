# DSH Hacks V2 — "Blueprint" Redesign Brief

> **For the coding agent.** This is the single source of truth for the dshhacks.org visual revamp. Read it fully before touching code. Work in phases (§10), commit after each, and do not change content, links or data unless this file says so.

---

## 0. TL;DR

Turn dshhacks.org into an **engineering drawing set for a hackathon**: cyanotype blue, paper white, ink black. Every section is a "sheet" in a technical drawing package — grid paper, hairline rules, dimension lines, registration marks, title blocks, `FIG.` captions, monospace annotations, and big **Instrument Serif** headlines with one *italic* word. Think OpenWM's figure language (pipeline diagrams, `Fig. 2 — The confidence gate`, `τ = your threshold`) crossed with an architect's blueprint, run at night.

It should feel precise, quiet, expensive and a little bit nerdy. Not "gamer neon." Not "SaaS gradient." No glassmorphism, no purple, no emoji, no stock 3D blobs.

---

## 1. Step zero — audit before you design

1. Map the repo: framework (the live site emits `next-size-adjust`, so it's probably Next.js — confirm), styling system (Tailwind / CSS modules / plain CSS), where fonts are loaded, where section components live, where project/judge/sponsor data lives.
2. List every existing section component and its data source. **Keep all data files and assets** (sponsor logos, judge logos, project thumbnails, flyer PDF).
3. Note existing features that must survive: countdown timer, project wall filters/search/Wall↔List toggle with dither-on-hover effect, judge marquee, workshops list, "So far" ledger, FAQ accordion, terminal footer prompt (`hacker@dsh:~$ ▌`).
4. **Identify the techy font from https://www.arlanrakh.com/** — Ryan wants that exact font. Fetch the page HTML and its `/_next/static/css/*.css`, grep for `font-family`, `@font-face`, `.woff2`, `next/font` class names. Report what you find before installing anything.
   - If it's on Google Fonts or has an open license (e.g. Geist Mono, JetBrains Mono, IBM Plex Mono, Space Mono, Departure Mono) → use it.
   - If it's a paid/commercial font (e.g. Berkeley Mono, Söhne Mono, GT America Mono) → **do not copy font files from that site.** Tell Ryan, and use the closest free match (default fallback: **Geist Mono**, then JetBrains Mono).
5. Write a short `REDESIGN_NOTES.md` with the audit results, then start Phase 1.

---

## 2. Design references (what to steal, what not to)

| Reference | Take | Don't take |
|---|---|---|
| **openwm.vercel.app** (Ryan's own site) | Near-black ground (`#0A0A0A`), serif headline with one italic word ("Predict, doubt, *verify*."), numbered steps `01 / 02 / 03`, schematic pipeline figure with boxed nodes + mono caps labels (`DESIGN`, `CONF. ≥ τ ?`, `HIGH` / `LOW`), `Fig. N — Title` captions with `(illustrative)` tags, research cards with mini-figures (`PREDICTED L/D 94.0 · ACTUAL L/D 41.3`), pull-quote with a single italic emphasis | Its exact layout or copy — DSH is a hackathon, not a product page |
| **arlanrakh.com** | The mono/techy typeface (see §1.4), lowercase casualness in small labels, restraint, lots of air | The minimal one-column layout |
| **Engineering drawings / cyanotypes** | Grid paper, title blocks, revision tables, dimension lines with arrowheads, section markers (`A—A`), centerlines (long-short dash), crop/registration marks, sheet numbers | Fake-aged paper textures, coffee stains, skeuomorphism |
| **Current dshhacks.org** | All content, the `No. 0X` section numbering, ledger, dither project wall, terminal footer | Its current color/illustration treatment |

---

## 3. Color system

Three colors. Blue is the only chroma. Everything else is a value of black or white.

```css
:root {
  /* ink (backgrounds) */
  --ink-950: #05070B;   /* page ground, near-black with a blue cast */
  --ink-900: #0A0D14;   /* raised panels */
  --ink-800: #111622;   /* cards, inputs */

  /* cyanotype blue */
  --blue-900: #0A1F4D;  /* deep blueprint sheet */
  --blue-700: #123A8C;  /* cyanotype field (inverted "sheet" sections) */
  --blue-500: #2F6BFF;  /* primary accent: links, CTAs, active states, live lines */
  --blue-300: #8DB0FF;  /* annotation text on dark, hover */
  --blue-100: #DCE6FF;  /* faint tint */

  /* paper */
  --paper:    #F2F4F8;  /* primary text on dark; light-sheet ground */
  --paper-dim: rgba(242,244,248,.62); /* secondary text */
  --paper-mute: rgba(242,244,248,.38); /* tertiary / metadata */

  /* lines */
  --rule:      rgba(141,176,255,.14); /* hairlines, grid minor */
  --rule-strong: rgba(141,176,255,.28); /* grid major, frames */
  --rule-paper: rgba(242,244,248,.22); /* lines on blue sheets */
}
```

**Usage rules**
- Default sheet: `--ink-950` ground, `--paper` text, `--blue-*` for lines/annotations.
- **Cyanotype sheets** (inverted, solid `--blue-700` ground with white linework and white text): use for **Prizes** and the **final CTA**, optionally **FAQ**. This creates rhythm while scrolling: dark → dark → blue → dark → blue.
- Blue text only for annotations, links, live data (countdown digits, stats). Body copy is always paper.
- Contrast: body text ≥ 4.5:1 everywhere. Check `--paper-dim` on `--blue-700` (it must pass, bump opacity if not).
- No gradients except: a very subtle radial "lamp" glow (`--blue-500` at ≤ 8% opacity) behind the hero figure, and a vertical fade where grids meet section edges.

---

## 4. Typography

| Role | Font | Notes |
|---|---|---|
| Display / H1–H2 | **Instrument Serif** (Google Fonts, regular + italic) | Large, tight leading (0.95–1.05), letter-spacing −0.01em. One word per headline in *italic*, optionally in `--blue-300`. |
| Labels, nav, metadata, captions, numbers, buttons | **The arlanrakh.com mono** (see §1.4; fallback Geist Mono) | 11–13px, UPPERCASE, letter-spacing 0.08–0.14em for labels. Tabular numerals for all figures. |
| Body | Same mono at 15–16px, normal case, line-height 1.6 — **or** a neutral grotesk (Inter / Geist Sans) if mono body hurts readability. Decide after a test render and note it in `REDESIGN_NOTES.md`. |

Load via `next/font/google` (or `next/font/local` for a licensed local file) with `display: swap`, expose as `--font-serif` and `--font-mono`.

**Type scale (clamp-based)**
```
--fs-hero:  clamp(3.25rem, 8.5vw, 8.5rem)
--fs-h2:    clamp(2.5rem, 5.5vw, 5rem)
--fs-h3:    clamp(1.5rem, 2.4vw, 2rem)   /* serif */
--fs-body:  1rem
--fs-small: .8125rem
--fs-label: .6875rem                     /* mono caps */
```

**Headline pattern (keep existing copy, add the italic word):**
- Hero: "Build AI that makes healthcare *reach further.*" (already has it, keep)
- About: "A hackathon for *medicine*." — only if Ryan approves new copy; otherwise keep "About" and style the existing section title.
- Default rule: **don't invent new copy.** Restyle existing headings. If a heading is a single word ("Schedule"), render it big serif with a mono sheet label above it.

Also: the live site currently renders duplicated heading text (`AboutAbout`, `ScheduleSchedule`, `So farSo far`) — likely a decorative duplicate layer that isn't `aria-hidden`. Fix: mark decorative duplicates `aria-hidden="true"`, or remove them.

---

## 5. The blueprint visual language

Build these as reusable components in `components/blueprint/` so every section uses the same vocabulary.

### 5.1 Grid paper (`<GridField />`)
- Full-bleed background: minor grid 8px (`--rule` at ~40% of its alpha), major grid 64px (`--rule`), drawn with CSS `background-image: linear-gradient(...)` — no images.
- Mask the grid with a radial or linear `mask-image` so it fades out at section edges; never let it fight with body text (lower opacity behind text blocks).
- Optional: grid subtly parallaxes (≤ 20px over a section) on scroll.

### 5.2 Sheet frame + title block (`<Sheet />`)
Each major section is a "drawing sheet":
- Thin inset frame (1px `--rule-strong`) with **corner registration marks** (small `+` crosshairs or L-brackets) at all four corners.
- **Title block** in the bottom-right (desktop) / bottom (mobile), like an engineering drawing:
  ```
  ┌────────────────────────────────────────┐
  │ DSH HACKS V2        │ SHEET 03 / 07    │
  │ SCHEDULE            │ REV B · 2026.10  │
  │ SCALE 1:1  ·  AI × HEALTHCARE · ONLINE │
  └────────────────────────────────────────┘
  ```
  Mono, 10–11px, `--paper-mute`. This replaces the current "No. 0X" eyebrow visually (keep "No. 0X" in the section header too, it's good).
- Section top edge: a **sheet label** row: `NO. 03 ── SCHEDULE ───────────── 5 STAGES` with a hairline filling the gap.

### 5.3 Dimension lines (`<Dim />`)
Horizontal/vertical lines with tick ends or arrowheads and a centered mono label, e.g. `◂──── 4 WEEKS ────▸`, `↕ 80+ COUNTRIES`. Use them:
- under the hero headline (measuring its width, labeled `AI × HEALTHCARE`),
- across the schedule timeline (labeled with durations),
- beside stats.
Draw on scroll-in (SVG `stroke-dashoffset`).

### 5.4 Callouts / leaders (`<Callout />`)
A dot on a figure, a leader line at 45° then horizontal, and a mono label (`A — DIAGNOSTIC TOOL`). Used on the hero figure and the about figure.

### 5.5 Figure captions
Every illustration/diagram gets an OpenWM-style caption:
`FIG. 1 — From problem to shipped tool (illustrative)` — mono for `FIG. 1`, serif italic for the title.

### 5.6 Centerlines & section markers
Long-short-dash centerlines (`stroke-dasharray: 24 4 4 4`) used sparingly as dividers. Section-cut markers `A ─── A` with filled triangles at the ends between major sheets.

### 5.7 Live readouts (`<Readout />`)
Small mono blocks that look like instrument panels:
```
LAT 37.7749  LON −122.4194   ← no, we're online/global; use:
UTC 14:22:07 · 80+ COUNTRIES · STATUS ● OPEN
```
Use for: hero meta strip (Theme / Format / Who / Entry / Prize pool / Deadline — the existing data) styled as a spec table with hairline cells.

### 5.8 Cursor crosshair (desktop only, optional, last)
Thin full-viewport crosshair lines following the cursor at ~6% opacity, with a tiny `x 0412 · y 0198` readout near the pointer. Disabled on touch, disabled under `prefers-reduced-motion`, and must not block clicks (`pointer-events: none`).

### 5.9 Noise
One very light film-grain SVG noise overlay (≤ 4% opacity) over the whole page to keep blacks from looking flat. Static, not animated.

---

## 6. Section-by-section spec

Keep section order and anchor IDs (`#hero #about #projects #schedule #prizes #people #faq`) so existing links don't break.

### Nav
- Sticky, `--ink-950` at 80% with `backdrop-filter: blur(8px)` and a 1px bottom hairline.
- Left: `DSH HACKS` wordmark in mono caps + tiny `V2` tag box. Center/right: mono caps links. Right: **Register** button.
- Buttons: rectangular, 1px border, mono caps, no radius (or 2px max). Primary = `--blue-500` fill, `--paper` text. Secondary = transparent with `--rule-strong` border. Hover: fill slides in from left; tiny `→` nudges.
- Active section indicator: a 2px `--blue-500` tick under the current link (IntersectionObserver).

### Hero (`#hero`) — SHEET 00 / COVER
- Eyebrow: `DELTAFORGE HACKS × NXT HORIZON × STEMISE PRESENT V2` in mono caps.
- Headline: existing copy, huge Instrument Serif, *reach further.* in italic `--blue-300`.
- **Fig. 1 hero drawing** (right side on desktop, below headline on mobile): an SVG technical line drawing that self-draws on load. Concept: an **exploded-view schematic of a healthcare AI pipeline**, in OpenWM's Fig. 2 style:
  `PATIENT SIGNAL → MODEL → CONFIDENCE → CARE`, with boxed nodes, an `ECG`-style trace running through the first box, a small heart outline in cross-section with callouts, a dimension line labeled `4 WEEKS`, and a `≥ τ ?` gate. All strokes 1–1.25px, `--blue-300`/`--paper-dim`, nodes labeled in mono caps. Caption: `FIG. 1 — Build something that reaches further (illustrative)`. Build it as inline SVG in a component, not an image.
- The ECG trace can loop subtly (a moving dash), paused under reduced motion.
- Spec strip under the CTAs: the existing six facts (Theme, Format, Who, Entry, Prize pool, Deadline) as a hairline-ruled table, label in mono caps `--paper-mute`, value in serif or mono `--paper`.
- **Countdown**: rebuild as an instrument readout — four cells `DD : HH : MM : SS`, tabular mono digits in `--blue-500`, labels under each cell, hairline borders, caption `T-MINUS TO SUBMISSION CLOSE · NOV 07 23:45 PST`. Keep existing countdown logic.
- Section index (the existing `01 About / 02 Projects 283 submissions / ...` list): style as a **drawing index / sheet list**: `SHEET 01 ........ ABOUT`, dot leaders, metadata right-aligned.

### About (`#about`) — SHEET 01
- Two columns: copy left, figure right.
- Pull-quote "Transforming healthcare access through AI." as an OpenWM-style blockquote: thick left rule in `--blue-500`, serif, with mono caption `— THE V2 THEME`.
- Stats row (1,294 / 283 / 80+ / 80+ / $35K+ / 10+): each stat is a cell with a big serif number, a mono caps label, and a tiny dimension tick above it. Numbers count up on first view (respect reduced motion).
- Figure: a schematic **world map made of the dot grid** (dots light up in `--blue-500` for a scatter of locations to represent "80+ countries") with caption `FIG. 2 — V1 reach: 1,294 hackers, 80+ countries`. Dots are decorative — don't claim exact country positions unless real data exists in the repo; label `(illustrative)` otherwise.

### Projects (`#projects`) — SHEET 02 / "PLATES"
- Keep all functionality: filters, search, Wall/List toggle, featured/winners, Devpost link.
- Re-skin the wall as a **plate catalogue**: each card has a thin frame, corner ticks, a mono plate number `PL. 004`, category tag, and the dithered thumbnail recolored to **blue duotone** (`--ink-950` → `--blue-300`). Hover = reveal original color image + the frame draws a dimension line across the top with the project name.
- Filters as segmented mono tabs with counts (`ALL 281 · WINNERS 24 · ...`).
- List view = a tabular spec sheet (No., Name, Category, link) with hairline rows.
- Caption: `FIG. 3 — Every V1 submission, printed in dither (hover for the original)`.

### Schedule (`#schedule`) — SHEET 03
- Render the five stages as a **timing diagram**: a horizontal axis (time →) with tick marks, each stage as a bar/segment with its number `01–05`, title in serif, description in mono-body below. On mobile, rotate to a vertical timeline with the axis on the left.
- The deadline stage gets a `--blue-500` marker with a vertical line and a readout `NOV 07 · 23:45 PST`.
- Optional: a "now" cursor line positioned at today's date between registration open and deadline.

### Prizes (`#prizes`) — SHEET 04 · CYANOTYPE SHEET (blue ground)
- Solid `--blue-700` ground, white grid lines, white text.
- `$100,000+` set enormous in Instrument Serif with a dimension line underneath labeled `PRIZE POOL · MORE ON THE WAY`.
- The four judging criteria (Idea / Implementation / Design / Presentation) as a **2×2 spec matrix**: each cell numbered `C1–C4`, serif title, body text, hairline cell borders.

### People (`#people`) — SHEET 05
- **Sponsors**: logo grid in hairline cells (like a parts list). Logos rendered monochrome white by default (`filter: brightness(0) invert(1)` — check each logo still reads), full color on hover. Group headers `V2` / `V1` as mono tags. Keep the "Want to support DSH Hacks?" line.
- **Judges from**: keep the marquee but make it a slow ticker strip framed top and bottom by hairlines, logos monochrome. Pause on hover; static grid under reduced motion.
- **Judges**: list as a **bill of materials** table — `ITEM | NAME | ROLE` with tabular numbering, mono for item numbers, serif for names. Keep V2/V1/All tabs with counts. Fix the duplicated lists in the DOM (they look duplicated for the marquee; make the duplicate `aria-hidden`).
- **Workshops**: each talk as a row: `WS-01 · Title (serif) · Speaker (mono) · WATCH ↗`. Keep YouTube subscribe link.

### Ledger ("So far")
- Style as a **revision table** from a drawing title block:
  ```
  REV │ DATE        │ DESCRIPTION
  D   │ 2026.11.07  │ V2 submissions close at 11:45pm PST.
  C   │ 2026        │ V2 registration opens…
  B   │ 2026.06.15  │ V1 · 283 projects submitted…
  A   │ 2026.05.20  │ V1 opens on AI × STEM education…
  ```
  Keep the existing text exactly.

### FAQ (`#faq`) — SHEET 06
- Accessible accordion (`<details>/<summary>` or a button with `aria-expanded`). Each question prefixed with `Q.01`… in mono; question text in serif; `+` that rotates to `×`.
- Style as "general notes" on a drawing: heading `GENERAL NOTES` in mono caps above the serif "FAQ".

### Final CTA — CYANOTYPE SHEET
- "Your project goes here next." in large serif, with *next.* italic.
- Visual: an **empty plate** — a dashed-outline project card with a dimension line and a callout `YOUR PROJECT · PL. 284`, plus crosshairs. This ties back to the projects wall.
- Register + Discord buttons (white primary on blue).

### Footer
- Black, hairline top border, big low-contrast `DSH HACKS` wordmark in serif across the width (cropped at bottom edge is fine).
- Columns: Hackathon / Community (existing links).
- Keep the terminal prompt `hacker@dsh:~$ ▌` with blinking cursor in `--blue-500` (no blink under reduced motion). Optional easter egg: typing `help` while focused prints the section list.
- Bottom line: `© 2026 DSH HACKS · ONLINE, GLOBAL · DRAWN IN SEOUL` — **only add "drawn in Seoul" if Ryan OKs it**; otherwise keep existing text.

---

## 7. Motion

- Library: prefer CSS + IntersectionObserver; Framer Motion is fine if already in the repo. Don't add GSAP just for this.
- Signature move: **lines draw themselves** (SVG `stroke-dashoffset`) when a sheet enters the viewport — frames, dimension lines, figures. 600–900ms, `cubic-bezier(.2,.7,.1,1)`, staggered 40–80ms.
- Text: headlines fade + rise 8px, once. No letter-by-letter scrambles on body copy (a one-time mono "decode" effect on small labels is OK).
- Nothing loops forever except the ECG trace and the judge ticker, both pausable.
- **`prefers-reduced-motion: reduce`** → all lines render fully drawn, no parallax, no counters animating, no cursor crosshair.

---

## 8. Responsive

- Breakpoints: 380 / 768 / 1024 / 1440. Test at 375px width first.
- 16px side gutters on mobile, no horizontal scroll anywhere (watch the marquee, wide SVGs, the timing diagram, and long sponsor domains).
- Title blocks collapse to a single mono line on mobile.
- Hero figure goes below the headline on mobile and scales via `viewBox`; callout labels that get too small are hidden on < 480px.
- Grid paper density stays the same in px (doesn't scale).

---

## 9. Non-negotiables

- **Do not change copy, dates, numbers, names, links, sponsor/judge lists or prize amounts.** If something looks wrong in the content, flag it in `REDESIGN_NOTES.md` — don't fix it silently.
- Keep all anchor IDs and external URLs (Devpost, Discord, YouTube, Instagram, LinkedIn, flyer PDF).
- Accessibility: semantic headings in order, visible focus rings (2px `--blue-500` outline + 2px offset), alt text preserved, decorative SVGs `aria-hidden`, duplicate marquee/heading layers `aria-hidden`, color contrast AA.
- Performance: no new images for decoration — all blueprint graphics are inline SVG/CSS. Lighthouse Performance ≥ 90 and CLS < 0.05 on mobile. Fonts subset to latin, preload the serif.
- Keep `meta theme-color` in sync with the new ground (`#05070B`) and update OG/meta only if they reference the old design.
- `CREDITS.md` is outdated (describes an old "engraved folio" design). Rewrite it to credit: Instrument Serif (OFL), the mono font + its license, and note that all blueprint graphics are original SVG. Remove references to old watercolor/School of Athens assets if those assets are deleted; **don't delete asset files without listing them in `REDESIGN_NOTES.md` first.**

---

## 10. Build phases (commit after each)

1. **Audit + fonts + tokens** — `REDESIGN_NOTES.md`, identify arlanrakh font (§1.4), install fonts, add CSS variables, global base styles (ground, text, selection color `--blue-500`, focus rings), noise overlay.
2. **Blueprint primitives** — `GridField`, `Sheet` (frame + registration marks + title block), `Dim`, `Callout`, `FigCaption`, `Readout`, buttons, tags. Build a hidden `/_kit` route (or Storybook if it exists) showing all of them on dark and on cyanotype ground. Screenshot it.
3. **Nav + Hero** — including Fig. 1 hero SVG, spec strip, countdown readout, sheet index.
4. **About + Projects** — stats, world-dot figure, plate catalogue re-skin (keep all wall logic).
5. **Schedule + Prizes** — timing diagram, cyanotype prizes sheet.
6. **People + Ledger + FAQ** — sponsors parts list, judges BOM table, ticker, workshops, revision table, accordion.
7. **Final CTA + Footer** — empty plate, terminal prompt.
8. **Motion pass** — line-draw on scroll, reduced-motion fallbacks, optional cursor crosshair.
9. **QA** — run the checklist below, fix, update `CREDITS.md`.

After phases 3, 5 and 7: run the dev server, take screenshots at 375px and 1440px, and summarize what changed for Ryan before continuing.

---

## 11. Acceptance checklist

- [ ] Only blue / white / black (plus their opacity variants) on the page; no stray colors from the old theme.
- [ ] Instrument Serif on all display headings; arlanrakh mono (or documented fallback) on all labels/nav/numbers.
- [ ] Every section reads as a "sheet": frame, registration marks, sheet label, title block.
- [ ] Every illustration has a `FIG. N —` caption.
- [ ] Prizes + final CTA are cyanotype (blue) sheets.
- [ ] Countdown, project filters/search/toggle, accordion, judge tabs all still work.
- [ ] All original copy, links and anchors are unchanged (diff the rendered text against the current live site).
- [ ] No horizontal scroll at 375px; title blocks and timeline collapse cleanly.
- [ ] Reduced-motion mode shows a complete, static, fully drawn page.
- [ ] Keyboard-navigable with visible focus; decorative duplicates `aria-hidden`; AA contrast.
- [ ] Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, CLS < 0.05.
- [ ] `CREDITS.md` and `REDESIGN_NOTES.md` updated.

---

## 12. Vibe check (read this when making judgment calls)

If a choice is between *louder* and *more precise*, pick precise. The cool factor comes from **density of tiny correct details** — a tabular number lining up, a dimension line that actually measures the thing it labels, a title block that says `SHEET 04 / 07` and is right — not from glow, gradients or animation. It should look like the hackathon was designed by someone who draws engines for fun.
