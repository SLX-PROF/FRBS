import Link from 'next/link'
import SearchBar from '@/components/SearchBar'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-graphite text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="text-xl font-extrabold tracking-wide">
          FORBSA<span className="text-accent">.</span>
        </Link>
        <nav className="hidden items-center gap-6 lg:flex">
          <Link href="/catalog" className="transition-colors hover:text-accent">Каталог</Link>
          <Link href="/partners" className="transition-colors hover:text-accent">Для партнёров</Link>
          <Link href="/docs" className="transition-colors hover:text-accent">Документация</Link>
          <Link href="/about" className="transition-colors hover:text-accent">О компании</Link>
          <Link href="/contacts" className="transition-colors hover:text-accent">Контакты</Link>
        </nav>
        <div className="hidden w-64 md:block">
          <SearchBar />
        </div>
        <a
          href="#contact"
          className="bg-accent px-4 py-2 font-semibold transition-colors hover:bg-orange-600"
        >
          Оставить заявку
        </a>
      </div>
      <div className="px-6 pb-4 md:hidden">
        <SearchBar />
      </div>
    </header>
  )
}