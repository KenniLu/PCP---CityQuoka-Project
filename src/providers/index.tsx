import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { AuthProvider } from './AuthProvider'
import { auth } from '@/auth'

export const Providers: React.FC<{
  children: React.ReactNode
}> = async ({ children }) => {
  const session = await auth()
  return (
    <ThemeProvider>
      <AuthProvider initialUser={session?.user}>
        <HeaderThemeProvider>{children}</HeaderThemeProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
