# TravelSphere 🌏

**Professional Tour & Travel Platform** — Three portals, one codebase, one server.

| Portal   | URL                              | Audience     |
|----------|----------------------------------|--------------|
| Customer | `https://travelsphere.sbs`       | Customers    |
| Agent    | `https://agent.travelsphere.sbs` | Travel Agents|
| Admin    | `https://admin.travelsphere.sbs` | Admins       |

---

## Architecture

```
Internet → DNS → ONE Server (one IP)
                       │
                   Nginx (SSL)
                       │
              Next.js App (port 3000)
             /           │           \
       Customer       Agent          Admin
        Portal        Portal         Panel
                           │
                    src/app/api/   ← ONE backend
                           │
                      PostgreSQL
```

---

## Tech Stack

| Layer      | Technology                                    |
|------------|-----------------------------------------------|
| Framework  | Next.js 16 (App Router, `src/` layout)        |
| Styling    | Tailwind CSS v4                               |
| Auth       | NextAuth v4 (JWT + role-based)                |
| Database   | PostgreSQL + Prisma ORM                       |
| Payments   | Razorpay                                      |
| Storage    | Cloudinary                                    |
| AI Chat    | OpenAI / Groq (llama-3.1-8b)                 |
| Email      | Gmail SMTP (Nodemailer)                       |
| Deployment | Vercel (primary) / AWS VPS + Nginx (secondary)|

---

## Project Structure

```
travel/
├── src/
│   ├── app/               ← Next.js pages + API routes
│   │   ├── (customer)/    ← Customer portal pages
│   │   ├── (auth)/        ← Shared auth pages
│   │   ├── agent/         ← Agent portal pages
│   │   ├── admin/         ← Admin panel pages
│   │   └── api/           ← ONE shared backend API
│   ├── components/        ← Shared React components (Navbar, Cards, etc.)
│   ├── lib/               ← Server logic (auth, db, email, payments)
│   └── types/             ← TypeScript type declarations
├── prisma/
│   ├── schema.prisma      ← Database schema
│   ├── seed.ts            ← Initial data
│   └── generated/         ← Auto-generated Prisma client
├── deployment/
│   ├── nginx/             ← Nginx reverse proxy (3 server blocks + SSL)
│   ├── docker-compose.yml ← Full stack Docker
│   └── deploy.sh          ← Automated VPS setup
├── proxy.ts               ← Subdomain routing + auth guard
└── vercel.json            ← Vercel settings
```

→ Full detail: [docs/project-structure.md](docs/project-structure.md)

---

## Quick Start (Local Dev)

```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env.local
# Edit .env.local with your keys

# 3. Database setup
npm run db:push        # push schema
npm run seed           # create admin + sample packages

# 4. Start dev server
npm run dev            # http://localhost:3000
```

### Test all 3 portals locally

Run as **Administrator** in PowerShell:
```powershell
node scripts/setup-local-hosts.js
```

Then open:
- **Customer** → `http://localhost:3000`
- **Agent** → `http://agent.localhost:3000`
- **Admin** → `http://admin.localhost:3000`

---

## Deploy to Vercel (Primary)

1. Push code to GitHub
2. Import repo in [vercel.com](https://vercel.com)
3. Set environment variables in Vercel dashboard (copy from `.env.example`)
4. Set custom domains:
   - `travelsphere.sbs` → Production
   - `agent.travelsphere.sbs` → Production (same deployment)
   - `admin.travelsphere.sbs` → Production (same deployment)
5. Deploy ✓

> **Important Vercel env vars:**
> ```
> ROOT_DOMAIN=travelsphere.sbs
> NEXT_PUBLIC_ROOT_DOMAIN=travelsphere.sbs
> NEXTAUTH_URL=https://travelsphere.sbs
> NEXTAUTH_URL_INTERNAL=https://travelsphere.sbs
> ```

---

## Deploy to AWS / VPS (Secondary)

```bash
ssh root@YOUR_SERVER_IP
git clone <repo>
cd travel
nano deployment/deploy.sh   # fill in your passwords/keys
chmod +x deployment/deploy.sh && ./deployment/deploy.sh
```

The script automatically installs: Node.js 22, PostgreSQL, Nginx, PM2, SSL (Let's Encrypt).

→ Full guide: [docs/subdomain-deployment.md](docs/subdomain-deployment.md)

---

## npm Scripts

| Script                    | Description                            |
|---------------------------|----------------------------------------|
| `npm run dev`             | Start dev server (Windows PowerShell) |
| `npm run build`           | Production build                       |
| `npm run start`           | Start production server                |
| `npm run seed`            | Seed DB with admin + sample packages   |
| `npm run db:push`         | Push schema to DB (dev only)           |
| `npm run db:migrate:deploy` | Apply migrations (production)        |
| `npm run prisma:generate` | Regenerate Prisma client               |
| `npm run setup-hosts`     | Add subdomain entries to hosts file (Admin) |

---

## Environment Variables

Copy `.env.example` → `.env.local`:

| Variable               | Description                             |
|------------------------|-----------------------------------------|
| `DATABASE_URL`         | PostgreSQL connection string            |
| `NEXTAUTH_SECRET`      | Random 32-char secret                   |
| `ROOT_DOMAIN`          | `travelsphere.sbs` in prod, `localhost` in dev |
| `NEXTAUTH_URL`         | Primary domain URL                      |
| `RAZORPAY_KEY_ID/SECRET` | Payment keys                          |
| `CLOUDINARY_*`         | Image storage                           |
| `EMAIL_USER/PASS`      | Gmail SMTP credentials                  |
| `OPENAI_API_KEY`       | AI chat (optional)                      |
| `GROQ_API_KEY`         | AI chat alternative                     |

---

## License

MIT
