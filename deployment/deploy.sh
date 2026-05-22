#!/bin/bash
# ==============================================================
# TravelSphere — VPS Deployment Script
# Run this on a fresh Ubuntu 22.04 / 24.04 VPS as root.
# Replace placeholders marked with <<...>> before running.
# ==============================================================
set -euo pipefail

DOMAIN="travelsphere.sbs"
REPO_URL="<<YOUR_GIT_REPO_URL>>"      # e.g. https://github.com/you/travel.git
APP_DIR="/var/www/travelsphere"
SERVER_IP=$(curl -s ifconfig.me)

echo "============================================"
echo "  TravelSphere VPS Setup — $SERVER_IP"
echo "============================================"

# ──────────────────────────────────────────────
# 1. System update + install dependencies
# ──────────────────────────────────────────────
apt update && apt upgrade -y
apt install -y curl git nginx postgresql postgresql-contrib certbot python3-certbot-nginx ufw

# ──────────────────────────────────────────────
# 2. Install Node.js 22
# ──────────────────────────────────────────────
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs
node --version   # Should print v22.x.x

# ──────────────────────────────────────────────
# 3. Configure firewall
# ──────────────────────────────────────────────
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

# ──────────────────────────────────────────────
# 4. Clone / pull repository
# ──────────────────────────────────────────────
mkdir -p "$APP_DIR"
if [ -d "$APP_DIR/.git" ]; then
  cd "$APP_DIR" && git pull
else
  git clone "$REPO_URL" "$APP_DIR"
fi
cd "$APP_DIR"

# ──────────────────────────────────────────────
# 5. Create .env.local (fill in your values)
# ──────────────────────────────────────────────
cat > "$APP_DIR/.env.local" <<'ENV'
DATABASE_URL="postgresql://postgres:<<DB_PASS>>@localhost:5432/travel_db"
DIRECT_URL="postgresql://postgres:<<DB_PASS>>@localhost:5432/travel_db"

NEXTAUTH_URL="https://travelsphere.sbs"
NEXTAUTH_URL_INTERNAL="http://127.0.0.1:3000"
NEXTAUTH_SECRET="<<GENERATE_WITH: openssl rand -base64 32>>"

ROOT_DOMAIN="travelsphere.sbs"
NEXT_PUBLIC_ROOT_DOMAIN="travelsphere.sbs"

SEED_ADMIN_EMAIL="admin@travelsphere.com"
SEED_ADMIN_PASSWORD="<<STRONG_ADMIN_PASSWORD>>"

RAZORPAY_KEY_ID="rzp_live_<<YOUR_KEY>>"
RAZORPAY_KEY_SECRET="<<YOUR_SECRET>>"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_live_<<YOUR_KEY>>"

CLOUDINARY_CLOUD_NAME="<<YOUR_CLOUD>>"
CLOUDINARY_API_KEY="<<YOUR_KEY>>"
CLOUDINARY_API_SECRET="<<YOUR_SECRET>>"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="<<YOUR_CLOUD>>"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="travel_sphere_packages"

EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="<<YOUR_EMAIL>>"
EMAIL_PASS="<<APP_PASSWORD>>"

OPENAI_API_KEY="<<YOUR_OPENAI_KEY>>"
GROQ_API_KEY="<<YOUR_GROQ_KEY>>"
GROQ_MODEL="llama-3.1-8b-instant"
ENV

echo ">> .env.local created. Edit it with your real values before continuing."

# ──────────────────────────────────────────────
# 6. PostgreSQL — create DB and user
# ──────────────────────────────────────────────
sudo -u postgres psql <<SQL
DO \$\$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'postgres') THEN
    CREATE ROLE postgres LOGIN SUPERUSER PASSWORD '<<DB_PASS>>';
  END IF;
END \$\$;
CREATE DATABASE travel_db OWNER postgres;
SQL

# ──────────────────────────────────────────────
# 7. Install npm packages and build
# ──────────────────────────────────────────────
cd "$APP_DIR"
npm ci
npm run db:migrate:deploy
npm run seed
npm run build

# ──────────────────────────────────────────────
# 8. Install PM2 and start the app
# ──────────────────────────────────────────────
npm install -g pm2
pm2 start npm --name "travelsphere" -- run start -- -p 3000
pm2 save
pm2 startup systemd -u root --hp /root | tail -1 | bash

# ──────────────────────────────────────────────
# 9. Nginx — deploy config
# ──────────────────────────────────────────────
cp "$APP_DIR/deployment/nginx/travelsphere.conf" /etc/nginx/conf.d/travelsphere.conf

# Temporary HTTP-only version for Certbot validation
cat > /etc/nginx/conf.d/travelsphere-temp.conf <<NGINX
server {
  listen 80;
  server_name $DOMAIN agent.$DOMAIN admin.$DOMAIN;
  location /.well-known/acme-challenge/ { root /var/www/certbot; }
  location / { return 301 https://\$host\$request_uri; }
}
NGINX

nginx -t && systemctl reload nginx

# ──────────────────────────────────────────────
# 10. SSL — Let's Encrypt
# ──────────────────────────────────────────────
certbot --nginx \
  -d "$DOMAIN" \
  -d "agent.$DOMAIN" \
  -d "admin.$DOMAIN" \
  --non-interactive \
  --agree-tos \
  -m "<<YOUR_EMAIL>>"

rm /etc/nginx/conf.d/travelsphere-temp.conf
nginx -t && systemctl reload nginx

echo ""
echo "============================================"
echo "  Deployment Complete!"
echo ""
echo "  Customer:  https://$DOMAIN"
echo "  Agent:     https://agent.$DOMAIN"
echo "  Admin:     https://admin.$DOMAIN"
echo ""
echo "  App status: pm2 status"
echo "  App logs:   pm2 logs travelsphere"
echo "============================================"
