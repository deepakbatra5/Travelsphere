'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function TourError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[TourDetailPage] Error boundary caught:', error)
  }, [error])

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 text-orange-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
      </div>
      <h1 className="mb-3 text-2xl font-black text-slate-900 dark:text-white">
        Oops! This tour couldn&apos;t load
      </h1>
      <p className="mb-8 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        We had trouble loading this tour package. This might be a temporary issue. Please try again or browse our other tours.
      </p>
      <div className="flex flex-wrap gap-4">
        <button
          onClick={reset}
          className="rounded-full bg-orange-500 px-6 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-orange-600"
        >
          Try Again
        </button>
        <Link
          href="/tours"
          className="rounded-full border border-orange-500 px-6 py-2.5 text-sm font-bold text-orange-600 transition hover:bg-orange-50"
        >
          Browse All Tours
        </Link>
      </div>
    </div>
  )
}
