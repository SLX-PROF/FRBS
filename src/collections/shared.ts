import type { Field } from 'payload'

/**
 * Поля для будущей синхронизации с 1С (сам обмен — отдельный этап).
 * `externalId`/`syncedAt` пишет только интеграция через локальный API,
 * в админке они только для чтения.
 */
export const syncFields = (defaultSource: 'site' | 'chatbot' | 'manual' | '1c' = 'manual'): Field[] => [
  {
    type: 'collapsible',
    label: 'Синхронизация с 1С',
    admin: { initCollapsed: true },
    fields: [
      {
        name: 'externalId',
        type: 'text',
        label: 'ID в 1С',
        unique: true,
        admin: { readOnly: true },
      },
      {
        name: 'source',
        type: 'select',
        label: 'Источник',
        defaultValue: defaultSource,
        options: [
          { label: 'Сайт', value: 'site' },
          { label: 'Чат-бот', value: 'chatbot' },
          { label: 'Вручную', value: 'manual' },
          { label: '1С', value: '1c' },
        ],
      },
      { name: 'syncedAt', type: 'date', label: 'Синхронизировано', admin: { readOnly: true } },
    ],
  },
]
