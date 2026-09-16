import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'
import { runScheduledNotifications } from '@/lib/notifications'

// Вызывается внешним планировщиком (host cron):
//   curl -H "x-cron-key: $CRON_SECRET" https://.../api/cron/notify
// Ключ принимается только в заголовке — не в query-строке (та попадает в логи).
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  const provided = request.headers.get('x-cron-key') || ''

  if (!secret || provided !== secret) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  try {
    const payload = await getPayload({ config })
    const result = await runScheduledNotifications(payload)
    return NextResponse.json({ ok: true, ...result })
  } catch (err) {
    console.error('cron/notify failed:', err)
    return NextResponse.json({ error: 'internal error' }, { status: 500 })
  }
}
