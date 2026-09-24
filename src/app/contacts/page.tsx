import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Reveal from '@/components/motion/Reveal'
import ScrollProgress from '@/components/motion/ScrollProgress'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LeadForm from '@/components/LeadForm'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Tag from '@/components/ui/Tag'
import SectionHeading from '@/components/ui/SectionHeading'
import { MapPinIcon, PhoneIcon, MailIcon, MessageIcon } from '@/components/ui/Icons'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Контакты FORBSA — офис и производство в Москве',
  description:
    'Свяжитесь с FORBSA: офис и производство в Москве. Телефон, email, форма обратной связи, реквизиты ООО «Форбса». Отвечаем в течение рабочего дня.',
}

export default async function ContactsPage() {
  const payload = await getPayload({ config: configPromise })
  const profile = await payload.findGlobal({ slug: 'company-profile' }).catch(() => null)

  const requisites = [
    { label: 'Наименование', value: profile?.legalName },
    {
      label: 'ИНН / КПП',
      value: [profile?.inn, profile?.kpp].filter(Boolean).join(' / ') || undefined,
    },
    { label: 'ОГРН', value: profile?.ogrn },
    { label: 'Юр. адрес', value: profile?.address },
    { label: 'Р/с', value: profile?.account },
    { label: 'Корр. счёт', value: profile?.corrAccount },
    { label: 'Банк', value: profile?.bankName },
    { label: 'БИК', value: profile?.bik },
  ].filter((item): item is { label: string; value: string } => Boolean(item.value))

  return (
    <main className="min-h-screen bg-surface text-ink">
      <ScrollProgress />
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden bg-graphite pt-8 pb-14 text-white md:pt-10 md:pb-16">
        <div className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[500px] animate-drift-a rounded-full bg-accent/6 blur-3xl" />
        <div className="relative mx-auto max-w-[1440px] px-6">
          <Reveal>
            <Tag tone="dark">Офис · Производство</Tag>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="mt-6 text-4xl tracking-tight md:text-5xl lg:text-6xl">
              Свяжитесь{' '}
              <span className="text-accent">
                с нами
              </span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-4 max-w-2xl text-lg text-white/70 md:text-xl">
              Отвечаем в течение рабочего дня. Поможем подобрать модель,
              подготовим КП или проконсультируем по монтажу.
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

      {/* РЕКВИЗИТЫ + РЕЖИМ РАБОТЫ */}
      <section className="bg-graphite py-14 text-white">
        <div className="mx-auto max-w-[1440px] px-6">
          <div className="grid gap-8 md:grid-cols-2">
            {/* РЕКВИЗИТЫ */}
            <Reveal>
              <div className="flex h-full flex-col rounded-panel border border-white/10 bg-white/5 p-8 backdrop-blur">
                <Tag tone="dark">Юридическая информация</Tag>
                <h2 className="mt-4 text-2xl font-semibold">
                  Реквизиты
                </h2>
                <div className="mt-6 space-y-3 text-sm">
                  {requisites.length === 0 ? (
                    <p className="text-white/50">
                      Реквизиты ещё не заполнены — добавьте их в админке, раздел «Реквизиты компании».
                    </p>
                  ) : (
                    requisites.map((item) => (
                      <div key={item.label} className="flex items-start justify-between gap-4 border-b border-white/10 pb-2">
                        <span className="flex-shrink-0 text-white/50">{item.label}</span>
                        <span className="min-w-0 break-words text-right font-medium">{item.value}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </Reveal>

            {/* РЕЖИМ РАБОТЫ */}
            <Reveal delay={150}>
              <div className="flex h-full flex-col rounded-panel border border-white/10 bg-white/5 p-8 backdrop-blur">
                <Tag tone="dark">Когда мы работаем</Tag>
                <h2 className="mt-4 text-2xl font-semibold">
                  Режим работы
                </h2>
                <div className="mt-6 space-y-3 text-sm">
                  {[
                    { day: 'Понедельник – Пятница', time: '9:00 – 18:00', active: true },
                    { day: 'Суббота', time: 'По договорённости', active: false },
                    { day: 'Воскресенье', time: 'Выходной', active: false },
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
                    <div className="font-semibold text-accent">Отвечаем быстро</div>
                    <div className="mt-1 text-white/70">
                      Заявки с сайта обрабатываются в течение 1 рабочего дня.
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
              title="Напишите нам"
              subtitle="Заполните форму — менеджер свяжется с вами в течение рабочего дня и ответит на все вопросы."
            />
          </Reveal>

          <Reveal delay={150}>
            <div className="mx-auto mt-10 max-w-3xl">
              <LeadForm />
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA-БЛОК */}
      <section className="bg-surface py-14">
        <div className="mx-auto max-w-4xl px-6">
          <Reveal>
            <div className="rounded-panel border border-line bg-white p-8 text-center shadow-panel md:p-12">
              <h2 className="text-2xl font-semibold md:text-3xl">
                Хотите стать дилером?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-ink-muted">
                Посмотрите условия партнёрства и оставьте заявку — обсудим
                сотрудничество.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Button href="/partners">Условия партнёрства →</Button>
                <Button href="/docs" variant="outline">
                  Документация
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  )
}