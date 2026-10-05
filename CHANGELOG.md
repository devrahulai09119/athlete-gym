# Changelog

## Unreleased

### Foundation

- Added the Athlete Gym static site beside the existing client work.
- Centralised business settings in `config.js`.
- Documented architecture, the enquiry contract, and deployment requirements.

### Design and content

- Built the dark editorial page: hero, about pillars, program rows, strength, boxing, energy, personal training, why Athlete, transformation, contact, and footer.
- Added glass surfaces, highlight corners, ambient light, and the scroll progress bar.
- Used temporary demo photographs and labelled them as such.

### Motion and conversion

- Added GSAP entrance, reveal, and desktop parallax, with a reduced-motion path.
- Added the enquiry form and `/api/enquiry`. Live email is not configured.
- Added WhatsApp copy and links that stay inactive until a real number is set.

### Verification

- `node scripts/check-enquiry.js` passed, including the unconfigured-mail 503.
- Browser check: desktop hero and nav, mobile menu, form validation, sending state, and error state without a false success.
- No horizontal overflow at 375, 390, 414, 768, 1024, or 1440.
