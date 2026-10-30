# Salena-Jo's landing page

A static site with no build step: `index.html`, `styles.css`, `main.js` and `assets/`. You can host it anywhere that serves static files (Vercel, Netlify, Cloudflare Pages). Set the root/publish directory to `site` and leave the build command empty.

To preview it locally: `npx serve site` or `python3 -m http.server -d site`.

## Design

The art direction comes from the project's taste-skill (`.claude/skills/taste-skill`): direction "The place carries it", seed 368506553, with the brand's palette (shopfront slate) and type (Gilda Display and Hanken Grotesk) kept. The dealt sheet is in `.taste-skill/direction.json`.

- **First screen:** the shopfront photo, full-bleed. It slowly crossfades between three framings of the same photo. A rail across the middle carries the name, a line about the salon and the Book action, and docks as the header as you scroll.
- **Treatments:** the A-board photo, then its six treatments set as a table. Each row jumps straight to booking that treatment.
- **The live thing:** the open/closed sign on the visit card flips to match the real opening hours.
- **Booking:** a 3-step request flow on the slate band.

## Pictures

Every photo on the page is cut from the two photos the client supplied (`project/uploads/`). They're in `assets/photos/`. Swapping in higher-resolution or new photos with the same file names updates the page. The two originals are only about 1150 px wide, so they look soft on large screens.

## Editing

- **Online booking:** `CONFIG.onlineBooking` in `main.js`.
- **Opening hours:** `HOURS` in `main.js`, the hours table in `index.html`, and the JSON-LD block in `index.html`.

## Before launch

- Confirm the opening hours, address and email. They were taken from public listings.
- Booking is simulated. Time-slot availability is placeholder data, and `submit()` in `main.js` doesn't send anything. Connect it to a booking service (Fresha, Treatwell), email or SMS.
- The row descriptions and the "Hair" row are written from the shop sign and the A-board. Ask the client to check them.
