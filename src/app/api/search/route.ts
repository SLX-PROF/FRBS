import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = (searchParams.get('q') || '').trim()

  if (q.length < 2) {
    return NextResponse.json({ products: [], documents: [] })
  }

  const payload = await getPayload({ config })

  const [products, documents] = await Promise.all([
    payload.find({
      collection: 'products',
      where: {
        or: [
          { title: { contains: q } },
          { series: { contains: q } },
          { features: { contains: q } },
        ],
      },
      limit: 5,
    }),
    payload.find({
      collection: 'documents',
      where: { title: { contains: q } },
      limit: 5,
    }),
  ])

  return NextResponse.json({
    products: products.docs.map((p) => ({ title: p.title, slug: p.slug })),
    documents: documents.docs.map((d) => ({ title: d.title })),
  })
}