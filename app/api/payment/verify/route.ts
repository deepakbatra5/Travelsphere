import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/db'
import { sendBookingConfirmationEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const {
      bookingId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = await req.json()

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex')

    const isValid = expectedSignature === razorpay_signature

    if (!isValid) {
      await prisma.$transaction(async (tx) => {
        const booking = await tx.booking.findUnique({ where: { id: bookingId } })

        await tx.payment.update({
          where: { bookingId },
          data: { status: 'FAILED' }
        })

        if (booking?.tripDateId && booking.status !== 'CANCELLED') {
          await tx.packageTripDate.update({
            where: { id: booking.tripDateId },
            data: { availableSeats: { increment: booking.travellers } },
          })

          await tx.booking.update({
            where: { id: bookingId },
            data: { status: 'CANCELLED' },
          })
        }
      })
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 })
    }

    // Update payment record
    await prisma.payment.update({
      where: { bookingId },
      data: {
        razorpayPaymentId: razorpay_payment_id,
        status: 'SUCCESS',
      }
    })

    // Update booking status to CONFIRMED
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CONFIRMED' },
      include: {
        user: true,
        package: true,
      }
    })

    // Send confirmation email
    await sendBookingConfirmationEmail(booking)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json({ success: false, error: 'Verification failed' }, { status: 500 })
  }
}
