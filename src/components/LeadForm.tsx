'use client'

import { useState } from 'react'

function formatPhone(input: string): string {
  const digits = input
    .replace(/\D/g, '')
    .replace(/^8/, '7')
    .replace(/^7?/, '7')
    .slice(0, 11)

  let out = '+7'
  if (digits.length > 1) out += ` (${digits.slice(1, 4)}`
  if (digits.length > 4) out += `) ${digits.slice(4, 7)}`
  if (digits.length > 7) out += `-${digits.slice(7, 9)}`
  if (digits.length > 9) out += `-${digits.slice(9, 11)}`
  return out
}

export default function LeadForm() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [clientType, setClientType] = useState('dealer')
  const [comment, setComment] = useState('')
  const [website, setWebsite] = useState('')
  const [consent, setConsent] = useState(false)
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || phone.replace(/\D/g, '').length !== 11 || !consent) {
      setState('error')
      return
    }
    setState('sending')
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone, email, clientType, comment, website }),
    })
    setState(res.ok ? 'ok' : 'error')
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
      <input
        className={inputCls}
        placeholder="Ваше имя *"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className={inputCls}
        placeholder="+7 (___) ___-__-__ *"
        value={phone}
        onChange={(e) => setPhone(formatPhone(e.target.value))}
      />
      <input
        className={inputCls}
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <select
        className={inputCls}
        value={clientType}
        onChange={(e) => setClientType(e.target.value)}
      >
        <option value="dealer">Дилер</option>
        <option value="architect">Архитектор / проектировщик</option>
        <option value="developer">Застройщик</option>
        <option value="installer">Монтажник</option>
        <option value="individual">Частное лицо</option>
      </select>
      <textarea
        className={`${inputCls} md:col-span-2`}
        placeholder="Комментарий (модель, объём, сроки)"
        rows={3}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      {/* Honeypot: скрыт от человека, виден ботам */}
      <input
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        placeholder="Website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
      />

      <label className="flex items-start gap-2 text-sm text-ink-muted md:col-span-2">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1"
        />
        Согласен на обработку персональных данных *
      </label>

      {state === 'error' && (
        <p className="text-sm text-red-600 md:col-span-2">
          Проверьте обязательные поля (*) и согласие.
        </p>
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