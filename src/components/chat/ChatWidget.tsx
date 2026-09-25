'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { formatPhone } from '@/lib/format'

type Msg = { role: 'user' | 'assistant'; content: string }

const GREETING: Msg = {
  role: 'assistant',
  content: 'Здравствуйте! Спрошу пару вопросов и помогу подобрать автоматический порог. Что интересует?',
}

export default function ChatWidget() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([GREETING])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [demo, setDemo] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [leadOpen, setLeadOpen] = useState(false)
  const [leadSent, setLeadSent] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [hint, setHint] = useState(false)

  useEffect(() => {
    try {
      if (sessionStorage.getItem('forbsa-chat-hint')) return
    } catch {}
    const t = setTimeout(() => setHint(true), 6000)
    return () => clearTimeout(t)
  }, [])

  const dismissHint = () => {
    setHint(false)
    try {
      sessionStorage.setItem('forbsa-chat-hint', '1')
    } catch {}
  }

  useEffect(() => {
    try {
      const s = localStorage.getItem('forbsa-chat-token')
      if (s) setToken(s)
    } catch {}
  }, [])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [msgs, leadOpen, leadSent])

  if (pathname?.startsWith('/cp-7k2f9x')) return null

  async function send() {
    const text = input.trim()
    if (!text || busy) return
    setInput('')
    const next = [...msgs, { role: 'user' as const, content: text }]
    setMsgs(next)
    setBusy(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, token }),
      })
      const data = await res.json()
      if (!res.ok) {
        setMsgs((m) => [...m, { role: 'assistant', content: data.error || 'Ошибка. Попробуйте позже.' }])
        return
      }
      setDemo(Boolean(data.demo))
      if (typeof data.token === 'string') {
        setToken(data.token)
        try {
          localStorage.setItem('forbsa-chat-token', data.token)
        } catch {}
      }
      setMsgs((m) => [...m, { role: 'assistant', content: data.reply }])
      if (data.offerLead) setLeadOpen(true)
    } catch {
      setMsgs((m) => [...m, { role: 'assistant', content: 'Нет связи с сервером. Попробуйте позже.' }])
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      {!open && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3">
          {hint && (
            <div role="status" className="animate-hint-in hidden items-center gap-2 rounded-full bg-white py-2 pl-4 pr-2 text-sm font-medium text-ink shadow-lift ring-1 ring-black/5 md:flex">
              Спросите инженера
              <button type="button" onClick={dismissHint} aria-label="Закрыть подсказку" className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-ink-muted hover:bg-surface hover:text-ink">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={() => {
              dismissHint()
              setOpen(true)
            }}
            aria-label="Открыть чат с консультантом"
            className="flex h-14 cursor-pointer items-center justify-center gap-2 rounded-full bg-accent px-5 text-white shadow-lift transition-transform hover:scale-105 active:scale-95 md:w-14 md:px-0"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span className="text-sm font-semibold md:hidden">Консультация</span>
          </button>
        </div>
      )}

      {open && (
        <div className="fixed bottom-5 right-5 z-50 flex h-[560px] max-h-[calc(100vh-2.5rem)] w-[calc(100vw-2.5rem)] max-w-96 flex-col overflow-hidden rounded-panel border border-line bg-white shadow-lift">
          <div className="flex items-center justify-between border-b border-line bg-graphite px-4 py-3 text-white">
            <div className="text-sm font-semibold">
              Консультант FORBSA
              {demo && <span className="ml-2 rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium">демо</span>}
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Свернуть чат" className="text-white/70 hover:text-white">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm ${
                    m.role === 'user' ? 'bg-accent text-white' : 'bg-surface text-ink'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {busy && <div className="text-xs text-ink-muted">Печатает…</div>}

            {leadOpen && !leadSent && (
              <LeadForm
                token={token}
                lastQuestion={[...msgs].reverse().find((m) => m.role === 'user')?.content}
                onSent={() => {
                  setLeadSent(true)
                  setMsgs((m) => [...m, { role: 'assistant', content: 'Спасибо! Инженер свяжется с вами в рабочее время.' }])
                }}
              />
            )}
          </div>

          <div className="border-t border-line p-3">
            {!leadOpen && (
              <button
                type="button"
                onClick={() => setLeadOpen(true)}
                className="mb-2 text-xs font-semibold text-accent hover:underline"
              >
                Оставить контакт для инженера →
              </button>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                send()
              }}
              className="flex gap-2"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ваш вопрос…"
                aria-label="Сообщение"
                className="min-w-0 flex-1 rounded-field border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-accent focus:bg-white"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                className="rounded-btn bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
              >
                →
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

function LeadForm({
  token,
  lastQuestion,
  onSent,
}: {
  token: string | null
  lastQuestion?: string
  onSent: () => void
}) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || (phone.replace(/\D/g, '').length !== 11 && !/.+@.+\..+/.test(email))) {
      setErr('Имя и телефон или email.')
      return
    }
    if (!consent) {
      setErr('Отметьте согласие на обработку данных.')
      return
    }
    setErr('')
    setBusy(true)
    try {
      const res = await fetch('/api/chat/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, consent, note: lastQuestion, token }),
      })
      if (res.ok) onSent()
      else setErr((await res.json()).error || 'Не удалось отправить.')
    } catch {
      setErr('Нет связи с сервером.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-2 rounded-2xl border border-line bg-surface p-3">
      <div className="text-xs font-semibold text-ink">Контакт для инженера</div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Имя"
        aria-label="Имя"
        className="w-full rounded-field border border-line bg-white px-3 py-2 text-sm outline-none focus:border-accent"
      />
      <input
        value={phone}
        onChange={(e) => setPhone(formatPhone(e.target.value))}
        placeholder="+7 (___) ___-__-__"
        aria-label="Телефон"
        className="w-full rounded-field border border-line bg-white px-3 py-2 text-sm outline-none focus:border-accent"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        type="email"
        aria-label="Email"
        className="w-full rounded-field border border-line bg-white px-3 py-2 text-sm outline-none focus:border-accent"
      />
      <label className="flex items-start gap-2 text-[11px] text-ink-muted">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 accent-accent" />
        <span>
          Согласен на обработку{' '}
          <a href="/privacy" target="_blank" className="text-accent underline">
            персональных данных
          </a>
        </span>
      </label>
      {err && <p className="text-xs text-red-600">{err}</p>}
      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-btn bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
      >
        {busy ? 'Отправляем…' : 'Отправить'}
      </button>
    </form>
  )
}
