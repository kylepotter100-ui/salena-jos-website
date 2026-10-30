# Salena-Jo's landing page

A static site with no build step: `index.html`, `styles.css`, `main.js` and `assets/`. You can host it anywhere that serves static files (Netlify, GitHub Pages, Cloudflare Pages).

To preview it locally: `npx serve site` or `python3 -m http.server -d site`. Serve it over HTTP: when opened as `file://`, the logo light-sweep mask is blocked.

## Editing

- **Switches:** the `CONFIG` block at the top of `main.js` turns online booking, the floating Call/Book bar and the logo sheen on or off.
- **Opening hours:** `HOURS` in `main.js` (minutes from midnight, Sunday = 0), plus the JSON-LD block in `index.html`.
- **Treatment photos:** put an `<img src="assets/…" alt="…">` inside any `.ph` placeholder in `index.html`. It fills the frame and the placeholder hides itself.

## Before launch

- Confirm the opening hours, address and email. They were taken from public listings.
- Booking is simulated. Time-slot availability is placeholder data, and `submit()` in `main.js` doesn't send anything. Connect it to a booking service (Fresha, Treatwell), email or SMS.
