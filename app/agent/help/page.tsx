'use client'

import { useState } from 'react'
import {
  PaperAirplaneIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline'

export default function AgentHelpPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          subject: 'Agent Help & Support Request',
          message: formData.message,
        }),
      })

      if (!res.ok) throw new Error('Failed to submit request')

      setSuccess(true)
      setFormData({ name: '', phone: '', email: '', message: '' })
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Page Header */}
      <div className="mb-10">
        <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-cyan-100 px-3 py-1 text-sm font-bold uppercase tracking-widest text-cyan-700">
          <QuestionMarkCircleIcon className="h-4 w-4" />
          Agent Support
        </span>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
          Help &amp; <span className="text-cyan-600">Support</span>
        </h1>
        <p className="mt-3 text-slate-500 max-w-xl">
          Need help with your assignments, earnings, or anything else? Reach out to the Travel Sphere team directly — we're here for you.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">

        {/* Left — Contact Info */}
        <div className="space-y-6">

          {/* WhatsApp */}
          <a
            href="https://wa.me/918603606089"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-4 rounded-2xl border border-green-100 bg-green-50 p-6 shadow-sm transition hover:shadow-md hover:border-green-300"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600">
              <ChatBubbleLeftRightIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">WhatsApp Us</h3>
              <p className="mt-1 text-sm text-slate-500">Fastest way to reach us — message us anytime.</p>
              <p className="mt-2 font-semibold text-green-700">+91 8603606089</p>
            </div>
          </a>

          {/* Call */}
          <a
            href="tel:+918603606089"
            className="flex items-start gap-4 rounded-2xl border border-orange-100 bg-orange-50 p-6 shadow-sm transition hover:shadow-md hover:border-orange-300"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <PhoneIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Call Us</h3>
              <p className="mt-1 text-sm text-slate-500">Available Mon–Sat, 9 AM to 8 PM.</p>
              <p className="mt-2 font-semibold text-orange-700">+91 8603606089</p>
            </div>
          </a>

          {/* Email */}
          <a
            href="mailto:deepankumar81c401a1e8@gmail.com"
            className="flex items-start gap-4 rounded-2xl border border-indigo-100 bg-indigo-50 p-6 shadow-sm transition hover:shadow-md hover:border-indigo-300"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <EnvelopeIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Email Support</h3>
              <p className="mt-1 text-sm text-slate-500">For detailed queries and payment issues.</p>
              <p className="mt-2 break-all font-semibold text-indigo-700">deepankumar81c401a1e8@gmail.com</p>
            </div>
          </a>
        </div>

        {/* Right — Contact Form */}
        <div className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/50 md:p-10 border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a message</h2>

          {success ? (
            <div className="rounded-2xl bg-green-50 p-8 text-center border border-green-100">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
                <PaperAirplaneIcon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-green-900">Message Sent!</h3>
              <p className="mt-2 text-green-700">Our team will get back to you shortly.</p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-6 rounded-xl bg-green-600 px-6 py-2 text-white font-medium hover:bg-green-700 transition"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600 border border-red-100">{error}</div>}

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                  <input
                    required type="text" name="name" value={formData.name} onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-cyan-500 focus:bg-white focus:ring-1 focus:ring-cyan-500 transition"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                  <input
                    required type="tel" name="phone" value={formData.phone} onChange={handleChange}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-cyan-500 focus:bg-white focus:ring-1 focus:ring-cyan-500 transition"
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                <input
                  required type="email" name="email" value={formData.email} onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-cyan-500 focus:bg-white focus:ring-1 focus:ring-cyan-500 transition"
                  placeholder="agent@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Your Query <span className="text-red-500">*</span></label>
                <textarea
                  required rows={5} name="message" value={formData.message} onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-cyan-500 focus:bg-white focus:ring-1 focus:ring-cyan-500 transition"
                  placeholder="Describe your issue or question in detail..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-700 px-4 py-4 text-sm font-bold text-white transition hover:bg-cyan-800 disabled:opacity-70"
              >
                {loading ? 'Sending...' : 'Submit Query'}
                {!loading && <PaperAirplaneIcon className="h-4 w-4" />}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
