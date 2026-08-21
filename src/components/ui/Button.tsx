import Link from 'next/link'
import type { ReactNode } from 'react'

type Props = {
  href?: string
  type?: 'button' | 'submit'
  onClick?: () => void
  variant?: 'primary' | 'outline' | 'light'
  size?: 'md' | 'lg'
  className?: string
  children: ReactNode
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-btn font-display font-bold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0'

const variants = {
  primary: 'bg-linear-to-r from-accent-bright to-accent-dark text-white shadow-panel hover:shadow-lift',
  outline: 'border border-line bg-white text-ink hover:border-accent hover:text-accent',
  light: 'bg-white text-graphite hover:bg-accent-light',
}

const sizes = { md: 'px-6 py-3 text-base', lg: 'px-8 py-4 text-lg' }

export default function Button({ href, type = 'button', onClick, variant = 'primary', size = 'md', className = '', children }: Props) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`
  if (href) return <Link href={href} className={cls}>{children}</Link>
  return <button type={type} onClick={onClick} className={cls}>{children}</button>
}