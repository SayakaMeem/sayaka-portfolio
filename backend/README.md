# Backend layer

This folder contains the production backend services used by the Next.js Route Handlers in `app/api`.

- `analytics-service.ts` — filters the synthetic portfolio dataset, calculates KPIs, builds breakdowns, and generates evidence-based insight statements.
- `github-service.ts` — loads live public repository metadata from GitHub with an audited local fallback.
- `contact-service.ts` — validates contact submissions and delivers messages through Resend when environment variables are configured.

The API entry points are:

- `GET /api/health`
- `GET /api/github`
- `GET /api/analytics?segment=All&region=All`
- `POST /api/contact`

This structure keeps one Vercel deployment: React/Next.js frontend + server-side backend routes in the same project.
