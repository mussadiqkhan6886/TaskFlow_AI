ARG NODE_VERSION=24.21.0

FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS build
ARG BACKEND_INTERNAL_URL
ENV BACKEND_INTERNAL_URL=$BACKEND_INTERNAL_URL

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS final

ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

WORKDIR /app

COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public

USER node

EXPOSE 3000

CMD ["node", "server.js"]