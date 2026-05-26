import { prisma } from '@/lib/db'

type KnowledgePackage = {
  title: string
  slug: string
  destination: string
  description: string
  price: number
  duration: number
  category: string
  images: string[]
  inclusions: string[]
  exclusions: string[]
  isFeatured?: boolean
}

type KnowledgeReview = {
  rating: number
  comment: string
  createdAt: Date
  user: { name: string | null } | null
  package: { title: string; destination: string } | null
}

function normalizeList(values: unknown, maxItems: number): string[] {
  if (!Array.isArray(values)) return []
  return values
    .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
    .slice(0, maxItems)
}

function toCompactPackageLine(pkg: KnowledgePackage): string {
  const highlights = normalizeList(pkg.inclusions, 3).join('; ') || 'Customizable travel package'
  const exclusions = normalizeList(pkg.exclusions, 2).join('; ')
  const price = `Rs ${pkg.price.toLocaleString('en-IN')}`
  const imageNote = Array.isArray(pkg.images) && pkg.images.filter(Boolean).length > 0 ? 'image available' : 'image missing'

  return [
    `- ${pkg.title}`,
    `slug: ${pkg.slug}`,
    `destination: ${pkg.destination}`,
    `duration: ${pkg.duration} days`,
    `price: ${price}`,
    `category: ${pkg.category}`,
    `featured: ${pkg.isFeatured ? 'yes' : 'no'}`,
    `highlights: ${highlights}`,
    exclusions ? `exclusions: ${exclusions}` : null,
    `media: ${imageNote}`,
  ]
    .filter(Boolean)
    .join(' | ')
}

function toCompactReviewLine(review: KnowledgeReview): string {
  const author = review.user?.name?.trim() || 'Anonymous'
  const destination = review.package?.destination || review.package?.title || 'Travel package'
  const comment = review.comment.trim().replace(/\s+/g, ' ')

  return `- ${author} on ${destination} (${review.rating}/5): ${comment}`
}

function buildBrowseSummary(packages: KnowledgePackage[]): string {
  const destinationHighlights = Array.from(
    new Set(packages.map((pkg) => pkg.destination?.trim()).filter(Boolean))
  ).slice(0, 8)

  return [
    'TOURS / SEARCH / DESTINATION BROWSING:',
    '- Use the tours and search pages to find trips by destination, category, duration, budget, and free-text search.',
    '- Browse results are package cards that surface the title, destination, price, duration, category, and first image.',
    `- Common live destination themes include: ${destinationHighlights.join('; ') || 'the live package catalog'}.`,
    '- When users ask for a destination recommendation, match the package to their budget, travel style, trip length, and seasonality.',
    '',
    'PACKAGE DETAIL PAGE EXPERIENCE:',
    '- Detail pages include a hero image gallery, destination summary, package description, inclusions, exclusions, day-by-day itinerary, FAQ, terms, review highlights, and booking sidebar.',
    '- The booking sidebar shows price, duration, category, destination, and trip-date availability where present.',
    '- Guide users to the detail page when they want itinerary depth, what is included, cancellation terms, or booking next steps.',
  ].join('\n')
}

function buildPackagePageGuidance(): string {
  return [
    'PACKAGE DETAIL PAGE GUIDANCE:',
    '- The detail page tabs cover itinerary, inclusions, FAQ, and terms, so the AI should answer from those sections when a user asks about trip flow or policy.',
    '- FAQs explain booking steps, payment options, cancellation policy, group booking handling, packing advice, and travel insurance guidance.',
    '- Terms cover booking and payment policy, cancellation and refund policy, weather and force majeure, itinerary changes, insurance, health and fitness, liability, and code of conduct.',
  ].join('\n')
}

function buildReviewHighlights(reviews: KnowledgeReview[]): string {
  if (!reviews.length) {
    return [
      'CUSTOMER REVIEW HIGHLIGHTS:',
      '- The website reviews page features Traveller Stories, star ratings, filtering by rating, and a write-a-review flow.',
      '- Common praise themes include smooth planning, transparent pricing, responsive WhatsApp support, and well-organized itineraries.',
    ].join('\n')
  }

  return [
    'CUSTOMER REVIEW HIGHLIGHTS:',
    '- Use these real review themes when summarizing social proof or answering travel-quality questions.',
    ...reviews.slice(0, 6).map(toCompactReviewLine),
  ].join('\n')
}

function buildSiteContentSummary(): string {
  return [
    'BLOG CONTENT:',
    '- Kashmir in 6 Days: best for first-time Kashmir travelers; focus on Srinagar, Gulmarg, Pahalgam, Dal Lake sunrise, gondola planning, and relaxed driving days.',
    '- Kerala Backwaters: how to plan a slow, scenic trip through Munnar, Thekkady, and Alleppey with houseboats and tea gardens.',
    '- Goa Beyond Beaches: food streets, forts, sunset spots, beach time, nightlife, and heritage lanes.',
    '- Rajasthan Golden Triangle: Delhi, Agra, Jaipur is the classic first-time route when transfers and timings are planned well.',
    '- Ladakh Adventure Guide: altitude, permits, road distances, and packing notes for a safer trip.',
    '- Char Dham Planning: comfort tips for families and senior travelers covering route flow, weather, rest days, and essentials.',
    '- Meghalaya Road Trip: waterfalls, caves, living root bridges, and easy city stays.',
    '',
    'HELP / SUPPORT CONTENT:',
    '- Contact the team by WhatsApp at +91 8603606089, call +91 8603606089, or email deepankumar81c401a1e8@gmail.com.',
    '- Support hours are Monday to Saturday, 9AM to 7PM.',
    '- The help page is for general package doubts, booking help, and support requests.',
    '- The contact form accepts name, phone, email, subject, and message, and can include image attachments.',
    '',
    'POLICY CONTENT:',
    '- Privacy policy: Travel Sphere collects name, email, phone, booking details, travel preferences, and limited automatic site data; payments are processed securely through Razorpay; data is retained as needed for service and legal compliance.',
    '- Booking terms: bookings confirm after advance payment; travelers need valid ID; itinerary changes may happen for weather, government rules, or force majeure; jurisdiction is Amritsar, Punjab, India.',
    '- Cancellation and refund policy: written cancellation is required; refunds depend on days before travel, with stricter rules for peak season and pilgrimage tours; gateway fees are non-refundable; refunds usually process in 7–10 business days.',
    '- Partner terms: registered agents can earn 80% of booking amount; Travel Sphere keeps 20%; partners must not misrepresent packages, share data improperly, or bypass the platform.',
  ].join('\n')
}

export async function buildTravelKnowledgeContext() {
  const [packages, packageCount, reviews, enquiryCount, teamCount] = await Promise.all([
    prisma.package.findMany({
      where: { isActive: true },
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
      select: {
        title: true,
        slug: true,
        destination: true,
        description: true,
        price: true,
        duration: true,
        category: true,
        images: true,
        inclusions: true,
        exclusions: true,
        isFeatured: true,
      },
    }),
    prisma.package.count({ where: { isActive: true } }),
    prisma.review.findMany({
      orderBy: [{ createdAt: 'desc' }],
      take: 8,
      select: {
        rating: true,
        comment: true,
        createdAt: true,
        user: { select: { name: true } },
        package: { select: { title: true, destination: true } },
      },
    }),
    prisma.enquiry.count(),
    prisma.teamMember.count().catch(() => 0),
  ])

  const destinationCount = new Set(packages.map((pkg) => pkg.destination)).size
  const reviewCount = reviews.length

  const packageCatalog = packages.map(toCompactPackageLine).join('\n')

  return [
    'TRAVEL SPHERE LIVE KNOWLEDGE BASE',
    'Use this as the authoritative source for all Travel Sphere package recommendations and website facts.',
    '',
    'COMPANY FACTS:',
    `- Travel Sphere | travelsphere.sbs | +91 8603606089 | Amritsar, Punjab, India`,
    `- Active packages: ${packageCount}`,
    `- Destinations covered: ${destinationCount}`,
    `- Customer reviews: ${reviewCount}`,
    `- Enquiries: ${enquiryCount}`,
    `- Team members: ${teamCount}`,
    '',
    'SITE CONTENT TO REFLECT IN ANSWERS:',
    '- Home page highlights featured packages, popular destinations, trending tours, traveller stories, and an AI Trip Planner banner.',
    '- About page focuses on trust, transparent pricing, 24/7 support, and curated itineraries.',
    '- Reviews page is the Traveller Stories section with real customer feedback.',
    '- Blog, help, contact, and policy pages provide official website guidance; use their facts when answering questions about support or rules.',
    '',
    buildSiteContentSummary(),
    '',
    buildBrowseSummary(packages),
    '',
    buildPackagePageGuidance(),
    '',
    buildReviewHighlights(reviews),
    '',
    'CURRENT ACTIVE PACKAGES (recommend the best fit and link them directly):',
    packageCatalog,
  ].join('\n')
}
