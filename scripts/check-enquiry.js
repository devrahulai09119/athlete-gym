const handler = require("../api/enquiry");

function mockRes() {
  return {
    statusCode: 200,
    payload: null,
    headers: {},
    setHeader(key, value) {
      this.headers[key] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.payload = body;
      return this;
    },
    send(body) {
      this.payload = body;
      return this;
    }
  };
}

async function invoke(method, body, headers) {
  const res = mockRes();
  await handler(
    {
      method,
      body,
      headers: Object.assign({ host: "athlete-gym.local", "content-type": "application/json" }, headers || {})
    },
    res
  );
  return res;
}

function assert(condition, message) {
  if (!condition) {
    console.error("FAIL", message);
    process.exitCode = 1;
  } else {
    console.log("PASS", message);
  }
}

(async function run() {
  const now = Date.now();
  const valid = {
    name: "Asha Sen",
    phone: "98765 43210",
    email: "asha@example.com",
    interest: "Boxing",
    preferred: "Evening strength",
    message: "I want to know how boxing training works.",
    startedAt: now - 5000
  };

  const good = handler.validateEnquiry(valid, now, { requireTiming: true });
  assert(good.ok === true, "valid enquiry passes");

  const badEmail = handler.validateEnquiry(Object.assign({}, valid, { email: "not-an-email" }), now);
  assert(badEmail.ok === false && badEmail.errors.email, "invalid email is rejected");

  const badInterest = handler.validateEnquiry(Object.assign({}, valid, { interest: "Free trial prize" }), now);
  assert(badInterest.ok === false && badInterest.errors.interest, "unknown interest is rejected");

  const honeypot = handler.validateEnquiry(Object.assign({}, valid, { leave_blank: "spam" }), now);
  assert(honeypot.ok === false && honeypot.code === "REJECTED", "honeypot is rejected");

  const fast = handler.validateEnquiry(Object.assign({}, valid, { startedAt: now }), now);
  assert(fast.code === "REJECTED", "instant submit is rejected");

  const htmlAllowed = handler.validateEnquiry(Object.assign({}, valid, { startedAt: "" }), now, { requireTiming: false });
  assert(htmlAllowed.ok === true, "non-JS form may omit the timer");

  delete process.env.RESEND_API_KEY;
  delete process.env.EMAIL_FROM;
  const missing = handler.getMailConfig(process.env);
  assert(missing.ok === false, "email stays unconfigured without Resend credentials");

  const getRes = await invoke("GET", {});
  assert(getRes.statusCode === 405, "GET is rejected");

  const postRes = await invoke("POST", valid);
  assert(
    postRes.statusCode === 503 && postRes.payload && postRes.payload.ok === false && postRes.payload.code === "EMAIL_NOT_CONFIGURED",
    "valid enquiry does not report success when email is not configured"
  );

  if (process.exitCode) process.exit(process.exitCode);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
