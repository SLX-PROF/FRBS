import type { CollectionConfig } from 'payload'
import { adminOnly, staffOnly } from '../lib/access'

const deny = () => false

// Диалоги с чат-ботом. Пишутся только маршрутом /api/chat (overrideAccess).
// Персональные данные появляются только если посетитель оставил контакт
// (тогда consent = true и привязан lead).
export const ChatSessions: CollectionConfig = {
  slug: 'chat-sessions',
  labels: { singular: 'Диалог с ботом', plural: 'Диалоги с ботом' },
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['id', 'lead', 'consent', 'lastAt'],
    group: 'CRM',
  },
  access: { read: staffOnly, create: deny, update: deny, delete: adminOnly },
  fields: [
    // Непредсказуемый идентификатор для клиента (bearer). Числовой id
    // перечислим — по нему нельзя разрешать запись в чужую сессию.
    { name: 'token', type: 'text', unique: true, index: true, admin: { readOnly: true } },
    { name: 'messages', type: 'json', admin: { readOnly: true } },
    { name: 'lead', type: 'relationship', relationTo: 'leads', admin: { readOnly: true } },
    { name: 'consent', type: 'checkbox', admin: { readOnly: true } },
    { name: 'startedAt', type: 'date', admin: { readOnly: true } },
    { name: 'lastAt', type: 'date', admin: { readOnly: true } },
  ],
}
