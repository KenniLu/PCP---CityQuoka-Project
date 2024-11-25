import { getCachedGlobal } from '@/utilities/getGlobals'
// import Link from 'next/link'
import React from 'react'
import Image from "next/image";

import type { Footer } from '@/payload-types'

// import { ThemeSelector } from '@/providers/Theme/ThemeSelector'
// import { CMSLink } from '@/components/Link'

export async function Footer() {
  const footer: Footer = await getCachedGlobal('footer')()

  const navItems = footer?.navItems || []

  return (
    // <footer className="border-t border-border bg-black dark:bg-card text-white">
    //   <div className="container py-8 gap-8 flex flex-col md:flex-row md:justify-between">
    //     <Link className="flex items-center" href="/">
    //       <picture>
    //         <img
    //           alt="Payload Logo"
    //           className="max-w-[6rem] invert-0 w-full"
    //           src="https://raw.githubusercontent.com/payloadcms/payload/main/packages/ui/src/assets/payload-logo-light.svg"
    //         />
    //       </picture>
    //     </Link>

    //     <div className="flex flex-col-reverse items-start md:flex-row gap-4 md:items-center">
    //       <ThemeSelector />
    //       <nav className="flex flex-col md:flex-row gap-4">
    //         {navItems.map(({ link }, i) => {
    //           return <CMSLink className="text-white" key={i} {...link} />
    //         })}
    //       </nav>
    //     </div>
    //   </div>
    // </footer>
    <footer>
    <div className="flex flex-col items-center px-20 pb-16 mt-24 w-full bg-zinc-100 bg-opacity-90 max-md:px-5 max-md:mt-10 max-md:max-w-full">
      <div className="flex flex-col max-w-full w-[645px] max-md:w-full">
        {/* Title */}
        <div className="self-center text-4xl tracking-tighter leading-snug text-center text-black pt-10 font-semibold">
          Join the Mailing List
        </div>

        {/* Input and Button */}
        <div className="flex flex-wrap mt-11 w-full leading-snug max-md:mt-10 max-md:max-w-full">
          {/* Email Input */}
          <input
            type="email"
            placeholder="Email Address"
            className="flex-auto gap-6 self-stretch py-2 pr-3.5 pl-3.5 text-3xl tracking-tighter bg-white rounded-md border border-black border-solid min-h-[55px] text-zinc-400 max-md:w-full max-md:mb-4"
          />

          {/* Join Button */}
          <button className="gap-6 self-stretch px-9 py-3 text-2xl font-bold tracking-tight text-white whitespace-nowrap bg-black rounded-md min-h-[57px] max-md:px-5 max-md:w-full">
            Join
          </button>
        </div>

        {/* Social Media Icons */}
        <div className="flex gap-3 self-center mt-7 ml-6 max-w-full w-[102px]">
          <button>
            <Image
              src="/icons/tiktok.svg"
              alt="TikTok"
              width={32}
              height={32}
              className="object-contain shrink-0 aspect-[0.94]"
            />
          </button>
          <button>
            <Image
              src="/icons/instagram.svg"
              alt="Instagram"
              width={32}
              height={32}
              className="object-contain shrink-0 aspect-[0.94]"
            />
          </button>
        </div>

        {/* Acknowledgement Text */}
        <div>
          <p className="text-black mt-10 text-center text-sm max-md:text-xs font-inter">
            We acknowledge the traditional custodians of the land On which we live, work and play, and  pay  respects to all Elders past and present, and emerging
          </p>
        </div>
      </div>
    </div>
    </footer>
  )
}
