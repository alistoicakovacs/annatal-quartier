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

          // Size group is single-select and linked to Zimmeranzahl: mirror the
          // chosen size's room count, then (it being required) clear its error.
          if (group.getAttribute('data-chip-group') === 'size') {
            syncRoomsFromSize();
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

  // Mirror the (single-select) size choice into the Zimmeranzahl group via each
  // size chip's data-rooms, then lock the group to it: the matched room stays
  // selected and the others grey out (disabled, so they can't be clicked). No
  // active size → unlock the room chips so they can be chosen freely again.
  function syncRoomsFromSize() {
    var zimmerGroup = document.querySelector('[data-chip-group="zimmer"]');
    if (!zimmerGroup) return;
    var activeSize = document.querySelector('[data-chip-group="size"] [data-chip].is-active');
    var rooms = activeSize ? activeSize.getAttribute('data-rooms') : null;
    var locked = rooms !== null; // a size is chosen → its room count is fixed
    zimmerGroup.querySelectorAll('[data-chip]').forEach(function (chip) {
      var match = locked && chip.value === rooms;
      chip.classList.toggle('is-active', match);
      chip.setAttribute('aria-pressed', match ? 'true' : 'false');
      chip.disabled = locked;
    });
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
    var MSG_SIZE = 'Bitte eine Wohnungsgröße wählen';
    var MSG_PRIVACY = 'Bitte stimmen Sie der Datenschutzerklärung zu.';
    var MSG_NETWORK = 'Senden fehlgeschlagen. Bitte versuchen Sie es später erneut ' +
      'oder schreiben Sie an vermietung@annatal-quartier.de.';

    // Backend endpoint that sends the mail via SMTP (see sendmail.php).
    // Same-origin path by default; use a full URL if the API lives elsewhere
    // (then also set $ALLOW_ORIGIN in sendmail.php for CORS).
    var ENDPOINT = 'sendmail.php';

    var honeypot = form.querySelector('[data-hp]');
    var success = document.querySelector('[data-form-success]');
    var submitBtn = form.querySelector('button[type="submit"]');
    var formError = document.querySelector('[data-form-error]');

    // Required field descriptors (input + its associated .field__error span).
    var vorname = form.querySelector('#vorname');
    var nachname = form.querySelector('#nachname');
    var email = form.querySelector('#email');
    var telefon = form.querySelector('#telefon');
    var einkommen = form.querySelector('#einkommen');
    var datenschutz = form.querySelector('input[name="datenschutz"]');

    var vornameError = document.getElementById('vorname-error');
    var nachnameError = document.getElementById('nachname-error');
    var emailError = document.getElementById('email-error');
    var telefonError = document.getElementById('telefon-error');
    var einkommenError = document.getElementById('einkommen-error');
    var sizeError = document.getElementById('size-error');
    var datenschutzError = document.getElementById('datenschutz-error');

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
    wireLiveClear(telefon, telefonError, function () {
      return !!(telefon && telefon.value.trim());
    });
    wireLiveClear(einkommen, einkommenError, function () {
      return !!(einkommen && einkommen.value);
    });
    // Datenschutz: clear error live when the box is checked.
    wireLiveClear(datenschutz, datenschutzError, function () {
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

      // Telefon (required): non-empty.
      check(!!(telefon && telefon.value.trim()), telefon, telefonError, MSG_REQUIRED);

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

      // Monatliches Haushaltseinkommen (required): a bracket must be chosen.
      check(!!(einkommen && einkommen.value), einkommen, einkommenError, MSG_REQUIRED);

      // Datenschutz consent checkbox (required).
      check(!!(datenschutz && datenschutz.checked), datenschutz, datenschutzError, MSG_PRIVACY);

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

    // --- Collect the payload (chip groups aren't native inputs) ------------
    function activeChipValues(groupName) {
      var group = form.querySelector('[data-chip-group="' + groupName + '"]');
      if (!group) return [];
      return Array.prototype.map.call(
        group.querySelectorAll('[data-chip].is-active'),
        function (chip) { return chip.value || chip.textContent.trim(); }
      );
    }

    function collectPayload() {
      var data = new URLSearchParams();
      function add(key, val) { data.append(key, val == null ? '' : String(val)); }
      function fieldVal(sel) {
        var el = form.querySelector(sel);
        return el ? el.value.trim() : '';
      }
      var updates = form.querySelector('input[name="updates"]');

      add('vorname', vorname ? vorname.value.trim() : '');
      add('nachname', nachname ? nachname.value.trim() : '');
      add('email', email ? email.value.trim() : '');
      add('telefon', telefon ? telefon.value.trim() : '');
      add('groesse', activeChipValues('size')[0] || '');
      add('zimmer', activeChipValues('zimmer')[0] || '');
      add('einkommen', einkommen ? einkommen.value : '');
      add('ausstattung', activeChipValues('features').join(', '));
      add('haustiere', fieldVal('#haustiere'));
      add('personen', fieldVal('#personen'));
      add('nachricht', fieldVal('#nachricht'));
      add('datenschutz', datenschutz && datenschutz.checked ? 'ja' : 'nein');
      add('updates', updates && updates.checked ? 'ja' : 'nein');
      add('kontakt_zusatz', honeypot ? honeypot.value : '');
      return data;
    }

    // --- Submit UI state ---------------------------------------------------
    function setSubmitting(on) {
      if (!submitBtn) return;
      submitBtn.disabled = on;
      if (on) {
        if (!submitBtn.dataset.label) submitBtn.dataset.label = submitBtn.textContent;
        submitBtn.textContent = 'Wird gesendet …';
      } else if (submitBtn.dataset.label) {
        submitBtn.textContent = submitBtn.dataset.label;
      }
    }

    function showFormError(message) {
      if (formError) formError.textContent = message || '';
    }

    // --- Send to the SMTP endpoint -----------------------------------------
    function sendForm() {
      showFormError('');

      if (typeof window.fetch !== 'function') {
        showFormError(MSG_NETWORK);
        return;
      }

      setSubmitting(true);

      window.fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: collectPayload().toString()
      })
        .then(function (res) {
          // The endpoint always answers JSON. If parsing fails (e.g. the PHP
          // was served as a static file on a host without PHP, or an HTML error
          // page came back), treat it as a failure — never a false success.
          return res.json().then(
            function (data) { return data; },
            function () { return null; }
          );
        })
        .then(function (result) {
          if (result && result.ok) {
            showSuccess();
          } else {
            setSubmitting(false);
            showFormError((result && result.error) || MSG_NETWORK);
          }
        })
        .catch(function () {
          setSubmitting(false);
          showFormError(MSG_NETWORK);
        });
    }

    // --- Submit handler ----------------------------------------------------
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

      sendForm();
    });
  })();
})();
