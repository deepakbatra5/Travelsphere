'use client'

import { useState } from 'react'
import Image from 'next/image'

interface EnquiryCardProps {
  id: string
  name: string
  phone: string
  email: string | null
  message: string
  attachmentUrls: string[]
  packageTitle: string | null
  createdAt: Date
}

export default function EnquiryCard({ id, name, phone, email, message, attachmentUrls, packageTitle, createdAt }: EnquiryCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden border border-gray-100">
      {/* Card Header */}
      <div className="p-5 cursor-pointer hover:bg-gray-50" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
              <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                {packageTitle || 'General'}
              </span>
            </div>
            <p className="text-sm text-gray-500 line-clamp-2">{message}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 mb-1">
              {new Date(createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
            <p className="text-xs text-gray-400 mb-2">
              {new Date(createdAt).toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
            </p>
            <span className={`inline-block text-lg transition ${expanded ? 'rotate-180' : ''}`}>▼</span>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-gray-100 p-5 bg-gray-50 space-y-4">
          {/* Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Phone</p>
              <a href={`tel:${phone}`} className="text-orange-600 hover:underline text-sm font-medium">
                {phone}
              </a>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Email</p>
              <p className="text-gray-700 text-sm break-all">{email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium mb-1">Date & Time</p>
              <p className="text-gray-700 text-sm font-medium">
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

          {/* Full Message */}
          <div>
            <p className="text-xs text-gray-500 font-medium mb-2">Full Message</p>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-800 whitespace-pre-wrap">{message}</p>
            </div>
          </div>

          {/* Attachments */}
          {attachmentUrls && attachmentUrls.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 font-medium mb-2">Attachments ({attachmentUrls.length})</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {attachmentUrls.map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative rounded-lg overflow-hidden bg-gray-200 h-20"
                  >
                    <Image
                      src={url}
                      alt={`Attachment ${i + 1}`}
                      fill
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition flex items-center justify-center">
                      <span className="text-white text-xl opacity-0 group-hover:opacity-100 transition">🔍</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <a
              href={`https://wa.me/91${phone.replace(/\D/g, '')}?text=Hi ${encodeURIComponent(name)}, regarding your enquiry...`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-2 rounded-lg transition text-center"
            >
              💬 Reply on WhatsApp
            </a>
            <a
              href={`mailto:${email || 'deepankumar81c401a1e8@gmail.com'}?subject=Re: ${encodeURIComponent(message.slice(0, 50))}`}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-2 rounded-lg transition text-center"
            >
              ✉️ Send Email
            </a>
          </div>
        </div>
      )}
    </div>
  )
}


