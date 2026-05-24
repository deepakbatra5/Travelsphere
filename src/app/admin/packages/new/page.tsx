'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import AdminToast, { AdminToastMessage } from '@/components/ui/AdminToast'

const categories = ['FAMILY', 'SOLO', 'GROUP', 'PILGRIMAGE', 'ADVENTURE', 'COUPLE', 'CORPORATE']

interface ItineraryDay {
  day: number
  title: string
  description: string
}

interface TripDateForm {
  startDate: string
  totalSeats: string
  availableSeats: string
}

interface Agent {
  id: string
  user: { name: string; email: string }
}

export default function AddPackagePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [toast, setToast] = useState<AdminToastMessage | null>(null)
  const [agents, setAgents] = useState<Agent[]>([])
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>([])
  const [tripDates, setTripDates] = useState<TripDateForm[]>([{ startDate: '', totalSeats: '', availableSeats: '' }])

  const [form, setForm] = useState({
    title: '',
    destination: '',
    description: '',
    price: '',
    duration: '',
    category: 'FAMILY',
    inclusions: '',
    exclusions: '',
    isFeatured: false,
  })

  const [itinerary, setItinerary] = useState<ItineraryDay[]>([{ day: 1, title: '', description: '' }])

  useEffect(() => {
    fetch('/api/admin/agents')
      .then((res) => res.ok ? res.json() : [])
      .then(setAgents)
      .catch(() => setAgents([]))
  }, [])

  const updateField = (field: string, value: string | boolean) => setForm((prev) => ({ ...prev, [field]: value }))

  const updateTripDate = (index: number, field: keyof TripDateForm, value: string) => {
    const updated = [...tripDates]
    updated[index] = { ...updated[index], [field]: value }
    if (field === 'totalSeats' && !updated[index].availableSeats) {
      updated[index].availableSeats = value
    }
    setTripDates(updated)
  }

  const addTripDate = () => setTripDates([...tripDates, { startDate: '', totalSeats: '', availableSeats: '' }])

  const removeTripDate = (index: number) => {
    if (tripDates.length <= 1) return
    setTripDates(tripDates.filter((_, i) => i !== index))
  }

  const toggleAgent = (agentId: string) => {
    setSelectedAgentIds((current) =>
      current.includes(agentId) ? current.filter((id) => id !== agentId) : [...current, agentId]
    )
  }

  const updateItinerary = (index: number, field: keyof ItineraryDay, value: string) => {
    const updated = [...itinerary]
    updated[index] = { ...updated[index], [field]: value }
    setItinerary(updated)
  }

  const addDay = () => setItinerary([...itinerary, { day: itinerary.length + 1, title: '', description: '' }])

  const removeDay = (index: number) => {
    if (itinerary.length <= 1) return
    setItinerary(itinerary.filter((_, i) => i !== index).map((d, i) => ({ ...d, day: i + 1 })))
  }

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
    setLoading(true)

    const res = await fetch('/api/packages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price),
        duration: parseInt(form.duration, 10),
        images: images.filter(Boolean),
        itinerary,
        inclusions: form.inclusions.split('\n').filter(Boolean),
        exclusions: form.exclusions.split('\n').filter(Boolean),
        tripDates: tripDates
          .filter((date) => date.startDate && date.totalSeats)
          .map((date) => ({
            startDate: date.startDate,
            totalSeats: parseInt(date.totalSeats, 10),
            availableSeats: parseInt(date.availableSeats || date.totalSeats, 10),
          })),
        agentIds: selectedAgentIds,
      }),
    })

    setLoading(false)

    if (res.ok) {
      setToast({ type: 'success', text: 'Package created successfully.' })
      router.replace('/admin/packages')
    } else {
      const data = await res.json().catch(() => null)
      setToast({ type: 'error', text: data?.error || 'Failed to create package. Please try again.' })
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <AdminToast toast={toast} onClose={() => setToast(null)} />
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Add New Package</h1>
        <p className="text-gray-500 text-sm mt-1">Fill in all the details for the new tour package</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-gray-700">Basic Information</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Package Title</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="e.g. Golden Triangle Tour"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
            <input
              type="text"
              required
              value={form.destination}
              onChange={(e) => updateField('destination', e.target.value)}
              placeholder="e.g. Delhi - Agra - Jaipur"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Write a detailed description of the package..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs)</label>
              <input
                type="number"
                required
                min="0"
                value={form.price}
                onChange={(e) => updateField('price', e.target.value)}
                placeholder="15000"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Days)</label>
              <input
                type="number"
                required
                min="1"
                value={form.duration}
                onChange={(e) => updateField('duration', e.target.value)}
                placeholder="6"
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
              id="isFeatured"
              checked={form.isFeatured}
              onChange={(e) => updateField('isFeatured', e.target.checked)}
              className="h-4 w-4 accent-orange-500"
            />
            <label htmlFor="isFeatured" className="text-sm text-gray-700">
              Show in Featured Packages on home page
            </label>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-700">Trip Dates and Seats</h2>
            <button type="button" onClick={addTripDate} className="text-orange-500 text-sm font-medium hover:underline">
              Add Date
            </button>
          </div>
          <div className="space-y-3">
            {tripDates.map((tripDate, i) => (
              <div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_120px_140px_auto] gap-3 rounded-xl border border-gray-100 p-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Planned Date</label>
                  <input
                    type="date"
                    value={tripDate.startDate}
                    onChange={(e) => updateTripDate(i, 'startDate', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Seats</label>
                  <input
                    type="number"
                    min="1"
                    value={tripDate.totalSeats}
                    onChange={(e) => updateTripDate(i, 'totalSeats', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Available Seats</label>
                  <input
                    type="number"
                    min="0"
                    value={tripDate.availableSeats}
                    onChange={(e) => updateTripDate(i, 'availableSeats', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeTripDate(i)}
                  disabled={tripDates.length <= 1}
                  className="self-end rounded-xl border border-red-100 px-4 py-3 text-sm font-medium text-red-500 disabled:opacity-40"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-bold text-gray-700 mb-4">Package Agents</h2>
          {agents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {agents.map((agent) => (
                <label key={agent.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-100 p-3 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedAgentIds.includes(agent.id)}
                    onChange={() => toggleAgent(agent.id)}
                    className="h-4 w-4 accent-orange-500"
                  />
                  <span>
                    <span className="block font-semibold text-gray-700">{agent.user.name}</span>
                    <span className="block text-xs text-gray-400">{agent.user.email}</span>
                  </span>
                </label>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No approved agents available yet.</p>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-bold text-gray-700 mb-4">Package Images</h2>
          <label className="block cursor-pointer">
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-orange-400 transition">
              <p className="text-gray-400 text-sm">{uploadingImage ? 'Uploading...' : 'Click to upload an image'}</p>
              <p className="text-gray-300 text-xs mt-1">JPG, PNG up to 5MB</p>
            </div>
            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} className="hidden" />
          </label>

          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-4">
              {images.map((url, i) => (
                <div key={i} className="relative group">
                  <Image src={url} alt={`Image ${i + 1}`} width={240} height={96} className="w-full h-24 object-cover rounded-lg" />
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
            <button type="button" onClick={addDay} className="text-orange-500 text-sm font-medium hover:underline">
              Add Day
            </button>
          </div>
          <div className="space-y-4">
            {itinerary.map((day, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-sm text-gray-700">Day {day.day}</span>
                  {itinerary.length > 1 && (
                    <button type="button" onClick={() => removeDay(i)} className="text-red-400 text-xs hover:underline">
                      Remove
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    required
                    value={day.title}
                    onChange={(e) => updateItinerary(i, 'title', e.target.value)}
                    placeholder="Day title e.g. Arrival in Delhi"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <textarea
                    required
                    rows={2}
                    value={day.description}
                    onChange={(e) => updateItinerary(i, 'description', e.target.value)}
                    placeholder="What happens on this day..."
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
                placeholder="Hotel accommodation&#10;Daily breakfast&#10;All transfers"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exclusions (one per line)</label>
              <textarea
                rows={6}
                value={form.exclusions}
                onChange={(e) => updateField('exclusions', e.target.value)}
                placeholder="Flights&#10;Lunch and dinner&#10;Personal expenses"
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
            {loading ? 'Creating Package...' : 'Create Package'}
          </button>
        </div>
      </form>
    </div>
  )
}


