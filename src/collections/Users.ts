import type { CollectionConfig } from 'payload'
import { adminFieldOnly, adminOnly } from '../lib/access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Пользователь', plural: 'Пользователи' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role', 'active'],
    group: 'Система',
  },
  auth: true,
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: adminOnly,
    update: ({ req: { user }, id }) => (user as { role?: string })?.role === 'admin' || user?.id === id,
    delete: adminOnly,
  },
  fields: [
    { name: 'name', type: 'text', label: 'Имя', required: true },
    {
      name: 'role',
      type: 'select',
      label: 'Роль',
      required: true,
      defaultValue: 'manager',
      options: [
        { label: 'Администратор', value: 'admin' },
        { label: 'Менеджер', value: 'manager' },
      ],
      access: { update: adminFieldOnly },
    },
    {
      name: 'telegramChatId',
      type: 'text',
      label: 'Telegram chat ID',
      admin: { description: 'Для уведомлений (этап SP3)' },
    },
    { name: 'active', type: 'checkbox', label: 'Активен', defaultValue: true },
  ],
}
