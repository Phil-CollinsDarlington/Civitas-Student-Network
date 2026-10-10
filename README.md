# Civitas Student Network (CSN) — Website

**One Network. Endless Possibilities.**

This is the official website for Civitas Student Network, a student-driven
organization that bridges the gap between education and opportunity. It is
a **static website** — plain HTML, CSS and JavaScript, no backend, no
build tools, no database. You can edit it in VS Code and open the files
directly in a browser to preview your changes.

---

## 1. What the project is

A multi-page marketing and community website for CSN, covering:

- Homepage with hero, programs, opportunities, events and community previews
- About, Programs, Opportunities, Events, Crew, Partners, Insights pages
- A "Join CSN" page with three application pathways (Student / Volunteer / Campus Rep)
- A Contact page and working forms (via **Netlify Forms** — see Section 13)
- A branded 404 page

No login system, member accounts, or admin dashboard exist yet — the site
is architected so those can be added later without a redesign.

---

## 2. Folder structure

```
CSN-WEBSITE/
├── index.html              ← Homepage
├── 404.html                ← Custom "page not found" page
├── pages/                  ← Every other page
│   ├── about.html
│   ├── programs.html
│   ├── opportunities.html
│   ├── events.html
│   ├── crew.html
│   ├── partners.html
│   ├── insights.html
│   ├── join.html
│   ├── contact.html
│   └── thank-you.html
├── css/
│   ├── style.css           ← Colors, fonts, spacing, layout basics
│   ├── components.css      ← Buttons, cards, nav, footer, forms, modal
│   ├── responsive.css      ← Mobile/tablet/desktop breakpoints
│   └── animations.css      ← Scroll reveal + motion
├── js/
│   ├── main.js              Global init (footer year, pathway tabs)
│   ├── navigation.js        Mobile menu, sticky header, active link
│   ├── opportunities.js     Opportunity data + filtering + search
│   ├── events.js            Event data + rendering
│   ├── crew.js               Profile modal
│   ├── insights.js          Article data + filtering
│   ├── animations.js        Scroll-reveal + optional counters
│   └── forms.js             Validation + Netlify AJAX submission
├── assets/
│   ├── images/               (logo, crew, events, programs, partners, students)
│   └── icons/
├── netlify.toml
├── robots.txt
├── sitemap.xml
└── README.md
```

---

## 3. How to run locally

No installation needed. Just open `index.html` in your browser by
double-clicking it, or right-click → "Open with" → your browser.

For the best experience (and to avoid a few browser quirks with local
files), you can also run a tiny local server from this folder:

```bash
# Python 3
python3 -m http.server 8000
# then visit http://localhost:8000
```

---

## 4. How to edit the homepage

Open `index.html`. Every section is wrapped in an HTML comment banner
like:

```html
<!-- =========================================================
     WHAT IS CSN?
     TO EDIT: replace this copy...
========================================================= -->
```

Find the section you want by its banner and edit the text directly.
Do not remove the `<section>` wrapper or its `class` attribute — the
CSS depends on those classes.

---

## 5. How to edit programs

Open `pages/programs.html`. Each program is a `.card` inside a
category block. Copy an existing `.card` and edit the heading and
paragraph to add a new program. The homepage's shorter "Programs
Preview" section lives directly in `index.html`.

---

## 6. How to add opportunities

Open `js/opportunities.js`. Copy one object out of the `opportunities`
array and edit its values:

```javascript
{
  title: "Your Opportunity Title",
  organization: "Organization Name",
  category: "Internships", // must match a category in OPPORTUNITY_CATEGORIES
  deadline: "30 September 2026",
  eligibility: "Who can apply",
  location: "City, Country",
  description: "One or two sentence summary.",
  link: "https://...",
}
```

Delete the `isExample: true` line for a real listing — that flag adds
the "Example listing" badge, which should only appear on demo data.

---

## 7. How to add events

Open `js/events.js`. Copy an object out of the `events` array. Set
`status` to `"upcoming"` or `"past"` — the page automatically sorts
them into the right section.

---

## 8. How to add crew members

Open `pages/crew.html`. Each person is a `<button class="profile-card"
data-profile-trigger>` with `data-name`, `data-role` and `data-bio`
attributes — clicking it opens the shared profile modal (powered by
`js/crew.js`). Copy an existing button and edit those attributes.
Replace the `.profile-photo-initials` circle with a real `<img>` once
a photo is available.

---

## 9. How to add partners

Open `pages/partners.html`. Once you have a confirmed partner, replace
the empty-state block with a grid of `.partner-logo` items (see
`css/components.css` for the class).

---

## 10. How to add insights (articles)

Open `js/insights.js`. Copy an object out of the `insights` array and
edit its values, the same way as opportunities above.

---

## 11. How to change social media links

Every page's footer has a "Connect" column with `href="#"`
placeholders and an HTML comment above each one telling you which
platform it is. Search for `EDIT: replace #` across the project to
find every spot at once. The homepage's dedicated social section is
in `index.html` under the `SOCIAL SECTION` banner.

---

## 12. How to change contact details

Open `pages/contact.html` and edit the email, phone, WhatsApp,
Instagram and location list items — each is marked `Placeholder`
until you replace it with the real detail (then remove the
`<span class="badge badge--outline">Placeholder</span>` tag).

---

## 13. How Netlify Forms work

This site has **no custom backend**. The five forms (Join CSN ×3
pathways, Partner With CSN, Contact) all use **Netlify Forms** — a
feature built into Netlify hosting. Because each `<form>` has a
`data-netlify="true"` attribute and a unique `name`, Netlify
automatically detects and stores submissions the moment you deploy —
you'll see them in your Netlify dashboard under **Forms**. No
database, API key, or server code is required.

`js/forms.js` adds client-side validation and submits the form via
`fetch()` so the visitor sees an inline success message instead of a
full page reload — but the form still works fine even with
JavaScript disabled, since it falls back to a normal submit that
redirects to `pages/thank-you.html`.

Each form also includes a hidden **honeypot field** (`bot-field`) for
basic spam protection, which Netlify checks automatically.

---

## 14. How to add insights / opportunities / events images

Right now, all opportunity/event/article cards use a colored
placeholder block instead of a photo (to avoid using fake stock
images). To add a real photo, replace the `.data-card-media` div in
the relevant `js/*.js` render function with an `<img>` tag pointing
into `assets/images/`.

---

## 15. How to replace images generally

Every image placeholder in this project is intentional — real crew
photos, event photos, partner logos and student photos were not
available when this site was built. Search for `PLACEHOLDER` in the
codebase to find every spot, and drop your real files into the
matching `assets/images/` subfolder (`crew/`, `events/`, `programs/`,
`partners/`, `students/`, `logo/`).

---

## 16. How to deploy to GitHub

```bash
git init
git add .
git commit -m "Initial CSN website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/usn-website.git
git push -u origin main
```

---

## 17. How to deploy to Netlify

1. Sign in at [netlify.com](https://www.netlify.com) and click **Add
   new site → Import an existing project**.
2. Connect your GitHub repository from Step 16.
3. Leave the build command blank and set the publish directory to `.`
   (the project root) — `netlify.toml` already configures this for
   you.
4. Click **Deploy**. Netlify will detect the forms automatically.

You can also drag-and-drop the whole `CSN-WEBSITE` folder onto
Netlify's "Deploys" page for a quick manual deploy without GitHub.

---

## 18. How to connect a custom domain

In your Netlify site dashboard: **Domain settings → Add a custom
domain**, then follow Netlify's instructions to point your domain's
DNS records at Netlify. Once connected, update `SITE_URL` references
in `robots.txt`, `sitemap.xml`, and the canonical/Open Graph tags at
the top of each HTML file (search for `example.org`).

---

## 19. Future backend readiness

The data for opportunities, events and insights lives in plain
JavaScript arrays (`js/opportunities.js`, `js/events.js`,
`js/insights.js`) specifically so that, later, those arrays can be
replaced with data fetched from a real API without redesigning any
component. Anywhere a future feature (accounts, admin dashboard, CMS,
etc.) would plug in, it has been deliberately left out rather than
faked.

---

## 20. Questions?

This README is meant to get you unstuck quickly — if something isn't
covered here, check the comment banners inside the HTML/CSS/JS files
themselves; they're written to explain exactly what to edit and where.
