# syntax=docker/dockerfile:1.7
ARG NODE_VERSION=24

# ---------- deps ----------
FROM node:${NODE_VERSION}-bookworm-slim AS deps
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

# ---------- build (full deps + dist) ----------
FROM node:${NODE_VERSION}-bookworm-slim AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json tsconfig.json ./
COPY prisma ./prisma
COPY src ./src
COPY views ./views
COPY public ./public

RUN npx prisma generate
RUN npm run build

# ---------- prod-deps (after build, used by runtime) ----------
FROM build AS prod-deps
RUN npm prune --omit=dev

# ---------- runtime ----------
FROM node:${NODE_VERSION}-bookworm-slim AS runtime
WORKDIR /app

ENV NODE_ENV=production \
    PORT=3000

RUN apt-get update && apt-get install -y --no-install-recommends \
    openssl ca-certificates wget \
    && rm -rf /var/lib/apt/lists/*

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/views ./views
COPY --from=build /app/public ./public
COPY --from=build /app/prisma ./prisma
COPY package.json ./

RUN mkdir -p /app/public/uploads/originals /app/public/uploads/large /app/public/uploads/thumb \
    && chown -R node:node /app/public/uploads

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=5 \
  CMD wget -qO- http://localhost:3000/healthz || exit 1

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]
