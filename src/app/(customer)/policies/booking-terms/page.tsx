import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Booking Terms & Conditions',
  description: 'Read Travel Sphere booking terms and conditions before making a reservation.',
}

export default function BookingTermsPage() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">

      {/* Header */}
      <div className="mb-8 pb-6 border-b border-gray-100">
        <span className="text-xs font-semibold bg-orange-100 text-orange-600 px-3 py-1 rounded-full">
          Legal
        </span>
        <h1 className="text-2xl font-bold text-gray-800 mt-3">Booking Terms & Conditions</h1>
        <p className="text-gray-500 text-sm mt-2">
          Last updated: January 2025 · Effective for all bookings made through Travel Sphere
        </p>
      </div>

      <div className="prose prose-gray max-w-none space-y-8 text-gray-600 text-sm leading-relaxed">

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">1. Agreement to Terms</h2>
          <p>
            By booking any tour package with Travel Sphere (travelsphere.sbs), you agree to be bound by
            these Terms and Conditions. These terms constitute a legally binding agreement between you
            (the traveler) and Travel Sphere. Please read them carefully before making any booking.
          </p>
          <p className="mt-2">
            Travel Sphere is a travel company based in Amritsar, Punjab, India, providing curated
            domestic and international tour packages. We act as a tour organizer and coordinator
            between travelers and service providers such as hotels, transport companies, and
            local guides.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">2. Booking Process</h2>
          <ul className="space-y-2 list-none">
            {[
              'A booking is confirmed only after receipt of the required advance payment and written confirmation from Travel Sphere.',
              'The booking confirmation will be sent to the registered email address within 24 hours of payment.',
              'All bookings are subject to availability at the time of confirmation.',
              'Travel Sphere reserves the right to decline any booking without providing reasons.',
              'Any changes to confirmed bookings must be requested in writing via email at least 15 days before the travel date.',
              'Travel Sphere will make best efforts to accommodate changes but cannot guarantee them.',
            ].map((item, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-orange-500 font-bold flex-shrink-0 mt-0.5">›</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">3. Payment Terms</h2>
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-4">
            <p className="font-semibold text-gray-800 text-sm mb-2">Payment Schedule</p>
            <div className="space-y-2">
              {[
                { label: 'At booking', value: '25% advance payment required' },
                { label: '30 days before travel', value: '50% of total amount' },
                { label: '15 days before travel', value: '100% full payment due' },
              ].map((row) => (
                <div key={row.label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{row.label}</span>
                  <span className="font-medium text-gray-700">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
          <ul className="space-y-2 list-none">
            {[
              'All prices are quoted in Indian Rupees (INR) and are inclusive of applicable taxes unless stated otherwise.',
              'Payments can be made via Razorpay (credit/debit card, UPI, net banking) or direct bank transfer.',
              'Travel Sphere uses secure payment gateways. We do not store your payment card information.',
              'In case of price revisions due to government levies, fuel surcharges, or currency fluctuations, the difference will be communicated and collected before travel.',
              'Invoices will be issued after full payment is received.',
            ].map((item, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-orange-500 font-bold flex-shrink-0 mt-0.5">›</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">4. Traveler Responsibilities</h2>
          <ul className="space-y-2 list-none">
            {[
              'Travelers must carry valid government-issued photo ID (Aadhaar, Passport, Voter ID) at all times during the tour.',
              'For international tours, a valid passport with at least 6 months validity is mandatory.',
              'Travelers are responsible for obtaining any required visas, travel insurance, and health documents.',
              'Any medical conditions, dietary requirements, or special needs must be communicated at the time of booking.',
              'Travel Sphere is not responsible for any consequences arising from failure to carry required documents.',
              'Travelers must follow the scheduled itinerary and instructions of the tour guide. Travel Sphere is not liable for delays or losses due to non-compliance.',
              'Travelers are responsible for the safety of their personal belongings throughout the tour.',
            ].map((item, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-orange-500 font-bold flex-shrink-0 mt-0.5">›</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">5. Itinerary Changes</h2>
          <p>
            Travel Sphere reserves the right to alter, amend, or cancel any itinerary, tour, or
            accommodation due to circumstances beyond our control including but not limited to:
          </p>
          <ul className="space-y-2 list-none mt-3">
            {[
              'Natural disasters, floods, landslides, or extreme weather conditions',
              'Government orders, political unrest, or civil disturbances',
              'Road closures, strikes, or transportation disruptions',
              'Insufficient number of participants for group tours (minimum 8 persons)',
              'Force majeure events including pandemics or public health emergencies',
            ].map((item, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-orange-500 font-bold flex-shrink-0 mt-0.5">›</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3">
            In such cases, Travel Sphere will offer an alternative tour of equivalent value or a full
            refund. No additional compensation will be provided beyond the refund of amounts paid.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">6. Liability Limitations</h2>
          <ul className="space-y-2 list-none">
            {[
              'Travel Sphere acts as an organizer and is not responsible for the negligence of third-party service providers including airlines, hotels, and transport operators.',
              'Travel Sphere is not liable for any injury, illness, death, property damage, or financial loss arising from participation in a tour.',
              'We strongly recommend all travelers purchase comprehensive travel insurance covering medical emergencies, trip cancellation, and baggage loss.',
              'Travel Sphere\'s maximum liability in any case shall not exceed the total amount paid by the traveler for the tour.',
              'Travel Sphere is not responsible for delays or cancellations caused by third parties or force majeure.',
            ].map((item, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-orange-500 font-bold flex-shrink-0 mt-0.5">›</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">7. Governing Law</h2>
          <p>
            These Terms and Conditions are governed by the laws of India. Any disputes shall be
            subject to the exclusive jurisdiction of the courts in Amritsar, Punjab, India.
            Travel Sphere reserves the right to modify these terms at any time without prior notice.
            The latest version will always be available on our website.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">8. Contact for Queries</h2>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="font-medium text-gray-700 mb-2">Travel Sphere</p>
            <p>📍 Amritsar, Punjab, India</p>
            <p>📞 +91 8603606089</p>
            <p>📧 deepankumar81c401a1e8@gmail.com</p>
            <p>🌐 travelsphere.sbs</p>
          </div>
        </section>

      </div>
    </div>
  )
}


