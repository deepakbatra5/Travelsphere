import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

const profileSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  phone: z.string().trim().min(7, 'Enter a valid phone number'),
  city: z.string().trim().min(2, 'City is required'),
  state: z.string().trim().min(2, 'State is required'),
  experience: z.coerce.number().int().min(0, 'Experience cannot be negative').max(60, 'Experience looks too high'),
  languages: z.array(z.string().trim().min(1)).min(1, 'Select at least one language'),
  bio: z.string().trim().max(800, 'Bio must be under 800 characters').optional(),
})

async function getCurrentAgent(email?: string | null) {
  if (!email) return null
  return prisma.user.findUnique({
    where: { email },
    include: { agent: true },
  })
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const user = await getCurrentAgent(session?.user?.email)

    if (!user?.agent) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const parsed = profileSchema.safeParse(await req.json())

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid profile details' }, { status: 400 })
    }

    const data = parsed.data

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          name: data.name,
          phone: data.phone,
        },
      }),
      prisma.agent.update({
        where: { id: user.agent.id },
        data: {
          phone: data.phone,
          city: data.city,
          state: data.state,
          experience: data.experience,
          languages: data.languages,
          bio: data.bio || null,
        },
      }),
    ])

    revalidatePath('/agent')
    revalidatePath('/agent/profile')
    revalidatePath('/admin/agents')

    return NextResponse.json({ message: 'Profile updated successfully' })
  } catch {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
