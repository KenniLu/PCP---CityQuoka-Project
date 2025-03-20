'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import SignUpOrLogIn from '../SignupOrLogin'

const HomeAuthSection = () => {
  const { data: session } = useSession()
  if (session?.user) {
    return null
  }
  return (
    <div className="px-1" id="signup-or-login">
      <div className="relative bg-quokka-yellow w-full max-w-[1122px] mx-auto px-2 sm:px-4 pt-10 pb-10 text-center">
        {/* Top floating button */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <button className="w-[235px] h-[48px] flex-shrink-0 rounded-lg border-4 border-white border-solid bg-black text-quokka-yellow font-bold text-base">
            SIGN UP / LOG-IN
          </button>
        </div>
        <div className="grid gap-4">
          <SignUpOrLogIn>
            <h2 className="text-black text-2xl leading-snug px-4 sm:px-[90px] font-medium">
              Unlock Your Sydney!
            </h2>

            <div>
              <h3 className="text-black">
                Log in to get personalised recommendations, save your favourites,
              </h3>
              <h3 className="text-black">
                and be the first to know about upcoming events, special offers, and more..
              </h3>
            </div>
          </SignUpOrLogIn>
        </div>
      </div>
    </div>
  )
}

export default HomeAuthSection
