import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { BookingStatus } from '@/generated/prisma/client'
import { z } from 'zod'

const bulkStatusSchema = z.object({
  bookingIds: z.array(z.string().min(1)).min(1).max(500),
  status: z.nativeEnum(BookingStatus),
})

function revalidateBookingSurfaces() {
  revalidatePath('/admin/bookings')
  revalidatePath('/admin/agents')
  revalidatePath('/agent')
  revalidatePath('/agent/my-tours')
  revalidatePath('/agent/earnings')
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const parsed = bulkStatusSchema.safeParse(await req.json())

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid bulk status update' }, { status: 400 })
    }

    const bookingIds = [...new Set(parsed.data.bookingIds)]
    const nextStatus = parsed.data.status

    const result = await prisma.$transaction(async (tx) => {
      const bookings = await tx.booking.findMany({
        where: { id: { in: bookingIds } },
        select: { id: true, status: true, tripDateId: true, travellers: true },
      })

      if (bookings.length !== bookingIds.length) {
        throw new Error('BOOKING_NOT_FOUND')
      }

      const movingToCancelled = bookings.filter((booking) => booking.status !== 'CANCELLED' && nextStatus === 'CANCELLED')
      const movingOutOfCancelled = bookings.filter((booking) => booking.status === 'CANCELLED' && nextStatus !== 'CANCELLED')

      for (const booking of movingOutOfCancelled) {
        if (!booking.tripDateId) continue

        const seatUpdate = await tx.packageTripDate.updateMany({
          where: {
            id: booking.tripDateId,
            availableSeats: { gte: booking.travellers },
          },
          data: { availableSeats: { decrement: booking.travellers } },
        })

        if (seatUpdate.count !== 1) {
          throw new Error('NOT_ENOUGH_SEATS')
        }
      }

      for (const booking of movingToCancelled) {
        if (!booking.tripDateId) continue

        await tx.packageTripDate.update({
          where: { id: booking.tripDateId },
          data: { availableSeats: { increment: booking.travellers } },
        })
      }

      await tx.booking.updateMany({
        where: { id: { in: bookingIds } },
        data: { status: nextStatus },
      })

      if (nextStatus === 'COMPLETED') {
        await tx.bookingAgent.updateMany({
          where: { bookingId: { in: bookingIds } },
          data: { status: 'COMPLETED', completedAt: new Date() },
        })
      }

      if (nextStatus === 'CANCELLED') {
        await tx.bookingAgent.updateMany({
          where: { bookingId: { in: bookingIds } },
          data: { status: 'CANCELLED' },
        })
      }

      return { updated: bookingIds.length }
    })

    revalidateBookingSurfaces()

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof Error && error.message === 'BOOKING_NOT_FOUND') {
      return NextResponse.json({ error: 'One or more bookings were not found' }, { status: 404 })
    }

    if (error instanceof Error && error.message === 'NOT_ENOUGH_SEATS') {
      return NextResponse.json({ error: 'Not enough seats to reactivate one or more cancelled bookings' }, { status: 400 })
    }

    return NextResponse.json({ error: 'Failed to update bookings' }, { status: 500 })
  }
}
