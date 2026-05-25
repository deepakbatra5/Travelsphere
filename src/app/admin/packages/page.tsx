import { prisma } from '@/lib/db'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import DeletePackageButton from './DeletePackageButton'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminPackagesPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/?callbackUrl=/packages')
  }

  const packages = await prisma.package.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { bookings: true } },
      tripDates: { orderBy: { startDate: 'asc' }, take: 3 },
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Packages</h1>
          <p className="text-gray-500 text-sm mt-1">{packages.length} total packages</p>
        </div>
        <Link href="/admin/packages/new" className="bg-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-600 transition">
          Add New Package
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-gray-500">
                <th className="px-5 py-4 font-medium">Package</th>
                <th className="px-5 py-4 font-medium">Category</th>
                <th className="px-5 py-4 font-medium">Duration</th>
                <th className="px-5 py-4 font-medium">Price</th>
                <th className="px-5 py-4 font-medium">Trip Dates</th>
                <th className="px-5 py-4 font-medium">Bookings</th>
                <th className="px-5 py-4 font-medium">Featured</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {packages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <div className="font-medium text-gray-800 max-w-50 truncate">{pkg.title}</div>
                    <div className="text-gray-400 text-xs mt-0.5">{pkg.destination}</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="bg-orange-100 text-orange-600 text-xs font-semibold px-2 py-1 rounded-full">{pkg.category}</span>
                  </td>
                  <td className="px-5 py-4 text-gray-600">{pkg.duration} Days</td>
                  <td className="px-5 py-4 font-medium text-gray-800">Rs {pkg.price.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-4">
                    {pkg.tripDates.length > 0 ? (
                      <div className="space-y-1">
                        {pkg.tripDates.map((tripDate) => (
                          <div key={tripDate.id} className="text-xs text-gray-600">
                            <span className="font-semibold">{new Date(tripDate.startDate).toLocaleDateString('en-IN')}</span>
                            <span className="text-gray-400"> - {tripDate.availableSeats}/{tripDate.totalSeats} seats</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">No dates</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-gray-600">{pkg._count.bookings}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${pkg.isFeatured ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'}`}>
                      {pkg.isFeatured ? 'Featured' : 'Not Featured'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${pkg.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {pkg.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/packages/${pkg.id}/edit`} className="text-orange-500 hover:underline text-xs font-medium">
                        Edit
                      </Link>
                      <DeletePackageButton id={pkg.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {packages.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p>No packages yet.</p>
              <Link href="/admin/packages/new" className="text-orange-500 text-sm mt-2 inline-block hover:underline">
                Add your first package
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


