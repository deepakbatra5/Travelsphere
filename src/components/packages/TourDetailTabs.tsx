'use client'

import { useState } from 'react'
import {
  MapIcon,
  CheckCircleIcon,
  XCircleIcon,
  QuestionMarkCircleIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ItineraryDay {
  day: number
  title: string
  description: string
}

interface TripDate {
  id: string
  startDate: string
  totalSeats: number
  availableSeats: number
}

interface Review {
  id: string
  rating: number
  comment: string
  createdAt: string
  user: { name: string }
}

interface PackageData {
  id: string
  title: string
  price: number
  duration: number
  itinerary: ItineraryDay[]
  inclusions: string[]
  exclusions: string[]
  tripDates: TripDate[]
  reviews: Review[]
  category: string
}

interface Props {
  pkg: PackageData
  sessionUserId?: string
}

// ─── FAQ Data (generic + relevant) ────────────────────────────────────────────

const faqs = [
  {
    q: 'How do I book this package?',
    a: 'Click "Book Now" on this page. You will be guided through a 3-step booking process: select your travel date → fill traveller details → pay securely via Razorpay.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'We accept UPI, Net Banking, Credit/Debit Cards, and wallets via Razorpay. A minimum 25% advance is required to confirm your booking.',
  },
  {
    q: 'What is the cancellation policy?',
    a: '30+ days before: 10% deduction. 15–29 days: 25%. 7–14 days: 50%. 48 hrs–6 days: 75%. Less than 48 hrs or no-show: 100% forfeiture. Refunds are processed within 7–10 working days.',
  },
  {
    q: 'How does TravelSphere handle group bookings?',
    a: 'For groups of 10+ travellers, contact us on WhatsApp or email for custom pricing and dedicated support. We offer special rates for large groups.',
  },
  {
    q: 'What should I carry on the trip?',
    a: 'Carry a valid photo ID (Aadhaar/Passport), comfortable clothing suitable for the destination, personal medicines, and the booking confirmation email. Destination-specific items are shared in your pre-trip briefing.',
  },
  {
    q: 'Is travel insurance included?',
    a: 'Travel insurance is NOT included but is strongly recommended. You can purchase it independently. TravelSphere will assist during medical emergencies but costs are the traveller\'s responsibility.',
  },
]

// ─── Terms Text ────────────────────────────────────────────────────────────────

const termsContent = [
  {
    title: '1. Booking & Payment Policy',
    body: 'A booking is confirmed only upon receipt of the advance deposit (minimum 25% of total tour cost) and written confirmation by TravelSphere. The remaining balance must be paid at least 15 days before departure. Prices are quoted in INR and are inclusive of applicable taxes unless stated otherwise.',
  },
  {
    title: '2. Cancellation & Refund Policy',
    body: '30+ days before departure: 10% deduction. 15–29 days: 25%. 7–14 days: 50%. 48 hrs–6 days: 75%. Less than 48 hrs or no-show: 100% forfeiture. Refunds processed within 7–10 working days to the original payment method.',
  },
  {
    title: '3. Weather & Force Majeure',
    body: 'If a tour is cancelled due to weather, natural disasters, or government orders beyond our control, customers will be offered a full credit note valid for 12 months OR a refund of the recoverable portion after third-party deductions. TravelSphere is not liable for delays caused by force majeure.',
  },
  {
    title: '4. Itinerary Changes',
    body: 'TravelSphere reserves the right to alter any itinerary, accommodation, or transport without prior notice if circumstances require it. Changes of comparable standard will be offered. Optional activities may be subject to availability, weather, and local conditions.',
  },
  {
    title: '5. Travel Insurance',
    body: 'TravelSphere strongly recommends comprehensive travel insurance covering medical emergencies, trip cancellation, loss of baggage, and personal liability. Insurance is NOT included unless explicitly stated in the package.',
  },
  {
    title: '6. Health & Fitness',
    body: 'Travellers must be medically fit for their chosen tour. Pre-existing conditions must be disclosed at booking. Special requirements (dietary, wheelchair) must be communicated in writing. Pregnant travellers beyond 24 weeks may be restricted on adventure or high-altitude tours.',
  },
  {
    title: '7. Liability & Disclaimer',
    body: 'TravelSphere acts as organiser and agent for hotels and transport operators. We are not liable for injury, loss, or damage caused by third-party providers. Our maximum liability shall not exceed the total tour cost paid by the traveller.',
  },
  {
    title: '8. Code of Conduct',
    body: 'Travellers must behave respectfully towards fellow travellers, guides, local communities, and the environment. Disruptive behaviour may result in removal from the tour without refund. Consumption of controlled substances that impairs safety is not permitted.',
  },
]

// ─── TAB DEFINITIONS ──────────────────────────────────────────────────────────

const TABS = [
  { id: 'itinerary', label: 'Itinerary', Icon: MapIcon },
  { id: 'inclusions', label: 'Inclusions', Icon: CheckCircleIcon },
  { id: 'faq', label: 'FAQ', Icon: QuestionMarkCircleIcon },
  { id: 'terms', label: 'Terms', Icon: DocumentTextIcon },
]

// ─── MEALS HELPERS ──────────────────────────────────────────────────────────

function getMealsForDay(day: number, total: number): string[] {
  if (day === 1) {
    return ['Dinner']
  }
  if (day === total) {
    return ['Breakfast']
  }
  return ['Breakfast', 'Dinner']
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function TourDetailTabs({ pkg, sessionUserId }: Props) {
  const [activeTab, setActiveTab] = useState('itinerary')
  const [expandedDays, setExpandedDays] = useState<number[]>([1])
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const toggleDay = (day: number) =>
    setExpandedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    )

  const expandAll = () => setExpandedDays(pkg.itinerary.map((d) => d.day))
  const collapseAll = () => setExpandedDays([])

  return (
    <div className="space-y-0">
      {/* ── Tab Bar ─────────────────────────────────────────────────────── */}
      <div className="sticky top-[64px] z-20 surface-card rounded-2xl mb-2 overflow-x-auto">
        <div className="flex min-w-max">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`relative flex items-center gap-1.5 px-4 py-3.5 text-sm font-semibold transition whitespace-nowrap
                ${activeTab === id
                  ? 'text-orange-600'
                  : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
              {activeTab === id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-orange-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── ITINERARY ─────────────────────────────────────────────────────── */}
      {activeTab === 'itinerary' && (
        <section className="surface-card rounded-3xl p-6">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900">
              Day-by-day Itinerary
            </h2>
            <div className="flex gap-3 text-xs font-bold">
              <button onClick={expandAll} className="text-orange-600 hover:text-orange-700">
                Expand All
              </button>
              <span className="text-slate-300">|</span>
              <button onClick={collapseAll} className="text-slate-500 hover:text-slate-700">
                Collapse All
              </button>
            </div>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-300 via-orange-200 to-transparent" />

            <div className="space-y-3">
              {pkg.itinerary.map((day) => {
                const isOpen = expandedDays.includes(day.day)
                return (
                  <div key={day.day} className="relative pl-14">
                    {/* Circle */}
                    <div className="absolute left-2.5 top-3 h-6 w-6 rounded-full bg-orange-500 flex items-center justify-center text-xs font-black text-white shadow-sm">
                      {day.day}
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                      <button
                        onClick={() => toggleDay(day.day)}
                        className="flex w-full items-center justify-between px-5 py-4 text-left"
                      >
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-orange-500">
                            Day {day.day}
                          </span>
                          <p className="mt-0.5 text-sm font-bold text-slate-900">
                            {day.title}
                          </p>
                        </div>
                        <span className={`ml-3 shrink-0 text-lg font-bold text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                          ›
                        </span>
                      </button>

                      {isOpen && (
                        <div className="border-t border-slate-100 px-5 py-4 bg-slate-50/20 dark:bg-neutral-900/10">
                          <ul className="space-y-2.5">
                            {day.description
                              .split('\n')
                              .filter((line) => line.trim())
                              .map((line, idx) => {
                                const cleanLine = line.replace(/^[\s\-\*•▪]+/, '').trim()
                                return (
                                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-sm bg-orange-500" />
                                    <span className="leading-relaxed">{cleanLine}</span>
                                  </li>
                                )
                              })}
                          </ul>

                          {/* Meal tags at the bottom of the day */}
                          <div className="mt-4 flex flex-wrap gap-2 border-t border-dashed border-slate-200 pt-3 dark:border-neutral-800">
                            {getMealsForDay(day.day, pkg.duration).map((meal) => (
                              <span
                                key={meal}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-neutral-805 dark:bg-neutral-800 dark:text-slate-300 border border-slate-200/60 dark:border-neutral-700/60"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="h-3.5 w-3.5 text-orange-500"
                                >
                                  <path d="M4 3v7a6 6 0 0 0 4 5.65V21M17 3v18M20 8a3 3 0 0 0-3-3h0a3 3 0 0 0-3 3" />
                                </svg>
                                {meal}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── INCLUSIONS ─────────────────────────────────────────────────────── */}
      {activeTab === 'inclusions' && (
        <section className="surface-card rounded-3xl p-6">
          <h2 className="mb-6 text-xl font-extrabold text-slate-900">
            Inclusions & Exclusions
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-emerald-700">
                <CheckCircleIcon className="h-5 w-5" />
                What&apos;s Included
              </h3>
              <ul className="space-y-3">
                {pkg.inclusions.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <span className="mt-0.5 shrink-0 text-emerald-500">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-5">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-rose-700">
                <XCircleIcon className="h-5 w-5" />
                What&apos;s Not Included
              </h3>
              <ul className="space-y-3">
                {pkg.exclusions.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <span className="mt-0.5 shrink-0 text-rose-400">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* ── FAQ ─────────────────────────────────────────────────────────────── */}
      {activeTab === 'faq' && (
        <section className="surface-card rounded-3xl p-6">
          <h2 className="mb-6 text-xl font-extrabold text-slate-900">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-slate-200"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left"
                >
                  <span className="text-sm font-bold text-slate-900 pr-3">{faq.q}</span>
                  <span
                    className={`shrink-0 text-xl font-bold text-orange-500 transition-transform ${
                      openFaq === i ? 'rotate-45' : ''
                    }`}
                  >
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-4">
                    <p className="text-sm leading-relaxed text-slate-700">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── TERMS ─────────────────────────────────────────────────────────── */}
      {activeTab === 'terms' && (
        <section className="surface-card rounded-3xl p-6">
          <h2 className="mb-2 text-xl font-extrabold text-slate-900">
            Terms &amp; Conditions
          </h2>
          <p className="mb-6 text-sm text-slate-500">
            Please read these terms carefully before booking. By completing your booking you
            agree to all the terms below.
          </p>
          <div className="space-y-5">
            {termsContent.map((section) => (
              <div key={section.title} className="rounded-2xl border border-slate-100 p-5 bg-slate-50/50">
                <h3 className="mb-2 font-bold text-slate-900">{section.title}</h3>
                <p className="text-sm leading-relaxed text-slate-700">{section.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl bg-orange-50 border border-orange-100 p-5 text-sm text-slate-700">
            <p className="font-bold text-slate-800 mb-1">Contact Us</p>
            <p>
              📧 support@travelsphere.in &nbsp;|&nbsp; 📞 +91 7992336832
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Law Gate, Phagwara, Punjab 144411, India &nbsp;·&nbsp; Last updated: May 2026
            </p>
          </div>
        </section>
      )}
    </div>
  )
}
