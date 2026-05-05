import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { createAndSendEmailOtp, normalizeEmail } from '@/lib/email-otp'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email: normalizeEmail(email) } })

    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 })
    }

    if (user.isEmailVerified) {
      return NextResponse.json({ error: 'Email is already verified. Please login.' }, { status: 400 })
    }

    await createAndSendEmailOtp(user, { isResend: true })

    return NextResponse.json({ message: 'New OTP sent to your email.' })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to resend OTP.'
    const status = message.includes('Too many') ? 429 : message.includes('Please wait') ? 429 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
