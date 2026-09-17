import type { CollectionConfig } from 'payload'
import { ownedOrUnassigned, ownerOnly, staffOnly } from '../lib/access'
import { syncFields } from './shared'

export const Companies: CollectionConfig = {
  slug: 'companies',
  labels: { singular: 'Компания', plural: 'Компании' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'kind', 'city', 'owner', 'createdAt'],
    group: 'CRM',
  },
  access: {
    read: ownedOrUnassigned(),
    create: staffOnly,
    update: ownedOrUnassigned(),
    delete: ownerOnly,
  },
  fields: [
    { name: 'name', type: 'text', label: 'Название', required: true },
    { name: 'inn', type: 'text', label: 'ИНН' },
    {
      name: 'kind',
      type: 'select',
      label: 'Тип',
      options: [
        { label: 'Дилер', value: 'dealer' },
        { label: 'Архитектор / проектировщик', value: 'architect' },
        { label: 'Застройщик', value: 'developer' },
        { label: 'Монтажник', value: 'installer' },
        { label: 'Конечный заказчик', value: 'endCustomer' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'city', type: 'text', label: 'Город' },
        { name: 'website', type: 'text', label: 'Сайт' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'contactPerson', type: 'text', label: 'Контактное лицо' },
        { name: 'phone', type: 'text', label: 'Телефон' },
        { name: 'email', type: 'text', label: 'Email' },
      ],
    },
    { name: 'notes', type: 'textarea', label: 'Заметки' },
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      label: 'Ответственный',
      defaultValue: ({ user }) => user?.id,
    },
    ...syncFields('manual'),
  ],
}
