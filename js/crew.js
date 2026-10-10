/* =============================================================
   CSN — CREW.JS
   Powers the profile modal on the Crew page. Each profile card
   is a <button class="profile-card" data-profile-trigger> with
   data-* attributes holding the detail content — this script
   reads those attributes and fills the shared modal, so you only
   ever have to edit the card markup, never this file, when adding
   a new crew member.
============================================================= */

function initCrewModal() {
  const modalOverlay = document.querySelector("[data-crew-modal]");
  if (!modalOverlay) return;

  const modal = modalOverlay.querySelector(".modal");
  const closeBtn = modalOverlay.querySelector(".modal-close");
  const nameEl = modalOverlay.querySelector("[data-modal-name]");
  const roleEl = modalOverlay.querySelector("[data-modal-role]");
  const bioEl = modalOverlay.querySelector("[data-modal-bio]");
  const initialsEl = modalOverlay.querySelector("[data-modal-initials]");
  const tagEl = modalOverlay.querySelector("[data-modal-tag]");

  let lastFocused = null;

  function openModal(trigger) {
    lastFocused = trigger;
    nameEl.textContent = trigger.dataset.name || "";
    roleEl.textContent = trigger.dataset.role || "";
    bioEl.textContent =
      trigger.dataset.bio ||
      "A full biography for this crew member has not been provided yet. Check back soon.";
    if (initialsEl) {
      initialsEl.textContent = (trigger.dataset.name || "CSN")
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("");
    }
    if (tagEl) {
      tagEl.style.display = trigger.dataset.placeholder === "true" ? "inline-flex" : "none";
    }

    modalOverlay.classList.add("is-open");
    modalOverlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function closeModal() {
    modalOverlay.classList.remove("is-open");
    modalOverlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll("[data-profile-trigger]").forEach((trigger) => {
    trigger.addEventListener("click", () => openModal(trigger));
  });

  closeBtn.addEventListener("click", closeModal);

  modalOverlay.addEventListener("click", (event) => {
    if (event.target === modalOverlay) closeModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modalOverlay.classList.contains("is-open")) {
      closeModal();
    }
    // Basic focus trap while the modal is open
    if (event.key === "Tab" && modalOverlay.classList.contains("is-open")) {
      const focusable = modal.querySelectorAll("button, a, input, textarea, select, [tabindex]");
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", initCrewModal);
