import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { BookingStatus } from '@/generated/prisma/client'
import { z } from 'zod'

const bookingStatusSchema = z.object({
  status: z.nativeEnum(BookingStatus),
})

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { id } = await params
    const body = await req.json()
    const parsed = bookingStatusSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid booking status' }, { status: 400 })
    }

    const booking = await prisma.$transaction(async (tx) => {
      const existing = await tx.booking.findUnique({ where: { id } })

      if (!existing) {
        throw new Error('BOOKING_NOT_FOUND')
      }

      const updated = await tx.booking.update({
        where: { id },
        data: { status: parsed.data.status },
      })

      if (parsed.data.status === 'CANCELLED' && existing.status !== 'CANCELLED' && existing.tripDateId) {
        await tx.packageTripDate.update({
          where: { id: existing.tripDateId },
          data: { availableSeats: { increment: existing.travellers } },
        })
      }

      return updated
    })

    if (parsed.data.status === 'COMPLETED') {
      await prisma.bookingAgent.updateMany({
        where: { bookingId: id },
        data: { status: 'COMPLETED', completedAt: new Date() },
      })
    }

    if (parsed.data.status === 'CANCELLED') {
      await prisma.bookingAgent.updateMany({
        where: { bookingId: id },
        data: { status: 'CANCELLED' },
      })
    }

    revalidatePath('/admin/bookings')
    revalidatePath('/admin/agents')
    revalidatePath('/agent')
    revalidatePath('/agent/my-tours')
    revalidatePath('/agent/earnings')

    return NextResponse.json(booking)
  } catch (error) {
    if (error instanceof Error && error.message === 'BOOKING_NOT_FOUND') {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 })
  }
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { id } = await params

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { user: true, package: true, payment: true, agentAssignment: true },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(booking)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 })
  }
}
