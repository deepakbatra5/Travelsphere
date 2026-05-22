import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { createAndSendEmailOtp, normalizeEmail } from '@/lib/email-otp'

export async function POST(req: Request) {
  try {
    const { name, email, password, phone, city, state, experience, bio, languages } = await req.json()
    const normalizedEmail = normalizeEmail(email || '')

    if (!name || !email || !password || !phone || !city || !state || !experience || !Array.isArray(languages) || languages.length === 0) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    const exists = await prisma.user.findUnique({ where: { email: normalizedEmail } })
    if (exists) return NextResponse.json({ error: 'Email already registered.' }, { status: 400 })

    const hashed = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashed,
        phone,
        role: 'USER',
        isEmailVerified: false,
        agent: {
          create: {
            phone,
            city,
            state,
            experience: parseInt(experience, 10),
            bio: bio || null,
            languages,
            status: 'PENDING',
          },
        },
      },
    })

    await createAndSendEmailOtp(user)

    return NextResponse.json({ message: 'Agent registered. Please verify the OTP sent to your email.', email: user.email }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Registration failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
