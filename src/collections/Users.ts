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
        { label: 'Владелец (полный доступ)', value: 'owner' },
        { label: 'Контент-менеджер (каталог, тексты, фото)', value: 'admin' },
        { label: 'Менеджер по продажам (заявки и сделки)', value: 'manager' },
      ],
      admin: {
        description:
          'Владелец видит всё. Контент-менеджер правит каталог, тексты страниц и фото, но не видит заявки. Менеджер по продажам работает с заявками, сделками и задачами, но не редактирует сайт.',
      },
      access: { update: ownerFieldOnly },
    },
    {
      name: 'telegramChatId',
      type: 'text',
      label: 'Telegram chat ID',
      admin: {
        description:
          'Для уведомлений о заявках. Как узнать: человек запускает бота и пишет @userinfobot. Сейчас Telegram недоступен с сервера, уведомления идут на e-mail.',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      label: 'Активен',
      defaultValue: true,
      admin: { description: 'Снимите галочку, чтобы отключить человека, не удаляя его историю' },
    },
  ],
}
