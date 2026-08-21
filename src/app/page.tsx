import Link from 'next/link'
import Reveal from '@/components/motion/Reveal'
import ScrollProgress from '@/components/motion/ScrollProgress'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LeadForm from '@/components/LeadForm'

export const metadata = {
  title: 'FORBSA — автоматические пороги для дверей. Производство от 1 дня',
  description:
    'Российский производитель автоматических дверных порогов. 1 000 000 циклов, сертификат РОСТЕСТ, 10 моделей. Для архитекторов, дилеров и монтажников.',
}

export default function Home() {
  return (
    <main className="min-h-screen bg-surface text-ink">
      <ScrollProgress />
      <Header />

      {/* ========== БЛОК 1. HERO ========== */}
      <section className="relative overflow-hidden bg-graphite text-white">
        <div className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-accent/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 left-0 h-[400px] w-[400px] rounded-full bg-accent/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-24 md:grid-cols-2 md:py-32">
          <div className="flex flex-col justify-center">
            <Reveal>
              <span className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-white/70">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Производство · Россия
              </span>
            </Reveal>

            <Reveal delay={100}>
              <h1 className="font-heading text-5xl font-extrabold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
                Автоматические пороги{' '}
                <span className="bg-gradient-to-r from-[#ff7a1a] to-[#f24e00] bg-clip-text text-transparent">
                  FORBSA
                </span>
              </h1>
            </Reveal>

            <Reveal delay={200}>
              <p className="mt-6 max-w-xl text-lg text-white/70 md:text-xl">
                Герметизация двери за 1 секунду. Защита от дыма, шума, холода,
                света, пыли и насекомых. 1 000 000 циклов. Сертификат РОСТЕСТ.
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/catalog"
                  className="group inline-flex items-center gap-2 rounded-xl bg-accent px-7 py-4 text-base font-semibold text-white shadow-lg shadow-accent/30 transition-all hover:-translate-y-0.5 hover:bg-accent-dark hover:shadow-xl hover:shadow-accent/40"
                >
                  Смотреть каталог
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
                <Link
                  href="/partners"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-7 py-4 text-base font-semibold text-white backdrop-blur transition-all hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10"
                >
                  Стать дилером
                </Link>
              </div>
            </Reveal>

            <Reveal delay={400}>
              <div className="mt-12 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
                <div>
                  <div className="bg-gradient-to-r from-[#ff7a1a] to-[#f24e00] bg-clip-text text-3xl font-extrabold text-transparent md:text-4xl">
                    1M
                  </div>
                  <div className="mt-1 text-xs text-white/50">циклов</div>
                </div>
                <div>
                  <div className="bg-gradient-to-r from-[#ff7a1a] to-[#f24e00] bg-clip-text text-3xl font-extrabold text-transparent md:text-4xl">
                    1 день
                  </div>
                  <div className="mt-1 text-xs text-white/50">производство</div>
                </div>
                <div>
                  <div className="bg-gradient-to-r from-[#ff7a1a] to-[#f24e00] bg-clip-text text-3xl font-extrabold text-transparent md:text-4xl">
                    10
                  </div>
                  <div className="mt-1 text-xs text-white/50">моделей</div>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={200}>
            <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 md:aspect-square">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8">
                <div className="h-2 w-full max-w-xs rounded-full bg-white/10">
                  <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-[#ff7a1a] to-[#f24e00]" />
                </div>
                <div className="text-center">
                  <div className="text-sm uppercase tracking-wider text-white/40">
                    Видео работы механизма
                  </div>
                  <div className="mt-2 text-xs text-white/30">
                    10–15 сек · без звука
                  </div>
                </div>
                <button className="mt-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-white shadow-xl shadow-accent/40 transition-transform hover:scale-110">
                  <svg className="ml-1 h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========== БЛОК 2. ПРОБЛЕМА → РЕШЕНИЕ ========== */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <div className="mb-16 text-center">
              <span className="inline-block rounded-full bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
                Проблема → Решение
              </span>
              <h2 className="mt-4 font-heading text-4xl font-extrabold tracking-tight md:text-5xl">
                Щель под дверью —{' '}
                <span className="text-ink-muted">источник 6 проблем</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid gap-8 md:grid-cols-2">
            <Reveal>
              <div className="group relative overflow-hidden rounded-2xl border border-line bg-white p-8 transition-all hover:-translate-y-1 hover:shadow-xl">
                <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-red-500/5 blur-2xl transition-opacity group-hover:opacity-100" />
                <div className="relative">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                    БЕЗ ПОРОГА
                  </div>
                  <h3 className="font-heading text-2xl font-bold">
                    Что проникает в помещение
                  </h3>
                  <ul className="mt-6 space-y-3">
                    {[
                      'Холодный воздух и сквозняки',
                      'Уличный шум до 30 дБ',
                      'Дым при пожаре',
                      'Пыль и насекомые',
                      'Свет из коридора',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-ink-muted">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div className="group relative overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-br from-white to-orange-50/30 p-8 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/10">
                <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-accent/10 blur-2xl" />
                <div className="relative">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    С ПОРОГОМ FORBSA
                  </div>
                  <h3 className="font-heading text-2xl font-bold">
                    Полная герметизация за 1 сек
                  </h3>
                  <ul className="mt-6 space-y-3">
                    {[
                      'Звукоизоляция до 48 дБ',
                      'Защита от дыма и огня',
                      'Энергоэффективность здания',
                      'Соответствие СП 51.13330 / СП 50.13330',
                      'Прохождение госэкспертизы',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-ink">
                        <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-accent text-white">
                          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ========== БЛОК 3. КЛЮЧЕВЫЕ ЦИФРЫ ========== */}
      <section className="bg-graphite py-24 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <div className="mb-16 text-center">
              <h2 className="font-heading text-4xl font-extrabold tracking-tight md:text-5xl">
                Цифры, которые{' '}
                <span className="bg-gradient-to-r from-[#ff7a1a] to-[#f24e00] bg-clip-text text-transparent">
                  говорят сами
                </span>
              </h2>
            </div>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { value: '1 000 000', label: 'циклов', hint: 'ресурс механизма' },
              { value: 'от 1 дня', label: 'производство', hint: 'при наличии на складе' },
              { value: '200 мм', label: 'шаг длины', hint: 'под любую дверь' },
              { value: '10', label: 'моделей', hint: 'в линейке' },
            ].map((item, i) => (
              <Reveal key={item.label} delay={i * 100}>
                <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur transition-all hover:-translate-y-1 hover:border-accent/30 hover:bg-white/10">
                  <div className="bg-gradient-to-br from-[#ff7a1a] to-[#f24e00] bg-clip-text font-heading text-5xl font-extrabold leading-none text-transparent md:text-6xl">
                    {item.value}
                  </div>
                  <div className="mt-4 text-lg font-semibold">{item.label}</div>
                  <div className="mt-1 text-sm text-white/50">{item.hint}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========== БЛОК 4. РАЗДЕЛЕНИЕ АУДИТОРИИ ========== */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <div className="mb-16 text-center">
              <h2 className="font-heading text-4xl font-extrabold tracking-tight md:text-5xl">
                Выберите вашу роль
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-ink-muted">
                Мы говорим на одном языке с каждым участником строительного процесса
              </p>
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                role: 'Архитектор',
                title: 'Документация и BIM',
                desc: 'Альбом типовых решений, BIM-модели, узлы примыкания, готовые формулировки для ТЗ.',
                cta: 'Перейти в документацию',
                href: '/docs',
                icon: '📐',
              },
              {
                role: 'Дилер',
                title: 'Условия партнёрства',
                desc: 'Маржинальность, защита территории, маркетинговая поддержка, обучение команды.',
                cta: 'Стать партнёром',
                href: '/partners',
                icon: '🤝',
              },
              {
                role: 'Монтажник',
                title: 'Инструкции и видео',
                desc: 'Пошаговые инструкции, видео по установке, ответы на частые вопросы.',
                cta: 'Смотреть инструкции',
                href: '/docs#instructions',
                icon: '🔧',
              },
            ].map((card, i) => (
              <Reveal key={card.role} delay={i * 100}>
                <Link
                  href={card.href}
                  className="group flex h-full flex-col rounded-2xl border border-line bg-white p-8 transition-all hover:-translate-y-1 hover:border-accent/30 hover:shadow-xl hover:shadow-accent/5"
                >
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-3xl transition-transform group-hover:scale-110">
                    {card.icon}
                  </div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-accent">
                    {card.role}
                  </div>
                  <h3 className="mt-2 font-heading text-2xl font-bold">
                    {card.title}
                  </h3>
                  <p className="mt-3 flex-1 text-ink-muted">{card.desc}</p>
                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent transition-transform group-hover:gap-3">
                    {card.cta} →
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========== БЛОК 5. КАТАЛОГ-ПРЕВЬЮ ========== */}
      <section className="bg-surface py-24">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <div className="mb-12 flex items-end justify-between">
              <div>
                <h2 className="font-heading text-4xl font-extrabold tracking-tight md:text-5xl">
                  Линейка продукции
                </h2>
                <p className="mt-3 text-lg text-ink-muted">
                  10 моделей под любые задачи — от жилых объектов до противопожарных дверей
                </p>
              </div>
              <Link
                href="/catalog"
                className="hidden items-center gap-2 text-sm font-semibold text-accent transition-all hover:gap-3 md:inline-flex"
              >
                Весь каталог →
              </Link>
            </div>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {['Forbsa TT', 'Forbsa Aluma', 'Forbsa OMEGA'].map((name, i) => (
              <Reveal key={name} delay={i * 100}>
                <Link
                  href={`/catalog/${name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="group overflow-hidden rounded-2xl border border-line bg-white transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="aspect-[4/3] bg-gradient-to-br from-surface to-line" />
                  <div className="p-6">
                    <div className="text-xs font-semibold uppercase tracking-wider text-accent">
                      Врезной
                    </div>
                    <h3 className="mt-2 font-heading text-xl font-bold">{name}</h3>
                    <p className="mt-2 text-sm text-ink-muted">
                      Мин. ширина двери · от 200 мм
                    </p>
                    <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent transition-transform group-hover:gap-3">
                      Подробнее →
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white"
            >
              Весь каталог →
            </Link>
          </div>
        </div>
      </section>

      {/* ========== БЛОК 6. ТЕХНОЛОГИИ ========== */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <div className="mb-16 text-center">
              <h2 className="font-heading text-4xl font-extrabold tracking-tight md:text-5xl">
                Инженерное превосходство
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-ink-muted">
                Ни одного пластикового узла. Только металл, закалённая сталь и точная механика.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: 'Нержавейка A2', desc: 'AISI 304 — коррозионная стойкость' },
              { title: 'Самовыравнивание', desc: 'Компенсация неровностей пола' },
              { title: 'Регулировка до 18 мм', desc: 'Плавная настройка шестигранником' },
              { title: 'Без пластика', desc: 'Только металл и закалённые пружины' },
              { title: '1 000 000 циклов', desc: 'Подтверждённый ресурс' },
              { title: '8 факторов защиты', desc: 'Дым, шум, холод, свет, пыль и др.' },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <div className="group flex items-start gap-4 rounded-2xl border border-line bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-lg">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold">{item.title}</div>
                    <div className="mt-1 text-sm text-ink-muted">{item.desc}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========== БЛОК 7. ДОВЕРИЕ ========== */}
      <section className="bg-graphite py-24 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <div className="mb-16 text-center">
              <h2 className="font-heading text-4xl font-extrabold tracking-tight md:text-5xl">
                Нам доверяют
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-white/60">
                Сертифицированная продукция, проверенная миллионами циклов
              </p>
            </div>
          </Reveal>

          <div className="grid gap-8 md:grid-cols-2">
            <Reveal>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
                <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-accent">
                  Сертификация
                </div>
                <h3 className="font-heading text-2xl font-bold">
                  Сертификат РОСТЕСТ
                </h3>
                <p className="mt-3 text-white/60">
                  Продукция сертифицирована и соответствует требованиям
                  технических регламентов РФ. Протокол испытаний на 1 000 000
                  циклов.
                </p>
                <Link
                  href="/docs"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent transition-all hover:gap-3"
                >
                  Скачать сертификат →
                </Link>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
                <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-accent">
                  Объекты
                </div>
                <h3 className="font-heading text-2xl font-bold">
                  Логотипы объектов
                </h3>
                <p className="mt-3 text-white/60">
                  FORBSA установлен в жилых комплексах, бизнес-центрах и
                  социальных объектах по всей России.
                </p>
                <div className="mt-6 grid grid-cols-3 gap-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="flex aspect-[3/2] items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xs text-white/30"
                    >
                      Логотип {i}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ========== БЛОК 8. ФИНАЛЬНЫЙ CTA — с ТВОЕЙ формой ========== */}
      <section className="relative overflow-hidden bg-surface py-24">
        <div className="pointer-events-none absolute -top-20 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <Reveal>
            <h2 className="font-heading text-4xl font-extrabold tracking-tight md:text-5xl">
              Обсудим ваш проект?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-ink-muted">
              Оставьте заявку — инженер свяжется в течение рабочего дня,
              подберёт модель и подготовит коммерческое предложение.
            </p>
          </Reveal>

          <Reveal delay={150}>
            <div className="mx-auto mt-10 max-w-2xl">
              {/* ТВОЯ существующая форма — без изменений */}
              <LeadForm />
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  )
}