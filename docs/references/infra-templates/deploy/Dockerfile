# Template for adopter projects: multi-stage container build starter.
# Replace the base images and commands with your stack's equivalents.
# Principles it models: pinned base image, non-root runtime user,
# build/runtime separation, no secrets baked into layers.

FROM node:22-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY package*.json ./
RUN npm ci --omit=dev && useradd --user-group --system app && chown -R app:app /app
USER app
EXPOSE 3000
CMD ["node", "dist/index.js"]
