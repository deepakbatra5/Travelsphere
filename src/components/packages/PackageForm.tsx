'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  CheckIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  PhotoIcon,
  MapIcon,
  ClipboardDocumentCheckIcon,
  PlusIcon,
  TrashIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/solid'
import AdminToast, { AdminToastMessage } from '@/components/ui/AdminToast'

const categories = ['FAMILY', 'SOLO', 'GROUP', 'PILGRIMAGE', 'ADVENTURE', 'COUPLE', 'CORPORATE']

interface ItineraryDay {
  day: number
  title: string
  description: string
}

interface TripDateForm {
  id?: string
  startDate: string
  totalSeats: string
  availableSeats: string
}

interface Agent {
  id: string
  user: { name: string; email: string }
}

interface PackageFormProps {
  initialData?: {
    id?: string
    title: string
    destination: string
    description: string
    price: number
    duration: number
    category: string
    inclusions: string[]
    exclusions: string[]
    isFeatured: boolean
    isActive?: boolean
    images: string[]
    tripDates?: Array<{ id: string; startDate: string; totalSeats: number; availableSeats: number }>
    agentIds?: string[]
  }
  onSubmit: (formData: any) => Promise<Response>
  loading: boolean
  submitText: string
  formTitle: string
}

export default function PackageForm({
  initialData,
  onSubmit,
  loading: submitting,
  submitText,
  formTitle,
}: PackageFormProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [toast, setToast] = useState<AdminToastMessage | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [images, setImages] = useState<string[]>(initialData?.images || [])
  const [agents, setAgents] = useState<Agent[]>([])
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>(initialData?.agentIds || [])
  
  const [tripDates, setTripDates] = useState<TripDateForm[]>(
    initialData?.tripDates?.length
      ? initialData.tripDates.map((td) => ({
          id: td.id,
          startDate: new Date(td.startDate).toISOString().split('T')[0],
          totalSeats: String(td.totalSeats),
          availableSeats: String(td.availableSeats),
        }))
      : [{ startDate: '', totalSeats: '', availableSeats: '' }]
  )

  const [form, setForm] = useState({
    title: initialData?.title || '',
    destination: initialData?.destination || '',
    description: initialData?.description || '',
    price: initialData?.price ? String(initialData.price) : '',
    duration: initialData?.duration ? String(initialData.duration) : '',
    category: initialData?.category || 'FAMILY',
    inclusions: initialData?.inclusions?.join('\n') || '',
    exclusions: initialData?.exclusions?.join('\n') || '',
    isFeatured: initialData?.isFeatured || false,
    isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
  })

  const [itinerary, setItinerary] = useState<ItineraryDay[]>(
    initialData?.tripDates // wait, check if initialData has itinerary
      ? (initialData as any).itinerary || [{ day: 1, title: '', description: '' }]
      : [{ day: 1, title: '', description: '' }]
  )

  // Fetch approved agents
  useEffect(() => {
    fetch('/api/admin/agents')
      .then((res) => (res.ok ? res.json() : []))
      .then(setAgents)
      .catch(() => setAgents([]))
  }, [])

  const updateField = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  // Trip Dates Actions
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

  // Itinerary Actions
  const updateItinerary = (index: number, field: keyof ItineraryDay, value: string) => {
    const updated = [...itinerary]
    updated[index] = { ...updated[index], [field]: value } as any
    setItinerary(updated)
  }
  const addDay = () => setItinerary([...itinerary, { day: itinerary.length + 1, title: '', description: '' }])
  const removeDay = (index: number) => {
    if (itinerary.length <= 1) return
    setItinerary(itinerary.filter((_, i) => i !== index).map((d, i) => ({ ...d, day: i + 1 })))
  }

  // Toggle agent preferred
  const toggleAgent = (agentId: string) => {
    setSelectedAgentIds((current) =>
      current.includes(agentId) ? current.filter((id) => id !== agentId) : [...current, agentId]
    )
  }

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const maxSizeInBytes = 5 * 1024 * 1024
    if (file.size > maxSizeInBytes) {
      setToast({ type: 'error', text: 'Image exceeds 5MB limit. Please choose a smaller image.' })
      e.target.value = ''
      return
    }

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
      setToast({ type: 'error', text: 'Network error. Please try again.' })
    } finally {
      setUploadingImage(false)
      e.target.value = ''
    }
  }

  // Handle Next step and validate
  const nextStep = () => {
    // Validate current step
    if (currentStep === 1) {
      if (!form.title.trim() || !form.destination.trim() || !form.price || !form.duration) {
        setToast({ type: 'error', text: 'Please fill in all required basic information fields.' })
        return
      }
      if (parseFloat(form.price) < 0 || parseInt(form.duration, 10) <= 0) {
        setToast({ type: 'error', text: 'Please enter valid numbers for Price and Duration.' })
        return
      }
    }

    if (currentStep === 2) {
      const filledDates = tripDates.filter((d) => d.startDate || d.totalSeats)
      for (const d of filledDates) {
        if (!d.startDate || !d.totalSeats) {
          setToast({ type: 'error', text: 'Ensure completed dates have both planned date and total seats.' })
          return
        }
      }
    }

    if (currentStep === 4) {
      for (const day of itinerary) {
        if (!day.title.trim() || !day.description.trim()) {
          setToast({ type: 'error', text: 'Ensure all itinerary days have both title and description.' })
          return
        }
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, 6))
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Package format mapping
    const payload = {
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
          id: date.id,
          startDate: date.startDate,
          totalSeats: parseInt(date.totalSeats, 10),
          availableSeats: parseInt(date.availableSeats || date.totalSeats, 10),
        })),
      agentIds: selectedAgentIds,
    }

    try {
      const res = await onSubmit(payload)
      if (res.ok) {
        setToast({ type: 'success', text: `${formTitle} saved successfully.` })
        router.replace('/admin/packages')
      } else {
        const data = await res.json().catch(() => null)
        setToast({ type: 'error', text: data?.error || 'Failed to submit package.' })
      }
    } catch {
      setToast({ type: 'error', text: 'Network error. Failed to save package.' })
    }
  }

  const stepItems = [
    { num: 1, label: 'Basic Info', Icon: ClipboardDocumentCheckIcon },
    { num: 2, label: 'Schedule', Icon: CalendarDaysIcon },
    { num: 3, label: 'Media & Agents', Icon: PhotoIcon },
    { num: 4, label: 'Itinerary', Icon: MapIcon },
    { num: 5, label: 'Details', Icon: UserGroupIcon },
    { num: 6, label: 'Review', Icon: CheckIcon },
  ]

  // Form Validations Checks for final review
  const reviewChecklist = useMemo(() => {
    return {
      title: !!form.title.trim(),
      destination: !!form.destination.trim(),
      price: parseFloat(form.price) > 0,
      duration: parseInt(form.duration, 10) > 0,
      images: images.length > 0,
      dates: tripDates.some((td) => td.startDate && td.totalSeats),
      itinerary: itinerary.length > 0 && itinerary.every((day) => day.title.trim() && day.description.trim()),
      details: !!form.inclusions.trim(),
    }
  }, [form, images, tripDates, itinerary])

  return (
    <div className="space-y-6 max-w-4xl">
      <AdminToast toast={toast} onClose={() => setToast(null)} />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{formTitle}</h1>
        <p className="text-gray-500 text-sm mt-1">Create a comprehensive, structured tour itinerary</p>
      </div>

      {/* Wizard Progress Stepper */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
        <div className="relative flex justify-between items-center max-w-3xl mx-auto">
          {/* Stepper progress line */}
          <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
          <div
            className="absolute left-0 top-1/2 h-0.5 bg-orange-500 -translate-y-1/2 z-0 transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (stepItems.length - 1)) * 100}%` }}
          />

          {stepItems.map((item) => {
            const isCompleted = currentStep > item.num
            const isActive = currentStep === item.num
            const StepIcon = item.Icon

            return (
              <button
                key={item.num}
                type="button"
                onClick={() => {
                  if (item.num < currentStep) setCurrentStep(item.num)
                }}
                disabled={item.num > currentStep}
                className="relative z-10 flex flex-col items-center group cursor-pointer focus:outline-none disabled:cursor-not-allowed"
              >
                <div
                  className={`h-10 w-10 rounded-full border flex items-center justify-center font-bold text-sm shadow-sm transition-all duration-300 ${
                    isCompleted
                      ? 'bg-orange-500 border-orange-500 text-white scale-100'
                      : isActive
                      ? 'bg-slate-900 border-slate-900 text-white scale-110 ring-4 ring-orange-500/20'
                      : 'bg-white border-slate-200 text-slate-400'
                  }`}
                >
                  {isCompleted ? <CheckIcon className="h-5 w-5" /> : item.num}
                </div>
                <span
                  className={`absolute top-12 text-[10px] sm:text-xs font-bold whitespace-nowrap mt-1 select-none transition-colors ${
                    isActive ? 'text-slate-900' : isCompleted ? 'text-orange-500' : 'text-slate-400'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Steps Content wrapper */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm min-h-[380px] flex flex-col justify-between">
        <div className="animate-fade-up">
          {/* STEP 1: BASIC INFORMATION */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">
                  1. Basic Information
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Package Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    placeholder="e.g. Kashmir Delight Retreat"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-orange-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Destination *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.destination}
                    onChange={(e) => updateField('destination', e.target.value)}
                    placeholder="e.g. Srinagar - Gulmarg - Pahalgam"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-orange-400 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Tour Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Provide an overview of what makes this tour special..."
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-orange-400 transition resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Price per Head (Rs) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={form.price}
                    onChange={(e) => updateField('price', e.target.value)}
                    placeholder="e.g. 24999"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-orange-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Duration (Days) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={form.duration}
                    onChange={(e) => updateField('duration', e.target.value)}
                    placeholder="e.g. 6"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-orange-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Category *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => updateField('category', e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-orange-400 transition bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) => updateField('isFeatured', e.target.checked)}
                    className="h-4.5 w-4.5 accent-orange-500 rounded border-slate-300"
                  />
                  <span className="text-sm font-semibold text-slate-700">
                    Feature on Homepage (shows in featured tours section)
                  </span>
                </label>

                {initialData && (
                  <label className="flex items-center gap-3 cursor-pointer mt-1">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => updateField('isActive', e.target.checked)}
                      className="h-4.5 w-4.5 accent-orange-500 rounded border-slate-300"
                    />
                    <span className="text-sm font-semibold text-slate-700">
                      Package is Active (visible to customers)
                    </span>
                  </label>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: TRIP DATES SCHEDULE */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-4">
                <h3 className="text-base font-bold text-slate-800">2. Scheduled Trip Dates</h3>
                <button
                  type="button"
                  onClick={addTripDate}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200 px-3 py-1.5 rounded-full"
                >
                  <PlusIcon className="h-3.5 w-3.5" />
                  Add Date
                </button>
              </div>

              <div className="space-y-3">
                {tripDates.map((tripDate, i) => (
                  <div
                    key={tripDate.id || i}
                    className="grid grid-cols-1 sm:grid-cols-[1fr_120px_140px_auto] gap-4 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 relative group hover:border-slate-200 transition"
                  >
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Planned Start Date
                      </label>
                      <input
                        type="date"
                        value={tripDate.startDate}
                        onChange={(e) => updateTripDate(i, 'startDate', e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:border-orange-400 transition bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Total Seats
                      </label>
                      <input
                        type="number"
                        min="1"
                        placeholder="20"
                        value={tripDate.totalSeats}
                        onChange={(e) => updateTripDate(i, 'totalSeats', e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:border-orange-400 transition bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Available Seats
                      </label>
                      <input
                        type="number"
                        min="0"
                        placeholder="20"
                        value={tripDate.availableSeats}
                        onChange={(e) => updateTripDate(i, 'availableSeats', e.target.value)}
                        className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:border-orange-400 transition bg-white"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeTripDate(i)}
                      disabled={tripDates.length <= 1}
                      className="self-end rounded-xl border border-slate-200 hover:border-red-200 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 px-4 py-2 text-sm font-semibold transition active:scale-95 disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-400 disabled:hover:border-slate-200"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: MEDIA & AGENTS */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Media Upload */}
              <div>
                <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">
                  3. Tour Images & Assignments
                </h3>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Tour Images (Upload at least one)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-5">
                  <label className="block cursor-pointer">
                    <div className="border-2 border-dashed border-slate-200 hover:border-orange-400 rounded-2xl p-6 text-center hover:bg-orange-50/10 transition h-28 flex flex-col justify-center items-center">
                      {uploadingImage ? (
                        <>
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-orange-500 border-t-transparent mb-1" />
                          <p className="text-slate-500 text-xs font-bold">Uploading...</p>
                        </>
                      ) : (
                        <>
                          <PhotoIcon className="h-6 w-6 text-slate-400 mb-1" />
                          <p className="text-slate-600 text-xs font-bold">Upload Image</p>
                          <p className="text-slate-300 text-[10px] font-semibold mt-0.5">JPG, PNG up to 5MB</p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage || uploadingImage}
                      className="hidden"
                    />
                  </label>

                  {/* Thumbnail Previews */}
                  <div className="flex flex-wrap gap-3">
                    {images.map((url, i) => (
                      <div key={i} className="relative group rounded-xl overflow-hidden shadow-sm h-28 w-28 shrink-0">
                        <Image
                          src={url}
                          alt={`Uploaded preview ${i + 1}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                        >
                          <TrashIcon className="h-6 w-6 text-red-400 hover:scale-115 transition-transform" />
                        </button>
                      </div>
                    ))}
                    {images.length === 0 && (
                      <div className="flex h-28 items-center text-slate-400 text-xs italic">
                        No images uploaded yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Agent Assignment */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Assign Local Tour Operators (Agents)
                </label>
                {agents.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
                    {agents.map((agent) => {
                      const isChecked = selectedAgentIds.includes(agent.id)
                      const initials = agent.user.name.split(' ').filter(Boolean).map(w => w[0]).join('').slice(0,2).toUpperCase()
                      return (
                        <label
                          key={agent.id}
                          className={`flex cursor-pointer items-center gap-3.5 rounded-2xl border p-3.5 transition ${
                            isChecked
                              ? 'border-orange-500 bg-orange-50/10 ring-2 ring-orange-500/10'
                              : 'border-slate-100 bg-white hover:border-slate-200'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleAgent(agent.id)}
                            className="h-4.5 w-4.5 accent-orange-500 rounded text-orange-500 border-slate-350"
                          />
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                            {initials}
                          </div>
                          <div>
                            <span className="block font-bold text-slate-800 text-sm leading-tight">
                              {agent.user.name}
                            </span>
                            <span className="block text-[10px] text-slate-400 tracking-wide mt-0.5 truncate max-w-44">
                              {agent.user.email}
                            </span>
                          </div>
                        </label>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-slate-400 text-xs italic">No approved agents available in the system yet.</p>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: DAY-WISE ITINERARY */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-4">
                <h3 className="text-base font-bold text-slate-800">4. Day-wise Itinerary</h3>
                <button
                  type="button"
                  onClick={addDay}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200 px-3 py-1.5 rounded-full"
                >
                  <PlusIcon className="h-3.5 w-3.5" />
                  Add Day
                </button>
              </div>

              <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                {itinerary.map((day, i) => (
                  <div
                    key={i}
                    className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 hover:border-slate-200 transition space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-700 bg-white border border-slate-100 px-2.5 py-0.5 rounded-md">
                        Day {day.day}
                      </span>
                      {itinerary.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeDay(i)}
                          className="text-red-400 hover:text-red-600 text-xs font-bold flex items-center gap-1 bg-white border border-red-100 px-2.5 py-0.5 rounded-md transition"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                    <div className="space-y-3">
                      <input
                        type="text"
                        required
                        value={day.title}
                        onChange={(e) => updateItinerary(i, 'title', e.target.value)}
                        placeholder="Day Headline (e.g. Arrival in Srinagar & Houseboat Cruise)"
                        className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:border-orange-400 transition bg-white"
                      />
                      <textarea
                        required
                        rows={2}
                        value={day.description}
                        onChange={(e) => updateItinerary(i, 'description', e.target.value)}
                        placeholder="Details about activities, transport, stay and meals on this day..."
                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-orange-400 transition bg-white resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: INCLUSIONS & EXCLUSIONS */}
          {currentStep === 5 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">
                  5. Inclusions and Exclusions
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Inclusions (one per line)
                  </label>
                  <textarea
                    rows={8}
                    value={form.inclusions}
                    onChange={(e) => updateField('inclusions', e.target.value)}
                    placeholder="Hotel accommodation 5 nights&#10;Daily breakfast and dinner&#10;Inner Line permits&#10;All transfers by AC Sedan"
                    className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:border-orange-400 transition resize-none leading-relaxed"
                  />
                  <p className="text-[10px] text-slate-400">Lines will be automatically split into individual inclusions list.</p>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                    Exclusions (one per line)
                  </label>
                  <textarea
                    rows={8}
                    value={form.exclusions}
                    onChange={(e) => updateField('exclusions', e.target.value)}
                    placeholder="Flights / Railway fare&#10;Lunch expenses&#10;Personal expenses&#10;Adventure sports tickets"
                    className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:border-orange-400 transition resize-none leading-relaxed"
                  />
                  <p className="text-[10px] text-slate-400">Lines will be automatically split into individual exclusions list.</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: PREVIEW & REVIEW */}
          {currentStep === 6 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">
                  6. Review & Publish
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[2fr_1.5fr] gap-6">
                {/* Visual Preview Card of Tour */}
                <div className="border border-slate-100 rounded-3xl bg-slate-50/50 p-5 space-y-4 shadow-2xs">
                  <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-200">
                    {images[0] ? (
                      <Image
                        src={images[0]}
                        alt="Tour thumbnail"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm font-semibold">
                        No cover image uploaded
                      </div>
                    )}
                    <span className="absolute top-3 left-3 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                      {form.category}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-lg font-black text-slate-900 leading-tight">
                      {form.title || 'Untitled Package'}
                    </h4>
                    <p className="text-slate-500 text-xs font-semibold mt-1">
                      📍 {form.destination || 'Destination not provided'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs pt-3 border-t border-slate-200/50">
                    <div>
                      <span className="text-slate-400 block uppercase tracking-wider text-[10px]">Price</span>
                      <strong className="text-orange-500 text-base font-black">
                        Rs {form.price ? parseFloat(form.price).toLocaleString('en-IN') : '0'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block uppercase tracking-wider text-[10px]">Duration</span>
                      <strong className="text-slate-800 text-base font-black">
                        {form.duration || '0'} Days
                      </strong>
                    </div>
                  </div>

                  <div className="flex gap-4 text-xs font-bold text-slate-500">
                    <span>📅 {tripDates.filter((d) => d.startDate).length} dates scheduled</span>
                    <span>🗺️ {itinerary.length} itinerary days</span>
                    <span>👤 {selectedAgentIds.length} agents assigned</span>
                  </div>
                </div>

                {/* Validation Checklist */}
                <div className="space-y-4">
                  <h4 className="font-bold text-sm text-slate-800">Publish Checklist</h4>

                  <div className="space-y-2">
                    {/* Title & Dest */}
                    <div className="flex items-center gap-2 text-sm font-medium">
                      {reviewChecklist.title && reviewChecklist.destination ? (
                        <span className="text-green-600 font-bold">✓</span>
                      ) : (
                        <span className="text-red-500 font-bold">✗</span>
                      )}
                      <span className={reviewChecklist.title && reviewChecklist.destination ? 'text-slate-600' : 'text-red-500'}>
                        Basic info completed
                      </span>
                    </div>

                    {/* Price & Duration */}
                    <div className="flex items-center gap-2 text-sm font-medium">
                      {reviewChecklist.price && reviewChecklist.duration ? (
                        <span className="text-green-600 font-bold">✓</span>
                      ) : (
                        <span className="text-red-500 font-bold">✗</span>
                      )}
                      <span className={reviewChecklist.price && reviewChecklist.duration ? 'text-slate-600' : 'text-red-500'}>
                        Price & duration are valid
                      </span>
                    </div>

                    {/* Images */}
                    <div className="flex items-center gap-2 text-sm font-medium">
                      {reviewChecklist.images ? (
                        <span className="text-green-600 font-bold">✓</span>
                      ) : (
                        <span className="text-amber-500 font-bold">!</span>
                      )}
                      <span className={reviewChecklist.images ? 'text-slate-600' : 'text-amber-600'}>
                        Upload at least 1 image
                      </span>
                    </div>

                    {/* Scheduled dates */}
                    <div className="flex items-center gap-2 text-sm font-medium">
                      {reviewChecklist.dates ? (
                        <span className="text-green-600 font-bold">✓</span>
                      ) : (
                        <span className="text-amber-500 font-bold">!</span>
                      )}
                      <span className={reviewChecklist.dates ? 'text-slate-600' : 'text-amber-600'}>
                        Scheduled trip dates (highly recommended)
                      </span>
                    </div>

                    {/* Itinerary */}
                    <div className="flex items-center gap-2 text-sm font-medium">
                      {reviewChecklist.itinerary ? (
                        <span className="text-green-600 font-bold">✓</span>
                      ) : (
                        <span className="text-red-500 font-bold">✗</span>
                      )}
                      <span className={reviewChecklist.itinerary ? 'text-slate-600' : 'text-red-500'}>
                        Valid day-wise itinerary
                      </span>
                    </div>

                    {/* Inclusions */}
                    <div className="flex items-center gap-2 text-sm font-medium">
                      {reviewChecklist.details ? (
                        <span className="text-green-600 font-bold">✓</span>
                      ) : (
                        <span className="text-amber-500 font-bold">!</span>
                      )}
                      <span className={reviewChecklist.details ? 'text-slate-600' : 'text-slate-400'}>
                        Inclusions details provided
                      </span>
                    </div>
                  </div>

                  {/* Warning Callout if some details missing */}
                  {(!reviewChecklist.title ||
                    !reviewChecklist.destination ||
                    !reviewChecklist.itinerary ||
                    !reviewChecklist.price ||
                    !reviewChecklist.duration) && (
                    <div className="rounded-2xl bg-red-50 border border-red-100 p-4 text-xs text-red-700 flex items-start gap-2.5">
                      <ExclamationTriangleIcon className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
                      <div>
                        <strong className="font-bold">Required Details Missing</strong>
                        <p className="mt-1">
                          You cannot submit the package until all mandatory basic information and itinerary days are completed.
                        </p>
                      </div>
                    </div>
                  )}

                  {reviewChecklist.title &&
                    reviewChecklist.destination &&
                    reviewChecklist.itinerary &&
                    reviewChecklist.price &&
                    reviewChecklist.duration &&
                    (!reviewChecklist.images || !reviewChecklist.dates) && (
                      <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4 text-xs text-amber-800 flex items-start gap-2.5">
                        <ExclamationTriangleIcon className="h-5 w-5 shrink-0 text-amber-500 mt-0.5" />
                        <div>
                          <strong className="font-bold">Recommended details missing</strong>
                          <p className="mt-1">
                            The package can be created, but we recommend adding at least one image and booking start dates so customers can see and book it.
                          </p>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Form controls bar at bottom */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-5 mt-8">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="inline-flex items-center gap-1.5 px-4.5 py-2.5 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white active:scale-95 transition"
          >
            <ChevronLeftIcon className="h-4.5 w-4.5" />
            Back
          </button>

          {currentStep < 6 ? (
            <button
              type="button"
              onClick={nextStep}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:bg-slate-800 active:scale-95 transition"
            >
              Next
              <ChevronRightIcon className="h-4.5 w-4.5" />
            </button>
          ) : (
            <form onSubmit={handleFormSubmit}>
              <button
                type="submit"
                disabled={
                  submitting ||
                  !reviewChecklist.title ||
                  !reviewChecklist.destination ||
                  !reviewChecklist.itinerary ||
                  !reviewChecklist.price ||
                  !reviewChecklist.duration
                }
                className="inline-flex items-center gap-2 px-8 py-3 bg-orange-500 text-white rounded-xl text-xs sm:text-sm font-black shadow-lg hover:bg-orange-650 hover:shadow-orange-200/50 hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:hover:bg-orange-500 disabled:hover:shadow-none transition-all"
              >
                {submitting ? 'Saving...' : submitText}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
