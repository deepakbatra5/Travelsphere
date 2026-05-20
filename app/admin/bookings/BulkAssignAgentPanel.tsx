'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Agent {
  id: string
  user: { name: string }
}

export default function BulkAssignAgentPanel({
  bookingIds,
  agents,
}: {
  bookingIds: string[]
  agents: Agent[]
}) {
  const router = useRouter()
  const [agentId, setAgentId] = useState('')
  const [loading, setLoading] = useState(false)

  const assignAgent = async () => {
    if (!agentId || bookingIds.length === 0) return

    setLoading(true)
    await fetch('/api/admin/assign-agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingIds, agentId }),
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-sm sm:flex-row sm:items-end">
      <div className="flex-1">
        <label className="mb-1 block text-sm font-medium text-gray-700">Assign filtered confirmed bookings</label>
        <select
          value={agentId}
          onChange={(e) => setAgentId(e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <option value="">Choose agent</option>
          {agents.map((agent) => (
            <option key={agent.id} value={agent.id}>
              {agent.user.name}
            </option>
          ))}
        </select>
      </div>
      <button
        type="button"
        onClick={assignAgent}
        disabled={!agentId || bookingIds.length === 0 || loading}
        className="rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:opacity-50"
      >
        {loading ? 'Assigning...' : `Assign ${bookingIds.length} bookings`}
      </button>
    </div>
  )
}


