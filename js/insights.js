/* =============================================================
   CSN — INSIGHTS.JS
   ---------------------------------------------------------------
   ADD A NEW ARTICLE
   Copy an object below and replace the values. Keep the property
   names unchanged. `category` should match one of INSIGHT_CATEGORIES.

   The entries below are DEMO content only, clearly marked, meant
   to show the layout — replace with genuine CSN articles.
============================================================= */

const INSIGHT_CATEGORIES = [
  "Opportunities",
  "Career",
  "Leadership",
  "Entrepreneurship",
  "Student Stories",
  "Events",
  "Education",
  "Innovation",
  "Community Impact",
];

const insights = [
  {
    title: "Example: Five Ways to Make the Most of a Mentorship",
    category: "Leadership",
    summary:
      "A placeholder article demonstrating the Insights layout. Replace with genuine CSN content.",
    date: "2026-08-01",
    isExample: true,
    link: "#",
  },
  {
    title: "Example: Getting Application-Ready for Internships",
    category: "Career",
    summary:
      "Demo content showing how a career-focused article card will look once real articles are published.",
    date: "2026-07-18",
    isExample: true,
    link: "#",
  },
  {
    title: "Example: What Student-Led Innovation Looks Like",
    category: "Innovation",
    summary:
      "A placeholder entry for the Innovation category — swap in a real feature or student story.",
    date: "2026-07-02",
    isExample: true,
    link: "#",
  },
];

function renderInsights(data, container) {
  if (!container) return;
  if (!data.length) {
    container.innerHTML = `
      <div class="empty-state">
        <h3>No articles in this category yet</h3>
        <p>Try another category — more Insights content is on the way.</p>
      </div>`;
    return;
  }
  container.innerHTML = data
    .map(
      (item) => `
      <article class="data-card" data-reveal="fade">
        <div class="data-card-media" aria-hidden="true">${item.category}</div>
        <div class="data-card-body">
          <div class="data-card-meta">
            <span class="badge">${item.category}</span>
            ${item.isExample ? '<span class="badge badge--demo">Demo content</span>' : ""}
          </div>
          <h3>${item.title}</h3>
          <p>${item.summary}</p>
        </div>
        <div class="data-card-footer">
          <a class="btn btn--outline btn--sm" href="${item.link}">Read more</a>
        </div>
      </article>`
    )
    .join("");
}

function initInsightsPreview() {
  const container = document.querySelector("[data-insights-preview]");
  if (!container) return;
  renderInsights(insights.slice(0, 3), container);
}

function initInsightsPage() {
  const container = document.querySelector("[data-insights-directory]");
  if (!container) return;
  const chipWrap = document.querySelector("[data-insight-filters]");
  let active = "All";

  function apply() {
    const filtered = active === "All" ? insights : insights.filter((i) => i.category === active);
    renderInsights(filtered, container);
  }

  if (chipWrap) {
    const cats = ["All", ...INSIGHT_CATEGORIES];
    chipWrap.innerHTML = cats
      .map((c, i) => `<button type="button" class="filter-chip" aria-pressed="${i === 0}" data-category="${c}">${c}</button>`)
      .join("");
    chipWrap.querySelectorAll(".filter-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        chipWrap.querySelectorAll(".filter-chip").forEach((c) => c.setAttribute("aria-pressed", "false"));
        chip.setAttribute("aria-pressed", "true");
        active = chip.dataset.category;
        apply();
      });
    });
  }

  apply();
}

document.addEventListener("DOMContentLoaded", () => {
  initInsightsPreview();
  initInsightsPage();
});
