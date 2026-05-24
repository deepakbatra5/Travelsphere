'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Package {
  title: string
  slug: string
  category: string
  destination: string
  price: number
  duration: number
}

const WELCOME_MESSAGE: Message = {
  role: 'assistant',
  content: 'Namaste! I am Sphere, your personal AI travel agent at Travel Sphere. How can I help you?',
}

function normalizeMessage(message: Message): Message {
  const normalizedContent = message.content.toLowerCase()

  if (
    message.role === 'assistant' &&
    normalizedContent.includes('personal ai travel agent at travel sphere') &&
    normalizedContent.includes('budget and preferences') &&
    normalizedContent.includes('visa tips')
  ) {
    return WELCOME_MESSAGE
  }

  return message
}

const QUICK_CHIPS = [
  { label: 'All packages', msg: 'Show me all Travel Sphere tour packages with prices' },
  { label: 'Solo travel', msg: 'Suggest the best solo trip for me from Travel Sphere' },
  { label: 'Family trips', msg: 'Plan a family trip under Rs 50,000 budget' },
  { label: 'Adventure tours', msg: 'Best adventure destinations in India and worldwide' },
  { label: 'International trips', msg: 'Best international destinations for Indian travelers under 1 lakh' },
]

const WEBSITE_PACKAGES: Package[] = [
  { title: 'Kerala Solo Retreat', slug: 'kerala-solo-retreat', category: 'SOLO', destination: 'Kochi - Munnar - Alleppey', price: 19999, duration: 8 },
  { title: 'Kashmir Solo Escape', slug: 'kashmir-solo-escape', category: 'SOLO', destination: 'Srinagar - Gulmarg - Pahalgam', price: 28999, duration: 7 },
  { title: 'Ladakh Adventure Tour', slug: 'ladakh-adventure-tour', category: 'ADVENTURE', destination: 'Leh - Nubra Valley - Pangong', price: 32999, duration: 9 },
  { title: 'Goa Beach Holiday', slug: 'goa-beach-holiday', category: 'GROUP', destination: 'North Goa - South Goa', price: 12999, duration: 5 },
  { title: 'Char Dham Yatra', slug: 'char-dham-yatra', category: 'PILGRIMAGE', destination: 'Yamunotri - Gangotri - Kedarnath - Badrinath', price: 22999, duration: 12 },
  { title: 'Golden Triangle Tour', slug: 'golden-triangle-tour', category: 'FAMILY', destination: 'Delhi - Agra - Jaipur', price: 15999, duration: 6 },
  { title: 'Chandigarh City Tour', slug: 'chandigarh-city-tour', category: 'GROUP', destination: 'Chandigarh', price: 3999, duration: 2 },
]

function PackageCard({ pkg }: { pkg: Package }) {
  const categoryColors: Record<string, string> = {
    SOLO: 'bg-purple-100 text-purple-700',
    ADVENTURE: 'bg-green-100 text-green-700',
    GROUP: 'bg-yellow-100 text-yellow-700',
    PILGRIMAGE: 'bg-orange-100 text-orange-700',
    FAMILY: 'bg-orange-100 text-orange-700',
  }
  return (
    <a
      href={`https://travelsphere.sbs/tours/${pkg.slug}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block border border-gray-100 rounded-xl p-3 hover:border-orange-400 transition-colors mt-2 no-underline bg-white"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-medium text-gray-800 text-sm">{pkg.title}</span>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${categoryColors[pkg.category] || 'bg-gray-100 text-gray-600'}`}>
          {pkg.category}
        </span>
      </div>
      <p className="text-gray-500 text-xs mt-1">{pkg.destination}</p>
      <div className="flex items-center justify-between mt-2">
        <span className="text-orange-500 font-semibold text-sm">Rs {pkg.price.toLocaleString('en-IN')}</span>
        <span className="text-gray-400 text-xs">{pkg.duration} days · Book Now →</span>
      </div>
    </a>
  )
}

function TypingIndicator() {
  return (
    <div className="flex gap-2 items-start">
      <div className="w-7 h-7 rounded-full bg-orange-900 flex items-center justify-center flex-shrink-0 text-sm">🌍</div>
      <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex gap-1 items-center">
          {[0, 1, 2].map(i => (
            <span key={i} className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    </div>
  )
}

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === 'user'
  const text = msg.content

  const detectPackages = useCallback(() => {
    return []
  }, [])

  const formatText = (t: string) => {
    return t
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" class="text-orange-500 hover:underline font-medium">$1</a>')
      .replace(/(^|[\s>])(https?:\/\/[^\s<]+)/g, '$1<a href="$2" class="text-orange-500 hover:underline font-medium break-all">$2</a>')
      .replace(/^### (.*)/gm, '<div class="font-semibold text-gray-800 mt-3 mb-1 text-sm">$1</div>')
      .replace(/^## (.*)/gm, '<div class="font-semibold text-gray-800 mt-3 mb-1">$1</div>')
      .replace(/^- (.*)/gm, '<div class="flex gap-2 my-1"><span class="text-orange-500 flex-shrink-0">›</span><span>$1</span></div>')
      .replace(/^(\d+)\. (.*)/gm, '<div class="flex gap-2 my-1"><span class="text-orange-500 font-medium flex-shrink-0">$1.</span><span>$2</span></div>')
      .replace(/\n\n/g, '<br /><br />')
      .replace(/\n/g, '<br />')
  }

  const relatedPkgs = !isUser ? detectPackages() : []

  if (isUser) {
    return (
      <div className="flex gap-2 items-start justify-end">
        <div className="bg-orange-900 text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[82%] text-sm leading-relaxed">{text}</div>
        <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0 text-white text-xs font-semibold mt-0.5">U</div>
      </div>
    )
  }

  return (
    <div className="flex gap-2 items-start">
      <div className="w-7 h-7 rounded-full bg-orange-900 flex items-center justify-center flex-shrink-0 text-sm mt-0.5">🌍</div>
      <div className="max-w-[85%]">
        <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed text-gray-800" dangerouslySetInnerHTML={{ __html: formatText(text) }} />
      </div>
    </div>
  )
}

function CustomPlanForm({ onSubmit }: { onSubmit: (q: string) => void }) {
  const [form, setForm] = useState({
    style: 'Relaxation and beaches',
    budget: 'Rs 15,000 to 30,000',
    duration: '5 to 7 days',
    group: 'Couple',
    region: 'Anywhere in India',
    interests: '',
  })

  const planFields: Array<{ label: string; key: Exclude<keyof typeof form, 'interests'>; options: string[] }> = [
    { label: 'Travel style', key: 'style', options: ['Relaxation and beaches', 'Adventure and trekking', 'Culture and history', 'Spiritual and pilgrimage', 'Romantic getaway', 'Family fun', 'Solo backpacking'] },
    { label: 'Budget', key: 'budget', options: ['Under Rs 15,000', 'Rs 15,000 to 30,000', 'Rs 30,000 to 60,000', 'Rs 60,000 to 1 lakh', 'Above 1 lakh'] },
    { label: 'Duration', key: 'duration', options: ['2 to 3 days', '5 to 7 days', '8 to 12 days', '2 weeks or more'] },
    { label: 'Group type', key: 'group', options: ['Solo traveler', 'Couple', 'Family with kids', 'Friends group', 'Corporate team'] },
    { label: 'Region', key: 'region', options: ['Anywhere in India', 'North India mountains', 'South India beaches', 'International Southeast Asia', 'International Europe', 'International Middle East'] },
  ]

  const handleSubmit = () => {
    const q = `Please create a custom trip plan for me with these preferences:\n    - Travel style: ${form.style}\n    - Budget: ${form.budget}\n    - Duration: ${form.duration}\n    - Group type: ${form.group}\n    - Region: ${form.region}\n    ${form.interests ? `- Special interests: ${form.interests}` : ''}\n    Please recommend the best matching Travel Sphere packages and create a detailed day-by-day itinerary.`
    onSubmit(q)
  }

  return (
    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 mt-2 space-y-3">
      <p className="text-xs font-medium text-gray-500">CUSTOM TRIP PLANNER</p>
      {planFields.map(({ label, key, options }) => (
        <div key={key} className="flex items-center gap-2">
          <span className="text-xs text-gray-500 w-24 flex-shrink-0">{label}</span>
          <select value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} className="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-700 focus:outline-none focus:border-orange-400">
            {options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
      ))}
      <div>
        <input type="text" value={form.interests} onChange={e => setForm(p => ({ ...p, interests: e.target.value }))} placeholder="Any specific interests? (wildlife, photography, food...)" className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-orange-400 bg-white text-gray-700" />
      </div>
      <button onClick={handleSubmit} className="w-full bg-orange-500 text-white text-sm font-medium py-2.5 rounded-xl hover:bg-orange-600 transition-colors">Get My Custom Trip Plan ✈</button>
    </div>
  )
}

export default function AIAgent() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [unread, setUnread] = useState(0)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const openChat = () => {
    setOpen(true)
    setUnread(0)
    setMessages((currentMessages) =>
      currentMessages.length === 0 ? [WELCOME_MESSAGE] : currentMessages.map(normalizeMessage)
    )
  }

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [open])

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return
    setShowCustomForm(false)

    const userMsg: Message = { role: 'user', content: text }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    setMessages(prev => [...prev, { role: 'assistant', content: '' }])

    try {
      const res = await fetch('/api/ai-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages.map(m => ({ role: m.role, content: m.content })) })
      })

      if (!res.ok) {
        const data = await res.json()
        const errorMsg = data.error || 'Something went wrong. Please try again.'
        setMessages(prev => {
          const updated = [...prev]
          if (updated.length > 0) {
            updated[updated.length - 1] = { role: 'assistant', content: errorMsg }
          }
          return updated
        })
        setLoading(false)
        return
      }

      const reader = res.body?.getReader()
      if (!reader) {
        throw new Error('No stream reader available')
      }

      const decoder = new TextDecoder()
      let replyContent = ''

      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        replyContent += chunk
        setMessages(prev => {
          const updated = [...prev]
          if (updated.length > 0) {
            updated[updated.length - 1] = { role: 'assistant', content: replyContent }
          }
          return updated
        })
      }
    } catch {
      setMessages(prev => {
        const updated = [...prev]
        if (updated.length > 0) {
          updated[updated.length - 1] = { role: 'assistant', content: 'I am having a connection issue right now. Please try again or contact us on WhatsApp at +91 8603606089.' }
        }
        return updated
      })
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) } }

  const resetChat = () => { setMessages([WELCOME_MESSAGE]); setShowCustomForm(false) }
  return (
    <>
      {!open && (
        <button onClick={openChat} className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95" aria-label="Open AI Travel Agent">
          <span className="text-2xl">🌍</span>
          {unread > 0 && (<span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">{unread}</span>)}
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-24px)] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100">
          <div className="bg-orange-900 px-4 py-3 flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center text-lg flex-shrink-0">🌍</div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm font-sans">Sphere — AI Travel Agent</p>
              <p className="text-orange-300 text-xs flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-pulse" />Online · Travel Sphere</p>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={resetChat} className="text-orange-300 hover:text-white text-xs px-2 py-1 rounded-lg hover:bg-orange-800 transition-colors">New Chat</button>
              <a href="https://travelsphere.sbs/tours" target="_blank" rel="noopener noreferrer" className="text-orange-300 hover:text-white text-xs px-2 py-1 rounded-lg hover:bg-orange-800 transition-colors">Tours ↗</a>
              <button onClick={() => setOpen(false)} className="text-orange-300 hover:text-white ml-1 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-orange-800 transition-colors" aria-label="Close chat">✕</button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scroll-smooth">
            {messages.map((msg, i) => (<MessageBubble key={i} msg={normalizeMessage(msg)} />))}
            {loading && !messages[messages.length - 1]?.content && <TypingIndicator />}
            {showCustomForm && (<div className="flex gap-2 items-start"><div className="w-7 h-7 rounded-full bg-orange-900 flex items-center justify-center flex-shrink-0 text-sm">🌍</div><div className="flex-1"><div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-gray-700 mb-1">Let me build a custom trip plan for you! Fill in your preferences:</div><CustomPlanForm onSubmit={(q) => { setShowCustomForm(false); sendMessage(q) }} /></div></div>)}
            <div ref={messagesEndRef} />
          </div>

          {messages.length <= 2 && (
            <div className="px-3 pt-2 pb-0 flex flex-wrap gap-1.5 flex-shrink-0">
              {QUICK_CHIPS.map((c) => (<button key={c.label} onClick={() => sendMessage(c.msg)} className="text-xs bg-orange-50 text-orange-700 border border-orange-200 rounded-full px-3 py-1.5 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-colors">{c.label}</button>))}
              <button onClick={() => setShowCustomForm(true)} className="text-xs bg-orange-50 text-orange-700 border border-orange-200 rounded-full px-3 py-1.5 hover:bg-orange-900 hover:text-white hover:border-orange-900 transition-colors">Custom trip planner</button>
            </div>
          )}

          <div className="px-3 py-3 border-t border-gray-100 flex gap-2 items-end flex-shrink-0">
            <textarea ref={inputRef} value={input} onChange={e => { setInput(e.target.value); e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 96) + 'px' }} onKeyDown={handleKey} placeholder="Ask about travel..." rows={1} className="flex-1 resize-none text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-orange-400 bg-gray-50 text-gray-800 placeholder-gray-400 leading-snug max-h-24 overflow-y-auto overflow-x-hidden" />
            <button onClick={() => sendMessage(input)} disabled={!input.trim() || loading} className="w-10 h-10 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center flex-shrink-0 transition-colors" aria-label="Send message">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M2 12L22 2L15 22L11 13L2 12Z"/></svg>
            </button>
          </div>

          <div className="text-center py-1.5 text-xs text-gray-300 flex-shrink-0">Powered by OpenAI · <a href="https://travelsphere.sbs" target="_blank" className="hover:text-orange-400 transition-colors">Travel Sphere</a></div>
        </div>
      )}
    </>
  )
}


