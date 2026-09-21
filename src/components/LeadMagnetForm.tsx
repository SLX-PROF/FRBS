'use client'

import { useState } from 'react'
import { trackGoal } from '@/lib/metrika'
import Button from '@/components/ui/Button'
import { CheckIcon } from '@/components/ui/Icons'

export default function LeadMagnetForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle')
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !/.+@.+\..+/.test(email)) {
      setError('Укажите имя и корректный email.')
      setState('error')
      return
    }
    if (!consent) {
      setError('Отметьте согласие на обработку персональных данных.')
      setState('error')
      return
    }
    setError('')
    setState('sending')
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        consent,
        clientType: 'architect',
        comment: 'Запросил альбом типовых решений',
      }),
    })
    if (res.ok) {
      trackGoal('lead_submit')
      setState('ok')
    } else {
      setError('Не удалось отправить. Попробуйте ещё раз или напишите на sales@forbsa.ru.')
      setState('error')
    }
  }

  if (state === 'ok') {
    return (
      <div className="mt-8 flex items-center gap-4 rounded-panel border border-accent/30 bg-accent/10 p-6 text-left">
        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-accent text-white">
          <CheckIcon className="h-4 w-4" />
        </span>
        <div>
          <div className="font-semibold text-white">Спасибо! Менеджер вышлет альбом на {email}</div>
          <div className="mt-0.5 text-sm text-white/60">Обычно в течение рабочего дня</div>
        </div>
      </div>
    )
  }

  const inputCls =
    'flex-1 rounded-field border border-white/20 bg-white/5 px-5 py-3.5 text-white placeholder:text-white/40 outline-none transition-colors focus:border-accent focus:bg-white/10'

  return (
    <form onSubmit={submit} className="mt-8 flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          aria-label="Ваше имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ваше имя"
          className={inputCls}
        />
        <input
          type="email"
          aria-label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className={inputCls}
        />
        <Button type="submit" size="lg" disabled={state === 'sending'} className="group">
          {state === 'sending' ? 'Отправляем…' : 'Получить альбом'}
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </Button>
      </div>

      <div className="flex items-start gap-2 text-sm text-white/50">
        <input
          id="magnet-consent"
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 accent-accent"
        />
        <span>
          <label htmlFor="magnet-consent">Согласен на обработку </label>
          <a href="/privacy" target="_blank" className="text-accent underline underline-offset-2 hover:no-underline">
            персональных данных
          </a>
        </span>
      </div>

      {state === 'error' && <p className="text-sm text-red-400">{error}</p>}
    </form>
  )
}
