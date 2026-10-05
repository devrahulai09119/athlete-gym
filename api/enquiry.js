const INTERESTS = [
  "Gym Membership",
  "Zumba",
  "Boxing",
  "Body Lifting",
  "Cardio",
  "Personal Training",
  "General Enquiry"
];

function cleanLine(value, max) {
  return String(value || "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, max);
}

function cleanMessage(value, max) {
  return String(value || "")
    .replace(/\r\n/g, "\n")
    .replace(/[^\S\n]+/g, " ")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, max);
}

function validateEnquiry(body, now, options) {
  const source = body && typeof body === "object" ? body : {};
  const requireTiming = !options || options.requireTiming !== false;
  const errors = {};

  if (cleanLine(source.leave_blank, 200)) {
    return { ok: false, code: "REJECTED", errors: {}, clean: null };
  }

  const name = cleanLine(source.name, 80);
  const phoneRaw = cleanLine(source.phone, 24);
  const email = cleanLine(source.email, 120).toLowerCase();
  const interest = cleanLine(source.interest, 40);
  const preferred = cleanLine(source.preferred, 120);
  const message = cleanMessage(source.message, 1000);
  const phoneDigits = phoneRaw.replace(/\D/g, "");

  if (name.length < 2 || !/[\p{L}]/u.test(name)) {
    errors.name = "Enter your full name.";
  }
  if (phoneDigits.length < 8 || phoneDigits.length > 15) {
    errors.phone = "Enter a phone number with 8 to 15 digits.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!INTERESTS.includes(interest)) {
    errors.interest = "Choose what you are interested in.";
  }
  if (message.length < 10) {
    errors.message = "Add a short message so the gym knows how to help.";
  }
  if ((message.match(/https?:\/\//gi) || []).length > 2) {
    errors.message = "Remove extra links from the message.";
  }

  const startedAt = Number(source.startedAt);
  if (requireTiming) {
    if (!Number.isFinite(startedAt) || now - startedAt < 1200 || startedAt > now + 60000) {
      return { ok: false, code: "REJECTED", errors: {}, clean: null };
    }
  }

  if (Object.keys(errors).length) {
    return { ok: false, code: "VALIDATION", errors, clean: null };
  }

  return {
    ok: true,
    code: "OK",
    errors: {},
    clean: { name, phone: phoneRaw, email, interest, preferred, message }
  };
}

function getMailConfig(env) {
  const source = env || process.env;
  const apiKey = source.RESEND_API_KEY || "";
  const from = source.EMAIL_FROM || "";
  const to = source.EMAIL_TO || "devrahul.ai09119@gmail.com";
  if (!apiKey || !from) return { ok: false };
  return { ok: true, apiKey, from, to };
}

function wantsHtml(req) {
  const accept = String((req.headers && req.headers.accept) || "");
  const contentType = String((req.headers && req.headers["content-type"]) || "");
  return accept.includes("text/html") && !contentType.includes("application/json");
}

function resultPage(payload) {
  const success = payload.ok === true;
  const title = success ? "Enquiry sent" : "Enquiry not sent";
  const detail = success
    ? "Your enquiry was accepted for delivery to Athlete Gym."
    : cleanLine(payload.message || "This enquiry could not be sent.", 240);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex">
  <title>${title} — Athlete Gym</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <main class="result-page">
    <p class="eyebrow">Athlete Gym · Sector 23 · Gurgaon</p>
    <h1>${title}</h1>
    <p>${detail}</p>
    <a class="btn btn--primary" href="/#contact">Back to Athlete Gym</a>
  </main>
</body>
</html>`;
}

function send(req, res, status, payload) {
  res.status(status);
  res.setHeader("Cache-Control", "no-store");
  if (wantsHtml(req)) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.send(resultPage(payload));
    return;
  }
  res.json(payload);
}

function originAllowed(req) {
  const origin = req.headers && req.headers.origin;
  if (!origin) return true;
  try {
    return new URL(origin).host === req.headers.host;
  } catch (error) {
    return false;
  }
}

function parseBody(req) {
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (error) {
      body = {};
    }
  }
  return body && typeof body === "object" ? body : {};
}

async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    send(req, res, 405, { ok: false, code: "METHOD", message: "Use the enquiry form to send a message." });
    return;
  }

  if (!originAllowed(req)) {
    send(req, res, 403, { ok: false, code: "FORBIDDEN", message: "This enquiry could not be sent." });
    return;
  }

  const contentType = String((req.headers && req.headers["content-type"]) || "");
  const requireTiming = contentType.includes("application/json");
  const result = validateEnquiry(parseBody(req), Date.now(), { requireTiming });

  if (!result.ok) {
    const status = result.code === "VALIDATION" ? 400 : 400;
    const message = result.code === "VALIDATION"
      ? "Check the highlighted fields."
      : "This enquiry could not be sent.";
    send(req, res, status, { ok: false, code: result.code, message, errors: result.errors });
    return;
  }

  const mail = getMailConfig();
  if (!mail.ok) {
    send(req, res, 503, {
      ok: false,
      code: "EMAIL_NOT_CONFIGURED",
      message: "Enquiry email delivery is not configured yet. Your message was not sent."
    });
    return;
  }

  const text = [
    "Athlete Gym website enquiry",
    "",
    `Name: ${result.clean.name}`,
    `Phone: ${result.clean.phone}`,
    `Email: ${result.clean.email}`,
    `Interested in: ${result.clean.interest}`,
    `Preferred training: ${result.clean.preferred || "Not specified"}`,
    "",
    result.clean.message
  ].join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${mail.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: mail.from,
        to: [mail.to],
        reply_to: result.clean.email,
        subject: `Athlete Gym enquiry: ${result.clean.interest}`,
        text
      }),
      signal: typeof AbortSignal !== "undefined" && AbortSignal.timeout ? AbortSignal.timeout(12000) : undefined
    });

    if (!response.ok) {
      console.error("Resend rejected enquiry", response.status);
      send(req, res, 502, {
        ok: false,
        code: "DELIVERY_FAILED",
        message: "The enquiry could not be delivered. Nothing was confirmed as sent."
      });
      return;
    }
  } catch (error) {
    console.error("Enquiry delivery failed");
    send(req, res, 502, {
      ok: false,
      code: "DELIVERY_FAILED",
      message: "The enquiry could not be delivered. Nothing was confirmed as sent."
    });
    return;
  }

  send(req, res, 200, { ok: true });
}

handler.validateEnquiry = validateEnquiry;
handler.getMailConfig = getMailConfig;
module.exports = handler;
