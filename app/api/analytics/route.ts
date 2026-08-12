import { getAnalytics } from "@/backend/analytics-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(request: Request) {
  const url = new URL(request.url);
  const segment = url.searchParams.get("segment");
  const region = url.searchParams.get("region");

  return Response.json(getAnalytics({ segment, region }), {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300"
    }
  });
}
