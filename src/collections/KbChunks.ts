import type { CollectionConfig } from 'payload'
import { adminOnly } from '../lib/access'

const deny = () => false

// Индекс базы знаний чат-бота. Пишется только кодом (reindex, overrideAccess).
export const KbChunks: CollectionConfig = {
  slug: 'kb-chunks',
  labels: { singular: 'Фрагмент БЗ', plural: 'База знаний бота' },
  admin: {
    useAsTitle: 'refSlug',
    defaultColumns: ['source', 'refSlug', 'updatedAt'],
    group: 'Система',
  },
  access: { read: adminOnly, create: deny, update: deny, delete: deny },
  fields: [
    { name: 'source', type: 'text', admin: { readOnly: true } },
    { name: 'refId', type: 'number', admin: { readOnly: true } },
    { name: 'refSlug', type: 'text', admin: { readOnly: true } },
    { name: 'text', type: 'textarea', admin: { readOnly: true } },
    { name: 'embedding', type: 'json', admin: { readOnly: true, hidden: true } },
  ],
}
