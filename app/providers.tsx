'use client'

import { SessionProvider } from 'next-auth/react'
import BrowserSessionGuard from '@/components/auth/BrowserSessionGuard'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <BrowserSessionGuard />
      {children}
    </SessionProvider>
  )
}
