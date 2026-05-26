import { prisma } from '@/lib/db'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import EnquiriesDashboard from './EnquiriesDashboard'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getEnquiries() {
  return prisma.enquiry.findMany({
    orderBy: { createdAt: 'desc' },
    include: { package: { select: { title: true } } },
  })
}

export default async function AdminEnquiriesPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/?callbackUrl=/enquiries')
  }

  const enquiries = await getEnquiries()

  return (
    <div className="p-1 sm:p-2">
      <EnquiriesDashboard initialEnquiries={enquiries} />
    </div>
  )
}

