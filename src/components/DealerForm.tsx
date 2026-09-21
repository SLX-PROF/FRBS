'use client'

import { useState } from 'react'
import { formatPhone } from '@/lib/format'
import { trackGoal } from '@/lib/metrika'
import Button from '@/components/ui/Button'
import { CheckIcon } from '@/components/ui/Icons'

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
        name, phone, email, city, company, businessType, volume, comment, consent,
        clientType: 'dealer',
      }),
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
          Менеджер свяжется с вами в течение рабочего дня и подготовит коммерческое предложение.
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
      <input aria-label="Название компании" className={inputCls} placeholder="Название компании *" value={company} onChange={(e) => setCompany(e.target.value)} />
      <input aria-label="Контактное лицо" className={inputCls} placeholder="Контактное лицо *" value={name} onChange={(e) => setName(e.target.value)} />
      <input aria-label="Телефон" className={inputCls} placeholder="+7 (___) ___-__-__ *" value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} />
      <input aria-label="Email" className={inputCls} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input aria-label="Город" className={inputCls} placeholder="Город" value={city} onChange={(e) => setCity(e.target.value)} />
      <select aria-label="Тип бизнеса" className={inputCls} value={businessType} onChange={(e) => setBusinessType(e.target.value)}>
        <option value="wholesale">Опт</option>
        <option value="retail">Розница</option>
        <option value="installation">Монтаж</option>
      </select>
      <select aria-label="Предполагаемый объём" className={`${inputCls} md:col-span-2`} value={volume} onChange={(e) => setVolume(e.target.value)}>
        <option value="s">Предполагаемый объём: до 100 шт/мес</option>
        <option value="m">Предполагаемый объём: 100–500 шт/мес</option>
        <option value="l">Предполагаемый объём: 500+ шт/мес</option>
      </select>
      <textarea aria-label="Комментарий" className={`${inputCls} md:col-span-2`} rows={3} placeholder="Комментарий" value={comment} onChange={(e) => setComment(e.target.value)} />

      <div className="flex items-start gap-2 text-sm text-ink-muted md:col-span-2">
        <input id="dealer-consent" type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 accent-accent" />
        <span>
          <label htmlFor="dealer-consent">Согласен на обработку </label>
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
        {state === 'sending' ? 'Отправляем…' : 'Стать дилером'}
      </Button>
    </form>
  )
}