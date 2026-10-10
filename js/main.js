/* =============================================================
   CSN — MAIN.JS
   Global, page-independent initialization. Page-specific behaviour
   lives in its own file (navigation.js, opportunities.js, etc.)
   and each of those files sets up its own DOMContentLoaded listener,
   so this file only needs to handle things every page shares.
============================================================= */

document.addEventListener("DOMContentLoaded", () => {
  // Auto-fill the footer's copyright year so it never goes stale
  document.querySelectorAll("[data-current-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  // Pathway tabs on the Join CSN page (Student / Volunteer / Rep)
  const tabs = document.querySelectorAll("[data-pathway-tab]");
  const panels = document.querySelectorAll("[data-pathway-panel]");
  if (tabs.length) {
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const target = tab.dataset.pathwayTab;

        tabs.forEach((t) => t.setAttribute("aria-selected", "false"));
        tab.setAttribute("aria-selected", "true");

        panels.forEach((panel) => {
          panel.classList.toggle("is-active", panel.dataset.pathwayPanel === target);
        });
      });
    });
  }
});
