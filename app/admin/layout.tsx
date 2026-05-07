'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { clearAuthSession } from '@/lib/browser-session'

const navItems = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/packages', label: 'Packages' },
  { href: '/admin/packages/new', label: 'Add Package' },
  { href: '/admin/bookings', label: 'Bookings' },
  { href: '/admin/agents', label: 'Agents' },
  { href: '/admin/customers', label: 'Customers' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:flex lg:flex-col
      `}
      >
        <div className="px-6 py-5 border-b border-gray-700">
          <Link href="/" className="text-xl font-bold text-orange-400">
            Travel Sphere Admin
          </Link>
          <p className="text-xs text-gray-400 mt-1">Management Panel</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition
                  ${isActive ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="px-4 py-4 border-t border-gray-700 space-y-2">
          <button
            onClick={() => {
              clearAuthSession()
              signOut({ callbackUrl: '/admin/login' })
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-gray-800 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 text-xl" type="button">
            Menu
          </button>
          <h1 className="text-lg font-semibold text-gray-700">Admin Panel</h1>
          <span className="text-sm text-gray-400">Travel Sphere</span>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
