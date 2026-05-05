'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { clearAuthSession } from '@/lib/browser-session'

const navItems = [
  { href: '/agent', label: 'Dashboard' },
  { href: '/agent/tours', label: 'Available Tours' },
  { href: '/agent/my-tours', label: 'My Assignments' },
  { href: '/agent/earnings', label: 'Earnings' },
]

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (pathname === '/agent/pending') return <>{children}</>

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-cyan-950 text-white transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:flex lg:translate-x-0 lg:flex-col`}>
        <div className="border-b border-cyan-900 px-6 py-5">
          <Link href="/" className="text-xl font-bold text-orange-300">Travel Sphere Agent</Link>
          <p className="mt-1 text-xs text-cyan-300">Agent Portal</p>
        </div>
        <nav className="flex-1 space-y-1 px-4 py-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${pathname === item.href ? 'bg-orange-500 text-white' : 'text-cyan-100 hover:bg-cyan-900 hover:text-white'}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="space-y-2 border-t border-cyan-900 px-4 py-4">
          <Link href="/" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-cyan-200 hover:bg-cyan-900">View Website</Link>
          <button
            onClick={() => {
              clearAuthSession()
              signOut({ callbackUrl: '/' })
            }}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-red-300 hover:bg-cyan-900"
          >
            Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between bg-white px-6 py-4 shadow-sm">
          <button onClick={() => setSidebarOpen(true)} className="text-xl text-slate-500 lg:hidden" type="button">Menu</button>
          <h1 className="text-lg font-semibold text-slate-700">Agent Portal</h1>
          <span className="text-sm text-slate-400">Travel Sphere</span>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
