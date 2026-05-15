# CLAUDE.md — Project Instructions

## Project Overview

**musicalito** — a monorepo for a music video project creator. Bun workspaces with Turborepo orchestration.

## Architecture

```
apps/
  cli/              # Citty CLI — scripts, DB tasks
  marketing/        # Astro — SEO/user-facing website
  admin-dashboard/  # TanStack Start — no SSR, maintenance UI
  api/              # Hono — API server
  web/              # Vite + React — logged-in user UI

packages/
  database/         # TypeORM — entity schemas, DataSource factory, repositories
  shared-types/     # Zod schemas and shared types
  shared-be/        # Business logic service classes (BE shared)
```

## Tech Stack

- **Runtime:** Bun
- **Package Manager:** Bun (v1.2.13)
- **Build:** Turborepo
- **Lint/Format:** Biome (tabs, double quotes, organize imports)
- **Type Checking:** TypeScript strict mode
- **Git Hooks:** Lefthook (pre-commit: lint:fix + check:types, commit-msg: commitlint)
- **Commit Convention:** Conventional Commits (past tense)
- **Code Review:** Gito (local: Ollama, CI: Ollama Cloud)
- **DB:** TypeORM with EntitySchema (no decorators, no reflect-metadata)
- **Validation:** Zod (shared-types package)
- **IDs:** UUID v7
- **Soft Deletes:** Yes (deletedAt column)

## Database Conventions

- **EntitySchema** as single source of truth — no decorators, no class entities
- **InflectionNamingStrategy** for DB (snake_case columns/tables), camelCase in code — do NOT set `tableName` in schemas
- **Timestamps:** createdAt/updatedAt on every entity, auto-managed by TypeORM
- **EntitySchema → Zod sync:** EntitySchemaOptions in `schemas/*.entity.ts`, Zod schemas in `shared-types/src/entities/*.schema.ts`, manually synced (LLM-assisted)
- **File naming:** `{name}.entity.ts` for EntitySchemaOptions, `{name}.schema.ts` for Zod, `entities.ts` for all EntitySchema instances
- **Service pattern:** Apps use service classes (shared-be), not repositories directly. Repositories are data access only.
- **DataSource factory:** `createDataSourceOptions(url, overrides)` and `createDataSource(url, overrides)` — no env var coupling in the package
- **Migrations:** TypeORM CLI (user has bun-compatible solution, TBA)

## Commands

| Command             | Purpose                       |
| ------------------- | ----------------------------- |
| `bun run dev`       | Start all apps in dev mode    |
| `bun run build`     | Build all packages and apps   |
| `bun run check`     | Type checks + code quality    |
| `bun run lint`      | Lint with Biome               |
| `bun run lint:fix`  | Lint and auto-fix with Biome  |
| `bun run clean`     | Clean all build artifacts      |

## Detailed Conventions

See [docs/conventions/](./docs/conventions/README.md) for in-depth documentation:

- [Database](./docs/conventions/database.md) — EntitySchema, naming, IDs, soft deletes, service pattern, file structure

## Rules

- **NEVER use `any` type** — use proper types, `unknown`, or create custom types
- **NEVER commit without explicit user approval**
- **NEVER bypass commit hooks (`--no-verify`)**
- **No AI attribution in commit messages** — no "Generated with Claude Code", no "Co-Authored-By: Claude"
- **Conventional Commits in past tense** — `feat: added X`, not `feat: add X`
- **Monorepo scopes** — include package/app in commit scope when possible: `feat(database): added user entity`
- **Protected visibility** — favor `protected` over `private`
- **`Number.isNaN`** over `isNaN` — no type coercion
- **Run `bun check`** when done — fix all issues before declaring victory
- **Zod v4:** use `z.url()` not `z.string().url()`
- **TypeORM relationships:** wrap relation entities in `Relation<T>` type

## Gito (AI Code Review)

- **Local:** `gito review` — uses Ollama on `localhost:11434/v1/`
- **CI:** GitHub Actions workflow — uses Ollama Cloud
- **Config:** `.gito/config.toml` in repo root
- **Global config:** `~/.gito/.env`