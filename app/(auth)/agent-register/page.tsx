'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const languageOptions = ['Hindi', 'English', 'Punjabi', 'Bengali', 'Tamil', 'Telugu', 'Gujarati', 'Marathi']

export default function AgentRegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    city: '',
    state: '',
    experience: '',
    bio: '',
    languages: [] as string[],
  })

  const update = (field: string, value: string | string[]) => setForm((prev) => ({ ...prev, [field]: value }))

  const toggleLang = (lang: string) => {
    setForm((prev) => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter((item) => item !== lang)
        : [...prev.languages, lang],
    }))
  }

  const validateStep1 = () => {
    if (!form.name || !form.email || !form.password) {
      setError('Please fill all account fields.')
      return false
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return false
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return false
    }
    setError('')
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.phone || !form.city || !form.state || !form.experience) {
      setError('Please fill all agent details.')
      return
    }
    if (form.languages.length === 0) {
      setError('Please select at least one language.')
      return
    }

    setLoading(true)
    setError('')

    const res = await fetch('/api/agents/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json().catch(() => null)
    setLoading(false)

    if (!res.ok) {
      setError(data?.error || 'Registration failed.')
      return
    }

    router.push(`/verify-otp?email=${encodeURIComponent(data.email || form.email)}`)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="surface-card relative w-full max-w-lg rounded-3xl p-8">
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex rounded-full border border-orange-200 bg-orange-50 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-orange-700">
            Travel Sphere
          </Link>
          <h1 className="mt-4 text-2xl font-extrabold text-slate-900">Become a Travel Agent</h1>
          <p className="mt-1 text-sm text-slate-600">Join our network and receive 80% of each assigned tour amount.</p>
        </div>

        <div className="mb-6 flex items-center">
          {['Account Details', 'Agent Profile'].map((label, index) => (
            <div key={label} className="flex flex-1 items-center">
              <div className="flex flex-col items-center">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                  step > index + 1 ? 'bg-emerald-500 text-white' : step === index + 1 ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                  {index + 1}
                </div>
                <span className={`mt-1 text-xs ${step === index + 1 ? 'font-semibold text-orange-600' : 'text-slate-400'}`}>{label}</span>
              </div>
              {index < 1 && <div className={`mx-2 mb-4 h-0.5 flex-1 ${step > 1 ? 'bg-emerald-400' : 'bg-slate-200'}`} />}
            </div>
          ))}
        </div>

        {error && <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}

        {step === 1 && (
          <div className="space-y-4">
            {[
              { label: 'Full Name', field: 'name', type: 'text', placeholder: 'Your full name' },
              { label: 'Email Address', field: 'email', type: 'email', placeholder: 'you@example.com' },
              { label: 'Password', field: 'password', type: 'password', placeholder: 'Minimum 6 characters' },
              { label: 'Confirm Password', field: 'confirmPassword', type: 'password', placeholder: 'Re-enter password' },
            ].map((item) => (
              <div key={item.field}>
                <label className="mb-1 block text-sm font-semibold text-slate-700">{item.label}</label>
                <input
                  type={item.type}
                  value={form[item.field as keyof typeof form] as string}
                  onChange={(e) => update(item.field, e.target.value)}
                  placeholder={item.placeholder}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                />
              </div>
            ))}
            <button onClick={() => validateStep1() && setStep(2)} className="w-full rounded-2xl bg-orange-500 py-3 font-bold text-white hover:bg-orange-600">
              Continue to Agent Profile
            </button>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Phone</label>
                <input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+91 98765 43210" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Experience</label>
                <input type="number" min="0" value={form.experience} onChange={(e) => update('experience', e.target.value)} placeholder="3" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">City</label>
                <input value={form.city} onChange={(e) => update('city', e.target.value)} placeholder="Amritsar" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">State</label>
                <input value={form.state} onChange={(e) => update('state', e.target.value)} placeholder="Punjab" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Languages Spoken</label>
              <div className="flex flex-wrap gap-2">
                {languageOptions.map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => toggleLang(lang)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                      form.languages.includes(lang) ? 'border-orange-500 bg-orange-500 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-orange-400'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-700">About You</label>
              <textarea rows={3} value={form.bio} onChange={(e) => update('bio', e.target.value)} placeholder="Your experience, specializations, and areas you know well..." className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs leading-relaxed text-emerald-700">
              Travel Sphere keeps 20% from every completed tour and the assigned agent receives the remaining 80%. Example: customer pays Rs 20,000, Travel Sphere keeps Rs 4,000 and agent payout is Rs 16,000.
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="flex-1 rounded-2xl border border-slate-300 py-3 font-semibold text-slate-600 hover:bg-slate-50">Back</button>
              <button type="submit" disabled={loading} className="flex-1 rounded-2xl bg-orange-500 py-3 font-bold text-white hover:bg-orange-600 disabled:opacity-60">
                {loading ? 'Sending OTP...' : 'Submit Application'}
              </button>
            </div>
          </form>
        )}

        <p className="mt-5 text-center text-sm text-slate-600">
          Already an agent? <Link href="/login" className="font-semibold text-orange-600 hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  )
}
