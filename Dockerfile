# syntax=docker/dockerfile:1.20
# Paperclip — Content Creator Edition
# Mirrors real paperclipai/paperclip Dockerfile structure but simplified

FROM node:20-slim AS base
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates curl git && rm -rf /var/lib/apt/lists/* && corepack enable
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-workspace.yaml ./
COPY ui/package.json ui/
COPY server/package.json server/
COPY cli/package.json cli/
COPY packages/shared/package.json packages/shared/
COPY packages/db/package.json packages/db/
RUN npm install -g pnpm && pnpm install --no-frozen-lockfile || npm install -g pnpm && pnpm install

FROM deps AS build
COPY . .
RUN pnpm --filter @paperclipai/shared build || true
RUN pnpm --filter @paperclipai/ui build || true
RUN pnpm --filter @paperclipai/server build || true

FROM base AS production
WORKDIR /app
COPY --from=build /app /app
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["pnpm", "--filter", "@paperclipai/server", "start"]
