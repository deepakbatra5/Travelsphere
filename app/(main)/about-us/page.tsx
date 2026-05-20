import { 
  GlobeAsiaAustraliaIcon, 
  HeartIcon, 
  ShieldCheckIcon, 
  UserGroupIcon 
} from '@heroicons/react/24/outline'

export default function AboutUsPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 px-4 py-24 sm:px-6 lg:px-8 rounded-b-[3rem] shadow-2xl">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:24px_34px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        </div>
        <div className="relative mx-auto max-w-7xl text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-5 py-2 text-sm font-bold uppercase tracking-widest text-orange-400 ring-1 ring-orange-500/30 shadow-lg shadow-orange-500/10">
            Our Story
          </span>
          <h1 className="mt-6 text-5xl font-black tracking-tight text-white md:text-6xl lg:text-7xl">
            Redefining Travel in <span className="bg-gradient-to-r from-orange-400 to-rose-500 bg-clip-text text-transparent">India</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg text-slate-300 leading-relaxed font-medium">
            At Travel Sphere, we believe that traveling is more than just visiting a place. It's about the memories you create, the cultures you experience, and the stories you bring back home.
          </p>
        </div>
      </section>

      {/* Stats / Value Section */}
      <section className="mx-auto -mt-12 max-w-7xl px-4 relative z-10">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-[2rem] bg-white p-8 text-center shadow-xl shadow-slate-200/50 border border-slate-100 transition hover:-translate-y-1">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 mb-4">
              <GlobeAsiaAustraliaIcon className="h-8 w-8" strokeWidth={2} />
            </div>
            <h3 className="text-4xl font-black text-slate-900">50+</h3>
            <p className="mt-2 font-bold text-slate-500 uppercase tracking-wider text-sm">Destinations</p>
          </div>
          <div className="rounded-[2rem] bg-white p-8 text-center shadow-xl shadow-slate-200/50 border border-slate-100 transition hover:-translate-y-1">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 mb-4">
              <UserGroupIcon className="h-8 w-8" strokeWidth={2} />
            </div>
            <h3 className="text-4xl font-black text-slate-900">10k+</h3>
            <p className="mt-2 font-bold text-slate-500 uppercase tracking-wider text-sm">Happy Travelers</p>
          </div>
          <div className="rounded-[2rem] bg-white p-8 text-center shadow-xl shadow-slate-200/50 border border-slate-100 transition hover:-translate-y-1">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 mb-4">
              <ShieldCheckIcon className="h-8 w-8" strokeWidth={2} />
            </div>
            <h3 className="text-4xl font-black text-slate-900">100%</h3>
            <p className="mt-2 font-bold text-slate-500 uppercase tracking-wider text-sm">Safe & Secure</p>
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="mx-auto max-w-7xl px-4 py-24 md:py-32">
        <div className="text-center mb-16">
          <span className="mb-4 inline-block text-sm font-bold uppercase tracking-widest text-slate-400">
            The Leadership
          </span>
          <h2 className="text-4xl font-black text-slate-900 md:text-5xl">Meet The Visionaries</h2>
          <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
            Travel Sphere is the brainchild of two passionate travelers who wanted to make luxury and customized travel reliable, transparent, and accessible to everyone.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12 max-w-5xl mx-auto">
          {/* Founder 1 */}
          <div className="group relative overflow-hidden rounded-[2.5rem] bg-white p-10 shadow-sm border-2 border-transparent transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/20 hover:border-orange-200 text-center">
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 opacity-[0.05] transition-transform duration-700 group-hover:scale-[3.5] group-hover:opacity-10" />
            
            <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-red-500 text-5xl font-black text-white shadow-xl shadow-orange-500/30 mb-8 border-4 border-white ring-4 ring-orange-50">
              DK
            </div>
            <h3 className="text-3xl font-black text-slate-900">Deepak Kumar</h3>
            <p className="text-sm font-bold text-orange-600 uppercase tracking-widest mt-2">Co-Founder & CEO</p>
            <p className="mt-6 text-slate-600 leading-relaxed font-medium">
              With a deep passion for discovering unexplored territories, Deepak drives the vision of Travel Sphere. His focus is on ensuring every traveler gets a highly personalized and seamless experience from booking to returning home.
            </p>
          </div>

          {/* Founder 2 */}
          <div className="group relative overflow-hidden rounded-[2.5rem] bg-white p-10 shadow-sm border-2 border-transparent transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/20 hover:border-blue-200 text-center">
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-blue-400 to-cyan-600 opacity-[0.05] transition-transform duration-700 group-hover:scale-[3.5] group-hover:opacity-10" />
            
            <div className="mx-auto flex h-36 w-36 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 text-5xl font-black text-white shadow-xl shadow-blue-500/30 mb-8 border-4 border-white ring-4 ring-blue-50">
              HR
            </div>
            <h3 className="text-3xl font-black text-slate-900">Harsh Raj</h3>
            <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mt-2">Co-Founder & COO</p>
            <p className="mt-6 text-slate-600 leading-relaxed font-medium">
              Harsh is the operational powerhouse behind Travel Sphere. He ensures that our partnerships with local guides and hotels are top-notch, guaranteeing the highest quality and safety standards for all our clients across the globe.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="rounded-[3rem] bg-gradient-to-br from-slate-900 to-slate-800 p-12 md:p-20 text-center shadow-2xl relative overflow-hidden border border-slate-700">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full bg-white/10 mb-8 backdrop-blur-sm border border-white/20">
              <HeartIcon className="h-10 w-10 text-rose-400" strokeWidth={2} />
            </div>
            <h2 className="text-4xl font-black text-white md:text-5xl mb-8">Our Mission</h2>
            <p className="max-w-4xl mx-auto text-lg md:text-2xl text-slate-300 leading-relaxed font-medium">
              To inspire and empower people to explore the world with zero hassle. We aim to break down the complexities of travel planning by offering meticulously crafted itineraries, transparent pricing, and unparalleled 24/7 on-ground support. Your journey is our responsibility.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
