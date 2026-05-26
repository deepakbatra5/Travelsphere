import { config as loadEnv } from 'dotenv'

loadEnv({ path: '.env.local' })
loadEnv({ path: '.env' })

const PACKAGE_SLUGS = [
  'kashmir-paradise-escape',
  'spiti-valley-road-trip',
  'rishikesh-spiritual-adventure-camp',
  'jim-corbett-wildlife-safari',
  'varanasi-heritage-spiritual-tour',
  'dharamshala-dalhousie-hills',
  'ooty-kodaikanal-romantic-escapade',
  'hampi-badami-ruins-explorer',
  'chikmagalur-coffee-hills-trek',
  'munnar-thekkady-hill-escapade',
  'royal-rajasthan-heritage-tour',
  'gir-national-park-lion-safari',
  'rann-of-kutch-desert-festival',
  'mahabaleshwar-strawberry-valley-tour',
  'ajanta-ellora-caves-heritage-tour',
  'jaisalmer-desert-safari-camping',
  'dwarka-somnath-pilgrimage-tour',
  'darjeeling-tea-toy-train-vacation',
  'gangtok-tsango-lake-adventure',
  'sundarbans-mangrove-cruise',
  'majuli-island-cultural-retreat',
  'rajasthan-heritage-with-jaisalmer',
  'munnar-thekkady-alleppey-honeymoon-special',
  'rann-of-kutch-desert-festival-special',
]

async function main() {
  const { prisma } = await import('../src/lib/db')

  const packages = await prisma.package.findMany({
    where: { slug: { in: PACKAGE_SLUGS } },
    select: {
      id: true,
      slug: true,
      title: true,
    },
    orderBy: { createdAt: 'asc' },
  })

  if (packages.length === 0) {
    console.log('No matching packages found in the database.')
    return
  }

  const packageIds = packages.map((pkg) => pkg.id)

  await prisma.$transaction(async (tx) => {
    const bookingIds = await tx.booking.findMany({
      where: { packageId: { in: packageIds } },
      select: { id: true },
    })

    const bookingIdValues = bookingIds.map((booking) => booking.id)

    if (bookingIdValues.length > 0) {
      await tx.bookingAgent.deleteMany({ where: { bookingId: { in: bookingIdValues } } })
      await tx.payment.deleteMany({ where: { bookingId: { in: bookingIdValues } } })
      await tx.booking.deleteMany({ where: { id: { in: bookingIdValues } } })
    }

    await tx.packageTripDate.deleteMany({ where: { packageId: { in: packageIds } } })
    await tx.agentTourPreference.deleteMany({ where: { packageId: { in: packageIds } } })
    await tx.enquiry.deleteMany({ where: { packageId: { in: packageIds } } })
    await tx.review.deleteMany({ where: { packageId: { in: packageIds } } })
    await tx.package.deleteMany({ where: { id: { in: packageIds } } })
  })

  console.log(`Deleted ${packages.length} package(s):`)
  for (const pkg of packages) {
    console.log(`- ${pkg.title} (${pkg.slug})`) 
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