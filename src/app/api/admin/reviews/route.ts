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

    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true, email: true } },
        package: { select: { title: true, destination: true } },
      },
    })

    const formattedReviews = reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      isPinned: r.isPinned,
      createdAt: r.createdAt.toISOString(),
      user: r.user ? { name: r.user.name, email: r.user.email } : { name: r.guestName || 'Anonymous', email: 'Guest User' },
      package: r.package
        ? { title: r.package.title, destination: r.package.destination }
        : { title: r.guestDest || 'General Experience', destination: r.guestDest || '' },
      isGuest: !r.userId,
    }))

    return NextResponse.json({ reviews: formattedReviews })
  } catch (error) {
    console.error('Failed to fetch admin reviews:', error)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}
