import Link from 'next/link'
import Reveal from '@/components/motion/Reveal'
import ScrollProgress from '@/components/motion/ScrollProgress'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LeadMagnetForm from '@/components/LeadMagnetForm'

export const metadata = {
  title: 'Документация FORBSA — сертификаты, альбом узлов, инструкции',
  description:
    'Сертификаты РОСТЕСТ, альбом типовых технических решений, BIM-модели, инструкции по монтажу. Всё для архитекторов, проектировщиков и монтажников.',
}

type DocItem = {
  title: string
  desc: string
  format: string
  size: string
  href: string
  badge?: string
}

type DocCategory = {
  id: string
  title: string
  desc: string
  icon: string
  items: DocItem[]
}

const categories: DocCategory[] = [
  {
    id: 'album',
    title: 'Альбом типовых технических решений',
    desc: 'Основной документ для проектировщиков. Узлы примыкания, спецификации, готовые формулировки для ТЗ.',
    icon: '📘',
    items: [
      {
        title: 'Альбом ТТР FORBSA (полная версия)',
        desc: '20+ узлов примыкания для алюминиевых, стальных, ПВХ и деревянных дверей. Спецификации, чертежи, примеры в проектах.',
        format: 'PDF',
        size: '12 МБ',
        href: '/docs/forbsa-album-ttr.pdf',
        badge: 'Главный документ',
      },
      {
        title: 'Узлы для противопожарных дверей',
        desc: 'Отдельный раздел для EI30/EI60 дверей. Соответствие СП 1.13130 и СП 4.13130.',
        format: 'PDF',
        size: '4 МБ',
        href: '/docs/forbsa-fire-doors.pdf',
      },
      {
        title: 'BIM-модели (Revit + IFC)',
        desc: 'Семейства для Revit 2022+, IFC-файлы для ArchiCAD и других BIM-систем.',
        format: 'RVT / IFC',
        size: '8 МБ',
        href: '/docs/forbsa-bim.zip',
        badge: 'Для архитекторов',
      },
    ],
  },
  {
    id: 'certs',
    title: 'Сертификаты и протоколы',
    desc: 'Подтверждённое качество и соответствие российским стандартам.',
    icon: '📜',
    items: [
      {
        title: 'Сертификат РОСТЕСТ',
        desc: 'Сертификат соответствия требованиям технических регламентов РФ.',
        format: 'PDF',
        size: '1.2 МБ',
        href: '/docs/forbsa-rostest.pdf',
        badge: 'РОСТЕСТ',
      },
      {
        title: 'Протокол испытаний на 1 000 000 циклов',
        desc: 'Подтверждённый ресурс механизма. Испытания в аккредитованной лаборатории.',
        format: 'PDF',
        size: '2.5 МБ',
        href: '/docs/forbsa-protocol-1m.pdf',
      },
      {
        title: 'Протокол звукоизоляции (44–48 дБ)',
        desc: 'Соответствие СП 51.13330.2011 «Защита от шума».',
        format: 'PDF',
        size: '1.8 МБ',
        href: '/docs/forbsa-soundproof.pdf',
      },
      {
        title: 'Протокол теплозащиты',
        desc: 'Соответствие СП 50.13330.2012 «Тепловая защита зданий».',
        format: 'PDF',
        size: '1.5 МБ',
        href: '/docs/forbsa-thermal.pdf',
      },
      {
        title: 'Соответствие ГОСТ 31173-2016',
        desc: 'Блоки дверные металлические. Воздухо- и водопроницаемость.',
        format: 'PDF',
        size: '1.3 МБ',
        href: '/docs/forbsa-gost.pdf',
      },
    ],
  },
  {
    id: 'instructions',
    title: 'Инструкции по монтажу',
    desc: 'Пошаговые руководства для монтажников. Видео и PDF.',
    icon: '🔧',
    items: [
      {
        title: 'Инструкция по монтажу врезных порогов',
        desc: 'Модели TT, Aluma, XRAY, ALLSIZE, UNIFIX, SMART, OMEGA, Mini, Flat.',
        format: 'PDF',
        size: '3 МБ',
        href: '/docs/forbsa-install-recessed.pdf',
      },
      {
        title: 'Инструкция по монтажу накладных порогов',
        desc: 'Модель Flush — установка без фрезеровки.',
        format: 'PDF',
        size: '2 МБ',
        href: '/docs/forbsa-install-flush.pdf',
      },
      {
        title: 'Видео: установка порога за 3 минуты',
        desc: 'Пошаговая видеоинструкция от инженера FORBSA.',
        format: 'MP4',
        size: '45 МБ',
        href: '/docs/forbsa-install-video.mp4',
        badge: 'Видео',
      },
      {
        title: 'Регулировка выпада (до 18 мм)',
        desc: 'Как настроить расстояние выпада шестигранником.',
        format: 'PDF',
        size: '800 КБ',
        href: '/docs/forbsa-adjustment.pdf',
      },
    ],
  },
  {
    id: 'legal',
    title: 'Юридические документы',
    desc: 'Политики, согласия, реквизиты.',
    icon: '⚖️',
    items: [
      {
        title: 'Политика конфиденциальности',
        desc: 'Порядок обработки персональных данных на сайте.',
        format: 'PDF',
        size: '250 КБ',
        href: '/docs/forbsa-privacy.pdf',
      },
      {
        title: 'Согласие на обработку персональных данных',
        desc: 'Форма согласия для клиентов.',
        format: 'PDF',
        size: '180 КБ',
        href: '/docs/forbsa-consent.pdf',
      },
      {
        title: 'Реквизиты компании',
        desc: 'Полные реквизиты ООО «Форбса» для договоров.',
        format: 'PDF',
        size: '120 КБ',
        href: '/docs/forbsa-requisites.pdf',
      },
    ],
  },
]

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-surface text-ink">
      <ScrollProgress />
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden bg-graphite py-16 text-white md:py-24">
        <div className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-accent/20 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-6">
          <Reveal>
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-white/70">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Для архитекторов и проектировщиков
            </span>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="font-heading text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
              Документация{' '}
              <span className="bg-gradient-to-r from-[#ff7a1a] to-[#f24e00] bg-clip-text text-transparent">
                FORBSA
              </span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-4 max-w-2xl text-lg text-white/70 md:text-xl">
              Сертификаты, альбом типовых технических решений, BIM-модели и
              инструкции по монтажу. Все файлы доступны для скачивания без
              регистрации.
            </p>
          </Reveal>

          {/* Быстрые ссылки */}
          <Reveal delay={300}>
            <div className="mt-8 flex flex-wrap gap-3">
              {categories.map((c) => (
                <a
                  key={c.id}
                  href={`#${c.id}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white backdrop-blur transition-all hover:-translate-y-0.5 hover:border-accent/50 hover:bg-white/10"
                >
                  <span>{c.icon}</span>
                  {c.title.split(' ').slice(0, 2).join(' ')}
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* КАТЕГОРИИ ДОКУМЕНТОВ */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="space-y-16">
            {categories.map((cat, catIdx) => (
              <div key={cat.id} id={cat.id} className="scroll-mt-20">
                <Reveal>
                  <div className="mb-8 flex items-start gap-4">
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-3xl">
                      {cat.icon}
                    </div>
                    <div>
                      <h2 className="font-heading text-2xl font-extrabold tracking-tight md:text-3xl">
                        {cat.title}
                      </h2>
                      <p className="mt-1 text-ink-muted">{cat.desc}</p>
                    </div>
                  </div>
                </Reveal>

                <div className="grid gap-4 md:grid-cols-2">
                  {cat.items.map((item, i) => (
                    <Reveal key={item.title} delay={i * 80}>
                      <a
                        href={item.href}
                        download
                        className="group flex h-full items-start gap-4 rounded-2xl border border-line bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
                      >
                        {/* Иконка формата */}
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-graphite text-xs font-bold uppercase text-white">
                          {item.format}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold transition-colors group-hover:text-accent">
                              {item.title}
                            </h3>
                            {item.badge && (
                              <span className="flex-shrink-0 rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-ink-muted">
                            {item.desc}
                          </p>
                          <div className="mt-3 flex items-center gap-3 text-xs text-ink-muted">
                            <span>{item.format}</span>
                            <span>·</span>
                            <span>{item.size}</span>
                            <span className="ml-auto inline-flex items-center gap-1 font-semibold text-accent transition-all group-hover:gap-2">
                              Скачать →
                            </span>
                          </div>
                        </div>
                      </a>
                    </Reveal>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ЛИД-МАГНИТ: АЛЬБОМ ПО ПОДПИСКЕ */}
      <section className="bg-graphite py-16 text-white">
        <div className="mx-auto max-w-4xl px-6">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 p-8 md:p-12">
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />

              <div className="relative">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
                  🔥 Лид-магнит для проектировщиков
                </div>
                <h2 className="font-heading text-3xl font-extrabold md:text-4xl">
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
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Reveal>
            <h2 className="font-heading text-3xl font-extrabold tracking-tight md:text-4xl">
              Нужна консультация инженера?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-ink-muted">
              Поможем подобрать модель, подготовим узел под ваш проект,
              проконсультируем по госэкспертизе.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/contacts"
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-7 py-4 font-semibold text-white shadow-lg shadow-accent/30 transition-all hover:-translate-y-0.5 hover:bg-accent-dark"
              >
                Связаться с инженером →
              </Link>
              <Link
                href="/partners"
                className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-7 py-4 font-semibold text-ink transition-all hover:-translate-y-0.5 hover:border-accent/30"
              >
                Стать дилером
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  )
}