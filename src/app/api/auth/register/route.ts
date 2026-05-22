import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { createAndSendEmailOtp, normalizeEmail } from '@/lib/email-otp'

export async function POST(req: Request) {
  try {
    const { name, email, phone, password } = await req.json()
    const normalizedEmail = normalizeEmail(email || '')

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    })

    if (existingUser?.isEmailVerified) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = existingUser
      ? await prisma.user.update({
          where: { id: existingUser.id },
          data: { name, phone, password: hashedPassword, isEmailVerified: false, emailVerifiedAt: null },
        })
      : await prisma.user.create({
          data: { name, email: normalizedEmail, phone, password: hashedPassword, isEmailVerified: false }
        })

    await createAndSendEmailOtp(user)

    return NextResponse.json(
      { message: 'Account created. Please verify the OTP sent to your email.', userId: user.id, email: user.email },
      { status: 201 }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Something went wrong'
    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}
