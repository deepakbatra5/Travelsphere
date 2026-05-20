import Link from 'next/link'
import { prisma } from '@/lib/db'
import PackageCarousel from '@/components/packages/PackageCarousel'
import DestinationCarousel from '@/components/ui/DestinationCarousel'
import HeroCarousel from '@/components/ui/HeroCarousel'
import {
  GlobeAsiaAustraliaIcon,
  PhoneIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UserGroupIcon,
  UserIcon,
  HeartIcon,
} from '@heroicons/react/24/outline'

export const dynamic = 'force-dynamic'

async function getFeaturedPackages() {
  try {
    return await prisma.package.findMany({
      where: { isActive: true },
      take: 9,
      orderBy: { createdAt: 'desc' }
    })
  } catch (error) {
    console.error('Failed to load featured packages:', error)
    return []
  }
}

const categories = [
  { label: 'Solo Tours', value: 'SOLO', icon: UserIcon, style: 'from-indigo-200 to-indigo-100 text-indigo-700' },
  { label: 'Family Tours', value: 'FAMILY', icon: UserGroupIcon, style: 'from-sky-200 to-sky-100 text-sky-700' },
  { label: 'Group Tours', value: 'GROUP', icon: GlobeAsiaAustraliaIcon, style: 'from-amber-200 to-amber-100 text-amber-700' },
  { label: 'Pilgrimage Tours', value: 'PILGRIMAGE', icon: SparklesIcon, style: 'from-orange-200 to-orange-100 text-orange-700' },
  { label: 'Adventure Tours', value: 'ADVENTURE', icon: ShieldCheckIcon, style: 'from-emerald-200 to-emerald-100 text-emerald-700' },
  { label: 'Couple Tours', value: 'COUPLE', icon: HeartIcon, style: 'from-red-200 to-red-100 text-red-700' },
]

const destinations = [
  { label: 'Kashmir', value: 'kashmir', color: 'from-orange-500 to-cyan-500', desc: 'Snow & Valleys' },
  { label: 'Kerala', value: 'kerala', color: 'from-green-500 to-emerald-500', desc: 'Backwaters & Nature' },
  { label: 'Goa', value: 'goa', color: 'from-orange-500 to-amber-500', desc: 'Beaches & Nightlife' },
  { label: 'Rajasthan', value: 'rajasthan', color: 'from-rose-500 to-red-500', desc: 'Forts & Culture' },
]

const budgets = [
  { label: 'Under ₹10,000', value: 'budget', icon: '₹', desc: 'Pocket Friendly' },
  { label: '₹10,000 - ₹25,000', value: 'mid', icon: '₹₹', desc: 'Value for Money' },
  { label: 'Premium & Luxury', value: 'luxury', icon: '₹₹₹', desc: 'Ultimate Comfort' },
]

const seasons = [
  { label: 'Summer Escapes', value: 'summer', icon: '☀️', color: 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100' },
  { label: 'Winter Wonderland', value: 'winter', icon: '❄️', color: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100' },
  { label: 'Monsoon Magic', value: 'monsoon', icon: '🌧️', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' },
]

export default async function HomePage() {
  const packages = await getFeaturedPackages()

  return (
    <div className="animate-fade-up">
      <section className="w-full">
        <HeroCarousel />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:py-16 mt-8">
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-extrabold text-orange-500 mt-1">Featured Packages</h2>
          <p className="mt-3 text-slate-600">Most loved trips this season</p>
        </div>
        <PackageCarousel packages={packages} />
      </section>

      {/* Popular Destinations by Place */}
      <DestinationCarousel />


      <section className="mx-auto max-w-7xl px-4 py-12 md:py-16 mt-4">
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-extrabold text-orange-500 mt-1">Trending Tours</h2>
          <p className="mt-3 text-slate-600">Handpicked experiences for your next holiday</p>
        </div>

        <div className="mb-10 flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <Link
                key={cat.value}
                href={`/packages?category=${cat.value}`}
                className={`relative flex h-[5.5rem] w-48 shrink-0 snap-start flex-col justify-between rounded-xl bg-gradient-to-br p-4 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md ${cat.style}`}
              >
                <Icon className="h-6 w-6" strokeWidth={2} />
                <span className="text-sm font-bold">{cat.label}</span>
              </Link>
            )
          })}
        </div>

        <PackageCarousel packages={packages} />
      </section>
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
              <div key={item.title} className={`group relative overflow-hidden rounded-[2rem] bg-white p-8 shadow-sm border-2 border-transparent transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${item.shadow} ${item.ring}`}>
                {/* Decorative background flare */}
                <div className={`absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br ${item.color} opacity-[0.08] transition-transform duration-700 group-hover:scale-[2.5] group-hover:opacity-10`} />
                
                <div className={`relative mb-6 inline-flex rounded-2xl bg-gradient-to-br ${item.color} p-4 text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}>
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


