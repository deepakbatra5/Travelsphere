import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { authOptions } from '@/lib/auth'
import { Category, Prisma } from '@/generated/prisma/client'
import { z } from 'zod'

const itineraryDaySchema = z.object({
  day: z.number().int().positive(),
  title: z.string().trim().min(1).max(140),
  description: z.string().trim().min(1).max(3000),
})

const updatePackagePayloadSchema = z.object({
  title: z.string().trim().min(3).max(160),
  destination: z.string().trim().min(2).max(180),
  description: z.string().trim().min(20).max(10000),
  price: z.coerce.number().positive().max(10000000),
  duration: z.coerce.number().int().min(1).max(365),
  category: z.preprocess((value) => value === 'HONEYMOON' ? 'SOLO' : value, z.nativeEnum(Category)),
  images: z.array(z.string().url()).max(20).optional().default([]).transform((urls) => urls.filter(Boolean)),
  itinerary: z.array(itineraryDaySchema).max(60).optional().default([]),
  inclusions: z.array(z.string().trim().min(1).max(240)).max(100).optional().default([]),
  exclusions: z.array(z.string().trim().min(1).max(240)).max(100).optional().default([]),
  isFeatured: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
  tripDates: z.array(z.object({
    id: z.string().optional(),
    startDate: z.coerce.date(),
    totalSeats: z.coerce.number().int().min(1).max(10000),
    availableSeats: z.coerce.number().int().min(0).max(10000).optional(),
  }).refine((date) => !date.availableSeats || date.availableSeats <= date.totalSeats, {
    message: 'Available seats cannot be greater than total seats',
  })).max(100).optional().default([]),
  agentIds: z.array(z.string().min(1)).max(100).optional().default([]),
})

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const pkg = await prisma.package.findUnique({
      where: { id },
      include: {
        tripDates: { orderBy: { startDate: 'asc' } },
        agentPreferences: { select: { agentId: true } },
      },
    })
    if (!pkg) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(pkg, {
      headers: {
        'Cache-Control': 'no-store',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch package' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { id } = await params
    const body = await req.json()

    const parsed = updatePackagePayloadSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid package payload' }, { status: 400 })
    }

    const payload = parsed.data

    const existingTripDates = await prisma.packageTripDate.findMany({ where: { packageId: id } })
    const incomingIds = payload.tripDates.map((tripDate) => tripDate.id).filter(Boolean) as string[]

    const pkg = await prisma.$transaction(async (tx) => {
      await tx.packageTripDate.deleteMany({
        where: {
          packageId: id,
          id: { notIn: incomingIds.length > 0 ? incomingIds : [''] },
          bookings: { none: {} },
        },
      })

      for (const tripDate of payload.tripDates) {
        const existing = tripDate.id ? existingTripDates.find((date) => date.id === tripDate.id) : null
        const bookedSeats = existing ? existing.totalSeats - existing.availableSeats : 0
        const availableSeats = tripDate.availableSeats ?? Math.max(tripDate.totalSeats - bookedSeats, 0)

        if (tripDate.id) {
          await tx.packageTripDate.update({
            where: { id: tripDate.id },
            data: {
              startDate: tripDate.startDate,
              totalSeats: tripDate.totalSeats,
              availableSeats: Math.min(availableSeats, tripDate.totalSeats),
            },
          })
        } else {
          await tx.packageTripDate.create({
            data: {
              packageId: id,
              startDate: tripDate.startDate,
              totalSeats: tripDate.totalSeats,
              availableSeats: tripDate.availableSeats ?? tripDate.totalSeats,
            },
          })
        }
      }

      await tx.agentTourPreference.deleteMany({ where: { packageId: id } })
      if (payload.agentIds.length > 0) {
        await tx.agentTourPreference.createMany({
          data: [...new Set(payload.agentIds)].map((agentId) => ({ packageId: id, agentId })),
          skipDuplicates: true,
        })
      }

      return tx.package.update({
        where: { id },
        data: {
          title: payload.title,
          destination: payload.destination,
          description: payload.description,
          price: payload.price,
          duration: payload.duration,
          category: payload.category,
          images: payload.images,
          itinerary: payload.itinerary as Prisma.InputJsonValue,
          inclusions: payload.inclusions,
          exclusions: payload.exclusions,
          isFeatured: payload.isFeatured,
          isActive: payload.isActive,
        }
      })
    })

    revalidatePath('/')
    revalidatePath('/packages')
    revalidatePath(`/packages/${pkg.slug}`)
    revalidatePath('/admin')
    revalidatePath('/admin/packages')
    revalidatePath(`/admin/packages/${id}/edit`)

    return NextResponse.json(pkg)
  } catch {
    return NextResponse.json({ error: 'Failed to update package' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { id } = await params
    await prisma.package.update({
      where: { id },
      data: { isActive: false }
    })

    revalidatePath('/')
    revalidatePath('/packages')
    revalidatePath('/admin')
    revalidatePath('/admin/packages')

    return NextResponse.json({ message: 'Package deleted' })
  } catch {
    return NextResponse.json({ error: 'Failed to delete package' }, { status: 500 })
  }
}
