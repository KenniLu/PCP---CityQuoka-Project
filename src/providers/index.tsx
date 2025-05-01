import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { SessionProvider } from "next-auth/react"
import { auth } from '@/auth'

export const Providers: React.FC<{
  children: React.ReactNode
}> = async ({ children }) => {
  const session = await auth()
  return (
    <ThemeProvider>
      {/* <AuthProvider initialUser={session?.user}> */}
      <SessionProvider session={session}>
        <HeaderThemeProvider>{children}</HeaderThemeProvider>
      {/* </AuthProvider> */}
      </SessionProvider>
    </ThemeProvider>
  )
}
