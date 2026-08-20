import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'О компании — FORBSA',
  description:
    'FORBSA — российский производитель автоматических дверных порогов. 1 000 000 циклов, сертификат РОСТЕСТ, производство от 1 дня.',
}

const certs = [
  { title: 'Сертификат РОСТЕСТ', text: 'Продукция сертифицирована и соответствует требованиям РФ.' },
  { title: 'Протокол 1 000 000 циклов', text: 'Механизм испытан на 1 000 000 циклов открывания-закрывания.' },
  { title: 'СП 51.13330.2011', text: 'Защита от шума: звукоизоляция до 44-48 дБ.' },
  { title: 'СП 50.13330.2012', text: 'Тепловая защита: исключение продувания через нижний зазор.' },
  { title: 'ГОСТ 31173-2016', text: 'Блоки дверные металлические: классы воздухо- и водопроницаемости.' },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-surface">
      <Header />

      <section className="bg-graphite px-6 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <h1 className="mb-4 text-5xl font-extrabold leading-tight">
            Мы делаем двери <span className="text-accent">защищёнными</span>
          </h1>
          <p className="max-w-2xl text-lg text-gray-300">
            FORBSA — российский производитель автоматических порогов. Наша миссия —
            герметизация каждого дверного проёма: без дыма, шума, пыли, сквозняков и насекомых.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="mb-6 text-4xl font-extrabold text-graphite">История и путь развития</h2>
        <p className="max-w-3xl text-ink">
          Мы выросли из производства дверной фурнитуры в полноценного производителя
          автоматических порогов полного цикла: собственный цех, контроль качества,
          складская программа и отгрузки по России и СНГ.
        </p>
        <p className="mt-4 max-w-3xl text-sm text-ink-muted">
          * Точные даты и вехи истории добавит директор — скелет блока готов к наполнению.
        </p>
      </section>

      <section className="bg-white px-6 py-14">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6 text-4xl font-extrabold text-graphite">Производство</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="border border-gray-200 bg-surface p-6">
              <h3 className="mb-2 text-lg font-extrabold text-graphite">Собственный цех</h3>
              <p className="text-sm text-ink-muted">
                Полный цикл: резка профиля, сборка, контроль качества. Производство от 1 рабочего дня.
              </p>
            </div>
            <div className="border border-gray-200 bg-surface p-6">
              <h3 className="mb-2 text-lg font-extrabold text-graphite">Контроль качества</h3>
              <p className="text-sm text-ink-muted">
                Нержавеющая сталь A2 (AISI 304), закалённые пружины, отсутствие пластиковых
                деталей, самовыравнивание на неровном полу.
              </p>
            </div>
            <div className="border border-gray-200 bg-surface p-6">
              <h3 className="mb-2 text-lg font-extrabold text-graphite">Шаг длины 200 мм</h3>
              <p className="text-sm text-ink-muted">
                Пороги любой длины в производимом диапазоне, укорочение на 220 мм,
                регулировка выпада до 18 мм.
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-ink-muted">
            * Фото и видео цеха появятся после фотосессии — бюджет согласован.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="mb-6 text-4xl font-extrabold text-graphite">Сертификаты и испытания</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {certs.map((c) => (
            <div key={c.title} className="border-l-4 border-accent bg-white p-5">
              <p className="font-bold text-graphite">{c.title}</p>
              <p className="text-sm text-ink-muted">{c.text}</p>
            </div>
          ))}
        </div>
        <a
          href="/docs"
          className="mt-6 inline-block bg-accent px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-600"
        >
          Скачать сертификаты
        </a>
      </section>

      <section className="bg-graphite px-6 py-16 text-center">
        <h2 className="mb-6 text-4xl font-extrabold text-white">Связаться с нами</h2>
        <a
          href="/contacts"
          className="inline-block bg-accent px-8 py-4 font-semibold text-white transition-colors hover:bg-orange-600"
        >
          Связаться с нами
        </a>
      </section>

      <Footer />
    </main>
  )
}