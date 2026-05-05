# Travel Sphere

Travel Sphere is a Next.js travel booking platform for browsing tour packages, placing bookings, and managing payments.

## Local Setup

1. Copy `.env.example` to `.env.local` and fill in your real credentials.
2. Install dependencies:

```bash
npm ci
```

3. Generate the Prisma client and push the schema:

```bash
npx prisma generate
npx prisma db push
```

4. Seed sample packages if needed:

```bash
npm run seed
```

5. Start the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## GitHub Actions

This repo includes `.github/workflows/ci.yml`, which validates the same build flow Vercel will use. The workflow:

- installs dependencies with `npm ci`
- starts a temporary PostgreSQL service
- runs `npm run lint`
- runs `npm run vercel-build`

Because the workflow uses CI-safe placeholder environment values, your real secrets stay in local env files or in Vercel project settings.

## Vercel Deployment

This app should be deployed on Vercel, not GitHub Pages.

1. Push the repository to GitHub.
2. Import the repository into Vercel.
3. Add all environment variables from `.env.example`.
4. Set `NEXTAUTH_URL` and `NEXTAUTH_URL_INTERNAL` to your production Vercel domain, for example `https://your-project.vercel.app`.
5. Trigger the first deployment.

This repo is already configured for that flow:

- `vercel.json` tells Vercel to use `npm run vercel-build`
- `npm run vercel-build` runs Prisma generate, `prisma migrate deploy`, seed data, and `next build`
- `prisma/migrations` now contains the initial migration Vercel can apply to a fresh PostgreSQL database

Set `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` in Vercel before deploying. The seed step creates or updates that admin account and adds the sample tour packages that appear on the homepage.

If the admin panel keeps redirecting or looks like it only reloads after login, check these Vercel variables first:

- `NEXTAUTH_URL` must be your deployed HTTPS URL, not `http://localhost:3000`
- `NEXTAUTH_URL_INTERNAL` should use the same deployed HTTPS URL on Vercel
- `NEXTAUTH_SECRET` must be set and must not change between deploys
- `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` must match the login details you are using

If you are using Vercel Postgres or Prisma Postgres, set:

- `DATABASE_URL` to the pooled Prisma/client URL, such as `POSTGRES_PRISMA_URL`
- `DIRECT_URL` to the non-pooled direct connection URL, such as `POSTGRES_URL_NON_POOLING`

Prisma uses `DIRECT_URL` for migrations so `prisma migrate deploy` does not fail on pooled connections.

For Preview deployments, use a separate preview database if you do not want preview builds to touch production data.
