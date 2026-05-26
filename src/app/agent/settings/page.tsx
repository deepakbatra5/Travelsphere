import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import AgentSettingsForm from './AgentSettingsForm'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AgentSettingsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect('/?callbackUrl=/agent/settings')
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email.toLowerCase() },
    include: {
      agent: true,
      agentDeletionRequest: true,
    },
  }).catch((error) => {
    console.error('AgentSettingsPage: prisma.user.findUnique failed:', error)
    return null
  })

  if (!user || !user.agent) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md rounded-3xl bg-white p-10 text-center shadow-lg">
          <h1 className="mb-3 text-2xl font-extrabold text-slate-900">Agent Profile Not Found</h1>
          <p className="mb-6 leading-relaxed text-slate-600">
            We could not load your agent account settings right now. Please log in again or contact support if the problem continues.
          </p>
          <a href="/login" className="block w-full rounded-2xl bg-orange-500 py-3 font-bold text-white hover:bg-orange-600">
            Back to Login
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Update your password or request permanent deletion of your agent account.
        </p>
      </div>

      <AgentSettingsForm
        initialStatus={user.agent.status}
        deletionRequest={user.agentDeletionRequest ? {
          requestedAt: user.agentDeletionRequest.requestedAt.toISOString(),
          reason: user.agentDeletionRequest.reason,
        } : null}
      />
    </div>
  )
}