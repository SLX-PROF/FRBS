'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Reveal from '@/components/motion/Reveal'

type Product = {
  id: number
  slug: string
  title: string
  series?: string
  minDoorWidth?: number
  features?: string
}

export default function CatalogClient({ products }: { products: Product[] }) {
  const [sort, setSort] = useState<'name' | 'width'>('name')

  const sorted = useMemo(() => {
    const arr = [...products].filter((p) => p && p.title)
    if (sort === 'name') {
      arr.sort((a, b) => (a.title ?? '').localeCompare(b.title ?? ''))
    }
    if (sort === 'width') {
      arr.sort((a, b) => (a.minDoorWidth ?? 0) - (b.minDoorWidth ?? 0))
    }
    return arr
  }, [products, sort])

  return (
    <>
      {/* ПАНЕЛЬ СОРТИРОВКИ */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-white p-4">
        <div className="text-sm text-ink-muted">
          Найдено моделей:{' '}
          <span className="font-semibold text-ink">{sorted.length}</span>
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

      {/* СЕТКА ТОВАРОВ */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((p, i) => (
          <Reveal key={p.id} delay={i * 60}>
            <Link
              href={`/catalog/${p.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-all hover:-translate-y-1 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5"
            >
              {/* Плейсхолдер фото */}
              <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-surface to-line">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-heading text-4xl font-extrabold text-ink/10 transition-transform group-hover:scale-110">
                    {p.series ?? 'F'}
                  </span>
                </div>
                {p.series && (
                  <div className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                    {p.series}
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-heading text-xl font-bold transition-colors group-hover:text-accent">
                  {p.title}
                </h3>
                {p.minDoorWidth && (
                  <div className="mt-2 text-sm text-ink-muted">
                    Мин. ширина двери:{' '}
                    <span className="font-semibold text-ink">
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
    </>
  )
}