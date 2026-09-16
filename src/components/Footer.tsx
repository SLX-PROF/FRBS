import Link from 'next/link'
import { MapPinIcon, PhoneIcon, MailIcon } from '@/components/ui/Icons'

const nav = [
  { href: '/catalog', label: 'Каталог' },
  { href: '/partners', label: 'Для партнёров' },
  { href: '/docs', label: 'Документация' },
  { href: '/about', label: 'О компании' },
  { href: '/contacts', label: 'Контакты' },
]

const legal = [{ href: '/privacy', label: 'Политика обработки ПДн' }]

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-graphite text-white">
      <div className="h-px w-full bg-linear-to-r from-transparent via-accent/60 to-transparent" />
      <div className="pointer-events-none absolute -bottom-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-[1440px] grid-cols-1 gap-12 px-6 py-16 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="font-display text-xl font-semibold tracking-tight">
            FORBSA<span className="text-accent">.</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-white/50">
            Российский производитель автоматических порогов для алюминиевых,
            стальных, ПВХ и деревянных дверей, включая противопожарные.
          </p>
        </div>

        <nav>
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/40">Разделы</p>
          <ul className="flex flex-col gap-2.5 text-sm text-white/60">
            {nav.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-accent">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/40">Контакты</p>
          <ul className="flex flex-col gap-3 text-sm text-white/60">
            <li className="flex items-start gap-2.5">
              <MapPinIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
              117105, город Москва, 1-Й Нагатинский пр-д, д. 2 стр. 12, помещ. 2/2 
            </li>
            <li className="flex items-center gap-2.5">
              <PhoneIcon className="h-4 w-4 flex-shrink-0 text-accent" />
              <a href="tel:+73430000000" className="transition-colors hover:text-accent">
                +7 (966) 157-03-86
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <MailIcon className="h-4 w-4 flex-shrink-0 text-accent" />
              <a href="mailto:info@forbsa.ru" className="transition-colors hover:text-accent">
                sales@forbsa.ru
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/40">Документы</p>
          <ul className="flex flex-col gap-2.5 text-sm text-white/60">
            {legal.map((l, i) => (
              <li key={i}>
                <Link href={l.href} className="transition-colors hover:text-accent">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/10 px-6 py-5">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-2 text-xs text-white/40 sm:flex-row">
          <p>© {new Date().getFullYear()} ООО «Форбса». Все права защищены.</p>
          <p className="font-mono text-white/30">1 000 000 циклов · Сертификат РОСТЕСТ</p>
        </div>
      </div>
    </footer>
  )
}
