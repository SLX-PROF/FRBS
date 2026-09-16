'use client'

import { useScrollProgress } from '@/lib/useScrollProgress'

export default function ScrollProgress() {
  const { progress } = useScrollProgress()

  return (
    <div
      className="fixed left-0 top-0 z-60 h-0.5 bg-linear-to-r from-accent-bright to-accent-dark"
      style={{ width: `${progress * 100}%` }}
    />
  )
}
