import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Extra password gate in front of Payload's own /admin login, so the panel
// isn't reachable by anyone who finds the IP/port (nginx-level IP allowlist
// can replace/join this once a domain + reverse proxy exist).
export function middleware(request: NextRequest) {
  const user = process.env.ADMIN_BASIC_AUTH_USER
  const pass = process.env.ADMIN_BASIC_AUTH_PASSWORD

  const unauthorized = () =>
    new NextResponse('Authentication required', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Admin"' },
    })

  if (!user || !pass) return unauthorized()

  const auth = request.headers.get('authorization')
  if (auth?.startsWith('Basic ')) {
    const decoded = Buffer.from(auth.slice(6), 'base64').toString('utf-8')
    const separatorIndex = decoded.indexOf(':')
    const reqUser = decoded.slice(0, separatorIndex)
    const reqPass = decoded.slice(separatorIndex + 1)
    if (reqUser === user && reqPass === pass) return NextResponse.next()
  }

  return unauthorized()
}

export const config = {
  matcher: ['/admin/:path*'],
}
