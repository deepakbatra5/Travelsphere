'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { markAuthSessionActive } from '@/lib/browser-session'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const getSafeCallbackPath = () => {
    const rawCallback = new URLSearchParams(window.location.search).get('callbackUrl')

    if (!rawCallback) return '/'

    try {
      const callbackUrl = new URL(rawCallback, window.location.origin)

      if (callbackUrl.origin !== window.location.origin) {
        return '/'
      }

      const pathWithQuery = `${callbackUrl.pathname}${callbackUrl.search}${callbackUrl.hash}`
      return pathWithQuery || '/'
    } catch {
      return rawCallback.startsWith('/') ? rawCallback : '/'
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const safeCallbackPath = getSafeCallbackPath()

    const result = await signIn('credentials', {
      email: form.email,
      password: form.password,
      callbackUrl: safeCallbackPath,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError('Invalid email or password. Please try again.')
    } else if (!result?.ok) {
      setError('Unable to login right now. Please try again.')
    } else {
      // Use sanitized callback path directly to avoid callback URL loop issues in production.
      markAuthSessionActive()
      window.location.assign(safeCallbackPath)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-cyan-300/30 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-orange-300/30 blur-3xl" />
      <div className="surface-card relative w-full max-w-md rounded-3xl p-8">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex rounded-full border border-orange-200 bg-orange-50 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-orange-700">
            Travel Sphere
          </Link>
          <h1 className="mt-4 text-2xl font-extrabold text-slate-900">Welcome Back</h1>
          <p className="mt-1 text-sm text-slate-600">Login to continue your travel planning</p>
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
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Enter your password"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 py-3 font-bold text-white hover:from-orange-600 hover:to-amber-600 disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Do not have an account?{' '}
          <Link href="/register" className="font-semibold text-orange-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  )
}
