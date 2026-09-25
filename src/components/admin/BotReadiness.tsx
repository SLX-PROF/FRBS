'use client'

import { useAllFormFields } from '@payloadcms/ui'

// Важные для чат-бота и каталога поля. Пустые подсвечиваются — по ним бот отвечает о модели.
const CHECKS: { path: string; label: string }[] = [
  { path: 'title', label: 'Название' },
  { path: 'type', label: 'Тип монтажа' },
  { path: 'minDoorWidth', label: 'Мин. ширина двери' },
  { path: 'warranty', label: 'Гарантия' },
  { path: 'features', label: 'Особенности' },
  { path: 'package', label: 'Комплектация' },
  { path: 'recommendation', label: 'Рекомендация' },
  { path: 'images', label: 'Фото' },
]

const isFilled = (v: unknown) => (Array.isArray(v) ? v.length > 0 : v !== undefined && v !== null && String(v).trim() !== '')

export function BotReadiness() {
  const [fields] = useAllFormFields()
  const rows = CHECKS.map((c) => ({ ...c, ok: isFilled(fields[c.path]?.value) }))
  const missing = rows.filter((r) => !r.ok)

  return (
    <div style={{ padding: '12px 14px', border: '1px solid var(--theme-elevation-150)', borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>
        Заполнено {rows.length - missing.length} из {rows.length}
      </div>
      {missing.length === 0 ? (
        <div style={{ color: 'var(--theme-success-600)' }}>Карточка готова: бот и каталог получат все данные.</div>
      ) : (
        <>
          <div style={{ color: 'var(--theme-warning-600, #b45309)', marginBottom: 4 }}>
            Бот не сможет ответить про: {missing.map((m) => m.label.toLowerCase()).join(', ')}.
          </div>
        </>
      )}
    </div>
  )
}
