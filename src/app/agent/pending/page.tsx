import Link from 'next/link'

export default function AgentPendingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md rounded-3xl bg-white p-10 text-center shadow-lg">
        <div className="mx-auto w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center p-1.5 shadow-md shadow-orange-500/10 mb-4">
          <img src="/logo-transparent.png" alt="Logo" className="w-full h-full object-contain" />
        </div>
        <h1 className="mb-3 text-2xl font-extrabold text-slate-900">Application Submitted</h1>
        <p className="mb-6 leading-relaxed text-slate-600">
          Your agent application has been received. Our team will review your profile and approve your account within 24 to 48 hours.
        </p>
        <div className="mb-6 rounded-2xl bg-cyan-50 p-4 text-left">
          <h3 className="mb-2 text-sm font-bold text-cyan-700">What happens next?</h3>
          <ul className="space-y-1 text-xs text-cyan-700">
            <li>1. Admin reviews your application</li>
            <li>2. You receive approval</li>
            <li>3. Login and select preferred tours</li>
            <li>4. Admin assigns bookings to you</li>
            <li>5. Receive 80% agent payout per completed tour</li>
          </ul>
        </div>
        <Link href="/" className="block w-full rounded-2xl bg-orange-500 py-3 font-bold text-white hover:bg-orange-600">
          Back to Website
        </Link>
      </div>
    </div>
  )
}


