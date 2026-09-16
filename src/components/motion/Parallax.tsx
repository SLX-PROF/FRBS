'use client'

import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

/**
 * Сдвигает содержимое по вертикали пропорционально положению в окне —
 * лёгкий параллакс для фоновых пятен. rAF-throttled, при
 * prefers-reduced-motion не двигается вовсе.
 */
export default function Parallax({
  children,
  speed = 0.15,
  className = '',
}: {
  children: ReactNode
  speed?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let raf = 0
    const update = () => {
      raf = 0
      const rect = el.getBoundingClientRect()
      const viewCenter = window.innerHeight / 2
      const elCenter = rect.top + rect.height / 2
      const raw = (viewCenter - elCenter) * speed
      setOffset(Math.max(-120, Math.min(120, raw)))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [speed])

  return (
    <div
      ref={ref}
      className={className}
      style={{ transform: `translate3d(0, ${offset}px, 0)`, willChange: 'transform' }}
    >
      {children}
    </div>
  )
}
