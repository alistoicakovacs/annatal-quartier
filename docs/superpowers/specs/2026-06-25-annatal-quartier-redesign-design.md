# Annatal Quartier — Identity & One-Pager Redesign (Design Spec)

**Date:** 2026-06-25
**Status:** Approved design direction (visual brainstorm complete) — ready for implementation planning.
**Supersedes:** the type/brand portions of `CLAUDE.md` §4 and `DESIGN-MODERNIZATION.md` (those fonts were AI placeholders — there is no prior human-decided CI; the logo is the only fixed brand asset).

---

## 1. Goal

Re-skin the existing Annatal Quartier one-pager into a deliberately designed **visual identity** that reads as a calm, premium, nature-forward boutique-developer site — and stops reading as a generic "AI template." The page's single job is unchanged: **collect non-binding waitlist sign-ups (Vormerkung).**

This is a **re-skin and re-composition, not a rebuild.** All existing functionality, accessibility, SEO, structured data, legal content, and the form/validation/success behavior are **preserved**. We change the look (type, color application, composition, surfaces, signature, motion) — not the feature set or the copy's factual claims.

## 2. Chosen direction — "Warm Editorial" (Direction A)

Validated via the visual companion:
- **Direction:** A · Warm Editorial (over Quiet Modernist and Immersive Nature).
- **Hero:** Photo-led, anchored — one beautiful place-photo, headline anchored bottom-left (not centered), nav + CTA on top, stream-line motif along the foot.
- **Body rhythm:** Calm/restrained (variant B) — generous whitespace, hairline-ruled lists instead of repeated boxed cards, light eyebrows, **one** quiet graphic moment (the stream divider) per transition, no highlighted feature boxes.

Guiding principle throughout: **restraint.** Spend boldness on the type and the stream signature; keep everything else quiet. When in doubt, remove.

## 3. Design system (tokens)

### 3.1 Color — anchored to the existing logo
Replace the current `:root` palette with:

```css
--c-paper:      #F7F4EC; /* warm off-white — page background */
--c-surface:    #FFFFFF; /* white tonal band / form card */
--c-sage-tint:  #EEF1E7; /* faint sage band (sparing) */
--c-forest:     #243027; /* deep forest — primary ink & dark sections */
--c-forest-deep:#1E2A20; /* darkest band (footer / waitlist) */
--c-primary:    #4F6B3A; /* green lead — CTAs, links, numerals, accents */
--c-primary-dark:#3C5430; /* hover/depth */
--c-sage:       #9CB080; /* logo light green — secondary accent */
--c-sand:       #C5AD8D; /* logo sand — warm accent, stream motif */
--c-stream:     #53676E; /* logo blue-grey — quiet accent / stream motif */
--c-ink:        #243027; /* body text (= forest) */
--c-ink-soft:   #526054; /* muted greenish-grey text */
--c-line:       #E5E0D5; /* warm hairline */
--c-line-soft:  #ECE7DC; /* faintest hairline (list rows) */
```
Application rule (unchanged in spirit, executed harder): **green leads; sand/stream are sparing accents; large areas stay light/neutral.** Rhythm comes from **tonal bands** (paper → white → faint sage → forest), not from repeating white cards.

### 3.2 Typography — two fonts, both replaced
- **Display:** **Fraunces** (variable, optical-size + weight). Weights ~400–600. **Sentence case**, slight negative tracking (`-0.012em`). Used for H1/H2/H3 and large numerals.
- **Body/UI:** **Hanken Grotesk** (400/500/600/700). Body, leads, labels, buttons, eyebrows, nav.
- **Wordmark:** stays the existing logo SVG (geometric sans) — used only as the logo, never reset as a text font. Headlines deliberately *contrast* it.
- **Drop entirely:** Montserrat, Inter.
- **Drop the blanket UPPERCASE+tracking on H1/H2.** Uppercase is reserved for: tiny eyebrows/kickers, small labels (sizes, distances), and the nav/footer headings.
- **Type scale (fluid, sentence case):**
  | Role | Font | Size (clamp) | Weight | Case |
  |---|---|---|---|---|
  | H1 hero | Fraunces | clamp(2.5rem, 1.6rem+4vw, 4rem) | 500 | sentence |
  | H2 section | Fraunces | clamp(1.9rem, 1.3rem+2.4vw, 2.6rem) | 500 | sentence |
  | H3 | Fraunces | clamp(1.2rem, 1.05rem+0.5vw, 1.4rem) | 500 | sentence |
  | Big numeral | Fraunces | clamp(2.2rem, 1.6rem+2.4vw, 2.75rem) | 400–500 | — |
  | Eyebrow | Hanken Grotesk | 0.72rem | 600 | UPPERCASE, .16–.18em |
  | Lead | Hanken Grotesk | clamp(1.1rem, 1.05rem+.3vw, 1.25rem) | 400 | sentence |
  | Body | Hanken Grotesk | clamp(1rem, .97rem+.13vw, 1.0625rem) | 400 | sentence |
  | Label/small | Hanken Grotesk | 0.72–0.8rem | 600 | UPPERCASE for labels |
- **Loading:** Google Fonts, `display=swap`, `preconnect`. Load only needed Fraunces axes/weights to keep payload small. Preload nothing beyond the hero image.

### 3.3 Surface, spacing, texture
- **Radius:** reduce and vary intentionally — small radii (`6–10px`) only where needed (form inputs, thumbnails, form card). Move away from uniform 12–16px rounding on everything; many elements (lists, stat numerals, dividers) have **no** box at all.
- **Shadows:** drastically reduce. Keep **one** soft shadow, used only on the form card (and maybe the sticky header on scroll). Remove the global card shadows + hover-lift.
- **Hairlines over boxes:** structure with `--c-line`/`--c-line-soft` rules and whitespace instead of bordered/shadowed cards wherever possible.
- **Texture:** a subtle, static **paper grain** (inline SVG/tiled noise, ~3–5% opacity) over `--c-paper` backgrounds. Whisper-subtle, never over photos, never animated.
- **Spacing:** more generous than current; section padding `clamp(72px, 10vw, 120px)`. Whitespace is a compositional element.

### 3.4 Signature — the stream-line (extended from the logo)
The logo already contains the motif: a meandering blue-grey stream + layered hills. Extend it:
- **Section dividers:** a single fine wavy `<path>` (sand `--c-sand` or stream `--c-stream`, ~1.4–1.6px) as a quiet transition between bands. **One per transition**, not decoration everywhere.
- **Hero foot:** the stream line tracing along the bottom of the hero.
- **Scroll cue:** replace the template "mouse" cue with a small stream-derived mark (minimal stream tick; see §12).
- Implemented as lightweight inline SVG; respects reduced-motion (static).
- *Not* used: contour-line backdrops, animated streams, full-bleed linework (those belonged to Directions B/C).

## 4. Layout & composition principles
- **Asymmetric editorial grid:** section titles/eyebrows anchored to a left column (~0.8fr); content/lists/images in a wider right column (~1.2fr). Not everything centered.
- **Tonal band rhythm:** consecutive sections alternate `--c-paper` / `--c-surface` / occasional `--c-sage-tint`, with the dark `--c-forest-deep` reserved for the waitlist and footer (and the full-bleed Garten band).
- **Lists over card grids:** the USP grid and home-type grid become hairline-ruled editorial lists; the spec tiles become a hairline list; FAQ flattens to hairline rows. Restraint variant: uniform rows, no highlighted feature boxes.
- **Max content width** ~1140–1180px, centered; generous gutters.

## 5. Section-by-section

> All German copy is preserved as-is unless noted; only treatment changes. Keep the defensible-claims wording (§8).

1. **Header / nav** — keep sticky behavior (transparent over hero → frosted warm-paper on scroll), logo (white over hero via existing invert, full-color when scrolled), desktop inline nav + **mobile burger** (off-canvas) — all preserved, re-skinned to the new palette/type. CTA "Auf die Warteliste" stays visible.
2. **Hero** — photo-led, anchored bottom-left. Eyebrow (sage) · Fraunces H1 sentence case (white) · lead · primary CTA + ghost CTA · stream line along the foot · price/date badge retained (restyled). Lighter, asymmetric scrim (not a heavy full scrim). Keep `fetchpriority=high` hero image.
3. **Quartier in Kürze (intro + stats)** — left: eyebrow + Fraunces H2 + intro paragraph; the four figures (22 / 30–70 m² / 4 / 8) as **oversized Fraunces numerals divided by hairlines**, no boxes. Paper band.
4. **USPs (the 6 points)** — convert the 6 identical icon cards into a **restrained editorial list** (hairline-ruled, generous spacing), thin custom line-icons kept but de-emphasized (no filled icon tiles, no hover-lift). Anchor 1–2 leading points; demote the rest. White or paper band.
5. **Lage** `#lage` — asymmetric: oversized Fraunces H2 + eyebrow in left column, map + distance list in right. Keep the OSM map (restyled card, lighter) and the hairline-ruled distance table (already good). Stream divider above.
6. **Wohnungen** `#wohnungen` — asymmetric editorial: section head left, the three home types as a **uniform hairline list** with small graded thumbnails (no feature box, per restraint).
7. **Garten** `#garten` — keep the full-bleed photo band; warm-grade the image; lighter gradient; Fraunces H2 light; tag-list restyled (quieter). Reserved dark moment.
8. **Ausstattung** `#ausstattung` — left content + spec items as a **hairline list** (not 6 boxed tiles); keep the asymmetric image gallery (the one place that already breaks the grid — lean into it, warm-graded).
9. **Warteliste** `#warteliste` — re-skin to `--c-forest-deep`. **Keep the entire form unchanged in behavior**: sticky intro, chips, validation, honeypot, success state, `// TODO: backend`, all `aria-*`, all consent checkboxes and microcopy. New type/palette only; the form card keeps its one soft shadow.
10. **FAQ** — flatten the 4 boxed accordion cards to **hairline-ruled rows** with a `+`/`–` (or stream-tick) toggle. Keep all ARIA/disclosure behavior.
11. **Footer** — `--c-forest-deep`; new type; add a quiet stream/contour closing mark. Keep contact, nav, Impressum/Datenschutz links, copyright, and the full disclaimer text verbatim.
12. **Legal pages** (`impressum.html`, `datenschutz.html`) — reuse the shared shell; inherit the new tokens/type automatically; verify they re-skin cleanly. **No content changes** to ET 89 eGbR Impressum data.

## 6. Motion (consolidate to one calm system)
- **Remove GSAP + ScrollTrigger entirely.** Replace with **IntersectionObserver** one-shot reveals (and/or native CSS `animation-timeline: view()`), removing the two-system overlap and a CDN dependency.
- **Reveals:** gentle fade + small (8–16px) rise; **varied** timing/stagger so it isn't mechanically uniform. Most content simply appears calmly; not everything animates.
- **Micro-interactions** only where they earn it: primary CTA, form inputs/chips, FAQ toggle. Remove the global card hover-lift.
- **Optional whisper** of hero-image parallax/scale; the stream divider is static.
- **Reduced motion:** preserve and extend the existing `prefers-reduced-motion` guarantee; ensure no content is ever stuck at `opacity:0` if JS/animation fails (reveals must be progressive-enhancement).
- **Drop** the animated "mouse" scroll cue.

## 7. Imagery
- Keep curated Unsplash (hotlinked, optimized params, `loading="lazy"`, descriptive German alt) for now; apply a **consistent subtle warm grade** (CSS filter/duotone) so the set reads as one palette, not stock. Prefer photos with a specific Brandenburg sense of place. Swap for real Strausberg/Annatal photos later (no layout change needed).

## 8. Guardrails (must not regress)
- **Defensible claims (Wissensdatei §9/§15):** keep nature claims scoped to the *Hanghäuser*; "voraussichtlich" on Q2 2028; "ab 15 €/m²" as Nettokaltmiete + zzgl. Nebenkosten; "Annafließ" as a brand name; no invented EH-stage ("modernster Effizienzhausstandard"); "ebenerdige/barrierefreie Zuwegung" not "Aufzug"; "ca. 30–70 m²" / "22" as planning figures; standing "Änderungen vorbehalten" disclaimer.
- **Legal:** ET 89 eGbR Impressum exactly as in CLAUDE.md §8; both required disclaimers near form + footer; never mix in EA-Plus/EnergieAudit data.
- **Accessibility:** preserve skip-link, visible focus rings, ARIA on nav/FAQ/form, honeypot, label associations, keyboard operability; maintain WCAG-AA contrast with the new palette (verify forest/paper/green combinations).
- **SEO:** exactly one H1 containing "Annatal Quartier" + "Strausberg"; title/description/canonical/robots/OG/Twitter and the `@graph` JSON-LD (WebSite/Residence/Organization) preserved.
- **Performance:** stay dependency-light (now lighter — GSAP removed); fast LCP (hero preload/`fetchpriority`); good CWV; grain/filters must be cheap.
- **No build step / no framework.** Plain `index.html` + `styles.css` + `script.js` + Google Fonts.

## 9. Files affected
- `styles.css` — new token layer (§3), type system, composition, grain, motion CSS; remove GSAP-specific hooks; restyle every section.
- `index.html` — swap Google Fonts link (Fraunces + Hanken Grotesk); remove GSAP `<script>` tags; adjust hero/intro/USP/wohnungen/ausstattung/FAQ markup from card grids to editorial lists; add stream-divider SVGs; keep all meta/OG/JSON-LD/form/a11y.
- `script.js` — replace GSAP reveals with IntersectionObserver; keep nav, FAQ, form chips/validation/success logic.
- `gsap-animations.js` — **delete** (functionality folded into `script.js`).
- `impressum.html`, `datenschutz.html` — inherit new shell; verify.
- `CLAUDE.md` — update §4 (brand system) to record the new identity (Fraunces + Hanken Grotesk, palette, sentence-case headings, stream signature), noting it supersedes the AI-placeholder spec.

## 10. Success criteria
- The page no longer exhibits the four core "AI tells" (default font pairing, centered hero, repeated identical white cards, uniform fade-up) — verified against `DESIGN-MODERNIZATION.md` §1.
- Identity is coherent and logo-anchored; Fraunces + Hanken Grotesk render with `swap`; stream signature present but restrained.
- All §8 guardrails hold: a11y, SEO/JSON-LD, legal, defensible claims, performance, no new dependencies.
- Renders cleanly responsive down to ~320px; reduced-motion respected; no content hidden if JS fails.
- GitHub Pages still serves it as-is (relative paths; `.nojekyll`).

## 11. Decisions made (so no re-litigating)
- Fonts: **Fraunces + Hanken Grotesk** (Montserrat/Inter dropped). Logo wordmark untouched.
- Hero: **photo-led, anchored** (not split, not centered).
- Body: **calm/restrained** editorial lists + tonal bands; no feature-highlight boxes.
- Motion: **single system (IntersectionObserver/CSS); GSAP removed.**
- Imagery: **keep graded Unsplash placeholders**; real photos later.

## 12. Low-stakes opens (default chosen; flag only if you disagree)
- Scroll cue: minimal stream-tick (vs. removing entirely). Default: keep a minimal tick.
- Exact home-type "→" affordance: decorative vs. linking (no detail pages exist yet → decorative). Default: decorative.
