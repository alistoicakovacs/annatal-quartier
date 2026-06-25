# CLAUDE.md — Annatal Quartier One-Pager

Guidance for any AI/dev working in this repo. Read this before touching code.

## 1. What this is

A single, award-winning **marketing one-pager** (Landingpage) for **Annatal Quartier** —
a new rental housing development in Strausberg (Brandenburg, DE), directly at the
nature reserve "am Annafließ". Four largely identical apartment buildings, **22 rental
units**, ~30–70 m², 1–3 rooms. Three buildings sit on a hillside with the reserve at
their back; one sits across the street.

**The single goal of the site:** collect non-binding waitlist sign-ups (Vormerkung).
It is *not* a booking, reservation, or rental contract. Everything on the page serves
that one conversion: "Jetzt unverbindlich auf die Warteliste."

Language of all user-facing copy: **German (de-DE).** Code, comments, this file: English.

## 2. Source of truth

| What | Where |
|------|-------|
| **Content, facts, copy, styleguide** | `Wissensdatei_Annatal_Quartier_Website 2.pdf` (the briefing). This wins on any conflict. |
| **Reference design** | Imported from Claude Design (project `58430e64-…`), file `Annatal Quartier.dc.html`. Visual/layout reference only — it uses a proprietary `<x-dc>`/`support.js` runtime that does NOT run as a real site. We reimplement it as standalone code. |
| **Brand assets** | `logos/` — `Annatal-Quartier_Logo.svg` (+ .png, .jpg) and `_White.svg/.png` for dark backgrounds. |

When in doubt about a fact (a number, a name, a price), check the Wissensdatei, not the
imported design or memory.

## 3. Build decisions (locked)

- **Structure:** separate files — `index.html`, `styles.css`, `script.js`, local `logos/` and `img/` (if localized). Not a single inline file.
- **Scope:** *elevate* the imported design to award-winning — real brand logo, refined scroll-reveal motion, mobile burger nav, interactive location map, richer gallery, micro-interactions, full a11y + SEO. Keep its DNA (palette, type, section order).
- **Form:** front-end demo only for now — validation + "Danke, Warteliste" success state + DSGVO consent checkboxes + honeypot. A clearly-marked hook (`// TODO: backend`) marks where a real backend (Formspree/Netlify/own endpoint w/ double-opt-in) plugs in. No live submissions yet.
- **Imagery:** curated Unsplash nature photography, hotlinked with optimized params, `loading="lazy"`, descriptive German alt-text. Swap for real Strausberg/Annatal photos later.

## 4. Brand system (Wissensdatei §2 — authoritative)

### Palette (CSS variables)
```css
--c-primary:#4F6B3A;       /* Dunkelgrün — leads: buttons, H2, accents */
--c-primary-dark:#3C5430;  /* hover / depth */
--c-secondary:#8FAE6B;     /* Salbeigrün — secondary surfaces, eyebrows */
--c-sand:#C9B79C;          /* warm accent — sparingly */
--c-water:#5E7585;         /* blue-grey (the stream) — sparing accent/icons */
--c-ink:#2E3A40;           /* anthracite — body text & wordmark */
--c-ink-soft:#55636B;      /* muted text */
--c-bg:#F7F5F0;            /* warm off-white — page background */
--c-surface:#FFFFFF;       /* cards/surfaces */
--c-line:#E5E1D8;          /* hairline dividers */
```
Green leads. Sand/blue-grey only as sparing accents. Work large areas light/neutral;
place colour deliberately. (Logo's own greens — `#53683D`, `#9CB080`, `#C5AD8D`,
`#53676E` — are close cousins; the variables above lead for UI.)

### Type — two fonts only (Google Fonts)
- **Montserrat** (headings): 500/600/700, UPPERCASE with wide tracking for H1/H2.
- **Inter** (body): 400/500/600.

| Role | Font | Size desk/mob | Weight | Style | Colour |
|------|------|---------------|--------|-------|--------|
| H1 hero | Montserrat | 52/34 | 700 | UPPERCASE, `letter-spacing:.08em`, `line-height:1.1` | ink (on photo: white) |
| H2 section | Montserrat | 34/26 | 700 | UPPERCASE, `.04em` | primary |
| H3 | Montserrat | 22/19 | 600 | sentence case | ink |
| Eyebrow/kicker | Montserrat | 13 | 600 | UPPERCASE, `.12em` | secondary |
| Lead/intro | Inter | 20/18 | 400 | `line-height:1.5` | ink-soft |
| Body | Inter | 17/16 | 400 | `line-height:1.6` | ink |
| Small/legal | Inter | 13 | 400 | `line-height:1.5` | ink-soft |

### Layout & feel
- Content max-width ~1140–1180px, centered. Section padding ~96px desktop / 48px mobile.
- Generous whitespace, rounded corners 8–12px, soft subtle shadows.
- Header ~76px desktop / 60px mobile, logo ~40px high, off-white bg, **sticky**, gains a soft shadow + blur on scroll; **burger menu on mobile**, CTA stays visible.
- Icons: thin line (1.5–2px), nature motifs (leaf, hill, water, house), in dark-green/blue-grey.
- Mobile-first, fast load, optimized images, good Core Web Vitals.

### Do / Don't
- **Do:** whitespace · nature photos · calm greens · uppercase tracked headings · clear CTAs.
- **Don't:** garish colours · >2 fonts · shadow/effect overload · stock photos with no nature link · cluttered layouts.

## 5. Page structure (Wissensdatei §10)

1. **Hero** — logo, headline, full-bleed nature photo, primary CTA "Auf die Warteliste".
2. **Quartier in Kürze** — 4–6 key points + stat tiles (22 / 30–70 m² / 4 Häuser / 8 rollstuhlgerecht).
3. **Lage** — bullets + distances (+ optional interactive map). Anchor `#lage`.
4. **Wohnungen** — size range 30–70 m², unit types, nature/view, DG terrace, accessible units. `#wohnungen`.
5. **Garten & Außenanlagen** — private Mietergarten per unit, terracing, hedges, parking. `#garten`.
6. **Ausstattung & Technik** — efficiency standard, heat pump, underfloor heating. `#ausstattung`.
7. **Warteliste-Formular** — the core. `#warteliste`.
8. **FAQ** — Bezug? Wie funktioniert die Warteliste? Kosten (nichts)? Barrierefrei?
9. **Footer** — Kontakt, Impressum, Datenschutz, "unverbindlich / Änderungen vorbehalten".

CTA repeated multiple times.

## 6. Waitlist form spec (Wissensdatei §12)

Fields: Vorname*, Nachname*, E-Mail*, Telefon, **Gewünschte Wohnungsgröße*** (multi:
30–40 / 40–55 / 55–70 m²), Zimmeranzahl (1/2/3), **Ausstattungswünsche** (multi:
Balkon · Terrasse · DG mit Naturblick · Individualgarten · Stellplatz · rollstuhlgerecht),
Einzugszeitraum, Personen im Haushalt, Nachricht, **Datenschutz-Einwilligung*** (with link),
Updates per E-Mail (optional, separate consent).
Requirements: double-opt-in (when backend lands), honeypot/spam-protection, friendly
"Danke" confirmation, button microcopy: *"Die Eintragung ist unverbindlich und stellt
keine Reservierung oder Anmietung dar."* Accessible (labels, contrast, keyboard).

## 7. SEO / technical (Wissensdatei §11)

- `<html lang="de">`, exactly **one H1** containing "Annatal Quartier" + "Strausberg".
- Title: `Annatal Quartier Strausberg – Mietwohnungen am Naturschutzgebiet | Warteliste`
- Meta description, canonical `https://annatal-quartier.de/`, robots `index,follow`.
- Open Graph + Twitter card (og:image 1200×630, logo/nature).
- JSON-LD `@graph`: `WebSite`, `Residence` (address: Ernst-Thälmann-Straße, 15344 Strausberg, Brandenburg, DE), `Organization` (ET 89 eGbR, Garzauer Chaussee 1a).
- Speaking anchors `#lage #wohnungen #garten #ausstattung #warteliste`, descriptive alt-text.

## 8. Impressum / legal (Wissensdatei §13) — use EXACTLY these, ET 89 eGbR only

```
ET 89 eGbR
Garzauer Chaussee 1a, 15344 Strausberg
Vertreten durch: Frederik Lippe (Geschäftsführung)
Registergericht: Amtsgericht Frankfurt (Oder), Gesellschaftsregister GsR 407 FF
vermietung@annatal-quartier.de · +49 (0) 3341 4272935
```
**Never** mix in EnergieAudit Plus / EA-Plus data (HRA 4373 FF) — different company.
Required disclaimers in footer + near the form:
- "Alle Angaben sind unverbindlich und dienen der allgemeinen Information. Änderungen, Irrtümer und Abweichungen (z. B. Flächen, Grundrisse, Ausstattung, Mietpreise, Fertigstellung) vorbehalten."
- "Die Eintragung in die Warteliste begründet keinen Anspruch auf Anmietung, keine Reservierung und kein Mietverhältnis."
- If renderings are shown: "Abbildungen sind unverbindliche Visualisierungen."

## 9. ⚠️ Claims to keep defensible (Wissensdatei §15 — open points)

These are flagged "verify before publishing." Until GF approval, copy must stay safe:

1. **Nature claims** ("Naturschutzgebiet im Rücken", "unverbaubare Ruhe", "grandioser Ausblick") apply to the **three Hanghäuser**, not all 22 units. Phrase accordingly — don't promise it for every apartment.
2. **Completion** Q2 2028 → always "**voraussichtlich**", never a binding date.
3. **Water/reserve name:** "**Annafließ**" is a deliberate brand/proper name only — do not present it as the official watercourse name (officially "Rödersdorfer Mühlenfließ"; "Annatal" is locally established).
4. **Rent** "ab 15 €/m²" → treat as Nettokaltmiete, add "zzgl. Nebenkosten".
5. **Efficiency standard:** copy says "modernster Effizienzhausstandard" (no concrete EH-stage yet). Don't invent "EH 55/40" until confirmed.
6. **Barrier-free:** 8 rollstuhlgerechte units via step-free hillside access (no elevator). Keep wording "ebenerdige/barrierefreie Zuwegung", not "Aufzug".
7. **22 units / sizes**: keep the range "ca. 30–70 m²" and "22" as planning figures (label "voraussichtlich/geplant" where natural).

Keep the standing disclaimer that all figures are subject to change.

## 10. Files & how to preview

```
index.html      # markup + meta/OG/JSON-LD
styles.css      # design tokens (vars from §4) + all styling
script.js       # sticky-header scroll, mobile nav, scroll-reveal, FAQ, form chips/validation/success
logos/          # brand assets (use _White on dark sections)
img/            # only if images get localized
PLAN.md         # the implementation plan
```
Preview: open `index.html` in a browser, or `python -m http.server` in this folder.
No build step, no framework, no dependencies beyond Google Fonts.
