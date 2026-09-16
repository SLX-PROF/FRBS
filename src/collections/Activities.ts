import type { CollectionConfig } from 'payload'
import { activityScope, adminOnly, staffOnly } from '../lib/access'
import { notifyTaskAssigned, relId } from '../lib/notifications'

export const Activities: CollectionConfig = {
  slug: 'activities',
  labels: { singular: 'Активность / задача', plural: 'Активности и задачи' },
  admin: {
    useAsTitle: 'subject',
    defaultColumns: ['subject', 'kind', 'assignee', 'dueAt', 'doneAt', 'priority'],
    group: 'CRM',
  },
  access: {
    read: activityScope,
    create: staffOnly,
    update: activityScope,
    delete: adminOnly,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        // Активность привязана к сделке/заявке ИЛИ это самостоятельная задача с исполнителем.
        if (data && !data.deal && !data.lead && !data.assignee) {
          throw new Error('Привяжите к сделке или заявке, либо назначьте исполнителя')
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, operation, req }) => {
        try {
          const assigneeChanged =
            operation === 'create'
              ? Boolean(relId(doc.assignee))
              : relId(doc.assignee) != null && relId(doc.assignee) !== relId(previousDoc?.assignee)
          if (doc.dueAt && assigneeChanged) {
            await notifyTaskAssigned(req.payload, doc, req.user?.id)
          }
        } catch (err) {
          req.payload.logger.error({ msg: 'task-assigned notify failed', err })
        }
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'kind',
      type: 'select',
      label: 'Тип',
      required: true,
      defaultValue: 'note',
      options: [
        { label: 'Звонок', value: 'call' },
        { label: 'Письмо', value: 'email' },
        { label: 'Встреча', value: 'meeting' },
        { label: 'Заметка', value: 'note' },
      ],
    },
    { name: 'subject', type: 'text', label: 'Тема', required: true },
    { name: 'body', type: 'textarea', label: 'Описание' },
    {
      type: 'row',
      fields: [
        { name: 'deal', type: 'relationship', relationTo: 'deals', label: 'Сделка' },
        { name: 'lead', type: 'relationship', relationTo: 'leads', label: 'Заявка' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'author',
          type: 'relationship',
          relationTo: 'users',
          label: 'Автор',
          defaultValue: ({ user }) => user?.id,
          admin: { readOnly: true },
        },
        {
          name: 'assignee',
          type: 'relationship',
          relationTo: 'users',
          label: 'Исполнитель',
          admin: { description: 'Задача = активность со сроком и исполнителем' },
        },
        {
          name: 'priority',
          type: 'select',
          label: 'Приоритет',
          defaultValue: 'normal',
          options: [
            { label: 'Низкий', value: 'low' },
            { label: 'Обычный', value: 'normal' },
            { label: 'Высокий', value: 'high' },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'dueAt', type: 'date', label: 'Срок' },
        { name: 'doneAt', type: 'date', label: 'Выполнено' },
      ],
    },
  ],
}
