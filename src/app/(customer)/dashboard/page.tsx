import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect('/login?callbackUrl=/dashboard')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      bookings: {
        include: {
          package: {
            select: {
              title: true,
              destination: true,
            },
          },
          payment: {
            select: {
              status: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!user) {
    redirect('/login')
  }

  const totalBookings = user.bookings.length
  const confirmedBookings = user.bookings.filter((booking) => booking.status === 'CONFIRMED').length
  const totalSpent = user.bookings
    .filter((booking) => booking.status === 'CONFIRMED')
    .reduce((sum, booking) => sum + booking.totalAmount, 0)

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="section-shell mb-8 rounded-3xl p-6">
        <h1 className="text-3xl font-extrabold text-slate-900">Customer Dashboard</h1>
        <p className="mt-2 text-slate-600">Welcome back, {user.name}. Here is your booking history and account summary.</p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4">
            <p className="text-sm text-slate-600">Total Bookings</p>
            <p className="mt-1 text-2xl font-bold text-orange-600">{totalBookings}</p>
          </div>
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
            <p className="text-sm text-slate-600">Confirmed Trips</p>
            <p className="mt-1 text-2xl font-bold text-emerald-600">{confirmedBookings}</p>
          </div>
          <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-4">
            <p className="text-sm text-slate-600">Total Spent</p>
            <p className="mt-1 text-2xl font-bold text-cyan-700">Rs {totalSpent.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-white p-4">
            <p className="text-sm text-slate-500">Name</p>
            <p className="font-semibold text-slate-800">{user.name}</p>
          </div>
          <div className="rounded-2xl bg-white p-4">
            <p className="text-sm text-slate-500">Email</p>
            <p className="break-all font-semibold text-slate-800">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="surface-card rounded-3xl p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-900">Booking History</h2>
          <Link href="/packages" className="text-sm font-semibold text-orange-600 hover:underline">
            Book a New Package
          </Link>
        </div>

        {user.bookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-600">You have not booked any package yet.</p>
            <Link href="/packages" className="mt-4 inline-block rounded-full bg-orange-500 px-5 py-2 text-sm font-medium text-white hover:bg-orange-600">
              Explore Packages
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {user.bookings.map((booking) => (
              <div key={booking.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-800">{booking.package.title}</h3>
                    <p className="text-sm text-slate-500">{booking.package.destination}</p>
                  </div>
                  <div className="text-sm text-right">
                    <p className="text-slate-500">Travel Date</p>
                    <p className="font-medium text-slate-700">
                      {new Date(booking.travelDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-4">
                  <div className="rounded-xl bg-slate-50 px-3 py-2">
                    <p className="text-slate-500">Booking Status</p>
                    <p className="font-semibold text-slate-800">{booking.status}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 px-3 py-2">
                    <p className="text-slate-500">Travellers</p>
                    <p className="font-semibold text-slate-800">{booking.travellers}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 px-3 py-2">
                    <p className="text-slate-500">Amount</p>
                    <p className="font-semibold text-slate-800">Rs {booking.totalAmount.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 px-3 py-2">
                    <p className="text-slate-500">Payment</p>
                    <p className="font-semibold text-slate-800">{booking.payment?.status || 'PENDING'}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <Link href={`/booking/confirmation/${booking.id}`} className="text-sm font-semibold text-orange-600 hover:underline">
                    View Booking Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


