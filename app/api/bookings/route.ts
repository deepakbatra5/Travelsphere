import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { packageId, tripDateId, travellers, totalAmount, travellersInfo } = await req.json()

    // Get user from DB
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!tripDateId) {
      return NextResponse.json({ error: 'Please select a planned trip date' }, { status: 400 })
    }

    const booking = await prisma.$transaction(async (tx) => {
      const tripDate = await tx.packageTripDate.findUnique({ where: { id: tripDateId } })

      if (!tripDate || tripDate.packageId !== packageId) {
        throw new Error('INVALID_TRIP_DATE')
      }

      const seatUpdate = await tx.packageTripDate.updateMany({
        where: {
          id: tripDateId,
          packageId,
          availableSeats: { gte: travellers },
        },
        data: { availableSeats: { decrement: travellers } },
      })

      if (seatUpdate.count !== 1) {
        throw new Error('NOT_ENOUGH_SEATS')
      }

      return tx.booking.create({
        data: {
          userId: user.id,
          packageId,
          tripDateId,
          travelDate: tripDate.startDate,
          travellers,
          totalAmount,
          travellersInfo,
          status: 'PENDING',
        }
      })
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    if (error instanceof Error && error.message === 'INVALID_TRIP_DATE') {
      return NextResponse.json({ error: 'Selected trip date is not available' }, { status: 400 })
    }

    if (error instanceof Error && error.message === 'NOT_ENOUGH_SEATS') {
      return NextResponse.json({ error: 'Not enough seats available for this date' }, { status: 400 })
    }

    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const bookings = await prisma.booking.findMany({
      where: { userId: user.id },
      include: { package: true, payment: true },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(bookings)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}
