import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action, currentPassword, newPassword } = await req.json()

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (action === 'change-password') {
      if (!currentPassword || !newPassword) {
        return NextResponse.json({ error: 'Missing passwords' }, { status: 400 })
      }

      // Check current password
      const isMatch = await bcrypt.compare(currentPassword, user.password)
      if (!isMatch) {
        return NextResponse.json({ error: 'Incorrect current password' }, { status: 400 })
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12)

      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      })

      return NextResponse.json({ success: true, message: 'Password changed successfully' })
    }

    if (action === 'delete-account') {
      if (!currentPassword) {
        return NextResponse.json({ error: 'Please enter your password to confirm deletion' }, { status: 400 })
      }

      // Check password
      const isMatch = await bcrypt.compare(currentPassword, user.password)
      if (!isMatch) {
        return NextResponse.json({ error: 'Incorrect password' }, { status: 400 })
      }

      // Delete user data (bookings, reviews, enquiries, agent, etc.)
      await prisma.$transaction([
        prisma.bookingAgent.deleteMany({ where: { agent: { userId: user.id } } }),
        prisma.bookingAgent.deleteMany({ where: { booking: { userId: user.id } } }),
        prisma.agentTourPreference.deleteMany({ where: { agent: { userId: user.id } } }),
        prisma.agent.deleteMany({ where: { userId: user.id } }),
        prisma.payment.deleteMany({ where: { booking: { userId: user.id } } }),
        prisma.booking.deleteMany({ where: { userId: user.id } }),
        prisma.review.deleteMany({ where: { userId: user.id } }),
        prisma.enquiry.deleteMany({ where: { userId: user.id } }),
        prisma.user.delete({ where: { id: user.id } }),
      ])

      return NextResponse.json({ success: true, message: 'Account deleted successfully' })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Settings API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
