// Самопроверка RBAC-хелперов. Запуск: node scripts/check-access.mjs
import assert from 'node:assert/strict'
import { isAdmin, isStaff, ownedOrUnassigned, ownedOnly, activityScope, adminOnly } from '../src/lib/access.ts'

const admin = { id: 1, role: 'admin' }
const mgr = { id: 2, role: 'manager' }
const anon = null

// роли
assert.equal(isAdmin(admin), true)
assert.equal(isAdmin(mgr), false)
assert.equal(isStaff(mgr), true)
assert.equal(isStaff(anon), false)

// ownedOrUnassigned: админ видит всё, менеджер — свои и ничьи, гость — ничего
const ou = ownedOrUnassigned('owner')
assert.equal(ou({ req: { user: admin } }), true)
assert.deepEqual(ou({ req: { user: mgr } }), {
  or: [{ owner: { equals: 2 } }, { owner: { exists: false } }],
})
assert.equal(ou({ req: { user: anon } }), false)

// ownedOnly: менеджер — строго свои
const oo = ownedOnly('owner')
assert.equal(oo({ req: { user: admin } }), true)
assert.deepEqual(oo({ req: { user: mgr } }), { owner: { equals: 2 } })
assert.equal(oo({ req: { user: anon } }), false)

// activityScope: автор или владелец сделки
assert.deepEqual(activityScope({ req: { user: mgr } }), {
  or: [{ author: { equals: 2 } }, { 'deal.owner': { equals: 2 } }],
})
assert.equal(activityScope({ req: { user: admin } }), true)

// adminOnly (например, delete)
assert.equal(adminOnly({ req: { user: mgr } }), false)
assert.equal(adminOnly({ req: { user: admin } }), true)

console.log('check-access: OK')
