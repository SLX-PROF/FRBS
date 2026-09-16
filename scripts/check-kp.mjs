// Самопроверка расчётов КП. Запуск: node scripts/check-kp.mjs
import assert from 'node:assert/strict'
import { kpNumber, lineSum, computeTotals } from '../src/lib/pdf/number.ts'

// номер
assert.equal(kpNumber(42, new Date('2026-08-28T10:00:00Z')), 'КП-42-20260828')
assert.equal(kpNumber(7, new Date('2026-01-05T00:00:00Z')), 'КП-7-20260105')

// строка
assert.equal(lineSum({ qty: 3, unitPrice: 1500 }), 4500)
assert.equal(lineSum({ qty: null, unitPrice: 999 }), 999) // qty по умолчанию 1
assert.equal(lineSum({ unitPrice: 0 }), 0)

// позиции + НДС в цене
{
  const t = computeTotals([{ qty: 2, unitPrice: 6000 }, { qty: 1, unitPrice: 3000 }], null, true)
  assert.equal(t.total, 15000)
  assert.equal(t.vat, 2500) // 15000 - 15000/1.2
  assert.ok(/500,00.*₽/.test(t.vatNote) && t.vatNote.includes('НДС 20%'))
}

// позиции + без НДС
{
  const t = computeTotals([{ qty: 1, unitPrice: 10000 }], null, false)
  assert.equal(t.total, 10000)
  assert.equal(t.vat, 0)
  assert.equal(t.vatNote, 'НДС не облагается')
}

// без позиций — берём сумму сделки
{
  const t = computeTotals([], 50000, true)
  assert.equal(t.total, 50000)
  assert.equal(t.vat, Math.round((50000 - 50000 / 1.2) * 100) / 100)
}

// без позиций и без суммы — ноль
assert.equal(computeTotals([], null, true).total, 0)

console.log('check-kp: OK')
