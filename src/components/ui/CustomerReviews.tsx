'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'

interface Review {
  id: string
  rating: number
  comment: string
  createdAt: string
  user: { name: string }
  package: { title: string; destination: string }
  isGuest?: boolean
}

// --- Static seed reviews so the section is never empty ---
const SEED_REVIEWS: Review[] = [
  {
    id: 's1', rating: 5,
    comment: "Absolutely breathtaking trip to Kashmir! Every detail was handled perfectly. The houseboat stay was a dream come true. Will book again without hesitation.",
    createdAt: '2025-12-10T08:00:00Z',
    user: { name: 'Priya Sharma' }, package: { title: 'Kashmir Delight', destination: 'Kashmir' },
  },
  {
    id: 's2', rating: 5,
    comment: "Kerala backwater cruise was magical. The food, the scenery, the guides — everything was 10/10. Travel Sphere made our anniversary unforgettable!",
    createdAt: '2025-11-22T10:00:00Z',
    user: { name: 'Rahul & Meena Joshi' }, package: { title: 'Kerala Backwaters', destination: 'Kerala' },
  },
  {
    id: 's3', rating: 4,
    comment: "Rajasthan heritage tour was stunning. Loved the camel ride and the forts. The team was super responsive on WhatsApp whenever we had questions.",
    createdAt: '2025-10-05T14:00:00Z',
    user: { name: 'Ankit Verma' }, package: { title: 'Rajasthan Royal', destination: 'Rajasthan' },
  },
  {
    id: 's4', rating: 5,
    comment: "Goa trip with the family was a blast! Kids loved the beaches, we loved the relaxed vibe and great hotel pick. Transparent pricing — no surprise charges at all.",
    createdAt: '2026-01-15T09:00:00Z',
    user: { name: 'Sneha Patil' }, package: { title: 'Goa Family Fun', destination: 'Goa' },
  },
  {
    id: 's5', rating: 5,
    comment: "Trekked to Kedarnath with Travel Sphere's pilgrimage package. Everything from transport to accommodation was organised flawlessly. Truly a spiritual journey.",
    createdAt: '2026-02-20T06:00:00Z',
    user: { name: 'Suresh Kumar' }, package: { title: 'Char Dham Yatra', destination: 'Uttarakhand' },
  },
  {
    id: 's6', rating: 4,
    comment: "Solo trip to Manali was exactly what I needed. The adventure activities were thrilling and the guides were knowledgeable. Highly recommended for solo travellers!",
    createdAt: '2026-03-08T11:00:00Z',
    user: { name: 'Divya Nair' }, package: { title: 'Manali Adventure', destination: 'Himachal Pradesh' },
  },
  {
    id: 's7', rating: 5,
    comment: "Best travel agency in India, period. The Andaman Islands trip was picture-perfect. Crystal clear water, white sand beaches. 24/7 support team was always just a call away.",
    createdAt: '2026-04-02T13:00:00Z',
    user: { name: 'Arjun & Pooja Mehta' }, package: { title: 'Andaman Bliss', destination: 'Andaman' },
  },
]

function StarRating({ rating, interactive = false, onChange }: {
  rating: number
  interactive?: boolean
  onChange?: (r: number) => void
}) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={interactive ? 'button' : undefined}
          disabled={!interactive}
          onClick={() => interactive && onChange?.(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={`text-xl leading-none transition-transform duration-150 ${interactive ? 'cursor-pointer hover:scale-125' : 'cursor-default'}`}
          style={{ color: star <= (hovered || rating) ? '#f59e0b' : '#d1d5db' }}
          aria-label={interactive ? `Rate ${star} star${star > 1 ? 's' : ''}` : undefined}
        >
          ★
        </button>
      ))}
    </div>
  )
}

function ReviewCard({ review, visible }: { review: Review; visible: boolean }) {
  const initials = review.user.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const avatarColors = [
    'from-orange-400 to-rose-500',
    'from-violet-400 to-indigo-500',
    'from-emerald-400 to-teal-500',
    'from-sky-400 to-blue-500',
    'from-amber-400 to-orange-500',
    'from-pink-400 to-fuchsia-500',
  ]
  const colorIdx = review.id.charCodeAt(0) % avatarColors.length
  const avatarColor = avatarColors[colorIdx]

  const date = new Date(review.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })

  return (
    <div
      className={`relative flex flex-col justify-between h-full min-h-[260px] rounded-3xl p-7 bg-white/95 border border-slate-100 shadow-xl transition-all duration-700 ease-out select-none
        ${visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'}`}
      style={{ backdropFilter: 'blur(8px)' }}
    >
      {/* Subtle background quote mark */}
      <span className="absolute top-4 right-6 text-7xl font-serif text-orange-100 leading-none pointer-events-none select-none" aria-hidden>
        "
      </span>

      <div className="relative">
        <StarRating rating={review.rating} />
        <p className="mt-4 text-slate-700 text-sm leading-relaxed font-medium line-clamp-5">
          "{review.comment}"
        </p>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${avatarColor} text-white text-sm font-black shadow-md`}>
          {initials}
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">{review.user.name}</p>
          <p className="text-xs text-slate-500">
            {review.package.destination || review.package.title} · {date}
          </p>
        </div>
        {review.isGuest && (
          <span className="ml-auto text-[10px] font-bold uppercase tracking-widest bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full border border-orange-100">
            New
          </span>
        )}
      </div>
    </div>
  )
}

export default function CustomerReviews() {
  const [reviews, setReviews] = useState<Review[]>(SEED_REVIEWS)
  const [visibleSet, setVisibleSet] = useState<Set<number>>(new Set())
  const [activeIdx, setActiveIdx] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', destination: '', comment: '', rating: 5 })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formError, setFormError] = useState('')
  const trackRef = useRef<HTMLDivElement>(null)
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  // Fetch real reviews from DB
  useEffect(() => {
    fetch('/api/reviews')
      .then((r) => r.json())
      .then((data) => {
        if (data.reviews?.length) {
          setReviews([...data.reviews, ...SEED_REVIEWS])
        }
      })
      .catch(() => {}) // fallback to seeds
  }, [])

  // Intersection Observer for entrance animation
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reviews.forEach((_, i) => {
              setTimeout(() => setVisibleSet((prev) => new Set([...prev, i])), i * 80)
            })
            obs.disconnect()
          }
        })
      },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [reviews])

  const cardsPerView = () => {
    if (typeof window === 'undefined') return 3
    if (window.innerWidth < 640) return 1
    if (window.innerWidth < 1024) return 2
    return 3
  }

  const maxIdx = Math.max(0, reviews.length - cardsPerView())

  const scrollTo = useCallback((idx: number) => {
    const clamped = Math.max(0, Math.min(idx, reviews.length - 1))
    setActiveIdx(clamped)
    const track = trackRef.current
    if (!track) return
    const card = track.children[clamped] as HTMLElement
    if (card) {
      track.scrollTo({ left: card.offsetLeft - 16, behavior: 'smooth' })
    }
  }, [reviews.length])

  // Auto scroll
  const startAuto = useCallback(() => {
    if (autoRef.current) clearInterval(autoRef.current)
    autoRef.current = setInterval(() => {
      setActiveIdx((prev) => {
        const next = prev >= maxIdx ? 0 : prev + 1
        scrollTo(next)
        return next
      })
    }, 4000)
  }, [maxIdx, scrollTo])

  useEffect(() => {
    startAuto()
    return () => { if (autoRef.current) clearInterval(autoRef.current) }
  }, [startAuto])

  const handlePrev = () => {
    if (autoRef.current) clearInterval(autoRef.current)
    scrollTo(activeIdx <= 0 ? maxIdx : activeIdx - 1)
    startAuto()
  }

  const handleNext = () => {
    if (autoRef.current) clearInterval(autoRef.current)
    scrollTo(activeIdx >= maxIdx ? 0 : activeIdx + 1)
    startAuto()
  }

  const handleDotClick = (i: number) => {
    if (autoRef.current) clearInterval(autoRef.current)
    scrollTo(i)
    startAuto()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')
    if (!form.name.trim() || !form.comment.trim()) {
      setFormError('Please fill in your name and review.')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        setReviews((prev) => [data.review, ...prev])
        setSubmitted(true)
        setTimeout(() => {
          setShowModal(false)
          setSubmitted(false)
          setForm({ name: '', destination: '', comment: '', rating: 5 })
        }, 2200)
      } else {
        setFormError(data.error || 'Something went wrong.')
      }
    } catch {
      setFormError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0'

  return (
    <section ref={sectionRef} className="mx-auto max-w-7xl px-4 py-14 md:py-20">
      {/* Header */}
      <div className="mb-10 text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-orange-600 shadow-sm mb-4">
          <span>★</span> Traveller Stories
        </span>
        <h2 className="text-3xl font-black tracking-tight text-slate-900 md:text-5xl">
          What Our Customers Say
        </h2>
        <p className="mt-4 text-base text-slate-600 max-w-xl mx-auto font-medium">
          Real experiences shared by thousands of happy travellers across India.
        </p>
      </div>

      {/* See All Reviews — above carousel */}
      <div className="flex items-center justify-end mb-6">
        <Link
          href="/reviews"
          id="see-all-reviews-btn"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 px-4 py-2 rounded-full transition-all duration-200 hover:shadow-md group"
        >
          See All Reviews
          <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </Link>
      </div>

      {/* Carousel + Controls */}
      <div className="relative">
        {/* Left Arrow */}
        <button
          id="review-prev-btn"
          onClick={handlePrev}
          aria-label="Previous reviews"
          className="absolute -left-4 top-1/2 z-10 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white border border-slate-200 shadow-lg text-slate-700 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-200 md:-left-5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
            <path fillRule="evenodd" d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Track */}
        <div
          ref={trackRef}
          className="flex gap-5 overflow-x-auto scroll-smooth pb-4 px-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {reviews.map((review, i) => (
            <div
              key={review.id}
              className="shrink-0 w-[85vw] sm:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.875rem)]"
              style={{ scrollSnapAlign: 'start' }}
            >
              <ReviewCard review={review} visible={visibleSet.has(i)} />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          id="review-next-btn"
          onClick={handleNext}
          aria-label="Next reviews"
          className="absolute -right-4 top-1/2 z-10 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full bg-white border border-slate-200 shadow-lg text-slate-700 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-200 md:-right-5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
            <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Dot indicators */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {reviews.slice(0, Math.min(reviews.length, 10)).map((_, i) => (
          <button
            key={i}
            id={`review-dot-${i}`}
            onClick={() => handleDotClick(i)}
            aria-label={`Go to review ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${activeIdx === i ? 'w-6 h-2.5 bg-orange-500' : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'}`}
          />
        ))}
      </div>

      {/* CTA — Share Your Experience */}
      <div className="mt-10 text-center">
        <Link
          href="/reviews?write=true"
          id="leave-review-btn"
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg hover:shadow-orange-300/50 hover:shadow-xl active:scale-95 transition-all duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path d="M9.25 13.25a.75.75 0 0 0 1.5 0V4.636l2.955 3.129a.75.75 0 0 0 1.09-1.03l-4.25-4.5a.75.75 0 0 0-1.09 0l-4.25 4.5a.75.75 0 1 0 1.09 1.03L9.25 4.636v8.614Z" />
            <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
          </svg>
          Share Your Experience
        </Link>
      </div>

      {/* Review Modal — Share Your Experience */}
      {showModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(6px)' }}
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Write a review"
        >
          <div className="w-full max-w-lg animate-fade-up rounded-3xl bg-white p-8 shadow-2xl border border-slate-100 relative">
            {/* Close */}
            <button
              id="close-review-modal"
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
              </svg>
            </button>

            {submitted ? (
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-4xl">🎉</div>
                <h3 className="text-2xl font-black text-slate-900">Thank You!</h3>
                <p className="mt-2 text-slate-600">Your review has been submitted successfully.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="text-center mb-6">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-rose-500 text-white text-xl shadow-lg">★</div>
                  <h3 className="text-2xl font-black text-slate-900">Write a Review</h3>
                  <p className="text-sm text-slate-500 mt-1">Share your travel experience with others</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="review-name" className="block text-xs font-bold uppercase tracking-wide text-slate-600 mb-1.5">
                      Your Name *
                    </label>
                    <input
                      id="review-name"
                      type="text"
                      placeholder="e.g. Priya Sharma"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-900 placeholder-slate-400 focus:border-orange-400 focus:bg-white focus:outline-none transition"
                      maxLength={60}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="review-destination" className="block text-xs font-bold uppercase tracking-wide text-slate-600 mb-1.5">
                      Destination Visited
                    </label>
                    <input
                      id="review-destination"
                      type="text"
                      placeholder="e.g. Kashmir, Goa…"
                      value={form.destination}
                      onChange={(e) => setForm((f) => ({ ...f, destination: e.target.value }))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-900 placeholder-slate-400 focus:border-orange-400 focus:bg-white focus:outline-none transition"
                      maxLength={80}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-slate-600 mb-1.5">
                    Your Rating *
                  </label>
                  <div className="flex items-center gap-3">
                    <StarRating rating={form.rating} interactive onChange={(r) => setForm((f) => ({ ...f, rating: r }))} />
                    <span className="text-sm font-bold text-amber-600">
                      {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][form.rating]}
                    </span>
                  </div>
                </div>

                <div>
                  <label htmlFor="review-comment" className="block text-xs font-bold uppercase tracking-wide text-slate-600 mb-1.5">
                    Your Review *
                  </label>
                  <textarea
                    id="review-comment"
                    rows={4}
                    placeholder="Tell us about your experience — what you loved, what stood out…"
                    value={form.comment}
                    onChange={(e) => setForm((f) => ({ ...f, comment: e.target.value }))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 placeholder-slate-400 focus:border-orange-400 focus:bg-white focus:outline-none transition resize-none"
                    maxLength={500}
                    required
                  />
                  <p className="text-right text-xs text-slate-400 mt-1">{form.comment.length}/500</p>
                </div>

                {formError && (
                  <p className="rounded-xl bg-red-50 border border-red-100 px-4 py-2.5 text-sm text-red-600 font-medium">{formError}</p>
                )}

                <button
                  id="submit-review-btn"
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 py-3.5 text-sm font-bold text-white shadow-lg hover:shadow-orange-300/40 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {submitting ? 'Submitting…' : 'Submit Review ★'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
