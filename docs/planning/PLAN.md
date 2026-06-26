# PLAN — Annatal Quartier One-Pager

Goal: a standalone, award-winning German one-pager whose single job is to convert
visitors into non-binding waitlist sign-ups. Grounded in `Wissensdatei …pdf` (facts)
and the imported Claude Design (look). See `CLAUDE.md` for the full brand system and
the §15 "keep defensible" claims — every copy decision below respects those.

**Stack:** hand-written HTML/CSS/JS. No framework, no build step. Deps: Google Fonts
(Montserrat + Inter) and an OpenStreetMap embed for the map. Mobile-first.

**Deliverables:**
`index.html` · `styles.css` · `script.js` · `impressum.html` · `datenschutz.html` ·
favicon + `og-image` (from logo) · reuse `logos/`.

---

## Phase 0 — Scaffold & design tokens
- [ ] `index.html` skeleton: `<!doctype html>`, `<html lang="de">`, semantic landmarks (`header/main/section/footer`), skip-link, all section anchors (`#top #lage #wohnungen #garten #ausstattung #warteliste`).
- [ ] `<head>`: charset, viewport, title + meta description, canonical, robots, theme-color, favicon (derive from `logos`), Google Fonts preconnect + stylesheet, OG/Twitter tags, JSON-LD `@graph` (WebSite/Residence/Organization) — values per CLAUDE.md §7/§8. **No precise geo-coords/Hausnummer** (Wissensdatei §15 — not public yet).
- [ ] `styles.css`: `:root` tokens (palette + fonts from CLAUDE.md §4), CSS reset, fluid type scale via `clamp()`, `.container` (max-width 1180px), section-padding utility, shared button styles (primary/ghost), `::selection`, smooth scroll, `prefers-reduced-motion` guard.
- [ ] `script.js` stub with module sections (header, nav, reveal, faq, form).
- **Done when:** page loads in a browser, fonts render, tokens resolve, zero console errors.

## Phase 1 — Header + Hero
- [ ] **Header:** real SVG logo (mark + "ANNATAL QUARTIER"), anchor nav (Lage · Wohnungen · Garten · Ausstattung), primary CTA "Auf die Warteliste". Transparent/light over hero → frosted off-white + hairline + soft shadow once scrolled (JS toggles a class past ~40px). Sticky.
- [ ] **Mobile nav:** burger → accessible slide-in/overlay menu (focus-trap, Esc to close, `aria-expanded`); CTA stays reachable.
- [ ] **Hero:** full-bleed nature photo with slow Ken-Burns zoom + layered gradient for text legibility; animated eyebrow ("Strausberg · Die grüne Stadt am See"), H1 "Wohnen am Naturschutzgebiet" (the **one** H1, contains "Strausberg" nearby), lead paragraph, dual CTA (primary waitlist + ghost "Wohnungen ansehen"), corner badge "ab 15 €/m² · Bezug vsl. Q2 2028", scroll-down cue.
- **Done when:** header transition is smooth, mobile menu works by keyboard + touch, hero reads clearly on mobile + desktop, claims scoped to Hanghäuser where needed.

## Phase 2 — Content sections
- [ ] **Quartier in Kürze:** intro copy (from Wissensdatei §1/§11 intro) + 4 stat tiles (22 Mietwohnungen · 30–70 m² · 4 Häuser · 8 rollstuhlgerecht), one tile in primary green.
- [ ] **USP grid (6 cards):** Am Naturschutzgebiet · Grandioser Ausblick · Eigener Garten · Balkon/Terrasse · Niedrige Nebenkosten · Barrierefrei — each with a thin-line nature icon, hover lift + border-accent. Nature/quiet claims phrased for the Hanghäuser.
- [ ] **Lage:** two-column — image card with "Anbindung" overlay + distances list (Tram 89 0,5 km · S5 Hegermühle · EDEKA · Grundschule am Annatal · B1 · BER) from Wissensdatei §3. **Interactive map:** OpenStreetMap embed centered on Ernst-Thälmann-Straße / Strausberg-Vorstadt area (area-level, no misleadingly precise pin) in a rounded card with a styled label. Copy uses "Annafließ" as brand name only.
- [ ] **Wohnungen:** 3 cards — Gartengeschoss (30–55 m²), Wohnungen am Hang (40–70 m²), Dachgeschoss (ab 60 m²) — image + size + description (Wissensdatei §4/§5).
- [ ] **Garten & Außenanlagen:** full-bleed image section, side gradient, copy on private terraced Mietergärten + Hainbuchenhecken, tag chips (Terrassierte Gärten · Hainbuchenhecken · Stellplatz-Option · versickerungsfähiges Pflaster · naturnahe Begrünung).
- [ ] **Ausstattung & Technik:** text + 2×3 spec grid (Effizienzhausstandard · Luft-/Wasser-Wärmepumpe · Fußbodenheizung · bodengleiche Duschen · zeitlose Ausstattung · Verbrauchszähler je Wohnung) + image collage. Keep "modernster Effizienzhausstandard" (no invented EH-stage).
- **Done when:** all sections responsive (1180 → 768 → 480), grids reflow cleanly, copy matches Wissensdatei, images lazy-load with German alt-text.

## Phase 3 — Waitlist form (the core)
- [ ] Green section, two-column: sticky benefits column (unverbindlich/kostenlos · keine Reservierung · jederzeit informiert) + white form card.
- [ ] Fields (Wissensdatei §12): Vorname*, Nachname*, E-Mail*, Telefon; **Wohnungsgröße*** multi-select chips (30–40 / 40–55 / 55–70 m²); Zimmeranzahl (1/2/3); **Ausstattungswünsche** multi-select chips (Balkon · Terrasse · DG mit Naturblick · Individualgarten · Stellplatz · rollstuhlgerecht); Einzugszeitraum; Personen im Haushalt; Nachricht (textarea); Datenschutz-Einwilligung* (checkbox + link to `datenschutz.html`); Updates per E-Mail (optional separate consent).
- [ ] Interaction: chips toggle (keyboard-operable, `aria-pressed`), client-side validation (required + email pattern), honeypot field, submit → animated "Danke — Sie stehen auf der Warteliste!" success state replacing the form, smooth-scroll into view.
- [ ] Button microcopy + near-form disclaimer (CLAUDE.md §8). `// TODO: backend` hook clearly marked (no live send yet; double-opt-in noted).
- **Done when:** validation blocks bad input, chips/checkboxes keyboard-accessible, success state shows, no real network call, a11y labels present.

## Phase 4 — FAQ, footer, legal pages
- [ ] **FAQ accordion (4):** Bezug (vsl. Q2 2028) · Wie funktioniert die Warteliste (Double-Opt-In) · Kosten (nichts) · Barrierefrei (8 rollstuhlgerecht, ebenerdig). Single-open, animated, `aria-expanded`/`aria-controls`, keyboard-operable.
- [ ] **Footer:** brand + tagline, Kontakt (exact ET 89 eGbR data, CLAUDE.md §8), Navigation links, copyright, Impressum/Datenschutz links, full disclaimer paragraph.
- [ ] **`impressum.html`** — exact §13 data, ET 89 eGbR only (never EA-Plus), shared styling, back-to-home.
- [ ] **`datenschutz.html`** — DSGVO scaffold (Verantwortliche ET 89 eGbR, Zweck Warteliste, Rechtsgrundlage Art. 6(1)a, Betroffenenrechte) with a visible "rechtlich final zu prüfen" note.
- **Done when:** accordion works, footer data exact, both legal pages reachable + styled, disclaimers present in footer + near form.

## Phase 5 — Motion, a11y, SEO, performance polish
- [ ] **Motion:** IntersectionObserver scroll-reveal (fade-up, staggered grids); Ken-Burns hero; smooth hovers/transitions. All gated by `prefers-reduced-motion: reduce`.
- [ ] **A11y:** logical heading order (exactly one H1), skip-link, visible focus rings, color-contrast pass, `alt` on every image, `aria` on menu/accordion/form, labelled controls, `:focus-visible`.
- [ ] **SEO/meta:** verify title/description/canonical/OG/JSON-LD; generate `og-image` (1200×630, logo + nature) and favicon from `logos/`.
- [ ] **Performance:** font preconnect + `display=swap`, `loading="lazy"` + width/height on images (no CLS), Unsplash sized params, minimal/deferred JS, no blocking resources.
- **Done when:** keyboard-only walkthrough works, reduced-motion respected, no CLS on load, Lighthouse-style pass (Perf/A11y/Best/SEO all strong).

## Phase 6 — Verification (evidence before "done")
- [ ] Open in browser; confirm **zero console errors/warnings**.
- [ ] Click-through: header scroll state, mobile burger, every anchor, all 6 USP hovers, map interaction, form validation + chips + success state, all 4 FAQ items, footer links + both legal pages.
- [ ] Responsive check at 1440 / 1024 / 768 / 390 widths.
- [ ] Cross-check copy vs. Wissensdatei; confirm all §15 claims phrased safely (Hanghäuser scoping, "voraussichtlich", "Annafließ" as brand name, "ab 15 €/m² zzgl. NK", no invented EH-stage, no elevator).
- [ ] Confirm Impressum is ET 89 eGbR exactly; no EA-Plus data anywhere.
- **Done when:** all above verified by observation (screenshots/notes), not assumption.

---

## Definition of Done
A polished, fast, fully responsive, accessible German one-pager that looks award-worthy,
reads true to the Wissensdatei, keeps every contested claim legally defensible, drives to
a working (front-end) waitlist form with a clean backend hook, and ships with reachable
Impressum + Datenschutz pages.

## Risks / open items (carry to GF before real publish)
- Form has **no backend** yet — double-opt-in + DSGVO storage + spam are stubbed (CLAUDE.md §6/§9).
- Imagery is Unsplash placeholder — replace with real Strausberg/Annatal photos.
- Datenschutz text is a scaffold — needs legal review.
- All Wissensdatei §15 items remain "verify before publish" (units count, completion date, EH-stage, rent basis, names, accessibility, coords).

## Suggested execution order
Phases are sequential but 2 is parallelizable section-by-section. Build 0→1 first (the
shell + hero set the tone), then 2→3→4, then the 5 polish pass, then 6 verify.
