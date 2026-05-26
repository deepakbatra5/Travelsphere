import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const { name, phone, email, message, subject, packageId } = await req.json()

    const enquiry = await prisma.enquiry.create({
      data: {
        name,
        phone,
        email: email || null,
        message: subject ? `[${subject}] ${message}` : message,
        packageId: packageId || null,
      }
    })

    return NextResponse.json({ message: 'Enquiry submitted', id: enquiry.id }, { status: 201 })
  } catch (error) {
    console.error('Enquiry submission error:', error)
    return NextResponse.json({ error: 'Failed to submit enquiry' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const enquiries = await prisma.enquiry.findMany({
      orderBy: { createdAt: 'desc' },
      include: { package: { select: { title: true } } }
    })
    return NextResponse.json(enquiries)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch enquiries' }, { status: 500 })
  }
}

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

    await prisma.enquiry.delete({
      where: { id }
    })

    return NextResponse.json({ success: true, message: 'Enquiry deleted' })
  } catch (error) {
    console.error('Failed to delete enquiry:', error)
    return NextResponse.json({ error: 'Failed to delete enquiry' }, { status: 500 })
  }
}

