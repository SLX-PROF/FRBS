import type { CollectionConfig } from 'payload'

export const Documents: CollectionConfig = {
  slug: 'documents',
  labels: { singular: 'Документ', plural: 'Документы' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'createdAt'],
  },
  fields: [
    { name: 'title', type: 'text', label: 'Название', required: true },
    {
      name: 'category',
      type: 'select',
      label: 'Категория',
      required: true,
      options: [
        { label: 'Сертификаты', value: 'certificates' },
        { label: 'Чертежи', value: 'drawings' },
        { label: 'Инструкции', value: 'instructions' },
        { label: 'BIM-модели', value: 'bim' },
        { label: 'Юридическая информация', value: 'legal' },
      ],
    },
    {
      name: 'product',
      type: 'relationship',
      label: 'Привязка к модели',
      relationTo: 'products',
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      label: 'Файл',
      required: true,
    },
    { name: 'description', type: 'text', label: 'Описание' },
  ],
}