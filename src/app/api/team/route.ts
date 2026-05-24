import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'
import { authOptions } from '@/lib/auth'

// GET /api/team - Public: Fetch all team members ordered by display order
export async function GET() {
  try {
    const members = await prisma.teamMember.findMany({
      orderBy: { order: 'asc' }
    })
    return NextResponse.json(members)
  } catch (error) {
    console.error('Failed to fetch team members:', error)
    return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 })
  }
}

// POST /api/team - Admin only: Create or update a team member
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = await req.json()
    const { id, name, role, moto, linkedin, imageUrl, order } = body

    if (!name || !role || !moto || !linkedin) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const parsedOrder = typeof order === 'number' ? order : parseInt(order || '0', 10)

    if (id) {
      // Update existing member
      const member = await prisma.teamMember.update({
        where: { id },
        data: {
          name,
          role,
          moto,
          linkedin,
          imageUrl,
          order: parsedOrder
        }
      })
      return NextResponse.json(member)
    } else {
      // Create new member
      const member = await prisma.teamMember.create({
        data: {
          name,
          role,
          moto,
          linkedin,
          imageUrl,
          order: parsedOrder
        }
      })
      return NextResponse.json(member, { status: 201 })
    }
  } catch (error) {
    console.error('Failed to save team member:', error)
    return NextResponse.json({ error: 'Failed to save team member' }, { status: 500 })
  }
}

// DELETE /api/team - Admin only: Delete a team member
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 })
    }

    await prisma.teamMember.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete team member:', error)
    return NextResponse.json({ error: 'Failed to delete team member' }, { status: 500 })
  }
}
