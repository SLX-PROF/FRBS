import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'
import { renderKpPdf } from '@/lib/pdf/kp'
import { kpNumber } from '@/lib/pdf/number'

export const dynamic = 'force-dynamic'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const payload = await getPayload({ config })

  const { user } = await payload.auth({ headers: request.headers })
  if (!user) {
    return NextResponse.json({ error: 'Требуется вход в админку' }, { status: 401 })
  }

  let deal: any
  try {
    deal = await payload.findByID({ collection: 'deals', id, depth: 1, user, overrideAccess: false })
  } catch {
    return NextResponse.json({ error: 'Сделка не найдена или нет доступа' }, { status: 404 })
  }
  if (!deal) {
    return NextResponse.json({ error: 'Сделка не найдена' }, { status: 404 })
  }

  const company = deal.company && typeof deal.company === 'object' ? deal.company : null
  const profile = await payload.findGlobal({ slug: 'company-profile' }).catch(() => null)

  const pdf = await renderKpPdf({ deal, company, profile })
  const filename = `${kpNumber(deal.id, new Date())}.pdf`

  return new Response(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="kp-${deal.id}.pdf"; filename*=UTF-8''${encodeURIComponent(filename)}`,
      'Cache-Control': 'no-store',
    },
  })
}
