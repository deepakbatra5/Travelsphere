import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import { MapPinIcon, StarIcon } from '@heroicons/react/24/outline'
import TourDetailTabs from '@/components/packages/TourDetailTabs'
import TourBookingSidebar from '@/components/packages/TourBookingSidebar'
import { getDetailedTourDescription, getDetailedItinerary } from '@/lib/tourHelpers'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

// ─── Custom Icons for PACKAGE INCLUDES ──────────────────────────────────────────

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

// ─── Safe JSON cast for itinerary ─────────────────────────────────────────────
function safeParseItinerary(raw: unknown): { day: number; title: string; description: string }[] {
  try {
    if (!raw) return []
    if (Array.isArray(raw)) {
      return raw
        .filter((item): item is Record<string, unknown> => item !== null && typeof item === 'object')
        .map((item) => ({
          day: typeof item.day === 'number' ? item.day : Number(item.day) || 0,
          title: typeof item.title === 'string' ? item.title : String(item.title || ''),
          description: typeof item.description === 'string' ? item.description : String(item.description || ''),
        }))
        .filter((item) => item.day > 0)
    }
    return []
  } catch {
    return []
  }
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default async function TourDetailPage({ params }: Props) {
  let slug: string
  try {
    const p = await params
    slug = p?.slug || ''
  } catch {
    return notFound()
  }

  if (!slug) return notFound()

  // Fetch session — non-blocking (failure is okay, just means user is logged out)
  let session = null
  try {
    session = await getServerSession(authOptions)
  } catch {
    session = null
  }

  // Fetch package data with full error handling
  let pkg = null
  try {
    pkg = await prisma.package.findUnique({
      where: { slug },
      include: {
        reviews: {
          include: { user: { select: { name: true } } },
          orderBy: { createdAt: 'desc' }
        },
        tripDates: {
          where: { startDate: { gte: new Date() } },
          orderBy: { startDate: 'asc' }
        }
      }
    })
  } catch (err) {
    console.error('[TourDetailPage] DB error fetching package:', err)
    return notFound()
  }

  if (!pkg || !pkg.isActive) return notFound()

  // ─── Runtime safety guards for all DB arrays/fields ─────────────────────────
  const safeImages = Array.isArray(pkg.images) ? pkg.images.filter(Boolean) : []
  const safeInclusions = Array.isArray(pkg.inclusions) ? pkg.inclusions.filter(Boolean) : []
  const safeExclusions = Array.isArray(pkg.exclusions) ? pkg.exclusions.filter(Boolean) : []
  const safeReviews = Array.isArray(pkg.reviews) ? pkg.reviews : []
  const safeTripDates = Array.isArray(pkg.tripDates) ? pkg.tripDates : []
  const safeDestination = pkg.destination || ''
  const safeTitle = pkg.title || 'Tour Package'
  const safeSlug = pkg.slug || slug
  const safeDescription = pkg.description || ''
  const safeCategory = (pkg.category === 'HONEYMOON' ? 'SOLO' : pkg.category) || 'SOLO'
  const safePrice = typeof pkg.price === 'number' ? pkg.price : 0
  const safeDuration = typeof pkg.duration === 'number' ? pkg.duration : 0

  // Safely parse itinerary from Prisma Json type
  const parsedItinerary = safeParseItinerary(pkg.itinerary)

  // Apply enriched itinerary from helpers
  let itinerary = parsedItinerary
  try {
    itinerary = getDetailedItinerary(safeSlug, parsedItinerary)
  } catch {
    itinerary = parsedItinerary
  }

  // Average rating
  const avgRating = safeReviews.length
    ? (safeReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / safeReviews.length).toFixed(1)
    : null

  // Map package data for tabs — fully safe objects
  const packageDataForTabs = {
    id: pkg.id,
    title: safeTitle,
    price: safePrice,
    duration: safeDuration,
    itinerary,
    inclusions: safeInclusions,
    exclusions: safeExclusions,
    tripDates: safeTripDates.map((td) => ({
      id: td.id,
      startDate: td.startDate ? td.startDate.toISOString() : new Date().toISOString(),
      totalSeats: td.totalSeats ?? 0,
      availableSeats: td.availableSeats ?? 0,
    })),
    reviews: safeReviews.map((r) => ({
      id: r.id,
      rating: r.rating ?? 0,
      comment: r.comment || '',
      createdAt: r.createdAt ? r.createdAt.toISOString() : new Date().toISOString(),
      user: { name: (r.user?.name) || (r.guestName) || 'Anonymous' },
    })),
    category: safeCategory,
  }

  // Description paragraphs
  let descriptionParagraphs: string[] = []
  try {
    descriptionParagraphs = getDetailedTourDescription(safeSlug, safeTitle, safeDestination, safeCategory, safeDescription)
  } catch {
    descriptionParagraphs = [safeDescription || 'Experience an amazing tour package.']
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      {/* Breadcrumbs */}
      <div className="mb-5 text-sm font-semibold text-slate-600 dark:text-slate-400">
        <Link href="/" className="hover:text-orange-600 transition">Home</Link>
        {' / '}
        <Link href="/tours" className="hover:text-orange-600 transition">All Packages</Link>
        {' / '}
        <span className="text-slate-900 dark:text-white">{safeTitle}</span>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content Area (Left/Center) */}
        <div className="space-y-7 lg:col-span-2">
          {/* Tour Image Gallery */}
          <div className="surface-card grid grid-cols-2 gap-2 overflow-hidden rounded-3xl p-2">
            {safeImages.slice(0, 4).map((img, i) => (
              <div key={i} className={`relative overflow-hidden rounded-2xl ${i === 0 ? 'col-span-2 h-64 md:h-96' : 'h-40 md:h-52'}`}>
                <Image
                  src={img}
                  alt={`${safeTitle} photo ${i + 1}`}
                  fill
                  sizes={i === 0 ? '(max-width: 1024px) 100vw, 66vw' : '(max-width: 1024px) 50vw, 25vw'}
                  className="object-cover transition duration-500 hover:scale-102"
                  unoptimized
                />
              </div>
            ))}
            {safeImages.length === 0 && (
              <div className="col-span-2 flex h-64 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-neutral-900">
                No images available
              </div>
            )}
          </div>

          {/* Header Summary Section */}
          <section className="surface-card rounded-3xl p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700 dark:bg-orange-950/40 dark:text-orange-400">
                  {safeCategory}
                </span>
                <h1 className="mt-3 text-3xl font-black text-slate-900 dark:text-white">{safeTitle}</h1>
                <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400">
                  <MapPinIcon className="h-4 w-4 text-orange-500" />
                  {safeDestination}
                </p>
              </div>
              {avgRating && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50/70 px-4 py-3 text-center dark:border-amber-900/30 dark:bg-amber-950/20">
                  <div className="inline-flex items-center gap-1 text-lg font-black text-amber-600 dark:text-amber-400">
                    <StarIcon className="h-5 w-5" />
                    {avgRating}
                  </div>
                  <div className="text-xs font-bold text-amber-700 dark:text-amber-500">{safeReviews.length} reviews</div>
                </div>
              )}
            </div>
            
            <div className="mt-6 border-t border-slate-100 pt-5 dark:border-neutral-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">About this tour</h3>
              <div className="mt-3 space-y-4">
                {descriptionParagraphs.map((para, idx) => (
                  <p key={idx} className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {/* Package Includes Section */}
            <div className="mt-8 border-t border-slate-100 pt-6 dark:border-neutral-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                PACKAGE INCLUDES
              </h3>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: 'Hotel', Icon: HotelIcon },
                  { label: 'Transport', Icon: TransportIcon },
                  { label: 'Meals', Icon: MealsIcon },
                  { label: 'Sightseeing', Icon: SightseeingIcon },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-center rounded-2xl bg-slate-50/70 p-4 text-center dark:bg-neutral-900/20 border border-slate-100/60 dark:border-neutral-800/20 transition hover:bg-slate-100/50 dark:hover:bg-neutral-900/40"
                  >
                    <item.Icon className="h-6 w-6 text-orange-500" />
                    <span className="mt-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Tabbed Interactive Information Container */}
          <TourDetailTabs pkg={packageDataForTabs} sessionUserId={session?.user?.id} />
        </div>

        {/* Sidebar Area (Right) */}
        <aside className="lg:col-span-1">
          <div className="sticky top-24">
            <TourBookingSidebar
              packageId={pkg.id}
              title={safeTitle}
              price={safePrice}
              duration={safeDuration}
              category={safeCategory}
              destination={safeDestination}
              tripDates={safeTripDates.map((td) => ({
                id: td.id,
                startDate: td.startDate ? td.startDate.toISOString() : new Date().toISOString(),
                totalSeats: td.totalSeats ?? 0,
                availableSeats: td.availableSeats ?? 0,
              }))}
            />
          </div>
        </aside>
      </div>
    </div>
  )
}
