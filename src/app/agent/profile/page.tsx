import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import ProfileForm from './ProfileForm'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AgentProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect('/login?callbackUrl=/profile')

  const user = await prisma.user.findUnique({
    where: { email: session.user.email.toLowerCase() },
    include: { agent: true },
  }).catch((e) => {
    console.error("AgentProfilePage: prisma.user.findUnique failed:", e)
    return null
  })

  if (!user || !user.agent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md rounded-3xl bg-white p-10 text-center shadow-lg">
          <div className="mx-auto w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center p-1.5 shadow-md shadow-red-500/10 mb-4">
            <img src="/logo-transparent.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="mb-3 text-2xl font-extrabold text-slate-900">Profile Not Found</h1>
          <p className="mb-6 leading-relaxed text-slate-600">
            We could not retrieve your agent profile. This might be due to a temporary database connection issue. Please try logging in again.
          </p>
          <a href="/login" className="block w-full rounded-2xl bg-orange-500 py-3 font-bold text-white hover:bg-orange-600">
            Back to Login
          </a>
        </div>
      </div>
    )
  }
      if (user.agent.status === 'PENDING') redirect('/pending')
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
