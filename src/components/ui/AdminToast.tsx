'use client'

import { useEffect } from 'react'

export interface AdminToastMessage {
  type: 'success' | 'error'
  text: string
}

interface AdminToastProps {
  toast: AdminToastMessage | null
  onClose: () => void
}

export default function AdminToast({ toast, onClose }: AdminToastProps) {
  useEffect(() => {
    if (!toast) return

    const timer = setTimeout(() => {
      onClose()
    }, 3200)

    return () => clearTimeout(timer)
  }, [toast, onClose])

  if (!toast) return null

  return (
    <div className="fixed right-4 top-4 z-100">
      <div
        className={`min-w-64 max-w-sm rounded-xl border px-4 py-3 text-sm shadow-xl backdrop-blur ${
          toast.type === 'success'
            ? 'border-green-200 bg-green-50 text-green-700'
            : 'border-red-200 bg-red-50 text-red-700'
        }`}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-start justify-between gap-3">
          <p className="font-medium">{toast.text}</p>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded px-1 text-xs opacity-70 hover:opacity-100"
            aria-label="Dismiss"
          >
            x
          </button>
        </div>
      </div>
    </div>
  )
}
