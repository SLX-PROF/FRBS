'use client'

import { useEffect, useRef, useState } from 'react'

export default function Preloader() {
  const [mounted, setMounted] = useState(false)
  const [sealed, setSealed] = useState(false)
  const [leaving, setLeaving] = useState(false)
  // Captured once at first render, before the effect can write the flag —
  // keeps this correct across React Strict Mode's dev-only double effect run.
  const alreadySeenRef = useRef(typeof window !== 'undefined' ? sessionStorage.getItem('forbsa-intro-seen') : '1')

  useEffect(() => {
    if (alreadySeenRef.current) return
    sessionStorage.setItem('forbsa-intro-seen', '1')

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const showTimer = setTimeout(() => setMounted(true), 0)
    const sealTimer = setTimeout(() => setSealed(true), 80)
    const leaveTimer = setTimeout(() => setLeaving(true), 1900)
    const unmountTimer = setTimeout(() => setMounted(false), 2500)
    return () => {
      clearTimeout(showTimer)
      clearTimeout(sealTimer)
      clearTimeout(leaveTimer)
      clearTimeout(unmountTimer)
    }
  }, [])

  if (!mounted) return null

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-graphite transition-opacity duration-500 ease-soft ${
        leaving ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center gap-7">
        <div className="relative h-3 w-56 overflow-hidden rounded-full bg-white/10 md:w-64">
          <span
            className={`absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-accent-bright to-accent-dark transition-all duration-700 ease-soft ${
              sealed ? 'w-full' : 'w-0'
            }`}
          />
        </div>
        <img
          src="/logo.png"
          alt="FORBSA"
          className={`h-10 w-auto transition-all duration-700 ease-soft md:h-12 ${
            sealed ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
          }`}
          style={{ transitionDelay: '300ms' }}
        />
      </div>
    </div>
  )
}
