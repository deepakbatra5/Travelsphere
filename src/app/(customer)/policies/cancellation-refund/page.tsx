import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cancellation & Refund Policy',
  description: 'Travel Sphere cancellation and refund policy — understand your options when plans change.',
}

export default function CancellationRefundPage() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">

      <div className="mb-8 pb-6 border-b border-gray-100">
        <span className="text-xs font-semibold bg-red-100 text-red-600 px-3 py-1 rounded-full">
          Refunds
        </span>
        <h1 className="text-2xl font-bold text-gray-800 mt-3">Cancellation & Refund Policy</h1>
        <p className="text-gray-500 text-sm mt-2">
          Last updated: January 2025 · We understand plans change — here is what you need to know
        </p>
      </div>

      <div className="space-y-8 text-gray-600 text-sm leading-relaxed">

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">1. Cancellation by Customer</h2>
          <p className="mb-4">
            All cancellation requests must be submitted in writing via email to
            deepankumar81c401a1e8@gmail.com with your Booking ID. Verbal cancellations
            will not be accepted. The date of receipt of the written cancellation request
            will be used to calculate the applicable refund.
          </p>

          {/* Refund Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="px-4 py-3 text-left rounded-tl-xl font-semibold">
                    Days Before Travel Date
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">Cancellation Charge</th>
                  <th className="px-4 py-3 text-left rounded-tr-xl font-semibold">Refund Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { days: '30 days or more', charge: 'No charge', refund: '100% refund (minus payment gateway fees)', highlight: false },
                  { days: '22 to 29 days', charge: '25% of total amount', refund: '75% refund', highlight: false },
                  { days: '15 to 21 days', charge: '50% of total amount', refund: '50% refund', highlight: true },
                  { days: '8 to 14 days', charge: '75% of total amount', refund: '25% refund', highlight: false },
                  { days: '7 days or less', charge: '100% of total amount', refund: 'No refund', highlight: false },
                  { days: 'No show', charge: '100% of total amount', refund: 'No refund', highlight: false },
                ].map((row) => (
                  <tr key={row.days} className={row.highlight ? 'bg-orange-50' : 'hover:bg-gray-50'}>
                    <td className="px-4 py-3 font-medium text-gray-700">{row.days}</td>
                    <td className="px-4 py-3 text-red-600 font-medium">{row.charge}</td>
                    <td className="px-4 py-3 text-green-600 font-medium">{row.refund}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-4">
            <p className="text-yellow-800 text-xs">
              <strong>Note:</strong> Payment gateway transaction fees (typically 2–3%) are
              non-refundable in all cases as they are charged by the payment processor.
              Refunds will be processed to the original payment method within 7–10 business days.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">2. Special Cancellation Rules</h2>
          <div className="space-y-4">
            <div className="border border-orange-100 rounded-xl p-4">
              <p className="font-semibold text-gray-700 mb-2">Peak Season Bookings</p>
              <p>
                Bookings during peak seasons (December 20 to January 10, Diwali week, Holi week,
                and school summer holidays in May) are subject to strict no-refund policies
                within 30 days of travel. Please confirm your plans before booking during these periods.
              </p>
            </div>
            <div className="border border-orange-100 rounded-xl p-4">
              <p className="font-semibold text-gray-700 mb-2">Pilgrimage Tours (Char Dham, etc.)</p>
              <p>
                Pilgrimage tours have limited capacity and advance arrangements. Cancellations
                for these tours within 30 days will attract a 50% cancellation charge regardless
                of the standard policy above.
              </p>
            </div>
            <div className="border border-orange-100 rounded-xl p-4">
              <p className="font-semibold text-gray-700 mb-2">Non-Refundable Components</p>
              <p>
                Certain components such as flight tickets, train tickets, special permits
                (Ladakh Inner Line Permit, Rohtang Permit), and pre-booked adventure activities
                are non-refundable once confirmed regardless of when the cancellation is made.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">3. Cancellation by Travel Sphere</h2>
          <p className="mb-3">
            In rare circumstances, Travel Sphere may need to cancel a tour due to:
          </p>
          <ul className="space-y-2 list-none mb-4">
            {[
              'Insufficient number of participants (minimum 8 for group tours)',
              'Natural disasters, extreme weather, or government restrictions',
              'Force majeure events beyond our control',
              'Safety concerns at the destination',
            ].map((item, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-orange-500 font-bold flex-shrink-0 mt-0.5">›</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-green-800">
              <strong>If Travel Sphere cancels:</strong> You will receive a full 100% refund
              of all amounts paid, or the option to reschedule to another date at no extra charge.
              We will notify you at least 7 days before the travel date wherever possible.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">4. Tour Postponement / Rescheduling</h2>
          <ul className="space-y-2 list-none">
            {[
              'One free rescheduling is allowed if requested more than 30 days before the travel date.',
              'Rescheduling requests made within 15 to 30 days of travel will incur a 10% rescheduling fee.',
              'Rescheduling within 15 days of travel is treated as cancellation and cancellation charges apply.',
              'Rescheduling is subject to availability on the requested new date.',
              'Any price difference for the new date must be paid at the time of rescheduling.',
            ].map((item, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-orange-500 font-bold flex-shrink-0 mt-0.5">›</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">5. Refund Process</h2>
          <ul className="space-y-2 list-none">
            {[
              'Refund requests are processed within 2 business days of cancellation confirmation.',
              'Refunds are credited back to the original payment source (credit card, UPI, bank account).',
              'Bank processing time may take an additional 5 to 7 business days after we initiate the refund.',
              'You will receive an email confirmation when the refund has been initiated.',
              'For any refund queries, contact us at deepankumar81c401a1e8@gmail.com with your Booking ID.',
            ].map((item, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-orange-500 font-bold flex-shrink-0 mt-0.5">›</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">6. Travel Insurance Recommendation</h2>
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <p className="text-orange-800">
              We strongly recommend purchasing comprehensive travel insurance that covers
              trip cancellation, medical emergencies, baggage loss, and personal liability.
              Travel insurance can protect you from financial loss in unexpected circumstances.
              Contact us for insurance recommendations suitable for your trip.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">7. Contact for Cancellations</h2>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="font-medium text-gray-700 mb-2">To cancel or reschedule your booking:</p>
            <div className="space-y-1 text-sm">
              <p>📧 Email: deepankumar81c401a1e8@gmail.com (Subject: Cancellation — Booking ID)</p>
              <p>📞 Phone: +91 8603606089 (Mon–Sat, 9AM–7PM)</p>
              <p>💬 WhatsApp: +91 8603606089</p>
              <p className="text-gray-400 mt-2 text-xs">
                Please have your Booking ID ready. Cancellations are effective from the date
                we receive written confirmation, not from the date of verbal request.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}


