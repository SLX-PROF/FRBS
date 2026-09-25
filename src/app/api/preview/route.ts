import { cookies, draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { isProductStaff } from '@/lib/access'

// Включает режим предпросмотра для вошедшего в админку сотрудника и открывает страницу.
//   /api/preview?path=/about        — страница с черновиком
//   /api/preview?exit=1&path=/about — выйти из предпросмотра
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const raw = url.searchParams.get('path') || '/'
  // Только внутренние пути: защита от перенаправления на чужой сайт.
  const path = raw.startsWith('/') && !raw.startsWith('//') ? raw : '/'

  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: request.headers })
  if (!user || !isProductStaff(user as Parameters<typeof isProductStaff>[0])) {
    return new Response('Нужен вход в админку', { status: 403 })
  }

  const dm = await draftMode()
  if (url.searchParams.get('exit')) {
    dm.disable()
  } else {
    dm.enable()
    // Заглушка «сайт в разработке» не должна закрывать предпросмотр.
    const secret = process.env.SITE_PREVIEW_SECRET
    if (secret) {
      ;(await cookies()).set('forbsa_preview', secret, { httpOnly: true, sameSite: 'lax', maxAge: 60 * 60 * 24 * 30, path: '/' })
    }
  }
  redirect(path)
}
