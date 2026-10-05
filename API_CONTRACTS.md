# API contracts

## POST /api/enquiry

Vercel serverless handler: `api/enquiry.js`.

Sends one plain-text email through Resend to `EMAIL_TO`, which defaults to `devrahul.ai09119@gmail.com`.

### Request

`Content-Type: application/json`

```json
{
  "name": "Asha Sen",
  "phone": "9876543210",
  "email": "asha@example.com",
  "interest": "Boxing",
  "preferred": "",
  "message": "I would like to know about boxing sessions.",
  "leave_blank": "",
  "startedAt": 1710000000000
}
```

`interest` must be one of: Gym Membership, Zumba, Boxing, Body Lifting, Cardio, Personal Training, General Enquiry.

JSON requests must include `startedAt` at least 1200ms before the server clock. A non-JSON form post may omit it. `leave_blank` must be empty.

### Responses

| Status | code | Meaning |
| --- | --- | --- |
| 200 | — | `{ "ok": true }` after Resend accepts the message |
| 400 | `VALIDATION` | Field errors in `errors` |
| 400 | `REJECTED` | Honeypot or timing failure. No field detail |
| 403 | `FORBIDDEN` | Origin host does not match the request host |
| 405 | `METHOD` | Not POST |
| 502 | `DELIVERY_FAILED` | Resend rejected the message or the request failed |
| 503 | `EMAIL_NOT_CONFIGURED` | `RESEND_API_KEY` or `EMAIL_FROM` is missing. Nothing was sent |

The client may show a success state only when the status is OK and `ok` is true.

### Environment

```text
EMAIL_TO=devrahul.ai09119@gmail.com
RESEND_API_KEY=
EMAIL_FROM=
```

See `env.example`. Do not commit values for the key or sender.
