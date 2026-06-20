#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
API_BASE_URL="${API_BASE_URL:-http://localhost:38001}"
MYSQL_HOST="${MYSQL_HOST:-127.0.0.1}"
MYSQL_PORT="${MYSQL_PORT:-33306}"

cd "$ROOT_DIR"

echo "==> Starting API stack..."
docker compose up -d mysql apir

echo "==> Waiting for MySQL..."
until docker compose exec -T mysql mysqladmin ping -s 2>/dev/null; do
  sleep 2
done

echo "==> Seeding test data (SQL)..."
docker compose exec -T mysql mysql -uroot dime < "$SCRIPT_DIR/src/helpers/seed.sql" 2>/dev/null \
  || echo "    (seed skipped — database may not exist yet; will retry after schema load)"

echo "==> Waiting for API to be healthy..."
until curl -sf "$API_BASE_URL/health" > /dev/null 2>&1; do
  sleep 2
done
echo "==> API is healthy."

echo "==> Re-seeding (in case schema was just loaded)..."
docker compose exec -T mysql mysql -uroot dime < "$SCRIPT_DIR/src/helpers/seed.sql"

cd "$SCRIPT_DIR"

if [ ! -d node_modules ]; then
  echo "==> Installing dependencies..."
  npm install
fi

echo "==> Generating types from OpenAPI schema..."
npm run generate-types

echo "==> Running integration tests..."
API_BASE_URL="$API_BASE_URL" npx vitest run
