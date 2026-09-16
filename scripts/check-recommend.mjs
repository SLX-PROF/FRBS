// Самопроверка логики подбора. Запуск: node scripts/check-recommend.mjs
// (Node >=23.6 снимает типы с .ts налету.)
import assert from 'node:assert/strict'
import { recommendModels, producibleLength } from '../src/lib/recommend.ts'

const P = [
  { id: 1, slug: 'narrow', title: 'Narrow', type: 'врезной', minDoorWidth: 300, sortOrder: 1 },
  { id: 2, slug: 'mid', title: 'Mid', type: 'врезной', minDoorWidth: 600, sortOrder: 2 },
  { id: 3, slug: 'surface-wide', title: 'Surface wide', type: 'накладной', minDoorWidth: 900, sortOrder: 3 },
]

// 1. Дверь уже всех минимумов → ничего не подходит.
{
  const r = recommendModels(P, { doorWidth: 250, mount: 'unknown' })
  assert.equal(r.primary, null)
  assert.deepEqual(r.alternates, [])
}

// 2. Точный тип монтажа фильтрует накладной вариант.
{
  const r = recommendModels(P, { doorWidth: 1000, mount: 'врезной' })
  assert.equal(r.primary.slug, 'mid') // меньший запас (1000-600) чем у narrow (1000-300)
  assert.ok(r.alternates.every((p) => p.type === 'врезной'))
  assert.ok(!r.alternates.some((p) => p.slug === 'surface-wide'))
}

// 3. mount:unknown пропускает оба типа, самый "тесный" — накладной 900.
{
  const r = recommendModels(P, { doorWidth: 950, mount: 'unknown' })
  assert.equal(r.primary.slug, 'surface-wide')
}

// 4. Модель без minDoorWidth всегда подходит, но уходит в конец списка.
{
  const r = recommendModels(
    [...P, { id: 4, slug: 'any', title: 'Any', type: 'врезной', minDoorWidth: null, sortOrder: 9 }],
    { doorWidth: 700, mount: 'врезной' },
  )
  assert.equal(r.primary.slug, 'mid')
  assert.equal(r.alternates.at(-1).slug, 'any')
}

// 5. Производимая длина: шаг 200 вверх, подрез в пределах 200.
{
  assert.deepEqual(producibleLength(810), { nominal: 1000, trim: 190 })
  assert.deepEqual(producibleLength(800), { nominal: 800, trim: 0 })
}

console.log('check-recommend: OK')
