'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { markAuthSessionActive } from '@/lib/browser-session'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import ThemeToggle from '@/components/theme/ThemeToggle'

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
    <div className="bg-[#0b0813] text-white min-h-screen flex flex-col selection:bg-orange-500 selection:text-white font-sans relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[32px_32px]"></div>
        <div className="absolute top-0 right-0 -mt-20 -mr-20 h-150 w-150 rounded-full bg-amber-500/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-150 w-150 rounded-full bg-rose-500/20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 h-100 w-100 rounded-full bg-violet-600/10 blur-3xl"></div>
      </div>
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0b0813]/80 backdrop-blur-md border-b border-violet-950/20 px-6 py-4 shadow-sm relative">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo-transparent.png" alt="Travel Sphere Logo" className="h-9 w-9 object-contain" />
            <span className="text-xl font-black tracking-tight text-white">
              TRAVEL SPHERE <span className="text-orange-500 font-bold text-xs uppercase tracking-widest ml-1 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">ADMIN</span>
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Section */}
      <section className="relative px-6 py-20 lg:py-28 flex-1 flex items-center z-10">
        <div className="relative mx-auto max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Info */}
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-rose-400 ring-1 ring-rose-500/30">
              🛡️ Core Administration Portal
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-green-400 via-emerald-500 to-teal-400 bg-clip-text text-transparent">
                Fueling Adventures, <br />
                Managing Dreams
              </span>
            </h1>
            <p className="text-slate-350 text-base sm:text-lg leading-relaxed max-w-2xl">
              Behind every seamless booking, verified itinerary, and unforgettable journey is the dedication of our administration. Connect hearts, create lifelong memories, and empower our agents to orchestrate the future of travel.
            </p>
            
            <div className="border-l-4 border-rose-500 pl-4 py-1 italic text-slate-400 text-sm">
              "Connecting Hearts, Creating Memories, Empowering Dreams." — Travel Sphere Slogan
            </div>

            {/* Quick Stats banner */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 max-w-lg">
              <div>
                <p className="text-2xl font-black text-white">99.9%</p>
                <p className="text-xs text-slate-400 font-semibold uppercase mt-0.5">System Uptime</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">15K+</p>
                <p className="text-xs text-slate-400 font-semibold uppercase mt-0.5">Happy Travelers</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">24/7</p>
                <p className="text-xs text-slate-400 font-semibold uppercase mt-0.5">Operations Support</p>
              </div>
            </div>
          </div>

          {/* Hero Right: Login Card */}
          <div className="lg:col-span-5 relative">
            <div className="bg-white text-slate-800 rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 max-w-md mx-auto">

              <div className="text-center mb-6">
                <h3 className="text-lg font-black text-slate-900">Welcome Back</h3>
                <p className="text-xs text-slate-500 mt-1">Sign in to your admin console to manage platform operations.</p>
              </div>

              {error && (
                <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="admin@travelsphere.com"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
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

                <div className="flex items-center justify-between gap-3 text-xs pt-1">
                  <label className="flex items-center gap-2 font-semibold text-slate-600 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-350 accent-orange-500"
                    />
                    Remember me
                  </label>
                  <Link 
                    href={`/forgot-password?portal=admin&email=${encodeURIComponent(form.email)}`} 
                    className="font-bold text-orange-600 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-orange-500 py-3 font-bold text-white hover:bg-orange-600 disabled:opacity-60 transition-all hover:scale-102"
                >
                  {loading ? 'Signing in...' : 'Sign In to Admin Portal'}
                </button>
              </form>

              <div className="mt-6 border-t border-slate-100 pt-4 text-center">
                <Link href="/login" className="text-xs font-bold text-orange-600 hover:underline">
                  Go to customer login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


