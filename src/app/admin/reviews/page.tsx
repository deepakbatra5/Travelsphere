'use client'

import { useEffect, useState, useMemo } from 'react'
import {
  StarIcon as SolidStarIcon,
  TrashIcon,
  BookmarkIcon as SolidBookmarkIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/solid'
import {
  StarIcon as OutlineStarIcon,
  BookmarkIcon as OutlineBookmarkIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline'
import AdminToast, { AdminToastMessage } from '@/components/ui/AdminToast'

interface Review {
  id: string
  rating: number
  comment: string
  isPinned: boolean
  createdAt: string
  user: { name: string; email: string }
  package: { title: string; destination: string }
  isGuest: boolean
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<'all' | 'user' | 'guest'>('all')
  const [pinnedFilter, setPinnedFilter] = useState<'all' | 'pinned' | 'unpinned'>('all')

  const [toast, setToast] = useState<AdminToastMessage | null>(null)
  const [reviewToDelete, setReviewToDelete] = useState<Review | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Fetch reviews from API
  const fetchReviews = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/reviews')
      const data = await res.json()
      if (res.ok) {
        setReviews(data.reviews || [])
      } else {
        setToast({ type: 'error', text: data.error || 'Failed to load reviews' })
      }
    } catch {
      setToast({ type: 'error', text: 'Network error. Failed to load reviews.' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  // Metrics
  const metrics = useMemo(() => {
    const total = reviews.length
    const pinned = reviews.filter((r) => r.isPinned).length
    const avg = total
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1)
      : '0.0'
    const guestCount = reviews.filter((r) => r.isGuest).length
    const userCount = total - guestCount

    return { total, pinned, avg, guestCount, userCount }
  }, [reviews])

  // Toggle Pinned Status
  const handleTogglePin = async (review: Review) => {
    if (actionLoading) return
    const newPinnedState = !review.isPinned

    // Enforce 7 pinned reviews limit on client
    if (newPinnedState && metrics.pinned >= 7) {
      setToast({
        type: 'error',
        text: 'You can pin a maximum of 7 reviews. Please unpin another review first.',
      })
      return
    }

    setActionLoading(review.id)
    try {
      const res = await fetch(`/api/admin/reviews/${review.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPinned: newPinnedState }),
      })
      const data = await res.json()

      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) => (r.id === review.id ? { ...r, isPinned: newPinnedState } : r))
        )
        setToast({
          type: 'success',
          text: newPinnedState ? 'Review pinned to customer page' : 'Review unpinned successfully',
        })
      } else {
        setToast({ type: 'error', text: data.error || 'Failed to update review' })
      }
    } catch {
      setToast({ type: 'error', text: 'Network error. Failed to update review.' })
    } finally {
      setActionLoading(null)
    }
  }

  // Delete Review
  const handleDeleteReview = async () => {
    if (!reviewToDelete || actionLoading) return

    setActionLoading(reviewToDelete.id)
    try {
      const res = await fetch(`/api/admin/reviews/${reviewToDelete.id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== reviewToDelete.id))
        setToast({ type: 'success', text: 'Review deleted successfully' })
      } else {
        const data = await res.json()
        setToast({ type: 'error', text: data.error || 'Failed to delete review' })
      }
    } catch {
      setToast({ type: 'error', text: 'Network error. Failed to delete review.' })
    } finally {
      setActionLoading(null)
      setReviewToDelete(null)
    }
  }

  // Search & Filter Logic
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      const matchesSearch =
        r.user.name.toLowerCase().includes(search.toLowerCase()) ||
        r.comment.toLowerCase().includes(search.toLowerCase()) ||
        r.package.title.toLowerCase().includes(search.toLowerCase()) ||
        r.package.destination.toLowerCase().includes(search.toLowerCase())

      const matchesRating = ratingFilter === 'all' || r.rating === ratingFilter
      const matchesType =
        typeFilter === 'all' || (typeFilter === 'guest' && r.isGuest) || (typeFilter === 'user' && !r.isGuest)
      const matchesPinned =
        pinnedFilter === 'all' ||
        (pinnedFilter === 'pinned' && r.isPinned) ||
        (pinnedFilter === 'unpinned' && !r.isPinned)

      return matchesSearch && matchesRating && matchesType && matchesPinned
    })
  }, [reviews, search, ratingFilter, typeFilter, pinnedFilter])

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      <AdminToast toast={toast} onClose={() => setToast(null)} />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Review Management</h1>
          <p className="text-gray-500 text-sm mt-1">
            Control which reviews are pinned to customer pages, view testimonials, or delete reviews.
          </p>
        </div>
        <button
          onClick={fetchReviews}
          className="inline-flex items-center gap-2 self-start md:self-auto px-4 py-2 border border-gray-200 rounded-xl bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
        >
          <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Reviews */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Reviews</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{metrics.total}</p>
            <div className="flex gap-2 text-xs text-gray-400 mt-2">
              <span className="bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-md font-medium text-slate-600">
                {metrics.userCount} Users
              </span>
              <span className="bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-md font-medium text-slate-600">
                {metrics.guestCount} Guests
              </span>
            </div>
          </div>
          <div className="h-12 w-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
            <ChatBubbleLeftRightIcon className="h-6 w-6" />
          </div>
        </div>

        {/* Pinned Reviews */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Featured Testimonials</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">
                {metrics.pinned} <span className="text-sm font-normal text-gray-400">/ 7 Pinned</span>
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <SolidBookmarkIcon className="h-6 w-6" />
            </div>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full mt-4 overflow-hidden border border-slate-50">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                metrics.pinned >= 7
                  ? 'bg-red-500'
                  : metrics.pinned > 4
                  ? 'bg-amber-500'
                  : 'bg-orange-500'
              }`}
              style={{ width: `${(metrics.pinned / 7) * 100}%` }}
            />
          </div>
        </div>

        {/* Avg Rating */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Average Rating</p>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="text-2xl font-bold text-slate-800">{metrics.avg}</p>
              <span className="text-xs font-semibold text-amber-500">★ Out of 5</span>
            </div>
            <div className="flex gap-0.5 mt-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <SolidStarIcon
                  key={s}
                  className={`h-3.5 w-3.5 ${
                    s <= Math.round(Number(metrics.avg)) ? 'text-amber-400' : 'text-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="h-12 w-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500">
            <SolidStarIcon className="h-6 w-6" />
          </div>
        </div>

        {/* Customer Experience Status */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Testimonial Fill</p>
            <p className="text-xl font-bold text-slate-800 mt-1">
              {metrics.pinned >= 7 ? 'Full' : 'Auto Fill Active'}
            </p>
            <p className="text-xs text-gray-400 mt-2 font-medium">
              {metrics.pinned >= 7
                ? 'Showing exact 7 pinned reviews'
                : `Showing ${metrics.pinned} pinned + ${Math.max(0, 7 - metrics.pinned)} recent reviews`}
            </p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-green-600 font-black text-sm">
            OK
          </div>
        </div>
      </div>

      {/* Filter and Search Panel */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          {/* Search bar */}
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-4 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search reviews by name, content, destination..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-orange-400 transition"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Rating Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-500 uppercase">Rating:</span>
              <select
                value={ratingFilter}
                onChange={(e) =>
                  setRatingFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))
                }
                className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 px-3 py-2 focus:outline-none focus:border-orange-400 cursor-pointer"
              >
                <option value="all">All Stars</option>
                <option value="5">5 Stars ★★★★★</option>
                <option value="4">4 Stars ★★★★</option>
                <option value="3">3 Stars ★★★</option>
                <option value="2">2 Stars ★★</option>
                <option value="1">1 Star ★</option>
              </select>
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-500 uppercase">Author:</span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 px-3 py-2 focus:outline-none focus:border-orange-400 cursor-pointer"
              >
                <option value="all">All Types</option>
                <option value="user">Registered Users</option>
                <option value="guest">Guests</option>
              </select>
            </div>

            {/* Pinned Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-500 uppercase">Status:</span>
              <select
                value={pinnedFilter}
                onChange={(e) => setPinnedFilter(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 px-3 py-2 focus:outline-none focus:border-orange-400 cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="pinned">Pinned (Featured)</option>
                <option value="unpinned">Unpinned</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter Summary Info */}
        <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-slate-100">
          <p>
            Showing {filteredReviews.length} of {reviews.length} reviews
          </p>
          {(search || ratingFilter !== 'all' || typeFilter !== 'all' || pinnedFilter !== 'all') && (
            <button
              onClick={() => {
                setSearch('')
                setRatingFilter('all')
                setTypeFilter('all')
                setPinnedFilter('all')
              }}
              className="text-orange-500 font-bold hover:underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Reviews list */}
      {loading ? (
        <div className="bg-white rounded-2xl py-20 border border-slate-100 shadow-sm flex flex-col items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
          <p className="text-gray-400 text-sm mt-3 font-semibold">Loading reviews...</p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="bg-white rounded-2xl py-16 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
          <ChatBubbleLeftRightIcon className="h-12 w-12 text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-700">No reviews found</h3>
          <p className="text-gray-400 text-xs mt-1 max-w-xs px-4">
            Try adjusting your search criteria or filters to see more reviews.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className={`bg-white rounded-2xl p-6 border transition-all duration-300 hover:shadow-md flex flex-col justify-between relative group ${
                review.isPinned
                  ? 'border-orange-200 ring-2 ring-orange-500/10 shadow-orange-50/20'
                  : 'border-slate-100 hover:border-slate-200'
              }`}
            >
              {/* Highlight background pill for pinned */}
              {review.isPinned && (
                <span className="absolute top-4 right-20 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                  Featured
                </span>
              )}

              <div>
                {/* Rating & Action buttons header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <SolidStarIcon
                        key={s}
                        className={`h-4 w-4 ${s <= review.rating ? 'text-amber-400' : 'text-gray-200'}`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Pin button */}
                    <button
                      onClick={() => handleTogglePin(review)}
                      disabled={actionLoading === review.id}
                      title={review.isPinned ? 'Remove from Featured' : 'Pin to Featured'}
                      className={`h-8 w-8 rounded-lg flex items-center justify-center border transition active:scale-90 disabled:opacity-50 ${
                        review.isPinned
                          ? 'bg-orange-500 border-orange-500 text-white hover:bg-orange-600'
                          : 'bg-white border-slate-200 text-slate-400 hover:text-orange-500 hover:border-orange-100 hover:bg-orange-50'
                      }`}
                    >
                      {review.isPinned ? (
                        <SolidBookmarkIcon className="h-4.5 w-4.5" />
                      ) : (
                        <OutlineBookmarkIcon className="h-4.5 w-4.5" />
                      )}
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={() => setReviewToDelete(review)}
                      disabled={actionLoading === review.id}
                      title="Delete Review"
                      className="h-8 w-8 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 flex items-center justify-center transition active:scale-90 disabled:opacity-50"
                    >
                      <TrashIcon className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>

                {/* Comment */}
                <p className="text-slate-700 text-sm leading-relaxed font-medium mb-5 italic">
                  "{review.comment}"
                </p>
              </div>

              {/* Author & Context Footer */}
              <div className="pt-4 border-t border-slate-50 space-y-2">
                <div className="flex items-start gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5 text-slate-500">
                    <UserIcon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-bold text-slate-900 leading-none">{review.user.name}</p>
                      {review.isGuest ? (
                        <span className="text-[9px] font-black uppercase tracking-wider bg-slate-100 border border-slate-200 text-slate-600 px-1.5 py-0.5 rounded">
                          Guest
                        </span>
                      ) : (
                        <span className="text-[9px] font-black uppercase tracking-wider bg-orange-50 border border-orange-100 text-orange-600 px-1.5 py-0.5 rounded">
                          User
                        </span>
                      )}
                    </div>
                    <p className="text-slate-400 text-xs mt-1 truncate max-w-48 leading-none" title={review.user.email}>
                      {review.user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 pl-1">
                  <MapPinIcon className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="truncate font-semibold text-slate-600">
                    {review.package.destination || review.package.title}
                  </span>
                  <span className="text-slate-300 font-normal select-none">·</span>
                  <span className="text-[10px] text-slate-400">
                    {new Date(review.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {reviewToDelete && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setReviewToDelete(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3.5 text-red-600 mb-3.5">
              <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center border border-red-100 shrink-0">
                <TrashIcon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Delete Review</h3>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed">
              Are you sure you want to permanently delete this review from{' '}
              <strong className="text-slate-800">{reviewToDelete.user.name}</strong>? This action cannot be undone.
            </p>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mt-4 max-h-24 overflow-y-auto">
              <p className="text-xs text-slate-500 italic font-medium">"{reviewToDelete.comment}"</p>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setReviewToDelete(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 active:scale-95 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteReview}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-red-200 hover:shadow-lg transition active:scale-95"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
