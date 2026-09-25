'use client'

import { useRef, useState } from 'react'
import ProfileGlyph from './ProfileGlyph'

const arrowClass =
  'absolute top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-ink shadow ring-1 ring-black/10 transition hover:scale-105 hover:bg-white focus-visible:outline-2 focus-visible:outline-accent md:opacity-0 md:group-hover/photo:opacity-100 md:focus-visible:opacity-100'

function Chevron({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={dir === 'left' ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6'} />
    </svg>
  )
}

type PhotoImage = {
  id?: number | string
  url?: string | null
  alt?: string | null
  sizes?: { large?: { url?: string | null } | null } | null
}

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

  const go = (dir: 1 | -1) => {
    stopCycling()
    setIndex((i) => (i + dir + images.length) % images.length)
  }

  if (images.length === 0) {
    return (
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-line bg-surface">
        <ProfileGlyph variant={variant} />
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-md lg:mx-0">
      <div
        className="group/photo relative aspect-square overflow-hidden rounded-2xl border border-line bg-surface"
        onMouseEnter={startCycling}
        onMouseLeave={stopCycling}
      >
        {images.map((img, i) => (
          <img
            key={img.id ?? img.url}
            src={img.sizes?.large?.url || img.url!}
            alt={img.alt || title}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
              i === index ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        {images.length > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label="Предыдущее фото" className={`${arrowClass} left-3`}>
              <Chevron dir="left" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Следующее фото" className={`${arrowClass} right-3`}>
              <Chevron dir="right" />
            </button>
          </>
        )}
        {badge && (
          <div className="absolute left-4 top-4 rounded-full bg-accent px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white">
            {badge}
          </div>
        )}
      </div>
    </div>
  )
}
