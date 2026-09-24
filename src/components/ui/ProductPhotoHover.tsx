'use client'

import { useRef, useState } from 'react'
import ProfileGlyph from './ProfileGlyph'

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

  const pick = (e: React.MouseEvent, i: number) => {
    e.preventDefault()
    e.stopPropagation()
    stopTimer()
    setIndex(i)
  }

  if (photos.length === 0) {
    return <ProfileGlyph variant={variant} />
  }

  return (
    <div
      className={`relative h-full w-full ${className}`}
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
        <div className="absolute inset-x-0 bottom-2 flex justify-center gap-1.5">
          {photos.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => pick(e, i)}
              aria-label={`Показать фото ${i + 1}`}
              aria-current={i === index}
              className={`h-1.5 rounded-full ring-1 ring-inset ring-black/20 transition-all ${
                i === index ? 'w-4 bg-accent ring-accent' : 'w-1.5 bg-white/90 hover:bg-white'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
