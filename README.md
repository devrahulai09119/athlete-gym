# Athlete Gym

Premium one-page website for Athlete Gym, Sector 23, Gurgaon (Gurugram), Haryana.

## Local preview

From this folder:

```bash
python3 -m http.server 8766
```

Open `http://127.0.0.1:8766/`. The static server does not run `api/enquiry.js`, so a submitted form correctly reports that the enquiry was not sent.

## Enquiry email

Destination inbox: `devrahul.ai09119@gmail.com`.

Copy `env.example` to the host environment. Set `RESEND_API_KEY` and a verified `EMAIL_FROM`. Do not commit those values. Delivery has not been tested, because those credentials are not in this environment.

Check the handler without sending mail:

```bash
node scripts/check-enquiry.js
```

## WhatsApp

Set `whatsappNumber` in `config.js` to digits only, with country code and no plus, spaces, or dashes. Until that replaces `WHATSAPP_NUMBER_HERE`, WhatsApp buttons do not open `wa.me`.

## Images

Files in `assets/images/` are temporary demo photographs, not pictures of Athlete Gym. Replace a file in place or update `ATHLETE_CONFIG.images` and the matching `src` in `index.html`.

## Deploy

Use this folder as the project root so `/api/enquiry` resolves to `api/enquiry.js`. Set the email variables on the host. Put the live origin in `canonicalUrl` and the canonical link after the domain exists.

There is no production URL yet.
