import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/db'
import { Prisma, Category } from '@/generated/prisma/client'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

interface CreatePackageBody {
  title: string
  destination: string
  description: string
  price: string | number
  duration: string | number
  category: Category
  images?: string[]
  itinerary?: Prisma.InputJsonValue
  inclusions?: string[]
  exclusions?: string[]
}

const itineraryDaySchema = z.object({
  day: z.number().int().positive(),
  title: z.string().trim().min(1).max(140),
  description: z.string().trim().min(1).max(3000),
})

const packagePayloadSchema = z.object({
  title: z.string().trim().min(3).max(160),
  destination: z.string().trim().min(2).max(180),
  description: z.string().trim().min(20).max(10000),
  price: z.coerce.number().positive().max(10000000),
  duration: z.coerce.number().int().min(1).max(365),
  category: z.preprocess((value) => value === 'HONEYMOON' ? 'SOLO' : value, z.nativeEnum(Category)),
  images: z.array(z.string().url()).max(20).optional().default([]),
  itinerary: z.array(itineraryDaySchema).max(60).optional().default([]),
  inclusions: z.array(z.string().trim().min(1).max(240)).max(100).optional().default([]),
  exclusions: z.array(z.string().trim().min(1).max(240)).max(100).optional().default([]),
})

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const where: Prisma.PackageWhereInput = { isActive: true }

    const normalizedCategory = category === 'HONEYMOON' ? 'SOLO' : category

    if (normalizedCategory && normalizedCategory !== 'ALL' && normalizedCategory in Category) {
      where.category = normalizedCategory as Category
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { destination: { contains: search, mode: 'insensitive' } },
      ]
    }

    const packages = await prisma.package.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(packages, {
      headers: {
        'Cache-Control': 'no-store',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const body = (await req.json()) as CreatePackageBody
    const parsed = packagePayloadSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid package payload' }, { status: 400 })
    }

    const { title, destination, description, price, duration, category, images, itinerary, inclusions, exclusions } = parsed.data

    const slugify = (await import('slugify')).default
    const slug = slugify(title, { lower: true, strict: true })

    const pkg = await prisma.package.create({
      data: {
        title, slug, destination, description,
        price,
        duration,
        category,
        images,
        itinerary: itinerary as Prisma.InputJsonValue,
        inclusions,
        exclusions,
      }
    })

    revalidatePath('/')
    revalidatePath('/packages')
    revalidatePath('/admin')
    revalidatePath('/admin/packages')

    return NextResponse.json(pkg, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create package' }, { status: 500 })
  }
}
