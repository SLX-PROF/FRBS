'use client'

import { useEffect, useRef, useState } from 'react'
import ThresholdScene from './ThresholdScene'

// Плоская пружина не едет линейно до точки и не встаёт — она слегка
// "продавливает" уплотнитель за отметку герметизации и оседает обратно.
function easeSpringSettle(t: number) {
  const c1 = 0.5
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}
function easeInCubic(t: number) {
  return t * t * t
}

// Реальный цикл: открыто → рама при закрывании жмёт активатор у петли →
// пружина продавливает уплотнитель вниз → герметично → дверь открывается →
// уплотнитель убирается. Паузы держат кадр, чтобы движение "дышало".
const PHASES = [
  { at: 0, dur: 900, label: 'Порог поднят', get: () => 0 },
  { at: 900, dur: 1200, label: 'Активатор нажат — уплотнитель опускается', get: (t: number) => easeSpringSettle(t) },
  { at: 2100, dur: 1600, label: 'Герметично закрыто', get: () => 1 },
  { at: 3700, dur: 900, label: 'Дверь открывается — уплотнитель убирается', get: (t: number) => 1 - easeInCubic(t) },
]
const CYCLE = 4600

export default function ThresholdDemo({ className = '' }: { className?: string }) {
  const [progress, setProgress] = useState(0)
  const [label, setLabel] = useState(PHASES[0].label)
  const [loop, setLoop] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const manualRef = useRef(false)
  const draggingRef = useRef(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReducedMotion(true)
      setProgress(1)
      setLoop(1)
      setLabel('Герметично закрыто')
      return
    }
    let raf = 0
    const start = performance.now() + 400
    const tick = (now: number) => {
      if (!manualRef.current) {
        const elapsed = (now - start) % CYCLE
        const phase = [...PHASES].reverse().find((p) => elapsed >= p.at) ?? PHASES[0]
        const t = Math.min(1, (elapsed - phase.at) / phase.dur)
        setProgress(phase.get(t))
        setLabel(phase.label)
        setLoop(elapsed / CYCLE)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  function updateFromPointer(clientY: number) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const pad = 24
    const usable = rect.height - pad * 2
    if (usable <= 0) return
    const y = Math.min(Math.max(clientY - rect.top - pad, 0), usable)
    const pr = y / usable
    setProgress(pr)
    setLoop(Math.min(1, pr))
    setLabel(pr > 0.85 ? 'Герметично закрыто' : pr < 0.05 ? 'Порог поднят' : 'Активатор нажат — уплотнитель опускается')
  }

  return (
    <div
      ref={ref}
      className={`relative touch-none select-none overflow-hidden rounded-panel border border-white/10 shadow-panel ${className}`}
      onPointerDown={(e) => {
        manualRef.current = true
        draggingRef.current = true
        setDragging(true)
        updateFromPointer(e.clientY)
        e.currentTarget.setPointerCapture(e.pointerId)
      }}
      onPointerMove={(e) => draggingRef.current && updateFromPointer(e.clientY)}
      onPointerUp={() => {
        draggingRef.current = false
        setDragging(false)
      }}
      onPointerCancel={() => {
        draggingRef.current = false
        setDragging(false)
      }}
    >
      <ThresholdScene progress={progress} reducedMotion={reducedMotion} />

      <span className="pointer-events-none absolute left-4 top-4 z-10 inline-flex max-w-[80%] items-center gap-1.5 rounded-full bg-graphite/80 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
        <span className={`h-1.5 w-1.5 flex-shrink-0 rounded-full transition-colors ${progress > 0.85 ? 'bg-accent' : 'bg-white/40'}`} />
        {label}
      </span>

      {/* вертикальный трек-регулятор — тянешь вверх/вниз, порог опускается синхронно */}
      <div className="pointer-events-none absolute inset-y-6 right-5 z-10 w-1 rounded-full bg-white/15">
        <div
          className="absolute inset-x-0 top-0 rounded-full bg-linear-to-b from-accent-bright to-accent-dark"
          style={{ height: `${Math.min(1, progress) * 100}%` }}
        />
        <div
          className={`absolute left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-white text-graphite shadow-lift transition-transform duration-150 ${
            dragging ? 'scale-110' : ''
          }`}
          style={{ top: `calc(${Math.min(1, Math.max(0, progress)) * 100}% - 16px)` }}
        >
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 2v12M4 5l4-3 4 3M4 11l4 3 4-3" />
          </svg>
        </div>
      </div>

      {/* индикатор позиции в цикле */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-0.5 bg-white/10">
        <div
          className="h-full bg-linear-to-r from-accent-bright to-accent-dark"
          style={{ width: `${Math.min(1, Math.max(0, loop)) * 100}%` }}
        />
      </div>
    </div>
  )
}
