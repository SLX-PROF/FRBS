import { getProvider } from './provider'
import { rankChunks, type Chunk } from './similarity'

type ProductLike = {
  id: number
  title: string
  slug: string
  series?: string | null
  type?: string | null
  minDoorWidth?: number | null
  warranty?: number | null
  features?: string | null
  package?: string | null
  recommendation?: string | null
  compatibleProfiles?: string | null
}

type PayloadLike = {
  find: (o: unknown) => Promise<{ docs: any[] }>
  create: (o: unknown) => Promise<any>
  delete: (o: unknown) => Promise<any>
  logger: { error: (o: unknown) => void }
}

/** Один фрагмент базы знаний на модель — все значимые поля в один текст. */
export function productChunkText(p: ProductLike): string {
  return [
    `Модель: ${p.title}`,
    p.series && `Серия: ${p.series}`,
    p.type && `Тип монтажа: ${p.type}`,
    p.minDoorWidth != null && `Минимальная ширина двери: ${p.minDoorWidth} мм`,
    p.warranty != null && `Гарантия: ${p.warranty} лет`,
    p.features && `Особенности: ${p.features}`,
    p.package && `Комплектация: ${p.package}`,
    p.recommendation && `Рекомендация: ${p.recommendation}`,
    p.compatibleProfiles && `Совместимые профили: ${p.compatibleProfiles}`,
  ]
    .filter(Boolean)
    .join('. ')
}

async function writeChunk(payload: PayloadLike, p: ProductLike, vector: number[]) {
  await payload.create({
    collection: 'kb-chunks',
    overrideAccess: true,
    data: { source: 'product', refId: p.id, refSlug: p.slug, text: productChunkText(p), embedding: vector },
  })
}

/** Полная переиндексация всех моделей. */
export async function reindexProducts(payload: PayloadLike): Promise<number> {
  const provider = getProvider()
  const { docs } = await payload.find({ collection: 'products', limit: 100, depth: 0 })
  const texts = docs.map((p) => productChunkText(p))
  const vectors = texts.length ? await provider.embed(texts, 'doc') : []

  const existing = await payload.find({ collection: 'kb-chunks', limit: 1000, depth: 0 })
  await Promise.all(existing.docs.map((c) => payload.delete({ collection: 'kb-chunks', id: c.id, overrideAccess: true })))
  await Promise.all(docs.map((p, i) => writeChunk(payload, p, vectors[i] ?? [])))
  return docs.length
}

/** Переиндексация одной модели (из afterChange хука). */
export async function reindexOneProduct(payload: PayloadLike, product: ProductLike): Promise<void> {
  const provider = getProvider()
  const [vector] = await provider.embed([productChunkText(product)], 'doc')
  const existing = await payload.find({
    collection: 'kb-chunks',
    where: { and: [{ source: { equals: 'product' } }, { refId: { equals: product.id } }] },
    limit: 10,
    depth: 0,
  })
  await Promise.all(existing.docs.map((c) => payload.delete({ collection: 'kb-chunks', id: c.id, overrideAccess: true })))
  await writeChunk(payload, product, vector ?? [])
}

/** Топ-k фрагментов под запрос. Ленивая инициализация, если база пуста. */
export async function retrieve(
  payload: PayloadLike,
  query: string,
  k = 4,
): Promise<{ text: string; refSlug?: string }[]> {
  const provider = getProvider()
  let { docs } = await payload.find({ collection: 'kb-chunks', limit: 1000, depth: 0 })
  if (!docs.length) {
    await reindexProducts(payload).catch((err) => payload.logger.error({ msg: 'kb lazy reindex failed', err }))
    docs = (await payload.find({ collection: 'kb-chunks', limit: 1000, depth: 0 })).docs
  }
  if (!docs.length) return []

  const [qv] = await provider.embed([query], 'query')
  const chunks: Chunk<{ refSlug?: string }>[] = docs.map((d) => ({
    text: d.text,
    embedding: Array.isArray(d.embedding) ? d.embedding : [],
    meta: { refSlug: d.refSlug },
  }))
  return rankChunks(qv, chunks, k).map((c) => ({ text: c.text, refSlug: c.meta?.refSlug }))
}
