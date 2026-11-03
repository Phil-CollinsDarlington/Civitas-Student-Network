/* Public event rendering. Supabase events are used when configured;
 * the demo data keeps local previews usable before setup is complete. */
const demoEvents = [
  {
    title: "Example: CSN Student Networking Mixer",
    date: "2026-10-18",
    time: "3:00 PM",
    venue: "Example Venue, Kampala",
    description: "A placeholder event showing how an upcoming event card renders. Replace with a confirmed event.",
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
    description: "A placeholder workshop listing demonstrating the events layout and filtering.",
    speaker: "To be announced",
    registrationLink: "#",
    status: "upcoming",
    isExample: true,
  },
];

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
  }[character]));
}

function formatEventDate(isoDate) {
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return escapeHtml(isoDate);
  return date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

function renderEvents(data, container, { past = false } = {}) {
  if (!container) return;
  if (!data.length) {
    container.innerHTML = `<div class="empty-state"><h3>${past ? "No past events yet" : "No upcoming events right now"}</h3><p>${past ? "Check back after our first events take place." : "New dates are added regularly — check back soon."}</p></div>`;
    return;
  }
  container.innerHTML = data.map((event) => {
    const image = event.cover_image
      ? `<img src="${escapeHtml(event.cover_image)}" alt="${escapeHtml(event.title)} event photo" loading="lazy">`
      : (past ? "Event photo coming soon" : formatEventDate(event.date));
    const report = event.report_link
      ? `<a class="btn btn--outline btn--sm" href="${escapeHtml(event.report_link)}">Event report</a>`
      : "";
    return `<article class="data-card" data-reveal="fade">
      <div class="data-card-media">${image}</div>
      <div class="data-card-body">
        <div class="data-card-meta"><span class="badge badge--gold">${formatEventDate(event.date)}</span>${event.isExample ? '<span class="badge badge--demo">Example event</span>' : ""}</div>
        <h3>${escapeHtml(event.title)}</h3><p>${escapeHtml(event.description)}</p>
        <div class="data-card-meta"><span>Time: ${escapeHtml(event.time)}</span><span>Venue: ${escapeHtml(event.venue)}</span></div>
        ${event.speaker ? `<div class="data-card-meta"><span>Speaker: ${escapeHtml(event.speaker)}</span></div>` : ""}
      </div>
      <div class="data-card-footer">${past ? `${report}<span class="badge badge--outline">Past event</span>` : `<a class="btn btn--outline btn--sm" href="${escapeHtml(event.registrationLink || "#")}">Register</a>`}</div>
    </article>`;
  }).join("");
}

async function getEvents() {
  const config = window.CSN_SUPABASE_CONFIG;
  if (!config?.url || !config?.anonKey || !window.supabase) return demoEvents;
  const client = window.supabase.createClient(config.url, config.anonKey);
  const { data, error } = await client.from("events").select("*").eq("published", true).order("date", { ascending: true });
  if (error) {
    console.error("Could not load published events.", error);
    return [];
  }
  return data || [];
}

async function initEvents() {
  const data = await getEvents();
  const preview = document.querySelector("[data-events-preview]");
  const upcoming = document.querySelector("[data-events-upcoming]");
  const past = document.querySelector("[data-events-past]");
  if (preview) renderEvents(data.filter((event) => event.status === "upcoming").slice(0, 3), preview);
  if (upcoming) renderEvents(data.filter((event) => event.status === "upcoming"), upcoming);
  if (past) renderEvents(data.filter((event) => event.status === "past"), past, { past: true });
}

document.addEventListener("DOMContentLoaded", initEvents);
