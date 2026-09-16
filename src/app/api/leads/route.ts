import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'
import { rateLimit, clientKey } from '@/lib/rateLimit'
import { PRIVACY_POLICY_VERSION } from '@/lib/consent'

export async function POST(request: Request) {
  try {
    const limit = rateLimit(clientKey(request, 'leads'), { limit: 5, windowMs: 10 * 60_000 })
    if (!limit.ok) {
      return NextResponse.json(
        { error: 'Слишком много заявок. Попробуйте позже.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } },
      )
    }

    const body = await request.json()
    const {
      name, phone, email, clientType, comment, website,
      company, city, businessType, volume, consent,
    } = body

    // Honeypot: бот заполняет скрытое поле — тихо отбрасываем
    if (website) return NextResponse.json({ ok: true })

    // Серверная валидация: клиенту не верим. Нужны имя и хотя бы один канал связи.
    const phoneOk = typeof phone === 'string' && phone.replace(/\D/g, '').length === 11
    const emailOk = typeof email === 'string' && /.+@.+\..+/.test(email)
    if (!name || (!phoneOk && !emailOk)) {
      return NextResponse.json({ error: 'Укажите имя и телефон или email' }, { status: 400 })
    }
    if (consent !== true) {
      return NextResponse.json(
        { error: 'Требуется согласие на обработку персональных данных' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config })
    await payload.create({
      collection: 'leads',
      data: {
        name, phone, email, clientType, comment, company, city, businessType, volume,
        status: 'new',
        source: 'site',
        consent: true,
        consentAt: new Date().toISOString(),
        policyVersion: PRIVACY_POLICY_VERSION,
      },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    // Только текст ошибки: объект БД может содержать ПДн (имя/телефон/email).
    console.error('Ошибка заявки:', error instanceof Error ? error.message : 'error')
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
