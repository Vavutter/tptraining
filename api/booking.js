const REQUIRED_FIELDS = [
  "sport_focus",
  "experience",
  "goal",
  "weekly_sessions",
  "selected_plan",
  "name",
  "email",
  "preferred_channel"
];

const PLAN_NAMES = {
  einsteiger: "Einsteiger",
  fortgeschritten: "Fortgeschritten",
  "pro-athlete": "Pro Athlete",
  "adventure-camp-anfrage": "Adventure Camp Anfrage",
  "schule-projekt-anfrage": "Schule / Projekt Anfrage"
};

const CHANNEL_NAMES = {
  email: "E-Mail",
  telefon: "Telefon",
  whatsapp: "WhatsApp"
};

const SPORT_NAMES = {
  triathlon: "Triathlon",
  mtb: "Mountainbike",
  laufen: "Laufen",
  schwimmen: "Schwimmen",
  adventure: "Adventure Camp",
  schule: "Schule / Projekt"
};

const EXPERIENCE_NAMES = {
  anfaenger: "Anfänger:in",
  fortgeschritten: "Fortgeschritten",
  ambitioniert: "Ambitioniert"
};

const GOAL_NAMES = {
  technik: "Technik verbessern",
  leistung: "Leistung steigern",
  wettkampf: "Wettkampf vorbereiten",
  spaß: "Spaß & Fitness"
};

function normalize(value, max = 400) {
  if (typeof value !== "string") return "";
  return value.trim().replace(/\s+/g, " ").slice(0, max);
}

function normalizeMessage(value, max = 2400) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch (error) {
      return {};
    }
  }
  return req.body;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function formatDate(iso) {
  try {
    return new Date(iso).toISOString();
  } catch (error) {
    return new Date().toISOString();
  }
}

function buildSummaryRows(payload) {
  return [
    ["Sport", SPORT_NAMES[payload.sport_focus] || payload.sport_focus],
    ["Erfahrung", EXPERIENCE_NAMES[payload.experience] || payload.experience],
    ["Ziel", GOAL_NAMES[payload.goal] || payload.goal],
    ["Einheiten/Woche", payload.weekly_sessions],
    ["Plan", PLAN_NAMES[payload.selected_plan] || payload.selected_plan],
    ["Name", payload.name],
    ["E-Mail", payload.email],
    ["Telefon", payload.phone || "-"],
    ["Kanal", CHANNEL_NAMES[payload.preferred_channel] || payload.preferred_channel],
    ["Nachricht", payload.message || "-"]
  ];
}

function buildMessage(rows) {
  const lines = [
    "TPTraining - Schnellstart Check",
    "--------------------------------"
  ];

  rows.forEach(([label, value]) => {
    lines.push(`${label}: ${value}`);
  });

  return lines.join("\n");
}

function buildMailto({ businessEmail, subject, body }) {
  return `mailto:${businessEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

async function sendWebhook(webhookUrl, payload) {
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Webhook request failed with status ${response.status}`);
  }
}

async function sendResendEmail({ apiKey, from, to, replyTo, subject, message }) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      text: message,
      reply_to: replyTo
    })
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Resend request failed with status ${response.status}: ${details}`);
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const body = parseBody(req);
  const normalized = {
    sport_focus: normalize(body.sport_focus, 60),
    experience: normalize(body.experience, 60),
    goal: normalize(body.goal, 60),
    weekly_sessions: normalize(body.weekly_sessions, 24),
    selected_plan: normalize(body.selected_plan, 80),
    name: normalize(body.name, 120),
    email: normalize(body.email, 140),
    phone: normalize(body.phone, 60),
    preferred_channel: normalize(body.preferred_channel, 40),
    message: normalizeMessage(body.message, 2400),
    source_url: normalize(body.source_url || body.page || "", 300),
    submitted_at: normalize(body.submitted_at || "", 80)
  };

  for (const field of REQUIRED_FIELDS) {
    if (!normalized[field]) {
      return res.status(422).json({
        ok: false,
        error: `Fehlendes Feld: ${field}`
      });
    }
  }

  if (!isValidEmail(normalized.email)) {
    return res.status(422).json({
      ok: false,
      error: "E-Mail Format ist ungültig."
    });
  }

  const rows = buildSummaryRows(normalized);
  const summaryMessage =
    normalizeMessage(body.compiled_message, 4000) || buildMessage(rows);

  const metaRows = [
    ["Quelle", normalized.source_url || "Website"],
    ["Zeitpunkt", formatDate(normalized.submitted_at)]
  ];

  const finalMessage = `${summaryMessage}\n${metaRows
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n")}`;

  const planName = PLAN_NAMES[normalized.selected_plan] || "Schnellstart";
  const subject = `TPTraining Anfrage - ${planName}`;
  const businessEmail = process.env.BOOKING_BUSINESS_EMAIL || "tp.training@gmx.net";
  const mailto = buildMailto({
    businessEmail,
    subject,
    body: finalMessage
  });

  const webhookUrl = process.env.BOOKING_WEBHOOK_URL;
  const resendApiKey = process.env.RESEND_API_KEY;
  const resendToEmail = process.env.BOOKING_TO_EMAIL;
  const resendFromEmail =
    process.env.BOOKING_FROM_EMAIL || "TPTraining <onboarding@resend.dev>";

  const hasWebhookTarget = Boolean(webhookUrl);
  const hasResendTarget = Boolean(resendApiKey && resendToEmail);

  if (!hasWebhookTarget && !hasResendTarget) {
    return res.status(503).json({
      ok: false,
      error:
        "Server-Zustellung ist noch nicht konfiguriert. Bitte BOOKING_WEBHOOK_URL oder RESEND_API_KEY + BOOKING_TO_EMAIL setzen.",
      mailto
    });
  }

  const delivery = [];
  const errors = [];

  if (hasWebhookTarget) {
    try {
      await sendWebhook(webhookUrl, {
        source: "tptraining-booking-funnel",
        subject,
        submitted_at: formatDate(normalized.submitted_at),
        payload: normalized,
        summary: finalMessage
      });
      delivery.push("webhook");
    } catch (error) {
      errors.push(error.message);
    }
  }

  if (hasResendTarget) {
    try {
      await sendResendEmail({
        apiKey: resendApiKey,
        from: resendFromEmail,
        to: resendToEmail,
        replyTo: normalized.email,
        subject,
        message: finalMessage
      });
      delivery.push("email");
    } catch (error) {
      errors.push(error.message);
    }
  }

  if (delivery.length === 0) {
    return res.status(502).json({
      ok: false,
      error:
        "Anfrage konnte serverseitig nicht zugestellt werden. Bitte nutze den E-Mail-Fallback.",
      mailto,
      details: errors
    });
  }

  return res.status(200).json({
    ok: true,
    delivery,
    mailto,
    warnings: errors
  });
}
