'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ClockIcon,
  CurrencyRupeeIcon,
  TagIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

const categoryOptions = [
  {
    label: 'All Categories',
    value: 'ALL',
    emoji: '🌍',
    desc: 'Browse all tours',
  },
  {
    label: 'Group Tours',
    value: 'GROUP',
    emoji: '👥',
    desc: 'Fun with like-minded travellers',
  },
  {
    label: 'Adventure Tours',
    value: 'ADVENTURE',
    emoji: '🏔️',
    desc: 'Thrills, treks & wild escapes',
  },
  {
    label: 'Family Tours',
    value: 'FAMILY',
    emoji: '🏡',
    desc: 'Memories for every age',
  },
  {
    label: 'Solo Tours',
    value: 'SOLO',
    emoji: '🎒',
    desc: 'Your journey, your rules',
  },
  {
    label: 'Pilgrimage Tours',
    value: 'PILGRIMAGE',
    emoji: '🛕',
    desc: 'Sacred places & spiritual peace',
  },
  {
    label: 'Couple Tours',
    value: 'COUPLE',
    emoji: '❤️',
    desc: 'Romantic getaways for two',
  },
  {
    label: 'Corporate Tours',
    value: 'CORPORATE',
    emoji: '💼',
    desc: 'Work hard & play hard',
  },
]

const durationOptions = [
  { label: 'All Durations', value: 'ALL', emoji: '🌍', desc: 'Any length of stay' },
  { label: '1–3 Days', value: '1-3', emoji: '⏱️', desc: 'Weekend & quick getaways' },
  { label: '4–6 Days', value: '4-6', emoji: '📅', desc: 'Standard weekly holidays' },
  { label: '7–10 Days', value: '7-10', emoji: '🗺️', desc: 'In-depth destination tours' },
  { label: '10+ Days', value: '10+', emoji: '🚀', desc: 'Extended grand vacations' },
]

const budgetOptions = [
  { label: 'All Budgets', value: 'ALL', emoji: '🌍', desc: 'Any pricing package' },
  { label: 'Under ₹10,000', value: '0-10000', emoji: '💰', desc: 'Budget-friendly travel' },
  { label: '₹10,000 – ₹25,000', value: '10000-25000', emoji: '💳', desc: 'Value escapes & getaways' },
  { label: '₹25,050 – ₹50,000', value: '25000-50000', emoji: '✨', desc: 'Premium curated tours' },
  { label: 'Above ₹50,000', value: '50000-999999', emoji: '👑', desc: 'Elite luxury indulgence' },
]

export default function PackageFilter({ basePath = '/packages' }: { basePath?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || 'ALL')
  const [duration, setDuration] = useState(searchParams.get('duration') || 'ALL')
  const [budget, setBudget] = useState(searchParams.get('budget') || 'ALL')

  const [activeDropdown, setActiveDropdown] = useState<'category' | 'duration' | 'budget' | null>(null)
  const filterRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (category !== 'ALL') params.set('category', category)
    if (duration !== 'ALL') params.set('duration', duration)
    if (budget !== 'ALL') params.set('budget', budget)
    const query = params.toString()
    router.push(query ? `${basePath}?${query}` : basePath)
  }

  const clearFilters = () => {
    setSearch('')
    setCategory('ALL')
    setDuration('ALL')
    setBudget('ALL')
    router.push(basePath)
  }

  const getCategoryLabel = () => {
    if (category === 'ALL') return 'Categories'
    const found = categoryOptions.find((o) => o.value === category)
    return found ? found.label : category
  }

  const getDurationLabel = () => {
    if (duration === 'ALL') return 'Durations'
    const found = durationOptions.find((o) => o.value === duration)
    return found ? found.label : `${duration} Days`
  }

  const getBudgetLabel = () => {
    if (budget === 'ALL') return 'Budgets'
    const found = budgetOptions.find((o) => o.value === budget)
    return found ? found.label : budget
  }

  return (
    <div className="w-full relative mb-8 select-none z-40" ref={filterRef}>
      <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/60 dark:border-slate-700/60 overflow-visible">
        <div className="flex flex-col md:flex-row items-stretch divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-700">
          
          {/* ── Search Input ── */}
          <div
            className="relative flex-[1.2] flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-orange-50/60 dark:hover:bg-slate-700/50 transition-colors group rounded-tl-2xl rounded-tr-2xl md:rounded-tr-none md:rounded-bl-2xl"
            onClick={() => inputRef.current?.focus()}
          >
            <div className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/20 group-hover:bg-orange-200 dark:group-hover:bg-orange-950/30 transition-colors">
              <MagnifyingGlassIcon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Search Packages</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Where or what to explore?"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                  className="search-input-transparent w-full bg-transparent border-none p-0 text-sm font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:ring-0 focus:border-none focus:outline-none focus:bg-transparent"
                  style={{ border: 'none', background: 'none', boxShadow: 'none', padding: 0 }}
                />
                {search && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSearch('')
                    }}
                    className="text-slate-400 hover:text-slate-650 dark:hover:text-white p-1 shrink-0"
                  >
                    <XMarkIcon className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── Category Dropdown ── */}
          <div
            className="relative flex-1 flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-orange-50/60 dark:hover:bg-slate-700/50 transition-colors group"
            onClick={() => setActiveDropdown(activeDropdown === 'category' ? null : 'category')}
          >
            <div className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/20 group-hover:bg-purple-200 dark:group-hover:bg-purple-950/30 transition-colors">
              <TagIcon className="h-5 w-5 text-purple-650 dark:text-purple-400" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Category</p>
              <div className="flex items-center justify-between gap-1 mt-0.5">
                <p className={`text-sm font-semibold truncate ${category !== 'ALL' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                  {getCategoryLabel()}
                </p>
                <ChevronDownIcon className={`h-3 w-3 text-slate-400 transition-transform duration-200 shrink-0 ${activeDropdown === 'category' ? 'rotate-180' : ''}`} />
              </div>
            </div>

            {/* Category Dropdown Popup */}
            {activeDropdown === 'category' && (
              <div className="absolute top-full left-0 mt-3 w-full md:w-[720px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-150 dark:border-slate-700 p-6 z-50 animate-in fade-in slide-in-from-top-3">
                <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-left font-[Syne]">CHOOSE YOUR TRAVEL STYLE</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {categoryOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={(e) => {
                        e.stopPropagation()
                        setCategory(opt.value)
                        setActiveDropdown(null)
                      }}
                      className={`flex flex-col items-center justify-center p-5 rounded-2xl border text-center transition duration-300 ${
                        category === opt.value
                          ? 'border-crimson bg-crimson/5 shadow-sm'
                          : 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-650 hover:shadow-sm'
                      }`}
                    >
                      <span className="text-3xl mb-3 block leading-none">{opt.emoji}</span>
                      <span className="text-slate-900 dark:text-white font-bold text-sm font-[Syne]">{opt.label}</span>
                      <span className="text-slate-450 dark:text-slate-400 text-[10px] mt-1 font-medium leading-tight">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Duration Dropdown ── */}
          <div
            className="relative flex-1 flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-orange-50/60 dark:hover:bg-slate-700/50 transition-colors group"
            onClick={() => setActiveDropdown(activeDropdown === 'duration' ? null : 'duration')}
          >
            <div className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-sky-100 dark:bg-sky-900/20 group-hover:bg-sky-200 dark:group-hover:bg-sky-950/30 transition-colors">
              <ClockIcon className="h-5 w-5 text-sky-600 dark:text-sky-400" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Duration</p>
              <div className="flex items-center justify-between gap-1 mt-0.5">
                <p className={`text-sm font-semibold truncate ${duration !== 'ALL' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                  {getDurationLabel()}
                </p>
                <ChevronDownIcon className={`h-3 w-3 text-slate-400 transition-transform duration-200 shrink-0 ${activeDropdown === 'duration' ? 'rotate-180' : ''}`} />
              </div>
            </div>

            {/* Duration Dropdown Popup */}
            {activeDropdown === 'duration' && (
              <div className="absolute top-full left-0 md:left-1/2 md:-translate-x-1/2 mt-3 w-full md:w-[320px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-150 dark:border-slate-700 p-5 z-50 animate-in fade-in slide-in-from-top-3">
                <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-left font-[Syne]">CHOOSE DURATION</h3>
                <div className="flex flex-col gap-2">
                  {durationOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={(e) => {
                        e.stopPropagation()
                        setDuration(opt.value)
                        setActiveDropdown(null)
                      }}
                      className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition duration-200 ${
                        duration === opt.value
                          ? 'border-crimson bg-crimson/5 shadow-sm'
                          : 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <span className="text-xl leading-none">{opt.emoji}</span>
                      <div className="min-w-0">
                        <p className="text-slate-900 dark:text-white font-bold text-xs">{opt.label}</p>
                        <p className="text-slate-450 dark:text-slate-400 text-[10px] mt-0.5 font-medium leading-none">{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Budget Dropdown ── */}
          <div
            className="relative flex-1 flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-orange-50/60 dark:hover:bg-slate-700/50 transition-colors group"
            onClick={() => setActiveDropdown(activeDropdown === 'budget' ? null : 'budget')}
          >
            <div className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/20 group-hover:bg-green-200 dark:group-hover:bg-green-950/30 transition-colors">
              <CurrencyRupeeIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Budget</p>
              <div className="flex items-center justify-between gap-1 mt-0.5">
                <p className={`text-sm font-semibold truncate ${budget !== 'ALL' ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                  {getBudgetLabel()}
                </p>
                <ChevronDownIcon className={`h-3 w-3 text-slate-400 transition-transform duration-200 shrink-0 ${activeDropdown === 'budget' ? 'rotate-180' : ''}`} />
              </div>
            </div>

            {/* Budget Dropdown Popup */}
            {activeDropdown === 'budget' && (
              <div className="absolute top-full right-0 mt-3 w-full md:w-[320px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-150 dark:border-slate-700 p-5 z-50 animate-in fade-in slide-in-from-top-3">
                <h3 className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-left font-[Syne]">CHOOSE BUDGET RANGE</h3>
                <div className="flex flex-col gap-2">
                  {budgetOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={(e) => {
                        e.stopPropagation()
                        setBudget(opt.value)
                        setActiveDropdown(null)
                      }}
                      className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition duration-200 ${
                        budget === opt.value
                          ? 'border-crimson bg-crimson/5 shadow-sm'
                          : 'border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <span className="text-xl leading-none">{opt.emoji}</span>
                      <div className="min-w-0">
                        <p className="text-slate-900 dark:text-white font-bold text-xs">{opt.label}</p>
                        <p className="text-slate-450 dark:text-slate-400 text-[10px] mt-0.5 font-medium leading-none">{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Action Buttons ── */}
          <div className="flex flex-row md:flex-col lg:flex-row items-center justify-center shrink-0 gap-2 px-5 py-4 rounded-br-2xl md:rounded-bl-none md:rounded-br-2xl">
            <button
              onClick={applyFilters}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-crimson to-crimson/95 hover:from-crimson hover:to-crimson text-white px-6 py-3 rounded-xl font-bold text-xs shadow-lg shadow-crimson/20 hover:-translate-y-0.5 active:scale-95 transition-all whitespace-nowrap min-w-[100px]"
            >
              Search
            </button>
            <button
              onClick={clearFilters}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-650 dark:text-slate-350 px-5 py-3 rounded-xl font-bold text-xs hover:-translate-y-0.5 active:scale-95 transition-all whitespace-nowrap"
            >
              Clear
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
