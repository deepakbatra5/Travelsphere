'use client'

import { Suspense } from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

function ForgotPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const portal = searchParams.get('portal') === 'agent' ? 'agent' : 'customer'
  const [step, setStep] = useState<'request' | 'reset'>('request')
  const [email, setEmail] = useState(searchParams.get('email') || '')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const loginHref = portal === 'agent' ? '/agent-login' : '/login'
  const accent = portal === 'agent' ? 'cyan' : 'orange'

  const requestOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    const data = await res.json().catch(() => null)
    setLoading(false)

    if (!res.ok) {
      setError(data?.error || 'Unable to send reset OTP.')
      return
    }

    setMessage(data?.message || 'Password reset OTP sent.')
    setStep('reset')
  }

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, password }),
    })
    const data = await res.json().catch(() => null)
    setLoading(false)

    if (!res.ok) {
      setError(data?.error || 'Unable to reset password.')
      return
    }

    setMessage(data?.message || 'Password reset successfully.')
    setTimeout(() => router.push(loginHref), 1200)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-cyan-300/30 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-orange-300/30 blur-3xl" />
      <div className="surface-card relative w-full max-w-md rounded-3xl p-8">
        <div className="mb-8 text-center">
          <Link href="/" className={`inline-flex rounded-full border px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] ${accent === 'cyan' ? 'border-cyan-200 bg-cyan-50 text-cyan-700' : 'border-orange-200 bg-orange-50 text-orange-700'}`}>
            Travel Sphere
          </Link>
          <h1 className="mt-4 text-2xl font-extrabold text-slate-900">Reset Password</h1>
          <p className="mt-1 text-sm text-slate-600">Get an OTP and create a new password.</p>
        </div>

        {error && <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}
        {message && <div className="mb-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">{message}</div>}

        {step === 'request' ? (
          <form onSubmit={requestOtp} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
              />
            </div>
            <button type="submit" disabled={loading} className={`w-full rounded-2xl py-3 font-bold text-white disabled:opacity-60 ${accent === 'cyan' ? 'bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-700 hover:to-teal-600' : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600'}`}>
              {loading ? 'Sending OTP...' : 'Send Reset OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={resetPassword} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">6-digit OTP</label>
              <input
                type="text"
                inputMode="numeric"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-700"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
              />
            </div>
            <button type="submit" disabled={loading} className={`w-full rounded-2xl py-3 font-bold text-white disabled:opacity-60 ${accent === 'cyan' ? 'bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-700 hover:to-teal-600' : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600'}`}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-slate-600">
          Remember your password?{' '}
          <Link href={loginHref} className={`font-semibold hover:underline ${accent === 'cyan' ? 'text-cyan-700' : 'text-orange-600'}`}>
            Back to login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" /></div>}>
      <ForgotPasswordContent />
    </Suspense>
  )
}

