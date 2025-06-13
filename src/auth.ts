import NextAuth, { User } from 'next-auth'
import Google, { GoogleProfile } from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { loginUser } from './app/actions/auth'
import { AuthAdapter } from './auth/adapter'
import Nodemailer from 'next-auth/providers/nodemailer'

import { LoginFormValues, loginSchema } from './validationSchemas/loginSchema'
import { Adapter } from 'next-auth/adapters'
import { sendLoginEmail } from './app/actions/auth'

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  adapter: AuthAdapter() as Adapter,
  providers: [
    Nodemailer({
      server: 'ses_not_needed',
      sendVerificationRequest({identifier: email, url}){
        sendLoginEmail(url, email)
      }
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      profile: (_profile: GoogleProfile) => {
        return {
          id: _profile.sub,
          firstName: _profile.given_name,
          lastName: _profile.family_name,
          email: _profile.email,
          image: _profile.picture
        };
      }
    }),
    Credentials({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => await loginUser(credentials as LoginFormValues) as User
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
        session.user.email = token.email as string
      }
      return session
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.firstName = user.firstName
        token.lastName = user.lastName
      }
      return token
    },
  },
  pages: {
    error: "/error",
    signIn: "/error",
    verifyRequest: "/verify-request"
  }
})
