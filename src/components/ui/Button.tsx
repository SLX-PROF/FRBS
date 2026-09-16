import Link from 'next/link'
import type { ReactNode } from 'react'

type Props = {
  href?: string
  type?: 'button' | 'submit'
  onClick?: () => void
  disabled?: boolean
  variant?: 'primary' | 'outline' | 'light' | 'ghost'
  size?: 'md' | 'lg'
  className?: string
  children: ReactNode
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-btn font-display font-medium transition-all duration-200 active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none'

const variants = {
  primary: 'bg-accent text-white hover:bg-accent-dark',
  outline: 'border border-line bg-transparent text-ink hover:border-ink',
  light: 'bg-white text-graphite hover:bg-white/90',
  ghost: 'border border-white/25 bg-transparent text-white hover:border-white/50 hover:bg-white/5',
}

const sizes = { md: 'px-6 py-3 text-base', lg: 'px-8 py-4 text-lg' }

export default function Button({ href, type = 'button', onClick, disabled, variant = 'primary', size = 'md', className = '', children }: Props) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`
  if (href) return <Link href={href} onClick={onClick} className={cls}>{children}</Link>
  return <button type={type} onClick={onClick} disabled={disabled} className={cls}>{children}</button>
}