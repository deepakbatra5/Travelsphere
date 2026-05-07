import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getAgentPayout, getCompanyCommission } from '@/lib/commission'
import AgentTourSelector from './AgentTourSelector'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AgentToursPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect('/agent-login?callbackUrl=/agent/tours')
  const userEmail = session.user.email

  const user = await (async () => {
    try {
      return await prisma.user.findUnique({
        where: { email: userEmail },
        include: { agent: { include: { preferredTours: true } } },
      })
    } catch {
      return null
    }
  })()

  if (!user) redirect('/agent-register')

  if (!user?.agent) redirect('/agent-register')
  if (user.agent.status === 'PENDING') redirect('/agent/pending')
  if (user.agent.status === 'SUSPENDED') redirect('/')

  const agent = user.agent

  const packages = await prisma.package.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  }).catch(() => [])
  const selectedIds = new Set(agent.preferredTours.map((pref) => pref.packageId))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Available Tours</h1>
        <p className="mt-1 text-sm text-slate-500">Select tours you are comfortable handling. Admins use this to assign better matches.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {packages.map((pkg) => {
          const companyCommission = getCompanyCommission(pkg.price)
          const agentPayout = getAgentPayout(pkg.price)
          const selected = selectedIds.has(pkg.id)

          return (
            <div key={pkg.id} className="rounded-3xl bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-bold text-slate-900">{pkg.title}</h2>
                  <p className="mt-1 text-sm text-slate-500">{pkg.destination}</p>
                </div>
                <AgentTourSelector agentId={agent.id} packageId={pkg.id} selected={selected} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-400">Duration</p>
                  <p className="font-bold text-slate-800">{pkg.duration} Days</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-400">Price</p>
                  <p className="font-bold text-slate-800">Rs {pkg.price.toLocaleString('en-IN')}</p>
                </div>
                <div className="rounded-2xl bg-orange-50 p-3">
                  <p className="text-xs text-orange-600">Company Share</p>
                  <p className="font-bold text-orange-700">Rs {companyCommission.toLocaleString('en-IN')}</p>
                </div>
                <div className="rounded-2xl bg-emerald-50 p-3">
                  <p className="text-xs text-emerald-600">Agent Payout</p>
                  <p className="font-bold text-emerald-700">Rs {agentPayout.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
