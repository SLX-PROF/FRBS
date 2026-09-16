import Link from 'next/link'
import type { ReactNode } from 'react'

type Props = { children: ReactNode; className?: string; href?: string }

export default function Card({ children, className = '', href }: Props) {
  const cls = `rounded-panel border border-line bg-white p-6 transition-all duration-300 ease-soft hover:-translate-y-1 hover:shadow-lift ${className}`
  if (href) return <Link href={href} className={cls}>{children}</Link>
  return <div className={cls}>{children}</div>
}
