'use client'

import { useEffect, useState } from 'react'

/**
 * Единственный passive-слушатель прокрутки на всё приложение.
 * `progress` — доля прокрученной страницы (0..1), `scrolled` — ушли ли
 * от самого верха (для «прилипшей» шапки).
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const max = el.scrollHeight - el.clientHeight
      setProgress(max > 0 ? el.scrollTop / max : 0)
      setScrolled(el.scrollTop > 8)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return { progress, scrolled }
}
