'use client'

import { useState } from 'react'
import { formatPhone } from '@/lib/format'
import { trackGoal } from '@/lib/metrika'

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
      body: JSON.stringify({ name, phone, email, clientType, comment }),
    })

    if (res.ok) {
      trackGoal('lead_submit')
      setState('ok')
    } else {
      setError(
        'Форма заполнена верно, но сервер вернул ошибку. Откройте терминал с npm run dev и пришлите красный текст.',
      )
      setState('error')
    }
  }

  if (state === 'ok') {
    return (
      <div className="border border-accent bg-white p-8 text-center">
        <p className="text-2xl font-extrabold text-graphite">Заявка отправлена!</p>
        <p className="mt-2 text-ink-muted">
          Менеджер свяжется с вами в течение рабочего дня.
        </p>
      </div>
    )
  }

  const inputCls =
    'w-full border border-gray-300 bg-white px-4 py-3 text-ink outline-none transition-colors focus:border-accent'

  return (
    <form
      onSubmit={submit}
      className="grid grid-cols-1 gap-4 border border-gray-200 bg-white p-8 md:grid-cols-2"
    >
      <input className={inputCls} placeholder="Ваше имя *" value={name} onChange={(e) => setName(e.target.value)} />
      <input className={inputCls} placeholder="+7 (___) ___-__-__ *" value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} />
      <input className={inputCls} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <select className={inputCls} value={clientType} onChange={(e) => setClientType(e.target.value)}>
        <option value="dealer">Дилер</option>
        <option value="architect">Архитектор / проектировщик</option>
        <option value="developer">Застройщик</option>
        <option value="installer">Монтажник</option>
        <option value="individual">Частное лицо</option>
      </select>
      <textarea className={`${inputCls} md:col-span-2`} rows={3} placeholder="Комментарий (модель, объём, сроки)" value={comment} onChange={(e) => setComment(e.target.value)} />

      <label className="flex items-start gap-2 text-sm text-ink-muted md:col-span-2">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1" />
        Согласен на обработку персональных данных *
      </label>

      {state === 'error' && (
        <p className="text-sm text-red-600 md:col-span-2">{error}</p>
      )}

      <button
        type="submit"
        disabled={state === 'sending'}
        className="bg-accent px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-600 disabled:opacity-50 md:col-span-2"
      >
        {state === 'sending' ? 'Отправляем…' : 'Отправить заявку'}
      </button>
    </form>
  )
}