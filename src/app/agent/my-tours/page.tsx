import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import AssignmentActions from './AssignmentActions'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type PageProps = {
  searchParams?: Promise<{ status?: string }>
}

function statusClass(status: string) {
  if (status === 'COMPLETED') return 'bg-emerald-100 text-emerald-700'
  if (status === 'IN_PROGRESS') return 'bg-cyan-100 text-cyan-700'
  if (status === 'CANCELLED') return 'bg-red-100 text-red-700'
  return 'bg-orange-100 text-orange-700'
}

function filterAssignments<T extends { status: string }>(assignments: T[], status?: string) {
  if (status === 'active') return assignments.filter((item) => item.status === 'ASSIGNED' || item.status === 'IN_PROGRESS')
  if (status === 'completed') return assignments.filter((item) => item.status === 'COMPLETED')
  if (status === 'cancelled') return assignments.filter((item) => item.status === 'CANCELLED')
  return assignments
}

export default async function AgentMyToursPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions)
	if (!session?.user?.email) redirect('/login?callbackUrl=/my-tours')
  const userEmail = session.user.email
  const resolvedSearchParams = await searchParams

  const user = await (async () => {
    try {
      return await prisma.user.findUnique({
        where: { email: userEmail.toLowerCase() },
        include: { agent: true },
      })
    } catch (e) {
      console.error("AgentMyToursPage: prisma.user.findUnique failed:", e)
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
  const filteredAssignments = filterAssignments(assignments, resolvedSearchParams?.status)
  const active = assignments.filter((item) => item.status === 'ASSIGNED' || item.status === 'IN_PROGRESS').length
  const completed = assignments.filter((item) => item.status === 'COMPLETED').length
  const cancelled = assignments.filter((item) => item.status === 'CANCELLED').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Assignments</h1>
        <p className="mt-1 text-sm text-slate-500">{assignments.length} assigned tour(s)</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { label: 'All', href: '/my-tours', active: !resolvedSearchParams?.status, count: assignments.length },
          { label: 'Active', href: '/my-tours?status=active', active: resolvedSearchParams?.status === 'active', count: active },
          { label: 'Completed', href: '/my-tours?status=completed', active: resolvedSearchParams?.status === 'completed', count: completed },
          { label: 'Declined', href: '/my-tours?status=cancelled', active: resolvedSearchParams?.status === 'cancelled', count: cancelled },
        ].map((item) => (
          <a key={item.label} href={item.href} className={`rounded-full px-4 py-2 text-xs font-bold ${item.active ? 'bg-cyan-700 text-white' : 'bg-white text-slate-600 shadow-sm hover:text-cyan-700'}`}>
            {item.label} ({item.count})
          </a>
        ))}
      </div>

      <div className="space-y-4">
        {filteredAssignments.map((assignment) => (
          <div key={assignment.id} className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-4 sm:flex-row">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{assignment.booking.package.title}</h2>
                <p className="text-sm text-slate-500">{assignment.booking.package.destination}</p>
                <p className="mt-2 text-sm text-slate-600">Customer: {assignment.booking.user.name} ({assignment.booking.user.email})</p>
                {assignment.booking.user.phone && <p className="text-sm text-slate-600">Phone: {assignment.booking.user.phone}</p>}
              </div>
              <div className="text-left sm:text-right">
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass(assignment.status)}`}>{assignment.status}</span>
                <p className="mt-2 text-lg font-bold text-emerald-600">Rs {assignment.commission.toLocaleString('en-IN')}</p>
                <p className="text-xs font-semibold text-slate-400">Agent payout</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3 lg:grid-cols-4">
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-xs text-slate-400">Travel Date</p>
                <p className="font-semibold text-slate-800">{new Date(assignment.booking.travelDate).toLocaleDateString('en-IN')}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-xs text-slate-400">Travellers</p>
                <p className="font-semibold text-slate-800">{assignment.booking.travellers}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-xs text-slate-400">Booking Amount</p>
                <p className="font-semibold text-slate-800">Rs {assignment.booking.totalAmount.toLocaleString('en-IN')}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-xs text-slate-400">Assigned</p>
                <p className="font-semibold text-slate-800">{new Date(assignment.assignedAt).toLocaleDateString('en-IN')}</p>
              </div>
            </div>
            <details className="mt-4 rounded-2xl border border-slate-100 bg-slate-50">
              <summary className="cursor-pointer list-none px-4 py-3 text-sm font-bold text-cyan-700">View full tour and booking details</summary>
              <div className="grid grid-cols-1 gap-4 border-t border-slate-100 p-4 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Package Details</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{assignment.booking.package.description}</p>
                  <p className="mt-2 text-sm text-slate-600">Duration: <span className="font-semibold">{assignment.booking.package.duration} days</span></p>
                  <p className="text-sm text-slate-600">Category: <span className="font-semibold">{assignment.booking.package.category}</span></p>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Booking Details</h3>
                  <p className="mt-2 text-sm text-slate-600">Booking status: <span className="font-semibold">{assignment.booking.status}</span></p>
                  <p className="text-sm text-slate-600">Created: <span className="font-semibold">{new Date(assignment.booking.createdAt).toLocaleDateString('en-IN')}</span></p>
                  {assignment.completedAt && <p className="text-sm text-slate-600">Completed: <span className="font-semibold">{new Date(assignment.completedAt).toLocaleDateString('en-IN')}</span></p>}
                  {assignment.feedback && <p className="mt-2 rounded-xl bg-white p-3 text-sm text-slate-600">{assignment.feedback}</p>}
                </div>
              </div>
            </details>
            {assignment.status === 'ASSIGNED' && <AssignmentActions assignmentId={assignment.id} />}
          </div>
        ))}
        {filteredAssignments.length === 0 && <div className="rounded-3xl bg-white p-10 text-center text-slate-400 shadow-sm">No assignments found for this view.</div>}
      </div>
    </div>
  )
}


