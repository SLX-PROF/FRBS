import type { CollectionConfig } from 'payload'
import { hiddenFromNonOwner, isOwner, ownerFieldOnly, ownerOnly } from '../lib/access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Пользователь', plural: 'Пользователи' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role', 'active'],
    group: 'Система',
    hidden: hiddenFromNonOwner,
  },
  auth: true,
  access: {
    // Публично для любого залогиненного — иначе выпадающие списки
    // "Ответственный"/"Исполнитель" в Заявках/Сделках/Задачах опустеют
    // для менеджеров и админа товаров.
    read: ({ req: { user } }) => Boolean(user),
    create: ownerOnly,
    update: ({ req: { user }, id }) => isOwner(user as Parameters<typeof isOwner>[0]) || user?.id === id,
    delete: ownerOnly,
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
        { label: 'Владелец', value: 'owner' },
        { label: 'Администратор (товары)', value: 'admin' },
        { label: 'Менеджер', value: 'manager' },
      ],
      access: { update: ownerFieldOnly },
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
