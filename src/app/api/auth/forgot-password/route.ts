import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createAndSendPasswordResetOtp } from '@/lib/password-reset'

const forgotPasswordSchema = z.object({
  email: z.string().email(),
})

export async function POST(req: Request) {
  try {
    const parsed = forgotPasswordSchema.safeParse(await req.json())

    if (!parsed.success) {
      return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 })
    }

    await createAndSendPasswordResetOtp(parsed.data.email)

    return NextResponse.json({
      message: 'If an account exists for this email, a password reset OTP has been sent.',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to send reset OTP.'
    const status = message.includes('Please wait') ? 429 : 500
    return NextResponse.json({ error: message }, { status })
  }
}
