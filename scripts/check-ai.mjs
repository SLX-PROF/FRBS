// Самопроверка ретривера. Запуск: node scripts/check-ai.mjs
import assert from 'node:assert/strict'
import { cosine, rankChunks } from '../src/lib/ai/similarity.ts'
import { mockEmbed } from '../src/lib/ai/mock.ts'

// косинус
assert.equal(cosine([1, 0, 0], [1, 0, 0]), 1)
assert.equal(cosine([1, 0, 0], [0, 1, 0]), 0)
assert.ok(Math.abs(cosine([1, 1, 0], [1, 0, 0]) - Math.SQRT1_2) < 1e-6)
assert.equal(cosine([0, 0], [1, 1]), 0) // нулевой вектор

// мок-эмбеддинг: детерминирован, общие слова → выше сходство
const a = mockEmbed('автоматический порог для двери шириной 900 мм')
const b = mockEmbed('порог для двери 900')
const c = mockEmbed('гарантия нержавеющая сталь пружина')
assert.deepEqual(mockEmbed('порог для двери 900'), b)
assert.ok(cosine(a, b) > cosine(a, c))

// rankChunks выбирает лексически близкий фрагмент
const chunks = [
  'Модель Forbsa TT. Минимальная ширина двери: 200 мм. Тип монтажа: врезной.',
  'Модель Forbsa Aluma. Гарантия: 10 лет. Особенности: нержавеющая сталь.',
].map((text) => ({ text, embedding: mockEmbed(text) }))
const q = mockEmbed('какой порог для узкой двери минимальная ширина')
assert.ok(rankChunks(q, chunks, 1)[0].text.includes('Forbsa TT'))

console.log('check-ai: OK')
