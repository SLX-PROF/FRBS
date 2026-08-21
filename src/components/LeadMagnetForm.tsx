'use client'

import { useState } from 'react'

export default function LeadMagnetForm() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  if (sent) {
    return (
      <div className="rounded-xl border border-accent/30 bg-accent/10 p-6 text-center">
        <div className="text-lg font-semibold text-white">
          ✅ Спасибо! Альбом отправлен на {email}
        </div>
        <div className="mt-1 text-sm text-white/60">
          Проверьте почту в течение 5 минут
        </div>
      </div>
    )
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        setSent(true)
      }}
      className="mt-8 flex flex-col gap-3 sm:flex-row"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="flex-1 rounded-xl border border-white/20 bg-white/5 px-5 py-3.5 text-white placeholder:text-white/40 outline-none transition-colors focus:border-accent focus:bg-white/10"
      />
      <button
        type="submit"
        className="group inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-7 py-3.5 font-semibold text-white shadow-lg shadow-accent/30 transition-all hover:-translate-y-0.5 hover:bg-accent-dark"
      >
        Получить альбом
        <span className="transition-transform group-hover:translate-x-1">→</span>
      </button>
    </form>
    )
}