'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
// import Link from 'next/link'
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

// import { Logo } from '@/components/Logo/Logo'
// import { HeaderNav } from './Nav'

interface HeaderClientProps {
  header: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ header }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const router = useRouter();
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

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
    <header>
    <div className="flex flex-col w-full bg-white py-4 px-2">
      <div className="flex flex-col self-center w-full max-w-[1122px] max-md:max-w-full bg-white">
        <div className="flex gap-2.5 self-end text-lg tracking-tight leading-snug text-black max-md:mr-0.5">
          <div className="grow my-auto">SignUp / LogIn</div>
          <button className="flex shrink-0 w-10 h-10 rounded-full bg-zinc-300"></button>
        </div>
        <Image
          className="object-contain self-center max-w-full aspect-[3.37]"
          src="/logo.svg"
          alt="CityQuokka"
          width={357}
          height={106}
        />
        <div className="w-full sm:w-[1120px] h-[4px]" style={{ backgroundColor: "#EFEFEF" }}></div>

        <div className="flex flex-wrap sm:flex-nowrap gap-4 sm:gap-9 self-center mt-5 sm:ml-7 text-2xl leading-snug text-black sm:text-base sm:justify-center">
          <button
            onClick={() => router.push("/")}
            className={`flex justify-center items-center whitespace-nowrap pt-2.5 ${pathname === '/' ? 'font-bold' : ''}`}
          >
            <span className="text-2xl">Home</span>
          </button>
          <p className="text-4xl hidden sm:block">|</p>

          <button
            onClick={() => router.push("/cityguide")}
            className={`flex justify-center items-center whitespace-nowrap pt-2.5 ${pathname === '/cityguide' ? 'font-bold' : ''}`}
          >
            <span className="text-2xl">City Guide</span>

          </button>
          <p className="text-4xl hidden sm:block">|</p>

          <button
            onClick={() => router.push("/business")}
            className={`flex justify-center items-center whitespace-nowrap pt-2.5 ${pathname === '/business' ? 'font-bold' : ''}`}
          >
            <span className="text-2xl">I’m a Business</span>

          </button>
        </div>
      </div>
    </div >
    </header>
  )
}
