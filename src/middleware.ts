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

// Пока сайт не в релизе — Basic Auth на весь сайт (SITE_BASIC_AUTH_*).
// Гейт снимается сам, как только эти две переменные убрать из .env — код
// менять не нужно. /admin поверх этого по-прежнему защищён отдельным паролем
// (ADMIN_BASIC_AUTH_*), так что превью-пароль не даёт доступа в CMS.
export function middleware(request: NextRequest) {
  const siteUser = process.env.SITE_BASIC_AUTH_USER
  const sitePass = process.env.SITE_BASIC_AUTH_PASSWORD
  if (siteUser && sitePass && !checkAuth(request, siteUser, sitePass)) {
    return unauthorized('Site')
  }

  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!checkAuth(request, process.env.ADMIN_BASIC_AUTH_USER, process.env.ADMIN_BASIC_AUTH_PASSWORD)) {
      return unauthorized('Admin')
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
