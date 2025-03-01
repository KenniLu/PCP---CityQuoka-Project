import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export const Logo = () => {
  return (
    /* eslint-disable @next/next/no-img-element */
    <div className="flex justify-center w-full py-6 sm:py-8">
      <Link href="/">
        <Image
          className="object-contain self-center max-w-full aspect-[3.37]"
          src="/icons/logo.svg"
          alt="CityQuokka"
          width={300}
          height={0}
        />
      </Link>
    </div>
  )
}
