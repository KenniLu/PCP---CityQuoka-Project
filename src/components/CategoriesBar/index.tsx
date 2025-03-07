'use client'
import React, { useState } from 'react'
// import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const CategoriesBar = () => {
  const [selectedButton, setSelectedButton] = useState('')
  const pathname = usePathname()

  const getFontWeight = (buttonName) => {
    // return selectedButton === buttonName || currentPath === buttonName ? "font-bold" : "font-normal";
    // return 'font-bold underline'
    return 'font-normal'
  }

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName)
  }

  return (
    <div className="max-w-[1120px] mx-auto w-full">
      <div className="flex justify-center w-full mb-4">
        <div className="max-w-[1120px] h-[40px] flex items-center justify-center w-full">
          <div className="flex flex-nowrap gap-9 items-center">
            <p className="text-xl text-white hidden sm:block">|</p>

            {/* Nightlife Button */}
            <Link href="/cityguide/nightlife">
              <button
                className={`my-auto whitespace-nowrap flex items-center gap-2 ${getFontWeight('nightlife')} text-xl`}
                // style={{ fontFamily: 'Inter', fontSize: '18px' }}
                onClick={() => handleButtonClick('nightlife')}
              >
                {/* <img src={nightlife} alt="nightlife icon" className="w-5 h-5" /> */}
                <span className="hidden sm:inline-block">Nightlife</span>
              </button>
            </Link>
            <p className="text-xl text-white hidden sm:block">|</p>

            {/* Sport Button */}
            <Link href="/cityguide/sport">
              <button
                className={`my-auto whitespace-nowrap flex items-center gap-2 ${getFontWeight('sport')}  text-xl`}
                // style={{ fontFamily: 'Inter', fontSize: '18px' }}
                onClick={() => handleButtonClick('sport')}
              >
                {/* <img src={sport} alt="sport icon" className="w-5 h-5" /> */}
                <span className="hidden sm:inline-block">Sport</span>
              </button>
            </Link>
            <p className="text-xl text-white hidden sm:block">|</p>

            {/* Markets Button */}
            <Link href="/cityguide/markets">
              <button
                className={`my-auto whitespace-nowrap flex items-center gap-2 ${getFontWeight('markets')}  text-xl`}
                // style={{ fontFamily: 'Inter', fontSize: '18px' }}
                onClick={() => handleButtonClick('markets')}
              >
                {/* <img src={markets} alt="markets icon" className="w-5 h-5" /> */}
                <span className="hidden sm:inline-block">Markets</span>
              </button>
            </Link>
            <p className="text-xl text-white hidden sm:block">|</p>

            {/* Entertainment Button */}
            <Link href="/cityguide/entertainment">
              <button
                className={`my-auto whitespace-nowrap flex items-center gap-2 ${getFontWeight('entertainment')} text-xl`}
                // style={{ fontFamily: 'Inter', fontSize: '18px' }}
                onClick={() => handleButtonClick('entertainment')}
              >
                {/* <img src={entertainment} alt="entertainment icon" className="w-5 h-5" /> */}
                <span className="hidden sm:inline-block">Entertainment</span>
              </button>
            </Link>
            <p className="text-xl text-white hidden sm:block">|</p>

            {/* Article Button */}
            <Link href="/cityguide/article">
              <button
                className={`my-auto whitespace-nowrap flex items-center gap-2 ${getFontWeight('article')}  text-xl`}
                // style={{ fontFamily: 'Inter', fontSize: '18px' }}
                onClick={() => handleButtonClick('article')}
              >
                {/* <img src={art} alt="art icon" className="w-5 h-5" /> */}
                <span className="hidden sm:inline-block">Article</span>
              </button>
            </Link>
            <p className="text-xl text-white hidden sm:block">|</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoriesBar
