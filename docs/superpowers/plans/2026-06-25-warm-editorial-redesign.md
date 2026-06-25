# Warm Editorial Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-skin the Annatal Quartier one-pager into the approved "Warm Editorial" identity (Fraunces + Hanken Grotesk, logo-anchored palette, photo-led hero, calm editorial body, stream-line signature, one motion system) — preserving all functionality, a11y, SEO, legal, and the form.

**Architecture:** Plain static site, no build step, no framework (per `CLAUDE.md`). We edit `index.html`, `styles.css`, `script.js`; delete `gsap-animations.js`. Work proceeds foundation-first (tokens/type/motion) so the site stays renderable after every commit, then section-by-section recomposition.

**Tech Stack:** HTML5, hand-written CSS (custom properties), vanilla JS (IIFE), Google Fonts (Fraunces, Hanken Grotesk). Reference: `docs/superpowers/specs/2026-06-25-annatal-quartier-redesign-design.md`.

---

## ⚠️ Verification model (read first — no test runner)

This project has **no build step and no test framework** (CLAUDE.md). The skill's TDD/pytest pattern does not apply; **verification is browser-based and manual/automated-visual.** Every task's "Verify" step uses this harness:

**Start a local server once (keep running):**
```bash
cd "C:/Users/alist/Desktop/Annatal Quartier"
python -m http.server 8000
```
Open `http://localhost:8000`.

**Automated option (recommended for screenshots/console):** use the **example-skills:webapp-testing** skill (Playwright) to load `http://localhost:8000`, screenshot at desktop (1280px) and mobile (375px) widths, and assert **no console errors**. The brainstorm **visual companion** (already running) can also display screenshots for side-by-side review.

**Standing acceptance checks (must stay green after every task):**
- No JavaScript console errors.
- Page renders top-to-bottom with no layout overflow (no horizontal scrollbar) down to 320px.
- Keyboard: Tab reaches all controls; visible focus rings; skip-link works.
- `prefers-reduced-motion: reduce` (DevTools → Rendering) disables entrance motion and the page is fully visible.

---

## File structure

| File | Responsibility | Change |
|---|---|---|
| `index.html` | Markup, meta/OG/JSON-LD, fonts/scripts links | Swap fonts; remove GSAP scripts; recompose hero + several sections (cards→lists); add stream-divider SVGs. Keep all meta/JSON-LD/form/a11y. |
| `styles.css` | Tokens + all styling | New token layer + type system + grain; restyle every section; remove `html.gsap-on` hooks. |
| `script.js` | Behavior (nav, reveal, FAQ, chips, form) | Remove the `gsap-on` yield in reveal; everything else unchanged. |
| `gsap-animations.js` | GSAP enhancement layer | **Delete.** |
| `impressum.html`, `datenschutz.html` | Legal pages | Inherit new shell; verify only. |
| `CLAUDE.md` | Project guide | Update §4 to the new identity. |

---

## Phase A — Foundation (identity baseline)

### Task A1: Branch + baseline screenshot

**Files:** none (git + verification only)

- [ ] **Step 1: Create a working branch**
```bash
cd "C:/Users/alist/Desktop/Annatal Quartier"
git checkout -b redesign/warm-editorial
```

- [ ] **Step 2: Capture a "before" screenshot** for comparison. Start `python -m http.server 8000`, then via webapp-testing (Playwright) screenshot `http://localhost:8000` at 1280px and 375px, saving to the scratchpad. Note current look as the baseline.

- [ ] **Step 3: Confirm clean tree**
```bash
git status -sb
```
Expected: `## redesign/warm-editorial`, nothing to commit.

### Task A2: Swap fonts & remove GSAP in `index.html`

**Files:** Modify `index.html` (head: fonts link ~line 19; scripts ~lines 85-88)

- [ ] **Step 1:** Replace the Google Fonts `<link>` (current Montserrat+Inter) with Fraunces + Hanken Grotesk:
```html
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Hanken+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
```

- [ ] **Step 2:** Remove the three GSAP-related script tags, keeping only `script.js`. The `<head>` script block becomes:
```html
  <link rel="stylesheet" href="styles.css">
  <script src="script.js" defer></script>
```
(Delete the `gsap.min.js`, `ScrollTrigger.min.js`, and `gsap-animations.js` lines.)

- [ ] **Step 3: Verify** — reload `http://localhost:8000`. Page still loads; **no console errors** (no failed GSAP requests). Fonts will look wrong until A3 — acceptable. Headings/body now fall back to Fraunces/Hanken once CSS lands.

- [ ] **Step 4: Delete the GSAP file & commit**
```bash
git rm gsap-animations.js
git add index.html
git commit -m "redesign: swap to Fraunces+Hanken Grotesk, remove GSAP layer"
```

### Task A3: Replace design tokens in `styles.css`

**Files:** Modify `styles.css` `:root` (lines ~30-93) — palette + fonts; keep layout/spacing/motion vars.

- [ ] **Step 1:** Replace the palette and font vars in `:root` with:
```css
  /* Palette — Warm Editorial, anchored to the logo */
  --c-paper: #F7F4EC;
  --c-surface: #FFFFFF;
  --c-sage-tint: #EEF1E7;
  --c-forest: #243027;
  --c-forest-deep: #1E2A20;
  --c-primary: #4F6B3A;
  --c-primary-dark: #3C5430;
  --c-secondary: #9CB080;   /* sage (kept name for existing selectors) */
  --c-sand: #C5AD8D;
  --c-water: #53676E;       /* stream (kept name) */
  --c-ink: #243027;
  --c-ink-soft: #526054;
  --c-bg: #F7F4EC;          /* = paper (kept name) */
  --c-line: #E5E0D5;
  --c-line-soft: #ECE7DC;

  /* Derived */
  --c-icon-bg: #EAEFE0;
  --c-primary-soft: rgba(79, 107, 58, 0.10);
  --c-on-dark: #FFFFFF;
  --c-on-dark-soft: rgba(255, 255, 255, 0.80);
  --c-on-dark-faint: rgba(255, 255, 255, 0.58);
  --c-error: #B23A2E;
  --c-error-soft: #C24A3D;

  /* Fonts */
  --font-head: 'Fraunces', Georgia, 'Times New Roman', serif;
  --font-body: 'Hanken Grotesk', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
```
> Note: variable **names** (`--c-secondary`, `--c-water`, `--c-bg`) are kept so existing selectors keep working; only values changed. New names (`--c-paper`, `--c-forest`, etc.) are added for new work.

- [ ] **Step 2:** Soften shadows — reduce the shadow tokens (keep names) so only the form card reads as raised:
```css
  --shadow-xs: 0 1px 2px rgba(36, 48, 39, 0.04);
  --shadow-sm: 0 2px 6px rgba(36, 48, 39, 0.05);
  --shadow-md: 0 8px 24px -14px rgba(36, 48, 39, 0.16);
  --shadow-lg: 0 20px 48px -24px rgba(36, 48, 39, 0.22);
  --shadow-header: 0 6px 22px -16px rgba(36, 48, 39, 0.26);
```

- [ ] **Step 3: Verify** — reload. Whole page re-tints to the warm palette; greens shift slightly; text is forest. No console errors.

- [ ] **Step 4: Commit**
```bash
git add styles.css
git commit -m "redesign: new logo-anchored color tokens + softened shadows"
```

### Task A4: New typography (sentence case, Fraunces scale)

**Files:** Modify `styles.css` Typography section (lines ~183-278).

- [ ] **Step 1:** Replace `.hero__title` and `.section-title` rules — drop `text-transform:uppercase` and tracking; switch to Fraunces sentence-case scale:
```css
.hero__title {
  font-family: var(--font-head);
  font-weight: 500;
  font-size: clamp(2.5rem, 1.6rem + 4vw, 4rem);
  line-height: 1.06;
  letter-spacing: -0.012em;
  text-transform: none;
  color: var(--c-ink);
}
.section-title {
  font-family: var(--font-head);
  font-weight: 500;
  font-size: clamp(1.9rem, 1.3rem + 2.4vw, 2.6rem);
  line-height: 1.1;
  letter-spacing: -0.012em;
  text-transform: none;
  color: var(--c-forest);
}
.section-title--light { color: var(--c-on-dark); }
```

- [ ] **Step 2:** Update H3 group to Fraunces 500 sentence case:
```css
.usp-card__title,
.home-card__title,
.form-success__title,
.site-footer__heading {
  font-family: var(--font-head);
  font-weight: 500;
  font-size: clamp(1.2rem, 1.05rem + 0.5vw, 1.4rem);
  line-height: 1.25;
  letter-spacing: -0.005em;
  text-transform: none;
  color: var(--c-ink);
}
```
> `.site-footer__heading` keeps its own uppercase rule later (it's a label); re-add `text-transform:uppercase; font-family:var(--font-body); font-size:.78rem;` in its section rule (Task F3).

- [ ] **Step 3:** Keep `.eyebrow` uppercase but recolor + retrack (label role):
```css
.eyebrow {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--c-primary);
}
.eyebrow--light { color: var(--c-secondary); }
```

- [ ] **Step 4:** Remove the ≤430px uppercase H1 hack (lines ~1904-1909) — sentence-case wraps fine; delete that `.hero__title` override inside the `@media (max-width:430px)` block.

- [ ] **Step 5: Verify** — headings are now Fraunces sentence case; eyebrows small uppercase. Check the hero H1 and a couple of section titles. No overflow at 320px.

- [ ] **Step 6: Commit**
```bash
git add styles.css
git commit -m "redesign: Fraunces sentence-case type scale, eyebrow as label"
```

### Task A5: Paper grain + consolidate motion CSS

**Files:** Modify `styles.css` (base/body ~line 121; reveal section ~1692-1736).

- [ ] **Step 1:** Add a subtle static grain over the page background. Append to the `body` rule a layered background using an inline SVG noise data-URI at low opacity:
```css
body {
  background-color: var(--c-bg);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
  /* ...keep existing font/color/line-height rules... */
}
```

- [ ] **Step 2:** Remove the GSAP handshake CSS (the `html.gsap-on .reveal`, `html.gsap-on .hero__content`, `html.gsap-on .hero__img` rules ~lines 1718-1736). Keep the plain `.reveal` / `.reveal.is-in` / `.reveal--stagger` rules.

- [ ] **Step 3:** Vary the stagger so reveals aren't mechanically uniform — adjust `.reveal--stagger` child delays to an organic ramp:
```css
.reveal--stagger > *:nth-child(1){transition-delay:40ms}
.reveal--stagger > *:nth-child(2){transition-delay:110ms}
.reveal--stagger > *:nth-child(3){transition-delay:160ms}
.reveal--stagger > *:nth-child(4){transition-delay:240ms}
.reveal--stagger > *:nth-child(5){transition-delay:280ms}
.reveal--stagger > *:nth-child(6){transition-delay:360ms}
```

- [ ] **Step 4: Edit `script.js`** — remove the GSAP yield in the reveal IIFE (lines ~132-135): delete the
`if (document.documentElement.classList.contains('gsap-on')) return;` block and its comment. The native IntersectionObserver reveal is now the sole system. Leave everything else unchanged.

- [ ] **Step 5: Verify** — scroll the page: sections fade/rise once, with varied timing. Toggle reduced-motion: everything appears instantly, fully visible. Grain is barely perceptible on the paper bg, invisible over photos. No console errors.

- [ ] **Step 6: Commit**
```bash
git add styles.css script.js
git commit -m "redesign: paper grain, single IO motion system, varied reveal timing"
```

---

## Phase B — Header & Hero

### Task B1: Header / nav re-skin

**Files:** Modify `styles.css` Header section (lines ~424-591).

- [ ] **Step 1:** Update the scrolled header surface to warm paper + the new line/shadow (values already flow from tokens). Confirm `.site-header.is-scrolled` uses `rgba(247,244,236,0.96)`:
```css
.site-header.is-scrolled {
  background-color: rgba(247, 244, 236, 0.94);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  border-bottom-color: var(--c-line);
  box-shadow: var(--shadow-header);
}
```

- [ ] **Step 2:** Set nav links to `--font-body`, weight 500, no uppercase (they're sentence-case words already). Confirm `.site-nav__link { font-family: var(--font-body); }`.

- [ ] **Step 3: Verify** — over the hero the header is transparent with white logo/links; after scrolling 40px it frosts to warm paper with forest links and the green CTA. Mobile burger still opens the off-canvas panel (logic unchanged). No console errors.

- [ ] **Step 4: Commit**
```bash
git add styles.css
git commit -m "redesign: header/nav to warm paper + Hanken nav"
```

### Task B2: Hero recomposition (photo-led, anchored)

**Files:** Modify `index.html` hero (lines ~116-143); `styles.css` hero (lines ~596-751).

- [ ] **Step 1: Markup** — keep the hero structure; the content is already bottom-anchored. Add the stream-line SVG just before `</section>` of the hero and remove the mouse scroll-cue block (`.hero__scroll`). Replace the `.hero__scroll` markup with:
```html
      <svg class="hero__stream" viewBox="0 0 1000 40" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 24 C 150 6, 300 6, 440 20 S 740 38, 1000 14" fill="none" stroke="var(--c-sand)" stroke-width="2" opacity="0.85"/>
      </svg>
```
Keep the existing H1 markup (it already contains the hidden "Annatal Quartier Strausberg —" for SEO + visible "Wohnen am Naturschutzgebiet").

- [ ] **Step 2: CSS** — lighten the scrim to an asymmetric gradient and add the stream:
```css
.hero__overlay {
  position: absolute; inset: 0; z-index: -1;
  background:
    linear-gradient(105deg, rgba(20,28,22,0.66) 0%, rgba(20,28,22,0.28) 44%, rgba(20,28,22,0) 76%),
    linear-gradient(to top, rgba(20,28,22,0.52), rgba(20,28,22,0) 46%);
}
.hero__stream { position: absolute; left: 0; right: 0; bottom: 0; z-index: 2; height: 38px; }
```
Delete the `.hero__scroll*` and `@keyframes scrollCue` rules (lines ~703-751).

- [ ] **Step 3:** Keep the CSS Ken-Burns (`heroKenBurns`) as the only hero motion (the JS parallax is gone). Confirm `.hero__img { animation: heroKenBurns 9s var(--ease-out) both; }` remains and is gated by reduced-motion (it is, via the global block).

- [ ] **Step 4: Verify** — hero shows the photo with a lighter left-weighted scrim; H1 in white Fraunces sentence case anchored bottom-left; sand stream line along the foot; no mouse cue. CTA + ghost button present. Reduced-motion: no Ken-Burns. No console errors.

- [ ] **Step 5: Commit**
```bash
git add index.html styles.css
git commit -m "redesign: photo-led anchored hero + stream foot, drop mouse cue"
```

---

## Phase C — Intro/stats & USPs

### Task C1: Intro + editorial stat row

**Files:** Modify `index.html` intro/stats (lines ~146-175); `styles.css` (lines ~755-834).

- [ ] **Step 1: Markup** — replace the `.intro__stats` boxed tiles with an editorial row (no boxes). Swap the four `.stat-tile` blocks for:
```html
          <div class="intro__stats reveal reveal--stagger">
            <div class="stat"><span class="stat__num">22</span><span class="stat__label">Mietwohnungen</span></div>
            <div class="stat"><span class="stat__num">30–70<small> m²</small></span><span class="stat__label">1–3 Zimmer</span></div>
            <div class="stat"><span class="stat__num">4</span><span class="stat__label">Häuser im Quartier</span></div>
            <div class="stat"><span class="stat__num">8</span><span class="stat__label">rollstuhlgerecht</span></div>
          </div>
```

- [ ] **Step 2: CSS** — replace `.intro__stats` / `.stat-tile*` rules with the hairline-divided editorial treatment:
```css
.intro__stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0; }
.stat { padding: 22px 24px 14px; border-top: 1px solid var(--c-line); }
.stat:nth-child(odd) { border-right: 1px solid var(--c-line); }
.stat__num {
  display: block; font-family: var(--font-head); font-weight: 500;
  font-size: clamp(2.2rem, 1.6rem + 2.4vw, 2.75rem); line-height: 1;
  color: var(--c-primary); letter-spacing: -0.01em;
}
.stat__num small { font-size: 0.42em; font-weight: 600; color: var(--c-ink-soft); }
.stat__label { display: block; margin-top: 10px; font-size: 0.72rem; letter-spacing: 0.06em; text-transform: uppercase; color: var(--c-ink-soft); }
```
(Delete old `.stat-tile`, `.stat-tile__num`, `.stat-tile__label`, `.stat-tile--accent` rules.)

- [ ] **Step 2b:** Remove the `@media (max-width:430px) .intro__stats` override if it conflicts (keep 2-col on phones; it already does).

- [ ] **Step 3: Verify** — intro shows Fraunces H2 + paragraph; the four figures are big Fraunces numerals split by hairlines, no boxes, no hover-lift. No overflow at 320px.

- [ ] **Step 4: Commit**
```bash
git add index.html styles.css
git commit -m "redesign: editorial stat numerals (de-boxed)"
```

### Task C2: USPs → restrained editorial list

**Files:** Modify `index.html` USPs (lines ~178-225); `styles.css` (lines ~839-890).

- [ ] **Step 1: Markup** — wrap the USP section in the asymmetric grid and convert the 6 `.usp-card` articles into hairline list rows. Replace the section body with a section head + list:
```html
    <section class="section usps">
      <div class="container">
        <div class="usp-layout">
          <div class="section-head reveal">
            <p class="eyebrow">Darum Annatal Quartier</p>
            <h2 class="section-title">Sechs gute Gründe,<br>hier zu wohnen.</h2>
          </div>
          <div class="usp-list reveal--stagger">
            <!-- repeat 6×: keep each existing <svg> icon, title, text -->
            <article class="usp reveal">
              <span class="usp__icon"><!-- existing leaf svg --></span>
              <div class="usp__body">
                <h3 class="usp-card__title">Am Naturschutzgebiet</h3>
                <p class="usp-card__text">Die Hanghäuser mit dem Schutzgebiet im Rücken — unverbaubare Ruhe, dauerhaft grün.</p>
              </div>
            </article>
            <!-- ...5 more, reusing the existing icons + copy verbatim... -->
          </div>
        </div>
      </div>
    </section>
```

- [ ] **Step 2: CSS** — replace `.usp-grid` / `.usp-card*` rules:
```css
.usp-layout { display: grid; grid-template-columns: 0.8fr 1.2fr; gap: clamp(32px, 5vw, 64px); align-items: start; }
.usp-list { display: flex; flex-direction: column; }
.usp { display: grid; grid-template-columns: 40px 1fr; gap: 20px; padding: 24px 0; border-top: 1px solid var(--c-line-soft); }
.usp:first-child { border-top: 0; }
.usp__icon { color: var(--c-primary); width: 40px; height: 40px; display: inline-flex; align-items: center; justify-content: center; }
.usp__icon svg { width: 24px; height: 24px; }
.usp__body p { color: var(--c-ink-soft); margin-top: 4px; }
@media (max-width: 768px) { .usp-layout { grid-template-columns: 1fr; gap: 28px; } }
```
(Delete `.usp-grid`, `.usp-card`, `.usp-card__icon`, hover-lift rules. The `@media (max-width:1024px) .usp-grid` rule too.)

- [ ] **Step 3: Verify** — USPs are a calm two-column editorial list: title block left, six hairline rows right with small green line-icons. No boxes, no hover-lift. Stacks to one column ≤768px.

- [ ] **Step 4: Commit**
```bash
git add index.html styles.css
git commit -m "redesign: USPs as restrained editorial list"
```

---

## Phase D — Lage & Wohnungen

### Task D1: Lage — asymmetric + restyle

**Files:** Modify `styles.css` Lage (lines ~895-1007). Markup mostly unchanged.

- [ ] **Step 1:** Keep the existing `.lage__grid` two-column. Lighten the map card (smaller shadow via tokens), keep the distance list (already hairline — good). Recolor the map badge eyebrow to `--c-primary`. Confirm `.lage` band uses `background: var(--c-surface)` (white tonal band).

- [ ] **Step 2:** Add a stream divider at the top of the Lage section. In `index.html`, immediately inside `<section class="section lage" ...>` before `.container`, add:
```html
      <div class="band-divider" aria-hidden="true"><svg viewBox="0 0 1000 44" preserveAspectRatio="none"><path d="M0 28 C 180 12, 320 12, 470 24 S 780 38, 1000 18" fill="none" stroke="var(--c-sand)" stroke-width="1.4"/></svg></div>
```
And the reusable CSS (add once, near the section utilities):
```css
.band-divider { width: 100%; }
.band-divider svg { display: block; width: 100%; height: 44px; }
```

- [ ] **Step 3: Verify** — Lage shows a stream divider, oversized Fraunces title, map + distances. Map iframe still loads; "Größere Karte" link works.

- [ ] **Step 4: Commit**
```bash
git add index.html styles.css
git commit -m "redesign: Lage stream divider + lighter map card"
```

### Task D2: Wohnungen → hairline list

**Files:** Modify `index.html` Wohnungen (lines ~277-316); `styles.css` (lines ~1012-1070).

- [ ] **Step 1: Markup** — convert the asymmetric layout: section head left, the three home types as a hairline list right. Replace `.home-grid` + `.home-card`s:
```html
        <div class="wohnungen__layout">
          <div class="section-head reveal">
            <p class="eyebrow">Die Wohnungen</p>
            <h2 class="section-title">Durchdachte Grundrisse,<br>jede mit Naturbezug.</h2>
          </div>
          <div class="home-list reveal--stagger">
            <article class="home">
              <img class="home__thumb" src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=320&q=70" alt="Helle Gartengeschoss-Wohnung mit Terrasse und Gartenbezug" width="320" height="240" loading="lazy">
              <div class="home__body">
                <span class="home-card__size">ca. 30–55 m²</span>
                <h3 class="home-card__title">Gartengeschoss</h3>
                <p>Helle, vollwertige Wohnungen mit eigener Terrasse und direktem Gartenbezug am Hang.</p>
              </div>
            </article>
            <!-- repeat for "Wohnungen am Hang" (photo-1522708323590) and
                 "Dachgeschoss" (photo-1560448204) — copy verbatim from current cards -->
          </div>
        </div>
```

- [ ] **Step 2: CSS** — replace `.home-grid`/`.home-card*`:
```css
.wohnungen__layout { display: grid; grid-template-columns: 0.78fr 1.22fr; gap: clamp(32px, 5vw, 64px); align-items: start; }
.home-list { display: flex; flex-direction: column; }
.home { display: grid; grid-template-columns: 84px 1fr; gap: 22px; align-items: center; padding: 26px 0; border-top: 1px solid var(--c-line-soft); }
.home:first-child { border-top: 0; padding-top: 0; }
.home__thumb { width: 84px; height: 64px; object-fit: cover; border-radius: 6px; filter: saturate(0.92); }
.home-card__size { font-family: var(--font-body); font-weight: 600; font-size: 0.64rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--c-sand); }
.home__body h3 { margin: 4px 0 5px; }
.home__body p { color: var(--c-ink-soft); font-size: 0.92rem; }
@media (max-width: 768px) { .wohnungen__layout { grid-template-columns: 1fr; gap: 28px; } }
```
(Delete `.home-grid`, `.home-card`, `.home-card__media`, hover-zoom rules.)

- [ ] **Step 3: Verify** — Wohnungen is a calm hairline list with small graded thumbnails, no boxes. Stacks ≤768px. Alt text present on each image.

- [ ] **Step 4: Commit**
```bash
git add index.html styles.css
git commit -m "redesign: Wohnungen as hairline list with thumbnails"
```

---

## Phase E — Garten & Ausstattung

### Task E1: Garten band re-skin

**Files:** Modify `styles.css` Garten (lines ~1075-1145).

- [ ] **Step 1:** Warm-grade the photo and lighten the gradient. Add to `.garten__media img`: `filter: saturate(0.95) contrast(1.02);`. Adjust `.garten__overlay` first gradient stop alpha down to `0.74`. Set Fraunces H2 (inherits `--font-head`). Quiet the `.tag` chips (thinner border, lower opacity bg).

- [ ] **Step 2: Verify** — Garten is a warm full-bleed band; light Fraunces title legible on the image; tags calm. Reduced-motion: no movement.

- [ ] **Step 3: Commit**
```bash
git add styles.css
git commit -m "redesign: Garten warm-graded band, calmer tags"
```

### Task E2: Ausstattung — spec list + gallery

**Files:** Modify `index.html` Ausstattung specs (lines ~348-385); `styles.css` (lines ~1150-1224).

- [ ] **Step 1: Markup** — convert the 6 boxed `.spec` tiles into a hairline list. Wrap the existing 6 spec items (keep each `<svg>` + label) so they render as rows:
```html
            <div class="spec-list">
              <div class="spec"><span class="spec__icon"><!-- existing svg --></span><span class="spec__label">Effizienzhausstandard</span></div>
              <!-- ...5 more, copy verbatim... -->
            </div>
```

- [ ] **Step 2: CSS** — replace `.spec-grid`/`.spec` boxed rules:
```css
.spec-list { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0 clamp(20px, 3vw, 40px); margin-top: clamp(24px, 3vw, 36px); }
.spec { display: flex; align-items: center; gap: 14px; padding: 16px 0; border-top: 1px solid var(--c-line-soft); background: none; box-shadow: none; border-radius: 0; }
.spec__icon { width: 34px; height: 34px; flex: 0 0 auto; display: inline-flex; align-items: center; justify-content: center; color: var(--c-primary); background: none; }
.spec__label { font-weight: 500; font-size: 0.92rem; color: var(--c-ink); }
@media (max-width: 560px){ .spec-list { grid-template-columns: 1fr; } }
```
Keep the `.ausstattung__gallery` (the asymmetric image grid) — add `filter: saturate(0.95)` to `.ausstattung__img` for grade consistency.

- [ ] **Step 3: Verify** — specs are a 2-col hairline list (1-col on phones); gallery unchanged but graded. No boxes/shadows on specs.

- [ ] **Step 4: Commit**
```bash
git add index.html styles.css
git commit -m "redesign: Ausstattung spec list + graded gallery"
```

---

## Phase F — Warteliste, FAQ, Footer

### Task F1: Warteliste re-skin (form behavior untouched)

**Files:** Modify `styles.css` Warteliste (lines ~1229-1509). **Do not touch the form markup or `script.js` form logic.**

- [ ] **Step 1:** Change the section background to forest-deep:
```css
.warteliste { background-color: var(--c-forest-deep); color: #fff; }
```
Confirm the form card stays `--c-surface` with `--shadow-lg` (the one allowed raised surface). Inputs keep `--c-bg` (paper) fields. Chips: active = `--c-primary`.

- [ ] **Step 2: Verify form still works end-to-end** (critical):
  - Submit empty → inline errors on Vorname/Nachname/E-Mail/Größe + Datenschutz, focus moves to first invalid.
  - Pick a size chip → its error clears live.
  - Fill valid + check Datenschutz + submit → success card appears, form hides, focus on heading, scrolls to anchor.
  - Honeypot: set `kontakt_zusatz` via DevTools → submit silently no-ops.
  - Keyboard: all fields/chips reachable; visible focus on the forest band.

- [ ] **Step 3: Commit**
```bash
git add styles.css
git commit -m "redesign: Warteliste forest-deep band (form behavior unchanged)"
```

### Task F2: FAQ → hairline rows

**Files:** Modify `styles.css` FAQ (lines ~1514-1593). Markup + JS unchanged.

- [ ] **Step 1:** Flatten the boxed accordion to hairline rows:
```css
.faq-item { background: none; border: 0; border-top: 1px solid var(--c-line); border-radius: 0; box-shadow: none; overflow: visible; }
.faq-item:last-child { border-bottom: 1px solid var(--c-line); }
.faq-item.is-open { border-color: var(--c-line); box-shadow: none; }
.faq-item__q { font-family: var(--font-head); font-weight: 500; }
.faq-item__icon { background: none; color: var(--c-primary); }
.faq-item.is-open .faq-item__icon { transform: rotate(45deg); background: none; color: var(--c-primary-dark); }
```

- [ ] **Step 2: Verify** — FAQ is a clean hairline-ruled list; click/keyboard toggles single-open; `+` rotates to `×`; `aria-expanded`/`hidden` flip correctly.

- [ ] **Step 3: Commit**
```bash
git add styles.css
git commit -m "redesign: FAQ as hairline rows"
```

### Task F3: Footer → forest-deep + closing mark

**Files:** Modify `styles.css` Footer (lines ~1598-1688); `index.html` footer (add closing stream mark).

- [ ] **Step 1:** Set `.site-footer { background-color: var(--c-forest-deep); }`. Re-add the footer heading label style (it lost uppercase in A4):
```css
.site-footer__heading { font-family: var(--font-body); font-weight: 600; font-size: 0.78rem; letter-spacing: 0.14em; text-transform: uppercase; color: #fff; }
```

- [ ] **Step 2:** Add a quiet stream mark above `.site-footer__top` in `index.html`:
```html
      <svg class="footer-stream" viewBox="0 0 1000 30" preserveAspectRatio="none" aria-hidden="true"><path d="M0 18 C 160 6, 320 6, 470 16 S 780 28, 1000 12" fill="none" stroke="var(--c-sand)" stroke-width="1.2" opacity="0.5"/></svg>
```
```css
.footer-stream { display: block; width: 100%; height: 30px; margin-bottom: clamp(28px, 4vw, 44px); }
```

- [ ] **Step 3: Verify** — footer is forest-deep with the new headings, a faint stream mark, and the **full disclaimer text verbatim**; Impressum/Datenschutz links present. Contrast of muted footer text on forest-deep passes AA for body size.

- [ ] **Step 4: Commit**
```bash
git add index.html styles.css
git commit -m "redesign: footer forest-deep + closing stream mark"
```

---

## Phase G — Polish & micro-interactions

### Task G1: Buttons, micro-interactions, image grade

**Files:** Modify `styles.css` Buttons (lines ~352-419) + image rules.

- [ ] **Step 1:** Buttons keep green fill but switch label to `--font-body`, sentence-case-ish small caps off (`text-transform:none`), keep the arrow nudge micro-interaction. Confirm `.btn { font-family: var(--font-body); text-transform: none; letter-spacing: 0; }`.

- [ ] **Step 2:** Apply a consistent warm grade to any remaining ungraded content images (hero excluded for clarity) via a shared rule if not already set per-section: `.home__thumb, .ausstattung__img, .garten__media img { filter: saturate(0.95); }` (merge with existing).

- [ ] **Step 3:** Remove leftover global hover-lift transitions on any element still carrying `translateY(-…px)` on hover that the spec retired (search `translateY(-` in styles.css; keep only button `:active`/`:hover` nudge).

- [ ] **Step 4: Verify** — buttons read as Hanken labels with a subtle arrow nudge; images share one warm tone; no element "lifts" on hover except buttons.

- [ ] **Step 5: Commit**
```bash
git add styles.css
git commit -m "redesign: button labels, unified image grade, retire hover-lift"
```

---

## Phase H — Guardrails, legal, finalize

### Task H1: Accessibility & contrast audit

**Files:** none (verification) → fix in styles.css if needed.

- [ ] **Step 1:** With the local server running, run an a11y pass (axe via webapp-testing/Playwright, or manual): check color contrast for forest text on paper, ink-soft on paper/white, white/sage on forest-deep and on the hero scrim, green CTA text. Target **WCAG AA** (4.5:1 body, 3:1 large).

- [ ] **Step 2:** Fix any failing pair by nudging the token (e.g., darken `--c-ink-soft` if it fails on white). Re-verify.

- [ ] **Step 3:** Confirm focus rings visible on all controls over paper, forest-deep, and the hero photo. Skip-link works.

- [ ] **Step 4: Commit** (only if changes)
```bash
git add styles.css
git commit -m "redesign: contrast/a11y fixes to meet WCAG AA"
```

### Task H2: SEO / structured-data / claims integrity

**Files:** Verify `index.html`.

- [ ] **Step 1:** Confirm exactly **one `<h1>`** and it still contains "Annatal Quartier" + "Strausberg" (the visually-hidden span). `grep` check:
```bash
grep -c "<h1" index.html   # expect 1
```

- [ ] **Step 2:** Confirm title, meta description, canonical, robots, OG, Twitter, and the `@graph` JSON-LD block are intact and unchanged.

- [ ] **Step 3:** Confirm **defensible claims** wording survived (spec §8): "voraussichtlich" Q2 2028; nature claims scoped to Hanghäuser; "ab 15 €/m²*" + Nettokaltmiete/Nebenkosten disclaimer; no invented EH-stage; "ebenerdige/barrierefreie Zuwegung"; both legal disclaimers present near form + footer.

- [ ] **Step 4: Commit** (only if fixes needed).

### Task H3: Legal pages re-skin verify

**Files:** Verify `impressum.html`, `datenschutz.html`.

- [ ] **Step 1:** Open `http://localhost:8000/impressum.html` and `/datenschutz.html`. They share the shell → new tokens/type apply automatically. Confirm headers/footers render in the new identity, the `.legal*` styles read well in Fraunces/Hanken, and the **ET 89 eGbR Impressum content is unchanged**.

- [ ] **Step 2:** Fix any legal-page-specific spacing/type issues in the `.legal*` rules (styles.css §20) if needed.

- [ ] **Step 3: Commit** (only if changes)
```bash
git add styles.css
git commit -m "redesign: verify + polish legal pages in new identity"
```

### Task H4: Update `CLAUDE.md` §4

**Files:** Modify `CLAUDE.md` §4 (Brand system).

- [ ] **Step 1:** Replace the §4 palette + type tables to record the new identity: Fraunces (display, sentence case) + Hanken Grotesk (body); the logo-anchored palette tokens from spec §3.1; eyebrow-only uppercase; the stream-line signature; single IO motion system. Add a one-line note: "Supersedes the prior AI-placeholder type spec; logo remains the fixed brand anchor."

- [ ] **Step 2: Commit**
```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md brand system to Warm Editorial identity"
```

### Task H5: Full-page final verification

**Files:** none.

- [ ] **Step 1:** Full read-through at 1280px and 375px (Playwright screenshots via webapp-testing). Compare against the brainstorm mockups and spec. Confirm the four "AI tells" are gone (no Montserrat/Inter, no centered hero, no repeated white cards, no uniform fade-up).

- [ ] **Step 2:** Re-run the standing acceptance checks (top of plan): no console errors; no horizontal overflow to 320px; keyboard + focus; reduced-motion fully visible.

- [ ] **Step 3:** Confirm relative paths intact (GitHub Pages): no leading-slash asset URLs; `.nojekyll` still present.

- [ ] **Step 4:** Stop the local server. Done.

---

## Self-review notes (author)
- **Spec coverage:** §3 tokens→A3/A4/A5; §3.4 signature→B2/D1/F3; §4 composition→C2/D2/E2; §5 sections→B–F (each section has a task); §6 motion→A2/A5/B2; §7 imagery→E1/E2/G1; §8 guardrails→H1/H2/H3; §9 files→all; §11 decisions baked in; §12 defaults (stream tick = the hero/divider streams; "→" omitted in calm list per B). ✔
- **No placeholders:** every code step shows real CSS/HTML/JS or an exact command. Repeated section markup says "copy verbatim from current cards" with the exact source lines cited. ✔
- **Naming consistency:** kept legacy var names (`--c-secondary`, `--c-water`, `--c-bg`) to avoid breaking untouched selectors; new names additive. Class renames (`.stat-tile`→`.stat`, `.usp-card`→`.usp`, `.home-card`→`.home`, `.spec-grid`→`.spec-list`) are each paired with their CSS in the same task. ✔
