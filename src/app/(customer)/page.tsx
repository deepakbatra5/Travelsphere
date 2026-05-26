import { prisma } from '@/lib/db'
import Link from 'next/link'
import PackageCarousel from '@/components/packages/PackageCarousel'
import DestinationCarousel from '@/components/ui/DestinationCarousel'
import HeroCarousel from '@/components/ui/HeroCarousel'
import CustomerReviews from '@/components/ui/CustomerReviews'
import TrendingTours from '@/components/home/TrendingTours'
import {
  ChatBubbleLeftRightIcon,
  GlobeAsiaAustraliaIcon,
  PhoneIcon,
  ShieldCheckIcon,
  SparklesIcon,
  StarIcon,
  } from '@heroicons/react/24/outline'

export const dynamic = 'force-dynamic'

async function getFeaturedPackages() {
  try {
    return await prisma.package.findMany({
      where: { isActive: true, isFeatured: true },
      take: 9,
      orderBy: { createdAt: 'desc' }
    })
  } catch (error) {
    console.error('Failed to load featured packages:', error)
    return []
  }
}

async function getTrendingPackages() {
  try {
    return await prisma.package.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        slug: true,
        title: true,
        destination: true,
        price: true,
        duration: true,
        category: true,
        images: true,
      },
    })
  } catch (error) {
    console.error('Failed to load trending packages:', error)
    return []
  }
}

import TripSearch from '@/components/home/TripSearch'

export default async function HomePage() {
  const packages = await getFeaturedPackages()
  const trendingPackages = await getTrendingPackages()
  return (
    <div className="animate-fade-up">
      <section className="w-full relative">
        <HeroCarousel />
        {/* Search bar inside hero image, centered */}
        <TripSearch />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:py-16 mt-6">
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-extrabold text-orange-500 mt-1">Featured Packages</h2>
          <p className="mt-3 text-slate-600">Most loved trips this season</p>
        </div>
        <PackageCarousel packages={packages} />
      </section>

      {/* Popular Destinations by Place */}
      <DestinationCarousel />


      <TrendingTours packages={trendingPackages} />

      <section className="mx-auto max-w-7xl px-4 py-14 md:py-16">
        <div className="mb-5 text-center">
          <span className="inline-flex items-center rounded-full bg-orange-100 px-4 py-1.5 text-sm md:text-base font-black uppercase tracking-widest text-orange-600">
            Best of Travel Sphere
          </span>
          <p className="mt-3 text-base font-medium text-slate-500 md:text-lg">
            One place for every trip idea, from AI planning to real traveller stories.
          </p>
        </div>
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-orange-600 via-orange-500 to-amber-500 p-0.5 shadow-2xl shadow-orange-200/50">
          <div className="relative overflow-hidden rounded-[22px] bg-linear-to-br from-orange-600 via-orange-500 to-amber-500 px-6 py-8 md:px-10 md:py-10">
            <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-amber-300/20 blur-3xl" />
            <div className="pointer-events-none absolute right-1/3 bottom-0 h-32 w-32 rounded-full bg-orange-300/20 blur-2xl" />

            <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-xl">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
                  <SparklesIcon className="h-3.5 w-3.5" />
                  AI-Powered Trip Planning
                </div>
                <h2 className="text-2xl font-black leading-tight text-white md:text-3xl lg:text-4xl">
                  Confused where to plan your trip?
                </h2>
                <p className="mt-3 text-orange-100 leading-relaxed md:text-lg">
                  Let our <span className="font-bold text-white">AI Trip Planner</span> design your perfect customised holiday — just have a conversation and we&apos;ll build your dream itinerary instantly.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {[
                    { icon: '🌍', text: 'Any destination worldwide' },
                    { icon: '📅', text: 'Day-by-day itinerary' },
                    { icon: '💰', text: 'Budget planning in ₹' },
                    { icon: '📞', text: 'Expert follows up with you' },
                  ].map((pill) => (
                    <span
                      key={pill.text}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm"
                    >
                      <span>{pill.icon}</span>
                      {pill.text}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-start gap-3 lg:shrink-0 lg:items-center">
                <Link
                  href="/ai-planner"
                  className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl bg-white px-7 py-4 text-base font-black text-orange-600 shadow-xl shadow-black/20 transition-all hover:scale-105 hover:shadow-2xl active:scale-100"
                >
                  <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-100 transition-colors group-hover:bg-orange-200">
                    <ChatBubbleLeftRightIcon className="h-5 w-5 text-orange-600" />
                    <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-green-500">
                      <span className="h-2 w-2 animate-ping rounded-full bg-green-400 opacity-75" />
                    </span>
                  </span>
                  <span>Plan My Trip with AI</span>
                  <span className="text-orange-400 transition-transform group-hover:translate-x-1">→</span>
                </Link>
                <p className="text-center text-xs text-orange-100">
                  Free · Takes 2 minutes · Expert calls you back
                </p>
              </div>
            </div>

            <div className="pointer-events-none absolute bottom-4 right-6 hidden gap-1 md:flex">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className="h-4 w-4 text-white/40"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <CustomerReviews />

      <section className="mx-auto max-w-7xl px-4 pb-14">
        <div className="rounded-[2.5rem] bg-slate-50 px-6 py-16 md:px-12 border border-slate-200 shadow-sm relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-orange-100/50 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-blue-100/50 blur-3xl"></div>

          <div className="relative mb-12 text-center">
            <span className="inline-flex rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-orange-600 shadow-sm mb-4 ring-1 ring-slate-200">Our Promise</span>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 md:text-5xl">Why Choose Travel Sphere</h2>
            <p className="mt-4 text-base text-slate-600 max-w-2xl mx-auto font-medium">We ensure every part of your journey is perfect, reliable, and entirely stress-free.</p>
          </div>

          <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { title: 'Verified Tours', desc: 'Every package is quality checked by our operations team.', icon: ShieldCheckIcon, color: 'from-blue-500 to-cyan-500', shadow: 'hover:shadow-blue-500/25', ring: 'group-hover:border-blue-300' },
              { title: 'Transparent Pricing', desc: 'No hidden fees, clear taxes, and clear inclusions.', icon: SparklesIcon, color: 'from-amber-500 to-orange-500', shadow: 'hover:shadow-orange-500/25', ring: 'group-hover:border-orange-300' },
              { title: '24/7 Support', desc: 'Fast support on call, chat, and WhatsApp.', icon: PhoneIcon, color: 'from-emerald-500 to-teal-400', shadow: 'hover:shadow-emerald-500/25', ring: 'group-hover:border-emerald-300' },
              { title: 'Expert Guides', desc: 'Experienced guides and local partners at destinations.', icon: GlobeAsiaAustraliaIcon, color: 'from-purple-500 to-pink-500', shadow: 'hover:shadow-purple-500/25', ring: 'group-hover:border-purple-300' },
            ].map((item) => (
              <div key={item.title} className={`group relative overflow-hidden rounded-4xl bg-white p-8 shadow-sm border-2 border-transparent transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${item.shadow} ${item.ring}`}>
                {/* Decorative background flare */}
                <div className={`absolute -right-12 -top-12 h-32 w-32 rounded-full bg-linear-to-br ${item.color} opacity-[0.08] transition-transform duration-700 group-hover:scale-[2.5] group-hover:opacity-10`} />

                <div className={`relative mb-6 inline-flex rounded-2xl bg-linear-to-br ${item.color} p-4 text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}>
                  <item.icon className="h-7 w-7" strokeWidth={2} />
                </div>

                <h3 className="relative text-xl font-black text-slate-900 transition-colors duration-300">{item.title}</h3>
                <p className="relative mt-3 text-sm leading-relaxed text-slate-600 font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


    </div>
  )
}


