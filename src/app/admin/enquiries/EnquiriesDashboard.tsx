'use client'

import { useState, useMemo, useTransition } from 'react'
import {
  InboxIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  BriefcaseIcon,
  EllipsisHorizontalCircleIcon,
  MagnifyingGlassIcon,
  ArrowsUpDownIcon,
  CheckCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import EnquiryCard from './EnquiryCard'

interface EnquiryWithPackage {
  id: string
  name: string
  phone: string
  email: string | null
  message: string
  packageId: string | null
  userId: string | null
  createdAt: Date
  package: { title: string } | null
}

type EnquiryTab = 'all' | 'customised' | 'customer-help' | 'agent-help' | 'other'
type SortOption = 'newest' | 'oldest' | 'name-asc' | 'name-desc'

interface EnquiriesDashboardProps {
  initialEnquiries: EnquiryWithPackage[]
}

const tabMeta: Record<
  EnquiryTab,
  {
    label: string
    description: string
    activeClass: string
    hoverClass: string
    softClass: string
    glowClass: string
    icon: React.ComponentType<any>
  }
> = {
  all: {
    label: 'All Enquiries',
    description: 'Every submitted form in inbox',
    activeClass: 'bg-slate-950 border-slate-950 text-white shadow-xl shadow-slate-950/20 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100',
    hoverClass: 'hover:border-slate-350 dark:hover:border-slate-700 hover:shadow-lg hover:shadow-slate-100/50 dark:hover:shadow-none hover:-translate-y-1',
    softClass: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    glowClass: 'group-hover:text-slate-800 dark:group-hover:text-slate-200 group-hover:bg-slate-100 dark:group-hover:bg-slate-800',
    icon: InboxIcon,
  },
  customised: {
    label: 'Customised Trips',
    description: 'Trip planning requests',
    activeClass: 'bg-gradient-to-r from-orange-500 to-amber-500 border-orange-500 text-white shadow-xl shadow-orange-500/20 dark:from-orange-600 dark:to-amber-600',
    hoverClass: 'hover:border-orange-200 dark:hover:border-orange-950 hover:shadow-xl hover:shadow-orange-500/10 dark:hover:shadow-none hover:-translate-y-1',
    softClass: 'bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-900/50',
    glowClass: 'group-hover:text-orange-500 group-hover:bg-orange-50/50 dark:group-hover:bg-orange-950/20',
    icon: SparklesIcon,
  },
  'customer-help': {
    label: 'Customer Help',
    description: 'Help and support queries',
    activeClass: 'bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-600 text-white shadow-xl shadow-blue-600/20 dark:from-blue-700 dark:to-indigo-700',
    hoverClass: 'hover:border-blue-200 dark:hover:border-blue-950 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-none hover:-translate-y-1',
    softClass: 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/50',
    glowClass: 'group-hover:text-blue-500 group-hover:bg-blue-50/50 dark:group-hover:bg-blue-950/20',
    icon: ChatBubbleLeftRightIcon,
  },
  'agent-help': {
    label: 'Agent Support',
    description: 'B2B agent support tickets',
    activeClass: 'bg-gradient-to-r from-cyan-600 to-teal-600 border-cyan-600 text-white shadow-xl shadow-cyan-600/20 dark:from-cyan-700 dark:to-teal-700',
    hoverClass: 'hover:border-cyan-200 dark:hover:border-cyan-950 hover:shadow-xl hover:shadow-cyan-500/10 dark:hover:shadow-none hover:-translate-y-1',
    softClass: 'bg-cyan-50 text-cyan-700 border-cyan-100 dark:bg-cyan-950/40 dark:text-cyan-400 dark:border-cyan-900/50',
    glowClass: 'group-hover:text-cyan-500 group-hover:bg-cyan-50/50 dark:group-hover:bg-cyan-950/20',
    icon: BriefcaseIcon,
  },
  other: {
    label: 'General Enquiries',
    description: 'General miscellaneous questions',
    activeClass: 'bg-gradient-to-r from-purple-600 to-fuchsia-600 border-purple-600 text-white shadow-xl shadow-purple-600/20 dark:from-purple-700 dark:to-fuchsia-700',
    hoverClass: 'hover:border-purple-200 dark:hover:border-purple-950 hover:shadow-xl hover:shadow-purple-500/10 dark:hover:shadow-none hover:-translate-y-1',
    softClass: 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900/50',
    glowClass: 'group-hover:text-purple-500 group-hover:bg-purple-50/50 dark:group-hover:bg-purple-950/20',
    icon: EllipsisHorizontalCircleIcon,
  },
}

function getMessageSubject(message: string) {
  const match = message.match(/^\[([^\]]+)\]\s*/)
  return match?.[1] || 'General'
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

export default function EnquiriesDashboard({ initialEnquiries }: EnquiriesDashboardProps) {
  const [enquiries, setEnquiries] = useState<EnquiryWithPackage[]>(initialEnquiries)
  const [activeTab, setActiveTab] = useState<EnquiryTab>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  // Dynamic status/categorisation lookup
  const categorisedData = useMemo(() => {
    const grouped = {
      all: enquiries,
      customised: [] as EnquiryWithPackage[],
      'customer-help': [] as EnquiryWithPackage[],
      'agent-help': [] as EnquiryWithPackage[],
      other: [] as EnquiryWithPackage[],
    }

    enquiries.forEach((item) => {
      const subject = getMessageSubject(item.message)

      if (isCustomisedTour(subject)) {
        grouped.customised.push(item)
      } else if (subject === 'Agent Help & Support Request') {
        grouped['agent-help'].push(item)
      } else if (isCustomerHelp(subject)) {
        grouped['customer-help'].push(item)
      } else {
        grouped.other.push(item)
      }
    })

    return grouped
  }, [enquiries])

  // Filter and sort the enquiries listing
  const processedEnquiries = useMemo(() => {
    const list = categorisedData[activeTab]

    // Search filter
    const filtered = list.filter((item) => {
      const query = searchQuery.toLowerCase().trim()
      if (!query) return true

      return (
        item.name.toLowerCase().includes(query) ||
        (item.email && item.email.toLowerCase().includes(query)) ||
        item.phone.toLowerCase().includes(query) ||
        item.message.toLowerCase().includes(query) ||
        (item.package?.title && item.package.title.toLowerCase().includes(query))
      );
    })

    // Sort order
    return [...filtered].sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
      if (sortBy === 'name-asc') {
        return a.name.localeCompare(b.name)
      }
      if (sortBy === 'name-desc') {
        return b.name.localeCompare(a.name)
      }
      return 0
    })
  }, [categorisedData, activeTab, searchQuery, sortBy])

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => {
      setToast(null)
    }, 4000)
  }

  const handleDeleteEnquiry = async (id: string) => {
    try {
      const res = await fetch(`/api/enquiries?id=${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        throw new Error('Failed to delete enquiry')
      }
      
      // Update state locally with anim transition
      setEnquiries((prev) => prev.filter((item) => item.id !== id))
      showToast('Enquiry deleted successfully!', 'success')
    } catch (err) {
      console.error(err)
      showToast('Could not delete enquiry. Please try again.', 'error')
    }
  }

  const tabs = Object.keys(tabMeta) as EnquiryTab[]
  const activeMeta = tabMeta[activeTab]

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-fade-up max-w-sm pointer-events-auto">
          <div className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 shadow-2xl border backdrop-blur-md ${
            toast.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircleIcon className="h-5 w-5 shrink-0" />
            ) : (
              <XMarkIcon className="h-5 w-5 shrink-0" />
            )}
            <p className="text-xs font-black tracking-wide leading-tight flex-1">{toast.message}</p>
            <button
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Colorful Glassmorphic Header */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 text-white p-6 sm:p-8 shadow-md">
        <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-orange-500/20 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 h-28 w-28 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />
        <div className="absolute right-1/3 top-1/4 h-36 w-36 rounded-full bg-purple-500/15 blur-3xl pointer-events-none animate-pulse duration-4000" />

        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/20 border border-orange-500/30 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-orange-300">
              ✉ Form Inbox
            </span>
            <h1 className="text-3xl font-black tracking-tight">Enquiries</h1>
            <p className="text-slate-300 text-sm max-w-xl font-medium">
              View customer customized tour requests, support queries, and reply in one-click.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-6 py-4 shrink-0 text-center sm:text-right shadow-inner">
            <p className="text-[10px] uppercase tracking-wider font-bold text-slate-300 leading-none mb-1.5">
              Total Submissions
            </p>
            <p className="text-3xl font-black text-orange-400 leading-none transition-all duration-300">
              {enquiries.length}
            </p>
          </div>
        </div>
      </div>

      {/* Search and Sort Toolbar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 group">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, phone number, message details..."
            className="w-full pl-12 pr-10 py-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 focus:bg-white dark:focus:bg-slate-900 focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 transition-all font-semibold outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Sort Select */}
        <div className="relative shrink-0 min-w-[200px] flex items-center gap-2">
          <ArrowsUpDownIcon className="h-4 w-4 text-slate-400 shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="w-full py-3 px-4 text-sm font-bold text-slate-700 dark:text-slate-300 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 outline-none focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 transition-all"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
            <option value="name-asc">Sort: Name (A to Z)</option>
            <option value="name-desc">Sort: Name (Z to A)</option>
          </select>
        </div>
      </div>

      {/* Desktop Stepper Grid (Visible on large displays) */}
      <div className="hidden lg:grid grid-cols-5 gap-4">
        {tabs.map((tab) => {
          const meta = tabMeta[tab]
          const isActive = activeTab === tab
          const Icon = meta.icon
          const count = categorisedData[tab].length

          return (
            <div
              key={tab}
              onClick={() => startTransition(() => setActiveTab(tab))}
              className={`group relative rounded-2xl border p-5 flex flex-col justify-between h-32 transition-all duration-300 select-none cursor-pointer ${
                isActive
                  ? `${meta.activeClass}`
                  : `border-slate-100 bg-white text-slate-600 hover:border-slate-200 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 ${meta.hoverClass}`
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`h-9 w-9 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : `bg-slate-50 text-slate-500 dark:bg-slate-950 dark:text-slate-400 ${meta.glowClass}`
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-black border transition-all duration-300 ${
                    isActive ? 'bg-white/20 border-white/10 text-white' : meta.softClass
                  }`}
                >
                  {count}
                </span>
              </div>

              <div>
                <p className={`font-bold text-sm leading-none transition-colors ${isActive ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                  {meta.label}
                </p>
                <p className={`text-[10px] leading-none mt-1.5 transition-colors ${isActive ? 'text-white/80' : 'text-slate-400 dark:text-slate-500'}`}>
                  {meta.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Mobile horizontal scroll list (Visible on smaller displays) */}
      <div className="lg:hidden rounded-2xl bg-white dark:bg-slate-900 p-2.5 border border-slate-100 dark:border-slate-800 shadow-sm overflow-x-auto flex gap-2 scrollbar-none">
        {tabs.map((tab) => {
          const meta = tabMeta[tab]
          const isActive = activeTab === tab
          const count = categorisedData[tab].length

          return (
            <button
              type="button"
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap rounded-xl border px-4 py-2.5 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? `${meta.activeClass}`
                  : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              <span>{meta.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-[9px] font-black ${
                  isActive ? 'bg-white/25 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-650 dark:text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Enquiries Category Title & List */}
      <section className="space-y-4">
        <div className="flex flex-col justify-between gap-1 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-tight">{activeMeta.label}</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              {processedEnquiries.length} of {categorisedData[activeTab].length} submissions filtered
            </p>
          </div>
        </div>

        {processedEnquiries.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-16 text-center shadow-sm">
            <InboxIcon className="mx-auto h-12 w-12 text-slate-350 dark:text-slate-700 mb-3" />
            <h3 className="text-base font-bold text-slate-755 dark:text-slate-300">Inbox Empty</h3>
            <p className="text-sm font-medium text-slate-400 dark:text-slate-500 mt-1">
              {searchQuery ? 'No matching enquiries found' : `No ${activeMeta.label.toLowerCase()} submissions yet`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {processedEnquiries.map((e) => (
              <div key={e.id} className="animate-fade-up">
                <EnquiryCard
                  id={e.id}
                  name={e.name}
                  phone={e.phone}
                  email={e.email}
                  message={e.message}
                  packageTitle={e.package?.title || null}
                  createdAt={e.createdAt}
                  onDelete={handleDeleteEnquiry}
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
