'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AgentTourSelector({
  agentId,
  packageId,
  selected,
}: {
  agentId: string
  packageId: string
  selected: boolean
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const toggle = async () => {
    setLoading(true)
    await fetch('/api/agents/preferences', {
      method: selected ? 'DELETE' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentId, packageId }),
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={toggle}
      className={`rounded-full px-4 py-2 text-xs font-bold ${selected ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-500 text-white hover:bg-orange-600'} disabled:opacity-60`}
    >
      {loading ? 'Saving...' : selected ? 'Selected' : 'Select Tour'}
    </button>
  )
}


