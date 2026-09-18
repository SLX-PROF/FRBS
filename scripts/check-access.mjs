// Самопроверка RBAC-хелперов. Запуск: node scripts/check-access.mjs
import assert from 'node:assert/strict'
import {
  isOwner,
  isProductStaff,
  isStaff,
  ownedOrUnassigned,
  ownedOnly,
  activityScope,
  ownerOnly,
  productStaffOnly,
} from '../src/lib/access.ts'

const owner = { id: 1, role: 'owner' }
const productAdmin = { id: 3, role: 'admin' } // «Администратор (товары)» — не участник CRM-конвейера
const mgr = { id: 2, role: 'manager' }
const anon = null

// роли
assert.equal(isOwner(owner), true)
assert.equal(isOwner(productAdmin), false)
assert.equal(isOwner(mgr), false)
assert.equal(isStaff(owner), true)
assert.equal(isStaff(mgr), true)
assert.equal(isStaff(productAdmin), false) // ключевая проверка: admin (товары) вне CRM-роли staff
assert.equal(isStaff(anon), false)
assert.equal(isProductStaff(owner), true)
assert.equal(isProductStaff(productAdmin), true)
assert.equal(isProductStaff(mgr), false)

// ownedOrUnassigned: владелец видит всё, менеджер — свои и ничьи, admin(товары)/гость — ничего
const ou = ownedOrUnassigned('owner')
assert.equal(ou({ req: { user: owner } }), true)
assert.deepEqual(ou({ req: { user: mgr } }), {
  or: [{ owner: { equals: 2 } }, { owner: { exists: false } }],
})
assert.equal(ou({ req: { user: productAdmin } }), false)
assert.equal(ou({ req: { user: anon } }), false)

// ownedOnly: менеджер — строго свои
const oo = ownedOnly('owner')
assert.equal(oo({ req: { user: owner } }), true)
assert.deepEqual(oo({ req: { user: mgr } }), { owner: { equals: 2 } })
assert.equal(oo({ req: { user: productAdmin } }), false)
assert.equal(oo({ req: { user: anon } }), false)

// activityScope: автор или владелец сделки
assert.deepEqual(activityScope({ req: { user: mgr } }), {
  or: [{ author: { equals: 2 } }, { 'deal.owner': { equals: 2 } }],
})
assert.equal(activityScope({ req: { user: owner } }), true)
assert.equal(activityScope({ req: { user: productAdmin } }), false)

// ownerOnly (например, delete на Заявках/Сделках/Компаниях)
assert.equal(ownerOnly({ req: { user: mgr } }), false)
assert.equal(ownerOnly({ req: { user: productAdmin } }), false)
assert.equal(ownerOnly({ req: { user: owner } }), true)

// productStaffOnly (Товары/Медиа)
assert.equal(productStaffOnly({ req: { user: mgr } }), false)
assert.equal(productStaffOnly({ req: { user: productAdmin } }), true)
assert.equal(productStaffOnly({ req: { user: owner } }), true)

console.log('check-access: OK')
