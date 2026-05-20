import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

const assignmentActionSchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('accept') }),
  z.object({ action: z.literal('decline'), reason: z.string().trim().min(5, 'Please enter a clear decline reason') }),
])

async function getCurrentAgent(email?: string | null) {
  if (!email) return null
  const user = await prisma.user.findUnique({ where: { email }, include: { agent: true } })
  return user?.agent || null
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    const agent = await getCurrentAgent(session?.user?.email)

    if (!agent || agent.status !== 'APPROVED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { id } = await params
    const body = await req.json()
    const parsed = assignmentActionSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid action' }, { status: 400 })
    }

    const assignment = await prisma.bookingAgent.findUnique({ where: { id } })

    if (!assignment || assignment.agentId !== agent.id) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })
    }

    if (assignment.status !== 'ASSIGNED') {
      return NextResponse.json({ error: 'Only newly assigned tours can be accepted or declined' }, { status: 400 })
    }

    const updated = await prisma.bookingAgent.update({
      where: { id },
      data: parsed.data.action === 'accept'
        ? { status: 'IN_PROGRESS', feedback: null }
        : { status: 'CANCELLED', feedback: `Declined by agent: ${parsed.data.reason}` },
    })

    revalidatePath('/agent')
    revalidatePath('/agent/my-tours')
    revalidatePath('/agent/earnings')
    revalidatePath('/admin/bookings')
    revalidatePath('/admin/agents')

    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Failed to update assignment' }, { status: 500 })
  }
}
