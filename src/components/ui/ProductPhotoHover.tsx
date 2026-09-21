'use client'

import { useRef, useState } from 'react'
import ProfileGlyph from './ProfileGlyph'

type PhotoImage = { url?: string | null; alt?: string | null }

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

  const start = () => {
    if (photos.length < 2 || timer.current) return
    timer.current = setInterval(() => {
      setIndex((i) => (i + 1) % photos.length)
    }, 2800)
  }

  const stop = () => {
    if (timer.current) {
      clearInterval(timer.current)
      timer.current = null
    }
    setIndex(0)
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
          src={photo.url!}
          alt={photo.alt || alt}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </div>
  )
}
