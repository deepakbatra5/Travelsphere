import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const agents = await prisma.agent.findMany({
      where: { status: 'APPROVED' },
      include: { user: { select: { name: true, email: true } } },
      orderBy: [{ rating: 'desc' }, { totalTours: 'desc' }],
    })

    return NextResponse.json(agents)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch agents' }, { status: 500 })
  }
}
