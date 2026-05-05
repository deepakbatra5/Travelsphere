import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AgentMyToursPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect('/login?callbackUrl=/agent/my-tours')
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Assignments</h1>
        <p className="mt-1 text-sm text-slate-500">{assignments.length} assigned tour(s)</p>
      </div>

      <div className="space-y-4">
        {assignments.map((assignment) => (
          <div key={assignment.id} className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex flex-col justify-between gap-4 sm:flex-row">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{assignment.booking.package.title}</h2>
                <p className="text-sm text-slate-500">{assignment.booking.package.destination}</p>
                <p className="mt-2 text-sm text-slate-600">Customer: {assignment.booking.user.name} ({assignment.booking.user.email})</p>
              </div>
              <div className="text-left sm:text-right">
                <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-bold text-cyan-700">{assignment.status}</span>
                <p className="mt-2 text-lg font-bold text-emerald-600">Rs {assignment.commission.toLocaleString('en-IN')}</p>
                <p className="text-xs font-semibold text-slate-400">Agent payout</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-xs text-slate-400">Travel Date</p>
                <p className="font-semibold text-slate-800">{new Date(assignment.booking.travelDate).toLocaleDateString('en-IN')}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-xs text-slate-400">Travellers</p>
                <p className="font-semibold text-slate-800">{assignment.booking.travellers}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-xs text-slate-400">Assigned</p>
                <p className="font-semibold text-slate-800">{new Date(assignment.assignedAt).toLocaleDateString('en-IN')}</p>
              </div>
            </div>
          </div>
        ))}
        {assignments.length === 0 && <div className="rounded-3xl bg-white p-10 text-center text-slate-400 shadow-sm">No assignments yet.</div>}
      </div>
    </div>
  )
}
