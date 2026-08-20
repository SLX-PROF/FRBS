import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Товар',
    plural: 'Товары',
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Название',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'URL (slug)',
      required: true,
      unique: true,
      admin: {
        description: 'Латиницей, через дефис: forbsa-tt',
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
      label: 'Фото',
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
    },
  ],
}