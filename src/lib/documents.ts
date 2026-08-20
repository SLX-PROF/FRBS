import { getPayload } from 'payload'
import config from '@payload-config'

export async function getAllDocuments() {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'documents',
    sort: 'title',
    limit: 100,
    depth: 1,
  })
  return docs
}