# @repo/typescript-config

Centralized TypeScript configurations for the monorepo.

## Architecture

This package provides a hierarchical TypeScript configuration system:

```
tsconfig.json (base)
├── tsconfig.apps.json (base + app-specific)
└── tsconfig.packages.json (base + package-specific)
```

## Configurations

### `tsconfig.json` (Base)

Core TypeScript settings shared across all projects:
- ESNext target with bundler module resolution
- Strict mode enabled with additional strict flags
- `verbatimModuleSyntax` for tree-shaking
- `noUncheckedIndexedAccess` and `noImplicitOverride`

### `tsconfig.apps.json`

Extends base configuration for applications:
- Apps are end consumers, not dependencies
- Declarations disabled (no `composite`, no `declaration`, no `declarationMap`)

### `tsconfig.packages.json`

Extends base configuration for internal packages:
- Packages produce declarations for consumers
- `composite`, `declaration`, and `declarationMap` enabled

## Usage

### For Apps (CLI, Web, API)
```json
{
  "extends": "@repo/typescript-config/tsconfig.apps.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  }
}
```

### For Packages (database, shared-types, shared-be)
```json
{
  "extends": "@repo/typescript-config/tsconfig.packages.json"
}
```