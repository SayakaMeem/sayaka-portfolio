import { getAuditedGithubFallback, getGithubRepositories } from "@/backend/github-service";

export const runtime = "nodejs";

export async function GET() {
  try {
    const repositories = await getGithubRepositories();
    return Response.json(
      { source: "github", repositories, syncedAt: new Date().toISOString() },
      { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } }
    );
  } catch (error) {
    console.error("GitHub sync failed:", error);
    return Response.json(
      { source: "fallback", repositories: getAuditedGithubFallback(), syncedAt: new Date().toISOString() },
      { headers: { "Cache-Control": "public, s-maxage=300" } }
    );
  }
}
