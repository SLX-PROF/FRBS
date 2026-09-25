import type { CollectionConfig } from 'payload'
import { reindexOneProduct } from '../lib/ai/kb'
import { isProductStaff, productStaffOnly } from '../lib/access'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Товар',
    plural: 'Товары',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Каталог',
    defaultColumns: ['title', 'type', 'series', 'sortOrder', '_status', 'updatedAt'],
    listSearchableFields: ['title', 'slug', 'series'],
    description:
      'Черновик не виден на сайте и не попадает в базу знаний бота. «Предпросмотр» показывает страницу модели до публикации. Чтобы создать похожую модель, откройте существующую и нажмите «Дублировать».',
    components: { beforeListTable: ['/components/admin/ReindexKb#ReindexKb'] },
    preview: (doc) => `/api/preview?path=${encodeURIComponent(`/catalog/${(doc as { slug?: string }).slug ?? ''}`)}`,
    livePreview: {
      url: ({ data }) => `/api/preview?path=${encodeURIComponent(`/catalog/${(data as { slug?: string }).slug ?? ''}`)}`,
    },
    // read публичный (каталог на сайте), но раздел меню виден только тем,
    // кто товарами управляет — иначе Payload показал бы ссылку и менеджерам.
    hidden: ({ user }) => !isProductStaff(user),
  },
  defaultSort: 'sortOrder',
  versions: { maxPerDoc: 20, drafts: true },
  access: {
    read: () => true,
    create: productStaffOnly,
    update: productStaffOnly,
    delete: productStaffOnly,
  },
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        // Черновики в базу знаний бота не попадают: только опубликованные модели.
        if (doc._status && doc._status !== 'published') return doc
        try {
          await reindexOneProduct(req.payload, doc)
        } catch (err) {
          req.payload.logger.error({ msg: 'kb reindex (product) failed', err })
        }
        return doc
      },
    ],
    afterDelete: [
      async ({ id, req }) => {
        try {
          const stale = await req.payload.find({
            collection: 'kb-chunks',
            where: { and: [{ source: { equals: 'product' } }, { refId: { equals: id } }] },
            limit: 10,
            depth: 0,
          })
          await Promise.all(
            stale.docs.map((c: { id: number | string }) =>
              req.payload.delete({ collection: 'kb-chunks', id: c.id, overrideAccess: true }),
            ),
          )
        } catch (err) {
          req.payload.logger.error({ msg: 'kb cleanup (product) failed', err })
        }
      },
    ],
  },
  fields: [
    {
      name: 'botReadiness',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: { Field: '/components/admin/BotReadiness#BotReadiness' },
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Название',
      required: true,
      hooks: { beforeDuplicate: [({ value }) => (value ? `${value} (копия)` : value)] },
    },
    {
      name: 'slug',
      type: 'text',
      label: 'URL (slug)',
      required: true,
      unique: true,
      hooks: { beforeDuplicate: [({ value }) => (value ? `${value}-copy` : value)] },
      admin: {
        description: 'Латиницей, через дефис: forbsa-tt. Адрес страницы: /catalog/<этот адрес>',
      },
    },
    {
      name: 'type',
      type: 'select',
      label: 'Тип',
      options: [
        { label: 'Врезной', value: 'врезной' },
        { label: 'Накладной', value: 'накладной' },
      ],
      required: true,
    },
    {
      name: 'series',
      type: 'text',
      label: 'Серия',
    },
    {
      name: 'minDoorWidth',
      type: 'number',
      label: 'Мин. ширина двери (мм)',
      admin: { description: 'Нужно для фильтра по ширине двери и для ответов бота' },
    },
    {
      name: 'warranty',
      type: 'number',
      label: 'Гарантия (лет)',
    },
    {
      name: 'features',
      type: 'textarea',
      label: 'Особенности',
      admin: { description: 'Основа ответов чат-бота о модели: пишите конкретно, с цифрами' },
    },
    {
      name: 'package',
      type: 'textarea',
      label: 'Комплектация',
    },
    {
      name: 'recommendation',
      type: 'text',
      label: 'Рекомендация',
    },
    {
      name: 'compatibleProfiles',
      type: 'text',
      label: 'Совместимые профили',
    },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      label: 'Фото',
      admin: { description: 'JPG, PNG или WebP (не HEIC и не PDF). Первое фото показывается в каталоге' },
    },
    {
      name: 'seoTitle',
      type: 'text',
      label: 'SEO Title',
    },
    {
      name: 'seoDescription',
      type: 'textarea',
      label: 'SEO Description',
    },
    {
      name: 'sortOrder',
      type: 'number',
      label: 'Порядок сортировки',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Чем меньше число, тем выше модель в каталоге' },
    },
  ],
}