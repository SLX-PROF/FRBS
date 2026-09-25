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
  url?: string | null
  alt?: string | null
  sizes?: { card?: { url?: string | null } | null } | null
}

export default function ProductPhotoHover({
  images,
  alt,
  variant = 0,
  className = '',
}: {
  images?: (PhotoImage | number)[] | null
  alt: string
  variant?: 0 | 1 | 2
  className?: string
}) {
  const photos = (images ?? []).filter(
    (img): img is PhotoImage => typeof img === 'object' && img !== null && !!img.url,
  )
  const [index, setIndex] = useState(0)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  const stopTimer = () => {
    if (timer.current) {
      clearInterval(timer.current)
      timer.current = null
    }
  }

  const start = () => {
    if (photos.length < 2 || timer.current) return
    timer.current = setInterval(() => {
      setIndex((i) => (i + 1) % photos.length)
    }, 2800)
  }

  const stop = () => {
    stopTimer()
    setIndex(0)
  }

  const go = (e: React.MouseEvent, dir: 1 | -1) => {
    e.preventDefault()
    e.stopPropagation()
    stopTimer()
    setIndex((i) => (i + dir + photos.length) % photos.length)
  }

  if (photos.length === 0) {
    return <ProfileGlyph variant={variant} />
  }

  return (
    <div
      className={`skeleton group/photo relative h-full w-full ${className}`}
      onMouseEnter={start}
      onMouseLeave={stop}
    >
      {photos.map((photo, i) => (
        <img
          key={photo.url}
          src={photo.sizes?.card?.url || photo.url!}
          alt={photo.alt || alt}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      {photos.length > 1 && (
        <>
          <button type="button" onClick={(e) => go(e, -1)} aria-label="Предыдущее фото" className={`${arrowClass} left-2`}>
            <Chevron dir="left" />
          </button>
          <button type="button" onClick={(e) => go(e, 1)} aria-label="Следующее фото" className={`${arrowClass} right-2`}>
            <Chevron dir="right" />
          </button>
        </>
      )}
    </div>
  )
}
