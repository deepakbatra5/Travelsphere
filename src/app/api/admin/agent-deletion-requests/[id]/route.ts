import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

async function assertAdmin() {
  const session = await getServerSession(authOptions)
  return session?.user?.role === 'ADMIN'
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await assertAdmin())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { id } = await params
    const { action } = await req.json()

    const request = await prisma.agentDeletionRequest.findUnique({
      where: { id },
      include: {
        user: { include: { agent: true } },
        agent: true,
      },
    })

    if (!request || !request.user.agent) {
      return NextResponse.json({ error: 'Deletion request not found' }, { status: 404 })
    }

    if (action === 'reject') {
      await prisma.agentDeletionRequest.delete({ where: { id } })
      revalidatePath('/admin/agents')
      return NextResponse.json({ message: 'Deletion request rejected.' })
    }

    if (action !== 'approve') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const userId = request.user.id
    const agentId = request.agent.id

    await prisma.$transaction([
      prisma.bookingAgent.deleteMany({ where: { agentId } }),
      prisma.bookingAgent.deleteMany({ where: { booking: { userId } } }),
      prisma.agentTourPreference.deleteMany({ where: { agentId } }),
      prisma.payment.deleteMany({ where: { booking: { userId } } }),
      prisma.booking.deleteMany({ where: { userId } }),
      prisma.review.deleteMany({ where: { userId } }),
      prisma.enquiry.deleteMany({ where: { userId } }),
      prisma.agent.delete({ where: { id: agentId } }),
      prisma.user.delete({ where: { id: userId } }),
    ])

    revalidatePath('/admin/agents')
    revalidatePath('/agent/settings')
    revalidatePath('/admin')

    return NextResponse.json({ message: 'Agent account permanently deleted.' })
  } catch (error) {
    console.error('Approve agent deletion error:', error)
    return NextResponse.json({ error: 'Failed to process deletion request' }, { status: 500 })
  }
}