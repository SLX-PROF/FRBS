import type { Metadata } from 'next'
import Header from '@/components/Header'
import DealerForm from '@/components/DealerForm'

export const metadata = {
  title: 'Для партнёров — FORBSA',
  description:
    'Дилерская программа FORBSA: маржинальность, защита территории, маркетинговая поддержка. Станьте партнёром российского производителя автоматических порогов.',
}

const benefits = [
  { title: 'Российское производство', text: 'Без валютных рисков и срывов поставок. Стабильные рублёвые цены.' },
  { title: 'Отгрузка от 1 дня', text: 'Складская программа + производство от 1 рабочего дня при отсутствии на складе.' },
  { title: 'Маржа и скидки', text: 'Дилерская скидка растёт от объёма. Защита территории при выполнении плана.' },
  { title: 'Маркетинговая поддержка', text: 'Каталоги, фото, видео, образцы продукции для вашего отдела продаж.' },
  { title: 'Продукт с ресурсом', text: '1 000 000 циклов, нержавейка A2, сертификат РОСТЕСТ — легко продавать.' },
  { title: 'Техническая поддержка', text: 'Чертежи, инструкции, консультации для ваших монтажников.' },
]

const steps = [
  { n: '1', title: 'Заявка', text: 'Заполните форму ниже — это 2 минуты.' },
  { n: '2', title: 'Условия', text: 'Менеджер свяжется в течение рабочего дня и подготовит КП под ваш регион.' },
  { n: '3', title: 'Старт', text: 'Договор, образцы, первая отгрузка. Обучение ваших монтажников.' },
]

const faq = [
  { q: 'Как быстро отгружаете продукцию?', a: 'Со склада — от 1 рабочего дня. Под заказ — производство от 1 дня. Стандартные длины всегда в наличии, шаг длины 200 мм.' },
  { q: 'Есть ли защита территории?', a: 'Да. При выполнении плановых объёмов закрепляем территорию и условия в дилерском договоре.' },
  { q: 'Предоставляете маркетинговые материалы?', a: 'Да: каталоги, продуктовые фото, видео работы механизма, образцы для демонстрации клиентам.' },
  { q: 'Есть ли поддержка для монтажников?', a: 'Да: инструкции по монтажу, чертежи PDF/DWG и техническая поддержка по телефону.' },
]

export default function PartnersPage() {
  return (
    <main className="min-h-screen bg-surface">
      <Header />

      <section className="bg-graphite px-6 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-4 text-5xl font-extrabold leading-tight">
            Станьте партнёром FORBSA <span className="text-accent">в своём регионе</span>
          </h1>
          <p className="max-w-2xl text-lg text-gray-300">
            Производим автоматические пороги с ресурсом 1 000 000 циклов.
            Даём дилерам маржу, маркетинг и отгрузку от 1 рабочего дня.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="mb-8 text-4xl font-extrabold text-graphite">Почему с нами выгодно</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {benefits.map((b) => (
            <div key={b.title} className="border border-gray-200 bg-white p-6 transition-colors hover:border-accent">
              <h3 className="mb-2 text-lg font-extrabold text-graphite">{b.title}</h3>
              <p className="text-sm text-ink-muted">{b.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white px-6 py-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 text-4xl font-extrabold text-graphite">Как начать работу</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="border-l-4 border-accent bg-surface p-6">
                <p className="mb-2 text-4xl font-extrabold text-accent">{s.n}</p>
                <h3 className="mb-2 text-lg font-extrabold text-graphite">{s.title}</h3>
                <p className="text-sm text-ink-muted">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="mb-8 text-4xl font-extrabold text-graphite">FAQ для дилеров</h2>
        <div className="flex flex-col gap-3">
          {faq.map((f) => (
            <details key={f.q} className="group border border-gray-200 bg-white p-5">
              <summary className="cursor-pointer list-none font-bold text-graphite transition-colors hover:text-accent">
                {f.q}
              </summary>
              <p className="mt-3 text-ink-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="dealer-form" className="bg-graphite px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 text-4xl font-extrabold text-white">Заявка на дилерство</h2>
          <DealerForm />
        </div>
      </section>
    </main>
  )
}