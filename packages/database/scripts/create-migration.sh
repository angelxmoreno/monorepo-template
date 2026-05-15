#!/bin/bash
if [ -z "$1" ]; then
  echo "Error: migration name is required"
  echo "Usage: bun run db:migration:create <MigrationName>"
  echo "Example: bun run db:migration:create AddUserEmail"
  exit 1
fi
bun --bun typeorm migration:create --esm "src/migrations/$1"
