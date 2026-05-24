'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { Bars3Icon, XMarkIcon, GlobeAltIcon, BriefcaseIcon } from '@heroicons/react/24/outline'
import { clearAuthSession } from '@/lib/browser-session'
import ThemeToggle from '@/components/theme/ThemeToggle'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'All Packages', href: '/packages' },
  { label: 'Customised Tours', href: '/customised-tour' },
  { label: 'Help', href: '/help' },
  { label: 'Blog', href: '/blog' },
]

export default function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const userName = session?.user?.name?.split(' ')[0] || 'Traveler'
  const isPackagesPage = pathname?.startsWith('/packages')
  const isAdmin = session?.user?.role === 'ADMIN'
  const isAgent = Boolean(session?.user?.agentStatus)
  const showPublicLinks = !isAdmin && !isAgent
  const showBecomeAgent = !session?.user

  // Fix hydration: always start with prod URLs, update to localhost after mount
  const [agentUrl, setAgentUrl] = useState('https://agent.travelsphere.sbs')
  const [adminUrl, setAdminUrl] = useState('https://admin.travelsphere.sbs')
  useEffect(() => {
    if (window.location.hostname.includes('localhost')) {
      setAgentUrl('http://agent.localhost:3000')
      setAdminUrl('http://admin.localhost:3000')
    }
  }, [])

  return (
    <nav className="sticky top-0 z-50 border-b border-white/70 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="shrink-0">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-bold uppercase tracking-[0.2em] text-orange-700 md:text-base shadow-sm">
            <GlobeAltIcon className="h-5 w-5 text-orange-600" />
            Travel Sphere
          </span>
        </Link>

        <div className="hidden items-center gap-2 lg:flex">
          {showPublicLinks && (
            <>
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`rounded-full px-3 py-2 text-sm font-semibold transition ${(link.href === '/packages' && isPackagesPage) || pathname === link.href
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
              {showBecomeAgent && (
                <a href={agentUrl} className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-cyan-700 transition hover:bg-slate-100 hover:text-cyan-800">
                  <BriefcaseIcon className="h-4 w-4" />
                  Business
                </a>
              )}
            </>
          )}
        </div>

        <div className="hidden items-center gap-4 lg:flex">
          <div className="order-first">
            <ThemeToggle />
          </div>
          {session?.user ? (
            <>
              {session.user.role === 'ADMIN' && (
                <a href={adminUrl} className="whitespace-nowrap text-sm font-semibold text-orange-600 hover:text-orange-700">
                  Admin Panel
                </a>
              )}
              {!isAdmin && isAgent && (
                <a href={agentUrl} className="whitespace-nowrap text-sm font-semibold text-cyan-700 hover:text-cyan-800">
                  Agent Portal
                </a>
              )}
              <Link href="/dashboard" className="whitespace-nowrap text-sm font-semibold text-slate-600 hover:text-slate-900">
                Dashboard
              </Link>
              <span className="whitespace-nowrap text-sm font-semibold text-slate-500">Hi, {userName}</span>
              <button
                type="button"
                onClick={() => {
                  clearAuthSession()
                  void signOut()
                }}
                className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900">
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-linear-to-r from-orange-500 to-amber-500 px-5 py-2 text-sm font-semibold text-white hover:from-orange-600 hover:to-amber-600"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <div className="order-first">
            <ThemeToggle />
          </div>
          <button
            type="button"
            className="theme-toggle flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-100 bg-white px-4 py-4">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 text-sm font-medium text-slate-700">
            {showPublicLinks && (
              <>
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`rounded-xl px-3 py-2 ${(link.href === '/packages' && isPackagesPage) || pathname === link.href
                      ? 'bg-slate-900 text-white'
                      : 'hover:bg-slate-100'
                      }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {showBecomeAgent && (
                  <a href={agentUrl} onClick={() => setMenuOpen(false)} className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-cyan-700 hover:bg-slate-100">
                    <BriefcaseIcon className="h-4 w-4" />
                    Business
                  </a>
                )}
              </>
            )}
            {session?.user ? (
              <>
                {session.user.role === 'ADMIN' && (
                  <a href={adminUrl} className="rounded-xl px-3 py-2 hover:bg-slate-100">
                    Admin Panel
                  </a>
                )}
                {!isAdmin && isAgent && (
                  <a href={agentUrl} className="rounded-xl px-3 py-2 hover:bg-slate-100">
                    Agent Portal
                  </a>
                )}
                <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-2 hover:bg-slate-100">
                  Dashboard
                </Link>
                <span className="px-3 text-slate-500">Hi, {userName}</span>
                <button
                  onClick={() => {
                    setMenuOpen(false)
                    clearAuthSession()
                    void signOut()
                  }}
                  className="rounded-xl px-3 py-2 text-left text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-2 hover:bg-slate-100">
                  Login
                </Link>
                <Link href="/register" onClick={() => setMenuOpen(false)} className="rounded-xl bg-orange-500 px-3 py-2 text-white hover:bg-orange-600">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
