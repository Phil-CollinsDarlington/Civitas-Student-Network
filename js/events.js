/*
 * Add and edit events in this array. Status is calculated automatically from
 * startsAt and endsAt, so no manual status field is needed.
 */
const events = [
  {
    title: "Civitas Student Network Launch",
    startsAt: "2026-10-30T15:00:00+03:00",
    endsAt: "2026-10-30T18:00:00+03:00",
    venue: "Makerere University Business School, ADB Block Theatre 1",
    description: "The official launch of Civitas Student Network, bringing students and collaborators together to build one connected network.",
    speaker: "Civitas Student Network team",
    image: "/assets/images/events/CSN%20launch.jpeg",
    notes: "",
    speakerNotes: [
      // { name: "Guest speaker name", note: "Key point they shared." },
    ],
  },
  {
    title: "CSN Student Networking Mixer",
    startsAt: "2026-12-18T15:00:00+03:00",
    endsAt: "2026-12-18T18:00:00+03:00",
    venue: "Makerere University Business School, ADB Block Theatre 1",
    description: "Connect with students, mentors and professionals from across the network.",
    speaker: "To be announced",
    registrationLink: "#",
    isExample: true,
  },
  {
    title: "Career Readiness Workshop",
    startsAt: "2027-01-15T10:00:00+03:00",
    endsAt: "2027-01-15T13:00:00+03:00",
    venue: "Kampala",
    description: "A practical workshop to help students prepare for their next opportunity.",
    speaker: "To be announced",
    registrationLink: "#",
    isExample: true,
  },
];

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
  }[character]));
}

function getEventStatus(event, now = new Date()) {
  const start = new Date(event.startsAt);
  const end = new Date(event.endsAt);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "upcoming";
  if (now < start) return "upcoming";
  if (now <= end) return "ongoing";
  return "past";
}

function formatEventDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date to be announced";
  return date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

function formatEventTime(event) {
  const start = new Date(event.startsAt);
  const end = new Date(event.endsAt);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "Time to be announced";
  const options = { hour: "numeric", minute: "2-digit" };
  return `${start.toLocaleTimeString([], options)} - ${end.toLocaleTimeString([], options)}`;
}

function renderEvents(data, container, { past = false, ongoing = false } = {}) {
  if (!container) return;
  if (!data.length) {
    const heading = past ? "No past events yet" : ongoing ? "No events are ongoing right now" : "No upcoming events right now";
    const message = past ? "Check back after our first events take place." : "New dates are added regularly — check back soon.";
    container.innerHTML = `<div class="empty-state"><h3>${heading}</h3><p>${message}</p></div>`;
    return;
  }
  container.innerHTML = data.map((event) => {
    const status = getEventStatus(event);
    const report = event.reportLink
      ? `<a class="btn btn--outline btn--sm" href="${escapeHtml(event.reportLink)}">Event report</a>`
      : "";
    return `<article class="data-card" data-reveal="fade">
      <div class="data-card-media">${event.image
        ? `<img src="${escapeHtml(event.image)}" alt="${escapeHtml(event.title)} event photo" loading="lazy">`
        : formatEventDate(event.startsAt)}</div>
      <div class="data-card-body">
        <div class="data-card-meta"><span class="badge badge--gold">${formatEventDate(event.startsAt)}</span><span class="badge badge--outline">${status === "ongoing" ? "Ongoing" : status === "past" ? "Past event" : "Upcoming"}</span>${event.isExample ? '<span class="badge badge--demo">Example event</span>' : ""}</div>
        <h3>${escapeHtml(event.title)}</h3><p>${escapeHtml(event.description)}</p>
        <div class="data-card-meta"><span>Time: ${escapeHtml(formatEventTime(event))}</span><span>Venue: ${escapeHtml(event.venue)}</span></div>
        ${event.speaker ? `<div class="data-card-meta"><span>Speaker: ${escapeHtml(event.speaker)}</span></div>` : ""}
        ${event.notes ? `<div class="event-notes"><strong>Event notes</strong><p>${escapeHtml(event.notes)}</p></div>` : ""}
        ${event.speakerNotes?.length ? `<div class="event-notes"><strong>Guest speaker notes</strong>${event.speakerNotes.map((item) => `<p><strong>${escapeHtml(item.name)}:</strong> ${escapeHtml(item.note)}</p>`).join("")}</div>` : ""}
      </div>
      <div class="data-card-footer">${past ? report : status === "ongoing" ? '<span class="badge badge--outline">In progress</span>' : `<a class="btn btn--outline btn--sm" href="${escapeHtml(event.registrationLink || "#")}">Register</a>`}</div>
    </article>`;
  }).join("");
}

function initEvents() {
  const groups = events.reduce((result, event) => {
    result[getEventStatus(event)].push(event);
    return result;
  }, { upcoming: [], ongoing: [], past: [] });
  const preview = document.querySelector("[data-events-preview]");
  const upcoming = document.querySelector("[data-events-upcoming]");
  const ongoing = document.querySelector("[data-events-ongoing]");
  const past = document.querySelector("[data-events-past]");
  if (preview) renderEvents([...groups.ongoing, ...groups.upcoming].slice(0, 3), preview);
  if (upcoming) renderEvents(groups.upcoming, upcoming);
  if (ongoing) renderEvents(groups.ongoing, ongoing, { ongoing: true });
  if (past) renderEvents(groups.past, past, { past: true });
}

document.addEventListener("DOMContentLoaded", initEvents);
window.setInterval(initEvents, 60000);
