import Link from 'next/link'
import { prisma } from '@/lib/db'
import PackageCard from '@/components/packages/PackageCard'
import {
  GlobeAsiaAustraliaIcon,
  PhoneIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UserGroupIcon,
  UserIcon,
} from '@heroicons/react/24/outline'

export const dynamic = 'force-dynamic'

async function getFeaturedPackages() {
  return await prisma.package.findMany({
    where: { isActive: true },
    take: 6,
    orderBy: { createdAt: 'desc' }
  })
}

const categories = [
  { label: 'Solo Trips', value: 'SOLO', icon: UserIcon, style: 'from-indigo-200 to-indigo-100 text-indigo-700' },
  { label: 'Family', value: 'FAMILY', icon: UserGroupIcon, style: 'from-sky-200 to-sky-100 text-sky-700' },
  { label: 'Group Tours', value: 'GROUP', icon: GlobeAsiaAustraliaIcon, style: 'from-amber-200 to-amber-100 text-amber-700' },
  { label: 'Pilgrimage', value: 'PILGRIMAGE', icon: SparklesIcon, style: 'from-orange-200 to-orange-100 text-orange-700' },
  { label: 'Adventure', value: 'ADVENTURE', icon: ShieldCheckIcon, style: 'from-emerald-200 to-emerald-100 text-emerald-700' },
]

export default async function HomePage() {
  const packages = await getFeaturedPackages()

  return (
    <div className="animate-fade-up">
      <section className="px-4 pb-14 pt-10 md:pt-14">
        <div className="section-shell mx-auto overflow-hidden rounded-[2rem] border border-white/80">
          <div className="relative bg-gradient-to-br from-slate-900 via-cyan-900 to-teal-800 px-6 py-14 text-white md:px-10 md:py-20">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-orange-400/20 blur-3xl" />
            <div className="absolute -bottom-28 -left-12 h-64 w-64 rounded-full bg-teal-300/20 blur-3xl" />
            <div className="relative mx-auto max-w-5xl text-center">
              <span className="inline-flex rounded-full border border-cyan-300/35 bg-cyan-400/20 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100">
                Trusted India Tours
              </span>
              <h1 className="mt-5 text-4xl font-black tracking-tight md:text-6xl">
                Explore India and Beyond
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-sm text-cyan-50/90 md:text-lg">
                Handcrafted journeys with local experts, transparent pricing, and fast support from planning to payment.
              </p>
              <form action="/packages" className="mx-auto mt-8 flex w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-white/95 p-2 shadow-2xl sm:flex-row">
                <input
                  type="text"
                  name="search"
                  placeholder="Search destination: Goa, Kashmir, Kerala..."
                  className="h-12 w-full rounded-xl px-4 text-sm text-slate-700 outline-none md:text-base"
                />
                <button
                  type="submit"
                  className="mt-2 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 px-8 text-sm font-semibold text-white hover:from-orange-600 hover:to-amber-600 sm:mt-0"
                >
                  Find Packages
                </button>
              </form>
              <div className="mt-10 grid grid-cols-2 gap-3 text-left sm:grid-cols-4">
                {[
                  { label: 'Happy Travelers', value: '50,000+' },
                  { label: 'Tour Packages', value: '200+' },
                  { label: 'Destinations', value: '100+' },
                  { label: 'Years Experience', value: '10+' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur">
                    <div className="text-xl font-bold md:text-2xl">{stat.value}</div>
                    <div className="mt-1 text-xs text-cyan-100/90 md:text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-4">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-extrabold text-slate-900 md:text-3xl">Browse by Category</h2>
          <p className="mt-2 text-sm text-slate-600 md:text-base">Find the perfect trip for every travel style</p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <Link
                key={cat.value}
                href={`/packages?category=${cat.value}`}
                className={`group rounded-2xl border border-white/70 bg-gradient-to-br p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${cat.style}`}
              >
                <Icon className="h-6 w-6" />
                <span className="mt-4 block text-sm font-bold">{cat.label}</span>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-7 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Featured Packages</h2>
            <p className="mt-1 text-sm text-slate-600">Most loved trips this season</p>
          </div>
          <Link href="/packages" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-orange-300 hover:text-orange-600">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} package={pkg} />
          ))}
        </div>
        {packages.length === 0 && (
          <p className="rounded-2xl border border-dashed border-slate-300 py-10 text-center text-slate-500">
            No packages yet. Add some from the admin panel.
          </p>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14">
        <div className="section-shell rounded-[2rem] px-6 py-10 md:px-10">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-extrabold text-slate-900">Why Choose Travel Sphere</h2>
            <p className="mt-2 text-sm text-slate-600">Reliable tours with support at every step</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {[
              { title: 'Verified Tours', desc: 'Every package is quality checked by our operations team.' },
              { title: 'Transparent Pricing', desc: 'No hidden fees, clear taxes, and clear inclusions.' },
              { title: '24/7 Support', desc: 'Fast support on call, chat, and WhatsApp.' },
              { title: 'Expert Guides', desc: 'Experienced guides and local partners at destinations.' },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-white/95 p-5">
                <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-8 text-center text-white md:flex-row md:text-left">
          <div>
            <h2 className="text-2xl font-extrabold">Need Help Planning Your Trip?</h2>
            <p className="mt-1 text-emerald-50">Chat with our travel experts for instant guidance.</p>
          </div>
          <a
            href="https://wa.me/918603606089"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-emerald-600 hover:bg-emerald-50"
          >
            <PhoneIcon className="h-5 w-5" />
            Chat on WhatsApp
          </a>
        </div>
      </section>
    </div>
  )
}
