'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import AdminToast, { AdminToastMessage } from '@/components/ui/AdminToast'

export default function UpdateBookingStatus({ bookingId, currentStatus }: { bookingId: string; currentStatus: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<AdminToastMessage | null>(null)

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLoading(true)
    const res = await fetch(`/api/bookings/${bookingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: e.target.value }),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => null)
      setToast({ type: 'error', text: data?.error || 'Failed to update booking status.' })
      setLoading(false)
      return
    }

    setToast({ type: 'success', text: 'Booking status updated.' })
    setLoading(false)
    router.refresh()
  }

  return (
    <>
      <AdminToast toast={toast} onClose={() => setToast(null)} />
      <select
        defaultValue={currentStatus}
        onChange={handleChange}
        disabled={loading}
        className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400"
      >
        {['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </>
  )
}


