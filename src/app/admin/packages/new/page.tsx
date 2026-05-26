'use client'

import { useState } from 'react'
import PackageForm from '@/components/packages/PackageForm'

export default function AddPackagePage() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (payload: any) => {
    setLoading(true)
    const res = await fetch('/api/packages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    setLoading(false)
    return res
  }

  return (
    <PackageForm
      onSubmit={handleSubmit}
      loading={loading}
      submitText="Create Package"
      formTitle="Add New Package"
    />
  )
}
