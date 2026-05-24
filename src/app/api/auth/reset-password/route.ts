import { NextResponse } from 'next/server'
import { z } from 'zod'
import { resetPasswordWithOtp } from '@/lib/password-reset'

const resetPasswordSchema = z.object({
  email: z.string().email(),
  otp: z.string().regex(/^\d{6}$/, 'Enter the 6-digit OTP.'),
  password: z.string().min(6, 'Password must be at least 6 characters.').max(100),
})

export async function POST(req: Request) {
  try {
    const parsed = resetPasswordSchema.safeParse(await req.json())

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid reset details.' }, { status: 400 })
    }

    const result = await resetPasswordWithOtp(parsed.data.email, parsed.data.otp, parsed.data.password)

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status })
    }

    return NextResponse.json({ message: 'Password reset successfully. Please login with your new password.' })
  } catch {
    return NextResponse.json({ error: 'Unable to reset password.' }, { status: 500 })
  }
}
