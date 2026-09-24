#!/usr/bin/env bash
# Сторож сайта. Раз в минуту проверяет /api/health; после 3 сбоев подряд поднимает
# упавшие контейнеры и перезапускает web (при необходимости — сам docker).
# Уведомление в Telegram — если в .env заданы TELEGRAM_BOT_TOKEN и WATCHDOG_TELEGRAM_CHAT_ID.
#
# Установка на сервере (root):
#   dnf install -y cronie && systemctl enable --now crond
#   chmod +x /opt/forbsa-site/scripts/watchdog.sh
#   echo '* * * * * root /opt/forbsa-site/scripts/watchdog.sh' > /etc/cron.d/forbsa-watchdog
# Лог: /var/log/forbsa-watchdog.log
set -u
DIR=/opt/forbsa-site
STATE=/run/forbsa-watchdog.fails
LOG=/var/log/forbsa-watchdog.log
URL=http://127.0.0.1:3000/api/health
COMPOSE="docker compose -f Docker-compose.yml"

cd "$DIR" || exit 1
log() { echo "$(date '+%F %T') $*" >> "$LOG"; }

notify() {
  local token chat
  token=$(grep -E '^TELEGRAM_BOT_TOKEN=' .env | cut -d= -f2-)
  chat=$(grep -E '^WATCHDOG_TELEGRAM_CHAT_ID=' .env | cut -d= -f2-)
  [ -n "$token" ] && [ -n "$chat" ] || return 0
  curl -fsS --max-time 10 "https://api.telegram.org/bot${token}/sendMessage" \
    --data-urlencode "chat_id=${chat}" --data-urlencode "text=$1" >/dev/null 2>&1 || true
}

if curl -fsS --max-time 15 "$URL" >/dev/null 2>&1; then
  if [ -f "$STATE" ]; then rm -f "$STATE"; log "recovered"; fi
  exit 0
fi

n=$(( $(cat "$STATE" 2>/dev/null || echo 0) + 1 ))
echo "$n" > "$STATE"
log "health fail #$n"
[ "$n" -ge 3 ] || exit 0

# 3 сбоя подряд (~3 минуты)
log "restarting"
if ! docker info >/dev/null 2>&1; then systemctl restart docker; sleep 15; fi
$COMPOSE up -d >> "$LOG" 2>&1
$COMPOSE restart web >> "$LOG" 2>&1
echo 0 > "$STATE"
notify "FORBSA: сайт не отвечал 3 минуты, web перезапущен ($(hostname))"
