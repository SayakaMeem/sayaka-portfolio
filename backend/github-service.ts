import { repositories as auditedRepositories } from "@/data/repositories";

const GITHUB_USER = "SayakaMeem";

type GithubApiRepository = {
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  fork: boolean;
  archived: boolean;
};

export function getAuditedGithubFallback() {
  return auditedRepositories.map((repo) => ({
    name: repo.name,
    url: repo.url,
    description: repo.description,
    language: repo.language,
    stars: 0,
    forks: 0,
    updatedAt: repo.updatedAt,
    forked: Boolean(repo.forked),
    archived: false
  }));
}

export async function getGithubRepositories() {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "sayaka-portfolio"
  };

  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const response = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`, {
    headers,
    next: { revalidate: 3600 }
  });

  if (!response.ok) throw new Error(`GitHub API responded with ${response.status}`);
  const data = (await response.json()) as GithubApiRepository[];

  return data.map((repo) => ({
    name: repo.name,
    url: repo.html_url,
    description: repo.description,
    language: repo.language,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    updatedAt: repo.updated_at,
    forked: repo.fork,
    archived: repo.archived
  }));
}
