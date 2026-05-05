import { config as loadEnv } from 'dotenv'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient, type Prisma } from '../generated/prisma/client.ts'
import bcrypt from 'bcryptjs'

loadEnv({ path: '.env.local' })
loadEnv({ path: '.env' })

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL is not set')
}

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

type SeedPackage = Prisma.PackageCreateInput

async function repairLegacyCategories() {
  await prisma.$executeRawUnsafe(`ALTER TYPE "Category" ADD VALUE IF NOT EXISTS 'SOLO'`)
  await prisma.$executeRawUnsafe(`
    UPDATE "Package"
    SET "category" = 'SOLO'::"Category"
    WHERE "category"::text = 'HONEYMOON'
  `)
}

async function main() {
  console.log('Seeding database...')
  await repairLegacyCategories()

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
      },
      create: {
        name: 'Admin',
        email: adminEmail,
        password: adminPasswordHash,
        role: 'ADMIN',
      },
    })

    console.log(`Admin user ready: ${adminEmail}`)
  } else {
    console.log('Skipping admin seed. Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD to create an admin user.')
  }

  const packages: SeedPackage[] = [
    {
      title: 'Golden Triangle Tour',
      slug: 'golden-triangle-tour',
      destination: 'Delhi - Agra - Jaipur',
      description: 'Experience the best of North India with this classic Golden Triangle tour. Visit the iconic Taj Mahal, majestic forts and vibrant bazaars.',
      price: 10,
      duration: 6,
      category: 'FAMILY',
      images: ['https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800'],
      itinerary: [
        { day: 1, title: 'Arrival in Delhi', description: 'Arrive in Delhi. Check-in to hotel. Evening visit India Gate.' },
        { day: 2, title: 'Delhi Sightseeing', description: 'Visit Red Fort, Jama Masjid, Qutub Minar and Humayun Tomb.' },
        { day: 3, title: 'Delhi to Agra', description: 'Drive to Agra. Visit the Taj Mahal at sunset. Overnight in Agra.' },
        { day: 4, title: 'Agra to Jaipur', description: 'Morning visit Agra Fort. Drive to Jaipur via Fatehpur Sikri.' },
        { day: 5, title: 'Jaipur Sightseeing', description: 'Visit Amber Fort, City Palace, Jantar Mantar and Hawa Mahal.' },
        { day: 6, title: 'Departure', description: 'Morning free for shopping. Transfer to airport or railway station.' },
      ],
      inclusions: ['Hotel accommodation 5 nights', 'Daily breakfast', 'All transfers by AC car', 'Expert tour guide', 'All entry tickets'],
      exclusions: ['Flights', 'Lunch and dinner', 'Personal expenses', 'Travel insurance'],
    },
    {
      title: 'Kashmir Solo Escape',
      slug: 'kashmir-solo-escape',
      destination: 'Srinagar - Gulmarg - Pahalgam',
      description: 'A peaceful solo journey to heaven on earth. Enjoy shikara rides on Dal Lake, snow-capped mountains in Gulmarg and the serene beauty of Pahalgam at your own pace.',
      price: 28999,
      duration: 7,
      category: 'SOLO',
      images: ['https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800'],
      itinerary: [
        { day: 1, title: 'Arrival in Srinagar', description: 'Check-in to houseboat on Dal Lake. Evening shikara ride.' },
        { day: 2, title: 'Srinagar Sightseeing', description: 'Visit Mughal Gardens, Shalimar Bagh and Nishat Bagh.' },
        { day: 3, title: 'Gulmarg Day Trip', description: 'Enjoy the Gondola cable car ride in Gulmarg.' },
        { day: 4, title: 'Pahalgam Transfer', description: 'Drive to Pahalgam, the valley of shepherds.' },
        { day: 5, title: 'Pahalgam Exploration', description: 'Visit Betaab Valley, Aru Valley and Chandanwari.' },
        { day: 6, title: 'Back to Srinagar', description: 'Return to Srinagar. Shopping at local markets for pashmina.' },
        { day: 7, title: 'Departure', description: 'Breakfast and transfer to airport.' },
      ],
      inclusions: ['Houseboat and hotel stay 6 nights', 'All meals', 'Shikara ride', 'All transfers'],
      exclusions: ['Airfare', 'Gondola tickets', 'Adventure activities', 'Travel insurance'],
    },
    {
      title: 'Char Dham Yatra',
      slug: 'char-dham-yatra',
      destination: 'Yamunotri - Gangotri - Kedarnath - Badrinath',
      description: 'Embark on the sacred Char Dham pilgrimage covering all four holy shrines in Uttarakhand.',
      price: 22999,
      duration: 12,
      category: 'PILGRIMAGE',
      images: ['https://images.unsplash.com/photo-1609766418204-94aae0ecfdfc?w=800'],
      itinerary: [
        { day: 1, title: 'Haridwar Assembly', description: 'Assemble at Haridwar. Evening Ganga Aarti at Har Ki Pauri.' },
        { day: 2, title: 'Haridwar to Barkot', description: 'Drive to Barkot via Mussoorie.' },
        { day: 3, title: 'Yamunotri Dham', description: 'Trek to Yamunotri temple. Take holy dip and offer prayers.' },
        { day: 4, title: 'Barkot to Uttarkashi', description: 'Drive to Uttarkashi. Visit Vishwanath Temple.' },
        { day: 5, title: 'Gangotri Dham', description: 'Visit Gangotri temple. Holy dip in River Bhagirathi.' },
        { day: 6, title: 'Drive to Guptkashi', description: 'Drive to Guptkashi via Tehri.' },
        { day: 7, title: 'Kedarnath', description: 'Trek to Kedarnath. Darshan and return.' },
        { day: 8, title: 'Drive to Badrinath', description: 'Drive to Badrinath via Joshimath.' },
        { day: 9, title: 'Badrinath Dham', description: 'Badrinath temple darshan and Mana village visit.' },
        { day: 10, title: 'Drive to Rudraprayag', description: 'Drive back towards Rishikesh.' },
        { day: 11, title: 'Drive to Rishikesh', description: 'Evening at Laxman Jhula.' },
        { day: 12, title: 'Departure from Haridwar', description: 'Morning prayers. Drop at station or airport.' },
      ],
      inclusions: ['11 nights accommodation', 'All meals', 'AC transport throughout', 'All temple entry fees', 'Religious guide'],
      exclusions: ['Helicopter charges', 'Porter charges', 'Personal expenses', 'Travel insurance'],
    },
    {
      title: 'Goa Beach Holiday',
      slug: 'goa-beach-holiday',
      destination: 'North Goa - South Goa',
      description: 'The perfect beach getaway! Enjoy sun, sand and surf in Goa. Explore stunning beaches, Portuguese heritage and delicious seafood.',
      price: 12999,
      duration: 5,
      category: 'GROUP',
      images: ['https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800'],
      itinerary: [
        { day: 1, title: 'Arrival in Goa', description: 'Transfer to hotel. Evening free at Calangute Beach.' },
        { day: 2, title: 'North Goa Tour', description: 'Visit Baga Beach, Anjuna Market, Fort Aguada and Chapora Fort.' },
        { day: 3, title: 'Water Sports Day', description: 'Parasailing, jet ski, banana boat and more.' },
        { day: 4, title: 'South Goa Tour', description: 'Visit Colva Beach, Basilica of Bom Jesus and Dudhsagar Falls.' },
        { day: 5, title: 'Departure', description: 'Morning free at beach. Transfer to airport.' },
      ],
      inclusions: ['4 nights hotel', 'Daily breakfast', 'Airport transfers', 'Sightseeing', 'Water sports package'],
      exclusions: ['Flights', 'Lunch and dinner', 'Personal expenses', 'Alcohol'],
    },
    {
      title: 'Kerala Solo Retreat',
      slug: 'kerala-solo-retreat',
      destination: 'Kochi - Munnar - Alleppey - Kovalam',
      description: "God's Own Country awaits! Cruise through tranquil backwaters on a houseboat, explore lush tea gardens in Munnar and relax on golden beaches during a calm solo escape.",
      price: 19999,
      duration: 8,
      category: 'SOLO',
      images: ['https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800'],
      itinerary: [
        { day: 1, title: 'Arrive Kochi', description: 'Visit Fort Kochi and Chinese Fishing Nets.' },
        { day: 2, title: 'Kochi to Munnar', description: 'Scenic drive through tea estates and waterfalls.' },
        { day: 3, title: 'Munnar Sightseeing', description: 'Visit Tea Museum, Eravikulam Park and Mattupetty Dam.' },
        { day: 4, title: 'Munnar to Thekkady', description: 'Boat safari in Periyar Wildlife Sanctuary.' },
        { day: 5, title: 'Thekkady to Alleppey', description: 'Board private houseboat for overnight backwater cruise.' },
        { day: 6, title: 'Backwaters Cruise', description: 'Full day cruising through Kerala backwaters.' },
        { day: 7, title: 'Alleppey to Kovalam', description: 'Relax on the famous crescent shaped beach.' },
        { day: 8, title: 'Departure', description: 'Transfer to Trivandrum airport.' },
      ],
      inclusions: ['7 nights hotel plus 1 night houseboat', 'Daily breakfast', 'All transfers', 'Periyar boat safari'],
      exclusions: ['Flights', 'Ayurvedic treatments', 'Personal expenses', 'Travel insurance'],
    },
    {
      title: 'Ladakh Adventure Tour',
      slug: 'ladakh-adventure-tour',
      destination: 'Leh - Nubra Valley - Pangong Lake',
      description: 'The ultimate adventure! Ride through the highest motorable roads, camp beside stunning Pangong Lake and experience raw Ladakh.',
      price: 32999,
      duration: 9,
      category: 'ADVENTURE',
      images: ['/ladakh-adventure-tour.jpg'],
      itinerary: [
        { day: 1, title: 'Arrive Leh', description: 'Rest for acclimatization at 3500m altitude. Evening market walk.' },
        { day: 2, title: 'Acclimatization Day', description: 'Light visit to Shanti Stupa and Leh Palace.' },
        { day: 3, title: 'Leh Sightseeing', description: 'Visit Hemis Monastery, Thiksey Monastery and Shey Palace.' },
        { day: 4, title: 'Leh to Nubra Valley', description: 'Drive over Khardung La at 5602m to Nubra Valley.' },
        { day: 5, title: 'Nubra Valley', description: 'Diskit Monastery and Bactrian camel ride in Hunder dunes.' },
        { day: 6, title: 'Nubra to Pangong Lake', description: 'Drive to breathtaking Pangong Tso Lake. Camp overnight.' },
        { day: 7, title: 'Pangong Lake', description: 'Sunrise at Pangong. Full day at the mesmerizing blue lake.' },
        { day: 8, title: 'Pangong to Leh', description: 'Return to Leh via Chang La. Evening shopping.' },
        { day: 9, title: 'Departure', description: 'Transfer to Leh airport.' },
      ],
      inclusions: ['8 nights accommodation and camping', 'All meals', 'SUV transfers', 'Inner Line Permits', 'Adventure guide'],
      exclusions: ['Flights to and from Leh', 'Camel ride', 'River rafting', 'Personal expenses', 'Travel insurance'],
    },
  ]

  for (const pkg of packages) {
    await prisma.package.upsert({
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
    console.log(`Created: ${pkg.title}`)
  }

  console.log('Seeding complete! 6 packages added.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
