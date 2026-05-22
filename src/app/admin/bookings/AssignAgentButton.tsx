'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Agent {
  id: string
  user: { name: string }
  city: string
  rating: number
  assignedBookings: { status: string }[]
}

export default function AssignAgentButton({
  bookingId,
  currentAgentId,
  agents,
}: {
  bookingId: string
  currentAgentId?: string
  agents: Agent[]
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleAssign = async (agentId: string) => {
    setLoading(true)
    await fetch('/api/admin/assign-agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId, agentId }),
    })
    setLoading(false)
    setOpen(false)
    router.refresh()
  }

  return (
    <div className="relative">
      <button onClick={() => setOpen((value) => !value)} className="rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-cyan-700" type="button">
        {currentAgentId ? 'Reassign' : 'Assign Agent'}
      </button>

      {open && (
        <div className="absolute right-0 top-9 z-50 w-72 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
          <div className="border-b border-gray-100 px-4 py-3">
            <h4 className="text-sm font-semibold text-gray-800">Select Agent</h4>
            <p className="mt-0.5 text-xs text-gray-400">Sorted by rating and track record</p>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {agents.length > 0 ? agents.map((agent) => {
              const done = agent.assignedBookings.filter((booking) => booking.status === 'COMPLETED').length
              const active = agent.assignedBookings.filter((booking) => booking.status === 'ASSIGNED' || booking.status === 'IN_PROGRESS').length
              const isCurrent = agent.id === currentAgentId

              return (
                <button
                  key={agent.id}
                  onClick={() => handleAssign(agent.id)}
                  disabled={loading || isCurrent}
                  className={`w-full border-b border-gray-50 px-4 py-3 text-left transition hover:bg-gray-50 ${isCurrent ? 'bg-orange-50' : ''}`}
                  type="button"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{agent.user.name}</p>
                      <p className="text-xs text-gray-400">{agent.city}</p>
                    </div>
                    <div className="text-right">
                      {agent.rating > 0 && <p className="text-xs font-semibold text-amber-500">{agent.rating.toFixed(1)} / 5</p>}
                      <p className="text-xs text-gray-400">{done} done - {active} active</p>
                    </div>
                  </div>
                  {isCurrent && <p className="mt-1 text-xs font-medium text-orange-500">Currently assigned</p>}
                </button>
              )
            }) : <p className="py-6 text-center text-sm text-gray-400">No approved agents available</p>}
          </div>
          <button onClick={() => setOpen(false)} className="w-full border-t py-2 text-xs text-gray-400 hover:bg-gray-50" type="button">Cancel</button>
        </div>
      )}
    </div>
  )
}


