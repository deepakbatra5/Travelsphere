import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-950 text-slate-100">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <h2 className="mb-3 inline-flex rounded-full border border-cyan-300/30 bg-cyan-400/10 px-4 py-1 text-lg font-bold uppercase tracking-[0.18em] text-cyan-100">
            Travel Sphere
          </h2>
          <p className="text-sm leading-relaxed text-slate-300">
            India&apos;s trusted travel company. Curated tours for families, couples,
            groups, and solo travelers since 2013.
          </p>
        </div>

        <div>
          <h3 className="mb-3 font-semibold text-white">Quick Links</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li><Link href="/packages" className="hover:text-orange-300">All Packages</Link></li>
            <li><Link href="/packages?category=SOLO" className="hover:text-orange-300">Solo Trips</Link></li>
            <li><Link href="/packages?category=FAMILY" className="hover:text-orange-300">Family Tours</Link></li>
            <li><Link href="/packages?category=PILGRIMAGE" className="hover:text-orange-300">Pilgrimage Tours</Link></li>
            <li><Link href="/packages?category=ADVENTURE" className="hover:text-orange-300">Adventure Tours</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-semibold text-white">Contact Us</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>Phone: +91 8603606089</li>
            <li>Email: deepankumar81c401a1e8@gmail.com</li>
            <li>Address: Amritsar, Punjab, India</li>
            <li>Hours: Mon-Sat 9AM to 7PM</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 font-semibold text-white">Chat With Us</h3>
          <p className="mb-4 text-sm text-slate-300">
            Get instant help from our travel experts.
          </p>
          <a
            href="https://wa.me/918603606089"
            target="_blank"
            rel="noreferrer"
            className="inline-block rounded-full bg-linear-to-r from-emerald-500 to-teal-500 px-5 py-2 text-sm font-semibold text-white hover:from-emerald-600 hover:to-teal-600"
          >
            WhatsApp Us
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-7xl border-t border-slate-800 px-4 py-5 text-center text-xs text-slate-400">
        {new Date().getFullYear()} Travel Sphere. All rights reserved.
      </div>
    </footer>
  )
}
