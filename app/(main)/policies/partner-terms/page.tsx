import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Partner Terms & Conditions',
  description: 'Travel Sphere partner and agent terms — commission structure, responsibilities, and agreement.',
}

export default function PartnerTermsPage() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">

      <div className="mb-8 pb-6 border-b border-gray-100">
        <span className="text-xs font-semibold bg-purple-100 text-purple-600 px-3 py-1 rounded-full">
          Partners & Agents
        </span>
        <h1 className="text-2xl font-bold text-gray-800 mt-3">Partner Terms & Conditions</h1>
        <p className="text-gray-500 text-sm mt-2">
          Last updated: January 2025 · For registered Travel Sphere agents and business partners
        </p>
      </div>

      <div className="space-y-8 text-gray-600 text-sm leading-relaxed">

        <section>
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
            <p className="text-purple-800">
              <strong>Interested in becoming a Travel Sphere partner?</strong> Register as an agent
              and earn 10% commission on every tour you complete.
              <Link href="/agent-register" className="text-orange-500 font-medium ml-1 hover:underline">
                Apply Now →
              </Link>
            </p>
          </div>

          <h2 className="text-lg font-bold text-gray-800 mb-3">1. Partner Agreement</h2>
          <p>
            This Partner Terms and Conditions agreement governs the relationship between
            Travel Sphere and its registered travel agents, sub-agents, and business partners
            (collectively referred to as "Partners"). By registering as a partner on travelsphere.sbs,
            you agree to be bound by these terms in addition to our general Booking Terms and Conditions.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">2. Partner Eligibility</h2>
          <ul className="space-y-2 list-none">
            {[
              'Partners must be at least 18 years of age at the time of registration.',
              'Partners must provide accurate and complete information during registration including identity proof.',
              'Partners must have a valid mobile number and email address for communication.',
              'Travel experience or knowledge of Indian tourist destinations is preferred but not mandatory.',
              'Partners must have the legal right to work and conduct business in India.',
              'Travel Sphere reserves the right to reject any partner application without providing reasons.',
              'Approved partners will receive a confirmation email within 48 hours of application review.',
            ].map((item, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-orange-500 font-bold flex-shrink-0 mt-0.5">›</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">3. Commission Structure</h2>
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-4">
            <p className="font-bold text-green-800 text-base mb-3">Commission Rate: 10% per completed tour</p>
            <div className="space-y-2 text-sm">
              {[
                { label: 'Commission Rate', value: '10% of total customer booking amount' },
                { label: 'Example', value: 'Customer pays Rs 28,999 → Your commission: Rs 2,899' },
                { label: 'Payment Timing', value: 'After tour completion and customer confirmation' },
                { label: 'Payment Method', value: 'Bank transfer or UPI within 7 business days' },
                { label: 'Minimum Payout', value: 'Rs 500 (commissions below this accumulate)' },
              ].map((row) => (
                <div key={row.label} className="flex gap-3">
                  <span className="text-green-600 font-medium w-36 flex-shrink-0">{row.label}</span>
                  <span className="text-green-800">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
          <ul className="space-y-2 list-none">
            {[
              'Commission is calculated on the base tour package price excluding any add-ons or upgrades arranged independently.',
              'No commission is payable for cancelled or refunded bookings.',
              'Travel Sphere reserves the right to revise commission rates with 30 days notice to active partners.',
              'Commission disputes must be raised within 15 days of payment via email.',
            ].map((item, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-orange-500 font-bold flex-shrink-0 mt-0.5">›</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">4. Partner Responsibilities</h2>
          <ul className="space-y-2 list-none">
            {[
              'Partners must treat all customers with courtesy, professionalism, and respect at all times.',
              'Partners must not misrepresent Travel Sphere packages, prices, or services to customers.',
              'Partners must report any customer complaints or incidents to Travel Sphere management within 24 hours.',
              'Partners must maintain confidentiality of customer personal data and must not share it with unauthorized third parties.',
              'Partners assigned to tours must arrive on time and prepared for all departure points.',
              'Partners must follow the approved itinerary and contact Travel Sphere before making any changes.',
              'Partners must carry valid ID proof at all times during tour operations.',
              'Partners must not accept any additional payments directly from customers beyond the approved tour package price.',
              'Partners must keep their profile information up to date including availability and preferred tour types.',
            ].map((item, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-orange-500 font-bold flex-shrink-0 mt-0.5">›</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">5. Tour Assignment Process</h2>
          <ul className="space-y-2 list-none">
            {[
              'Tour assignments are made by Travel Sphere admin based on partner track record, ratings, availability, and tour preferences.',
              'Partners will receive email and WhatsApp notification when assigned to a booking.',
              'Partners must confirm acceptance of the assignment within 4 hours of notification.',
              'Failure to confirm within 4 hours may result in reassignment to another partner.',
              'Partners may request to be removed from a specific assignment with at least 48 hours notice and valid reason.',
              'Repeated last-minute refusals may affect partner rating and future assignment priority.',
            ].map((item, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-orange-500 font-bold flex-shrink-0 mt-0.5">›</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">6. Partner Rating System</h2>
          <p className="mb-3">
            Travel Sphere operates a transparent rating system to ensure quality of service:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="px-4 py-3 text-left rounded-tl-xl font-semibold">Rating</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-left rounded-tr-xl font-semibold">Effect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { rating: '4.5 – 5.0', status: 'Top Partner', effect: 'Priority assignment, featured profile' },
                  { rating: '3.5 – 4.4', status: 'Active Partner', effect: 'Regular assignment based on availability' },
                  { rating: '2.5 – 3.4', status: 'Under Review', effect: 'Reduced assignments, performance review' },
                  { rating: 'Below 2.5', status: 'Suspended', effect: 'Account suspended pending review' },
                ].map((row) => (
                  <tr key={row.rating} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-700">{row.rating}</td>
                    <td className="px-4 py-3">{row.status}</td>
                    <td className="px-4 py-3 text-gray-500">{row.effect}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">7. Prohibited Activities</h2>
          <p className="mb-3 text-red-600 font-medium">
            The following activities will result in immediate termination of the partner account:
          </p>
          <ul className="space-y-2 list-none">
            {[
              'Soliciting customers to book directly, bypassing Travel Sphere systems',
              'Sharing customer contact information with competitors or unauthorized parties',
              'Accepting undisclosed commissions or payments from customers or third parties',
              'Misrepresenting your qualifications, experience, or Travel Sphere affiliation',
              'Engaging in any fraudulent, illegal, or unethical activity',
              'Harassing, discriminating against, or mistreating customers',
              'Sharing login credentials or platform access with unauthorized persons',
            ].map((item, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-red-500 font-bold flex-shrink-0 mt-0.5">✗</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">8. Termination of Partnership</h2>
          <ul className="space-y-2 list-none">
            {[
              'Either party may terminate the partnership with 30 days written notice.',
              'Travel Sphere may terminate immediately for breach of these terms without notice.',
              'Upon termination, all pending commissions for completed tours will be paid within 30 days.',
              'No commission is payable for tours not yet completed at the time of termination.',
              'Partner must immediately cease representing themselves as a Travel Sphere partner.',
            ].map((item, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-orange-500 font-bold flex-shrink-0 mt-0.5">›</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">9. Join Our Partner Network</h2>
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl p-5">
            <h3 className="font-bold text-lg mb-2">Earn with Travel Sphere</h3>
            <p className="text-orange-100 text-sm mb-4">
              Join our growing network of travel agents across India. Earn 10% commission
              on every tour you complete. No targets, no pressure — work at your own pace.
            </p>
            <Link
              href="/agent-register"
              className="inline-block bg-white text-orange-600 font-bold px-5 py-2.5 rounded-xl hover:bg-orange-50 transition text-sm"
            >
              Register as Partner →
            </Link>
          </div>
        </section>

      </div>
    </div>
  )
}
