import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'
import { PathActivatedLink } from '@/components/PathActivatedLink'
import Link from 'next/link'

import type { Header } from '@/payload-types'

export async function CityGuideNavBar() {
  const header: Header = await getCachedGlobal('header', 1)()

  return (
    <div className="max-w-[1120px] mx-auto w-full bg-[#EFEFEF]">
      <div className="flex justify-center w-full">
        <div className="max-w-[1120px] h-[40px] flex items-center justify-center w-full">
          <div className="flex flex-nowrap gap-9 items-center">
            {(header?.navItems || []).map((navItem, indx) => (
              <>
              { indx === 0 ? null : <p className="text-lg text-[#FFFFFF] hidden sm:block">|</p>}
                <PathActivatedLink pathMatch={navItem.link.url!} exactMatch={false}>
                  <Link href={navItem.link.url!}>
                    <button
                      className={`my-auto whitespace-nowrap flex items-center gap-2 text-lg`}
                      // style={{ fontFamily: 'Inter', fontSize: '18px' }}
                      // onClick={() => handleButtonClick('nightlife')}
                    >
                      {/* <img src={nightlife} alt="nightlife icon" className="w-5 h-5" /> */}
                      <span className="hidden sm:inline-block">{navItem.link.label!}</span>
                    </button>
                  </Link>
                </PathActivatedLink>
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
