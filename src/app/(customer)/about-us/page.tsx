import { prisma } from '@/lib/db'
import Link from 'next/link'
import Image from 'next/image'
import { 
  GlobeAsiaAustraliaIcon, 
  ShieldCheckIcon, 
  UserGroupIcon,
  HeartIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

const FALLBACK_TEAM_MEMBERS = [
  {
    id: 'fallback-deepak',
    name: 'Deepak Kumar',
    role: 'Founder & CEO',
    moto: 'To inspire every Indian to explore the world with absolute trust and zero hassle.',
    linkedin: 'https://www.linkedin.com/in/deepakumar04/',
    imageUrl: '/images/team/deepak.png',
    order: 1
  },
  {
    id: 'fallback-harsh',
    name: 'Harsh Raj',
    role: 'Co-Founder & Operations Head',
    moto: 'Building the strongest local partner network to guarantee 100% safety and premium comfort for every traveler.',
    linkedin: 'https://www.linkedin.com/in/harshraj04/',
    imageUrl: '/images/team/harsh.png',
    order: 2
  },
  {
    id: 'fallback-nikhil',
    name: 'Nikhil Singhal',
    role: 'Chief Technology Officer (CTO)',
    linkedin: 'https://www.linkedin.com/in/nikhil-singhal04/',
    moto: 'Powering smart travel with cutting-edge tech and seamless itineraries.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    order: 3
  },
  {
    id: 'fallback-pratik',
    name: 'Pratik Kumar',
    role: 'Head of Marketing & Strategy',
    linkedin: 'https://www.linkedin.com/in/pratik70/',
    moto: 'Connecting people with their dream destinations through authentic stories.',
    imageUrl: '/images/team/pratik.png',
    order: 4
  },
  {
    id: 'fallback-abhishek',
    name: 'Abhishek Dixit',
    role: 'Head of Customer Experience',
    linkedin: 'https://www.linkedin.com/in/abhishek-dixitt-/',
    moto: 'Ensuring 24/7 support so that every trip with us is completely memorable.',
    imageUrl: '/images/team/abhishek.png',
    order: 5
  }
]

export const dynamic = 'force-dynamic'

export default async function AboutUsPage() {
  let teamMembers = []
  
  try {
    // Query all team members from the PostgreSQL database
    teamMembers = await prisma.teamMember.findMany({
      orderBy: { order: 'asc' }
    })
    
    // If the database has no seeded team members, use the fallback list
    if (!teamMembers || teamMembers.length === 0) {
      teamMembers = FALLBACK_TEAM_MEMBERS
    }
  } catch (error) {
    console.error('Failed to load team members from database, using fallback data:', error)
    teamMembers = FALLBACK_TEAM_MEMBERS
  }

  // Separate the top two leaders (Deepak and Harsh) from the rest for a clean layout
  const topLeaders = teamMembers.filter(m => m.order <= 2)
  const generalTeam = teamMembers.filter(m => m.order > 2)

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-16 transition-colors">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 px-4 py-24 sm:px-6 lg:px-8 rounded-b-[3.5rem] shadow-2xl">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:24px_34px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        </div>
        <div className="relative mx-auto max-w-7xl text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-5 py-2 text-sm font-bold uppercase tracking-widest text-orange-400 ring-1 ring-orange-500/30 shadow-lg shadow-orange-500/10">
            About Travel Sphere
          </span>
          <h1 className="mt-6 text-5xl font-black tracking-tight text-white md:text-6xl lg:text-7xl">
            Redefining Travel in <span className="bg-gradient-to-r from-orange-400 to-rose-500 bg-clip-text text-transparent">India</span>
          </h1>
          <p className="mx-auto mt-8 max-w-3xl text-lg text-slate-300 leading-relaxed font-medium">
            At Travel Sphere, we believe that traveling is not just about visiting destinations, but about the profound stories and connections we make along the way. Our mission is to eliminate the stress of planning by providing fully transparent pricing, 24/7 on-ground assistance, and curated itineraries that reflect your dreams. From spiritual Yatras to remote high-altitude adventures, we align our enthusiasm with your curiosity to craft worry-free travel memories of a lifetime.
          </p>
        </div>
      </section>

      {/* Value Counters / Trust Section */}
      <section className="mx-auto -mt-12 max-w-7xl px-4 relative z-10">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-[2rem] bg-white dark:bg-slate-900 p-8 text-center shadow-xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-100 dark:border-slate-800 transition hover:-translate-y-1">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 mb-4">
              <GlobeAsiaAustraliaIcon className="h-8 w-8" strokeWidth={2} />
            </div>
            <h3 className="text-4xl font-black text-slate-900 dark:text-white">50+</h3>
            <p className="mt-2 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-sm">Destinations</p>
          </div>
          <div className="rounded-[2rem] bg-white dark:bg-slate-900 p-8 text-center shadow-xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-100 dark:border-slate-800 transition hover:-translate-y-1">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 mb-4">
              <UserGroupIcon className="h-8 w-8" strokeWidth={2} />
            </div>
            <h3 className="text-4xl font-black text-slate-900 dark:text-white">10k+</h3>
            <p className="mt-2 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-sm">Happy Travelers</p>
          </div>
          <div className="rounded-[2rem] bg-white dark:bg-slate-900 p-8 text-center shadow-xl shadow-slate-200/50 dark:shadow-black/20 border border-slate-100 dark:border-slate-800 transition hover:-translate-y-1">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 mb-4">
              <ShieldCheckIcon className="h-8 w-8" strokeWidth={2} />
            </div>
            <h3 className="text-4xl font-black text-slate-900 dark:text-white">100%</h3>
            <p className="mt-2 font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-sm">Safe & Secure</p>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:py-28">
        <div className="text-center mb-16">
          <span className="mb-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-450 dark:text-slate-500">
            <SparklesIcon className="h-4 w-4 text-orange-500" />
            The Leadership
          </span>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white md:text-5xl">Meet The Visionaries</h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Travel Sphere is guided by a collective enthusiasm to simplify travel planning. Meet our founding leaders and team dedicated to making your travel seamless.
          </p>
        </div>

        {/* Primary Leaders (Deepak & Harsh) */}
        {topLeaders.length > 0 && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12 max-w-5xl mx-auto mb-16">
            {topLeaders.map((member) => (
              <div 
                key={member.id} 
                className="group relative overflow-hidden rounded-[2.5rem] bg-white dark:bg-slate-900 p-10 shadow-md border-2 border-transparent transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10 hover:border-orange-200 dark:hover:border-slate-800 text-center flex flex-col items-center"
              >
                <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-orange-400 to-rose-600 opacity-[0.03] transition-transform duration-700 group-hover:scale-[3.5] group-hover:opacity-[0.06]" />
                
                {/* Profile Image container */}
                <div className="relative h-36 w-36 mb-6 rounded-full overflow-hidden border-4 border-white dark:border-slate-850 ring-4 ring-orange-50 dark:ring-orange-950/30 shadow-lg">
                  {member.imageUrl ? (
                    <img 
                      src={member.imageUrl} 
                      alt={member.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-4xl font-black text-white">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                </div>

                <h3 className="text-2xl font-black text-slate-900 dark:text-white">{member.name}</h3>
                <p className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest mt-1.5">{member.role}</p>
                
                <p className="mt-5 text-slate-600 dark:text-slate-400 leading-relaxed font-medium italic grow text-sm">
                  "{member.moto}"
                </p>

                <a 
                  href={member.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-950/30 px-4 py-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  LinkedIn
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Secondary Leaders (Nikhil, Pratik, Abhishek) */}
        {generalTeam.length > 0 && (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            {generalTeam.map((member) => (
              <div 
                key={member.id} 
                className="group relative overflow-hidden rounded-[2rem] bg-white dark:bg-slate-900 p-8 shadow-sm border border-slate-100 dark:border-slate-800 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:border-slate-200 dark:hover:border-slate-700 text-center flex flex-col items-center"
              >
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br from-blue-400 to-cyan-600 opacity-[0.02] transition-transform duration-700 group-hover:scale-[3] group-hover:opacity-[0.05]" />
                
                {/* Profile Image container */}
                <div className="relative h-28 w-28 mb-5 rounded-full overflow-hidden border-2 border-white dark:border-slate-850 ring-4 ring-slate-50 dark:ring-slate-950/20 shadow-md">
                  {member.imageUrl ? (
                    <img 
                      src={member.imageUrl} 
                      alt={member.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-blue-400 to-cyan-600 flex items-center justify-center text-3xl font-black text-white">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{member.name}</h3>
                <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mt-1">{member.role}</p>
                
                <p className="mt-4 text-slate-600 dark:text-slate-400 leading-relaxed font-medium italic grow text-xs px-2">
                  "{member.moto}"
                </p>

                <a 
                  href={member.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-950/30 px-3.5 py-1.5 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                >
                  <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  LinkedIn
                </a>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Corporate Vision & Motto Line Section */}
      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="rounded-[3rem] bg-gradient-to-br from-slate-900 to-slate-950 p-12 md:p-20 text-center shadow-2xl relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/5 mb-6 border border-white/10">
              <HeartIcon className="h-8 w-8 text-rose-500" strokeWidth={2} />
            </div>
            
            <h2 className="text-3xl font-black text-white md:text-5xl mb-6">Our Vision &amp; Commitment</h2>
            
            <p className="max-w-4xl mx-auto text-base md:text-lg text-slate-300 leading-relaxed font-medium mb-12">
              At Travel Sphere, we are driven by a simple promise: to make travel inspiring, safe, and entirely seamless. We handle the intricacies of itinerary planning, local logistics, and round-the-clock support, giving you the freedom to explore with total peace of mind. Grounded in integrity and transparent service, we are committed to making every trip an unforgettable experience.
            </p>

            <div className="inline-block border-t border-white/20 pt-8 max-w-2xl w-full">
              <p className="text-xs uppercase tracking-widest text-orange-400 font-bold mb-2">Our Company Motto</p>
              <h3 className="text-xl md:text-3xl font-black text-white tracking-tight leading-tight">
                "Your journey, our responsibility. Crafting worry-free memories of a lifetime."
              </h3>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
