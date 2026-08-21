import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Reveal from '@/components/motion/Reveal'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollProgress from '@/components/motion/ScrollProgress'
import CatalogClient from './CatalogClient'

export const metadata = {
  title: 'Каталог автоматических порогов FORBSA — 10 моделей',
  description:
    'Врезные и накладные автоматические пороги FORBSA. 10 моделей для алюминиевых, стальных, ПВХ и деревянных дверей. Шаг длины 200 мм.',
}

export default async function CatalogPage() {
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'products',
    limit: 100,
    sort: 'name',
  })

  return (
    <main className="min-h-screen bg-surface text-ink">
      <ScrollProgress />
      <Header />

      {/* HERO КАТАЛОГА */}
      <section className="bg-graphite py-16 text-white md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              10 моделей в линейке
            </span>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="font-heading text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
              Каталог продукции{' '}
              <span className="bg-gradient-to-r from-[#ff7a1a] to-[#f24e00] bg-clip-text text-transparent">
                FORBSA
              </span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-4 max-w-2xl text-lg text-white/70">
              Автоматические пороги для герметизации дверей любого типа. Шаг
              длины 200 мм — подбираем под любую ширину полотна.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ФИЛЬТРЫ + СЕТКА */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-6">
          <CatalogClient products={docs} />
        </div>
      </section>

      {/* CTA-БЛОК */}
      <section className="bg-graphite py-16 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Reveal>
            <h2 className="font-heading text-3xl font-extrabold md:text-4xl">
              Не знаете, какая модель подходит?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/70">
              Инженер подберёт модель под тип двери, ширину проёма и требования
              к герметизации.
            </p>
            <Link
              href="/contacts"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-accent px-7 py-4 text-base font-semibold text-white shadow-lg shadow-accent/30 transition-all hover:-translate-y-0.5 hover:bg-accent-dark"
            >
              Получить консультацию →
            </Link>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  )
}