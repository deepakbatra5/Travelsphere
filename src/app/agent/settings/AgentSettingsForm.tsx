'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowPathIcon, ClockIcon, ExclamationTriangleIcon, LockClosedIcon, TrashIcon } from '@heroicons/react/24/outline'

type DeletionRequest = {
  requestedAt: string
  reason: string | null
} | null

export default function AgentSettingsForm({
  initialStatus,
  deletionRequest: initialDeletionRequest,
}: {
  initialStatus: string
  deletionRequest: DeletionRequest
}) {
  const router = useRouter()
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    error: '',
    success: '',
    submitting: false,
  })
  const [deleteForm, setDeleteForm] = useState({
    currentPassword: '',
    reason: '',
    error: '',
    success: '',
    submitting: false,
  })
  const [deletionRequest, setDeletionRequest] = useState(initialDeletionRequest)

  const statusLabel = useMemo(() => initialStatus.replaceAll('_', ' '), [initialStatus])

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordForm((prev) => ({ ...prev, error: 'Passwords do not match' }))
      return
    }

    setPasswordForm((prev) => ({ ...prev, submitting: true, error: '', success: '' }))

    try {
      const response = await fetch('/api/agent/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'change-password',
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to change password')

      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        error: '',
        success: data.message || 'Password updated successfully!',
        submitting: false,
      })
      router.refresh()
    } catch (error: any) {
      setPasswordForm((prev) => ({ ...prev, error: error.message || 'Error occurred', submitting: false }))
    }
  }

  const handleDeleteRequest = async (e: React.FormEvent) => {
    e.preventDefault()

    setDeleteForm((prev) => ({ ...prev, submitting: true, error: '', success: '' }))

    try {
      const response = await fetch('/api/agent/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'request-delete-account',
          currentPassword: deleteForm.currentPassword,
          reason: deleteForm.reason,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed to submit deletion request')

      setDeletionRequest({
        requestedAt: new Date().toISOString(),
        reason: deleteForm.reason.trim() || null,
      })
      setDeleteForm({
        currentPassword: '',
        reason: '',
        error: '',
        success: data.message || 'Deletion request submitted.',
        submitting: false,
      })
      router.refresh()
    } catch (error: any) {
      setDeleteForm((prev) => ({ ...prev, error: error.message || 'Error occurred', submitting: false }))
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <LockClosedIcon className="h-5 w-5 text-slate-500" />
            Reset Password
          </h2>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
            Account status: {statusLabel}
          </span>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <div>
            <label className="text-xs font-bold uppercase text-slate-500">Current Password</label>
            <input
              type="password"
              required
              value={passwordForm.currentPassword}
              onChange={(event) => setPasswordForm((prev) => ({ ...prev, currentPassword: event.target.value }))}
              placeholder="••••••••"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-500">New Password</label>
            <input
              type="password"
              required
              value={passwordForm.newPassword}
              onChange={(event) => setPasswordForm((prev) => ({ ...prev, newPassword: event.target.value }))}
              placeholder="••••••••"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-500">Confirm New Password</label>
            <input
              type="password"
              required
              value={passwordForm.confirmPassword}
              onChange={(event) => setPasswordForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
              placeholder="••••••••"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 focus:border-orange-500 focus:outline-none"
            />
          </div>

          {passwordForm.error && <p className="text-xs font-semibold text-rose-600">{passwordForm.error}</p>}
          {passwordForm.success && <p className="text-xs font-semibold text-emerald-600">{passwordForm.success}</p>}

          <button
            type="submit"
            disabled={passwordForm.submitting}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-slate-700"
          >
            {passwordForm.submitting ? <ArrowPathIcon className="h-4 w-4 animate-spin" /> : 'Reset Password'}
          </button>
        </form>
      </div>

      <div className="rounded-3xl border border-rose-100 bg-rose-50/40 p-6 shadow-sm">
        <h2 className="mb-2 flex items-center gap-2 text-lg font-bold text-rose-900">
          <TrashIcon className="h-5 w-5 text-rose-600" />
          Request Account Deletion
        </h2>
        <p className="mb-4 max-w-2xl text-sm leading-relaxed text-rose-700/80">
          This does not delete your account immediately. Admin must approve the request first. Once approved, your agent account, bookings, reviews, and related records are permanently removed.
        </p>

        {deletionRequest ? (
          <div className="max-w-2xl rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <div className="flex items-center gap-2 font-semibold">
              <ClockIcon className="h-4 w-4" />
              Deletion request pending admin review
            </div>
            <p className="mt-2 text-amber-800/90">
              Requested on {new Date(deletionRequest.requestedAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
              {deletionRequest.reason ? ` · Reason: ${deletionRequest.reason}` : ''}
            </p>
          </div>
        ) : (
          <form onSubmit={handleDeleteRequest} className="space-y-4 max-w-md">
            <div>
              <label className="text-xs font-bold uppercase text-rose-900">Confirm Password</label>
              <input
                type="password"
                required
                value={deleteForm.currentPassword}
                onChange={(event) => setDeleteForm((prev) => ({ ...prev, currentPassword: event.target.value }))}
                placeholder="Enter your current password"
                className="mt-1 w-full rounded-xl border border-rose-200 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-rose-900">Reason for leaving</label>
              <textarea
                value={deleteForm.reason}
                onChange={(event) => setDeleteForm((prev) => ({ ...prev, reason: event.target.value }))}
                placeholder="Optional feedback for the admin team"
                rows={4}
                className="mt-1 w-full rounded-xl border border-rose-200 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-rose-500 focus:outline-none"
              />
            </div>

            {deleteForm.error && <p className="text-xs font-semibold text-rose-600">{deleteForm.error}</p>}
            {deleteForm.success && <p className="text-xs font-semibold text-emerald-600">{deleteForm.success}</p>}

            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                disabled={deleteForm.submitting}
                className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-rose-700"
              >
                {deleteForm.submitting ? <ArrowPathIcon className="h-4 w-4 animate-spin" /> : 'Request Deletion'}
              </button>
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-rose-700 ring-1 ring-rose-200">
                <ExclamationTriangleIcon className="h-4 w-4" />
                Permanent after admin approval
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}