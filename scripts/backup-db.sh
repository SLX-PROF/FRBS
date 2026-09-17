#!/bin/bash
# Daily Postgres dump. Run from the repo root (cron sets that as cwd via `cd`
# below regardless). Keeps 14 days locally — this is NOT offsite, if the VPS
# disk dies these die with it; copy backups/ elsewhere periodically too.
set -euo pipefail
cd "$(dirname "$0")/.."

set -a
source .env
set +a

mkdir -p backups
stamp=$(date +%Y%m%d_%H%M%S)
docker compose -f Docker-compose.yml exec -T db \
  pg_dump -U "${POSTGRES_USER:-forbsa}" -d "${POSTGRES_DB:-forbsa}" \
  | gzip > "backups/forbsa_${stamp}.sql.gz"

find backups -name 'forbsa_*.sql.gz' -mtime +14 -delete
