# 🚀 Phase 1 — Project Setup, Auth & Database
### Travel Website (Travel sphere) — Complete Guide

---

## 📋 Table of Contents
1. [Tools You Need to Install](#1-tools-you-need-to-install)
2. [Create Next.js Project](#2-create-nextjs-project)
3. [Install All Dependencies](#3-install-all-dependencies)
4. [Folder Structure](#4-folder-structure)
5. [Environment Variables](#5-environment-variables)
6. [Setup PostgreSQL Database](#6-setup-postgresql-database)
7. [Setup Prisma ORM](#7-setup-prisma-orm)
8. [Prisma Schema (Database Tables)](#8-prisma-schema-database-tables)
9. [Push Schema to Database](#9-push-schema-to-database)
10. [Setup Prisma Client](#10-setup-prisma-client)
11. [Setup Authentication (NextAuth)](#11-setup-authentication-nextauth)
12. [NextAuth API Route](#12-nextauth-api-route)
13. [Register API](#13-register-api)
14. [Run Your Project](#14-run-your-project)
15. [Phase 1 Checklist](#-phase-1-checklist)

---

## 1. Tools You Need to Install

Check if already installed:

```bash
node -v        # Need v18+
npm -v
git --version
psql --version
```

If not installed, download from:

| Tool | Download Link |
|------|--------------|
| Node.js (LTS) | https://nodejs.org |
| PostgreSQL | https://www.postgresql.org/download |
| Git | https://git-scm.com |
| VS Code | https://code.visualstudio.com |

---

## 2. Create Next.js Project

```bash
npx create-next-app@latest travel-sphere
```

Answer the questions like this:

```
✔ Would you like to use TypeScript? → Yes
✔ Would you like to use ESLint? → Yes
✔ Would you like to use Tailwind CSS? → Yes
✔ Would you like to use `src/` directory? → No
✔ Would you like to use App Router? → Yes
✔ Would you like to customize the default import alias? → No
```

Then go into your project folder:

```bash
cd travel-sphere
```

---

## 3. Install All Dependencies

```bash
# Database ORM
npm install prisma @prisma/client

# Authentication
npm install next-auth bcryptjs
npm install -D @types/bcryptjs

# Forms & Validation
npm install react-hook-form zod @hookform/resolvers

# UI Components
npm install @headlessui/react @heroicons/react

# Payment Gateway
npm install razorpay

# Email Sending
npm install nodemailer
npm install -D @types/nodemailer

# Image/File Upload
npm install cloudinary next-cloudinary

# Utility Libraries
npm install axios date-fns slugify

# PDF Generation (for booking confirmations)
npm install jspdf html2canvas
```

---

## 4. Folder Structure

Your project should look like this:

```
travel-sphere/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (customer)/
│   │   ├── page.tsx                   ← Home page
│   │   ├── packages/
│   │   │   ├── page.tsx               ← All packages listing
│   │   │   └── [slug]/
│   │   │       └── page.tsx           ← Single package detail
│   │   └── booking/
│   │       └── [packageId]/
│   │           └── page.tsx           ← Booking page
│   ├── admin/
│   │   ├── page.tsx                   ← Admin dashboard
│   │   ├── packages/
│   │   └── bookings/
│   └── api/
│       ├── auth/
│       ├── packages/
│       ├── bookings/
│       └── payment/
├── components/
│   ├── ui/                            ← Reusable UI components
│   ├── layout/                        ← Navbar, Footer
│   ├── packages/                      ← Package cards, filters
│   └── booking/                       ← Booking form steps
├── lib/
│   ├── db.ts                          ← Prisma client
│   ├── auth.ts                        ← NextAuth config
│   └── razorpay.ts                    ← Payment helper
├── prisma/
│   └── schema.prisma                  ← Database schema
└── .env.local                         ← Environment variables
```

Run these commands to create all folders at once:

```bash
mkdir -p app/\(auth\)/login app/\(auth\)/register
mkdir -p "app/(customer)/packages/[slug]"
mkdir -p "app/(customer)/booking/[packageId]"
mkdir -p app/admin/packages app/admin/bookings
mkdir -p app/api/auth app/api/packages app/api/bookings app/api/payment
mkdir -p components/ui components/layout components/packages components/booking
mkdir -p lib prisma
```

---

## 5. Environment Variables

Create a file called `.env.local` in the root of your project and paste this:

```env
# ─── Database ───────────────────────────────────────────
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/travel_sphere_db"

# ─── NextAuth ───────────────────────────────────────────
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-here-change-this"

# ─── Razorpay (Payment) ─────────────────────────────────
RAZORPAY_KEY_ID="rzp_test_xxxxxxxxxxxx"
RAZORPAY_KEY_SECRET="your_razorpay_secret"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_xxxxxxxxxxxx"

# ─── Cloudinary (Image Upload) ──────────────────────────
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# ─── Email (Gmail SMTP) ─────────────────────────────────
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="deepankumar81c401a1e8@gmail.com"
EMAIL_PASS="your_gmail_app_password"
```

> ⚠️ **Important:** Never commit `.env.local` to Git. Add it to `.gitignore`.

---

## 6. Setup PostgreSQL Database

Open your terminal and run:

```bash
# Open PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE travel_sphere_db;

# Confirm it was created
\l

# Exit
\q
```

---

## 7. Setup Prisma ORM

```bash
npx prisma init
```

This creates a `prisma/` folder with a `schema.prisma` file.

---

## 8. Prisma Schema (Database Tables)

Open `prisma/schema.prisma` and **replace everything** with this:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─────────────────────────────────────────
// USER TABLE
// ─────────────────────────────────────────
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  phone     String?
  password  String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  bookings  Booking[]
  reviews   Review[]
  enquiries Enquiry[]
}

enum Role {
  USER
  ADMIN
}

// ─────────────────────────────────────────
// PACKAGE TABLE
// ─────────────────────────────────────────
model Package {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  destination String
  description String
  price       Float
  duration    Int                // number of days
  category    Category
  images      String[]           // array of image URLs
  itinerary   Json               // day-wise itinerary
  inclusions  String[]
  exclusions  String[]
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  bookings    Booking[]
  reviews     Review[]
  enquiries   Enquiry[]
}

enum Category {
  FAMILY
  HONEYMOON
  GROUP
  SOLO
  PILGRIMAGE
  ADVENTURE
  CORPORATE
}

// ─────────────────────────────────────────
// BOOKING TABLE
// ─────────────────────────────────────────
model Booking {
  id             String        @id @default(cuid())
  userId         String
  packageId      String
  travelDate     DateTime
  travellers     Int
  totalAmount    Float
  status         BookingStatus @default(PENDING)
  travellersInfo Json?         // traveller names, ages, etc.
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt

  user           User          @relation(fields: [userId], references: [id])
  package        Package       @relation(fields: [packageId], references: [id])
  payment        Payment?
}

enum BookingStatus {
  PENDING
  CONFIRMED
  CANCELLED
  COMPLETED
}

// ─────────────────────────────────────────
// PAYMENT TABLE
// ─────────────────────────────────────────
model Payment {
  id                String        @id @default(cuid())
  bookingId         String        @unique
  razorpayOrderId   String
  razorpayPaymentId String?
  amount            Float
  status            PaymentStatus @default(PENDING)
  createdAt         DateTime      @default(now())

  booking           Booking       @relation(fields: [bookingId], references: [id])
}

enum PaymentStatus {
  PENDING
  SUCCESS
  FAILED
  REFUNDED
}

// ─────────────────────────────────────────
// ENQUIRY TABLE
// ─────────────────────────────────────────
model Enquiry {
  id        String   @id @default(cuid())
  name      String
  phone     String
  email     String?
  message   String
  packageId String?
  userId    String?
  createdAt DateTime @default(now())

  package   Package? @relation(fields: [packageId], references: [id])
  user      User?    @relation(fields: [userId], references: [id])
}

// ─────────────────────────────────────────
// REVIEW TABLE
// ─────────────────────────────────────────
model Review {
  id        String   @id @default(cuid())
  userId    String
  packageId String
  rating    Int      // 1 to 5
  comment   String
  createdAt DateTime @default(now())

  user      User     @relation(fields: [userId], references: [id])
  package   Package  @relation(fields: [packageId], references: [id])
}
```

---

## 9. Push Schema to Database

```bash
# Push schema to PostgreSQL
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Optional: Open Prisma Studio (visual DB viewer)
npx prisma studio
```

---

## 10. Setup Prisma Client

Create file: `lib/db.ts`

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production')
  globalForPrisma.prisma = prisma
```

---

## 11. Setup Authentication (NextAuth)

Create file: `lib/auth.ts`

```typescript
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './db'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })

        if (!user) return null

        const passwordMatch = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!passwordMatch) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role
        ;(session.user as any).id = token.id
      }
      return session
    }
  },
  pages: {
    signIn: '/login'
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET
}
```

---

## 12. NextAuth API Route

Create file: `app/api/auth/[...nextauth]/route.ts`

```typescript
import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
```

---

## 13. Register API

Create file: `app/api/auth/register/route.ts`

```typescript
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { name, email, phone, password } = await req.json()

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword
      }
    })

    return NextResponse.json(
      { message: 'User created successfully', userId: user.id },
      { status: 201 }
    )

  } catch (error) {
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    )
  }
}
```

---

## 14. Run Your Project

```bash
npm run dev
```

Open your browser and go to:

```
http://localhost:3000
```

✅ Your project is now running!

---

## ✅ Phase 1 Checklist

Go through each item and tick it off as you complete it:

| # | Task | Status |
|---|------|--------|
| 1 | Node.js v18+ installed | ⬜ |
| 2 | PostgreSQL installed | ⬜ |
| 3 | Git installed | ⬜ |
| 4 | VS Code installed | ⬜ |
| 5 | Next.js project created | ⬜ |
| 6 | All npm packages installed | ⬜ |
| 7 | Folder structure created | ⬜ |
| 8 | `.env.local` file configured | ⬜ |
| 9 | PostgreSQL database created | ⬜ |
| 10 | Prisma initialized | ⬜ |
| 11 | Schema pasted in `schema.prisma` | ⬜ |
| 12 | `npx prisma db push` ran successfully | ⬜ |
| 13 | `lib/db.ts` created | ⬜ |
| 14 | `lib/auth.ts` created | ⬜ |
| 15 | NextAuth API route created | ⬜ |
| 16 | Register API route created | ⬜ |
| 17 | `npm run dev` runs without errors | ⬜ |

---




# Phase 2 — Tour Package Listings and UI
### Travel Website (Travel Sphere) — Complete Guide

---

## Table of Contents
1. What We Build in Phase 2
2. Navbar Component
3. Footer Component
4. Home Page
5. Package Card Component
6. Package Filter Component
7. Package Listing Page
8. Package Detail Page
9. Package API Routes
10. Seed Dummy Data
11. Run and Test
12. Phase 2 Checklist

---

## 1. What We Build in Phase 2

| Feature | Description |
|---------|-------------|
| Navbar | Logo, nav links, login/register buttons |
| Footer | Links, contact info, social media icons |
| Home Page | Hero banner, featured packages, categories |
| Package Card | Image, title, price, duration, category badge |
| Filter Bar | Filter by category, destination, budget, duration |
| Package Listing Page | All packages with search and filters |
| Package Detail Page | Full itinerary, gallery, inclusions, book button |
| Package API Routes | GET all, GET by slug, POST/PUT/DELETE (admin) |
| Seed Data | Add 6 dummy packages to test your UI |

---

## 2. Navbar Component

Create file: components/layout/Navbar.tsx

```tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function Navbar() {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-orange-500">
          Travel Sphere
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
          <Link href="/packages" className="hover:text-orange-500 transition">All Packages</Link>
          <Link href="/packages?category=HONEYMOON" className="hover:text-orange-500 transition">Honeymoon</Link>
          <Link href="/packages?category=FAMILY" className="hover:text-orange-500 transition">Family</Link>
          <Link href="/packages?category=PILGRIMAGE" className="hover:text-orange-500 transition">Pilgrimage</Link>
          <Link href="/packages?category=GROUP" className="hover:text-orange-500 transition">Group Tours</Link>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <>
              {(session.user as any)?.role === 'ADMIN' && (
                <Link href="/admin" className="text-sm text-blue-600 hover:underline">
                  Admin Panel
                </Link>
              )}
              <span className="text-sm text-gray-600">Hi, {session.user?.name}</span>
              <button
                onClick={() => signOut()}
                className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm hover:bg-orange-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-gray-700 hover:text-orange-500">Login</Link>
              <Link
                href="/register"
                className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm hover:bg-orange-600 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-gray-700 text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? 'X' : '='}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-4 flex flex-col gap-4 text-sm text-gray-700">
          <Link href="/packages" onClick={() => setMenuOpen(false)}>All Packages</Link>
          <Link href="/packages?category=HONEYMOON" onClick={() => setMenuOpen(false)}>Honeymoon</Link>
          <Link href="/packages?category=FAMILY" onClick={() => setMenuOpen(false)}>Family</Link>
          <Link href="/packages?category=PILGRIMAGE" onClick={() => setMenuOpen(false)}>Pilgrimage</Link>
          <Link href="/packages?category=GROUP" onClick={() => setMenuOpen(false)}>Group Tours</Link>
          {session ? (
            <button onClick={() => signOut()} className="text-left text-red-500">Logout</button>
          ) : (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link href="/register" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
```

---

## 3. Footer Component

Create file: components/layout/Footer.tsx

```tsx
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 mt-16">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Brand */}
        <div>
          <h2 className="text-white text-xl font-bold mb-3">Travel Sphere</h2>
          <p className="text-sm leading-relaxed">
            India's trusted travel company. Curated tours for families,
            couples, groups and solo travelers since 2013.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/packages" className="hover:text-orange-400 transition">All Packages</Link></li>
            <li><Link href="/packages?category=HONEYMOON" className="hover:text-orange-400 transition">Honeymoon Tours</Link></li>
            <li><Link href="/packages?category=FAMILY" className="hover:text-orange-400 transition">Family Tours</Link></li>
            <li><Link href="/packages?category=PILGRIMAGE" className="hover:text-orange-400 transition">Pilgrimage Tours</Link></li>
            <li><Link href="/packages?category=ADVENTURE" className="hover:text-orange-400 transition">Adventure Tours</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-3">Contact Us</h3>
          <ul className="space-y-2 text-sm">
            <li>Phone: +91 8603606089</li>
            <li>Email: deepankumar81c401a1e8@gmail.com</li>
            <li>Address: Amritsar, Punjab, India</li>
            <li>Hours: Mon-Sat 9AM to 7PM</li>
          </ul>
        </div>

        {/* WhatsApp CTA */}
        <div>
          <h3 className="text-white font-semibold mb-3">Chat With Us</h3>
          <p className="text-sm mb-4">Get instant help from our travel experts</p>
          <a
            href="https://wa.me/918603606089"
            target="_blank"
            className="inline-block bg-green-500 text-white px-4 py-2 rounded-full text-sm hover:bg-green-600 transition"
          >
            WhatsApp Us
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-10 pt-6 border-t border-gray-700 text-center text-xs text-gray-500">
        {new Date().getFullYear()} Travel Sphere. All rights reserved.
      </div>
    </footer>
  )
}
```

---

## 4. Home Page

### 4a. Layout File

Create file: app/(customer)/layout.tsx

```tsx
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {children}
      </main>
      <Footer />
    </>
  )
}
```

### 4b. Home Page

Create file: app/(customer)/page.tsx

```tsx
import Link from 'next/link'
import { prisma } from '@/lib/db'
import PackageCard from '@/components/packages/PackageCard'

async function getFeaturedPackages() {
  return await prisma.package.findMany({
    where: { isActive: true },
    take: 6,
    orderBy: { createdAt: 'desc' }
  })
}

const categories = [
  { label: 'Honeymoon', value: 'HONEYMOON', bg: 'bg-pink-100' },
  { label: 'Family', value: 'FAMILY', bg: 'bg-blue-100' },
  { label: 'Group Tours', value: 'GROUP', bg: 'bg-yellow-100' },
  { label: 'Pilgrimage', value: 'PILGRIMAGE', bg: 'bg-orange-100' },
  { label: 'Adventure', value: 'ADVENTURE', bg: 'bg-green-100' },
  { label: 'Solo', value: 'SOLO', bg: 'bg-purple-100' },
]

export default async function HomePage() {
  const packages = await getFeaturedPackages()

  return (
    <div>

      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-700 text-white py-24 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Explore India and Beyond
        </h1>
        <p className="text-lg md:text-xl mb-8 text-orange-100">
          Handcrafted tour packages for every kind of traveler
        </p>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto flex gap-2">
          <input
            type="text"
            placeholder="Search destination e.g. Goa, Kashmir, Kerala..."
            className="flex-1 px-4 py-3 rounded-l-full text-gray-800 text-sm focus:outline-none"
          />
          <Link
            href="/packages"
            className="bg-white text-orange-600 font-semibold px-6 py-3 rounded-r-full hover:bg-orange-50 transition text-sm"
          >
            Search
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-12 flex flex-wrap justify-center gap-10 text-center">
          {[
            { label: 'Happy Travelers', value: '50,000+' },
            { label: 'Tour Packages', value: '200+' },
            { label: 'Destinations', value: '100+' },
            { label: 'Years Experience', value: '10+' },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-orange-200 text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Browse by Category</h2>
        <p className="text-gray-500 text-center mb-8">Find the perfect trip for every occasion</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.value}
              href={`/packages?category=${cat.value}`}
              className={`${cat.bg} rounded-2xl p-4 flex flex-col items-center gap-2 hover:shadow-md transition text-center`}
            >
              <span className="text-sm font-medium text-gray-700">{cat.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Packages */}
      <section className="max-w-7xl mx-auto px-4 py-6 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Featured Packages</h2>
            <p className="text-gray-500 text-sm mt-1">Our most popular trips this season</p>
          </div>
          <Link href="/packages" className="text-orange-500 font-medium text-sm hover:underline">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} package={pkg} />
          ))}
        </div>
        {packages.length === 0 && (
          <p className="text-center text-gray-400 py-10">
            No packages yet. Add some from the admin panel.
          </p>
        )}
      </section>

      {/* Why Choose Us */}
      <section className="bg-orange-50 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Why Choose Travel Sphere?</h2>
          <p className="text-gray-500 mb-10">Trusted by thousands of happy travelers across India</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { title: 'Verified Tours', desc: 'All packages verified and quality checked' },
              { title: 'Best Price', desc: 'Guaranteed lowest prices with no hidden fees' },
              { title: '24/7 Support', desc: 'Round-the-clock customer support' },
              { title: 'Expert Guides', desc: 'Professional and experienced tour managers' },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="bg-green-500 text-white py-10 px-4 text-center">
        <h2 className="text-2xl font-bold mb-2">Need Help Planning Your Trip?</h2>
        <p className="mb-6 text-green-100">Chat with our travel experts on WhatsApp</p>
        <a
          href="https://wa.me/918603606089"
          target="_blank"
          className="inline-block bg-white text-green-600 font-bold px-8 py-3 rounded-full hover:bg-green-50 transition"
        >
          Chat on WhatsApp
        </a>
      </section>

    </div>
  )
}
```

---

## 5. Package Card Component

Create file: components/packages/PackageCard.tsx

```tsx
import Link from 'next/link'
import Image from 'next/image'

const categoryColors: Record<string, string> = {
  HONEYMOON: 'bg-pink-100 text-pink-700',
  FAMILY: 'bg-blue-100 text-blue-700',
  GROUP: 'bg-yellow-100 text-yellow-700',
  PILGRIMAGE: 'bg-orange-100 text-orange-700',
  ADVENTURE: 'bg-green-100 text-green-700',
  SOLO: 'bg-purple-100 text-purple-700',
  CORPORATE: 'bg-gray-100 text-gray-700',
}

interface Props {
  package: {
    id: string
    slug: string
    title: string
    destination: string
    price: number
    duration: number
    category: string
    images: string[]
  }
}

export default function PackageCard({ package: pkg }: Props) {
  const image = pkg.images?.[0] || '/placeholder-travel.jpg'

  return (
    <Link href={`/packages/${pkg.slug}`}>
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition group cursor-pointer">

        {/* Image */}
        <div className="relative h-52 w-full overflow-hidden">
          <Image
            src={image}
            alt={pkg.title}
            fill
            className="object-cover group-hover:scale-105 transition duration-300"
          />
          <span className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[pkg.category] || 'bg-gray-100 text-gray-700'}`}>
            {pkg.category}
          </span>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-gray-800 text-base mb-1 line-clamp-1">{pkg.title}</h3>
          <p className="text-gray-500 text-sm mb-3">{pkg.destination}</p>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-400">Starting from</span>
              <div className="text-orange-500 font-bold text-lg">
                Rs {pkg.price.toLocaleString('en-IN')}
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-400">Duration</span>
              <div className="text-gray-700 font-semibold text-sm">{pkg.duration} Days</div>
            </div>
          </div>

          <button className="mt-4 w-full bg-orange-500 text-white py-2 rounded-full text-sm font-medium hover:bg-orange-600 transition">
            View Details
          </button>
        </div>
      </div>
    </Link>
  )
}
```

---

## 6. Package Filter Component

Create file: components/packages/PackageFilter.tsx

```tsx
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

const categories = ['ALL', 'HONEYMOON', 'FAMILY', 'GROUP', 'PILGRIMAGE', 'ADVENTURE', 'SOLO', 'CORPORATE']
const durations = ['ALL', '1-3', '4-6', '7-10', '10+']
const budgets = [
  { label: 'All Budgets', value: 'ALL' },
  { label: 'Under Rs 10,000', value: '0-10000' },
  { label: 'Rs 10k to 25k', value: '10000-25000' },
  { label: 'Rs 25k to 50k', value: '25000-50000' },
  { label: 'Above Rs 50k', value: '50000-999999' },
]

export default function PackageFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || 'ALL')
  const [duration, setDuration] = useState(searchParams.get('duration') || 'ALL')
  const [budget, setBudget] = useState(searchParams.get('budget') || 'ALL')

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (category !== 'ALL') params.set('category', category)
    if (duration !== 'ALL') params.set('duration', duration)
    if (budget !== 'ALL') params.set('budget', budget)
    router.push(`/packages?${params.toString()}`)
  }

  const clearFilters = () => {
    setSearch('')
    setCategory('ALL')
    setDuration('ALL')
    setBudget('ALL')
    router.push('/packages')
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 mb-8">

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search destination or package name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
          className="w-full border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      <div className="flex flex-wrap gap-3">

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none"
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c === 'ALL' ? 'All Categories' : c}</option>
          ))}
        </select>

        <select
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none"
        >
          {durations.map((d) => (
            <option key={d} value={d}>{d === 'ALL' ? 'All Durations' : `${d} Days`}</option>
          ))}
        </select>

        <select
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none"
        >
          {budgets.map((b) => (
            <option key={b.value} value={b.value}>{b.label}</option>
          ))}
        </select>

        <button
          onClick={applyFilters}
          className="bg-orange-500 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-orange-600 transition"
        >
          Apply Filters
        </button>

        <button
          onClick={clearFilters}
          className="border border-gray-300 text-gray-500 px-4 py-2 rounded-full text-sm hover:bg-gray-50 transition"
        >
          Clear
        </button>
      </div>
    </div>
  )
}
```

---

## 7. Package Listing Page

Create file: app/(customer)/packages/page.tsx

```tsx
import { prisma } from '@/lib/db'
import PackageCard from '@/components/packages/PackageCard'
import PackageFilter from '@/components/packages/PackageFilter'
import { Suspense } from 'react'

interface Props {
  searchParams: {
    search?: string
    category?: string
    duration?: string
    budget?: string
  }
}

async function getPackages(filters: Props['searchParams']) {
  const where: any = { isActive: true }

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: 'insensitive' } },
      { destination: { contains: filters.search, mode: 'insensitive' } },
    ]
  }

  if (filters.category && filters.category !== 'ALL') {
    where.category = filters.category
  }

  if (filters.duration && filters.duration !== 'ALL') {
    if (filters.duration === '10+') {
      where.duration = { gte: 10 }
    } else {
      const [min, max] = filters.duration.split('-').map(Number)
      where.duration = { gte: min, lte: max }
    }
  }

  if (filters.budget && filters.budget !== 'ALL') {
    const [min, max] = filters.budget.split('-').map(Number)
    where.price = { gte: min, lte: max }
  }

  return await prisma.package.findMany({
    where,
    orderBy: { createdAt: 'desc' }
  })
}

export default async function PackagesPage({ searchParams }: Props) {
  const packages = await getPackages(searchParams)

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">All Tour Packages</h1>
        <p className="text-gray-500 mt-1">
          {packages.length} package{packages.length !== 1 ? 's' : ''} found
        </p>
      </div>

      <Suspense fallback={<div>Loading filters...</div>}>
        <PackageFilter />
      </Suspense>

      {packages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <PackageCard key={pkg.id} package={pkg} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium">No packages found</p>
          <p className="text-sm mt-2">Try changing your filters or search term</p>
        </div>
      )}
    </div>
  )
}
```

---

## 8. Package Detail Page

Create file: app/(customer)/packages/[slug]/page.tsx

```tsx
import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

interface Props {
  params: { slug: string }
}

export default async function PackageDetailPage({ params }: Props) {
  const pkg = await prisma.package.findUnique({
    where: { slug: params.slug },
    include: {
      reviews: {
        include: { user: { select: { name: true } } }
      }
    }
  })

  if (!pkg || !pkg.isActive) return notFound()

  const itinerary = pkg.itinerary as Array<{
    day: number
    title: string
    description: string
  }>

  const avgRating = pkg.reviews.length
    ? (pkg.reviews.reduce((sum, r) => sum + r.rating, 0) / pkg.reviews.length).toFixed(1)
    : null

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      {/* Breadcrumb */}
      <div className="text-sm text-gray-400 mb-4">
        <Link href="/" className="hover:text-orange-500">Home</Link>
        {' / '}
        <Link href="/packages" className="hover:text-orange-500">Packages</Link>
        {' / '}
        <span className="text-gray-600">{pkg.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT - Main Content */}
        <div className="lg:col-span-2 space-y-8">

          {/* Image Gallery */}
          <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden">
            {pkg.images.slice(0, 4).map((img, i) => (
              <div key={i} className={`relative ${i === 0 ? 'col-span-2 h-64' : 'h-40'}`}>
                <Image
                  src={img}
                  alt={`${pkg.title} photo ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
            {pkg.images.length === 0 && (
              <div className="col-span-2 h-64 bg-gray-200 flex items-center justify-center text-gray-400">
                No images available
              </div>
            )}
          </div>

          {/* Title and Meta */}
          <div>
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <span className="text-xs bg-orange-100 text-orange-600 font-semibold px-3 py-1 rounded-full">
                  {pkg.category}
                </span>
                <h1 className="text-2xl font-bold text-gray-800 mt-2">{pkg.title}</h1>
                <p className="text-gray-500 mt-1">{pkg.destination}</p>
              </div>
              {avgRating && (
                <div className="text-center bg-yellow-50 px-4 py-2 rounded-xl">
                  <div className="text-yellow-500 font-bold text-xl">Star {avgRating}</div>
                  <div className="text-xs text-gray-400">{pkg.reviews.length} reviews</div>
                </div>
              )}
            </div>
            <p className="text-gray-600 mt-4 leading-relaxed">{pkg.description}</p>
          </div>

          {/* Inclusions and Exclusions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 rounded-2xl p-5">
              <h3 className="font-bold text-gray-800 mb-3">What is Included</h3>
              <ul className="space-y-2">
                {pkg.inclusions.map((item, i) => (
                  <li key={i} className="text-sm text-gray-600 flex gap-2">
                    <span className="text-green-500 mt-0.5">Yes</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50 rounded-2xl p-5">
              <h3 className="font-bold text-gray-800 mb-3">What is Not Included</h3>
              <ul className="space-y-2">
                {pkg.exclusions.map((item, i) => (
                  <li key={i} className="text-sm text-gray-600 flex gap-2">
                    <span className="text-red-400 mt-0.5">No</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Day-wise Itinerary */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Day-wise Itinerary</h2>
            <div className="space-y-4">
              {itinerary.map((day) => (
                <div key={day.day} className="border border-gray-200 rounded-2xl overflow-hidden">
                  <div className="bg-orange-500 text-white px-5 py-3 font-semibold text-sm">
                    Day {day.day} — {day.title}
                  </div>
                  <div className="px-5 py-4 text-sm text-gray-600 leading-relaxed">
                    {day.description}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          {pkg.reviews.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Traveler Reviews</h2>
              <div className="space-y-4">
                {pkg.reviews.map((review) => (
                  <div key={review.id} className="bg-gray-50 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-700">{review.user.name}</span>
                      <span className="text-yellow-500">{review.rating} out of 5</span>
                    </div>
                    <p className="text-sm text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT - Booking Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
            <div className="text-center mb-6">
              <span className="text-sm text-gray-400">Starting from</span>
              <div className="text-3xl font-bold text-orange-500 mt-1">
                Rs {pkg.price.toLocaleString('en-IN')}
              </div>
              <div className="text-sm text-gray-500">per person</div>
            </div>

            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Duration</span>
                <span className="font-medium">{pkg.duration} Days</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Category</span>
                <span className="font-medium">{pkg.category}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Destination</span>
                <span className="font-medium">{pkg.destination}</span>
              </div>
            </div>

            <Link
              href={`/booking/${pkg.id}`}
              className="block w-full bg-orange-500 text-white text-center py-3 rounded-full font-semibold hover:bg-orange-600 transition mb-3"
            >
              Book Now
            </Link>

            <a
              href={`https://wa.me/918603606089?text=Hi, I am interested in the ${pkg.title} package`}
              target="_blank"
              className="block w-full bg-green-500 text-white text-center py-3 rounded-full font-semibold hover:bg-green-600 transition"
            >
              Enquire on WhatsApp
            </a>

            <p className="text-center text-xs text-gray-400 mt-4">
              Secure booking. No hidden charges.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
```

---

## 9. Package API Routes

### 9a. GET All and POST New Package

Create file: app/api/packages/route.ts

```typescript
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    const where: any = { isActive: true }

    if (category && category !== 'ALL') {
      where.category = category
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { destination: { contains: search, mode: 'insensitive' } },
      ]
    }

    const packages = await prisma.package.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(packages)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, destination, description, price, duration, category, images, itinerary, inclusions, exclusions } = body

    const slugify = (await import('slugify')).default
    const slug = slugify(title, { lower: true, strict: true })

    const pkg = await prisma.package.create({
      data: {
        title, slug, destination, description,
        price: parseFloat(price),
        duration: parseInt(duration),
        category,
        images: images || [],
        itinerary: itinerary || [],
        inclusions: inclusions || [],
        exclusions: exclusions || [],
      }
    })

    return NextResponse.json(pkg, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create package' }, { status: 500 })
  }
}
```

### 9b. GET PUT DELETE Single Package

Create file: app/api/packages/[id]/route.ts

```typescript
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const pkg = await prisma.package.findUnique({ where: { id: params.id } })
    if (!pkg) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(pkg)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch package' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const pkg = await prisma.package.update({
      where: { id: params.id },
      data: { ...body, price: parseFloat(body.price), duration: parseInt(body.duration) }
    })
    return NextResponse.json(pkg)
  } catch {
    return NextResponse.json({ error: 'Failed to update package' }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.package.update({
      where: { id: params.id },
      data: { isActive: false }
    })
    return NextResponse.json({ message: 'Package deleted' })
  } catch {
    return NextResponse.json({ error: 'Failed to delete package' }, { status: 500 })
  }
}
```

---

## 10. Seed Dummy Data

Create file: prisma/seed.ts

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  const packages = [
    {
      title: 'Golden Triangle Tour',
      slug: 'golden-triangle-tour',
      destination: 'Delhi - Agra - Jaipur',
      description: 'Experience the best of North India with this classic Golden Triangle tour. Visit the iconic Taj Mahal, majestic forts and vibrant bazaars.',
      price: 15999,
      duration: 6,
      category: 'FAMILY',
      images: ['https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800'],
      itinerary: [
        { day: 1, title: 'Arrival in Delhi', description: 'Arrive in Delhi. Check-in to hotel. Evening visit India Gate.' },
        { day: 2, title: 'Delhi Sightseeing', description: 'Visit Red Fort, Jama Masjid, Qutub Minar and Humayun Tomb.' },
        { day: 3, title: 'Delhi to Agra', description: 'Drive to Agra. Visit the Taj Mahal at sunset. Overnight in Agra.' },
        { day: 4, title: 'Agra to Jaipur', description: 'Morning visit Agra Fort. Drive to Jaipur via Fatehpur Sikri.' },
        { day: 5, title: 'Jaipur Sightseeing', description: 'Visit Amber Fort, City Palace, Jantar Mantar and Hawa Mahal.' },
        { day: 6, title: 'Departure', description: 'Morning free for shopping. Transfer to airport or railway station.' },
      ],
      inclusions: ['Hotel accommodation 5 nights', 'Daily breakfast', 'All transfers by AC car', 'Expert tour guide', 'All entry tickets'],
      exclusions: ['Flights', 'Lunch and dinner', 'Personal expenses', 'Travel insurance'],
    },
    {
      title: 'Kashmir Paradise Honeymoon',
      slug: 'kashmir-paradise-honeymoon',
      destination: 'Srinagar - Gulmarg - Pahalgam',
      description: 'A romantic escape to heaven on earth. Enjoy shikara rides on Dal Lake, snow-capped mountains in Gulmarg and the serene beauty of Pahalgam.',
      price: 28999,
      duration: 7,
      category: 'HONEYMOON',
      images: ['https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800'],
      itinerary: [
        { day: 1, title: 'Arrival in Srinagar', description: 'Check-in to houseboat on Dal Lake. Evening shikara ride.' },
        { day: 2, title: 'Srinagar Sightseeing', description: 'Visit Mughal Gardens, Shalimar Bagh and Nishat Bagh.' },
        { day: 3, title: 'Gulmarg Day Trip', description: 'Enjoy the Gondola cable car ride in Gulmarg.' },
        { day: 4, title: 'Pahalgam Transfer', description: 'Drive to Pahalgam, the valley of shepherds.' },
        { day: 5, title: 'Pahalgam Exploration', description: 'Visit Betaab Valley, Aru Valley and Chandanwari.' },
        { day: 6, title: 'Back to Srinagar', description: 'Return to Srinagar. Shopping at local markets for pashmina.' },
        { day: 7, title: 'Departure', description: 'Breakfast and transfer to airport.' },
      ],
      inclusions: ['Houseboat and hotel stay 6 nights', 'All meals', 'Shikara ride', 'All transfers'],
      exclusions: ['Airfare', 'Gondola tickets', 'Adventure activities', 'Travel insurance'],
    },
    {
      title: 'Char Dham Yatra',
      slug: 'char-dham-yatra',
      destination: 'Yamunotri - Gangotri - Kedarnath - Badrinath',
      description: 'Embark on the sacred Char Dham pilgrimage covering all four holy shrines in Uttarakhand.',
      price: 22999,
      duration: 12,
      category: 'PILGRIMAGE',
      images: ['https://images.unsplash.com/photo-1609766418204-94aae0ecfdfc?w=800'],
      itinerary: [
        { day: 1, title: 'Haridwar Assembly', description: 'Assemble at Haridwar. Evening Ganga Aarti at Har Ki Pauri.' },
        { day: 2, title: 'Haridwar to Barkot', description: 'Drive to Barkot via Mussoorie.' },
        { day: 3, title: 'Yamunotri Dham', description: 'Trek to Yamunotri temple. Take holy dip and offer prayers.' },
        { day: 4, title: 'Barkot to Uttarkashi', description: 'Drive to Uttarkashi. Visit Vishwanath Temple.' },
        { day: 5, title: 'Gangotri Dham', description: 'Visit Gangotri temple. Holy dip in River Bhagirathi.' },
        { day: 6, title: 'Drive to Guptkashi', description: 'Drive to Guptkashi via Tehri.' },
        { day: 7, title: 'Kedarnath', description: 'Trek to Kedarnath. Darshan and return.' },
        { day: 8, title: 'Drive to Badrinath', description: 'Drive to Badrinath via Joshimath.' },
        { day: 9, title: 'Badrinath Dham', description: 'Badrinath temple darshan and Mana village visit.' },
        { day: 10, title: 'Drive to Rudraprayag', description: 'Drive back towards Rishikesh.' },
        { day: 11, title: 'Drive to Rishikesh', description: 'Evening at Laxman Jhula.' },
        { day: 12, title: 'Departure from Haridwar', description: 'Morning prayers. Drop at station or airport.' },
      ],
      inclusions: ['11 nights accommodation', 'All meals', 'AC transport throughout', 'All temple entry fees', 'Religious guide'],
      exclusions: ['Helicopter charges', 'Porter charges', 'Personal expenses', 'Travel insurance'],
    },
    {
      title: 'Goa Beach Holiday',
      slug: 'goa-beach-holiday',
      destination: 'North Goa - South Goa',
      description: 'The perfect beach getaway! Enjoy sun, sand and surf in Goa. Explore stunning beaches, Portuguese heritage and delicious seafood.',
      price: 12999,
      duration: 5,
      category: 'GROUP',
      images: ['https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800'],
      itinerary: [
        { day: 1, title: 'Arrival in Goa', description: 'Transfer to hotel. Evening free at Calangute Beach.' },
        { day: 2, title: 'North Goa Tour', description: 'Visit Baga Beach, Anjuna Market, Fort Aguada and Chapora Fort.' },
        { day: 3, title: 'Water Sports Day', description: 'Parasailing, jet ski, banana boat and more.' },
        { day: 4, title: 'South Goa Tour', description: 'Visit Colva Beach, Basilica of Bom Jesus and Dudhsagar Falls.' },
        { day: 5, title: 'Departure', description: 'Morning free at beach. Transfer to airport.' },
      ],
      inclusions: ['4 nights hotel', 'Daily breakfast', 'Airport transfers', 'Sightseeing', 'Water sports package'],
      exclusions: ['Flights', 'Lunch and dinner', 'Personal expenses', 'Alcohol'],
    },
    {
      title: 'Kerala Backwaters and Munnar',
      slug: 'kerala-backwaters-munnar',
      destination: 'Kochi - Munnar - Alleppey - Kovalam',
      description: "God's Own Country awaits! Cruise through tranquil backwaters on a houseboat, explore lush tea gardens in Munnar and relax on golden beaches.",
      price: 19999,
      duration: 8,
      category: 'HONEYMOON',
      images: ['https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800'],
      itinerary: [
        { day: 1, title: 'Arrive Kochi', description: 'Visit Fort Kochi and Chinese Fishing Nets.' },
        { day: 2, title: 'Kochi to Munnar', description: 'Scenic drive through tea estates and waterfalls.' },
        { day: 3, title: 'Munnar Sightseeing', description: 'Visit Tea Museum, Eravikulam Park and Mattupetty Dam.' },
        { day: 4, title: 'Munnar to Thekkady', description: 'Boat safari in Periyar Wildlife Sanctuary.' },
        { day: 5, title: 'Thekkady to Alleppey', description: 'Board private houseboat for overnight backwater cruise.' },
        { day: 6, title: 'Backwaters Cruise', description: 'Full day cruising through Kerala backwaters.' },
        { day: 7, title: 'Alleppey to Kovalam', description: 'Relax on the famous crescent shaped beach.' },
        { day: 8, title: 'Departure', description: 'Transfer to Trivandrum airport.' },
      ],
      inclusions: ['7 nights hotel plus 1 night houseboat', 'Daily breakfast', 'All transfers', 'Periyar boat safari'],
      exclusions: ['Flights', 'Ayurvedic treatments', 'Personal expenses', 'Travel insurance'],
    },
    {
      title: 'Ladakh Adventure Tour',
      slug: 'ladakh-adventure-tour',
      destination: 'Leh - Nubra Valley - Pangong Lake',
      description: 'The ultimate adventure! Ride through the highest motorable roads, camp beside stunning Pangong Lake and experience raw Ladakh.',
      price: 32999,
      duration: 9,
      category: 'ADVENTURE',
      images: ['https://images.unsplash.com/photo-1585016495481-81a732c9bcd7?w=800'],
      itinerary: [
        { day: 1, title: 'Arrive Leh', description: 'Rest for acclimatization at 3500m altitude. Evening market walk.' },
        { day: 2, title: 'Acclimatization Day', description: 'Light visit to Shanti Stupa and Leh Palace.' },
        { day: 3, title: 'Leh Sightseeing', description: 'Visit Hemis Monastery, Thiksey Monastery and Shey Palace.' },
        { day: 4, title: 'Leh to Nubra Valley', description: 'Drive over Khardung La at 5602m to Nubra Valley.' },
        { day: 5, title: 'Nubra Valley', description: 'Diskit Monastery and Bactrian camel ride in Hunder dunes.' },
        { day: 6, title: 'Nubra to Pangong Lake', description: 'Drive to breathtaking Pangong Tso Lake. Camp overnight.' },
        { day: 7, title: 'Pangong Lake', description: 'Sunrise at Pangong. Full day at the mesmerizing blue lake.' },
        { day: 8, title: 'Pangong to Leh', description: 'Return to Leh via Chang La. Evening shopping.' },
        { day: 9, title: 'Departure', description: 'Transfer to Leh airport.' },
      ],
      inclusions: ['8 nights accommodation and camping', 'All meals', 'SUV transfers', 'Inner Line Permits', 'Adventure guide'],
      exclusions: ['Flights to and from Leh', 'Camel ride', 'River rafting', 'Personal expenses', 'Travel insurance'],
    },
  ]

  for (const pkg of packages) {
    await prisma.package.upsert({
      where: { slug: pkg.slug },
      update: {},
      create: pkg as any,
    })
    console.log(`Created: ${pkg.title}`)
  }

  console.log('Seeding complete! 6 packages added.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

Now add this to package.json in the scripts section:

```json
"seed": "npx ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
```

Then run:

```bash
npm run seed
```

---

## 11. Run and Test

```bash
npm run dev
```

Test these URLs in your browser:

| URL | What You Should See |
|-----|---------------------|
| localhost:3000 | Home page with hero, categories, featured packages |
| localhost:3000/packages | All 6 packages with filter bar |
| localhost:3000/packages?category=HONEYMOON | Only honeymoon packages |
| localhost:3000/packages?search=goa | Search results for Goa |
| localhost:3000/packages/golden-triangle-tour | Full package detail page |
| localhost:3000/api/packages | JSON list of all packages |

---

## Phase 2 Checklist

| Number | Task | Done |
|--------|------|------|
| 1 | Navbar.tsx created with mobile menu | No |
| 2 | Footer.tsx created | No |
| 3 | app/(customer)/layout.tsx created | No |
| 4 | Home page built with hero and categories | No |
| 5 | PackageCard.tsx component created | No |
| 6 | PackageFilter.tsx component created | No |
| 7 | Package listing page /packages working | No |
| 8 | Package detail page /packages/[slug] working | No |
| 9 | Package API GET and POST routes created | No |
| 10 | Package API GET PUT DELETE single created | No |
| 11 | 6 dummy packages seeded successfully | No |
| 12 | Filters working by category, duration, budget | No |
| 13 | WhatsApp button on detail page working | No |
| 14 | Mobile responsive navbar working | No |
| 15 | All pages tested in browser | No |

---
# Phase 3 — Login, Register, Booking Flow and Razorpay Payment
### Travel Website (Travel Sphere Clone) — Complete Guide

---

## Table of Contents
1. What We Build in Phase 3
2. Middleware — Protect Routes
3. Login Page
4. Register Page
5. Multi-Step Booking Flow
6. Booking API
7. Razorpay Payment Integration
8. Payment API Routes
9. Booking Confirmation Page
10. Booking Confirmation Email
11. Run and Test
12. Phase 3 Checklist

---

## 1. What We Build in Phase 3

| Feature | Description |
|---------|-------------|
| Login Page | Email and password login form with validation |
| Register Page | Name, email, phone, password registration form |
| Middleware | Protect /booking and /admin routes |
| Booking Step 1 | Select travel date and number of travellers |
| Booking Step 2 | Enter traveller details (name, age, gender) |
| Booking Step 3 | Review summary and confirm booking |
| Razorpay Payment | Create order, open Razorpay popup, verify payment |
| Booking API | Create booking, update status after payment |
| Payment API | Create Razorpay order, verify signature |
| Confirmation Page | Show booking details after successful payment |
| Email | Auto send booking confirmation email to user |

---

## 2. Middleware — Protect Routes

Create file: middleware.ts  (in root of project, same level as app folder)

```typescript
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Only admins can access /admin routes
    if (path.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname

        // These paths require login
        if (path.startsWith('/booking')) return !!token
        if (path.startsWith('/admin')) return !!token

        return true
      }
    }
  }
)

export const config = {
  matcher: ['/booking/:path*', '/admin/:path*']
}
```

---

## 3. Login Page

Create file: app/(auth)/login/page.tsx

```tsx
'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError('Invalid email or password. Please try again.')
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-orange-500">
            Travel Sphere
          </Link>
          <h1 className="text-xl font-bold text-gray-800 mt-4">Welcome Back</h1>
          <p className="text-gray-500 text-sm mt-1">Login to your account to continue</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Enter your password"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Do not have an account?{' '}
          <Link href="/register" className="text-orange-500 font-medium hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  )
}
```

---

## 4. Register Page

Create file: app/(auth)/register/page.tsx

```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'Something went wrong.')
    } else {
      router.push('/login?registered=true')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-orange-500">
            Travel Sphere
          </Link>
          <h1 className="text-xl font-bold text-gray-800 mt-4">Create Account</h1>
          <p className="text-gray-500 text-sm mt-1">Join thousands of happy travelers</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your full name"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+91 8603606089"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Minimum 6 characters"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              required
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              placeholder="Re-enter your password"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-orange-500 font-medium hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  )
}
```

Also update the auth layout so it does not show navbar and footer.

Create file: app/(auth)/layout.tsx

```tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
```

---

## 5. Multi-Step Booking Flow

This is a 3-step booking page. We use React state to manage which step the user is on.

Create file: app/(customer)/booking/[packageId]/page.tsx

```tsx
'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Package {
  id: string
  title: string
  destination: string
  price: number
  duration: number
  category: string
}

interface Traveller {
  name: string
  age: string
  gender: string
}

export default function BookingPage({ params }: { params: { packageId: string } }) {
  const { data: session } = useSession()
  const router = useRouter()

  const [pkg, setPkg] = useState<Package | null>(null)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [bookingId, setBookingId] = useState('')

  // Step 1 data
  const [travelDate, setTravelDate] = useState('')
  const [travellerCount, setTravellerCount] = useState(1)

  // Step 2 data
  const [travellers, setTravellers] = useState<Traveller[]>([
    { name: '', age: '', gender: 'MALE' }
  ])

  // Fetch package details
  useEffect(() => {
    fetch(`/api/packages/${params.packageId}`)
      .then((r) => r.json())
      .then(setPkg)
  }, [params.packageId])

  // Update travellers array when count changes
  useEffect(() => {
    setTravellers(
      Array.from({ length: travellerCount }, (_, i) =>
        travellers[i] || { name: '', age: '', gender: 'MALE' }
      )
    )
  }, [travellerCount])

  const totalAmount = pkg ? pkg.price * travellerCount : 0

  // Update single traveller field
  const updateTraveller = (index: number, field: keyof Traveller, value: string) => {
    const updated = [...travellers]
    updated[index] = { ...updated[index], [field]: value }
    setTravellers(updated)
  }

  // Step 1 validation
  const validateStep1 = () => {
    if (!travelDate) { alert('Please select a travel date.'); return false }
    const selected = new Date(travelDate)
    const today = new Date()
    if (selected <= today) { alert('Please select a future date.'); return false }
    return true
  }

  // Step 2 validation
  const validateStep2 = () => {
    for (const t of travellers) {
      if (!t.name.trim()) { alert('Please enter name for all travellers.'); return false }
      if (!t.age || parseInt(t.age) < 1) { alert('Please enter valid age for all travellers.'); return false }
    }
    return true
  }

  // Create booking and open Razorpay
  const handlePayment = async () => {
    setLoading(true)

    try {
      // Step 1: Create booking in DB
      const bookingRes = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: params.packageId,
          travelDate,
          travellers: travellerCount,
          totalAmount,
          travellersInfo: travellers,
        }),
      })

      const bookingData = await bookingRes.json()
      if (!bookingRes.ok) throw new Error(bookingData.error)
      setBookingId(bookingData.id)

      // Step 2: Create Razorpay order
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: bookingData.id,
          amount: totalAmount,
        }),
      })

      const orderData = await orderRes.json()
      if (!orderRes.ok) throw new Error(orderData.error)

      // Step 3: Open Razorpay popup
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: 'INR',
        name: 'Travel Sphere',
        description: pkg?.title,
        order_id: orderData.id,
        prefill: {
          name: session?.user?.name,
          email: session?.user?.email,
        },
        theme: { color: '#f97316' },
        handler: async function (response: any) {
          // Step 4: Verify payment
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              bookingId: bookingData.id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          })

          const verifyData = await verifyRes.json()

          if (verifyData.success) {
            router.push(`/booking/confirmation/${bookingData.id}`)
          } else {
            alert('Payment verification failed. Please contact support.')
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false)
          }
        }
      }

      // Load Razorpay script and open
      const rzp = new (window as any).Razorpay(options)
      rzp.open()

    } catch (err: any) {
      alert(err.message || 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Loading package details...</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">

      {/* Page Title */}
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Book Your Trip</h1>
      <p className="text-gray-500 text-sm mb-8">{pkg.title} — {pkg.destination}</p>

      {/* Step Indicator */}
      <div className="flex items-center mb-10">
        {['Travel Details', 'Traveller Info', 'Review and Pay'].map((label, i) => (
          <div key={i} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                ${step > i + 1 ? 'bg-green-500 text-white' : step === i + 1 ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {step > i + 1 ? 'Done' : i + 1}
              </div>
              <span className={`text-xs mt-1 text-center ${step === i + 1 ? 'text-orange-500 font-medium' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
            {i < 2 && (
              <div className={`flex-1 h-0.5 mx-2 mb-4 ${step > i + 1 ? 'bg-green-400' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* STEP 1 — Travel Details */}
      {step === 1 && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Step 1: Travel Details</h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Travel Date
              </label>
              <input
                type="date"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Travellers
              </label>
              <select
                value={travellerCount}
                onChange={(e) => setTravellerCount(parseInt(e.target.value))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'People'}</option>
                ))}
              </select>
            </div>

            {/* Price Summary */}
            <div className="bg-orange-50 rounded-xl p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Price per person</span>
                <span className="font-medium">Rs {pkg.price.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Number of travellers</span>
                <span className="font-medium">x {travellerCount}</span>
              </div>
              <div className="border-t border-orange-200 pt-2 flex justify-between font-bold text-orange-600">
                <span>Total Amount</span>
                <span>Rs {totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => validateStep1() && setStep(2)}
            className="mt-6 w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition"
          >
            Continue to Traveller Details
          </button>
        </div>
      )}

      {/* STEP 2 — Traveller Info */}
      {step === 2 && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6">
            Step 2: Traveller Information
          </h2>

          <div className="space-y-6">
            {travellers.map((t, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-4">
                <h3 className="font-semibold text-gray-700 mb-4 text-sm">
                  Traveller {i + 1}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-xs text-gray-500 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={t.name}
                      onChange={(e) => updateTraveller(i, 'name', e.target.value)}
                      placeholder="Full name"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Age</label>
                    <input
                      type="number"
                      value={t.age}
                      onChange={(e) => updateTraveller(i, 'age', e.target.value)}
                      placeholder="Age"
                      min="1"
                      max="99"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Gender</label>
                    <select
                      value={t.gender}
                      onChange={(e) => updateTraveller(i, 'gender', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    >
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setStep(1)}
              className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50 transition"
            >
              Back
            </button>
            <button
              onClick={() => validateStep2() && setStep(3)}
              className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition"
            >
              Review Booking
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 — Review and Pay */}
      {step === 3 && (
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6">
            Step 3: Review and Pay
          </h2>

          {/* Package Summary */}
          <div className="bg-orange-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Package Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Package</span>
                <span className="font-medium">{pkg.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Destination</span>
                <span className="font-medium">{pkg.destination}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Duration</span>
                <span className="font-medium">{pkg.duration} Days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Travel Date</span>
                <span className="font-medium">
                  {new Date(travelDate).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Travellers</span>
                <span className="font-medium">{travellerCount} Person(s)</span>
              </div>
            </div>
          </div>

          {/* Traveller Summary */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">Traveller Details</h3>
            <div className="space-y-2">
              {travellers.map((t, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2 text-sm">
                  <span className="font-medium text-gray-700">{t.name}</span>
                  <span className="text-gray-500">{t.age} years — {t.gender}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Amount Summary */}
          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Rs {pkg.price.toLocaleString('en-IN')} x {travellerCount} travellers</span>
              <span>Rs {totalAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-orange-600">
              <span>Total Payable</span>
              <span>Rs {totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Razorpay Script */}
          <script src="https://checkout.razorpay.com/v1/checkout.js" async />

          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50 transition"
            >
              Back
            </button>
            <button
              onClick={handlePayment}
              disabled={loading}
              className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition disabled:opacity-50"
            >
              {loading ? 'Processing...' : `Pay Rs ${totalAmount.toLocaleString('en-IN')}`}
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            Secured by Razorpay. Your payment information is safe.
          </p>
        </div>
      )}

    </div>
  )
}
```

---

## 6. Booking API

Create file: app/api/bookings/route.ts

```typescript
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { packageId, travelDate, travellers, totalAmount, travellersInfo } = await req.json()

    // Get user from DB
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        packageId,
        travelDate: new Date(travelDate),
        travellers,
        totalAmount,
        travellersInfo,
        status: 'PENDING',
      }
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const bookings = await prisma.booking.findMany({
      where: { userId: user.id },
      include: { package: true, payment: true },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(bookings)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}
```

---

## 7. Razorpay Payment Integration

First setup the Razorpay helper.

Create file: lib/razorpay.ts

```typescript
import Razorpay from 'razorpay'

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})
```

---

## 8. Payment API Routes

### 8a. Create Razorpay Order

Create file: app/api/payment/create-order/route.ts

```typescript
import { NextResponse } from 'next/server'
import { razorpay } from '@/lib/razorpay'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { bookingId, amount } = await req.json()

    // Create Razorpay order (amount in paise — multiply by 100)
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `booking_${bookingId}`,
      notes: { bookingId },
    })

    // Save order to DB
    await prisma.payment.create({
      data: {
        bookingId,
        razorpayOrderId: order.id,
        amount,
        status: 'PENDING',
      }
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error('Razorpay order error:', error)
    return NextResponse.json({ error: 'Failed to create payment order' }, { status: 500 })
  }
}
```

### 8b. Verify Payment Signature

Create file: app/api/payment/verify/route.ts

```typescript
import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/db'
import { sendBookingConfirmationEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const {
      bookingId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = await req.json()

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex')

    const isValid = expectedSignature === razorpay_signature

    if (!isValid) {
      // Mark payment as failed
      await prisma.payment.update({
        where: { bookingId },
        data: { status: 'FAILED' }
      })
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 })
    }

    // Update payment record
    await prisma.payment.update({
      where: { bookingId },
      data: {
        razorpayPaymentId: razorpay_payment_id,
        status: 'SUCCESS',
      }
    })

    // Update booking status to CONFIRMED
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CONFIRMED' },
      include: {
        user: true,
        package: true,
      }
    })

    // Send confirmation email
    await sendBookingConfirmationEmail(booking)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json({ success: false, error: 'Verification failed' }, { status: 500 })
  }
}
```

---

## 9. Booking Confirmation Page

Create file: app/(customer)/booking/confirmation/[bookingId]/page.tsx

```tsx
import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface Props {
  params: { bookingId: string }
}

export default async function ConfirmationPage({ params }: Props) {
  const booking = await prisma.booking.findUnique({
    where: { id: params.bookingId },
    include: {
      package: true,
      payment: true,
      user: true,
    }
  })

  if (!booking) return notFound()

  const travellersInfo = booking.travellersInfo as Array<{
    name: string
    age: string
    gender: string
  }>

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">

      {/* Success Header */}
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-green-500 text-4xl">Done</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Booking Confirmed!</h1>
        <p className="text-gray-500 mt-2">
          Your trip has been booked successfully. A confirmation email has been sent to {booking.user.email}
        </p>
      </div>

      {/* Booking Details Card */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-gray-800">Booking Details</h2>
          <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
            {booking.status}
          </span>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-gray-50">
            <span className="text-gray-500">Booking ID</span>
            <span className="font-mono font-medium text-gray-700">{booking.id.slice(0, 12).toUpperCase()}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-50">
            <span className="text-gray-500">Package</span>
            <span className="font-medium text-gray-700">{booking.package.title}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-50">
            <span className="text-gray-500">Destination</span>
            <span className="font-medium text-gray-700">{booking.package.destination}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-50">
            <span className="text-gray-500">Travel Date</span>
            <span className="font-medium text-gray-700">
              {new Date(booking.travelDate).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'long', year: 'numeric'
              })}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-50">
            <span className="text-gray-500">Duration</span>
            <span className="font-medium text-gray-700">{booking.package.duration} Days</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-50">
            <span className="text-gray-500">Travellers</span>
            <span className="font-medium text-gray-700">{booking.travellers} Person(s)</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-50">
            <span className="text-gray-500">Total Paid</span>
            <span className="font-bold text-green-600">
              Rs {booking.totalAmount.toLocaleString('en-IN')}
            </span>
          </div>
          {booking.payment && (
            <div className="flex justify-between py-2">
              <span className="text-gray-500">Payment ID</span>
              <span className="font-mono text-xs text-gray-500">{booking.payment.razorpayPaymentId}</span>
            </div>
          )}
        </div>
      </div>

      {/* Travellers Card */}
      {travellersInfo && travellersInfo.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="font-bold text-gray-800 mb-4">Traveller Details</h2>
          <div className="space-y-2">
            {travellersInfo.map((t, i) => (
              <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 text-sm">
                <span className="font-medium text-gray-700">{i + 1}. {t.name}</span>
                <span className="text-gray-400">{t.age} years — {t.gender}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="flex-1 bg-orange-500 text-white text-center py-3 rounded-xl font-semibold hover:bg-orange-600 transition"
        >
          Back to Home
        </Link>
        <Link
          href="/packages"
          className="flex-1 border border-gray-300 text-gray-600 text-center py-3 rounded-xl font-medium hover:bg-gray-50 transition"
        >
          Explore More Packages
        </Link>
      </div>

      {/* Help */}
      <div className="text-center mt-8 text-sm text-gray-400">
        Need help? WhatsApp us at{' '}
        <a href="https://wa.me/918603606089" className="text-green-500 font-medium">
          +91 8603606089
        </a>
      </div>

    </div>
  )
}
```

---

## 10. Booking Confirmation Email

Create file: lib/email.ts

```typescript
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export async function sendBookingConfirmationEmail(booking: any) {
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
      subject: `Booking Confirmed — ${pkg.title}`,
      html,
    })
    console.log(`Confirmation email sent to ${user.email}`)
  } catch (error) {
    // Do not throw — email failure should not break the booking flow
    console.error('Email sending failed:', error)
  }
}
```

---

## 11. Add Razorpay Script to Layout

Open app/(customer)/layout.tsx and add the Razorpay script tag:

```tsx
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Script from 'next/script'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="beforeInteractive" />
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        {children}
      </main>
      <Footer />
    </>
  )
}
```

---

## 12. Gmail App Password Setup

To send emails you need a Gmail App Password (not your regular password).

Steps:
1. Go to your Google Account at myaccount.google.com
2. Click Security in the left sidebar
3. Turn on 2-Step Verification if not already on
4. Search for App passwords in the search bar
5. Create a new App Password for Mail
6. Copy the 16-character password
7. Paste it in your .env.local as EMAIL_PASS

---

## 13. Razorpay Test Keys Setup

1. Go to dashboard.razorpay.com
2. Create a free account
3. Go to Settings then API Keys
4. Click Generate Test Key
5. Copy Key ID and Key Secret
6. Paste them in your .env.local

For testing use these test cards:
- Card Number: 4111 1111 1111 1111
- Expiry: Any future date
- CVV: Any 3 digits
- OTP: 1234 (for test mode)

---

## 14. Run and Test

```bash
npm run dev
```

Test this complete flow:

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Go to localhost:3000/register | Register form shows |
| 2 | Register a new account | Redirected to login page |
| 3 | Login with your account | Logged in, name shows in navbar |
| 4 | Go to any package detail page | Book Now button shows |
| 5 | Click Book Now | Redirected to booking page step 1 |
| 6 | Select date and travellers | Price calculated correctly |
| 7 | Enter traveller details | All fields work |
| 8 | Review and pay | Summary shows correctly |
| 9 | Click Pay button | Razorpay popup opens |
| 10 | Complete test payment | Redirected to confirmation page |
| 11 | Check email inbox | Confirmation email received |
| 12 | Try accessing /booking without login | Redirected to login |

---

## Phase 3 Checklist

| Number | Task | Done |
|--------|------|------|
| 1 | middleware.ts created in root | No |
| 2 | app/(auth)/layout.tsx created | No |
| 3 | Login page created and working | No |
| 4 | Register page created and working | No |
| 5 | Can register a new user successfully | No |
| 6 | Can login and see name in navbar | No |
| 7 | Booking page step 1 working | No |
| 8 | Booking page step 2 working | No |
| 9 | Booking page step 3 review working | No |
| 10 | lib/razorpay.ts created | No |
| 11 | app/api/bookings/route.ts created | No |
| 12 | app/api/payment/create-order/route.ts created | No |
| 13 | app/api/payment/verify/route.ts created | No |
| 14 | Razorpay test keys added to .env.local | No |
| 15 | Razorpay popup opens on payment click | No |
| 16 | Test payment completes successfully | No |
| 17 | Redirected to confirmation page after payment | No |
| 18 | lib/email.ts created | No |
| 19 | Gmail App Password configured in .env.local | No |
| 20 | Confirmation email received in inbox | No |
| 21 | Protected routes redirect to login when not logged in | No |

---

## What is Next — Phase 4

Once Phase 3 is complete, Phase 4 will cover:

- Admin Dashboard with stats overview (total bookings, revenue, users)
- Admin Package Management — add, edit, delete packages with image upload
- Admin Bookings Management — view all bookings, update status
- Admin Customer Management — view all users
- Cloudinary Image Upload for package photos
- Revenue Reports and Charts

Reply "Phase 3 done" when you are ready and I will guide you through Phase 4 with full code!

---

Made for Travel Sphere Clone Project — Full Stack Travel Website



# Phase 4 — Admin Dashboard
### Travel Website (Travel Sphere Clone) — Complete Guide

---

## Table of Contents
1. What We Build in Phase 4
2. Admin Layout and Sidebar
3. Admin Dashboard Home Stats
4. Admin Package List
5. Admin Add New Package
6. Admin Edit Package
7. Admin Bookings Management
8. Admin Customers Page
9. Cloudinary Image Upload
10. Image Upload API
11. Booking Status Update API
12. Make First Admin User
13. Run and Test
14. Phase 4 Checklist
15. Full Project Complete

---

## 1. What We Build in Phase 4

| Feature | Description |
|---------|-------------|
| Admin Sidebar Layout | Navigation sidebar for all admin pages |
| Stats Dashboard | Total bookings, revenue, users, packages |
| Package List | Table of all packages with edit and delete |
| Add Package Form | Full form with Cloudinary image upload |
| Edit Package | Pre-filled edit form for existing packages |
| Bookings Table | All bookings with status update dropdown |
| Customers Table | All registered users with booking count |
| Image Upload API | Upload images to Cloudinary |

---

## 2. Admin Layout and Sidebar

Create file: app/admin/layout.tsx

```tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

const navItems = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/packages', label: 'Packages' },
  { href: '/admin/packages/new', label: 'Add Package' },
  { href: '/admin/bookings', label: 'Bookings' },
  { href: '/admin/customers', label: 'Customers' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:flex lg:flex-col
      `}>
        <div className="px-6 py-5 border-b border-gray-700">
          <Link href="/" className="text-xl font-bold text-orange-400">Travel Sphere Admin</Link>
          <p className="text-xs text-gray-400 mt-1">Management Panel</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition
                  ${isActive ? 'bg-orange-500 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="px-4 py-4 border-t border-gray-700 space-y-2">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-300 hover:bg-gray-800 transition">
            View Website
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-gray-800 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 text-xl">Menu</button>
          <h1 className="text-lg font-semibold text-gray-700">Admin Panel</h1>
          <span className="text-sm text-gray-400">Travel Sphere</span>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
```

---

## 3. Admin Dashboard Home Stats

Create file: app/admin/page.tsx

```tsx
import { prisma } from '@/lib/db'
import Link from 'next/link'

async function getStats() {
  const [totalBookings, totalUsers, totalPackages, revenueResult, recentBookings, pendingBookings] =
    await Promise.all([
      prisma.booking.count(),
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.package.count({ where: { isActive: true } }),
      prisma.booking.aggregate({ _sum: { totalAmount: true }, where: { status: 'CONFIRMED' } }),
      prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: true, package: true },
      }),
      prisma.booking.count({ where: { status: 'PENDING' } }),
    ])

  return {
    totalBookings, totalUsers, totalPackages,
    totalRevenue: revenueResult._sum.totalAmount || 0,
    recentBookings, pendingBookings,
  }
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    CONFIRMED: 'bg-green-100 text-green-700',
    PENDING: 'bg-yellow-100 text-yellow-700',
    CANCELLED: 'bg-red-100 text-red-700',
    COMPLETED: 'bg-blue-100 text-blue-700',
  }
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  )
}

export default async function AdminDashboard() {
  const stats = await getStats()

  const statCards = [
    { label: 'Total Bookings', value: stats.totalBookings, bg: 'bg-blue-500', link: '/admin/bookings' },
    { label: 'Total Revenue', value: `Rs ${stats.totalRevenue.toLocaleString('en-IN')}`, bg: 'bg-green-500', link: '/admin/bookings' },
    { label: 'Active Packages', value: stats.totalPackages, bg: 'bg-orange-500', link: '/admin/packages' },
    { label: 'Registered Users', value: stats.totalUsers, bg: 'bg-purple-500', link: '/admin/customers' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here is what is happening today.</p>
      </div>

      {stats.pendingBookings > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-5 py-4 flex items-center justify-between">
          <p className="text-yellow-700 text-sm font-medium">
            You have {stats.pendingBookings} pending booking(s) that need attention.
          </p>
          <Link href="/admin/bookings?status=PENDING" className="text-yellow-600 text-sm font-semibold hover:underline">
            View Now
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => (
          <Link key={card.label} href={card.link}>
            <div className={`${card.bg} text-white rounded-2xl p-5 hover:opacity-90 transition cursor-pointer`}>
              <p className="text-sm opacity-80 mb-1">{card.label}</p>
              <p className="text-2xl font-bold">{card.value}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-gray-800">Recent Bookings</h2>
          <Link href="/admin/bookings" className="text-orange-500 text-sm hover:underline">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-gray-100">
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Package</th>
                <th className="pb-3 font-medium">Travel Date</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats.recentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="py-3 font-medium text-gray-700">{booking.user.name}</td>
                  <td className="py-3 text-gray-500 truncate max-w-[150px]">{booking.package.title}</td>
                  <td className="py-3 text-gray-500">{new Date(booking.travelDate).toLocaleDateString('en-IN')}</td>
                  <td className="py-3 font-medium">Rs {booking.totalAmount.toLocaleString('en-IN')}</td>
                  <td className="py-3"><StatusBadge status={booking.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {stats.recentBookings.length === 0 && (
            <p className="text-center text-gray-400 py-8">No bookings yet</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/admin/packages/new" className="bg-orange-500 text-white text-center py-4 rounded-2xl font-semibold hover:bg-orange-600 transition">Add New Package</Link>
        <Link href="/admin/bookings" className="bg-blue-500 text-white text-center py-4 rounded-2xl font-semibold hover:bg-blue-600 transition">Manage Bookings</Link>
        <Link href="/admin/customers" className="bg-purple-500 text-white text-center py-4 rounded-2xl font-semibold hover:bg-purple-600 transition">View Customers</Link>
      </div>
    </div>
  )
}
```

---

## 4. Admin Package List

Create file: app/admin/packages/page.tsx

```tsx
import { prisma } from '@/lib/db'
import Link from 'next/link'
import DeletePackageButton from './DeletePackageButton'

export default async function AdminPackagesPage() {
  const packages = await prisma.package.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { bookings: true } } }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Packages</h1>
          <p className="text-gray-500 text-sm mt-1">{packages.length} total packages</p>
        </div>
        <Link href="/admin/packages/new" className="bg-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-orange-600 transition">
          Add New Package
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-gray-500">
                <th className="px-5 py-4 font-medium">Package</th>
                <th className="px-5 py-4 font-medium">Category</th>
                <th className="px-5 py-4 font-medium">Duration</th>
                <th className="px-5 py-4 font-medium">Price</th>
                <th className="px-5 py-4 font-medium">Bookings</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {packages.map((pkg) => (
                <tr key={pkg.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <div className="font-medium text-gray-800 max-w-[200px] truncate">{pkg.title}</div>
                    <div className="text-gray-400 text-xs mt-0.5">{pkg.destination}</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="bg-orange-100 text-orange-600 text-xs font-semibold px-2 py-1 rounded-full">{pkg.category}</span>
                  </td>
                  <td className="px-5 py-4 text-gray-600">{pkg.duration} Days</td>
                  <td className="px-5 py-4 font-medium text-gray-800">Rs {pkg.price.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-4 text-gray-600">{pkg._count.bookings}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${pkg.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {pkg.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/packages/${pkg.id}/edit`} className="text-blue-500 hover:underline text-xs font-medium">Edit</Link>
                      <DeletePackageButton id={pkg.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {packages.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p>No packages yet.</p>
              <Link href="/admin/packages/new" className="text-orange-500 text-sm mt-2 inline-block hover:underline">Add your first package</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

Create file: app/admin/packages/DeletePackageButton.tsx

```tsx
'use client'

import { useRouter } from 'next/navigation'

export default function DeletePackageButton({ id }: { id: string }) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this package?')) return
    await fetch(`/api/packages/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <button onClick={handleDelete} className="text-red-500 hover:underline text-xs font-medium">
      Delete
    </button>
  )
}
```

---

## 5. Admin Add New Package

Create file: app/admin/packages/new/page.tsx

```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const categories = ['FAMILY', 'HONEYMOON', 'GROUP', 'PILGRIMAGE', 'ADVENTURE', 'SOLO', 'CORPORATE']

interface ItineraryDay {
  day: number
  title: string
  description: string
}

export default function AddPackagePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [images, setImages] = useState<string[]>([])

  const [form, setForm] = useState({
    title: '', destination: '', description: '',
    price: '', duration: '', category: 'FAMILY',
    inclusions: '', exclusions: '',
  })

  const [itinerary, setItinerary] = useState<ItineraryDay[]>([{ day: 1, title: '', description: '' }])

  const updateField = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }))

  const updateItinerary = (index: number, field: keyof ItineraryDay, value: string) => {
    const updated = [...itinerary]
    updated[index] = { ...updated[index], [field]: value }
    setItinerary(updated)
  }

  const addDay = () => setItinerary([...itinerary, { day: itinerary.length + 1, title: '', description: '' }])

  const removeDay = (index: number) => {
    if (itinerary.length <= 1) return
    setItinerary(itinerary.filter((_, i) => i !== index).map((d, i) => ({ ...d, day: i + 1 })))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: formData })
    const data = await res.json()
    if (data.url) setImages((prev) => [...prev, data.url])
    setUploadingImage(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('/api/packages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price),
        duration: parseInt(form.duration),
        images,
        itinerary,
        inclusions: form.inclusions.split('\n').filter(Boolean),
        exclusions: form.exclusions.split('\n').filter(Boolean),
      }),
    })

    setLoading(false)
    if (res.ok) { router.push('/admin/packages'); router.refresh() }
    else alert('Failed to create package. Please try again.')
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Add New Package</h1>
        <p className="text-gray-500 text-sm mt-1">Fill in all the details for the new tour package</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Basic Info */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-gray-700">Basic Information</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Package Title</label>
            <input type="text" required value={form.title} onChange={(e) => updateField('title', e.target.value)}
              placeholder="e.g. Golden Triangle Tour"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
            <input type="text" required value={form.destination} onChange={(e) => updateField('destination', e.target.value)}
              placeholder="e.g. Delhi - Agra - Jaipur"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea required rows={4} value={form.description} onChange={(e) => updateField('description', e.target.value)}
              placeholder="Write a detailed description of the package..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs)</label>
              <input type="number" required min="0" value={form.price} onChange={(e) => updateField('price', e.target.value)}
                placeholder="15000" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Days)</label>
              <input type="number" required min="1" value={form.duration} onChange={(e) => updateField('duration', e.target.value)}
                placeholder="6" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={form.category} onChange={(e) => updateField('category', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-bold text-gray-700 mb-4">Package Images</h2>
          <label className="block cursor-pointer">
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-orange-400 transition">
              <p className="text-gray-400 text-sm">{uploadingImage ? 'Uploading...' : 'Click to upload an image'}</p>
              <p className="text-gray-300 text-xs mt-1">JPG, PNG up to 5MB</p>
            </div>
            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} className="hidden" />
          </label>

          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mt-4">
              {images.map((url, i) => (
                <div key={i} className="relative group">
                  <img src={url} alt={`Image ${i + 1}`} className="w-full h-24 object-cover rounded-lg" />
                  <button type="button" onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                    className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition">
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Itinerary */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-700">Day-wise Itinerary</h2>
            <button type="button" onClick={addDay} className="text-orange-500 text-sm font-medium hover:underline">Add Day</button>
          </div>
          <div className="space-y-4">
            {itinerary.map((day, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-sm text-gray-700">Day {day.day}</span>
                  {itinerary.length > 1 && (
                    <button type="button" onClick={() => removeDay(i)} className="text-red-400 text-xs hover:underline">Remove</button>
                  )}
                </div>
                <div className="space-y-3">
                  <input type="text" required value={day.title} onChange={(e) => updateItinerary(i, 'title', e.target.value)}
                    placeholder="Day title e.g. Arrival in Delhi"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                  <textarea required rows={2} value={day.description} onChange={(e) => updateItinerary(i, 'description', e.target.value)}
                    placeholder="What happens on this day..."
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inclusions and Exclusions */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-bold text-gray-700 mb-4">Inclusions and Exclusions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Inclusions (one per line)</label>
              <textarea rows={6} value={form.inclusions} onChange={(e) => updateField('inclusions', e.target.value)}
                placeholder="Hotel accommodation&#10;Daily breakfast&#10;All transfers"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exclusions (one per line)</label>
              <textarea rows={6} value={form.exclusions} onChange={(e) => updateField('exclusions', e.target.value)}
                placeholder="Flights&#10;Lunch and dinner&#10;Personal expenses"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={() => router.back()}
            className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50 transition">
            Cancel
          </button>
          <button type="submit" disabled={loading}
            className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition disabled:opacity-50">
            {loading ? 'Creating Package...' : 'Create Package'}
          </button>
        </div>

      </form>
    </div>
  )
}
```

---

## 6. Admin Edit Package

Create file: app/admin/packages/[id]/edit/page.tsx

```tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const categories = ['FAMILY', 'HONEYMOON', 'GROUP', 'PILGRIMAGE', 'ADVENTURE', 'SOLO', 'CORPORATE']

export default function EditPackagePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  const [form, setForm] = useState({
    title: '', destination: '', description: '',
    price: '', duration: '', category: 'FAMILY',
    inclusions: '', exclusions: '', isActive: true,
  })

  const [itinerary, setItinerary] = useState([{ day: 1, title: '', description: '' }])

  useEffect(() => {
    fetch(`/api/packages/${params.id}`)
      .then((r) => r.json())
      .then((pkg) => {
        setForm({
          title: pkg.title,
          destination: pkg.destination,
          description: pkg.description,
          price: String(pkg.price),
          duration: String(pkg.duration),
          category: pkg.category,
          inclusions: pkg.inclusions.join('\n'),
          exclusions: pkg.exclusions.join('\n'),
          isActive: pkg.isActive,
        })
        setItinerary(pkg.itinerary || [{ day: 1, title: '', description: '' }])
        setFetching(false)
      })
  }, [params.id])

  const updateField = (field: string, value: any) => setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch(`/api/packages/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price),
        duration: parseInt(form.duration),
        itinerary,
        inclusions: form.inclusions.split('\n').filter(Boolean),
        exclusions: form.exclusions.split('\n').filter(Boolean),
      }),
    })

    setLoading(false)
    if (res.ok) { router.push('/admin/packages'); router.refresh() }
    else alert('Failed to update package.')
  }

  if (fetching) return <div className="text-gray-400 py-10 text-center">Loading package...</div>

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Edit Package</h1>

      <form onSubmit={handleSubmit} className="space-y-6">

        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-gray-700">Basic Information</h2>

          {['title', 'destination'].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field}</label>
              <input type="text" required value={(form as any)[field]} onChange={(e) => updateField(field, e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea required rows={4} value={form.description} onChange={(e) => updateField('description', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs)</label>
              <input type="number" required value={form.price} onChange={(e) => updateField('price', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Days)</label>
              <input type="number" required value={form.duration} onChange={(e) => updateField('duration', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={form.category} onChange={(e) => updateField('category', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input type="checkbox" id="isActive" checked={form.isActive}
              onChange={(e) => updateField('isActive', e.target.checked)} className="w-4 h-4 accent-orange-500" />
            <label htmlFor="isActive" className="text-sm text-gray-700">Package is Active (visible on website)</label>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-700">Day-wise Itinerary</h2>
            <button type="button"
              onClick={() => setItinerary([...itinerary, { day: itinerary.length + 1, title: '', description: '' }])}
              className="text-orange-500 text-sm font-medium hover:underline">Add Day</button>
          </div>
          <div className="space-y-4">
            {itinerary.map((day, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-4">
                <p className="font-semibold text-sm text-gray-700 mb-3">Day {day.day}</p>
                <div className="space-y-3">
                  <input type="text" required value={day.title}
                    onChange={(e) => { const u = [...itinerary]; u[i] = { ...u[i], title: e.target.value }; setItinerary(u) }}
                    placeholder="Day title" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                  <textarea required rows={2} value={day.description}
                    onChange={(e) => { const u = [...itinerary]; u[i] = { ...u[i], description: e.target.value }; setItinerary(u) }}
                    placeholder="Description" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="font-bold text-gray-700 mb-4">Inclusions and Exclusions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Inclusions (one per line)</label>
              <textarea rows={6} value={form.inclusions} onChange={(e) => updateField('inclusions', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exclusions (one per line)</label>
              <textarea rows={6} value={form.exclusions} onChange={(e) => updateField('exclusions', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={() => router.back()}
            className="flex-1 border border-gray-300 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50 transition">Cancel</button>
          <button type="submit" disabled={loading}
            className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
```

---

## 7. Admin Bookings Management

Create file: app/admin/bookings/page.tsx

```tsx
import { prisma } from '@/lib/db'
import UpdateBookingStatus from './UpdateBookingStatus'

export default async function AdminBookingsPage({ searchParams }: { searchParams: { status?: string } }) {
  const where = searchParams.status ? { status: searchParams.status as any } : {}

  const bookings = await prisma.booking.findMany({
    where,
    include: { user: true, package: true, payment: true },
    orderBy: { createdAt: 'desc' },
  })

  const statusFilters = ['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Bookings</h1>
        <p className="text-gray-500 text-sm mt-1">{bookings.length} bookings found</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {statusFilters.map((status) => (
          <a key={status}
            href={status === 'ALL' ? '/admin/bookings' : `/admin/bookings?status=${status}`}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition
              ${(searchParams.status === status || (!searchParams.status && status === 'ALL'))
                ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {status}
          </a>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-gray-500">
                <th className="px-5 py-4 font-medium">Booking ID</th>
                <th className="px-5 py-4 font-medium">Customer</th>
                <th className="px-5 py-4 font-medium">Package</th>
                <th className="px-5 py-4 font-medium">Travel Date</th>
                <th className="px-5 py-4 font-medium">Travellers</th>
                <th className="px-5 py-4 font-medium">Amount</th>
                <th className="px-5 py-4 font-medium">Payment</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 font-medium">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 font-mono text-xs text-gray-500">{booking.id.slice(0, 8).toUpperCase()}</td>
                  <td className="px-5 py-4">
                    <div className="font-medium text-gray-700">{booking.user.name}</div>
                    <div className="text-gray-400 text-xs">{booking.user.email}</div>
                  </td>
                  <td className="px-5 py-4 text-gray-600 max-w-[150px] truncate">{booking.package.title}</td>
                  <td className="px-5 py-4 text-gray-600">{new Date(booking.travelDate).toLocaleDateString('en-IN')}</td>
                  <td className="px-5 py-4 text-center text-gray-600">{booking.travellers}</td>
                  <td className="px-5 py-4 font-medium text-gray-800">Rs {booking.totalAmount.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full
                      ${booking.payment?.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-600'}`}>
                      {booking.payment?.status || 'PENDING'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full
                      ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700'
                        : booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700'
                        : booking.status === 'CANCELLED' ? 'bg-red-100 text-red-600'
                        : 'bg-blue-100 text-blue-700'}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <UpdateBookingStatus bookingId={booking.id} currentStatus={booking.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {bookings.length === 0 && <p className="text-center text-gray-400 py-10">No bookings found</p>}
        </div>
      </div>
    </div>
  )
}
```

Create file: app/admin/bookings/UpdateBookingStatus.tsx

```tsx
'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function UpdateBookingStatus({ bookingId, currentStatus }: { bookingId: string; currentStatus: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLoading(true)
    await fetch(`/api/bookings/${bookingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: e.target.value }),
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <select defaultValue={currentStatus} onChange={handleChange} disabled={loading}
      className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-orange-400">
      {['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
  )
}
```

---

## 8. Admin Customers Page

Create file: app/admin/customers/page.tsx

```tsx
import { prisma } from '@/lib/db'

export default async function AdminCustomersPage() {
  const users = await prisma.user.findMany({
    where: { role: 'USER' },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { bookings: true } },
      bookings: { select: { totalAmount: true, status: true } }
    }
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
        <p className="text-gray-500 text-sm mt-1">{users.length} registered customers</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-left text-gray-500">
                <th className="px-5 py-4 font-medium">Customer</th>
                <th className="px-5 py-4 font-medium">Phone</th>
                <th className="px-5 py-4 font-medium">Total Bookings</th>
                <th className="px-5 py-4 font-medium">Total Spent</th>
                <th className="px-5 py-4 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => {
                const totalSpent = user.bookings
                  .filter((b) => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
                  .reduce((sum, b) => sum + b.totalAmount, 0)
                return (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <div className="font-medium text-gray-800">{user.name}</div>
                      <div className="text-gray-400 text-xs">{user.email}</div>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{user.phone || 'Not provided'}</td>
                    <td className="px-5 py-4 text-center font-medium text-gray-700">{user._count.bookings}</td>
                    <td className="px-5 py-4 font-medium text-green-600">Rs {totalSpent.toLocaleString('en-IN')}</td>
                    <td className="px-5 py-4 text-gray-400 text-xs">
                      {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {users.length === 0 && <p className="text-center text-gray-400 py-10">No customers yet</p>}
        </div>
      </div>
    </div>
  )
}
```

---

## 9. Cloudinary Setup

1. Go to cloudinary.com and create a free account
2. Go to Settings then Upload then Upload Presets
3. Create a new preset — set Signing Mode to Unsigned
4. Copy the preset name

Add these to your .env.local:

```env
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your_cloud_name"
```

---

## 10. Image Upload API

Create file: app/api/upload/route.ts

```typescript
import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`

    const result = await cloudinary.uploader.upload(base64, {
      folder: 'travel-sphere-packages',
      transformation: [{ width: 1200, height: 800, crop: 'fill', quality: 'auto' }]
    })

    return NextResponse.json({ url: result.secure_url })
  } catch (error) {
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
```

---

## 11. Booking Status Update API

Create file: app/api/bookings/[id]/route.ts

```typescript
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { status } = await req.json()
    const booking = await prisma.booking.update({
      where: { id: params.id },
      data: { status },
    })
    return NextResponse.json(booking)
  } catch {
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 })
  }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: { user: true, package: true, payment: true }
    })
    if (!booking) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(booking)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 })
  }
}
```

---

## 12. Make First Admin User

After registering your account on the website, run these commands to make yourself admin.

Open terminal and run:

```bash
psql -U postgres -d travel_sphere_db
```

Then run this SQL — replace the email with YOUR email:

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'youremail@gmail.com';
```

Confirm it worked:

```sql
SELECT name, email, role FROM "User";
```

Exit:

```sql
\q
```

Now login to your website and you will see Admin Panel in the top navbar.

---

## 13. Run and Test

```bash
npm run dev
```

Test these pages:

| URL | What You Should See |
|-----|---------------------|
| localhost:3000/admin | Stats dashboard with 4 cards |
| localhost:3000/admin/packages | All packages in a table |
| localhost:3000/admin/packages/new | Add package form with image upload |
| localhost:3000/admin/packages/ID/edit | Edit form pre-filled |
| localhost:3000/admin/bookings | All bookings with status dropdown |
| localhost:3000/admin/customers | All registered users table |
| Visit /admin without admin role | Redirected to home page |

---

## Phase 4 Checklist

| Number | Task | Done |
|--------|------|------|
| 1 | app/admin/layout.tsx created with sidebar | No |
| 2 | Admin dashboard stats page working | No |
| 3 | Admin packages list page working | No |
| 4 | DeletePackageButton.tsx created | No |
| 5 | Add new package form working | No |
| 6 | Edit package form working | No |
| 7 | Admin bookings page working | No |
| 8 | UpdateBookingStatus.tsx created | No |
| 9 | app/api/bookings/[id]/route.ts PATCH created | No |
| 10 | Admin customers page working | No |
| 11 | Cloudinary account created and keys added | No |
| 12 | app/api/upload/route.ts created | No |
| 13 | Image upload works in add package form | No |
| 14 | Made yourself admin via SQL command | No |
| 15 | Admin Panel link shows in navbar | No |
| 16 | Non-admin users cannot access /admin | No |

---

## Full Project Complete — What to Do Next

Congratulations! All 4 phases are complete. Your website now has:

- Public pages — Home, Package Listing, Package Detail with WhatsApp button
- Auth system — Login, Register, JWT sessions, protected routes
- Full booking flow — 3-step form with Razorpay payment and email confirmation
- Admin dashboard — Manage packages, bookings, customers, image upload

### Deploy Your Website

Step 1 — Push to GitHub:


```

Step 2 — Free Production Database (Neon or Supabase):
1. Go to neon.tech or supabase.com
2. Create a free PostgreSQL database
3. Copy the connection string
4. Run: npx prisma db push

Step 3 — Deploy to Vercel (free):
1. Go to vercel.com
2. Import your GitHub repo
3. Add all environment variables from .env.local
4. Change DATABASE_URL to your production database URL
5. Click Deploy — your site is live!

Step 4 — Custom Domain:
1. Buy a domain from GoDaddy or Namecheap (around Rs 700 per year)
2. In Vercel go to Settings then Domains
3. Add your domain and update the DNS settings

### Extra Features to Add Later

| Feature | Description |
|---------|-------------|
| Google OAuth | Let users sign in with Google |
| Group Departure Calendar | Show fixed departure dates like Travel Sphere |
| Blog Section | SEO travel articles for better Google ranking |
| Coupon Codes | Discount coupons applied at checkout |
| SMS Notifications | Send booking SMS via MSG91 |
| Google Analytics | Track website visitors |
| Reviews System | Let users rate and review trips after returning |

---

All 4 Phases Complete — Travel Sphere Clone Travel Website
Phase 1: Project Setup and Auth
Phase 2: Package Listings and UI
Phase 3: Booking Flow and Razorpay Payment
Phase 4: Admin Dashboard