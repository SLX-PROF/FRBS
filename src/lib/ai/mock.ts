// Мок-провайдер: без внешних вызовов. Эмбеддинг — мешок слов по хешам в
// вектор фикс. размера, поэтому тексты с общими словами близки по косинусу
// (retrieval реально работает для проверки). Ответ — заглушка с пометкой.

const DIM = 256

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2)
}

function hash(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0) % DIM
}

export function mockEmbed(text: string): number[] {
  const v = new Array(DIM).fill(0)
  for (const w of tokenize(text)) v[hash(w)] += 1
  const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1
  return v.map((x) => x / norm)
}

export const MockProvider = {
  name: 'mock' as const,
  async embed(texts: string[]): Promise<number[][]> {
    return texts.map(mockEmbed)
  },
  async chat(
    messages: { role: 'system' | 'user' | 'assistant'; content: string }[],
  ): Promise<string> {
    const sys = messages.find((m) => m.role === 'system')?.content ?? ''
    const lastUser = [...messages].reverse().find((m) => m.role === 'user')?.content ?? ''
    const ctxLine = (sys.split('КОНТЕКСТ:')[1] ?? '').split('\n').map((s) => s.trim()).find(Boolean)
    const wantsLead = /цена|стоим|купить|прайс|кп|коммерческ|сколько стоит|заказать/i.test(lastUser)
    const base = ctxLine
      ? `По вашему вопросу из каталога подходит: ${ctxLine}`
      : 'В демо-режиме я отвечаю по каталогу порогов FORBSA. Уточните модель или задачу.'
    return `[демо-режим — подключите YANDEX_API_KEY] ${base}${wantsLead ? '\n\nЗа точной ценой и подбором лучше связать вас с инженером. [[LEAD]]' : ''}`
  },
}
