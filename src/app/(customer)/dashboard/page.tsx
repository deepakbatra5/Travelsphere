import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import CustomerDashboard from '@/components/dashboard/CustomerDashboard'

export const dynamic = 'force-dynamic'

interface Props {
  searchParams: Promise<{ tab?: string }>
}

export default async function DashboardPage({ searchParams }: Props) {
  const session = await getServerSession(authOptions)
  const { tab } = await searchParams

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
              id: true,
              title: true,
              slug: true,
              destination: true,
              duration: true,
            },
          },
          payment: {
            select: {
              status: true,
            },
          },
        },
        orderBy: { travelDate: 'desc' },
      },
      reviews: {
        select: {
          id: true,
          packageId: true,
          rating: true,
          comment: true,
        },
      },
    },
  })

  if (!user) {
    redirect('/login')
  }

  return (
    <CustomerDashboard
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        bookings: user.bookings.map(booking => ({
          id: booking.id,
          travelDate: booking.travelDate.toISOString(),
          travellers: booking.travellers,
          totalAmount: booking.totalAmount,
          status: booking.status,
          package: booking.package,
          payment: booking.payment,
        })),
        reviews: user.reviews,
      }}
      initialTab={tab || 'personal'}
    />
  )
}
