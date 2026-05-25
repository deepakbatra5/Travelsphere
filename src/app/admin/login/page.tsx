'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { markAuthSessionActive } from '@/lib/browser-session'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

function getSafeCallbackPath() {
  if (typeof window === 'undefined') return '/admin'

  const isAdminSubdomain = window.location.hostname.startsWith('admin.')
  const defaultPath = isAdminSubdomain ? '/dashboard' : '/admin'

  const rawCallback = new URLSearchParams(window.location.search).get('callbackUrl')
  if (!rawCallback) return defaultPath

  try {
    const callbackUrl = new URL(rawCallback, window.location.origin)

    if (callbackUrl.origin !== window.location.origin) return defaultPath

    const pathWithQuery = `${callbackUrl.pathname}${callbackUrl.search}${callbackUrl.hash}`
    const isSafeAdminPath = pathWithQuery.startsWith('/admin') && pathWithQuery !== '/admin/login'
    const isSafeSubdomainPath = isAdminSubdomain && pathWithQuery.startsWith('/dashboard')

    if (!isSafeAdminPath && !isSafeSubdomainPath) {
      return defaultPath
    }

    return pathWithQuery
  } catch {
    if (rawCallback.startsWith('/admin') && rawCallback !== '/admin/login') return rawCallback
    if (isAdminSubdomain && rawCallback.startsWith('/dashboard')) return rawCallback
    return defaultPath
  }
}

export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const safeCallbackPath = getSafeCallbackPath()

    const result = await signIn('credentials', {
      email: form.email,
      password: form.password,
      portal: 'admin',
      redirect: false,
      callbackUrl: safeCallbackPath,
    })

    if (result?.error || !result?.ok) {
      setLoading(false)
      setError('Invalid email or password. Please try again.')
      return
    }

    markAuthSessionActive()
    window.location.assign(safeCallbackPath)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-cyan-300/30 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-orange-300/30 blur-3xl" />
      <div className="surface-card relative w-full max-w-md rounded-3xl p-8">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-orange-700">
            <img src="/logo-transparent.png" alt="Logo" className="h-4 w-4 object-contain" />
            Travel Sphere Admin
          </Link>
          <h1 className="mt-4 text-2xl font-extrabold text-slate-900">Admin Login</h1>
          <p className="mt-1 text-sm text-slate-600">Sign in with an admin account to manage the site</p>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Email Address</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="admin@example.com"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Enter your password"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-700"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-linear-to-r from-orange-500 to-amber-500 py-3 font-bold text-white hover:from-orange-600 hover:to-amber-600 disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Enter Admin Panel'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Need the main site login?{' '}
          <Link href="/login" className="font-semibold text-orange-600 hover:underline">
            Go to user login
          </Link>
        </p>
      </div>
    </div>
  )
}


