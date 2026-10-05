# Athlete Gym — Architecture

## Application

Static site. No build step. Open `index.html` or serve this folder as the site root.

```text
athlete-gym/
├── index.html          Page, metadata, and section markup
├── styles.css          Design system and layout
├── boot.js             Adds .js and .reduce-motion before paint
├── config.js           Business settings and image registry
├── app.js              Nav, form, WhatsApp, GSAP
├── api/enquiry.js      Vercel POST handler
├── scripts/check-enquiry.js
├── assets/images/      Replaceable photography
├── assets/icons/
├── assets/videos/
├── favicon.svg
├── robots.txt
├── site.webmanifest
├── vercel.json
└── env.example
```

## Page

One continuous page, in this order: navigation, hero, about, programs, strength, boxing, Zumba and cardio, personal training, why Athlete, transformation, enquiry band, contact, footer. A scroll progress bar and a floating WhatsApp control sit outside the story.

## Styling

Tokens live at the top of `styles.css`: near-black surfaces, white type, electric lime `#C6F531`, glass fills, and hairline borders. Display type is Space Grotesk. Body type is Inter. Glass, highlight corners, and buttons are shared utilities. Ambient light is slow radial glow, not neon.

## Motion

`boot.js` marks `html.js` and, when requested, `html.reduce-motion`. `app.js` loads GSAP and ScrollTrigger from jsDelivr. Hero entrance, section reveals, and desktop-only parallax run from there. Reduced motion skips those effects.

## Assets

`ATHLETE_CONFIG.images` is the registry. `index.html` repeats the same paths in `src` and `data-asset` so the page still works if JavaScript fails. Swap a file in place, or update both the registry and the matching `src`.

## Forms and email

The browser posts JSON to `/api/enquiry`. The handler validates, rejects the honeypot and fast JSON posts, and sends mail through Resend only when `RESEND_API_KEY` and `EMAIL_FROM` are set. Otherwise it returns 503 `EMAIL_NOT_CONFIGURED`. The page shows success only for `{ ok: true }`.

A static file server cannot run `api/enquiry.js`. Local mail checks use `node scripts/check-enquiry.js`.

## Deployment

Host this directory as the project root so `/api/enquiry` maps to `api/enquiry.js`. `vercel.json` sets security headers only. Set `EMAIL_TO`, `RESEND_API_KEY`, and `EMAIL_FROM` on the host. After a real domain exists, set `canonicalUrl` in `config.js` and the canonical link in `index.html`.
