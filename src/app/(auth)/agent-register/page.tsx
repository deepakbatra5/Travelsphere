'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AgentRegisterPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/agent-login?tab=register')
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center space-y-3">
        <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto" />
        <p className="text-sm font-semibold text-slate-600">Redirecting to Agent Registration Portal...</p>
      </div>
    </div>
  )
}
