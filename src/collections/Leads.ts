import type { CollectionConfig } from 'payload'

export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: {
    singular: 'Заявка',
    plural: 'Заявки',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'clientType', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: () => true,
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'name', type: 'text', label: 'Имя', required: true },
    { name: 'phone', type: 'text', label: 'Телефон', required: true },
    { name: 'email', type: 'text', label: 'Email' },
    {
      name: 'clientType',
      type: 'select',
      label: 'Тип клиента',
      options: [
        { label: 'Архитектор / проектировщик', value: 'architect' },
        { label: 'Застройщик', value: 'developer' },
        { label: 'Дилер', value: 'dealer' },
        { label: 'Монтажник', value: 'installer' },
        { label: 'Частное лицо', value: 'individual' },
      ],
      defaultValue: 'dealer',
    },
    { name: 'comment', type: 'textarea', label: 'Комментарий' },
    {
      name: 'status',
      type: 'select',
      label: 'Статус',
      options: [
        { label: 'Новая', value: 'new' },
        { label: 'В работе', value: 'progress' },
        { label: 'Закрыта', value: 'done' },
        { label: 'Спам', value: 'spam' },
      ],
      defaultValue: 'new',
    },
  ],
}