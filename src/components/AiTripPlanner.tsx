'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  XMarkIcon,
  PaperAirplaneIcon,
  SparklesIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  MapPinIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  CurrencyRupeeIcon,
  StarIcon,
} from '@heroicons/react/24/outline'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface TripContact {
  name: string
  phone: string
  email: string
}

// ─── Quick suggestion chips ────────────────────────────────────────────────────

const QUICK_SUGGESTIONS = [
  { label: '🏔️ Mountains', msg: 'I want to plan a mountain trip in India' },
  { label: '🌊 Beach Holiday', msg: 'Plan a beach vacation for me' },
  { label: '🕌 Pilgrimage Tour', msg: 'I want to go on a pilgrimage tour' },
  { label: '🌍 International Trip', msg: 'Plan an international trip from India' },
  { label: '👨‍👩‍👧 Family Trip', msg: 'Plan a family trip with kids under Rs 50,000' },
  { label: '🎒 Solo Adventure', msg: 'I want to travel solo on an adventure' },
]

// ─── Format AI text to HTML ───────────────────────────────────────────────────

function formatText(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-orange-500 font-semibold underline hover:text-orange-600 transition-colors">$1 ↗</a>'
    )
    .replace(
      /(^|[\s>])(https?:\/\/[^\s<]+)/g,
      '$1<a href="$2" target="_blank" rel="noopener noreferrer" class="text-orange-500 underline break-all hover:text-orange-600">$2</a>'
    )
    .replace(/^### (.*)/gm, '<div class="font-bold text-slate-800 mt-4 mb-2 text-base">$1</div>')
    .replace(/^## (.*)/gm, '<div class="font-bold text-slate-800 mt-4 mb-2 text-lg">$1</div>')
    .replace(/^# (.*)/gm, '<div class="font-black text-slate-900 mt-4 mb-2 text-xl">$1</div>')
    .replace(
      /^- (.*)/gm,
      '<div class="flex gap-2 my-1"><span class="text-orange-500 flex-shrink-0 font-bold">›</span><span>$1</span></div>'
    )
    .replace(
      /^(\d+)\. (.*)/gm,
      '<div class="flex gap-2 my-1"><span class="text-orange-500 font-bold flex-shrink-0 w-5">$1.</span><span>$2</span></div>'
    )
    .replace(/\n\n/g, '<br /><br />')
    .replace(/\n/g, '<br />')
}

// ─── Message Bubble ───────────────────────────────────────────────────────────

function MessageBubble({ msg, isStreaming }: { msg: Message; isStreaming?: boolean }) {
  const isUser = msg.role === 'user'

  if (isUser) {
    return (
      <div className="flex gap-3 justify-end">
        <div className="max-w-[78%] rounded-2xl rounded-tr-sm bg-gradient-to-br from-orange-500 to-amber-500 px-4 py-3 text-sm text-white shadow-md">
          {msg.content}
        </div>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600 text-xs font-black mt-1">
          U
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-600 to-amber-500 shadow-sm mt-1 overflow-hidden p-0.5">
        <img src="/logo-transparent.png" alt="AI" className="w-full h-full object-contain" />
      </div>
      <div className="max-w-[82%]">
        <div
          className="rounded-2xl rounded-tl-sm bg-white border border-slate-100 px-4 py-3 text-sm leading-relaxed text-slate-700 shadow-sm"
          dangerouslySetInnerHTML={{ __html: formatText(msg.content) }}
        />
        {isStreaming && (
          <div className="flex gap-1 mt-2 ml-2">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Typing Indicator ─────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-600 to-amber-500 shadow-sm overflow-hidden p-0.5">
        <img src="/logo-transparent.png" alt="AI" className="w-full h-full object-contain" />
      </div>
      <div className="rounded-2xl rounded-tl-sm bg-white border border-slate-100 px-4 py-3 shadow-sm">
        <div className="flex gap-1 items-center">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2 w-2 rounded-full bg-orange-300 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Contact Collection Form ───────────────────────────────────────────────────

function ContactForm({
  onSubmit,
  isSubmitting,
}: {
  onSubmit: (contact: TripContact) => void
  isSubmitting: boolean
}) {
  const [form, setForm] = useState<TripContact>({ name: '', phone: '', email: '' })

  return (
    <div className="mx-4 my-3 rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-4">
      <p className="mb-3 text-sm font-bold text-slate-800">
        ✨ Almost done! Share your details so our expert can reach you with your custom plan:
      </p>
      <div className="space-y-2.5">
        <input
          type="text"
          placeholder="Your name *"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-orange-400 focus:outline-none"
        />
        <input
          type="tel"
          placeholder="Phone number * (+91...)"
          value={form.phone}
          onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-orange-400 focus:outline-none"
        />
        <input
          type="email"
          placeholder="Email address (optional)"
          value={form.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-orange-400 focus:outline-none"
        />
        <button
          onClick={() => form.name && form.phone && onSubmit(form)}
          disabled={!form.name || !form.phone || isSubmitting}
          className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-2.5 text-sm font-bold text-white shadow-md transition hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <ArrowPathIcon className="h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <PaperAirplaneIcon className="h-4 w-4" />
              Send My Trip Plan to Travel Sphere
            </>
          )}
        </button>
      </div>
    </div>
  )
}

// ─── Progress Steps (visible on desktop sidebar) ──────────────────────────────

const PLAN_STEPS = [
  { icon: MapPinIcon, label: 'Destination' },
  { icon: CalendarDaysIcon, label: 'Dates & Duration' },
  { icon: UserGroupIcon, label: 'Group Size' },
  { icon: CurrencyRupeeIcon, label: 'Budget' },
  { icon: StarIcon, label: 'Interests' },
  { icon: SparklesIcon, label: 'Your Custom Plan' },
]

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

interface AiTripPlannerProps {
  onClose: () => void
}

export default function AiTripPlanner({ onClose }: AiTripPlannerProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [tripSummary, setTripSummary] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [activeStep, setActiveStep] = useState(0)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto-start with welcome message
  useEffect(() => {
    const welcome: Message = {
      role: 'assistant',
      content:
        'Namaste! 🙏 Welcome to the **Travel Sphere AI Trip Planner**!\n\nI\'m Sphere, your personal AI travel consultant. I\'m here to help you plan your **perfect customized trip** — whether it\'s a mountain escape, beach holiday, international adventure, or a peaceful pilgrimage.\n\nLet\'s design your dream trip together! **Where in the world would you like to go?** 🌍✈️\n\n*(You can also tell me your travel style — adventure, relaxation, culture, family fun, etc.)*',
    }
    setMessages([welcome])
    setTimeout(() => inputRef.current?.focus(), 300)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading, showContactForm])

  // Detect when AI asks for contact info
  const detectContactRequest = useCallback((text: string) => {
    const lower = text.toLowerCase()
    return (
      (lower.includes('name') && lower.includes('phone')) ||
      lower.includes('contact detail') ||
      lower.includes('your details') ||
      lower.includes('get back to you') ||
      lower.includes('follow up') ||
      lower.includes('share your') ||
      lower.includes('please provide your name')
    )
  }, [])

  // Extract trip summary from conversation
  const buildTripSummary = useCallback((msgs: Message[]) => {
    const conversation = msgs
      .map((m) => `${m.role === 'user' ? 'Customer' : 'AI Planner'}: ${m.content}`)
      .join('\n\n')
    return `AI Trip Planner Conversation:\n\n${conversation}`
  }, [])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return
    const userMsg: Message = { role: 'user', content: text }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    // Update step progress heuristically
    setActiveStep((prev) => Math.min(prev + 1, PLAN_STEPS.length - 1))

    try {
      const res = await fetch('/api/ai-trip-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        const errMsg = data.error || 'Something went wrong. Please try again.'
        setMessages((prev) => [...prev, { role: 'assistant', content: errMsg }])
        setLoading(false)
        return
      }

      const reader = res.body?.getReader()
      if (!reader) throw new Error('No reader')

      const decoder = new TextDecoder()
      let reply = ''
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }])

      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        reply += decoder.decode(value, { stream: true })
        setMessages((prev) => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: 'assistant', content: reply }
          return updated
        })
      }

      // Check if AI is asking for contact details
      if (detectContactRequest(reply)) {
        setTripSummary(buildTripSummary([...newMessages, { role: 'assistant', content: reply }]))
        setTimeout(() => setShowContactForm(true), 600)
        setActiveStep(PLAN_STEPS.length - 1)
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '😔 Connection issue. Please try again or WhatsApp us at +91 8603606089.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitTrip = async (contact: TripContact) => {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/ai-trip-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit_trip',
          tripData: {
            name: contact.name,
            phone: contact.phone,
            email: contact.email,
            tripSummary: `Customer: ${contact.name} | Phone: ${contact.phone} | Email: ${contact.email || 'N/A'}\n\n${tripSummary}`,
          },
          messages: [],
        }),
      })

      if (res.ok) {
        setShowContactForm(false)
        setSubmitted(true)
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `🎉 **Perfect, ${contact.name}!**\n\nYour custom trip plan has been sent to our Travel Sphere team! 🚀\n\n**What happens next:**\n- Our travel expert will review your plan\n- You'll receive a call at **${contact.phone}** within **24 hours**\n- We'll share a detailed itinerary and pricing tailored just for you\n\nMeanwhile, feel free to browse our packages at [travelsphere.sbs/tours](https://travelsphere.sbs/tours) ✈️\n\nThank you for choosing Travel Sphere! 🙏`,
          },
        ])
      } else {
        throw new Error('Submit failed')
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '😔 Could not submit right now. Please WhatsApp us at +91 8603606089 or try again.',
        },
      ])
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const resetChat = () => {
    setMessages([])
    setInput('')
    setShowContactForm(false)
    setSubmitted(false)
    setActiveStep(0)
    setTripSummary('')
    // Re-trigger welcome message
    setTimeout(() => {
      const welcome: Message = {
        role: 'assistant',
        content:
          'Let\'s start fresh! 🌟 **Where would you like to travel?** Tell me your dream destination and I\'ll help you plan the perfect trip! 🌍',
      }
      setMessages([welcome])
    }, 100)
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-stretch justify-center bg-slate-900/70 backdrop-blur-md"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Main Panel */}
      <div
        ref={containerRef}
        className="relative flex w-full max-w-6xl flex-col overflow-hidden bg-white shadow-2xl md:m-4 md:rounded-3xl"
        style={{ maxHeight: '100dvh' }}
      >
        {/* ── Header ──────────────────────────────────────────────────────────── */}
        <div className="flex shrink-0 items-center gap-3 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 px-4 py-3 md:px-6 md:py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 p-1.5">
            <img src="/logo-transparent.png" alt="Sphere" className="h-full w-full object-contain" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-black text-white text-base md:text-lg leading-tight">
              Sphere — AI Trip Planner
            </p>
            <p className="text-xs text-orange-100 flex items-center gap-1.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-300 animate-pulse" />
              Online · Your personal travel consultant
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={resetChat}
              className="hidden items-center gap-1.5 rounded-xl border border-white/30 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/20 transition sm:flex"
            >
              <ArrowPathIcon className="h-3.5 w-3.5" />
              New Plan
            </button>
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/30 text-white hover:bg-white/20 transition"
              aria-label="Close trip planner"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* ── Left Sidebar (Desktop Only) ─────────────────────────────────── */}
          <div className="hidden w-64 shrink-0 flex-col border-r border-slate-100 bg-slate-50/80 lg:flex">
            {/* Steps */}
            <div className="p-5">
              <p className="mb-4 text-xs font-black uppercase tracking-widest text-slate-400">Planning Progress</p>
              <div className="space-y-1">
                {PLAN_STEPS.map((step, idx) => {
                  const Icon = step.icon
                  const isActive = idx === activeStep
                  const isDone = idx < activeStep
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition ${
                        isActive
                          ? 'bg-orange-50 text-orange-600'
                          : isDone
                          ? 'text-emerald-600'
                          : 'text-slate-400'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircleIcon className="h-5 w-5 shrink-0 text-emerald-500" />
                      ) : (
                        <Icon
                          className={`h-5 w-5 shrink-0 ${
                            isActive ? 'text-orange-500' : 'text-slate-300'
                          }`}
                        />
                      )}
                      <span
                        className={`text-sm font-semibold ${
                          isActive ? 'text-orange-700' : isDone ? 'text-emerald-700' : 'text-slate-400'
                        }`}
                      >
                        {step.label}
                      </span>
                      {isActive && (
                        <span className="ml-auto h-2 w-2 rounded-full bg-orange-400 animate-pulse" />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Info */}
            <div className="mt-auto border-t border-slate-200 p-5 space-y-3">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Need help?</p>
              <a
                href="https://wa.me/918603606089"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100 transition border border-emerald-200"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                WhatsApp Us
              </a>
              <p className="text-[10px] text-slate-400 text-center">Mon–Sat, 9AM–7PM IST</p>
            </div>
          </div>

          {/* ── Chat Area ─────────────────────────────────────────────────────── */}
          <div className="flex flex-1 flex-col min-w-0 min-h-0">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 md:px-6">
              {messages.map((msg, i) => {
                const isLast = i === messages.length - 1
                const isStreaming = isLast && loading && msg.role === 'assistant'
                return <MessageBubble key={i} msg={msg} isStreaming={isStreaming} />
              })}

              {loading && messages[messages.length - 1]?.role !== 'assistant' && <TypingIndicator />}

              {/* Contact form */}
              {showContactForm && !submitted && (
                <ContactForm onSubmit={handleSubmitTrip} isSubmitting={isSubmitting} />
              )}

              {/* Submitted success banner */}
              {submitted && (
                <div className="mx-auto flex max-w-sm flex-col items-center rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center">
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                    <CheckCircleIcon className="h-7 w-7 text-emerald-600" />
                  </div>
                  <p className="font-bold text-emerald-800">Trip Plan Submitted!</p>
                  <p className="mt-1 text-xs text-emerald-700">
                    Our team will call you within 24 hours.
                  </p>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick suggestions (only at start) */}
            {messages.length <= 2 && (
              <div className="shrink-0 border-t border-slate-100 px-4 pt-3 pb-2 md:px-6">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Quick Start
                </p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_SUGGESTIONS.map((s) => (
                    <button
                      key={s.label}
                      onClick={() => sendMessage(s.msg)}
                      className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700 transition hover:bg-orange-500 hover:text-white hover:border-orange-500"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input area */}
            <div className="shrink-0 border-t border-slate-100 bg-white/90 px-4 py-3 md:px-6">
              <div className="flex items-end gap-3">
                <div className="relative flex-1">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value)
                      e.target.style.height = 'auto'
                      e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
                    }}
                    onKeyDown={handleKey}
                    placeholder="Tell me about your dream trip..."
                    rows={1}
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-800 placeholder-slate-400 focus:border-orange-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-100 transition max-h-32 overflow-y-auto"
                    disabled={loading}
                  />
                </div>
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || loading}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-md transition hover:from-orange-600 hover:to-amber-600 hover:shadow-orange-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Send"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-2 text-center text-[10px] text-slate-400">
                Powered by AI · Travel Sphere Trip Planner ·{' '}
                <a href="https://travelsphere.sbs" className="hover:text-orange-400 transition">
                  travelsphere.sbs
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
