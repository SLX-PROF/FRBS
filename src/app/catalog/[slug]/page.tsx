import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import { getProductBySlug } from '@/lib/products'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return {}
  return {
    title: product.seoTitle || `${product.title} — FORBSA`,
    description: product.seoDescription || product.features || '',
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const photo =
    product.images && typeof product.images === 'object' ? product.images : null

  return (
    <main className="min-h-screen bg-surface">
      <Header />
      <section className="mx-auto max-w-6xl px-6 py-12">
        <a href="/catalog" className="text-sm text-ink-muted transition-colors hover:text-accent">
          ← Каталог
        </a>

        <div className="mt-6 grid grid-cols-1 gap-10 md:grid-cols-2">
          <div className="flex aspect-square items-center justify-center border border-gray-200 bg-white">
            {photo?.url ? (
              <img src={photo.url} alt={photo.alt || product.title} />
            ) : (
              <span className="text-ink-muted">Фото скоро</span>
            )}
          </div>

          <div>
            <h1 className="mb-4 text-5xl font-extrabold text-graphite">{product.title}</h1>
            <p className="mb-6 text-ink-muted">
              {product.type === 'врезной' ? 'Врезной' : 'Накладной'} автоматический порог
            </p>

            <dl className="mb-8 grid grid-cols-2 gap-4">
              <div className="border border-gray-200 bg-white p-4">
                <dt className="text-sm text-ink-muted">Мин. ширина двери</dt>
                <dd className="text-xl font-extrabold text-graphite">
                  {product.minDoorWidth} мм
                </dd>
              </div>
              <div className="border border-gray-200 bg-white p-4">
                <dt className="text-sm text-ink-muted">Гарантия</dt>
                <dd className="text-xl font-extrabold text-graphite">
                  {product.warranty} лет
                </dd>
              </div>
            </dl>

            {product.features && (
              <div className="mb-4">
                <h2 className="mb-2 text-2xl font-extrabold text-graphite">Особенности</h2>
                <p className="text-ink">{product.features}</p>
              </div>
            )}

            {product.package && (
              <div className="mb-4">
                <h2 className="mb-2 text-2xl font-extrabold text-graphite">Комплектация</h2>
                <p className="text-ink">{product.package}</p>
              </div>
            )}

            {product.recommendation && (
              <div className="mb-6 border-l-4 border-accent bg-white p-4">
                <p className="text-ink">{product.recommendation}</p>
              </div>
            )}

            <a
              href="#contact"
              className="inline-block bg-accent px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-600"
            >
              Оставить заявку
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}