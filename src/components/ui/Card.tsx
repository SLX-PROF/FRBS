import type { ReactNode } from 'react'

export default function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-panel border border-line bg-white p-6 transition-all duration-200 hover:-translate-y-1.5 hover:border-accent/50 hover:shadow-lift ${className}`}>
      {children}
    </div>
  )
}
