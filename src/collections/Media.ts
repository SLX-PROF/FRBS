import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'
import { isProductStaff, productStaffOnly } from '../lib/access'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Медиа', plural: 'Медиа' },
  admin: {
    // read публичный (файлы отдаются на живом сайте), но раздел меню
    // виден только тем, кто ими управляет — иначе Payload показал бы
    // ссылку всем залогиненным, включая менеджеров.
    hidden: ({ user }) => !isProductStaff(user),
  },
  access: {
    read: () => true,
    create: productStaffOnly,
    update: productStaffOnly,
    delete: productStaffOnly,
  },
  fields: [
    { name: 'alt', type: 'text', label: 'Alt-текст' },
  ],
  upload: {
    staticDir: path.resolve(__dirname, '../../public/media'),
    mimeTypes: ['image/*', 'application/pdf', 'application/octet-stream'],
  },
}