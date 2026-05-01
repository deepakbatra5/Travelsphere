'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AdminToast, { AdminToastMessage } from '@/components/ui/AdminToast'

const categories = ['FAMILY', 'SOLO', 'GROUP', 'PILGRIMAGE', 'ADVENTURE', 'CORPORATE']

type ItineraryDay = {
  day: number
  title: string
  description: string
}

export default function EditPackagePage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const id = params?.id

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [toast, setToast] = useState<AdminToastMessage | null>(null)

  const [form, setForm] = useState({
    title: '',
    destination: '',
    description: '',
    price: '',
    duration: '',
    category: 'FAMILY',
    inclusions: '',
    exclusions: '',
    isActive: true,
  })

  const [itinerary, setItinerary] = useState<ItineraryDay[]>([{ day: 1, title: '', description: '' }])

  useEffect(() => {
    if (!id) return

    fetch(`/api/packages/${id}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((pkg) => {
        setForm({
          title: pkg.title,
          destination: pkg.destination,
          description: pkg.description,
          price: String(pkg.price),
          duration: String(pkg.duration),
          category: pkg.category,
          inclusions: pkg.inclusions.join('\n'),
          exclusions: pkg.exclusions.join('\n'),
          isActive: pkg.isActive,
        })
        setItinerary(pkg.itinerary || [{ day: 1, title: '', description: '' }])
        setImages(pkg.images || [])
        setFetching(false)
      })
  }, [id])

  const updateField = (field: string, value: string | boolean) => setForm((prev) => ({ ...prev, [field]: value }))

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file size on client side
    const maxSizeInBytes = 5 * 1024 * 1024
    if (file.size > maxSizeInBytes) {
      setToast({ type: 'error', text: 'Image exceeds 5MB limit. Please choose a smaller image.' })
      e.target.value = ''
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setToast({ type: 'error', text: 'Please select a valid image file (JPG, PNG, etc).' })
      e.target.value = ''
      return
    }

    setUploadingImage(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) {
        setToast({ type: 'error', text: data.error || 'Upload failed. Please try again.' })
        e.target.value = ''
        return
      }

      if (data.url) {
        setImages((prev) => [...prev, data.url])
        setToast({ type: 'success', text: 'Image uploaded successfully.' })
      } else {
        setToast({ type: 'error', text: data.error || 'Upload failed.' })
      }
    } catch (err) {
      console.error('Upload error:', err)
      setToast({ type: 'error', text: 'Network error. Please check your connection and try again.' })
    } finally {
      setUploadingImage(false)
      e.target.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return

    setLoading(true)

    const res = await fetch(`/api/packages/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price),
        duration: parseInt(form.duration, 10),
        images,
        itinerary,
        inclusions: form.inclusions.split('\n').filter(Boolean),
        exclusions: form.exclusions.split('\n').filter(Boolean),
      }),
    })

    setLoading(false)
    if (res.ok) {
      setToast({ type: 'success', text: 'Package updated successfully.' })
      router.replace('/admin/packages')
    } else {
      const data = await res.json().catch(() => null)
      setToast({ type: 'error', text: data?.error || 'Failed to update package.' })
    }
  }

  if (fetching) return <div className="text-gray-400 py-10 text-center">Loading package...</div>

  return (
    <div className="max-w-3xl space-y-6">
      <AdminToast toast={toast} onClose={() => setToast(null)} />
      <h1 className="text-2xl font-bold text-gray-800">Edit Package</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-gray-700">Basic Information</h2>

          {['title', 'destination'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field}</label>
              <input
                type="text"
                required
                value={(form as Record<string, string | boolean>)[field] as string}
                onChange={(e) => updateField(field, e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs)</label>
              <input
                type="number"
                required
                value={form.price}
                onChange={(e) => updateField('price', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Days)</label>
              <input
                type="number"
                required
                value={form.duration}
                onChange={(e) => updateField('duration', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => updateField('category', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={form.isActive}
              onChange={(e) => updateField('isActive', e.target.checked)}
              className="w-4 h-4 accent-orange-500"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">
              Package is Active (visible on website)
            </label>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-bold text-gray-700 mb-4">Package Images</h2>
          <label className="block cursor-pointer">
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-orange-400 transition">
              <p className="text-gray-400 text-sm">{uploadingImage ? 'Uploading...' : 'Upload another image'}</p>
              <p className="text-gray-300 text-xs mt-1">JPG, PNG up to 5MB</p>
            </div>
            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} className="hidden" />
          </label>

          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
              {images.map((url, i) => (
                <div key={i} className="relative group">
                  <img src={url} alt={`Image ${i + 1}`} className="w-full h-24 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                    className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-700">Day-wise Itinerary</h2>
            <button
              type="button"
              onClick={() => setItinerary([...itinerary, { day: itinerary.length + 1, title: '', description: '' }])}
              className="text-orange-500 text-sm font-medium hover:underline"
            >
              Add Day
            </button>
          </div>
          <div className="space-y-4">
            {itinerary.map((day, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-4">
                <p className="font-semibold text-sm text-gray-700 mb-3">Day {day.day}</p>
                <div className="space-y-3">
                  <input
                    type="text"
                    required
                    value={day.title}
                    onChange={(e) => {
                      const updated = [...itinerary]
                      updated[i] = { ...updated[i], title: e.target.value }
                      setItinerary(updated)
                    }}
                    placeholder="Day title"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <textarea
                    required
                    rows={2}
                    value={day.description}
                    onChange={(e) => {
                      const updated = [...itinerary]
                      updated[i] = { ...updated[i], description: e.target.value }
                      setItinerary(updated)
                    }}
                    placeholder="Description"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-bold text-gray-700 mb-4">Inclusions and Exclusions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Inclusions (one per line)</label>
              <textarea
                rows={6}
                value={form.inclusions}
                onChange={(e) => updateField('inclusions', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exclusions (one per line)</label>
              <textarea
                rows={6}
                value={form.exclusions}
                onChange={(e) => updateField('exclusions', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
