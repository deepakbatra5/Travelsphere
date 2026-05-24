import Image from 'next/image'
import Link from 'next/link'
import { CalendarDaysIcon, ClockIcon, MapPinIcon } from '@heroicons/react/24/outline'

const featuredPost = {
  title: 'Kashmir in 6 Days: Valleys, Houseboats, and Mountain Roads',
  place: 'Srinagar, Gulmarg, Pahalgam',
  date: '24 May 2026',
  readTime: '7 min read',
  image: '/hero_kashmir.png',
  excerpt:
    'A practical route for first-time Kashmir travelers, with the right balance of lake time, snow views, local markets, and relaxed driving days.',
  highlights: ['Dal Lake sunrise shikara ride', 'Gulmarg gondola planning', 'Pahalgam valley day route'],
}

const posts = [
  {
    title: 'Kerala Backwaters: How to Plan a Slow and Scenic Trip',
    place: 'Munnar, Thekkady, Alleppey',
    date: '21 May 2026',
    readTime: '6 min read',
    image: '/hero_kerala.png',
    excerpt:
      'From tea gardens to houseboats, this guide explains how to pace Kerala so every day feels calm, scenic, and memorable.',
    category: 'Nature',
  },
  {
    title: 'Goa Beyond Beaches: Food Streets, Forts, and Sunset Spots',
    place: 'North Goa and South Goa',
    date: '18 May 2026',
    readTime: '5 min read',
    image: '/hero_goa.png',
    excerpt:
      'A polished Goa plan for travelers who want beach time, nightlife, heritage lanes, and quieter coastal corners in one trip.',
    category: 'Coastal',
  },
  {
    title: 'Rajasthan Golden Triangle: A Smart First-Time Route',
    place: 'Delhi, Agra, Jaipur',
    date: '14 May 2026',
    readTime: '8 min read',
    image: '/states/rajasthan.jpg',
    excerpt:
      'The classic route still works beautifully when the sightseeing is timed well and the transfers are kept comfortable.',
    category: 'Heritage',
  },
  {
    title: 'Ladakh Adventure Guide: What to Know Before You Go',
    place: 'Leh, Nubra, Pangong',
    date: '10 May 2026',
    readTime: '9 min read',
    image: '/ladakh-adventure-tour.jpg',
    excerpt:
      'Altitude, permits, road distances, and packing notes for a safer and smoother Ladakh adventure holiday.',
    category: 'Adventure',
  },
  {
    title: 'Char Dham Yatra Planning: Comfort Tips for Families',
    place: 'Uttarakhand',
    date: '6 May 2026',
    readTime: '7 min read',
    image: '/states/uttarakhand_temple_1779312965063.png',
    excerpt:
      'A clear planning guide for families and senior travelers covering route flow, rest days, weather, and essentials.',
    category: 'Pilgrimage',
  },
  {
    title: 'Meghalaya Road Trip: Waterfalls, Caves, and Living Roots',
    place: 'Shillong, Cherrapunji, Dawki',
    date: '2 May 2026',
    readTime: '6 min read',
    image: '/states/meghalaya_waterfall_1779312932673.png',
    excerpt:
      'Build a refreshing northeast itinerary around waterfalls, short hikes, clear rivers, and easy city stays.',
    category: 'Scenic',
  },
]

const planningNotes = [
  'Keep one lighter day after long road transfers.',
  'Choose hotels by route convenience, not only star category.',
  'Book peak-season stays early for Kashmir, Goa, Kerala, and Ladakh.',
  'Match trip pace to the group: family, couple, senior, solo, or friends.',
]

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:py-14">
      <section className="mb-10">
        <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-orange-600">Travel Sphere Blog</p>
        <div className="mt-3 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">Professional trip guides for better holidays</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
              Destination ideas, route plans, seasonal tips, and practical travel notes written for Indian travelers planning family, couple, group, pilgrimage, and adventure tours.
            </p>
          </div>
          <div className="rounded-3xl border border-orange-100 bg-orange-50 p-5">
            <h2 className="text-lg font-extrabold text-slate-900">Planning Notes</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {planningNotes.map((note) => (
                <div key={note} className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm">
                  {note}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12 overflow-hidden rounded-3xl bg-slate-950 text-white shadow-xl">
        <div className="grid lg:grid-cols-[1fr_0.95fr]">
          <div className="relative min-h-[320px]">
            <Image
              src={featuredPost.image}
              alt={featuredPost.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
          </div>
          <div className="p-6 md:p-10">
            <span className="inline-flex rounded-full bg-orange-500 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
              Featured Guide
            </span>
            <h2 className="mt-5 text-3xl font-black tracking-tight md:text-4xl">{featuredPost.title}</h2>
            <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold text-slate-200">
              <span className="inline-flex items-center gap-2">
                <MapPinIcon className="h-4 w-4" />
                {featuredPost.place}
              </span>
              <span className="inline-flex items-center gap-2">
                <CalendarDaysIcon className="h-4 w-4" />
                {featuredPost.date}
              </span>
              <span className="inline-flex items-center gap-2">
                <ClockIcon className="h-4 w-4" />
                {featuredPost.readTime}
              </span>
            </div>
            <p className="mt-5 text-base leading-7 text-slate-200">{featuredPost.excerpt}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {featuredPost.highlights.map((item) => (
                <span key={item} className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white">
                  {item}
                </span>
              ))}
            </div>
            <Link
              href="/packages?search=kashmir"
              className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-extrabold text-slate-950 hover:bg-orange-100"
            >
              Explore Kashmir Packages
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-slate-900">Latest Travel Posts</h2>
            <p className="mt-2 text-sm text-slate-600">Route ideas, timing tips, and destination inspiration.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.title} className="surface-card overflow-hidden rounded-3xl">
              <div className="relative h-56">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
                <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-extrabold text-orange-600 shadow-sm">
                  {post.category}
                </span>
              </div>
              <div className="p-5">
                <div className="flex flex-wrap gap-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="mt-3 text-xl font-black leading-tight text-slate-900">{post.title}</h3>
                <p className="mt-2 text-sm font-semibold text-orange-600">{post.place}</p>
                <p className="mt-3 text-sm leading-6 text-slate-600">{post.excerpt}</p>
                <Link href={`/packages?search=${encodeURIComponent(post.place.split(',')[0].toLowerCase())}`} className="mt-5 inline-flex text-sm font-extrabold text-slate-900 hover:text-orange-600">
                  Find related tours
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
