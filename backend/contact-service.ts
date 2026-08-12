const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalize(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
  website: string;
};

export function parseContactPayload(payload: Record<string, unknown>): ContactPayload {
  return {
    name: normalize(payload.name),
    email: normalize(payload.email).toLowerCase(),
    subject: normalize(payload.subject),
    message: normalize(payload.message),
    website: normalize(payload.website)
  };
}

export function validateContact(payload: ContactPayload) {
  const errors: string[] = [];
  if (payload.name.length < 2 || payload.name.length > 80) errors.push("Name must be between 2 and 80 characters.");
  if (!emailPattern.test(payload.email) || payload.email.length > 160) errors.push("Enter a valid email address.");
  if (payload.subject.length < 3 || payload.subject.length > 140) errors.push("Subject must be between 3 and 140 characters.");
  if (payload.message.length < 20 || payload.message.length > 3000) errors.push("Message must be between 20 and 3000 characters.");
  return errors;
}

export function contactConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL && process.env.CONTACT_FROM_EMAIL);
}

export async function deliverContact(payload: ContactPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) throw new Error("CONTACT_NOT_CONFIGURED");

  const safeName = escapeHtml(payload.name);
  const safeEmail = escapeHtml(payload.email);
  const safeSubject = escapeHtml(payload.subject);
  const safeMessage = escapeHtml(payload.message).replaceAll("\n", "<br />");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: payload.email,
      subject: `[Portfolio] ${payload.subject}`,
      text: `Name: ${payload.name}\nEmail: ${payload.email}\nSubject: ${payload.subject}\n\n${payload.message}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#151820">
          <h2 style="margin-bottom:20px">New portfolio message</h2>
          <table style="border-collapse:collapse;width:100%;margin-bottom:24px">
            <tr><td style="padding:8px 0;color:#687080">Name</td><td style="padding:8px 0"><strong>${safeName}</strong></td></tr>
            <tr><td style="padding:8px 0;color:#687080">Email</td><td style="padding:8px 0">${safeEmail}</td></tr>
            <tr><td style="padding:8px 0;color:#687080">Subject</td><td style="padding:8px 0">${safeSubject}</td></tr>
          </table>
          <div style="padding:20px;border-radius:12px;background:#f3f4f7;line-height:1.7">${safeMessage}</div>
        </div>`
    })
  });

  if (!response.ok) {
    const result = await response.text().catch(() => "");
    throw new Error(`RESEND_${response.status}:${result.slice(0, 200)}`);
  }
}
