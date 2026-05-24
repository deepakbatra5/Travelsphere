'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

const slides = [
  {
    id: 1,
    image: '/hero_kashmir.png',
    title: 'Shimla Manali Couple Special From Delhi',
    subtitle: 'Shimla, kullu Manali',
    details: '7 Days, 6 Nights Starting from ₹ 12,699/-',
    link: '/tours?search=kashmir',
  },
  {
    id: 2,
    image: '/hero_kerala.png',
    title: 'Kerala Backwaters Couple Special',
    subtitle: 'Munnar, Thekkady, Alleppey',
    details: '6 Days, 5 Nights Starting from ₹ 14,499/-',
    link: '/tours?search=kerala',
  },
  {
    id: 3,
    image: '/hero_goa.png',
    title: 'Goa Beaches & Nightlife Explorer',
    subtitle: 'North Goa, South Goa',
    details: '5 Days, 4 Nights Starting from ₹ 9,999/-',
    link: '/tours?search=goa',
  }
]

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)

  return (
    <div className="relative h-[310px] w-full overflow-hidden bg-slate-900 md:h-[330px]">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={index === 0}
              className="object-cover"
              sizes="100vw"
            />
            {/* Gradient Overlay for text readability (left side) */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
          </div>

          {/* Content (Left Aligned as requested) */}
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-24">
            <div className={`max-w-2xl transform transition-all duration-1000 delay-300 ${index === currentSlide ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
              <h1 className="text-3xl font-extrabold tracking-tight text-orange-500 md:text-5xl lg:text-5xl drop-shadow-lg">
                {slide.title}
              </h1>
              <p className="mt-2 text-xl font-medium text-white drop-shadow-md">
                {slide.subtitle}
              </p>
              <div className="mt-4 flex items-center text-lg text-white font-medium drop-shadow-md">
                <span>{slide.details.split('Starting from')[0]}</span>
                <span className="text-orange-400 ml-1">Starting from {slide.details.split('Starting from')[1]}</span>
              </div>
              <div className="mt-8">
                <Link
                  href={slide.link}
                  className="inline-block rounded-md bg-orange-600 px-8 py-3 text-lg font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-orange-500"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <div className="absolute inset-x-0 top-1/2 z-20 flex -translate-y-1/2 justify-between px-4 md:px-6">
        <button
          onClick={prevSlide}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>
      </div>

    </div>
  )
}
