import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { packageId, rating, comment } = await req.json()
    if (!packageId || !rating || !comment) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }

    const ratingNum = Number(rating)
    if (ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
    }

    // Check if user has already reviewed this package
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: user.id,
        packageId: packageId,
      },
    })

    let review
    if (existingReview) {
      review = await prisma.review.update({
        where: { id: existingReview.id },
        data: {
          rating: ratingNum,
          comment,
        },
      })
    } else {
      review = await prisma.review.create({
        data: {
          userId: user.id,
          packageId: packageId,
          rating: ratingNum,
          comment,
        },
      })
    }

    return NextResponse.json({ success: true, review })
  } catch (error) {
    console.error('Review submit error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
