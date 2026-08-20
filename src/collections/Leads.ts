import type { CollectionConfig } from 'payload'

export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: { singular: 'Заявка', plural: 'Заявки' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'company', 'phone', 'clientType', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: () => true,
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'name', type: 'text', label: 'Имя / контактное лицо', required: true },
    { name: 'company', type: 'text', label: 'Компания' },
    { name: 'phone', type: 'text', label: 'Телефон', required: true },
    { name: 'email', type: 'text', label: 'Email' },
    { name: 'city', type: 'text', label: 'Город' },
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
    {
      name: 'businessType',
      type: 'select',
      label: 'Тип деятельности',
      options: [
        { label: 'Опт', value: 'wholesale' },
        { label: 'Розница', value: 'retail' },
        { label: 'Монтаж', value: 'installation' },
      ],
    },
    {
      name: 'volume',
      type: 'select',
      label: 'Предполагаемый объём закупок',
      options: [
        { label: 'До 100 шт/мес', value: 's' },
        { label: '100–500 шт/мес', value: 'm' },
        { label: '500+ шт/мес', value: 'l' },
      ],
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