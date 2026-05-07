import { prisma } from '@/lib/db'

export default async function AdminEnquiriesPage() {
  const enquiries = await prisma.enquiry.findMany({
    orderBy: { createdAt: 'desc' },
    include: { package: { select: { title: true } } }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Customer Enquiries</h1>
        <p className="text-gray-500 text-sm mt-1">{enquiries.length} total enquiries</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-gray-500">
                <th className="px-5 py-4 font-medium">Name</th>
                <th className="px-5 py-4 font-medium">Phone</th>
                <th className="px-5 py-4 font-medium">Email</th>
                <th className="px-5 py-4 font-medium">Package</th>
                <th className="px-5 py-4 font-medium">Message</th>
                <th className="px-5 py-4 font-medium">Date</th>
                <th className="px-5 py-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {enquiries.map((e) => (
                <tr key={e.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 font-medium text-gray-800">{e.name}</td>
                  <td className="px-5 py-4">
                    <a href={`tel:${e.phone}`} className="text-blue-500 hover:underline">{e.phone}</a>
                  </td>
                  <td className="px-5 py-4 text-gray-500 text-xs">{e.email || 'N/A'}</td>
                  <td className="px-5 py-4 text-gray-500 text-xs">{e.package?.title || 'General'}</td>
                  <td className="px-5 py-4 text-gray-500 max-w-[200px]">
                    <p className="truncate text-xs">{e.message}</p>
                  </td>
                  <td className="px-5 py-4 text-gray-400 text-xs">
                    {new Date(e.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-4">
                    <a
                      href={`https://wa.me/91${e.phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-lg hover:bg-green-200 transition"
                    >
                      WhatsApp
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {enquiries.length === 0 && (
            <p className="text-center text-gray-400 py-10">No enquiries yet</p>
          )}
        </div>
      </div>
    </div>
  )
}
