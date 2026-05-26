'use client'

import { useState } from 'react'
import {
  PhoneIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  DocumentDuplicateIcon,
  ChevronDownIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'

interface EnquiryCardProps {
  id: string
  name: string
  phone: string
  email: string | null
  message: string
  packageTitle: string | null
  createdAt: Date
  onDelete?: (id: string) => Promise<void>
}

function getMessageSubject(message: string) {
  const match = message.match(/^\[([^\]]+)\]\s*/)
  return match?.[1] || null
}

function getCleanMessage(message: string) {
  return message.replace(/^\[[^\]]+\]\s*/, '')
}

function getWhatsAppNumber(phone: string) {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('91') && digits.length >= 12) return digits
  return `91${digits}`
}

function getReplyMessage(name: string, subject: string | null) {
  const topic = subject ? ` about your ${subject.toLowerCase()}` : ' about your enquiry'
  return `Hi ${name}, Travel Sphere team here${topic}.`
}

function isCustomisedTour(subject: string) {
  return subject === 'Customised Tour Request' || subject === 'Custom Trip Planning'
}

function isCustomerHelp(subject: string) {
  return [
    'Help & Support Request',
    'Tour Package Enquiry',
    'Booking Assistance',
    'Cancellation or Refund',
    'Complaint or Feedback',
  ].includes(subject)
}

// Category colors and styling config
const categoryStyles = {
  customised: {
    border: 'hover:border-orange-200 dark:hover:border-orange-900 border-l-4 border-l-orange-500',
    badge: 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-900/50',
    avatar: 'from-orange-400 to-amber-500 shadow-orange-200/50 dark:shadow-none',
    glow: 'shadow-[0_0_30px_-5px_rgba(249,115,22,0.15)] border-orange-200/60 dark:border-orange-900/50 bg-orange-50/5 dark:bg-orange-950/5',
  },
  'agent-help': {
    border: 'hover:border-cyan-200 dark:hover:border-cyan-900 border-l-4 border-l-cyan-500',
    badge: 'bg-cyan-50 text-cyan-600 border-cyan-100 dark:bg-cyan-950/40 dark:text-cyan-400 dark:border-cyan-900/50',
    avatar: 'from-cyan-400 to-teal-500 shadow-cyan-200/50 dark:shadow-none',
    glow: 'shadow-[0_0_30px_-5px_rgba(6,182,212,0.15)] border-cyan-200/60 dark:border-cyan-900/50 bg-cyan-50/5 dark:bg-cyan-950/5',
  },
  'customer-help': {
    border: 'hover:border-blue-200 dark:hover:border-blue-900 border-l-4 border-l-blue-500',
    badge: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/50',
    avatar: 'from-blue-400 to-indigo-500 shadow-blue-200/50 dark:shadow-none',
    glow: 'shadow-[0_0_30px_-5px_rgba(59,130,246,0.15)] border-blue-200/60 dark:border-blue-900/50 bg-blue-50/5 dark:bg-blue-950/5',
  },
  other: {
    border: 'hover:border-purple-200 dark:hover:border-purple-900 border-l-4 border-l-purple-500',
    badge: 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900/50',
    avatar: 'from-purple-400 to-fuchsia-500 shadow-purple-200/50 dark:shadow-none',
    glow: 'shadow-[0_0_30px_-5px_rgba(168,85,247,0.15)] border-purple-200/60 dark:border-purple-900/50 bg-purple-50/5 dark:bg-purple-950/5',
  },
}

export default function EnquiryCard({
  id,
  name,
  phone,
  email,
  message,
  packageTitle,
  createdAt,
  onDelete,
}: EnquiryCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
  const subject = getMessageSubject(message)
  const cleanMessage = getCleanMessage(message)
  const badgeLabel = subject || packageTitle || 'General Enquiry'
  const replyMessage = getReplyMessage(name, subject)

  // Compute category style matching enquiries page logic
  const categoryKey = isCustomisedTour(subject || '')
    ? 'customised'
    : subject === 'Agent Help & Support Request'
    ? 'agent-help'
    : isCustomerHelp(subject || '')
    ? 'customer-help'
    : 'other'

  const style = categoryStyles[categoryKey]

  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'EQ'

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(fieldName)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowConfirmDelete(true)
  }

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowConfirmDelete(false)
  }

  const handleConfirmDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!onDelete) return
    setIsDeleting(true)
    try {
      await onDelete(id)
    } catch (err) {
      console.error(err)
      setIsDeleting(false)
      setShowConfirmDelete(false)
    }
  }

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-3xl transition-all duration-300 overflow-hidden border ${
        expanded
          ? `${style.glow} scale-[1.01] z-10 ring-1 ring-slate-200/50 dark:ring-slate-800/50`
          : 'border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:scale-[1.005]'
      } ${style.border}`}
    >
      {/* Summary Header */}
      <div
        className="p-5 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/30 flex flex-col sm:flex-row items-start justify-between gap-4 select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start gap-3.5 min-w-0 flex-1">
          {/* Gradients Avatar */}
          <div
            className={`h-11 w-11 rounded-2xl bg-gradient-to-br ${style.avatar} text-white flex items-center justify-center font-black text-sm shadow-md shrink-0`}
          >
            {initials}
          </div>

          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 leading-tight">{name}</h3>
              <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider border shadow-3xs ${style.badge}`}>
                {badgeLabel}
              </span>
            </div>
            <p className="line-clamp-2 text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed italic">
              "{cleanMessage}"
            </p>
          </div>
        </div>

        {/* Date Time Indicator */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start w-full sm:w-auto shrink-0 mt-2 sm:mt-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-50 dark:border-slate-800/50">
          <div className="text-right">
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500">
              {new Date(createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
            <p className="text-[10px] sm:text-xs font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
              {new Date(createdAt).toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
            </p>
          </div>
          <div className="sm:mt-2.5 ml-3 sm:ml-0">
            <ChevronDownIcon
              className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${
                expanded ? 'rotate-180 text-orange-500' : ''
              }`}
            />
          </div>
        </div>
      </div>

      {/* Expanded details panel with smooth sliding transition */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          expanded ? 'max-h-[600px] opacity-100 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40' : 'max-h-0 opacity-0 pointer-events-none'
        }`}
      >
        <div className="p-5 space-y-5">
          {/* Metadata details */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Phone */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 border border-slate-100 dark:border-slate-800 flex items-center justify-between group">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-0.5">
                  Phone
                </span>
                <a
                  href={`tel:${phone}`}
                  className="text-xs font-bold text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 inline-flex items-center gap-1"
                >
                  <PhoneIcon className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                  {phone}
                </a>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  copyToClipboard(phone, 'phone')
                }}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition cursor-pointer"
                title="Copy phone"
              >
                {copiedField === 'phone' ? (
                  <span className="text-[9px] font-black text-green-600 dark:text-green-400 leading-none">Copied!</span>
                ) : (
                  <DocumentDuplicateIcon className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Email */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 border border-slate-100 dark:border-slate-800 flex items-center justify-between group">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-0.5">
                  Email Address
                </span>
                {email ? (
                  <a
                    href={`mailto:${email}`}
                    className="text-xs font-bold text-slate-700 hover:text-orange-500 dark:text-slate-200 dark:hover:text-orange-400 inline-flex items-center gap-1 truncate max-w-44"
                  >
                    <EnvelopeIcon className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                    {email}
                  </a>
                ) : (
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 italic">Not Provided</span>
                )}
              </div>
              {email && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    copyToClipboard(email, 'email')
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition cursor-pointer"
                  title="Copy email"
                >
                  {copiedField === 'email' ? (
                    <span className="text-[9px] font-black text-green-600 dark:text-green-400 leading-none">Copied!</span>
                  ) : (
                    <DocumentDuplicateIcon className="h-4 w-4" />
                  )}
                </button>
              )}
            </div>

            {/* Date time detail */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-0.5">
                Timestamp
              </span>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200 inline-flex items-center gap-1">
                <CalendarDaysIcon className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                {new Date(createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}{' '}
                at{' '}
                {new Date(createdAt).toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
              </p>
            </div>
          </div>

          {/* Full Message Box */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-3xs">
            <div className="flex items-center gap-1.5 mb-2 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              <DocumentTextIcon className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              <span>Full Message</span>
            </div>
            <p className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed bg-slate-50/50 dark:bg-slate-950/20 rounded-xl p-3 border border-slate-50 dark:border-slate-800/40">
              {cleanMessage}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3 pt-1 sm:flex-row items-stretch sm:items-center">
            {/* WhatsApp reply button */}
            <a
              href={`https://wa.me/${getWhatsAppNumber(phone)}?text=${encodeURIComponent(replyMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] py-3 text-xs sm:text-sm font-black text-white transition active:scale-95 shadow-md shadow-green-100 dark:shadow-none cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="h-4.5 w-4.5 fill-white">
                <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L32 503l138.4-36.3c32.7 17.8 69.4 27.2 107.1 27.2 122.4 0 222-99.6 222-222 0-59.3-23-115.1-65-157.1zM223.9 474c-33.1 0-65.6-8.9-93.9-25.7l-8.2-4.9-82.1 21.5 21.9-80-5.3-8.5C38.2 348.6 27.5 310.3 27.5 270c0-108.2 88-196.2 196.2-196.2 52.4 0 101.7 20.4 138.8 57.5 37.1 37.1 57.5 86.4 57.5 138.8 0 108.2-88 196.2-196.2 196.2zm106.2-145c-5.8-2.9-34.4-17-39.8-18.9-5.4-2-9.3-3-13.2 3-3.9 5.8-15.2 19-18.6 22.8-3.4 3.9-6.8 4.3-12.6 1.4-5.8-2.9-24.4-9-46.6-28.8-17.2-15.3-28.8-34.3-32.2-40.1-3.4-5.8-.4-8.9 2.6-11.8 2.7-2.6 5.8-6.8 8.8-10.2 3-3.4 4-5.8 6-9.7 2-3.9 1-7.3-.5-10.2-1.5-2.9-13.2-31.7-18.1-43.5-4.8-11.6-9.7-10-13.2-10.2-3.4-.2-7.3-.2-11.2-.2-3.9 0-10.3 1.5-15.7 7.3-5.4 5.8-20.7 20.3-20.7 49.5 0 29.2 21.3 57.3 24.2 61.2 3 3.9 41.9 64 101.5 89.8 14.2 6.1 25.2 9.8 33.9 12.6 14.3 4.5 27.2 3.9 37.5 2.4 11.5-1.7 34.4-14 39.3-27.6 4.9-13.6 4.9-25.2 3.4-27.6-1.5-2.4-5.4-3.9-11.2-6.8z" />
              </svg>
              Reply on WhatsApp
            </a>

            {/* Email reply button */}
            {email ? (
              <a
                href={`mailto:${email}?subject=Re: ${encodeURIComponent(
                  subject || cleanMessage.slice(0, 50)
                )}&body=${encodeURIComponent(replyMessage)}`}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 hover:bg-orange-600 py-3 text-xs sm:text-sm font-black text-white transition active:scale-95 shadow-md shadow-orange-100 dark:shadow-none cursor-pointer"
              >
                <EnvelopeIcon className="h-4.5 w-4.5" />
                Reply by Email
              </a>
            ) : (
              <span className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 border border-slate-200 dark:bg-slate-800/40 dark:border-slate-800 py-3 text-xs sm:text-sm font-bold text-slate-400 dark:text-slate-600 select-none">
                No Email Provided
              </span>
            )}

            {/* Deletion state */}
            {onDelete && (
              <div className="shrink-0 flex items-center justify-end">
                {showConfirmDelete ? (
                  <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 p-1.5 rounded-xl animate-fade-up">
                    <span className="text-[10px] sm:text-xs font-bold text-red-600 dark:text-red-400 px-1">Are you sure?</span>
                    <button
                      type="button"
                      onClick={handleConfirmDelete}
                      disabled={isDeleting}
                      className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white text-[10px] sm:text-xs font-extrabold transition active:scale-95 cursor-pointer flex items-center gap-1.5"
                    >
                      {isDeleting ? (
                        <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      ) : (
                        <TrashIcon className="h-3.5 w-3.5" />
                      )}
                      Delete
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelDelete}
                      disabled={isDeleting}
                      className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] sm:text-xs font-extrabold transition active:scale-95 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleDeleteClick}
                    className="p-3 rounded-xl border border-red-100 hover:border-red-200 dark:border-slate-800 text-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/20 active:scale-95 transition flex items-center justify-center font-bold text-xs sm:text-sm cursor-pointer shadow-sm hover:shadow"
                    title="Delete Enquiry"
                  >
                    <TrashIcon className="h-4.5 w-4.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

