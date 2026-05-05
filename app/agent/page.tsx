import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AgentDashboard() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect('/login?callbackUrl=/agent')
  const userEmail = session.user.email

  const user = await (async () => {
    try {
      return await prisma.user.findUnique({
        where: { email: userEmail },
        include: { agent: true },
      })
    } catch {
      return null
    }
  })()

  if (!user) redirect('/agent-register')

  if (!user?.agent) redirect('/agent-register')
  if (user.agent.status === 'PENDING') redirect('/agent/pending')
  if (user.agent.status === 'SUSPENDED') redirect('/')

  const assignments = await prisma.bookingAgent.findMany({
    where: { agentId: user.agent.id },
    include: { booking: { include: { package: true, user: true } } },
    orderBy: { assignedAt: 'desc' },
  }).catch(() => [])

  const totalEarnings = assignments.filter((item) => item.status === 'COMPLETED').reduce((sum, item) => sum + item.commission, 0)
  const completed = assignments.filter((item) => item.status === 'COMPLETED').length
  const active = assignments.filter((item) => item.status === 'ASSIGNED' || item.status === 'IN_PROGRESS').length
  const preferredCount = await prisma.agentTourPreference.count({ where: { agentId: user.agent.id } }).catch(() => 0)

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-linear-to-r from-cyan-700 to-cyan-950 p-6 text-white">
        <h1 className="text-2xl font-extrabold">Welcome back, {user.name}</h1>
        <p className="mt-1 text-sm text-cyan-100">{user.agent.city}, {user.agent.state} - {user.agent.experience} year(s) experience</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <div className="rounded-2xl bg-white/15 px-4 py-2 text-sm">Rating: {user.agent.rating > 0 ? `${user.agent.rating.toFixed(1)} / 5` : 'No ratings yet'}</div>
          <div className="rounded-2xl bg-white/15 px-4 py-2 text-sm">Status: {user.agent.status}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Active Assignments', value: active, bg: 'bg-cyan-600' },
          { label: 'Completed Tours', value: completed, bg: 'bg-emerald-600' },
          { label: 'Agent Payout', value: `Rs ${totalEarnings.toLocaleString('en-IN')}`, bg: 'bg-orange-500' },
          { label: 'Tours I Cover', value: preferredCount, bg: 'bg-slate-800' },
        ].map((stat) => (
          <div key={stat.label} className={`${stat.bg} rounded-2xl p-5 text-white`}>
            <p className="text-sm opacity-85">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Recent Assignments</h2>
          <Link href="/agent/my-tours" className="text-sm font-semibold text-orange-600 hover:underline">View All</Link>
        </div>
        <div className="space-y-3">
          {assignments.slice(0, 5).map((assignment) => (
            <div key={assignment.id} className="flex flex-col justify-between gap-3 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center">
              <div>
                <p className="font-semibold text-slate-800">{assignment.booking.package.title}</p>
                <p className="text-sm text-slate-500">{assignment.booking.package.destination} - {new Date(assignment.booking.travelDate).toLocaleDateString('en-IN')}</p>
              </div>
              <div className="text-sm font-bold text-emerald-600">Agent payout: Rs {assignment.commission.toLocaleString('en-IN')}</div>
            </div>
          ))}
          {assignments.length === 0 && <p className="py-8 text-center text-sm text-slate-400">No assignments yet. Select preferred tours to help admins match you.</p>}
        </div>
      </div>
    </div>
  )
}
