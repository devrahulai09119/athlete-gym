# Athlete Gym — Roadmap

Premium website for Athlete Gym, Sector 23, Gurgaon (Gurugram), Haryana.

Verification means the behaviour was exercised, not merely that the code exists.

## Current phase

Phase 10 — production deployment is blocked. The site is built and checked locally. Email delivery, a public URL, and a dedicated GitHub repository are not done.

## Phases

| Phase | Scope | Status |
| --- | --- | --- |
| 1 Foundation | Static project, config, docs, local git | Partial — files exist; dedicated GitHub repo is blocked |
| 2 Design system | Tokens, type, glass, corners, buttons, ambient light | Verified in the browser on desktop and mobile |
| 3 Hero and navigation | Nav, mobile menu, hero, scroll progress | Verified at 375 and 1440 |
| 4 Main content | About through footer | Built and reviewed on desktop; overflow checked at every target width |
| 5 Motion | GSAP, ScrollTrigger, reduced motion | Implemented; reduced-motion was not toggled in the browser |
| 6 Conversion | Enquiry form, CTA, WhatsApp architecture | Form validation, loading, and honest error verified locally |
| 7 Email | `/api/enquiry` via Resend | Handler tested without credentials; live delivery not tested |
| 8 Responsive QA | 375, 390, 414, 768, 1024, 1440 | No horizontal overflow at those widths |
| 9 SEO and performance | Metadata, semantics, assets | Metadata present; Lighthouse not run |
| 10 Production | Deploy and production QA | Blocked — no Vercel token or CLI login |

## Completed

- Single-page site: navigation, hero, about, programs, strength, boxing, Zumba/cardio, personal training, why Athlete, transformation, enquiry, contact, footer
- Central `config.js` for location, enquiry inbox, WhatsApp placeholder, and image registry
- Enquiry API with validation, honeypot, timing check, and Resend when env vars exist
- Local enquiry handler tests in `scripts/check-enquiry.js` (all passed)
- Browser check of hero, desktop nav, mobile menu, form errors, sending state, and no fake success
- Overflow check at 375, 390, 414, 768, 1024, and 1440

## Remaining

- Replace `WHATSAPP_NUMBER_HERE` with the real digits-only number
- Set `RESEND_API_KEY` and `EMAIL_FROM`, then send a real enquiry and confirm it arrives at `devrahul.ai09119@gmail.com`
- Create and push the GitHub repository `athlete-gym` after `gh` is signed in
- Deploy with the Athlete Gym folder as the project root and record the real URL
- Set `canonicalUrl` once that domain exists
- Replace temporary demo photographs with Athlete Gym photography
- Run Lighthouse and a reduced-motion pass in the browser

## Dependencies

- GSAP 3.12.5 and ScrollTrigger from jsDelivr
- Vercel serverless runtime for `api/enquiry.js`
- Resend for mail

## Blockers

- GitHub CLI token for `devrahulai09119` is invalid
- No `RESEND_API_KEY`, `EMAIL_FROM`, or Vercel credentials in the environment
- WhatsApp number has not been supplied
