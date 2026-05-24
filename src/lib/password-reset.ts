import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'
import { sendPasswordResetOtp } from '@/lib/email'
import { normalizeEmail } from '@/lib/email-otp'

const RESET_OTP_EXPIRES_MINUTES = Number(process.env.PASSWORD_RESET_OTP_EXPIRES_MINUTES || 10)
const RESET_OTP_MAX_ATTEMPTS = Number(process.env.PASSWORD_RESET_OTP_MAX_ATTEMPTS || 5)
const RESET_OTP_COOLDOWN_SECONDS = Number(process.env.PASSWORD_RESET_OTP_COOLDOWN_SECONDS || 60)

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function getCooldownSeconds(sentAt: Date | null) {
  if (!sentAt) return 0
  const elapsedSeconds = Math.floor((Date.now() - sentAt.getTime()) / 1000)
  return Math.max(RESET_OTP_COOLDOWN_SECONDS - elapsedSeconds, 0)
}

export async function createAndSendPasswordResetOtp(email: string) {
  const user = await prisma.user.findUnique({ where: { email: normalizeEmail(email) } })

  if (!user) return

  const cooldownSeconds = getCooldownSeconds(user.passwordResetOtpSentAt)
  if (cooldownSeconds > 0) {
    throw new Error(`Please wait ${cooldownSeconds} second(s) before requesting another OTP.`)
  }

  const otp = generateOtp()
  const otpHash = await bcrypt.hash(otp, 12)
  const expiresAt = new Date(Date.now() + RESET_OTP_EXPIRES_MINUTES * 60 * 1000)

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordResetOtpHash: otpHash,
      passwordResetOtpExpiresAt: expiresAt,
      passwordResetOtpAttempts: 0,
      passwordResetOtpSentAt: new Date(),
    },
  })

  await sendPasswordResetOtp({
    to: user.email,
    name: user.name,
    otp,
    expiresMinutes: RESET_OTP_EXPIRES_MINUTES,
  })
}

export async function resetPasswordWithOtp(email: string, otp: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email: normalizeEmail(email) } })

  if (!user) {
    return { ok: false, status: 400, error: 'Invalid or expired OTP.' }
  }

  if (!user.passwordResetOtpHash || !user.passwordResetOtpExpiresAt || user.passwordResetOtpExpiresAt.getTime() < Date.now()) {
    return { ok: false, status: 400, error: 'Invalid or expired OTP.' }
  }

  if (user.passwordResetOtpAttempts >= RESET_OTP_MAX_ATTEMPTS) {
    return { ok: false, status: 429, error: 'Too many incorrect attempts. Please request a new OTP.' }
  }

  const isValid = await bcrypt.compare(otp, user.passwordResetOtpHash)

  if (!isValid) {
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { passwordResetOtpAttempts: { increment: 1 } },
    })
    const attemptsLeft = Math.max(RESET_OTP_MAX_ATTEMPTS - updated.passwordResetOtpAttempts, 0)
    return { ok: false, status: 400, error: `Invalid OTP. ${attemptsLeft} attempt(s) left.` }
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      passwordResetOtpHash: null,
      passwordResetOtpExpiresAt: null,
      passwordResetOtpAttempts: 0,
      passwordResetOtpSentAt: null,
    },
  })

  return { ok: true }
}
