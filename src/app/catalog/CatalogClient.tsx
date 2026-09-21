'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Reveal from '@/components/motion/Reveal'
import ProductPhotoHover from '@/components/ui/ProductPhotoHover'

type ProductImage = { url?: string | null; alt?: string | null }

type Product = {
  id: number
  slug: string
  title: string
  series?: string
  minDoorWidth?: number
  features?: string
  images?: (number | ProductImage)[] | null
}

type WidthRange = 'all' | 'lt400' | '400to800' | 'gt800'

const widthRanges: { key: WidthRange; label: string; test: (w: number) => boolean }[] = [
  { key: 'all', label: 'Любая ширина', test: () => true },
  { key: 'lt400', label: 'До 400 мм', test: (w) => w < 400 },
  { key: '400to800', label: '400–800 мм', test: (w) => w >= 400 && w <= 800 },
  { key: 'gt800', label: 'От 800 мм', test: (w) => w > 800 },
]

export default function CatalogClient({ products }: { products: Product[] }) {
  const [sort, setSort] = useState<'name' | 'width'>('name')
  const [widthRange, setWidthRange] = useState<WidthRange>('all')

  const filtered = useMemo(() => {
    const test = widthRanges.find((r) => r.key === widthRange)!.test
    return products.filter((p) => p && p.title && (widthRange === 'all' || (p.minDoorWidth != null && test(p.minDoorWidth))))
  }, [products, widthRange])

  const sorted = useMemo(() => {
    const arr = [...filtered]
    if (sort === 'name') {
      arr.sort((a, b) => (a.title ?? '').localeCompare(b.title ?? ''))
    }
    if (sort === 'width') {
      arr.sort((a, b) => (a.minDoorWidth ?? 0) - (b.minDoorWidth ?? 0))
    }
    return arr
  }, [filtered, sort])

  return (
    <>
      {/* ПАНЕЛЬ ФИЛЬТРОВ И СОРТИРОВКИ */}
      <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-line bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm text-ink-muted">
            Найдено моделей:{' '}
            <span className="font-mono font-semibold text-ink">{sorted.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-ink-muted">Сортировка:</span>
            <div className="flex gap-1 rounded-xl bg-surface p-1">
              <button
                onClick={() => setSort('name')}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  sort === 'name'
                    ? 'bg-white text-ink shadow-sm'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                По названию
              </button>
              <button
                onClick={() => setSort('width')}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  sort === 'width'
                    ? 'bg-white text-ink shadow-sm'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                По ширине двери
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-line pt-4">
          <span className="text-sm text-ink-muted">Ширина двери:</span>
          <div className="flex flex-wrap gap-1 rounded-xl bg-surface p-1">
            {widthRanges.map((r) => (
              <button
                key={r.key}
                onClick={() => setWidthRange(r.key)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  widthRange === r.key
                    ? 'bg-white text-ink shadow-sm'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* СЕТКА ТОВАРОВ */}
      {sorted.length === 0 ? (
        <div className="rounded-2xl border border-line bg-white p-12 text-center text-ink-muted">
          Нет моделей в этом диапазоне ширины.{' '}
          <button onClick={() => setWidthRange('all')} className="font-semibold text-accent hover:underline">
            Сбросить фильтр
          </button>
        </div>
      ) : (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((p, i) => (
          <Reveal key={p.id} delay={i * 60}>
            <Link
              href={`/catalog/${p.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all hover:-translate-y-1 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5"
            >
              {/* Фото (слайд-шоу по наведению, если их несколько) или схема профиля */}
              <div className="relative aspect-[4/3] overflow-hidden bg-surface transition-transform duration-500 group-hover:scale-105">
                <ProductPhotoHover images={p.images} alt={p.title} variant={(i % 3) as 0 | 1 | 2} />
                {p.series && (
                  <div className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider text-white">
                    {p.series}
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-xl font-bold transition-colors group-hover:text-accent">
                  {p.title}
                </h3>
                {p.minDoorWidth && (
                  <div className="mt-2 text-sm text-ink-muted">
                    Мин. ширина двери:{' '}
                    <span className="font-mono font-semibold text-ink">
                      {p.minDoorWidth} мм
                    </span>
                  </div>
                )}
                {p.features && (
                  <p className="mt-3 line-clamp-2 flex-1 text-sm text-ink-muted">
                    {p.features}
                  </p>
                )}
                <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent transition-all group-hover:gap-3">
                  Подробнее →
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
      )}
    </>
  )
}