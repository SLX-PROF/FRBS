'use client'

import { useEffect, useRef, useState } from 'react'

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

export default function CountUp({
  to,
  duration = 1400,
  format = (n: number) => n.toLocaleString('ru-RU'),
  suffix = '',
  className = '',
}: {
  to: number
  duration?: number
  format?: (n: number) => string
  suffix?: string
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(to)
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        const start = performance.now()
        let raf = 0
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration)
          setValue(Math.round(to * easeOutCubic(t)))
          if (t < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(raf)
      },
      { threshold: 0.3 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [to, duration])

  return (
    <span ref={ref} className={className}>
      {format(value)}
      {suffix}
    </span>
  )
}
