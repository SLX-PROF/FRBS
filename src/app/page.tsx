import LeadForm from '@/components/LeadForm'

export default function Home() {
  return (
    <main className="min-h-screen bg-graphite text-white flex flex-col">
      <header className="flex items-center justify-between px-8 py-6">
        <div className="text-2xl font-extrabold tracking-wide">
          FORBSA<span className="text-accent">.</span>
        </div>
        <a
          href="#contact"
          className="bg-accent px-5 py-2.5 font-semibold hover:bg-orange-600 transition-colors"
        >
          Стать дилером
        </a>
      </header>

      <section className="flex flex-1 flex-col justify-center px-8 max-w-5xl">
        <p className="mb-4 font-semibold text-accent">
          Производитель автоматических порогов №1 в России
        </p>
        <h1 className="mb-6 text-5xl font-extrabold leading-tight md:text-6xl">
          Пороги, которые просто работают
        </h1>
        <p className="mb-8 max-w-2xl text-lg text-gray-300">
          1 000 000 циклов. Нержавеющая сталь A2. Шумоизоляция до 48 дБ.
          Производство от 1 дня.
        </p>
        <div className="flex gap-4">
          <a
            href="/catalog"
            className="bg-accent px-6 py-3 font-semibold hover:bg-orange-600 transition-colors"
          >
            Смотреть каталог
          </a>
          <a
            href="/docs"
            className="border border-gray-500 px-6 py-3 font-semibold transition-colors hover:border-accent hover:text-accent"
          >
            Документация
          </a>
        </div>
      </section>
            <section id="contact" className="bg-graphite px-8 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-8 text-4xl font-extrabold">Обсудим ваш проект?</h2>
          <LeadForm />
        </div>
      </section>
    </main>
  )
}