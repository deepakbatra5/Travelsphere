'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AgentStatusUpdate({ agentId, currentStatus }: { agentId: string; currentStatus: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLoading(true)
    await fetch(`/api/agents/${agentId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: e.target.value }),
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <select
      defaultValue={currentStatus}
      onChange={handleChange}
      disabled={loading}
      className={`rounded-full border px-3 py-1 text-xs font-bold ${
        currentStatus === 'APPROVED'
          ? 'border-emerald-200 bg-emerald-100 text-emerald-700'
          : currentStatus === 'PENDING'
            ? 'border-amber-200 bg-amber-100 text-amber-700'
            : 'border-red-200 bg-red-100 text-red-600'
      }`}
    >
      <option value="PENDING">PENDING</option>
      <option value="APPROVED">APPROVED</option>
      <option value="SUSPENDED">SUSPENDED</option>
    </select>
  )
}
