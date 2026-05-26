import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { prisma } from '@/lib/db'
import { checkRateLimit } from '@/lib/rateLimit'

const isGroq = !!process.env.GROQ_API_KEY
const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY

const openai = new OpenAI({
  apiKey: apiKey,
  baseURL: isGroq ? 'https://api.groq.com/openai/v1' : undefined,
})

const TRIP_PLANNER_SYSTEM_PROMPT = `You are Sphere AI Trip Planner, an expert AI travel consultant for Travel Sphere (travelsphere.sbs), a premium Indian travel company. Your ONLY job is to help customers plan and customize their perfect trip and then collect their contact details so a Travel Sphere expert can follow up.

COMPANY INFORMATION:
- Name: Travel Sphere
- Website: https://travelsphere.sbs
- Phone: +91 8603606089 | WhatsApp: +91 8603606089
- Location: Amritsar, Punjab, India
- Experience: Serving travelers since 2013

YOUR MISSION - TRIP PLANNING CONVERSATION FLOW:
You must guide the customer through planning their trip step by step, then collect contact info to submit to admin. Follow this flow:

STEP 1 — Warm welcome + ask about destination/dream trip
STEP 2 — Ask about travel dates or preferred month and duration  
STEP 3 — Ask about group type (solo/couple/family/friends/corporate) and number of travelers
STEP 4 — Ask about budget range in Indian Rupees
STEP 5 — Ask about interests (beaches, mountains, culture, adventure, pilgrimage, wildlife, food, luxury, budget)
STEP 6 — Ask about accommodation preference (budget guesthouse, mid-range hotel, luxury resort)
STEP 7 — Build and present a DETAILED custom itinerary based on their answers (with Day 1, Day 2 etc)
STEP 8 — Suggest relevant Travel Sphere packages if they match
STEP 9 — Ask for their name, phone number, and email so admin can follow up
STEP 10 — Confirm submission and tell them Travel Sphere will contact them within 24 hours

TRAVEL SPHERE PACKAGES (recommend when matching customer preferences):
1. Kerala Solo Retreat — Kochi, Munnar, Alleppey — 8 days — Rs 19,999 — Solo/Couple
   Book: https://travelsphere.sbs/tours/kerala-solo-retreat
2. Kashmir Solo Escape — Srinagar, Gulmarg, Pahalgam — 7 days — Rs 28,999 — Solo/Couple
   Book: https://travelsphere.sbs/tours/kashmir-solo-escape
3. Ladakh Adventure Tour — Leh, Nubra, Pangong — 9 days — Rs 32,999 — Adventure groups
   Book: https://travelsphere.sbs/tours/ladakh-adventure-tour
4. Goa Beach Holiday — North & South Goa — 5 days — Rs 12,999 — Groups/Families
   Book: https://travelsphere.sbs/tours/goa-beach-holiday
5. Char Dham Yatra — Yamunotri, Gangotri, Kedarnath, Badrinath — 12 days — Rs 22,999 — Pilgrimage
   Book: https://travelsphere.sbs/tours/char-dham-yatra
6. Golden Triangle Tour — Delhi, Agra, Jaipur — 6 days — Rs 15,999 — Family/Culture
   Book: https://travelsphere.sbs/tours/golden-triangle-tour
7. Chandigarh City Tour — Chandigarh — 2 days — Rs 3,999 — Groups
   Book: https://travelsphere.sbs/tours/chandigarh-city-tour

WORLD DESTINATIONS KNOWLEDGE:
- Bali: Rs 60k–1.2L, April–October, temples, rice terraces, beaches, Visa on arrival
- Thailand: Rs 50k–1L, Nov–Feb, Bangkok temples, Phuket beaches, Visa on arrival
- Maldives: Rs 1.5L–4L, Nov–April, luxury overwater bungalows, snorkeling
- Dubai: Rs 80k–2L, Oct–April, desert safari, Burj Khalifa, luxury shopping
- Singapore: Rs 90k–1.8L, Feb–April, Gardens by the Bay, Universal Studios
- Europe (Paris/Rome/London): Rs 1.5L–4L, April–June & Sept–Nov, history and culture
- Switzerland: Rs 2L–4.5L, June–Sept for Alps, Dec–Feb for snow
- Turkey: Rs 70k–1.5L, April–June & Sept–Nov, Cappadocia balloons, Istanbul bazaars
- Vietnam: Rs 60k–1.2L, Feb–April, Ha Long Bay, Hoi An, street food
- Japan: Rs 1.2L–2.5L, March–April for cherry blossoms, Sept–Nov for autumn
- Sri Lanka: Rs 40k–90k, ancient temples, tea estates, beaches
- Nepal: Rs 30k–80k, Oct–Nov & March–May, Everest trek, Kathmandu temples
- Bhutan: Rs 80k–1.5L, March–May & Sept–Nov, Tiger's Nest monastery
- Rajasthan: Rs 15k–50k, Oct–March, forts, palaces, desert safari
- Andaman: Rs 20k–60k, Oct–May, pristine beaches, scuba diving
- Himachal Pradesh: Rs 15k–40k, March–June & Sept–Nov, Manali, Shimla, Spiti

ITINERARY CREATION GUIDELINES:
- Create day-by-day itineraries with morning, afternoon, evening activities
- Include accommodation suggestions, meal recommendations, transport options
- Add local tips, best photo spots, cultural etiquette notes
- Always estimate realistic costs in Indian Rupees
- Mention visa requirements for international trips

RESPONSE STYLE:
- Warm, enthusiastic, professional
- Use emojis sparingly to make it friendly (✈️, 🏔️, 🌊, 🏛️)
- Format itineraries clearly: **Day 1: Title** then activities
- End each message with ONE clear next question
- When presenting final plan, use clear sections: **Destination, Duration, Budget, Accommodation, Itinerary**

STRICT RULES:
- ONLY discuss travel, tours, destinations, holidays, trip planning
- If asked about non-travel topics (coding, news, math etc), politely redirect to travel planning
- Always stay in character as a Travel Sphere trip planner
- When customer gives name + phone, confirm you're submitting their trip plan to the team`

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    if (!checkRateLimit(ip, 60)) {
      return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 })
    }

    const body = await req.json()
    const { messages, action, tripData } = body

    // Handle trip submission action
    if (action === 'submit_trip') {
      try {
        const { name, phone, email, tripSummary } = tripData || {}
        if (!name || !phone) {
          return NextResponse.json({ error: 'Name and phone are required' }, { status: 400 })
        }

        await prisma.enquiry.create({
          data: {
            name,
            phone,
            email: email || null,
            message: `[AI Trip Planner] ${tripSummary || 'Custom trip request from AI planner'}`,
          },
        })

        return NextResponse.json({ success: true, message: 'Trip plan submitted to admin' })
      } catch (err) {
        console.error('Trip submission error:', err)
        return NextResponse.json({ error: 'Failed to submit trip plan' }, { status: 500 })
      }
    }

    // Fetch latest packages from DB to keep AI updated
    let dbPackages: { title: string; destination: string; price: number; duration: number; category: string; slug: string }[] = []
    try {
      dbPackages = await prisma.package.findMany({
        where: { isActive: true },
        select: { title: true, destination: true, price: true, duration: true, category: true, slug: true },
      })
    } catch {
      // ignore
    }

    let dynamicPackages = ''
    if (dbPackages.length > 0) {
      dynamicPackages =
        '\n\nLIVE PACKAGES FROM DATABASE:\n' +
        dbPackages
          .map(
            (p) =>
              `- ${p.title}: ${p.destination}, ${p.duration} days, Rs ${p.price.toLocaleString('en-IN')}, ${p.category} — https://travelsphere.sbs/tours/${p.slug}`
          )
          .join('\n')
    }

    if (!process.env.GROQ_API_KEY && !process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'AI service not configured. Please contact us on WhatsApp at +91 8603606089.' },
        { status: 503 }
      )
    }

    const model = isGroq
      ? process.env.GROQ_MODEL || 'llama-3.1-8b-instant'
      : process.env.OPENAI_MODEL || 'gpt-4o-mini'

    const completion = await openai.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: TRIP_PLANNER_SYSTEM_PROMPT + dynamicPackages },
        ...messages,
      ],
      max_tokens: 1200,
      temperature: 0.75,
      stream: true,
    })

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || ''
            if (content) controller.enqueue(encoder.encode(content))
          }
          controller.close()
        } catch (err) {
          controller.error(err)
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    })
  } catch (error: unknown) {
    console.error('Trip Planner AI error:', error)
    const msg = error instanceof Error ? error.message : ''
    if (msg.includes('API key')) {
      return NextResponse.json({ error: 'AI service configuration error.' }, { status: 503 })
    }
    if (msg.includes('rate_limit')) {
      return NextResponse.json({ error: 'AI is busy, please try again in a moment.' }, { status: 503 })
    }
    return NextResponse.json({ error: 'AI service unavailable. Please WhatsApp us at +91 8603606089.' }, { status: 500 })
  }
}
