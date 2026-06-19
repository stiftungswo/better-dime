#!/usr/bin/env bash
# Regenerate OpenAPI spec from request specs, then generate frontend TypeScript types.
# Run from the repo root.
set -euo pipefail

docker compose exec apir bash -c "rm -f doc/openapi.yaml && OPENAPI=1 bundle exec rspec spec/requests/ --order defined"
(cd frontend && npm run generate:types)
