# Stage 1: Install dependencies only when needed
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy dependency files and Prisma configurations
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Install dependencies (runs prisma generate automatically if postinstall is set)
RUN npm ci

# Stage 2: Rebuild the source code only when needed
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY . .

# Set environment variables for build time
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV OPENAI_API_KEY="dummy-openai-key-for-build"
ENV GROQ_API_KEY="dummy-groq-key-for-build"
ENV NEXTAUTH_SECRET="dummy-nextauth-secret-for-build"
ENV DATABASE_URL="postgresql://postgres:dummy@localhost:5432/dummy"

# Generate Prisma client and build application
RUN npx prisma generate
RUN npm run build

# Stage 3: Runner
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create a non-privileged system user for running the application
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy static assets and public files
COPY --from=builder /app/public ./public

# Set the correct permissions for the cache directory
RUN mkdir -p .next && chown -R nextjs:nodejs .next

# Leverage standalone output tracing
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
