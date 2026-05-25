'use client'

import { useEffect, useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { markAuthSessionActive } from '@/lib/browser-session'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

const REMEMBER_EMAIL_KEY = 'travel-sphere-customer-email'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  useEffect(() => {
    const rememberedEmail = window.localStorage.getItem(REMEMBER_EMAIL_KEY)
    if (rememberedEmail) {
      setForm((prev) => ({ ...prev, email: rememberedEmail }))
      setRememberMe(true)
    }
  }, [])

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
      portal: 'customer',
      callbackUrl: safeCallbackPath,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      if (result.error === 'EMAIL_NOT_VERIFIED') {
        setError('Please verify your email before login.')
      } else {
        setError('Invalid email or password. Please try again.')
      }
    } else if (!result?.ok) {
      setError('Unable to login right now. Please try again.')
    } else {
      // Use sanitized callback path directly to avoid callback URL loop issues in production.
      if (rememberMe) {
        window.localStorage.setItem(REMEMBER_EMAIL_KEY, form.email.trim())
      } else {
        window.localStorage.removeItem(REMEMBER_EMAIL_KEY)
      }
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
          <Link href="/" className="inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-orange-700">
            <img src="/logo-transparent.png" alt="Logo" className="h-4 w-4 object-contain" />
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

          <div className="flex items-center justify-between gap-3 text-sm">
            <label className="flex items-center gap-2 font-semibold text-slate-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 accent-orange-500"
              />
              Remember me
            </label>
            <Link href={`/forgot-password?portal=customer&email=${encodeURIComponent(form.email)}`} className="font-semibold text-orange-600 hover:underline">
              Forgot password?
            </Link>
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


