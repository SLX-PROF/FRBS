import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, phone, email, clientType, comment, website } = body

    // Honeypot: человек не видит скрытое поле, бот заполняет — отбрасываем
    if (website) {
      return NextResponse.json({ ok: true })
    }

    // Серверная валидация: клиенту не верим никогда
    if (!name || !phone || phone.replace(/\D/g, '').length !== 11) {
      return NextResponse.json(
        { error: 'Проверьте имя и телефон' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config })
    await payload.create({
      collection: 'leads',
      data: { name, phone, email, clientType, comment },
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}