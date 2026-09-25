import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Reveal from '@/components/motion/Reveal'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollProgress from '@/components/motion/ScrollProgress'
import Button from '@/components/ui/Button'
import SectionHeading from '@/components/ui/SectionHeading'
import CatalogClient from './CatalogClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Каталог автоматических порогов FORBSA',
  description:
    'Врезные и накладные автоматические пороги FORBSA для алюминиевых, стальных, ПВХ и деревянных дверей. Шаг длины 200 мм.',
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
      <section className="bg-graphite pt-8 pb-14 text-white md:pt-10 md:pb-14">
        <div className="mx-auto max-w-[1440px] px-6">
          <Reveal delay={100}>
            <h1 className="text-4xl tracking-tight md:text-5xl lg:text-6xl">
              Каталог продукции{' '}
              <span className="text-accent">
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
      <section className="py-10 md:py-14">
        <div className="mx-auto max-w-[1440px] px-6">
          <CatalogClient products={docs} />
        </div>
      </section>

      {/* CTA-БЛОК */}
      <section className="bg-graphite py-14 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Reveal>
            <SectionHeading
              dark
              center
              title="Не знаете, какая модель подходит?"
              subtitle="Сообщите ширину двери и тип монтажа — инженер подберёт подходящую модель."
            />
            <div className="flex flex-wrap justify-center gap-3">
              <Button href="/contacts" size="lg">
                Консультация инженера →
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  )
}