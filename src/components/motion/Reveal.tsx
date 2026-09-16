'use client'

import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

type Variant = 'up' | 'fade' | 'scale' | 'blur'

const states: Record<Variant, { hidden: string; shown: string }> = {
  up: { hidden: 'translate-y-6 opacity-0', shown: 'translate-y-0 opacity-100' },
  fade: { hidden: 'opacity-0', shown: 'opacity-100' },
  scale: { hidden: 'scale-95 opacity-0', shown: 'scale-100 opacity-100' },
  blur: { hidden: 'blur-[3px] opacity-0', shown: 'blur-[0] opacity-100' },
}

export default function Reveal({
  children,
  delay = 0,
  variant = 'up',
  className = '',
}: {
  children: ReactNode
  delay?: number
  variant?: Variant
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const t = setTimeout(() => setVisible(true), 0)
      return () => clearTimeout(t)
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px 200px 0px' },
    )
    io.observe(el)

    // Safety net: print/export/some crawlers never fire a real intersection
    // for below-the-fold content — don't leave it permanently invisible.
    const fallback = setTimeout(() => setVisible(true), 2000)

    return () => {
      io.disconnect()
      clearTimeout(fallback)
    }
  }, [])

  const s = states[variant]

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`${className} h-full transition-all duration-700 ease-soft ${visible ? s.shown : s.hidden}`}
    >
      {children}
    </div>
  )
}
