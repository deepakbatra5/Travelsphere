import { NextResponse } from 'next/server'
import { verifyEmailOtp } from '@/lib/email-otp'

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json()

    if (!email || !otp || !/^\d{6}$/.test(String(otp))) {
      return NextResponse.json({ error: 'Enter a valid 6-digit OTP.' }, { status: 400 })
    }

    const result = await verifyEmailOtp(email, String(otp))

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status })
    }

    return NextResponse.json({ message: 'Email verified successfully. You can now login.' })
  } catch {
    return NextResponse.json({ error: 'Failed to verify OTP.' }, { status: 500 })
  }
}
