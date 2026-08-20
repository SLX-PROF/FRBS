import { getPayload } from 'payload'
import config from '@payload-config'

export async function getAllProducts() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'products',
    sort: 'sortOrder',
    limit: 100,
    depth: 1,
  })
  return docs
}

export async function getProductBySlug(slug: string) {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })
  return docs[0] ?? null
}