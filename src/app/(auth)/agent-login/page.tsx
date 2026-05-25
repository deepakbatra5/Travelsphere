'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { markAuthSessionActive } from '@/lib/browser-session'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'
import ThemeToggle from '@/components/theme/ThemeToggle'

const REMEMBER_EMAIL_KEY = 'travel-sphere-agent-email'
const languageOptions = ['Hindi', 'English', 'Punjabi', 'Bengali', 'Tamil', 'Telugu', 'Gujarati', 'Marathi']

function getSafeCallbackPath() {
  if (typeof window === 'undefined') return '/agent'

  const isAgentSubdomain = window.location.hostname.startsWith('agent.')
  const defaultPath = isAgentSubdomain ? '/dashboard' : '/agent'

  const rawCallback = new URLSearchParams(window.location.search).get('callbackUrl')
  if (!rawCallback) return defaultPath

  try {
    const callbackUrl = new URL(rawCallback, window.location.origin)
    if (callbackUrl.origin !== window.location.origin) return defaultPath

    const pathWithQuery = `${callbackUrl.pathname}${callbackUrl.search}${callbackUrl.hash}`
    const isSafeAgentPath = pathWithQuery.startsWith('/agent') && pathWithQuery !== '/agent-login'
    const isSafeSubdomainPath = isAgentSubdomain && pathWithQuery.startsWith('/dashboard')

    if (!isSafeAgentPath && !isSafeSubdomainPath) {
      return defaultPath
    }
    return pathWithQuery
  } catch {
    if (rawCallback.startsWith('/agent') && rawCallback !== '/agent-login') return rawCallback
    if (isAgentSubdomain && rawCallback.startsWith('/dashboard')) return rawCallback
    return defaultPath
  }
}

export default function AgentLoginPage() {
  const router = useRouter()
  
  // Tab control: 'login' or 'register'
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')
  
  // Login states
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  // Registration states
  const [regStep, setRegStep] = useState(1)
  const [regForm, setRegForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    companyName: '',
    aadharCard: '',
    panCard: '',
    pinCode: '',
    gstNumber: '',
    city: '',
    state: '',
    experience: '',
    bio: '',
    languages: [] as string[],
  })
  const [regError, setRegError] = useState('')
  const [regLoading, setRegLoading] = useState(false)
  const [showRegPassword, setShowRegPassword] = useState(false)
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false)

  // Sync tab with query parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const tabParam = params.get('tab')
    if (tabParam === 'register') {
      setActiveTab('register')
    } else {
      setActiveTab('login')
    }
  }, [])

  // Sync remembered email
  useEffect(() => {
    const rememberedEmail = window.localStorage.getItem(REMEMBER_EMAIL_KEY)
    if (rememberedEmail) {
      setLoginForm((prev) => ({ ...prev, email: rememberedEmail }))
      setRememberMe(true)
    }
  }, [])

  // Login handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError('')

    const safeCallbackPath = getSafeCallbackPath()

    const result = await signIn('credentials', {
      email: loginForm.email,
      password: loginForm.password,
      portal: 'agent',
      redirect: false,
      callbackUrl: safeCallbackPath,
    })

    if (result?.error || !result?.ok) {
      setLoginLoading(false)
      setLoginError('Invalid email or password. Please try again.')
      return
    }

    if (rememberMe) {
      window.localStorage.setItem(REMEMBER_EMAIL_KEY, loginForm.email.trim())
    } else {
      window.localStorage.removeItem(REMEMBER_EMAIL_KEY)
    }
    markAuthSessionActive()
    window.location.assign(safeCallbackPath)
  }

  // Register validation & flow
  const validateRegStep1 = () => {
    if (!regForm.name || !regForm.email || !regForm.password || !regForm.phone || !regForm.companyName) {
      setRegError('Please fill all basic details to continue.')
      return false
    }
    if (regForm.password !== regForm.confirmPassword) {
      setRegError('Passwords do not match.')
      return false
    }
    if (regForm.password.length < 6) {
      setRegError('Password must be at least 6 characters.')
      return false
    }
    setRegError('')
    return true
  }

  const toggleLanguage = (lang: string) => {
    setRegForm((prev) => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter((item) => item !== lang)
        : [...prev.languages, lang],
    }))
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!regForm.aadharCard || !regForm.panCard || !regForm.pinCode || !regForm.city || !regForm.state || !regForm.experience) {
      setRegError('Please fill all business profile details.')
      return
    }
    if (regForm.languages.length === 0) {
      setRegError('Please select at least one language.')
      return
    }

    setRegLoading(true)
    setRegError('')

    const res = await fetch('/api/agents/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(regForm),
    })
    const data = await res.json().catch(() => null)
    setRegLoading(false)

    if (!res.ok) {
      setRegError(data?.error || 'Registration failed.')
      return
    }

    router.push(`/verify-otp?email=${encodeURIComponent(data.email || regForm.email)}&next=${encodeURIComponent('/agent-login')}`)
  }

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen flex flex-col selection:bg-orange-500 selection:text-white font-sans">
      
      {/* Dynamic Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-6 py-4 shadow-xs">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo-transparent.png" alt="Travel Sphere Logo" className="h-9 w-9 object-contain" />
            <span className="text-xl font-black tracking-tight text-slate-900">
              TRAVEL SPHERE <span className="text-orange-500 font-bold text-xs uppercase tracking-widest ml-1 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">AGENT</span>
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Agent Helpline</span>
              <a href="tel:+918603606089" className="text-sm font-black text-slate-800 dark:text-slate-200 hover:text-orange-500 transition-colors">
                +91 8603606089
              </a>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-slate-950 px-6 py-20 lg:py-28 text-white rounded-b-[3.5rem] shadow-2xl">
        <div className="absolute inset-0 opacity-15">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]"></div>
          <div className="absolute top-0 right-0 -mt-20 -mr-20 h-[500px] w-[500px] rounded-full bg-orange-500/20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-3xl"></div>
        </div>

        <div className="relative mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Info */}
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-orange-400 ring-1 ring-orange-500/30">
              ⭐ India's Leading Agent Travel Network
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Grow Your Business as a <br />
              <span className="bg-gradient-to-r from-orange-400 via-rose-500 to-cyan-400 bg-clip-text text-transparent">
                Travel Sphere Agent
              </span>
            </h1>
            <p className="text-slate-350 text-base sm:text-lg leading-relaxed max-w-2xl">
              Maximize your profits by partnering with us. Get immediate access to premium itineraries, verified bookings, custom travel packages, and keep <strong className="text-white">80% of the commission</strong> from every completed booking.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a 
                href="#form-section" 
                onClick={() => {
                  setActiveTab('register')
                  setRegStep(1)
                }}
                className="rounded-2xl bg-orange-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all hover:scale-105 active:scale-95"
              >
                Register as Agent
              </a>
              <a 
                href="#advantages-section" 
                className="rounded-2xl border border-slate-700 bg-slate-900/50 backdrop-blur-md px-6 py-3.5 text-sm font-bold text-slate-355 hover:bg-slate-800 hover:text-white transition-all hover:scale-105 active:scale-95"
              >
                Explore Advantages
              </a>
            </div>
            {/* Quick Stats banner */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 max-w-lg">
              <div>
                <p className="text-2xl font-black text-white">80%</p>
                <p className="text-xs text-slate-400 font-semibold uppercase mt-0.5">Agent Payout</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">24/7</p>
                <p className="text-xs text-slate-400 font-semibold uppercase mt-0.5">Agent Support</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">100%</p>
                <p className="text-xs text-slate-400 font-semibold uppercase mt-0.5">Verified Leads</p>
              </div>
            </div>
          </div>

          {/* Hero Right: Integrated Form Section */}
          <div id="form-section" className="lg:col-span-5 relative">
            <div className="bg-white text-slate-800 rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 max-w-md mx-auto">
              
              {/* Tab Selector Buttons */}
              <div className="flex bg-slate-100 rounded-2xl p-1 mb-6">
                <button
                  onClick={() => {
                    setActiveTab('login')
                    setLoginError('')
                  }}
                  className={`flex-1 text-center py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'login' 
                      ? 'bg-white text-slate-900 shadow-xs' 
                      : 'text-slate-500 hover:text-slate-950'
                  }`}
                >
                  Agent Sign In
                </button>
                <button
                  onClick={() => {
                    setActiveTab('register')
                    setRegError('')
                  }}
                  className={`flex-1 text-center py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'register' 
                      ? 'bg-white text-slate-900 shadow-xs' 
                      : 'text-slate-500 hover:text-slate-950'
                  }`}
                >
                  Register Agent Account
                </button>
              </div>

              {/* Login Tab View */}
              {activeTab === 'login' && (
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-black text-slate-900">Welcome Back</h3>
                    <p className="text-xs text-slate-500 mt-1">Sign in to your agent console to access assigned leads.</p>
                  </div>

                  {loginError && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-700">
                      {loginError}
                    </div>
                  )}

                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
                      <input
                        type="email"
                        required
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        placeholder="agent@company.com"
                        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
                      <div className="relative">
                        <input
                          type={showLoginPassword ? 'text' : 'password'}
                          required
                          value={loginForm.password}
                          onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                          placeholder="••••••••"
                          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 pr-10 text-sm text-slate-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showLoginPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 text-xs pt-1">
                      <label className="flex items-center gap-2 font-semibold text-slate-600 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="h-4 w-4 rounded border-slate-350 accent-orange-500"
                        />
                        Remember me
                      </label>
                      <Link 
                        href={`/forgot-password?portal=agent&email=${encodeURIComponent(loginForm.email)}`} 
                        className="font-bold text-orange-600 hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>

                    <button
                      type="submit"
                      disabled={loginLoading}
                      className="w-full rounded-2xl bg-orange-500 py-3 font-bold text-white hover:bg-orange-600 disabled:opacity-60 transition-all hover:scale-102"
                    >
                      {loginLoading ? 'Signing in...' : 'Sign In to Agent Portal'}
                    </button>
                  </form>
                </div>
              )}

              {/* Registration Tab View */}
              {activeTab === 'register' && (
                <div className="space-y-4">
                  
                  {/* Step Indicators */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        regStep === 1 ? 'bg-orange-500 text-white' : 'bg-emerald-500 text-white'
                      }`}>
                        {regStep === 1 ? '1' : '✓'}
                      </div>
                      <span className="text-xs font-bold text-slate-700">Company Details</span>
                    </div>
                    <div className="h-px bg-slate-200 flex-1 mx-3" />
                    <div className="flex items-center gap-2">
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        regStep === 2 ? 'bg-orange-500 text-white' : 'bg-slate-200 text-slate-400'
                      }`}>
                        2
                      </div>
                      <span className="text-xs font-bold text-slate-600">Verification</span>
                    </div>
                  </div>

                  {regError && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-700">
                      {regError}
                    </div>
                  )}

                  {/* Step 1 Form */}
                  {regStep === 1 && (
                    <div className="space-y-3.5">
                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase">Full Name</label>
                        <input
                          type="text"
                          value={regForm.name}
                          onChange={(e) => setRegForm({...regForm, name: e.target.value})}
                          placeholder="Enter Full Name"
                          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase">Email Address</label>
                        <input
                          type="email"
                          value={regForm.email}
                          onChange={(e) => setRegForm({...regForm, email: e.target.value})}
                          placeholder="Enter Email"
                          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase">Company Name</label>
                        <input
                          type="text"
                          value={regForm.companyName}
                          onChange={(e) => setRegForm({...regForm, companyName: e.target.value})}
                          placeholder="Enter Company Name"
                          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase">Contact Number</label>
                        <input
                          type="tel"
                          value={regForm.phone}
                          onChange={(e) => setRegForm({...regForm, phone: e.target.value})}
                          placeholder="Contact Number"
                          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase">Password</label>
                          <div className="relative">
                            <input
                              type={showRegPassword ? 'text' : 'password'}
                              value={regForm.password}
                              onChange={(e) => setRegForm({...regForm, password: e.target.value})}
                              placeholder="Password"
                              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm pr-9"
                            />
                            <button
                              type="button"
                              onClick={() => setShowRegPassword(!showRegPassword)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
                            >
                              {showRegPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase">Confirm</label>
                          <div className="relative">
                            <input
                              type={showRegConfirmPassword ? 'text' : 'password'}
                              value={regForm.confirmPassword}
                              onChange={(e) => setRegForm({...regForm, confirmPassword: e.target.value})}
                              placeholder="Confirm"
                              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm pr-9"
                            />
                            <button
                              type="button"
                              onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
                            >
                              {showRegConfirmPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => validateRegStep1() && setRegStep(2)}
                        className="w-full rounded-2xl bg-slate-900 py-3 font-bold text-white hover:bg-slate-800 transition-all mt-2"
                      >
                        Continue to Profile Verification
                      </button>
                    </div>
                  )}

                  {/* Step 2 Form */}
                  {regStep === 2 && (
                    <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase">Aadhar Card</label>
                          <input
                            type="text"
                            value={regForm.aadharCard}
                            onChange={(e) => setRegForm({...regForm, aadharCard: e.target.value})}
                            placeholder="Aadhar Number"
                            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm"
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase">PAN Card</label>
                          <input
                            type="text"
                            value={regForm.panCard}
                            onChange={(e) => setRegForm({...regForm, panCard: e.target.value})}
                            placeholder="PAN Number"
                            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase">PIN Code</label>
                          <input
                            type="text"
                            value={regForm.pinCode}
                            onChange={(e) => setRegForm({...regForm, pinCode: e.target.value})}
                            placeholder="PIN Code"
                            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm"
                          />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase">GST Number</label>
                          <input
                            type="text"
                            value={regForm.gstNumber}
                            onChange={(e) => setRegForm({...regForm, gstNumber: e.target.value})}
                            placeholder="GST (Optional)"
                            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-1">
                          <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase">Exp (Yrs)</label>
                          <input
                            type="number"
                            min="0"
                            value={regForm.experience}
                            onChange={(e) => setRegForm({...regForm, experience: e.target.value})}
                            placeholder="3"
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
                          />
                        </div>
                        <div className="col-span-1">
                          <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase">City</label>
                          <input
                            type="text"
                            value={regForm.city}
                            onChange={(e) => setRegForm({...regForm, city: e.target.value})}
                            placeholder="City"
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
                          />
                        </div>
                        <div className="col-span-1">
                          <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase">State</label>
                          <input
                            type="text"
                            value={regForm.state}
                            onChange={(e) => setRegForm({...regForm, state: e.target.value})}
                            placeholder="State"
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase">Languages Spoken</label>
                        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-slate-50 border border-slate-100 rounded-xl">
                          {languageOptions.map((lang) => (
                            <button
                              key={lang}
                              type="button"
                              onClick={() => toggleLanguage(lang)}
                              className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${
                                regForm.languages.includes(lang) 
                                  ? 'border-orange-500 bg-orange-500 text-white' 
                                  : 'border-slate-200 bg-white text-slate-650 hover:border-orange-300'
                              }`}
                            >
                              {lang}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-slate-700 uppercase">Bio / Experience Summary</label>
                        <textarea
                          rows={2}
                          value={regForm.bio}
                          onChange={(e) => setRegForm({...regForm, bio: e.target.value})}
                          placeholder="Tell us briefly about your destination specialties..."
                          className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm"
                        />
                      </div>

                      <div className="rounded-xl border border-orange-100 bg-orange-50/50 p-3 text-[10px] leading-relaxed text-orange-850">
                        🛡️ <strong>Note:</strong> Travel Sphere retains 20% on all completed bookings. The remaining 80% is dispatched immediately to your registered agent wallet.
                      </div>

                      <div className="flex gap-3 pt-1">
                        <button 
                          type="button" 
                          onClick={() => setRegStep(1)} 
                          className="flex-1 rounded-xl border border-slate-305 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                        >
                          Back
                        </button>
                        <button 
                          type="submit" 
                          disabled={regLoading}
                          className="flex-1 rounded-xl bg-orange-500 py-2.5 text-xs font-bold text-white hover:bg-orange-600 disabled:opacity-60"
                        >
                          {regLoading ? 'Registering...' : 'Register Account'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Watch Step-by-Step Agent Registration Section */}
      <section className="mx-auto max-w-7xl px-6 py-16 w-full">
        <div className="bg-white rounded-3xl p-8 shadow-xs border border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-4">
            <span className="text-xs uppercase tracking-wider text-orange-500 font-bold bg-orange-50 px-3 py-1 rounded-full border border-orange-100">Video Guide</span>
            <h2 className="text-2xl font-black text-slate-900 md:text-3xl">How to Register an Agent Account</h2>
            <p className="text-slate-650 text-sm leading-relaxed">
              Watch this short step-by-step video guide to learn how to create your travel agent profile, link your verification credentials, and configure your destination preferences so you can start receiving tour assignments within minutes.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </span>
              <span className="text-xs font-bold text-slate-800">Watch the 2-minute setup guide</span>
            </div>
          </div>
          <div className="md:col-span-5">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center shadow-lg border border-slate-800 group cursor-pointer">
              {/* Mock Video Placeholder */}
              <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800')" }}></div>
              <div className="relative z-10 w-14 h-14 rounded-full bg-white text-slate-950 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                <svg className="h-6 w-6 fill-current text-orange-500 ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="bg-slate-100 px-6 py-20 rounded-t-[3.5rem] w-full">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-500">Key Benefits</span>
            <h2 className="text-3xl font-black text-slate-900 md:text-4xl">Why Choose Travel Sphere Agent Portal?</h2>
            <p className="text-slate-650 text-sm leading-relaxed">
              Gain a massive competitive edge by leveraging our resources. We supply agents with real inquiries, verified payments, and tools to run operations flawlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Fast Growing Agent Network',
                desc: 'Become part of one of the fastest growing travel networks in India with agents spanning 20+ states.',
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                ),
                color: 'bg-blue-50 text-blue-600 border-blue-100'
              },
              {
                title: '24/7 Support Helpline',
                desc: 'Enjoy a dedicated support team available around the clock to resolve package issues and passenger queries.',
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ),
                color: 'bg-emerald-50 text-emerald-600 border-emerald-100'
              },
              {
                title: 'Multiple Income Streams',
                desc: 'Generate revenue through localized packages, customized excursions, and corporate travel bookings.',
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                color: 'bg-purple-50 text-purple-600 border-purple-100'
              },
              {
                title: 'Best Commissions (80% Payout)',
                desc: 'Retain 80% of all assigned tour package values. Unmatched commission rates in the travel agent industry.',
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                ),
                color: 'bg-orange-50 text-orange-600 border-orange-100'
              },
              {
                title: 'Exclusive Agent Portal',
                desc: 'Access a modern dashboard where you can check payouts, log assignments, and toggle preferred destinations.',
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
                color: 'bg-cyan-50 text-cyan-600 border-cyan-100'
              },
              {
                title: 'Latest Deals & Offers',
                desc: 'Deliver seasonal deals, flight rates, and discounted hotels straight to your clients using our agent portal catalog.',
                icon: (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
                color: 'bg-pink-50 text-pink-600 border-pink-100'
              }
            ].map((item, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border mb-6 ${item.color}`}>
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Travel Sphere Agent Advantages Section */}
      <section id="advantages-section" className="mx-auto max-w-7xl px-6 py-20 w-full">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-500">Travel Sphere Advantages</span>
          <h2 className="text-3xl font-black text-slate-900 md:text-4xl">Comprehensive Advantages of Our Platform</h2>
          <p className="text-slate-650 text-sm">
            Leverage our cutting-edge technology and extensive inventory to satisfy every customer demand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: 'Automated Payments',
              desc: 'Upload funds hassle-free to your account through RTGS/NEFT/IMPS channels. Direct agent commission payouts are computed and released instantly.',
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              )
            },
            {
              title: 'Post Booking Service Automation',
              desc: 'No more calls for voucher updates. Manage all your booking cancellations, passenger data corrections, and modifications online.',
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )
            },
            {
              title: 'Mobile Friendly Console',
              desc: 'Conduct your business on the go. Access assigned bookings, communicate with customers, and check payouts directly from your smartphone.',
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              )
            },
            {
              title: 'Largest Network of Global Airfares',
              desc: 'Compare and book flight deals from 40+ countries. Get access to offline rates and custom groups with special agent pricing.',
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              )
            },
            {
              title: 'API/XML Integration',
              desc: 'Deploy state-of-the-art tech. Search and book from 300+ airlines and over 300,000+ worldwide hotels via a single high-speed API.',
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              )
            },
            {
              title: '50+ Global Hotel Suppliers',
              desc: 'Find the absolute lowest hotel rates for your customers. Instantly compare bookings across top global consolidators in real-time.',
              icon: (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              )
            }
          ].map((adv, idx) => (
            <div 
              key={idx}
              className="flex gap-4 p-6 rounded-3xl bg-white border border-slate-100 shadow-xs hover:border-orange-200 transition-all duration-300"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-orange-50 text-orange-500 border border-orange-100 flex items-center justify-center">
                {adv.icon}
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-slate-900">{adv.title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">{adv.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Noida Branch Contact Section */}
      <section className="bg-slate-900 text-white rounded-t-[3.5rem] px-6 py-20 w-full mt-auto relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl"></div>

        <div className="relative mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left: Noida Branch */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-widest text-orange-400 font-bold bg-orange-500/10 px-3.5 py-1.5 rounded-full border border-orange-500/20">
              Corporate Office
            </span>
            <h2 className="text-3xl font-black md:text-4xl">Contact Travel Sphere</h2>
            <p className="text-slate-350 text-sm leading-relaxed max-w-md">
              India's trusted travel company. Curated tours for families, couples, groups and solo travelers since 2013.
            </p>
            
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-5 h-5 text-orange-400 mt-1">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">Address</h4>
                  <p className="text-slate-400 text-xs leading-relaxed mt-1">
                    Amritsar, Punjab, India
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-5 h-5 text-orange-400">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">Agent Helpline</h4>
                  <a href="tel:+918603606089" className="text-orange-400 text-xs font-black hover:underline mt-1 block">
                    +91 8603606089
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-5 h-5 text-orange-400">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">Email Address</h4>
                  <a href="mailto:deepankumar81c401a1e8@gmail.com" className="text-orange-400 text-xs font-black hover:underline mt-1 block">
                    deepankumar81c401a1e8@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-5 h-5 text-orange-400">
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <div>
                  <h4 className="text-sm font-bold text-white">Business Hours</h4>
                  <p className="text-slate-400 text-xs mt-1">
                    Mon–Sat: 9AM to 7PM
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="https://wa.me/918603606089"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-all hover:scale-105 active:scale-95"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.333 4.993L2 22l5.233-1.371a9.936 9.936 0 004.777 1.224h.005c5.505 0 9.986-4.479 9.988-9.985a9.95 9.95 0 00-2.922-7.062A9.92 9.92 0 0012.012 2zm5.72 14.126c-.244.688-1.218 1.25-1.688 1.3-1.077.112-2.484-.338-5.077-1.412-3.32-1.373-5.419-4.733-5.586-4.954-.166-.222-1.332-1.772-1.332-3.38 0-1.609.83-2.4 1.135-2.718.305-.318.664-.397.886-.397.222 0 .443.002.637.01.2.01.47.007.728.63.266.643.91 2.223.987 2.378.077.155.129.336.027.539-.1.203-.152.33-.3.504-.148.174-.313.39-.446.522-.148.148-.303.309-.13.606.173.297.77 1.272 1.65 2.057.94.84 1.733 1.102 2.036 1.228.303.125.48.105.659-.102.179-.207.77-.899.975-1.206.205-.308.41-.256.692-.152.282.105 1.794.846 2.1.999.305.153.509.229.583.359.074.13.074.75-.17 1.438z" />
                  </svg>
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>

          {/* Right: CTA/Support Form Info */}
          <div className="lg:col-span-6 space-y-6 bg-slate-950/60 border border-slate-800 rounded-3xl p-8 text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 text-lg">
              ✈️
            </div>
            <h3 className="text-xl font-black">Ready to Grow Your Income?</h3>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Create a free agent profile and upload your documents to be verified. Once approved by our administrators, you will start receiving verified tour assignments straight to your inbox.
            </p>
            <a 
              href="#form-section"
              onClick={() => {
                setActiveTab('register')
                setRegStep(1)
              }}
              className="rounded-xl bg-orange-500 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-orange-600 transition-all hover:scale-105 active:scale-95"
            >
              Sign Up Now
            </a>
          </div>
        </div>

        {/* Footer info */}
        <div className="mx-auto max-w-7xl border-t border-slate-800/80 mt-16 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo-transparent.png" alt="Logo" className="h-6 w-6 object-contain" />
            <span className="text-xs font-bold text-slate-400">
              Travel Sphere Agent Portal
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Copyright © 2026 Travel Sphere. All Rights Reserved.
          </p>
        </div>
      </section>
    </div>
  )
}
