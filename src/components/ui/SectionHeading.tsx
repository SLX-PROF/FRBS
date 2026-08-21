import Tag from './Tag'

export default function SectionHeading({ eyebrow, title, subtitle, dark = false }: { eyebrow?: string; title: string; subtitle?: string; dark?: boolean }) {
  return (
    <div className="mb-10 md:mb-14">
      {eyebrow && <Tag tone={dark ? 'dark' : 'accent'}>{eyebrow}</Tag>}
      <h2 className={`mt-4 text-3xl md:text-[44px] md:leading-[1.1] ${dark ? 'text-white' : 'text-ink'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 max-w-2xl text-lg ${dark ? 'text-white/70' : 'text-ink-muted'}`}>{subtitle}</p>
      )}
    </div>
  )
}