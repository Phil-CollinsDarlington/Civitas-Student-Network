/* =============================================================
   CSN — EVENTS.JS
   ---------------------------------------------------------------
   ADD A NEW EVENT
   Copy the object below and replace the information.
   Keep the property names unchanged. Set "status" to "upcoming"
   or "past".

   The entries below are placeholder EXAMPLES only — clearly mark
   any demonstration event and replace with real, confirmed events
   before publishing.
============================================================= */

const events = [
  {
    title: "Example: CSN Student Networking Mixer",
    date: "2026-10-18",
    time: "3:00 PM",
    venue: "Example Venue, Kampala",
    description:
      "A placeholder event showing how an upcoming event card renders. Replace with a confirmed event.",
    speaker: "To be announced",
    registrationLink: "#",
    status: "upcoming",
    isExample: true,
  },
  {
    title: "Example: Career Readiness Workshop",
    date: "2026-11-05",
    time: "10:00 AM",
    venue: "Example Venue, Kampala",
    description:
      "A placeholder workshop listing demonstrating the events layout and filtering.",
    speaker: "To be announced",
    registrationLink: "#",
    status: "upcoming",
    isExample: true,
  },
  {
    title: "Example: CSN Launch Gathering",
    date: "2026-06-12",
    time: "2:00 PM",
    venue: "Example Venue, Kampala",
    description:
      "A placeholder past-event entry, ready to be replaced with photos and highlights from a real gathering.",
    speaker: "CSN Team",
    registrationLink: "#",
    status: "past",
    isExample: true,
  },
];

function formatEventDate(isoDate) {
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

function renderEvents(data, container, { past = false } = {}) {
  if (!container) return;

  if (!data.length) {
    container.innerHTML = `
      <div class="empty-state">
        <h3>${past ? "No past events yet" : "No upcoming events right now"}</h3>
        <p>${past ? "Check back after our first events take place." : "New dates are added regularly — check back soon."}</p>
      </div>`;
    return;
  }

  container.innerHTML = data
    .map(
      (ev) => `
      <article class="data-card" data-reveal="fade">
        <div class="data-card-media" aria-hidden="true">${past ? "Event gallery placeholder" : formatEventDate(ev.date)}</div>
        <div class="data-card-body">
          <div class="data-card-meta">
            <span class="badge badge--gold">${formatEventDate(ev.date)}</span>
            ${ev.isExample ? '<span class="badge badge--demo">Example event</span>' : ""}
          </div>
          <h3>${ev.title}</h3>
          <p>${ev.description}</p>
          <div class="data-card-meta"><span>🕐 ${ev.time}</span><span>📍 ${ev.venue}</span></div>
          ${ev.speaker ? `<div class="data-card-meta"><span>🎤 ${ev.speaker}</span></div>` : ""}
        </div>
        <div class="data-card-footer">
          ${
            past
              ? '<span class="badge badge--outline">Past event</span>'
              : `<a class="btn btn--outline btn--sm" href="${ev.registrationLink}">Register</a>`
          }
        </div>
      </article>`
    )
    .join("");
}

function initEventsPreview() {
  const container = document.querySelector("[data-events-preview]");
  if (!container) return;
  const upcoming = events.filter((e) => e.status === "upcoming").slice(0, 3);
  renderEvents(upcoming, container);
}

function initEventsPage() {
  const upcomingContainer = document.querySelector("[data-events-upcoming]");
  const pastContainer = document.querySelector("[data-events-past]");
  if (upcomingContainer) {
    renderEvents(events.filter((e) => e.status === "upcoming"), upcomingContainer);
  }
  if (pastContainer) {
    renderEvents(events.filter((e) => e.status === "past"), pastContainer, { past: true });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initEventsPreview();
  initEventsPage();
});
