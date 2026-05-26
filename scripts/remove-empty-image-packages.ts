import { config as loadEnv } from 'dotenv'

loadEnv({ path: '.env.local' })
loadEnv({ path: '.env' })

async function main() {
  const { prisma } = await import('../src/lib/db')

  const packages = await prisma.package.findMany({
    select: {
      id: true,
      slug: true,
      title: true,
      images: true,
      _count: {
        select: {
          bookings: true,
          reviews: true,
        },
      },
    },
    where: {
      images: {
        isEmpty: true,
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  })

  if (packages.length === 0) {
    console.log('No packages with empty images were found.')
    return
  }

  console.log(`Found ${packages.length} package(s) without images.`)

  let deletedCount = 0
  let skippedCount = 0

  for (const pkg of packages) {
    if (pkg._count.bookings > 0 || pkg._count.reviews > 0) {
      skippedCount += 1
      console.log(`Skipped ${pkg.slug} because it still has related bookings or reviews.`)
      continue
    }

    await prisma.package.delete({ where: { id: pkg.id } })
    deletedCount += 1
    console.log(`Deleted ${pkg.slug}`)
  }

  console.log(`Deleted ${deletedCount} package(s).`)
  if (skippedCount > 0) {
    console.log(`Skipped ${skippedCount} package(s) with dependent data.`)
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    const { prisma } = await import('../src/lib/db')
    await prisma.$disconnect()
  })
