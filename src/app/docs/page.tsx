import type { Metadata } from 'next'
import Header from '@/components/Header'
import { getAllDocuments } from '@/lib/documents'

export const metadata = {
  title: 'Документация — FORBSA',
  description:
    'Сертификаты, технические чертежи, инструкции по монтажу и юридическая информация FORBSA. Скачивание без регистрации.',
}

const categories = [
  { value: 'certificates', title: 'Сертификаты' },
  { value: 'drawings', title: 'Технические чертежи' },
  { value: 'instructions', title: 'Инструкции по монтажу' },
  { value: 'bim', title: 'BIM-модели' },
  { value: 'legal', title: 'Юридическая информация' },
]

export default async function DocsPage() {
  const documents = await getAllDocuments()

  return (
    <main className="min-h-screen bg-surface">
      <Header />
      <section className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="mb-2 text-5xl font-extrabold text-graphite">Документация</h1>
        <p className="mb-10 text-ink-muted">Все файлы скачиваются без регистрации.</p>

        {categories.map((cat) => {
          const items = documents.filter((d) => d.category === cat.value)
          if (items.length === 0) return null
          return (
            <div key={cat.value} className="mb-10">
              <h2 className="mb-4 text-2xl font-extrabold text-graphite">{cat.title}</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {items.map((doc) => {
                  const file = doc.file && typeof doc.file === 'object' ? doc.file : null
                  return (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between gap-4 border border-gray-200 bg-white p-5"
                    >
                      <div>
                        <p className="font-bold text-graphite">{doc.title}</p>
                        {doc.description && (
                          <p className="text-sm text-ink-muted">{doc.description}</p>
                        )}
                      </div>
                      {file?.url && (
                        <a
                          href={file.url}
                          download
                          className="shrink-0 bg-accent px-4 py-2 font-semibold text-white transition-colors hover:bg-orange-600"
                        >
                          Скачать
                        </a>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}

        {documents.length === 0 && (
          <p className="text-ink-muted">
            Документы загружаются. Запросите копии на info@forbsa.ru — вышлем в течение дня.
          </p>
        )}
      </section>
    </main>
  )
}