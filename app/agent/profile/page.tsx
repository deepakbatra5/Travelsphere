import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import ProfileForm from './ProfileForm'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AgentProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect('/agent-login?callbackUrl=/agent/profile')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { agent: true },
  }).catch(() => null)

  if (!user) redirect('/agent-register')
  if (!user.agent) redirect('/agent-register')
  if (user.agent.status === 'PENDING') redirect('/agent/pending')
  if (user.agent.status === 'SUSPENDED') redirect('/')

  return (
    <ProfileForm
      initialProfile={{
        name: user.name,
        email: user.email,
        phone: user.phone || user.agent.phone,
        city: user.agent.city,
        state: user.agent.state,
        experience: String(user.agent.experience),
        languages: user.agent.languages,
        bio: user.agent.bio || '',
        status: user.agent.status,
        rating: user.agent.rating,
        totalTours: user.agent.totalTours,
      }}
    />
  )
}
