// Ограничитель частоты запросов. In-memory, скользящее окно.
// ponytail: Map в памяти процесса — хватает для одного инстанса за nginx.
// При масштабировании на >1 реплику заменить на Redis (INCR + EXPIRE).

type Hit = { count: number; resetAt: number }

const buckets = new Map<string, Hit>()
const MAX_BUCKETS = 20_000

function sweep(now: number) {
  for (const [k, v] of buckets) if (now >= v.resetAt) buckets.delete(k)
}

export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number },
): { ok: boolean; retryAfter: number } {
  const now = Date.now()
  // Не даём карте расти без предела (ключ зависит от IP-заголовков клиента).
  if (buckets.size > MAX_BUCKETS) sweep(now)

  const hit = buckets.get(key)

  if (!hit || now >= hit.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, retryAfter: 0 }
  }

  hit.count += 1
  if (hit.count > limit) {
    return { ok: false, retryAfter: Math.ceil((hit.resetAt - now) / 1000) }
  }
  return { ok: true, retryAfter: 0 }
}

/**
 * IP клиента. Схема развёртывания — ровно один обратный прокси (nginx) перед
 * приложением: он ставит X-Real-IP = реальный peer и добавляет свой хоп в конец
 * X-Forwarded-For. Поэтому берём X-Real-IP, а из XFF — ПОСЛЕДНИЙ хоп (его
 * дописал nginx), но не первый — первый клиент может подделать.
 * Если фронт-прокси не гарантирован, заголовкам доверять нельзя.
 */
export function clientKey(req: Request, scope: string): string {
  const realIp = req.headers.get('x-real-ip')?.trim()
  const xffHops = (req.headers.get('x-forwarded-for') || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  const ip = realIp || xffHops[xffHops.length - 1] || 'local'
  return `${scope}:${ip}`
}

/** Тест использует это, чтобы не ждать реального окна. */
export function _reset() {
  buckets.clear()
}
