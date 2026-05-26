import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getAgentPayout, getCompanyCommission } from '@/lib/commission'
import AgentTourSelector from './AgentTourSelector'
import { getDetailedTourDescription, getDetailedItinerary } from '@/lib/tourHelpers'
import { StarIcon } from '@heroicons/react/24/solid'

// SVG Inclusions Icons matching customer panel
const HotelIcon = (props: React.ComponentProps<'svg'>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
  </svg>
)

const TransportIcon = (props: React.ComponentProps<'svg'>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.75a1.125 1.125 0 0 1-1.125-1.125V15h9.75M8.25 18.75h6m3 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.5a1.125 1.125 0 0 0 1.125-1.125v-9.25A2.25 2.25 0 0 0 15.75 6h-2.25m3.75 12.75v-3H8.25v-3.75M13.5 6h-7.5A2.25 2.25 0 0 0 3.75 8.25v3.75m0 0h9.75V6" />
  </svg>
)

const MealsIcon = (props: React.ComponentProps<'svg'>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 3v7a6 6 0 0 0 4 5.65V21M17 3v18M20 8a3 3 0 0 0-3-3h0a3 3 0 0 0-3 3" />
  </svg>
)

const SightseeingIcon = (props: React.ComponentProps<'svg'>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
  </svg>
)

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

// Unused itineraryRows helper removed

type PageProps = {
  searchParams?: Promise<{ view?: string }>
}

export default async function AgentToursPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect('/?callbackUrl=/tours')
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
          <a href="/login" className="block w-full rounded-2xl bg-orange-500 py-3 font-bold text-white hover:bg-orange-600">
            Back to Login
          </a>
        </div>
      </div>
    )
  }
      if (user.agent.status === 'PENDING') redirect('/pending')
  if (user.agent.status === 'SUSPENDED') redirect('/')

  const agent = user.agent

  const packages = await prisma.package.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
    include: {
      tripDates: { orderBy: { startDate: 'asc' } },
      reviews: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
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
        <Link href="/tours" className={`rounded-full px-4 py-2 text-xs font-bold ${!showCoveredOnly ? 'bg-cyan-700 text-white' : 'bg-white text-slate-600 shadow-sm hover:text-cyan-700'}`}>
          All tours ({packages.length})
        </Link>
        <Link href="/tours?view=covered" className={`rounded-full px-4 py-2 text-xs font-bold ${showCoveredOnly ? 'bg-cyan-700 text-white' : 'bg-white text-slate-600 shadow-sm hover:text-cyan-700'}`}>
          Tours I cover ({selectedIds.size})
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {visiblePackages.map((pkg) => {
          const companyCommission = getCompanyCommission(pkg.price)
          const agentPayout = getAgentPayout(pkg.price)
          const selected = selectedIds.has(pkg.id)
          const avgRating = pkg.reviews && pkg.reviews.length
            ? (pkg.reviews.reduce((sum, r) => sum + r.rating, 0) / pkg.reviews.length).toFixed(1)
            : null
          const descriptionParagraphs = getDetailedTourDescription(
            pkg.slug,
            pkg.title,
            pkg.destination,
            pkg.category,
            pkg.description
          )
          const itinerary = getDetailedItinerary(
            pkg.slug,
            pkg.itinerary as Array<{
              day: number
              title: string
              description: string
            }>
          )
          const highlights = asStringList(pkg.inclusions).slice(0, 3)

          const tripDates = pkg.tripDates || []

          return (
            <div key={pkg.id} className="rounded-3xl bg-white p-5 shadow-sm transform transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-bold text-slate-900">{pkg.title}</h2>
                    {avgRating && (
                      <span className="inline-flex items-center gap-0.5 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700 border border-amber-200">
                        <StarIcon className="w-3 h-3 text-amber-500 fill-amber-500" />
                        {avgRating}
                      </span>
                    )}
                  </div>
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
              {/* Upcoming dates */}
              {tripDates.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-bold text-slate-900 mb-2">Upcoming Dates</h3>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {tripDates.slice(0, 6).map((td) => {
                      const start = new Date(td.startDate)
                      const soldOut = td.availableSeats <= 0
                      return (
                        <div key={td.id} className={`min-w-40 shrink-0 rounded-2xl border px-3 py-2 text-sm ${soldOut ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'} transform transition hover:scale-105`}> 
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs text-slate-500">{start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                              <div className="font-semibold text-slate-800">{start.toLocaleDateString('en-IN', { year: 'numeric' })}</div>
                            </div>
                            <div className="text-right">
                              {soldOut ? (
                                <span className="text-xs font-semibold text-red-600">Sold out</span>
                              ) : (
                                <span className="text-xs font-semibold text-emerald-700">{td.availableSeats} seats</span>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
              <details className="group mt-4 rounded-2xl border border-slate-100 bg-slate-50">
                <summary className="cursor-pointer list-none px-4 py-3 text-sm font-bold text-orange-600">
                  <span className="group-open:hidden">View details</span>
                  <span className="hidden group-open:inline">Hide details</span>
                </summary>
                <div className="space-y-5 border-t border-slate-100 px-4 py-4">
                  <div className="space-y-3">
                    {descriptionParagraphs.map((para, idx) => (
                      <p key={idx} className="text-sm leading-relaxed text-slate-700">
                        {para}
                      </p>
                    ))}
                  </div>
                  {pkg.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {pkg.images.slice(0, 3).map((image) => (
                        <img key={image} src={image} alt={pkg.title} className="h-28 w-full rounded-2xl object-cover" />
                      ))}
                    </div>
                  )}
                  {/* Package Inclusions Icons Grid */}
                  <div className="border-t border-slate-200/60 pt-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Package Inclusions</h3>
                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                      {[
                        { label: 'Hotel', Icon: HotelIcon },
                        { label: 'Transport', Icon: TransportIcon },
                        { label: 'Meals', Icon: MealsIcon },
                        { label: 'Sightseeing', Icon: SightseeingIcon },
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col items-center justify-center rounded-2xl bg-white p-3 text-center border border-slate-100 transition hover:bg-slate-50"
                        >
                          <item.Icon className="h-5 w-5 text-orange-500" />
                          <span className="mt-1.5 text-xs font-semibold text-slate-700">
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {itinerary.length > 0 && (
                    <div className="border-t border-slate-200/60 pt-4">
                      <h3 className="text-sm font-bold text-slate-900 mb-2">Itinerary</h3>
                      <div className="space-y-2">
                        {itinerary.map((day) => (
                          <div key={`${pkg.id}-${day.day}`} className="rounded-xl bg-white p-3 border border-slate-100">
                            <p className="text-xs font-bold uppercase text-cyan-700">Day {day.day}: {day.title}</p>
                            <p className="mt-1 text-sm text-slate-600 leading-relaxed whitespace-pre-line">{day.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 border-t border-slate-200/60 pt-4">
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
                  {/* Customer Reviews Feed */}
                  {pkg.reviews && pkg.reviews.length > 0 && (
                    <div className="border-t border-slate-200/60 pt-4">
                      <h3 className="text-sm font-bold text-slate-900 mb-2">Customer Reviews ({pkg.reviews.length})</h3>
                      <div className="space-y-2.5 max-h-60 overflow-y-auto pr-2">
                        {pkg.reviews.map((rev) => (
                          <div key={rev.id} className="rounded-xl bg-white p-3 border border-slate-100 shadow-2xs">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-xs text-slate-700">{rev.user ? rev.user.name : (rev.guestName || 'Anonymous')}</span>
                              <div className="flex items-center text-amber-500 gap-0.5">
                                <StarIcon className="w-3 h-3 fill-amber-500 text-amber-500" />
                                <span className="text-xs font-bold">{rev.rating}</span>
                              </div>
                            </div>
                            <p className="text-xs text-slate-600 italic">&quot;{rev.comment}&quot;</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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


