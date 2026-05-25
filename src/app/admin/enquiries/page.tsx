import Link from 'next/link'
import { prisma } from '@/lib/db'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import EnquiryCard from './EnquiryCard'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type EnquiryWithPackage = Awaited<ReturnType<typeof getEnquiries>>[number]
type EnquiryTab = 'all' | 'customised' | 'customer-help' | 'agent-help' | 'other'

interface Props {
  searchParams?: Promise<{ tab?: string }>
}

const tabStyles: Record<EnquiryTab, { label: string; description: string; ring: string; active: string; soft: string }> = {
  all: {
    label: 'All',
    description: 'Every submitted form',
    ring: 'border-slate-200',
    active: 'bg-slate-900 text-white border-slate-900',
    soft: 'bg-slate-50 text-slate-700',
  },
  customised: {
    label: 'Customised Tours',
    description: 'Trip planning requests',
    ring: 'border-orange-200',
    active: 'bg-orange-500 text-white border-orange-500',
    soft: 'bg-orange-50 text-orange-700',
  },
  'customer-help': {
    label: 'Customer Help',
    description: 'Help and contact forms',
    ring: 'border-blue-200',
    active: 'bg-blue-600 text-white border-blue-600',
    soft: 'bg-blue-50 text-blue-700',
  },
  'agent-help': {
    label: 'Agent Help',
    description: 'Agent support forms',
    ring: 'border-cyan-200',
    active: 'bg-cyan-700 text-white border-cyan-700',
    soft: 'bg-cyan-50 text-cyan-700',
  },
  other: {
    label: 'Other',
    description: 'General enquiries',
    ring: 'border-purple-200',
    active: 'bg-purple-600 text-white border-purple-600',
    soft: 'bg-purple-50 text-purple-700',
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

function groupEnquiries(enquiries: EnquiryWithPackage[]) {
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
}

async function getEnquiries() {
  return prisma.enquiry.findMany({
    orderBy: { createdAt: 'desc' },
    include: { package: { select: { title: true } } },
  })
}

function getValidTab(tab?: string): EnquiryTab {
  if (tab === 'customised' || tab === 'customer-help' || tab === 'agent-help' || tab === 'other') {
    return tab
  }

  return 'all'
}

function EnquiryList({
  enquiries,
  emptyText,
}: {
  enquiries: EnquiryWithPackage[]
  emptyText: string
}) {
  if (enquiries.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-10 text-center shadow-sm">
        <p className="text-sm font-medium text-gray-400">{emptyText}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {enquiries.map((e) => (
        <EnquiryCard
          key={e.id}
          id={e.id}
          name={e.name}
          phone={e.phone}
          email={e.email}
          message={e.message}
          packageTitle={e.package?.title || null}
          createdAt={e.createdAt}
        />
      ))}
    </div>
  )
}

export default async function AdminEnquiriesPage({ searchParams }: Props) {
  const session = await getServerSession(authOptions)

  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/?callbackUrl=/enquiries')
  }

  const resolvedSearchParams = (await searchParams) ?? {}
  const activeTab = getValidTab(resolvedSearchParams.tab)
  const enquiries = await getEnquiries()
  const grouped = groupEnquiries(enquiries)
  const tabs = Object.keys(tabStyles) as EnquiryTab[]
  const activeMeta = tabStyles[activeTab]
  const activeEnquiries = grouped[activeTab]

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-orange-500">Form Inbox</p>
            <h1 className="mt-1 text-2xl font-bold text-gray-900">Enquiries</h1>
            <p className="mt-1 text-sm text-gray-500">
              View submitted forms by category and reply using the saved communication details.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-900 px-5 py-3 text-white">
            <p className="text-xs text-slate-300">Total submissions</p>
            <p className="text-2xl font-bold">{enquiries.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {tabs.map((tab) => {
          const meta = tabStyles[tab]
          const isActive = activeTab === tab

          return (
            <Link
              key={tab}
              href={tab === 'all' ? '/admin/enquiries' : `/admin/enquiries?tab=${tab}`}
              className={`rounded-2xl border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                isActive ? meta.ring : 'border-gray-100'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-gray-900">{meta.label}</p>
                  <p className="mt-1 text-xs text-gray-500">{meta.description}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${meta.soft}`}>
                  {grouped[tab].length}
                </span>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="rounded-2xl bg-white p-3 shadow-sm">
        <div className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => {
            const meta = tabStyles[tab]
            const isActive = activeTab === tab

            return (
              <Link
                key={tab}
                href={tab === 'all' ? '/admin/enquiries' : `/admin/enquiries?tab=${tab}`}
                className={`whitespace-nowrap rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                  isActive ? meta.active : 'border-gray-100 bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {meta.label} ({grouped[tab].length})
              </Link>
            )
          })}
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{activeMeta.label}</h2>
            <p className="text-sm text-gray-500">
              {activeEnquiries.length} submission{activeEnquiries.length === 1 ? '' : 's'} in this category
            </p>
          </div>
        </div>

        <EnquiryList
          enquiries={activeEnquiries}
          emptyText={`No ${activeMeta.label.toLowerCase()} submissions yet`}
        />
      </section>
    </div>
  )
}
