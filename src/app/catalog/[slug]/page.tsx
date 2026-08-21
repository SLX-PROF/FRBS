import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Reveal from '@/components/motion/Reveal'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollProgress from '@/components/motion/ScrollProgress'
import LeadForm from '@/components/LeadForm'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  const product = docs[0]
  if (!product) return { title: 'Товар не найден' }

  return {
    title: product.seoTitle || `${product.title} — автоматический порог FORBSA`,
    description:
      product.seoDescription ||
      `${product.title} серии ${product.series ?? 'FORBSA'}. Минимальная ширина двери ${product.minDoorWidth ?? '—'} мм. Производство в России, от 1 дня.`,
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  const product = docs[0]
  if (!product) return notFound()

  const specs = [
    { label: 'Серия', value: product.series },
    { label: 'Тип', value: product.type === 'врезной' ? 'Врезной' : 'Накладной' },
    { label: 'Мин. ширина двери', value: product.minDoorWidth ? `${product.minDoorWidth} мм` : undefined },
    { label: 'Гарантия', value: product.warranty ? `${product.warranty} лет` : undefined },
    { label: 'Страна-изготовитель', value: 'Россия' },
  ].filter((s) => s.value)

  return (
    <main className="min-h-screen bg-surface text-ink">
      <ScrollProgress />
      <Header />

      {/* Хлебные крошки */}
      <div className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-6 py-3 text-sm text-ink-muted">
          <Link href="/" className="hover:text-accent">Главная</Link>
          <span>/</span>
          <Link href="/catalog" className="hover:text-accent">Каталог</Link>
          <span>/</span>
          <span className="truncate text-ink">{product.title}</span>
        </div>
      </div>

      {/* ОСНОВНОЙ БЛОК */}
      <section className="py-12 md:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-2">
          {/* ФОТО */}
          <Reveal>
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-surface to-line">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-heading text-[120px] font-extrabold text-ink/10">
                  {product.series ?? 'F'}
                </span>
              </div>
              {product.series && (
                <div className="absolute left-4 top-4 rounded-full bg-accent px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white">
                  Серия {product.series}
                </div>
              )}
            </div>
          </Reveal>

          {/* ИНФО */}
          <Reveal delay={150}>
            <div className="flex flex-col">
              <h1 className="font-heading text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
                {product.title}
              </h1>

              {product.features && (
                <p className="mt-4 text-lg text-ink-muted">
                  {product.features}
                </p>
              )}

              {/* ТАБЛИЦА ХАРАКТЕРИСТИК */}
              <div className="mt-8 rounded-2xl border border-line bg-white">
                <div className="border-b border-line px-6 py-3 text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  Характеристики
                </div>
                <div className="divide-y divide-line">
                  {specs.map((s) => (
                    <div key={s.label} className="flex items-center justify-between px-6 py-3">
                      <span className="text-sm text-ink-muted">{s.label}</span>
                      <span className="text-sm font-semibold">{s.value}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between px-6 py-3">
                    <span className="text-sm text-ink-muted">Шаг длины</span>
                    <span className="text-sm font-semibold">200 мм</span>
                  </div>
                  <div className="flex items-center justify-between px-6 py-3">
                    <span className="text-sm text-ink-muted">Ресурс</span>
                    <span className="text-sm font-semibold">1 000 000 циклов</span>
                  </div>
                </div>
              </div>

              {/* РЕКОМЕНДАЦИЯ (если есть) */}
              {product.recommendation && (
                <div className="mt-6 rounded-2xl border-l-4 border-accent bg-orange-50/50 p-5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-accent">
                    Рекомендация
                  </div>
                  <p className="mt-1 text-sm text-ink">{product.recommendation}</p>
                </div>
              )}

              {/* КОМПЛЕКТАЦИЯ */}
              {product.package && (
                <div className="mt-6 rounded-2xl border border-line bg-white p-5">
                  <div className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                    Комплектация
                  </div>
                  <p className="mt-1 text-sm text-ink">{product.package}</p>
                </div>
              )}

              {/* CTA */}
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#lead-form"
                  className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-accent/30 transition-all hover:-translate-y-0.5 hover:bg-accent-dark"
                >
                  Запросить цену →
                </a>
                <Link
                  href="/docs"
                  className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-6 py-3.5 text-sm font-semibold text-ink transition-all hover:-translate-y-0.5 hover:border-accent/30"
                >
                  Скачать PDF
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ПРЕИМУЩЕСТВА МОДЕЛИ */}
      <section className="bg-graphite py-16 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <h2 className="font-heading text-3xl font-extrabold md:text-4xl">
              Почему <span className="text-accent">{product.title}</span>
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Нержавейка A2', desc: 'AISI 304' },
              { title: 'Без пластика', desc: 'Только металл' },
              { title: 'Самовыравнивание', desc: 'Компенсация пола' },
              { title: 'Регулировка', desc: 'До 18 мм' },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div className="font-semibold">{item.title}</div>
                  <div className="mt-1 text-sm text-white/60">{item.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ФОРМА ЗАЯВКИ */}
      <section id="lead-form" className="relative overflow-hidden py-16">
        <div className="pointer-events-none absolute -top-20 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <Reveal>
            <h2 className="font-heading text-3xl font-extrabold md:text-4xl">
              Запрос по модели «{product.title}»
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-ink-muted">
              Оставьте заявку — инженер подберёт длину и подготовит КП
              в течение рабочего дня.
            </p>
          </Reveal>
          <Reveal delay={150}>
            <div className="mx-auto mt-10 max-w-2xl">
              <LeadForm />
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  )
}