import { NextResponse } from 'next/server'
import { razorpay } from '@/lib/razorpay'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { bookingId, amount } = await req.json()

    // Create Razorpay order (amount in paise — multiply by 100)
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `booking_${bookingId}`,
      notes: { bookingId },
    })

    // Save order to DB
    await prisma.payment.create({
      data: {
        bookingId,
        razorpayOrderId: order.id,
        amount,
        status: 'PENDING',
      }
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error('Razorpay order error:', error)
    return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 })
  }
}