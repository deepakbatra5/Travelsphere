'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const languageOptions = ['Hindi', 'English', 'Punjabi', 'Bengali', 'Tamil', 'Telugu', 'Gujarati', 'Marathi']

type ProfileFormState = {
  name: string
  email: string
  phone: string
  city: string
  state: string
  experience: string
  languages: string[]
  bio: string
  status: string
  rating: number
  totalTours: number
}

export default function ProfileForm({ initialProfile }: { initialProfile: ProfileFormState }) {
  const router = useRouter()
  const [form, setForm] = useState(initialProfile)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const update = (field: keyof ProfileFormState, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const toggleLang = (lang: string) => {
    setForm((prev) => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter((item) => item !== lang)
        : [...prev.languages, lang],
    }))
  }

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')

    const res = await fetch('/api/agents/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        phone: form.phone,
        city: form.city,
        state: form.state,
        experience: form.experience,
        languages: form.languages,
        bio: form.bio,
      }),
    })

    const body = await res.json().catch(() => null)
    setLoading(false)

    if (!res.ok) {
      setError(body?.error || 'Could not update profile')
      return
    }

    setMessage(body?.message || 'Profile updated successfully')
    setEditing(false)
    router.refresh()
  }

  const cancelEdit = () => {
    setForm(initialProfile)
    setEditing(false)
    setError('')
    setMessage('')
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-linear-to-r from-cyan-700 to-cyan-950 p-6 text-white">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200">Agent Profile</p>
            <h1 className="mt-2 text-2xl font-extrabold">{form.name}</h1>
            <p className="mt-1 text-sm text-cyan-100">{form.city}, {form.state}</p>
          </div>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded-full bg-orange-500 px-5 py-2 text-sm font-bold text-white hover:bg-orange-600"
          >
            Edit Profile
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-white/15 p-4">
            <p className="text-xs text-cyan-100">Status</p>
            <p className="mt-1 font-bold">{form.status}</p>
          </div>
          <div className="rounded-2xl bg-white/15 p-4">
            <p className="text-xs text-cyan-100">Total Tours</p>
            <p className="mt-1 font-bold">{form.totalTours}</p>
          </div>
        </div>
      </div>

      <form onSubmit={saveProfile} className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Personal Details</h2>
            <p className="mt-1 text-sm text-slate-500">Update contact, location, languages, and profile bio.</p>
          </div>
          {editing && (
            <button type="button" onClick={cancelEdit} className="text-sm font-bold text-slate-500 hover:text-slate-800">
              Cancel
            </button>
          )}
        </div>

        {message && <div className="mb-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{message}</div>}
        {error && <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Full Name</label>
            <input disabled={!editing} value={form.name} onChange={(event) => update('name', event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm disabled:bg-slate-50 disabled:text-slate-500" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Email Address</label>
            <input disabled value={form.email} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Phone</label>
            <input disabled={!editing} value={form.phone} onChange={(event) => update('phone', event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm disabled:bg-slate-50 disabled:text-slate-500" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Experience</label>
            <input disabled={!editing} type="number" min="0" value={form.experience} onChange={(event) => update('experience', event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm disabled:bg-slate-50 disabled:text-slate-500" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">City</label>
            <input disabled={!editing} value={form.city} onChange={(event) => update('city', event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm disabled:bg-slate-50 disabled:text-slate-500" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">State</label>
            <input disabled={!editing} value={form.state} onChange={(event) => update('state', event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm disabled:bg-slate-50 disabled:text-slate-500" />
          </div>
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-sm font-semibold text-slate-700">Languages Spoken</label>
          <div className="flex flex-wrap gap-2">
            {languageOptions.map((lang) => (
              <button
                key={lang}
                type="button"
                disabled={!editing}
                onClick={() => toggleLang(lang)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold disabled:cursor-default ${
                  form.languages.includes(lang) ? 'border-orange-500 bg-orange-500 text-white' : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <label className="mb-1 block text-sm font-semibold text-slate-700">About You</label>
          <textarea disabled={!editing} rows={5} value={form.bio} onChange={(event) => update('bio', event.target.value)} className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm disabled:bg-slate-50 disabled:text-slate-500" />
        </div>

        {editing && (
          <div className="mt-6 flex justify-end">
            <button type="submit" disabled={loading} className="rounded-2xl bg-orange-500 px-6 py-3 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-60">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </form>
    </div>
  )
}


