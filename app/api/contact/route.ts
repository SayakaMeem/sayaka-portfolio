import { deliverContact, parseContactPayload, validateContact } from "@/backend/contact-service";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limit = rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000);
  if (!limit.allowed) {
    return Response.json(
      { error: "Too many messages were submitted. Please try again in a few minutes." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((limit.resetAt - Date.now()) / 1000)) } }
    );
  }

  let raw: Record<string, unknown>;
  try {
    raw = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const payload = parseContactPayload(raw);
  if (payload.website) return Response.json({ message: "Message received." });

  const errors = validateContact(payload);
  if (errors.length) return Response.json({ error: errors[0], details: errors }, { status: 422 });

  try {
    await deliverContact(payload);
    return Response.json({ message: "Thanks — your message has been sent successfully." });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "CONTACT_NOT_CONFIGURED") {
      return Response.json(
        { error: "The contact service is not configured yet. Please use the GitHub profile link for now." },
        { status: 503 }
      );
    }
    console.error("Contact delivery failed:", error);
    return Response.json({ error: "The message could not be delivered. Please try again later." }, { status: 502 });
  }
}
