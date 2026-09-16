import Reveal from '@/components/motion/Reveal'
import ScrollProgress from '@/components/motion/ScrollProgress'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import SectionHeading from '@/components/ui/SectionHeading'
import { FactoryIcon, ShieldIcon, RulerIcon, CertificateIcon } from '@/components/ui/Icons'

export const metadata = {
  title: 'О компании — FORBSA',
  description:
    'FORBSA — российский производитель автоматических дверных порогов. 1 000 000 циклов, сертификат РОСТЕСТ, производство от 1 дня.',
}

const production = [
  {
    title: 'Собственный цех',
    desc: 'Полный цикл: резка профиля, сборка, контроль качества. Производство от 1 рабочего дня.',
    Icon: FactoryIcon,
  },
  {
    title: 'Контроль качества',
    desc: 'Нержавеющая сталь A2 (AISI 304), закалённые пружины, отсутствие пластиковых деталей, самовыравнивание на неровном полу.',
    Icon: ShieldIcon,
  },
  {
    title: 'Шаг длины 200 мм',
    desc: 'Пороги любой длины в производимом диапазоне, укорочение на 220 мм, регулировка выпада до 18 мм.',
    Icon: RulerIcon,
  },
]

const certs = [
  { title: 'Сертификат РОСТЕСТ', text: 'Продукция сертифицирована и соответствует требованиям РФ.' },
  { title: 'Протокол 1 000 000 циклов', text: 'Механизм испытан на 1 000 000 циклов открывания-закрывания.' },
  { title: 'СП 51.13330.2011', text: 'Защита от шума: звукоизоляция до 44-48 дБ.' },
  { title: 'СП 50.13330.2012', text: 'Тепловая защита: исключение продувания через нижний зазор.' },
  { title: 'ГОСТ 31173-2016', text: 'Блоки дверные металлические: классы воздухо- и водопроницаемости.' },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-surface text-ink">
      <ScrollProgress />
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden bg-graphite py-20 text-white md:py-28">
        <div className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[500px] animate-drift-a rounded-full bg-accent/6 blur-3xl" />
        <div className="relative mx-auto max-w-[1440px] px-6">
          <Reveal>
            <Tag tone="dark">О компании</Tag>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="mt-6 text-4xl leading-tight tracking-tight md:text-5xl lg:text-6xl">
              Мы делаем двери{' '}
              <span className="text-accent">
                защищёнными
              </span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-6 max-w-2xl text-lg text-white/70 md:text-xl">
              FORBSA — российский производитель автоматических порогов. Наша миссия —
              герметизация каждого дверного проёма: без дыма, шума, пыли, сквозняков и насекомых.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ИСТОРИЯ */}
      <section className="py-20 md:py-20">
        <div className="mx-auto max-w-[1440px] px-6">
          <Reveal>
            <SectionHeading title="История и путь развития" />
            <p className="max-w-3xl text-lg text-ink-muted">
              Мы выросли из производства дверной фурнитуры в полноценного производителя
              автоматических порогов полного цикла: собственный цех, контроль качества,
              складская программа и отгрузки по России и СНГ.
            </p>
            <p className="mt-4 max-w-3xl text-sm text-ink-muted/70">
              * Точные даты и вехи истории добавит директор — скелет блока готов к наполнению.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ПРОИЗВОДСТВО */}
      <section className="bg-graphite py-20 text-white md:py-20">
        <div className="mx-auto max-w-[1440px] px-6">
          <Reveal>
            <SectionHeading dark title="Производство" />
          </Reveal>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {production.map((item, i) => (
              <Reveal key={item.title} delay={i * 100}>
                <div className="h-full rounded-panel border border-white/10 bg-white/5 p-6 backdrop-blur transition-all hover:-translate-y-1 hover:border-accent/30 hover:bg-white/10">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 p-2.5 text-accent">
                    <item.Icon />
                  </div>
                  <h3 className="text-lg font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm text-white/60">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={300}>
            <p className="mt-6 text-sm text-white/40">
              * Фото и видео цеха появятся после фотосессии — бюджет согласован.
            </p>
          </Reveal>
        </div>
      </section>

      {/* СЕРТИФИКАТЫ */}
      <section className="py-20 md:py-20">
        <div className="mx-auto max-w-[1440px] px-6">
          <Reveal>
            <SectionHeading
              eyebrow="Доверие"
              title="Сертификаты и испытания"
              subtitle="Подтверждённое качество и соответствие российским стандартам"
            />
          </Reveal>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {certs.map((c, i) => (
              <Reveal key={c.title} delay={i * 60}>
                <div className="flex h-full items-start gap-4 rounded-panel border-l-4 border-accent bg-white p-5 shadow-panel">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-accent/10 p-2 text-accent">
                    <CertificateIcon />
                  </div>
                  <div>
                    <p className="font-bold text-ink">{c.title}</p>
                    <p className="mt-1 text-sm text-ink-muted">{c.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <Button href="/docs" className="mt-8">
              Скачать сертификаты
            </Button>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-graphite py-20 text-center text-white">
        <div className="pointer-events-none absolute -top-20 left-1/2 h-96 w-96 -translate-x-1/2 animate-drift-a rounded-full bg-accent/4 blur-3xl" />
        <div className="relative mx-auto max-w-2xl px-6">
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Связаться с нами</h2>
            <p className="mx-auto mt-3 max-w-xl text-white/70">
              Ответим на вопросы, поможем подобрать модель и подготовим коммерческое предложение.
            </p>
            <Button href="/contacts" size="lg" className="mt-8">
              Связаться с нами
            </Button>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  )
}
