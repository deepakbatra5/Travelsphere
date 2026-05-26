'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AgentDeletionRequestActions({ requestId }: { requestId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null)

  const handleAction = async (action: 'approve' | 'reject') => {
    setLoading(action)

    try {
      const response = await fetch(`/api/admin/agent-deletion-requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to process request')
      }

      router.refresh()
    } catch (error) {
      console.error(error)
      alert(error instanceof Error ? error.message : 'Failed to process request')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => handleAction('approve')}
        disabled={loading !== null}
        className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
      >
        {loading === 'approve' ? 'Approving...' : 'Approve & Delete'}
      </button>
      <button
        type="button"
        onClick={() => handleAction('reject')}
        disabled={loading !== null}
        className="rounded-full bg-slate-200 px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-300 disabled:opacity-50"
      >
        {loading === 'reject' ? 'Rejecting...' : 'Reject'}
      </button>
    </div>
  )
}