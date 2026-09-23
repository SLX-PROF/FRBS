import Link from 'next/link'
import Reveal from '@/components/motion/Reveal'
import ScrollProgress from '@/components/motion/ScrollProgress'
import Parallax from '@/components/motion/Parallax'
import ThresholdDemo from '@/components/motion/ThresholdDemo'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LeadForm from '@/components/LeadForm'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import CountUp from '@/components/motion/CountUp'
import Tag from '@/components/ui/Tag'
import SectionHeading from '@/components/ui/SectionHeading'
import ProductPhotoHover from '@/components/ui/ProductPhotoHover'
import { getAllProducts } from '@/lib/products'
import {
  ArchitectIcon,
  DealerIcon,
  InstallerIcon,
  CheckIcon,
  SteelIcon,
  LevelIcon,
  AdjustIcon,
  NoPlasticIcon,
  CycleIcon,
  ShieldIcon,
  CertificateIcon,
} from '@/components/ui/Icons'

// Обращается к БД на каждый запрос (превью каталога) — при сборке в Docker
// живой БД нет, поэтому страница не может быть prerendered статически.
export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const products = await getAllProducts()
  return {
    title: 'FORBSA — автоматические пороги для дверей. Производство от 1 дня',
    description: `Российский производитель автоматических дверных порогов. 1 000 000 циклов, сертификат РОСТЕСТ, ${products.length} моделей. Для архитекторов, дилеров и монтажников.`,
  }
}

const audience = [
  {
    role: 'Архитектор',
    title: 'Документация и BIM',
    desc: 'Альбом типовых решений, BIM-модели, узлы примыкания, готовые формулировки для ТЗ.',
    cta: 'Перейти в документацию',
    href: '/docs',
    Icon: ArchitectIcon,
  },
  {
    role: 'Дилер',
    title: 'Условия партнёрства',
    desc: 'Маржинальность, защита территории, маркетинговая поддержка, обучение команды.',
    cta: 'Стать партнёром',
    href: '/partners',
    Icon: DealerIcon,
  },
  {
    role: 'Монтажник',
    title: 'Инструкции и видео',
    desc: 'Пошаговые инструкции, видео по установке, ответы на частые вопросы.',
    cta: 'Смотреть инструкции',
    href: '/docs#instructions',
    Icon: InstallerIcon,
  },
]

const tech = [
  { title: 'Нержавейка A2', desc: 'AISI 304 — коррозионная стойкость', Icon: SteelIcon },
  { title: 'Самовыравнивание', desc: 'Компенсация неровностей пола', Icon: LevelIcon },
  { title: 'Регулировка до 18 мм', desc: 'Плавная настройка шестигранником', Icon: AdjustIcon },
  { title: 'Без пластика', desc: 'Только металл и закалённые пружины', Icon: NoPlasticIcon },
  { title: '1 000 000 циклов', desc: 'Подтверждённый ресурс', Icon: CycleIcon },
  { title: '8 факторов защиты', desc: 'Дым, шум, холод, свет, пыль и др.', Icon: ShieldIcon },
]

export default async function Home() {
  const products = await getAllProducts()
  const catalogPreview = products.slice(0, 3)

  return (
    <main className="min-h-screen bg-surface text-ink">
      <ScrollProgress />
      <Header />

      {/* ========== БЛОК 1. HERO ========== */}
      <section className="relative overflow-hidden bg-graphite text-white">
        <Parallax speed={0.28} className="pointer-events-none absolute -top-40 right-0">
          <div className="h-[500px] w-[500px] rounded-full bg-accent/6 blur-3xl" />
        </Parallax>
        <Parallax speed={-0.2} className="pointer-events-none absolute -bottom-40 left-0">
          <div className="h-[400px] w-[400px] rounded-full bg-accent/4 blur-3xl" />
        </Parallax>

        <div className="relative mx-auto grid max-w-[1440px] grid-cols-1 gap-12 px-6 pt-14 pb-24 md:grid-cols-2 md:pt-20 md:pb-32">
          <div className="flex flex-col justify-center">
            <Reveal>
              <Tag tone="dark">Производство · Россия</Tag>
            </Reveal>

            <Reveal delay={100}>
              <h1 className="mt-6 text-5xl leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
                Автоматические пороги{' '}
                <span className="text-accent">
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
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Button href="/catalog" size="lg" className="group">
                  Смотреть каталог
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Button>
                <Button href="/calculator" variant="ghost" size="lg">
                  Подобрать модель
                </Button>
                <Link
                  href="/partners"
                  className="text-sm font-semibold text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline"
                >
                  Стать дилером →
                </Link>
              </div>
            </Reveal>

            <Reveal delay={400}>
              <div className="mt-12 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
                {[
                  { value: '1M', label: 'циклов' },
                  { value: '1 день', label: 'производство' },
                  { value: '10', label: 'моделей' },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="font-display text-3xl font-semibold text-accent md:text-4xl">
                      {s.value}
                    </div>
                    <div className="mt-1 text-xs text-white/50">{s.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={200}>
            <div className="flex aspect-[4/5] flex-col gap-3 md:aspect-square">
              <ThresholdDemo className="flex-1" />
              <p className="text-center text-xs text-white/40">
                Пружинный механизм без электроники. Тяните бегунок — прокрутите цикл вручную.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========== БЛОК 2. ПРОБЛЕМА → РЕШЕНИЕ ========== */}
      <section className="py-24">
        <div className="mx-auto max-w-[1440px] px-6">
          <Reveal>
            <SectionHeading
              center
              eyebrow="Проблема → Решение"
              title={
                <>
                  Щель под дверью — <span className="text-ink-muted">источник 6 проблем</span>
                </>
              }
            />
          </Reveal>

          <div className="grid gap-8 md:grid-cols-2">
            <Reveal>
              <Card className="relative h-full overflow-hidden">
                <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-red-500/5 blur-2xl" />
                <div className="relative">
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                    БЕЗ ПОРОГА
                  </div>
                  <h3 className="text-2xl font-bold">Что проникает в помещение</h3>
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
              </Card>
            </Reveal>

            <Reveal delay={150}>
              <Card className="relative h-full overflow-hidden border-accent/20 bg-gradient-to-br from-white to-accent-light/60">
                <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-accent/10 blur-2xl" />
                <div className="relative">
                  <Tag>С ПОРОГОМ FORBSA</Tag>
                  <h3 className="mt-4 text-2xl font-bold">Полная герметизация за 1 сек</h3>
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
                          <CheckIcon className="h-3 w-3" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ========== БЛОК 3. КЛЮЧЕВЫЕ ЦИФРЫ ========== */}
      <section className="bg-graphite py-24 text-white">
        <div className="mx-auto max-w-[1440px] px-6">
          <Reveal>
            <SectionHeading
              dark
              center
              title={
                <>
                  Цифры, которые{' '}
                  <span className="text-accent">
                    говорят сами
                  </span>
                </>
              }
            />
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {(
              [
                { to: 1000000, label: 'циклов', hint: 'ресурс механизма' },
                { value: 'от 1 дня', label: 'производство', hint: 'при наличии на складе' },
                { to: 200, suffix: ' мм', label: 'шаг длины', hint: 'под любую дверь' },
                { to: 10, label: 'моделей', hint: 'в линейке' },
              ] as { to?: number; suffix?: string; value?: string; label: string; hint: string }[]
            ).map((item, i) => (
              <Reveal key={item.label} delay={i * 100}>
                <div className="group flex h-full flex-col rounded-panel border border-white/10 bg-white/5 p-8 backdrop-blur transition-all hover:-translate-y-1 hover:border-accent/30 hover:bg-white/10">
                  <div className="whitespace-nowrap font-display text-4xl font-semibold leading-none text-accent md:text-5xl xl:text-4xl">
                    {item.to !== undefined ? (
                      <CountUp to={item.to} suffix={item.suffix} />
                    ) : (
                      item.value
                    )}
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
        <div className="mx-auto max-w-[1440px] px-6">
          <Reveal>
            <SectionHeading
              center
              title="Выберите вашу роль"
              subtitle="Мы говорим на одном языке с каждым участником строительного процесса"
            />
          </Reveal>

          <div className="grid gap-6 md:grid-cols-3">
            {audience.map((card, i) => (
              <Reveal key={card.role} delay={i * 100}>
                <Card href={card.href} className="group flex h-full flex-col hover:border-accent/30">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 p-3.5 text-accent transition-transform group-hover:scale-110">
                    <card.Icon />
                  </div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-accent">
                    {card.role}
                  </div>
                  <h3 className="mt-2 text-2xl font-bold">{card.title}</h3>
                  <p className="mt-3 flex-1 text-ink-muted">{card.desc}</p>
                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent transition-transform group-hover:gap-3">
                    {card.cta} →
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========== БЛОК 5. КАТАЛОГ-ПРЕВЬЮ ========== */}
      <section className="bg-surface py-24">
        <div className="mx-auto max-w-[1440px] px-6">
          <Reveal>
            <div className="mb-12 flex items-end justify-between">
              <SectionHeading
                title="Линейка продукции"
                subtitle={`${products.length} моделей под любые задачи — от жилых объектов до противопожарных дверей`}
              />
              <Link
                href="/catalog"
                className="hidden items-center gap-2 text-sm font-semibold text-accent transition-all hover:gap-3 md:inline-flex"
              >
                Весь каталог →
              </Link>
            </div>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {catalogPreview.map((p, i) => (
              <Reveal key={p.id} delay={i * 100}>
                <Card
                  href={`/catalog/${p.slug}`}
                  className="group flex h-full flex-col overflow-hidden p-0"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-surface transition-transform duration-500 group-hover:scale-105">
                    <ProductPhotoHover images={p.images} alt={p.title} variant={(i % 3) as 0 | 1 | 2} />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="text-xs font-semibold uppercase tracking-wider text-accent">
                      {p.type === 'врезной' ? 'Врезной' : 'Накладной'}
                    </div>
                    <h3 className="mt-2 text-xl font-bold">{p.title}</h3>
                    {p.minDoorWidth && (
                      <p className="mt-2 text-sm text-ink-muted">
                        Мин. ширина двери · от {p.minDoorWidth} мм
                      </p>
                    )}
                    <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent transition-transform group-hover:gap-3">
                      Подробнее →
                    </div>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Button href="/catalog">Весь каталог →</Button>
          </div>
        </div>
      </section>

      {/* ========== БЛОК 6. ТЕХНОЛОГИИ ========== */}
      <section className="py-24">
        <div className="mx-auto max-w-[1440px] px-6">
          <Reveal>
            <SectionHeading
              center
              title="Инженерное превосходство"
              subtitle="Ни одного пластикового узла. Только металл, закалённая сталь и точная механика."
            />
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tech.map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <Card className="group flex h-full items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-accent/10 p-2.5 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                    <item.Icon />
                  </div>
                  <div>
                    <div className="font-semibold">{item.title}</div>
                    <div className="mt-1 text-sm text-ink-muted">{item.desc}</div>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========== БЛОК 7. ДОВЕРИЕ ========== */}
      <section className="bg-graphite py-24 text-white">
        <div className="mx-auto max-w-[1440px] px-6">
          <Reveal>
            <SectionHeading
              dark
              center
              title="Нам доверяют"
              subtitle="Сертифицированная продукция, проверенная миллионами циклов"
            />
          </Reveal>

          <div className="grid gap-8 md:grid-cols-2">
            <Reveal>
              <div className="flex h-full flex-col rounded-panel border border-white/10 bg-white/5 p-8 backdrop-blur">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 p-2.5 text-accent">
                  <CertificateIcon />
                </div>
                <h3 className="text-2xl font-bold">Сертификат РОСТЕСТ</h3>
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
              <div className="flex h-full flex-col rounded-panel border border-white/10 bg-white/5 p-8 backdrop-blur">
                <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-accent">
                  Где применяется
                </div>
                <h3 className="text-2xl font-bold">Объекты по всей России</h3>
                <p className="mt-3 text-white/60">
                  FORBSA устанавливается там, где важна герметичность и
                  надёжность механизма на протяжении тысяч циклов в год.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {['Жилые комплексы', 'Бизнес-центры', 'Социальные объекты', 'Промышленные объекты'].map(
                    (t) => (
                      <span
                        key={t}
                        className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80"
                      >
                        {t}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ========== БЛОК 8. ФИНАЛЬНЫЙ CTA — с ТВОЕЙ формой ========== */}
      <section id="contact" className="relative overflow-hidden bg-surface py-24 scroll-mt-28">
        <div className="pointer-events-none absolute -top-20 left-1/2 h-96 w-96 -translate-x-1/2 animate-drift-a rounded-full bg-accent/4 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <Reveal>
            <SectionHeading
              center
              title="Обсудим ваш проект?"
              subtitle="Оставьте заявку — инженер свяжется в течение рабочего дня, подберёт модель и подготовит коммерческое предложение."
            />
          </Reveal>

          <Reveal delay={150}>
            <div className="mx-auto mt-2 max-w-3xl">
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
