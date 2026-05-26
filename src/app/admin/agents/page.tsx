import { prisma } from '@/lib/db'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import AgentStatusUpdate from './AgentStatusUpdate'
import { redirect } from 'next/navigation'
import AgentDeletionRequestActions from './AgentDeletionRequestActions'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminAgentsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/?callbackUrl=/agents')
  }

  const [agents, deletionRequests] = await Promise.all([
    prisma.agent.findMany({
      include: {
        user: true,
        preferredTours: { include: { package: true } },
        assignedBookings: true,
      },
      orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
    }),
    prisma.agentDeletionRequest.findMany({
      include: {
        user: true,
        agent: true,
      },
      orderBy: { requestedAt: 'desc' },
    }),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Agents</h1>
        <p className="mt-1 text-sm text-gray-500">{agents.length} registered agent(s)</p>
      </div>

      {/* Agents List */}
      <div className="space-y-4">
        {agents.map((agent) => {
          const completed = agent.assignedBookings.filter((booking) => booking.status === 'COMPLETED').length
          const active = agent.assignedBookings.filter((booking) => booking.status === 'ASSIGNED' || booking.status === 'IN_PROGRESS').length
          const totalEarnings = agent.assignedBookings.filter((booking) => booking.status === 'COMPLETED').reduce((sum, booking) => sum + booking.commission, 0)

          return (
            <div key={agent.id} className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-bold text-gray-800">{agent.user.name}</h3>
                    <AgentStatusUpdate agentId={agent.id} currentStatus={agent.status} />
                  </div>
                  <p className="text-sm text-gray-500">{agent.user.email} - {agent.phone}</p>
                  <p className="mt-0.5 text-xs text-gray-400">{agent.city}, {agent.state} - {agent.experience} years experience</p>
                  {agent.bio && <p className="mt-1 text-xs italic text-gray-500">{agent.bio}</p>}
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Rating</p>
                  <p className="text-lg font-bold text-amber-500">{agent.rating > 0 ? `${agent.rating.toFixed(1)} / 5` : 'No ratings yet'}</p>
                </div>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: 'Active Tours', value: active, bg: 'bg-cyan-50', text: 'text-cyan-600' },
                  { label: 'Completed', value: completed, bg: 'bg-emerald-50', text: 'text-emerald-600' },
                  { label: 'Tours Covered', value: agent.preferredTours.length, bg: 'bg-orange-50', text: 'text-orange-600' },
                  { label: 'Agent Payout', value: `Rs ${totalEarnings.toLocaleString('en-IN')}`, bg: 'bg-slate-50', text: 'text-slate-700' },
                ].map((stat) => (
                  <div key={stat.label} className={`${stat.bg} rounded-xl p-3 text-center`}>
                    <p className={`text-lg font-bold ${stat.text}`}>{stat.value}</p>
                    <p className="mt-0.5 text-xs text-gray-400">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="mb-3 flex flex-wrap gap-2">
                {agent.languages.map((lang) => (
                  <span key={lang} className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">{lang}</span>
                ))}
              </div>

              {agent.preferredTours.length > 0 && (
                <div>
                  <p className="mb-2 text-xs text-gray-400">Comfortable with:</p>
                  <div className="flex flex-wrap gap-2">
                    {agent.preferredTours.slice(0, 6).map((pref) => (
                      <span key={pref.id} className="rounded-full border border-orange-200 bg-orange-50 px-2 py-1 text-xs text-orange-600">
                        {pref.package.title}
                      </span>
                    ))}
                    {agent.preferredTours.length > 6 && <span className="text-xs text-gray-400">+{agent.preferredTours.length - 6} more</span>}
                  </div>
                </div>
              )}
            </div>
          )
        })}
        {agents.length === 0 && <div className="rounded-2xl bg-white p-10 text-center text-gray-400 shadow-sm">No agents registered yet.</div>}
      </div>

      {/* Pending Deletion Requests */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-amber-900">Pending Deletion Requests</h2>
            <p className="text-sm text-amber-800/80">Approve a request to permanently delete the agent account and all related records.</p>
          </div>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
            {deletionRequests.length} pending
          </span>
        </div>

        <div className="space-y-3">
          {deletionRequests.map((request) => (
            <div key={request.id} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-amber-100">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-gray-800">{request.user.name}</h3>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
                      {request.agent.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{request.user.email} · {request.agent.city}, {request.agent.state}</p>
                  <p className="mt-2 text-xs text-gray-400">
                    Requested on {new Date(request.requestedAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                  {request.reason && <p className="mt-2 max-w-3xl text-sm text-gray-600">Reason: {request.reason}</p>}
                </div>

                <AgentDeletionRequestActions requestId={request.id} />
              </div>
            </div>
          ))}

          {deletionRequests.length === 0 && (
            <div className="rounded-2xl border border-dashed border-amber-200 bg-white p-6 text-center text-sm text-gray-400">
              No pending deletion requests.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}



