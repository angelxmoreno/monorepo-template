# Database Conventions

## ORM & Schema Approach

- **TypeORM with EntitySchema** — no decorators, no `reflect-metadata`, no class entities
- EntitySchema definitions are the single source of truth for database objects
- Zod schemas in `shared-types/src/entities/` mirror the EntitySchema definitions (manually synced, LLM-assisted)

## Naming Strategy

- **SnakeNamingStrategy** — `camelCase` in code, `snake_case` in the database
- Column keys in EntitySchema use camelCase; the naming strategy converts to snake_case for DB columns
- Table names follow the same conversion: `userProfile` → `user_profile`
- Constraint names (FKs, indexes) also follow snake_case conventions

## Identifiers

- **UUID v7** for all primary keys — time-sortable, no auto-increment

## Timestamps

- Every entity includes `createdAt` and `updatedAt`
- Auto-managed by TypeORM (`CreateDateColumn`, `UpdateDateColumn`)

## Soft Deletes

- `deletedAt` column on all entities
- TypeORM's `delete()` sets `deletedAt` instead of hard-deleting
- Queries default to excluding soft-deleted rows

## Service Pattern

- **Repositories** — data access only (CRUD + queries)
- **Service classes** (`shared-be`) — business logic, wrap repositories
- **Apps** — consume services, never repositories directly

```
App → Service → Repository → Database
```

## DataSource Factory

- `createDataSourceOptions(url, overrides)` — builds DataSource options from a connection URL + overrides object
- `createDataSource(url, overrides)` — creates and initializes a DataSource
- The `database` package does NOT read env vars — callers provide the connection URL explicitly
- Exception: `apps/cli` may read env vars for DB tasks

## Migrations

- Generated and run via TypeORM CLI
- Bun-compatible migration setup (details TBD)

## EntitySchema → Zod Sync Flow

1. Define/update EntitySchema in `packages/database`
2. Create matching Zod schema in `packages/shared-types/src/entities/`
3. Export TypeScript types derived from Zod schemas: `type User = z.infer<typeof UserSchema>`

## File Structure

```
packages/database/
  src/
    entities/           # EntitySchema definitions
    repositories/       # TypeORM repositories (if custom queries needed)
    data-source.ts      # createDataSourceOptions, createDataSource
    naming-strategy.ts  # SnakeNamingStrategy

packages/shared-types/
  src/
    entities/           # Zod schemas mirroring EntitySchema definitions

packages/shared-be/
  src/
    services/           # Business logic classes
```