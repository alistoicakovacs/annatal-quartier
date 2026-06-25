/* =============================================================================
 * Annatal Quartier — behavior layer (vanilla JS, no dependencies)
 * Loaded with `defer`, so the DOM is already parsed when this runs.
 * Everything is wrapped in an IIFE → no globals leak.
 * Every DOM lookup is null-checked so a missing node never throws.
 * =========================================================================== */
(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // Shared helpers
  // ---------------------------------------------------------------------------

  /** Desktop breakpoint: at/above this width the mobile nav must be closed. */
  var DESKTOP_MIN = 861;

  /** True when the visitor prefers reduced motion. */
  var prefersReducedMotion = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  /** Basic-but-sane email pattern (intentionally permissive). */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // ---------------------------------------------------------------------------
  // 1. Sticky header — toggle `is-scrolled` on [data-header] past 40px
  // ---------------------------------------------------------------------------
  (function stickyHeader() {
    var header = document.querySelector('[data-header]');
    if (!header) return;

    var SCROLL_THRESHOLD = 40;
    var ticking = false;

    function applyState() {
      ticking = false;
      if (window.scrollY > SCROLL_THRESHOLD) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }

    function onScroll() {
      // Throttle work to one update per animation frame.
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(applyState);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    // Correct initial state (e.g. page loaded already scrolled / on refresh).
    applyState();
  })();

  // ---------------------------------------------------------------------------
  // 2. Mobile nav — [data-nav-toggle] opens/closes [data-nav]
  // ---------------------------------------------------------------------------
  (function mobileNav() {
    var toggle = document.querySelector('[data-nav-toggle]');
    var nav = document.querySelector('[data-nav]');
    if (!toggle || !nav) return;

    var LABEL_OPEN = 'Menü öffnen';
    var LABEL_CLOSE = 'Menü schließen';

    function isOpen() {
      return nav.classList.contains('is-open');
    }

    function openNav() {
      nav.classList.add('is-open');
      document.body.classList.add('nav-open'); // CSS scroll-lock hook
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', LABEL_CLOSE);
      // Nice-to-have: move focus to the first link in the panel.
      var firstLink = nav.querySelector('a, button');
      if (firstLink) firstLink.focus();
    }

    function closeNav(returnFocus) {
      nav.classList.remove('is-open');
      document.body.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', LABEL_OPEN);
      if (returnFocus) toggle.focus();
    }

    toggle.addEventListener('click', function () {
      if (isOpen()) {
        closeNav(false);
      } else {
        openNav();
      }
    });

    // Close when any link/CTA inside the panel is clicked (jump-nav).
    nav.addEventListener('click', function (event) {
      var link = event.target.closest('a');
      if (link && nav.contains(link)) {
        closeNav(false);
      }
    });

    // Escape closes and returns focus to the toggle.
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && isOpen()) {
        closeNav(true);
      }
    });

    // Resizing up to desktop must always close the (mobile-only) panel.
    window.addEventListener(
      'resize',
      function () {
        if (window.innerWidth >= DESKTOP_MIN && isOpen()) {
          closeNav(false);
        }
      },
      { passive: true }
    );
  })();

  // ---------------------------------------------------------------------------
  // 3. Scroll reveal — add `is-in` to `.reveal` elements once in view
  // ---------------------------------------------------------------------------
  (function scrollReveal() {
    var revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;

    // Yield to the GSAP enhancement layer when it is active: gsap-animations.js
    // sets `gsap-on` on <html> and owns the reveals, so we no-op here to avoid
    // double-animating. Without `gsap-on`, behavior is unchanged.
    if (document.documentElement.classList.contains('gsap-on')) return;

    // Reduced motion (or no IntersectionObserver support): reveal everything now.
    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      revealEls.forEach(function (el) {
        el.classList.add('is-in');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            obs.unobserve(entry.target); // reveal once, then stop watching
          }
        });
      },
      { threshold: 0.14 }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  })();

  // ---------------------------------------------------------------------------
  // 4. FAQ accordion — single-open; real <button>s already handle keyboard
  // ---------------------------------------------------------------------------
  (function faqAccordion() {
    var toggles = document.querySelectorAll('[data-faq-toggle]');
    if (!toggles.length) return;

    function setItemState(toggle, open) {
      var item = toggle.closest('.faq-item');
      var panelId = toggle.getAttribute('aria-controls');
      var panel = panelId ? document.getElementById(panelId) : null;

      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (item) item.classList.toggle('is-open', open);
      if (panel) {
        if (open) {
          panel.removeAttribute('hidden');
        } else {
          panel.setAttribute('hidden', '');
        }
      }
    }

    toggles.forEach(function (toggle) {
      toggle.addEventListener('click', function () {
        var willOpen = toggle.getAttribute('aria-expanded') !== 'true';

        // Single-open: collapse every other FAQ first.
        if (willOpen) {
          toggles.forEach(function (other) {
            if (other !== toggle) setItemState(other, false);
          });
        }

        setItemState(toggle, willOpen);
      });
    });
  })();

  // ---------------------------------------------------------------------------
  // 5. Chip groups — multi-select by default; `data-single` = radio-like
  // ---------------------------------------------------------------------------
  (function chipGroups() {
    var groups = document.querySelectorAll('[data-chip-group]');
    if (!groups.length) return;

    groups.forEach(function (group) {
      var isSingle = group.hasAttribute('data-single');
      var chips = group.querySelectorAll('[data-chip]');

      chips.forEach(function (chip) {
        chip.addEventListener('click', function () {
          var willActivate = !chip.classList.contains('is-active');

          if (isSingle) {
            // Radio-like: clear all siblings, then activate the clicked one.
            chips.forEach(function (sibling) {
              var active = sibling === chip ? willActivate : false;
              sibling.classList.toggle('is-active', active);
              sibling.setAttribute('aria-pressed', active ? 'true' : 'false');
            });
          } else {
            // Multi-select: simple toggle.
            chip.classList.toggle('is-active', willActivate);
            chip.setAttribute('aria-pressed', willActivate ? 'true' : 'false');
          }

          // If this is the (required) size group, clearing any active state
          // beforehand means a selection here can clear its error.
          if (group.getAttribute('data-chip-group') === 'size') {
            clearSizeErrorIfValid();
          }
        });
      });
    });
  })();

  // ---------------------------------------------------------------------------
  // 6. Waitlist form — validation, honeypot, success state (demo: no network)
  // ---------------------------------------------------------------------------

  // Hoisted so the chip-group handler above can clear the size error live.
  function getSizeGroup() {
    return document.querySelector('[data-chip-group="size"]');
  }

  function sizeGroupHasSelection() {
    var group = getSizeGroup();
    return !!(group && group.querySelector('[data-chip].is-active'));
  }

  function setError(field, errorEl, message) {
    if (field) field.setAttribute('aria-invalid', 'true');
    if (errorEl) errorEl.textContent = message;
  }

  function clearError(field, errorEl) {
    if (field) field.removeAttribute('aria-invalid');
    if (errorEl) errorEl.textContent = '';
  }

  function clearSizeErrorIfValid() {
    if (!sizeGroupHasSelection()) return;
    var errorEl = document.getElementById('size-error');
    if (errorEl) errorEl.textContent = '';
    // a11y parity with text fields: drop the container's invalid state too.
    var group = getSizeGroup();
    if (group) group.removeAttribute('aria-invalid');
  }

  (function waitlistForm() {
    var form = document.querySelector('[data-form]');
    if (!form) return;

    var MSG_REQUIRED = 'Bitte ausfüllen';
    var MSG_EMAIL = 'Bitte eine gültige E-Mail-Adresse eingeben';
    var MSG_SIZE = 'Bitte mindestens eine Wohnungsgröße wählen';
    var MSG_PRIVACY = 'Bitte bestätigen Sie den Datenschutz';

    var honeypot = form.querySelector('[data-hp]');
    var success = document.querySelector('[data-form-success]');

    // Required field descriptors (input + its associated .field__error span).
    var vorname = form.querySelector('#vorname');
    var nachname = form.querySelector('#nachname');
    var email = form.querySelector('#email');
    var datenschutz = form.querySelector('input[name="datenschutz"]');

    var vornameError = document.getElementById('vorname-error');
    var nachnameError = document.getElementById('nachname-error');
    var emailError = document.getElementById('email-error');
    var sizeError = document.getElementById('size-error');

    // --- Live clearing: once a field becomes valid, drop its error state. ---
    function wireLiveClear(field, errorEl, validator) {
      if (!field) return;
      var evt = field.type === 'checkbox' ? 'change' : 'input';
      field.addEventListener(evt, function () {
        if (validator()) clearError(field, errorEl);
      });
    }

    wireLiveClear(vorname, vornameError, function () {
      return !!(vorname && vorname.value.trim());
    });
    wireLiveClear(nachname, nachnameError, function () {
      return !!(nachname && nachname.value.trim());
    });
    wireLiveClear(email, emailError, function () {
      return !!(email && EMAIL_RE.test(email.value.trim()));
    });
    // Datenschutz has no dedicated .field__error span in the DOM; clearing its
    // aria-invalid on change is still correct and harmless.
    wireLiveClear(datenschutz, null, function () {
      return !!(datenschutz && datenschutz.checked);
    });

    // --- Validation: returns the first invalid control (for focusing). ---
    function validate() {
      var firstInvalid = null;

      function check(valid, field, errorEl, message) {
        if (valid) {
          clearError(field, errorEl);
        } else {
          setError(field, errorEl, message);
          if (!firstInvalid) firstInvalid = field;
        }
      }

      check(!!(vorname && vorname.value.trim()), vorname, vornameError, MSG_REQUIRED);
      check(!!(nachname && nachname.value.trim()), nachname, nachnameError, MSG_REQUIRED);

      // E-Mail: required AND must match the basic pattern.
      var emailVal = email ? email.value.trim() : '';
      check(!!emailVal && EMAIL_RE.test(emailVal), email, emailError,
        emailVal ? MSG_EMAIL : MSG_REQUIRED);

      // Size chip group (required): at least one active chip.
      var sizeGroup = getSizeGroup();
      if (sizeGroupHasSelection()) {
        if (sizeError) sizeError.textContent = '';
        if (sizeGroup) sizeGroup.removeAttribute('aria-invalid');
      } else {
        if (sizeError) sizeError.textContent = MSG_SIZE;
        // a11y parity with text fields: mark the group container invalid too.
        if (sizeGroup) sizeGroup.setAttribute('aria-invalid', 'true');
        // The focus target for a chip group is its first chip (if any).
        if (!firstInvalid && sizeGroup) {
          firstInvalid = sizeGroup.querySelector('[data-chip]');
        }
      }

      // Datenschutz consent checkbox (required).
      if (datenschutz && !datenschutz.checked) {
        datenschutz.setAttribute('aria-invalid', 'true');
        if (!firstInvalid) firstInvalid = datenschutz;
      } else if (datenschutz) {
        datenschutz.removeAttribute('aria-invalid');
      }

      return firstInvalid; // null → everything valid
    }

    // --- Success state: hide the form, show the confirmation, scroll up. ---
    function showSuccess() {
      form.setAttribute('hidden', '');
      if (success) {
        success.removeAttribute('hidden');
        // Move focus to the success heading for screen-reader announcement.
        var heading = success.querySelector('h1, h2, h3, .form-success__title');
        if (heading) {
          if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
          // preventScroll so programmatic focus doesn't fight the smooth scroll.
          heading.focus({ preventScroll: true });
        }
      }

      var anchor = document.getElementById('warteliste');
      if (anchor && typeof anchor.scrollIntoView === 'function') {
        anchor.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start'
        });
      }
    }

    // --- Submit handler ---
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      // Honeypot: a filled hidden field means a bot. Silently do nothing.
      if (honeypot && honeypot.value.trim() !== '') {
        return;
      }

      var firstInvalid = validate();
      if (firstInvalid) {
        if (typeof firstInvalid.focus === 'function') firstInvalid.focus();
        return;
      }

      // TODO: backend — POST to endpoint with DSGVO double-opt-in (see CLAUDE.md §6).
      // No network call in this demo.

      showSuccess();
    });
  })();
})();
