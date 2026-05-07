import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Travel Sphere privacy policy — how we collect, use and protect your personal data.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">

      <div className="mb-8 pb-6 border-b border-gray-100">
        <span className="text-xs font-semibold bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
          Privacy
        </span>
        <h1 className="text-2xl font-bold text-gray-800 mt-3">Company Privacy Policy</h1>
        <p className="text-gray-500 text-sm mt-2">
          Last updated: January 2025 · We are committed to protecting your privacy
        </p>
      </div>

      <div className="space-y-8 text-gray-600 text-sm leading-relaxed">

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">1. Introduction</h2>
          <p>
            Travel Sphere ("we", "us", or "our") operates travelsphere.sbs and is committed to
            protecting the personal information of our customers, website visitors, and partners.
            This Privacy Policy explains how we collect, use, store, and protect your data
            when you use our website or services.
          </p>
          <p className="mt-2">
            By using our website or booking a tour, you consent to the data practices described
            in this policy. This policy complies with the Information Technology Act 2000
            and applicable Indian data protection regulations.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">2. Information We Collect</h2>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="font-semibold text-gray-700 mb-2">Information You Provide</p>
              <ul className="space-y-1 list-none">
                {[
                  'Full name, email address, phone number',
                  'Passport/ID details for tour documentation',
                  'Date of birth and gender (for booking purposes)',
                  'Billing address and payment information',
                  'Travel preferences, dietary requirements, medical conditions you choose to share',
                  'Messages and enquiries sent through our contact forms or WhatsApp',
                ].map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-blue-500 flex-shrink-0">›</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="font-semibold text-gray-700 mb-2">Information Collected Automatically</p>
              <ul className="space-y-1 list-none">
                {[
                  'IP address and browser type',
                  'Pages visited and time spent on the website',
                  'Device information (mobile, desktop, operating system)',
                  'Referral source (how you found our website)',
                  'Cookies and session data',
                ].map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-blue-500 flex-shrink-0">›</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">3. How We Use Your Information</h2>
          <ul className="space-y-2 list-none">
            {[
              'To process and confirm your tour bookings',
              'To send booking confirmations, itineraries, and travel documents',
              'To communicate about your tour arrangements and any changes',
              'To process payments securely through our payment gateway',
              'To provide customer support and respond to enquiries',
              'To send promotional offers and travel updates (you can unsubscribe at any time)',
              'To improve our website, services, and user experience',
              'To comply with legal obligations and resolve disputes',
              'To assign appropriate tour guides and agents to your booking',
            ].map((item, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-orange-500 font-bold flex-shrink-0 mt-0.5">›</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">4. Information Sharing</h2>
          <p className="mb-3">
            We do not sell, trade, or rent your personal information to third parties.
            We may share your information only in the following circumstances:
          </p>
          <ul className="space-y-2 list-none">
            {[
              'With hotels, transport providers, and local guides strictly for fulfilling your tour booking',
              'With our payment processor (Razorpay) to complete transactions securely',
              'With travel agents assigned to your booking for coordination purposes',
              'With government authorities if required by law or court order',
              'With our technology service providers (hosting, email) who process data on our behalf under confidentiality agreements',
            ].map((item, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-orange-500 font-bold flex-shrink-0 mt-0.5">›</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">5. Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your personal data:
          </p>
          <ul className="space-y-2 list-none mt-3">
            {[
              'SSL encryption for all data transmitted through our website',
              'Passwords are stored in hashed format using bcrypt — we never store plain text passwords',
              'Payment information is processed directly by Razorpay and never stored on our servers',
              'Access to personal data is restricted to authorized staff only',
              'Regular security audits and updates to our systems',
            ].map((item, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-orange-500 font-bold flex-shrink-0 mt-0.5">›</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">6. Cookies</h2>
          <p>
            Our website uses cookies to improve your browsing experience. Cookies are small
            text files stored on your device. We use:
          </p>
          <ul className="space-y-2 list-none mt-3">
            {[
              'Essential cookies — required for the website to function (login sessions, cart)',
              'Analytics cookies — to understand how visitors use our site (Google Analytics)',
              'Preference cookies — to remember your settings and preferences',
            ].map((item, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-orange-500 font-bold flex-shrink-0 mt-0.5">›</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3">
            You can control cookies through your browser settings. Disabling cookies may
            affect some functionality of the website.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">7. Your Rights</h2>
          <ul className="space-y-2 list-none">
            {[
              'Right to access — request a copy of personal data we hold about you',
              'Right to correction — request correction of inaccurate or incomplete data',
              'Right to deletion — request deletion of your personal data (subject to legal requirements)',
              'Right to opt-out — unsubscribe from marketing emails at any time',
              'Right to data portability — request your data in a portable format',
            ].map((item, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-orange-500 font-bold flex-shrink-0 mt-0.5">›</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3">
            To exercise any of these rights, email us at deepankumar81c401a1e8@gmail.com
            with subject line "Privacy Request". We will respond within 30 days.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">8. Data Retention</h2>
          <p>
            We retain your personal data for as long as necessary to provide our services
            and comply with legal obligations. Booking records are kept for 7 years
            for accounting and legal purposes. You may request deletion of your account
            and non-essential data at any time.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of
            significant changes by email or a prominent notice on our website.
            Continued use of our services after changes constitutes acceptance of the
            updated policy.
          </p>
        </section>

      </div>
    </div>
  )
}
