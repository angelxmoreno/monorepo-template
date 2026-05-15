#!/bin/bash
if [ -z "$1" ]; then
  echo "Error: migration name is required"
  echo "Usage: bun run db:migration:generate <MigrationName>"
  echo "Example: bun run db:migration:generate AddUserEmail"
  exit 1
fi
bun --bun typeorm migration:generate -d src/dataSource.ts -p --esm "src/migrations/$1"