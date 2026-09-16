// Самопроверка ограничителя. Запуск: node scripts/check-ratelimit.mjs
import assert from 'node:assert/strict'
import { rateLimit, clientKey, _reset } from '../src/lib/rateLimit.ts'

_reset()

// 3 запроса проходят, 4-й — нет.
const opts = { limit: 3, windowMs: 50 }
assert.equal(rateLimit('k', opts).ok, true)
assert.equal(rateLimit('k', opts).ok, true)
assert.equal(rateLimit('k', opts).ok, true)
const blocked = rateLimit('k', opts)
assert.equal(blocked.ok, false)
assert.ok(blocked.retryAfter >= 0)

// Другой ключ не затронут.
assert.equal(rateLimit('other', opts).ok, true)

// После окна счётчик сбрасывается.
await new Promise((r) => setTimeout(r, 60))
assert.equal(rateLimit('k', opts).ok, true)

// clientKey: X-Real-IP приоритетнее; из XFF берётся ПОСЛЕДНИЙ хоп (его ставит
// nginx), а не первый (первый клиент подделывает).
assert.equal(
  clientKey(new Request('http://x', { headers: { 'x-forwarded-for': '1.2.3.4, 10.0.0.1' } }), 'leads'),
  'leads:10.0.0.1',
)
assert.equal(
  clientKey(new Request('http://x', { headers: { 'x-real-ip': '9.9.9.9', 'x-forwarded-for': 'spoofed, 10.0.0.1' } }), 'leads'),
  'leads:9.9.9.9',
)
assert.equal(clientKey(new Request('http://x'), 'leads'), 'leads:local')

console.log('check-ratelimit: OK')
