import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import AIAgent from '@/components/AIAgent'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-[1600px]">{children}</div>
      </main>
      <Footer />

      {/* AI Travel Agent — floating chat button/component */}
      <AIAgent />
    </>
  )
}
