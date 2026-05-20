'use client'

import { useState } from 'react'
import PackageCard from '@/components/packages/PackageCard'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

export default function PackageCarousel({ packages }: { packages: any[] }) {
  const [startIndex, setStartIndex] = useState(0)

  // Show 3 items at a time
  const itemsToShow = 3

  const nextSlide = () => {
    if (startIndex + itemsToShow < packages.length) {
      setStartIndex((prev) => prev + itemsToShow)
    } else {
      setStartIndex(0) // Wrap around
    }
  }

  const prevSlide = () => {
    if (startIndex - itemsToShow >= 0) {
      setStartIndex((prev) => prev - itemsToShow)
    } else {
      // Go to the last possible set of 3
      const remainder = packages.length % itemsToShow
      const lastIndex = packages.length - (remainder === 0 ? itemsToShow : remainder)
      setStartIndex(Math.max(0, lastIndex))
    }
  }

  const visiblePackages = packages.slice(startIndex, startIndex + itemsToShow)

  if (packages.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-300 py-10 text-center text-slate-500">
        No packages yet. Add some from the admin panel.
      </p>
    )
  }

  return (
    <div className="relative group">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visiblePackages.map((pkg) => (
          <PackageCard key={pkg.id} package={pkg} />
        ))}
      </div>

      {packages.length > itemsToShow && (
        <>
          {/* Left Arrow */}
          <button
            onClick={prevSlide}
            className="absolute top-1/2 -left-4 md:-left-12 flex h-10 w-10 md:h-12 md:w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg text-slate-800 hover:bg-orange-500 hover:text-white transition-all border border-slate-200 z-10"
            aria-label="Previous packages"
          >
            <ChevronLeftIcon className="h-6 w-6 stroke-2" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={nextSlide}
            className="absolute top-1/2 -right-4 md:-right-12 flex h-10 w-10 md:h-12 md:w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg text-slate-800 hover:bg-orange-500 hover:text-white transition-all border border-slate-200 z-10"
            aria-label="Next packages"
          >
            <ChevronRightIcon className="h-6 w-6 stroke-2" />
          </button>
        </>
      )}
    </div>
  )
}
