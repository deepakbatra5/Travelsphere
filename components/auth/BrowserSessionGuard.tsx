'use client'

import { useEffect, useRef } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { clearAuthSession, hasActiveAuthSession } from '@/lib/browser-session'

export default function BrowserSessionGuard() {
  const { status } = useSession()
  const router = useRouter()
  const signingOut = useRef(false)

  useEffect(() => {
    if (status !== 'authenticated' || signingOut.current) return
    if (hasActiveAuthSession()) return

    signingOut.current = true
    clearAuthSession()
    signOut({ redirect: false }).finally(() => {
      router.refresh()
      signingOut.current = false
    })
  }, [router, status])

  return null
}
