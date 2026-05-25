'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import {
  Bars3Icon,
  XMarkIcon,
  GlobeAltIcon,
  BriefcaseIcon,
  UserIcon,
  CalendarDaysIcon,
  StarIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'
import { clearAuthSession } from '@/lib/browser-session'
import ThemeToggle from '@/components/theme/ThemeToggle'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'All Packages', href: '/tours' },
  { label: 'Customised Tours', href: '/customised-tour' },
  { label: 'Help', href: '/help' },
  { label: 'Blog', href: '/blog' },
  { label: 'About Us', href: '/about-us' },
]

export default function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const userName = session?.user?.name?.split(' ')[0] || 'Traveler'
  const [isSearchActive, setIsSearchActive] = useState(false)

  useEffect(() => {
    setIsSearchActive(!!window.location.search)
  }, [pathname])
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
            <img src="/logo-transparent.png" alt="Logo" className="h-6 w-6 object-contain" />
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
                  className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
                    (link.href === '/tours' ? (pathname === '/tours' && !isSearchActive) : pathname === link.href)
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-650 hover:bg-slate-100 hover:text-slate-900'
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
              <div
                className="relative"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-100 transition shadow-xs"
                >
                  <UserIcon className="h-4.5 w-4.5 text-slate-500" />
                  Hi, {userName}
                  <svg
                    className={`ml-0.5 h-4 w-4 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-1.5 w-52 origin-top-right rounded-2xl border border-slate-100 bg-white p-2 shadow-xl ring-1 ring-black/5 animate-in fade-in duration-100">
                    <Link
                      href="/dashboard?tab=personal"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition"
                    >
                      <UserIcon className="h-4 w-4 text-slate-455" />
                      Personal Details
                    </Link>
                    <Link
                      href="/dashboard?tab=bookings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition"
                    >
                      <CalendarDaysIcon className="h-4 w-4 text-slate-455" />
                      My Bookings
                    </Link>
                    <Link
                      href="/dashboard?tab=reviews"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition"
                    >
                      <StarIcon className="h-4 w-4 text-slate-455" />
                      Write Reviews
                    </Link>
                    <Link
                      href="/dashboard?tab=settings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition"
                    >
                      <Cog6ToothIcon className="h-4 w-4 text-slate-455" />
                      Account Settings
                    </Link>
                    <hr className="my-1 border-slate-100" />
                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false)
                        clearAuthSession()
                        void signOut()
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 transition"
                    >
                      <svg className="h-4 w-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
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
                    className={`rounded-xl px-3 py-2 ${
                      (link.href === '/tours' ? (pathname === '/tours' && !isSearchActive) : pathname === link.href)
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
                <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-405">Account Menu</span>
                <Link href="/dashboard?tab=personal" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-2 text-sm font-semibold hover:bg-slate-100 flex items-center gap-2">
                  <UserIcon className="h-4.5 w-4.5 text-slate-400" /> Personal Details
                </Link>
                <Link href="/dashboard?tab=bookings" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-2 text-sm font-semibold hover:bg-slate-100 flex items-center gap-2">
                  <CalendarDaysIcon className="h-4.5 w-4.5 text-slate-400" /> My Bookings
                </Link>
                <Link href="/dashboard?tab=reviews" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-2 text-sm font-semibold hover:bg-slate-100 flex items-center gap-2">
                  <StarIcon className="h-4.5 w-4.5 text-slate-400" /> Write Reviews
                </Link>
                <Link href="/dashboard?tab=settings" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-2 text-sm font-semibold hover:bg-slate-100 flex items-center gap-2">
                  <Cog6ToothIcon className="h-4.5 w-4.5 text-slate-400" /> Account Settings
                </Link>
                <button
                  onClick={() => {
                    setMenuOpen(false)
                    clearAuthSession()
                    void signOut()
                  }}
                  className="rounded-xl px-3 py-2 text-left text-sm font-bold text-red-650 hover:bg-red-50 flex items-center gap-2"
                >
                  <svg className="h-4.5 w-4.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013 3v1" />
                  </svg>
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
