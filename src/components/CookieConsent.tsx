'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { hasConsent, giveConsent } from '@/lib/cookieConsent'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(!hasConsent())
  }, [])

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white/95 px-6 py-4 shadow-[0_-4px_24px_rgba(0,0,0,0.1)] backdrop-blur">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4">
        <p className="max-w-2xl text-sm text-ink-muted">
          Мы используем файлы cookie и сервисы аналитики (Яндекс.Метрика) для
          улучшения работы сайта. Продолжая пользоваться сайтом, вы
          соглашаетесь с их использованием — подробнее в{' '}
          <Link href="/privacy" className="text-accent underline hover:no-underline">
            политике конфиденциальности
          </Link>
          .
        </p>
        <Button
          onClick={() => {
            giveConsent()
            setVisible(false)
          }}
          className="flex-shrink-0"
        >
          Хорошо
        </Button>
      </div>
    </div>
  )
}
