import React from 'react'

import { SessionMenu } from '@/components/SessionMenu'
import { Logo } from '@/components/Logo/Logo'

export const HeaderClient: React.FC = () => {

  return (
    <div className="flex flex-col w-full bg-white pt-6 mb-4">
      <div className="flex flex-col self-center w-full max-w-4xl mx-auto lg:max-w-6xl xl:max-w-7xl px-3">
        <SessionMenu />
        <Logo />
        <div className="w-full h-[4px] bg-[#EFEFEF]"></div>
      </div>
    </div>
  )
}
