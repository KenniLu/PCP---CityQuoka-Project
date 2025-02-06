'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
// import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'
import { SessionMenu } from '@/components/SessionMenu'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  header: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ header }) => {
  /* Storing the value in a useState to avoid hydration errors */
  // const [theme, setTheme] = useState<string | null>(null)
  // const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const router = useRouter()
  const pathname = usePathname()

  // useEffect(() => {
  //   setHeaderTheme(null)
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [pathname])

  // useEffect(() => {
  //   if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [headerTheme])

  return (
    // <header
    //   className="container relative z-20 py-8 flex justify-between"
    //   {...(theme ? { 'data-theme': theme } : {})}
    // >
    //   <Link href="/">
    //     <Logo />
    //   </Link>
    //   <HeaderNav header={header} />
    // </header>
    // <header>

    <div className="flex flex-col w-full bg-white pb-4 pt-6 mb-4">
      <div className="flex flex-col self-center w-full max-w-[390px] md:max-w-[1122px] bg-white px-4 sm:px-0">
        <SessionMenu />
        <Logo />
        <div className="w-full h-[4px] bg-[#EFEFEF]"></div>
        <HeaderNav header={header} />
      </div>
    </div>
  )
}
