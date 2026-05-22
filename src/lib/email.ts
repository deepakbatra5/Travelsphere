import nodemailer from 'nodemailer'

interface BookingEmailPayload {
  id: string
  travelDate: string | Date
  travellers: number
  totalAmount: number
  user: {
    name: string
    email: string
  }
  package: {
    title: string
    destination: string
    duration: number
  }
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT || 587),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export async function sendEmailOtp({
  to,
  name,
  otp,
  expiresMinutes,
}: {
  to: string
  name: string
  otp: string
  expiresMinutes: number
}) {
  await transporter.sendMail({
    from: `"Travel Sphere" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Verify your Travel Sphere account',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:28px;background:#ffffff;">
        <h2 style="color:#f97316;margin:0 0 12px;">Travel Sphere Email Verification</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>Use this OTP to verify your email address:</p>
        <div style="font-size:34px;font-weight:800;letter-spacing:8px;color:#111827;margin:24px 0;">${otp}</div>
        <p>This OTP expires in ${expiresMinutes} minutes.</p>
        <p style="color:#6b7280;font-size:13px;">If you did not create an account, you can ignore this email.</p>
      </div>
    `,
  })
}

export async function sendBookingConfirmationEmail(booking: BookingEmailPayload) {
  const { user, package: pkg, travelDate, travellers, totalAmount, id } = booking

  const formattedDate = new Date(travelDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; background: #f9f9f9; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: white; border-radius: 16px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #f97316, #ea580c); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .body { padding: 30px; }
        .badge { display: inline-block; background: #dcfce7; color: #16a34a; padding: 4px 14px; border-radius: 999px; font-size: 12px; font-weight: bold; margin-bottom: 20px; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f3f4f6; font-size: 14px; }
        .detail-row .label { color: #6b7280; }
        .detail-row .value { font-weight: 600; color: #111827; }
        .total { background: #fff7ed; border-radius: 12px; padding: 16px; margin: 20px 0; display: flex; justify-content: space-between; font-weight: bold; }
        .total .amount { color: #f97316; font-size: 18px; }
        .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; }
        .btn { display: inline-block; background: #22c55e; color: white; padding: 12px 24px; border-radius: 999px; text-decoration: none; font-weight: bold; margin-top: 16px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Travel Sphere</h1>
          <p style="margin: 8px 0 0 0; opacity: 0.9;">Your booking is confirmed!</p>
        </div>
        <div class="body">
          <p>Dear <strong>${user.name}</strong>,</p>
          <p>Thank you for booking with Travel Sphere. Your trip has been confirmed and we are excited to take you on this journey!</p>

          <span class="badge">BOOKING CONFIRMED</span>

          <div class="detail-row">
            <span class="label">Booking ID</span>
            <span class="value">${id.slice(0, 12).toUpperCase()}</span>
          </div>
          <div class="detail-row">
            <span class="label">Package</span>
            <span class="value">${pkg.title}</span>
          </div>
          <div class="detail-row">
            <span class="label">Destination</span>
            <span class="value">${pkg.destination}</span>
          </div>
          <div class="detail-row">
            <span class="label">Travel Date</span>
            <span class="value">${formattedDate}</span>
          </div>
          <div class="detail-row">
            <span class="label">Duration</span>
            <span class="value">${pkg.duration} Days</span>
          </div>
          <div class="detail-row">
            <span class="label">Travellers</span>
            <span class="value">${travellers} Person(s)</span>
          </div>

          <div class="total">
            <span>Total Amount Paid</span>
            <span class="amount">Rs ${totalAmount.toLocaleString('en-IN')}</span>
          </div>

          <p style="font-size: 14px; color: #374151;">Our team will contact you 48 hours before your trip with further details. If you have any questions, please reach out to us.</p>

          <a href="https://wa.me/918603606089" class="btn">Chat on WhatsApp</a>
        </div>
        <div class="footer">
          <p>Travel Sphere | Amritsar, Punjab, India</p>
          <p>Phone: +91 8603606089 | Email: deepankumar81c401a1e8@gmail.com</p>
          <p style="margin-top: 8px;">This is an automated email. Please do not reply directly to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `

  try {
    await transporter.sendMail({
      from: `"Travel Sphere" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Booking Confirmed - ${pkg.title}`,
      html,
    })
    console.log(`Confirmation email sent to ${user.email}`)
  } catch (error) {
    // Do not throw - email failure should not break the booking flow
    console.error('Email sending failed:', error)
  }
}
