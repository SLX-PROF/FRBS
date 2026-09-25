import type { MetadataRoute } from 'next'
import { getAllProducts } from '@/lib/products'

// Обращается к БД — при сборке в Docker живой БД нет (см. /catalog, /).
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.SERVER_URL || 'https://forbsa.ru'
  const products = await getAllProducts()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/catalog`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/about`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/docs`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/contacts`, changeFrequency: 'yearly', priority: 0.5 },
  ]

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${base}/catalog/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : undefined,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [...staticRoutes, ...productRoutes]
}
