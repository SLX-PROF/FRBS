import Link from 'next/link'
import Header from '@/components/Header'
import { getAllProducts } from '@/lib/products'

export const metadata = {
  title: 'Каталог — FORBSA',
  description:
    'Линейка из 10 моделей автоматических порогов FORBSA: врезные и накладные.',
}

export default async function CatalogPage() {
  const products = await getAllProducts()

  return (
    <main className="min-h-screen bg-surface">
      <Header />
      <section className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="mb-2 text-5xl font-extrabold text-graphite">Каталог</h1>
        <p className="mb-10 text-ink-muted">
          Автоматические пороги для алюминиевых, стальных, ПВХ и деревянных дверей.
        </p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {products.map((product) => {
            const photo =
              product.images && typeof product.images === 'object'
                ? product.images
                : null
            return (
              <Link
                key={product.id}
                href={`/catalog/${product.slug}`}
                className="group flex flex-col border border-gray-200 bg-white transition-colors hover:border-accent"
              >
                <div className="flex aspect-[4/3] items-center justify-center overflow-hidden bg-white">
                  {photo?.url ? (
                    <img
                      src={photo.url}
                      alt={photo.alt || product.title}
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <span className="text-sm text-ink-muted">Фото скоро</span>
                  )}
                </div>
                <div className="flex flex-col gap-1 p-5">
                  <h3 className="text-lg font-extrabold text-graphite">
                    {product.title}
                  </h3>
                  <p className="text-sm text-ink-muted">
                    {product.type === 'врезной' ? 'Врезной' : 'Накладной'} · мин. дверь{' '}
                    {product.minDoorWidth} мм
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </main>
  )
}