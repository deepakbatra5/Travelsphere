'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import {
  UserIcon,
  CalendarDaysIcon,
  StarIcon,
  Cog6ToothIcon,
  LockClosedIcon,
  TrashIcon,
  MapPinIcon,
  ClockIcon,
  CreditCardIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import { clearAuthSession } from '@/lib/browser-session'

interface CustomerDashboardProps {
  user: {
    id: string
    name: string
    email: string
    phone: string | null
    role: string
    bookings: Array<{
      id: string
      travelDate: string
      travellers: number
      totalAmount: number
      status: string
      package: {
        id: string
        title: string
        slug: string
        destination: string
        duration: number
      }
      payment: {
        status: string
      } | null
    }>
    reviews: Array<{
      id: string
      packageId: string
      rating: number
      comment: string
    }>
  }
  initialTab?: string
}

export default function CustomerDashboard({ user, initialTab = 'personal' }: CustomerDashboardProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState(initialTab)
  const [bookingFilter, setBookingFilter] = useState('ALL')

  // Review Modal State
  const [reviewModal, setReviewModal] = useState<{
    isOpen: boolean
    packageId: string
    packageTitle: string
    rating: number
    comment: string
    error: string
    success: string
    submitting: boolean
  }>({
    isOpen: false,
    packageId: '',
    packageTitle: '',
    rating: 5,
    comment: '',
    error: '',
    success: '',
    submitting: false,
  })

  // Settings State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    error: '',
    success: '',
    submitting: false,
  })

  const [deleteForm, setDeleteForm] = useState({
    confirmPassword: '',
    error: '',
    submitting: false,
    showConfirm: false,
  })

  // Helper: Determine travel status (Upcoming, Active, Completed)
  const getBookingTravelStatus = (booking: any) => {
    const travelDate = new Date(booking.travelDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const startDate = new Date(travelDate)
    startDate.setHours(0, 0, 0, 0)
    
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + (booking.package.duration || 1))
    
    if (today >= startDate && today <= endDate) {
      return 'ACTIVE'
    } else if (today > endDate) {
      return 'COMPLETED'
    } else {
      return 'UPCOMING'
    }
  }

  // Filtered Bookings
  const getFilteredBookings = () => {
    if (bookingFilter === 'ALL') return user.bookings
    return user.bookings.filter(b => getBookingTravelStatus(b) === bookingFilter)
  }

  // Handle Review Submit
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reviewModal.comment.trim()) {
      setReviewModal(prev => ({ ...prev, error: 'Please enter a comment' }))
      return
    }

    setReviewModal(prev => ({ ...prev, submitting: true, error: '', success: '' }))

    try {
      const res = await fetch('/api/user/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: reviewModal.packageId,
          rating: reviewModal.rating,
          comment: reviewModal.comment,
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to submit review')

      setReviewModal(prev => ({
        ...prev,
        success: 'Review saved successfully! Reloading...',
        submitting: false,
      }))
      setTimeout(() => {
        setReviewModal(prev => ({ ...prev, isOpen: false }))
        router.refresh()
      }, 1500)
    } catch (err: any) {
      setReviewModal(prev => ({ ...prev, error: err.message || 'Error occurred', submitting: false }))
    }
  }

  // Handle Password Change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordForm(prev => ({ ...prev, error: 'Passwords do not match' }))
      return
    }

    setPasswordForm(prev => ({ ...prev, submitting: true, error: '', success: '' }))

    try {
      const res = await fetch('/api/user/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'change-password',
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to change password')

      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        error: '',
        success: 'Password updated successfully!',
        submitting: false,
      })
    } catch (err: any) {
      setPasswordForm(prev => ({ ...prev, error: err.message || 'Error occurred', submitting: false }))
    }
  }

  // Handle Account Deletion
  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    setDeleteForm(prev => ({ ...prev, submitting: true, error: '' }))

    try {
      const res = await fetch('/api/user/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete-account',
          currentPassword: deleteForm.confirmPassword,
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to delete account')

      // Sign out and clear browser storage
      clearAuthSession()
      await signOut({ callbackUrl: '/' })
    } catch (err: any) {
      setDeleteForm(prev => ({ ...prev, error: err.message || 'Error occurred', submitting: false }))
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Title */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900 font-syne">Welcome back, {user.name}</h1>
          <p className="mt-1 text-sm text-slate-500 font-sans">Manage your bookings, review trips and update settings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm space-y-1">
            <button
              onClick={() => setActiveTab('personal')}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                activeTab === 'personal'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-slate-650 hover:bg-slate-50 hover:text-slate-950'
              }`}
            >
              <UserIcon className="h-5 w-5" />
              Personal Details
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                activeTab === 'bookings'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-slate-650 hover:bg-slate-50 hover:text-slate-950'
              }`}
            >
              <CalendarDaysIcon className="h-5 w-5" />
              My Bookings
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                activeTab === 'reviews'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-slate-650 hover:bg-slate-50 hover:text-slate-950'
              }`}
            >
              <StarIcon className="h-5 w-5" />
              Write Reviews
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                activeTab === 'settings'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-slate-650 hover:bg-slate-50 hover:text-slate-950'
              }`}
            >
              <Cog6ToothIcon className="h-5 w-5" />
              Account Settings
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {/* TAB 1: PERSONAL DETAILS */}
          {activeTab === 'personal' && (
            <div className="rounded-3xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-2xl font-bold text-orange-600 font-syne uppercase">
                  {user.name[0]}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
                  <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 uppercase mt-0.5">
                    {user.role} Account
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Full Name</p>
                  <p className="mt-1 font-semibold text-slate-800">{user.name}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</p>
                  <p className="mt-1 break-all font-semibold text-slate-800">{user.email}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Phone Number</p>
                  <p className="mt-1 font-semibold text-slate-800">{user.phone || 'Not Provided'}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Status</p>
                  <p className="mt-1 font-semibold text-emerald-600 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                    Active
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MY BOOKINGS */}
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-slate-900 font-syne">Your Booking History</h2>
                {/* Status Sub-filter */}
                <div className="flex rounded-xl bg-slate-100 p-1">
                  {['ALL', 'UPCOMING', 'ACTIVE', 'COMPLETED'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setBookingFilter(filter)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase transition-all ${
                        bookingFilter === filter
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              {getFilteredBookings().length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-white py-16 text-center shadow-sm">
                  <CalendarDaysIcon className="mx-auto h-12 w-12 text-slate-300" />
                  <h3 className="mt-4 text-lg font-bold text-slate-800">No bookings found</h3>
                  <p className="mt-1 text-sm text-slate-500">You don't have any bookings matching this filter.</p>
                  <Link
                    href="/tours"
                    className="mt-5 inline-block rounded-full bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 transition"
                  >
                    Browse Packages
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {getFilteredBookings().map((booking) => {
                    const travelStatus = getBookingTravelStatus(booking)
                    const isUpcoming = travelStatus === 'UPCOMING'
                    const isActive = travelStatus === 'ACTIVE'
                    const isCompleted = travelStatus === 'COMPLETED'

                    return (
                      <div key={booking.id} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
                          <div>
                            <span
                              className={`rounded-full px-3 py-0.5 text-xs font-bold ${
                                isUpcoming
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-250'
                                  : isActive
                                  ? 'bg-blue-50 text-blue-700 border border-blue-250'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {travelStatus}
                            </span>
                            <h3 className="mt-2 text-lg font-bold text-slate-900 hover:text-orange-500">
                              <Link href={`/tours/${booking.package.slug}`}>
                                {booking.package.title}
                              </Link>
                            </h3>
                            <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                              <MapPinIcon className="h-3 w-3" /> {booking.package.destination}
                            </p>
                          </div>

                          <div className="text-right">
                            <span className="text-xs text-slate-400">Total Price</span>
                            <p className="text-lg font-black text-orange-500">Rs {booking.totalAmount.toLocaleString('en-IN')}</p>
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                          <div>
                            <span className="text-xs text-slate-400">Travel Date</span>
                            <p className="mt-0.5 text-sm font-semibold text-slate-800">
                              {new Date(booking.travelDate).toLocaleDateString('en-IN', {
                                day: 'numeric', month: 'short', year: 'numeric'
                              })}
                            </p>
                          </div>
                          <div>
                            <span className="text-xs text-slate-400">Duration</span>
                            <p className="mt-0.5 text-sm font-semibold text-slate-800">{booking.package.duration} Days</p>
                          </div>
                          <div>
                            <span className="text-xs text-slate-400">Travellers</span>
                            <p className="mt-0.5 text-sm font-semibold text-slate-800">{booking.travellers} Person(s)</p>
                          </div>
                          <div>
                            <span className="text-xs text-slate-400">Payment Status</span>
                            <span
                              className={`mt-1 inline-flex items-center gap-1 text-xs font-bold ${
                                booking.payment?.status === 'SUCCESS' ? 'text-emerald-600' : 'text-amber-600'
                              }`}
                            >
                              <CreditCardIcon className="h-3.5 w-3.5" />
                              {booking.payment?.status || 'PENDING'}
                            </span>
                          </div>
                        </div>

                        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-50">
                          <Link
                            href={`/booking/confirmation/${booking.id}`}
                            className="text-sm font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
                          >
                            View Booking Ticket & Itinerary →
                          </Link>

                          <a
                            href={`https://wa.me/918603606089?text=Hi, I need support for booking id ${booking.id}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition"
                          >
                            💬 Contact Support
                          </a>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WRITE REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-900 font-syne">Review Your Trips</h2>

              {user.bookings.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-white py-16 text-center shadow-sm">
                  <StarIcon className="mx-auto h-12 w-12 text-slate-300" />
                  <h3 className="mt-4 text-lg font-bold text-slate-800">No trips to review</h3>
                  <p className="mt-1 text-sm text-slate-500">You must have bookings to submit reviews.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Find unique booked packages */}
                  {Array.from(new Map(user.bookings.map(b => [b.package.id, b.package])).values()).map((pkg) => {
                    const existingReview = user.reviews.find(r => r.packageId === pkg.id)

                    return (
                      <div key={pkg.id} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-1">
                          <h3 className="text-lg font-bold text-slate-900">{pkg.title}</h3>
                          <p className="text-sm text-slate-500">{pkg.destination}</p>
                          {existingReview ? (
                            <div className="mt-2 rounded-2xl bg-amber-50/50 border border-amber-100 p-3 max-w-lg">
                              <div className="flex items-center gap-1 text-amber-500 mb-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  i < (existingReview.rating || 5) ? (
                                    <StarIconSolid key={i} className="h-4 w-4" />
                                  ) : (
                                    <StarIcon key={i} className="h-4 w-4" />
                                  )
                                ))}
                              </div>
                              <p className="text-xs italic text-slate-650">"{existingReview.comment}"</p>
                            </div>
                          ) : (
                            <p className="text-xs text-slate-400 mt-1">You haven't reviewed this package yet.</p>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            setReviewModal({
                              isOpen: true,
                              packageId: pkg.id,
                              packageTitle: pkg.title,
                              rating: existingReview?.rating || 5,
                              comment: existingReview?.comment || '',
                              error: '',
                              success: '',
                              submitting: false,
                            })
                          }}
                          className={`rounded-full px-5 py-2 text-xs font-bold transition shadow-xs whitespace-nowrap ${
                            existingReview
                              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                              : 'bg-orange-500 text-white hover:bg-orange-600'
                          }`}
                        >
                          {existingReview ? '✏ Edit Review' : '⭐ Write Review'}
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ACCOUNT SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* Reset Password Form */}
              <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <LockClosedIcon className="h-5 w-5 text-slate-500" />
                  Reset Password
                </h3>

                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Current Password</label>
                    <input
                      type="password"
                      required
                      value={passwordForm.currentPassword}
                      onChange={e => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))}
                      placeholder="••••••••"
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-orange-500 bg-slate-50 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">New Password</label>
                    <input
                      type="password"
                      required
                      value={passwordForm.newPassword}
                      onChange={e => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))}
                      placeholder="••••••••"
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-orange-500 bg-slate-50 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={passwordForm.confirmPassword}
                      onChange={e => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))}
                      placeholder="••••••••"
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-orange-500 bg-slate-50 text-slate-800"
                    />
                  </div>

                  {passwordForm.error && <p className="text-xs font-semibold text-rose-600">{passwordForm.error}</p>}
                  {passwordForm.success && <p className="text-xs font-semibold text-emerald-600">{passwordForm.success}</p>}

                  <button
                    type="submit"
                    disabled={passwordForm.submitting}
                    className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-700 transition"
                  >
                    {passwordForm.submitting ? (
                      <ArrowPathIcon className="h-4 w-4 animate-spin" />
                    ) : 'Reset Password'}
                  </button>
                </form>
              </div>

              {/* Danger Zone / Delete Account */}
              <div className="rounded-3xl border border-rose-100 bg-rose-50/30 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-rose-900 mb-2 flex items-center gap-2">
                  <TrashIcon className="h-5 w-5 text-rose-600" />
                  Danger Zone
                </h3>
                <p className="text-sm text-rose-700/80 mb-4 leading-relaxed">
                  Permanently delete your account. This action is irreversible. All your booking history, profile data, and saved reviews will be permanently removed.
                </p>

                {!deleteForm.showConfirm ? (
                  <button
                    onClick={() => setDeleteForm(p => ({ ...p, showConfirm: true }))}
                    className="rounded-full bg-rose-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-rose-700 transition"
                  >
                    Delete My Account
                  </button>
                ) : (
                  <form onSubmit={handleDeleteAccount} className="space-y-4 max-w-md">
                    <div>
                      <label className="text-xs font-bold text-rose-900 uppercase">Confirm Password to Delete Account</label>
                      <input
                        type="password"
                        required
                        value={deleteForm.confirmPassword}
                        onChange={e => setDeleteForm(p => ({ ...p, confirmPassword: e.target.value }))}
                        placeholder="Enter your current password"
                        className="mt-1 w-full rounded-xl border border-rose-200 px-3 py-2.5 text-sm focus:outline-none focus:border-rose-500 bg-white text-slate-800"
                      />
                    </div>

                    {deleteForm.error && <p className="text-xs font-semibold text-rose-600">{deleteForm.error}</p>}

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={deleteForm.submitting}
                        className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-rose-700 transition"
                      >
                        {deleteForm.submitting ? (
                          <ArrowPathIcon className="h-4 w-4 animate-spin" />
                        ) : 'Confirm Permanent Deletion'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteForm({ confirmPassword: '', error: '', submitting: false, showConfirm: false })}
                        className="rounded-full bg-slate-200 px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-300 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* REVIEW WRITE / EDIT MODAL */}
      {reviewModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-150 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-slate-900 font-syne">
              Review: {reviewModal.packageTitle}
            </h3>
            <p className="text-xs text-slate-500 mt-1">Rate and comment on your experience below.</p>

            <form onSubmit={handleReviewSubmit} className="mt-4 space-y-4">
              {/* Rating selection */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Rating</label>
                <div className="mt-2 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const starVal = i + 1
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setReviewModal(p => ({ ...p, rating: starVal }))}
                        className="text-amber-500 transition hover:scale-110 active:scale-95"
                      >
                        {starVal <= reviewModal.rating ? (
                          <StarIconSolid className="h-8 w-8" />
                        ) : (
                          <StarIcon className="h-8 w-8" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Comment textarea */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Your Review Comment</label>
                <textarea
                  required
                  rows={4}
                  value={reviewModal.comment}
                  onChange={e => setReviewModal(p => ({ ...p, comment: e.target.value }))}
                  placeholder="Share your experience (what did you like? what could be improved?)"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:border-orange-500 bg-slate-50 text-slate-800 resize-none leading-relaxed"
                />
              </div>

              {reviewModal.error && <p className="text-xs font-semibold text-rose-600">{reviewModal.error}</p>}
              {reviewModal.success && <p className="text-xs font-semibold text-emerald-650">{reviewModal.success}</p>}

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModal(p => ({ ...p, isOpen: false }))}
                  className="rounded-full bg-slate-100 px-5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 transition"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={reviewModal.submitting}
                  className="inline-flex items-center gap-1.5 rounded-full bg-orange-500 px-5 py-2 text-xs font-bold text-white hover:bg-orange-600 transition"
                >
                  {reviewModal.submitting ? (
                    <ArrowPathIcon className="h-4 w-4 animate-spin" />
                  ) : 'Save Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
