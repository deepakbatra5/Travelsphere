'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AssignmentActions({ assignmentId }: { assignmentId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState<'accept' | 'decline' | null>(null)
  const [showReason, setShowReason] = useState(false)
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  const updateAssignment = async (action: 'accept' | 'decline') => {
    setLoading(action)
    setError('')

    const res = await fetch(`/api/agents/assignments/${assignmentId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(action === 'accept' ? { action } : { action, reason }),
    })

    if (!res.ok) {
      const body = await res.json().catch(() => null)
      setError(body?.error || 'Could not update assignment')
      setLoading(null)
      return
    }

    setLoading(null)
    setShowReason(false)
    setReason('')
    router.refresh()
  }

  return (
    <div className="mt-5 rounded-2xl border border-orange-100 bg-orange-50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold text-slate-900">Confirm this assignment</p>
          <p className="mt-1 text-xs text-slate-500">Accept to start handling the tour, or decline with a reason for admin review.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={loading !== null}
            onClick={() => updateAssignment('accept')}
            className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {loading === 'accept' ? 'Accepting...' : 'Accept'}
          </button>
          <button
            type="button"
            disabled={loading !== null}
            onClick={() => setShowReason((value) => !value)}
            className="rounded-full bg-white px-4 py-2 text-xs font-bold text-red-600 ring-1 ring-red-100 hover:bg-red-50 disabled:opacity-60"
          >
            Decline
          </button>
        </div>
      </div>

      {showReason && (
        <div className="mt-4 space-y-3">
          <textarea
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            placeholder="Write the reason for declining this assignment"
            className="min-h-24 w-full rounded-2xl border border-orange-100 bg-white p-3 text-sm text-slate-700 outline-none focus:border-orange-400"
          />
          <button
            type="button"
            disabled={loading !== null || reason.trim().length < 5}
            onClick={() => updateAssignment('decline')}
            className="rounded-full bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {loading === 'decline' ? 'Sending...' : 'Submit decline reason'}
          </button>
        </div>
      )}
      {error && <p className="mt-3 text-xs font-semibold text-red-600">{error}</p>}
    </div>
  )
}


