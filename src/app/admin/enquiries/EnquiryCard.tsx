'use client'

import { useState } from 'react'

interface EnquiryCardProps {
  id: string
  name: string
  phone: string
  email: string | null
  message: string
  packageTitle: string | null
  createdAt: Date
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

export default function EnquiryCard({ name, phone, email, message, packageTitle, createdAt }: EnquiryCardProps) {
  const [expanded, setExpanded] = useState(false)
  const subject = getMessageSubject(message)
  const cleanMessage = getCleanMessage(message)
  const badgeLabel = subject || packageTitle || 'General'
  const replyMessage = getReplyMessage(name, subject)

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100">
      <div className="p-5 cursor-pointer hover:bg-gray-50" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
              <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-700">
                {badgeLabel}
              </span>
            </div>
            <p className="line-clamp-2 text-sm text-gray-500">{cleanMessage}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="mb-1 text-xs text-gray-400">
              {new Date(createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
            <p className="mb-2 text-xs text-gray-400">
              {new Date(createdAt).toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
            </p>
            <span className={`inline-block text-lg transition ${expanded ? 'rotate-180' : ''}`}>v</span>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="space-y-4 border-t border-gray-100 bg-gray-50 p-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <p className="mb-1 text-xs font-medium text-gray-500">Communication Phone</p>
              <a href={`tel:${phone}`} className="text-sm font-medium text-orange-600 hover:underline">
                {phone}
              </a>
            </div>
            <div>
              <p className="mb-1 text-xs font-medium text-gray-500">Communication Email</p>
              <p className="break-all text-sm text-gray-700">{email || 'N/A'}</p>
            </div>
            <div>
              <p className="mb-1 text-xs font-medium text-gray-500">Date & Time</p>
              <p className="text-sm font-medium text-gray-700">
                {new Date(createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}{' '}
                at{' '}
                {new Date(createdAt).toLocaleTimeString('en-IN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: true,
                })}
              </p>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium text-gray-500">Full Message</p>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              {subject && (
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-orange-600">
                  {subject}
                </p>
              )}
              <p className="whitespace-pre-wrap text-sm text-gray-800">{cleanMessage}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2 sm:flex-row">
            <a
              href={`https://wa.me/${getWhatsAppNumber(phone)}?text=${encodeURIComponent(replyMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-lg bg-green-500 py-2 text-center text-sm font-medium text-white transition hover:bg-green-600"
            >
              Reply on WhatsApp
            </a>
            {email ? (
              <a
                href={`mailto:${email}?subject=Re: ${encodeURIComponent(subject || cleanMessage.slice(0, 50))}&body=${encodeURIComponent(replyMessage)}`}
                className="flex-1 rounded-lg bg-orange-500 py-2 text-center text-sm font-medium text-white transition hover:bg-orange-600"
              >
                Reply by Email
              </a>
            ) : (
              <span className="flex-1 rounded-lg bg-gray-200 py-2 text-center text-sm font-medium text-gray-500">
                No Email Provided
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
