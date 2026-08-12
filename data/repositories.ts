export type RepositoryTrack = "Software" | "Data";
export type RepositoryCategory = "AI & Data" | "Data & SQL" | "Web" | "Mobile" | "Systems" | "Learning";
export type RepositoryStatus = "featured" | "project" | "learning" | "empty";

export type Repository = {
  name: string;
  title: string;
  description: string;
  language: string;
  category: RepositoryCategory;
  tracks: RepositoryTrack[];
  technologies: string[];
  url: string;
  demoUrl?: string;
  updatedAt: string;
  status: RepositoryStatus;
  forked?: boolean;
  collaboration?: boolean;
  highlights?: string[];
  evidence?: string;
};

export const repositories: Repository[] = [
  {
    name: "aura-fashion-ai",
    title: "Aura AI Fashion Engineering",
    description:
      "A responsive fashion styling product built with React and Express, including wardrobe, catalog, favorites, saved looks, uploads, sharing, reset flows, and optional server-side AI image generation.",
    language: "JavaScript",
    category: "Web",
    tracks: ["Software"],
    technologies: ["React", "Express", "Vite", "REST API", "Multer", "OpenAI API"],
    url: "https://github.com/SayakaMeem/aura-fashion-ai",
    updatedAt: "2026-08-05",
    status: "featured",
    highlights: [
      "End-to-end interactive product workflow",
      "React frontend with Express backend",
      "Server-side API key design for optional AI generation"
    ]
  },
  {
    name: "EthereumHeist-System",
    title: "EthereumHeist AML System",
    description:
      "A multihop transaction-tracking and experiment system that combines a Next.js interface with a FastAPI data backend for graph-based analysis of Ethereum heist flows.",
    language: "Python",
    category: "AI & Data",
    tracks: ["Software", "Data"],
    technologies: ["Next.js", "FastAPI", "DuckDB", "Pandas", "NetworkX", "Cytoscape", "Recharts"],
    url: "https://github.com/SayakaMeem/EthereumHeist-System",
    demoUrl: "https://ethereum-heist-system.vercel.app",
    updatedAt: "2026-07-28",
    status: "featured",
    highlights: [
      "Multihop tracking with configurable depth and address limits",
      "Batch experiment workflow for comparison-oriented analysis",
      "Data tooling with DuckDB, Pandas, graph libraries, and web visualizations"
    ]
  },
  {
    name: "Drowsy-Driver-Detection-System",
    title: "Drowsy Driver Detection System",
    description:
      "A full-stack driver-monitoring dashboard connecting a Next.js interface to a Python/Flask computer-vision API for face and drowsiness analysis.",
    language: "Python",
    category: "AI & Data",
    tracks: ["Software", "Data"],
    technologies: ["Next.js", "React", "Flask", "MTCNN", "Chart.js", "SQLite"],
    url: "https://github.com/SayakaMeem/Drowsy-Driver-Detection-System",
    updatedAt: "2026-05-18",
    status: "project",
    forked: true,
    collaboration: true,
    highlights: [
      "Model-backed API workflow",
      "Dashboard visualizations",
      "Clearly marked as collaborative/forked work"
    ]
  },
  {
    name: "Compiler_Project85",
    title: "Compiler Project",
    description:
      "A C-based compiler construction project focused on core language-processing and systems concepts.",
    language: "C",
    category: "Systems",
    tracks: ["Software"],
    technologies: ["C", "Compiler Design", "Parsing", "Language Processing"],
    url: "https://github.com/SayakaMeem/Compiler_Project85",
    updatedAt: "2025-03-02",
    status: "featured",
    highlights: ["Systems-level programming", "Compiler construction coursework"]
  },
  {
    name: "CoffeeApp",
    title: "Coffee App",
    description:
      "A Swift-based iOS application exploration with a native Xcode project structure and interface assets.",
    language: "Swift",
    category: "Mobile",
    tracks: ["Software"],
    technologies: ["Swift", "iOS", "Xcode"],
    url: "https://github.com/SayakaMeem/CoffeeApp",
    updatedAt: "2024-12-18",
    status: "project",
    forked: true,
    collaboration: true
  },
  {
    name: "IOS_assignment",
    title: "SwiftUI Tic-Tac-Toe",
    description:
      "A native two-player Tic-Tac-Toe application built with SwiftUI, including turn management and winner detection.",
    language: "Swift",
    category: "Mobile",
    tracks: ["Software"],
    technologies: ["Swift", "SwiftUI", "Xcode", "Game Logic"],
    url: "https://github.com/SayakaMeem/IOS_assignment",
    updatedAt: "2024-11-21",
    status: "featured",
    highlights: ["Reactive game board", "Winner detection", "Native SwiftUI interface"]
  },
  {
    name: "Web_treeverse",
    title: "Treeverse Web Application",
    description:
      "A Laravel web application structured around routing, database migrations, testing, and a Vite-powered frontend workflow.",
    language: "PHP",
    category: "Web",
    tracks: ["Software", "Data"],
    technologies: ["Laravel", "PHP", "Vite", "Database Migrations", "PHPUnit"],
    url: "https://github.com/SayakaMeem/Web_treeverse",
    updatedAt: "2024-05-29",
    status: "project"
  },
  {
    name: "Real",
    title: "Android Application — Real",
    description:
      "An Android Studio application repository using Java and Gradle for native mobile development practice.",
    language: "Java",
    category: "Mobile",
    tracks: ["Software"],
    technologies: ["Android", "Java", "Gradle", "Android Studio"],
    url: "https://github.com/SayakaMeem/Real",
    updatedAt: "2024-05-09",
    status: "learning"
  },
  {
    name: "MyApplication85",
    title: "Android Application 85",
    description:
      "A native Android coursework project structured with Android Studio and Gradle.",
    language: "Java",
    category: "Mobile",
    tracks: ["Software"],
    technologies: ["Android", "Java", "Gradle"],
    url: "https://github.com/SayakaMeem/MyApplication85",
    updatedAt: "2024-05-09",
    status: "learning"
  },
  {
    name: "Database-CRMS-",
    title: "CRMS Database & SQL Project",
    description:
      "A relational customer-resource-management database project with schema design and a wide range of SQL and PL/SQL operations over customers, contacts, interactions, products, orders, and order details.",
    language: "SQL",
    category: "Data & SQL",
    tracks: ["Data", "Software"],
    technologies: ["SQL", "PL/SQL", "Joins", "Aggregations", "Subqueries", "CTEs", "Views", "Triggers"],
    url: "https://github.com/SayakaMeem/Database-CRMS-",
    updatedAt: "2024-05-06",
    status: "featured",
    evidence:
      "Repository evidence includes filters, aggregates, GROUP BY/HAVING, subqueries, joins, set operators, CTEs, views, procedures, functions, and triggers.",
    highlights: [
      "Relational schema design with keys and relationships",
      "Analytical SQL using aggregates, GROUP BY/HAVING, and subqueries",
      "Advanced database operations including joins, CTEs, views, and PL/SQL"
    ]
  },
  {
    name: "Test-repo",
    title: "Test Repository",
    description: "An empty repository retained as an early GitHub workspace.",
    language: "—",
    category: "Learning",
    tracks: ["Software"],
    technologies: ["GitHub"],
    url: "https://github.com/SayakaMeem/Test-repo",
    updatedAt: "2024-04-22",
    status: "empty"
  },
  {
    name: "Software-Lab",
    title: "Software Lab",
    description:
      "A Java software-laboratory repository containing practical exercises and coursework.",
    language: "Java",
    category: "Learning",
    tracks: ["Software"],
    technologies: ["Java", "Software Engineering", "Lab Work"],
    url: "https://github.com/SayakaMeem/Software-Lab",
    updatedAt: "2024-03-04",
    status: "learning"
  },
  {
    name: "WeatherApp",
    title: "Android Weather App",
    description:
      "A native Android application for looking up current weather information for locations around the world.",
    language: "Java",
    category: "Mobile",
    tracks: ["Software"],
    technologies: ["Android", "Java", "Weather API", "Gradle"],
    url: "https://github.com/SayakaMeem/WeatherApp",
    updatedAt: "2024-03-03",
    status: "featured",
    highlights: ["API-backed weather lookup", "Native Android interface"]
  },
  {
    name: "Portfolio",
    title: "ASP.NET Portfolio",
    description:
      "An earlier personal portfolio built with ASP.NET Web Forms, HTML, CSS, JavaScript, and an administrative interface.",
    language: "ASP.NET",
    category: "Web",
    tracks: ["Software"],
    technologies: ["ASP.NET", "C#", "HTML", "CSS", "JavaScript", "Web Forms"],
    url: "https://github.com/SayakaMeem/Portfolio",
    updatedAt: "2024-03-03",
    status: "project"
  },
  {
    name: "asdf",
    title: "ASDF Workspace",
    description: "An empty early-stage repository.",
    language: "—",
    category: "Learning",
    tracks: ["Software"],
    technologies: ["GitHub"],
    url: "https://github.com/SayakaMeem/asdf",
    updatedAt: "2024-01-29",
    status: "empty"
  },
  {
    name: "Shape",
    title: "Shape Workspace",
    description: "An empty repository preserved from early development practice.",
    language: "—",
    category: "Learning",
    tracks: ["Software"],
    technologies: ["GitHub"],
    url: "https://github.com/SayakaMeem/Shape",
    updatedAt: "2024-01-22",
    status: "empty"
  },
  {
    name: "Demo01",
    title: "Demo 01",
    description:
      "A compact Git and file-organization exercise from early repository practice.",
    language: "Text",
    category: "Learning",
    tracks: ["Software"],
    technologies: ["Git", "Repository Basics"],
    url: "https://github.com/SayakaMeem/Demo01",
    updatedAt: "2024-01-21",
    status: "learning"
  },
  {
    name: "Demo",
    title: "First Git Repository",
    description: "An early repository documenting the beginning of version-control practice.",
    language: "Markdown",
    category: "Learning",
    tracks: ["Software"],
    technologies: ["Git", "GitHub", "Markdown"],
    url: "https://github.com/SayakaMeem/Demo",
    updatedAt: "2024-01-19",
    status: "learning"
  },
  {
    name: "My-Activity",
    title: "My Activity",
    description: "An empty repository retained in the public profile archive.",
    language: "—",
    category: "Learning",
    tracks: ["Software"],
    technologies: ["GitHub"],
    url: "https://github.com/SayakaMeem/My-Activity",
    updatedAt: "2024-01-15",
    status: "empty"
  },
  {
    name: "laravel-food-ordering-web-app",
    title: "Online Food Order Management System",
    description:
      "A Laravel and MySQL group assignment with customer browsing, cart and order history, and administrative food-management workflows.",
    language: "JavaScript",
    category: "Web",
    tracks: ["Software", "Data"],
    technologies: ["Laravel", "PHP", "MySQL", "JavaScript", "CRUD", "Tailwind CSS"],
    url: "https://github.com/SayakaMeem/laravel-food-ordering-web-app",
    updatedAt: "2023-01-25",
    status: "project",
    forked: true,
    collaboration: true
  }
];

export const featuredRepositories = repositories.filter((repo) => repo.status === "featured");

export const repositoryStats = {
  total: repositories.length,
  codeRepositories: repositories.filter((repo) => repo.status !== "empty").length,
  emptyRepositories: repositories.filter((repo) => repo.status === "empty").length,
  collaborativeRepositories: repositories.filter((repo) => repo.collaboration).length,
  dataRepositories: repositories.filter((repo) => repo.tracks.includes("Data")).length,
  languages: new Set(repositories.map((repo) => repo.language).filter((language) => language !== "—")).size
};
