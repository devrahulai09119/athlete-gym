# Decisions

## Static site, not React

The brief prefers HTML, CSS, and JavaScript, and this workspace already ships static client sites. A framework would add a build without improving the single-page design.

## Project folder

The site lives in `client's website/athlete-gym` beside Panchtatva Farms. Project-control files stay in this folder so they do not overwrite the other client.

## Electric lime on a dark field

Accent `#C6F531` is used for labels, the scroll bar, and primary buttons. Large surfaces stay near-black so the page does not read as neon.

## No invented business facts

Unknown phone, WhatsApp, street, hours, prices, trainers, and proof points stay absent or are explicit placeholders. `WHATSAPP_NUMBER_HERE` does not produce a `wa.me` link.

## Demo photography

Unsplash and similar files fill the image slots until Athlete Gym supplies photographs. Alt text describes the picture. The footer says the images are temporary stand-ins.

## Email path

Resend from a serverless function keeps the API key off the client. Missing credentials return 503 instead of a fake success. HTML form posts still receive a result page if JavaScript is off.

## WhatsApp

One `whatsappNumber` in `config.js`. Links are built only when the value is 8–15 digits. Until then, WhatsApp controls point at the enquiry form and say the number is not set.

## Canonical URL

Open Graph and the canonical link wait for a real domain. An empty `canonicalUrl` is intentional.
