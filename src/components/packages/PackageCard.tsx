import Link from 'next/link'
import Image from 'next/image'
import { ArrowRightIcon, ClockIcon, MapPinIcon } from '@heroicons/react/24/outline'

const categoryColors: Record<string, string> = {
  FAMILY: 'bg-sky-100/95 text-sky-700',
  GROUP: 'bg-amber-100/95 text-amber-700',
  PILGRIMAGE: 'bg-orange-100/95 text-orange-700',
  ADVENTURE: 'bg-emerald-100/95 text-emerald-700',
  SOLO: 'bg-indigo-100/95 text-indigo-700',
  CORPORATE: 'bg-slate-100/95 text-slate-700',
}

interface Props {
  package: {
    id: string
    slug: string
    title: string
    destination: string
    price: number
    duration: number
    category: string
    images: string[]
  }
  detailBasePath?: string
}

export default function PackageCard({ package: pkg, detailBasePath = '/tours' }: Props) {
  const image = pkg.images?.[0] || '/travel-placeholder.svg'
  const category = pkg.category === 'HONEYMOON' ? 'SOLO' : pkg.category

  return (
    <Link href={`${detailBasePath}/${pkg.slug}`} className="group block">
      <article className="surface-card overflow-hidden rounded-3xl transition hover:-translate-y-1 hover:shadow-xl">
        <div className="relative h-56 w-full overflow-hidden">
          <Image
            src={image}
            alt={pkg.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/45 via-slate-900/10 to-transparent" />
          <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${categoryColors[category] || 'bg-slate-100 text-slate-700'}`}>
            {category}
          </span>
          <div className="absolute right-4 top-4 rounded-xl bg-orange-500/90 px-4 py-2 text-center shadow-lg backdrop-blur-sm transition-transform group-hover:scale-105">
            <div className="text-xl font-black text-white leading-none">15%</div>
            <div className="mt-1 text-[10px] font-bold tracking-widest text-orange-100">SPECIAL OFF</div>
          </div>
          <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-700">
            <MapPinIcon className="h-4 w-4" />
            {pkg.destination}
          </div>
        </div>

        <div className="p-5">
          <h3 className="line-clamp-1 text-lg font-extrabold text-slate-900">{pkg.title}</h3>
          <div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Starting from</span>
              <div className="text-xl font-extrabold text-orange-600">
                Rs {pkg.price.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="flex items-center gap-2 text-right">
              <ClockIcon className="h-5 w-5 text-slate-500" />
              <div>
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Duration</span>
                <div className="text-sm font-bold text-slate-800">{pkg.duration} Days</div>
              </div>
            </div>
          </div>
          <div className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-slate-800">
            View Details
            <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" />
          </div>
        </div>
      </article>
    </Link>
  )
}


