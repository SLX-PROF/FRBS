import type { CollectionConfig } from 'payload'
import { adminOnly, ownedOnly, staffOnly } from '../lib/access'
import { notifyStageChange } from '../lib/notifications'
import { syncFields } from './shared'

export const Deals: CollectionConfig = {
  slug: 'deals',
  labels: { singular: 'Сделка', plural: 'Сделки' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'company', 'stage', 'amount', 'owner', 'expectedCloseAt'],
    group: 'CRM',
  },
  access: {
    read: ownedOnly(),
    create: staffOnly,
    update: ownedOnly(),
    delete: adminOnly,
  },
  hooks: {
    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        try {
          if (operation === 'update' && doc.stage !== previousDoc?.stage) {
            await notifyStageChange(req.payload, doc, req.user?.id)
          }
        } catch (err) {
          req.payload.logger.error({ msg: 'deal stage notify failed', err })
        }
        return doc
      },
    ],
  },
  fields: [
    { name: 'title', type: 'text', label: 'Название', required: true },
    {
      name: 'company',
      type: 'relationship',
      relationTo: 'companies',
      label: 'Компания',
      required: true,
    },
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      label: 'Ответственный',
      required: true,
      defaultValue: ({ user }) => user?.id,
    },
    {
      name: 'stage',
      type: 'select',
      label: 'Этап',
      required: true,
      defaultValue: 'proposal',
      options: [
        { label: 'КП отправлено', value: 'proposal' },
        { label: 'Переговоры', value: 'negotiation' },
        { label: 'Выиграна', value: 'won' },
        { label: 'Проиграна', value: 'lost' },
      ],
    },
    { name: 'amount', type: 'number', label: 'Сумма, ₽ (если без позиций)', min: 0 },
    {
      name: 'positions',
      type: 'array',
      label: 'Позиции КП',
      labels: { singular: 'Позиция', plural: 'Позиции' },
      admin: { description: 'Если заполнено — сумма КП считается по позициям' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text', label: 'Наименование', required: true },
            { name: 'qty', type: 'number', label: 'Кол-во', defaultValue: 1, min: 0 },
            { name: 'unitPrice', type: 'number', label: 'Цена за ед., ₽', min: 0 },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'validUntil', type: 'date', label: 'КП действительно до' },
        { name: 'vatIncluded', type: 'checkbox', label: 'Цены с НДС 20%', defaultValue: true },
      ],
    },
    {
      name: 'products',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      label: 'Модели',
    },
    { name: 'expectedCloseAt', type: 'date', label: 'Ожидаемое закрытие' },
    {
      name: 'lostReason',
      type: 'text',
      label: 'Причина проигрыша',
      admin: { condition: (data) => data?.stage === 'lost' },
    },
    {
      name: 'sourceLead',
      type: 'relationship',
      relationTo: 'leads',
      label: 'Из заявки',
      admin: { readOnly: true },
    },
    { name: 'notes', type: 'textarea', label: 'Заметки' },
    {
      name: 'kpDocument',
      type: 'ui',
      label: 'Коммерческое предложение',
      admin: { components: { Field: '/components/admin/KpLink#KpLink' } },
    },
    ...syncFields('manual'),
  ],
}
