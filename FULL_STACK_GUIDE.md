# Full-stack code map

## Frontend / HTML

Production page composition:

- `app/page.tsx`
- `components/portfolio.tsx`
- `components/analytics-lab.tsx`

These React/Next.js files produce the semantic HTML rendered to the browser.

A literal plain-HTML reference is also included:

- `static-reference/index.html`
- `static-reference/styles.css`
- `static-reference/app.js`

## CSS

The complete production styling is:

- `app/globals.css`

It includes responsive layout, dark/light themes, project cards, SQL evidence, repository search/filter UI, contact form styling, and the interactive analytics dashboard.

## Backend

Backend service logic:

- `backend/github-service.ts`
- `backend/analytics-service.ts`
- `backend/contact-service.ts`

HTTP routes:

- `app/api/github/route.ts`
- `app/api/analytics/route.ts`
- `app/api/contact/route.ts`
- `app/api/health/route.ts`

## Data analyst assets

- `analytics/sample-data/orders.csv` — synthetic demonstration dataset
- `analytics/sample-data/orders.json` — API source version
- `analytics/sql/schema.sql` — synthetic table schema
- `analytics/sql/business_analysis.sql` — SQL analysis demonstration
- `public/sql/business_analysis.sql` — public browser-accessible copy

## GitHub portfolio data

- `data/repositories.ts`

This file models the current 20-public-repository profile and controls which projects are featured, which are collaborative/forked, and which are learning/archive items.
