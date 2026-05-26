import { config as loadEnv } from 'dotenv'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient, type Prisma } from './generated/prisma/client.ts'
import bcrypt from 'bcryptjs'
import { packagesData } from './packages-data'

loadEnv({ path: '.env.local' })
loadEnv({ path: '.env' })

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is not set')
}

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

type SeedPackage = Prisma.PackageCreateInput

function buildTripDates(packageIndex: number) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return Array.from({ length: 4 }, (_, dateIndex) => {
    const startDate = new Date(today)
    startDate.setDate(today.getDate() + 14 + packageIndex * 5 + dateIndex * 21)

    const totalSeats = 18 + ((packageIndex + dateIndex) % 5) * 6
    const bookedPreviewSeats = (packageIndex + dateIndex) % 4

    return {
      startDate,
      totalSeats,
      availableSeats: totalSeats - bookedPreviewSeats,
    }
  })
}

async function repairLegacyCategories() {
  await prisma.$executeRawUnsafe(`ALTER TYPE "Category" ADD VALUE IF NOT EXISTS 'SOLO'`)
  await prisma.$executeRawUnsafe(`
    UPDATE "Package"
    SET "category" = 'SOLO'::"Category"
    WHERE "category"::text = 'HONEYMOON'
  `)
}

async function repairAgentPayouts() {
  await prisma.$executeRawUnsafe(`
    UPDATE "BookingAgent" AS assignment
    SET "commission" = booking."totalAmount" * 0.8
    FROM "Booking" AS booking
    WHERE assignment."bookingId" = booking."id"
  `)
}

async function ensureTripDatesForEveryPackage() {
  const allPackages = await prisma.package.findMany({
    select: {
      id: true,
      title: true,
      tripDates: { select: { id: true } },
    },
    orderBy: { createdAt: 'asc' },
  })

  for (const [packageIndex, pkg] of allPackages.entries()) {
    if (pkg.tripDates.length > 0) continue

    await prisma.packageTripDate.createMany({
      data: buildTripDates(packageIndex).map((tripDate) => ({
        packageId: pkg.id,
        startDate: tripDate.startDate,
        totalSeats: tripDate.totalSeats,
        availableSeats: tripDate.availableSeats,
      })),
      skipDuplicates: true,
    })

    console.log(`Trip dates added: ${pkg.title}`)
  }
}

async function main() {
  console.log('Seeding database...')
  await repairLegacyCategories()
  await repairAgentPayouts()

  const isProduction = process.env.NODE_ENV === 'production'
  const adminEmail = process.env.SEED_ADMIN_EMAIL || (isProduction ? undefined : 'admin@travelsphere.com')
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || (isProduction ? undefined : 'Admin@12345')

  if (adminEmail && adminPassword) {
    const adminPasswordHash = await bcrypt.hash(adminPassword, 10)

    await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        name: 'Admin',
        password: adminPasswordHash,
        role: 'ADMIN',
        isEmailVerified: true,
        emailVerifiedAt: new Date(),
      },
      create: {
        name: 'Admin',
        email: adminEmail,
        password: adminPasswordHash,
        role: 'ADMIN',
        isEmailVerified: true,
        emailVerifiedAt: new Date(),
      },
    })

    console.log(`Admin user ready: ${adminEmail}`)
  } else {
    console.log('Skipping admin seed. Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD to create an admin user.')
  }

  const packages: SeedPackage[] = packagesData as unknown as SeedPackage[]

  for (const [packageIndex, pkg] of packages.entries()) {
    const savedPackage = await prisma.package.upsert({
      where: { slug: pkg.slug },
      update: {
        title: pkg.title,
        destination: pkg.destination,
        description: pkg.description,
        price: pkg.price,
        duration: pkg.duration,
        category: pkg.category,
        images: pkg.images,
        itinerary: pkg.itinerary,
        inclusions: pkg.inclusions,
        exclusions: pkg.exclusions,
        isActive: true,
      },
      create: pkg,
    })

    await prisma.packageTripDate.createMany({
      data: buildTripDates(packageIndex).map((tripDate) => ({
        packageId: savedPackage.id,
        startDate: tripDate.startDate,
        totalSeats: tripDate.totalSeats,
        availableSeats: tripDate.availableSeats,
      })),
      skipDuplicates: true,
    })

    console.log(`Created: ${pkg.title}`)
  }

  await ensureTripDatesForEveryPackage()

  // Seed team members
  console.log('Seeding team members...')
  await prisma.teamMember.deleteMany({})

  const teamMembers = [
    {
      name: 'Deepak Kumar',
      role: 'Founder & CEO',
      moto: 'To inspire every Indian to explore the world with absolute trust and zero hassle.',
      linkedin: 'https://www.linkedin.com/in/deepakumar04/',
      imageUrl: '/images/team/deepak.png',
      order: 1
    },
    {
      name: 'Harsh Raj',
      role: 'Co-Founder & Operations Head',
      moto: 'Building the strongest local partner network to guarantee 100% safety and premium comfort for every traveler.',
      linkedin: 'https://www.linkedin.com/in/harshraj04/',
      imageUrl: '/images/team/harsh.png',
      order: 2
    },
    {
      name: 'Nikhil Singhal',
      role: 'Chief Technology Officer (CTO)',
      linkedin: 'https://www.linkedin.com/in/nikhil-singhal04/',
      moto: 'Powering smart travel with cutting-edge tech and seamless itineraries.',
      imageUrl: '/images/team/nikhil.png',
      order: 3
    },
    {
      name: 'Pratik Kumar',
      role: 'Head of Marketing & Strategy',
      linkedin: 'https://www.linkedin.com/in/pratik70/',
      moto: 'Connecting people with their dream destinations through authentic stories.',
      imageUrl: '/images/team/pratik.png',
      order: 4
    },
    {
      name: 'Abhishek Dixit',
      role: 'Head of Customer Experience',
      linkedin: 'https://www.linkedin.com/in/abhishek-dixitt-/',
      moto: 'Ensuring 24/7 support so that every trip with us is completely memorable.',
      imageUrl: '/images/team/abhishek.png',
      order: 5
    }
  ]

  await prisma.teamMember.createMany({
    data: teamMembers
  })

  // Seed reviews
  console.log('Seeding reviews...')
  const kashmirPkg = await prisma.package.findUnique({ where: { slug: 'kashmir-solo-escape' } })
  const keralaPkg = await prisma.package.findUnique({ where: { slug: 'kerala-solo-retreat' } })
  const goaPkg = await prisma.package.findUnique({ where: { slug: 'goa-beach-holiday' } })
  const chardhamPkg = await prisma.package.findUnique({ where: { slug: 'char-dham-yatra' } })

  const seedReviews = [
    {
      guestName: 'Priya Sharma',
      guestDest: 'Kashmir',
      comment: 'Absolutely breathtaking trip to Kashmir! Every detail was handled perfectly. The houseboat stay was a dream come true. Will book again without hesitation.',
      rating: 5,
      packageId: kashmirPkg?.id,
      isPinned: true
    },
    {
      guestName: 'Rahul & Meena Joshi',
      guestDest: 'Kerala',
      comment: 'Kerala backwater cruise was magical. The food, the scenery, the guides — everything was 10/10. Travel Sphere made our anniversary unforgettable!',
      rating: 5,
      packageId: keralaPkg?.id,
      isPinned: true
    },
    {
      guestName: 'Ankit Verma',
      guestDest: 'Rajasthan',
      comment: 'Rajasthan heritage tour was stunning. Loved the camel ride and the forts. The team was super responsive on WhatsApp whenever we had questions.',
      rating: 4,
      isPinned: true
    },
    {
      guestName: 'Sneha Patil',
      guestDest: 'Goa',
      comment: 'Goa trip with the family was a blast! Kids loved the beaches, we loved the relaxed vibe and great hotel pick. Transparent pricing — no surprise charges at all.',
      rating: 5,
      packageId: goaPkg?.id,
      isPinned: true
    },
    {
      guestName: 'Suresh Kumar',
      guestDest: 'Uttarakhand',
      comment: 'Trekked to Kedarnath with Travel Sphere\'s pilgrimage package. Everything from transport to accommodation was organised flawlessly. Truly a spiritual journey.',
      rating: 5,
      packageId: chardhamPkg?.id,
      isPinned: true
    },
    {
      guestName: 'Divya Nair',
      guestDest: 'Himachal Pradesh',
      comment: 'Solo trip to Manali was exactly what I needed. The adventure activities were thrilling and the guides were knowledgeable. Highly recommended for solo travellers!',
      rating: 4,
      isPinned: true
    },
    {
      guestName: 'Arjun & Pooja Mehta',
      guestDest: 'Andaman',
      comment: 'Best travel agency in India, period. The Andaman Islands trip was picture-perfect. Crystal clear water, white sand beaches. 24/7 support team was always just a call away.',
      rating: 5,
      isPinned: true
    }
  ]

  const reviewCount = await prisma.review.count()
  if (reviewCount === 0) {
    for (const r of seedReviews) {
      await prisma.review.create({
        data: r
      })
    }
    console.log('Seeded 7 reviews!')
  }

  console.log('Seeding complete! Packages, team, and reviews added.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
