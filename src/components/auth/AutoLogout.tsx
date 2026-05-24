'use client'

import { useEffect, useRef } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { clearAuthSession } from '@/lib/browser-session'

const INACTIVITY_TIMEOUT = 15 * 60 * 1000 // 15 minutes

export default function AutoLogout() {
  const { status } = useSession()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleLogout = async () => {
    if (status === 'authenticated') {
      clearAuthSession()
      await signOut({ redirect: true })
    }
  }

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    if (status === 'authenticated') {
      timeoutRef.current = setTimeout(handleLogout, INACTIVITY_TIMEOUT)
    }
  }

  useEffect(() => {
    if (status !== 'authenticated') return

    resetTimeout()

    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart']
    let lastReset = Date.now()
    const throttleDelay = 1000 // 1 second

    const handleActivity = () => {
      const now = Date.now()
      if (now - lastReset > throttleDelay) {
        lastReset = now
        resetTimeout()
      }
    }

    events.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true })
    })

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      events.forEach(event => {
        window.removeEventListener(event, handleActivity)
      })
    }
  }, [status])

  return null
}
