import React from 'react'
import Image from 'next/image'

export const Logo = () => {
  return (
    /* eslint-disable @next/next/no-img-element */
    <div className="flex justify-center w-full py-6 sm:py-8">
      <Image
        className="object-contain self-center max-w-full aspect-[3.37]"
        src="/logo.svg"
        alt="CityQuokka"
        width={300}
        height={0}
      />
    </div>
  )
}
