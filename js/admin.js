const adminConfig = window.CSN_SUPABASE_CONFIG || {};
const adminClient = adminConfig.url && adminConfig.anonKey
  ? window.supabase.createClient(adminConfig.url, adminConfig.anonKey)
  : null;

const loginForm = document.querySelector("[data-login-form]");
const dashboard = document.querySelector("[data-dashboard]");
const loginStatus = document.querySelector("[data-login-status]");
const eventForm = document.querySelector("[data-event-form]");
const eventStatus = document.querySelector("[data-event-status]");
const eventList = document.querySelector("[data-event-list]");

function escapeAdminHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
  }[character]));
}

function setStatus(element, message, error = false) {
  element.textContent = message;
  element.style.color = error ? "var(--color-error)" : "";
}

function requireClient() {
  if (!adminClient) throw new Error("Supabase is not configured. Fill js/supabase-config.js first.");
}

function fileExtension(file) {
  const extension = file.name.split(".").pop().toLowerCase();
  return ["jpg", "jpeg", "png", "webp"].includes(extension) ? extension : "jpg";
}

async function uploadImage(file, eventId, prefix) {
  const path = `${eventId}/${prefix}-${crypto.randomUUID()}.${fileExtension(file)}`;
  const { error } = await adminClient.storage.from("event-images").upload(path, file, { upsert: false, contentType: file.type });
  if (error) throw error;
  const { data } = adminClient.storage.from("event-images").getPublicUrl(path);
  return data.publicUrl;
}

async function loadEvents() {
  requireClient();
  const { data, error } = await adminClient.from("events").select("*").order("date", { ascending: false });
  if (error) throw error;
  eventList.innerHTML = data.map((event) => `
    <article class="admin-event">
      <div><strong>${escapeAdminHtml(event.title)}</strong><br><span>${escapeAdminHtml(event.date)} · ${escapeAdminHtml(event.status)}</span></div>
      <button class="btn btn--outline btn--sm" type="button" data-edit="${escapeAdminHtml(event.id)}">Edit</button>
    </article>`).join("");
  eventList.querySelectorAll("[data-edit]").forEach((button) => {
    button.addEventListener("click", () => editEvent(data.find((event) => event.id === button.dataset.edit)));
  });
}

function editEvent(event) {
  Object.entries(event).forEach(([key, value]) => {
    const field = eventForm.elements[key];
    if (!field) return;
    if (field.type === "checkbox") field.checked = Boolean(value);
    else if (typeof value === "string") field.value = value;
  });
  eventForm.elements.id.value = event.id;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function saveEvent(submission) {
  requireClient();
  const values = Object.fromEntries(new FormData(submission).entries());
  const id = values.id || crypto.randomUUID();
  const record = {
    id,
    title: values.title,
    date: values.date,
    time: values.time,
    venue: values.venue,
    description: values.description,
    speaker: values.speaker || null,
    registration_link: values.registration_link || null,
    status: values.status,
    published: submission.elements.published.checked,
  };
  const cover = submission.elements.cover.files[0];
  const gallery = [...submission.elements.gallery.files];
  if (cover) record.cover_image = await uploadImage(cover, id, "cover");
  if (gallery.length) record.gallery = await Promise.all(gallery.map((file, index) => uploadImage(file, id, `gallery-${index + 1}`)));
  const { error } = await adminClient.from("events").upsert(record);
  if (error) throw error;
}

if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      requireClient();
      const values = Object.fromEntries(new FormData(loginForm).entries());
      const { error } = await adminClient.auth.signInWithPassword({ email: values.email, password: values.password });
      if (error) throw error;
    } catch (error) {
      setStatus(loginStatus, error.message, true);
    }
  });
}

if (eventForm) {
  eventForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setStatus(eventStatus, "Saving...");
    try {
      await saveEvent(eventForm);
      setStatus(eventStatus, "Event saved.");
      eventForm.reset();
      await loadEvents();
    } catch (error) {
      setStatus(eventStatus, error.message, true);
    }
  });
  document.querySelector("[data-reset]").addEventListener("click", () => eventForm.reset());
}

document.querySelector("[data-sign-out]")?.addEventListener("click", async () => {
  await adminClient.auth.signOut();
});

async function initialize() {
  if (!adminClient) {
    setStatus(loginStatus, "Configure Supabase in js/supabase-config.js.", true);
    return;
  }
  const { data } = await adminClient.auth.getSession();
  if (data.session) {
    loginForm.hidden = true;
    dashboard.hidden = false;
    try { await loadEvents(); } catch (error) { setStatus(eventStatus, error.message, true); }
  }
  adminClient.auth.onAuthStateChange((_event, session) => {
    loginForm.hidden = Boolean(session);
    dashboard.hidden = !session;
    if (session) loadEvents().catch((error) => setStatus(eventStatus, error.message, true));
  });
}

initialize();
