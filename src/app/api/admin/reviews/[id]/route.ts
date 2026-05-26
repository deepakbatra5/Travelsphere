import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/db'
import { authOptions } from '@/lib/auth'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { id } = await params
    const body = await req.json()
    const { isPinned } = body

    if (typeof isPinned !== 'boolean') {
      return NextResponse.json({ error: 'Invalid isPinned value' }, { status: 400 })
    }

    // If trying to pin, check if we've reached the limit of 7
    if (isPinned) {
      const pinnedCount = await prisma.review.count({
        where: { isPinned: true }
      })

      if (pinnedCount >= 7) {
        return NextResponse.json(
          { error: 'You can pin a maximum of 7 reviews. Please unpin another review first.' },
          { status: 400 }
        )
      }
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: { isPinned }
    })

    return NextResponse.json({ success: true, review: updatedReview })
  } catch (error) {
    console.error('Failed to update review status:', error)
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { id } = await params

    await prisma.review.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete review:', error)
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 })
  }
}
