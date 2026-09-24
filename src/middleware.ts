import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function checkAuth(request: NextRequest, user?: string, pass?: string) {
  if (!user || !pass) return false
  const auth = request.headers.get('authorization')
  if (!auth?.startsWith('Basic ')) return false
  const decoded = Buffer.from(auth.slice(6), 'base64').toString('utf-8')
  const separatorIndex = decoded.indexOf(':')
  const reqUser = decoded.slice(0, separatorIndex)
  const reqPass = decoded.slice(separatorIndex + 1)
  return reqUser === user && reqPass === pass
}

function unauthorized(realm: string) {
  return new NextResponse('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': `Basic realm="${realm}"` },
  })
}

const PREVIEW_COOKIE = 'forbsa_preview'

// /cp-7k2f9x (админка, путь задан в payload.config.ts) — отдельный Basic Auth
// пароль (ADMIN_BASIC_AUTH_*), сам путь просто неочевидный, а не секретный.
// Остальной сайт — занавеска "в разработке" для всех, пока задан
// SITE_PREVIEW_SECRET. Обойти её можно ссылкой ?preview=<секрет> — она ставит
// куку на 30 дней и больше не спрашивает. Публичный релиз — просто убрать
// SITE_PREVIEW_SECRET из .env и перезапустить контейнер, код не трогать.
export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  if (pathname.startsWith('/cp-7k2f9x')) {
    return checkAuth(request, process.env.ADMIN_BASIC_AUTH_USER, process.env.ADMIN_BASIC_AUTH_PASSWORD)
      ? NextResponse.next()
      : unauthorized('Admin')
  }

  // Планировщик ходит без куки предпросмотра; эти маршруты сами проверяют x-cron-key.
  if (pathname.startsWith('/api/cron/')) return NextResponse.next()

  const previewSecret = process.env.SITE_PREVIEW_SECRET
  if (!previewSecret) return NextResponse.next()

  const paramSecret = searchParams.get('preview')
  if (paramSecret === previewSecret) {
    const url = request.nextUrl.clone()
    url.searchParams.delete('preview')
    const response = NextResponse.redirect(url)
    response.cookies.set(PREVIEW_COOKIE, previewSecret, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
    })
    return response
  }

  if (request.cookies.get(PREVIEW_COOKIE)?.value === previewSecret) {
    return NextResponse.next()
  }

  if (pathname === '/coming-soon') return NextResponse.next()

  return NextResponse.rewrite(new URL('/coming-soon', request.url))
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
