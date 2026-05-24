ALTER TABLE "User" ADD COLUMN "passwordResetOtpHash" TEXT;
ALTER TABLE "User" ADD COLUMN "passwordResetOtpExpiresAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN "passwordResetOtpAttempts" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "User" ADD COLUMN "passwordResetOtpSentAt" TIMESTAMP(3);
