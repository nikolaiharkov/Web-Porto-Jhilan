# Stage 1: dependensi
FROM node:22-bookworm-slim AS deps
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ ca-certificates \
  && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
COPY scripts/copy-tinymce.mjs ./scripts/copy-tinymce.mjs
RUN npm ci --no-audit --no-fund

# Stage 2: build
FROM node:22-bookworm-slim AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS=--max-old-space-size=2048
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV SESSION_SECRET=build-time-placeholder-secret-value-32

RUN node scripts/copy-tinymce.mjs
RUN npm run build

# Stage 3: runtime (standalone)
FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS=--max-old-space-size=512
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV DATA_DIR=/data

RUN groupadd -g 1001 nodejs \
  && useradd -u 1001 -g nodejs -m -s /bin/sh nodejs \
  && mkdir -p /data \
  && chown -R nodejs:nodejs /data

COPY --from=builder --chown=nodejs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nodejs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nodejs:nodejs /app/public ./public
COPY --from=builder --chown=nodejs:nodejs /app/db ./db
COPY --from=builder --chown=nodejs:nodejs /app/lib ./lib
COPY --from=builder --chown=nodejs:nodejs /app/scripts ./scripts
COPY --from=builder --chown=nodejs:nodejs /app/seed ./seed
COPY --from=builder --chown=nodejs:nodejs /app/entrypoint.sh ./entrypoint.sh

# Skrip entrypoint berjalan di Node langsung, bukan lewat bundel Next,
# sehingga dependensi berikut harus tersedia sebagai modul nyata.
COPY --from=builder --chown=nodejs:nodejs /app/node_modules/zod ./node_modules/zod
COPY --from=builder --chown=nodejs:nodejs /app/node_modules/bcryptjs ./node_modules/bcryptjs

RUN find /app/node_modules/better-sqlite3/prebuilds -type f ! -name 'linux-x64.node' -delete \
  && rm -rf /app/node_modules/better-sqlite3/src /app/node_modules/better-sqlite3/deps

USER nodejs
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"

CMD ["sh", "/app/entrypoint.sh"]
