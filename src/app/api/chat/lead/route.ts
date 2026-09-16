import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'
import { rateLimit, clientKey } from '@/lib/rateLimit'
import { PRIVACY_POLICY_VERSION } from '@/lib/consent'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request, 'leads'), { limit: 5, windowMs: 10 * 60_000 })
  if (!limit.ok) {
    return NextResponse.json({ error: 'Слишком много заявок. Попробуйте позже.' }, { status: 429 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Некорректный запрос' }, { status: 400 })
  }

  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const phone = typeof body.phone === 'string' ? body.phone : ''
  const email = typeof body.email === 'string' ? body.email : ''
  const note = typeof body.note === 'string' ? body.note.slice(0, 1000) : ''
  const consent = body.consent === true
  const token =
    typeof body.token === 'string' && /^[a-f0-9-]{10,64}$/i.test(body.token) ? body.token : null

  const phoneOk = phone.replace(/\D/g, '').length === 11
  const emailOk = /.+@.+\..+/.test(email)
  if (!name || (!phoneOk && !emailOk)) {
    return NextResponse.json({ error: 'Укажите имя и телефон или email' }, { status: 400 })
  }
  if (!consent) {
    return NextResponse.json(
      { error: 'Требуется согласие на обработку персональных данных' },
      { status: 400 },
    )
  }

  try {
    const payload = await getPayload({ config })
    const lead = await payload.create({
      collection: 'leads',
      data: {
        name,
        phone: phone || undefined,
        email: email || undefined,
        comment: `Из чат-бота. ${note}`.trim(),
        status: 'new',
        source: 'chatbot',
        consent: true,
        consentAt: new Date().toISOString(),
        policyVersion: PRIVACY_POLICY_VERSION,
      },
    })

    // Привязываем к сессии только по совпадению непредсказуемого токена.
    if (token) {
      const s = (
        await payload.find({ collection: 'chat-sessions', where: { token: { equals: token } }, limit: 1, depth: 0 })
      ).docs[0]
      if (s) {
        await payload
          .update({
            collection: 'chat-sessions',
            id: s.id,
            overrideAccess: true,
            data: { lead: lead.id, consent: true },
          })
          .catch(() => null)
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('chat lead failed:', err instanceof Error ? err.message : 'error')
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
