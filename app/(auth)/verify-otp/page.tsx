'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function VerifyOtpPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [nextPath, setNextPath] = useState('/login')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setEmail(params.get('email') || '')
    const next = params.get('next')
    if (next?.startsWith('/')) {
      setNextPath(next)
    }
  }, [])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    })

    const data = await res.json().catch(() => null)
    setLoading(false)

    if (!res.ok) {
      setError(data?.error || 'OTP verification failed.')
      return
    }

    setMessage(data.message || 'Email verified successfully.')
    setTimeout(() => router.push(`${nextPath}${nextPath.includes('?') ? '&' : '?'}verified=true`), 900)
  }

  const handleResend = async () => {
    setResending(true)
    setError('')
    setMessage('')

    const res = await fetch('/api/auth/resend-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    const data = await res.json().catch(() => null)
    setResending(false)

    if (!res.ok) {
      setError(data?.error || 'Could not resend OTP.')
      return
    }

    setOtp('')
    setMessage(data.message || 'New OTP sent.')
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
          <h1 className="mt-4 text-2xl font-extrabold text-slate-900">Verify Email</h1>
          <p className="mt-1 text-sm text-slate-600">Enter the 6-digit OTP sent to your email</p>
        </div>

        {message && <div className="mb-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">{message}</div>}
        {error && <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">OTP</label>
            <input
              type="text"
              inputMode="numeric"
              required
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter 6-digit OTP"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-lg font-bold tracking-[0.4em] text-slate-700"
            />
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="w-full rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 py-3 font-bold text-white hover:from-orange-600 hover:to-amber-600 disabled:opacity-60"
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <button
          type="button"
          onClick={handleResend}
          disabled={resending || !email}
          className="mt-3 w-full rounded-2xl border border-slate-200 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          {resending ? 'Sending...' : 'Resend OTP'}
        </button>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already verified?{' '}
          <Link href="/login" className="font-semibold text-orange-600 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  )
}


