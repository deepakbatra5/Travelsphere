import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AgentDashboard() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect('/?callbackUrl=/dashboard')
  const userEmail = session.user.email

  const user = await (async () => {
    try {
      return await prisma.user.findUnique({
        where: { email: userEmail.toLowerCase() },
        include: { agent: true },
      })
    } catch (e) {
      console.error("AgentDashboard: prisma.user.findUnique failed:", e)
      return null
    }
  })()

  if (!user || !user.agent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md rounded-3xl bg-white p-10 text-center shadow-lg">
          <div className="mx-auto w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center p-1.5 shadow-md shadow-red-500/10 mb-4">
            <img src="/logo-transparent.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="mb-3 text-2xl font-extrabold text-slate-900">Profile Not Found</h1>
          <p className="mb-6 leading-relaxed text-slate-600">
            We could not retrieve your agent profile. This might be due to a temporary database connection issue. Please try logging in again.
          </p>
          <a href="/login" className="block w-full rounded-2xl bg-orange-500 py-3 font-bold text-white hover:bg-orange-600">
            Back to Login
          </a>
        </div>
      </div>
    )
  }
  if (user.agent.status === 'PENDING') redirect('/pending')
  if (user.agent.status === 'SUSPENDED') redirect('/')

  const assignments = await prisma.bookingAgent.findMany({
    where: { agentId: user.agent.id },
    include: { booking: { include: { package: true, user: true } } },
    orderBy: { assignedAt: 'desc' },
  }).catch(() => [])

  const totalEarnings = assignments.filter((item) => item.status === 'COMPLETED').reduce((sum, item) => sum + item.commission, 0)
  const completed = assignments.filter((item) => item.status === 'COMPLETED').length
  const active = assignments.filter((item) => item.status === 'ASSIGNED' || item.status === 'IN_PROGRESS').length
  const preferredTours = await prisma.agentTourPreference.findMany({
    where: { agentId: user.agent.id },
    include: { package: true },
    orderBy: { id: 'desc' },
  }).catch(() => [])
  const preferredCount = preferredTours.length
  const activeAssignments = assignments.filter((item) => item.status === 'ASSIGNED' || item.status === 'IN_PROGRESS')
  const completedAssignments = assignments.filter((item) => item.status === 'COMPLETED')

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
          { label: 'Active Assignments', value: active, bg: 'bg-cyan-600', href: '/my-tours?status=active', detail: activeAssignments[0]?.booking.package.title || 'No active tours yet' },
          { label: 'Completed Tours', value: completed, bg: 'bg-emerald-600', href: '/my-tours?status=completed', detail: completedAssignments[0]?.booking.package.title || 'No completed tours yet' },
          { label: 'Agent Payout', value: `Rs ${totalEarnings.toLocaleString('en-IN')}`, bg: 'bg-orange-500', href: '/earnings#breakdown', detail: `${completed} completed payout record(s)` },
          { label: 'Tours I Cover', value: preferredCount, bg: 'bg-slate-800', href: '/tours?view=covered', detail: preferredTours[0]?.package.title || 'Select tours you can cover' },
        ].map((stat) => (
          <Link key={stat.label} href={stat.href} className={`${stat.bg} block rounded-2xl p-5 text-white transition hover:-translate-y-0.5 hover:shadow-lg`}>
            <p className="text-sm opacity-85">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold">{stat.value}</p>
            <p className="mt-3 line-clamp-2 text-xs text-white/80">{stat.detail}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Recent Assignments</h2>
          <Link href="/my-tours" className="text-sm font-semibold text-orange-600 hover:underline">View All</Link>
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


