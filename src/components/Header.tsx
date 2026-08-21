import Link from 'next/link'
import SearchBar from '@/components/SearchBar'
import Button from '@/components/ui/Button'

const links = [
  { href: '/catalog', label: 'Каталог' },
  { href: '/partners', label: 'Для партнёров' },
  { href: '/docs', label: 'Документация' },
  { href: '/about', label: 'О компании' },
  { href: '/contacts', label: 'Контакты' },
]

export default function Header() {
  return (
    <header className="sticky top-0 z-50 px-3 pt-3 md:px-6 md:pt-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-panel bg-graphite/95 px-5 py-3.5 text-white shadow-panel backdrop-blur md:px-7">
        <Link href="/" className="font-display text-xl font-extrabold tracking-tight">
          FORBSA<span className="text-accent">.</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group relative py-1 text-sm font-semibold text-white/80 transition-colors hover:text-white"
            >
              {l.label}
              <span className="absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-linear-to-r from-accent-bright to-accent-dark transition-transform duration-200 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="hidden w-56 xl:block">
          <SearchBar />
        </div>

        <Button href="/#contact" className="px-5! py-2.5! text-sm">
          Оставить заявку
        </Button>
      </div>
      <div className="mx-auto mt-2 max-w-6xl xl:hidden">
        <SearchBar />
      </div>
    </header>
  )
}