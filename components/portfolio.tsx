"use client";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import AnalyticsLab from "@/components/analytics-lab";
import styles from "./portfolio-3d.module.css";
import {
  FormEvent,
  type PointerEvent as ReactPointerEvent,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart,
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
  X,
} from "@/components/icons";
import {
  featuredRepositories,
  repositories,
  repositoryStats,
  type Repository,
  type RepositoryTrack,
} from "@/data/repositories";

type Focus = "Combined" | "Software" | "Data" | "DevOps" | "Security";
type GithubRepository = {
  name: string;
  stars: number;
  forks: number;
  updatedAt: string;
};
type ContactState = {
  status: "idle" | "submitting" | "success" | "error";
  message: string;
};
type Theme = "light" | "dark";

const THEME_KEY = "sayaka-theme";
const THEME_EVENT = "sayaka-theme-change";

const categories = [
  "All",
  "AI & Data",
  "Data & SQL",
  "Web",
  "Mobile",
  "Systems",
  "Learning",
] as const;

const focusOptions: Focus[] = ["Combined", "Software", "Data", "DevOps", "Security"];

const focusCopy: Record<
  Focus,
  { kicker: string; title: string; lead: string; action: string; target: string }
> = {
  Combined: {
    kicker: "Software · Data · Delivery · Security",
    title: "Build. Analyze. Ship. Protect.",
    lead: "Full-stack systems · SQL reasoning · reliable delivery · security-minded engineering.",
    action: "Explore work",
    target: "#work",
  },
  Software: {
    kicker: "Software Engineering",
    title: "Products built cleanly.",
    lead: "React · Next.js · APIs · backend systems.",
    action: "View software",
    target: "#work",
  },
  Data: {
    kicker: "Data Lens",
    title: "Evidence shaped into decisions.",
    lead: "SQL · validation · insight · visualization.",
    action: "View data work",
    target: "#data",
  },
  DevOps: {
    kicker: "DevOps Lens",
    title: "Builds shipped with confidence.",
    lead: "Git · quality gates · environments · Vercel delivery.",
    action: "View delivery stack",
    target: "#about",
  },
  Security: {
    kicker: "Security Lens",
    title: "Safer systems by default.",
    lead: "Validation · rate limiting · safe fallbacks · secure configuration.",
    action: "View security mindset",
    target: "#about",
  },
};

const analystSteps = [
  {
    title: "Define the decision",
    text: "Start with the business question and the action the analysis must support.",
  },
  {
    title: "Query the data",
    text: "Use joins, filters, aggregations, subqueries, CTEs, and views to answer the question directly.",
  },
  {
    title: "Validate the result",
    text: "Check assumptions, totals, edge cases, duplicates, and whether the query actually measures the intended thing.",
  },
  {
    title: "Extract the insight",
    text: "Translate rows and metrics into a short explanation of what changed, why it matters, and what is unusual.",
  },
  {
    title: "Recommend an action",
    text: "Connect the evidence to a practical next step, trade-off, or operational decision.",
  },
];

const skillGroups = [
  {
    title: "SQL & Data Analysis",
    icon: Database,
    description:
      "SQL-first reasoning with relational data and decision-focused analysis.",
    items: [
      "SQL",
      "PL/SQL",
      "Joins",
      "GROUP BY / HAVING",
      "Subqueries",
      "CTEs",
      "Views",
      "Aggregations",
    ],
  },
  {
    title: "Data Tooling",
    icon: BarChart,
    description:
      "Data handling, visualization, validation, and lightweight automation.",
    items: [
      "DuckDB",
      "Pandas",
      "MySQL",
      "Data modeling",
      "Data validation",
      "Recharts",
      "Chart.js",
      "Python automation",
    ],
  },
  {
    title: "Web & Backend",
    icon: Layers,
    description:
      "Modern full-stack work across JavaScript, Python, and PHP backends.",
    items: [
      "Next.js",
      "React",
      "Express",
      "FastAPI",
      "Flask",
      "Laravel",
      "REST APIs",
      "Vercel",
    ],
  },
  {
    title: "Software Foundations",
    icon: Code,
    description:
      "Core programming, mobile, systems, and version-control foundations.",
    items: [
      "JavaScript",
      "TypeScript",
      "C",
      "Java",
      "Swift",
      "SwiftUI",
      "Android",
      "Git",
    ],
  },
];

const capabilityLenses = [
  {
    title: "Software",
    icon: Layers,
    label: "BUILD",
    description: "Interfaces, APIs, backend flows, and deployable product architecture.",
    items: ["Next.js", "React", "FastAPI", "REST"],
  },
  {
    title: "Data Lens",
    icon: ChartLine,
    label: "ANALYZE",
    description: "SQL-first reasoning, validation, visualization, and decision framing.",
    items: ["SQL", "CTEs", "Pandas", "Analytics"],
  },
  {
    title: "DevOps",
    icon: Terminal,
    label: "SHIP",
    description: "Git workflows, environment configuration, quality gates, and Vercel delivery.",
    items: ["Git", "Build checks", "Env config", "Vercel"],
  },
  {
    title: "Security",
    icon: Check,
    label: "PROTECT",
    description: "Security-minded application delivery with validation, limits, and safe fallbacks.",
    items: ["Validation", "Rate limits", "Fallbacks", "Headers"],
  },
];

const conciseProjectCopy: Record<string, string> = {
  "EthereumHeist-System":
    "AML investigation platform for tracing Ethereum flows with multi-hop analysis and risk scoring.",
  "EthereumHeist_System":
    "AML investigation platform for tracing Ethereum flows with multi-hop analysis and risk scoring.",
  "Drowsy-Driver-Detection-System":
    "Full-stack driver-alertness monitoring with ML integration and a responsive dashboard.",
  Compiler_Project85:
    "C-based compiler coursework covering lexical analysis, parsing logic, and source processing.",
  CoffeeApp:
    "Collaborative native Swift/Xcode application focused on mobile UI and app structure.",
  IOS_assignment:
    "SwiftUI Tic-Tac-Toe with turn state, winner detection, and clean interaction logic.",
  Web_treeverse:
    "Laravel web project with routing, migrations, Vite tooling, and test-ready structure.",
  Real:
    "Android/Java learning project exploring native app structure and core mobile patterns.",
  MyApplication85:
    "Android coursework built with Java and Gradle.",
  "Database-CRMS-":
    "Relational CRM database project with SQL queries, joins, CTEs, views, and PL/SQL.",
  "Test-repo":
    "Archived repository with no substantive project content.",
  "Software-Lab":
    "Java software-lab exercises covering core programming and application concepts.",
  WeatherApp:
    "Native Android weather app for fast, location-based weather lookup.",
  Portfolio:
    "ASP.NET Web Forms portfolio with public, login, and admin surfaces.",
  asdf:
    "Archived repository with no substantive project content.",
  Shape:
    "Archived repository with no substantive project content.",
  Demo01:
    "Git and repository-organization learning exercise.",
  Demo:
    "Introductory Git and Markdown practice repository.",
  "My-Activity":
    "Archived repository with no substantive project content.",
  "laravel-food-ordering-web-app":
    "Collaborative Laravel/MySQL ordering system with cart, history, admin, and CRUD workflows.",
};

function compactDescription(repository: Repository) {
  const curated = conciseProjectCopy[repository.name];
  if (curated) return curated;

  const description = repository.description.trim();
  const match = description.match(/^.*?[.!?](?:\s|$)/);
  const firstSentence = (match?.[0] || description).trim();

  return firstSentence.length > 138
    ? `${firstSentence.slice(0, 135).trimEnd()}…`
    : firstSentence;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function TrackBadge({ track }: { track: RepositoryTrack }) {
  return (
    <span className={`track-badge track-${track.toLowerCase()}`}>
      {track}
    </span>
  );
}

function ProjectIcon({ repository }: { repository: Repository }) {
  if (repository.category === "Data & SQL") return <Database />;
  if (repository.category === "AI & Data") return <ChartLine />;
  if (repository.category === "Mobile") return <Smartphone />;
  if (repository.category === "Systems") return <Terminal />;
  return <Layers />;
}


function handleTiltPointerMove(event: ReactPointerEvent<HTMLElement>) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const element = event.currentTarget;
  const rect = element.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;

  const rotateY = (x - 0.5) * 8;
  const rotateX = (0.5 - y) * 7;

  element.style.setProperty("--tilt-x", `${rotateX.toFixed(2)}deg`);
  element.style.setProperty("--tilt-y", `${rotateY.toFixed(2)}deg`);
  element.style.setProperty("--shine-x", `${(x * 100).toFixed(1)}%`);
  element.style.setProperty("--shine-y", `${(y * 100).toFixed(1)}%`);
}

function handleTiltPointerLeave(event: ReactPointerEvent<HTMLElement>) {
  const element = event.currentTarget;
  element.style.setProperty("--tilt-x", "0deg");
  element.style.setProperty("--tilt-y", "0deg");
  element.style.setProperty("--shine-x", "50%");
  element.style.setProperty("--shine-y", "50%");
}

function Hero3DScene() {
  const reduceMotion = useReducedMotion();
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const springX = useSpring(rotateX, {
    stiffness: 120,
    damping: 18,
    mass: 0.65,
  });
  const springY = useSpring(rotateY, {
    stiffness: 120,
    damping: 18,
    mass: 0.65,
  });

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (reduceMotion) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    rotateY.set(x * 12);
    rotateX.set(y * -10);
  }

  function resetScene() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.div
      className={styles.sceneShell}
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.12, ease: [0.22, 1, 0.36, 1] as const }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetScene}
      aria-label="Interactive 3D portfolio scene"
    >
      <motion.div
        className={styles.scene3d}
        style={reduceMotion ? undefined : { rotateX: springX, rotateY: springY }}
      >
        <div className={styles.sceneGlow} aria-hidden="true" />
        <div className={`${styles.orbitRing} ${styles.orbitRingOne}`} aria-hidden="true" />
        <div className={`${styles.orbitRing} ${styles.orbitRingTwo}`} aria-hidden="true" />
        <div className={`${styles.orbitRing} ${styles.orbitRingThree}`} aria-hidden="true" />
        <motion.div
          className={styles.coreOrb}
          aria-hidden="true"
          animate={
            reduceMotion
              ? undefined
              : { y: [0, -10, 0], rotate: [0, 6, 0], scale: [1, 1.025, 1] }
          }
          transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className={`${styles.floatingTile} ${styles.tileCode}`}
          whileHover={reduceMotion ? undefined : { y: -9, scale: 1.035, rotateZ: 0 }}
          animate={reduceMotion ? undefined : { y: [0, -14, 0], rotateZ: [-4, 2, -4] }}
          transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <span>BUILD</span>
          <strong>Software</strong>
          <small>Next.js · React · APIs</small>
        </motion.div>

        <motion.div
          className={`${styles.floatingTile} ${styles.tileData}`}
          whileHover={reduceMotion ? undefined : { y: -9, scale: 1.035, rotateZ: 0 }}
          animate={reduceMotion ? undefined : { y: [0, 12, 0], rotateZ: [3, -2, 3] }}
          transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span>ANALYZE</span>
          <strong>Data</strong>
          <small>SQL · Query · Insight</small>
        </motion.div>

        <motion.div
          className={`${styles.floatingTile} ${styles.tilePython}`}
          whileHover={reduceMotion ? undefined : { y: -9, scale: 1.035, rotateZ: 0 }}
          animate={reduceMotion ? undefined : { x: [0, 10, 0], y: [0, -6, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <span>AUTOMATE</span>
          <strong>Python</strong>
          <small>Automation · Data · ML</small>
        </motion.div>

        <div className={styles.portraitPanel}>
          <div className={styles.portraitTop}>
            <span>SA / 2026</span>
            <i />
            <span>AVAILABLE</span>
          </div>

          <div className={styles.portraitImage}>
            <Image
              src="/sayaka-alam.jpg"
              alt="Sayaka Alam"
              fill
              priority
              sizes="(max-width: 900px) 80vw, 34vw"
            />
          </div>

          <div className={styles.portraitMeta}>
            <div>
              <strong>Sayaka Alam</strong>
              <span>Software Engineer · Data Analyst</span>
            </div>
            <span className={styles.liveDot}>AVAILABLE</span>
          </div>
        </div>

        <motion.div
          className={`${styles.floatingTile} ${styles.tileSecurity}`}
          whileHover={reduceMotion ? undefined : { y: -9, scale: 1.035, rotateZ: 0 }}
          animate={reduceMotion ? undefined : { y: [0, 9, 0], rotateZ: [-2, 2, -2] }}
          transition={{ duration: 6.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <span>PROTECT</span>
          <strong>Security</strong>
          <small>Validate · Limit · Fallback</small>
        </motion.div>

        <div className={`${styles.depthDot} ${styles.dotOne}`} aria-hidden="true" />
        <div className={`${styles.depthDot} ${styles.dotTwo}`} aria-hidden="true" />
        <div className={`${styles.depthDot} ${styles.dotThree}`} aria-hidden="true" />
      </motion.div>
      <p className={styles.sceneHint}>Move your cursor — the scene responds in 3D.</p>
    </motion.div>
  );
}

function getThemeSnapshot(): Theme {
  if (typeof window === "undefined") return "dark";

  const saved = window.localStorage.getItem(THEME_KEY);

  if (saved === "light" || saved === "dark") {
    return saved;
  }

  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

function getServerThemeSnapshot(): Theme {
  return "dark";
}

function subscribeTheme(callback: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: light)");

  const handleStorage = (event: StorageEvent) => {
    if (!event.key || event.key === THEME_KEY) {
      callback();
    }
  };

  const handleThemeEvent = () => callback();
  const handleMediaChange = () => {
    if (!window.localStorage.getItem(THEME_KEY)) {
      callback();
    }
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(THEME_EVENT, handleThemeEvent);
  media.addEventListener("change", handleMediaChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(THEME_EVENT, handleThemeEvent);
    media.removeEventListener("change", handleMediaChange);
  };
}

function saveTheme(theme: Theme) {
  window.localStorage.setItem(THEME_KEY, theme);
  document.documentElement.dataset.theme = theme;
  window.dispatchEvent(new Event(THEME_EVENT));
}

export default function Portfolio() {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  const { scrollYProgress } = useScroll();
  const scrollProgress = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 28,
    restDelta: 0.001,
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const [focus, setFocus] = useState<Focus>("Combined");
  const [category, setCategory] =
    useState<(typeof categories)[number]>("All");
  const [query, setQuery] = useState("");
  const [liveRepos, setLiveRepos] = useState<
    Record<string, GithubRepository>
  >({});
  const [syncState, setSyncState] = useState<
    "loading" | "live" | "fallback"
  >("loading");
  const [analysisStep, setAnalysisStep] = useState(0);
  const [contact, setContact] = useState<ContactState>({
    status: "idle",
    message: "",
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    let active = true;

    fetch("/api/github")
      .then(async (response) => {
        if (!response.ok) throw new Error("GitHub sync unavailable");

        return response.json() as Promise<{
          repositories: GithubRepository[];
          source: string;
        }>;
      })
      .then((data) => {
        if (!active) return;

        setLiveRepos(
          Object.fromEntries(
            data.repositories.map((repo) => [repo.name, repo]),
          ),
        );
        setSyncState(data.source === "github" ? "live" : "fallback");
      })
      .catch(() => {
        if (active) setSyncState("fallback");
      });

    return () => {
      active = false;
    };
  }, []);

  const visibleFeatured = useMemo(() => {
    if (focus !== "Software" && focus !== "Data") {
      return featuredRepositories;
    }

    return featuredRepositories.filter((repo) =>
      repo.tracks.includes(focus as RepositoryTrack),
    );
  }, [focus]);

  const filteredRepositories = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return repositories.filter((repo) => {
      const categoryMatch =
        category === "All" || repo.category === category;

      const focusMatch =
        focus !== "Software" && focus !== "Data"
          ? true
          : repo.tracks.includes(focus as RepositoryTrack);

      const haystack = [
        repo.title,
        repo.name,
        repo.description,
        repo.language,
        repo.category,
        ...repo.technologies,
      ]
        .join(" ")
        .toLowerCase();

      return (
        categoryMatch &&
        focusMatch &&
        (!normalized || haystack.includes(normalized))
      );
    });
  }, [category, focus, query]);

  const closeMenu = () => setMenuOpen(false);

  async function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setContact({
      status: "submitting",
      message: "Sending your message…",
    });

    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as {
        message?: string;
        error?: string;
      };

      if (!response.ok) {
        throw new Error(
          data.error || "The message could not be sent.",
        );
      }

      form.reset();

      setContact({
        status: "success",
        message: data.message || "Message sent successfully.",
      });
    } catch (error) {
      setContact({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "The message could not be sent.",
      });
    }
  }

  const copy = focusCopy[focus];

  return (
    <div className={styles.immersiveRoot}>
      <div className={styles.ambientBackdrop} aria-hidden="true">
        <div className={styles.auroraOne} />
        <div className={styles.auroraTwo} />
        <div className={styles.perspectiveGrid} />
        <div className={styles.securityMesh} />
        <div className={styles.scanBeam} />
        <div className={styles.grain} />
      </div>

      <style>{`
        .modern-portfolio-progress {
          position: fixed;
          inset: 0 0 auto 0;
          height: 3px;
          z-index: 9999;
          transform-origin: 0 50%;
          background: linear-gradient(90deg, #7c5cff, #37c8ff);
          box-shadow: 0 0 20px rgba(124, 92, 255, 0.35);
          pointer-events: none;
        }

        .modern-hero {
          position: relative;
          isolation: isolate;
        }

        .modern-hero::after {
          content: "";
          position: absolute;
          width: min(42vw, 560px);
          aspect-ratio: 1;
          right: -12%;
          top: 2%;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(124,92,255,.18), rgba(55,200,255,.08) 42%, transparent 70%);
          filter: blur(12px);
          z-index: -1;
          pointer-events: none;
          animation: portfolioGlow 8s ease-in-out infinite alternate;
        }

        .featured-card,
        .role-card,
        .skill-card,
        .repository-card,
        .sql-evidence-card,
        .decision-card,
        .data-proof-grid article,
        .decision-scenario article,
        .analytics-panel,
        .kpi-grid article {
          transition: transform .28s cubic-bezier(.2,.8,.2,1),
                      box-shadow .28s ease,
                      border-color .28s ease;
          will-change: transform;
        }

        .featured-card:hover,
        .role-card:hover,
        .skill-card:hover,
        .repository-card:hover,
        .sql-evidence-card:hover,
        .decision-card:hover,
        .data-proof-grid article:hover,
        .decision-scenario article:hover,
        .analytics-panel:hover,
        .kpi-grid article:hover {
          transform: translateY(-7px);
          box-shadow: 0 22px 55px rgba(0,0,0,.14);
        }

        .featured-card:hover .project-symbol,
        .repository-card:hover .repo-symbol,
        .skill-card:hover .skill-icon,
        .role-card:hover .role-icon {
          transform: translateY(-3px) scale(1.07);
        }

        .project-symbol,
        .repo-symbol,
        .skill-icon,
        .role-icon {
          transition: transform .28s cubic-bezier(.2,.8,.2,1);
        }

        .button,
        .project-links a,
        .contact-links a,
        .nav-links a,
        .filter-row button,
        .mini-focus button,
        .focus-switch button {
          transition: transform .2s ease, opacity .2s ease, box-shadow .2s ease, background .2s ease;
        }

        .button:hover,
        .project-links a:hover,
        .contact-links a:hover {
          transform: translateY(-2px);
        }

        .nav-links a:hover {
          transform: translateY(-1px);
        }

        .portrait-card {
          animation: portfolioFloat 6s ease-in-out infinite;
        }

        .portrait-frame img {
          transition: transform .55s cubic-bezier(.2,.8,.2,1);
        }

        .portrait-card:hover .portrait-frame img {
          transform: scale(1.035);
        }

        .visual-orbit {
          animation: orbitPulse 4.5s ease-in-out infinite alternate;
        }

        .visual-orbit.orbit-two {
          animation-delay: -1.5s;
        }

        .tag-row span,
        .track-badge {
          transition: transform .18s ease, opacity .18s ease;
        }

        .tag-row span:hover,
        .track-badge:hover {
          transform: translateY(-2px);
        }

        @keyframes portfolioFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @keyframes portfolioGlow {
          from { transform: translate3d(-18px,-8px,0) scale(.96); opacity: .7; }
          to { transform: translate3d(24px,22px,0) scale(1.08); opacity: 1; }
        }

        @keyframes orbitPulse {
          from { opacity: .45; transform: scale(.98); }
          to { opacity: .9; transform: scale(1.04); }
        }

        @media (prefers-reduced-motion: reduce) {
          .portrait-card,
          .visual-orbit,
          .modern-hero::after {
            animation: none !important;
          }

          .featured-card,
          .role-card,
          .skill-card,
          .repository-card,
          .sql-evidence-card,
          .decision-card,
          .data-proof-grid article,
          .decision-scenario article,
          .analytics-panel,
          .kpi-grid article,
          .button,
          .project-links a,
          .contact-links a {
            transition: none !important;
          }
        }
      `}</style>

      <motion.div
        aria-hidden="true"
        className="modern-portfolio-progress"
        style={{ scaleX: scrollProgress }}
      />

      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className={`site-header ${styles.glassHeader}`}>
        <a
          className="brand"
          href="#home"
          onClick={closeMenu}
          aria-label="Sayaka Alam home"
        >
          <span className="brand-mark">SA</span>
          <span className="brand-copy">
            <strong>Sayaka Alam</strong>
            <small>Software Engineer · Data Analyst</small>
          </span>
        </a>

        <nav
          className={menuOpen ? "nav-links open" : "nav-links"}
          aria-label="Primary navigation"
        >
          <a href="#about" onClick={closeMenu}>
            About
          </a>
          <a href="#work" onClick={closeMenu}>
            Work
          </a>
          <a href="#data" onClick={closeMenu}>
            Data & SQL
          </a>
          <a href="#skills" onClick={closeMenu}>
            Skills
          </a>
          <a href="#repositories" onClick={closeMenu}>
            Repositories
          </a>
          <a href="#contact" onClick={closeMenu}>
            Contact
          </a>
        </nav>

        <div className="header-actions">
          <button
            className="icon-button"
            onClick={() =>
              saveTheme(theme === "dark" ? "light" : "dark")
            }
            aria-label={`Switch to ${
              theme === "dark" ? "light" : "dark"
            } theme`}
          >
            {theme === "dark" ? <Sun /> : <Moon />}
          </button>

          <a
            className="button button-primary button-small desktop-cta"
            href="#contact"
          >
            Let&apos;s connect <ArrowUpRight />
          </a>

          <button
            className="icon-button menu-button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <main id="main" className={styles.mainDepth}>
        <section className={`hero section modern-hero ${styles.heroStage}`} id="home">
          <div className="hero-noise" />

          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] as const }}
          >
            <div className="availability">
              <span /> Software · Data · Delivery · Security-minded engineering
            </div>

            <div className="focus-switch" aria-label="Portfolio focus">
              {focusOptions.map(
                (item) => (
                  <button
                    key={item}
                    className={focus === item ? "active" : ""}
                    onClick={() => setFocus(item)}
                  >
                    {item === "Combined"
                      ? "Overview"
                      : item === "Data"
                        ? "Data lens"
                        : `${item} lens`}
                  </button>
                ),
              )}
            </div>

            <p className="hero-kicker">{copy.kicker}</p>
            <h1>{copy.title}</h1>
            <p className="hero-lead">{copy.lead}</p>

            <div className="hero-actions">
              <a
                className="button button-primary"
                href={copy.target}
              >
                {copy.action} <ArrowRight />
              </a>

              <a
                className="button button-secondary"
                href="https://github.com/SayakaMeem"
                target="_blank"
                rel="noreferrer"
              >
                <Github /> GitHub
              </a>
            </div>

            <div className="metric-row" aria-label="Portfolio summary">
              <div>
                <strong>{repositoryStats.total}</strong>
                <span>public repositories</span>
              </div>

              <div>
                <strong>{featuredRepositories.length}</strong>
                <span>selected projects</span>
              </div>

              <div>
                <strong>4</strong>
                <span>engineering lenses</span>
              </div>
            </div>

            <div className={styles.engineeringRail} aria-label="Engineering capability lenses">
              {capabilityLenses.map(({ title, label }) => (
                <span key={title}>
                  <small>{label}</small>
                  <strong>{title}</strong>
                </span>
              ))}
            </div>
          </motion.div>

          <Hero3DScene />
        </section>

        <motion.section
          className="section section-border"
          id="about"
          initial={{ opacity: 1, x: -42, y: 18, scale: 0.992 }}
          whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] as const }}
        >
          <div className="section-heading split-heading">
            <div>
              <span className="section-index">01 / About</span>
              <h2>
                Four lenses. One engineering profile.
              </h2>
            </div>

            <p>
              Product engineering, data reasoning, reliable delivery, and security-minded implementation — presented as one connected workflow.
            </p>
          </div>

          <div className="role-grid">
            {capabilityLenses.map(({ title, icon: Icon, label, description, items }) => (
              <article
                className={`role-card ${title === "Data Lens" ? "data-role-card" : ""} ${styles.depthCard}`}
                key={title}
                onPointerMove={handleTiltPointerMove}
                onPointerLeave={handleTiltPointerLeave}
              >
                <div className="role-icon">
                  <Icon />
                </div>

                <span className="role-label">{label}</span>
                <h3>{title}</h3>
                <p>{description}</p>

                <ul>
                  {items.map((item) => (
                    <li key={item}>
                      <Check /> {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="section section-border"
          id="work"
          initial={{ opacity: 1, x: 42, y: 20, scale: 0.992 }}
          whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] as const }}
        >
          <div className="section-heading">
            <span className="section-index">02 / Selected work</span>
            <h2>
              Selected work. Strongest evidence first.
            </h2>

            <p>
              A focused set of projects with clear context, technologies, and outcomes.
            </p>
          </div>

          <div className="work-toolbar">
            <span>
              Showing{" "}
              {focus === "Software" || focus === "Data"
                ? `${focus.toLowerCase()}-relevant work`
                : "selected engineering work"}
            </span>

            <div className="mini-focus">
              {(["Combined", "Software", "Data"] as Focus[]).map(
                (item) => (
                  <button
                    key={item}
                    className={focus === item ? "active" : ""}
                    onClick={() => setFocus(item)}
                  >
                    {item}
                  </button>
                ),
              )}
            </div>
          </div>

          <div className="featured-grid">
            {visibleFeatured.map((repo, index) => (
              <article
                className={`featured-card ${styles.depthCard} ${
                  index === 0 ? "featured-large" : ""
                }`}
                key={repo.name}
                onPointerMove={handleTiltPointerMove}
                onPointerLeave={handleTiltPointerLeave}
              >
                <div className="featured-visual">
                  <div className="visual-orbit orbit-one" />
                  <div className="visual-orbit orbit-two" />
                  <div className="project-symbol">
                    <ProjectIcon repository={repo} />
                  </div>
                  <div className="visual-tech">{repo.language}</div>
                </div>

                <div className="featured-body">
                  <div className="project-meta">
                    <span>{formatDate(repo.updatedAt)}</span>
                    <span>·</span>
                    <span>{repo.category}</span>

                    {repo.forked && (
                      <span className="ownership-label">
                        Collaborative / forked
                      </span>
                    )}
                  </div>

                  <div className="track-row">
                    {repo.tracks.map((track) => (
                      <TrackBadge key={track} track={track} />
                    ))}
                  </div>

                  <h3>{repo.title}</h3>
                  <p>{compactDescription(repo)}</p>

                  {repo.highlights && (
                    <ul className="project-highlights">
                      {repo.highlights
                        .slice(0, 3)
                        .map((highlight) => (
                          <li key={highlight}>
                            <Check />
                            {highlight}
                          </li>
                        ))}
                    </ul>
                  )}

                  <div className="tag-row">
                    {repo.technologies.slice(0, 7).map((tech) => (
                      <span key={tech}>{tech}</span>
                    ))}
                  </div>

                  <div className="project-links">
                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <Github /> Repository <ArrowUpRight />
                    </a>

                    {repo.demoUrl && (
                      <a
                        href={repo.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Globe /> Live demo <ArrowUpRight />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="section data-section section-border"
          id="data"
          initial={{ opacity: 1, x: -42, y: 20, scale: 0.992 }}
          whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.08 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] as const }}
        >
          <div className="section-heading split-heading">
            <div>
              <span className="section-index">03 / Data & SQL</span>
              <h2>Query. Validate. Explain. Act.</h2>
            </div>

            <p>
              SQL answers the question; validation checks the result; communication turns it into a decision.
            </p>
          </div>

          <div className="analysis-layout">
            <div className={`sql-evidence-card ${styles.staticDepth}`}>
              <div className="card-eyebrow">
                <TableIcon /> SQL evidence
              </div>

              <h3>CRMS Database & SQL Project</h3>

              <p>
                The repository contains a relational schema and query
                examples across customer, interaction, product, order,
                and order-detail data.
              </p>

              <div className="sql-capability-grid">
                {[
                  "Filtering & sorting",
                  "Aggregations",
                  "GROUP BY / HAVING",
                  "Subqueries",
                  "Joins",
                  "CTEs",
                  "Views",
                  "PL/SQL",
                ].map((item) => (
                  <div key={item}>
                    <Check />
                    {item}
                  </div>
                ))}
              </div>

              <div
                className="sql-snippet"
                aria-label="Representative SQL pattern"
              >
                <div className="code-top">
                  <span>analysis.sql</span>
                  <span>SQL</span>
                </div>

                <pre>
                  <code>{`SELECT CustomerID, SUM(TotalAmount) AS TotalSpent\nFROM Orders\nGROUP BY CustomerID\nHAVING SUM(TotalAmount) > 1000;`}</code>
                </pre>
              </div>

              <div className="project-links sql-links">
                <a
                  href="https://github.com/SayakaMeem/Database-CRMS-"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Github /> SQL repository <ArrowUpRight />
                </a>

                <a
                  href="/sql/business_analysis.sql"
                  target="_blank"
                  rel="noreferrer"
                >
                  <TableIcon /> Portfolio SQL demo <ArrowUpRight />
                </a>
              </div>
            </div>

            <div className={`decision-card ${styles.staticDepth}`}>
              <div className="card-eyebrow">
                <ChartLine /> Analysis mindset
              </div>

              <h3>How I approach a real-life data question</h3>

              <div
                className="step-tabs"
                role="tablist"
                aria-label="Analysis workflow"
              >
                {analystSteps.map((step, index) => (
                  <button
                    key={step.title}
                    className={
                      analysisStep === index ? "active" : ""
                    }
                    onClick={() => setAnalysisStep(index)}
                    role="tab"
                    aria-selected={analysisStep === index}
                  >
                    <span>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {step.title}
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
              <h3>
                Which customers should receive retention attention
                first?
              </h3>

              <p>
                This example uses the CRMS-style customer, order, and
                interaction relationships to show the reasoning process
                without inventing a measured business result.
              </p>
            </div>

            <div className="scenario-flow">
              <article>
                <span>01 · Question</span>
                <h4>Find meaningful customer groups</h4>
                <p>
                  Combine order value and recent interaction activity so
                  prioritization is based on behavior, not a single
                  isolated metric.
                </p>
              </article>

              <div className="scenario-arrow">
                <ArrowRight />
              </div>

              <article>
                <span>02 · Analysis</span>
                <h4>Build the SQL evidence</h4>
                <p>
                  Join customer, order, and interaction data; aggregate
                  at customer level; validate duplicates and date
                  windows; then compare segments.
                </p>
              </article>

              <div className="scenario-arrow">
                <ArrowRight />
              </div>

              <article>
                <span>03 · Decision</span>
                <h4>Prioritize the next action</h4>
                <p>
                  Surface high-value customers whose engagement is
                  weakening for targeted follow-up, then monitor whether
                  the intervention changes behavior.
                </p>
              </article>
            </div>
          </div>

          <div className="data-proof-grid">
            <article>
              <div className="proof-icon">
                <Database />
              </div>
              <h3>Relational reasoning</h3>
              <p>
                Think in entities, relationships, filters, groups, and
                measures rather than treating SQL as syntax only.
              </p>
            </article>

            <article>
              <div className="proof-icon">
                <ChartLine />
              </div>
              <h3>Insight extraction</h3>
              <p>
                Move beyond the output table and state the pattern,
                exception, comparison, or business meaning clearly.
              </p>
            </article>

            <article>
              <div className="proof-icon">
                <Sparkles />
              </div>
              <h3>Decision framing</h3>
              <p>
                Connect the result to the next decision: investigate,
                prioritize, compare, change, or monitor.
              </p>
            </article>

            <article>
              <div className="proof-icon">
                <Code />
              </div>
              <h3>Python as support</h3>
              <p>
                Use Python selectively for automation or data tooling
                when it improves efficiency; SQL remains central for
                structured analysis.
              </p>
            </article>
          </div>
        </motion.section>

        <motion.section
          className="section section-border"
          id="skills"
          initial={{ opacity: 1, x: 42, y: 18, scale: 0.992 }}
          whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] as const }}
        >
          <div className="section-heading">
            <span className="section-index">04 / Skills</span>
            <h2>
              A focused stack for building and analysis.
            </h2>

            <p>
              SQL and analytical reasoning lead for data roles; modern application development leads for software roles.
            </p>
          </div>

          <div className="skills-grid">
            {skillGroups.map(
              ({ title, description, items, icon: Icon }) => (
                <article
                  className={`skill-card ${styles.depthCard}`}
                  key={title}
                  onPointerMove={handleTiltPointerMove}
                  onPointerLeave={handleTiltPointerLeave}
                >
                  <div className="skill-icon">
                    <Icon />
                  </div>

                  <h3>{title}</h3>
                  <p>{description}</p>

                  <div className="tag-row">
                    {items.map((item) => (
                      <span key={item}>{item}</span>
                    ))}
                  </div>
                </article>
              ),
            )}
          </div>
        </motion.section>

        <motion.section
          className="section section-border"
          id="repositories"
          initial={{ opacity: 1, x: -42, y: 20, scale: 0.992 }}
          whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.06 }}
          transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] as const }}
        >
          <div className="section-heading split-heading repository-heading">
            <div>
              <span className="section-index">
                05 / Repository explorer
              </span>
              <h2>Explore the full GitHub archive.</h2>
            </div>

            <p>
              Search the complete archive by project, language, technology, or category.
            </p>
          </div>

          <div className="repository-controls">
            <label className="search-box">
              <Search />

              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search projects, SQL, frameworks, languages…"
                aria-label="Search repositories"
              />
            </label>

            <div
              className="filter-row"
              aria-label="Repository category filter"
            >
              <span className="filter-label">
                <Filter /> Filter
              </span>

              {categories.map((item) => (
                <button
                  key={item}
                  className={category === item ? "active" : ""}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="repository-summary">
            <span>
              Showing <strong>{filteredRepositories.length}</strong> of{" "}
              {repositoryStats.total} repositories
            </span>

            <span
              className={`sync-state sync-${syncState}`}
            >
              <i />{" "}
              {syncState === "loading"
                ? "Checking GitHub metadata"
                : syncState === "live"
                  ? "Live GitHub metadata"
                  : "Audited fallback metadata"}
            </span>
          </div>

          <div className="repository-grid">
            {filteredRepositories.map((repo) => {
              const live = liveRepos[repo.name];

              return (
                <article
                  className={`repository-card ${styles.depthCard}`}
                  key={repo.name}
                  onPointerMove={handleTiltPointerMove}
                  onPointerLeave={handleTiltPointerLeave}
                >
                  <div className="repository-card-top">
                    <div className="repo-symbol">
                      <ProjectIcon repository={repo} />
                    </div>

                    <div className="track-row">
                      {repo.tracks.map((track) => (
                        <TrackBadge
                          key={track}
                          track={track}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="repo-title-line">
                    <h3>{repo.title}</h3>

                    <a
                      href={repo.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open ${repo.title} on GitHub`}
                    >
                      <ExternalLink />
                    </a>
                  </div>

                  <p>{compactDescription(repo)}</p>

                  {repo.forked && (
                    <span className="ownership-label">
                      Collaborative / forked
                    </span>
                  )}

                  {repo.status === "empty" && (
                    <span className="empty-label">
                      Empty archive
                    </span>
                  )}

                  <div className="tag-row compact-tags">
                    {repo.technologies
                      .slice(0, 5)
                      .map((tech) => (
                        <span key={tech}>{tech}</span>
                      ))}
                  </div>

                  <div className="repo-footer">
                    <span>{repo.language}</span>
                    <span>
                      {formatDate(
                        live?.updatedAt || repo.updatedAt,
                      )}
                    </span>

                    {live && (
                      <span>
                        ★ {live.stars} · Forks {live.forks}
                      </span>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </motion.section>

        <motion.section
          className="section contact-section section-border"
          id="contact"
          initial={{ opacity: 1, x: 36, y: 14, scale: 0.994 }}
          whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] as const }}
        >
          <div className="contact-copy">
            <span className="section-index">06 / Contact</span>
            <h2>
              Have a role or project in mind?
            </h2>

            <p>
              I&apos;m open to software and data opportunities where clear problem solving leads to useful outcomes.
            </p>

            <div className="contact-links">
              <a
                href="https://github.com/SayakaMeem"
                target="_blank"
                rel="noreferrer"
              >
                <Github /> github.com/SayakaMeem <ArrowUpRight />
              </a>
            </div>
          </div>

          <form className="contact-form" onSubmit={submitContact}>
            <div className="form-row">
              <label>
                Name
                <input
                  name="name"
                  required
                  minLength={2}
                  maxLength={80}
                  placeholder="Your name"
                />
              </label>

              <label>
                Email
                <input
                  name="email"
                  type="email"
                  required
                  maxLength={160}
                  placeholder="you@example.com"
                />
              </label>
            </div>

            <label>
              Subject
              <input
                name="subject"
                required
                minLength={3}
                maxLength={140}
                placeholder="Role, project, or collaboration"
              />
            </label>

            <label>
              Message
              <textarea
                name="message"
                required
                minLength={20}
                maxLength={3000}
                rows={6}
                placeholder="Share a little context…"
              />
            </label>

            <label className="honeypot" aria-hidden="true">
              Website
              <input
                name="website"
                tabIndex={-1}
                autoComplete="off"
              />
            </label>

            <button
              className="button button-primary submit-button"
              type="submit"
              disabled={contact.status === "submitting"}
            >
              <Send />{" "}
              {contact.status === "submitting"
                ? "Sending…"
                : "Send message"}
            </button>

            {contact.message && (
              <p className={`form-message ${contact.status}`}>
                {contact.message}
              </p>
            )}

            <small>
              Server-side contact route with validation and abuse controls. Configure Resend environment variables on Vercel for delivery.
            </small>
          </form>
        </motion.section>
      </main>

      <footer className="site-footer">
        <div>
          <span className="brand-mark small">SA</span>

          <span>
            <strong>Sayaka Alam</strong>
            <small>Software Engineer · Data Analyst</small>
          </span>
        </div>

        <p>
          © 2026 Sayaka Alam. Built with Next.js and deployed as one
          full-stack Vercel application.
        </p>

        <a href="#home">
          Back to top <ArrowUpRight />
        </a>
      </footer>
    </div>
  );
}
