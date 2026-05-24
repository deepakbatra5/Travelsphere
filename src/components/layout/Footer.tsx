'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Footer() {
  const [agentUrl, setAgentUrl] = useState('https://agent.travelsphere.sbs')

  useEffect(() => {
    if (window.location.hostname.includes('localhost')) {
      setAgentUrl('http://agent.localhost:3000')
    }
  }, [])

  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 mt-16">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

        {/* Brand */}
        <div>
          <h2 className="text-white text-xl font-bold mb-3">Travel Sphere</h2>
          <p className="text-sm leading-relaxed text-gray-400">
            India's trusted travel company. Curated tours for families,
            couples, groups and solo travelers since 2013.
          </p>
          <div className="mt-4 space-y-1 text-sm">
            <p>📞 +91 8603606089</p>
            <p>📧 deepankumar81c401a1e8@gmail.com</p>
            <p>📍 Amritsar, Punjab, India</p>
            <p>🕐 Mon–Sat: 9AM to 7PM</p>
          </div>
          <div className="mt-4">
            <a
              href="https://wa.me/918603606089"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-green-600 transition"
            >
              💬 WhatsApp Us
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/tours" className="hover:text-orange-400 transition">
                All Packages
              </Link>
            </li>
            <li>
              <Link href="/tours?category=FAMILY" className="hover:text-orange-400 transition">
                Family Tours
              </Link>
            </li>
            <li>
              <Link href="/tours?category=PILGRIMAGE" className="hover:text-orange-400 transition">
                Pilgrimage Tours
              </Link>
            </li>
            <li>
              <Link href="/tours?category=ADVENTURE" className="hover:text-orange-400 transition">
                Adventure Tours
              </Link>
            </li>
            <li>
              <Link href="/tours?category=GROUP" className="hover:text-orange-400 transition">
                Group Tours
              </Link>
            </li>
            <li>
              <a href={agentUrl} className="hover:text-orange-400 transition">
                Business
              </a>
            </li>
            <li>
              <Link href="/about-us" className="hover:text-orange-400 transition">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/reviews" className="hover:text-orange-400 transition">
                Reviews
              </Link>
            </li>
          </ul>
        </div>

        {/* Our Company Policies */}
        <div>
          <h3 className="text-white font-semibold mb-4">Our Company Policies</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/policies/booking-terms" className="hover:text-orange-400 transition flex items-center gap-1.5">
                <span className="text-orange-400 text-xs">›</span>
                Booking Terms &amp; Conditions
              </Link>
            </li>
            <li>
              <Link href="/policies/privacy-policy" className="hover:text-orange-400 transition flex items-center gap-1.5">
                <span className="text-orange-400 text-xs">›</span>
                Company Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/policies/cancellation-refund" className="hover:text-orange-400 transition flex items-center gap-1.5">
                <span className="text-orange-400 text-xs">›</span>
                Cancellation &amp; Refund Policy
              </Link>
            </li>
            <li>
              <Link href="/policies/partner-terms" className="hover:text-orange-400 transition flex items-center gap-1.5">
                <span className="text-orange-400 text-xs">›</span>
                Partner Terms &amp; Conditions
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-orange-400 transition flex items-center gap-1.5">
                <span className="text-orange-400 text-xs">›</span>
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Popular Destinations */}
        <div>
          <h3 className="text-white font-semibold mb-4">Popular Destinations</h3>
          <ul className="space-y-2 text-sm">
            {[
              { label: 'Ladakh', query: 'ladakh' },
              { label: 'Kashmir', query: 'kashmir' },
              { label: 'Kerala', query: 'kerala' },
              { label: 'Goa', query: 'goa' },
              { label: 'Rajasthan', query: 'rajasthan' },
              { label: 'Char Dham', query: 'char-dham' },
            ].map((dest) => (
              <li key={dest.query}>
                <Link
                  href={`/tours?search=${dest.query}`}
                  className="hover:text-orange-400 transition flex items-center gap-1.5"
                >
                  <span className="text-orange-400 text-xs">›</span>
                  {dest.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 mt-10 pt-6 border-t border-gray-700">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Travel Sphere. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/policies/privacy-policy" className="hover:text-gray-300 transition">Privacy Policy</Link>
            <span>·</span>
            <Link href="/policies/booking-terms" className="hover:text-gray-300 transition">Terms</Link>
            <span>·</span>
            <Link href="/policies/cancellation-refund" className="hover:text-gray-300 transition">Refund Policy</Link>
            <span>·</span>
            <Link href="/contact" className="hover:text-gray-300 transition">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}


