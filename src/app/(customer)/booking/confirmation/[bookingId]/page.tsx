import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CheckBadgeIcon } from '@heroicons/react/24/outline'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ bookingId: string }>
}

export default async function ConfirmationPage({ params }: Props) {
  const { bookingId } = await params

  if (!bookingId) return notFound()

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      package: true,
      payment: true,
      user: true,
    }
  })

  if (!booking) return notFound()

  const travellersInfo = booking.travellersInfo as Array<{
    name: string
    age: string
    gender: string
  }>

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="mb-10 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100">
          <CheckBadgeIcon className="h-11 w-11 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Booking Confirmed!</h1>
        <p className="mt-2 text-slate-600">
          Your trip has been booked successfully. A confirmation email has been sent to {booking.user.email}
        </p>
      </div>

      <div className="surface-card mb-6 rounded-3xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-bold text-slate-900">Booking Details</h2>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            {booking.status}
          </span>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between border-b border-slate-100 py-2">
            <span className="text-slate-500">Booking ID</span>
            <span className="font-mono font-medium text-slate-700">{booking.id.slice(0, 12).toUpperCase()}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 py-2">
            <span className="text-slate-500">Package</span>
            <span className="font-medium text-slate-700">{booking.package.title}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 py-2">
            <span className="text-slate-500">Destination</span>
            <span className="font-medium text-slate-700">{booking.package.destination}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 py-2">
            <span className="text-slate-500">Travel Date</span>
            <span className="font-medium text-slate-700">
              {new Date(booking.travelDate).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'long', year: 'numeric'
              })}
            </span>
          </div>
          <div className="flex justify-between border-b border-slate-100 py-2">
            <span className="text-slate-500">Duration</span>
            <span className="font-medium text-slate-700">{booking.package.duration} Days</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 py-2">
            <span className="text-slate-500">Travellers</span>
            <span className="font-medium text-slate-700">{booking.travellers} Person(s)</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 py-2">
            <span className="text-slate-500">Total Paid</span>
            <span className="font-bold text-emerald-600">
              Rs {booking.totalAmount.toLocaleString('en-IN')}
            </span>
          </div>
          {booking.payment && (
            <div className="flex justify-between py-2">
              <span className="text-slate-500">Payment ID</span>
              <span className="font-mono text-xs text-slate-500">{booking.payment.razorpayPaymentId}</span>
            </div>
          )}
        </div>
      </div>

      {travellersInfo && travellersInfo.length > 0 && (
        <div className="surface-card mb-6 rounded-3xl p-6">
          <h2 className="mb-4 font-bold text-slate-900">Traveller Details</h2>
          <div className="space-y-2">
            {travellersInfo.map((t, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm">
                <span className="font-medium text-slate-700">{i + 1}. {t.name}</span>
                <span className="text-slate-500">{t.age} years - {t.gender}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="flex-1 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 py-3 text-center font-semibold text-white hover:from-orange-600 hover:to-amber-600"
        >
          Back to Home
        </Link>
        <Link
          href="/packages"
          className="flex-1 rounded-2xl border border-slate-300 py-3 text-center font-medium text-slate-600 hover:bg-slate-100"
        >
          Explore More Packages
        </Link>
      </div>

      <div className="mt-8 text-center text-sm text-slate-500">
        Need help? WhatsApp us at{' '}
        <a href="https://wa.me/918603606089" className="font-medium text-emerald-600">
          +91 8603606089
        </a>
      </div>
    </div>
  )
}
