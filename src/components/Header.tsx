'use client'

import { useState } from 'react'
import Link from 'next/link'
import SearchBar from '@/components/SearchBar'
import Button from '@/components/ui/Button'
import { SearchIcon, PhoneIcon } from '@/components/ui/Icons'
import { useScrollProgress } from '@/lib/useScrollProgress'

const links = [
  { href: '/catalog', label: 'Каталог' },
  { href: '/calculator', label: 'Подбор' },
  { href: '/partners', label: 'Для партнёров' },
  { href: '/docs', label: 'Документация' },
  { href: '/about', label: 'О компании' },
  { href: '/contacts', label: 'Контакты' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { scrolled } = useScrollProgress()

  function closeAll() {
    setMenuOpen(false)
    setSearchOpen(false)
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ease-soft ${
        scrolled
          ? 'border-white/10 bg-graphite/95 shadow-panel backdrop-blur-md'
          : 'border-transparent bg-graphite'
      }`}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-4 py-4 text-white md:px-6">
        <Link href="/" onClick={closeAll} className="flex-shrink-0">
          <img src="/logo.png" alt="FORBSA" className="h-7 w-auto md:h-8" />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group relative py-1 text-base font-medium text-white/80 transition-colors hover:text-white"
            >
              {l.label}
              <span className="absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-accent transition-transform duration-200 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <div className="hidden items-center lg:flex">
            <div className={`transition-all duration-300 ease-soft ${searchOpen ? 'w-64 overflow-visible opacity-100' : 'w-0 overflow-hidden opacity-0'}`}>
              <SearchBar />
            </div>
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label={searchOpen ? 'Скрыть поиск' : 'Поиск'}
              aria-pressed={searchOpen}
              className="ml-1.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-btn text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <SearchIcon className="h-4 w-4" />
            </button>
          </div>

          <Button href="/#contact" onClick={closeAll} className="hidden px-5! py-2.5! text-sm lg:inline-flex">
            Оставить заявку
          </Button>

          <button
            type="button"
            onClick={() => {
              setMenuOpen(false)
              setSearchOpen((v) => !v)
            }}
            aria-label={searchOpen ? 'Скрыть поиск' : 'Поиск'}
            aria-pressed={searchOpen}
            className="flex h-9 w-9 items-center justify-center rounded-btn text-white/70 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
          >
            <SearchIcon className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              setSearchOpen(false)
              setMenuOpen((v) => !v)
            }}
            aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={menuOpen}
            className="flex h-9 w-9 flex-col items-center justify-center gap-1.25 rounded-btn text-white/70 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
          >
            <span
              className={`h-0.5 w-4 rounded-full bg-current transition-transform duration-300 ease-soft ${
                menuOpen ? 'translate-y-[3.5px] rotate-45' : ''
              }`}
            />
            <span
              className={`h-0.5 w-4 rounded-full bg-current transition-transform duration-300 ease-soft ${
                menuOpen ? 'translate-y-[-3.5px] -rotate-45' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Поиск на мобильных — отдельной строкой под панелью */}
      <div className={`grid px-4 transition-all duration-300 ease-soft lg:hidden ${searchOpen ? 'grid-rows-[1fr] pb-3 opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className={searchOpen ? 'overflow-visible' : 'overflow-hidden'}>
          <SearchBar />
        </div>
      </div>

      {/* Мобильное меню */}
      <div className={`grid transition-all duration-300 ease-soft lg:hidden ${menuOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden border-t border-white/10 bg-graphite/95 text-white backdrop-blur">
          <nav className="mx-auto flex max-w-[1440px] flex-col divide-y divide-white/10 px-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={closeAll}
                className="px-1 py-3.5 text-lg font-medium text-white/85 transition-colors hover:text-accent"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mx-auto flex max-w-[1440px] flex-col gap-3 border-t border-white/10 px-4 py-4">
            <Button href="/#contact" onClick={closeAll} className="w-full">
              Оставить заявку
            </Button>
            <a
              href="tel:+74957985225"
              className="flex items-center justify-center gap-2 py-1 text-sm font-semibold text-white/70 transition-colors hover:text-white"
            >
              <PhoneIcon className="h-4 w-4" />
              +7 (495) 798-52-25
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
