import { prisma } from '@/lib/db'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminCustomersPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/admin/login')
  }

  const users = await prisma.user.findMany({
    where: {
      role: 'USER',
      agent: null,
    },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { bookings: true } },
      bookings: { select: { totalAmount: true, status: true } },
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
        <p className="text-gray-500 text-sm mt-1">{users.length} registered customers</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-gray-500">
                <th className="px-5 py-4 font-medium">Customer</th>
                <th className="px-5 py-4 font-medium">Phone</th>
                <th className="px-5 py-4 font-medium">Total Bookings</th>
                <th className="px-5 py-4 font-medium">Total Spent</th>
                <th className="px-5 py-4 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => {
                const totalSpent = user.bookings
                  .filter((b) => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
                  .reduce((sum, b) => sum + b.totalAmount, 0)

                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <div className="font-medium text-gray-800">{user.name}</div>
                      <div className="text-gray-400 text-xs">{user.email}</div>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{user.phone || 'Not provided'}</td>
                    <td className="px-5 py-4 text-center font-medium text-gray-700">{user._count.bookings}</td>
                    <td className="px-5 py-4 font-medium text-green-600">Rs {totalSpent.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-4 text-gray-400 text-xs">
                      {new Date(user.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {users.length === 0 && <p className="text-center text-gray-400 py-10">No customers yet</p>}
        </div>
      </div>
    </div>
  )
}
