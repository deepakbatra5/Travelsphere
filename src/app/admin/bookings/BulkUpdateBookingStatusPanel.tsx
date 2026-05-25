'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
import AdminToast, { AdminToastMessage } from '@/components/ui/AdminToast'

const statuses: BookingStatus[] = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']

export default function BulkUpdateBookingStatusPanel({
  bookingIds,
}: {
  bookingIds: string[]
}) {
  const router = useRouter()
  const [status, setStatus] = useState<BookingStatus>('CONFIRMED')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<AdminToastMessage | null>(null)

  const updateBookings = async () => {
    if (bookingIds.length === 0) return

    setLoading(true)
    const res = await fetch('/api/admin/bookings/bulk-status', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingIds, status }),
    })

    const data = await res.json().catch(() => null)
    setLoading(false)

    if (!res.ok) {
      setToast({ type: 'error', text: data?.error || 'Failed to update filtered bookings.' })
      return
    }

    setToast({ type: 'success', text: `${data?.updated || bookingIds.length} bookings updated.` })
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm sm:flex-row sm:items-end">
      <AdminToast toast={toast} onClose={() => setToast(null)} />
      <div className="flex-1">
        <label className="mb-1 block text-sm font-medium text-gray-700">Bulk update filtered bookings</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as BookingStatus)}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          {statuses.map((option) => (
            <option key={option} value={option}>
              Mark as {option}
            </option>
          ))}
        </select>
      </div>
      <button
        type="button"
        onClick={updateBookings}
        disabled={bookingIds.length === 0 || loading}
        className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
      >
        {loading ? 'Updating...' : `Update ${bookingIds.length} bookings`}
      </button>
    </div>
  )
}


