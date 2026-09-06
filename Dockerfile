FROM node:lts-alpine AS base
LABEL authors="Lennard Bernet, Lino Steiner"

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

FROM base AS builder
# No NEXT_PUBLIC_API_URL build arg any more. Next.js inlines NEXT_PUBLIC_* into the bundle
# at build time, which baked one environment's api endpoint into the image and made every
# environment's frontend talk to prod. The address is resolved at runtime instead: client
# components call a relative /api path, and the server-side route handlers read
# BACKEND_API_URL from the frontend ConfigMap. The image is environment-agnostic.
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable pnpm && pnpm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"
COPY --from=builder --chown=node:node /app/public ./public
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

USER node

EXPOSE 3000

CMD ["node", "server.js"]
