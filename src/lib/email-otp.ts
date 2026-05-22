import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { sendEmailOtp } from '@/lib/email'

const OTP_EXPIRES_MINUTES = Number(process.env.EMAIL_OTP_EXPIRES_MINUTES || 5)
const OTP_MAX_ATTEMPTS = Number(process.env.EMAIL_OTP_MAX_ATTEMPTS || 3)
const OTP_RESEND_COOLDOWN_SECONDS = Number(process.env.EMAIL_OTP_RESEND_COOLDOWN_SECONDS || 60)
const OTP_RESEND_WINDOW_MINUTES = Number(process.env.EMAIL_OTP_RESEND_WINDOW_MINUTES || 15)
const OTP_RESEND_LIMIT = Number(process.env.EMAIL_OTP_RESEND_LIMIT || 5)

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function canResetResendWindow(sentAt: Date | null) {
  if (!sentAt) return true
  const windowMs = OTP_RESEND_WINDOW_MINUTES * 60 * 1000
  return Date.now() - sentAt.getTime() > windowMs
}

export function getOtpCooldownSeconds(sentAt: Date | null) {
  if (!sentAt) return 0
  const elapsedSeconds = Math.floor((Date.now() - sentAt.getTime()) / 1000)
  return Math.max(OTP_RESEND_COOLDOWN_SECONDS - elapsedSeconds, 0)
}

export async function createAndSendEmailOtp(user: { id: string; name: string; email: string }, options?: { isResend?: boolean }) {
  const existingUser = await prisma.user.findUnique({ where: { id: user.id } })

  if (!existingUser) {
    throw new Error('User not found')
  }

  const cooldownSeconds = getOtpCooldownSeconds(existingUser.emailOtpSentAt)
  if (options?.isResend && cooldownSeconds > 0) {
    throw new Error(`Please wait ${cooldownSeconds} second(s) before requesting another OTP.`)
  }

  const resendCount = canResetResendWindow(existingUser.emailOtpSentAt) ? 0 : existingUser.emailOtpResendCount
  if (options?.isResend && resendCount >= OTP_RESEND_LIMIT) {
    throw new Error('Too many OTP resend requests. Please try again later.')
  }

  const otp = generateOtp()
  const otpHash = await bcrypt.hash(otp, 12)
  const expiresAt = new Date(Date.now() + OTP_EXPIRES_MINUTES * 60 * 1000)

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailOtpHash: otpHash,
      emailOtpExpiresAt: expiresAt,
      emailOtpAttempts: 0,
      emailOtpSentAt: new Date(),
      emailOtpResendCount: options?.isResend ? resendCount + 1 : 0,
    },
  })

  await sendEmailOtp({
    to: user.email,
    name: user.name,
    otp,
    expiresMinutes: OTP_EXPIRES_MINUTES,
  })
}

export async function verifyEmailOtp(email: string, otp: string) {
  const user = await prisma.user.findUnique({ where: { email: normalizeEmail(email) } })

  if (!user) {
    return { ok: false, status: 404, error: 'User not found.' }
  }

  if (user.isEmailVerified) {
    return { ok: true, user }
  }

  if (!user.emailOtpHash || !user.emailOtpExpiresAt || user.emailOtpExpiresAt.getTime() < Date.now()) {
    return { ok: false, status: 400, error: 'OTP expired. Please request a new OTP.' }
  }

  if (user.emailOtpAttempts >= OTP_MAX_ATTEMPTS) {
    return { ok: false, status: 429, error: 'Too many incorrect attempts. Please resend OTP.' }
  }

  const isValid = await bcrypt.compare(otp, user.emailOtpHash)

  if (!isValid) {
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { emailOtpAttempts: { increment: 1 } },
    })
    const attemptsLeft = Math.max(OTP_MAX_ATTEMPTS - updated.emailOtpAttempts, 0)
    return { ok: false, status: 400, error: `Invalid OTP. ${attemptsLeft} attempt(s) left.` }
  }

  const verifiedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      isEmailVerified: true,
      emailVerifiedAt: new Date(),
      emailOtpHash: null,
      emailOtpExpiresAt: null,
      emailOtpAttempts: 0,
      emailOtpSentAt: null,
      emailOtpResendCount: 0,
    },
  })

  return { ok: true, user: verifiedUser }
}
