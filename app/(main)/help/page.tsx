'use client'

import { useState } from 'react'
import { 
  PaperAirplaneIcon, 
  QuestionMarkCircleIcon, 
  ChatBubbleLeftRightIcon, 
  PhoneIcon, 
  EnvelopeIcon 
} from '@heroicons/react/24/outline'

export default function HelpPage() {
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
          subject: 'Help & Support Request',
          message: formData.message,
        })
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
    <div className="mx-auto max-w-7xl px-4 py-12 md:py-20">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
        
        {/* Left Side - Information */}
        <div className="flex flex-col justify-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-bold uppercase tracking-widest text-blue-600 w-max">
            <QuestionMarkCircleIcon className="h-4 w-4" />
            24/7 Support
          </span>
          <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
            How can we <span className="text-blue-500">help you?</span>
          </h1>
          <p className="mt-6 text-lg text-slate-600 max-w-xl">
            Have a doubt about a package? Need help with your booking? Our dedicated support team is always ready to assist you.
          </p>
          
          <div className="mt-12 space-y-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-600">
                <ChatBubbleLeftRightIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">WhatsApp Support</h3>
                <p className="mt-1 text-sm text-slate-500">Fastest way to reach us. Text us anytime.</p>
                <p className="mt-1 font-semibold text-slate-700">+91 98765 43210</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <PhoneIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Call Us</h3>
                <p className="mt-1 text-sm text-slate-500">Available Mon-Sat from 9 AM to 8 PM.</p>
                <p className="mt-1 font-semibold text-slate-700">+91 1800 123 4567</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <EnvelopeIcon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Email Support</h3>
                <p className="mt-1 text-sm text-slate-500">For detailed queries and booking modifications.</p>
                <p className="mt-1 font-semibold text-slate-700">support@travelsphere.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/50 md:p-10 border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Send us a message</h2>
          
          {success ? (
            <div className="rounded-2xl bg-green-50 p-8 text-center border border-green-100">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
                <PaperAirplaneIcon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-green-900">Message Sent!</h3>
              <p className="mt-2 text-green-700">Our support team will contact you shortly to resolve your queries.</p>
              <button 
                onClick={() => setSuccess(false)}
                className="mt-6 rounded-xl bg-green-600 px-6 py-2 text-white font-medium hover:bg-green-700 transition"
              >
                Ask Another Question
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600 border border-red-100">{error}</div>}
              
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                  <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                  <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition" placeholder="+91 9876543210" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition" placeholder="john@example.com" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Your Question / Doubt <span className="text-red-500">*</span></label>
                <textarea required rows={5} name="message" value={formData.message} onChange={handleChange} className="w-full rounded-xl border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition" placeholder="How can we help you today?"></textarea>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-4 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-70"
              >
                {loading ? 'Sending...' : 'Submit Question'}
                {!loading && <PaperAirplaneIcon className="h-4 w-4" />}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
