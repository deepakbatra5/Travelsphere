'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  ClockIcon,
  UserGroupIcon,
  BoltIcon,
  CakeIcon,
  TruckIcon,
  CalendarIcon,
  ChevronRightIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'

interface TripDate {
  id: string
  startDate: string
  totalSeats: number
  availableSeats: number
}

interface Props {
  packageId: string
  title: string
  price: number
  duration: number
  category: string
  destination: string
  tripDates: TripDate[]
}

export default function TourBookingSidebar({
  packageId,
  title,
  price,
  duration,
  category,
  destination,
  tripDates,
}: Props) {
  const router = useRouter()
  const { data: session } = useSession()

  // Default meta values based on package
  const difficulty = category === 'ADVENTURE' ? 'Hard' : category === 'PILGRIMAGE' ? 'Moderate' : 'Easy'
  const meals = category === 'SOLO' ? 'Breakfast Included' : 'Breakfast & Dinner'
  const transport = 'AC Private Vehicle / Volvo'
  const bestSeason = destination.toLowerCase().includes('kashmir') || destination.toLowerCase().includes('leh') || destination.toLowerCase().includes('ladakh') ? 'Oct–Mar' : 'Oct–May'

  // Booking states
  const [selectedDateId, setSelectedDateId] = useState('')
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [roomType, setRoomType] = useState<'double' | 'single'>('double')
  const [travellers, setTravellers] = useState(1)

  const selectedDate = tripDates.find(d => d.id === selectedDateId)
  const isSoldOut = selectedDate ? selectedDate.availableSeats <= 0 : true
  
  // Calculate price based on room type
  const basePricePerPerson = roomType === 'single' ? Math.round(price * 1.25) : price
  const totalAmount = basePricePerPerson * travellers

  const handleBookNow = () => {
    if (isSoldOut || !selectedDateId) return

    const bookingUrl = `/booking/${packageId}?dateId=${selectedDateId}&roomType=${roomType}&travellers=${travellers}`
    if (session?.user) {
      router.push(bookingUrl)
    } else {
      router.push(`/login?callbackUrl=${encodeURIComponent(bookingUrl)}`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Quick Specs Grid */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { icon: ClockIcon, label: 'Duration', val: `${duration} Days` },
          { icon: UserGroupIcon, label: 'Group Size', val: '2-20 pax' },
          { icon: BoltIcon, label: 'Difficulty', val: difficulty },
          { icon: CakeIcon, label: 'Meals', val: meals },
          { icon: TruckIcon, label: 'Transport', val: 'Included' },
          { icon: CalendarIcon, label: 'Best Season', val: bestSeason },
        ].map(({ icon: Icon, label, val }) => (
          <div key={label} className="flex items-center gap-3 rounded-2xl bg-white/60 p-3 border border-slate-100 dark:bg-neutral-900/40">
            <Icon className="h-5 w-5 text-orange-500 shrink-0" />
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {label}
              </span>
              <span className="block text-xs font-bold text-slate-800 dark:text-slate-100">
                {val}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Form Card */}
      <div className="surface-card rounded-3xl p-6 shadow-xl">
        <div className="mb-5 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Starting from</span>
          <div className="mt-1 flex items-baseline justify-center gap-1">
            <span className="text-3xl font-black text-orange-600">₹{price.toLocaleString('en-IN')}</span>
            <span className="text-xs font-bold text-slate-500">/ person</span>
          </div>
          <span className="mt-1 block text-[10px] font-semibold text-emerald-600">
            Taxes &amp; inclusions covered
          </span>
        </div>

        <div className="space-y-4 border-t border-slate-100 pt-5 dark:border-neutral-800">
          {/* Departure Date Selection */}
          <div className="relative">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Departure Date
            </label>
            {tripDates.length > 0 ? (
              <div>
                <button
                  type="button"
                  onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                  className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-left text-xs font-bold text-slate-800 transition hover:border-orange-300 dark:border-neutral-800 dark:bg-neutral-900 dark:text-slate-100"
                >
                  <span className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-orange-500" />
                    {selectedDate ? (
                      <span>
                        {new Date(selectedDate.startDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}{' '}
                        — {selectedDate.availableSeats} Seats
                      </span>
                    ) : (
                      <span className="text-slate-400">Select Date</span>
                    )}
                  </span>
                  <span className={`text-slate-400 transition-transform duration-200 ${isDatePickerOpen ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>

                {isDatePickerOpen && (
                  <div className="absolute left-0 right-0 z-30 mt-1.5 max-h-60 overflow-y-auto rounded-xl border border-slate-150 bg-white p-1.5 shadow-xl dark:border-neutral-850 dark:bg-neutral-900">
                    <div className="grid grid-cols-1 gap-1">
                      {tripDates.map((date) => {
                        const isSelected = selectedDateId === date.id
                        const isLowSeats = date.availableSeats > 0 && date.availableSeats <= 5
                        const isSoldOut = date.availableSeats <= 0

                        return (
                          <button
                            key={date.id}
                            type="button"
                            disabled={isSoldOut}
                            onClick={() => {
                              setSelectedDateId(date.id)
                              setIsDatePickerOpen(false)
                            }}
                            className={`flex items-center justify-between rounded-lg px-3 py-2 text-left transition disabled:opacity-50 disabled:cursor-not-allowed
                              ${isSelected
                                ? 'bg-orange-50/70 text-orange-700 dark:bg-orange-950/20 dark:text-orange-400'
                                : 'hover:bg-slate-50 dark:hover:bg-neutral-800/60'
                              }`}
                          >
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                              {new Date(date.startDate).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                            <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full
                              ${isSoldOut
                                ? 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400'
                                : isLowSeats
                                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400'
                                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
                              }`}
                            >
                              {isSoldOut ? 'Sold Out' : `${date.availableSeats} Seats`}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs font-semibold text-red-500 bg-red-50 dark:bg-red-950/20 px-3 py-2 rounded-xl">
                No active departures available.
              </p>
            )}
          </div>

          {/* Room Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Room Type
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { type: 'single', label: 'Single', priceVal: Math.round(price * 1.25) },
                { type: 'double', label: 'Double', priceVal: price },
              ].map((opt) => {
                const isSelected = roomType === opt.type
                return (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => setRoomType(opt.type as 'single' | 'double')}
                    className={`rounded-xl border p-2.5 text-center transition
                      ${isSelected
                        ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/20'
                        : 'border-slate-200 hover:border-orange-300 dark:border-neutral-800'
                      }`}
                  >
                    <span className="block text-xs font-bold text-slate-800 dark:text-slate-100">
                      {opt.label}
                    </span>
                    <span className="mt-0.5 block text-[10px] font-semibold text-slate-500">
                      ₹{opt.priceVal.toLocaleString('en-IN')}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Travellers count */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Travellers
            </label>
            <select
              value={travellers}
              onChange={(e) => setTravellers(parseInt(e.target.value))}
              disabled={!selectedDate || isSoldOut}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none dark:border-neutral-800 dark:bg-neutral-900"
            >
              {Array.from(
                { length: Math.min(selectedDate?.availableSeats || 1, 10) },
                (_, i) => i + 1
              ).map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Traveller' : 'Travellers'}
                </option>
              ))}
            </select>
          </div>

          {/* Total display */}
          <div className="rounded-2xl bg-orange-50/70 p-4 dark:bg-neutral-900/60 border border-orange-100/50">
            <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
              <span>{travellers} x ₹{basePricePerPerson.toLocaleString('en-IN')}</span>
              <span>₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="mt-1 flex justify-between text-sm font-black text-orange-600">
              <span>Total Payable</span>
              <span>₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Book / Login button */}
          <button
            onClick={handleBookNow}
            disabled={isSoldOut || tripDates.length === 0}
            className="w-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 py-3 text-center text-sm font-bold text-white hover:from-orange-600 hover:to-amber-600 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
          >
            {session?.user ? 'Book Now' : 'Login to Book'}
            <ChevronRightIcon className="h-4 w-4" />
          </button>

          {/* WhatsApp Enquiry */}
          <a
            href={`https://wa.me/917992336832?text=Hi, I am interested in booking the "${title}" package for ${travellers} travellers starting around ${selectedDate ? new Date(selectedDate.startDate).toLocaleDateString('en-IN') : 'soon'}.`}
            target="_blank"
            rel="noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-emerald-500 py-2.5 text-center text-sm font-bold text-emerald-600 hover:bg-emerald-50/50 dark:text-emerald-400 dark:border-emerald-600 transition"
          >
            <ChatBubbleLeftRightIcon className="h-4 w-4" />
            Enquire on WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
