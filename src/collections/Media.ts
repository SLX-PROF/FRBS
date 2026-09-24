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
    // Без application/octet-stream — этот MIME клиент может проставить
    // любому файлу, и он фактически снимал ограничение целиком.
    mimeTypes: ['image/*', 'application/pdf', 'application/zip', 'video/mp4'],
    // Оригинал хранится как есть; на сайте отдаются лёгкие WebP-версии.
    // Если снимок меньше целевой ширины, размер не создаётся (sizes.<имя> = null),
    // и фронтенд берёт оригинал.
    imageSizes: [
      {
        name: 'card',
        width: 640,
        formatOptions: { format: 'webp', options: { quality: 80 } },
        generateImageName: ({ originalName, sizeName, extension }) => `${originalName}-${sizeName}.${extension}`,
      },
      {
        name: 'large',
        width: 1600,
        formatOptions: { format: 'webp', options: { quality: 82 } },
        generateImageName: ({ originalName, sizeName, extension }) => `${originalName}-${sizeName}.${extension}`,
      },
    ],
  },
}