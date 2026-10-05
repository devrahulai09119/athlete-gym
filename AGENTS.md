# Athlete Gym — Agent rules

This folder is the Athlete Gym website. Do not edit Panchtatva Farms files while working here.

## Architecture

- Static HTML, CSS, and JavaScript. Do not add React, Next.js, or Tailwind.
- Keep business facts in `config.js`. Do not scatter the WhatsApp number or enquiry inbox through the page.
- Secrets stay in host environment variables. Never put them in `index.html`, `app.js`, `config.js`, or CSS.
- `api/enquiry.js` is the only server entry. It runs on Vercel, not in the static preview server.

## Components and naming

- One page, sections identified by stable ids: `home`, `about`, `programs`, `training`, `boxing`, `energy`, `personal`, `why`, `transformation`, `enquire`, `contact`.
- Reuse `.btn`, `.glass`, `.highlight-corners`, and `.eyebrow`. Do not invent a second button style for a single section.
- BEM-like class names already in `styles.css` stay as they are. Match them when adding a section.

## Motion

- GSAP is for entrance, reveal, and desktop parallax. Hover stays in CSS.
- Clear GSAP inline transforms after a reveal so hover can move the element.
- Parallax and scrubbed motion only at `min-width: 900px`.
- `prefers-reduced-motion: reduce` must keep the page usable and skip decorative motion.

## Accessibility

- Semantic headings, labelled fields, visible focus, and a keyboard-operable mobile menu.
- The mobile menu traps focus, closes on Escape, and sets `inert` on the page behind it.
- Do not communicate state by colour alone. Form errors use text.

## Responsive

- No horizontal overflow at 375, 390, 414, 768, 1024, or 1440.
- Navigation collapses below 1080px. Do not shrink the desktop nav until it collides.

## Content

- Do not invent a phone number, WhatsApp number, street address, hours, prices, trainer names, credentials, member counts, years, awards, reviews, or testimonials.
- Temporary photos are demo images. Alt text and the footer must not claim they were taken at Athlete Gym.
- Do not show a success state unless the server returns `ok: true`.

## Change control

- Do not rewrite a working section without a regression you can name.
- Do not add a dependency to fix a layout issue.
- After a visual change, check the affected flow in the browser, including the other sections that share the component.
