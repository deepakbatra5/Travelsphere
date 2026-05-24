'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MapPinIcon, CurrencyRupeeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'

const destinations = [
  'Andaman & Nicobar', 'Coorg', 'Darjeeling', 'Goa',
  'Hampi', 'Himachal Pradesh', 'Jammu & Kashmir', 'Jaipur',
  'Kerala', 'Ladakh', 'Manali', 'Meghalaya',
  'Munnar', 'Ooty', 'Rishikesh', 'Shimla',
  'Spiti Valley', 'Udaipur', 'Uttarakhand', 'Varanasi',
]

const budgets = [
  { label: '₹0 – ₹10,000', value: '0-10000' },
  { label: '₹10,000 – ₹25,000', value: '10000-25000' },
  { label: '₹25,000 – ₹35,000', value: '25000-35000' },
  { label: 'Above ₹35,000', value: '35000-999999' },
]

const tourTypes = [
  {
    label: 'Group Tours',
    value: 'GROUP',
    emoji: '👥',
    gradient: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    text: 'text-blue-700',
    desc: 'Fun with like-minded travellers',
  },
  {
    label: 'Adventure Tours',
    value: 'ADVENTURE',
    emoji: '🏔️',
    gradient: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-300',
    text: 'text-emerald-700',
    desc: 'Thrills, treks & wild escapes',
  },
  {
    label: 'Family Tours',
    value: 'FAMILY',
    emoji: '🏡',
    gradient: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    text: 'text-amber-700',
    desc: 'Memories for every age',
  },
  {
    label: 'Solo Tours',
    value: 'SOLO',
    emoji: '🎒',
    gradient: 'from-purple-500 to-violet-600',
    bg: 'bg-purple-50',
    border: 'border-purple-300',
    text: 'text-purple-700',
    desc: 'Your journey, your rules',
  },
  {
    label: 'Pilgrimage Tours',
    value: 'PILGRIMAGE',
    emoji: '🛕',
    gradient: 'from-rose-500 to-pink-600',
    bg: 'bg-rose-50',
    border: 'border-rose-300',
    text: 'text-rose-700',
    desc: 'Sacred places & spiritual peace',
  },
  {
    label: 'Couple Tours',
    value: 'COUPLE',
    emoji: '❤️',
    gradient: 'from-pink-500 to-red-500',
    bg: 'bg-pink-50',
    border: 'border-pink-300',
    text: 'text-pink-700',
    desc: 'Romantic getaways for two',
  },
]

export default function TripSearch() {
  const router = useRouter()

  const [destination, setDestination] = useState('')
  const [budget, setBudget] = useState('')
  const [type, setType] = useState('')
  const [error, setError] = useState('')

  const [activeDropdown, setActiveDropdown] = useState<'destination' | 'budget' | 'type' | null>(null)

  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = () => {
    if (!destination && !budget && !type) {
      setError('Please select at least one search detail.')
      return
    }
    setError('')
    const params = new URLSearchParams()
    if (destination) params.append('search', destination)
    if (budget) params.append('budget', budget)
    if (type) params.append('category', type)
    router.push(`/packages?${params.toString()}`)
  }

  return (
    <div className="absolute top-1/2 -translate-y-1/2 right-8 md:right-16 lg:right-24 z-20 w-full max-w-3xl px-4" ref={searchRef}>
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/60 overflow-visible">

        {/* Error Banner */}
        {error && (
          <div className="px-6 pt-3 pb-0">
            <p className="text-xs text-red-600 font-semibold bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              ⚠️ {error}
            </p>
          </div>
        )}

        <div className="flex flex-col md:flex-row items-stretch divide-y md:divide-y-0 md:divide-x divide-slate-200">

          {/* ── Destination ── */}
          <div
            className="relative flex-1 flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-orange-50/60 transition-colors group rounded-tl-2xl rounded-tr-2xl md:rounded-tr-none md:rounded-bl-2xl"
            onClick={() => setActiveDropdown(activeDropdown === 'destination' ? null : 'destination')}
          >
            <div className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-orange-100 group-hover:bg-orange-200 transition-colors">
              <MapPinIcon className="h-5 w-5 text-orange-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Destination</p>
              <p className={`text-sm font-semibold truncate mt-0.5 ${destination ? 'text-slate-900' : 'text-slate-400'}`}>
                {destination || 'Where to go?'}
              </p>
            </div>

            {/* Destination Dropdown */}
            {activeDropdown === 'destination' && (
              <div className="absolute top-full left-0 mt-3 w-full md:w-[560px] bg-white rounded-2xl shadow-2xl border border-slate-100 p-5 z-50 animate-in fade-in slide-in-from-top-3">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Popular Indian Destinations</p>
                <div className="flex flex-wrap gap-2">
                  {destinations.map(d => (
                    <button
                      key={d}
                      onClick={(e) => {
                        e.stopPropagation()
                        setDestination(d)
                        setActiveDropdown(null)
                        setError('')
                      }}
                      className={`px-4 py-2 text-sm rounded-xl border-2 font-medium transition-all ${destination === d
                        ? 'border-orange-500 bg-orange-500 text-white shadow-md shadow-orange-300'
                        : 'border-orange-200 text-orange-700 hover:border-orange-400 hover:bg-orange-50'
                        }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Budget ── */}
          <div
            className="relative flex-1 flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-orange-50/60 transition-colors group"
            onClick={() => setActiveDropdown(activeDropdown === 'budget' ? null : 'budget')}
          >
            <div className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-green-100 group-hover:bg-green-200 transition-colors">
              <CurrencyRupeeIcon className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Budget</p>
              <p className={`text-sm font-semibold truncate mt-0.5 ${budget ? 'text-slate-900' : 'text-slate-400'}`}>
                {budget ? budgets.find(b => b.value === budget)?.label : 'Select range'}
              </p>
            </div>

            {/* Budget Dropdown */}
            {activeDropdown === 'budget' && (
              <div className="absolute top-full left-0 md:left-1/2 md:-translate-x-1/2 mt-3 w-full md:w-[360px] bg-white rounded-2xl shadow-2xl border border-slate-100 p-5 z-50 animate-in fade-in slide-in-from-top-3">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Your Budget Range</p>
                <div className="grid grid-cols-1 gap-2">
                  {budgets.map(b => (
                    <button
                      key={b.value}
                      onClick={(e) => {
                        e.stopPropagation()
                        setBudget(b.value)
                        setActiveDropdown(null)
                        setError('')
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl border-2 font-semibold text-sm transition-all ${budget === b.value
                        ? 'border-green-500 bg-green-500 text-white shadow-md shadow-green-300'
                        : 'border-slate-200 text-slate-700 hover:border-green-400 hover:bg-green-50'
                        }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Tour Type ── */}
          <div
            className="relative flex-1 flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-orange-50/60 transition-colors group"
            onClick={() => setActiveDropdown(activeDropdown === 'type' ? null : 'type')}
          >
            <div className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-purple-100 group-hover:bg-purple-200 transition-colors">
              <span className="text-lg">🗺️</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Tour Type</p>
              <p className={`text-sm font-semibold truncate mt-0.5 ${type ? 'text-slate-900' : 'text-slate-400'}`}>
                {tourTypes.find(t => t.value === type)?.label || 'Select type'}
              </p>
            </div>

            {/* Tour Type Dropdown */}
            {activeDropdown === 'type' && (
              <div className="absolute top-full right-0 mt-3 w-full md:w-[520px] bg-white rounded-2xl shadow-2xl border border-slate-100 p-5 z-50 animate-in fade-in slide-in-from-top-3">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Choose Your Travel Style</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {tourTypes.map(t => (
                    <button
                      key={t.value}
                      onClick={(e) => {
                        e.stopPropagation()
                        setType(t.value)
                        setActiveDropdown(null)
                        setError('')
                      }}
                      className={`group/card relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${type === t.value
                        ? `${t.border} ${t.bg} shadow-md scale-[1.02]`
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                    >
                      {/* Gradient blob on selected */}
                      {type === t.value && (
                        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${t.gradient} opacity-10`} />
                      )}
                      <span className="text-3xl leading-none">{t.emoji}</span>
                      <span className={`text-xs font-bold leading-tight relative z-10 ${type === t.value ? t.text : 'text-slate-700'}`}>
                        {t.label}
                      </span>
                      <span className="text-[10px] text-slate-400 relative z-10 leading-tight">
                        {t.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Search Button ── */}
          <div className="flex items-center shrink-0 px-3 py-2">
            <button
              onClick={handleSearch}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-7 py-3 rounded-xl font-bold text-sm shadow-lg shadow-orange-500/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-500/40 active:scale-95 whitespace-nowrap min-w-[110px]"
            >
              <MagnifyingGlassIcon className="h-4 w-4" />
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

