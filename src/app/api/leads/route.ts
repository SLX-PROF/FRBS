import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      name, phone, email, clientType, comment, website,
      company, city, businessType, volume,
    } = body

    // Honeypot: бот заполняет скрытое поле — тихо отбрасываем
    if (website) return NextResponse.json({ ok: true })

    // Серверная валидация: клиенту не верим
    if (!name || !phone || phone.replace(/\D/g, '').length !== 11) {
      return NextResponse.json(
        { error: 'Проверьте имя и телефон' },
        { status: 400 },
      )
    }

    const payload = await getPayload({ config })
    await payload.create({
      collection: 'leads',
      data: { name, phone, email, clientType, comment, company, city, businessType, volume },
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Ошибка заявки:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}