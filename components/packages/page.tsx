import { prisma } from '@/lib/db'
import { Prisma, Category } from '@/generated/prisma/client'
import PackageCard from '@/components/packages/PackageCard'
import PackageFilter from '@/components/packages/PackageFilter'
import { Suspense } from 'react'

interface SearchParams {
  search?: string
  category?: string
  duration?: string
  budget?: string
}

interface Props {
  searchParams: SearchParams | Promise<SearchParams>
}

async function getPackages(filters: SearchParams) {
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
}

export default async function PackagesPage({ searchParams }: Props) {
  const filters = await Promise.resolve(searchParams)
  const packages = await getPackages(filters)

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">All Tour Packages</h1>
        <p className="text-gray-500 mt-1">
          {packages.length} package{packages.length !== 1 ? 's' : ''} found
        </p>
      </div>

      <Suspense fallback={<div>Loading filters...</div>}>
        <PackageFilter />
      </Suspense>

      {packages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} package={pkg} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium">No packages found</p>
          <p className="text-sm mt-2">Try changing your filters or search term</p>
        </div>
      )}
    </div>
  )
}
