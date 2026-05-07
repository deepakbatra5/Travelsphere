'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { markAuthSessionActive } from '@/lib/browser-session'

function getSafeCallbackPath() {
  if (typeof window === 'undefined') return '/agent'

  const rawCallback = new URLSearchParams(window.location.search).get('callbackUrl')
  if (!rawCallback) return '/agent'

  try {
    const callbackUrl = new URL(rawCallback, window.location.origin)

    if (callbackUrl.origin !== window.location.origin) return '/agent'

    const pathWithQuery = `${callbackUrl.pathname}${callbackUrl.search}${callbackUrl.hash}`
    if (!pathWithQuery.startsWith('/agent') || pathWithQuery === '/agent-login') {
      return '/agent'
    }

    return pathWithQuery
  } catch {
    return rawCallback.startsWith('/agent') && rawCallback !== '/agent-login' ? rawCallback : '/agent'
  }
}

export default function AgentLoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const safeCallbackPath = getSafeCallbackPath()

    const result = await signIn('credentials', {
      email: form.email,
      password: form.password,
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
          <Link href="/" className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">
            Travel Sphere Agent
          </Link>
          <h1 className="mt-4 text-2xl font-extrabold text-slate-900">Agent Login</h1>
          <p className="mt-1 text-sm text-slate-600">Sign in to access your agent dashboard and assignments</p>
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
              placeholder="agent@example.com"
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
            className="w-full rounded-2xl bg-gradient-to-r from-cyan-600 to-teal-500 py-3 font-bold text-white hover:from-cyan-700 hover:to-teal-600 disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Enter Agent Portal'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          New agent?{' '}
          <Link href="/agent-register" className="font-semibold text-cyan-700 hover:underline">
            Register here
          </Link>
        </p>
        <p className="mt-3 text-center text-sm text-slate-600">
          Not an agent?{' '}
          <Link href="/login" className="font-semibold text-orange-600 hover:underline">
            User login
          </Link>
        </p>
      </div>
    </div>
  )
}