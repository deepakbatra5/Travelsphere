import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function monthKey(date: Date) {
  return date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
}

export default async function AgentEarningsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect('/?callbackUrl=/earnings')
  const userEmail = session.user.email

  const user = await (async () => {
    try {
      return await prisma.user.findUnique({
        where: { email: userEmail.toLowerCase() },
        include: { agent: true },
      })
    } catch (e) {
      console.error("AgentEarningsPage: prisma.user.findUnique failed:", e)
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
    include: { booking: { include: { package: true } } },
    orderBy: { assignedAt: 'desc' },
  }).catch(() => [])

  const completed = assignments.filter((item) => item.status === 'COMPLETED')
  const total = completed.reduce((sum, item) => sum + item.commission, 0)
  const monthly = completed.reduce<Record<string, { agent: number; tours: number }>>((acc, item) => {
    const key = monthKey(item.completedAt || item.booking.travelDate)
    acc[key] ||= { agent: 0, tours: 0 }
    acc[key].agent += item.commission
    acc[key].tours += 1
    return acc
  }, {})
  const monthlyRows = Object.entries(monthly).slice(-6)
  const maxMonthlyValue = Math.max(1, ...monthlyRows.map(([, row]) => row.agent))

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <a href="#breakdown" className="rounded-3xl bg-emerald-600 p-6 text-white transition hover:-translate-y-0.5 hover:shadow-lg">
          <p className="text-sm text-emerald-100">Total Agent Earnings</p>
          <h1 className="mt-1 text-3xl font-extrabold">Rs {total.toLocaleString('en-IN')}</h1>
          <p className="mt-3 text-xs text-emerald-100">After Travel Sphere deduction</p>
        </a>
        <a href="#breakdown" className="rounded-3xl bg-cyan-700 p-6 text-white transition hover:-translate-y-0.5 hover:shadow-lg">
          <p className="text-sm text-cyan-100">Completed Tours</p>
          <h2 className="mt-1 text-3xl font-extrabold">{completed.length}</h2>
          <p className="mt-3 text-xs text-cyan-100">Tours counted for earnings</p>
        </a>
        <a href="#breakdown" className="rounded-3xl bg-slate-800 p-6 text-white transition hover:-translate-y-0.5 hover:shadow-lg">
          <p className="text-sm text-slate-200">Average Payout</p>
          <h2 className="mt-1 text-3xl font-extrabold">Rs {(completed.length ? total / completed.length : 0).toLocaleString('en-IN')}</h2>
          <p className="mt-3 text-xs text-slate-300">Per completed tour</p>
        </a>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Growth Comparison</h2>
            <p className="mt-1 text-sm text-slate-500">Monthly agent earnings from completed tours.</p>
          </div>
          <div className="flex gap-3 text-xs font-semibold">
            <span className="flex items-center gap-1 text-emerald-700"><span className="h-3 w-3 rounded-full bg-emerald-500" />Agent earnings</span>
          </div>
        </div>
        {monthlyRows.length > 0 ? (
          <div className="space-y-4">
            {monthlyRows.map(([label, row]) => (
              <div key={label} className="grid grid-cols-1 gap-2 sm:grid-cols-[120px_1fr] sm:items-center">
                <div>
                  <p className="text-sm font-bold text-slate-800">{label}</p>
                  <p className="text-xs text-slate-400">{row.tours} tour(s)</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.max(5, (row.agent / maxMonthlyValue) * 100)}%` }} />
                    </div>
                    <span className="w-28 text-right text-xs font-bold text-emerald-700">Rs {row.agent.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-sm text-slate-400">No completed tours yet. Your growth chart will appear after completed assignments.</p>
        )}
      </div>

      <div id="breakdown" className="rounded-3xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-slate-900">Trip-wise Agent Earnings</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-100 text-left text-slate-400">
              <tr>
                <th className="pb-3 font-medium">Package</th>
                <th className="pb-3 font-medium">Destination</th>
                <th className="pb-3 font-medium">Booking Amount</th>
                <th className="pb-3 font-medium">Travel Date</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Agent Earning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {assignments.map((assignment) => (
                  <tr key={assignment.id}>
                    <td className="py-3 font-medium text-slate-800">{assignment.booking.package.title}</td>
                    <td className="py-3 text-slate-500">{assignment.booking.package.destination}</td>
                    <td className="py-3 font-semibold text-slate-700">Rs {assignment.booking.totalAmount.toLocaleString('en-IN')}</td>
                    <td className="py-3 text-slate-500">{new Date(assignment.booking.travelDate).toLocaleDateString('en-IN')}</td>
                    <td className="py-3 text-slate-500">{assignment.status}</td>
                    <td className="py-3 font-bold text-emerald-600">Rs {assignment.commission.toLocaleString('en-IN')}</td>
                  </tr>
              ))}
            </tbody>
          </table>
          {assignments.length === 0 && <p className="py-8 text-center text-slate-400">No earnings history yet.</p>}
        </div>
      </div>
    </div>
  )
}
