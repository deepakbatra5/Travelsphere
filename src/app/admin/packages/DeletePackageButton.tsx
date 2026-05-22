'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import AdminToast, { AdminToastMessage } from '@/components/ui/AdminToast'

export default function DeletePackageButton({ id }: { id: string }) {
  const router = useRouter()
  const [toast, setToast] = useState<AdminToastMessage | null>(null)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this package?')) return

    const res = await fetch(`/api/packages/${id}`, { method: 'DELETE' })

    if (!res.ok) {
      const data = await res.json().catch(() => null)
      setToast({ type: 'error', text: data?.error || 'Failed to delete package.' })
      return
    }

    setToast({ type: 'success', text: 'Package deleted successfully.' })
    router.replace('/admin/packages')
    router.refresh()
  }

  return (
    <>
      <AdminToast toast={toast} onClose={() => setToast(null)} />
      <button onClick={handleDelete} className="text-red-500 hover:underline text-xs font-medium" type="button">
        Delete
      </button>
    </>
  )
}
