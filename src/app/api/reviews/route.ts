import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/reviews – fetch all reviews sorted by pinned status, then latest first
export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: [
        { isPinned: 'desc' },
        { createdAt: 'desc' },
      ],
      include: {
        user: { select: { name: true } },
        package: { select: { title: true, destination: true } },
      },
    })

    const formattedReviews = reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      isPinned: r.isPinned,
      createdAt: r.createdAt.toISOString(),
      user: r.user ? { name: r.user.name } : { name: r.guestName || 'Anonymous' },
      package: r.package
        ? { title: r.package.title, destination: r.package.destination }
        : { title: r.guestDest || 'General Experience', destination: r.guestDest || '' },
      isGuest: !r.userId,
    }))

    return NextResponse.json({ reviews: formattedReviews })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json({ reviews: [] })
  }
}

// POST /api/reviews – submit a public review (guest mode: name + comment + rating, no login)
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, comment, rating, destination } = body

    if (!name || !comment || !rating) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const ratingNum = Number(rating)
    if (ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json({ error: 'Rating must be 1-5' }, { status: 400 })
    }

    // Save public guest review to the database
    const review = await prisma.review.create({
      data: {
        rating: ratingNum,
        comment,
        guestName: name,
        guestDest: destination || 'General Experience',
      },
    })

    const formattedReview = {
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt.toISOString(),
      isPinned: review.isPinned,
      user: { name: review.guestName || 'Anonymous' },
      package: { title: review.guestDest || 'General Experience', destination: review.guestDest || '' },
      isGuest: true,
    }

    return NextResponse.json({ review: formattedReview, success: true })
  } catch (error) {
    console.error('Failed to submit guest review:', error)
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 })
  }
}
