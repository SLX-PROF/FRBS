// Косинусное сходство и ранжирование — брутфорс по всей базе.
// Корпус крошечный (10 моделей), pgvector не нужен; если база вырастет —
// вынести в расширение vector.

export function cosine(a: number[], b: number[]): number {
  let dot = 0
  let na = 0
  let nb = 0
  const n = Math.min(a.length, b.length)
  for (let i = 0; i < n; i++) {
    dot += a[i] * b[i]
    na += a[i] * a[i]
    nb += b[i] * b[i]
  }
  if (na === 0 || nb === 0) return 0
  return dot / (Math.sqrt(na) * Math.sqrt(nb))
}

export type Chunk<T = unknown> = { text: string; embedding: number[]; meta?: T }

export function rankChunks<T>(queryVec: number[], chunks: Chunk<T>[], k: number): Chunk<T>[] {
  return chunks
    .map((c) => ({ c, score: cosine(queryVec, c.embedding) }))
    .sort((x, y) => y.score - x.score)
    .slice(0, k)
    .map((x) => x.c)
}
