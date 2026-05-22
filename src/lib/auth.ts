import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './db'
import bcrypt from 'bcryptjs'

async function findOrCreateSeedAdmin(email: string, password: string) {
  const seedAdminEmail = process.env.SEED_ADMIN_EMAIL
  const seedAdminPassword = process.env.SEED_ADMIN_PASSWORD

  if (!seedAdminEmail || !seedAdminPassword) return null
  if (email.toLowerCase() !== seedAdminEmail.toLowerCase()) return null
  if (password !== seedAdminPassword) return null

  const hashedPassword = await bcrypt.hash(seedAdminPassword, 10)

  return prisma.user.upsert({
    where: { email: seedAdminEmail },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
    },
    create: {
      name: 'Admin',
      email: seedAdminEmail,
      password: hashedPassword,
      role: 'ADMIN',
    },
  })
}

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

        const email = credentials.email.trim()
        const password = credentials.password

        let user = await prisma.user.findUnique({
          where: { email }
        })

        if (!user) {
          user = await findOrCreateSeedAdmin(email, password)
        }

        if (!user) return null

        const userWithAgent = await prisma.user.findUnique({
          where: { email: user.email },
          include: { agent: { select: { status: true } } },
        })

        if (!userWithAgent) return null

        const passwordMatch = await bcrypt.compare(
          password,
          userWithAgent.password
        )

        if (!passwordMatch) return null

        if (!userWithAgent.isEmailVerified && userWithAgent.role !== 'ADMIN') {
          throw new Error('EMAIL_NOT_VERIFIED')
        }

        return {
          id: userWithAgent.id,
          name: userWithAgent.name,
          email: userWithAgent.email,
          role: userWithAgent.role,
          agentStatus: userWithAgent.agent?.status ?? null,
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
        token.agentStatus = user.agentStatus ?? null
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role
        session.user.id = token.id
        session.user.agentStatus = token.agentStatus ?? null
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`

      try {
        const targetUrl = new URL(url)
        if (targetUrl.origin === baseUrl) return url
      } catch {
        // fall through to baseUrl
      }

      return baseUrl
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
