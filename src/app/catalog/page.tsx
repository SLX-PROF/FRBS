import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Reveal from '@/components/motion/Reveal'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollProgress from '@/components/motion/ScrollProgress'
import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import SectionHeading from '@/components/ui/SectionHeading'
import CatalogClient from './CatalogClient'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const payload = await getPayload({ config: configPromise })
  const { totalDocs } = await payload.find({ collection: 'products', limit: 0 })
  return {
    title: `Каталог автоматических порогов FORBSA — ${totalDocs} моделей`,
    description: `Врезные и накладные автоматические пороги FORBSA. ${totalDocs} моделей для алюминиевых, стальных, ПВХ и деревянных дверей. Шаг длины 200 мм.`,
  }
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
      <section className="bg-graphite py-20 text-white md:py-20">
        <div className="mx-auto max-w-[1440px] px-6">
          <Reveal>
            <Tag tone="dark">{docs.length} моделей в линейке</Tag>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="mt-6 text-4xl tracking-tight md:text-5xl lg:text-6xl">
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
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-[1440px] px-6">
          <CatalogClient products={docs} />
        </div>
      </section>

      {/* CTA-БЛОК */}
      <section className="bg-graphite py-20 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Reveal>
            <SectionHeading
              dark
              center
              title="Не знаете, какая модель подходит?"
              subtitle="Укажите ширину двери и тип монтажа в калькуляторе — покажем подходящие модели за пару секунд."
            />
            <div className="flex flex-wrap justify-center gap-3">
              <Button href="/calculator" size="lg">
                Подобрать модель →
              </Button>
              <Button href="/contacts" variant="ghost" size="lg">
                Консультация инженера
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  )
}