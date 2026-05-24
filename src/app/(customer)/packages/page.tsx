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

async function getPackages(filters: SearchParams) {
  try {
    const where: Prisma.PackageWhereInput = { isActive: true }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { destination: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    const normalizedCategory = filters.category === 'HONEYMOON' ? 'SOLO' : filters.category

    if (normalizedCategory && normalizedCategory !== 'ALL' && normalizedCategory in Category) {
      where.category = normalizedCategory as Category
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="section-shell mb-8 rounded-3xl p-6 md:p-8">
        <h1 className="text-3xl font-extrabold text-slate-900 md:text-4xl">All Tour Packages</h1>
        <p className="mt-2 text-sm text-slate-600 md:text-base">
          Search by destination, budget, duration, or tour category.
        </p>
      </div>

      <Suspense fallback={<div className="surface-card mb-8 rounded-3xl p-8 text-sm text-slate-500">Loading filters...</div>}>
        <PackageFilter />
      </Suspense>

      <p className="mb-4 text-sm font-semibold text-slate-500">
        {packages.length} package{packages.length !== 1 ? 's' : ''} found
      </p>
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
