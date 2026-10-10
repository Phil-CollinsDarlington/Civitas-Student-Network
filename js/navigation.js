/* =============================================================
   CSN — NAVIGATION.JS
   Handles: mobile hamburger menu, sticky header shadow-on-scroll,
   and marking the current page as active in the nav.
   TO EDIT NAV LINKS: edit the <nav> markup in each HTML file's
   header include — this file only handles behaviour, not links.
============================================================= */

function initNavigation() {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const navList = document.querySelector(".nav-list");

  if (!header || !toggle || !navList) return;

  // --- Mobile menu open/close -------------------------------
  const closeMenu = () => {
    toggle.setAttribute("aria-expanded", "false");
    navList.classList.remove("is-open");
    document.body.style.overflow = "";
  };

  const openMenu = () => {
    toggle.setAttribute("aria-expanded", "true");
    navList.classList.add("is-open");
    document.body.style.overflow = "hidden";
  };

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    isOpen ? closeMenu() : openMenu();
  });

  // Close the mobile menu whenever a nav link is chosen
  navList.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  // Close on Escape for keyboard users
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  // Close the mobile menu automatically if the viewport grows
  // past the tablet/desktop breakpoint while it's open
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024) closeMenu();
  });

  // --- Sticky header shadow on scroll ------------------------
  const toggleHeaderShadow = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  toggleHeaderShadow();
  window.addEventListener("scroll", toggleHeaderShadow, { passive: true });

  // --- Active page indicator ----------------------------------
  // Compares each nav link's pathname to the current page so the
  // right link gets aria-current="page" (styled in components.css).
  const currentFile = window.location.pathname.split("/").pop() || "index.html";
  navList.querySelectorAll("a[href]").forEach((link) => {
    const linkFile = link.getAttribute("href").split("/").pop();
    if (linkFile === currentFile) {
      link.setAttribute("aria-current", "page");
    }
  });
}

document.addEventListener("DOMContentLoaded", initNavigation);
