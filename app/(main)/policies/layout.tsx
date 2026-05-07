import Link from 'next/link'

const policies = [
  { href: '/policies/booking-terms', label: 'Booking Terms & Conditions' },
  { href: '/policies/privacy-policy', label: 'Privacy Policy' },
  { href: '/policies/cancellation-refund', label: 'Cancellation & Refund' },
  { href: '/policies/partner-terms', label: 'Partner Terms & Conditions' },
]

export default function PolicyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col lg:flex-row gap-8">

        {/* Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-24">
            <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide">
              Our Policies
            </h3>
            <nav className="space-y-1">
              {policies.map((p) => (
                <Link
                  key={p.href}
                  href={p.href}
                  className="block px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition"
                >
                  {p.label}
                </Link>
              ))}
            </nav>
            <div className="mt-6 pt-5 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-3">Need help?</p>
              <a
                href="https://wa.me/918603606089"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-green-500 text-white text-center py-2.5 rounded-xl text-sm font-medium hover:bg-green-600 transition"
              >
                💬 WhatsApp Us
              </a>
              <a
                href="tel:+918603606089"
                className="block w-full mt-2 border border-gray-200 text-gray-600 text-center py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
              >
                📞 Call Us
              </a>
            </div>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  )
}
