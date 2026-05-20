import { prisma } from '@/lib/db'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getStats() {
  const [totalBookings, totalUsers, totalPackages, revenueResult, recentBookings, pendingBookings] = await Promise.all([
    prisma.booking.count(),
    prisma.user.count({ where: { role: 'USER' } }),
    prisma.package.count({ where: { isActive: true } }),
    prisma.booking.aggregate({ _sum: { totalAmount: true }, where: { status: 'CONFIRMED' } }),
    prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: true, package: true },
    }),
    prisma.booking.count({ where: { status: 'PENDING' } }),
  ])

  return {
    totalBookings,
    totalUsers,
    totalPackages,
    totalRevenue: revenueResult._sum.totalAmount || 0,
    recentBookings,
    pendingBookings,
  }
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    CONFIRMED: 'bg-green-100 text-green-700',
    PENDING: 'bg-yellow-100 text-yellow-700',
    CANCELLED: 'bg-red-100 text-red-700',
    COMPLETED: 'bg-orange-100 text-orange-700',
  }

  return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status] || 'bg-gray-100 text-gray-600'}`}>{status}</span>
}

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/admin/login')
  }

  const stats = await getStats()

  const statCards = [
    { label: 'Total Bookings', value: stats.totalBookings, bg: 'bg-orange-500', link: '/admin/bookings' },
    { label: 'Total Revenue', value: `Rs ${stats.totalRevenue.toLocaleString('en-IN')}`, bg: 'bg-green-500', link: '/admin/bookings' },
    { label: 'Active Packages', value: stats.totalPackages, bg: 'bg-orange-500', link: '/admin/packages' },
    { label: 'Registered Users', value: stats.totalUsers, bg: 'bg-purple-500', link: '/admin/customers' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here is what is happening today.</p>
      </div>

      {stats.pendingBookings > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-5 py-4 flex items-center justify-between">
          <p className="text-yellow-700 text-sm font-medium">You have {stats.pendingBookings} pending booking(s) that need attention.</p>
          <Link href="/admin/bookings?status=PENDING" className="text-yellow-600 text-sm font-semibold hover:underline">
            View Now
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => (
          <Link key={card.label} href={card.link}>
            <div className={`${card.bg} text-white rounded-2xl p-5 hover:opacity-90 transition cursor-pointer`}>
              <p className="text-sm opacity-80 mb-1">{card.label}</p>
              <p className="text-2xl font-bold">{card.value}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-gray-800">Recent Bookings</h2>
          <Link href="/admin/bookings" className="text-orange-500 text-sm hover:underline">
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-100">
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Package</th>
                <th className="pb-3 font-medium">Travel Date</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats.recentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="py-3 font-medium text-gray-700">{booking.user.name}</td>
                  <td className="py-3 text-gray-500 truncate max-w-37.5">{booking.package.title}</td>
                  <td className="py-3 text-gray-500">{new Date(booking.travelDate).toLocaleDateString('en-IN')}</td>
                  <td className="py-3 font-medium">Rs {booking.totalAmount.toLocaleString('en-IN')}</td>
                  <td className="py-3">
                    <StatusBadge status={booking.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {stats.recentBookings.length === 0 && <p className="text-center text-gray-400 py-8">No bookings yet</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/admin/packages/new" className="bg-orange-500 text-white text-center py-4 rounded-2xl font-semibold hover:bg-orange-600 transition">
          Add New Package
        </Link>
        <Link href="/admin/bookings" className="bg-orange-500 text-white text-center py-4 rounded-2xl font-semibold hover:bg-orange-600 transition">
          Manage Bookings
        </Link>
        <Link href="/admin/customers" className="bg-purple-500 text-white text-center py-4 rounded-2xl font-semibold hover:bg-purple-600 transition">
          View Customers
        </Link>
      </div>
    </div>
  )
}


