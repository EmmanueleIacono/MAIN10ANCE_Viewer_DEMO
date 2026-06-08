# syntax=docker/dockerfile:1

# Stage 1: install client dependencies and build the Vite frontend into /app/client/dist.
FROM node:24.16.0-alpine3.23 AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Stage 2: install only backend production dependencies, excluding nodemon and other dev tools.
FROM node:24.16.0-alpine3.23 AS server-deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# Stage 3: assemble the runtime image with Express, backend routes, production deps, and the built frontend.
FROM node:24.16.0-alpine3.23 AS runtime
ENV NODE_ENV=production
WORKDIR /app

COPY --from=server-deps /app/node_modules ./node_modules
COPY package*.json ./
COPY start.js config.js supabase_config.js ./
COPY routes ./routes
COPY --from=client-build /app/client/dist ./client/dist

EXPOSE 3000
ENTRYPOINT ["node", "start.js"]
