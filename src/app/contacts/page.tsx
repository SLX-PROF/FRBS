import Link from 'next/link'
import Reveal from '@/components/motion/Reveal'
import ScrollProgress from '@/components/motion/ScrollProgress'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LeadForm from '@/components/LeadForm'

export const metadata = {
  title: 'Контакты FORBSA — офис и производство в Екатеринбурге',
  description:
    'Свяжитесь с FORBSA: офис и производство в Екатеринбурге. Телефон, email, форма обратной связи, реквизиты ООО «Форбса». Отвечаем в течение рабочего дня.',
}

export default function ContactsPage() {
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
              Офис · Производство
            </span>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="font-heading text-4xl font-extrabold tracking-tight md:text-5xl lg:text-6xl">
              Свяжитесь{' '}
              <span className="bg-gradient-to-r from-[#ff7a1a] to-[#f24e00] bg-clip-text text-transparent">
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
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 lg:grid-cols-5">
            {/* ЛЕВАЯ КОЛОНКА — КОНТАКТЫ */}
            <div className="lg:col-span-2">
              <Reveal>
                <div className="space-y-6">
                  {/* АДРЕС */}
                  <div className="rounded-2xl border border-line bg-white p-6 transition-all hover:border-accent/30">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                      Адрес
                    </div>
                    <div className="mt-1 font-semibold">
                      г. Екатеринбург, ул. Производственная, 1
                    </div>
                    <div className="mt-1 text-sm text-ink-muted">
                      Офис и производство
                    </div>
                  </div>

                  {/* ТЕЛЕФОН */}
                  <div className="rounded-2xl border border-line bg-white p-6 transition-all hover:border-accent/30">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                      </svg>
                    </div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                      Телефон
                    </div>
                    <a
                      href="tel:+73430000000"
                      className="mt-1 block text-xl font-bold transition-colors hover:text-accent"
                    >
                      +7 (343) 000-00-00
                    </a>
                    <div className="mt-1 text-sm text-ink-muted">
                      Пн–Пт, 9:00–18:00 (МСК+2)
                    </div>
                  </div>

                  {/* EMAIL */}
                  <div className="rounded-2xl border border-line bg-white p-6 transition-all hover:border-accent/30">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <path d="M22 6l-10 7L2 6" />
                      </svg>
                    </div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                      Email
                    </div>
                    <a
                      href="mailto:info@forbsa.ru"
                      className="mt-1 block text-lg font-bold transition-colors hover:text-accent"
                    >
                      info@forbsa.ru
                    </a>
                    <div className="mt-1 text-sm text-ink-muted">
                      Для заявок и документов
                    </div>
                  </div>

                  {/* МЕССЕНДЖЕРЫ */}
                  <div className="rounded-2xl border border-line bg-white p-6 transition-all hover:border-accent/30">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                      </svg>
                    </div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-ink-muted">
                      Мессенджеры
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <a
                        href="https://wa.me/73430000000"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-graphite px-4 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-accent"
                      >
                        WhatsApp
                      </a>
                      <a
                        href="https://t.me/forbsa"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-graphite px-4 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-accent"
                      >
                        Telegram
                      </a>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* ПРАВАЯ КОЛОНКА — КАРТА */}
            <div className="lg:col-span-3">
              <Reveal delay={150}>
                <div className="overflow-hidden rounded-2xl border border-line">
                  <iframe
                    src="https://yandex.ru/map-widget/v1/?ll=60.597465%2C56.838011&z=14&mode=search&text=Екатеринбург%20ул.%20Производственная%201"
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
      <section className="bg-graphite py-16 text-white">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-8 md:grid-cols-2">
            {/* РЕКВИЗИТЫ */}
            <Reveal>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
                <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-accent">
                  Юридическая информация
                </div>
                <h2 className="font-heading text-2xl font-extrabold">
                  Реквизиты
                </h2>
                <div className="mt-6 space-y-3 text-sm">
                  {[
                    { label: 'Наименование', value: 'ООО «Форбса»' },
                    { label: 'ИНН / КПП', value: '6600000000 / 660000000' },
                    { label: 'ОГРН', value: '1236600000000' },
                    { label: 'Юр. адрес', value: '620000, г. Екатеринбург, ул. Производственная, 1' },
                    { label: 'Р/с', value: '40702810000000000000' },
                    { label: 'Банк', value: 'ПАО Сбербанк, г. Екатеринбург' },
                    { label: 'БИК', value: '046577651' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start justify-between gap-4 border-b border-white/10 pb-2">
                      <span className="text-white/50">{item.label}</span>
                      <span className="text-right font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* РЕЖИМ РАБОТЫ */}
            <Reveal delay={150}>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
                <div className="mb-4 text-xs font-semibold uppercase tracking-wider text-accent">
                  Когда мы работаем
                </div>
                <h2 className="font-heading text-2xl font-extrabold">
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
                <div className="mt-6 rounded-xl border border-accent/30 bg-accent/10 p-4 text-sm">
                  <div className="font-semibold text-accent">💬 Отвечаем быстро</div>
                  <div className="mt-1 text-white/70">
                    Заявки с сайта обрабатываются в течение 1 рабочего дня.
                    Срочные вопросы — в WhatsApp или Telegram.
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ФОРМА ОБРАТНОЙ СВЯЗИ */}
      <section className="relative overflow-hidden py-16">
        <div className="pointer-events-none absolute -top-20 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <Reveal>
            <h2 className="font-heading text-3xl font-extrabold tracking-tight md:text-4xl">
              Напишите нам
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-ink-muted">
              Заполните форму — менеджер свяжется с вами в течение рабочего дня
              и ответит на все вопросы.
            </p>
          </Reveal>

          <Reveal delay={150}>
            <div className="mx-auto mt-10 max-w-2xl">
              <LeadForm />
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA-БЛОК */}
      <section className="bg-surface py-16">
        <div className="mx-auto max-w-4xl px-6">
          <Reveal>
            <div className="rounded-3xl border border-line bg-white p-8 text-center md:p-12">
              <h2 className="font-heading text-2xl font-extrabold md:text-3xl">
                Хотите стать дилером?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-ink-muted">
                Посмотрите условия партнёрства и оставьте заявку — обсудим
                сотрудничество.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  href="/partners"
                  className="inline-flex items-center gap-2 rounded-xl bg-accent px-7 py-3.5 font-semibold text-white shadow-lg shadow-accent/30 transition-all hover:-translate-y-0.5 hover:bg-accent-dark"
                >
                  Условия партнёрства →
                </Link>
                <Link
                  href="/docs"
                  className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-7 py-3.5 font-semibold text-ink transition-all hover:-translate-y-0.5 hover:border-accent/30"
                >
                  Документация
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  )
}