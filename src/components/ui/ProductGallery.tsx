'use client'

import { useRef, useState } from 'react'
import ProfileGlyph from './ProfileGlyph'

type PhotoImage = { id?: number | string; url?: string | null; alt?: string | null }

export default function ProductGallery({
  images,
  title,
  variant = 0,
  badge,
}: {
  images: PhotoImage[]
  title: string
  variant?: 0 | 1 | 2
  badge?: string
}) {
  const [index, setIndex] = useState(0)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  const startCycling = () => {
    if (images.length < 2 || timer.current) return
    timer.current = setInterval(() => {
      setIndex((i) => (i + 1) % images.length)
    }, 2800)
  }

  const stopCycling = () => {
    if (timer.current) {
      clearInterval(timer.current)
      timer.current = null
    }
  }

  const pick = (i: number) => {
    stopCycling()
    setIndex(i)
  }

  if (images.length === 0) {
    return (
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-line bg-surface">
        <ProfileGlyph variant={variant} />
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div
        className="relative aspect-square overflow-hidden rounded-2xl border border-line bg-surface"
        onMouseEnter={startCycling}
        onMouseLeave={stopCycling}
      >
        {images.map((img, i) => (
          <img
            key={img.id ?? img.url}
            src={img.url!}
            alt={img.alt || title}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
              i === index ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        {badge && (
          <div className="absolute left-4 top-4 rounded-full bg-accent px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white">
            {badge}
          </div>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex flex-wrap gap-3">
          {images.map((img, i) => (
            <button
              key={img.id ?? img.url}
              type="button"
              onClick={() => pick(i)}
              aria-label={`Показать фото ${i + 1}`}
              aria-current={i === index}
              className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 bg-surface transition-colors ${
                i === index ? 'border-accent' : 'border-line hover:border-accent/40'
              }`}
            >
              <img src={img.url!} alt={img.alt || title} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
