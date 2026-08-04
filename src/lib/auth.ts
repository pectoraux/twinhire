// NextAuth configuration for TwinHire
// JWT-based auth with Credentials provider (works serverlessly on Vercel).

import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"

export const authOptions: NextAuthOptions = {
  // JWT strategy — no database sessions, works perfectly on Vercel serverless.
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const email = credentials.email.toLowerCase().trim()
        const user = await db.user.findUnique({ where: { email } })
        if (!user) return null
        const valid = await bcrypt.compare(credentials.password, user.passwordHash)
        if (!valid) return null
        return {
          id: user.id,
          email: user.email,
          name: user.name ?? undefined,
          role: user.role,
          candidateId: user.candidateId ?? undefined,
        } as any
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id
        token.role = (user as any).role
        token.candidateId = (user as any).candidateId
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        ;(session.user as any).id = token.id
        ;(session.user as any).role = token.role
        ;(session.user as any).candidateId = token.candidateId
      }
      return session
    },
  },
  pages: {
    // We use a modal, but NextAuth needs a sign-in page URL for redirects.
    // We'll handle this client-side instead.
    signIn: "/",
  },
}

// Augment NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      id?: string
      email?: string | null
      name?: string | null
      role?: string
      candidateId?: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    role?: string
    candidateId?: string
  }
}
