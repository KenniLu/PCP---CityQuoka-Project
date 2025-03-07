'use client'

import React, { Fragment } from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
// const pathname = usePathname()
// import { SearchIcon } from 'lucide-react'

export const HeaderNav: React.FC<{ header: HeaderType }> = ({ header }) => {
  const navItems = header?.navItems || []
  // const router = useRouter()
  const pathname = usePathname()
  return (
    <div className="flex justify-center items-center gap-2 sm:gap-9 mt-2 text-lg sm:text-xl leading-snug text-black font-normal sm:font-medium flex-wrap sm:flex-nowrap">
      {navItems.map(({ link }, i) => {
        return (
          <Fragment key={`headerNav${i}`}>
            {i !== 0 && <p className="text-2xl sm:text-4xl">|</p>}
            <CMSLink
              key={i}
              {...link}
              appearance="inline"
              className={`px-2 whitespace-nowrap ${
                ( pathname === link.url || ( link.url === '/home' && pathname == '/' ) ) ? 'font-bold' : 'font-normal'
              }`}
            />
          </Fragment>
        )
      })}
    </div>
  )
}
