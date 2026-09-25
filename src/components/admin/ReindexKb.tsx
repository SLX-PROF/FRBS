'use client'

import { useState } from 'react'

// Пересобирает базу знаний чат-бота из опубликованных моделей каталога.
export function ReindexKb() {
  const [state, setState] = useState<'idle' | 'busy' | 'ok' | 'error'>('idle')
  const [text, setText] = useState('')

  async function run() {
    setState('busy')
    setText('')
    try {
      const res = await fetch('/api/kb/reindex', { method: 'POST', credentials: 'include' })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.ok) {
        setState('ok')
        setText(`Готово: обновлено моделей — ${data.count}.`)
      } else {
        setState('error')
        setText(data.error || 'Не удалось обновить базу знаний.')
      }
    } catch {
      setState('error')
      setText('Нет связи с сервером.')
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', margin: '0 0 16px', padding: '12px 14px', border: '1px solid var(--theme-elevation-150)', borderRadius: 8, fontSize: 13 }}>
      <button type="button" className="btn btn--style-secondary btn--size-small" onClick={run} disabled={state === 'busy'}>
        {state === 'busy' ? 'Обновляю…' : 'Обновить базу знаний бота'}
      </button>
      <span style={{ color: 'var(--theme-elevation-600)' }}>
        Нужна, если бот отвечает по старым данным. Обычно база обновляется сама при публикации модели.
      </span>
      {text && (
        <span style={{ color: state === 'ok' ? 'var(--theme-success-600)' : 'var(--theme-error-600)', fontWeight: 600 }}>{text}</span>
      )}
    </div>
  )
}
