"use client";

import Image from "next/image";
import AnalyticsLab from "@/components/analytics-lab";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart,
  Briefcase,
  Check,
  ChartLine,
  Code,
  Database,
  ExternalLink,
  Filter,
  Github,
  Globe,
  Layers,
  Menu,
  Moon,
  Search,
  Send,
  Smartphone,
  Sparkles,
  Sun,
  TableIcon,
  Terminal,
  X
} from "@/components/icons";
import {
  featuredRepositories,
  repositories,
  repositoryStats,
  type Repository,
  type RepositoryTrack
} from "@/data/repositories";

type Focus = "Combined" | RepositoryTrack;
type GithubRepository = { name: string; stars: number; forks: number; updatedAt: string };
type ContactState = { status: "idle" | "submitting" | "success" | "error"; message: string };

const categories = ["All", "AI & Data", "Data & SQL", "Web", "Mobile", "Systems", "Learning"] as const;

const focusCopy: Record<Focus, { kicker: string; title: string; lead: string; action: string }> = {
  Combined: {
    kicker: "Software Developer + Data Analyst",
    title: "I build software and turn data into decisions.",
    lead:
      "I work across full-stack development, databases, mobile applications, and data-oriented systems — with a SQL-first approach to analysis and Python used when automation or data tooling adds value.",
    action: "Explore selected work"
  },
  Software: {
    kicker: "Software Developer",
    title: "I build practical products from interface to backend.",
    lead:
      "My software work spans React and Next.js interfaces, APIs, Laravel applications, native mobile development, systems coursework, and production-minded deployment.",
    action: "See software projects"
  },
  Data: {
    kicker: "Data Analyst",
    title: "I use SQL to move from raw data to a defensible decision.",
    lead:
      "My data focus is relational reasoning: ask the right business question, write the SQL, validate the result, explain the insight clearly, and connect it to a real-world action.",
    action: "See data evidence"
  }
};

const analystSteps = [
  { title: "Define the decision", text: "Start with the business question and the action the analysis must support." },
  { title: "Query the data", text: "Use joins, filters, aggregations, subqueries, CTEs, and views to answer the question directly." },
  { title: "Validate the result", text: "Check assumptions, totals, edge cases, duplicates, and whether the query actually measures the intended thing." },
  { title: "Extract the insight", text: "Translate rows and metrics into a short explanation of what changed, why it matters, and what is unusual." },
  { title: "Recommend an action", text: "Connect the evidence to a practical next step, trade-off, or operational decision." }
];

const skillGroups = [
  {
    title: "SQL & Data Analysis",
    icon: Database,
    description: "SQL-first analytical problem solving with relational data and decision-oriented interpretation.",
    items: ["SQL", "PL/SQL", "Joins", "GROUP BY / HAVING", "Subqueries", "CTEs", "Views", "Aggregations"]
  },
  {
    title: "Data Tooling",
    icon: BarChart,
    description: "Data handling and visual analysis where lightweight automation or application tooling is useful.",
    items: ["DuckDB", "Pandas", "MySQL", "Data modeling", "Data validation", "Recharts", "Chart.js", "Python automation"]
  },
  {
    title: "Web & Backend",
    icon: Layers,
    description: "Full-stack application work across modern JavaScript and Python/PHP backends.",
    items: ["Next.js", "React", "Express", "FastAPI", "Flask", "Laravel", "REST APIs", "Vercel"]
  },
  {
    title: "Software Foundations",
    icon: Code,
    description: "Programming and platform experience beyond analytics-oriented work.",
    items: ["JavaScript", "TypeScript", "C", "Java", "Swift", "SwiftUI", "Android", "Git"]
  }
];

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(new Date(date));
}

function TrackBadge({ track }: { track: RepositoryTrack }) {
  return <span className={`track-badge track-${track.toLowerCase()}`}>{track}</span>;
}

function ProjectIcon({ repository }: { repository: Repository }) {
  if (repository.category === "Data & SQL") return <Database />;
  if (repository.category === "AI & Data") return <ChartLine />;
  if (repository.category === "Mobile") return <Smartphone />;
  if (repository.category === "Systems") return <Terminal />;
  return <Layers />;
}

export default function Portfolio() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [menuOpen, setMenuOpen] = useState(false);
  const [focus, setFocus] = useState<Focus>("Combined");
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [query, setQuery] = useState("");
  const [liveRepos, setLiveRepos] = useState<Record<string, GithubRepository>>({});
  const [syncState, setSyncState] = useState<"loading" | "live" | "fallback">("loading");
  const [analysisStep, setAnalysisStep] = useState(0);
  const [contact, setContact] = useState<ContactState>({ status: "idle", message: "" });

  useEffect(() => {
    const saved = localStorage.getItem("sayaka-theme");
    const preferred = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    const initial = saved === "light" || saved === "dark" ? saved : preferred;
    setTheme(initial);
    document.documentElement.dataset.theme = initial;
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("sayaka-theme", theme);
  }, [theme]);

  useEffect(() => {
    let active = true;
    fetch("/api/github")
      .then(async (response) => {
        if (!response.ok) throw new Error("GitHub sync unavailable");
        return response.json() as Promise<{ repositories: GithubRepository[]; source: string }>;
      })
      .then((data) => {
        if (!active) return;
        setLiveRepos(Object.fromEntries(data.repositories.map((repo) => [repo.name, repo])));
        setSyncState(data.source === "github" ? "live" : "fallback");
      })
      .catch(() => active && setSyncState("fallback"));
    return () => { active = false; };
  }, []);

  const visibleFeatured = useMemo(() => {
    if (focus === "Combined") return featuredRepositories;
    return featuredRepositories.filter((repo) => repo.tracks.includes(focus));
  }, [focus]);

  const filteredRepositories = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return repositories.filter((repo) => {
      const categoryMatch = category === "All" || repo.category === category;
      const focusMatch = focus === "Combined" || repo.tracks.includes(focus);
      const haystack = [repo.title, repo.name, repo.description, repo.language, repo.category, ...repo.technologies]
        .join(" ")
        .toLowerCase();
      return categoryMatch && focusMatch && (!normalized || haystack.includes(normalized));
    });
  }, [category, focus, query]);

  const closeMenu = () => setMenuOpen(false);

  async function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setContact({ status: "submitting", message: "Sending your message…" });
    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json() as { message?: string; error?: string };
      if (!response.ok) throw new Error(data.error || "The message could not be sent.");
      form.reset();
      setContact({ status: "success", message: data.message || "Message sent successfully." });
    } catch (error) {
      setContact({
        status: "error",
        message: error instanceof Error ? error.message : "The message could not be sent."
      });
    }
  }

  const copy = focusCopy[focus];

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>

      <header className="site-header">
        <a className="brand" href="#home" onClick={closeMenu} aria-label="Sayaka Alam home">
          <span className="brand-mark">SA</span>
          <span className="brand-copy"><strong>Sayaka Alam</strong><small>Software Developer · Data Analyst</small></span>
        </a>

        <nav className={menuOpen ? "nav-links open" : "nav-links"} aria-label="Primary navigation">
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#work" onClick={closeMenu}>Work</a>
          <a href="#data" onClick={closeMenu}>Data & SQL</a>
          <a href="#skills" onClick={closeMenu}>Skills</a>
          <a href="#repositories" onClick={closeMenu}>Repositories</a>
          <a href="#contact" onClick={closeMenu}>Contact</a>
        </nav>

        <div className="header-actions">
          <button className="icon-button" onClick={() => setTheme((value) => value === "dark" ? "light" : "dark")} aria-label="Toggle theme">
            {theme === "dark" ? <Sun /> : <Moon />}
          </button>
          <a className="button button-primary button-small desktop-cta" href="#contact">Let&apos;s connect <ArrowUpRight /></a>
          <button className="icon-button menu-button" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle navigation" aria-expanded={menuOpen}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <main id="main">
        <section className="hero section" id="home">
          <div className="hero-noise" />
          <div className="hero-copy">
            <div className="availability"><span /> Open to software development and data analyst opportunities</div>
            <div className="focus-switch" aria-label="Portfolio focus">
              {(["Combined", "Software", "Data"] as Focus[]).map((item) => (
                <button key={item} className={focus === item ? "active" : ""} onClick={() => setFocus(item)}>
                  {item === "Combined" ? "Combined profile" : `${item} lens`}
                </button>
              ))}
            </div>
            <p className="hero-kicker">{copy.kicker}</p>
            <h1>{copy.title}</h1>
            <p className="hero-lead">{copy.lead}</p>
            <div className="hero-actions">
              <a className="button button-primary" href={focus === "Data" ? "#data" : "#work"}>{copy.action} <ArrowRight /></a>
              <a className="button button-secondary" href="https://github.com/SayakaMeem" target="_blank" rel="noreferrer"><Github /> GitHub</a>
            </div>
            <div className="metric-row" aria-label="Portfolio summary">
              <div><strong>{repositoryStats.total}</strong><span>public repositories</span></div>
              <div><strong>{featuredRepositories.length}</strong><span>selected projects</span></div>
              <div><strong>2</strong><span>target role tracks</span></div>
            </div>
          </div>

          <div className="portrait-card">
            <div className="portrait-topline"><span>Portfolio profile</span><span>2026</span></div>
            <div className="portrait-frame">
              <Image
                src="/sayaka-alam.jpg"
                alt="Sayaka Alam"
                fill
                priority
                sizes="(max-width: 900px) 90vw, 42vw"
              />
            </div>
            <div className="portrait-caption">
              <div><strong>Sayaka Alam</strong><span>Software Developer · Data Analyst</span></div>
              <div className="portrait-status"><span /> Available</div>
            </div>
          </div>
        </section>

        <section className="section section-border" id="about">
          <div className="section-heading split-heading">
            <div>
              <span className="section-index">01 / About</span>
              <h2>One profile, two complementary ways of solving problems.</h2>
            </div>
            <p>
              The software side focuses on building reliable applications. The data side focuses on querying structured data, extracting useful evidence, and connecting that evidence to decisions.
            </p>
          </div>

          <div className="role-grid">
            <article className="role-card">
              <div className="role-icon"><Briefcase /></div>
              <span className="role-label">Software Developer</span>
              <h3>Build the product.</h3>
              <p>Translate requirements into working interfaces, APIs, data flows, and deployable applications.</p>
              <ul>
                <li><Check /> React / Next.js application development</li>
                <li><Check /> Express, FastAPI, Flask, and Laravel backends</li>
                <li><Check /> REST integration and end-to-end workflows</li>
                <li><Check /> Web, mobile, systems, and database foundations</li>
              </ul>
            </article>

            <article className="role-card data-role-card">
              <div className="role-icon"><BarChart /></div>
              <span className="role-label">Data Analyst</span>
              <h3>Explain the data.</h3>
              <p>Use SQL as the primary reasoning tool, then communicate the finding in a way that supports a real decision.</p>
              <ul>
                <li><Check /> Strong relational SQL and query reasoning</li>
                <li><Check /> Aggregation, joins, subqueries, CTEs, and views</li>
                <li><Check /> Insight extraction and result validation</li>
                <li><Check /> Python used selectively for automation / data tooling</li>
              </ul>
            </article>
          </div>
        </section>

        <section className="section section-border" id="work">
          <div className="section-heading">
            <span className="section-index">02 / Selected work</span>
            <h2>Curated projects with the strongest technical story.</h2>
            <p>Selected Work is intentionally different from the repository explorer: these projects get context, evidence, and role relevance instead of only a compact repository summary.</p>
          </div>

          <div className="work-toolbar">
            <span>Showing {focus === "Combined" ? "both tracks" : `${focus.toLowerCase()}-relevant work`}</span>
            <div className="mini-focus">
              {(["Combined", "Software", "Data"] as Focus[]).map((item) => (
                <button key={item} className={focus === item ? "active" : ""} onClick={() => setFocus(item)}>{item}</button>
              ))}
            </div>
          </div>

          <div className="featured-grid">
            {visibleFeatured.map((repo, index) => (
              <article className={`featured-card ${index === 0 ? "featured-large" : ""}`} key={repo.name}>
                <div className="featured-visual">
                  <div className="visual-orbit orbit-one" />
                  <div className="visual-orbit orbit-two" />
                  <div className="project-symbol"><ProjectIcon repository={repo} /></div>
                  <div className="visual-tech">{repo.language}</div>
                </div>
                <div className="featured-body">
                  <div className="project-meta">
                    <span>{formatDate(repo.updatedAt)}</span>
                    <span>·</span>
                    <span>{repo.category}</span>
                    {repo.forked && <span className="ownership-label">Collaborative / forked</span>}
                  </div>
                  <div className="track-row">{repo.tracks.map((track) => <TrackBadge key={track} track={track} />)}</div>
                  <h3>{repo.title}</h3>
                  <p>{repo.description}</p>
                  {repo.highlights && (
                    <ul className="project-highlights">
                      {repo.highlights.slice(0, 3).map((highlight) => <li key={highlight}><Check />{highlight}</li>)}
                    </ul>
                  )}
                  <div className="tag-row">{repo.technologies.slice(0, 7).map((tech) => <span key={tech}>{tech}</span>)}</div>
                  <div className="project-links">
                    <a href={repo.url} target="_blank" rel="noreferrer"><Github /> Repository <ArrowUpRight /></a>
                    {repo.demoUrl && <a href={repo.demoUrl} target="_blank" rel="noreferrer"><Globe /> Live demo <ArrowUpRight /></a>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section data-section section-border" id="data">
          <div className="section-heading split-heading">
            <div>
              <span className="section-index">03 / Data & SQL</span>
              <h2>SQL-first analysis, then insight, then action.</h2>
            </div>
            <p>
              For analyst roles, the emphasis is not on writing large applications. It is on solving the business question with data, validating the result, and explaining what decision the result supports.
            </p>
          </div>

          <div className="analysis-layout">
            <div className="sql-evidence-card">
              <div className="card-eyebrow"><TableIcon /> SQL evidence</div>
              <h3>CRMS Database & SQL Project</h3>
              <p>
                The repository contains a relational schema and query examples across customer, interaction, product, order, and order-detail data.
              </p>
              <div className="sql-capability-grid">
                {["Filtering & sorting", "Aggregations", "GROUP BY / HAVING", "Subqueries", "Joins", "CTEs", "Views", "PL/SQL"].map((item) => (
                  <div key={item}><Check />{item}</div>
                ))}
              </div>
              <div className="sql-snippet" aria-label="Representative SQL pattern">
                <div className="code-top"><span>analysis.sql</span><span>SQL</span></div>
                <pre><code>{`SELECT CustomerID, SUM(TotalAmount) AS TotalSpent\nFROM Orders\nGROUP BY CustomerID\nHAVING SUM(TotalAmount) > 1000;`}</code></pre>
              </div>
              <div className="project-links sql-links">
                <a href="https://github.com/SayakaMeem/Database-CRMS-" target="_blank" rel="noreferrer"><Github /> SQL repository <ArrowUpRight /></a>
                <a href="/sql/business_analysis.sql" target="_blank" rel="noreferrer"><TableIcon /> Portfolio SQL demo <ArrowUpRight /></a>
              </div>
            </div>

            <div className="decision-card">
              <div className="card-eyebrow"><ChartLine /> Analysis mindset</div>
              <h3>How I approach a real-life data question</h3>
              <div className="step-tabs" role="tablist" aria-label="Analysis workflow">
                {analystSteps.map((step, index) => (
                  <button
                    key={step.title}
                    className={analysisStep === index ? "active" : ""}
                    onClick={() => setAnalysisStep(index)}
                    role="tab"
                    aria-selected={analysisStep === index}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>{step.title}
                  </button>
                ))}
              </div>
              <div className="step-detail">
                <span>Step {analysisStep + 1}</span>
                <h4>{analystSteps[analysisStep].title}</h4>
                <p>{analystSteps[analysisStep].text}</p>
              </div>
            </div>
          </div>

          <AnalyticsLab />

          <div className="decision-scenario">
            <div className="scenario-heading">
              <span>Illustrative business scenario</span>
              <h3>Which customers should receive retention attention first?</h3>
              <p>This example uses the CRMS-style customer, order, and interaction relationships to show the reasoning process without inventing a measured business result.</p>
            </div>
            <div className="scenario-flow">
              <article>
                <span>01 · Question</span>
                <h4>Find meaningful customer groups</h4>
                <p>Combine order value and recent interaction activity so prioritization is based on behavior, not a single isolated metric.</p>
              </article>
              <div className="scenario-arrow"><ArrowRight /></div>
              <article>
                <span>02 · Analysis</span>
                <h4>Build the SQL evidence</h4>
                <p>Join customer, order, and interaction data; aggregate at customer level; validate duplicates and date windows; then compare segments.</p>
              </article>
              <div className="scenario-arrow"><ArrowRight /></div>
              <article>
                <span>03 · Decision</span>
                <h4>Prioritize the next action</h4>
                <p>Surface high-value customers whose engagement is weakening for targeted follow-up, then monitor whether the intervention changes behavior.</p>
              </article>
            </div>
          </div>

          <div className="data-proof-grid">
            <article>
              <div className="proof-icon"><Database /></div>
              <h3>Relational reasoning</h3>
              <p>Think in entities, relationships, filters, groups, and measures rather than treating SQL as syntax only.</p>
            </article>
            <article>
              <div className="proof-icon"><ChartLine /></div>
              <h3>Insight extraction</h3>
              <p>Move beyond the output table and state the pattern, exception, comparison, or business meaning clearly.</p>
            </article>
            <article>
              <div className="proof-icon"><Sparkles /></div>
              <h3>Decision framing</h3>
              <p>Connect the result to the next decision: investigate, prioritize, compare, change, or monitor.</p>
            </article>
            <article>
              <div className="proof-icon"><Code /></div>
              <h3>Python as support</h3>
              <p>Use Python selectively for automation or data tooling when it improves efficiency; SQL remains central for structured analysis.</p>
            </article>
          </div>
        </section>

        <section className="section section-border" id="skills">
          <div className="section-heading">
            <span className="section-index">04 / Skills</span>
            <h2>A balanced technical profile without pretending every tool is equally important.</h2>
            <p>For data analyst applications, SQL and analytical reasoning are foregrounded. For software roles, the application-development stack becomes the focus.</p>
          </div>
          <div className="skills-grid">
            {skillGroups.map(({ title, description, items, icon: Icon }) => (
              <article className="skill-card" key={title}>
                <div className="skill-icon"><Icon /></div>
                <h3>{title}</h3>
                <p>{description}</p>
                <div className="tag-row">{items.map((item) => <span key={item}>{item}</span>)}</div>
              </article>
            ))}
          </div>
        </section>

        <section className="section section-border" id="repositories">
          <div className="section-heading split-heading repository-heading">
            <div>
              <span className="section-index">05 / Repository explorer</span>
              <h2>The full public GitHub archive.</h2>
            </div>
            <p>Search and filter all audited public repositories. This is the comprehensive archive; Selected Work above is the curated recruiter-facing view.</p>
          </div>

          <div className="repository-controls">
            <label className="search-box">
              <Search />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects, SQL, frameworks, languages…" aria-label="Search repositories" />
            </label>
            <div className="filter-row" aria-label="Repository category filter">
              <span className="filter-label"><Filter /> Filter</span>
              {categories.map((item) => (
                <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>
              ))}
            </div>
          </div>

          <div className="repository-summary">
            <span>Showing <strong>{filteredRepositories.length}</strong> of {repositoryStats.total} repositories</span>
            <span className={`sync-state sync-${syncState}`}><i /> {syncState === "loading" ? "Checking GitHub metadata" : syncState === "live" ? "Live GitHub metadata" : "Audited fallback metadata"}</span>
          </div>

          <div className="repository-grid">
            {filteredRepositories.map((repo) => {
              const live = liveRepos[repo.name];
              return (
                <article className="repository-card" key={repo.name}>
                  <div className="repository-card-top">
                    <div className="repo-symbol"><ProjectIcon repository={repo} /></div>
                    <div className="track-row">{repo.tracks.map((track) => <TrackBadge key={track} track={track} />)}</div>
                  </div>
                  <div className="repo-title-line">
                    <h3>{repo.title}</h3>
                    <a href={repo.url} target="_blank" rel="noreferrer" aria-label={`Open ${repo.title} on GitHub`}><ExternalLink /></a>
                  </div>
                  <p>{repo.description}</p>
                  {repo.forked && <span className="ownership-label">Collaborative / forked</span>}
                  {repo.status === "empty" && <span className="empty-label">Empty archive</span>}
                  <div className="tag-row compact-tags">{repo.technologies.slice(0, 5).map((tech) => <span key={tech}>{tech}</span>)}</div>
                  <div className="repo-footer">
                    <span>{repo.language}</span>
                    <span>{formatDate(live?.updatedAt || repo.updatedAt)}</span>
                    {live && <span>★ {live.stars} · Forks {live.forks}</span>}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="section contact-section section-border" id="contact">
          <div className="contact-copy">
            <span className="section-index">06 / Contact</span>
            <h2>Looking for a developer, a data analyst, or someone comfortable between both?</h2>
            <p>
              I&apos;m interested in roles where clear problem solving matters — whether the output is a working application, a reliable SQL query, or an insight that helps a team make a better decision.
            </p>
            <div className="contact-links">
              <a href="https://github.com/SayakaMeem" target="_blank" rel="noreferrer"><Github /> github.com/SayakaMeem <ArrowUpRight /></a>
            </div>
          </div>

          <form className="contact-form" onSubmit={submitContact}>
            <div className="form-row">
              <label>Name<input name="name" required minLength={2} maxLength={80} placeholder="Your name" /></label>
              <label>Email<input name="email" type="email" required maxLength={160} placeholder="you@example.com" /></label>
            </div>
            <label>Subject<input name="subject" required minLength={3} maxLength={140} placeholder="Role, project, or collaboration" /></label>
            <label>Message<textarea name="message" required minLength={20} maxLength={3000} rows={6} placeholder="Share a little context…" /></label>
            <label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
            <button className="button button-primary submit-button" type="submit" disabled={contact.status === "submitting"}>
              <Send /> {contact.status === "submitting" ? "Sending…" : "Send message"}
            </button>
            {contact.message && <p className={`form-message ${contact.status}`}>{contact.message}</p>}
            <small>The contact route is server-side. Configure Resend environment variables on Vercel to enable email delivery.</small>
          </form>
        </section>
      </main>

      <footer className="site-footer">
        <div><span className="brand-mark small">SA</span><span><strong>Sayaka Alam</strong><small>Software Developer · Data Analyst</small></span></div>
        <p>© 2026 Sayaka Alam. Built with Next.js and deployed as one full-stack Vercel application.</p>
        <a href="#home">Back to top <ArrowUpRight /></a>
      </footer>
    </>
  );
}
