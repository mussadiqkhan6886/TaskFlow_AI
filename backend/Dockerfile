ARG NODE_VERSION=24.21.0

# Base image
FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /app

# Install all dependencies needed for building and testing TypeScript
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# Compile TypeScript
FROM deps AS build
COPY . .
RUN npm run build

# Install production dependencies only
FROM base AS prod-deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Final production image
FROM base AS final

ENV NODE_ENV=production

WORKDIR /app

COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --chown=node:node package.json ./

USER node

EXPOSE 4000

CMD ["npm", "start"]
