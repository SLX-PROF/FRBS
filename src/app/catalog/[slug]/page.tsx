import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Reveal from '@/components/motion/Reveal'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollProgress from '@/components/motion/ScrollProgress'
import LeadForm from '@/components/LeadForm'
import Button from '@/components/ui/Button'
import ProfileGlyph from '@/components/ui/ProfileGlyph'
import { SteelIcon, NoPlasticIcon, LevelIcon, AdjustIcon } from '@/components/ui/Icons'
import type { Media } from '@/payload-types'

export const dynamic = 'force-dynamic'

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

  const images = (product.images ?? []).filter(
    (img): img is Media => typeof img === 'object' && img !== null && !!img.url,
  )

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
        <div className="mx-auto flex max-w-[1440px] items-center gap-2 px-6 py-3 text-sm text-ink-muted">
          <Link href="/" className="hover:text-accent">Главная</Link>
          <span>/</span>
          <Link href="/catalog" className="hover:text-accent">Каталог</Link>
          <span>/</span>
          <span className="truncate text-ink">{product.title}</span>
        </div>
      </div>

      {/* ОСНОВНОЙ БЛОК */}
      <section className="py-12 md:py-20">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-6 lg:grid-cols-2">
          {/* ФОТО */}
          <Reveal>
            <div className="space-y-3">
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-line bg-surface">
                {images.length > 0 ? (
                  <img
                    src={images[0].url!}
                    alt={images[0].alt || product.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ProfileGlyph variant={((product.id ?? 0) % 3) as 0 | 1 | 2} />
                )}
                {product.series && (
                  <div className="absolute left-4 top-4 rounded-full bg-accent px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white">
                    Серия {product.series}
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {images.slice(1).map((img) => (
                    <div key={img.id} className="aspect-square overflow-hidden rounded-xl border border-line bg-surface">
                      <img src={img.url!} alt={img.alt || product.title} className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Reveal>

          {/* ИНФО */}
          <Reveal delay={150}>
            <div className="flex flex-col">
              <h1 className="text-3xl tracking-tight md:text-4xl lg:text-5xl">
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
                    <div key={s.label} className="flex items-center justify-between gap-4 px-6 py-3">
                      <span className="flex-shrink-0 text-sm text-ink-muted">{s.label}</span>
                      <span className="min-w-0 break-words text-right text-sm font-semibold">{s.value}</span>
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
                <div className="mt-6 rounded-panel border-l-4 border-accent bg-accent-light p-5">
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
                <Button href="#lead-form">Запросить цену →</Button>
                <Button href="/docs" variant="outline">
                  Скачать PDF
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ПРЕИМУЩЕСТВА МОДЕЛИ */}
      <section className="bg-graphite py-20 text-white">
        <div className="mx-auto max-w-[1440px] px-6">
          <Reveal>
            <h2 className="text-3xl font-bold md:text-4xl">
              Почему <span className="text-accent">{product.title}</span>
            </h2>
          </Reveal>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Нержавейка A2', desc: 'AISI 304', Icon: SteelIcon },
              { title: 'Без пластика', desc: 'Только металл', Icon: NoPlasticIcon },
              { title: 'Самовыравнивание', desc: 'Компенсация пола', Icon: LevelIcon },
              { title: 'Регулировка', desc: 'До 18 мм', Icon: AdjustIcon },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <div className="h-full rounded-panel border border-white/10 bg-white/5 p-6">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 p-2 text-accent">
                    <item.Icon />
                  </div>
                  <div className="font-semibold">{item.title}</div>
                  <div className="mt-1 text-sm text-white/60">{item.desc}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ФОРМА ЗАЯВКИ */}
      <section id="lead-form" className="relative overflow-hidden py-20">
        <div className="pointer-events-none absolute -top-20 left-1/2 h-96 w-96 -translate-x-1/2 animate-drift-a rounded-full bg-accent/4 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <Reveal>
            <h2 className="text-3xl font-bold md:text-4xl">
              Запрос по модели «{product.title}»
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-ink-muted">
              Оставьте заявку — инженер подберёт длину и подготовит КП
              в течение рабочего дня.
            </p>
          </Reveal>
          <Reveal delay={150}>
            <div className="mx-auto mt-10 max-w-3xl">
              <LeadForm />
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  )
}