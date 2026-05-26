'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  PaperAirplaneIcon,
  SparklesIcon,
  MapPinIcon,
  CurrencyRupeeIcon,
  CalendarDaysIcon,
  BoltIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
} from '@heroicons/react/24/outline'

export default function CustomisedTourPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    destination: '',
    city: '',
    travellers: '',
    message: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const detailedMessage = `Destination: ${formData.destination}
Your City: ${formData.city}
No. of Travellers: ${formData.travellers}

Special Requests:
${formData.message}`

      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          subject: 'Customised Tour Request',
          message: detailedMessage,
        }),
      })

      if (!res.ok) throw new Error('Failed to submit request')

      setSuccess(true)
      setFormData({ name: '', phone: '', email: '', destination: '', city: '', travellers: '', message: '' })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:py-16">

        {/* ══════════════════════════════════════════════════════════════════
            AI TRIP PLANNER BANNER — above Tailor-Made Holidays
        ══════════════════════════════════════════════════════════════════ */}
        <div className="relative mb-12 overflow-hidden rounded-3xl bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 p-0.5 shadow-2xl shadow-orange-200/50">
          <div className="relative overflow-hidden rounded-[22px] bg-gradient-to-br from-orange-600 via-orange-500 to-amber-500 px-6 py-8 md:px-10 md:py-10">
            {/* Decorative blobs */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-amber-300/20 blur-3xl" />
            <div className="pointer-events-none absolute right-1/3 bottom-0 h-32 w-32 rounded-full bg-orange-300/20 blur-2xl" />

            <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
              {/* Left Text */}
              <div className="max-w-xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
                  <SparklesIcon className="h-3.5 w-3.5" />
                  AI-Powered Trip Planning
                </div>
                <h2 className="text-2xl font-black text-white md:text-3xl lg:text-4xl leading-tight">
                  Confused where to plan your trip?
                </h2>
                <p className="mt-3 text-orange-100 md:text-lg leading-relaxed">
                  Let our{' '}
                  <span className="font-bold text-white">AI Trip Planner</span>{' '}
                  design your perfect customised holiday — just have a conversation and we&apos;ll build your dream itinerary instantly.
                </p>

                {/* Feature pills */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {[
                    { icon: '🌍', text: 'Any destination worldwide' },
                    { icon: '📅', text: 'Day-by-day itinerary' },
                    { icon: '💰', text: 'Budget planning in ₹' },
                    { icon: '📞', text: 'Expert follows up with you' },
                  ].map((pill) => (
                    <span
                      key={pill.text}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm"
                    >
                      <span>{pill.icon}</span>
                      {pill.text}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <div className="flex flex-col items-start gap-3 lg:items-center lg:shrink-0">
                <Link
                  href="/ai-planner"
                  className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl bg-white px-7 py-4 text-base font-black text-orange-600 shadow-xl shadow-black/20 transition-all hover:scale-105 hover:shadow-2xl active:scale-100"
                >
                  <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-100 transition-colors group-hover:bg-orange-200">
                    <ChatBubbleLeftRightIcon className="h-5 w-5 text-orange-600" />
                    <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-green-500">
                      <span className="h-2 w-2 animate-ping rounded-full bg-green-400 opacity-75" />
                    </span>
                  </span>
                  <span>Plan My Trip with AI</span>
                  <span className="text-orange-400 transition-transform group-hover:translate-x-1">→</span>
                </Link>
                <p className="text-xs text-orange-100 text-center">
                  Free · Takes 2 minutes · Expert calls you back
                </p>
              </div>
            </div>

            {/* Animated stars */}
            <div className="pointer-events-none absolute bottom-4 right-6 hidden md:flex gap-1">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className="h-4 w-4 text-white/40"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════
            ORIGINAL SECTION — Tailor-Made Holidays
        ══════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">

          {/* Left Side - Information */}
          <div className="flex flex-col justify-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-sm font-bold uppercase tracking-widest text-orange-600 w-max">
              <SparklesIcon className="h-4 w-4" />
              Tailor-Made Holidays
            </span>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
              Design Your <span className="text-orange-500">Dream Trip</span>
            </h1>
            <p className="mt-6 text-lg text-slate-600 max-w-xl">
              Can&apos;t find exactly what you&apos;re looking for? Let our travel experts craft a
              personalized itinerary just for you. Tell us where you want to go, and we&apos;ll take
              care of the rest.
            </p>

            {/* How it works - Or use AI */}
            <div className="mt-8 rounded-2xl border border-orange-100 bg-orange-50 p-5">
              <p className="text-sm font-bold text-orange-800 mb-3 flex items-center gap-2">
                <BoltIcon className="h-4 w-4" />
                Prefer a faster way?
              </p>
              <p className="text-sm text-orange-700 mb-3">
                Chat with our AI Trip Planner and get a complete custom itinerary in minutes.
                Our expert will then call you to finalize and book.
              </p>
              <Link
                href="/ai-planner"
                className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-700"
              >
                <ChatBubbleLeftRightIcon className="h-4 w-4" />
                Open AI Trip Planner
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <MapPinIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Any Destination</h3>
                  <p className="mt-1 text-sm text-slate-500">Choose from anywhere in India or abroad.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <CalendarDaysIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Flexible Dates</h3>
                  <p className="mt-1 text-sm text-slate-500">Travel whenever it suits your schedule.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <CurrencyRupeeIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Your Budget</h3>
                  <p className="mt-1 text-sm text-slate-500">We optimize the best experience for your budget.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                  <SparklesIcon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Unique Experiences</h3>
                  <p className="mt-1 text-sm text-slate-500">Personalized activities and stays.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/50 md:p-10 border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Tell us your requirements</h2>
            <p className="text-sm text-slate-500 mb-6">
              Prefer to fill a form? Submit your details and our expert will call you back.
            </p>

            {success ? (
              <div className="rounded-2xl bg-green-50 p-8 text-center border border-green-100">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
                  <PaperAirplaneIcon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-green-900">Request Sent Successfully!</h3>
                <p className="mt-2 text-green-700">
                  Our travel experts will get back to you within 24 hours with a customized itinerary.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-6 rounded-xl bg-green-600 px-6 py-2 text-white font-medium hover:bg-green-700 transition"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-orange-500 focus:bg-white focus:ring-1 focus:ring-orange-500 transition"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-orange-500 focus:bg-white focus:ring-1 focus:ring-orange-500 transition"
                      placeholder="+91 9876543210"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-orange-500 focus:bg-white focus:ring-1 focus:ring-orange-500 transition"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">
                      Destination <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      name="destination"
                      value={formData.destination}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-orange-500 focus:bg-white focus:ring-1 focus:ring-orange-500 transition"
                      placeholder="Where do you want to go?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Your City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-orange-500 focus:bg-white focus:ring-1 focus:ring-orange-500 transition"
                      placeholder="e.g. Mumbai"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">No. of Travellers</label>
                  <input
                    type="number"
                    name="travellers"
                    min="1"
                    value={formData.travellers}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-orange-500 focus:bg-white focus:ring-1 focus:ring-orange-500 transition"
                    placeholder="e.g. 2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Special Requirements / Travel Style
                  </label>
                  <textarea
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-orange-500 focus:bg-white focus:ring-1 focus:ring-orange-500 transition"
                    placeholder="Tell us about the kind of hotels you prefer, activities you like, or any specific places you want to visit..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-4 text-sm font-bold text-white transition hover:bg-orange-700 disabled:opacity-70"
                >
                  {loading ? 'Sending Request...' : 'Get My Custom Itinerary'}
                  {!loading && <PaperAirplaneIcon className="h-4 w-4" />}
                </button>
              </form>
            )}
          </div>
        </div>
    </div>
  )
}
