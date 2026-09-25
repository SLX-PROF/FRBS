import { draftMode } from 'next/headers'
import { getPageContent } from '@/lib/pageContent'
import PreviewListener from '@/components/PreviewListener'
import Reveal from '@/components/motion/Reveal'
import ScrollProgress from '@/components/motion/ScrollProgress'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LeadForm from '@/components/LeadForm'
import Card from '@/components/ui/Card'
import Tag from '@/components/ui/Tag'
import SectionHeading from '@/components/ui/SectionHeading'
import { MapPinIcon, PhoneIcon, MailIcon, MessageIcon } from '@/components/ui/Icons'

// Тексты берутся из админки на каждый запрос, поэтому страница не статическая.
export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const { isEnabled } = await draftMode()
  const c = await getPageContent('contacts-page', isEnabled)
  return { title: c.seoTitle, description: c.seoDescription }
}

export default async function ContactsPage() {
  const { isEnabled: isDraft } = await draftMode()
  const c = await getPageContent('contacts-page', isDraft)
  return (
    <main className="min-h-screen bg-surface text-ink">
      <ScrollProgress />
      {isDraft && <PreviewListener />}
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden bg-graphite pt-8 pb-14 text-white md:pt-10 md:pb-16">
        <div className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[500px] animate-drift-a rounded-full bg-accent/6 blur-3xl" />
        <div className="relative mx-auto max-w-[1440px] px-6">
          <Reveal>
            <Tag tone="dark">{c.heroEyebrow}</Tag>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="mt-6 text-4xl tracking-tight md:text-5xl lg:text-6xl">
              {c.heroTitle}{' '}
              <span className="text-accent">
                {c.heroAccent}
              </span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-4 max-w-2xl text-lg text-white/70 md:text-xl">
              {c.heroLead}
            </p>
          </Reveal>
        </div>
      </section>

      {/* КОНТАКТЫ + КАРТА */}
      <section className="py-14">
        <div className="mx-auto max-w-[1440px] px-6">
          <div className="grid gap-8 lg:grid-cols-5">
            {/* ЛЕВАЯ КОЛОНКА — КОНТАКТЫ */}
            <div className="lg:col-span-2">
              <Reveal>
                <div className="space-y-6">
                  {/* АДРЕС */}
                  <Card>
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 p-2 text-accent">
                      <MapPinIcon />
                    </div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                      Адрес
                    </div>
                    <div className="mt-1 font-semibold">
                      117105, город Москва, 1-Й Нагатинский пр-д, д. 2 стр. 12, помещ. 2/2 
                    </div>
                    <div className="mt-1 text-sm text-ink-muted">
                      Офис и производство
                    </div>
                  </Card>

                  {/* ТЕЛЕФОН */}
                  <Card>
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 p-2 text-accent">
                      <PhoneIcon />
                    </div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                      Телефон
                    </div>
                    <a
                      href="tel:+74957985225"
                      className="mt-1 block text-xl font-bold transition-colors hover:text-accent"
                    >
                      +7 (495) 798-52-25
                    </a>
                    <div className="mt-1 text-sm text-ink-muted">
                      Пн–Пт, 9:00–18:00 (МСК)
                    </div>
                  </Card>

                  {/* EMAIL */}
                  <Card>
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 p-2 text-accent">
                      <MailIcon />
                    </div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                      Email
                    </div>
                    <a
                      href="mailto:sales@forbsa.ru"
                      className="mt-1 block text-lg font-bold transition-colors hover:text-accent"
                    >
                      sales@forbsa.ru
                    </a>
                    <div className="mt-1 text-sm text-ink-muted">
                      Для заявок и документов
                    </div>
                  </Card>
                </div>
              </Reveal>
            </div>

            {/* ПРАВАЯ КОЛОНКА — КАРТА */}
            <div className="lg:col-span-3">
              <Reveal delay={150}>
                <div className="overflow-hidden rounded-2xl border border-line">
                  <iframe
                    src="https://yandex.ru/map-widget/v1/?text=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0%2C%201-%D0%B9%20%D0%9D%D0%B0%D0%B3%D0%B0%D1%82%D0%B8%D0%BD%D1%81%D0%BA%D0%B8%D0%B9%20%D0%BF%D1%80%D0%BE%D0%B5%D0%B7%D0%B4%2C%202%20%D1%81%D1%82%D1%80.%2012&z=16"
                    width="100%"
                    height="560"
                    frameBorder="0"
                    style={{ border: 0, display: 'block' }}
                    allowFullScreen
                    title="Карта проезда к офису FORBSA"
                  />
                </div>
                <div className="mt-3 text-center text-sm text-ink-muted">
                  Бесплатная парковка для клиентов · 5 минут от метро
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* РЕЖИМ РАБОТЫ */}
      <section className="bg-graphite py-14 text-white">
        <div className="mx-auto max-w-[1440px] px-6">
          <div className="mx-auto max-w-2xl">
            {/* РЕЖИМ РАБОТЫ */}
            <Reveal delay={150}>
              <div className="flex h-full flex-col rounded-panel border border-white/10 bg-white/5 p-8 backdrop-blur">
                <Tag tone="dark">{c.hoursEyebrow}</Tag>
                <h2 className="mt-4 text-2xl font-semibold">
                  {c.hoursTitle}
                </h2>
                <div className="mt-6 space-y-3 text-sm">
                  {[
                    { day: 'Понедельник – Пятница', time: c.hoursWeekdays, active: true },
                    { day: 'Суббота', time: c.hoursSaturday, active: false },
                    { day: 'Воскресенье', time: c.hoursSunday, active: false },
                  ].map((item) => (
                    <div
                      key={item.day}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 ${
                        item.active ? 'bg-accent/10' : 'bg-white/5'
                      }`}
                    >
                      <span className="font-medium">{item.day}</span>
                      <span className={item.active ? 'font-semibold text-accent' : 'text-white/60'}>
                        {item.time}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex items-start gap-3 rounded-xl border border-accent/30 bg-accent/10 p-4 text-sm">
                  <MessageIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                  <div>
                    <div className="font-semibold text-accent">{c.fastReplyTitle}</div>
                    <div className="mt-1 text-white/70">
                      {c.fastReplyText}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ФОРМА ОБРАТНОЙ СВЯЗИ */}
      <section className="relative overflow-hidden py-14">
        <div className="pointer-events-none absolute -top-20 left-1/2 h-96 w-96 -translate-x-1/2 animate-drift-a rounded-full bg-accent/4 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <Reveal>
            <SectionHeading
              center
              title={c.formTitle}
              subtitle={c.formSubtitle}
            />
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