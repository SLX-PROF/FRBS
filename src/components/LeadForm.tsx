'use client'

import { useState } from 'react'
import { formatPhone } from '@/lib/format'
import { trackGoal } from '@/lib/metrika'
import Button from '@/components/ui/Button'
import { CheckIcon } from '@/components/ui/Icons'

export default function LeadForm() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [clientType, setClientType] = useState('dealer')
  const [comment, setComment] = useState('')
  const [consent, setConsent] = useState(false)
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle')
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()

    if (!name.trim()) {
      setError('Укажите имя.')
      setState('error')
      return
    }
    if (phone.replace(/\D/g, '').length !== 11) {
      setError('Телефон собран не полностью: должен быть вид +7 (999) 999-99-99.')
      setState('error')
      return
    }
    if (!consent) {
      setError('Отметьте галочку «Согласен на обработку персональных данных».')
      setState('error')
      return
    }

    setError('')
    setState('sending')
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, email, clientType, comment, consent }),
    })

    if (res.ok) {
      trackGoal('lead_submit')
      setState('ok')
    } else {
      setError('Не удалось отправить заявку. Попробуйте ещё раз или напишите нам на sales@forbsa.ru.')
      setState('error')
    }
  }

  if (state === 'ok') {
    return (
      <div className="rounded-panel border border-line bg-white p-8 text-center shadow-panel">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent p-3.5 text-white">
          <CheckIcon />
        </div>
        <p className="mt-4 text-2xl font-semibold text-ink">Заявка отправлена!</p>
        <p className="mt-2 text-ink-muted">
          Менеджер свяжется с вами в течение рабочего дня.
        </p>
      </div>
    )
  }

  const inputCls =
    'w-full rounded-field border border-line bg-surface px-4 py-3.5 text-ink placeholder:text-ink-muted outline-none transition-colors focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/10'

  return (
    <form
      onSubmit={submit}
      className="grid grid-cols-1 gap-4 rounded-panel border border-line bg-white p-8 text-left shadow-panel md:grid-cols-2"
    >
      <input aria-label="Ваше имя" className={inputCls} placeholder="Ваше имя *" value={name} onChange={(e) => setName(e.target.value)} />
      <input aria-label="Телефон" className={inputCls} placeholder="+7 (___) ___-__-__ *" value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} />
      <input aria-label="Email" className={inputCls} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <select aria-label="Тип клиента" className={inputCls} value={clientType} onChange={(e) => setClientType(e.target.value)}>
        <option value="dealer">Дилер</option>
        <option value="architect">Архитектор / проектировщик</option>
        <option value="developer">Застройщик</option>
        <option value="installer">Монтажник</option>
        <option value="individual">Частное лицо</option>
        <option value="other">Другое</option>
      </select>
      <textarea aria-label="Комментарий" className={`${inputCls} md:col-span-2`} rows={3} placeholder="Комментарий (модель, объём, сроки)" value={comment} onChange={(e) => setComment(e.target.value)} />

      <div className="flex items-start gap-2 text-sm text-ink-muted md:col-span-2">
        <input id="lead-consent" type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 accent-accent" />
        <span>
          <label htmlFor="lead-consent">Согласен на обработку </label>
          <a href="/privacy" target="_blank" className="text-accent underline underline-offset-2 hover:no-underline">
            персональных данных
          </a>{' '}
          *
        </span>
      </div>

      {state === 'error' && (
        <p className="text-sm text-red-600 md:col-span-2">{error}</p>
      )}

      <Button type="submit" disabled={state === 'sending'} size="lg" className="md:col-span-2">
        {state === 'sending' ? 'Отправляем…' : 'Отправить заявку'}
      </Button>
    </form>
  )
}