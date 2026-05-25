import { prisma } from '@/lib/db'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import UpdateBookingStatus from './UpdateBookingStatus'
import AssignAgentButton from './AssignAgentButton'
import BulkAssignAgentPanel from './BulkAssignAgentPanel'
import BulkUpdateBookingStatusPanel from './BulkUpdateBookingStatusPanel'
import { redirect } from 'next/navigation'
import { Category, Prisma } from '@/generated/prisma/client'

export const dynamic = 'force-dynamic'
export const revalidate = 0

function formatBookingTime(date: Date) {
  const time = date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${time}`
}

interface SearchParams {
  status?: string
  packageId?: string
  category?: string
  tripDateId?: string
}

interface Props {
  searchParams?: Promise<SearchParams>
}

export default async function AdminBookingsPage({ searchParams }: Props) {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/?callbackUrl=/bookings')
  }

  const resolved = (await searchParams) ?? {}
  const where: Prisma.BookingWhereInput = {}

  if (resolved.status && resolved.status !== 'ALL') {
    where.status = resolved.status as 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
  }

  if (resolved.packageId) {
    where.packageId = resolved.packageId
  }

  if (resolved.tripDateId) {
    where.tripDateId = resolved.tripDateId
  }

  if (resolved.category && resolved.category !== 'ALL' && resolved.category in Category) {
    where.package = { category: resolved.category as Category }
  }

  const bookings = await prisma.booking.findMany({
    where,
    include: {
      user: true,
      package: true,
      payment: true,
      agentAssignment: { include: { agent: { include: { user: { select: { name: true } } } } } },
      tripDate: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  const packages = await prisma.package.findMany({
    select: {
      id: true,
      title: true,
      category: true,
      tripDates: { orderBy: { startDate: 'asc' } },
    },
    orderBy: { title: 'asc' },
  })

  const agents = await prisma.agent.findMany({
    where: { status: 'APPROVED' },
    include: {
      user: { select: { name: true } },
      assignedBookings: { select: { status: true } },
    },
    orderBy: [{ rating: 'desc' }, { totalTours: 'desc' }],
  })

  const statusFilters = ['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']
  const bulkAssignableBookingIds = bookings
    .filter((booking) => booking.status === 'CONFIRMED')
    .map((booking) => booking.id)
  const filteredBookingIds = bookings.map((booking) => booking.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Bookings</h1>
        <p className="text-gray-500 text-sm mt-1">{bookings.length} bookings found</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {statusFilters.map((status) => (
          <a
            key={status}
            href={status === 'ALL' ? '/admin/bookings' : `/admin/bookings?status=${status}`}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition
              ${resolved.status === status || (!resolved.status && status === 'ALL')
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {status}
          </a>
        ))}
      </div>

      <form action="/admin/bookings" className="grid grid-cols-1 gap-3 rounded-2xl bg-white p-4 shadow-sm md:grid-cols-4">
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-500">Category</label>
          <select name="category" defaultValue={resolved.category || 'ALL'} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm">
            <option value="ALL">All categories</option>
            {Object.values(Category).map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-500">Package</label>
          <select name="packageId" defaultValue={resolved.packageId || ''} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm">
            <option value="">All packages</option>
            {packages.map((pkg) => (
              <option key={pkg.id} value={pkg.id}>{pkg.title}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-500">Trip Date</label>
          <select name="tripDateId" defaultValue={resolved.tripDateId || ''} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm">
            <option value="">All dates</option>
            {packages.flatMap((pkg) => pkg.tripDates.map((tripDate) => (
              <option key={tripDate.id} value={tripDate.id}>
                {pkg.title} - {new Date(tripDate.startDate).toLocaleDateString('en-IN')}
              </option>
            )))}
          </select>
        </div>
        <div className="flex items-end gap-2">
          <input type="hidden" name="status" value={resolved.status || 'ALL'} />
          <button type="submit" className="flex-1 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600">
            Filter
          </button>
          <a href="/admin/bookings" className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50">
            Reset
          </a>
        </div>
      </form>

      <BulkUpdateBookingStatusPanel bookingIds={filteredBookingIds} />

      <BulkAssignAgentPanel bookingIds={bulkAssignableBookingIds} agents={agents} />

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-gray-500">
                <th className="px-5 py-4 font-medium">Booking ID</th>
                <th className="px-5 py-4 font-medium">Customer</th>
                <th className="px-5 py-4 font-medium">Package</th>
                <th className="px-5 py-4 font-medium">Customer Booking Time</th>
                <th className="px-5 py-4 font-medium">Travel Date</th>
                <th className="px-5 py-4 font-medium">Seats Left</th>
                <th className="px-5 py-4 font-medium">Travellers</th>
                <th className="px-5 py-4 font-medium">Amount</th>
                <th className="px-5 py-4 font-medium">Payment</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 font-medium">Agent</th>
                <th className="px-5 py-4 font-medium">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 font-mono text-xs text-gray-500">{booking.id.slice(0, 8).toUpperCase()}</td>
                  <td className="px-5 py-4">
                    <div className="font-medium text-gray-700">{booking.user.name}</div>
                    <div className="text-gray-400 text-xs">{booking.user.email}</div>
                  </td>
                  <td className="px-5 py-4 text-gray-600 max-w-37.5 truncate">{booking.package.title}</td>
                  <td className="px-5 py-4 text-gray-600">{formatBookingTime(booking.createdAt)}</td>
                  <td className="px-5 py-4 text-gray-600">{new Date(booking.travelDate).toLocaleDateString('en-IN')}</td>
                  <td className="px-5 py-4 text-center text-gray-600">{booking.tripDate?.availableSeats ?? '-'}</td>
                  <td className="px-5 py-4 text-center text-gray-600">{booking.travellers}</td>
                  <td className="px-5 py-4 font-medium text-gray-800">Rs {booking.totalAmount.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full
                      ${booking.payment?.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-600'}`}
                    >
                      {booking.payment?.status || 'PENDING'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full
                      ${booking.status === 'CONFIRMED'
                        ? 'bg-green-100 text-green-700'
                        : booking.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-700'
                          : booking.status === 'CANCELLED'
                            ? 'bg-red-100 text-red-600'
                            : 'bg-orange-100 text-orange-700'}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="space-y-1">
                      {booking.agentAssignment ? (
                        <p className="text-xs font-semibold text-emerald-600">{booking.agentAssignment.agent.user.name}</p>
                      ) : (
                        <p className="text-xs text-gray-400">Not assigned</p>
                      )}
                      {booking.status === 'CONFIRMED' && (
                        <AssignAgentButton
                          bookingId={booking.id}
                          currentAgentId={booking.agentAssignment?.agentId}
                          agents={agents}
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <UpdateBookingStatus bookingId={booking.id} currentStatus={booking.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {bookings.length === 0 && <p className="text-center text-gray-400 py-10">No bookings found</p>}
        </div>
      </div>
    </div>
  )
}


