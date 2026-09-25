#!/usr/bin/env bash
# Деплой на VPS с малой памятью (1,3 ГБ): на время сборки образа web остановлен,
# иначе сборка + работающий web не помещаются в память и сервер зависает или убивает процессы.
# Запуск на сервере:  cd /opt/forbsa-site && git pull && bash scripts/deploy.sh
# Если у релиза есть SQL-миграция (scripts/manual-migrate-*.sql), примени её ДО этого скрипта.
set -euo pipefail
cd /opt/forbsa-site
C="docker compose -f Docker-compose.yml"

touch /run/forbsa-maintenance            # сторож на время деплоя молчит
trap 'rm -f /run/forbsa-maintenance' EXIT

git pull --ff-only
$C stop web
if $C build web; then
  $C up -d
else
  echo "Сборка не удалась: возвращаю прежнюю версию"
  $C start web
  exit 1
fi

for _ in $(seq 1 12); do
  if curl -fsS --max-time 5 http://127.0.0.1:3000/api/health >/dev/null 2>&1; then
    echo "Готово: сайт отвечает"
    exit 0
  fi
  sleep 5
done
echo "web не ответил за 60 секунд. Смотри: $C logs --tail=50 web"
exit 1
