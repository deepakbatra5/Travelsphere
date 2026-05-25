import { NextResponse, type NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { getPortalFromHost } from '@/lib/portal-host'

function isPublicAsset(path: string) {
  if (path.startsWith('/_next') || path === '/favicon.ico' || path === '/icon.png') {
    return true
  }
  const ext = path.split('.').pop()?.toLowerCase()
  if (ext && ['png', 'jpg', 'jpeg', 'svg', 'ico', 'webp', 'mp4', 'js', 'css', 'woff', 'woff2', 'ttf'].includes(ext)) {
    return true
  }
  if (path.startsWith('/images/') || path.startsWith('/states/')) {
    return true
  }
  return false
}

function getPortalPath(path: string, portal: ReturnType<typeof getPortalFromHost>) {
  if (portal === 'admin') {
    if (path === '/' || path === '/dashboard') return '/admin'
    if (path === '/login') return '/admin/login'
    if (path === '/packages') return '/admin/packages'
    if (path === '/packages/new') return '/admin/packages/new'
    if (path.startsWith('/packages/') && path.endsWith('/edit')) return `/admin${path}`
    if (path === '/bookings') return '/admin/bookings'
    if (path === '/enquiries') return '/admin/enquiries'
    if (path === '/agents') return '/admin/agents'
    if (path === '/customers') return '/admin/customers'
    return path
  }

  if (portal === 'agent') {
    if (path === '/dashboard' || path === '/dashbaord') return '/agent'
    if (path === '/profile') return '/agent/profile'
    if (path === '/tours') return '/agent/tours'
    if (path === '/my-tours') return '/agent/my-tours'
    if (path === '/earning' || path === '/earnings') return '/agent/earnings'
    if (path === '/help') return '/agent/help'
    if (path === '/pending') return '/agent/pending'
    return path
  }

  return path
}

function rewriteUrl(req: NextRequest, pathname: string) {
  const url = req.nextUrl.clone()
  url.pathname = pathname
  return NextResponse.rewrite(url)
}

export default async function proxy(req: NextRequest) {
  const originalPath = req.nextUrl.pathname
  const portal = getPortalFromHost(req.headers.get('host'))
  const path = getPortalPath(originalPath, portal)

  if (originalPath.startsWith('/api') || isPublicAsset(originalPath)) {
    return NextResponse.next()
  }

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
    '/forgot-password',
    '/agent-login',
    '/agent-register',
    '/admin/login',
  ].includes(path)

  // Prevent accessing admin or agent portals from the customer domain
  if (portal === 'customer') {
    if (isAdminRoute || isAgentRoute || path === '/agent-login' || path === '/agent-register' || path === '/admin/login') {
      const url = req.nextUrl.clone()
      url.pathname = '/404'
      return NextResponse.rewrite(url)
    }
  }

  if (portal === 'admin' && !isAdminRoute && !isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  if (portal === 'agent' && path !== '/' && !isAgentRoute && !isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  if (path === '/admin/login') {
    if (token?.role === 'ADMIN') {
      return NextResponse.redirect(new URL(portal === 'admin' ? '/dashboard' : '/admin', req.url))
    }

    return originalPath === path ? NextResponse.next() : rewriteUrl(req, path)
  }

  if (path === '/agent-login') {
    if (token?.role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', req.url))
    }

    if (token?.agentStatus) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return originalPath === path ? NextResponse.next() : rewriteUrl(req, path)
  }

  if (portal === 'agent' && originalPath === '/login') {
    const url = req.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  if (portal === 'agent' && originalPath === '/register') {
    const url = req.nextUrl.clone()
    url.pathname = '/'
    url.searchParams.set('tab', 'register')
    return NextResponse.redirect(url)
  }

  if (path === '/') {
    if (token?.agentStatus) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return originalPath === path ? NextResponse.next() : rewriteUrl(req, '/agent-login')
  }

  if (isAdminRoute && token?.role !== 'ADMIN') {
    const loginUrl = new URL(portal === 'admin' ? '/login' : '/admin/login', req.url)
    loginUrl.searchParams.set('callbackUrl', portal === 'admin' ? '/dashboard' : `${path}${req.nextUrl.search}`)
    return NextResponse.redirect(loginUrl)
  }

  if (path === '/agent-register') {
    return originalPath === path ? NextResponse.next() : rewriteUrl(req, path)
  }

  if (isAgentRoute && !token?.agentStatus) {
    const loginUrl = new URL(portal === 'agent' ? '/login' : '/agent-login', req.url)
    loginUrl.searchParams.set('callbackUrl', portal === 'agent' ? '/agent' : `${path}${req.nextUrl.search}`)
    return NextResponse.redirect(loginUrl)
  }

  // Removed legacy redirects for agents and admins. They can now browse the customer portal freely.

  return originalPath === path ? NextResponse.next() : rewriteUrl(req, path)
}

export const config = {
  matcher: ['/:path*'],
}
