'use client'

import { useEffect, useState } from 'react'
import AdminToast, { AdminToastMessage } from '@/components/ui/AdminToast'

interface TeamMember {
  id: string
  name: string
  role: string
  moto: string
  linkedin: string
  imageUrl: string | null
  order: number
}

export default function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [toast, setToast] = useState<AdminToastMessage | null>(null)

  // Edit / Add Form State
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form, setForm] = useState({
    name: '',
    role: '',
    moto: '',
    linkedin: '',
    imageUrl: '',
    order: '0'
  })

  // Load team members from database
  const loadMembers = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/team')
      if (res.ok) {
        const data = await res.json()
        setMembers(data)
      } else {
        setToast({ type: 'error', text: 'Failed to fetch team members.' })
      }
    } catch (err) {
      console.error(err)
      setToast({ type: 'error', text: 'Network error fetching team members.' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMembers()
  }, [])

  const openAddModal = () => {
    setEditingMember(null)
    setForm({
      name: '',
      role: '',
      moto: '',
      linkedin: '',
      imageUrl: '',
      order: String(members.length + 1)
    })
    setIsModalOpen(true)
  }

  const openEditModal = (member: TeamMember) => {
    setEditingMember(member)
    setForm({
      name: member.name,
      role: member.role,
      moto: member.moto,
      linkedin: member.linkedin,
      imageUrl: member.imageUrl || '',
      order: String(member.order)
    })
    setIsModalOpen(true)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const maxSizeInBytes = 5 * 1024 * 1024
    if (file.size > maxSizeInBytes) {
      setToast({ type: 'error', text: 'Image exceeds 5MB limit.' })
      return
    }

    if (!file.type.startsWith('image/')) {
      setToast({ type: 'error', text: 'Please select a valid image file.' })
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()

      if (!res.ok) {
        setToast({ type: 'error', text: data.error || 'Upload failed.' })
        return
      }

      if (data.url) {
        setForm(prev => ({ ...prev, imageUrl: data.url }))
        setToast({ type: 'success', text: 'Profile picture uploaded successfully.' })
      }
    } catch (err) {
      console.error(err)
      setToast({ type: 'error', text: 'Upload failed due to a network error.' })
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this team member?')) return

    try {
      const res = await fetch(`/api/team?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setToast({ type: 'success', text: 'Team member removed successfully.' })
        loadMembers()
      } else {
        const data = await res.json()
        setToast({ type: 'error', text: data.error || 'Failed to delete.' })
      }
    } catch (err) {
      console.error(err)
      setToast({ type: 'error', text: 'Network error deleting team member.' })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const payload = {
        id: editingMember?.id || undefined,
        name: form.name,
        role: form.role,
        moto: form.moto,
        linkedin: form.linkedin,
        imageUrl: form.imageUrl || null,
        order: parseInt(form.order, 10) || 0
      }

      const res = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        setToast({
          type: 'success',
          text: editingMember ? 'Team member updated successfully.' : 'Team member added successfully.'
        })
        setIsModalOpen(false)
        loadMembers()
      } else {
        const data = await res.json()
        setToast({ type: 'error', text: data.error || 'Failed to save team member.' })
      }
    } catch (err) {
      console.error(err)
      setToast({ type: 'error', text: 'Network error saving team member.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <AdminToast toast={toast} onClose={() => setToast(null)} />
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manage Team Members</h1>
          <p className="text-gray-500 text-sm mt-1">Add, update, or remove leadership profiles displayed on the About Us page.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition shadow-sm"
        >
          Add Team Member
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-xs border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-semibold">Order</th>
                  <th className="px-6 py-4 font-semibold">Photo</th>
                  <th className="px-6 py-4 font-semibold">Name</th>
                  <th className="px-6 py-4 font-semibold">Role</th>
                  <th className="px-6 py-4 font-semibold">Motto / Bio</th>
                  <th className="px-6 py-4 font-semibold">LinkedIn</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-gray-700">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-400">{member.order}</td>
                    <td className="px-6 py-4">
                      <div className="relative h-12 w-12 rounded-full overflow-hidden border border-gray-200 bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                        {member.imageUrl ? (
                          <img src={member.imageUrl} alt={member.name} className="h-full w-full object-cover" />
                        ) : (
                          member.name.split(' ').map(n => n[0]).join('')
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{member.name}</td>
                    <td className="px-6 py-4 text-orange-600 font-medium">{member.role}</td>
                    <td className="px-6 py-4 max-w-xs truncate text-gray-500 italic">"{member.moto}"</td>
                    <td className="px-6 py-4">
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline inline-flex items-center gap-1 font-medium"
                      >
                        Profile
                      </a>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button
                        onClick={() => openEditModal(member)}
                        className="text-orange-500 hover:text-orange-600 font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="text-red-500 hover:text-red-600 font-semibold"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
                {members.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-gray-400">
                      No team members found. Click "Add Team Member" to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl relative border border-gray-100 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {editingMember ? 'Edit Team Member' : 'Add Team Member'}
            </h2>
            <p className="text-gray-500 text-xs mb-6">Enter the leadership details below. Changes reflect instantly on the About Us page.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="e.g. Deepak Kumar"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Role / Designation</label>
                <input
                  type="text"
                  required
                  value={form.role}
                  onChange={e => setForm(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="e.g. Founder & CEO"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">LinkedIn Profile Link</label>
                <input
                  type="url"
                  required
                  value={form.linkedin}
                  onChange={e => setForm(prev => ({ ...prev, linkedin: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="https://www.linkedin.com/in/..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Corporate Motto / Personal Quote</label>
                <textarea
                  required
                  rows={3}
                  value={form.moto}
                  onChange={e => setForm(prev => ({ ...prev, moto: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
                  placeholder="e.g. To inspire every Indian to explore the world with absolute trust..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Display Order Weight</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={form.order}
                    onChange={e => setForm(prev => ({ ...prev, order: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="e.g. 1"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Profile Photo</label>
                  <label className="block">
                    <span className="w-full flex items-center justify-center border border-dashed border-gray-300 rounded-xl px-4 py-2.5 text-xs text-gray-500 font-semibold cursor-pointer hover:bg-gray-50 transition-colors">
                      {uploading ? 'Uploading...' : 'Choose File'}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {form.imageUrl && (
                <div className="mt-2 flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-150">
                  <img src={form.imageUrl} alt="Preview" className="h-10 w-10 rounded-full object-cover border border-gray-200" />
                  <span className="text-xs text-gray-500 font-medium truncate grow">{form.imageUrl}</span>
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, imageUrl: '' }))}
                    className="text-xs font-bold text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 border border-gray-300 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="flex-1 bg-orange-500 text-white font-semibold py-2.5 rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50 text-sm"
                >
                  {saving ? 'Saving...' : 'Save Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
