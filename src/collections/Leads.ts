import type { CollectionConfig } from 'payload'
import { adminOnly, ownedOrUnassigned } from '../lib/access'
import { notifyNewLead, notifyLeadAssigned, relId } from '../lib/notifications'
import { syncFields } from './shared'

export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: { singular: 'Заявка', plural: 'Заявки' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'company', 'phone', 'status', 'owner', 'createdAt'],
    group: 'CRM',
  },
  access: {
    read: ownedOrUnassigned(),
    create: () => true, // публичные формы сайта
    update: ownedOrUnassigned(),
    delete: adminOnly,
  },
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create' && !data.source) data.source = 'site'
        // Привязали сделку — заявка считается сконвертированной.
        if (data.linkedDeal && data.status !== 'done') data.status = 'done'
        return data
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        try {
          if (operation === 'create') {
            await notifyNewLead(req.payload, doc)
          } else if (relId(doc.owner) != null && relId(doc.owner) !== relId(previousDoc?.owner)) {
            await notifyLeadAssigned(req.payload, doc, req.user?.id)
          }
        } catch (err) {
          req.payload.logger.error({ msg: 'lead notify failed', err })
        }
        return doc
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', label: 'Имя / контактное лицо', required: true },
    { name: 'company', type: 'text', label: 'Компания (из формы)' },
    { name: 'phone', type: 'text', label: 'Телефон' },
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
      type: 'row',
      fields: [
        { name: 'consent', type: 'checkbox', label: 'Согласие на обработку ПДн', admin: { readOnly: true } },
        { name: 'consentAt', type: 'date', label: 'Дата согласия', admin: { readOnly: true } },
        { name: 'policyVersion', type: 'text', label: 'Версия политики', admin: { readOnly: true } },
      ],
    },
    {
      name: 'status',
      type: 'select',
      label: 'Статус',
      options: [
        { label: 'Новая', value: 'new' },
        { label: 'В работе', value: 'progress' },
        { label: 'В сделке', value: 'done' },
        { label: 'Отклонена / спам', value: 'spam' },
      ],
      defaultValue: 'new',
    },
    { name: 'triageNote', type: 'text', label: 'Заметка по разбору' },
    {
      name: 'owner',
      type: 'relationship',
      relationTo: 'users',
      label: 'Ответственный',
    },
    {
      name: 'linkedCompany',
      type: 'relationship',
      relationTo: 'companies',
      label: 'Компания в CRM',
    },
    {
      name: 'linkedDeal',
      type: 'relationship',
      relationTo: 'deals',
      label: 'Сделка',
      admin: { readOnly: true, description: 'Проставляется при конвертации' },
    },
    ...syncFields('site'),
  ],
}
