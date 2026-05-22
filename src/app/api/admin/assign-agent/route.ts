import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import nodemailer from 'nodemailer'
import { prisma } from '@/lib/db'
import { authOptions } from '@/lib/auth'
import { getAgentPayout, getCompanyCommission } from '@/lib/commission'

async function notifyAgent(agentId: string, bookingId: string, agentPayout: number, companyCommission: number) {
  const [agent, booking] = await Promise.all([
    prisma.agent.findUnique({ where: { id: agentId }, include: { user: true } }),
    prisma.booking.findUnique({ where: { id: bookingId }, include: { user: true, package: true } }),
  ])

  if (!agent || !booking || !process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) return

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || 587),
    secure: false,
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  })

  await transporter.sendMail({
    from: `"Travel Sphere" <${process.env.EMAIL_USER}>`,
    to: agent.user.email,
    subject: `New Assignment: ${booking.package.title}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:30px;">
        <h2 style="color:#f97316;">New Tour Assignment</h2>
        <p>Dear <strong>${agent.user.name}</strong>,</p>
        <p>You have been assigned to a confirmed booking.</p>
        <table style="width:100%;border-collapse:collapse;margin:20px 0;font-size:14px;">
          <tr><td style="padding:8px 0;color:#6b7280;">Package</td><td style="font-weight:600;">${booking.package.title}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;">Destination</td><td style="font-weight:600;">${booking.package.destination}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;">Customer</td><td style="font-weight:600;">${booking.user.name}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;">Travel Date</td><td style="font-weight:600;">${new Date(booking.travelDate).toLocaleDateString('en-IN')}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;">Travellers</td><td style="font-weight:600;">${booking.travellers}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;">Travel Sphere Share</td><td style="font-weight:600;">Rs ${companyCommission.toLocaleString('en-IN')}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;">Your Payout</td><td style="font-weight:700;color:#16a34a;">Rs ${agentPayout.toLocaleString('en-IN')}</td></tr>
        </table>
      </div>
    `,
  })
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { bookingId, bookingIds, agentId } = await req.json()
    const ids = Array.isArray(bookingIds) ? bookingIds : bookingId ? [bookingId] : []

    if (ids.length === 0) {
      return NextResponse.json({ error: 'No bookings selected' }, { status: 400 })
    }

    const agent = await prisma.agent.findUnique({ where: { id: agentId } })
    if (!agent || agent.status !== 'APPROVED') {
      return NextResponse.json({ error: 'Agent is not approved' }, { status: 400 })
    }

    const bookings = await prisma.booking.findMany({ where: { id: { in: ids } } })
    if (bookings.length !== ids.length) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })

    for (const booking of bookings) {
      const agentPayout = getAgentPayout(booking.totalAmount)

      await prisma.bookingAgent.upsert({
        where: { bookingId: booking.id },
        update: { agentId, commission: agentPayout, status: 'ASSIGNED', completedAt: null },
        create: { bookingId: booking.id, agentId, commission: agentPayout },
      })

      notifyAgent(agentId, booking.id, agentPayout, getCompanyCommission(booking.totalAmount)).catch(console.error)
    }

    revalidatePath('/admin/bookings')
    revalidatePath('/admin/agents')
    revalidatePath('/agent')
    revalidatePath('/agent/my-tours')
    revalidatePath('/agent/earnings')

    return NextResponse.json({ message: 'Agent assigned successfully' })
  } catch {
    return NextResponse.json({ error: 'Failed to assign agent' }, { status: 500 })
  }
}
