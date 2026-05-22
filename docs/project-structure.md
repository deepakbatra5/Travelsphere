# TravelSphere — Project Structure

TravelSphere is **one deployable application** organized using the standard Next.js `src/` layout — three portal entrances, one backend API, one database.

```
Internet
   ↓
travelsphere.sbs / agent.travelsphere.sbs / admin.travelsphere.sbs
   ↓
DNS → ONE VPS (one IP)
   ↓
Nginx (Reverse Proxy + SSL)
   ↓
Next.js Application (port 3000)
   ↓
PostgreSQL Database
```

---

## Directory Layout

```text
travel/                              ← Monorepo root
│
├── src/                             ← ALL source code
│   │
│   ├── app/                         ← Next.js App Router
│   │   ├── (customer)/              ← 👥 Customer portal pages
│   │   │   ├── page.tsx             ←    travelsphere.sbs/
│   │   │   ├── packages/            ←    /packages
│   │   │   ├── booking/             ←    /booking
│   │   │   ├── dashboard/           ←    /dashboard
│   │   │   ├── customised-tour/
│   │   │   ├── search/
│   │   │   ├── about-us/
│   │   │   ├── contact/
│   │   │   └── policies/
│   │   │
│   │   ├── (auth)/                  ← 🔑 Shared auth pages
│   │   │   ├── login/               ←    Customer login
│   │   │   ├── register/
│   │   │   ├── verify-otp/
│   │   │   ├── agent-login/         ←    Agent login
│   │   │   └── agent-register/
│   │   │
│   │   ├── agent/                   ← 🧳 Agent portal pages
│   │   │   ├── page.tsx             ←    agent.travelsphere.sbs/
│   │   │   ├── profile/
│   │   │   ├── tours/
│   │   │   ├── my-tours/
│   │   │   ├── earnings/
│   │   │   ├── pending/
│   │   │   └── help/
│   │   │
│   │   ├── admin/                   ← 🛡️ Admin panel pages
│   │   │   ├── page.tsx             ←    admin.travelsphere.sbs/
│   │   │   ├── login/
│   │   │   ├── packages/
│   │   │   ├── bookings/
│   │   │   ├── enquiries/
│   │   │   ├── agents/
│   │   │   ├── customers/
│   │   │   └── customised-trip/
│   │   │
│   │   ├── api/                     ← ⚙️ ONE shared backend (all portals call this)
│   │   │   ├── auth/                ←    NextAuth endpoints
│   │   │   ├── packages/
│   │   │   ├── bookings/
│   │   │   ├── payment/
│   │   │   ├── reviews/
│   │   │   ├── enquiries/
│   │   │   ├── agents/
│   │   │   ├── admin/
│   │   │   ├── upload/
│   │   │   └── ai-agent/
│   │   │
│   │   ├── layout.tsx               ← Root HTML shell
│   │   ├── providers.tsx            ← SessionProvider
│   │   └── globals.css              ← Global styles
│   │
│   ├── components/                  ← ⚛️ Shared React components
│   │   ├── layout/                  ←    Navbar, Footer
│   │   ├── packages/                ←    Package cards, filters, carousel
│   │   ├── ui/                      ←    Buttons, modals, inputs, toasts
│   │   ├── auth/                    ←    Login/register forms
│   │   ├── theme/                   ←    Dark/light mode toggle
│   │   └── AIAgent/                 ←    AI chat widget
│   │
│   ├── lib/                         ← 🖥️ Server-side & shared logic
│   │   ├── auth.ts                  ←    NextAuth config + role checks
│   │   ├── db.ts                    ←    Prisma client singleton
│   │   ├── portal-host.ts           ←    Host header → portal detection
│   │   ├── razorpay.ts              ←    Payment client
│   │   ├── email.ts                 ←    Email sending (Nodemailer)
│   │   ├── email-otp.ts             ←    OTP logic
│   │   ├── commission.ts            ←    Agent commission calculator
│   │   └── rateLimit.ts             ←    API rate limiting
│   │
│   └── types/                       ← 📝 TypeScript type declarations
│       └── next-auth.d.ts           ←    Extended NextAuth session types
│
├── prisma/                          ← 🗄️ Database layer
│   ├── schema.prisma                ←    PostgreSQL schema (all tables)
│   ├── seed.ts                      ←    Initial data (admin user + packages)
│   ├── migrations/                  ←    Migration history
│   └── generated/
│       └── prisma/                  ←    Auto-generated Prisma client
│
├── public/                          ← Static assets (images, icons)
│
├── deployment/                      ← 🚀 Production deployment files
│   ├── nginx/
│   │   └── travelsphere.conf        ←    Nginx: 3 server blocks + SSL headers
│   ├── docker-compose.yml           ←    Full stack Docker setup
│   └── deploy.sh                    ←    Automated VPS setup script
│
├── docs/                            ← 📚 Documentation
│   ├── project-structure.md         ←    This file
│   └── subdomain-deployment.md      ←    Step-by-step deployment guide
│
├── scripts/
│   ├── dev.ps1                      ←    Windows dev server launcher
│   ├── setup-local-hosts.js         ←    Add subdomain entries to hosts file
│   └── download_states.js
│
├── proxy.ts                         ← 🔀 Next.js proxy (subdomain routing + auth guard)
├── next.config.ts                   ← Next.js configuration
├── tsconfig.json                    ← TypeScript paths (@/lib, @/components, etc.)
├── prisma.config.ts                 ← Prisma config (schema path)
├── vercel.json                      ← Vercel deployment settings
├── .env.example                     ← Environment variable template
└── package.json
```

---

## Why This Structure?

| Folder    | Why here?                                                                     |
|-----------|-------------------------------------------------------------------------------|
| `src/app/`| Next.js App Router — must be in root or `src/`. `src/` is the modern standard|
| `src/app/api/` | Backend API — lives inside Next.js app (fullstack). One backend for all portals |
| `src/components/` | Frontend UI components — shared across all portals                   |
| `src/lib/` | Server logic (auth, db, email) — used by API routes and Server Components    |
| `prisma/` | Database schema at root — Vercel and standard tooling expect this location    |
| `proxy.ts` | At root — Next.js 16 convention for the request proxy/middleware file        |

---

## Import Aliases (tsconfig.json)

| Alias           | Resolves To               | Example use                          |
|-----------------|---------------------------|--------------------------------------|
| `@/components/*`| `src/components/*`        | `import Navbar from '@/components/layout/Navbar'` |
| `@/lib/*`       | `src/lib/*`               | `import { prisma } from '@/lib/db'`  |
| `@/types/*`     | `src/types/*`             | `import type { ... } from '@/types/next-auth'` |
| `@/generated/*` | `prisma/generated/*`      | `import { Category } from '@/generated/prisma/client'` |
| `@/*`           | `src/*`                   | Catch-all for other src/ imports     |

---

## Portal URL Map

| Domain                          | Page                 | App Route                    |
|---------------------------------|----------------------|------------------------------|
| `travelsphere.sbs`              | Customer homepage    | `src/app/(customer)/page.tsx`|
| `travelsphere.sbs/packages`     | Package listings     | `src/app/(customer)/packages`|
| `travelsphere.sbs/login`        | Customer login       | `src/app/(auth)/login`       |
| `travelsphere.sbs/dashboard`    | Customer dashboard   | `src/app/(customer)/dashboard`|
| `agent.travelsphere.sbs`        | Agent dashboard      | `src/app/agent/page.tsx`     |
| `agent.travelsphere.sbs/login`  | Agent login          | `src/app/(auth)/agent-login` |
| `admin.travelsphere.sbs`        | Admin dashboard      | `src/app/admin/page.tsx`     |
| `admin.travelsphere.sbs/login`  | Admin login          | `src/app/admin/login`        |

All three portals call `src/app/api/` — **one shared backend**.

---

## Deployment Targets

| Platform | Status  | Config file                            |
|----------|---------|----------------------------------------|
| Vercel   | ✅ Primary | `vercel.json` + Vercel env vars     |
| AWS VPS  | ✅ Secondary | `deployment/deploy.sh` + Nginx + PM2 |
| Docker   | ✅ Alternative | `deployment/docker-compose.yml`   |
