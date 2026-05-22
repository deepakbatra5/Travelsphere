'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

interface Package {
  id: string
  title: string
  destination: string
  price: number
  duration: number
  category: string
  tripDates: {
    id: string
    startDate: string
    totalSeats: number
    availableSeats: number
  }[]
}

interface Traveller {
  name: string
  age: string
  gender: string
}

interface RazorpaySuccessResponse {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

interface RazorpayOptions {
  key?: string
  amount: number
  currency: string
  name: string
  description?: string
  order_id: string
  theme: {
    color: string
  }
  handler: (response: RazorpaySuccessResponse) => Promise<void>
  modal: {
    ondismiss: () => void
  }
}

interface RazorpayInstance {
  open: () => void
  on: (event: string, handler: (response: unknown) => void) => void
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance
  }
}

export default function BookingPage() {
  const router = useRouter()
  const params = useParams<{ packageId: string }>()
  const packageId = params?.packageId
  const { status } = useSession()

  const [pkg, setPkg] = useState<Package | null>(null)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  // Step 1 data
  const [travelDate, setTravelDate] = useState('')
  const [tripDateId, setTripDateId] = useState('')
  const [travellerCount, setTravellerCount] = useState(1)

  // Step 2 data
  const [travellers, setTravellers] = useState<Traveller[]>([
    { name: '', age: '', gender: 'MALE' }
  ])

  // Fetch package details
  useEffect(() => {
    if (status === 'unauthenticated') {
      const callback = packageId ? `/booking/${packageId}` : '/packages'
      router.replace(`/login?callbackUrl=${encodeURIComponent(callback)}`)
      return
    }

    if (status !== 'authenticated') return
    if (!packageId) return

    fetch(`/api/packages/${packageId}`)
      .then((r) => r.json())
      .then(setPkg)
  }, [packageId, router, status])

  // Update travellers array when count changes
  useEffect(() => {
    setTravellers((currentTravellers) =>
      Array.from({ length: travellerCount }, (_, i) =>
        currentTravellers[i] || { name: '', age: '', gender: 'MALE' }
      )
    )
  }, [travellerCount])

  const totalAmount = pkg ? pkg.price * travellerCount : 0
  const selectedTripDate = pkg?.tripDates.find((date) => date.id === tripDateId)
  const maxTravellers = Math.min(selectedTripDate?.availableSeats || 0, 10)

  const loadRazorpayScript = async () => {
    if (typeof window === 'undefined') {
      throw new Error('Payment service is not available right now.')
    }

    if (window.Razorpay) return

    await new Promise<void>((resolve, reject) => {
      const existingScript = document.querySelector<HTMLScriptElement>('script[data-razorpay-checkout="true"]')

      if (existingScript) {
        const onLoad = () => {
          cleanup()
          if (window.Razorpay) resolve()
          else reject(new Error('Payment service loaded incorrectly. Please refresh and try again.'))
        }

        const onError = () => {
          cleanup()
          reject(new Error('Unable to load payment service. Please check your internet connection.'))
        }

        const cleanup = () => {
          existingScript.removeEventListener('load', onLoad)
          existingScript.removeEventListener('error', onError)
        }

        existingScript.addEventListener('load', onLoad)
        existingScript.addEventListener('error', onError)

        // Fallback when script event happened before listeners were attached.
        setTimeout(() => {
          cleanup()
          if (window.Razorpay) resolve()
          else reject(new Error('Payment service is taking too long to load. Disable ad blocker and try again.'))
        }, 4000)

        return
      }

      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true
      script.dataset.razorpayCheckout = 'true'

      script.onload = () => {
        if (window.Razorpay) resolve()
        else reject(new Error('Payment service loaded incorrectly. Please refresh and try again.'))
      }

      script.onerror = () => {
        reject(new Error('Unable to load payment service. Disable ad blocker and try again.'))
      }

      document.head.appendChild(script)
    })
  }

  // Update single traveller field
  const updateTraveller = (index: number, field: keyof Traveller, value: string) => {
    const updated = [...travellers]
    updated[index] = { ...updated[index], [field]: value }
    setTravellers(updated)
  }

  // Step 1 validation
  const validateStep1 = () => {
    if (!tripDateId || !travelDate) { alert('Please select a planned trip date.'); return false }
    const selected = new Date(travelDate)
    const today = new Date()
    if (selected <= today) { alert('Please select a future date.'); return false }
    if (!selectedTripDate || selectedTripDate.availableSeats < travellerCount) {
      alert('Not enough seats are available for this date.')
      return false
    }
    return true
  }

  // Step 2 validation
  const validateStep2 = () => {
    for (const t of travellers) {
      if (!t.name.trim()) { alert('Please enter name for all travellers.'); return false }
      if (!t.age || parseInt(t.age) < 1) { alert('Please enter valid age for all travellers.'); return false }
    }
    return true
  }

  // Create booking and open Razorpay
  const handlePayment = async () => {
    setLoading(true)

    try {
      await loadRazorpayScript()

      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID

      if (!razorpayKey) {
        throw new Error('Payment key is missing. Please contact support.')
      }

      // Step 1: Create booking in DB
      const bookingRes = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId,
          tripDateId,
          travelDate,
          travellers: travellerCount,
          totalAmount,
          travellersInfo: travellers,
        }),
      })

      const bookingData = await bookingRes.json()
      if (!bookingRes.ok) throw new Error(bookingData.error)
      // Step 2: Create Razorpay order
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: bookingData.id,
          amount: totalAmount,
        }),
      })

      const orderData = await orderRes.json()
      if (!orderRes.ok) throw new Error(orderData.error)

      // Step 3: Open Razorpay popup
      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: 'INR',
        name: 'Travel Sphere',
        description: pkg?.title,
        order_id: orderData.id,
        theme: { color: '#f97316' },
        handler: async (response: RazorpaySuccessResponse) => {
          try {
            // Step 4: Verify payment
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                bookingId: bookingData.id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })

            const verifyData = await verifyRes.json()

            if (verifyData.success) {
              router.push(`/booking/confirmation/${bookingData.id}`)
            } else {
              alert('Payment verification failed. Please contact support.')
              setLoading(false)
            }
          } catch {
            alert('Unable to verify payment right now. Please contact support.')
            setLoading(false)
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false)
          }
        }
      }

      // Load Razorpay script and open
      const RazorpayConstructor = window.Razorpay

      if (!RazorpayConstructor) {
        throw new Error('Payment service is still loading. Please try again in a moment.')
      }
      const rzp = new RazorpayConstructor(options)

      rzp.on('payment.failed', () => {
        setLoading(false)
        alert('Payment failed. Please try again.')
      })

      rzp.open()

      // Popup has opened and user can interact there; stop locking the page button state.
      setLoading(false)

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      alert(message)
      setLoading(false)
    }
  }

  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-900 font-semibold">Loading package details...</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Book Your Trip</h1>
      <p className="text-gray-900 font-semibold text-sm mb-8">{pkg.title} — {pkg.destination}</p>

      {/* Step Indicator */}
      <div className="flex items-center mb-10">
        {['Travel Details', 'Traveller Info', 'Review and Pay'].map((label, i) => (
          <div key={i} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                ${step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                {step > i + 1 ? 'Done' : i + 1}
              </div>
              <span className={`text-xs mt-1 text-center ${step === i + 1 ? 'text-orange-500 font-semibold' : 'text-gray-800 font-semibold'}`}>
                {label}
              </span>
            </div>
            {i < 2 && (
              <div className={`flex-1 h-0.5 mx-2 mb-4 ${step > i + 1 ? 'bg-green-400' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* STEP 1 — Travel Details */}
      {step === 1 && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Step 1: Travel Details</h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Planned Trip Date
              </label>
              {pkg.tripDates.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {pkg.tripDates.map((date) => {
                    const dateValue = new Date(date.startDate).toISOString().split('T')[0]
                    const isSelected = tripDateId === date.id
                    const isSoldOut = date.availableSeats <= 0

                    return (
                      <button
                        key={date.id}
                        type="button"
                        disabled={isSoldOut}
                        onClick={() => {
                          setTripDateId(date.id)
                          setTravelDate(dateValue)
                          setTravellerCount(1)
                        }}
                        className={`rounded-xl border px-4 py-3 text-left transition disabled:cursor-not-allowed disabled:opacity-50 ${isSelected ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300'}`}
                      >
                        <span className="block text-sm font-bold text-gray-900">
                          {new Date(date.startDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                        <span className={`mt-1 block text-xs font-semibold ${isSoldOut ? 'text-red-500' : 'text-green-600'}`}>
                          {isSoldOut ? 'Sold out' : `${date.availableSeats} seats available`}
                        </span>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                  No planned dates are available for this package right now.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Travellers
              </label>
              <select
                value={travellerCount}
                onChange={(e) => setTravellerCount(parseInt(e.target.value, 10))}
                disabled={!selectedTripDate}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                {Array.from({ length: maxTravellers }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'People'}</option>
                ))}
              </select>
            </div>

            {/* Price Summary */}
            <div className="bg-orange-50 rounded-xl p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-900 font-semibold">Price per person</span>
                <span className="text-gray-900 font-semibold">Rs {pkg.price.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-900 font-semibold">Number of travellers</span>
                <span className="text-gray-900 font-semibold">x {travellerCount}</span>
              </div>
              <div className="border-t border-orange-200 pt-2 flex justify-between font-bold text-orange-600">
                <span>Total Amount</span>
                <span>Rs {totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => validateStep1() && setStep(2)}
            className="mt-6 w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition"
          >
            Continue to Traveller Details
          </button>
        </div>
      )}

      {/* STEP 2 — Traveller Info */}
      {step === 2 && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6">
            Step 2: Traveller Information
          </h2>

          <div className="space-y-6">
            {travellers.map((t, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-4 text-sm">
                  Traveller {i + 1}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-xs text-gray-700 font-semibold mb-1">Full Name</label>
                    <input
                      type="text"
                      value={t.name}
                      onChange={(e) => updateTraveller(i, 'name', e.target.value)}
                      placeholder="Full name"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 font-semibold placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-700 font-semibold mb-1">Age</label>
                    <input
                      type="number"
                      value={t.age}
                      onChange={(e) => updateTraveller(i, 'age', e.target.value)}
                      placeholder="Age"
                      min="1"
                      max="99"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 font-semibold placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-700 font-semibold mb-1">Gender</label>
                    <select
                      value={t.gender}
                      onChange={(e) => updateTraveller(i, 'gender', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-orange-400"
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setStep(1)}
              className="flex-1 border border-gray-300 text-gray-900 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
            >
              Back
            </button>
            <button
              onClick={() => validateStep2() && setStep(3)}
              className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition"
            >
              Review Booking
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 — Review and Pay */}
      {step === 3 && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6">
            Step 3: Review and Pay
          </h2>

          {/* Package Summary */}
          <div className="bg-orange-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Package Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-900 font-semibold">Package</span>
                <span className="text-gray-900 font-semibold">{pkg.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-900 font-semibold">Destination</span>
                <span className="text-gray-900 font-semibold">{pkg.destination}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-900 font-semibold">Duration</span>
                <span className="text-gray-900 font-semibold">{pkg.duration} Days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-900 font-semibold">Travel Date</span>
                <span className="text-gray-900 font-semibold">
                  {new Date(travelDate).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-900 font-semibold">Travellers</span>
                <span className="text-gray-900 font-semibold">{travellerCount} Person(s)</span>
              </div>
            </div>
          </div>

          {/* Traveller Summary */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Traveller Details</h3>
            <div className="space-y-2">
              {travellers.map((t, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2 text-sm">
                  <span className="font-semibold text-gray-900">{t.name}</span>
                  <span className="text-gray-900 font-semibold">{t.age} years — {t.gender}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Amount Summary */}
          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-900 font-semibold">Rs {pkg.price.toLocaleString('en-IN')} x {travellerCount} travellers</span>
              <span className="text-gray-900 font-semibold">Rs {totalAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-orange-600">
              <span>Total Payable</span>
              <span>Rs {totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="flex-1 border border-gray-300 text-gray-900 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
            >
              Back
            </button>
            <button
              onClick={handlePayment}
              disabled={loading}
              className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition disabled:opacity-50"
            >
              {loading ? 'Processing...' : `Pay Rs ${totalAmount.toLocaleString('en-IN')}`}
            </button>
          </div>

          <p className="text-center text-xs text-gray-900 font-semibold mt-4">
            Secured by Razorpay. Your payment information is safe.
          </p>
        </div>
      )}

    </div>
  )
}
