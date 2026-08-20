'use client'

import { useState } from 'react'
import { formatPhone } from '@/lib/format'
import { trackGoal } from '@/lib/metrika'

export default function DealerForm() {
  const [company, setCompany] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [city, setCity] = useState('')
  const [businessType, setBusinessType] = useState('wholesale')
  const [volume, setVolume] = useState('s')
  const [comment, setComment] = useState('')
  const [consent, setConsent] = useState(false)
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle')
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()

    if (!company.trim()) {
      setError('Укажите название компании.')
      setState('error')
      return
    }
    if (!name.trim()) {
      setError('Укажите контактное лицо.')
      setState('error')
      return
    }
    if (phone.replace(/\D/g, '').length !== 11) {
      setError('Телефон собран не полностью: должен быть вид +7 (999) 999-99-99.')
      setState('error')
      return
    }
    if (!consent) {
      setError('Отметьте галочку согласия на обработку данных.')
      setState('error')
      return
    }

    setError('')
    setState('sending')
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name, phone, email, city, company, businessType, volume, comment,
        clientType: 'dealer',
      }),
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
          Менеджер свяжется с вами в течение рабочего дня и подготовит коммерческое предложение.
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
      <input className={inputCls} placeholder="Название компании *" value={company} onChange={(e) => setCompany(e.target.value)} />
      <input className={inputCls} placeholder="Контактное лицо *" value={name} onChange={(e) => setName(e.target.value)} />
      <input className={inputCls} placeholder="+7 (___) ___-__-__ *" value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} />
      <input className={inputCls} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className={inputCls} placeholder="Город" value={city} onChange={(e) => setCity(e.target.value)} />
      <select className={inputCls} value={businessType} onChange={(e) => setBusinessType(e.target.value)}>
        <option value="wholesale">Опт</option>
        <option value="retail">Розница</option>
        <option value="installation">Монтаж</option>
      </select>
      <select className={`${inputCls} md:col-span-2`} value={volume} onChange={(e) => setVolume(e.target.value)}>
        <option value="s">Предполагаемый объём: до 100 шт/мес</option>
        <option value="m">Предполагаемый объём: 100–500 шт/мес</option>
        <option value="l">Предполагаемый объём: 500+ шт/мес</option>
      </select>
      <textarea className={`${inputCls} md:col-span-2`} rows={3} placeholder="Комментарий" value={comment} onChange={(e) => setComment(e.target.value)} />

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
        {state === 'sending' ? 'Отправляем…' : 'Стать дилером'}
      </button>
    </form>
  )
}