import { DefaultSession } from 'next-auth'
import { JWT as DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  // Teach NextAuth about the additional profile fields we store in JWT/session.
  interface Session extends DefaultSession {
    user: {
      id: string
      firstName?: string | null
      lastName?: string | null
      email?: string | null
      mobileNumber?: string | null
      address?: string | null
      city?: string | null
      state?: string | null
      postalCode?: string | null
    } & DefaultSession['user']
  }

  interface User {
    id: string
    firstName?: string | null
    lastName?: string | null
    email?: string | null
    mobileNumber?: string | null
    address?: string | null
    city?: string | null
    state?: string | null
    postalCode?: string | null
  }
}

declare module 'next-auth/jwt' {
  // Keep the token typing aligned with the session/user extensions above.
  interface JWT extends DefaultJWT {
    id?: string
    firstName?: string | null
    lastName?: string | null
    email?: string | null
    mobileNumber?: string | null
    address?: string | null
    city?: string | null
    state?: string | null
    postalCode?: string | null
  }
}
