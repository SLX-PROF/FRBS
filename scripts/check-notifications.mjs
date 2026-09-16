// Самопроверка селекторов уведомлений. Запуск: node scripts/check-notifications.mjs
import assert from 'node:assert/strict'
import { selectStaleDeals, buildDigest, relId } from '../src/lib/notification-selectors.ts'

const now = new Date('2026-08-28T12:00:00Z')
const day = 86_400_000
const iso = (d) => new Date(now.getTime() - d * day).toISOString()

const deals = [
  { id: 1, stage: 'proposal', updatedAt: iso(10), owner: 1, title: 'A' }, // просрочена
  { id: 2, stage: 'proposal', updatedAt: iso(1), owner: 1, title: 'B' }, // свежая
  { id: 3, stage: 'won', updatedAt: iso(30), owner: 2, title: 'C' }, // закрыта — игнор
  { id: 4, stage: 'negotiation', updatedAt: iso(6), owner: 2, title: 'D' }, // просрочена
  { id: 5, stage: 'lost', updatedAt: iso(99), owner: 2, title: 'E' }, // закрыта — игнор
]

const stale = selectStaleDeals(deals, { now, slaDays: 5 })
assert.deepEqual(stale.map((d) => d.id), [1, 4])

const users = [{ id: 1 }, { id: 2 }, { id: 3 }]
const tasks = [{ assignee: 1 }, { assignee: 1 }, { assignee: 2 }]
const digest = buildDigest(users, tasks, stale.map((d) => ({ owner: d.owner })))
assert.deepEqual(digest, [
  { userId: 1, openTasks: 2, staleDeals: 1 },
  { userId: 2, openTasks: 1, staleDeals: 1 },
  // user 3 — ни задач, ни сделок → исключён
])

// relId: id, объект, null
assert.equal(relId(7), 7)
assert.equal(relId({ id: 7 }), 7)
assert.equal(relId(null), null)
assert.equal(relId(undefined), null)

console.log('check-notifications: OK')
