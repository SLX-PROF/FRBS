import type { CollectionConfig } from 'payload'
import { ownerOnly } from '../lib/access'

const deny = () => false

export const AuditLog: CollectionConfig = {
  slug: 'audit-log',
  labels: { singular: 'Журнал аудита', plural: 'Журнал аудита' },
  admin: {
    useAsTitle: 'documentId',
    defaultColumns: ['at', 'action', 'collectionSlug', 'documentId', 'user'],
    group: 'Система',
  },
  // Пишется только хуком withAudit через локальный API (overrideAccess).
  access: { read: ownerOnly, create: deny, update: deny, delete: deny },
  fields: [
    {
      name: 'action',
      type: 'select',
      options: [
        { label: 'Создание', value: 'create' },
        { label: 'Изменение', value: 'update' },
        { label: 'Удаление', value: 'delete' },
      ],
      admin: { readOnly: true },
    },
    { name: 'collectionSlug', type: 'text', label: 'Коллекция', admin: { readOnly: true } },
    { name: 'documentId', type: 'text', label: 'ID записи', admin: { readOnly: true } },
    { name: 'user', type: 'relationship', relationTo: 'users', label: 'Пользователь', admin: { readOnly: true } },
    { name: 'changedFields', type: 'json', label: 'Изменённые поля', admin: { readOnly: true } },
    { name: 'at', type: 'date', label: 'Когда', admin: { readOnly: true } },
  ],
}
