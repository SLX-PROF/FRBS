'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Results = {
  products: { title: string; slug: string }[]
  documents: { title: string }[]
}

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Results | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults(null)
      return
    }
    const timer = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      if (res.ok) setResults(await res.json())
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  return (
    <div className="relative">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder="Поиск: модель, документ…"
        className="w-full rounded-btn border border-line bg-white px-4 py-2 text-ink placeholder-ink-muted/60 outline-none transition-colors focus:border-accent"
      />

      {open && results && (results.products.length > 0 || results.documents.length > 0) && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 border border-gray-200 bg-white text-ink shadow-lg">
          {results.products.length > 0 && (
            <div className="p-2">
              <p className="px-2 py-1 text-xs font-bold text-ink-muted">Товары</p>
              {results.products.map((p) => (
                <Link
                  key={p.slug}
                  href={`/catalog/${p.slug}`}
                  className="block px-2 py-1.5 transition-colors hover:bg-surface hover:text-accent"
                >
                  {p.title}
                </Link>
              ))}
            </div>
          )}
          {results.documents.length > 0 && (
            <div className="border-t border-gray-100 p-2">
              <p className="px-2 py-1 text-xs font-bold text-ink-muted">Документы</p>
              {results.documents.map((d) => (
                <Link
                  key={d.title}
                  href="/docs"
                  className="block px-2 py-1.5 transition-colors hover:bg-surface hover:text-accent"
                >
                  {d.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}