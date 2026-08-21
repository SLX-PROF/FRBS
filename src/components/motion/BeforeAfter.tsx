'use client'

import { useRef, useState } from 'react'
import type { ReactNode } from 'react'

export default function BeforeAfter({ before, after, beforeLabel, afterLabel }: {
  before: ReactNode
  after: ReactNode
  beforeLabel: string
  afterLabel: string
}) {
  const [pos, setPos] = useState(50)
  const ref = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const update = (clientX: number) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width)
    setPos((x / rect.width) * 100)
  }

  return (
    <div
      ref={ref}
      className="relative touch-none select-none overflow-hidden rounded-panel border border-line bg-white shadow-panel"
      onPointerDown={(e) => { dragging.current = true; update(e.clientX) }}
      onPointerMove={(e) => dragging.current && update(e.clientX)}
      onPointerUp={() => { dragging.current = false }}
      onPointerLeave={() => { dragging.current = false }}
    >
      <div className="pointer-events-none">{after}</div>

      <div className="pointer-events-none absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        {before}
      </div>

      <div className="absolute inset-y-0 z-10" style={{ left: `${pos}%` }}>
        <div className="h-full w-0.5 -translate-x-1/2 bg-accent" />
        <div className="absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize items-center justify-center rounded-full bg-linear-to-r from-accent-bright to-accent-dark text-white shadow-lift">
          ↔
        </div>
      </div>

      <span className="absolute left-4 top-4 z-10 rounded-full bg-graphite/80 px-3 py-1 text-xs font-semibold text-white">{beforeLabel}</span>
      <span className="absolute right-4 top-4 z-10 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">{afterLabel}</span>
    </div>
  )
}