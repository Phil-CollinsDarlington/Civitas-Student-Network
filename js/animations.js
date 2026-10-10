/* =============================================================
   CSN — ANIMATIONS.JS
   Handles scroll-reveal for any element with a [data-reveal]
   attribute, and provides an animateCounters() helper for when
   real, verified statistics are added to the impact section
   (see index.html Section 21 — do NOT feed it placeholder numbers).
============================================================= */

function initScrollReveal() {
  const revealEls = document.querySelectorAll("[data-reveal]");
  if (!revealEls.length) return;

  // If the visitor prefers reduced motion, just show everything —
  // style.css also hard-disables the transition, this just skips
  // the observer overhead entirely.
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  revealEls.forEach((el) => observer.observe(el));
}

/**
 * Animates a stat element's number from 0 to its target value.
 * Usage once real numbers exist:
 *   <span class="stat-number" data-count-to="1240">0</span>
 * Call animateCounters() after DOM ready — it is intentionally
 * NOT called automatically today because the impact section only
 * ships with placeholders (no invented statistics).
 */
function animateCounters() {
  const counters = document.querySelectorAll("[data-count-to]");
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  counters.forEach((el) => {
    const target = parseInt(el.getAttribute("data-count-to"), 10) || 0;

    if (prefersReducedMotion) {
      el.textContent = target.toLocaleString();
      return;
    }

    const duration = 1200;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target).toLocaleString();
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.classList.add("is-counted");
      }
    }
    requestAnimationFrame(tick);
  });
}

document.addEventListener("DOMContentLoaded", initScrollReveal);
