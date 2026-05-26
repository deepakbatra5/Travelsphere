import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

async function getCurrentAgent(email?: string | null) {
  if (!email) return null

  return prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    include: {
      agent: true,
      agentDeletionRequest: true,
    },
  })
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const user = await getCurrentAgent(session?.user?.email)

    if (!user?.agent) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { action, currentPassword, newPassword, reason } = await req.json()

    if (action === 'change-password') {
      if (!currentPassword || !newPassword) {
        return NextResponse.json({ error: 'Missing passwords' }, { status: 400 })
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password)
      if (!isMatch) {
        return NextResponse.json({ error: 'Incorrect current password' }, { status: 400 })
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12)

      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      })

      revalidatePath('/agent/settings')
      return NextResponse.json({ success: true, message: 'Password updated successfully' })
    }

    if (action === 'request-delete-account') {
      if (!currentPassword) {
        return NextResponse.json({ error: 'Please enter your password to confirm the request' }, { status: 400 })
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password)
      if (!isMatch) {
        return NextResponse.json({ error: 'Incorrect password' }, { status: 400 })
      }

      const existingRequest = await prisma.agentDeletionRequest.findUnique({
        where: { userId: user.id },
      })

      if (existingRequest) {
        return NextResponse.json({ error: 'A deletion request is already pending review.' }, { status: 409 })
      }

      await prisma.agentDeletionRequest.create({
        data: {
          userId: user.id,
          agentId: user.agent.id,
          reason: reason?.trim() || null,
        },
      })

      revalidatePath('/agent/settings')
      revalidatePath('/admin/agents')

      return NextResponse.json({
        success: true,
        message: 'Deletion request submitted. An admin must approve it before your account is removed.',
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Agent settings API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}