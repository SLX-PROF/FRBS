import type { ReactNode } from 'react'
import Tag from './Tag'

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  dark = false,
  center = false,
}: {
  eyebrow?: string
  title: ReactNode
  subtitle?: ReactNode
  dark?: boolean
  center?: boolean
}) {
  return (
    <div className={`mb-10 md:mb-14 ${center ? 'text-center' : ''}`}>
      {eyebrow && <Tag tone={dark ? 'dark' : 'accent'}>{eyebrow}</Tag>}
      <h2 className={`mt-4 text-4xl tracking-tight md:text-5xl md:leading-[1.05] ${dark ? 'text-white' : 'text-ink'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 max-w-2xl text-lg ${center ? 'mx-auto' : ''} ${dark ? 'text-white/70' : 'text-ink-muted'}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
