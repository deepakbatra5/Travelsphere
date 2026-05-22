'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', subject: '', message: ''
  })
  const [attachments, setAttachments] = useState<string[]>([])
  const [uploadingImage, setUploadingImage] = useState(false)
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size
    const maxSizeInBytes = 5 * 1024 * 1024
    if (file.size > maxSizeInBytes) {
      setError('Image exceeds 5MB limit. Please choose a smaller image.')
      e.target.value = ''
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, etc).')
      e.target.value = ''
      return
    }

    setUploadingImage(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Upload failed. Please try again.')
        e.target.value = ''
        return
      }

      if (data.url) {
        setAttachments((prev) => [...prev, data.url])
      } else {
        setError(data.error || 'Upload failed.')
      }
    } catch (err) {
      console.error('Upload error:', err)
      setError('Network error. Please check your connection and try again.')
    } finally {
      setUploadingImage(false)
      e.target.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const detailedMessage = `Contact Reason: ${form.subject}

${form.message}`

      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          subject: 'Help & Support Request',
          message: detailedMessage,
        }),
      })

      if (!res.ok) throw new Error('Failed to send message')

      setSent(true)
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
      setAttachments([])
    } catch {
      setError('Failed to send message. Please try again.')
    }

    setLoading(false)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* Page Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">Contact Us</h1>
        <p className="text-gray-500 mt-2">
          We are here to help. Reach out and we will get back to you within 24 hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Contact Info Cards */}
        <div className="space-y-4">

          {[
            {
              icon: '📞',
              title: 'Call Us',
              lines: ['+91 8603606089', 'Mon–Sat: 9AM to 7PM'],
              action: { label: 'Call Now', href: 'tel:+918603606089' },
              bg: 'bg-orange-50',
              border: 'border-orange-100',
            },
            {
              icon: '💬',
              title: 'WhatsApp',
              lines: ['+91 8603606089', 'Usually replies in minutes'],
              action: { label: 'Chat on WhatsApp', href: 'https://wa.me/918603606089' },
              bg: 'bg-green-50',
              border: 'border-green-100',
            },
            {
              icon: '📧',
              title: 'Email Us',
              lines: ['deepankumar81c401a1e8@gmail.com', 'We reply within 24 hours'],
              action: { label: 'Send Email', href: 'mailto:deepankumar81c401a1e8@gmail.com' },
              bg: 'bg-orange-50',
              border: 'border-orange-100',
            },
            {
              icon: '📍',
              title: 'Visit Us',
              lines: ['Amritsar, Punjab, India', 'Mon–Sat: 9AM to 7PM'],
              action: null,
              bg: 'bg-purple-50',
              border: 'border-purple-100',
            },
          ].map((card) => (
            <div key={card.title} className={`${card.bg} border ${card.border} rounded-2xl p-5`}>
              <div className="flex items-start gap-3">
                <span className="text-2xl">{card.icon}</span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{card.title}</p>
                  {card.lines.map((line) => (
                    <p key={line} className="text-gray-600 text-sm mt-0.5">{line}</p>
                  ))}
                  {card.action && (
                    <a
                      href={card.action.href}
                      target={card.action.href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-xs font-medium text-orange-600 hover:underline"
                    >
                      {card.action.label} →
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          {sent ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center h-full flex flex-col items-center justify-center">
              <span className="text-5xl mb-4">✅</span>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Message Sent!</h2>
              <p className="text-gray-500 text-sm max-w-sm">
                Thank you for reaching out. Our team will contact you within 24 hours.
                For urgent queries please WhatsApp us at +91 8603606089.
              </p>
              <button
                onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); setAttachments([]) }}
                className="mt-6 bg-orange-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-orange-600 transition"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      placeholder="Your full name"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                      placeholder="+91 98765 43210"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="you@example.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                  <select
                    required
                    value={form.subject}
                    onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                  >
                    <option value="">Select a subject</option>
                    <option>Tour Package Enquiry</option>
                    <option>Booking Assistance</option>
                    <option>Cancellation or Refund</option>
                    <option>Custom Trip Planning</option>
                    <option>Agent or Partnership Enquiry</option>
                    <option>Complaint or Feedback</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    placeholder="Tell us how we can help you. Include your travel dates, destination preferences, group size, and budget for a faster response..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Attach Screenshots or Images (Optional)</label>
                  <label className="block cursor-pointer">
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-orange-400 transition">
                      <p className="text-gray-400 text-sm">{uploadingImage ? 'Uploading...' : '📸 Click to upload an image'}</p>
                      <p className="text-gray-300 text-xs mt-1">JPG, PNG up to 5MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>

                  {error && (
                    <div className="mt-2 text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                      {error}
                    </div>
                  )}

                  {attachments.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-medium text-gray-600 mb-2">Attached Images ({attachments.length}):</p>
                      <div className="grid grid-cols-3 gap-2">
                        {attachments.map((url, i) => (
                          <div key={i} className="relative group">
                            <Image
                              src={url}
                              alt={`Attachment ${i + 1}`}
                              width={80}
                              height={80}
                              className="w-full h-20 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => setAttachments(attachments.filter((_, idx) => idx !== i))}
                              className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                  <a
                    href="https://wa.me/918603606089"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition text-center"
                  >
                    💬 Quick WhatsApp
                  </a>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* FAQ Quick Links */}
      <div className="mt-12 bg-gray-50 rounded-2xl p-6">
        <h3 className="font-bold text-gray-800 mb-4">Commonly Asked Questions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { q: 'How do I cancel my booking?', href: '/policies/cancellation-refund' },
            { q: 'What documents do I need for a tour?', href: '/policies/booking-terms' },
            { q: 'How are refunds processed?', href: '/policies/cancellation-refund' },
            { q: 'How do I become a travel agent?', href: '/agent-register' },
            { q: 'Are international tours available?', href: '/packages' },
            { q: 'Can I customize a tour package?', href: '/packages' },
          ].map((item) => (
            <Link
              key={item.q}
              href={item.href}
              className="bg-white rounded-xl px-4 py-3 text-sm text-gray-600 hover:text-orange-500 hover:border-orange-200 border border-gray-100 transition flex items-center gap-2"
            >
              <span className="text-orange-400">›</span>
              {item.q}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}


