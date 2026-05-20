import { prisma } from '@/lib/db'
import EnquiryCard from './EnquiryCard'

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

      {enquiries.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center text-gray-400">
          <p>No enquiries yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {enquiries.map((e) => (
            <EnquiryCard
              key={e.id}
              id={e.id}
              name={e.name}
              phone={e.phone}
              email={e.email}
              message={e.message}
              packageTitle={e.package?.title || null}
              createdAt={e.createdAt}
            />
          ))}
        </div>
      )}
    </div>
  )
}
