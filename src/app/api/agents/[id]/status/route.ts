import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { authOptions } from '@/lib/auth'
import { AgentStatus } from '@/generated/prisma/client'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { id } = await params
    const { status } = await req.json()

    if (!(status in AgentStatus)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const agent = await prisma.agent.update({
      where: { id },
      data: { status },
    })

    revalidatePath('/admin/agents')
    revalidatePath('/agent')
    return NextResponse.json(agent)
  } catch {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}
