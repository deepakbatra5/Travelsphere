'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

const categories = ['ALL', 'SOLO', 'FAMILY', 'GROUP', 'PILGRIMAGE', 'ADVENTURE', 'CORPORATE']
const durations = ['ALL', '1-3', '4-6', '7-10', '10+']
const budgets = [
  { label: 'All Budgets', value: 'ALL' },
  { label: 'Under Rs 10,000', value: '0-10000' },
  { label: 'Rs 10k to 25k', value: '10000-25000' },
  { label: 'Rs 25k to 50k', value: '25000-50000' },
  { label: 'Above Rs 50k', value: '50000-999999' },
]

export default function PackageFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || 'ALL')
  const [duration, setDuration] = useState(searchParams.get('duration') || 'ALL')
  const [budget, setBudget] = useState(searchParams.get('budget') || 'ALL')

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (category !== 'ALL') params.set('category', category)
    if (duration !== 'ALL') params.set('duration', duration)
    if (budget !== 'ALL') params.set('budget', budget)
    router.push(`/packages?${params.toString()}`)
  }

  const clearFilters = () => {
    setSearch('')
    setCategory('ALL')
    setDuration('ALL')
    setBudget('ALL')
    router.push('/packages')
  }

  return (
    <div className="surface-card mb-8 rounded-3xl p-5 md:p-6">
      <div className="mb-5">
        <label className="mb-2 block text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
          Search Packages
        </label>
        <input
          type="text"
          placeholder="Search by destination or package name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c === 'ALL' ? 'All Categories' : c}</option>
          ))}
        </select>

        <select
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
        >
          {durations.map((d) => (
            <option key={d} value={d}>{d === 'ALL' ? 'All Durations' : `${d} Days`}</option>
          ))}
        </select>

        <select
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
        >
          {budgets.map((b) => (
            <option key={b.value} value={b.value}>{b.label}</option>
          ))}
        </select>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={applyFilters}
          className="rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-2 text-sm font-semibold text-white hover:from-orange-600 hover:to-amber-600"
        >
          Apply Filters
        </button>

        <button
          onClick={clearFilters}
          className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
        >
          Clear
        </button>
      </div>
    </div>
  )
}
