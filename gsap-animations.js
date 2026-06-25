/* ==========================================================================
   Annatal Quartier — GSAP animation layer (progressive enhancement)
   --------------------------------------------------------------------------
   Loads AFTER gsap.min.js + ScrollTrigger.min.js, BEFORE script.js.
   If GSAP is missing OR the user prefers reduced motion, this file does
   nothing and the existing CSS + script.js `.reveal` baseline runs unchanged.

   The single handshake with the rest of the page is the `gsap-on` class on
   <html>: it is added ONLY when GSAP is active, which (a) neutralises the CSS
   reveal baseline (`html.gsap-on .reveal{opacity:1;transform:none}`) and
   (b) makes script.js's reveal observer yield. GSAP then owns entrance/reveal
   motion. Transforms/opacity only — no layout thrash, no header/form/FAQ.
   ========================================================================== */
(function () {
  'use strict';

  /* --- 1. Guards (order matters) ---------------------------------------- */

  // No GSAP core → bail. Page keeps its CSS+JS reveal baseline. Never throws.
  if (!window.gsap) return;

  // Respect reduced-motion. Bail before adding `gsap-on`, so the baseline
  // reveal (CSS + script.js observer) stays fully intact.
  if (window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;
  var hasScrollTrigger = !!ScrollTrigger;

  if (hasScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Handshake: from here on, GSAP owns reveal/entrance motion.
  document.documentElement.classList.add('gsap-on');

  // Small helpers — every lookup is null-checked so a missing node never throws.
  function $(sel, ctx) {
    return (ctx || document).querySelector(sel);
  }
  function $all(sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  }

  /* --- 2. Hero entrance timeline ---------------------------------------- */
  // Gentle staggered rise of the hero content's children, then the badge.
  // `.hero__content` is a `.reveal` element: with `gsap-on` the CSS no longer
  // hides it, so GSAP explicitly sets the start state and animates to visible,
  // guaranteeing it never gets stuck hidden.
  (function heroEntrance() {
    var heroContent = $('.hero__content');
    if (!heroContent) return;

    // Ordered list of real children that exist in index.html, plus the badge
    // (which is a sibling of `.hero__inner`, not a child of `.hero__content`).
    var targets = [
      $('.eyebrow', heroContent),       // .eyebrow.eyebrow--light
      $('.hero__title', heroContent),   // h1
      $('.hero__lead', heroContent),    // p
      $('.hero__actions', heroContent), // button row
      $('.hero__badge')                 // sibling — explicit document lookup
    ].filter(Boolean);

    // Make sure the container itself is fully visible (it is a `.reveal`).
    gsap.set(heroContent, { opacity: 1, clearProps: 'transform' });

    if (!targets.length) return;

    gsap.set(targets, { y: 24, opacity: 0 });

    gsap.to(targets, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.12,
      delay: 0.15,
      clearProps: 'transform'
    });
  })();

  /* --- 3. Staggered scroll reveals (all other `.reveal` blocks) ---------- */
  // Soft fade + rise as each batch enters the viewport, once (no replay on
  // scroll-up). Excludes `.hero__content`, which the timeline above handles.
  (function scrollReveals() {
    if (!hasScrollTrigger) {
      // No ScrollTrigger but GSAP exists: don't leave reveals hidden.
      // `gsap-on` already neutralised the CSS, so they are visible — but be
      // explicit and clear any transforms just in case.
      gsap.set($all('.reveal'), { opacity: 1, y: 0, clearProps: 'transform' });
      return;
    }

    var reveals = $all('.reveal').filter(function (el) {
      return !el.classList.contains('hero__content');
    });
    if (!reveals.length) return;

    // Start state: hidden + slightly lowered. (Container is visible via CSS;
    // we re-hide here so GSAP owns the in-animation.)
    gsap.set(reveals, { y: 24, opacity: 0 });

    ScrollTrigger.batch(reveals, {
      start: 'top 85%',
      once: true,
      onEnter: function (batch) {
        gsap.to(batch, {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.1,        // gentle cascade across grid children / groups
          overwrite: true,
          clearProps: 'transform'
        });
      }
    });
  })();

  /* --- 4. Scrubbed parallax (subtle) ------------------------------------ */
  // Hero + garten images drift on scroll. Small amplitude (~8%) + tiny
  // overscale so edges never gap during the drift. Calm, not seasick.
  (function parallax() {
    if (!hasScrollTrigger) return;

    function drift(img, section) {
      if (!img || !section) return;
      // Overscale prevents edge gaps while the image translates.
      gsap.set(img, { scale: 1.12, transformOrigin: 'center center' });
      gsap.fromTo(img,
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        }
      );
    }

    drift($('.hero__img'), $('.hero'));
    drift($('.garten__media img'), $('.garten'));
  })();

  /* --- 5. Stat count-ups ------------------------------------------------ */
  // Count 0 → value for stat tiles whose trimmed textContent is a pure
  // integer ("22","4","8"). The "30–70 m²" tile (and any non-integer / tile
  // with inner markup like a unit span) is skipped — only pure-integer tiles
  // qualify, so plain textContent replacement is safe for those.
  (function countUps() {
    if (!hasScrollTrigger) return;

    $all('.stat-tile__num').forEach(function (el) {
      var raw = (el.textContent || '').trim();
      if (!/^\d+$/.test(raw)) return; // skips "30–70 m²" and any markup tiles

      var target = parseInt(raw, 10);
      if (!isFinite(target)) return;

      var state = { val: 0 };
      el.textContent = '0';

      gsap.to(state, {
        val: target,
        duration: 1.4,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          once: true
        },
        onUpdate: function () {
          el.textContent = String(Math.round(state.val));
        },
        onComplete: function () {
          // Guarantee the exact final value (no rounding drift).
          el.textContent = String(target);
        }
      });
    });
  })();

  /* --- 6. Settle layout once images/fonts load -------------------------- */
  // Hero/garten images are large and may load after first paint, shifting
  // trigger positions. A single refresh on window load keeps starts accurate.
  if (hasScrollTrigger) {
    window.addEventListener('load', function () {
      ScrollTrigger.refresh();
    });
  }

})();
