'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon, PencilSquareIcon } from '@heroicons/react/24/outline'

interface Review {
  id: string
  rating: number
  comment: string
  createdAt: string
  user: { name: string }
  package: { title: string; destination: string }
  isGuest?: boolean
}

const SEED_REVIEWS: Review[] = [
  { id: 's1', rating: 5, comment: 'Absolutely breathtaking trip to Kashmir! Every detail was handled perfectly. The houseboat stay was a dream come true. Will book again without hesitation.', createdAt: '2025-12-10T08:00:00Z', user: { name: 'Priya Sharma' }, package: { title: 'Kashmir Delight', destination: 'Kashmir' } },
  { id: 's2', rating: 5, comment: 'Kerala backwater cruise was magical. The food, the scenery, the guides — everything was 10/10. Travel Sphere made our anniversary unforgettable!', createdAt: '2025-11-22T10:00:00Z', user: { name: 'Rahul & Meena Joshi' }, package: { title: 'Kerala Backwaters', destination: 'Kerala' } },
  { id: 's3', rating: 4, comment: 'Rajasthan heritage tour was stunning. Loved the camel ride and the forts. The team was super responsive on WhatsApp whenever we had questions.', createdAt: '2025-10-05T14:00:00Z', user: { name: 'Ankit Verma' }, package: { title: 'Rajasthan Royal', destination: 'Rajasthan' } },
  { id: 's4', rating: 5, comment: 'Goa trip with the family was a blast! Kids loved the beaches, we loved the relaxed vibe and great hotel pick. Transparent pricing — no surprise charges at all.', createdAt: '2026-01-15T09:00:00Z', user: { name: 'Sneha Patil' }, package: { title: 'Goa Family Fun', destination: 'Goa' } },
  { id: 's5', rating: 5, comment: 'Trekked to Kedarnath with Travel Sphere\'s pilgrimage package. Everything from transport to accommodation was organised flawlessly. Truly a spiritual journey.', createdAt: '2026-02-20T06:00:00Z', user: { name: 'Suresh Kumar' }, package: { title: 'Char Dham Yatra', destination: 'Uttarakhand' } },
  { id: 's6', rating: 4, comment: 'Solo trip to Manali was exactly what I needed. The adventure activities were thrilling and the guides were knowledgeable. Highly recommended for solo travellers!', createdAt: '2026-03-08T11:00:00Z', user: { name: 'Divya Nair' }, package: { title: 'Manali Adventure', destination: 'Himachal Pradesh' } },
  { id: 's7', rating: 5, comment: 'Best travel agency in India, period. The Andaman Islands trip was picture-perfect. Crystal clear water, white sand beaches. 24/7 support team was always just a call away.', createdAt: '2026-04-02T13:00:00Z', user: { name: 'Arjun & Pooja Mehta' }, package: { title: 'Andaman Bliss', destination: 'Andaman' } },
]

const avatarColors = [
  'from-orange-400 to-rose-500', 'from-violet-400 to-indigo-500',
  'from-emerald-400 to-teal-500', 'from-sky-400 to-blue-500',
  'from-amber-400 to-orange-500', 'from-pink-400 to-fuchsia-500',
]

function StarRating({ rating, interactive = false, onChange }: { rating: number; interactive?: boolean; onChange?: (r: number) => void }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type={interactive ? 'button' : undefined} disabled={!interactive}
          onClick={() => interactive && onChange?.(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={`text-xl leading-none transition-transform duration-150 ${interactive ? 'cursor-pointer hover:scale-125' : 'cursor-default'}`}
          style={{ color: star <= (hovered || rating) ? '#f59e0b' : '#d1d5db' }}
        >★</button>
      ))}
    </div>
  )
}

function ReviewCard({ review }: { review: Review }) {
  const initials = review.user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const colorIdx = review.id.charCodeAt(0) % avatarColors.length
  const date = new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className="relative flex flex-col justify-between h-full min-h-[240px] rounded-2xl p-6 bg-white border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <span className="absolute top-4 right-5 text-6xl font-serif text-orange-100 leading-none pointer-events-none select-none" aria-hidden>"</span>
      <div className="relative">
        <StarRating rating={review.rating} />
        <p className="mt-3 text-slate-700 text-sm leading-relaxed font-medium line-clamp-4">"{review.comment}"</p>
      </div>
      <div className="mt-5 flex items-center gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${avatarColors[colorIdx]} text-white text-sm font-black shadow-md`}>{initials}</div>
        <div>
          <p className="text-sm font-bold text-slate-900">{review.user.name}</p>
          <p className="text-xs text-slate-500">{review.package.destination || review.package.title} · {date}</p>
        </div>
        {review.isGuest && (
          <span className="ml-auto text-[10px] font-bold uppercase tracking-widest bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full border border-orange-100">New</span>
        )}
      </div>
    </div>
  )
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(SEED_REVIEWS)
  const [filterRating, setFilterRating] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', destination: '', comment: '', rating: 5 })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formError, setFormError] = useState('')

  const searchParams = useSearchParams()

  useEffect(() => {
    fetch('/api/reviews')
      .then(r => r.json())
      .then(data => { if (data.reviews?.length) setReviews([...data.reviews, ...SEED_REVIEWS]) })
      .catch(() => {})
  }, [])

  // Auto-open modal when ?write=true is in URL (from home page CTA)
  useEffect(() => {
    if (searchParams.get('write') === 'true') {
      setShowModal(true)
    }
  }, [searchParams])

  const filtered = filterRating === 0 ? reviews : reviews.filter(r => r.rating === filterRating)
  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '5.0'
  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({ star, count: reviews.filter(r => r.rating === star).length }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')
    if (!form.name.trim() || !form.comment.trim()) { setFormError('Please fill in your name and review.'); return }
    setSubmitting(true)
    try {
      const res = await fetch('/api/reviews', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (data.success) {
        setReviews(prev => [data.review, ...prev])
        setSubmitted(true)
        setTimeout(() => { setShowModal(false); setSubmitted(false); setForm({ name: '', destination: '', comment: '', rating: 5 }) }, 2200)
      } else { setFormError(data.error || 'Something went wrong.') }
    } catch { setFormError('Network error. Please try again.') }
    finally { setSubmitting(false) }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-orange-900 text-white py-16 px-4">
        <div className="mx-auto max-w-7xl">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white mb-8 transition-colors group">
            <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/20 border border-orange-400/30 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-orange-300 mb-4">
                ★ Traveller Stories
              </span>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight">What Our Customers Say</h1>
              <p className="mt-3 text-slate-300 text-base max-w-xl">
                Real experiences shared by {reviews.length}+ happy travellers across India.
              </p>
            </div>
            {/* Rating summary */}
            <div className="flex items-center gap-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4 shrink-0">
              <div className="text-center">
                <div className="text-5xl font-black text-amber-400">{avgRating}</div>
                <div className="flex justify-center mt-1">
                  {[1,2,3,4,5].map(s => <span key={s} className="text-amber-400 text-lg">★</span>)}
                </div>
                <div className="text-xs text-slate-300 mt-1">{reviews.length} reviews</div>
              </div>
              <div className="space-y-1.5 min-w-[140px]">
                {ratingCounts.map(({ star, count }) => (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-xs text-slate-300 w-3">{star}</span>
                    <span className="text-amber-400 text-xs">★</span>
                    <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: reviews.length ? `${(count / reviews.length) * 100}%` : '0%' }} />
                    </div>
                    <span className="text-xs text-slate-400 w-4">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mx-auto max-w-7xl px-4 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Filter by stars */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-bold text-slate-600">Filter:</span>
          {[0, 5, 4, 3, 2, 1].map(star => (
            <button key={star} onClick={() => setFilterRating(star)}
              className={`px-3 py-1.5 text-sm rounded-full font-semibold border transition-all ${filterRating === star ? 'bg-orange-500 text-white border-orange-500 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-orange-300 hover:text-orange-600'}`}
            >
              {star === 0 ? 'All' : `${star} ★`}
            </button>
          ))}
          <span className="text-sm text-slate-400 ml-1">({filtered.length} reviews)</span>
        </div>

        {/* Write Review CTA */}
        <button onClick={() => setShowModal(true)} id="write-review-btn"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white text-sm font-bold px-6 py-2.5 rounded-xl shadow-lg hover:shadow-orange-300/40 hover:shadow-xl active:scale-95 transition-all duration-200"
        >
          <PencilSquareIcon className="h-4 w-4" />
          Share Your Experience
        </button>
      </div>

      {/* Reviews Grid */}
      <div className="mx-auto max-w-7xl px-4 pb-16">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <div className="text-5xl mb-4">🔍</div>
            <p className="font-semibold">No reviews found for this rating.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(review => <ReviewCard key={review.id} review={review} />)}
          </div>
        )}
      </div>

      {/* Write Review Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(6px)' }}
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          role="dialog" aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl border border-slate-100 relative animate-in fade-in slide-in-from-bottom-4">
            <button onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
              </svg>
            </button>

            {submitted ? (
              <div className="py-10 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-4xl">🎉</div>
                <h3 className="text-2xl font-black text-slate-900">Thank You!</h3>
                <p className="mt-2 text-slate-500">Your review has been submitted successfully.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="text-center mb-2">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-rose-500 text-white text-xl shadow-lg">★</div>
                  <h3 className="text-2xl font-black text-slate-900">Write a Review</h3>
                  <p className="text-sm text-slate-500 mt-1">Share your travel experience with others</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="rv-name" className="block text-xs font-bold uppercase tracking-wide text-slate-600 mb-1.5">Your Name *</label>
                    <input id="rv-name" type="text" placeholder="e.g. Priya Sharma" value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-900 placeholder-slate-400 focus:border-orange-400 focus:bg-white focus:outline-none transition"
                      maxLength={60} required />
                  </div>
                  <div>
                    <label htmlFor="rv-dest" className="block text-xs font-bold uppercase tracking-wide text-slate-600 mb-1.5">Destination Visited</label>
                    <input id="rv-dest" type="text" placeholder="e.g. Kashmir, Goa…" value={form.destination}
                      onChange={e => setForm(f => ({ ...f, destination: e.target.value }))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-900 placeholder-slate-400 focus:border-orange-400 focus:bg-white focus:outline-none transition"
                      maxLength={80} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-600 mb-1.5">Your Rating *</label>
                  <div className="flex items-center gap-3">
                    <StarRating rating={form.rating} interactive onChange={r => setForm(f => ({ ...f, rating: r }))} />
                    <span className="text-sm font-bold text-amber-600">{['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][form.rating]}</span>
                  </div>
                </div>

                <div>
                  <label htmlFor="rv-comment" className="block text-xs font-bold uppercase tracking-wide text-slate-600 mb-1.5">Your Review *</label>
                  <textarea id="rv-comment" rows={4} placeholder="Tell us about your experience…" value={form.comment}
                    onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 placeholder-slate-400 focus:border-orange-400 focus:bg-white focus:outline-none transition resize-none"
                    maxLength={500} required />
                  <p className="text-right text-xs text-slate-400 mt-1">{form.comment.length}/500</p>
                </div>

                {formError && <p className="rounded-xl bg-red-50 border border-red-100 px-4 py-2.5 text-sm text-red-600 font-medium">{formError}</p>}

                <button type="submit" disabled={submitting}
                  className="w-full rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 py-3.5 text-sm font-bold text-white shadow-lg hover:shadow-orange-300/40 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {submitting ? 'Submitting…' : 'Submit Review ★'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
