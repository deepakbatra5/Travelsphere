import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

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
