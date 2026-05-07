import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const isAdminRoute = path.startsWith('/admin')
  const isAgentRoute = path.startsWith('/agent')
  const isAuthRoute = [
    '/login',
    '/register',
    '/verify-otp',
    '/agent-login',
    '/agent-register',
    '/admin/login',
  ].includes(path)
  const isPublicAsset = path.startsWith('/_next') || path.startsWith('/api') || path === '/favicon.ico'

  if (path === '/admin/login') {
    if (token?.role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', req.url))
    }

    return NextResponse.next()
  }

  if (path === '/agent-login') {
    if (token?.role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', req.url))
    }

    if (token?.agentStatus) {
      return NextResponse.redirect(new URL('/agent', req.url))
    }

    return NextResponse.next()
  }

  if (isAdminRoute && token?.role !== 'ADMIN') {
    const loginUrl = new URL('/admin/login', req.url)
    loginUrl.searchParams.set('callbackUrl', `${req.nextUrl.pathname}${req.nextUrl.search}`)
    return NextResponse.redirect(loginUrl)
  }

  if (path === '/agent-register') {
    return NextResponse.next()
  }

  if (isAgentRoute && !token?.agentStatus) {
    const loginUrl = new URL('/agent-login', req.url)
    loginUrl.searchParams.set('callbackUrl', `${req.nextUrl.pathname}${req.nextUrl.search}`)
    return NextResponse.redirect(loginUrl)
  }

  if (token?.role === 'ADMIN' && !isAdminRoute && !isAuthRoute && !isPublicAsset) {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  if (token?.agentStatus && !isAgentRoute && !isAuthRoute && !isPublicAsset) {
    return NextResponse.redirect(new URL('/agent', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/:path*'],
}
