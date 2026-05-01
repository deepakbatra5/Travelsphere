import Link from 'next/link'
import { Suspense } from 'react'
import { prisma } from '@/lib/db'
import { Prisma, Category } from '@/generated/prisma/client'
import PackageCard from '@/components/packages/PackageCard'
import PackageFilter from '@/components/packages/PackageFilter'

interface SearchParams {
  search?: string
  category?: string
  duration?: string
  budget?: string
}

interface Props {
  searchParams?: Promise<SearchParams>
}

const quickCategories = [
  { label: 'All Packages', value: 'ALL' },
  { label: 'Solo Trips', value: 'SOLO' },
  { label: 'Family', value: 'FAMILY' },
  { label: 'Pilgrimage', value: 'PILGRIMAGE' },
  { label: 'Group Tours', value: 'GROUP' },
]

async function getPackages(filters: SearchParams) {
  try {
    const where: Prisma.PackageWhereInput = { isActive: true }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { destination: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    if (filters.category && filters.category !== 'ALL' && filters.category in Category) {
      where.category = filters.category as Category
    }

    if (filters.duration && filters.duration !== 'ALL') {
      if (filters.duration === '10+') {
        where.duration = { gte: 10 }
      } else {
        const [min, max] = filters.duration.split('-').map(Number)
        where.duration = { gte: min, lte: max }
      }
    }

    if (filters.budget && filters.budget !== 'ALL') {
      const [min, max] = filters.budget.split('-').map(Number)
      where.price = { gte: min, lte: max }
    }

    return await prisma.package.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })
  } catch (error) {
    console.error('Failed to load package listings:', error)
    return []
  }
}

export default async function PackagesPage({ searchParams }: Props) {
  const filters = (await searchParams) ?? {}
  const packages = await getPackages(filters)
  const selectedCategory = filters.category || 'ALL'

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="section-shell mb-8 rounded-3xl p-6 md:p-8">
        <h1 className="text-3xl font-extrabold text-slate-900 md:text-4xl">All Tour Packages</h1>
        <p className="mt-2 text-sm text-slate-600 md:text-base">
          {packages.length} package{packages.length !== 1 ? 's' : ''} found
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {quickCategories.map((cat) => {
            const isActive = selectedCategory === cat.value
            const href = cat.value === 'ALL' ? '/packages' : `/packages?category=${cat.value}`

            return (
              <Link
                key={cat.value}
                href={href}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </Link>
            )
          })}
        </div>
      </div>

      <Suspense fallback={<div>Loading filters...</div>}>
        <PackageFilter />
      </Suspense>

      {packages.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} package={pkg} />
          ))}
        </div>
      ) : (
        <div className="surface-card rounded-3xl py-20 text-center text-slate-500">
          <p className="text-lg font-bold text-slate-700">No packages found</p>
          <p className="mt-2 text-sm">Try changing your filters or search term</p>
        </div>
      )}
    </div>
  )
}
