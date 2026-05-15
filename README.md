# musicalito

A monorepo for Musicalito — music video project creator.

## Structure

```
apps/
  cli/              # Citty CLI for scripts and DB tasks
  marketing/        # Astro — SEO/user-facing website
  admin-dashboard/  # TanStack Start — no SSR, maintenance UI
  api/              # Hono — API server
  web/              # Vite + React — logged-in user UI

packages/
  database/         # TypeORM — entity schemas, DataSource factory, migrations
  shared-types/     # Zod schemas and shared types
  shared-be/        # Business logic service classes (BE shared)
```

## Setup

```bash
bun install
```

## Scripts

| Command                  | Description                    |
| ------------------------ | ------------------------------ |
| `bun run dev`            | Start all apps in dev mode     |
| `bun run build`          | Build all packages and apps    |
| `bun run check`          | Run type checks and code check |
| `bun run lint`           | Lint with Biome                |
| `bun run lint:fix`       | Lint and fix with Biome        |
| `bun run clean`          | Clean all build artifacts      |
| `bun run docker:up`      | Start core services            |
| `bun run docker:down`    | Stop core services             |
| `bun run docker:up:hatchet` | Start Hatchet services      |
| `bun run docker:down:hatchet` | Stop Hatchet services    |
| `bun run db:migration:create` | Create empty migration   |
| `bun run db:migration:generate` | Generate migration from diff |
| `bun run db:migration:show` | Show migration status       |
| `bun run db:migration:run`  | Run pending migrations       |
| `bun run db:migration:revert` | Revert last migration     |

## Docker Services

### Core services (`docker-compose.yml`)

| Service  | Port(s)     | Description              |
| -------- | ----------- | ------------------------ |
| MariaDB  | 3306        | Primary database         |
| Valkey   | 6379        | Redis-compatible cache   |
| Minio    | 9000, 9001  | S3-compatible object store (console on 9001) |

```bash
bun run docker:up
```

### Hatchet (`docker-compose.hatchet.yml`)

| Service          | Port(s)      | Description                |
| ---------------- | ------------ | -------------------------- |
| Hatchet Engine   | 7077, 7078   | Task queue (API + gRPC)    |
| Postgres         | —            | Hatchet metadata database  |
| RabbitMQ         | 15672        | Message broker (management) |
| Redis            | —            | Hatchet queue state        |

```bash
bun run docker:up:hatchet
```

### Default credentials (development only)

| Service  | User          | Password        |
| -------- | ------------- | --------------- |
| MariaDB  | musicalito    | musicalito      |
| Minio    | musicalito    | musicalito123   |
| Hatchet  | hatchet       | hatchet         |

## AI Code Review (Gito)

This project uses [Gito](https://github.com/Nayjest/Gito) for AI-powered code reviews.

### Local Reviews

1. Install: `pip install gito.bot`
2. Configure: `gito setup` (point to Ollama at `localhost:11434/v1/`)
3. Run: `gito review` (before pushing, compares branch against main)

### CI Reviews (GitHub Actions)

The workflow runs automatically on PRs. Requires these GitHub repo settings:

**Secrets** (Settings > Secrets and variables > Actions > Secrets):
- `LLM_API_KEY` — your Ollama Cloud API key

**Variables** (Settings > Secrets and variables > Actions > Variables):
- `LLM_API_BASE` — API endpoint (default: `https://api.ollama.com/v1/`)
- `MODEL` — model to use (default: `deepseek-v4-pro:cloud`)

### Conventions

See [docs/conventions/](./docs/conventions/README.md) for project-wide standards and architecture decisions.

### Project Config

Review settings live in `.gito/config.toml`. Edit it to change exclusion rules, mention triggers, or review requirements.