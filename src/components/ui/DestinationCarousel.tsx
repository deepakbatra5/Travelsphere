'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

const states = [
  { name: 'Jammu and Kashmir', image: '/hero_kashmir.png' },
  { name: 'Kerala', image: '/hero_kerala.png' },
  { name: 'Goa', image: '/hero_goa.png' },
  { name: 'Rajasthan', image: '/states/rajasthan.jpg' },
  { name: 'Uttarakhand', image: '/states/uttarakhand_temple_1779312965063.png' },
  { name: 'Uttar Pradesh', image: '/states/up_taj_1779313012137.png' },
  { name: 'Himachal Pradesh', image: '/states/himachal_mountains_1779312949923.png' },
  { name: 'Sikkim', image: '/states/sikkim_landscape_1779312917485.png' },
  { name: 'Meghalaya', image: '/states/meghalaya_waterfall_1779312932673.png' },
  { name: 'Maharashtra', image: '/states/maharashtra.jpg' },
  { name: 'Karnataka', image: '/states/karnataka_ruins_1779312999535.png' },
  { name: 'Tamil Nadu', image: '/states/tamilnadu.jpg' },
  { name: 'Gujarat', image: '/states/gujarat_garba.png' },
  { name: 'West Bengal', image: '/states/westbengal.jpg' },
  { name: 'Andaman', image: '/states/andaman.jpg' }
]

export default function DestinationCarousel() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' })
    }
  }

  return (
    <div className="relative group mx-auto max-w-7xl px-4 py-8 mt-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 md:text-3xl">Famous Trips by Place</h2>
          <p className="mt-1 text-sm text-slate-600 md:text-base">Top destinations across India</p>
        </div>
      </div>

      <div className="relative">
        <button
          onClick={scrollLeft}
          className="absolute left-[-16px] top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-orange-500 shadow-md border border-slate-100 hover:bg-orange-50 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-0"
          aria-label="Scroll left"
        >
          <ChevronLeftIcon className="h-6 w-6 stroke-2" />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-4 snap-x snap-mandatory hide-scrollbar pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {states.map((state, idx) => (
            <Link
              key={state.name}
              href={`/tours?search=${state.name.toLowerCase()}`}
              className="relative h-64 w-60 shrink-0 snap-center overflow-hidden rounded-2xl group/card"
            >
              <img
                src={state.image}
                alt={state.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                loading={idx > 4 ? 'lazy' : 'eager'}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <h3 className="absolute bottom-4 left-4 text-lg font-bold text-white drop-shadow-md">
                {state.name}
              </h3>
            </Link>
          ))}
        </div>

        <button
          onClick={scrollRight}
          className="absolute right-[-16px] top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-orange-500 shadow-md border border-slate-100 hover:bg-orange-50 transition-colors opacity-0 group-hover:opacity-100"
          aria-label="Scroll right"
        >
          <ChevronRightIcon className="h-6 w-6 stroke-2" />
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </div>
  )
}
