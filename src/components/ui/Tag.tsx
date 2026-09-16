import type { ReactNode } from 'react'

type Tone = 'accent' | 'dark' | 'light'

const tones: Record<Tone, string> = {
  accent: 'bg-accent/10 text-accent',
  dark: 'border border-white/15 bg-white/5 text-white/70',
  light: 'bg-white/10 text-white',
}

export default function Tag({ children, tone = 'accent' }: { children: ReactNode; tone?: Tone }) {
  return (
    <span className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-wider ${tones[tone]}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      {children}
    </span>
  )
}
