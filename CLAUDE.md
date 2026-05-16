# CLAUDE.md

## Development

No build tools or package manager. Preview by opening files directly in a browser (`start index.html`). No tests, linting, or compilation.

## File size rule

**No file may exceed 500 lines.** If an edit would push a file over this limit, split it into logical pieces first.

## Architecture

This is a static Dutch-language coaching website for Stefan Pennings ("Het Doorbraak Traject").

### Pages

| File | Purpose |
|------|---------|
| `index.html` | Main landing page (hero, program, testimonials, investment, about, contact) |
| `ervaringen.html` | Standalone testimonials page — has its own inline `<style>` block |

### SPA-like page switching on index.html

The Contact section is **not a separate page** — it is a hidden `<div id="contact-page">` sitting alongside `<div id="main-page">` in the same HTML file. Navigation between them is handled purely in JavaScript:

- `showMain()` — shows `#main-page`, hides `#contact-page`
- `showContact()` — shows `#contact-page`, hides `#main-page`

Nav links call these functions inline via `onclick`. The URL never changes.

### CSS split (index.html only)

| File | Contains |
|------|---------|
| `css/base.css` | CSS custom properties (`:root`), floating WhatsApp button, nav, buttons, section base, hero, problem, results, trajectory, practical sections |
| `css/sections.css` | About, investment, final CTA, contact page, footer, hamburger menu, testimonials, all `@media` responsive rules |

`ervaringen.html` uses its own self-contained `<style>` block and does **not** reference these CSS files.

### JavaScript (`js/main.js`)

Loaded only by `index.html`. Handles:
- Hamburger menu (open/close, overlay click)
- `showMain()` / `showContact()` page switching
- Nav scroll class (`.scrolled` applied after 60px scroll)
- Week accordion (`.week-item` open/close, only one open at a time)
- Scroll animations via `IntersectionObserver` — adds `.visible` / `.visible-fade` to `.fade-in`, `.pain-row`, `.result-card`, `.week-item`, `.offer-card` elements
- Contact form — submits via `mailto:` (no backend); shows `#form-success` on submit

### Design tokens

All colours and section backgrounds are CSS custom properties in `:root` inside `css/base.css`:

```
--off-white, --cream, --warm-beige, --warm-grey, --dark-brown, --forest, --charcoal
--gold (#A8906A), --gold-light (#C4A882)
--serif (Cormorant Garamond), --sans (Jost)
--bg-hero, --bg-problem, --bg-results, --bg-trajectory, --bg-practical, --bg-about, --bg-investment, --bg-final
```

### Assets

`images/stefan.jpg` — profile photo used in the About section of `index.html`.

## Deployment

- **GitHub repo:** `https://github.com/stefanpennings/website.git` (public, branch: `main`)
- **Hosting:** Vercel — connected to the GitHub repo, auto-deploys on every push to `main`
To deploy any change: `git add . && git commit -m "message" && git push` — Vercel picks it up automatically within ~30 seconds.

## Password gate

`password.html` is the entry point for visitors. Password is **test** (temporary, for preview sharing).

- Correct password sets `sessionStorage` key `auth=1` and redirects to `index.html`
- Both `index.html` and `ervaringen.html` redirect to `password.html` if `auth` is not set
- To remove the gate later: delete `password.html` and remove the `<script>` auth check from the `<head>` of both HTML files
