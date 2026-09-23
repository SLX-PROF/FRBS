import Reveal from '@/components/motion/Reveal'
import ScrollProgress from '@/components/motion/ScrollProgress'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import DealerForm from '@/components/DealerForm'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Tag from '@/components/ui/Tag'
import SectionHeading from '@/components/ui/SectionHeading'
import { CheckIcon, PercentIcon, ShieldIcon, BoxIcon, GraduationIcon, MegaphoneIcon, WrenchIcon } from '@/components/ui/Icons'

const advantages = [
  { title: 'Маржинальность от 25%', desc: 'Прозрачная система скидок. Чем больше объём — тем выше маржа.', Icon: PercentIcon },
  { title: 'Защита территории', desc: 'Эксклюзивные права на регион. Никакой внутренней конкуренции.', Icon: ShieldIcon },
  { title: 'Производство от 1 дня', desc: 'Собственное производство в России. Быстрые отгрузки без задержек.', Icon: BoxIcon },
  { title: 'Обучение команды', desc: 'Тренинги по продукту, скрипты продаж, работа с возражениями.', Icon: GraduationIcon },
  { title: 'Маркетинговая поддержка', desc: 'Бренд-материалы, образцы, участие в выставках, совместные акции.', Icon: MegaphoneIcon },
  { title: 'Техническая поддержка', desc: 'Консультации инженера, помощь с подбором, решение рекламаций.', Icon: WrenchIcon },
]

export const metadata = {
  title: 'Стать дилером FORBSA — условия партнёрства',
  description:
    'Присоединяйтесь к сети дилеров FORBSA. Маржинальность от 25%, защита территории, маркетинговая поддержка, обучение. Производство в России, от 1 дня.',
}

export default function PartnersPage() {
  return (
    <main className="min-h-screen bg-surface text-ink">
      <ScrollProgress />
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden bg-graphite pt-10 pb-20 text-white md:pt-14 md:pb-28">
        <div className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[500px] animate-drift-a rounded-full bg-accent/6 blur-3xl" />
        <div className="relative mx-auto max-w-[1440px] px-6">
          <Reveal>
            <Tag tone="dark">Партнёрская программа</Tag>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="mt-6 text-4xl tracking-tight md:text-5xl lg:text-6xl">
              Станьте дилером{' '}
              <span className="text-accent">
                FORBSA
              </span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="mt-6 max-w-2xl text-lg text-white/70 md:text-xl">
              Российский производитель автоматических порогов с ресурсом 1 000 000 циклов.
              Маржинальность от 25%, защита территории, полное маркетинговое сопровождение.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button href="#lead-form" size="lg" className="group">
                Оставить заявку
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Button>
              <Button href="#conditions" variant="ghost" size="lg">
                Узнать условия
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ПРЕИМУЩЕСТВА */}
      <section className="py-20">
        <div className="mx-auto max-w-[1440px] px-6">
          <Reveal>
            <SectionHeading center title="Почему дилеры выбирают FORBSA" />
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {advantages.map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <Card className="group flex h-full flex-col">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 p-3.5 text-accent transition-transform group-hover:scale-110">
                    <item.Icon />
                  </div>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="mt-2 flex-1 text-ink-muted">{item.desc}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* УСЛОВИЯ */}
      <section id="conditions" className="bg-graphite py-20 text-white">
        <div className="mx-auto max-w-[1440px] px-6">
          <Reveal>
            <SectionHeading dark center title="Условия партнёрства" />
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2">
            <Reveal>
              <div className="flex h-full flex-col rounded-panel border border-white/10 bg-white/5 p-8 backdrop-blur">
                <Tag tone="dark">Минимальные требования</Tag>
                <ul className="mt-5 space-y-3">
                  {[
                    'Минимальный заказ: от 50 000 ₽',
                    'Оплата: по предоплате или отсрочка для проверенных партнёров',
                    'Наличие склада или точки продаж',
                    'Команда продавцов/монтажников (опционально)',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-accent text-white">
                        <CheckIcon className="h-3 w-3" />
                      </span>
                      <span className="text-white/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div className="flex h-full flex-col rounded-panel border border-white/10 bg-white/5 p-8 backdrop-blur">
                <Tag tone="dark">Что вы получаете</Tag>
                <ul className="mt-5 space-y-3">
                  {[
                    'Дилерский прайс со скидкой от 25%',
                    'Защита территории (эксклюзив на регион)',
                    'Образцы продукции для демонстрации',
                    'Маркетинговые материалы (каталоги, буклеты)',
                    'Обучение команды продаж',
                    'Техническая поддержка инженера',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-accent text-white">
                        <CheckIcon className="h-3 w-3" />
                      </span>
                      <span className="text-white/80">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* КАК НАЧАТЬ */}
      <section className="py-20">
        <div className="mx-auto max-w-[1440px] px-6">
          <Reveal>
            <SectionHeading center title="Как начать работу" subtitle="Три простых шага до первого заказа" />
          </Reveal>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Оставьте заявку',
                desc: 'Заполните форму ниже. Менеджер свяжется в течение рабочего дня.',
              },
              {
                step: '02',
                title: 'Обсудим условия',
                desc: 'Согласуем территорию, объёмы, систему скидок. Подпишем договор.',
              },
              {
                step: '03',
                title: 'Первый заказ',
                desc: 'Получите образцы, прайс, маркетинговые материалы. Запустите продажи.',
              },
            ].map((item, i) => (
              <Reveal key={item.step} delay={i * 100}>
                <Card className="relative flex h-full flex-col">
                  <div className="mb-4 text-5xl font-semibold text-accent/20">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="mt-2 flex-1 text-ink-muted">{item.desc}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-surface py-20">
        <div className="mx-auto max-w-4xl px-6">
          <Reveal>
            <SectionHeading center title="Частые вопросы" />
          </Reveal>

          <div className="space-y-4">
            {[
              {
                q: 'Какая минимальная партия для первого заказа?',
                a: 'Минимальный заказ — от 50 000 ₽. Это позволяет протестировать спрос в вашем регионе без крупных вложений.',
              },
              {
                q: 'Есть ли защита территории?',
                a: 'Да, мы предоставляем эксклюзивные права на регион для активных дилеров. Условия фиксируются в договоре.',
              },
              {
                q: 'Какие сроки производства?',
                a: 'Стандартные модели — от 1 рабочего дня при наличии на складе. Нестандартные длины — 3-5 дней.',
              },
              {
                q: 'Предоставляете ли вы образцы?',
                a: 'Да, мы предоставляем демо-образцы для демонстрации в точке продаж или на выставках.',
              },
              {
                q: 'Есть ли маркетинговая поддержка?',
                a: 'Да: каталоги, буклеты, баннеры, участие в выставках, совместные акции с дилерами.',
              },
            ].map((item, i) => (
              <Reveal key={item.q} delay={i * 80}>
                <details className="group rounded-2xl border border-line bg-white p-6 transition-all hover:border-accent/30">
                  <summary className="flex cursor-pointer items-center justify-between font-semibold">
                    {item.q}
                    <span className="ml-4 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent transition-transform group-open:rotate-45">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-4 text-ink-muted">{item.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ФОРМА ЗАЯВКИ */}
      <section id="lead-form" className="relative overflow-hidden bg-surface py-20">
        <div className="pointer-events-none absolute -top-20 left-1/2 h-96 w-96 -translate-x-1/2 animate-drift-a rounded-full bg-accent/4 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <Reveal>
            <SectionHeading
              center
              title="Оставить заявку на партнёрство"
              subtitle="Заполните форму — менеджер свяжется в течение рабочего дня, обсудит условия и подготовит коммерческое предложение."
            />
          </Reveal>

          <Reveal delay={150}>
            <div className="mx-auto mt-10 max-w-4xl">
              <DealerForm />
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  )
}