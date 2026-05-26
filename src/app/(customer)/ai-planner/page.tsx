'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  PaperAirplaneIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  role: 'user' | 'assistant'
  content: string
  id: string
}

interface TripContact {
  name: string
  phone: string
  email: string
}

// ─── Markdown renderer — ChatGPT-quality ──────────────────────────────────────

function renderMarkdown(raw: string): string {
  if (!raw) return ''

  let html = raw

  // Escape HTML first (except we'll re-add our tags)
  // Tables
  html = html.replace(
    /^\|(.+)\|\n\|[-| :]+\|\n((?:\|.+\|\n?)*)/gm,
    (_, header: string, rows: string) => {
      const ths = header
        .split('|')
        .filter((c) => c.trim())
        .map((c) => `<th class="px-4 py-2 text-left text-xs font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200">${c.trim()}</th>`)
        .join('')
      const trs = rows
        .trim()
        .split('\n')
        .map((row: string) => {
          const tds = row
            .split('|')
            .filter((c) => c.trim())
            .map((c) => `<td class="px-4 py-2.5 text-sm text-slate-700 border-b border-slate-100">${c.trim()}</td>`)
            .join('')
          return `<tr class="hover:bg-orange-50/30 transition-colors">${tds}</tr>`
        })
        .join('')
      return `<div class="overflow-x-auto my-4 rounded-xl border border-slate-200 shadow-sm"><table class="w-full border-collapse bg-white"><thead class="bg-slate-50"><tr>${ths}</tr></thead><tbody>${trs}</tbody></table></div>`
    }
  )

  // Blockquotes
  html = html.replace(
    /^> (.*)/gm,
    '<div class="my-3 flex gap-3 rounded-xl border-l-4 border-orange-400 bg-orange-50 px-4 py-3 text-sm text-orange-800 italic">$1</div>'
  )

  // Code blocks
  html = html.replace(
    /```[\w]*\n?([\s\S]*?)```/g,
    '<pre class="my-3 overflow-x-auto rounded-xl bg-slate-900 p-4 text-sm text-slate-100 font-mono leading-relaxed"><code>$1</code></pre>'
  )

  // Inline code
  html = html.replace(
    /`([^`]+)`/g,
    '<code class="rounded bg-slate-100 px-1.5 py-0.5 text-xs font-mono text-orange-700">$1</code>'
  )

  // H2
  html = html.replace(
    /^## (.+)/gm,
    '<h2 class="mt-5 mb-2 text-base font-black text-slate-900 flex items-center gap-2">$1</h2>'
  )

  // H3
  html = html.replace(
    /^### (.+)/gm,
    '<h3 class="mt-4 mb-1.5 text-sm font-bold text-slate-800">$1</h3>'
  )

  // H4
  html = html.replace(
    /^#### (.+)/gm,
    '<h4 class="mt-3 mb-1 text-sm font-semibold text-slate-700">$1</h4>'
  )

  // Bold
  html = html.replace(
    /\*\*(.+?)\*\*/g,
    '<strong class="font-semibold text-slate-900">$1</strong>'
  )

  // Italic
  html = html.replace(/\*(.+?)\*/g, '<em class="italic text-slate-700">$1</em>')

  // Links
  html = html.replace(
    /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-0.5 font-semibold text-orange-500 underline-offset-2 underline hover:text-orange-600 transition-colors">$1<svg class="inline h-3 w-3 mb-0.5 ml-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/></svg></a>'
  )

  // Bare URLs
  html = html.replace(
    /(^|[\s>])(https?:\/\/[^\s<"]+)/g,
    '$1<a href="$2" target="_blank" rel="noopener noreferrer" class="font-medium text-orange-500 underline hover:text-orange-600 break-all">$2</a>'
  )

  // Horizontal rules
  html = html.replace(/^---$/gm, '<hr class="my-4 border-slate-200" />')

  // Numbered lists — group consecutive items
  html = html.replace(
    /((?:^\d+\. .+\n?)+)/gm,
    (block: string) => {
      const items = block
        .trim()
        .split('\n')
        .map((line: string) =>
          `<li class="flex gap-2.5 py-0.5"><span class="shrink-0 font-semibold text-orange-500 w-5 text-right">${line.match(/^(\d+)\./)?.[1]}.</span><span>${line.replace(/^\d+\. /, '')}</span></li>`
        )
        .join('')
      return `<ol class="my-2 space-y-0.5 list-none">${items}</ol>`
    }
  )

  // Bullet lists — group consecutive items
  html = html.replace(
    /((?:^- .+\n?)+)/gm,
    (block: string) => {
      const items = block
        .trim()
        .split('\n')
        .map((line: string) =>
          `<li class="flex gap-2.5 py-0.5"><span class="shrink-0 text-orange-400 mt-0.5 font-bold">•</span><span>${line.replace(/^- /, '')}</span></li>`
        )
        .join('')
      return `<ul class="my-2 space-y-0.5 list-none">${items}</ul>`
    }
  )

  // Line breaks
  html = html.replace(/\n\n/g, '<div class="h-3"></div>')
  html = html.replace(/\n/g, '<br />')

  return html
}

// ─── Message component ────────────────────────────────────────────────────────

function ChatMessage({
  msg,
  isLast,
  isStreaming,
}: {
  msg: Message
  isLast: boolean
  isStreaming: boolean
}) {
  const isUser = msg.role === 'user'

  if (isUser) {
    return (
      <div className="flex justify-end px-4 md:px-0">
        <div className="max-w-[75%] md:max-w-[65%]">
          <div className="rounded-3xl rounded-tr-md bg-gradient-to-br from-orange-500 to-amber-500 px-5 py-3.5 text-sm text-white shadow-sm">
            {msg.content}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-3 px-4 md:px-0">
      {/* Avatar */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-sm mt-1 overflow-hidden p-1">
        <img src="/logo-transparent.png" alt="Sphere AI" className="h-full w-full object-contain" />
      </div>

      {/* Bubble */}
      <div className="min-w-0 flex-1 md:max-w-[80%]">
        <div className="prose-sphere text-sm leading-relaxed text-slate-700">
          {msg.content ? (
            <div dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }} />
          ) : (
            isStreaming && (
              <div className="flex gap-1 py-2">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-2 w-2 rounded-full bg-orange-300 animate-bounce"
                    style={{ animationDelay: `${i * 0.18}s` }}
                  />
                ))}
              </div>
            )
          )}
        </div>

        {/* Streaming cursor */}
        {isStreaming && isLast && msg.content && (
          <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse rounded-full bg-orange-400" />
        )}
      </div>
    </div>
  )
}

// ─── Contact Form ─────────────────────────────────────────────────────────────

function ContactSubmitCard({
  onSubmit,
  isSubmitting,
  submitted,
}: {
  onSubmit: (c: TripContact) => void
  isSubmitting: boolean
  submitted: boolean
}) {
  const [form, setForm] = useState<TripContact>({ name: '', phone: '', email: '' })

  if (submitted) {
    return (
      <div className="mx-auto my-4 flex max-w-md items-center gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4">
        <CheckCircleIcon className="h-8 w-8 shrink-0 text-emerald-500" />
        <div>
          <p className="font-bold text-emerald-800">Trip plan sent to Travel Sphere! 🎉</p>
          <p className="mt-0.5 text-xs text-emerald-700">
            Our expert will call you within 24 hours.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto my-4 max-w-md rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-5">
      <p className="mb-1 font-bold text-slate-800">Share your details</p>
      <p className="mb-4 text-xs text-slate-600">
        Our travel expert will call you to finalize and book your custom trip.
      </p>
      <div className="space-y-2.5">
        <input
          type="text"
          placeholder="Your name *"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
        />
        <input
          type="tel"
          placeholder="Phone number * (e.g. +91 9876543210)"
          value={form.phone}
          onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
        />
        <input
          type="email"
          placeholder="Email address (optional)"
          value={form.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
        />
        <button
          onClick={() => form.name && form.phone && onSubmit(form)}
          disabled={!form.name || !form.phone || isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-3 text-sm font-bold text-white shadow-md transition hover:from-orange-600 hover:to-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <ArrowPathIcon className="h-4 w-4 animate-spin" />
              Submitting…
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

// ─── Conversation starters ────────────────────────────────────────────────────

const STARTERS = [
  "I want to plan a trip but I'm not sure where to go 🤔",
  "Tell me about the best places to visit in India 🇮🇳",
  "Plan an international trip for 2 people under ₹1 lakh 🌍",
  "I love mountains — where should I go next? 🏔️",
  "Best beach destinations for a family trip 🌊",
  "I want a short 3-day trip this weekend 🎒",
]

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function AiPlannerPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showContactCard, setShowContactCard] = useState(false)
  const [tripSummary, setTripSummary] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [msgCounter, setMsgCounter] = useState(0)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Initial AI greeting — natural conversation starter
  useEffect(() => {
    const greeting: Message = {
      id: 'welcome',
      role: 'assistant',
      content: `Namaste! 🙏 I'm **Sphere**, your personal AI travel consultant from **Travel Sphere**.

I'm here to help you plan a trip that's truly made for *you* — not just any generic tour package.

Before I throw destinations at you, I'd love to know a little about you first. **What's on your travel mind lately?** Maybe you've been dreaming of somewhere specific, or maybe you're just craving a change of scene and not sure where to start?

Tell me anything — I'm all ears! ✈️`,
    }
    setMessages([greeting])
    setTimeout(() => inputRef.current?.focus(), 400)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading, showContactCard])

  const detectContactRequest = useCallback((text: string) => {
    const l = text.toLowerCase()
    return (
      (l.includes('name') && (l.includes('phone') || l.includes('number') || l.includes('contact'))) ||
      l.includes('share your contact') ||
      l.includes('reach you') ||
      l.includes('call you') ||
      l.includes('get back to you') ||
      l.includes('travel sphere expert')
    )
  }, [])

  const buildSummary = useCallback((msgs: Message[]) => {
    return msgs
      .map((m) => `${m.role === 'user' ? 'Customer' : 'AI Planner'}: ${m.content}`)
      .join('\n\n---\n\n')
  }, [])

  const nextId = () => {
    setMsgCounter((c) => c + 1)
    return `msg-${Date.now()}-${msgCounter}`
  }

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return

    const userMsg: Message = { id: nextId(), role: 'user', content: text }
    const updatedMsgs = [...messages, userMsg]
    setMessages(updatedMsgs)
    setInput('')
    setLoading(true)

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
    }

    try {
      const res = await fetch('/api/ai-trip-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMsgs.map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        const errMsg = data.error || 'Something went wrong. Please try again.'
        setMessages((prev) => [...prev, { id: nextId(), role: 'assistant', content: errMsg }])
        setLoading(false)
        return
      }

      const reader = res.body?.getReader()
      if (!reader) throw new Error('No stream reader')

      const decoder = new TextDecoder()
      let reply = ''
      const aiMsgId = nextId()
      setMessages((prev) => [...prev, { id: aiMsgId, role: 'assistant', content: '' }])

      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        reply += decoder.decode(value, { stream: true })
        setMessages((prev) => {
          const updated = [...prev]
          const lastIdx = updated.length - 1
          if (updated[lastIdx]?.id === aiMsgId || updated[lastIdx]?.role === 'assistant') {
            updated[lastIdx] = { id: aiMsgId, role: 'assistant', content: reply }
          }
          return updated
        })
      }

      // Check if AI is asking for contact details
      if (detectContactRequest(reply)) {
        setTripSummary(buildSummary([...updatedMsgs, { id: aiMsgId, role: 'assistant', content: reply }]))
        setTimeout(() => setShowContactCard(true), 700)
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: 'assistant',
          content: 'Apologies, I had a connection hiccup! Please try again, or reach us on WhatsApp at +91 8603606089.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitContact = async (contact: TripContact) => {
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
            tripSummary: `Customer: ${contact.name} | Phone: ${contact.phone} | Email: ${contact.email || 'Not provided'}\n\n${tripSummary}`,
          },
          messages: [],
        }),
      })

      if (res.ok) {
        setSubmitted(true)
        setShowContactCard(false)
        setMessages((prev) => [
          ...prev,
          {
            id: nextId(),
            role: 'assistant',
            content: `Perfect, **${contact.name}**! 🎉 Your personalized trip plan has been sent to our Travel Sphere team.

**What happens next:**
- A Travel Sphere travel expert will **call you at ${contact.phone}** within 24 hours
- They'll share exact pricing, finalize the itinerary, and answer any questions
- Once confirmed, we'll handle everything — flights, hotels, activities, transfers

In the meantime, you can browse our packages at [travelsphere.sbs/tours](https://travelsphere.sbs/tours) 🌍

Thank you for choosing Travel Sphere. Happy travels! ✈️🙏`,
          },
        ])
      } else {
        throw new Error('Submit failed')
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: 'assistant',
          content:
            "Sorry, I couldn't submit just now. Please WhatsApp us directly at [+91 8603606089](https://wa.me/918603606089) — we'll be happy to help! 🙏",
        },
      ])
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const resetChat = () => {
    setMessages([])
    setInput('')
    setShowContactCard(false)
    setSubmitted(false)
    setTripSummary('')
    setTimeout(() => {
      const newGreeting: Message = {
        id: 'welcome-new',
        role: 'assistant',
        content: `Let's plan a fresh trip! 🌟 What destination or travel idea has been on your mind lately? I'm here to help you figure it all out.`,
      }
      setMessages([newGreeting])
      inputRef.current?.focus()
    }, 100)
  }

  const isCurrentlyStreaming = loading && messages[messages.length - 1]?.role === 'assistant'

  return (
    <div className="flex h-screen flex-col bg-slate-50">

      {/* ── Top Nav Bar ───────────────────────────────────────────────────── */}
      <header className="flex shrink-0 items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 shadow-sm md:px-6">
        <Link
          href="/customised-tour"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          aria-label="Back"
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </Link>

        {/* Logo + Name */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 p-1.5 shadow-sm">
            <img src="/logo-transparent.png" alt="Sphere" className="h-full w-full object-contain" />
          </div>
          <div>
            <p className="text-sm font-black text-slate-900 leading-none">Sphere AI Trip Planner</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-500">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
              Travel Sphere · Online
            </p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* New Chat */}
          <button
            onClick={resetChat}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-800"
          >
            <ArrowPathIcon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">New Chat</span>
          </button>

          {/* WhatsApp */}
          <a
            href="https://wa.me/918603606089"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3 py-2 text-xs font-bold text-white transition hover:bg-emerald-600"
          >
            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        </div>
      </header>

      {/* ── Messages area ─────────────────────────────────────────────────── */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto"
      >
        <div className="mx-auto max-w-3xl py-6 space-y-6">
          {messages.map((msg, i) => {
            const isLast = i === messages.length - 1
            return (
              <ChatMessage
                key={msg.id}
                msg={msg}
                isLast={isLast}
                isStreaming={isLast && isCurrentlyStreaming}
              />
            )
          })}

          {/* Loading spinner when AI hasn't replied yet */}
          {loading && messages[messages.length - 1]?.role === 'user' && (
            <div className="flex gap-3 px-4 md:px-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 shadow-sm overflow-hidden p-1">
                <img src="/logo-transparent.png" alt="Sphere AI" className="h-full w-full object-contain" />
              </div>
              <div className="flex items-center gap-1 rounded-2xl rounded-tl-md bg-white border border-slate-100 px-5 py-3.5 shadow-sm">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-2 w-2 rounded-full bg-orange-300 animate-bounce"
                    style={{ animationDelay: `${i * 0.18}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Contact submission card */}
          {showContactCard && !submitted && (
            <div className="px-4 md:px-0">
              <ContactSubmitCard
                onSubmit={handleSubmitContact}
                isSubmitting={isSubmitting}
                submitted={submitted}
              />
            </div>
          )}

          {submitted && (
            <div className="px-4 md:px-0">
              <ContactSubmitCard
                onSubmit={handleSubmitContact}
                isSubmitting={isSubmitting}
                submitted={submitted}
              />
            </div>
          )}

          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      {/* ── Conversation starters (shown only before first user message) ─── */}
      {messages.filter((m) => m.role === 'user').length === 0 && (
        <div className="shrink-0 border-t border-slate-100 bg-white px-4 pb-3 pt-3 md:px-6">
          <div className="mx-auto max-w-3xl">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Not sure what to say? Try one of these
            </p>
            <div className="flex flex-wrap gap-2">
              {STARTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="rounded-2xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 shadow-sm transition hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Input Bar ─────────────────────────────────────────────────────── */}
      <div className="shrink-0 border-t border-slate-200 bg-white px-4 py-3 md:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-end gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 shadow-sm ring-0 focus-within:border-orange-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-100 transition-all">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 p-1 mb-0.5">
              <SparklesIcon className="h-4 w-4 text-white" />
            </div>

            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                e.target.style.height = 'auto'
                e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px'
              }}
              onKeyDown={handleKey}
              placeholder="Ask me anything about your trip…"
              rows={1}
              disabled={loading}
              className="flex-1 resize-none bg-transparent py-1.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none max-h-40 overflow-y-auto leading-relaxed"
            />

            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading}
              className="mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-sm transition hover:from-orange-600 hover:to-amber-600 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              <PaperAirplaneIcon className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-1.5 text-center text-[10px] text-slate-400">
            Sphere AI · Powered by Travel Sphere ·{' '}
            <a href="https://travelsphere.sbs" className="hover:text-orange-400 transition">
              travelsphere.sbs
            </a>{' '}
            · Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  )
}
