import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Reveal from '@/components/motion/Reveal'
import ScrollProgress from '@/components/motion/ScrollProgress'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LeadMagnetForm from '@/components/LeadMagnetForm'
import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import { BookIcon, CertificateIcon, WrenchIcon, ScaleIcon } from '@/components/ui/Icons'
import type { ComponentType } from 'react'
import type { Document as DocDoc, Media } from '@/payload-types'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Документация FORBSA — сертификаты, альбом узлов, инструкции',
  description:
    'Сертификаты РОСТЕСТ, альбом типовых технических решений, BIM-модели, инструкции по монтажу. Всё для архитекторов, проектировщиков и монтажников.',
}

const categoryMeta: Record<string, { title: string; desc: string; Icon: ComponentType<{ className?: string }> }> = {
  certificates: {
    title: 'Сертификаты и протоколы',
    desc: 'Подтверждённое качество и соответствие российским стандартам.',
    Icon: CertificateIcon,
  },
  drawings: {
    title: 'Чертежи и альбом ТТР',
    desc: 'Узлы примыкания, спецификации, готовые формулировки для ТЗ.',
    Icon: BookIcon,
  },
  bim: {
    title: 'BIM-модели',
    desc: 'Семейства для Revit, IFC-файлы для ArchiCAD и других BIM-систем.',
    Icon: BookIcon,
  },
  instructions: {
    title: 'Инструкции по монтажу',
    desc: 'Пошаговые руководства для монтажников.',
    Icon: WrenchIcon,
  },
  legal: {
    title: 'Юридические документы',
    desc: 'Политики, согласия, реквизиты.',
    Icon: ScaleIcon,
  },
}

const categoryOrder = ['drawings', 'bim', 'certificates', 'instructions', 'legal']

function formatFromFilename(filename?: string | null): string {
  const ext = filename?.split('.').pop()?.toUpperCase()
  return ext || 'Файл'
}

function formatSize(bytes?: number | null): string {
  if (!bytes) return ''
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} КБ`
  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`
}

export default async function DocsPage() {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'documents',
    limit: 200,
    depth: 1,
    sort: 'category',
  })

  const byCategory = new Map<string, DocDoc[]>()
  for (const doc of docs as DocDoc[]) {
    const cat = doc.category ?? 'legal'
    if (!byCategory.has(cat)) byCategory.set(cat, [])
    byCategory.get(cat)!.push(doc)
  }
  const categories = categoryOrder
    .filter((id) => byCategory.has(id))
    .map((id) => ({ id, items: byCategory.get(id)!, ...categoryMeta[id] }))

  return (
    <main className="min-h-screen bg-surface text-ink">
      <ScrollProgress />
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden bg-graphite pt-8 pb-14 text-white md:pt-10 md:pb-16">
        <div className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[500px] animate-drift-a rounded-full bg-accent/6 blur-3xl" />
        <div className="relative mx-auto max-w-[1440px] px-6">
          <Reveal>
            <Tag tone="dark">Для архитекторов и проектировщиков</Tag>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="mt-6 text-4xl tracking-tight md:text-5xl lg:text-6xl">
              Документация{' '}
              <span className="text-accent">FORBSA</span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-4 max-w-2xl text-lg text-white/70 md:text-xl">
              Сертификаты, альбом типовых технических решений, BIM-модели и
              инструкции по монтажу. Все файлы доступны для скачивания без
              регистрации.
            </p>
          </Reveal>

          {categories.length > 0 && (
            <Reveal delay={300}>
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {categories.map((c) => (
                  <a
                    key={c.id}
                    href={`#${c.id}`}
                    className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-white backdrop-blur transition-all hover:-translate-y-0.5 hover:border-accent/50 hover:bg-white/10"
                  >
                    <c.Icon className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{c.title}</span>
                  </a>
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* КАТЕГОРИИ ДОКУМЕНТОВ */}
      <section className="py-14">
        <div className="mx-auto max-w-[1440px] px-6">
          {categories.length === 0 ? (
            <div className="rounded-2xl border border-line bg-white p-12 text-center text-ink-muted">
              Документы ещё не загружены. Добавьте их в админке: раздел «Документы».
            </div>
          ) : (
            <div className="space-y-16">
              {categories.map((cat) => (
                <div key={cat.id} id={cat.id} className="scroll-mt-20">
                  <Reveal>
                    <div className="mb-8 flex items-start gap-4">
                      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-accent/10 p-3.5 text-accent">
                        <cat.Icon />
                      </div>
                      <div>
                        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                          {cat.title}
                        </h2>
                        <p className="mt-1 text-ink-muted">{cat.desc}</p>
                      </div>
                    </div>
                  </Reveal>

                  <div className="grid gap-4 md:grid-cols-2">
                    {cat.items.map((item, i) => {
                      const file = typeof item.file === 'object' ? (item.file as Media) : null
                      const format = formatFromFilename(file?.filename)
                      const size = formatSize(file?.filesize)
                      return (
                        <Reveal key={item.id} delay={i * 80}>
                          <a
                            href={file?.url || '#'}
                            download
                            className="group flex h-full items-start gap-4 rounded-2xl border border-line bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
                          >
                            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-graphite text-xs font-bold uppercase text-white">
                              {format}
                            </div>

                            <div className="flex h-full flex-1 flex-col">
                              <h3 className="font-semibold transition-colors group-hover:text-accent">
                                {item.title}
                              </h3>
                              {item.description && (
                                <p className="mt-1 flex-1 text-sm text-ink-muted">
                                  {item.description}
                                </p>
                              )}
                              <div className="mt-3 flex items-center gap-3 text-xs text-ink-muted">
                                <span>{format}</span>
                                {size && (
                                  <>
                                    <span>·</span>
                                    <span>{size}</span>
                                  </>
                                )}
                                <span className="ml-auto inline-flex items-center gap-1 font-semibold text-accent transition-all group-hover:gap-2">
                                  Скачать →
                                </span>
                              </div>
                            </div>
                          </a>
                        </Reveal>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ЛИД-МАГНИТ: АЛЬБОМ ПО ПОДПИСКЕ */}
      <section className="bg-graphite py-14 text-white">
        <div className="mx-auto max-w-4xl px-6">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-8 md:p-12">
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 animate-drift-a rounded-full bg-accent/6 blur-3xl" />

              <div className="relative">
                <Tag>Лид-магнит для проектировщиков</Tag>
                <h2 className="mt-4 text-3xl font-semibold md:text-4xl">
                  Получите Альбом ТТР + BIM-модели на email
                </h2>
                <p className="mt-3 max-w-xl text-white/70">
                  Оставьте рабочий email — пришлём полную версию альбома,
                  BIM-семейства и приглашение на технический вебинар.
                </p>

                <LeadMagnetForm />

                <p className="mt-3 text-xs text-white/40">
                  Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA-БЛОК */}
      <section className="py-14">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Нужна консультация инженера?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-ink-muted">
              Поможем подобрать модель, подготовим узел под ваш проект,
              проконсультируем по госэкспертизе.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button href="/contacts" size="lg">
                Связаться с инженером →
              </Button>
              <Button href="/partners" variant="outline" size="lg">
                Стать дилером
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  )
}
