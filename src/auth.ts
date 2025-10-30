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
      // Copy profile fields stored on the JWT onto the client-visible session.
      if (session.user) {
        session.user.id = typeof token.id === 'string' ? token.id : session.user.id
        session.user.email =
          typeof token.email === 'string' ? token.email : session.user.email ?? null
        session.user.firstName =
          typeof token.firstName === 'string' ? token.firstName : session.user.firstName ?? null
        session.user.lastName =
          typeof token.lastName === 'string' ? token.lastName : session.user.lastName ?? null
        session.user.mobileNumber =
          typeof token.mobileNumber === 'string'
            ? token.mobileNumber
            : session.user.mobileNumber ?? null
        session.user.address =
          typeof token.address === 'string' ? token.address : session.user.address ?? null
        session.user.city =
          typeof token.city === 'string' ? token.city : session.user.city ?? null
        session.user.state =
          typeof token.state === 'string' ? token.state : session.user.state ?? null
        session.user.postalCode =
          typeof token.postalCode === 'string'
            ? token.postalCode
            : session.user.postalCode ?? null
      }
      return session
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.mobileNumber = user.mobileNumber ?? null
        token.address = user.address ?? null
        token.city = user.city ?? null
        token.state = user.state ?? null
        token.postalCode = user.postalCode ?? null
      } else if (trigger === 'update' && session?.user) {
        // Allow `session.update` to persist fresh profile values.
        token.firstName = session.user.firstName ?? null
        token.lastName = session.user.lastName ?? null
        token.email = session.user.email ?? null
        token.mobileNumber = session.user.mobileNumber ?? null
        token.address = session.user.address ?? null
        token.city = session.user.city ?? null
        token.state = session.user.state ?? null
        token.postalCode = session.user.postalCode ?? null
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
