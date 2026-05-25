import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getAgentPayout, getCompanyCommission } from '@/lib/commission'
import AgentTourSelector from './AgentTourSelector'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function asStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return []

  return value.map((item) => {
    if (typeof item === 'string') return item
    if (item && typeof item === 'object') {
      const entry = item as Record<string, unknown>
      return String(entry.title || entry.activity || entry.description || entry.details || '')
    }
    return ''
  }).filter(Boolean)
}

function itineraryRows(value: unknown): { title: string; details: string }[] {
  if (!value) return []

  if (Array.isArray(value)) {
    return value.map((item, index) => {
      if (typeof item === 'string') return { title: `Day ${index + 1}`, details: item }
      if (item && typeof item === 'object') {
        const entry = item as Record<string, unknown>
        return {
          title: String(entry.day || entry.title || `Day ${index + 1}`),
          details: String(entry.activity || entry.description || entry.details || entry.plan || ''),
        }
      }
      return { title: `Day ${index + 1}`, details: String(item) }
    }).filter((row) => row.details)
  }

  if (typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>).map(([title, details]) => ({
      title,
      details: typeof details === 'string' ? details : JSON.stringify(details),
    }))
  }

  return []
}

type PageProps = {
  searchParams?: Promise<{ view?: string }>
}

export default async function AgentToursPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect('/agent-login?callbackUrl=/agent/tours')
  const userEmail = session.user.email
  const resolvedSearchParams = await searchParams

  const user = await (async () => {
    try {
      return await prisma.user.findUnique({
        where: { email: userEmail.toLowerCase() },
        include: { agent: { include: { preferredTours: true } } },
      })
    } catch (e) {
      console.error("AgentToursPage: prisma.user.findUnique failed:", e)
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
          <a href="/agent-login" className="block w-full rounded-2xl bg-orange-500 py-3 font-bold text-white hover:bg-orange-600">
            Back to Login
          </a>
        </div>
      </div>
    )
  }
  if (user.agent.status === 'PENDING') redirect('/agent/pending')
  if (user.agent.status === 'SUSPENDED') redirect('/')

  const agent = user.agent

  const packages = await prisma.package.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  }).catch(() => [])
  const selectedIds = new Set(agent.preferredTours.map((pref) => pref.packageId))
  const showCoveredOnly = resolvedSearchParams?.view === 'covered'
  const visiblePackages = showCoveredOnly ? packages.filter((pkg) => selectedIds.has(pkg.id)) : packages

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{showCoveredOnly ? 'Tours I Cover' : 'Available Tours'}</h1>
        <p className="mt-1 text-sm text-slate-500">Select tours you are comfortable handling. Admins use this to assign better matches.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <a href="/agent/tours" className={`rounded-full px-4 py-2 text-xs font-bold ${!showCoveredOnly ? 'bg-cyan-700 text-white' : 'bg-white text-slate-600 shadow-sm hover:text-cyan-700'}`}>
          All tours ({packages.length})
        </a>
        <a href="/agent/tours?view=covered" className={`rounded-full px-4 py-2 text-xs font-bold ${showCoveredOnly ? 'bg-cyan-700 text-white' : 'bg-white text-slate-600 shadow-sm hover:text-cyan-700'}`}>
          Tours I cover ({selectedIds.size})
        </a>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {visiblePackages.map((pkg) => {
          const companyCommission = getCompanyCommission(pkg.price)
          const agentPayout = getAgentPayout(pkg.price)
          const selected = selectedIds.has(pkg.id)
          const itinerary = itineraryRows(pkg.itinerary)
          const highlights = asStringList(pkg.inclusions).slice(0, 3)

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
              {highlights.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {highlights.map((item) => (
                    <span key={item} className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700">{item}</span>
                  ))}
                </div>
              )}
              <details className="group mt-4 rounded-2xl border border-slate-100 bg-slate-50">
                <summary className="cursor-pointer list-none px-4 py-3 text-sm font-bold text-orange-600">
                  <span className="group-open:hidden">View details</span>
                  <span className="hidden group-open:inline">Hide details</span>
                </summary>
                <div className="space-y-5 border-t border-slate-100 px-4 py-4">
                  <p className="text-sm leading-6 text-slate-600">{pkg.description}</p>
                  {pkg.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {pkg.images.slice(0, 3).map((image) => (
                        <img key={image} src={image} alt={pkg.title} className="h-28 w-full rounded-2xl object-cover" />
                      ))}
                    </div>
                  )}
                  {itinerary.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Itinerary</h3>
                      <div className="mt-2 space-y-2">
                        {itinerary.map((day) => (
                          <div key={`${pkg.id}-${day.title}`} className="rounded-xl bg-white p-3">
                            <p className="text-xs font-bold uppercase text-cyan-700">{day.title}</p>
                            <p className="mt-1 text-sm text-slate-600">{day.details}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Inclusions</h3>
                      <ul className="mt-2 space-y-1 text-sm text-slate-600">
                        {pkg.inclusions.map((item) => <li key={item}>- {item}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Exclusions</h3>
                      <ul className="mt-2 space-y-1 text-sm text-slate-600">
                        {pkg.exclusions.map((item) => <li key={item}>- {item}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              </details>
            </div>
          )
        })}
        {visiblePackages.length === 0 && (
          <div className="rounded-3xl bg-white p-10 text-center text-slate-400 shadow-sm lg:col-span-2">
            No covered tours yet. Select tours from the available list.
          </div>
        )}
      </div>
    </div>
  )
}


