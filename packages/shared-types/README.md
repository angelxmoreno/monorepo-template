# @repo/shared-types

Zod schemas and shared types for the musicalito monorepo.

## Purpose

- Define Zod validation schemas that mirror EntitySchema definitions from `@repo/database`
- Export TypeScript types derived from Zod schemas
- Share validated shapes between apps and packages without coupling to business logic

## Usage

```ts
import { UserSchema } from "@repo/shared-types";

type User = z.infer<typeof UserSchema>;
```

## Conventions

- Schemas live in `src/entities/` — one file per entity, matching `@repo/database` EntitySchema definitions
- Types are derived from schemas: `type User = z.infer<typeof UserSchema>`
- EntitySchema is the source of truth; Zod schemas are manually synced (LLM-assisted)
- No business logic in this package — only validation shapes and types