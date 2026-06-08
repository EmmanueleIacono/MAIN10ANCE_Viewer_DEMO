# Docker

This project can run as one production Node/Express container that serves the built Vite frontend from `client/dist`.

## Files

- `Dockerfile`: multi-stage build.
  - `client-build` installs client dependencies and runs `npm run build`.
  - `server-deps` installs only backend production dependencies.
  - `runtime` contains the Express app, backend dependencies, and `client/dist`.
- `docker-compose.yml`: runs the app plus a local PostgreSQL service.
- `.env.docker.example`: Docker-oriented environment template.

## Environment

Copy `.env.docker.example` to `.env.docker` and fill the real values:

```sh
cp .env.docker.example .env.docker
```

Required app variables:

- `COOKIE_SECRET`
- `LIVELLO_2`, `LIVELLO_3`, `LIVELLO_4`
- `FORGE_CLIENT_ID`, `FORGE_CLIENT_SECRET`, `FORGE_CALLBACK_URL`
- `SUPABASE_URL`, `SUPABASE_KEY`
- `DATA_SCHEMA`, `UTILITY_SCHEMA`

Compose database variables:

- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`

Inside Docker, `MAIN10ANCE_DB` is set by `docker-compose.yml` to use the Compose service hostname `postgres`. This is intentional: from inside the app container, PostgreSQL is not reachable at `localhost`.

## Run

```sh
docker compose up --build
```

Then open:

```txt
http://localhost:3000
```

The included PostgreSQL container starts empty. Until schema creation/import or future Prisma migrations are added, backend routes that expect existing tables will fail against a fresh database.

## Production Route Refresh

In production, Express serves `client/dist` and falls back to `client/dist/index.html` for Vue Router paths such as `/gis`, `/planner`, `/galleria`, and `/anagrafica`.
