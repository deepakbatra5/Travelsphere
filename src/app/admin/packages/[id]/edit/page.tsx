'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import PackageForm from '@/components/packages/PackageForm'

export default function EditPackagePage() {
  const params = useParams<{ id: string }>()
  const id = params?.id

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [packageData, setPackageData] = useState<any>(null)

  useEffect(() => {
    if (!id) return

    fetch(`/api/packages/${id}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((pkg) => {
        setPackageData({
          title: pkg.title,
          destination: pkg.destination,
          description: pkg.description,
          price: pkg.price,
          duration: pkg.duration,
          category: pkg.category,
          inclusions: pkg.inclusions,
          exclusions: pkg.exclusions,
          isFeatured: pkg.isFeatured,
          isActive: pkg.isActive,
          images: pkg.images || [],
          tripDates: pkg.tripDates || [],
          agentIds: pkg.agentPreferences?.map((preference: any) => preference.agentId) || [],
          itinerary: pkg.itinerary || [],
        })
        setFetching(false)
      })
      .catch((err) => {
        console.error('Failed to load package:', err)
        setFetching(false)
      })
  }, [id])

  const handleSubmit = async (payload: any) => {
    setLoading(true)
    const res = await fetch(`/api/packages/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    setLoading(false)
    return res
  }

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
        <p className="text-gray-400 text-sm mt-3 font-semibold">Loading package details...</p>
      </div>
    )
  }

  if (!packageData) {
    return (
      <div className="text-center text-gray-500 py-10 font-bold">
        Failed to load package details. Please try again.
      </div>
    )
  }

  return (
    <PackageForm
      initialData={packageData}
      onSubmit={handleSubmit}
      loading={loading}
      submitText="Save Changes"
      formTitle="Edit Package"
    />
  )
}
