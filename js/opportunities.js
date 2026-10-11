/* =============================================================
   CSN — OPPORTUNITIES.JS
   ---------------------------------------------------------------
   ADD A NEW OPPORTUNITY
   Copy one object from the array below and replace the values.
   Keep the property names exactly as they are. `category` must
   match one of the values in OPPORTUNITY_CATEGORIES.

   IMPORTANT: The entries below are placeholder EXAMPLES only —
   they are not real opportunities. Replace them with verified,
   real listings before publishing, and keep the "Example" wording
   out of real entries.
============================================================= */

const OPPORTUNITY_CATEGORIES = [
  "Internships",
  "Jobs",
  "Scholarships",
  "Competitions",
  "Fellowships",
  "Conferences",
  "Exchanges",
  "Training",
];

const opportunities = [
  {
    title: "Example: Community Impact Internship",
    organization: "Example Organization",
    category: "Internships",
    deadline: "30 September 2026",
    eligibility: "University students, any year",
    location: "Kampala, Uganda",
    description:
      "A placeholder listing showing how an internship opportunity will appear once real opportunities are added.",
    link: "#",
    isExample: true,
  },
  {
    title: "Example: Regional Student Innovation Challenge",
    organization: "Example Organization",
    category: "Competitions",
    deadline: "15 November 2026",
    eligibility: "Undergraduate students",
    location: "Remote / East Africa",
    description:
      "A placeholder competition listing. Replace with a verified, real opportunity before publishing.",
    link: "#",
    isExample: true,
  },
  {
    title: "Example: Undergraduate Merit Scholarship",
    organization: "Example Organization",
    category: "Scholarships",
    deadline: "1 December 2026",
    eligibility: "First- and second-year students",
    location: "Uganda",
    description:
      "A placeholder scholarship listing demonstrating the card layout and filter behaviour.",
    link: "#",
    isExample: true,
  },
  {
    title: "Example: Global Student Leaders Conference",
    organization: "Example Organization",
    category: "Conferences",
    deadline: "20 October 2026",
    eligibility: "Open to all students",
    location: "Kampala, Uganda",
    description:
      "A placeholder conference listing. Real speaker and registration details will replace this text.",
    link: "#",
    isExample: true,
  },
];

/**
 * Renders opportunity cards into a container.
 * @param {Array} data - array of opportunity objects
 * @param {HTMLElement} container - element to render cards into
 */
function renderOpportunities(data, container) {
  if (!container) return;

  if (!data.length) {
    container.innerHTML = `
      <div class="empty-state">
        <h3>No opportunities match those filters</h3>
        <p>Try a different category or clear your search.</p>
      </div>`;
    return;
  }

  container.innerHTML = data
    .map(
      (op) => `
      <article class="data-card" data-reveal="fade">
        <div class="data-card-media" aria-hidden="true">${op.category}</div>
        <div class="data-card-body">
          <div class="data-card-meta">
            <span class="badge">${op.category}</span>
            ${op.isExample ? '<span class="badge badge--demo">Example listing</span>' : ""}
          </div>
          <h3>${op.title}</h3>
          <p>${op.description}</p>
          <div class="data-card-meta">
            <span>📍 ${op.location}</span>
            <span>🗓 Deadline: ${op.deadline}</span>
          </div>
          <div class="data-card-meta"><span>Eligibility: ${op.eligibility}</span></div>
        </div>
        <div class="data-card-footer">
          <a class="btn btn--outline btn--sm" href="${op.link}">Learn more</a>
          <button type="button" class="btn btn--ghost btn--sm" data-share-title="${op.title}">Share</button>
        </div>
      </article>`
    )
    .join("");
}

function initOpportunitiesPreview() {
  const container = document.querySelector("[data-opportunities-preview]");
  if (!container) return;
  renderOpportunities(opportunities.slice(0, 3), container);
}

function initOpportunitiesDirectory() {
  const container = document.querySelector("[data-opportunities-directory]");
  if (!container) return;

  const chipWrap = document.querySelector("[data-opportunity-filters]");
  const searchInput = document.querySelector("[data-opportunity-search]");
  const status = document.querySelector("[data-opportunity-status]");
  const clearButton = document.querySelector("[data-clear-opportunity-filters]");
  const params = new URLSearchParams(window.location.search);
  let activeCategory = "All";

  const updateUrl = () => {
    const nextParams = new URLSearchParams();
    if (activeCategory !== "All") nextParams.set("category", activeCategory);
    if (searchInput?.value.trim()) nextParams.set("q", searchInput.value.trim());
    const query = nextParams.toString();
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`
    );
  };

  function applyFilters() {
    const query = (searchInput?.value || "").toLowerCase().trim();
    const filtered = opportunities.filter((op) => {
      const matchesCategory = activeCategory === "All" || op.category === activeCategory;
      const matchesQuery =
        !query ||
        op.title.toLowerCase().includes(query) ||
        op.organization.toLowerCase().includes(query) ||
        op.location.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
    renderOpportunities(filtered, container);
    if (status) {
      status.textContent = `${filtered.length} ${filtered.length === 1 ? "opportunity" : "opportunities"} found`;
    }
    if (clearButton) {
      clearButton.hidden = activeCategory === "All" && !query;
    }
    updateUrl();
  }

  if (chipWrap) {
    const categories = ["All", ...OPPORTUNITY_CATEGORIES];
    chipWrap.innerHTML = categories
      .map(
        (cat, i) =>
          `<button type="button" class="filter-chip" aria-pressed="${i === 0}" data-category="${cat}">${cat}</button>`
      )
      .join("");

    chipWrap.querySelectorAll(".filter-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        chipWrap.querySelectorAll(".filter-chip").forEach((c) => c.setAttribute("aria-pressed", "false"));
        chip.setAttribute("aria-pressed", "true");
        activeCategory = chip.dataset.category;
        applyFilters();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", applyFilters);
  }

  if (clearButton) {
    clearButton.addEventListener("click", () => {
      activeCategory = "All";
      if (searchInput) searchInput.value = "";
      chipWrap?.querySelectorAll(".filter-chip").forEach((chip) => {
        chip.setAttribute("aria-pressed", chip.dataset.category === "All" ? "true" : "false");
      });
      applyFilters();
      searchInput?.focus();
    });
  }

  const initialCategory = params.get("category");
  const initialQuery = params.get("q");
  if (OPPORTUNITY_CATEGORIES.includes(initialCategory)) activeCategory = initialCategory;
  if (searchInput && initialQuery) searchInput.value = initialQuery;

  chipWrap?.querySelectorAll(".filter-chip").forEach((chip) => {
    chip.setAttribute("aria-pressed", chip.dataset.category === activeCategory ? "true" : "false");
  });
  applyFilters();
}

// Share button — copies a WhatsApp share link (works with no backend)
document.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-share-title]");
  if (!btn) return;
  const text = encodeURIComponent(`Check out this opportunity via CSN: ${btn.dataset.shareTitle}`);
  window.open(`https://wa.me/?text=${text}`, "_blank", "noopener");
});

document.addEventListener("DOMContentLoaded", () => {
  initOpportunitiesPreview();
  initOpportunitiesDirectory();
});
