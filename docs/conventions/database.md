# Database Conventions

## ORM & Schema Approach

- **TypeORM with EntitySchema** — no decorators, no `reflect-metadata`, no class entities
- EntitySchemaOptions are the single source of truth for database objects
- Zod schemas in `shared-types` mirror the EntitySchema definitions (manually synced, LLM-assisted)

## Naming Strategy

- **InflectionNamingStrategy** — `camelCase` in code, `snake_case` in the database
- Column keys in EntitySchema use camelCase; the naming strategy converts to snake_case for DB columns
- Table names are auto-generated from entity name: `User` → `users` (strips "Entity" suffix, snake_cases, pluralizes)
- Do NOT specify `tableName` in EntitySchemaOptions — let the naming strategy handle it
- Constraint names (FKs, indexes) follow snake_case: `{table}_{columns}_{suffix}`

## Identifiers

- **UUID v7** for all primary keys — time-sortable, no auto-increment

## Timestamps

- Every entity includes `createdAt` and `updatedAt`
- Auto-managed by TypeORM (`createDate: true`, `updateDate: true`)

## Soft Deletes

- `deletedAt` column on all entities
- TypeORM's `deleteDate: true` enables soft deletes
- Queries default to excluding soft-deleted rows

## File Naming & Structure

| What | Path | Export |
|------|------|--------|
| EntitySchemaOptions | `database/src/schemas/user.entity.ts` | `userEntitySchemaOptions` |
| EntitySchema instances | `database/src/entities.ts` | `UserEntitySchema`, `entities` array |
| Zod schema | `shared-types/src/entities/user.schema.ts` | `UserSchema` |
| Zod type | `shared-types/src/entities/user.schema.ts` | `type User = z.infer<typeof UserSchema>` |
| Zod barrel | `shared-types/src/index.ts` | Re-exports all schemas and types |
| DataSource factory | `database/src/utils/createDataSourceOptions.ts` | `createDataSourceOptions`, `createDataSource` |
| DSN parser | `database/src/utils/parseDsnString.ts` | `parseDsnString` |
| Naming strategy | `database/src/naming-strategy/InflectionNamingStrategy.ts` | `InflectionNamingStrategy` |

### Naming rules

- Entity concept name is singular: `User`, not `Users`
- `tableName` is NOT set in EntitySchemaOptions — InflectionNamingStrategy generates it
- EntitySchemaOptions files use `.entity.ts` suffix
- Zod schema files use `.schema.ts` suffix
- Export names: `{Name}EntitySchema`, `{Name}Schema` (PascalCase)
- Variable names: `{name}EntitySchemaOptions` (camelCase)

## Service Pattern

- **Repositories** — data access only (CRUD + queries)
- **Service classes** (`shared-be`) — business logic, wrap repositories
- **Apps** — consume services, never repositories directly

```
App → Service → Repository → Database
```

## DataSource Factory

- `createDataSourceOptions(url, overrides)` — builds DataSource options from a connection URL + overrides object
- `createDataSource(url, overrides)` — creates a DataSource (not initialized)
- The `database` package does NOT read env vars — callers provide the connection URL explicitly
- Exception: `apps/cli` may read env vars for DB tasks (via `dataSource.ts`)
- `entities` array is imported from `entities.ts` — add new entities there
- `parseDsnString` handles mysql, postgres, and sqlite URLs with query param support

## Migrations

- Generated and run via TypeORM CLI
- `dataSource.ts` exists for CLI migration commands only
- Bun-compatible migration setup (details TBD)

## EntitySchema → Zod Sync Flow

1. Define/update EntitySchemaOptions in `database/src/schemas/{name}.entity.ts`
2. Add EntitySchema instance to `database/src/entities.ts`
3. Create matching Zod schema in `shared-types/src/entities/{name}.schema.ts`
4. Export from `shared-types/src/index.ts`
5. Export TypeScript type derived from Zod: `type User = z.infer<typeof UserSchema>`

## Full Directory Structure

```
packages/database/
  src/
    schemas/                          # EntitySchemaOptions per entity
      user.entity.ts                  # userEntitySchemaOptions
    entities.ts                       # All EntitySchema instances + entities array
    index.ts                          # Package barrel exports
    naming-strategy/
      InflectionNamingStrategy.ts      # Custom naming strategy
      utils.ts                         # pluralize, toSnakeCaseAcronymSafe
    utils/
      createDataSourceOptions.ts       # DataSource factory functions
      parseDsnString.ts               # URL → DataSourceOptions parser
    dataSource.ts                     # CLI-only DataSource (reads env vars)

packages/shared-types/
  src/
    entities/                         # Zod schemas per entity
      user.schema.ts                  # UserSchema, type User
    index.ts                          # Barrel exports

packages/shared-be/
  src/
    services/                         # Business logic classes
```