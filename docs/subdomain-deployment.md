# TravelSphere — Subdomain Deployment Guide

Three portals. One server. One database.

| Portal  | URL                           | Audience        |
|---------|-------------------------------|-----------------|
| Customer| `https://travelsphere.sbs`    | Travel customers|
| Agent   | `https://agent.travelsphere.sbs` | Travel agents|
| Admin   | `https://admin.travelsphere.sbs` | Site admins  |

---

## System Architecture

```
Internet Users
      │
      ▼
┌─────────────────────┐
│   Domain DNS         │
│  travelsphere.sbs   │
│  agent.travelsphere │
│  admin.travelsphere │
└────────┬────────────┘
         │ All A records point to same IP
         ▼
┌─────────────────────┐
│   ONE VPS           │
│   145.xxx.xxx.xxx   │
│                     │
│  ┌───────────────┐  │
│  │  Nginx        │  │
│  │  (port 80/443)│  │
│  └──────┬────────┘  │
│         │ proxy_pass│
│  ┌──────▼────────┐  │
│  │  Next.js      │  │
│  │  (port 3000)  │  │
│  └──────┬────────┘  │
│         │           │
│  ┌──────▼────────┐  │
│  │  PostgreSQL   │  │
│  │  (port 5432)  │  │
│  └───────────────┘  │
└─────────────────────┘
```

---

## Step 1 — Buy Domain

Purchase `travelsphere.sbs` (or any domain).

---

## Step 2 — Get a VPS

Recommended providers:
- DigitalOcean (Droplet, $12/mo, 2GB RAM)
- Hetzner (CX22, €4/mo, 4GB RAM — best value)
- Vultr / Linode / AWS Lightsail

**Minimum spec:** Ubuntu 22.04 LTS, 2 vCPU, 2GB RAM, 20GB SSD.

---

## Step 3 — Configure DNS

In your domain registrar's DNS panel, add these **A records**:

| Type | Host    | Points To      | TTL   |
|------|---------|----------------|-------|
| A    | @       | YOUR_SERVER_IP | 3600  |
| A    | agent   | YOUR_SERVER_IP | 3600  |
| A    | admin   | YOUR_SERVER_IP | 3600  |

> DNS propagation takes 5–30 minutes.

---

## Step 4 — Run the Deployment Script

```bash
# SSH into your VPS
ssh root@YOUR_SERVER_IP

# Download and run the deploy script
wget https://raw.githubusercontent.com/you/travel/main/deployment/deploy.sh
chmod +x deploy.sh
nano deploy.sh          # Fill in <<...>> placeholders
./deploy.sh
```

The script automatically:
1. Installs Node.js 22, Nginx, PostgreSQL
2. Clones your repository
3. Creates the database
4. Runs migrations + seed (creates admin account)
5. Builds the Next.js app
6. Starts it with PM2 (auto-restart on crash/reboot)
7. Configures Nginx as reverse proxy
8. Gets Let's Encrypt SSL for all 3 domains

---

## Step 5 — Manual Setup (Alternative)

### 5a — Environment Variables

```bash
cp .env.example .env.local
nano .env.local
```

Required production values:

```env
DATABASE_URL="postgresql://postgres:YOURPASS@localhost:5432/travel_db"

NEXTAUTH_URL="https://travelsphere.sbs"
NEXTAUTH_URL_INTERNAL="http://127.0.0.1:3000"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"

ROOT_DOMAIN="travelsphere.sbs"
NEXT_PUBLIC_ROOT_DOMAIN="travelsphere.sbs"
```

### 5b — Build and Start

```bash
npm ci
npm run db:migrate:deploy
npm run seed
npm run build

# Start with PM2
npm install -g pm2
pm2 start npm --name travelsphere -- run start -- -p 3000
pm2 save && pm2 startup
```

### 5c — Nginx

```bash
sudo cp deployment/nginx/travelsphere.conf /etc/nginx/conf.d/
sudo nginx -t
sudo systemctl reload nginx
```

### 5d — SSL

```bash
sudo certbot --nginx \
  -d travelsphere.sbs \
  -d agent.travelsphere.sbs \
  -d admin.travelsphere.sbs \
  --agree-tos -m your@email.com
```

---

## Step 6 — Verify

| Check | Command |
|-------|---------|
| App running | `pm2 status` |
| App logs | `pm2 logs travelsphere` |
| Nginx status | `sudo systemctl status nginx` |
| SSL cert | `sudo certbot certificates` |
| Open ports | `sudo ufw status` |

Browse to:
- `https://travelsphere.sbs` → Customer homepage ✓
- `https://agent.travelsphere.sbs` → Agent login ✓
- `https://admin.travelsphere.sbs` → Admin login ✓

---

## How Portal Routing Works

```
Request: agent.travelsphere.sbs/login
                │
        Nginx passes Host header to Next.js
                │
        proxy.ts middleware runs
                │
        getPortalFromHost("agent.travelsphere.sbs") → "agent"
                │
        /login path → rewrites to /agent-login internally
                │
        Checks token.agentStatus → not logged in
                │
        Serves agent login page
```

Role protection table:

| Visitor         | Portal URL           | Token Role | Result       |
|-----------------|----------------------|------------|--------------|
| Customer        | travelsphere.sbs     | CUSTOMER   | ✓ Access     |
| Customer        | agent.travelsphere   | CUSTOMER   | ✗ Redirected |
| Customer        | admin.travelsphere   | CUSTOMER   | ✗ Redirected |
| Agent           | agent.travelsphere   | —          | ✓ Access     |
| Agent           | admin.travelsphere   | —          | ✗ Denied     |
| Admin           | admin.travelsphere   | ADMIN      | ✓ Access     |
| Admin           | travelsphere.sbs     | ADMIN      | ✗ Redirected |

---

## SSL Renewal

Certbot auto-renews. Verify auto-renewal is set up:

```bash
sudo certbot renew --dry-run
sudo systemctl status certbot.timer
```

---

## Deployment Updates

To deploy code updates:

```bash
ssh root@YOUR_SERVER_IP
cd /var/www/travelsphere
git pull
npm ci
npm run db:migrate:deploy
npm run build
pm2 restart travelsphere
```

---

## Docker Alternative

If you prefer Docker:

```bash
# On your VPS
cd /var/www/travelsphere
cp .env.example .env.local && nano .env.local   # fill in values
docker compose -f deployment/docker-compose.yml up -d
```

The compose file starts PostgreSQL, the Next.js app, and Nginx together.
