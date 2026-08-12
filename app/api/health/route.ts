import { contactConfigured } from "@/backend/contact-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({
    ok: true,
    service: "sayaka-portfolio",
    architecture: "Next.js frontend + server-side API routes",
    analyticsDemo: true,
    timestamp: new Date().toISOString(),
    contactConfigured: contactConfigured()
  });
}
