# sayaka-portfolio

Professional full-stack portfolio for **Sayaka Alam**, designed to work for both **Software Developer** and **Data Analyst** applications without splitting the profile into separate websites.

The project uses the supplied profile photograph, current public GitHub evidence, a recruiter-friendly project presentation, and an interactive analytics demonstration that makes the data-analysis mindset visible.

## Positioning

**Software Developer · Data Analyst**

The site deliberately emphasizes two complementary strengths:

- **Software:** interfaces, APIs, backend services, deployment, mobile/system/database foundations.
- **Data:** SQL-first reasoning, relational thinking, validation, insight extraction, and decision framing. Python is presented as supporting tooling rather than the center of the analyst story.

## Production stack

- Next.js 16
- React 19
- TypeScript
- semantic JSX/HTML
- custom responsive CSS
- Next.js Route Handlers
- server-side backend service modules in `/backend`
- GitHub REST API
- Resend API (optional contact delivery)
- Vercel

## Full-stack architecture

```text
Browser
  |
  v
Next.js / React frontend
  |
  +-- /api/github ------> backend/github-service.ts ------> GitHub API
  |
  +-- /api/analytics ---> backend/analytics-service.ts ---> synthetic demo dataset
  |
  +-- /api/contact -----> backend/contact-service.ts -----> Resend (optional)
  |
  +-- /api/health
```

Everything is deployed as **one Vercel project**. There is no second Express service and no separate production port.

## Data analyst layer

The portfolio includes two different forms of data evidence and clearly separates them:

### Public repository evidence

`Database-CRMS-` contains relational schema work and SQL/PLSQL patterns such as aggregation, `GROUP BY`, `HAVING`, subqueries, joins, set operations, `WITH`, views, procedures, functions, and triggers.

### Portfolio analytics demonstration

`analytics/sample-data/` contains a **synthetic** commerce dataset used only for the interactive Analyst Lab. The backend calculates:

- revenue
- order count
- average order value
- repeat-customer rate
- monthly revenue trend
- segment / region / category / channel breakdowns
- short evidence-based insight statements

The SQL demonstration is in:

```text
analytics/sql/business_analysis.sql
```

It includes aggregations, CTEs, grouped analysis, window functions, month-over-month comparison, and simple decision-support logic. The site explicitly labels this as a synthetic portfolio demonstration rather than real employer data.

## Raw HTML / CSS / JavaScript source

The production frontend is written with Next.js/React, which renders semantic HTML in the browser. A separate plain-source reference is also included because explicit HTML/CSS/JS source was requested:

```text
static-reference/
  index.html
  styles.css
  app.js
```

This folder is for inspection/learning only. The production deployment uses the Next.js app at the repository root.

## Main folders

```text
sayaka-portfolio/
├─ app/                    # pages, global CSS, Vercel API routes
│  └─ api/
│     ├─ analytics/
│     ├─ contact/
│     ├─ github/
│     └─ health/
├─ backend/                # production backend service logic
├─ components/             # interactive React components
├─ data/                   # audited repository presentation data
├─ analytics/              # SQL + synthetic sample data
├─ public/                 # photograph, favicon, public SQL file
├─ static-reference/       # plain HTML/CSS/JS reference version
├─ package.json
├─ vercel.json
└─ .env.example
```

## Run locally on Windows CMD

```cmd
cd /d D:\sayaka-portfolio
npm install
copy .env.example .env.local
npm run dev
```

Open:

```text
http://localhost:4000
```

Useful endpoints:

```text
http://localhost:4000/api/health
http://localhost:4000/api/github
http://localhost:4000/api/analytics
```

The local site intentionally uses **port 4000**.

## Environment variables

The portfolio, GitHub fallback, and analytics demo work without secrets.

For production metadata:

```env
NEXT_PUBLIC_SITE_URL=https://sayaka-portfolio.vercel.app
```

Optional GitHub token for higher API limits:

```env
GITHUB_TOKEN=
```

Optional contact email delivery:

```env
RESEND_API_KEY=
CONTACT_TO_EMAIL=
CONTACT_FROM_EMAIL=Sayaka Portfolio <portfolio@your-verified-domain.com>
```

## Quality checks

```cmd
npm run typecheck
npm run lint
npm run build
```

See `DEPLOYMENT.md` for Vercel deployment and `REPOSITORY_AUDIT.md` for repository presentation rules.
