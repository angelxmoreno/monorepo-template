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
  database/         # TypeORM — database management and exports
  shared-types/     # Zod schemas and shared types
  shared-be/        # Business logic service classes (BE shared)
```

## Setup

```bash
bun install
```

## Scripts

| Command             | Description                    |
| ------------------- | ------------------------------ |
| `bun run dev`       | Start all apps in dev mode     |
| `bun run build`     | Build all packages and apps    |
| `bun run check`     | Run type checks and code check |
| `bun run lint`      | Lint with Biome                |
| `bun run lint:fix`  | Lint and fix with Biome        |
| `bun run clean`     | Clean all build artifacts      |

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
- `MODEL` — model to use (default: `llama3`)

### Project Config

Review settings live in `.gito/config.toml`. Edit it to change exclusion rules, mention triggers, or review requirements.