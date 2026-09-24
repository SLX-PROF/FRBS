import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

// Для мониторинга и scripts/watchdog.sh: 200, если приложение отвечает и база доступна.
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const payload = await getPayload({ config })
    await payload.find({ collection: 'products', limit: 1, depth: 0, overrideAccess: true })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 })
  }
}
