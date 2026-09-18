import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = process.env.SERVER_URL || 'https://forbsa.ru'
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/cp-7k2f9x', '/api/', '/coming-soon'],
    },
    sitemap: `${base}/sitemap.xml`,
  }
}
