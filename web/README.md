# Salena-Jo's website

A single-page Next.js 15 site (App Router, Tailwind v4, Motion), exported as static files.

- `npm run dev` runs it locally at http://localhost:3000.
- `npm run build` writes the static site to `out/`.
- Cloudflare: the root `wrangler.jsonc` builds this folder and serves `out/`. Set the Cloudflare build's root directory to `/`.

## Design rules

Built against taste-skill v2 (experimental). Dials: `DESIGN_VARIANCE 8`, `MOTION_INTENSITY 6`, `VISUAL_DENSITY 3`.
One theme (auto light/dark from the visitor's system setting), one accent (`#c72c4f`), all-sharp corners.

| Section | Layout family |
| --- | --- |
| Hero | Asymmetric split |
| Statement | Editorial manifesto |
| Treatments | Horizontal pan |
| Good to know | Bento (5 cells) |
| Academy | Offset collage |
| Shopfront | Full-bleed zoom |
| Visit | Typographic info grid |
| Book a visit | Offset single-column form |
| Footer | Statement footer |

## Images

Eleven images were generated with Higgsfield (`soul_2`) and are loaded from Higgsfield's CDN (URLs in `lib/site.ts`).
They're editorial stand-ins, not photos of the salon's own clients. Swap in the client's own photography when it exists.
The shopfront photo in `public/images/` is the client's own.

## Before launch

- Confirm the opening hours (Wednesday to Saturday only), address and email. They came from public listings.
- The booking form opens the visitor's email app with the request filled in. Connect a booking service (Fresha, Treatwell) if the salon wants online booking.
