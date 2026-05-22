import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { authOptions } from '@/lib/auth'

async function getCurrentAgent(email?: string | null) {
  if (!email) return null
  const user = await prisma.user.findUnique({ where: { email }, include: { agent: true } })
  return user?.agent || null
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const agent = await getCurrentAgent(session?.user?.email)
    const { agentId, packageId } = await req.json()

    if (!agent || agent.id !== agentId || agent.status !== 'APPROVED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const pref = await prisma.agentTourPreference.upsert({
      where: { agentId_packageId: { agentId, packageId } },
      update: {},
      create: { agentId, packageId },
    })

    revalidatePath('/agent/tours')
    revalidatePath('/admin/agents')
    return NextResponse.json(pref, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to add preference' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const agent = await getCurrentAgent(session?.user?.email)
    const { agentId, packageId } = await req.json()

    if (!agent || agent.id !== agentId || agent.status !== 'APPROVED') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    await prisma.agentTourPreference.delete({
      where: { agentId_packageId: { agentId, packageId } },
    })

    revalidatePath('/agent/tours')
    revalidatePath('/admin/agents')
    return NextResponse.json({ message: 'Removed' })
  } catch {
    return NextResponse.json({ error: 'Failed to remove preference' }, { status: 500 })
  }
}
