'use client'

import { useMemo, useState } from 'react'
import {
  GlobeAsiaAustraliaIcon,
  HeartIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UserGroupIcon,
  UserIcon,
} from '@heroicons/react/24/outline'
import PackageCarousel from '@/components/packages/PackageCarousel'

interface TourPackage {
  id: string
  slug: string
  title: string
  destination: string
  price: number
  duration: number
  category: string
  images: string[]
}

const categories = [
  { label: 'Group Tours', value: 'GROUP', icon: GlobeAsiaAustraliaIcon, style: 'from-amber-200 to-amber-100 text-amber-700 ring-amber-300' },
  { label: 'Adventure Tours', value: 'ADVENTURE', icon: ShieldCheckIcon, style: 'from-emerald-200 to-emerald-100 text-emerald-700 ring-emerald-300' },
  { label: 'Family Tours', value: 'FAMILY', icon: UserGroupIcon, style: 'from-sky-200 to-sky-100 text-sky-700 ring-sky-300' },
  { label: 'Solo Tours', value: 'SOLO', icon: UserIcon, style: 'from-indigo-200 to-indigo-100 text-indigo-700 ring-indigo-300' },
  { label: 'Pilgrimage Tours', value: 'PILGRIMAGE', icon: SparklesIcon, style: 'from-orange-200 to-orange-100 text-orange-700 ring-orange-300' },
  { label: 'Couple Tours', value: 'COUPLE', icon: HeartIcon, style: 'from-red-200 to-red-100 text-red-700 ring-red-300' },
]

export default function TrendingTours({ packages }: { packages: TourPackage[] }) {
  const [selectedCategory, setSelectedCategory] = useState(categories[0].value)

  const selectedLabel = categories.find((cat) => cat.value === selectedCategory)?.label ?? 'Trending Tours'
  const filteredPackages = useMemo(
    () => packages.filter((pkg) => pkg.category === selectedCategory),
    [packages, selectedCategory]
  )

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:py-16 mt-4">
      <div className="mb-8 text-center">
        <h2 className="text-4xl font-extrabold text-orange-500 mt-1">Trending Tours</h2>
        <p className="mt-3 text-slate-600">Handpicked experiences for your next holiday</p>
      </div>

      <div className="mb-10 flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {categories.map((cat) => {
          const Icon = cat.icon
          const isActive = selectedCategory === cat.value

          return (
            <button
              key={cat.value}
              type="button"
              onClick={() => setSelectedCategory(cat.value)}
              className={`relative flex h-[5.5rem] w-48 shrink-0 snap-start flex-col justify-between rounded-xl bg-gradient-to-br p-4 text-left shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md ${
                isActive ? 'ring-2 ring-offset-2' : ''
              } ${cat.style}`}
              aria-pressed={isActive}
            >
              <Icon className="h-6 w-6" strokeWidth={2} />
              <span className="text-sm font-bold">{cat.label}</span>
            </button>
          )
        })}
      </div>

      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-extrabold text-slate-900">{selectedLabel}</h3>
          <p className="mt-1 text-sm font-medium text-slate-500">
            {filteredPackages.length} package{filteredPackages.length !== 1 ? 's' : ''} available
          </p>
        </div>
      </div>

      <PackageCarousel key={selectedCategory} packages={filteredPackages} />
    </section>
  )
}
