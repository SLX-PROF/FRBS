import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Медиа', plural: 'Медиа' },
  fields: [
    { name: 'alt', type: 'text', label: 'Alt-текст' },
  ],
  upload: {
    staticDir: path.resolve(__dirname, '../../public/media'),
    mimeTypes: ['image/*', 'application/pdf', 'application/octet-stream'],
  },
}