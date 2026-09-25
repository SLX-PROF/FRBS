import { draftMode } from 'next/headers'
import { getPageContent } from '@/lib/pageContent'
import PreviewListener from '@/components/PreviewListener'
import Reveal from '@/components/motion/Reveal'
import ScrollProgress from '@/components/motion/ScrollProgress'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import SectionHeading from '@/components/ui/SectionHeading'
import { FactoryIcon, ShieldIcon, RulerIcon } from '@/components/ui/Icons'

// Тексты берутся из админки на каждый запрос, поэтому страница не статическая.
export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const { isEnabled } = await draftMode()
  const c = await getPageContent('about-page', isEnabled)
  return { title: c.seoTitle, description: c.seoDescription }
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

export default async function AboutPage() {
  const { isEnabled: isDraft } = await draftMode()
  const c = await getPageContent('about-page', isDraft)
  return (
    <main className="min-h-screen bg-surface text-ink">
      <ScrollProgress />
      {isDraft && <PreviewListener />}
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden bg-graphite pt-8 pb-14 text-white md:pt-10 md:pb-20">
        <div className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[500px] animate-drift-a rounded-full bg-accent/6 blur-3xl" />
        <div className="relative mx-auto max-w-[1440px] px-6">
          <Reveal>
            <Tag tone="dark">{c.heroEyebrow}</Tag>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="mt-6 text-4xl leading-tight tracking-tight md:text-5xl lg:text-6xl">
              {c.heroTitle}{' '}
              <span className="text-accent">
                {c.heroAccent}
              </span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-6 max-w-2xl text-lg text-white/70 md:text-xl">
              {c.heroLead}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ИСТОРИЯ */}
      <section className="py-14 md:py-14">
        <div className="mx-auto max-w-[1440px] px-6">
          <Reveal>
            <SectionHeading title={c.historyTitle} />
            <p className="max-w-3xl text-lg text-ink-muted">
              {c.historyText}
            </p>
            {c.historyNote && (
              <p className="mt-4 max-w-3xl text-sm text-ink-muted/70">{c.historyNote}</p>
            )}
          </Reveal>
        </div>
      </section>

      {/* ПРОИЗВОДСТВО */}
      <section className="bg-graphite py-14 text-white md:py-14">
        <div className="mx-auto max-w-[1440px] px-6">
          <Reveal>
            <SectionHeading dark title={c.productionTitle} />
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
          {c.productionNote && (
            <Reveal delay={300}>
              <p className="mt-6 text-sm text-white/40">{c.productionNote}</p>
            </Reveal>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-14 text-center">
        <div className="pointer-events-none absolute -top-20 left-1/2 h-96 w-96 -translate-x-1/2 animate-drift-a rounded-full bg-accent/4 blur-3xl" />
        <div className="relative mx-auto max-w-2xl px-6">
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{c.ctaTitle}</h2>
            <p className="mx-auto mt-3 max-w-xl text-ink-muted">
              {c.ctaText}
            </p>
            <Button href="/contacts" size="lg" className="mt-8">
              {c.ctaButton}
            </Button>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  )
}
