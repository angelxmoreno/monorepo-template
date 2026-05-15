#!/bin/bash
if [ -z "$1" ]; then
  echo "Error: migration name is required"
  echo "Usage: bun run db:migration:create <MigrationName>"
  echo "Example: bun run db:migration:create AddUserEmail"
  exit 1
fi
if [[ ! "$1" =~ ^[A-Za-z_][A-Za-z0-9_]*$ ]]; then
  echo "Error: migration name must be a valid identifier (letters, numbers, underscore; cannot start with a number)"
  exit 1
fi
bun --bun typeorm migration:create --esm "src/migrations/$1"
