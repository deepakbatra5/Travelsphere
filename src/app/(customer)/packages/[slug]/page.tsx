import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { authOptions } from '@/lib/auth'
import {
  CalendarDaysIcon,
  ChatBubbleBottomCenterTextIcon,
  ClockIcon,
  MapPinIcon,
  StarIcon,
} from '@heroicons/react/24/outline'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function PackageDetailPage({ params }: Props) {
  const { slug } = await params
  const session = await getServerSession(authOptions)

  if (!slug) return notFound()

  const pkg = await prisma.package.findUnique({
    where: { slug },
    include: {
      reviews: {
        include: { user: { select: { name: true } } }
      }
    }
  })

  if (!pkg || !pkg.isActive) return notFound()

  const itinerary = pkg.itinerary as Array<{
    day: number
    title: string
    description: string
  }>

  const avgRating = pkg.reviews.length
    ? (pkg.reviews.reduce((sum, r) => sum + r.rating, 0) / pkg.reviews.length).toFixed(1)
    : null
  const category = pkg.category === 'HONEYMOON' ? 'SOLO' : pkg.category

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-5 text-sm font-semibold text-slate-600">
        <Link href="/" className="hover:text-orange-600">Home</Link>
        {' / '}
        <Link href="/packages" className="hover:text-orange-600">Packages</Link>
        {' / '}
        <span className="text-slate-900">{pkg.title}</span>
      </div>

      <div className="grid grid-cols-1 gap-7 lg:grid-cols-3">
        <div className="space-y-7 lg:col-span-2">
          <div className="surface-card grid grid-cols-2 gap-2 overflow-hidden rounded-3xl p-2">
            {pkg.images.slice(0, 4).map((img, i) => (
              <div key={i} className={`relative overflow-hidden rounded-2xl ${i === 0 ? 'col-span-2 h-64 md:h-80' : 'h-40 md:h-48'}`}>
                <Image
                  src={img}
                  alt={`${pkg.title} photo ${i + 1}`}
                  fill
                  sizes={i === 0 ? '(max-width: 1024px) 100vw, 66vw' : '(max-width: 1024px) 50vw, 25vw'}
                  className="object-cover"
                />
              </div>
            ))}
            {pkg.images.length === 0 && (
              <div className="col-span-2 flex h-64 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                No images available
              </div>
            )}
          </div>

          <section className="surface-card rounded-3xl p-6 md:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                  {category}
                </span>
                <h1 className="mt-3 text-3xl font-extrabold text-slate-900">{pkg.title}</h1>
                <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-600">
                  <MapPinIcon className="h-4 w-4" />
                  {pkg.destination}
                </p>
              </div>
              {avgRating && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-center">
                  <div className="inline-flex items-center gap-1 text-lg font-bold text-amber-600">
                    <StarIcon className="h-5 w-5" />
                    {avgRating}
                  </div>
                  <div className="text-xs font-semibold text-amber-700">{pkg.reviews.length} reviews</div>
                </div>
              )}
            </div>
            <p className="mt-4 leading-relaxed text-slate-700">{pkg.description}</p>
          </section>

          <section className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="surface-card rounded-3xl p-5">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-emerald-700">Included</h3>
              <ul className="space-y-2">
                {pkg.inclusions.map((item, i) => (
                  <li key={i} className="text-sm text-slate-700">{item}</li>
                ))}
              </ul>
            </div>
            <div className="surface-card rounded-3xl p-5">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-rose-700">Not Included</h3>
              <ul className="space-y-2">
                {pkg.exclusions.map((item, i) => (
                  <li key={i} className="text-sm text-slate-700">{item}</li>
                ))}
              </ul>
            </div>
          </section>

          <section className="surface-card rounded-3xl p-6">
            <h2 className="mb-4 text-xl font-extrabold text-slate-900">Day-wise Itinerary</h2>
            <div className="space-y-4">
              {itinerary.map((day) => (
                <div key={day.day} className="overflow-hidden rounded-2xl border border-slate-200">
                  <div className="bg-slate-900 px-4 py-3 text-sm font-bold text-white">
                    Day {day.day}: {day.title}
                  </div>
                  <div className="px-4 py-4 text-sm leading-relaxed text-slate-700">
                    {day.description}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {pkg.reviews.length > 0 && (
            <section className="surface-card rounded-3xl p-6">
              <h2 className="mb-4 text-xl font-extrabold text-slate-900">Traveler Reviews</h2>
              <div className="space-y-4">
                {pkg.reviews.map((review) => (
                  <div key={review.id} className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-bold text-slate-800">{review.user.name}</span>
                      <span className="text-sm font-semibold text-amber-600">{review.rating}/5</span>
                    </div>
                    <p className="text-sm text-slate-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="lg:col-span-1">
          <div className="surface-card sticky top-24 rounded-3xl p-6">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Starting from</span>
              <div className="mt-2 text-4xl font-black text-orange-600">Rs {pkg.price.toLocaleString('en-IN')}</div>
              <div className="text-sm font-semibold text-slate-600">per person</div>
            </div>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="inline-flex items-center gap-2 text-slate-600">
                  <ClockIcon className="h-4 w-4" />
                  Duration
                </span>
                <span className="font-bold text-slate-800">{pkg.duration} Days</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="inline-flex items-center gap-2 text-slate-600">
                  <MapPinIcon className="h-4 w-4" />
                  Destination
                </span>
                <span className="font-bold text-slate-800">{pkg.destination}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="inline-flex items-center gap-2 text-slate-600">
                  <CalendarDaysIcon className="h-4 w-4" />
                  Category
                </span>
                <span className="font-bold text-slate-800">{category}</span>
              </div>
            </div>

            <Link
              href={session?.user ? `/booking/${pkg.id}` : `/login?callbackUrl=/booking/${pkg.id}`}
              className="mt-6 block w-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 py-3 text-center text-sm font-bold text-white hover:from-orange-600 hover:to-amber-600"
            >
              {session?.user ? 'Book Now' : 'Login to Book'}
            </Link>

            <a
              href={`https://wa.me/918603606089?text=Hi, I am interested in the ${pkg.title} package`}
              target="_blank"
              rel="noreferrer"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500 py-3 text-sm font-bold text-white hover:bg-emerald-600"
            >
              <ChatBubbleBottomCenterTextIcon className="h-5 w-5" />
              Enquire on WhatsApp
            </a>

            <p className="mt-4 text-center text-xs font-semibold text-slate-500">
              Secure booking with no hidden charges.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
