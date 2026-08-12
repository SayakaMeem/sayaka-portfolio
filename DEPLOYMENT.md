# Vercel Deployment Guide — sayaka-portfolio

This source package is a **single full-stack Next.js project**. Frontend and backend API routes deploy together.

## 1. Extract

Extract the ZIP so the project root is:

```text
D:\sayaka-portfolio
```

The `package.json`, `app`, `components`, `backend`, and `vercel.json` files/folders must be directly inside that directory.

## 2. Install and test locally

Open Windows Command Prompt:

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

Test backend routes:

```text
http://localhost:4000/api/health
http://localhost:4000/api/github
http://localhost:4000/api/analytics
```

Stop the server with `Ctrl + C`.

## 3. Build before deployment

```cmd
npm run typecheck
npm run lint
npm run build
```

Do not deploy until the production build succeeds.

## 4. Login to Vercel

```cmd
npx vercel@latest login
```

Complete browser authorization and verify:

```cmd
npx vercel@latest whoami
```

Expected account from the previous setup:

```text
sayakameem
```

## 5. Remove an old local Vercel link

If this folder was previously linked to another project:

```cmd
if exist .vercel rmdir /s /q .vercel
```

## 6. Link to the correct project

```cmd
npx vercel@latest link --yes --project sayaka-portfolio --scope sayakameems-projects
```

The project root is the current folder. Do **not** set a `frontend` subdirectory.

## 7. Deploy production

```cmd
npx vercel@latest --prod
```

Use the final `Aliased` URL as the portfolio address. If the short alias is available, the intended URL is:

```text
https://sayaka-portfolio.vercel.app
```

## 8. Add Vercel environment variables

In Vercel:

```text
Project → Settings → Environment Variables
```

Recommended:

```env
NEXT_PUBLIC_SITE_URL=https://sayaka-portfolio.vercel.app
```

Optional GitHub token:

```env
GITHUB_TOKEN=your_token
```

Optional contact email:

```env
RESEND_API_KEY=your_resend_key
CONTACT_TO_EMAIL=your-email@example.com
CONTACT_FROM_EMAIL=Sayaka Portfolio <portfolio@your-verified-domain.com>
```

After changing environment variables, redeploy:

```cmd
npx vercel@latest --prod
```

## Production routes

```text
/                         portfolio frontend
/api/health               backend health
/api/github               live GitHub metadata + fallback
/api/analytics            interactive synthetic analytics backend
/api/contact              contact POST endpoint
/sql/business_analysis.sql public SQL demonstration
/sitemap.xml
/robots.txt
```

## Important architecture note

Do not create a second Vercel service for the backend. The backend code is in `backend/` and is invoked by the Next.js handlers in `app/api/`. This avoids the previous multiple-service/root-directory problem.
